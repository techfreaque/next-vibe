# Execute-Tool — The Universal Tool Executor

> One endpoint, every tool call. Local or remote, sync or async, from any caller
> (AI, MCP, CLI, endpoint-to-endpoint, remote peer). No second execution path.
>
> Cross-instance transport: `[../../remote-connection/spec.md](../../remote-connection/spec.md)`
> and `[../websocket/spec.md](../websocket/spec.md)`.
> Stream and revival semantics: `[../../agent/ai-stream/spec.md](../../agent/ai-stream/spec.md)`.
> This spec: the executor's contract, callback modes, transport mechanics, and async task lifecycle.

---

## Principles

1. **One executor.** AI tool calls, MCP relay, CLI commands, remote dispatch,
   and endpoint-to-endpoint calls all go through `RouteExecuteRepository`.
   The low-level core (`repository/core.ts`) pulls no orchestration — the hot
   path stays lean. Every user-facing surface goes through the repository.

2. **Transport is invisible.** Pass `toolName + input`, optionally `instanceId`.
   Whether the tool runs in-process, over reverse-ws, or via direct-http is an
   internal detail. Same `ResponseType<T>`, same error shape, every path.

3. **Same logic, different wire.** Local and remote implement identical callback
   mode semantics. The only difference is how bytes travel — never what modes
   mean or when revivals fire.

4. **In-process for endpoint-to-endpoint.** Call
   `RouteExecuteRepository.runInProcessTyped({definition, input, …})` — typed,
   no HTTP. Never re-POST to yourself.

5. **Definite outcome, always.** Every call ends as result · explicit failure ·
   deadline timeout. No silent loss, no thread left waiting forever.

6. **No remote task rows on the caller.** Remote dispatch never writes a task row
   on the calling instance; revival context rides the wire with the result.

---

## Request / Response

```
POST /api/{locale}/system/execute-tool
alias: execute-tool   (CLI firstCliArg: toolName)

toolName       string   — tool/endpoint name or alias; "instanceId__toolName" routes remotely
input          json     — tool input (default {})
instanceId?    string   — target a named remote instance
callbackMode?  enum     — wait | detach | endLoop | wakeUp | approve (default: wait)

→ result?   json    — the target route's response (inline modes)
  taskId?   string  — async/remote handle (hidden field)
  hint?     string  — AI status message (hidden field)
  status?   enum    — completed | failed (hidden; always explicit on the wire, never inferred)
```

Auth: `PUBLIC` + all authenticated roles + `MCP_VISIBLE`. The **target** route's
`allowedRoles` gates execution — this endpoint never re-checks auth.

---

## The 5 Callback Modes

The mode controls timing and revival. Same meaning on every transport.

| Mode      | Returns                              | AI loop     | On failure                                       |
| --------- | ------------------------------------ | ----------- | ------------------------------------------------ |
| `wait`    | result inline                        | continues   | `fail()` inline; AI sees the error               |
| `endLoop` | result inline, then stream ends      | stops       | `fail()` inline                                  |
| `detach`  | `{taskId, status:"pending"}`         | continues   | failure in task history; retrieve via await-task |
| `wakeUp`  | `{taskId, status:"pending"}`         | continues   | revival fires with the error                     |
| `approve` | blocks on user confirmation (10 min) | stops batch | timeout → cancelled                              |

**Detach never backfills.** The dispatch tool message permanently carries
`{taskId}`. The result lives only in task execution history and is retrieved
via `await-task` (which upgrades the task to WAIT semantics). This is detach's
contract on every transport.

**Remote `wait` auto-upgrade:** In revival streams (`isRevival=true`), remote
`wait` auto-upgrades to `wakeUp` to prevent a hung revival loop. The executor
decides this; tools never choose their own mode.

---

## Local and Remote: Same Logic, Different Wire

Every callback mode runs on both transports. The transport changes only the wire
mechanics — not the semantics.

### Execution phases (both transports)

1. **Validation** — parse `instanceId__toolName`, check folder restrictions,
   apply revival circuit-breaker (WAIT→WAKE_UP in revival streams).
2. **Permission resolve** — cascade: favorite → skill → user default; apply
   denials; check folder hard blocks.
3. **Dispatch** — route to the transport determined by `instanceId`:
   - No `instanceId` → **local** (in-process)
   - `instanceId` present → **remote** (event transport or direct-HTTP)
4. **Execution** — identical callback mode semantics on both sides.
5. **Completion** — task row update, WS events, revival scheduling.

### Local (in-process)

