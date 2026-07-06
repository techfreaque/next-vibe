# Execute-Tool — The Universal Tool Executor

> One endpoint executes any registered tool — local or remote, inline or async,
> from any caller (AI, MCP, CLI, another endpoint, a remote peer). Every tool
> call in the platform funnels through here. There is no second tool-execution
> path.
>
> Cross-instance transport (reverse-ws / direct-http, capability snapshots,
> routing) is the remote layer — `[../../remote-connection/spec.md](../../remote-connection/spec.md)`
> and `[../websocket/spec.md](../websocket/spec.md)` (the event-bridge that carries
> the wire). Stream/revival semantics for AI tool calls are
> `[../../agent/ai-stream/spec.md](../../agent/ai-stream/spec.md)`. This
> spec is the executor itself: its contract, callback modes, transports, and the
> async task lifecycle.

---

## Principles

1. **One executor, every caller.** AI tool calls, MCP relay, CLI commands,
  remote dispatch, and endpoint-to-endpoint calls all route through
   `RouteExecuteRepository`. The low-level core lives at `execute-tool/core.ts`
   (`RouteExecutionExecutor.executeGenericHandler`) — LEAN BY CONTRACT: its
   import graph pulls none of the orchestration, so the next-route hot path
   (handler + definition preloaded) stays light. Every USER-FACING surface goes
   through the repository; the only sanctioned direct core consumers are
   system-internal engines that manage their own guard context (dataflow).
   The target route enforces its own auth — this endpoint is intentionally
   `PUBLIC`. Dispatch ROUTING (`resolveTarget` / `resolveInferenceProvider`)
   lives at `execute-tool/routing.ts` — deciding WHERE work runs is the
   executor's concern; connection rows + bootstrap wire stay in
   `remote-connection`.
2. **Transport is invisible.** The caller passes `toolName + input` and
  optionally `instanceId`. Whether the tool runs in-process, over reverse-ws, or
   via direct-http is resolved internally and never leaks into the caller's
   contract. Same `ResponseType<T>`, same error shape, every path.
3. **Same logic, different wire.** All three transports (local, direct-http,
  reverse-ws) implement identical callback mode semantics. The only difference is
   how bytes travel — never what the modes mean or when revivals fire.
4. **In-process when called from another endpoint.** Endpoint code that needs to
  invoke another tool calls `RouteExecuteRepository.runInProcessTyped({definition,

input, …})` — a typed, definition-driven, no-HTTP call. It does NOT build a
   bespoke cross-module call or re-POST to itself.
5. **Definite outcome, always.** Every call ends as result · explicit failure ·
   deadline timeout. No silent loss, no thread left waiting.
6. **No remote tasks on the caller.** A remote dispatch never writes a task row
   on the caller; revival context rides the wire and returns with the result.

---

## Request / Response

```
POST /api/{locale}/system/execute-tool
alias: execute-tool   (CLI firstCliArg: toolName)

toolName       string   — tool/endpoint name or alias; "instanceId__toolName" routes remotely
input          json     — tool input (default {})
instanceId?    string   — target a named remote instance
callbackMode?  enum     — wait | detach | endLoop | wakeUp | approve (default wait)

→ result?   json    — the target route's data (inline modes)
  taskId?   string  — async/remote handle (hidden field)
  hint?     string  — status message for the AI (hidden field)
  status?   enum    — completed | failed (hidden; explicit outcome on the
                      tool-execute-result wire — never inferred from hint presence)
```

Auth: `PUBLIC` + all authenticated roles + `MCP_VISIBLE`. The **target** route's
`allowedRoles` is what actually gates execution.

---

## The 5 Callback Modes

The mode controls timing and revival — never UI or transport. The same mode means
the same thing on every transport.


| Mode      | Returns                              | Loop        | Failure                                       |
| --------- | ------------------------------------ | ----------- | --------------------------------------------- |
| `wait`    | result inline                        | continues   | `fail()` inline; AI sees the error            |
| `endLoop` | result inline, then stream ends      | stops       | `fail()` inline                               |
| `detach`  | `{taskId, status:"pending"}`         | continues   | failure recorded in task history (await-task) |
| `wakeUp`  | `{taskId, status:"pending"}`         | continues   | revival fires with the error                  |
| `approve` | blocks on user confirmation (10 min) | stops batch | timeout → cancelled                           |


