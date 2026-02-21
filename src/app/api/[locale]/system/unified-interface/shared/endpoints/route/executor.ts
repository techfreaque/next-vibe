/**
 * Route Execution Executor
 * Single source for ALL route execution logic
 * Consolidates route loading, handler extraction, and execution
 * Uses shared permission filtering logic from permissions/registry
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isFileResponse,
  isStreamingResponse,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { getRouteHandler } from "@/app/api/[locale]/system/generated/route-handlers";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CliRequestData } from "../../../cli/runtime/parsing";
import type { CliCompatiblePlatform } from "../../../cli/runtime/route-executor";
import type { EndpointLogger } from "../../logger/endpoint";
import type { Platform } from "../../types/platform";
import { splitArgs } from "../../utils/split-args";

/**
 * Base execution context
 */
export interface BaseExecutionContext<TData> {
  toolName: string;
  data: TData;
  user: JwtPayloadType;
  platform: CliCompatiblePlatform;
  locale: CountryLanguage;
  logger: EndpointLogger;
  timestamp: number;
}

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
    data: CliRequestData;
    /** Pre-split URL path params. If omitted, auto-split from data. */
    urlPathParams?: CliRequestData;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    platform: CliCompatiblePlatform | Platform.AI;
  }): Promise<ResponseType<TResult>> {
    try {
      const handlerResult = await getRouteHandler(params.toolName);

      if (!handlerResult) {
        return fail({
          message:
            "app.api.system.unifiedInterface.cli.vibe.errors.routeNotFound",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Split args: if urlPathParams was not provided by the caller, derive it
      // automatically from data using the endpoint schema.
      let resolvedData: CliRequestData = params.data;
      let resolvedUrlPathParams: CliRequestData = params.urlPathParams ?? {};

      if (params.urlPathParams === undefined) {
        const split = await splitArgs(params.toolName, params.data);
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
      });

      // Streaming responses are not supported in CLI/AI/MCP platforms
      if (isStreamingResponse(result)) {
        return fail({
          message:
            "app.api.system.unifiedInterface.cli.vibe.errors.executionFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // File responses are not supported in CLI/AI/MCP platforms
      if (isFileResponse(result)) {
        return fail({
          message:
            "app.api.system.unifiedInterface.cli.vibe.errors.executionFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
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
        message: "app.api.system.unifiedInterface.cli.vibe.errors.unknownError",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
