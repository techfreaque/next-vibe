/**
 * Inbound tool-execute-request handler — the RECEIVER side of the remote
 * execution protocol. Extracted from RouteExecuteRepository to keep index.ts
 * free of DB/cron imports.
 */

import "server-only";

import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";

import { defaultLocale } from "../../core/i18n/core/config";
import type { RemoteEventHandlerProps } from "../../core/route/handler-realtime";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";
import { dbUserIdToOwner } from "../../tasks/cron/db";
import { resolveTaskOwnerUser } from "../../tasks/cron/resolve-task-user";
import { CallbackMode } from "../constants";
import executeDefinition, {
  type RouteExecuteResponseOutput,
} from "../definition";
import { RouteExecuteRepository } from "./index";

/**
 * At-least-once delivery guard for inbound tool-execute-requests: callIds
 * currently executing in THIS process. The reverse-ws hub can deliver one
 * request to several lingering connector sockets (reconnect churn), and each
 * delivery would spawn a full duplicate execution. Entries are removed when
 * the execution settles, so deterministic callIds (fixture mode) can re-run
 * across test runs.
 *
 * Lives here rather than on RouteExecuteRepository because this file is its only
 * producer AND its only consumer — it guards inbound WIRE deliveries, which is
 * precisely what a deployment without a wire protocol never has.
 */
const inFlightIncomingCalls = new Set<string>();

/**
 * Relay a finished tool result back to the requester as a `tool-execute-result`
 * event keyed by callId. createEndpointEmitter fans it out via the bridge over
 * the back connection's leg; the requester's handleToolResult resolves the
 * pending call (and fires revival for wakeUp).
 */
export async function emitToolResult(
  callId: string,
  localUserId: string,
  result: ResponseType<WidgetData>,
  logger: EndpointLogger,
  /** The requester connection (our local name for it). Addressed frame:
   *  other peers of this account never see the result. undefined = legacy
   *  broadcast (restart-revival fallback where the requester row is unknown). */
  targetInstanceId: string | undefined,
): Promise<void> {
  const resultData: WidgetData = result.success
    ? (JSON.parse(JSON.stringify(result.data)) as WidgetData)
    : {
        // Failure fidelity across the wire: carry the ORIGINAL errorType so
        // the requester's inline mapping reconstructs the real failure
        // (e.g. 403 insufficient-credits) instead of a generic 5xx wrapper.
        message:
          "message" in result
            ? String(result.message)
            : "Tool execution failed",
        errorKey: result.errorType.errorKey,
        errorCode: result.errorType.errorCode,
      };
  const hint = result.success
    ? undefined
    : "message" in result
      ? String(result.message)
      : "Tool execution failed";

  // Explicit outcome on the wire — the requester must never have to infer
  // failure from hint presence (a success can legitimately carry a hint).
  const resultPayload: Pick<
    RouteExecuteResponseOutput,
    "hint" | "result" | "status" | "taskId"
  > = {
    taskId: callId,
    result: resultData,
    hint,
    status: result.success ? "completed" : "failed",
  };

  const { createEndpointEmitter } = await import("../../realtime/core/emitter");
  // Emit as OUR local user so pushRemoteEvent finds our back-connection rows
  // (keyed by our userId). The requester matches the result by callId.
  const localUser: JwtPayloadType = {
    id: localUserId,
    leadId: localUserId,
    isPublic: false as const,
    roles: [],
  };
  createEndpointEmitter(
    executeDefinition.POST,
    logger,
    localUser,
    targetInstanceId ? { targetInstanceId } : undefined,
  )("tool-execute-result", { responseData: resultPayload });
}

