# Remote Connection — Feature Spec

## Overview

Users connect a local next-vibe instance to a cloud instance (e.g. unbottled.ai). Once connected:

- **Memories sync** bidirectionally (shared memories only, hash-first diffing)
- **Cloud AI discovers and executes local tools** via the capability snapshot
- **Local AI discovers and executes cloud tools** via the same mechanism
- **Connections are identified** by a user-chosen `instanceId` (e.g. `hermes`)

---

## Connection Lifecycle

### Connect (local → cloud)

User provides: `instanceId`, `friendlyName`, `remoteUrl`, `email`, `password`.

Local steps:

1. Reject if `instanceId` already in use locally (CONFLICT)
2. SSRF-protect `remoteUrl` (reject private/loopback IPs)
3. Bootstrap `leadId` — GET remote root, extract from `Set-Cookie`
4. Remote login — POST email/password to remote `/user/public/login`, extract JWT
5. Register on remote — POST `instanceId + localUrl` to remote `/user/remote-connection/register`
6. Store locally: `remoteUrl`, `token`, `leadId`, `localUrl=null`
7. Enable `DEFAULT_REMOTE_TOOL_IDS` prefixed with `instanceId` in user's tool settings

Cloud `register` steps:

1. Reject if `instanceId` already registered for this user (CONFLICT 409)
2. Store cloud-side record: `token=null`, `localUrl` set
3. Upsert cloud's own self-identity record (`token="self"` sentinel) so `getLocalInstanceId()` resolves

### Per-instance CRUD

All require `CUSTOMER` or `ADMIN`.

- **GET** `/user/remote-connection/[instanceId]` — `isConnected`, `friendlyName`, `remoteUrl`, `isActive`, `lastSyncedAt`
- **PATCH** `/user/remote-connection/[instanceId]` — rename (`friendlyName`)
- **DELETE** `/user/remote-connection/[instanceId]` — clears locally, then fire-and-forget DELETE to cloud

**List** `/user/remote-connection/list` — all connections for the current user, sorted by `updatedAt`. Requires `CUSTOMER` or `ADMIN`.

### Token refresh

On 401, connection marked `isActive: false`. Sync cron skips inactive connections. User must reconnect manually (re-run connect). Full auto re-auth not yet implemented.

---

## Sync Protocol

One round trip per minute via the pulse cron. Local pulls from cloud, sending its current state hashes. Cloud diffs and returns only what changed. Hashes are stored columns updated on every relevant write — never recomputed from full scans at sync time.

### Request (local → cloud, POST `/system/unified-interface/tasks/task-sync`)

```json
{
  "instanceId": "hermes",
  "memoriesHash": "sha256:abc...",
  "capabilitiesVersion": "git-sha-abc",
  "capabilitiesJson": [...],
  "taskCursor": "2026-03-07T12:00:00Z"
}
```

### Response (cloud → local)

```json
{
  "memoriesHash": "sha256:xyz...",
  "memories": "[...]",
  "remoteCapabilitiesVersion": "git-sha-xyz",
  "capabilities": "[...]",
  "tasks": "[...]",
  "memoriesSynced": 3
}
```

Cloud returns `null` for memories/capabilities if hashes/versions match — one tiny request when nothing changed.

### Cursor and hash maintenance

Stored on `user_remote_connections`, updated on write:

- `memoriesHash` — SHA256 of sorted `id:updatedAt` pairs for all shared (+ tombstoned) memories
- `remoteMemoriesHash` — the remote's hash received in last sync response
- `capabilitiesVersion` — local build version sent to cloud; cloud stores it per connection
- `taskCursor` — ISO timestamp; tasks created after this are fetched. `null` = first sync (fetches from epoch)

On 401 during sync: `isActive` set to `false`, connection skipped until user reconnects.

### Indexes required

- `user_remote_connections(userId, isActive)` — cron fetches active connections
- `memories(userId, isShared, updatedAt)` — hash recompute on write
- `cron_tasks(targetInstanceId, createdAt, status)` — task cursor query

---

## Memory Sync

**Key:** memory `id` (UUID) is the sync key.

**Scope:** only `isShared: true` memories. Private memories never leave local.

**Semantics:** last-writer-wins by `id + updatedAt`. Incoming records older than stored `updatedAt` are silently ignored. Idempotent on retry.

**Deletes:** tombstones (`isShared: false`, `updatedAt` bumped, `metadata.syncId` set). Kept indefinitely so deletion propagates after offline gaps.

**Hash:** SHA256 of all shared memory `id:updatedAt` pairs sorted by `id`. Includes tombstones. Recomputed and stored on every shared memory write.

---

## Capability Sync

Capabilities are **generated at build time** per locale × user role:

```
src/app/api/[locale]/system/generated/
  remote-capabilities/
    en/
      public.ts
      customer.ts
      admin.ts
    de/ pl/ ...
    version.ts    ← build version string (git SHA / package version)
```

Each file exports `RemoteToolCapability[]`. Generator runs as part of `generate-all`.

### Capability entry shape

```ts
{
  toolName: string; // canonical tool ID (e.g. "ssh_exec_POST")
  title: string; // pre-translated
  description: string; // pre-translated
  fields: JsonObject; // serialized definition fields
  executionMode: "via-execute-route";
  isAsync: true;
  instanceId: string; // tagged at sync time by the receiving side
}
```

Role used for capability file selection comes from `userRoles` table. Admin → `admin.ts`, customer → `customer.ts`, public → `public.ts`.

---

## Remote Tool Execution

### Discovery

