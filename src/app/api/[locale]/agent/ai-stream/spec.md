# AI Stream - callbackMode Spec

## Core Principle

The AI sees identical behavior regardless of local/remote/transport. Every mode produces the same return shape and the same revival flow. The transport (inline, HTTP, task-queue) is invisible to the AI. The only difference is timing.

---

## Remote Execution - Two Tiers

**Tier 1 - Direct HTTP** (preferred): If the remote instance has `isDirectlyAccessible=true` (set at connect time by pinging `localUrl`), the executing side calls the tool's HTTP route directly via `executeRemote()`.

**Tier 2 - Task-queue** (fallback): If `isDirectlyAccessible=false` (NAT, unreachable), create a `cron_task` with `targetInstance`. The remote picks it up on its next cron pulse (~1 min). Result arrives via `/report`.

**No polling anywhere.** `/report` → `handleTaskCompletion` is the universal result delivery mechanism for the queue path.

---

## The 4th Stream State: `waiting`

Threads have four streaming states: `idle | streaming | aborting | waiting`.

**`waiting`** means: stream is dead but a task is still in flight. The stop button stays visible. No reasoning or content arrives until revival.

- Set when: `waitingForRemoteResult=true` + stream aborts (`REMOTE_TOOL_WAIT` reason)
- Cleared when: revival fires (`claimRevival` atomically transitions `idle|waiting` → `streaming`)
- Also cleared when: cancel is called, or task completes with no revival (endLoop remote)
- `STREAMING_STATE_CHANGED` WS event fires immediately when state → `waiting` so live clients update the stop button without a page refresh
- Persisted in DB: page refresh recovery - if thread is `waiting` on load, stop button shown immediately

---

## The 5 Modes

### `wait` (default)

AI sees: tool result returned inline, loop continues - **local only**. For remote/escalated, AI sees no result in this turn; stream aborts and revival delivers result in a new turn.

| Transport                | Behavior                                                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local**                | Inline execution. Result returned to AI immediately. Loop continues.                                                                           |
| **Remote direct**        | Blocking HTTP call via `executeRemote()`. Awaits response. Connection is alive and waiting - no timer. Result returned inline. Loop continues. |
| **Remote queue**         | `waitingForRemoteResult=true`. Stream aborts (`REMOTE_TOOL_WAIT`). Thread → `waiting`. `/report` → `handleTaskCompletion(WAIT)` → revival.     |
| **Escalated (>timeout)** | Same as remote queue path: `waitingForRemoteResult=true`, stream aborts, thread → `waiting`. Revival delivers result.                          |

**Tool message lifecycle - `wait` (remote/escalated):**

- At tool-call time: original tool message created with `status: "pending"`, content = tool input args
- While waiting: original message stays `pending`
- On `handleTaskCompletion(WAIT)`: original tool message **backfilled** - `status: "completed"` (or `"failed"`), content = actual result
- `TOOL_RESULT` WS event emitted so live clients update the message in place
- Revival fires headless stream from the original tool message as parent - AI sees result as part of its context

**No deferred message created for `wait`.** The original message is updated in place.

---

### `detach`

AI sees: `{ taskId, status: "pending", hint: "use wait-for-task(taskId) if you need the result" }` - always.

| Transport         | Behavior                                                                          |
| ----------------- | --------------------------------------------------------------------------------- |
| **Local**         | Inline execution (fire-and-forget). AI gets taskId immediately, stream continues. |
| **Remote direct** | HTTP call (non-blocking), AI gets taskId immediately.                             |
| **Remote queue**  | Task created, AI gets taskId immediately.                                         |

**Tool message:** created with `status: "pending"`. On task completion: backfilled with result, `TASK_COMPLETED` WS event. No revival. No AI continuation.

Result stored in task history only. AI can later call `wait-for-task(taskId)` to upgrade to wakeUp semantics.

---

### `wakeUp`

AI sees: `{ taskId, status: "pending", hint: "result will be injected when ready - do NOT call wait-for-task" }` - always.

| Transport         | Behavior                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Local**         | Inline execution (fire-and-forget). `handleTaskCompletion(WAKE_UP)` fires immediately → schedules resume-stream.    |
| **Remote direct** | HTTP call (non-blocking). Remote calls `/report` when done → `handleTaskCompletion(WAKE_UP)` → resume-stream.       |
| **Remote queue**  | Task created. Remote picks up on cron, executes, calls `/report` → `handleTaskCompletion(WAKE_UP)` → resume-stream. |

**Tool message lifecycle - `wakeUp`:**

- At tool-call time: original tool message created with `status: "pending"`, content = `{taskId, status:"pending"}`
- Original tool message is **never modified** after creation
- On `handleTaskCompletion(WAKE_UP)`: a **new separate deferred TOOL message** is inserted at `leafMessageId` with the actual result
- `MESSAGE_CREATED` + `TOOL_RESULT` WS events emitted for the deferred message
- `TASK_COMPLETED` WS event emitted (carries `deferredMessage` for optimistic UI)
- Revival fires headless stream from the deferred message as parent

**AI context (message-converter):** for wakeUp deferred results, input args are suppressed - AI sees the result only. Input preserved in DB and shown in UI.

