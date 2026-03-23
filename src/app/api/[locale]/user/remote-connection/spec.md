# Remote Connection - Feature Spec

## Overview

Connects a local next-vibe instance to a cloud instance (e.g. unbottled.ai). Once connected: memories sync bidirectionally (shared only, hash-first diffing), both AIs discover and execute each other's tools via capability snapshots, and task results flow back to the originating thread via `resume-stream` reviving the AI stream. Connections are identified by a user-chosen `instanceId` (e.g. `hermes`).

---

## Reachability Model

**Asymmetric**: cloud always reachable; local may be behind NAT.

| Direction                            | Mechanism                            | Fallback                                           |
| ------------------------------------ | ------------------------------------ | -------------------------------------------------- |
| Local → Cloud (sync, tasks, results) | Direct HTTP                          | None needed                                        |
| Cloud → Local (task delivery)        | `tasks` array in task-sync response  | -                                                  |
| Cloud → Local (result push)          | Direct POST to stored `localUrl`     | Result stays in cloud DB; local reads on next pull |
| Local → Cloud (task delivery)        | `outboundTasks` in task-sync request | -                                                  |

- Local **always initiates** - pulls from cloud via pulse cron (every 60s)
- Cloud **pushes results to local** via `localUrl`; if unreachable, local reads on next pull

---

## Connection Lifecycle

### Connect (local → cloud)

User provides: `instanceId`, `friendlyName`, `remoteUrl`, `email`, `password`.

1. Reject if `instanceId` already in use locally (CONFLICT)
2. SSRF-protect `remoteUrl` (reject private IPs unless dev)
3. Bootstrap `leadId` - GET remote root, extract from `Set-Cookie`
4. Remote login - POST email/password, extract JWT
5. Register on remote - POST `instanceId + localUrl` to `/user/remote-connection/register`
6. Store locally: `remoteUrl`, `token`, `leadId`, `remoteInstanceId`
7. Enable `DEFAULT_REMOTE_TOOL_IDS` prefixed with `instanceId` in user's tool settings
8. Invalidate `getLocalInstanceId()` cache

Cloud `register`:

1. Reject if `instanceId` already registered for this user (CONFLICT 409)
2. Store: `token=null`, `localUrl`, `instanceId="hermes"`
3. Upsert own self-identity record (`token="self"`) so `getLocalInstanceId()` resolves
4. Return `{ registered: true, remoteInstanceId: "thea" }` - local stores as `remoteInstanceId`

**`remoteInstanceId`** - what the cloud calls itself. Used by system prompt builder and by `pullFromRemote` to select outbound tasks for this connection.

### CRUD

All require `CUSTOMER` or `ADMIN`. GET/PATCH/DELETE at `/user/remote-connection/[instanceId]`.

- **GET** - `isConnected`, `friendlyName`, `remoteUrl`, `isActive`, `lastSyncedAt`
- **PATCH** - rename (`friendlyName`)
- **DELETE** - clears locally, fire-and-forget DELETE to cloud

On 401: `isActive: false`, cron skips, user must reconnect.

---

## Sync Protocol

One round trip per minute. Local sends state hashes + pending outbound tasks; cloud diffs and returns only what changed.

### Request (local → cloud)

```
POST /system/unified-interface/tasks/task-sync
{ instanceId, memoriesHash, capabilitiesVersion, capabilitiesJson, taskCursor, outboundTasks }
```

`outboundTasks` - `SyncedCronTask[]` where `targetInstance = remoteInstanceId` and `lastExecutionStatus IS NULL`.

### Response (cloud → local)

```
{ memoriesHash, memories, remoteCapabilitiesVersion, capabilities, tasks, serverTime }
```

`tasks` - `SyncedCronTask[]` targeting `instanceId="hermes"`. `null` for memories/capabilities when hashes/versions match.

### Cloud-side handler