| Mode              | Handler                       | Mechanism                                                 |
| ----------------- | ----------------------------- | --------------------------------------------------------- |
| `wait`/`endLoop`  | `LocalExecution.execute`      | Inline via `RouteExecutionExecutor.executeGenericHandler` |
| `detach`/`wakeUp` | `LocalExecution.executeAsync` | ONE shared flow: RUNNING task row + goroutine             |
| `approve`         | `LocalExecution.execute`      | Confirmation gate, returns placeholder                    |

**Local async lifecycle** (detach and wakeUp share one code path):

1. Insert `cronTasks` row `lastExecutionStatus=RUNNING`.
2. Spawn fire-and-forget goroutine (fresh AbortController — survives stream death).
3. **Claim CAS** — flip row terminal only if mode still matches dispatch mode.
   Claim LOST = `await-task` upgraded the task; force-terminal and fire the
   waiter's revival. Both modes get identical upgrade-race protection.
4. Claim WON → `TaskCompletion.handle` with the dispatch mode's policy:
   DETACH → no backfill, no revival; WAKE_UP → revival scheduled.
5. Return `{taskId, hint}` immediately.

**Task IDs are deterministic under fixtures.** `generateTaskId` derives the id
from `toolCallId` when a `toolExecutionContext` is present (no env flag needed) so
recorded fixtures replay with stable ids, cross-instance included. A random tail
is appended in production.

### Remote: Event Transport

`instanceId` resolves to a `remote_connections` row. Every AI tool dispatch —
all five modes, on both `reverse-ws` and `direct-http` connections — rides the
`tool-execute-request` / `tool-execute-result` event envelope over the bridge.
The bridge picks the wire leg from the connection's `transportMode`.

**Requester side (`repository/remote.ts` + `transport/events.ts`):**

1. `PendingCalls.register(callId, deadline, onDeadline)` — in-memory registry.
2. Emit `tool-execute-request` event over the bridge.
3. `detach`/`wakeUp`: return `{taskId, hint}` immediately.
   `wait`/`endLoop`: block on `PendingCalls.awaitResult` (inline timeout window).
4. `tool-execute-result` arrives → `PendingCalls.complete` resolves the entry,
   wakes waiters, fires revival callback for parked wakeUps.
