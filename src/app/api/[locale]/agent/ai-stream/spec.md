# AI Stream — callbackMode Spec

## Core Principle

The AI sees identical behavior regardless of local/remote/transport. Every mode produces the same return shape and the same revival flow. The transport (inline, HTTP, task-queue) is invisible to the AI. The only difference is timing.

---

## Remote Execution — Two Tiers

**Tier 1 — Direct HTTP** (preferred): If the remote instance has `isDirectlyAccessible=true` (set at connect time by pinging `localUrl`), the executing side calls the tool's HTTP route directly via `executeRemote()`.

**Tier 2 — Task-queue** (fallback): If `isDirectlyAccessible=false` (NAT, unreachable), create a `cron_task` with `targetInstance`. The remote picks it up on its next cron pulse (~1 min). Result arrives via `/report`.

**No polling anywhere.** `/report` → `handleTaskCompletion` is the universal result delivery mechanism for the queue path.

---

## The 5 Modes

### `wait` (default)

AI sees: tool result returned, loop continues — always.

| Transport         | Behavior                                                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Local**         | Inline execution. Result returned to AI immediately.                                                                               |
| **Remote direct** | Blocking HTTP call via `executeRemote()`. Awaits response. No 90s timer — connection is alive and waiting. Result returned inline. |
| **Remote queue**  | Task created. Stream pauses (`waitingForRemoteResult=true`), 90s timeout set. `/report` backfills result, resume-stream revives.   |

Return to AI: `{ result }` — same in all cases.

---

### `detach`

AI sees: `{ taskId, status: "pending", hint: "use wait-for-task(taskId) if you need the result" }` — always.

| Transport         | Behavior                                                                          |
| ----------------- | --------------------------------------------------------------------------------- |
| **Local**         | Inline execution (fire-and-forget). AI gets taskId immediately, stream continues. |
| **Remote direct** | HTTP call (non-blocking), AI gets taskId immediately.                             |
| **Remote queue**  | Task created, AI gets taskId immediately.                                         |

Result stored in task history only. No revival. No deferred message. AI can later call `wait-for-task(taskId)` to upgrade to wakeUp semantics.

---

### `wakeUp`

AI sees: `{ taskId, status: "pending", hint: "result will be injected when ready — do NOT call wait-for-task" }` — always.

| Transport         | Behavior                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Local**         | Inline execution (fire-and-forget). `handleTaskCompletion(WAKE_UP)` fires immediately → schedules resume-stream.    |
| **Remote direct** | HTTP call (non-blocking). Remote calls `/report` when done → `handleTaskCompletion(WAKE_UP)` → resume-stream.       |
| **Remote queue**  | Task created. Remote picks up on cron, executes, calls `/report` → `handleTaskCompletion(WAKE_UP)` → resume-stream. |

**When resume-stream fires:**

- Loop still live → pub/sub signal intercepts → `stopWhen` yields → result injected
- Loop dead → headless revival from stored `leafMessageId`

**AI context (message-converter):** for wakeUp deferred results, input args are suppressed — AI sees the result only. Input preserved in DB and shown in UI.

---

### `endLoop`

AI sees: tool result returned, then loop stops — always.

| Transport         | Behavior                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| **Local**         | Inline execution. Result to AI. Loop stops after step. AI writes final response.                    |
| **Remote direct** | Blocking HTTP call. Result to AI. Loop stops.                                                       |
| **Remote queue**  | Task created. Stream ends. Later: result backfilled, `TASK_COMPLETED` WS event. No AI continuation. |

No resume-stream for endLoop remote.

---

### `approve`

AI sees: tool blocked pending human confirmation; other parallel tools proceed — always.

