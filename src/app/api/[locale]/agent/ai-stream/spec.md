# AI Stream — Stream Lifecycle and Revival

> **Tool execution, callback modes, transports, and async task lifecycle are owned by the executor** —
> `[../../system/execute-tool/spec.md](../../system/execute-tool/spec.md)`.
> This spec owns what happens to the **stream and its message queue** around those modes.
>
> Remote connection rows and transport negotiation: `[../../remote-connection/spec.md](../../remote-connection/spec.md)`.
> Cross-instance event relay + WS wire format: `[../../system/websocket/spec.md](../../system/websocket/spec.md)`.
> Field-driven tool UI / capability snapshot rendering: `[spec-remote-tool-call.md](./spec-remote-tool-call.md)`.
> Sibling specs: `[spec-modality.md](./spec-modality.md)` (media + gap-fill), `[spec-call-mode.md](./spec-call-mode.md)` (voice/VAD).

---

## Boundary: What AI-Stream Owns


| Concern                                                        | Owner                                   |
| -------------------------------------------------------------- | --------------------------------------- |
| Callback mode semantics (what modes mean)                      | `execute-tool/spec.md`                  |
| Tool execution (local, remote, goroutine)                      | `execute-tool`                          |
| Task row lifecycle (RUNNING → COMPLETED)                       | `execute-tool` / `tasks/`               |
| Task creation for DETACH/WAKE_UP                               | `execute-tool`                          |
| Revival scheduling (resume-stream task creation)               | `execute-tool/repository/completion.ts` |
| **Resume-stream endpoint** (revival route + repository)        | `**agent/ai-stream/resume-stream/`**    |
| **Stream state machine** (streaming → waiting → idle)          | **ai-stream**                           |
| **Message queue** (enqueue, drain, order)                      | **ai-stream**                           |
| **Thread state** (streaming-state-changed WS events)           | **ai-stream**                           |
| **Tool message insertion** (deferred, in-place backfill)       | **ai-stream**                           |
| **Confirmation gate UI** (APPROVE mode stream abort/resume)    | **ai-stream**                           |
| **Tool self-escalation** (stream abort for long-running tools) | **ai-stream**                           |
| **Branch tracking** (leafMessageId for revival)                | **ai-stream**                           |


**The key rule:** ai-stream manages the stream. Execute-tool manages execution.
Neither crosses into the other's territory.

---

## Core Principle

**Transport is invisible. UI is uniform.**

The AI always sees the same return shape regardless of whether the tool ran
inline, over a persistent WS, via direct HTTP, or via a background goroutine.
The UI always shows the same state for the same callback mode regardless of
transport. The only observable difference is timing.

---

## How Tool Results Travel Back

From the stream's perspective, results are either inline or deferred:


| Path                    | Result delivery                                              | Stream pauses? |
| ----------------------- | ------------------------------------------------------------ | -------------- |
| local (no `instanceId`) | Inline (synchronous)                                         | No             |
| `reverse-ws`            | `tool-execute-result` event at WS speed — effectively inline | No             |
| `direct-http`           | Same event protocol over HTTP leg — effectively inline       | No             |


Every AI tool dispatch rides the same `tool-execute-request` / `tool-execute-result`
event envelope over the remote-event-bridge. The bridge picks the wire leg
(reverse-ws frame or direct-http POST) from the connection's `transportMode`.
There is no task-queue transport and no blocking-HTTP path for AI calls
(`callToolDirect` is control-plane only — see the executor spec).

`wait` mode blocks the stream inline within the tool's timeout window. On inline
timeout the executor auto-upgrades to `wakeUp` and the thread parks.

**Remote loop branches** (inference-provider / relay) are separate execution
branches — not transport modes. The remote runs the LLM loop; the local executes
the tools. The remote registers `execute-tool` as its only tool and calls back
`${callerInstanceId}__toolName`. These ride the same tool-transport above.

---

