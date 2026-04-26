# AI Stream - Tool Execution Lifecycle

## Overview

When an AI calls a tool, five callback modes cover every meaningful execution pattern. The mode controls timing and revival - not UI presentation. Transport (local inline, remote HTTP, task queue) is invisible to the user and invisible to the AI.

---

## Core Principle

**Transport is invisible. UI is uniform.**

- The AI always sees the same return shape regardless of whether the tool ran inline, over HTTP, or via a background task queue.
- The UI always shows the same state for the same mode regardless of transport. A `wait` tool shows as "executing" whether it ran in 2ms locally or is waiting for a 60s remote task.
- The only observable difference is timing.

---

## Remote Execution - Two Tiers

**Tier 1 - Direct HTTP** (`isDirectlyAccessible=true`): Blocking or fire-and-forget HTTP call to the remote instance. Result arrives in the same stream turn (wait/endLoop) or immediately as a taskId (detach/wakeUp).

**Tier 2 - Task queue** (`isDirectlyAccessible=false`): Task row created with `targetInstance`. Remote picks it up on its next pulse (~1 min). Result arrives via `/report` → `handleTaskCompletion`. Stream aborts into `waiting` state; revival delivers the result.

The task queue path always produces the same end state as if the tool had run locally - the stream revival reconstructs the turn as if nothing was deferred.

---

## The 4th Stream State: `waiting`

Threads have four streaming states: `idle | streaming | aborting | waiting`.

**`waiting`** - stream is dead but a task is still in flight. Stop button stays visible. No content arrives until revival.

- Set when: task-queue path activates (`waitingForRemoteResult=true` + stream aborts with `REMOTE_TOOL_WAIT`)
- Cleared when: revival fires (atomically claims `idle|waiting → streaming`)
- Also cleared when: cancel called, or task completes with no revival (endLoop remote, detach)
- `STREAMING_STATE_CHANGED` WS event fires immediately so live clients update without refresh
- Persisted across page loads: if thread is `waiting` on load, stop button shows immediately

---

## The 5 Modes

### `wait` (default)

**User sees**: tool executing. Stream pauses, then continues with the result. Seamless.

**AI sees**: result returned inline, loop continues - always. For the task-queue path, the stream revives and the AI picks up from where it left off; the deferred mechanics are invisible to the AI.

| Transport                | Stream behavior                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **Local**                | Inline execution. Result returned immediately. Loop continues.                         |
| **Remote direct**        | Blocking HTTP. Result returned in same turn. Loop continues.                           |
| **Remote queue**         | Stream aborts → `waiting`. Task executes remotely. On completion: see lifecycle below. |
| **Escalated (>timeout)** | Same as remote queue path.                                                             |

**Tool message lifecycle - task-queue path:**

- At call time: tool message created, `status: "pending"` (UI shows executing)
- While waiting: message stays `pending`, thread stays `waiting`
- On `handleTaskCompletion` → result inserted into the **message queue**:
  - **No user message in queue** (same sequence): dequeue result → backfill original tool message in place - `status: "completed"`, result set. No deferred message created. `TOOL_RESULT` WS event emitted. Revival fires from original as parent.
  - **User messages in queue** (different sequence): dequeue result → insert deferred TOOL message after the current leaf. `MESSAGE_CREATED` + `TOOL_RESULT` WS events. Revival fires from deferred as parent, with queued user messages prepended to the revival context.
- AI sees result and continues. Loop does not stop.

---

### `detach`

**User sees**: tool dispatched, stream continues immediately. Result bubble updates in background when done.

**AI sees**: `{ taskId, status: "pending", hint: "use wait-for-task(taskId) if you need the result" }` - always.

| Transport         | Stream behavior                                                       |
| ----------------- | --------------------------------------------------------------------- |
| **Local**         | Fire-and-forget inline. AI gets taskId immediately, stream continues. |
| **Remote direct** | Non-blocking HTTP. AI gets taskId immediately.                        |
| **Remote queue**  | Task created. AI gets taskId immediately.                             |

**Tool message**: created `pending`. On completion: backfilled with result, `TASK_COMPLETED` WS event. No revival. AI can upgrade by calling `wait-for-task(taskId)`.

---

### `wakeUp`

**User sees**: tool dispatched, stream continues immediately. When result arrives, a new AI turn starts automatically.

