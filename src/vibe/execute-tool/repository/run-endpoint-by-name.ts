/**
 * runEndpointByName — execute a tool by string name via the generated registry.
 *
 * Resolves the handler from @/generated/routes/handlers, then delegates to
 * runEndpoint. Use this when the endpoint is not statically known at the call
 * site (AI tool loop, MCP dispatch, CLI executor, confirmed execution).
 *
 * When the endpoint IS statically known, import its route.ts directly and use
 * runEndpoint instead — that avoids pulling in the generated route registry.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";

import type { CountryLanguage } from "../../core/i18n/core/config";
import type { GenericHandlerBase } from "../../core/route/handler";
import type { ResponseType } from "../../core/route/response.schema";
import { success } from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";
import { CallbackMode, type CallbackModeValue } from "../constants";

export async function runEndpointByName(params: {
  toolName: string;
  input?: Record<string, WidgetData>;
  instanceId?: string;
  callbackMode?: CallbackModeValue;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  toolExecutionContext: ToolExecutionContext;
  platform: Platform;
  /** Pre-loaded handler — skips registry lookup when the caller already has it. */
  preloadedHandler?: GenericHandlerBase | null;
  /** Pre-split URL path params (CLI). */
  urlPathParams?: Record<string, WidgetData>;
}): Promise<ResponseType<WidgetData>> {
  const { scopedTranslation } = await import("../../platforms/ai/i18n");
  const { t } = scopedTranslation.scopedT(params.locale);
  const { RouteExecuteRepository } = await import("./index");
  const result = await RouteExecuteRepository.execute(
    {
      toolName: params.toolName,
      input: params.input ?? {},
      instanceId: params.instanceId,
      callbackMode: params.callbackMode ?? CallbackMode.WAIT,
    },
    params.user,
    params.locale,
    params.logger,
    t,
    params.toolExecutionContext,
    params.platform,
    params.preloadedHandler,
    params.urlPathParams,
  );
  if (!result.success) {
    return result;
  }
  const payload: WidgetData = result.data.result ?? result.data;
  const data: WidgetData = JSON.parse(JSON.stringify(payload));
  return success(data, {
    ...(result.isErrorResponse && { isErrorResponse: true }),
    ...(result.performance && { performance: result.performance }),
  });
}
