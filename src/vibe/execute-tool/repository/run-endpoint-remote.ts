/**
 * runEndpointRemote — execute a known endpoint on a remote instance.
 *
 * The caller provides the definition (for type inference + toolName derivation)
 * but NOT the handler — the remote leg resolves its own handler. Routes through
 * RouteExecuteRepository.execute() for full orchestration (guards, callback
 * modes, task lifecycle, transport selection).
 *
 * For local execution use runEndpoint (requires handler).
 * For untyped string-based dispatch use runEndpointByName.
 */

import "server-only";

import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import { createEndpointLogger } from "../../logger/server";
import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";
import { CallbackMode, type CallbackModeValue } from "../constants";

export async function runEndpointRemote<TDef extends CreateApiEndpointAny>(
  params: {
    definition: TDef;
    instanceId: string;
    callbackMode?: CallbackModeValue;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger?: EndpointLogger;
    toolExecutionContext?: ToolExecutionContext;
    platform: Platform;
  } & (TDef["types"]["RequestOutput"] extends never
    ? { input?: never }
    : {
        input: TDef["types"]["RequestOutput"] | TDef["types"]["RequestInput"];
      }) &
    (TDef["types"]["UrlVariablesOutput"] extends never
      ? { urlPathParams?: never }
      : { urlPathParams: TDef["types"]["UrlVariablesOutput"] }),
): Promise<ResponseType<TDef["types"]["ResponseOutput"]>> {
  const { definition, input, urlPathParams, ...rest } = params;
  const logger = rest.logger ?? createEndpointLogger(false, rest.locale);
  const toolExecutionContext =
    rest.toolExecutionContext ??
    makeHeadlessContext(undefined, undefined, "UTC");

  const rawToolName =
    definition.aliases?.[0] ??
    `${definition.path.join("_")}_${definition.method}`;
  const toolName = rawToolName.replaceAll(/\[([^\]]+)\]/g, "$1");

  const { scopedTranslation } = await import("../../platforms/ai/i18n");
  const { t } = scopedTranslation.scopedT(rest.locale);
  const { RouteExecuteRepository } = await import("./index");
  const result = await RouteExecuteRepository.execute(
    {
      toolName,
      input: {
        ...(input as Record<string, WidgetData> | undefined),
        ...(urlPathParams as Record<string, WidgetData> | undefined),
      },
      instanceId: rest.instanceId,
      callbackMode: rest.callbackMode ?? CallbackMode.WAIT,
    },
    rest.user,
    rest.locale,
    logger,
    t,
    toolExecutionContext,
    rest.platform ?? Platform.NEXT_API,
  );
  if (!result.success) {
    return result as ResponseType<TDef["types"]["ResponseOutput"]>;
  }
  const payload: WidgetData = result.data.result ?? result.data;
  const data: WidgetData = JSON.parse(JSON.stringify(payload));
  return success(data as TDef["types"]["ResponseOutput"], {
    ...(result.isErrorResponse && { isErrorResponse: true }),
    ...(result.performance && { performance: result.performance }),
  });
}

/**
 * Route a typed endpoint call through the user's configured inference provider.
 * Resolves the provider instanceId via ExecuteToolRouting, then calls
 * runEndpointRemote. Returns fail() if no provider is configured.
 *
 * No handler required — the remote inference provider resolves its own handler.
 */
export async function runEndpointAsSystemProvider<
  TDef extends CreateApiEndpointAny,
>(
  params: {
    definition: TDef;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    toolExecutionContext: ToolExecutionContext;
    platform: Platform;
  } & (TDef["types"]["RequestOutput"] extends never
    ? { input?: never }
    : { input: TDef["types"]["RequestOutput"] }) &
    (TDef["types"]["UrlVariablesOutput"] extends never
      ? { urlPathParams?: never }
      : { urlPathParams: TDef["types"]["UrlVariablesOutput"] }),
): Promise<ResponseType<TDef["types"]["ResponseOutput"]>> {
  const { user, locale, toolExecutionContext, platform } = params;
  const logger = params.logger ?? createEndpointLogger(false, locale);
  const { scopedTranslation: spT } = await import("../../platforms/ai/i18n");
  const { t: spt } = spT.scopedT(locale);

  if (user.isPublic || !("id" in user)) {
    return fail({
      message: spt("executeTool.post.errors.validation.title"),
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    }) as ResponseType<TDef["types"]["ResponseOutput"]>;
  }

  const { ExecuteToolRouting } =
    await import("../../remote-connection/routing");
  const inferenceTarget = await ExecuteToolRouting.resolveInferenceProvider({
    userId: user.id,
    logger,
  });
  if (!inferenceTarget) {
    return fail({
      message: spt("executeTool.post.errors.notFound.title"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    }) as ResponseType<TDef["types"]["ResponseOutput"]>;
  }

  return runEndpointRemote({
    ...params,
    logger,
    instanceId: inferenceTarget.instanceId,
    toolExecutionContext,
    platform: platform ?? Platform.AI,
  } as Parameters<typeof runEndpointRemote<TDef>>[0]);
}
