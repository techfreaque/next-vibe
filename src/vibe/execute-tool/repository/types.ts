/**
 * Shared types for the LOCAL execute-tool path — "run it here, now, inline".
 *
 * Scope rule for this file: a type belongs here only if the local path needs it.
 * Everything describing a call that runs somewhere else (remote dispatch) or at
 * some other time (the task system) lives in ./types-dispatch, so a local-only
 * deployment can decline that module wholesale instead of editing around the
 * clusters. The split is the type-level half of the ./orchestration-local vs
 * ./orchestration seam — keep both halves on the same side when moving a type.
 */

import type { ToolExecutionContext } from "next-vibe/core/execution-context";

import type { CountryLanguage } from "../../core/i18n/core/config";
import type { GenericHandlerBase } from "../../core/route/handler";
import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import type { AiT } from "../../platforms/ai/i18n";
import type { Platform } from "../../platforms/platforms";

/* ── Execution context ─────────────────────────────────────────────────────── */

/** Base execution context shared by platform executors (MCP registry etc.). */
export interface BaseExecutionContext<TData> {
  toolName: string;
  data: TData;
  user: JwtPayloadType;
  platform: Platform;
  locale: CountryLanguage;
  logger: EndpointLogger;
  timestamp: number;
}

/**
 * Immutable snapshot shared by every execute-tool phase handler.
 *
 * Built once in RouteExecuteRepository.execute() after the prefix parse and the
 * revival circuit-breaker have run. toolName here is already the post-prefix
 * (and, on the remote path, preferred) name.
 *
 * The dispatch-only model cascade result is NOT here — it hangs off
 * RouteExecuteDispatchContext in ./types-dispatch, which intersects this type.
 * That keeps the local path's context free of any agent-model dependency while
 * still letting index.ts build one object and hand it to both sides.
 */
export interface RouteExecuteContext {
  toolName: string;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  t: AiT;
  toolExecutionContext: ToolExecutionContext;
  platform: Platform;
  /**
   * Pre-loaded route handler for the local WAIT path. When a caller (MCP
   * hot-loader, CLI) has already imported the target handler it passes it here
   * so executeGenericHandler skips the second dynamic import. Undefined means
   * "load it yourself" (the normal AI / endpoint-to-endpoint path).
   */
  preloadedHandler?: GenericHandlerBase | null;
  /**
   * Pre-split URL path params for the local WAIT path. CLI parses args into
   * data + urlPathParams itself; passing them pre-split makes
   * executeGenericHandler skip its arg-splitting step. Undefined → the
   * executor auto-splits from input (AI / MCP flat-args convention).
   */
  urlPathParams?: Record<string, WidgetData>;
}