**AI sees**: `{ taskId, status: "pending", hint: "result will be injected when ready - do NOT call wait-for-task" }` - always.

| Transport         | Stream behavior                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| **Local**         | Fire-and-forget. `handleTaskCompletion(WAKE_UP)` → result inserted into message queue → queue executor runs. |
| **Remote direct** | Non-blocking HTTP. Remote calls `/report` when done → same completion path.                                  |
| **Remote queue**  | Task created. Remote picks up on pulse → `/report` → same completion path.                                   |

**Tool message lifecycle:**

- At call time: tool message created `pending`, content = `{taskId, status:"pending"}`
- Original tool message is **never modified** after creation
- On `handleTaskCompletion` → result inserted into the **message queue**:
  - Queue executor checks thread state:
    - **Stream still running**: result injected into current turn as next step. Deferred message inserted, AI loop picks it up immediately.
    - **Stream dead** (thread `idle` or `waiting`): deferred TOOL message inserted at current leaf with actual result. `MESSAGE_CREATED` + `TOOL_RESULT` + `TASK_COMPLETED` WS events. Revival fires from deferred as parent. Any additional queued user messages included in revival context.
- Revival fires a fresh full-tool-access turn.

**AI context**: original tool call args replaced with `{hint:"args omitted, see deferred result below"}` in AI context. Full args preserved in DB and shown in UI. Deferred result is the authoritative context entry.

---

### `endLoop`

**User sees**: tool executing, then stream ends. Background task visible until complete.

**AI sees**: result returned, then loop stops - always.

| Transport         | Stream behavior                                                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local**         | Inline execution. Result to AI. Loop stops. Thread → `idle`.                                                                                                    |
| **Remote direct** | Blocking HTTP. Result to AI. Loop stops. Thread → `idle`.                                                                                                       |
| **Remote queue**  | Stream aborts → `waiting`. Task executes. On completion: original tool message **backfilled in place**. `TASK_COMPLETED` WS event. No revival. Thread → `idle`. |

Thread stays `waiting` (stop button visible) until the remote task completes - even though no AI continuation fires.

---

### `approve`

**User sees**: confirmation dialog for this tool. Other tools in the same batch proceed normally.

**AI sees**: tool blocked; other parallel tools execute normally. Loop stops after batch.

| Outcome              | Behavior                                                       |
| -------------------- | -------------------------------------------------------------- |
| **Confirm + wait**   | Tool executes. Result delivery follows `wait` lifecycle below. |
| **Confirm + wakeUp** | Tool executes fire-and-forget. Revival fires when done.        |
| **Cancel**           | Tool marked cancelled. AI turn resumes.                        |

**Confirm + wait result lifecycle** (same as `wait` task-queue path):

- **No user message in queue** (same sequence): result backfilled into original tool message in-place. `TOOL_RESULT` WS event. Revival from original.
- **User message(s) in queue** (different sequence - user sent a follow-up before confirming): deferred TOOL message inserted after current leaf. `MESSAGE_CREATED` + `TOOL_RESULT` WS events. Revival from deferred, with queued user messages prepended to context.

If `requiresConfirmation=true` on the endpoint definition, the AI cannot bypass this mode.

---

## Message Queue

**Planned** (not yet in code):

Every thread has a per-thread message queue. All async results and user messages during an active or waiting stream go through the queue. The queue is the single delivery mechanism - nothing bypasses it.

**Enqueue sources:**

- User sends a message while thread is `streaming` or `waiting` → message appended to queue
- `handleTaskCompletion` for wakeUp/wait → result appended to queue
- Cross-agent messages from remote agents → appended to queue (future)

**Queue executor - runs after every enqueue:**

1. If thread is `streaming`: hand the item to the live stream as the next step. Stream picks it up at the end of the current tool batch.
2. If thread is `idle` or `waiting`: drain the full queue in one shot - fire a revival run with all queued items as context (tool results first, then user messages in order).
3. If thread is `aborting`: wait, retry after abort settles.

**Why a queue, not a block:**

Users should not be frozen out of their thread while an agent works. Cross-agent communication depends on this: a remote agent returning results, a user adding context mid-run, a cron-triggered injection - all arrive asynchronously and must land in order. The queue is the foundation for agent-to-agent messaging where multiple senders need ordered delivery into a single thread.

