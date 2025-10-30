/**
 * Base Executor
 * Shared execution logic for all platforms (AI, MCP, CLI)
 * Eliminates duplication across platform-specific executors
 */

import "server-only";

import {
  type DiscoveredRoute,
  RouteDelegationHandler,
  type RouteExecutionContext,
  type RouteExecutionResult,
} from "@/app/api/[locale]/v1/core/system/unified-interface/cli/route-executor";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { getDiscoveredEndpoints } from "../discovery/adapter";
import type { DiscoveredEndpoint } from "../types/registry";

/**
 * Extract error message from unknown error
 * Inlined to avoid Turbopack bundling issues
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return String(error);
}

/**
 * Recursive parameter value type
 * Used across all platforms for endpoint parameters
 */
export type ParameterValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ParameterValue[]
  | { [key: string]: ParameterValue };

/**
 * Base execution context
 * Shared across all platforms (AI, MCP, CLI)
 */
export interface BaseExecutionContext<
  TData = { [key: string]: ParameterValue },
> {
  /** Endpoint/tool name being executed */
  toolName: string;

  /** Request data/parameters */
  data: TData;

  /** User context - uses JWT payload type for consistency */
  user: JwtPayloadType;

  /** Locale for translations */
  locale: CountryLanguage;

  /** Logger instance */
  logger: EndpointLogger;

  /** Optional request ID for tracking */
  requestId?: number | string;

  /** Optional metadata */
  metadata?: {
    timestamp: number;
    [key: string]: ParameterValue;
  };
}

/**
 * Base execution result
 * Shared across all platforms (AI, MCP, CLI)
 */
export interface BaseExecutionResult<
  TErrorParams = { [key: string]: string | number },
  TMetadata = {
    executionTime: number;
    endpointPath: string;
    method: string;
    [key: string]: ParameterValue;
  },
> {
  success: boolean;
  data?: ParameterValue;
  error?: string;
  errorParams?: TErrorParams;
  metadata?: TMetadata;
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
 * Base Executor Class
 * Provides common execution logic for all platforms
 */
export abstract class BaseExecutor {
  protected routeHandler: RouteDelegationHandler;

  constructor() {
    this.routeHandler = new RouteDelegationHandler();
  }

  /**
   * Execute a tool via route delegation
   */
  protected async executeViaRoute<TData extends { [key: string]: ParameterValue }>(
    context: BaseExecutionContext<TData>,
    options: BaseExecutionOptions,
    t: TFunction,
  ): Promise<BaseExecutionResult> {
    const startTime = Date.now();

    try {
      // Get endpoint by tool name
      const endpoint = this.getEndpointByToolName(context.toolName);

      if (!endpoint) {
        context.logger.error("[Base Executor] Tool not found", {
          toolName: context.toolName,
        });
        return this.createErrorResult("Tool not found", startTime);
      }

      // Dry run mode
      if (options.dryRun) {
        return this.createDryRunResult(
          context.toolName,
          context.data,
          endpoint,
          startTime,
        );
      }

      // Convert endpoint to route format
      const route = this.endpointToRoute(endpoint, context.toolName);

      // Prepare execution context for route handler
      const routeContext = this.createRouteContext(context, options);

      // Execute via route delegation handler
      const result = await this.routeHandler.executeRoute(
        route,
        routeContext,
        context.logger,
        context.locale,
        t,
      );

      // Convert result to base format
      return this.convertRouteResult(result, endpoint, startTime);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      context.logger.error(`[Base Executor] Tool execution failed`, {
        toolName: context.toolName,
        error: errorMessage,
        executionTime: Date.now() - startTime,
      });

      return this.createErrorResult(errorMessage, startTime);
    }
  }

  /**
   * Validate tool parameters
   */
  protected validateParameters<TData = { [key: string]: ParameterValue }>(
    toolName: string,
    parameters: TData,
  ): { valid: boolean; errors?: string[] } {
    try {
      const endpoint = this.getEndpointByToolName(toolName);

      if (!endpoint) {
        return {
          valid: false,
          errors: ["Tool not found"],
        };
      }

      // Validate using endpoint's request schema
      if (endpoint.definition.requestSchema) {
        const result = endpoint.definition.requestSchema.safeParse(parameters);

        if (!result.success) {
          return {
            valid: false,
            errors: result.error.issues.map(
              (issue) => `${issue.path.join(".")}: ${issue.message}`,
            ),
          };
        }
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        errors: [getErrorMessage(error)],
      };
    }
  }

  /**
   * Get endpoint by tool name
   */
  protected getEndpointByToolName(toolName: string): DiscoveredEndpoint | null {
    const endpoints = getDiscoveredEndpoints();
    return endpoints.find((e) => e.toolName === toolName) || null;
  }

  /**
   * Convert endpoint to route format
   */
  protected endpointToRoute(
    endpoint: DiscoveredEndpoint,
    toolName: string,
  ): DiscoveredRoute {
    return {
      alias: toolName,
      path: endpoint.definition.path.join("/"),
      method: endpoint.definition.method,
      routePath: endpoint.routePath,
      description: endpoint.definition.description,
    };
  }

  /**
   * Create route execution context
   */
  protected createRouteContext<TData extends { [key: string]: ParameterValue }>(
    context: BaseExecutionContext<TData>,
    options: BaseExecutionOptions,
  ): RouteExecutionContext {
    return {
      toolName: context.toolName,
      data: context.data,
      user: context.user,
      locale: context.locale,
      logger: context.logger,
      options: {
        verbose: options.verbose || false,
        dryRun: options.dryRun || false,
        interactive: options.interactive || false,
        output: options.output || "json",
      },
    };
  }

  /**
   * Convert route result to base result
   */
  protected convertRouteResult(
    result: RouteExecutionResult,
    endpoint: DiscoveredEndpoint,
    startTime: number,
  ): BaseExecutionResult {
    return {
      success: result.success,
      data: result.data,
      error: result.error,
      metadata: {
        executionTime: Date.now() - startTime,
        endpointPath: endpoint.definition.path.join("/"),
        method: endpoint.definition.method,
        ...result.metadata,
      },
    };
  }

  /**
   * Create error result
   */
  protected createErrorResult(
    error: string,
    startTime: number,
  ): BaseExecutionResult {
    return {
      success: false,
      error,
      metadata: {
        executionTime: Date.now() - startTime,
        endpointPath: "",
        method: "",
      },
    };
  }

  /**
   * Create dry run result
   */
  protected createDryRunResult<TData = { [key: string]: ParameterValue }>(
    toolName: string,
    parameters: TData,
    endpoint: DiscoveredEndpoint,
    startTime: number,
  ): BaseExecutionResult {
    return {
      success: true,
      data: JSON.stringify({
        dryRun: true,
        toolName,
        parameters,
        endpoint: endpoint.definition.path.join("/"),
      }),
      metadata: {
        executionTime: Date.now() - startTime,
        endpointPath: endpoint.definition.path.join("/"),
        method: endpoint.definition.method,
      },
    };
  }
}
