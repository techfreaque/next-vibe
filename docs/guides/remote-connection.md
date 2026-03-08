# Remote Connection — Implementation Guide

Connects a local next-vibe instance to a cloud instance so both AIs can discover and execute each other's tools, memories sync bidirectionally, and task results flow back to the originating thread.

---

## Architecture Overview

```
Local instance ("hermes")                  Cloud ("thea")
──────────────────────────                 ──────────────
connect → login → register ─────────────► stores localUrl, instanceId
pulse (every 60s) → task-sync POST ──────► diff hashes, return changes
                             ◄──────────── memories, capabilities, tasks for local
                             ◄──────────── (also: outboundTasks local wants cloud to run)

── Cloud→Local execution ────────────────────────────────────────────
Cloud AI calls tool (hermes__ssh_exec_POST)
→ execute-tool creates cronTask (targetInstance="hermes")
→ task-sync response includes the task
→ local pulse picks it up, executes
→ pulse calls pushStatusToRemote → direct HTTP POST to cloud /report
   (uses localUrl stored on cloud's DB row; falls back to queued pull if unreachable)

── Local→Cloud execution ────────────────────────────────────────────
Local AI calls tool (thea__ssh_exec_POST)
→ execute-tool creates cronTask (targetInstance="thea")
→ next pulse: outboundTasks sent in task-sync POST body
→ cloud's syncTasks upserts them into cloud DB
→ cloud pulse executes, stores result in cronTaskExecutions
→ cloud calls pushStatusToRemote → direct HTTP POST to local /report
   (uses localUrl = local's NEXT_PUBLIC_APP_URL stored at connect time)

── Thread continuation after async task ─────────────────────────────
When task completes on either side:
→ /report endpoint receives result
→ stores in cronTaskExecutions (with taskId from taskInput)
→ emits TASK_COMPLETED WS event on the originating thread's channel
→ client re-triggers AI stream (operation: "answer-as-ai", parentId = last message)
→ AI sees completed task result in system prompt ("Background tasks completed")
→ stream ends immediately — no polling, no blocking
```

---

## Reachability Model

The system uses **asymmetric connectivity**: cloud is always publicly reachable; local may or may not be.

| Direction                     | Mechanism                                 | Fallback                                             |
| ----------------------------- | ----------------------------------------- | ---------------------------------------------------- |
| Local → Cloud                 | Direct HTTP (cloud always reachable)      | None needed                                          |
| Cloud → Local (push)          | Direct HTTP to `localUrl`                 | Result queued in cloud DB, local pulls via next sync |
| Cloud → Local (task delivery) | task-sync response body                   | (primary, not a fallback)                            |
| Local → Cloud (task delivery) | `outboundTasks` in task-sync request body | (primary, not a fallback)                            |

**`pushStatusToRemote`** (called after local executes a cloud-assigned task):

- Local always has `localUrl` stored at connect time → cloud can be reached directly
- Cloud uses `localUrl` to POST result directly to local's `/report` endpoint
- If local is unreachable (offline, behind NAT), cloud queues the result; local reads it on next task-sync pull

**`pushStatusToRemote` on cloud side** (after cloud executes a local-assigned task):

- Cloud sends result directly to local's `/report` using stored `localUrl`
- Local always calls cloud, so cloud always knows local's address

---

## Endpoints

All require `CUSTOMER` or `ADMIN` unless noted.

| Method | Path                                               | What it does                                                  |
| ------ | -------------------------------------------------- | ------------------------------------------------------------- |
| POST   | `/user/remote-connection/connect`                  | Login to remote + register + write default tools              |
| POST   | `/user/remote-connection/register`                 | Cloud-side: store local record, return cloud's own instanceId |
| GET    | `/user/remote-connection/list`                     | List all connections for current user                         |
| GET    | `/user/remote-connection/[instanceId]`             | Status of one connection                                      |
| PATCH  | `/user/remote-connection/[instanceId]`             | Rename (`friendlyName`)                                       |
| DELETE | `/user/remote-connection/[instanceId]`             | Disconnect                                                    |
| POST   | `/system/unified-interface/tasks/task-sync`        | Hash-first sync (pulse cron)                                  |
| POST   | `/system/unified-interface/tasks/task-sync/report` | Receive task execution result from remote                     |
| POST   | `/system/unified-interface/tasks/complete-task`    | Manually mark a task done + push to remote                    |