1. Auth → resolve connection record
2. Upsert `outboundTasks` via `upsertRemoteTasks()`
3. Store `capabilitiesJson` if version changed
4. Diff memories hash → return payload if changed
5. Return tasks created after `taskCursor` where `targetInstance = instanceId`
6. Return response with `serverTime`

### Cursors and hashes

- `memoriesHash` - SHA256 of sorted `id:updatedAt` pairs (shared + tombstones)
- `capabilitiesVersion` - local build version; cloud stores per connection
- `taskCursor` - ISO timestamp; advanced to `serverTime` each sync. `null` = fetch from epoch

---

## Memory Sync

Key: memory `id` (UUID). Scope: `isShared: true` only. Semantics: last-writer-wins by `updatedAt`. Deletes via tombstones (`isShared: false`, `updatedAt` bumped). Hash includes tombstones.

---

## Capability Sync

Generated at build time per locale × role into `src/app/api/[locale]/system/generated/remote-capabilities/{locale}/{role}.ts`. Role selected from `userRoles` (admin > customer > public). Generator runs via `generate-all`.

Entry shape: `{ toolName, title, description, fields, executionMode: "via-execute-route", isAsync: true, instanceId }`.

---

## Remote Tool Execution

### Discovery

AI calls `help` with `instanceId: "hermes"`. Returns tools from stored capability snapshot tagged with `instanceId`.

### Execution

Prefixed form: `"hermes__ssh_exec_POST"` → `instanceId="hermes"`, `toolName="ssh_exec_POST"`. Explicit form: `toolName + instanceId` props. Prefix takes precedence.

Steps:

1. Parse `instanceId` from prefix or prop
2. Normalize `toolName` via `getPreferredName()` (alias → canonical)
3. Validate capability snapshot exists - reject fail-closed if missing
4. Validate `toolName` in snapshot - reject `tool_not_found` if absent
5. Insert one-shot cron task: `targetInstance`, `routeId`, `runOnce=true`, `taskInput` = input + `__callbackMode`, `__threadId`, `__messageId`
6. Return `{ taskId, status: "pending" }` - stream pauses or ends per `callbackMode`

**Cloud→Local**: task in sync `tasks` → local pulse executes → `pushStatusToRemote` → POST to cloud `/report`.

**Local→Cloud**: task in `outboundTasks` → cloud pulse executes → `pushStatusToRemote` → POST to local `/report` via `localUrl` (fallback: stays in cloud DB, local reads on next pull).

---

## Callback Modes

See [`src/app/api/[locale]/agent/ai-stream/spec.md`](../../../agent/ai-stream/spec.md) for the full callbackMode spec (local + remote behavior, proposed renames, open questions).

---

## Tool Message Data Model

One `TOOL` role message per tool call. Fields in `metadata.toolCall`:

```
{
  toolCallId: string        // AI SDK tool call ID
  toolName: string          // route ID
  args: Record             // input args (set at call time)
  status: "pending" | "completed" | "failed"
  result?: ToolCallResult  // backfilled when result arrives
}
```

- Created immediately when AI fires the tool (status=`pending`)
- Backfilled in-place when result arrives: `handleTaskCompletion` writes `status` + `result` via `sortObjectKeys` (cache-stable - matches what `ToolResultHandler` would write, no AI SDK prompt cache miss)
- `streamContext.currentToolMessageId` = DB row ID of this message; set by `stream-part-handler` after `tool-call` event, before `execute()` runs. Remote tasks read this to store `__messageId` in `taskInput` so `/report` knows which row to backfill.

**UI rendering**: tool bubble shows args + status indicator. Status updates in real time via `TASK_COMPLETED` WS event carrying `toolCallMessageId`.

---

## Thread Continuation (wakeUp / wait)

1. Task completes → `pushStatusToRemote` POSTs to `/report` on originating side
2. `/report` calls `handleTaskCompletion`:
   a. Backfills tool message: `status → completed`, injects result (cache-stable via `sortObjectKeys`)
   b. Emits `TASK_COMPLETED` WS event (UI updates tool bubble)
   c. Schedules `resume-stream` one-shot cron task (`runOnce=true`, `userId` = task owner) with `taskInput: { threadId, modelId, characterId }`
