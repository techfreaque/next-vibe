# Remote Connection — Implementation Guide

Connects a local next-vibe instance to a cloud instance so the cloud AI can discover and execute local tools, memories sync bidirectionally, and local AI can reach cloud tools.

---

## How It Works

```
Local instance (e.g. "hermes")          Cloud (unbottled.ai)
─────────────────────────────           ────────────────────
connect → login → register              stores localUrl, instanceId
pulse (every 60s) → task-sync POST  →  diffs hashes, returns changes
                                   ←   memories diff, capabilities, tasks
execute-tool (remote) →             →  creates cron task
                                   ←  { taskId, status:"pending" }
next pulse → target executes task
result stored in cronTaskExecutions
wait mode: cloud polls result           task-done: next AI turn sees result
```

---

## Endpoints

All require `CUSTOMER` or `ADMIN` unless noted.

| Method | Path                                        | What it does                                                             |
| ------ | ------------------------------------------- | ------------------------------------------------------------------------ |
| POST   | `/user/remote-connection/connect`           | Login to remote + register + enable default tools                        |
| POST   | `/user/remote-connection/register`          | Cloud-side: store local instance record (called by local during connect) |
| GET    | `/user/remote-connection/list`              | List all connections for current user                                    |
| GET    | `/user/remote-connection/[instanceId]`      | Status of one connection                                                 |
| PATCH  | `/user/remote-connection/[instanceId]`      | Rename (`friendlyName`)                                                  |
| DELETE | `/user/remote-connection/[instanceId]`      | Disconnect (local delete + async cloud notification)                     |
| POST   | `/system/unified-interface/tasks/task-sync` | Hash-first sync (called by pulse cron, not users)                        |

CLI aliases: `remote-connect`, `remote-connections`, `remote-status`, `remote-rename`, `remote-disconnect`.

---

## Connect Flow (code path)

```
connect/repository.ts → connectToRemote()
  1. DB collision check (instanceId unique per user)
  2. SSRF validation (rejects private/loopback IPs)
  3. GET remoteUrl → extract leadId from Set-Cookie
  4. POST /user/public/login → extract JWT token from Set-Cookie
  5. POST /user/remote-connection/register → { registered: true }
  6. upsertRemoteConnection() → stores token, leadId, remoteUrl
  7. Adds DEFAULT_REMOTE_TOOL_IDS (prefixed) to user's allowedTools setting
  8. invalidateInstanceIdCache()
```

On 409 from cloud register: returns CONFLICT to user ("instanceId already in use on remote").

---

## Sync Flow (code path)

```
tasks/task-sync/pull/task.ts (pulse cron, every 60s)
  → getAllActiveConnectionsForSync()   ← one DB read, all active connections
  → for each connection:
      pullFromRemote(conn)
        1. Determine role → load matching capability file (admin/customer/public)
        2. POST task-sync with: instanceId, memoriesHash, capabilitiesVersion,
                                capabilitiesJson (only if version changed),
                                taskCursor
        3. On 401: touchLastSynced(..., { isActive: false }) → skip next ticks
        4. Diff response:
           - memories != null → upsertMemories()
           - capabilities != null → store snapshot + update capabilitiesVersion
           - tasks != [] → upsertRemoteTasks() → insert/update cron_tasks
        5. Advance cursor: touchLastSynced(..., { taskCursor: now })
```

Cloud-side handler (`task-sync/repository.ts → syncTasks()`):

- Looks up connection by `userId + instanceId + isActive`
- Compares incoming hashes against stored values
- Returns only what changed; stores incoming capabilities + memoriesHash

---

## Remote Tool Execution (code path)

```
execute-tool/repository.ts → RouteExecuteRepository.execute()
  1. Parse toolName: "hermes__ssh_exec_POST" → instanceId="hermes", tool="ssh_exec_POST"
  2. getCapabilities(userId, instanceId) → validate toolName in snapshot
  3. Insert cronTask: targetInstance=instanceId, routeId=toolName,
                      taskInput = { ...input, __callbackMode, __threadId, __messageId }
  4a. callbackMode="wait":
      Poll cronTaskExecutions every 3s, up to 60s
      Completed → return { result, taskId }
      Failed    → return { result: { error, taskId } }
      Timeout   → return { result: { error: "timeout", taskId } }
  4b. callbackMode="task-done":
      Return { taskId, status: "pending" } immediately
      Next model turn: builder.ts fetches completed task-done results for threadId
      → appears in system prompt as "Background tasks completed" section
  4c. callbackMode="inject":
      Not yet implemented — falls back to task-done behaviour
```

---

## Capability Files

Generated at build time by `generate-all`. One file per locale × role:

```
src/app/api/[locale]/system/generated/remote-capabilities/
  en/admin.ts      → RemoteToolCapability[]
  en/customer.ts
  en/public.ts
  version.ts       → export const CAPABILITIES_VERSION = "..."
```

Role selected via `userRoles` table lookup: admin → `admin.ts`, customer → `customer.ts`, else `public.ts`.

To regenerate after adding/changing endpoints:

```bash
vibe generate-all
```

---

## Default Tool Sets

Defined in `agent/chat/constants.ts`:

```ts
// Enabled (available) by default when a remote instance connects
DEFAULT_REMOTE_TOOL_IDS; // CLAUDE_CODE, CRON_LIST, CRON_CREATE, SSH_EXEC,
// SSH_FILES_READ, SSH_FILES_WRITE, MEMORY_LIST, MEMORY_ADD

DEFAULT_REMOTE_PINNED_IDS; // [] — empty, user promotes via tool settings
```

Written to the user's `allowedTools` chat setting at connect time, prefixed with `instanceId`.

---

## DB Table

`user_remote_connections` — one row per user per instance.

Key columns:

| Column              | Notes                                                    |
| ------------------- | -------------------------------------------------------- |
| token               | JWT (local-side); null (cloud-side); "self" (own record) |
| localUrl            | Set on cloud-side records (tells cloud where local is)   |
| taskCursor          | ISO timestamp; null = first sync                         |
| memoriesHash        | Local's hash of shared memories                          |
| remoteMemoriesHash  | Remote's hash from last sync response                    |
| capabilitiesVersion | Build version of last-sent capabilities                  |
| capabilities        | RemoteToolCapability[] snapshot                          |
| isActive            | false after 401; user must reconnect                     |

---

## Adding New Remote-Capable Endpoints

1. Add `aliases: ["your-alias"]` to the endpoint definition
2. Create `constants.ts` with `export const YOUR_ALIAS = "your-alias" as const`
3. Add to `DEFAULT_REMOTE_TOOL_IDS` in `agent/chat/constants.ts` if it should be on by default
4. Run `vibe generate-all` to regenerate the capabilities file

---

## Known Limitations / Not Yet Implemented

- **`inject` mode**: falls back to `task-done`. Needs `activeStreamId` on thread + live stream injection.
- **Token auto-refresh on 401**: marks `isActive: false`, requires manual reconnect. Auto re-auth planned.
- **VibeFrame rich UI**: field-driven auto-renderer works; VibeFrame rich UI deferred.