5. **Inline WAIT timeout** (the tool's `timeoutMs`, default 90s): on expiry,
   auto-upgrade to wakeUp — the call stays alive, the thread parks.
   **Deadline backstop** (`PENDING_CALL_DEADLINE_MS`, 15 min): hard outcome
   guarantee. No call is ever left pending forever.
6. `pendingCallId` is persisted on the tool message for WAKE_UP only
   (restart-safe revival + dismiss-task). Detach stores none.

**Receiver side (`repository/index.ts` → `handleIncomingToolRequest`):**

- `wait`/`endLoop`: runs the tool inline and emits the result immediately.
- `detach`/`wakeUp`: runs `LocalExecution.executeAsync` — same flow as a local
  async dispatch. The task-row ID IS the requester's callId. One task identity
  names the work on both instances. When the goroutine settles, `onAsyncTaskSettled`
  relays the outcome as a `tool-execute-result` event.

**Caller context:** `callerSkillId`, `callerFavoriteId`, `callerPlatform`, and
`toolExecutionContext` travel in the event payload side-channel — never in headers.
Caller-context `fieldDefaults` are resolved caller-side before dispatch
(`transport/wire.ts → resolveCallerFieldDefaults`).

### Control-Plane: `callToolDirect` (non-AI only)

`transport/direct.ts` — synchronous POST to the peer's execute-tool endpoint
where the response IS the result. Used only for connection setup/control (ping,
sync pulls) that must work before the bridge exists. Never used for AI calls.
Fires only when `platform !== AI` **and** `timeoutMs !== 0` (unbounded agent
loops never ride a blocking POST). Network failure → `fail(EXTERNAL_SERVICE_ERROR)`.

---

## Transport Failover

**None — by design.**

- `direct-http → reverse-ws` is impossible: the socket must be held open by
  the peer (NAT'd side dials out). The caller cannot conjure it on demand.
- `reverse-ws → direct-http` is moot: a peer is on reverse-ws precisely because
  it is not HTTP-reachable.

A down leg is a hard failure. The definite-outcome contract still holds — the
caller gets an explicit `fail`, never a hang.

---

## Wire Events (server-only)

| Event                  | Direction       | Key payload fields                                                                                                 |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ |
| `tool-execute-request` | caller → remote | `{callId, userId, locale, callerSkillId?, callerFavoriteId?, callerPlatform, toolExecutionContext?}` + requestData |
| `tool-execute-result`  | remote → caller | `{callId, status, output?, error?, durationMs, startedAt, executedByInstance?}`                                    |

Declared on the definition with `serverEvent: true, clientDelivery: false`.
They relay through the remote-event-bridge — channel, wire leg, and envelope
format are in `[../websocket/spec.md](../websocket/spec.md)`.

---

## Async Task Management

### Pending-Calls Registry (`repository/pending-calls.ts`)

Global in-memory registry (`globalThis.__vibePendingCalls`) for remote in-flight
calls. Cross-module-graph visible.

- `register` / `complete` / `getReconciled` / `awaitResult` / `discard`
- `setRevival` — await-task or inline-timeout upgrade attaches a revival target
- `hasForThread` — any unresolved calls for a given thread?
- `notifyTaskCompletion` / `waitForTaskCompletion` — local task waiters
- Tombstones kept for late-duplicate suppression
- `getReconciled` reconciles against DB before firing deadline (cross-process safe)

### `await-task`

Intercepts a pending DETACH or WAKE_UP task and delivers the result.

- **Already complete**: result returned inline. Task cleaned up.
  - Source: `chatMessages.metadata.toolCall.result` (via `wakeUpToolMessageId`)
  - Fallback: `cronTaskExecutions.result`
- **Still running**: writes WAIT revival context into `cronTasks.taskInput` (the
  parked resume-stream task), sets `toolExecutionContext.waitingForRemoteResult=true`
  → stream pauses.
- **Remote pending call**: checks pending-calls registry first; attaches revival
  via `PendingCalls.setRevival`.

### `complete/` (the `/report` endpoint)

Direct-POST fallback for reporting a result outside the bridge. Resolves the
pending call, then `TaskCompletion.handle` with result + context from payload.

### `dismiss-task`

Cancels a pending `wakeUp` task. Discards the pending call, transitions thread
to idle, emits `stream-finished`.

---

## Completion Policy (`repository/completion.ts`)

`TaskCompletion.handle` is the ONE post-completion path for every mode and transport:

1. **Backfill** the originating tool message (cache-stable via `sortObjectKeys`).
   Skipped for DETACH (no backfill contract) and WAKE_UP (deferred to revival).
2. **Emit** `TASK_COMPLETED` WS event.
3. **DETACH/END_LOOP**: `clearStreamingState` — thread reconcile to idle/waiting.
4. **WAKE_UP/WAIT**: schedule a `resume-stream` one-shot cron task with full
   revival context in `taskInput`. If `directResumeLocale` provided, claim the
   row and fire resume-stream directly (cron task remains as safety net).

**`parkResumeStreamTask`** — pre-creates a disabled resume-stream task (called
by `await-task` when parking a thread). `enableParkedResumeTask` flips
`enabled=true` when the original task completes.

**`detectWakeUpConfirmRace`** — when `requiresConfirmation=true` meets wakeUp:

- Case A (wakeUp already landed): insert confirm-deferred as leaf child.
- Case B (goroutine still running): clear `waitingForConfirmation`, backfill
  `wakeUpToolMessageId` into the parked task's `taskInput` jsonb, return
  `wakeUpPending=true`.

---

## Tool Self-Escalation (`escalateToTask`)

For tools that may run longer than the stream timeout (SSH, coding-agent):

1. Tool calls `context.escalateToTask(options?)` during execution.
2. `escalation-handler.ts` (ai-stream) creates a RUNNING `cronTasks` row with
   revival context via `TaskCompletion.createEscalationTask`, sets
   `toolExecutionContext.waitingForRemoteResult=true`.
3. Stream aborts via `REMOTE_TOOL_WAIT` → thread → `waiting`.
4. Tool goroutine continues; calls `onComplete(result)` when done.
5. `onComplete` → `TaskCompletion.handle` → revival fires.

This is distinct from execute-tool's local DETACH/WAKE_UP goroutines. Those are
for tools dispatched via execute-tool with an explicit async mode. Escalation is
for tools that START synchronous but discover they need more time.

---

## `approve` Gate

When `callbackMode=approve` or `requiresConfirmation=true`:

1. Tool message written `waitingForConfirmation=true`, placeholder result.
2. Stream aborts via `TOOL_CONFIRMATION` → thread → `idle`.
3. User sees confirmation dialog.
4. **Confirm + wakeUp**: `runInProcess` with mode=WAKE_UP → goroutine + task row
   via execute-tool's normal wakeUp path. Revival fires when done.
5. **Confirm + other**: execute inline, insert deferred message.
6. **Cancel**: tool message marked `isConfirmed=false`, stream resumes.
7. **10-minute timeout**: tool marked cancelled. No revival.

`ToolConfirmationHandler` lives in `agent/ai-stream/` — confirmation is a
stream-lifecycle concern. It calls `RouteExecuteRepository.runInProcess` for
the actual execution; execute-tool owns execution, ai-stream owns stream state.

---

## Entry Points

All converge on `RouteExecutionExecutor.executeGenericHandler`.

### `execute()` — HTTP/AI/MCP door

`RouteExecuteRepository.execute(data, user, locale, logger, t, toolExecutionContext, platform)`.

Full orchestrator: parse `instanceId__toolName` → revival guard → folder check →
permission cascade → dispatch by transport.

### `runInProcessTyped()` — endpoint-to-endpoint door

```typescript
RouteExecuteRepository.runInProcessTyped({
  definition,        // typed endpoint definition
  input,             // typed from definition.types.RequestOutput
  urlPathParams?,    // typed from definition.types.UrlVariablesOutput
  user, locale,
  logger?, toolExecutionContext?, platform?,
  instanceId?, callbackMode?,
})
```

Omitting `instanceId`/`callbackMode` calls `executeGenericHandler` directly
for a raw typed response. Canonical way for one endpoint to invoke another.

### `runAsSystemProvider()` — inference-provider door

Same shape as `runInProcessTyped`, but resolves the user's configured inference
provider and injects its `instanceId` automatically.

---

## Folder Restrictions

Blocks async and remote modes in incognito/public folders:

- Remote tools (`instanceId` set) → `FORBIDDEN`
- Async modes (detach/wakeUp) → `FORBIDDEN`
- Only `wait`, `endLoop`, `approve` allowed in restricted folders

---

## File Map

| File                             | Role                                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `definition.ts`                  | Request/response schema, callback-mode enum, wire-event declarations                           |
| `route.ts`                       | HTTP handler + `onRemoteEvent` wiring for wire events                                          |
| `constants.ts`                   | `CallbackMode`, `EXECUTE_TOOL_ALIAS`, `DISPATCH_HINTS`                                         |
| `widget.tsx`                     | All-platform widget                                                                            |
| `repository/index.ts`            | `RouteExecuteRepository` — top-level dispatch, wire-event handlers                             |
| `repository/core.ts`             | `RouteExecutionExecutor.executeGenericHandler` — lean execution core                           |
| `repository/guards.ts`           | Pre-execution gates: revival circuit-breaker, folder restrictions, permissions, confirmation   |
| `repository/types.ts`            | `RouteExecuteContext`, `PendingCallEntry/Result/Revival`, shared types                         |
| `repository/local.ts`            | `LocalExecution` — sync (wait/endLoop/approve) + async (ONE flow for detach+wakeUp)            |
| `repository/remote.ts`           | `RemoteDispatch` — capability gate, pending-call registration, transport dispatch              |
| `repository/completion.ts`       | `TaskCompletion` — post-completion policy (backfill, emit, thread reconcile, revival schedule) |
| `repository/pending-calls.ts`    | In-memory registry for remote in-flight calls (deadline, tombstone, revival)                   |
| `repository/transport/direct.ts` | `callToolDirect` — control-plane synchronous POST (non-AI, bounded timeout only)               |
| `repository/transport/events.ts` | `emitToolRequest` — `tool-execute-request` emit with caller context                            |
| `repository/transport/wire.ts`   | `resolveCallerFieldDefaults` + `marshalFilesForWire` — wire shaping (both legs)                |
| `await-task/`                    | Waiter registration; intercept completed/pending task; WAIT revival attachment                 |
| `complete/`                      | `/report` endpoint; direct-POST result application to a local task record                      |
| `dismiss-task/`                  | Cancel pending WAKE_UP task; transition thread to idle                                         |

---

## Boundaries

**`escalateToTask` wiring** lives in `agent/ai-stream/repository/core/escalation-handler.ts`.
It is an AI-stream concern: it connects the stream abort mechanism to the task row
and revival flow. Execute-tool has no knowledge of stream abort reasons.

**`ToolConfirmationHandler`** lives in `agent/ai-stream/`. Confirmation is a
stream-lifecycle concern — it manages stream abort, deferred message insertion,
and revival. Execute-tool only executes.

**`resume-stream`** lives in `agent/ai-stream/`. Revival is a stream concern.
Execute-tool schedules it (`TaskCompletion.handle`) but does not implement it.
`RESUME_STREAM_ALIAS` and the revival task schema are owned by ai-stream.