## The 4th Stream State: `waiting`

Threads have four streaming states: `idle | streaming | aborting | waiting`.

`**waiting`** — stream is dead but work is still in flight. Stop button stays
visible. No content arrives until revival.

- Set when: `approve` gate fires, or a tool self-escalates (`escalateToTask`)
- Cleared when: revival fires (atomically claims `idle|waiting → streaming`)
- Also cleared when: cancel called, or a DETACH/END_LOOP task completes with no revival
- `STREAMING_STATE_CHANGED` WS event fires immediately
- Persisted across page loads

`waiting` is NOT entered for remote `wait`-mode calls that return within the
inline window. It IS entered when the inline window expires and the executor
auto-upgrades to `wakeUp`.

---

## The 5 Modes — Stream Behavior

> Mode names, return shapes, loop/failure contract: `[../../system/execute-tool/spec.md](../../system/execute-tool/spec.md)`.
> Below: what ai-stream does around each mode.

### `wait`

**AI sees**: result inline, loop continues — always.


| Transport            | Stream behavior                                                                     |
| -------------------- | ----------------------------------------------------------------------------------- |
| local                | Inline. Result returned immediately.                                                |
| remote (event)       | Result event returns inline. Loop continues.                                        |
| Escalated (>timeout) | Self-escalates via `escalateToTask`. Stream → `waiting`. Revival fires on complete. |


**Escalated path — tool message lifecycle:**

- At call time: `status: "pending"`
- On completion — result inserted into the queue:
  - **No user messages in queue** (same sequence): backfill original tool message
  in-place (`status: "completed"`, result set). `TOOL_RESULT` WS event. Revival
  fires from original as parent.
  - **User messages in queue** (different sequence): insert deferred TOOL message
  after current leaf. `MESSAGE_CREATED` + `TOOL_RESULT` WS events. Revival from
  deferred, with queued user messages prepended.

---

### `detach`

**AI sees**: `{ taskId, status: "pending", hint: "use await-task(taskId) if you need the result" }`.

**Tool message**: created `pending`, permanently `{taskId}`. On completion:
`TASK_COMPLETED` WS event + thread-state reconcile. No revival. Result lives in
task execution history; retrieve via `await-task(taskId)` (upgrades to WAIT).

---

### `wakeUp`

**AI sees**: `{ taskId, status: "pending", hint: "result will be injected when ready — do NOT call await-task" }`.

**Tool message lifecycle:**

- At call time: `status: "pending"`, content = `{taskId, status:"pending"}`
- The original wakeUp tool message is **preserved as-is** — never modified.
It is an audit record, not a result container.
- On completion → a **new deferred TOOL message** is inserted:
  - **Stream still running (LIVE)**: `prepareStep` drains the pending payload —
  inserts the deferred message at the live chain tip, appends a
  converter-shaped assistant+tool pair to the in-flight context. Model sees the
  result in the same agent loop — **no separate revival turn**.
  - **Stream dead** (`idle` or `waiting`): deferred TOOL message inserted at
  current leaf. `MESSAGE_CREATED` + `TOOL_RESULT` + `TASK_COMPLETED` WS events.
  ONE revival fires — a fresh full-tool-access turn with no injected
  instructions of any kind.

**Why wakeUp differs from wait/endLoop:** `wait` and `endLoop` backfill the
original tool message because the stream is paused waiting for exactly that
result — the slot is reserved. `wakeUp` fires and forgets; the original is a
dispatch record. The deferred result arrives as a new message later.

**AI context**: original tool call args replaced with `{hint:"args omitted, see deferred result below"}`. Full args preserved in DB. Deferred result is the
authoritative context entry.

---

### `endLoop`

**AI sees**: result returned, then loop stops.

Inline on both local and remote. Thread → `idle` after result.

---

### `approve`

**User sees**: confirmation dialog. Other parallel tools execute normally.