| Transport            | Behavior                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| **All**              | `TOOL_WAITING` emitted. UI shows Confirm/Cancel. Other parallel tools execute normally. Loop stops after batch. |
| **Confirm + wait**   | Tool executes inline (blocking), AI turn resumes via resume-stream with result.                                 |
| **Confirm + wakeUp** | Tool executes fire-and-forget. `approve-tool` endpoint returns immediately. Revival fires when done.            |
| **Cancel**           | Tool marked cancelled, AI turn resumes.                                                                         |

AI cannot opt out if `requiresConfirmation=true` in tool settings.

---

## Tool Call Errors — Loop Always Continues

Failed tool calls never stop the loop. `tool-result-handler.ts` marks the tool as failed and returns the error as a tool result. The AI receives:

```json
{ "success": false, "message": "...", "errorType": "..." }
```

The AI decides what to do (retry, skip, explain). Consistent with `ResponseType<T>` — no throw, always a result.

---

## `wait-for-task` Tool

Works for **both** `detach` and `wakeUp` tasks:

- Task **already complete**: returns result inline. Stream continues. Cleans up task + any pending revival.
- Task **pending**: writes `callbackMode=WAKE_UP + threadId + toolMessageId` onto task row (upgrades detach to wakeUp semantics), sets `pendingTimeoutMs=90000` → stream pauses.
- On timeout (`STREAM_TIMEOUT`): stream dies cleanly. When task completes, `handleTaskCompletion(WAKE_UP)` fires revival.
- AI always sees: `{ taskId, status, result?, waiting }` — same shape for all cases.

---

## Stream Timeout (90 seconds)

Any time the stream is waiting for a remote result (queue path or `wait-for-task`):

- Set `pendingTimeoutMs=90000` on `ToolExecutionContext`
- `finish-step-handler.ts` reads this and schedules `setTimeout` → `streamAbortController.abort(new StreamAbortError(AbortReason.STREAM_TIMEOUT))`
- If result arrives before timeout: cancel the timer
- 90s covers a full cron pulse cycle
- Clean abort: no error shown to user; revival handles continuation

**Direct HTTP `wait` mode does not use this timer** — the HTTP connection itself is the timeout.

---

## Branch Tracking for Revival

Every wakeUp task stores `leafMessageId` (= `ctx.currentParentId` at tool-call time — the branch tip at the moment the tool was called).

- `execute-tool/repository.ts` and `wait-for-task/repository.ts`: store `leafMessageId` in the dedicated `wakeUpLeafMessageId` column on the task row (NOT in the `taskInput` JSON blob)
- `handleTaskCompletion` accepts `leafMessageId?: string | null` as a **first-class typed param** — callers pass it explicitly, never via `taskInput` spread
- `resumeStreamRequestSchema.parse` receives only the known routing fields (`threadId`, `callbackMode`, `modelId`, `skillId`, `favoriteId`, `leafMessageId`) — never arbitrary tool input fields
- `resume-stream/repository.ts` uses stored `leafMessageId` as the parent for the deferred message
- Falls back to latest-message query only if `leafMessageId` not set (backwards compat)

This ensures revival appends to the correct branch even if the user switched branches while the tool was running.

---

## Tool Self-Escalation (`context.escalateToTask()`)

For tools that may run >90s (SSH, claude-code, etc.):

**Fast path (default):** Tool returns within 90s → result returned normally. Zero overhead.

**Slow path (>90s):**

1. Tool calls `context.escalateToTask()` before blocking operation
2. Creates cron task row (wakeUp semantics), stores `leafMessageId`, sets `pendingTimeoutMs`
3. Tool goroutine continues running detached from HTTP scope
4. Stream dies at 90s timeout (`STREAM_TIMEOUT`)
5. Tool goroutine completes → `handleTaskCompletion(WAKE_UP)` → revival
6. AI sees deferred result injected on correct branch — identical to wakeUp mode

Tool authors only need this for operations that may exceed 90s. No overhead for fast tools.

---

## Parallel Mixed-Mode Rules

All parallel tools execute concurrently. Rules for how results land:

