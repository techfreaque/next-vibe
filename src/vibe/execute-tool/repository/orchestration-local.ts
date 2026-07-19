/**
 * Local-only orchestration seam — the drop-in for deployments that run tools
 * ONLY here, now, inline.
 *
 * Same contract as ./orchestration, with every non-local branch removed:
 *   - no remote dispatch  (no remote-connection, no transports, no instanceId routing)
 *   - no model cascade    (no ./completion, no agent chat DB)
 *   - no APPROVE          (no confirmation round-trip / resume-stream)
 *   - no DETACH / WAKE_UP (no task system, no cron rows, no revival)
 *
 * `orchestrateNonLocal` always returns null, so ./index.ts falls straight through
 * to the local WAIT path. `resolveModelIdIfNeeded` always returns null — nothing
 * downstream of a local WAIT call reads it.
 *
 * HOW TO USE IT: point ./index.ts's `./orchestration` import at this file. That
 * ONE line is the whole switch; ./orchestration.ts, ./remote.ts, ./completion.ts
 * and ./local-async.ts can then be deleted, and with them the entire task-system,
 * remote-connection and agent-chat-DB dependency surface.
 *
 * Callers that DO pass instanceId or a non-WAIT callbackMode get local inline
 * execution instead — a deployment on this seam has no remote to dispatch to and
 * no task row to return, so falling through is the only honest behaviour.
 */

import "server-only";

import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { CallbackModeValue } from "../constants";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseOutput,
} from "../definition";
import type { RouteExecuteContext } from "./types";

/** No cascade without remote/WAKE_UP. Always null. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- seam parity: the signature must match ./orchestration
export function resolveModelIdIfNeeded(_params: {
  instanceId: string | undefined;
  callbackMode: CallbackModeValue | null;
  user: JwtPayloadType;
  toolExecutionContext: RouteExecuteContext["toolExecutionContext"];
}): Promise<ChatModelId | null> {
  return Promise.resolve(null);
}

/** No non-local branches. Always null → ./index.ts runs the local WAIT path. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- seam parity: the signature must match ./orchestration
export function orchestrateNonLocal(_params: {
  ctx: RouteExecuteContext;
  data: RouteExecuteRequestOutput;
  input: Record<string, WidgetData>;
  instanceId: string | undefined;
  callbackMode: CallbackModeValue | null;
  user: JwtPayloadType;
  logger: EndpointLogger;
  toolName: string;
}): Promise<ResponseType<RouteExecuteResponseOutput> | null> {
  return Promise.resolve(null);
}
