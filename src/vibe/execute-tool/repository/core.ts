/**
 * Execute-tool CORE — the low-level route executor every platform converges on.
 *
 * LEAN BY CONTRACT: this module's import graph must stay minimal (platform
 * enum, i18n, response schema, generated-endpoint lookup). It pulls in NONE of
 * execute-tool's orchestration (guards / local / remote / completion) — the
 * next-route hot path, where the handler and definition are already loaded,
 * uses it (via `preloadedHandler`) without dragging the executor graph into the
 * route bundle. Orchestration (callback modes, transports, task lifecycle)
 * layers on top in ./index.ts.
 *
 * Called only from inside execute-tool (index + handlers) — external code
 * goes through RouteExecuteRepository.execute / runInProcessTyped.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import { getFullPath } from "next-vibe/core/core-utils/path";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { GenericHandlerBase } from "next-vibe/core/route/handler";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isContentResponse,
  isFileResponse,
  isStreamingResponse,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";

import { scopedTranslation as systemScopedTranslation } from "@/_pages/shared/i18n";
import { getEndpoint } from "@/generated/endpoints/endpoint";

export class RouteExecutionExecutor {
  /**
   * Execute generic handler - THE method ALL platforms use
   * toolName is the full path with method or alias - no parsing needed
   *
   * Standard handler signature: { data, urlPathParams, user, locale, logger, platform }
   *
   * urlPathParams is optional. When omitted (AI / MCP / run paths), args are
   * automatically split from `data` using the endpoint's requestUrlPathParamsSchema.
   * Callers that already have pre-split params (CLI) can pass urlPathParams directly.
   */
  public static async executeGenericHandler<TResult>(params: {
    toolName: string;
    data: Record<string, WidgetData>;
    /** Pre-split URL path params. If omitted, auto-split from data. */
    urlPathParams?: Record<string, WidgetData>;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    platform: Platform;
    /** Stream context - rootFolderId, threadId, aiMessageId, etc. */
    toolExecutionContext: ToolExecutionContext;
    /** Pre-loaded route handler - avoids a second dynamic import when caller already loaded it */
    preloadedHandler?: GenericHandlerBase | null;
  }): Promise<ResponseType<TResult>> {
    const { t } = systemScopedTranslation.scopedT(params.locale);
    try {
      let handlerResult = params.preloadedHandler ?? null;
      if (params.preloadedHandler === undefined) {
        // Retry with a short backoff: concurrent dynamic imports of a large
        // cyclic route graph can observe a PARTIAL module namespace (`.tools`
        // still undefined → TypeError) while another import of the same graph
        // is mid-evaluation. A beat later the fully-evaluated module is cached
        // and the same import succeeds.
        const { getRouteHandler } = await import("@/generated/routes/handlers");
        for (let attempt = 0; attempt < 4; attempt++) {
          if (attempt > 0) {
            await new Promise((resolve) => {
              setTimeout(resolve, 200 * attempt);
            });
          }
          try {
            handlerResult = await getRouteHandler(params.toolName);
            break;
          } catch (importError) {
            if (attempt === 3) {
              // oxlint-disable-next-line restricted-syntax -- re-throw into the existing catch
              throw importError;
            }
          }
        }
      }

      if (!handlerResult) {
        return fail({
          message: t("cli.vibe.errors.routeNotFound", {
            toolName: params.toolName,
          }),
          errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        });
      }

      // Split args: if urlPathParams was not provided by the caller, derive it
      // automatically from data using the endpoint schema.
      let resolvedData: Record<string, WidgetData> = params.data;
      let resolvedUrlPathParams: Record<string, WidgetData> =
        params.urlPathParams ?? {};

      if (params.urlPathParams === undefined) {
        const split = await RouteExecutionExecutor.splitArgs(
          params.toolName,
          params.data,
        );
        resolvedData = split.data;
        resolvedUrlPathParams = split.urlPathParams;
      }

      // Execute handler
      const result = await handlerResult({
        data: resolvedData,
        urlPathParams: resolvedUrlPathParams,
        user: params.user,
        locale: params.locale,
        logger: params.logger,
        platform: params.platform,
        toolExecutionContext: params.toolExecutionContext,
      });

      // Streaming responses are not supported in CLI/AI/MCP platforms
      if (isStreamingResponse(result)) {
        return fail({
          message: t("cli.vibe.errors.executionFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // File responses are not supported in CLI/AI/MCP platforms
      if (isFileResponse(result)) {
        return fail({
          message: t("cli.vibe.errors.executionFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Content responses carry mixed content blocks (text + images).
      // For AI platform: convert to ToolResultOutput { type: "content", value: [...] } so
      // the AI SDK sends image parts as structured image-data (image tokens) instead of
      // serializing the ContentResponse as raw JSON text (which counts base64 as millions
      // of text tokens and causes context overflow).
      if (isContentResponse(result)) {
        if (params.platform === Platform.AI) {
          type AiPart =
            | { type: "text"; text: string }
            | { type: "image-data"; data: string; mediaType: string };
          const parts: AiPart[] = [];
          for (const b of result.content) {
            if (b.type === "text") {
              parts.push({ type: "text", text: b.text });
            } else if (b.type === "image") {
              parts.push({
                type: "image-data",
                data: b.data,
                mediaType: b.mimeType,
              });
            }
          }
          return success(
            (parts.length > 0
              ? { type: "content", value: parts }
              : { status: "screenshot_taken" }) as TResult,
          );
        }
        return success(result as TResult);
      }

      if (result.success) {
        return success(result.data, {
          ...(result.isErrorResponse && { isErrorResponse: true }),
          ...(result.performance && { performance: result.performance }),
        });
      }

      // Return the original error from the handler
      return result;
    } catch (error) {
      const parsedError = parseError(error);
      params.logger.error(
        "[Route Execution Executor] Handler execution failed",
        parsedError,
        {
          toolName: params.toolName,
          error: parsedError.message,
        },
      );
      return fail({
        message: t("cli.vibe.errors.unknownError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Split a flat merged-args object into urlPathParams + data using the
   * endpoint's requestUrlPathParamsSchema.
   *
   * When an AI model or MCP client calls a tool, all arguments arrive as a
   * single flat object (the intersection of requestSchema +
   * requestUrlPathParamsSchema). This splits them back into the two buckets
   * the handler expects:
   *  1. Resolve toolName / alias → canonical path via getFullPath
   *  2. Load the endpoint definition via getEndpoint
   *  3. safeParse mergedArgs through requestUrlPathParamsSchema - matching keys go to urlPathParams
   *  4. Everything else goes to data
   *
   * If the endpoint cannot be resolved the entire object is passed as data
   * (safe fallback).
   */
  private static async splitArgs(
    toolName: string,
    mergedArgs: Record<string, WidgetData>,
  ): Promise<{
    urlPathParams: Record<string, WidgetData>;
    data: Record<string, WidgetData>;
  }> {
    const path = getFullPath(toolName);
    if (path === null) {
      return { urlPathParams: {}, data: mergedArgs ?? {} };
    }

    const definition = await getEndpoint(path);
    if (!definition) {
      return { urlPathParams: {}, data: mergedArgs ?? {} };
    }

    const urlParseResult =
      definition.requestUrlPathParamsSchema.safeParse(mergedArgs);
    const urlPathParams: Record<string, WidgetData> = urlParseResult.success
      ? (urlParseResult.data as Record<string, WidgetData>)
      : {};

    const urlKeySet = new Set(Object.keys(urlPathParams));
    const data: Record<string, WidgetData> = {};
    for (const [key, value] of Object.entries(mergedArgs ?? {})) {
      if (!urlKeySet.has(key)) {
        data[key] = value;
      }
    }

    return { urlPathParams, data };
  }
}