| Outcome          | Behavior                                                 |
| ---------------- | -------------------------------------------------------- |
| Confirm + wait   | Tool executes inline. Result delivery follows wait path. |
| Confirm + wakeUp | Tool executes fire-and-forget. Revival fires when done.  |
| Cancel           | Tool marked cancelled. AI turn resumes.                  |


**Confirm + wait result lifecycle** — same as wait escalated path:

- No user messages in queue: backfill in-place. `TOOL_RESULT`. Revival from original.
- User messages in queue: deferred TOOL message. `MESSAGE_CREATED` + `TOOL_RESULT`. Revival from deferred.

**10-minute timeout**: tool marked `cancelled`. No revival.

`ToolConfirmationHandler` lives in `agent/ai-stream/` — confirmation is a
stream-lifecycle concern. After user confirms, it calls
`RouteExecuteRepository.runInProcess` for the actual tool run — execute-tool owns
execution, ai-stream owns stream state.

---

## Resume-Stream (`resume-stream/`)

**Route**: `POST /api/{locale}/agent/ai-stream/resume-stream`  
**Alias**: `resume-stream`  
**Handler**: `ResumeStreamRepository.resume()` in `repository/resume.ts`

This is the revival endpoint. Execute-tool's `TaskCompletion.handle` schedules it
as a one-shot `cronTasks` row after an async task completes. The cron pulse picks
it up; direct-fire is also possible when `directResumeLocale` is provided.

**What it does:**

1. Polls `thread.streamingState` (max 3s) — is a live stream running?
2. Checks await-task intercept (if parked task has `callbackMode=wait`, skip).
3. Dispatches on stream state + callbackMode:
  - **aborting**: user cancelled — skip revival.
  - **wakeUp + live stream**: publish `WakeUpPayload` signal → `prepareStep` injects inline.
  - **wakeUp + dead stream**: claim revival slot → walk to leaf →
  `insertDeferredWakeUpMessage` → `fireWakeUpRevival` (headless) → cleanup cron rows.
  - **wait + live stream**: emit `tool-result` WS — live loop sees the backfilled result.
  - **wait + dead stream**: claim revival slot → `walkToLeafMessage` → `fireWakeUpRevival` → cleanup.
4. No `toolMessageId` + dead stream: `clearStreamingState` (waiting → idle).

**Revival claim** is atomic: `idle|waiting → streaming`. A stuck claim (180s
backoff) force-resets the thread state.

**Cron task cleanup** only on success (both wakeUpTaskId + resumeTaskId deleted).
On failure, the cron row survives for the pulse to retry.

---

## Message Queue

Every thread has a per-thread message queue. All async results and user messages
during an active or waiting stream go through the queue.

**Enqueue sources:**

- User message while thread is `streaming` or `waiting`
- Tool completion for `wakeUp`/`wait`
- Cross-agent messages from remote agents

**Queue executor — runs after every enqueue:**

1. Thread `streaming`: hand item to the live stream as the next step.
2. Thread `idle` or `waiting`: drain full queue — fire revival with all items
  as context (tool results first, then user messages in order).
3. Thread `aborting`: wait, retry after abort settles.

**Ordering guarantee**: oldest-first. Revival always presents tool result first,
then queued user messages, then fires the AI response.

---

## Tool Call Errors — Loop Always Continues

Failed tool calls never stop the loop. The AI receives:

```json
{ "success": false, "message": "...", "errorType": "..." }
```

The AI decides what to do (retry, skip, explain). Errors are data, not exceptions.

---

## `await-task` Tool

Intercepts a pending DETACH or WAKE_UP task. Works for local cronTask rows and
in-flight remote pending calls.

- **Already complete**: result returned inline. Task cleaned up.
- **Pending**: upgrades to WAIT — writes revival context into `cronTasks.taskInput`
(the parked resume-stream task), sets `waitingForRemoteResult=true` → stream pauses.
- On timeout: thread → `waiting`. When task completes → queue → revival.

