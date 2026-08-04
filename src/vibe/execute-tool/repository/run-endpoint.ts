/**
 * runEndpoint — execute a known endpoint locally with its handler.
 *
 * Both definition and handler are provided by the caller (imported directly
 * from the endpoint's route.ts). No generated route registry is ever touched —
 * not for handler lookup, not for arg-splitting.
 *
 * Local WAIT only. For remote execution use runEndpointRemote (no handler).
 */

import "server-only";

import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../core/i18n/core/config";
import type { GenericHandlerReturnType } from "../../core/route/handler";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isContentResponse,
  isFileResponse,
  isStreamingResponse,
  success,
} from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import { parseError } from "../../core/utils/parse-error";
import type { JwtPayloadType } from "../../identity/auth/types";
import { createEndpointLogger } from "../../logger/server";
import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";
import { scopedTranslation as systemScopedTranslation } from "@/_pages/shared/i18n";

export async function runEndpoint<TDef extends CreateApiEndpointAny>(
  params: {
    definition: TDef;
    /** Handler from the endpoint's route.ts (route.tools.METHOD) — no registry lookup ever occurs. */
    handler: GenericHandlerReturnType<TDef>;
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
  const { definition, handler, input, urlPathParams, ...rest } = params;
  const logger = rest.logger ?? createEndpointLogger(false, rest.locale);
  const toolExecutionContext =
    rest.toolExecutionContext ??
    makeHeadlessContext(undefined, undefined, "UTC");

  // Local WAIT — call handler directly. Split urlPathParams from input using
  // the definition's schema (no generated registry import needed).
  let resolvedData: Record<string, WidgetData>;
  let resolvedUrlPathParams: Record<string, WidgetData>;

  if (urlPathParams !== undefined) {
    resolvedData = input as Record<string, WidgetData>;
    resolvedUrlPathParams = urlPathParams as Record<string, WidgetData>;
  } else {
    const mergedArgs = (input ?? {}) as Record<string, WidgetData>;
    const urlParseResult =
      definition.requestUrlPathParamsSchema.safeParse(mergedArgs);
    resolvedUrlPathParams = urlParseResult.success
      ? (urlParseResult.data as Record<string, WidgetData>)
      : {};
    const urlKeySet = new Set(Object.keys(resolvedUrlPathParams));
    resolvedData = Object.fromEntries(
      Object.entries(mergedArgs).filter(([k]) => !urlKeySet.has(k)),
    );
  }

  const { t } = systemScopedTranslation.scopedT(rest.locale);
  try {
    const result = await handler({
      data: resolvedData as TDef["types"]["RequestOutput"],
      urlPathParams:
        resolvedUrlPathParams as TDef["types"]["UrlVariablesOutput"],
      user: rest.user as Parameters<typeof handler>[0]["user"],
      locale: rest.locale,
      logger,
      platform: rest.platform ?? Platform.NEXT_API,
      toolExecutionContext,
    });

    if (isStreamingResponse(result) || isFileResponse(result)) {
      return fail({
        message: t("cli.vibe.errors.executionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      }) as ResponseType<TDef["types"]["ResponseOutput"]>;
    }

    if (isContentResponse(result)) {
      return success(result as TDef["types"]["ResponseOutput"]);
    }

    if (result.success) {
      return success(result.data as TDef["types"]["ResponseOutput"], {
        ...(result.isErrorResponse && { isErrorResponse: true }),
        ...(result.performance && { performance: result.performance }),
      });
    }

    return result as ResponseType<TDef["types"]["ResponseOutput"]>;
  } catch (error) {
    const msg = parseError(error).message;
    logger.error("[runEndpoint] Handler execution failed", {
      error: msg,
    });
    return fail({
      message: t("cli.vibe.errors.unknownErrorDetail", { error: msg }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    }) as ResponseType<TDef["types"]["ResponseOutput"]>;
  }
}
