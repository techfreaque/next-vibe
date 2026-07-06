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

import { BEARER_LEAD_ID_SEPARATOR } from "@/config/constants";
import { getEndpoint } from "@/generated/endpoints/endpoint";

import {
  CallbackMode,
  type CallbackModeValue,
  DISPATCH_HINTS,
} from "../constants";
import type { RouteExecuteRequestOutput } from "../definition";
import executeDefinition from "../definition";
import { TaskCompletion } from "./completion";
import { ExecuteToolGuards } from "./guards";
import { LocalExecution } from "./local";
import { PendingCalls } from "./pending-calls";
import type {
  DirectCallResult,
  PendingCallRevival,
  PhaseResult,
  RemoteConnInfo,
  RevivalTarget,
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

    // Pre-resolve the target's caller-context field defaults before dispatch —
    // uniformly for every tool that declares fieldDefaults (no special cases).
    const preferredName = getPreferredName(ctx.toolName);
    strippedInput = await RemoteDispatch.resolveCallerFieldDefaults({
      ctx,
      toolName: preferredName,
      input: strippedInput,
    });

    // File objects cannot ride the JSON wire (they stringify to {}). Marshal
    // them to the base64 shape endpoint file-field schemas accept as the wire
    // alternative ({ filename, mimeType, data }) — the receiving side's zod
    // union transforms it back into a File.
    strippedInput = await RemoteDispatch.marshalFilesForWire(strippedInput);

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
      await import("@/app/api/[locale]/remote-connection/repository");
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
   * Persist the pendingCallId on the tool message so dismiss-task can cancel the
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
    const { chatMessages } = await import("@/app/api/[locale]/agent/chat/db");
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
      fixtureContext: streamContext.fixtureContext,
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
      const target: RevivalTarget | null =
        RemoteDispatch.revivalToTarget(outcome.revival) ??
        (effectiveToolMessageId
          ? {
              toolMessageId: effectiveToolMessageId,
              threadId: effectiveThreadId ?? null,
              callbackMode,
              modelId: resolvedModelId,
              skillId: streamContext.skillId ?? null,
              favoriteId: streamContext.favoriteId ?? null,
              leafMessageId: streamContext.leafMessageId ?? null,
              subAgentDepth: streamContext.subAgentDepth ?? 0,
            }
          : null);
      if (target) {
        // Fresh AbortController: the revival is not tied to the stream that
        // dispatched the original remote call.
        await TaskCompletion.handle({
          toolMessageId: target.toolMessageId,
          threadId: target.threadId,
          callbackMode: target.callbackMode,
          status: CronTaskStatus.FAILED,
          output: { error: errorMessage },
          taskId: callId,
          modelId: target.modelId,
          skillId: target.skillId,
          favoriteId: target.favoriteId,
          leafMessageId: target.leafMessageId,
          subAgentDepth: target.subAgentDepth,
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
    const isControlPlane =
      platform !== Platform.AI && dispatchToolDef?.timeoutMs !== 0;
    if (token !== null && isControlPlane) {
      const direct = await RemoteDispatch.callToolDirect({
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
    const releaseConnectorRef: () => void = await new Promise((resolve) => {
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

      // wakeUp parks the thread and MUST be revived when the result lands — store
      // its revival context so handleToolResult can resume it (no cross-instance
      // task). detach is fire-and-forget: it stores NO revival (the thread stays
      // idle); if the AI later calls await-task, THAT attaches a WAIT revival.
      // The persisted callId is likewise wakeUp-only: it exists so dismiss-task
      // can cancel the revival and a late result event can revive after a
      // requester restart — both wakeUp concerns. Storing it for detach caused
      // a restart-time result event to fire a WAKE_UP revival for a detach
      // dispatch (reviveFromToolMessage revives as wakeUp), violating detach's
      // no-revival contract.
      if (callbackMode === CallbackMode.WAKE_UP && effectiveToolMessageId) {
        PendingCalls.setRevival(
          callId,
          RemoteDispatch.revivalFromContext(ctx, {
            threadId: effectiveThreadId ?? "",
            toolMessageId: effectiveToolMessageId,
            userId: user.id,
          }),
        );
        await RemoteDispatch.storePendingCallId(
          effectiveToolMessageId,
          callId,
          logger,
        );
      }

      await RemoteDispatch.emitToolRequest({
        callId,
        userId: user.id,
        toolName,
        input: strippedInput,
        callbackMode,
        callerPlatform: platform,
        callerSkillId: streamContext.skillId ?? null,
        callerFavoriteId: streamContext.favoriteId ?? null,
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

    await RemoteDispatch.emitToolRequest({
      callId,
      userId: user.id,
      toolName,
      input: strippedInput,
      callbackMode,
      callerPlatform: platform,
      callerSkillId: streamContext.skillId ?? null,
      callerFavoriteId: streamContext.favoriteId ?? null,
      fixtureContext: streamContext.fixtureContext,
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

    const inlineResult = await PendingCalls.awaitResult(
      callId,
      inlineTimeoutMs,
    );

    if (!inlineResult) {
      // WAIT → wakeUp auto-upgrade: the tool is still running on the remote.
      // Attach revival context so a late result event (or the deadline backstop)
      // revives the parked thread instead of failing.
      logger.warn(
        "[RouteExecute] Remote inline wait timed out — auto-upgrading to wakeUp",
        { toolName, instanceId, callId, inlineTimeoutMs },
      );
      if (effectiveToolMessageId && effectiveThreadId) {
        PendingCalls.setRevival(
          callId,
          RemoteDispatch.revivalFromContext(ctx, {
            threadId: effectiveThreadId,
            toolMessageId: effectiveToolMessageId,
            userId: user.id,
          }),
        );
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

  /**
   * Synchronous direct-http remote call: POST the target tool to the peer's
   * execute-tool endpoint and return its response. Wire plumbing only — it does
   * NOT re-enter the local execute() dispatch (which would recurse). Used solely
   * by the direct-http WAIT/END_LOOP leg.
   */
  private static async callToolDirect(params: {
    remoteUrl: string;
    token: string;
    leadId: string;
    toolName: string;
    input: Record<string, WidgetData> | null;
    locale: string;
    logger: RouteExecuteContext["logger"];
    toolTimeoutMs?: number;
  }): Promise<DirectCallResult> {
    const { remoteUrl, token, leadId, toolName, input, locale, logger } =
      params;
    const url = `${remoteUrl}/api/${locale}/${executeDefinition.POST.path.join("/")}`;
    const timeoutMs =
      params.toolTimeoutMs === 0 ? 600_000 : (params.toolTimeoutMs ?? 90_000);
    // The dev HTTP layer (vite/nitro) flakily drops multi-MB request bodies
    // ("socket closed unexpectedly" while reading) and answers with its
    // pre-handler {"unhandled":true} 500 — the handler never ran, so a retry is
    // side-effect free. ONLY that exact marker is retried; handler errors never.
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // This IS the direct-http dispatch primitive that runInProcessTyped/execute()
        // sits on top of — it POSTs the tool to the peer's execute-tool endpoint and
        // must NOT re-enter execute() (would recurse). The one place raw fetch is the
        // irreducible wire for cross-instance dispatch.
        // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- cross-instance dispatch primitive
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}${BEARER_LEAD_ID_SEPARATOR}${leadId}`,
            // Keepalive socket reuse corrupts multi-MB bodies between Bun's
            // fetch and the peer's HTTP layer (measured: 3/6 uploads of a 5MB
            // JSON body stall ~12s and die with "socket closed unexpectedly";
            // with Connection: close it is 0/6). A fresh connection per
            // dispatch costs one localhost/LAN handshake and makes delivery
            // deterministic.
            Connection: "close",
          },
          body: JSON.stringify({
            toolName,
            input: input ?? {},
          }),
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (!resp.ok) {
          // Surface the peer's real error (e.g. "Read-Only" from a forbidden cortex
          // write) instead of collapsing every failure into an opaque local error —
          // the AI/caller needs the actual reason to react correctly.
          let remoteMessage: string | undefined;
          let preHandlerFailure = false;
          try {
            const errBody = (await resp.json()) as {
              message?: string;
              unhandled?: boolean;
            };
            remoteMessage =
              typeof errBody.message === "string" ? errBody.message : undefined;
            // Real handler/validation errors always carry a JSON message; a
            // JSON response WITHOUT one (or with the pre-handler `unhandled`
            // marker) is HTTP-layer garbage from a dropped/truncated body.
            preHandlerFailure =
              errBody.unhandled === true || remoteMessage === undefined;
          } catch {
            remoteMessage = undefined;
            // A response whose body isn't even JSON (dev proxy HTML error page,
            // empty 400/431 after a truncated multi-MB upload) never came from
            // a handler — our handlers always answer JSON with a message. The
            // handler had no valid input, so it provably never ran.
            preHandlerFailure = true;
          }
          // 405 = the dev router rejected the METHOD while its route tree was
          // (re)building — the handler PROVABLY never ran, so this is retriable
          // for every tool, including non-idempotent (timeoutMs:0) ones.
          const routerNotReady = resp.status === 405;
          // Pre-handler failures are retried for EVERY tool: the body never
          // parsed, so the handler provably never ran and no side effects
          // exist — the retry is the FIRST real delivery.
          if ((routerNotReady || preHandlerFailure) && attempt < maxAttempts) {
            logger.warn(
              "[RouteExecute] callToolDirect pre-handler failure — retrying",
              { toolName, status: resp.status, attempt },
            );
            // The dev HTTP layer drops large bodies in bursts — an immediate
            // resend hits the same stressed socket pool and fails identically.
            // A short backoff lets the proxy recover before the retry.
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 750 * attempt);
            });
            continue;
          }
          logger.warn("[RouteExecute] callToolDirect HTTP error", {
            toolName,
            status: resp.status,
            remoteMessage,
          });
          return { ok: false, remoteMessage };
        }
        const body = (await resp.json()) as {
          data?: Record<string, WidgetData>;
        };
        return { ok: true, data: body.data ?? {} };
      } catch (err) {
        logger.warn("[RouteExecute] callToolDirect network error", {
          toolName,
          error: err instanceof Error ? err.message : String(err),
        });
        return { ok: false };
      }
    }
    return { ok: false };
  }

  /**
   * Emit the definition-driven `tool-execute-request` event toward the peer. The
   * bridge routes it over the connection's leg; the peer's
   * onRemoteEvent["tool-execute-request"] runs it and emits `tool-execute-result`.
   */
  private static async emitToolRequest(params: {
    callId: string;
    userId: string;
    toolName: string;
    input: Record<string, WidgetData> | null;
    callbackMode: CallbackModeValue;
    callerPlatform: Platform;
    callerSkillId: string | null;
    callerFavoriteId: string | null;
    /**
     * The dispatching execution's fixture context — forwarded on the wire so
     * the receiver records/replays the relayed execution's external calls
     * under the SAME per-test directory. Explicit chain, never ambient.
     */
    fixtureContext: FixtureContext | undefined;
    locale: string;
    logger: RouteExecuteContext["logger"];
    user: RouteExecuteContext["user"];
  }): Promise<void> {
    const { createEndpointEmitter } =
      await import("next-vibe/realtime/emitter");
    const { fixtureContext } = params;
    createEndpointEmitter(
      executeDefinition.POST,
      params.logger,
      params.user,
    )("tool-execute-request", {
      requestData: {
        toolName: params.toolName,
        input: params.input ?? {},
        // The receiver runs the tool LOCALLY — no further instanceId hop.
        instanceId: undefined,
        callbackMode: params.callbackMode,
      },
      payload: {
        callId: params.callId,
        userId: params.userId,
        locale: params.locale,
        // Wire-internal caller context: identity for fieldDefaults + the
        // surface the receiver gates/renders under. Envelope side-channel —
        // never the public request schema.
        callerSkillId: params.callerSkillId ?? undefined,
        callerFavoriteId: params.callerFavoriteId ?? undefined,
        callerPlatform: params.callerPlatform,
        ...(fixtureContext ? { fixtureContext } : {}),
      },
    });
  }

  /**
   * Resolve the target tool's declared fieldDefaults with the CALLER's context
   * and inject any resolved values into the outgoing input. Locally these same
   * resolvers run inside the route handler (createGenericHandler); the receiving
   * peer lacks the caller's skill/favorite context, so context-dependent
   * defaults must resolve HERE before dispatch — same resolvers, same context,
   * uniformly for EVERY tool ("transport is invisible", no per-tool shortcuts).
   */
  private static async resolveCallerFieldDefaults(params: {
    ctx: RouteExecuteContext;
    toolName: string;
    input: Record<string, WidgetData> | null;
  }): Promise<Record<string, WidgetData> | null> {
    const { ctx, toolName } = params;
    const { getRouteHandler } = await import("@/generated/routes/handlers");
    const handler = await getRouteHandler(toolName);
    const fieldDefaults = handler?.fieldDefaults;
    if (!fieldDefaults) {
      return params.input;
    }
    let input = params.input;
    for (const [field, resolver] of Object.entries(fieldDefaults)) {
      if (!resolver || input?.[field] !== undefined) {
        continue;
      }
      const value = await resolver({
        user: ctx.user,
        locale: ctx.locale,
        platform: ctx.platform,
        streamContext: ctx.streamContext,
      });
      if (value !== undefined) {
        input = { ...(input ?? {}), [field]: value };
        ctx.logger.debug(
          "[RouteExecute] Pre-resolved caller field default for remote dispatch",
          { toolName, field },
        );
      }
    }
    return input;
  }

  /**
   * Recursively convert File instances inside a wire payload to the base64
   * object shape ({ filename, mimeType, data }) that endpoint file-field
   * schemas accept as the JSON alternative. Files stringify to {} on the wire —
   * without this, every cross-instance call carrying an attachment fails
   * validation on the receiving side.
   */
  private static async marshalFilesForWire(
    input: Record<string, WidgetData> | null,
  ): Promise<Record<string, WidgetData> | null> {
    if (input === null) {
      return null;
    }
    const marshalValue = async (value: WidgetData): Promise<WidgetData> => {
      if (value instanceof File) {
        return {
          filename: value.name,
          mimeType: value.type,
          data: Buffer.from(await value.arrayBuffer()).toString("base64"),
        };
      }
      if (Array.isArray(value)) {
        return Promise.all(value.map((item) => marshalValue(item)));
      }
      if (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof Date)
      ) {
        const out: Record<string, WidgetData> = {};
        for (const [k, v] of Object.entries(value)) {
          out[k] = await marshalValue(v);
        }
        return out;
      }
      return value;
    };
    const result: Record<string, WidgetData> = {};
    for (const [key, value] of Object.entries(input)) {
      result[key] = await marshalValue(value);
    }
    return result;
  }

  /**
   * Build the wakeUp revival context from the dispatch's stream context — the
   * ONE construction shared by the wakeUp dispatch registration and the WAIT
   * inline-timeout auto-upgrade (same mode, same routing fields).
   */
  private static revivalFromContext(
    ctx: RouteExecuteContext,
    anchor: { threadId: string; toolMessageId: string; userId: string },
  ): PendingCallRevival {
    return {
      threadId: anchor.threadId,
      toolMessageId: anchor.toolMessageId,
      callbackMode: CallbackMode.WAKE_UP,
      leafMessageId: ctx.streamContext.leafMessageId ?? null,
      modelId: ctx.resolvedModelId,
      skillId: ctx.streamContext.skillId ?? null,
      favoriteId: ctx.streamContext.favoriteId ?? null,
      subAgentDepth: ctx.streamContext.subAgentDepth ?? 0,
      userId: anchor.userId,
    };
  }

  /** Narrow an attached await-task revival to a completion target (null-safe). */
  private static revivalToTarget(
    revival: PendingCallRevival | null,
  ): RevivalTarget | null {
    if (!revival) {
      return null;
    }
    return {
      toolMessageId: revival.toolMessageId,
      threadId: revival.threadId,
      callbackMode:
        revival.callbackMode === CallbackMode.WAIT
          ? CallbackMode.WAIT
          : CallbackMode.WAKE_UP,
      modelId: revival.modelId,
      skillId: revival.skillId,
      favoriteId: revival.favoriteId,
      leafMessageId: revival.leafMessageId,
      subAgentDepth: revival.subAgentDepth,
    };
  }
}