AI sees: `{ taskId, status, result?, waiting }`.

Lives in `execute-tool/await-task/` — it is an execute-tool sub-endpoint.
Its only ai-stream coupling is `streamContext` fields (`waitingForRemoteResult`,
`suppressedWakeUpToolMessageIds`).

---

## Stream Timeout

When waiting for a remote result (`await-task`, escalated tool):

- `pendingTimeoutMs` set on execution context.
- Timeout fires → stream aborts cleanly (`STREAM_TIMEOUT`).
- Thread → `waiting`. Revival delivers result when task completes via queue.
- `pendingTimeoutMs = 0` → no timer (wait forever).

**Default: 90s.**  
**Per-tool override**: `streamTimeoutMs: 0` for long-running interactive tools.

**Remote `wait` mode**: the executor's inline window (tool's `timeoutMs`, default
90s) is the timer — on expiry auto-upgrades to wakeUp; 15-minute deadline backstop
guarantees outcome.

---

## Tool Self-Escalation (`escalateToTask`)

For tools that may run longer than the configured timeout (SSH, coding-agent):

**Fast path**: returns within timeout → result returned normally. Zero overhead.

**Escalation**: tool calls `context.escalateToTask(options?)` before long-running work:

1. `wireEscalateToTask` (in `repository/core/escalation-handler.ts`) creates a
  RUNNING `cronTasks` row via `TaskCompletion.createEscalationTask`.
2. Sets `streamContext.waitingForRemoteResult=true`, `pendingTimeoutMs` from
  endpoint config.
3. Emits `STREAMING_STATE_CHANGED → waiting` immediately.
4. After parallel tool batch: stream detects `waitingForRemoteResult=true` →
  aborts via `REMOTE_TOOL_WAIT`.
5. Tool goroutine continues; `onComplete(result)` is the callback when done.
6. `onComplete` → `TaskCompletion.handle` → queue → revival.

**Cancel propagation**: `streamContext.onEscalatedTaskCancel` marks the task
CANCELLED and resets thread to `idle`.

`escalation-handler.ts` is the only ai-stream file that directly creates task
rows — because this path is explicitly not an execute-tool dispatch. The task row
is a revival-context carrier, not an execute-tool async task.

The `callbackMode` passed to `escalateToTask` is the one the AI requested.
Tools do not choose their own mode.

---

## Branch Tracking for Revival

Every wakeUp/wait task stores `leafMessageId` (branch tip at call time):

- Stored on the task row at escalation/dispatch time.
- Revival appends to the correct branch even if the user switched branches
while the task ran.

---

## Parallel Mixed-Mode Rules


| Combination                  | Rule                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `wait + wait`                | Both results returned, loop continues.                                                           |
| `wakeUp + wakeUp`            | Both fire independently. Each goes through queue. Each revival is a fresh full-tool-access turn. |
| `detach + detach`            | Both fire. No revival. AI gets two taskIds.                                                      |
| `endLoop + anything`         | All parallel tools complete. Non-endLoop results to AI. Then loop stops.                         |
| `approve + anything`         | approve blocks only itself. Other tools execute normally. Loop stops after batch.                |
| `wakeUp + endLoop`           | Both fire. endLoop stops loop. wakeUp result goes to queue → revival fires later.                |
| `wakeUp + approve`           | approve blocks itself, wakeUp fires. Loop stops. wakeUp revival fires via queue when done.       |
| `detach + wakeUp`            | Both fire. Only wakeUp goes to queue and schedules revival.                                      |
| `wait + wakeUp`              | wait returns inline. wakeUp fires independently via queue.                                       |
| `wait + endLoop`             | endLoop stops loop. wait result returned before stop.                                            |
| `detach + endLoop`           | endLoop stops loop. detach fires, no revival.                                                    |
| `approve + wakeUp + endLoop` | approve blocks. wakeUp fires via queue. endLoop stops loop after batch.                          |