**Detach never backfills.** The dispatch tool message permanently keeps
`{taskId}`; the result (or failure) lives ONLY in task execution history and is
retrieved via `await-task` (which upgrades the task to WAIT semantics). This is
detach's contract on every transport.

**Remote `wait` auto-upgrade:** In revival streams (`isRevival=true`), remote
`wait` auto-upgrades to `wakeUp` to avoid a hung revival loop (circuit breaker in
`handlers/guards.ts`). The executor decides this; tools never pick their own mode.

---

## The 3 Transport Paths

Every callback mode runs on every transport. The transport only changes the wire
mechanics — not the semantics.

### Local (in-process)

Tool has no `instanceId`. Routed through `repository.ts` → the appropriate local
handler in `handlers/local.ts`.


| Mode              | Handler              | Mechanism                                                 |
| ----------------- | -------------------- | --------------------------------------------------------- |
| `wait`/`endLoop`  | `handleLocalExecute` | Inline via `RouteExecutionExecutor.executeGenericHandler` |
| `detach`/`wakeUp` | `handleLocalAsync`   | ONE shared flow: task row RUNNING + goroutine, `{taskId}` |
| `approve`         | `handleLocalExecute` | Confirmation gate, returns placeholder ends the ai loop   |


**Local async lifecycle (`handleLocalAsync`, identical for both modes):**

1. Insert `cronTasks` row with `lastExecutionStatus=RUNNING` (cron pulse never
  claims it). On the receiver side of a remote dispatch the row ID IS the
   requester's callId — one task identity names the work on both instances.
2. Spawn fire-and-forget goroutine (fresh AbortController — survives parent
  stream death): `executeInGoroutine` → insert `cronTaskExecutions` (the
   durable result store for every mode).
3. **Claim CAS (`claimCompletion`)**: flip the row terminal ONLY IF
  `wakeUpCallbackMode` still equals the dispatch mode. Claim LOST =
   `await-task` upgraded the task to a waiter — force the row terminal and fire
   the WAITER's revival (WAIT/WAKE_UP) with the waiter's context. Both async
   modes get identical upgrade-race protection.
4. Claim WON → `fireTaskCompletion` with the dispatch mode's policy
  (`handlers/completion.ts`): DETACH → no backfill, no revival, TASK_COMPLETED
   emit + thread reconcile; WAKE_UP → revival scheduled (deferred result via
   resume-stream).
5. Return `{taskId, hint}` immediately — hints come from `DISPATCH_HINTS`
  (identical text on every transport).

---

### Remote: Direct-HTTP

`instanceId` resolves to a `remote_connections` row with `transportMode=direct-http`.


| Mode              | Mechanism                                                         |
| ----------------- | ----------------------------------------------------------------- |
| `wait`/`endLoop`  | Blocking HTTP POST (`callToolDirect`), result returned inline     |
| `detach`/`wakeUp` | `tool-execute-request` event over the bridge (same as reverse-ws) |


For `wait`/`endLoop`, `callToolDirect` POSTs the tool to the peer's execute-tool
endpoint and the response IS the result. On network/HTTP failure →
`fail(EXTERNAL_SERVICE_ERROR)` (no cross-leg retry — see Transport Failover).
Async modes ride the event path below; only the wire leg differs.

---

### Remote: Event transport (reverse-WS leg, or direct-http async)

All non-inline remote calls dispatch as `tool-execute-request` events over the
remote-event-bridge; the bridge picks the wire leg per connection.


| Mode              | Stream behavior                                                  |
| ----------------- | ---------------------------------------------------------------- |
| `wait`/`endLoop`  | Result returns inline at WS speed; stream never enters `waiting` |
| `detach`/`wakeUp` | Fire-and-forget; revival fires when result event arrives         |


**Requester (`handlers/remote.ts` → `emitToolRequest`):**