**When resume-stream fires:**

- Loop still live → pub/sub signal intercepts → `stopWhen` yields → result injected
- Loop dead → headless revival from stored `leafMessageId`

---

### `endLoop`

AI sees: tool result returned, then loop stops - always.

| Transport         | Behavior                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local**         | Inline execution. Result to AI. Loop stops after step. AI writes final response. Thread → `idle` when stream ends.                                                                       |
| **Remote direct** | Blocking HTTP call. Result to AI. Loop stops. Thread → `idle`.                                                                                                                           |
| **Remote queue**  | `waitingForRemoteResult=true`. Stream aborts (`REMOTE_TOOL_WAIT`). Thread → `waiting`. On completion: result backfilled, `TASK_COMPLETED` WS event. No AI continuation. Thread → `idle`. |

**Thread stays `waiting` (stop button visible) until task completes** - even though no AI continuation fires. This tells the user the background task is still running.

**Tool message lifecycle - `endLoop` (remote queue):**

- Original tool message backfilled with result on `handleTaskCompletion`
- Additionally: a deferred TOOL message is inserted (same as wakeUp) for UI visibility
- `TASK_COMPLETED` WS event with `deferredMessage`
- No resume-stream scheduled. No AI continuation.

No resume-stream for endLoop.

---

### `approve`

AI sees: tool blocked pending human confirmation; other parallel tools proceed - always.

| Transport            | Behavior                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| **All**              | `TOOL_WAITING` emitted. UI shows Confirm/Cancel. Other parallel tools execute normally. Loop stops after batch. |
| **Confirm + wait**   | Tool executes inline (blocking), AI turn resumes via resume-stream with result.                                 |
| **Confirm + wakeUp** | Tool executes fire-and-forget. `approve-tool` endpoint returns immediately. Revival fires when done.            |
| **Cancel**           | Tool marked cancelled, AI turn resumes.                                                                         |

AI cannot opt out if `requiresConfirmation=true` in tool settings.

---

## Tool Call Errors - Loop Always Continues

Failed tool calls never stop the loop. `tool-result-handler.ts` marks the tool as failed and returns the error as a tool result. The AI receives:

```json
{ "success": false, "message": "...", "errorType": "..." }
```

The AI decides what to do (retry, skip, explain). Consistent with `ResponseType<T>` - no throw, always a result.

---

## `wait-for-task` Tool

Works for **both** `detach` and `wakeUp` tasks:

- Task **already complete**: returns result inline. Stream continues. Cleans up task + any pending revival.
- Task **pending**: writes `callbackMode=WAKE_UP + threadId + toolMessageId` onto task row (upgrades detach to wakeUp semantics), sets `pendingTimeoutMs=90000` → stream pauses.
- On timeout (`STREAM_TIMEOUT`): stream dies cleanly. Thread → `waiting`. When task completes, `handleTaskCompletion(WAKE_UP)` fires revival.
- AI always sees: `{ taskId, status, result?, waiting }` - same shape for all cases.

---

## Stream Timeout

Any time the stream is waiting for a remote result (queue path, `wait-for-task`, or escalated tool):

- Set `pendingTimeoutMs` on `ToolExecutionContext`
- `finish-step-handler.ts` reads this and schedules `setTimeout` → `streamAbortController.abort(new StreamAbortError(AbortReason.STREAM_TIMEOUT))`
- If result arrives before timeout: cancel the timer
- Clean abort: no error shown to user; revival handles continuation
- `pendingTimeoutMs = 0` → no timer (wait forever)

**Default timeout: 90s** - covers a full cron pulse cycle.

**Per-tool override:** set `streamTimeoutMs` on the endpoint definition in `createEndpoint()`. This is passed down by `tools-loader.ts` before calling execute. Tools that need no timeout (shell, claude-code interactive) set `streamTimeoutMs: 0`.

**Direct HTTP `wait` mode does not use this timer** - the HTTP connection itself is the timeout.

---

## Tool Self-Escalation (`context.escalateToTask()`)

For tools that may run longer than the configured timeout (shell, claude-code, etc.):

**Fast path (default):** Tool returns within timeout → result returned normally (local transport). Zero overhead.

**Escalation:** Tool calls `context.escalateToTask(callbackMode)` before the long-running operation:

