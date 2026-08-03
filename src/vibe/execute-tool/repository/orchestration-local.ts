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

import type { ResponseType } from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";

import type { CallbackModeValue } from "../constants";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseOutput,
} from "../definition";
import type { RouteExecuteContext } from "./types";

/**
 * No cascade without remote/WAKE_UP. Always null.
 *
 * Typed `Promise<null>` rather than `Promise<ChatModelId | null>`: it satisfies
 * ./orchestration's contract structurally while keeping the agent model union —
 * the one import that would drag ../../agent/ai-stream into an otherwise
 * agent-free file — out of the local seam entirely. Narrower AND honest: this
 * function has no other value to return.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- seam parity: the signature must match ./orchestration
export function resolveModelIdIfNeeded(_params: {
  instanceId: string | undefined;
  callbackMode: CallbackModeValue | null;
  user: JwtPayloadType;
  toolExecutionContext: RouteExecuteContext["toolExecutionContext"];
}): Promise<null> {
  return Promise.resolve(null);
}

/**
 * No non-local branches. Always null → ./index.ts runs the local WAIT path.
 *
 * Takes the plain RouteExecuteContext, not the dispatch variant: a parameter
 * accepting the wider type still accepts the dispatch context index.ts builds,
 * and asking for less is what keeps ./types-dispatch off this file's graph.
 */
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
