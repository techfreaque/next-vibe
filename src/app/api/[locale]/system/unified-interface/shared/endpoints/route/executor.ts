/**
 * Route Execution Executor
 * Single source for ALL route execution logic
 * Consolidates route loading, handler extraction, and execution
 * Uses shared permission filtering logic from permissions/registry
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";
import type { z } from "zod";

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

import type { CliCompatiblePlatform } from "../../../cli/runtime/route-executor";
import type { EndpointLogger } from "../../logger/endpoint";

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

/**
 * Base execution options
 */
export interface BaseExecutionOptions {
  verbose?: boolean;
  dryRun?: boolean;
  interactive?: boolean;
  output?: "json" | "table" | "pretty";
}

/**
 * Interface for Route Execution Executor
 * Single unified interface for ALL platforms
 */
export interface IRouteExecutionExecutor {
  /**
   * Execute generic handler - THE method ALL platforms use
   * Standard handler signature: { data, urlPathParams, user, locale, logger, platform }
   * Handles: permission checking, route loading, handler execution
   */
  executeGenericHandler<TData, TUrlPathParams, TResult>(params: {
    toolName: string;
    data: TData;
    urlPathParams?: TUrlPathParams;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    platform: CliCompatiblePlatform;
  }): Promise<ResponseType<TResult>>;

  /**
   * CLI-specific: Get missing required fields from schema (for interactive forms)
   */
  getMissingRequiredFields<TData>(
    data: TData,
    schema: z.ZodTypeAny | null | undefined,
    logger: EndpointLogger,
  ): string[];

  /**
   * Merge data from multiple sources (for arg parsing)
   */
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Data merging: Input data from CLI arguments, environment vars, etc. can have any object structure, so unknown is correct for the generic merge utility.
  mergeData<TData extends Record<string, unknown>>(
    ...sources: Array<TData | null | undefined>
  ): Partial<TData>;
}

export class RouteExecutionExecutor implements IRouteExecutionExecutor {
  /**
   * Get missing required fields from schema
   * Platform-agnostic field validation
   */
  getMissingRequiredFields<TData>(
    data: TData,
    schema: z.ZodTypeAny | null | undefined,
    logger: EndpointLogger,
  ): string[] {
    if (!schema) {
      return [];
    }

    try {
      const result = schema.safeParse(data);

      if (!result.success) {
        // Extract only "required" errors (invalid_type with received: "undefined")
        return result.error.issues
          .filter(
            (issue) =>
              issue.code === "invalid_type" &&
              "received" in issue &&
              issue.received === "undefined",
          )
          .map((issue) => [...issue.path].join("."));
      }

      return [];
    } catch (error) {
      logger.warn("[Route Execution Executor] Failed to check required fields", {
        error: parseError(error).message,
      });
      return [];
    }
  }

  /**
   * Merge data from multiple sources
   * Platform-agnostic data merging (CLI args, provided data, defaults, etc.)
   */
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Data merging: Input data from CLI arguments, environment vars, etc. can have any object structure, so unknown is correct for the generic merge utility.
  mergeData<TData extends Record<string, unknown>>(
    ...sources: Array<TData | null | undefined>
  ): Partial<TData> {
    return sources.reduce<Partial<TData>>((acc, source) => {
      if (source && typeof source === "object") {
        return { ...acc, ...source };
      }
      return acc;
    }, {});
  }

  /**
   * Execute generic handler - THE method ALL platforms use
   * toolName is the full path with method or alias - no parsing needed
   *
   * Standard handler signature: { data, urlPathParams, user, locale, logger, platform }
   */
  async executeGenericHandler<TData, TUrlPathParams, TResult>(params: {
    toolName: string;
    data: TData;
    urlPathParams?: TUrlPathParams;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    platform: CliCompatiblePlatform;
  }): Promise<ResponseType<TResult>> {
    try {
      const handlerResult = await getRouteHandler(params.toolName);

      if (!handlerResult) {
        return fail({
          message: "app.api.system.unifiedInterface.cli.vibe.errors.routeNotFound",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Execute handler
      const result = await handlerResult({
        data: params.data,
        urlPathParams: params.urlPathParams ?? {},
        user: params.user,
        locale: params.locale,
        logger: params.logger,
        platform: params.platform,
      });

      // Streaming responses are not supported in CLI/AI/MCP platforms
      if (isStreamingResponse(result)) {
        return fail({
          message: "app.api.system.unifiedInterface.cli.vibe.errors.executionFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // File responses are not supported in CLI/AI/MCP platforms
      if (isFileResponse(result)) {
        return fail({
          message: "app.api.system.unifiedInterface.cli.vibe.errors.executionFailed",
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
      params.logger.error("[Route Execution Executor] Handler execution failed", parsedError, {
        toolName: params.toolName,
        error: parsedError.message,
      });
      return fail({
        message: "app.api.system.unifiedInterface.cli.vibe.errors.unknownError",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

/**
 * Singleton instance
 */
export const routeExecutionExecutor = new RouteExecutionExecutor();
