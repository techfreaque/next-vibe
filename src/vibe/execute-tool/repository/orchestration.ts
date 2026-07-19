/**
 * Non-local orchestration seam.
 *
 * WHAT THIS IS
 * Everything execute-tool does BEYOND "run the handler here, now, inline":
 *   - remote dispatch (instanceId → another instance, via remote-connection transports)
 *   - the model cascade needed by remote/WAKE_UP (via ./completion)
 *   - APPROVE (confirmation placeholder; the real result arrives via resume-stream)
 *   - DETACH / WAKE_UP (task rows + fire-and-forget, via ./local-async)
 *
 * WHY IT IS ONE FILE
 * These four branches are the ONLY reason the execute-tool entry graph reaches the
 * task system (tasks/cron), remote-connection, realtime signalling and the agent
 * chat DB. The plain local WAIT path — the common case for CLI and MCP — needs
 * none of it.
 *
 * Keeping them behind a single seam means a deployment that only ever runs tools
 * LOCALLY (CLI + MCP, no task system, no remote instances) swaps ONE import in
 * ./index.ts for ./orchestration-local and drops this file plus remote.ts,
 * completion.ts and local-async.ts — without touching the executor itself.
 *
 * CONTRACT: return a ResponseType to short-circuit; return null to fall through
 * to the local WAIT path. `resolvedModelId` is threaded back because ./index.ts
 * builds the shared ctx from it.
 */

import "server-only";

import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { CallbackModeValue } from "../constants";
import { CallbackMode } from "../constants";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseOutput,
} from "../definition";
import type { RouteExecuteContext } from "./types";

/**
 * Resolve the active chat model from the favorite/skill cascade — LAZY:
 * only remote dispatch (media-model + capability context) and WAKE_UP
 * (wakeUpModelId for revival routing) need it. Plain local WAIT/endLoop/
 * detach/approve must not pay the dynamic imports + DB lookups per call.
 */
export async function resolveModelIdIfNeeded(params: {
  instanceId: string | undefined;
  callbackMode: CallbackModeValue | null;
  user: JwtPayloadType;
  toolExecutionContext: RouteExecuteContext["toolExecutionContext"];
}): Promise<ChatModelId | null> {
  const needsCascade =
    Boolean(params.instanceId && !params.user.isPublic) ||
    params.callbackMode === CallbackMode.WAKE_UP;
  if (!needsCascade) {
    return null;
  }
  return await import("./completion").then((m) =>
    m.TaskCompletion.resolveStreamModelId(
      params.toolExecutionContext,
      params.user,
    ),
  );
}

/**
 * Run the non-local branches. Returns a response to short-circuit, or null when
 * the call is a plain local WAIT and ./index.ts should execute it inline.
 */
export async function orchestrateNonLocal(params: {
  ctx: RouteExecuteContext;
  data: RouteExecuteRequestOutput;
  input: Record<string, WidgetData>;
  instanceId: string | undefined;
  callbackMode: CallbackModeValue | null;
  user: JwtPayloadType;
  logger: EndpointLogger;
  toolName: string;
}): Promise<ResponseType<RouteExecuteResponseOutput> | null> {
  const { ctx, data, input, instanceId, callbackMode, user, logger, toolName } =
    params;

  if (instanceId && !user.isPublic) {
    const { RemoteDispatch } = await import("./remote");
    const remoteResult = await RemoteDispatch.dispatch({
      ctx,
      data,
      input,
      instanceId,
    });
    if (remoteResult.kind === "return") {
      return remoteResult.value;
    }
  }

  // APPROVE: return immediately - the stream-part-handler already set
  // stepHasToolsAwaitingConfirmation=true which aborts at finish-step.
  // This result is a placeholder; the real result is injected by resume-stream
  // after the user confirms/cancels (which could be days later).
  // The stream fully ends after finish-step abort - no lingering state.
  if (callbackMode === CallbackMode.APPROVE) {
    logger.debug(
      "[RouteExecute] APPROVE mode - returning placeholder (stream aborts at finish-step)",
      { toolName },
    );
    return success({
      result: { status: "waiting_for_confirmation", toolName },
    });
  }

  // Local async (DETACH / WAKE_UP): RUNNING task row + fire-and-forget
  // goroutine, returns { taskId } to the AI immediately. One shared flow —
  // the modes differ only in the completion policy (detach: no revival,
  // no backfill; wakeUp: revival with deferred result). See ./local-async.ts.
  if (
    callbackMode === CallbackMode.DETACH ||
    callbackMode === CallbackMode.WAKE_UP
  ) {
    const { LocalExecutionAsync } = await import("./local-async");
    return await LocalExecutionAsync.executeAsync({
      ctx,
      input,
      mode: callbackMode,
    });
  }

  return null;
}