CLI aliases: `remote-connect`, `remote-connections`, `remote-status`, `remote-rename`, `remote-disconnect`.

---

## Connect Flow

```
connect/repository.ts → connectRemote()
  1. SSRF guard (rejects private/loopback IPs unless NODE_ENV=development)
  2. Local collision check (instanceId unique per user, ignoring token="self")
  3. POST /user/remote-connection/register on remote →
       cloud stores: { instanceId, localUrl, token=null }
       cloud creates self-identity record (token="self") if not exists
       returns: { registered: true, remoteInstanceId: "thea" }
  4. upsertRemoteConnection() locally →
       stores: { remoteUrl, token, leadId, instanceId, remoteInstanceId }
  5. Write DEFAULT_REMOTE_TOOL_IDS (prefixed with instanceId__) to allowedTools
  6. invalidateInstanceIdCache()
```

On 409 from cloud register: returns CONFLICT ("instanceId already in use on remote").

**`remoteInstanceId`** — what the cloud calls itself (e.g. "thea"). Stored on local's DB row. Used by:

- System prompt builder: AI learns to call `execute-tool(instanceId="thea")`
- `outboundTasks`: local creates tasks with `targetInstance="thea"`, pulse sends them to cloud

---

## Sync Flow (pulse, every 60s, local only)

```
tasks/task-sync/pull/task.ts → pullFromRemote()
  For each active connection:
    1. Compute localMemoriesHash (SHA256 of shared memories, stored on connection row)
    2. Collect outboundTasks: cronTasks where targetInstance=conn.remoteInstanceId
       AND lastExecutionStatus IS NULL (not yet picked up by cloud)
    3. POST /task-sync with:
         instanceId, memoriesHash, capabilitiesVersion,
         capabilitiesJson (only if version changed),
         taskCursor (ISO timestamp of last pull),
         outboundTasks (JSON array of SyncedCronTask)
    4. On 401: mark connection inactive, skip
    5. Apply response:
         memories != null → upsertSharedMemories()
         capabilities != null → store snapshot + update capabilitiesVersion
         tasks (cloud→local tasks) → filter targetInstance=localId → upsertRemoteTasks()
    6. Advance cursor: touchLastSynced(..., { taskCursor: serverTime })
```

**Cloud-side handler** (`syncTasks()`):

1. Process `capabilitiesJson` if version changed → store snapshot
2. Process `outboundTasks` → `upsertRemoteTasks()` (cloud pulse picks them up)
3. Compute own memoriesHash, diff against local's → return memories if changed
4. Build tasks payload: cronTasks where `targetInstance=instanceId AND createdAt > cursor`
5. Return: `{ remoteMemoriesHash, memories, remoteCapabilitiesVersion, capabilities, tasks, serverTime }`

---

## Remote Tool Execution

### Cloud calls local tool

```
Cloud AI: execute-tool("hermes__ssh_exec_POST", input)
→ RouteExecuteRepository.execute()
  1. Parse "hermes__ssh_exec_POST" → instanceId="hermes", tool="ssh_exec_POST"
  2. getCapabilities(userId, "hermes") — matches by instanceId OR remoteInstanceId
  3. Validate tool in snapshot
  4. Insert cronTask: { targetInstance="hermes", routeId="ssh_exec_POST",
                        taskInput: { ...input, __callbackMode, __threadId, __messageId } }
  5. Return { taskId, status: "pending" } — stream ends immediately
→ Next local pulse: upsertRemoteTasks() inserts task into local DB
→ Local pulse executes task
→ pushStatusToRemote() → POST to cloud /report
→ /report: stores cronTaskExecution, emits TASK_COMPLETED WS event on thread channel
→ Client re-triggers AI stream ("answer-as-ai") — AI resumes with result in context
```

### Local calls cloud tool

```
Local AI: execute-tool("thea__ssh_exec_POST", input)
→ RouteExecuteRepository.execute()
  1. Parse "thea__ssh_exec_POST" → instanceId="thea", tool="ssh_exec_POST"
  2. getCapabilities(userId, "thea") — matches by remoteInstanceId="thea"
  3. Validate tool in snapshot
  4. Insert cronTask: { targetInstance="thea", routeId="ssh_exec_POST",
                        taskInput: { ...input, __callbackMode, __threadId, __messageId } }
  5. Return { taskId, status: "pending" } — stream ends immediately
→ Next pulse: pullFromRemote() sends task in outboundTasks
→ Cloud syncTasks() upserts it → cloud pulse executes
→ Cloud calls pushStatusToRemote() → POST to local /report (via localUrl)
→ /report: stores cronTaskExecution, emits TASK_COMPLETED WS event on thread channel
→ Client re-triggers AI stream ("answer-as-ai") — AI resumes with result in context
```