export async function handleIncomingToolRequest(
  props: RemoteEventHandlerProps<
    typeof executeDefinition.POST,
    "tool-execute-request"
  >,
): Promise<void> {
  const { requestData, payload: roundtrip, user, logger } = props;
  const localUserId = user.id;

  if (inFlightIncomingCalls.has(roundtrip.callId)) {
    logger.debug(
      "[RouteExecute] handleIncomingToolRequest: duplicate delivery — skipped",
      { callId: roundtrip.callId },
    );
    return;
  }
  inFlightIncomingCalls.add(roundtrip.callId);

  const owner = dbUserIdToOwner(localUserId);
  const taskUserCtx = await resolveTaskOwnerUser(owner, defaultLocale, logger);
  if (!taskUserCtx) {
    logger.warn(
      "[RouteExecute] handleIncomingToolRequest: failed to resolve user",
      { localUserId },
    );
    inFlightIncomingCalls.delete(roundtrip.callId);
    return;
  }

  const { scopedTranslation } = await import("../../platforms/ai/i18n");
  const { t } = scopedTranslation.scopedT(defaultLocale);
  const abortController = new AbortController();
  const callbackMode = requestData.callbackMode ?? CallbackMode.WAIT;
  const isAsyncMode =
    callbackMode === CallbackMode.DETACH ||
    callbackMode === CallbackMode.WAKE_UP;

  const relayResult = async (
    result: ResponseType<WidgetData>,
  ): Promise<void> => {
    logger.debug("[RouteExecute] relaying result to requester", {
      callId: roundtrip.callId,
      success: result.success,
      originInstanceId: props.originInstanceId ?? null,
    });
    inFlightIncomingCalls.delete(roundtrip.callId);
    // Fan the result back over the RECEIVER's local connections (keyed by
    // our local userId, NOT the requester's id — the bridge resolves the
    // back leg from our remoteConnections rows). The requester matches by
    // callId, not userId.
    await emitToolResult(
      roundtrip.callId,
      localUserId,
      result,
      logger,
      // Address the result to the REQUESTER's connection — the SENDING
      // instance (originInstanceId). props.instanceId is the event's TARGET
      // (this instance): using it addressed the reply to ourselves and the
      // requester never received the result (observed: direct-suite tool
      // dispatches timing out after 90s with the execution long finished).
      props.originInstanceId,
    );
  };

  // ONE receiver context for every mode. Caller identity + fixture context
  // ride the roundtrip payload (the event's payloadType) — never the public
  // request schema — and continue down THIS execution chain.
  //
  // detach/wakeUp additions: the RECEIVER owns the work as a REAL local
  // async task — same executor, same task row, same goroutine as a local
  // dispatch. The task-row ID is the requester's callId
  // (remoteDispatchCallId) so ONE identity names the work on both instances,
  // and the receiver's task history is the durable result store (await-task
  // finds it after the requester's in-memory tombstone expires — parity with
  // local detach). onAsyncTaskSettled relays the settled outcome back as the
  // tool-execute-result event; the requester's parked semantics (revival /
  // fire-and-forget) live on ITS side, driven by that event.
  const receiverCtx: ToolExecutionContext = {
    // no user context — UTC (dates not user-facing here); wire payload carries
    // only the fixture-scope threadId, not the caller's timezone.
    ...makeHeadlessContext(
      abortController.signal,
      roundtrip.toolExecutionContext,
      "UTC",
    ),
    skillId: roundtrip.callerSkillId ?? undefined,
    favoriteId: roundtrip.callerFavoriteId ?? undefined,
    ...(isAsyncMode
      ? {
          remoteDispatchCallId: roundtrip.callId,
          onAsyncTaskSettled: async (outcome): Promise<void> => {
            await relayResult(
              outcome.status === "completed"
                ? success({ result: outcome.output ?? {} })
                : fail({
                    message: t("executeTool.post.errors.unknown.detail", {
                      error: outcome.errorMessage ?? "Tool execution failed",
                    }),
                    errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  }),
            );
          },
        }
      : {}),
  };

  const runExecute = (): Promise<ResponseType<WidgetData>> =>
    RouteExecuteRepository.execute(
      {
        toolName: requestData.toolName,
        input: requestData.input,
        instanceId: undefined,
        callbackMode: isAsyncMode ? callbackMode : CallbackMode.WAIT,
      },
      taskUserCtx.user,
      defaultLocale,
      logger,
      t,
      receiverCtx,
      // Gate under the CALLER's original surface — the RELAY dispatches
      // ai-stream itself (AI_TOOL_OFF), which must not be gated as an AI
      // tool call. AI-model calls arrive with callerPlatform=AI.
      roundtrip.callerPlatform ?? Platform.AI,
    );

  if (isAsyncMode) {
    const dispatched = await runExecute();
    if (!dispatched.success) {
      // Dispatch itself failed (guards, task insert) — relay immediately so
      // the requester's pending call resolves instead of hitting deadline.
      await relayResult(dispatched);
    }
    return;
  }

  // WAIT/END_LOOP: the requester blocks on the result — but NOT on this
  // delivery call. The bridge transport awaits this handler, so running the
  // tool inline here would hold the sender's transport POST open for the
  // whole execution — an unbounded loop (ai-stream, timeoutMs: 0) would hit
  // the sender's fetch timeout, which is exactly the HTTP-ceiling problem
  // the event protocol exists to avoid. Ack delivery immediately; the
  // requester's WAIT resolves via the tool-execute-result event.
  void (async (): Promise<void> => {
    await relayResult(await runExecute());
  })().catch((error: Error) => {
    inFlightIncomingCalls.delete(roundtrip.callId);
    logger.error(
      "[RouteExecute] handleIncomingToolRequest: WAIT execution failed",
      { callId: roundtrip.callId, error: error.message },
    );
  });
}