1. Creates cron task row with the given callbackMode, stores `leafMessageId`
2. Sets `waitingForRemoteResult = true` - **never** `shouldStopLoop` (that's for endLoop only)
3. Sets `pendingTimeoutMs` from the tool's `streamTimeoutMs` definition (or default); `0` = no timer
4. `STREAMING_STATE_CHANGED` → `waiting` emitted immediately
5. Stream aborts at timeout (`REMOTE_TOOL_WAIT`) or immediately if `streamTimeoutMs=0`... wait, stream must stay alive until step batch ends
6. After parallel batch completes: stream sees `waitingForRemoteResult=true` → aborts (`REMOTE_TOOL_WAIT`)
7. Tool goroutine continues running detached from HTTP scope
8. Tool goroutine completes → `handleTaskCompletion(callbackMode)` → revival (for WAIT or WAKE_UP)

**The callbackMode passed to `escalateToTask` controls revival:**

- `WAIT`: original tool message backfilled, AI resumes with full context
- `WAKE_UP`: deferred message inserted, AI sees only result (args suppressed)
- `END_LOOP`: backfill + deferred message, no AI continuation

**The caller's callbackMode (passed by AI when invoking the tool) is used** - tools do not pick their own default unilaterally. `escalateToTask` receives the `callbackMode` from the tool's execution context.

---

## Branch Tracking for Revival

Every wakeUp task stores `leafMessageId` (= `ctx.currentParentId` at tool-call time - the branch tip at the moment the tool was called).

- `execute-tool/repository.ts` and `wait-for-task/repository.ts`: store `leafMessageId` in the dedicated `wakeUpLeafMessageId` column on the task row (NOT in the `taskInput` JSON blob)
- `handleTaskCompletion` accepts `leafMessageId?: string | null` as a **first-class typed param** - callers pass it explicitly, never via `taskInput` spread
- `resumeStreamRequestSchema.parse` receives only the known routing fields (`threadId`, `callbackMode`, `modelId`, `skillId`, `favoriteId`, `leafMessageId`) - never arbitrary tool input fields
- `resume-stream/repository.ts` uses stored `leafMessageId` as the parent for the deferred message
- Falls back to latest-message query only if `leafMessageId` not set (backwards compat)

This ensures revival appends to the correct branch even if the user switched branches while the tool was running.

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
| `wakeUp + endLoop`           | Both fire. endLoop stops loop. wakeUp revival fires later - fresh turn with full tool access.           |
| `wakeUp + approve`           | approve blocks itself, wakeUp fires. Loop stops after batch. wakeUp revival fires when result arrives.  |
| `detach + wakeUp`            | Both fire. Only wakeUp schedules revival.                                                               |
| `wait + wakeUp`              | wait returns result to AI (local) or aborts with waiting (remote). wakeUp fires independently.          |
| `wait + endLoop`             | endLoop stops loop after step. wait result returned before stop (local) or thread → waiting (remote).   |
| `detach + endLoop`           | endLoop stops loop. detach fires, no revival.                                                           |
| `approve + wakeUp + endLoop` | approve blocks. wakeUp fires, schedules revival. endLoop stops loop after batch.                        |

---

## Push-First Sync Architecture

When `isDirectlyAccessible=true`, cloud pushes changes to local immediately instead of waiting for local's cron pull:

- **Tasks**: after creating a task with `targetInstance`, immediately POST to local's task-sync endpoint via `executeRemote()`. On failure: fall back (task is already in DB, local pulls on next cron).
- **Memories**: on `create`/`update`/`delete`, push delta to local's task-sync endpoint fire-and-forget.
- **Capabilities**: on version bump, push updated capabilities to local immediately.

Connecting side (local) always has `pullFromRemote()` as fallback - push is opportunistic.

---

## toolMessageId - No Polling

Each `execute()` wrapper in `tools-loader.ts` injects `currentToolMessageId` from `ctx.pendingToolMessages.get(toolCallId)?.messageId` before calling execute. No shared map, no polling. By the time `execute()` is called, the `tool-call` event has already been processed and `pendingToolMessages` is populated.

---

## Related Files

| File                                               | Role                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `ai/execute-tool/constants.ts`                     | `CallbackMode` enum + `TaskRoutingContext` type                                            |
| `ai/execute-tool/repository.ts`                    | Local/remote execution paths per mode, transport routing; reads `streamTimeoutMs` from def |
| `tasks/task-completion-handler.ts`                 | Backfill + deferred insert + WS events + resume-stream scheduling, reads `leafMessageId`   |
| `tasks/execute/repository.ts`                      | Cron task execution + `handleTaskCompletion` call                                          |
| `tasks/pulse/repository.ts`                        | Pulse loop (remote task pickup + `/report` push)                                           |
| `tasks/wait-for-task/repository.ts`                | Blocks stream on pending task, upgrades detach→wakeUp                                      |
| `resume-stream/repository.ts`                      | Headless AI turn (append mode), uses `leafMessageId` for branch                            |
| `repository/handlers/finish-step-handler.ts`       | Reads `waitingForRemoteResult`/`shouldStopLoop`, starts timeout timer (skips if `0`)       |
| `repository/handlers/tool-call-handler.ts`         | Sets `shouldStopLoop` (endLoop only), `requiresConfirmation`, emits `TOOL_WAITING`         |
| `repository/handlers/tool-result-handler.ts`       | Detects waiting state via callbackMode; stores `pending` status for remote/escalated tools |
| `repository/handlers/message-converter.ts`         | Deferred message handling in AI context, suppresses wakeUp args                            |
| `repository/handlers/tool-confirmation-handler.ts` | Confirm/cancel flow, wakeUp fire-and-forget on confirm                                     |
| `user/remote-connection/db.ts`                     | `isDirectlyAccessible` field on `remote_connections`                                       |
| `tasks/task-sync/repository.ts`                    | Pull-from-remote, push-first on `isDirectlyAccessible=true`                                |