### Callback modes

| Mode        | Behaviour                                                                                                               | When to use                                                |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `task-done` | Return `{taskId, status:"pending"}` immediately. Stream ends. Next AI turn sees completed tasks in system prompt.       | Default for background work                                |
| `inject`    | Same as task-done, but TASK_COMPLETED WS event triggers client to re-trigger AI stream immediately after result arrives | Default for interactive tool calls — AI resumes seamlessly |
| `wait`      | **Removed** — was long-poll (blocking 60s). Now equivalent to `inject`. All remote calls are async.                     | N/A                                                        |

**Thread continuation** (for `inject` / `task-done` when user is active):

1. `/report` receives result → stores in `cronTaskExecutions`
2. `/report` reads `taskInput.__threadId` and `taskInput.__callbackMode`
3. If `callbackMode=inject`: emit `TASK_COMPLETED` WS event on `messages:{threadId}` channel
4. Client receives event → calls AI stream with `operation:"answer-as-ai"`, `parentId=lastMessageId`
5. AI system prompt builder: queries `cronTaskExecutions` for thread's completed task-done tasks
6. AI sees results, continues response

---

## Capability Files

Generated at build time by `vibe generate-all`. One file per locale × role:

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
DEFAULT_REMOTE_TOOL_IDS; // CLAUDE_CODE, CRON_LIST, CRON_CREATE, SSH_EXEC,
// SSH_FILES_READ, SSH_FILES_WRITE, MEMORY_LIST, MEMORY_ADD
DEFAULT_REMOTE_PINNED_IDS; // [] — user promotes via tool settings
```

Written to the user's `allowedTools` chat setting at connect time, prefixed with `instanceId__`.

---

## DB Table — `user_remote_connections`

One row per user per instance.

| Column                | Local-side                 | Cloud-side                              |
| --------------------- | -------------------------- | --------------------------------------- |
| `instanceId`          | "hermes" (user-chosen)     | "hermes" (the local's name)             |
| `friendlyName`        | "My Laptop"                | same                                    |
| `remoteUrl`           | "https://unbottled.ai"     | "http://localhost:3001" (= localUrl)    |
| `localUrl`            | null                       | "http://localhost:3001"                 |
| `token`               | JWT from cloud login       | null (cloud never calls local directly) |
| `leadId`              | cookie from cloud          | null                                    |
| `remoteInstanceId`    | "thea" (cloud's self-id)   | null                                    |
| `isActive`            | true / false after 401     | true                                    |
| `taskCursor`          | ISO timestamp of last pull | null                                    |
| `memoriesHash`        | local SHA256               | local SHA256                            |
| `remoteMemoriesHash`  | cloud's last hash          | null                                    |
| `capabilitiesVersion` | last LOCAL version sent    | last LOCAL version received             |
| `capabilities`        | cloud's tool snapshot      | local's tool snapshot                   |

**Special sentinel values:**

- `token="self"` — cloud's own self-identity record (so `getLocalInstanceId()` can discover "thea")
- `token=null` — cloud-side record for a local instance (cloud never initiates calls to local via JWT)

---

## Adding New Remote-Capable Endpoints

1. Add `aliases: ["your-alias"]` to the endpoint definition
2. Create `constants.ts` with `export const YOUR_ALIAS = "your-alias" as const`
3. Add to `DEFAULT_REMOTE_TOOL_IDS` in `agent/chat/constants.ts` if default-on
4. Run `vibe generate-all`

---

## Known Gaps / Planned

- **`TASK_COMPLETED` WS event**: `/report` route needs to emit this on the originating thread's WS channel so client can auto-resume the AI stream. Currently result is stored but no event is emitted.
- **Client auto-resume**: Frontend needs to handle `TASK_COMPLETED` event → call AI stream with `operation:"answer-as-ai"`.
- **`pushStatusToRemote` from cloud side**: Currently skipped when `VIBE_IS_CLOUD=true`. Cloud needs to push results to local's `/report` using stored `localUrl`, with a fallback of queuing for next pull if local is unreachable.
- **Token auto-refresh on 401**: marks `isActive: false`, requires manual reconnect. Auto re-auth planned.