| Combination                  | Rule                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| `wait + wait`                | Both results returned, loop continues.                                                                  |
| `wakeUp + wakeUp`            | Both fire independently. Each schedules its own revival. Each revival is a fresh full-tool-access turn. |
| `detach + detach`            | Both fire. Neither schedules revival. AI gets two taskIds.                                              |
| `endLoop + anything`         | All parallel tools complete. Non-endLoop results returned to AI. Then loop stops.                       |
| `approve + anything`         | approve blocks only itself. Other tools execute normally. Loop stops after batch.                       |
| `wakeUp + endLoop`           | Both fire. endLoop stops loop. wakeUp revival fires later — fresh turn with full tool access.           |
| `wakeUp + approve`           | approve blocks itself, wakeUp fires. Loop stops after batch. wakeUp revival fires when result arrives.  |
| `detach + wakeUp`            | Both fire. Only wakeUp schedules revival.                                                               |
| `wait + wakeUp`              | wait returns result to AI. wakeUp fires independently, schedules revival.                               |
| `wait + endLoop`             | endLoop stops loop after step. wait result returned before stop.                                        |
| `detach + endLoop`           | endLoop stops loop. detach fires, no revival.                                                           |
| `approve + wakeUp + endLoop` | approve blocks. wakeUp fires, schedules revival. endLoop stops loop after batch.                        |

---

## Push-First Sync Architecture

When `isDirectlyAccessible=true`, cloud pushes changes to local immediately instead of waiting for local's cron pull:

- **Tasks**: after creating a task with `targetInstance`, immediately POST to local's task-sync endpoint via `executeRemote()`. On failure: fall back (task is already in DB, local pulls on next cron).
- **Memories**: on `create`/`update`/`delete`, push delta to local's task-sync endpoint fire-and-forget.
- **Capabilities**: on version bump, push updated capabilities to local immediately.

Connecting side (local) always has `pullFromRemote()` as fallback — push is opportunistic.

---

## toolMessageId — No Polling

Each `execute()` wrapper in `tools-loader.ts` injects `currentToolMessageId` from `ctx.pendingToolMessages.get(toolCallId)?.messageId` before calling execute. No shared map, no polling. By the time `execute()` is called, the `tool-call` event has already been processed and `pendingToolMessages` is populated.

---

## Related Files

| File                                               | Role                                                                  |
| -------------------------------------------------- | --------------------------------------------------------------------- |
| `ai/execute-tool/constants.ts`                     | `CallbackMode` enum + `TaskRoutingContext` type                       |
| `ai/execute-tool/repository.ts`                    | Local/remote execution paths per mode, transport routing              |
| `tasks/task-completion-handler.ts`                 | Backfill + WS event + resume-stream scheduling, reads `leafMessageId` |
| `tasks/execute/repository.ts`                      | Cron task execution + `handleTaskCompletion` call                     |
| `tasks/pulse/repository.ts`                        | Pulse loop (remote task pickup + `/report` push)                      |
| `tasks/wait-for-task/repository.ts`                | Blocks stream on pending task, upgrades detach→wakeUp                 |
| `resume-stream/repository.ts`                      | Headless AI turn (append mode), uses `leafMessageId` for branch       |
| `repository/handlers/finish-step-handler.ts`       | Reads `shouldStopLoop`, starts 90s timeout timer                      |
| `repository/handlers/tool-call-handler.ts`         | Sets `shouldStopLoop`, `requiresConfirmation`, emits `TOOL_WAITING`   |
| `repository/handlers/message-converter.ts`         | Deferred message handling in AI context, suppresses wakeUp args       |
| `repository/handlers/tool-confirmation-handler.ts` | Confirm/cancel flow, wakeUp fire-and-forget on confirm                |
| `user/remote-connection/db.ts`                     | `isDirectlyAccessible` field on `remote_connections`                  |
| `tasks/task-sync/repository.ts`                    | Pull-from-remote, push-first on `isDirectlyAccessible=true`           |