1. `registerPendingCall(callId, deadline, onDeadline)` — in-memory registry.
  ONE shared `onDeadline` for every mode (fails the call + fires the waiter's
   or the original call's revival).
2. Emit the `tool-execute-request` event (relayed over the bridge's leg).
3. Return `{taskId: callId, hint}` immediately for `detach`/`wakeUp`; for
  `wait`/`endLoop`, block on the pending-call registry (deadline-bounded).
4. `tool-execute-result` arrives (explicit `status` field — never inferred
  from hint presence) → `completePendingCall` resolves the entry, wakes
   waiters, fires the revival callback for parked wakeUps.
5. Two timers bound the call. The **inline WAIT timeout** (the tool's
  `timeoutMs`, default 90s) is how long the stream blocks before
   auto-upgrading to wakeUp (the call stays alive, the thread parks). The
   **deadline backstop** (`PENDING_CALL_DEADLINE_MS`, 15 min) is the hard
   outcome guarantee. No call is ever left pending forever.
6. `pendingCallId` is persisted on the tool message for WAKE_UP ONLY (restart-
  safe revival + dismiss-task). Detach stores none — its no-revival contract
   survives requester restarts.

**Receiver (`repository.ts` → `handleIncomingToolRequest`):**

- `wait`/`endLoop`: runs the tool inline (local WAIT) and emits the result.
- `detach`/`wakeUp`: the receiver OWNS the work as a REAL local async task —
same `handleLocalAsync` flow as a local dispatch, with the task-row ID set to
the requester's callId (`streamContext.remoteDispatchCallId`). ONE task
identity names the work on both instances, and the receiver's
`cronTaskExecutions` history is the durable result store — `await-task`
(locally or targeted at the receiver via `instanceId`) finds the result even
after the requester's in-memory tombstone expires. When the goroutine
settles, the `onAsyncTaskSettled` hook relays the outcome back as the
`tool-execute-result` event (real error message preserved).

**Pending-calls registry (`pending-calls.ts`):**

- `registerPendingCall` / `completePendingCall` / `getPendingCallReconciled`
- Tombstones kept (late duplicate suppression).
- `setPendingCallRevival` — `await-task` (or the inline-timeout upgrade) attaches a WAIT/wakeUp revival target to an in-flight call.
- `getPendingCallReconciled` — reconciles unresolved entries against DB before firing the deadline (process-restart / cross-process safe).

---

## Transport Failover

**There is none — by design, not as a gap.** Each connection dispatches over its one
negotiated leg; `callToolDirect` failing returns `fail(EXTERNAL_SERVICE_ERROR)` with no
cross-leg retry. Dispatch-time failover is not architecturally possible:

- **direct-http → reverse-ws is impossible.** Reverse-ws can't be opened on demand by the
caller — the socket must already be held open by the *peer* (the NAT'd side dials out and
keeps it up). The caller cannot conjure it when a direct-http call fails.
- **reverse-ws → direct-http is moot.** A peer is on reverse-ws precisely because it is *not*
HTTP-reachable (behind NAT). If direct-http were reachable, negotiation would already have
chosen it. So there is no live direct-http leg to fall back to.

A leg is therefore a property of the peer's reachability, settled at connect/ping time
(see `[../../remote-connection/spec.md](../../remote-connection/spec.md)` → Transport).
A down leg is a hard failure; the definite-outcome contract still holds (the caller gets an
explicit `fail`, never a hang).

## Wire Events (server-only)


| Event                  | Direction       | Payload                                                                         |
| ---------------------- | --------------- | ------------------------------------------------------------------------------- |
| `tool-execute-request` | caller → remote | `{callId, toolName, args, wakeUp* revival context, userId, locale}`             |
| `tool-execute-result`  | remote → caller | `{callId, status, output?, error?, durationMs, startedAt, executedByInstance?}` |


Both are declared on the definition with `serverEvent: true, clientDelivery: false`. They relay through the remote-event-bridge like any cross-instance event —
wire envelope, channel (the bridge endpoint's user-scoped channel, subscribed
only by the peer's connector), and leg selection are in
`[../websocket/spec.md](../websocket/spec.md)`. The remote-connection layer
(`[../../remote-connection/spec.md](../../remote-connection/spec.md)`) owns
the connection rows and transport negotiation those legs read.

---

## Async Task Management

### `await-task`

Intercepts a pending task (DETACH or WAKE_UP) and delivers the result to the
waiting stream.

- Task **already complete**: result returned inline. Stream continues. Task cleaned up.
  - Result source: `chatMessages.metadata.toolCall.result` (via `wakeUpToolMessageId`)
  - Fallback: `cronTaskExecutions.result` (headless/no stream context)
- Task **still running**: writes WAIT revival context onto the `cronTasks` row
(`wakeUpCallbackMode=wait`, `wakeUpThreadId`, `wakeUpToolMessageId`), sets
`streamContext.waitingForRemoteResult=true` → stream pauses.
- Remote pending call: checks `pending-calls` registry first; attaches revival via
`setPendingCallRevival`.

### `complete/` (the `/report` endpoint)

Called by remote instances when a `detach`/`wakeUp` tool finishes (direct-http
transport only). Calls `handleTaskCompletion` with the result + context recovered
from the wire payload.

### `dismiss-task`

Cancels a pending `wakeUp` task. Discards the pending call, transitions thread to
idle, emits `stream-finished`. For WAKE_UP tasks that the AI no longer needs.

---

## Tool Self-Escalation (`escalateToTask`)

For tools that may run longer than the stream timeout (SSH sessions, coding-agent
interactive mode):

1. Tool calls `streamContext.escalateToTask(options?)` during execution.
2. `escalation-handler.ts` (ai-stream): creates a RUNNING `cronTasks` row with
  wakeUp context, sets `streamContext.waitingForRemoteResult=true`.
3. Stream aborts via `REMOTE_TOOL_WAIT` → thread → `waiting`.
4. Tool goroutine continues independently, calls `onComplete(result)` when done.
5. `onComplete` calls `handleTaskCompletion` → revival fires.

The `callbackMode` passed to `escalateToTask` is the one the AI requested. The
tool does not pick its own mode — it receives the mode as `callerCallbackMode` on
the stream context.

**This is distinct from execute-tool's local DETACH/WAKE_UP goroutines.** Those
are for tools dispatched via execute-tool with an explicit async mode. Escalation
is for tools that START as synchronous (WAIT mode) but discover during execution
that they need more time.

---

## `approve` Gate

When `callbackMode=approve` (or `requiresConfirmation=true` on the endpoint):

1. Tool message written with `waitingForConfirmation=true`, placeholder result.
2. Stream aborts via `TOOL_CONFIRMATION` → thread → `idle` (not `waiting`).
3. User sees confirmation dialog.
4. On **confirm**: `ToolConfirmationHandler` (ai-stream) calls
  `RouteExecuteRepository.runInProcess` with:
  - WAKE_UP → execute via `local-wakeup.ts` (goroutine, revival handles delivery).
  - Other modes → override to WAIT, execute inline, insert deferred message.
5. On **cancel**: tool message marked `isConfirmed=false`, stream resumes with cancellation.
6. **10-minute timeout**: tool marked cancelled, no revival.

The confirmation handler unwraps `execute-tool` wrappers to avoid double-nesting —
except for WAKE_UP, where `execute-tool` owns goroutine/task creation.

---

## Entry Points

All three converge on `RouteExecutionExecutor.executeGenericHandler`.

### 1. `execute()` — HTTP/AI/MCP door

`RouteExecuteRepository.execute(data, user, locale, logger, t, streamContext, platform)`.

Full orchestrator: parses `instanceId__toolName`, applies revival guard, checks
folder restrictions, lazily resolves the favorite/skill/model cascade (only for
remote or wakeUp calls), validates capabilities fail-closed for remote dispatch,
pre-resolves the TARGET's caller-context `fieldDefaults` before remote dispatch
(uniformly for every tool — no per-tool special cases), dispatches by transport,
creates the async task for `detach`/`wakeUp` when local.

### 2. `runInProcessTyped()` — endpoint-to-endpoint door

```typescript
RouteExecuteRepository.runInProcessTyped({
  definition,            // the target endpoint definition (typed)
  input,                 // typed from definition.types.RequestOutput
  urlPathParams?,        // typed from definition.types.UrlVariablesOutput
  user, locale,
  logger?, streamContext?, platform?,
  instanceId?, callbackMode?,   // omit both → pure local in-process call
}): Promise<ResponseType<definition.types.ResponseOutput>>
```

Typed end-to-end. Omitting `instanceId`/`callbackMode` calls
`executeGenericHandler` directly for the raw typed response. This is the canonical
way for one endpoint to invoke another — media-generation providers, AI pre-calls,
and cross-feature calls use it.

### 3. `runAsSystemProvider()` — inference-provider door

Same shape as `runInProcessTyped`, but resolves the user's configured inference
provider and injects its `instanceId` automatically. Used by media generation
delegating to the cloud.

---

## Folder Restrictions

`folder-restrictions.ts` blocks async and remote modes in incognito/public folders:

- Remote tools (`instanceId` set) → `FORBIDDEN`
- Async modes (detach/wakeUp) → `FORBIDDEN`
- Only `wait`, `endLoop`, `approve` are allowed in restricted folders

---

## File Map


| File / Dir               | Role                                                                                                                                                                                                                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `definition.ts`          | Request/response fields (incl. wire `status`), callback-mode enum, wire-event declarations                                                                                                                                                                                                                           |
| `repository.ts`          | `execute`, `runInProcessTyped`, `runAsSystemProvider`, top-level dispatch, wire-event handlers (`handleIncomingToolRequest`, `handleToolResult`)                                                                                                                                                                     |
| `route.ts`               | `endpointsHandler` + `onRemoteEvent` wiring for wire events                                                                                                                                                                                                                                                          |
| `constants.ts`           | `CallbackMode`, `EXECUTE_TOOL_ALIAS`, `AWAIT_TASK_ALIAS`, `DISPATCH_HINTS` (the shared AI-facing hint texts — one definition per hint, every transport)                                                                                                                                                              |
| `pending-calls.ts`       | In-memory registry for remote in-flight calls (deadline, tombstone, revival)                                                                                                                                                                                                                                         |
| `widget.tsx`             | All-platform widget                                                                                                                                                                                                                                                                                                  |
| `handlers/types.ts`      | `RouteExecuteContext` (immutable snapshot), `PhaseResult` discriminator                                                                                                                                                                                                                                              |
| `handlers/guards.ts`     | Pre-execution gates: revival circuit-breaker (WAIT→WAKE_UP), folder restrictions, tool-permission cascade                                                                                                                                                                                                            |
| `handlers/local.ts`      | Local execution — sync (`handleLocalExecute`: WAIT/endLoop/approve gate) + async (`handleLocalAsync`: ONE flow for DETACH+WAKE_UP — task row, goroutine, `claimCompletion` CAS against await-task upgrades) + goroutine primitives (`generateTaskId`, `executeInGoroutine`, `createLocalTask`, `fireTaskCompletion`) |
| `handlers/remote.ts`     | Remote dispatch — capability gate + generic caller field-defaults resolution (`fieldDefaults` on the target handler, NO per-tool special cases), transports (`callToolDirect` direct-http inline / `emitToolRequest` event relay), requester-side revival (`fireRevival`/`resolveRevivalTarget`)                     |
| `handlers/completion.ts` | Task completion — `handleTaskCompletion` (mode policy: backfill / TASK_COMPLETED emit / thread reconcile / revival scheduling), wakeUp-confirm race (Case A/B), escalation task row, `resolveStreamModelId`                                                                                                          |
| `await-task/`            | Waiter registration; intercept completed/pending task; WAIT revival attachment                                                                                                                                                                                                                                       |
| `complete/`              | `/report` endpoint; result delivery from remote (direct-http only)                                                                                                                                                                                                                                                   |
| `dismiss-task/`          | Cancel pending WAKE_UP task; transition thread to idle                                                                                                                                                                                                                                                               |


---

## What Does NOT Belong Here

`**escalateToTask` wiring lives in `agent/ai-stream/repository/core/escalation-handler.ts**`,
not here. It is an AI-stream concern: it connects the stream abort mechanism
(`REMOTE_TOOL_WAIT`) to the task row and revival flow. Execute-tool has no
knowledge of stream abort reasons.

`**ToolConfirmationHandler` lives in `agent/ai-stream/**`, not here. Confirmation
is a stream-lifecycle concern — it manages the stream abort, the deferred message
insertion, and the revival decision. Execute-tool only executes; it does not manage
stream state.

`**resume-stream` lives in `agent/ai-stream/**`. Revival is a stream concern.
Execute-tool schedules it (via `handleTaskCompletion`) but does not implement it.