AI calls `help` with `instanceId: "hermes"`. Cloud reads from the stored capability snapshot for that connection and returns matching tools tagged with `instanceId`. Same `help` endpoint — remote tools are first-class.

### Execution

AI calls `execute-tool` with `toolName` + optionally `instanceId` + `callbackMode`.

Prefixed form: `"hermes__ssh_exec_POST"` → extracts `instanceId` from prefix, ignores prop.
Explicit form: `toolName="ssh_exec_POST"` + `instanceId="hermes"`.
Prefixed takes precedence.

Steps:

1. Validate `instanceId` matches active connection for this user
2. Validate bare `toolName` against stored capability snapshot (reject `tool_not_found` if missing)
3. Create one-shot cron task: `targetInstance=instanceId`, `routeId=toolName`, `taskInput` = user input + `__callbackMode`, `__threadId`, `__messageId`
4. Next pulse delivers the task to the target; target executes via local `execute-tool`

### Execution modes

**`wait`** — model blocks. Cloud polls `cronTaskExecutions` every 3 seconds for up to 60 seconds. Result returned directly as tool-result. On timeout: `{ error: "timeout", taskId }`. On failure: `{ error: ..., taskId }`.

**`task-done`** — returns `{ taskId, status: "pending" }` immediately. Result stored on arrival. Next model invocation in this thread gets a "completed background tasks" section in the system prompt (from `cronTasks + cronTaskExecutions` WHERE `__callbackMode = 'task-done' AND __threadId = threadId AND status = 'completed'`).

**`inject`** — not yet implemented. Planned: on result arrival, checks `activeStreamId` on the thread. If stream active → injects into live stream. If not → falls back to `task-done`.

Model selects mode via system prompt instructions. `isLongRunning: true` tools default to `inject` (falls back to `task-done` until inject is implemented), others default to `wait`.

---

## Remote Tool IDs

Prefixed format: `{instanceId}__{toolName}` (e.g. `hermes__ssh_exec_POST`).

Double underscore is the separator — unambiguous since local tool IDs only use single underscores. Raw `toolName` in capability entries never has a prefix.

### Default sets (in `agent/chat/constants.ts`)

```ts
// Enabled by default when a remote instance connects
DEFAULT_REMOTE_TOOL_IDS = [
  "agent_claude-code_POST",
  "system_unified-interface_tasks_cron_tasks_GET",
  "system_unified-interface_tasks_cron_tasks_POST",
  "ssh_exec_POST",
  "ssh_files_read_GET",
  "ssh_files_write_POST",
  "agent_chat_memories_GET",
  "agent_chat_memories_create_POST",
];

// Pinned by default — none (user promotes via tool settings)
DEFAULT_REMOTE_PINNED_IDS = [];
```

On connect, DEFAULT_REMOTE_TOOL_IDS prefixed with `instanceId` are written to the user's `allowedTools` setting.

---

## Remote Tool UI

**Default renderer:** field-driven auto-renderer from stored `fields`. No round trip to local, always available.

**Rich UI (VibeFrame):** when `localUrl` is set and reachable, renders via `VibeFrameHost` iframe pointing at `localUrl`. Falls back to field-driven renderer silently if unreachable.

---

## DB Schema (user_remote_connections)

| Column              | Type         | Notes                                              |
| ------------------- | ------------ | -------------------------------------------------- |
| id                  | UUID         | Primary key                                        |
| userId              | UUID FK      | Cascades on delete                                 |
| instanceId          | text         | User-chosen (e.g. "hermes", "raspi")               |
| friendlyName        | text         | Display name                                       |
| remoteUrl           | text         | Remote instance URL                                |
| token               | text \| null | JWT from remote login; null=cloud-side; "self"=own |
| leadId              | text \| null | Cookie identity (local-side only)                  |
| localUrl            | text \| null | Local URL (cloud-side records only)                |
| isActive            | boolean      | Connection health                                  |
| lastSyncedAt        | timestamp    | Last successful sync                               |
| capabilities        | JSONB        | RemoteToolCapability[] snapshot                    |
| capabilitiesVersion | text \| null | Build version of the snapshot                      |
| memoriesHash        | text \| null | SHA256 of local shared memories                    |
| remoteMemoriesHash  | text \| null | Remote's hash (for diffing)                        |
| taskCursor          | text \| null | ISO timestamp — next sync fetches tasks after this |

Unique constraint: `(userId, instanceId)`.

---

## Failure Handling

| Failure                         | Behavior                                                      |
| ------------------------------- | ------------------------------------------------------------- |
| Sync request fails              | Cursor doesn't advance, retried next tick                     |
| Duplicate memory delivery       | Idempotent via `id + updatedAt`, older records ignored        |
| Tool execution error            | Result returned as `{ error, taskId }`, same shape as success |
| Instance unreachable (sync)     | Skipped, retried next tick                                    |
| Token expiry (401)              | `isActive: false`, cron skips. User must reconnect manually   |
| Tool not in capability snapshot | Rejected immediately, no remote contact                       |
| VibeFrame unreachable           | Falls back to field-driven renderer silently                  |
| wait mode timeout               | Returns `{ error: "timeout", taskId }` after 60s              |

---

## Security

- All cross-instance calls use stored JWT (scoped to one user, one connection)
- `register` requires authenticated session — login first
- Capabilities generated per role at build time — remote user only receives tools they can access
- Role used for capability selection: `userRoles` table lookup (admin > customer > public)
- Remote tool execution re-validates `toolName` against stored snapshot before creating task
- SSRF protection on `remoteUrl` at connect time (rejects private/loopback IPs)
- VibeFrame token passed via existing secure postMessage bridge