3. `resume-stream` fires on next pulse:
   - `isStreaming=true` → result already in DB, live loop picks it up - no-op
   - `isStreaming=false` → `runHeadlessAiStream(threadMode:"append", threadId)` - finds last message in thread, uses `answer-as-ai` operation to continue. AI sees backfilled tool result in history and responds naturally.

**modelId + characterId flow**: `execute-tool/repository.ts` stores them in `taskInput` → `handleTaskCompletion` reads and forwards to `resume-stream` task.

---

## Remote Tool IDs

Format: `{instanceId}__{toolName}`. Double underscore is unambiguous (local IDs use single underscores). Capability entries store bare `toolName` without prefix.

Default tools on connect (from `agent/chat/constants.ts`): `agent_claude-code_POST`, cron list/create, `ssh_exec_POST`, ssh read/write, memories GET/create - all prefixed with `instanceId`.

---

## Remote Tool UI

**Default:** field-driven auto-renderer from stored `fields`. Always available, no round trip.
**Rich (VibeFrame):** `VibeFrameHost` iframe at `localUrl` when reachable. Silent fallback to field renderer.

---

## DB Schema (user_remote_connections)

| Column              | Type       | Notes                                       |
| ------------------- | ---------- | ------------------------------------------- |
| id                  | UUID       | PK                                          |
| userId              | UUID FK    | Cascade delete                              |
| instanceId          | text       | User-chosen (e.g. "hermes")                 |
| friendlyName        | text       | Display name                                |
| remoteUrl           | text       | Remote base URL                             |
| token               | text\|null | JWT; `null`=cloud-side; `"self"`=own record |
| leadId              | text\|null | Cookie identity (local-side)                |
| localUrl            | text\|null | Local URL (cloud-side records)              |
| remoteInstanceId    | text\|null | Cloud's self-name (e.g. "thea"; local-side) |
| isActive            | boolean    | false after 401                             |
| lastSyncedAt        | timestamp  | Last successful sync                        |
| capabilities        | JSONB      | `RemoteToolCapability[]` snapshot           |
| capabilitiesVersion | text\|null | Build version of snapshot                   |
| memoriesHash        | text\|null | SHA256 of local shared memories             |
| remoteMemoriesHash  | text\|null | Remote's last known hash                    |
| taskCursor          | text\|null | ISO timestamp for task fetch window         |

Unique: `(userId, instanceId)`. Sentinel: `token="self"` = cloud's own identity record.

---

## Failure Handling

| Failure                     | Behavior                                                                        |
| --------------------------- | ------------------------------------------------------------------------------- |
| Sync request fails          | Cursor doesn't advance; retried next tick                                       |
| Duplicate memory delivery   | Ignored via `id + updatedAt` LWW                                                |
| Tool execution error        | Stored in `cronTaskExecutions`; `TASK_COMPLETED` fires with `status:"failed"`   |
| Instance unreachable (sync) | Skipped; retried next tick                                                      |
| Token expiry (401)          | `isActive: false`; user must reconnect                                          |
| Tool not in snapshot        | Rejected immediately                                                            |
| Snapshot missing            | Rejected fail-closed                                                            |
| VibeFrame unreachable       | Silent fallback to field renderer                                               |
| `localUrl` unreachable      | Result stays in cloud DB; local reads on next pull, then emits `TASK_COMPLETED` |

---

## Security

- Cross-instance calls use stored JWT (scoped per user + connection)
- `register` requires authenticated session
- Capabilities generated per role at build time
- Snapshot validated before every remote task creation (fail-closed)
- `toolName` validated against snapshot before task creation
- SSRF protection on `remoteUrl` at connect time
- VibeFrame uses existing secure postMessage bridge
- `localUrl` stored server-side only; never exposed to client
