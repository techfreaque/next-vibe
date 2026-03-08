# AI Stream — callbackMode Spec

## What is callbackMode?

`callbackMode` is a parameter on `execute-tool` that controls what happens after a tool call fires. The AI sets it per tool call. Parallel tool calls each honor their own mode independently — except `endLoop` which stops the loop after its result lands, and `approve` which blocks its own execution without affecting parallel tools.

Two things it controls:

1. **Does the stream keep going** after this tool fires?
2. **Does the AI get revived** when the result arrives?

---

## Parallel tool call behavior

When the AI calls multiple tools at once, each runs with its own `callbackMode`. Rules:

- All parallel tools execute concurrently regardless of mode
- `endLoop` — loop stops after all results in the batch are done
- `approve` — blocks only its own tool pending human confirmation; other parallel tools run; loop stops after the batch
- `detach` — completes silently, result not injected into current loop
- `wakeUp` — like `detach`, stream continues; `resume-stream` fires when result arrives whether loop is alive or dead

---

## The 5 Modes

### `detach` _(currently: `background`)_

**Intent:** Fire and forget. Tool runs, result goes into task history. AI never sees the result inline — it learns about it on the next user message via the trailing task history in system prompt. Nothing is injected into the current thread.

|            | Behavior                                                                                                                                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local**  | Executes inline. AI gets `{ taskId, hint: "use wait-for-task with this taskId to block and get the result" }`. Stream continues. Result stored in task history only.                                                                           |
| **Remote** | Task created on remote. Stream returns `{ taskId, status: "pending", hint: "use wait-for-task..." }` and continues. When remote finishes: `TASK_COMPLETED` WS event updates the tool bubble. No AI continuation, nothing injected into thread. |

> Result never enters the AI loop. No revival. No deferred message. AI picks it up organically on next user message via task history context.

---

### `wakeUp` _(keep name)_

**Intent:** Like `detach` — fire and don't block the current stream. But when the result arrives, always ensure the AI sees it and continues. Works whether the loop is still running or ended days later.

|            | Behavior                                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local**  | Executes inline. AI gets `{ taskId, hint }`. Stream continues normally. `resume-stream` scheduled immediately.                                 |
| **Remote** | Task created. Stream returns `{ taskId, status: "pending", hint }` and continues. `resume-stream` scheduled when result arrives via `/report`. |

**When `resume-stream` fires:**

- Loop still running → intercepts next step, injects the tool result message into the loop, loop continues
- Loop already ended → revives thread from last message, injects tool result message, AI continues

**Tool message DB record:** stored with full `input + output` — complete fidelity for UI display and audit.

**AI context (message-converter):** for wakeUp result messages, input args are **omitted** when building AI SDK messages. The AI sees the result but not the (potentially days-old / already-compacted) input. This prevents context bloat and stale arg confusion. Input is preserved in DB and shown in UI.

> `resume-stream` always fires — it checks `isStreaming` and either intercepts the live loop or revives a dead one. The tool message is always created; only the AI-facing representation suppresses the args.

---

### `wait` _(keep name — this is the default)_

**Intent:** Default behavior. Stream keeps going. All parallel tool results come back, loop continues as normal. Nothing special.

|            | Behavior                                                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local**  | Executes inline. Result returned to AI. Loop continues normally.                                                                                           |
| **Remote** | Task created. Stream returns `{ taskId, status: "pending" }` and **stays open**. When remote result arrives: backfilled into tool message, loop continues. |

> This is what happens when you don't specify `callbackMode`. Normal tool execution.

---

### `endLoop` _(currently: `noLoop`)_

**Intent:** Run the tool, return the result to the AI, then stop the tool-calling loop. AI wraps up its current response without calling more tools.

|            | Behavior                                                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local**  | Executes inline. Result returned to AI. Loop stops after this step — no further tool calls. AI writes final response.                         |
| **Remote** | Task created. Stream ends. When remote finishes: result backfilled into tool message, `TASK_COMPLETED` WS updates bubble. No AI continuation. |

> Result always delivered. Loop just won't continue after.

---

### `approve` _(currently: `requiresConfirmation`)_

**Intent:** This tool needs human sign-off before it runs. Other parallel tools in the same batch execute normally. Loop stops after all parallel tools in this batch are done — the AI does not continue until the human acts.

|            | Behavior                                                                                                                                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local**  | `TOOL_WAITING` emitted for this tool. UI shows Confirm / Cancel. Other parallel tools in the batch execute normally. Loop stops after this batch. On confirm → tool executes, AI turn resumes. On cancel → tool marked cancelled, AI turn resumes. |
| **Remote** | Same — `TOOL_WAITING` for this tool only. Other parallel tools run. Loop stops after batch. On confirm → remote task created. On cancel → no task created.                                                                                         |

> **AI can opt in** by passing `callbackMode: "approve"`. **AI cannot opt out** — if tool settings have `requiresConfirmation: true`, it always applies regardless of what the AI passes.

---

## Name summary

| Old name               | New name  | One-line reason                                                                                                     |
| ---------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| `background`           | `detach`  | "background" sounds like it runs in background; truth is it fully detaches — result never comes back to this stream |
| `wakeUp`               | `wakeUp`  | Like detach but always revives AI with result — intercepts live loop or revives dead one                            |
| `wait`                 | `wait`    | Already clear — default, stream waits for result and continues                                                      |
| `noLoop`               | `endLoop` | `noLoop` is negative; `endLoop` describes what it does                                                              |
| `requiresConfirmation` | `approve` | Intent is human sign-off; stops loop after batch completes                                                          |

---

## Related Files

| File                                         | Role                                                                |
| -------------------------------------------- | ------------------------------------------------------------------- |
| `ai/execute-tool/constants.ts`               | `CallbackMode` enum + `TaskRoutingContext` type                     |
| `ai/execute-tool/repository.ts`              | Local execution paths per mode                                      |
| `tasks/task-completion-handler.ts`           | Backfill + WS event + resume-stream scheduling                      |
| `tasks/execute/repository.ts`                | Cron task execution + `handleTaskCompletion` call                   |
| `tasks/pulse/repository.ts`                  | Pulse loop (remote task pickup + `/report` push)                    |
| `resume-stream/repository.ts`                | Headless AI turn (append mode)                                      |
| `repository/handlers/finish-step-handler.ts` | Reads `shouldStopLoop` / `waitingForRemoteResult`                   |
| `repository/handlers/tool-call-handler.ts`   | Sets `shouldStopLoop`, `requiresConfirmation`, emits `TOOL_WAITING` |
| `repository/handlers/message-converter.ts`   | Deferred message handling in AI context                             |
