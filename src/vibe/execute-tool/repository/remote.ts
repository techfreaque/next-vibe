/**
 * Remote dispatch — capability gate + caller field-defaults, transports
 * (direct-http inline / event relay), requester-side revival.
 *
 * Encapsulates the whole `if (instanceId && !user.isPublic)` branch of
 * RouteExecuteRepository.execute(): input stripping, task deduplication,
 * capability validation (fail-closed), APPROVE short-circuit, then transport
 * dispatch over the connection's single negotiated leg.
 *
 * NOTE: there is no dispatch-time failover between legs, by design — a failed
 * direct-http call returns EXTERNAL_SERVICE_ERROR. Cross-leg retry is impossible:
 * reverse-ws can't be opened on demand (the NAT'd peer holds it open), and a
 * reverse-ws peer is unreachable over HTTP by definition. See
 * execute-tool/spec.md → Transport Failover.
 */

import "server-only";

import { eq, sql as drizzleSql } from "drizzle-orm";
import { getPreferredName } from "next-vibe/core/core-utils/path";
import { Platform } from "next-vibe/core/definition/platform";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import { CronTaskStatus } from "next-vibe/tasks/enum";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import {
  CallbackMode,
  type CallbackModeValue,
  DISPATCH_HINTS,
} from "../constants";
import type { RouteExecuteRequestOutput } from "../definition";
import { TaskCompletion } from "./completion";
import { ExecuteToolGuards } from "./guards";
import { LocalExecution } from "./local";
import { PendingCalls } from "./pending-calls";
import { ResultSignals } from "./result-signals";
import { callToolDirect } from "./transport/direct";
import { emitToolRequest } from "./transport/events";
import {
  marshalFilesForWire,
  resolveCallerFieldDefaults,
  resolveCallerRequestDefaults,
} from "./transport/wire";
import type {
  PendingCallResult,
  PhaseResult,
  RemoteConnInfo,
  RouteExecuteContext,
} from "./types";

export class RemoteDispatch {
  /** Default inline WAIT timeout when the tool declares none. */
  private static readonly DEFAULT_INLINE_TIMEOUT_MS = 90_000;
  /** Effectively-infinite inline wait for tools declaring timeoutMs: 0. */
  private static readonly NO_TIMEOUT_INLINE_MS = 24 * 60 * 60 * 1000;
  /** Deadline backstop for the requester-local pending call. */
  private static readonly PENDING_CALL_DEADLINE_MS = 15 * 60 * 1000;