**Ordering guarantee**: items are drained oldest-first. A revival that includes both a tool result and queued user messages always presents the tool result first, then user messages, then fires the AI response.

---

## Tool Call Errors - Loop Always Continues

Failed tool calls never stop the loop. The AI receives:

```json
{ "success": false, "message": "...", "errorType": "..." }
```

The AI decides what to do (retry, skip, explain). Errors are data, not exceptions.

---

## `wait-for-task` Tool

Works for both `detach` and `wakeUp` tasks:

- Task **already complete**: result returned inline. Stream continues. Task cleaned up.
- Task **pending**: upgrades to wakeUp semantics (`callbackMode=WAKE_UP` written on task row), sets `pendingTimeoutMs=90000` → stream pauses.
- On timeout: stream dies cleanly. Thread → `waiting`. When task completes, `handleTaskCompletion(WAKE_UP)` → queue → revival.

AI always sees: `{ taskId, status, result?, waiting }`.

---

## Stream Timeout

When waiting for a remote result (task-queue path, `wait-for-task`, escalated tool):

- `pendingTimeoutMs` set on `ToolExecutionContext`
- Timeout fires → stream aborts cleanly (`STREAM_TIMEOUT`)
- Thread → `waiting`. Revival delivers result when task completes via queue.
- `pendingTimeoutMs = 0` → no timer (wait forever)

**Default: 90s.** Covers a full task-queue pulse cycle.

**Per-tool override**: `streamTimeoutMs: 0` in endpoint definition for interactive tools (shells, long-running agents).

**Direct HTTP `wait` mode**: no timer - the HTTP connection is the timeout.

---

## Tool Self-Escalation

For tools that may run longer than the configured timeout:

**Fast path**: returns within timeout → result returned normally. Zero overhead.

**Escalation**: tool calls `context.escalateToTask(callbackMode)` before the long-running work:

1. Creates task row with `callbackMode`, stores `leafMessageId`
2. Sets `waitingForRemoteResult=true`, `pendingTimeoutMs` from endpoint definition
3. `STREAMING_STATE_CHANGED → waiting` emitted immediately
4. After parallel batch: stream sees `waitingForRemoteResult=true` → aborts (`REMOTE_TOOL_WAIT`)
5. Tool goroutine continues detached from HTTP scope
6. Completes → `handleTaskCompletion(callbackMode)` → queue → revival

The callbackMode passed to `escalateToTask` is the one the AI requested. Tools do not pick their own.

---

## Branch Tracking for Revival

Every wakeUp/wait task stores `leafMessageId` (branch tip at call time):

- Stored in a dedicated column on the task row
- `handleTaskCompletion` accepts it as a typed first-class parameter
- Revival appends to the correct branch even if the user switched branches while the task ran

---

## Parallel Mixed-Mode Rules

| Combination                  | Rule                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| `wait + wait`                | Both results returned, loop continues.                                                                 |
| `wakeUp + wakeUp`            | Both fire independently. Each goes through queue. Each revival is a fresh full-tool-access turn.       |
| `detach + detach`            | Both fire. No revival. AI gets two taskIds.                                                            |
| `endLoop + anything`         | All parallel tools complete. Non-endLoop results to AI. Then loop stops.                               |
| `approve + anything`         | approve blocks only itself. Other tools execute normally. Loop stops after batch.                      |
| `wakeUp + endLoop`           | Both fire. endLoop stops loop. wakeUp result goes to queue → revival fires later.                      |
| `wakeUp + approve`           | approve blocks itself, wakeUp fires. Loop stops. wakeUp revival fires via queue when done.             |
| `detach + wakeUp`            | Both fire. Only wakeUp goes to queue and schedules revival.                                            |
| `wait + wakeUp`              | wait returns inline (local/direct) or aborts to waiting (queue). wakeUp fires independently via queue. |
| `wait + endLoop`             | endLoop stops loop. wait result returned before stop (local/direct) or thread → waiting (queue).       |
| `detach + endLoop`           | endLoop stops loop. detach fires, no revival.                                                          |
| `approve + wakeUp + endLoop` | approve blocks. wakeUp fires via queue. endLoop stops loop after batch.                                |

---

## Push-First Sync

When the remote node is directly reachable (`isDirectlyAccessible=true`), task creation and completion notifications are pushed immediately rather than waiting for the next cron pull. Pull is always the fallback - push is opportunistic.
