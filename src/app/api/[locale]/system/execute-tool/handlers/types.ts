/**
 * Shared types for execute-tool dispatch phase handlers.
 *
 * The RouteExecuteRepository.execute() orchestrator splits its big sequential
 * flow into focused phase handlers (media-gen resolution, remote transport
 * dispatch, local detach/wakeUp). Each handler receives the same immutable
 * RouteExecuteContext snapshot plus its own phase-specific inputs, and returns
 * a PhaseResult telling the orchestrator whether to return inline or fall
 * through to the next phase.
 *
 * No module-level mutable state — all shared values ride the context object.
 */

import "server-only";

import type { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { GenericHandlerBase } from "next-vibe/core/route/handler";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { AiT } from "next-vibe/platforms/ai/i18n";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import type { RemoteConnectionRepository } from "@/app/api/[locale]/remote-connection/repository";

import type { RouteExecuteResponseInput } from "../definition";

/**
 * Resolved connection info for a remote instance (never null at the transport
 * phase — capability validation already rejected the null case).
 */
export type RemoteConnInfo = NonNullable<
  Awaited<
    ReturnType<typeof RemoteConnectionRepository.getConnectionForInstance>
  >
>;

/**
 * Immutable snapshot shared by every execute-tool phase handler.
 *
 * Built once in execute() after the prefix parse, model resolution, and the
 * revival circuit-breaker have run. toolName here is already the post-prefix
 * (and, on the remote path, preferred) name. resolvedModelId is the cascade
 * result stored for revival.
 */
export interface RouteExecuteContext {
  toolName: string;
  resolvedModelId: ChatModelId | null;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  t: AiT;
  streamContext: ToolExecutionContext;
  platform: Platform;
  /**
   * Pre-loaded route handler for the local WAIT path. When a caller (MCP
   * hot-loader, CLI) has already imported the target handler — e.g. for
   * hot-reload or to reuse the same module for output formatting — it passes it
   * here so executeGenericHandler skips the second dynamic import. Undefined
   * means "load it yourself" (the normal AI / endpoint-to-endpoint path).
   */
  preloadedHandler?: GenericHandlerBase | null;
  /**
   * Pre-split URL path params for the local WAIT path. CLI parses args into
   * data + urlPathParams itself; passing them pre-split makes executeGenericHandler
   * skip its splitArgs step (exact parity with the old direct CLI call).
   * Undefined → the executor auto-splits from input (AI / MCP flat-args convention).
   */
  urlPathParams?: Record<string, WidgetData>;
}

/**
 * Phase handler outcome. "return" means the orchestrator returns the wrapped
 * value immediately; "fallthrough" means continue to the next phase (e.g. a
 * direct-HTTP network failure falls through to the reverse-ws transport).
 */
export type PhaseResult =
  | { kind: "return"; value: ResponseType<RouteExecuteResponseInput> }
  | { kind: "fallthrough" };