  /**
   * Run the remote dispatch path. `ctx.toolName` is the post-prefix name; this
   * method normalizes it to the preferred name internally and uses that for
   * all transport calls (so the local ctx.toolName is left untouched).
   * The remote path always resolves to a "return" PhaseResult once the
   * connection exists (never falls back to the local path).
   */
  static async dispatch(params: {
    ctx: RouteExecuteContext;
    data: RouteExecuteRequestOutput;
    input: RouteExecuteRequestOutput["input"];
    instanceId: string;
  }): Promise<PhaseResult> {
    const { ctx, data, input, instanceId } = params;
    const { user, logger, t, streamContext, platform } = ctx;

    // Strip instanceId from input for AI tool calls — the remote instance executes
    // the tool locally; leaving it in makes endpoints like tool-help interpret it as
    // "proxy to another remote instance" and self-referentially loop. Control-plane
    // calls (non-AI: remote-connection PATCH/DELETE etc.) keep instanceId — there it
    // is a legitimate resource URL param, not a routing hint.
    // eslint-disable-next-line no-unused-vars
    const { instanceId: _stripInstanceId, ...remoteInputStripped } =
      input ?? {};
    const remoteInput =
      platform === Platform.AI ? remoteInputStripped : (input ?? {});
    let strippedInput: Record<string, WidgetData> | null =
      Object.keys(remoteInput).length > 0 ? remoteInput : null;

    // Pre-resolve the target's requestDefaults (patch always wins — replaces
    // stale AI example values) then fieldDefaults (only fills absent fields).
    // Both run with CALLER context so the peer gets the resolved values.
    const preferredName = getPreferredName(ctx.toolName);
    strippedInput = await resolveCallerRequestDefaults({
      ctx,
      toolName: preferredName,
      input: strippedInput,
    });
    strippedInput = await resolveCallerFieldDefaults({
      ctx,
      toolName: preferredName,
      input: strippedInput,
    });

    // File objects cannot ride the JSON wire (they stringify to {}). Marshal
    // them to the base64 shape endpoint file-field schemas accept as the wire
    // alternative ({ filename, mimeType, data }) — the receiving side's zod
    // union transforms it back into a File.
    strippedInput = await marshalFilesForWire(strippedInput);

    // Normalize incoming toolName to preferred name (alias > canonical).
    // Capabilities are stored using the preferred name so both alias and
    // full-path forms resolve to the same snapshot entry.
    const toolName = preferredName;
    // Transport handlers operate on the preferred name.
    const transportCtx: RouteExecuteContext = { ...ctx, toolName };

    logger.debug("[RouteExecute] Remote dispatch", {
      toolName,
      instanceId,
    });

    const { RemoteConnectionRepository } =
      await import("next-vibe/remote-connection/repository");
    if (user.isPublic) {
      return { kind: "fallthrough" };
    }
    const connInfo = await RemoteConnectionRepository.getConnectionForInstance(
      user.id,
      instanceId,
    );

    // A real connection row is required either way — it resolves the wire leg.
    if (connInfo === null) {
      logger.warn("[RouteExecute] no connection for instance - rejecting", {
        toolName,
        instanceId,
      });
      return {
        kind: "return",
        value: fail({
          message: t("executeTool.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { toolName },
        }),
      };
    }

    // The capability snapshot constrains what the AI may call on a peer — an
    // AI-tool guardrail (fail-closed before the first sync so the model can't reach
    // arbitrary remote endpoints). Internal control-plane calls (non-AI platforms:
    // the remote-event bridge relay, connection-control PATCHes) target known
    // framework endpoints and are NOT gated — they must work during connection
    // setup, before any capability sync has completed.
    if (platform === Platform.AI) {
      const known =
        connInfo.capabilities?.some((c) => c.toolName === toolName) ?? false;
      if (!known) {
        logger.warn(
          "[RouteExecute] toolName not in capability snapshot - rejecting",
          {
            toolName,
            instanceId,
            knownCount: connInfo.capabilities?.length ?? 0,
          },
        );
        return {
          kind: "return",
          value: fail({
            message: t("executeTool.post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: { toolName },
          }),
        };
      }
    }

    const callbackMode = data.callbackMode ?? CallbackMode.WAIT;

    // requiresConfirmation applies to the TARGET tool wherever it runs — the
    // same shared gate as the local path. Without this, routing a gated tool
    // through a remote instance silently bypasses its confirmation requirement.
    if (platform === Platform.AI) {
      const gate = await ExecuteToolGuards.applyConfirmationGate({
        toolName,
        data: { callbackMode: data.callbackMode },
        streamContext,
        logger,
      });
      if (gate) {
        return { kind: "return", value: success({ result: gate }) };
      }
    }

    // APPROVE on a remote tool: return placeholder immediately — same as local APPROVE.
    // The stream aborts at finish-step; the real result is injected by resume-stream.
    // No remote dispatch needed; the approval flow is handled entirely locally.
    if (callbackMode === CallbackMode.APPROVE) {
      logger.debug(
        "[RouteExecute] APPROVE mode on remote tool - returning placeholder (same as local)",
        { toolName, instanceId },
      );
      return {
        kind: "return",
        value: success({
          result: { status: "waiting_for_confirmation", toolName },
        }),
      };
    }

    // Get threadId and tool message ID from streamContext (set by the calling AI stream).
    // tools-loader injects currentToolMessageId from pendingToolMessages before execute() runs.
    const remoteResult = await RemoteDispatch.dispatchOverTransport({
      ctx: transportCtx,
      connInfo,
      instanceId,
      callbackMode,
      strippedInput,
      effectiveThreadId: streamContext.threadId,
      effectiveToolMessageId:
        streamContext.currentToolMessageId ?? streamContext.aiMessageId,
    });
    if (remoteResult.kind === "return") {
      return remoteResult;
    }

    // Transport unavailable (public user / unknown transport) — fail immediately.
    // "Network Error", not "Tool Not Found": the tool exists, the wire doesn't.
    logger.warn("[RouteExecute] Transport unavailable — failing immediately", {
      toolName,
      instanceId,
      transportMode: connInfo.transportMode,
    });
    return {
      kind: "return",
      value: fail({
        message: t("executeTool.post.errors.network.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      }),
    };
  }

  /**
   * Persist the pendingCallId on the tool message so detach can cancel the
   * revival, and so a late result event can revive even after a requester restart
   * (the tool message holds the revival metadata; the result event carries callId).
   *
   * `inline: true` marks an anchor written by a LIVE inline WAIT (the stream is
   * blocked in PendingCalls.awaitResult, not parked): a sibling process receiving
   * the result must ONLY persist the durable handoff row — firing a wakeUp
   * revival against a live stream double-delivers (deferred message + stamped
   * original while the waiter also resolves). Parking (wakeUp dispatch, WAIT
   * auto-upgrade, await-task) writes inline: false so revival stays armed.
   */
  static async storePendingCallId(
    toolMessageId: string,
    callId: string,
    logger: RouteExecuteContext["logger"],
    inline = false,
  ): Promise<void> {
    const { chatMessages } = await import("next-vibe/agent/chat/db");
    // jsonb_set path-merge: only set toolCall.pendingCallId. A top-level `||` merge
    // would REPLACE the whole toolCall object, wiping toolCallId/toolName/args/status
    // (remote wakeUp never rewrites the row, so the clobber would persist into
    // resume-stream and defeat the deferred-idempotency query). The inner jsonb_set
    // guarantees the intermediate toolCall object exists (jsonb_set only creates the
    // LAST path element) while preserving any existing toolCall fields.
    await db
      .update(chatMessages)
      .set({
        metadata: drizzleSql`jsonb_set(
          jsonb_set(
            jsonb_set(
              COALESCE(metadata, '{}'::jsonb),
              '{toolCall}',
              COALESCE(metadata->'toolCall', '{}'::jsonb),
              true
            ),
            '{toolCall,pendingCallId}',
            ${JSON.stringify(callId)}::jsonb,
            true
          ),
          '{toolCall,pendingCallInline}',
          ${JSON.stringify(inline)}::jsonb,
          true
        )`,
      })
      .where(eq(chatMessages.id, toolMessageId))
      .catch((err: Error) => {
        logger.warn(
          "[RouteExecute] Failed to store pendingCallId in tool message",
          {
            toolMessageId,
            callId,
            error: err.message,
          },
        );
      });
  }

  /* ── Transport internals ────────────────────────────────────────────────── */

  /**
   * Dispatch over the connection's transport. direct-http WAIT/END_LOOP (and
   * bounded control-plane calls) make a synchronous HTTP call to the peer's
   * execute-tool endpoint (result inline); everything else emits the
   * definition-driven `tool-execute-request` event via createEndpointEmitter —
   * the bridge picks the wire leg from the connection's transportMode. The
   * RECEIVER owns the work as its own local task and emits a
   * `tool-execute-result` event back; the requester resolves it via its own
   * in-memory pending-call registry (NO cross-instance task on the requester).
   *
   *   WAIT/END_LOOP — block inline on the result (PendingCalls.awaitResult). On
   *     timeout, auto-upgrade to wakeUp: store the revival context + pendingCallId
   *     so the deadline backstop / late result event revives the parked thread.
   *   detach/wakeUp — register the pending call with revival context, return
   *     { taskId, hint } immediately. handleToolResult fires revival when the
   *     result event arrives.
   */
  private static async dispatchOverTransport(params: {
    ctx: RouteExecuteContext;
    connInfo: RemoteConnInfo;
    instanceId: string;
    callbackMode: CallbackModeValue;
    strippedInput: Record<string, WidgetData> | null;
    effectiveThreadId: string | undefined;
    effectiveToolMessageId: string | undefined;
  }): Promise<PhaseResult> {
    const {
      ctx,
      instanceId,
      callbackMode,
      strippedInput,
      effectiveThreadId,
      effectiveToolMessageId,
    } = params;
    const {
      toolName,
      resolvedModelId,
      user: rawUser,
      locale,
      logger,
      t,
      streamContext,
      platform,
    } = ctx;
    if (rawUser.isPublic) {
      return { kind: "fallthrough" };
    }
    const user = rawUser;

    const callId = LocalExecution.generateTaskId("remote-ws", {
      instanceId,
      toolCallId: streamContext.callerToolCallId,
      streamContext,
    });

    // Shared deadline backstop: after PENDING_CALL_DEADLINE_MS with no result
    // event, fail the call and fire the revival (waiter target if await-task
    // attached one, else the original call's context). Identical for every mode
    // — only registration params differ per mode below.
    const onDeadline = async (): Promise<void> => {
      const errorMessage = `Remote call deadline exceeded dispatching ${toolName} to ${instanceId}`;
      const outcome = PendingCalls.complete(callId, {
        status: "failed",
        output: { error: errorMessage },
      });
      if (outcome.kind !== "completed") {
        return;
      }
      // Parked task (created at wakeUp dispatch or WAIT auto-upgrade) carries full
      // revival context — just merge the failure output and fire. Falls back to
      // reviveFromToolMessage (restart-safe) if no parked task exists (detach).
      const firedParked = await TaskCompletion.enableAndFireParkedResumeTask({
        taskId: callId,
        status: "failed",
        output: { error: errorMessage },
        locale,
        logger,
        abortSignal: new AbortController().signal,
      });
      if (!firedParked && effectiveToolMessageId) {
        // No parked task (DETACH or missing) — fall back to direct handle() with
        // full context from dispatch. For DETACH this is a no-op (no revival wanted).
        await TaskCompletion.handle({
          toolMessageId: effectiveToolMessageId,
          threadId: effectiveThreadId ?? null,
          callbackMode,
          status: CronTaskStatus.FAILED,
          output: { error: errorMessage },
          taskId: callId,
          modelId: resolvedModelId,
          skillId: streamContext.skillId ?? null,
          favoriteId: streamContext.favoriteId ?? null,
          leafMessageId: streamContext.leafMessageId ?? null,
          subAgentDepth: streamContext.subAgentDepth ?? 0,
          ownerUser: user,
          logger,
          directResumeLocale: locale,
          abortSignal: new AbortController().signal,
        });
      }
    };

    // ── Control-plane: synchronous HTTP call, result inline ──────────────────
    // A blocking POST to the peer's execute-tool endpoint — the result IS the
    // response. Reserved for non-AI control-plane calls (connection setup/
    // control runs before a reverse-ws connector or back-connection exists and
    // must not ride the event path). AI tool dispatch ALWAYS rides the
    // tool-execute-request event protocol — on direct-http connections the
    // bridge delivers it over the HTTP leg — so caller context (skill/favorite/
    // platform) travels in the event payload envelope, resolved by execute-tool
    // itself; no wire-internal headers, no core involvement. Unbounded agent
    // loops (timeoutMs: 0 — the RELAY) never use inline HTTP either: a
    // synchronous POST has hard client/proxy ceilings (~300s) and a dropped
    // response leaves a zombie loop running server-side.
    const connInfo = params.connInfo;
    const { token } = connInfo;
    const dispatchToolDef = await getEndpoint(toolName);
    const isBounded = dispatchToolDef?.timeoutMs !== 0;
    // Use the SYNCHRONOUS inline HTTP leg (callToolDirect — result in the HTTP
    // response) when:
    //   - control-plane (non-AI, bounded) calls, OR
    //   - AI-platform WAIT/END_LOOP over DIRECT-HTTP: direct-http has no reverse
    //     channel for a tool-execute-result EVENT to come back on, so the async
    //     event path (emitToolRequest + awaitResult) can never receive the
    //     result → the inline wait "times out" and wrongly upgrades to wakeUp.
    //     A synchronous POST returns the result inline, which is exactly WAIT
    //     semantics. detach/wakeUp still use the async path (they return a
    //     taskId immediately and revive later).
    const isBlockingMode =
      callbackMode === CallbackMode.WAIT ||
      callbackMode === CallbackMode.END_LOOP;
    const isDirectHttpBlockingAi =
      platform === Platform.AI &&
      isBlockingMode &&
      connInfo.transportMode === "direct-http";
    const useInlineHttp =
      isBounded && (platform !== Platform.AI || isDirectHttpBlockingAi);
    if (token !== null && useInlineHttp) {
      const direct = await callToolDirect({
        remoteUrl: connInfo.remoteUrl,
        token,
        leadId: connInfo.leadId,
        toolName,
        input: strippedInput,
        locale,
        logger,
        toolTimeoutMs: dispatchToolDef?.timeoutMs,
      });
      if (direct.ok) {
        // No transport attestation here: this inline leg also serves
        // control-plane reads (mirror-back GETs, connection PATCHes) that would
        // clobber the EVENT-protocol attestation right after a relay. The
        // lastTransportUsed stamp belongs to pushRemoteEvent's delivery legs —
        // the wire the relay actually rode.
        return { kind: "return", value: success(direct.data) };
      }
      // Propagate the peer's real error message (e.g. "Read-Only") — an opaque
      // "not found" would mislead the AI about a tool that exists but refused.
      return {
        kind: "return",
        value: fail({
          message: direct.remoteMessage
            ? t("executeTool.post.errors.remoteFailed.title", {
                message: direct.remoteMessage,
              })
            : t("executeTool.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: { toolName },
        }),
      };
    }

    logger.debug("[RouteExecute] Remote dispatch (event)", {
      toolName,
      instanceId,
      callbackMode,
      callId,
    });

    // Hold the outbound connector open until the RESULT settles. On a reverse-ws
    // topology the tool-execute-result arrives over OUR connector's subscription
    // on the peer's hub — a hub emit with no live subscriber vanishes without a
    // trace. Streams release their connector ref when the turn ends, but parked
    // dispatches (wakeUp) settle MINUTES later — without this ref the connector
    // idle-closes in between and the result is lost. Released via the pending
    // call's onSettled (result, discard, or deadline — exactly once).
    // Best-effort with a hard 10s bound: a DEAD connector here is far worse
    // than a delayed dispatch — the request event emitted onto a closed socket
    // parks in the queue until something else reopens the connection (observed:
    // 13-minute waits). 10s covers a full WS reconnect handshake; on timeout the
    // dispatch proceeds unheld and the late-resolving ref is released
    // immediately (no leak).
    // The RESULT rides OUR outbound connector's hub subscription ONLY when the
    // PEER reaches us via reverse-ws (remoteTransportMode === "reverse-ws"): then
    // it publishes the tool-execute-result on its hub and our connector receives
    // it, so the connector must stay open until the result settles. When the peer
    // reaches us via direct-http it POSTs the result to our bridge over HTTP —
    // no connector needed, and holding one causes spurious WS connect attempts to
    // an instance that may run no WS server. So gate on remoteTransportMode (the
    // result leg), NOT our own transportMode (our request leg).
    const peerReachesUsViaReverseWs =
      connInfo.remoteTransportMode === "reverse-ws";
    const releaseConnectorRef: () => void = !peerReachesUsViaReverseWs
      ? () => undefined
      : await new Promise((resolve) => {
          let settled = false;
          const settle = (release: () => void, lateRelease: boolean): void => {
            if (settled) {
              if (lateRelease) {
                release();
              }
              return;
            }
            settled = true;
            resolve(release);
          };
          const timer = setTimeout(() => {
            settle(() => undefined, false);
          }, 10_000);
          import("next-vibe/realtime/connector")
            .then(async (m) => m.acquireConnection(instanceId))
            .then((release) => {
              clearTimeout(timer);
              settle(release, true);
              return undefined;
            })
            .catch(() => {
              clearTimeout(timer);
              settle(() => undefined, false);
            });
        });

    // ── detach / wakeUp: fire-and-forget ──────────────────────────────────────
    // Register a requester-local pending call carrying the revival context, emit
    // the request, return immediately. handleToolResult fires revival when the
    // result event arrives; the deadline backstop covers a lost result.
    if (
      callbackMode === CallbackMode.DETACH ||
      callbackMode === CallbackMode.WAKE_UP
    ) {
      PendingCalls.register({
        callId,
        instanceId,
        toolName,
        // The awaited tool's inputs, so await-task can render the tool being awaited.
        input: strippedInput,
        // wakeUp parks the thread; detach leaves it idle.
        threadId:
          callbackMode === CallbackMode.WAKE_UP
            ? (effectiveThreadId ?? null)
            : null,
        toolMessageId: effectiveToolMessageId ?? null,
        userId: user.id,
        deadlineMs: RemoteDispatch.PENDING_CALL_DEADLINE_MS,
        onDeadline,
        onSettled: releaseConnectorRef,
      });

      // wakeUp parks the thread and MUST be revived when the result lands.
      // Park a disabled resume-stream cron task with full revival context so the
      // result handler (handleToolResult) can simply enable+fire it — no
      // in-memory revival context needed. detach is fire-and-forget: stores no
      // revival (thread stays idle); if AI later calls await-task, THAT parks.
      // The persisted callId is wakeUp-only (detach cancel + restart safety).
      // Storing it for detach caused restart-time result events to fire wakeUp
      // revival for a detach dispatch, violating detach's no-revival contract.
      if (callbackMode === CallbackMode.WAKE_UP && effectiveToolMessageId) {
        await TaskCompletion.parkResumeStreamTask({
          taskId: callId,
          callbackMode: CallbackMode.WAKE_UP,
          threadId: effectiveThreadId ?? "",
          toolMessageId: effectiveToolMessageId,
          leafMessageId: streamContext.leafMessageId ?? null,
          modelId: resolvedModelId,
          skillId: streamContext.skillId ?? null,
          favoriteId: streamContext.favoriteId ?? null,
          subAgentDepth: streamContext.subAgentDepth ?? 0,
          ownerUserId: user.id,
          selfInstanceId: null,
          logger,
        });
        await RemoteDispatch.storePendingCallId(
          effectiveToolMessageId,
          callId,
          logger,
        );
      }

      await emitToolRequest({
        callId,
        userId: user.id,
        toolName,
        input: strippedInput,
        callbackMode,
        callerPlatform: platform,
        callerSkillId: streamContext.skillId ?? null,
        callerFavoriteId: streamContext.favoriteId ?? null,
        streamContext: streamContext,
        locale,
        logger,
        user,
      });

      return {
        kind: "return",
        value: success({
          taskId: callId,
          // Same hints as the local dispatch (DISPATCH_HINTS in ../constants.ts)
          // — same mode, same steer, every transport.
          hint:
            callbackMode === CallbackMode.DETACH
              ? DISPATCH_HINTS.detach
              : DISPATCH_HINTS.wakeUp,
        }),
      };
    }

    // ── WAIT / END_LOOP: block inline on the result event ─────────────────────
    PendingCalls.register({
      callId,
      instanceId,
      toolName,
      input: strippedInput,
      threadId: null, // WAIT/END_LOOP do not park the thread.
      toolMessageId: effectiveToolMessageId ?? null,
      userId: user.id,
      deadlineMs: RemoteDispatch.PENDING_CALL_DEADLINE_MS,
      onDeadline,
      onSettled: releaseConnectorRef,
    });

    // Persist the callId on the tool message UP FRONT (not only on the wakeUp
    // auto-upgrade): the result event may land in ANOTHER process (the dev
    // server) before the inline wait here times out — without a DB anchor that
    // process drops the result and the upgraded park starves. inline=true: this
    // stream is LIVE and blocked right below — the sibling must only write the
    // durable handoff row (our DB-poll consumes it), never fire a wakeUp
    // revival against a stream that is still running.
    if (effectiveToolMessageId) {
      await RemoteDispatch.storePendingCallId(
        effectiveToolMessageId,
        callId,
        logger,
        true,
      );
    }

    // Subscribe to the result on the pub/sub bus BEFORE emitting the request, so
    // no result can arrive between emit and subscribe. The bus crosses PROCESSES
    // (proxy ↔ app, or a test harness running the loop out of the server
    // process) — so this resolves the WAIT even when the result event lands in
    // handleToolResult in a DIFFERENT process than this one (the reverse-ws
    // event-path case: the in-memory PendingCalls waiter here would otherwise
    // never fire). Same definition-derived channel as ControlSignals.
    const resultSub = ResultSignals.subscribe(callId, user, logger);

    await emitToolRequest({
      callId,
      userId: user.id,
      toolName,
      input: strippedInput,
      callbackMode,
      callerPlatform: platform,
      callerSkillId: streamContext.skillId ?? null,
      callerFavoriteId: streamContext.favoriteId ?? null,
      streamContext: streamContext,
      locale,
      logger,
      user,
    });

    // Inline timeout from the tool definition (0 = no timeout).
    const definedTimeoutMs = dispatchToolDef?.timeoutMs;
    const inlineTimeoutMs =
      definedTimeoutMs === 0
        ? RemoteDispatch.NO_TIMEOUT_INLINE_MS
        : (definedTimeoutMs ?? RemoteDispatch.DEFAULT_INLINE_TIMEOUT_MS);

    // Block on the result via the ONE KeyedRemoteSignal subscription opened
    // above: it resolves whether handleToolResult ran in THIS process (in-process
    // adapter fast path, built into the primitive) or another process/instance
    // (WS hub + bridge). No separate in-memory PendingCalls waiter — that would
    // only ever fire same-process and never for the reverse-ws event-path. On
    // timeout the race yields null → wakeUp auto-upgrade below. Always unsubscribe.
    const timeoutSignal = new Promise<PendingCallResult | null>((resolve) => {
      setTimeout(() => resolve(null), inlineTimeoutMs);
    });
    const resultSignal: Promise<PendingCallResult> = resultSub.signal.then(
      (s) => ({ status: s.status, output: s.output }),
    );
    const inlineResult: PendingCallResult | null = await Promise.race([
      resultSignal,
      timeoutSignal,
    ]);
    resultSub.cancel();

    if (!inlineResult) {
      // WAIT → wakeUp auto-upgrade: the tool is still running on the remote.
      // Attach revival context so a late result event (or the deadline backstop)
      // revives the parked thread instead of failing.
      logger.warn(
        "[RouteExecute] Remote inline wait timed out — auto-upgrading to wakeUp",
        { toolName, instanceId, callId, inlineTimeoutMs },
      );
      if (effectiveToolMessageId && effectiveThreadId) {
        await TaskCompletion.parkResumeStreamTask({
          taskId: callId,
          callbackMode: CallbackMode.WAKE_UP,
          threadId: effectiveThreadId,
          toolMessageId: effectiveToolMessageId,
          leafMessageId: streamContext.leafMessageId ?? null,
          modelId: resolvedModelId,
          skillId: streamContext.skillId ?? null,
          favoriteId: streamContext.favoriteId ?? null,
          subAgentDepth: streamContext.subAgentDepth ?? 0,
          ownerUserId: user.id,
          selfInstanceId: null,
          logger,
        });
        // Now a REAL park: flip the inline marker so a late result event (in any
        // process) revives the parked thread via reviveFromToolMessage.
        await RemoteDispatch.storePendingCallId(
          effectiveToolMessageId,
          callId,
          logger,
          false,
        );
      }
      // Keep the call alive — do NOT discard.
      return {
        kind: "return",
        value: success({
          taskId: callId,
          hint: DISPATCH_HINTS.waitUpgradedToWakeUp,
        }),
      };
    }

    PendingCalls.discard(callId);
    if (inlineResult.status === "failed") {
      // The receiver relays its fail() message inside the result payload —
      // surface it (e.g. "Read-Only") instead of an opaque local error. When
      // the payload carries the ORIGINAL errorType (errorKey/errorCode), keep
      // it — a remote 403 (insufficient credits, forbidden tool) must stay a
      // 403 through every relay hop, never degrade to a generic 5xx.
      const failedOutput = inlineResult.output;
      const remoteMessage =
        failedOutput && typeof failedOutput["message"] === "string"
          ? failedOutput["message"]
          : undefined;
      const remoteErrorCode =
        failedOutput && typeof failedOutput["errorCode"] === "number"
          ? failedOutput["errorCode"]
          : null;
      const preservedErrorType =
        remoteErrorCode !== null
          ? Object.values(ErrorResponseTypes).find(
              (candidate) => candidate.errorCode === remoteErrorCode,
            )
          : undefined;
      return {
        kind: "return",
        value: fail({
          message: remoteMessage
            ? t("executeTool.post.errors.remoteFailed.title", {
                message: remoteMessage,
              })
            : t("executeTool.post.errors.notFound.title"),
          errorType:
            preservedErrorType ?? ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: { toolName },
        }),
      };
    }
    // Same shape as a local execute-tool call: { result: ... }
    return {
      kind: "return",
      value: success({ result: inlineResult.output ?? {} }),
    };
  }
}
