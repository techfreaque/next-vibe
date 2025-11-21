/**
 * Base Executor
 * Shared execution logic for all platforms (AI, MCP, CLI)
 * Eliminates duplication across platform-specific executors
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { getDiscoveredEndpoints } from "../registry/endpoint-adapter";
import type { DiscoveredEndpoint } from "../types/registry";
import { type Platform } from "../../types/platform";
import { getErrorMessage } from "../../utils/error-utils";
import { extractEndpointPath } from "../../conversion/endpoint-to-metadata";

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

  /** Platform where the request originated */
  platform: Platform;

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
 * Discovered route type
 * Represents a discovered API route/endpoint
 */
export interface DiscoveredRoute {
  alias: string;
  path: string;
  method: string;
  routePath: string;
  description?: string;
}

/**
 * Base Executor Class
 * Provides common execution logic for all platforms
 * Subclasses must implement executeViaRoute
 */
export abstract class BaseExecutor {
  /**
   * Execute a tool via route delegation
   * Must be implemented by subclasses
   */
  protected abstract executeViaRoute<
    TData extends { [key: string]: ParameterValue },
  >(
    context: BaseExecutionContext<TData>,
    options: BaseExecutionOptions,
    t: TFunction,
  ): Promise<BaseExecutionResult>;

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
              (issue: { path: Array<string | number>; message: string }) => `${issue.path.join(".")}: ${issue.message}`,
            ),
          };
        }
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        errors: [getErrorMessage(error as Error | string)],
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
      path: extractEndpointPath(endpoint),
      method: endpoint.definition.method,
      routePath: endpoint.routePath,
      description: endpoint.definition.description,
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
        endpoint: extractEndpointPath(endpoint),
      }),
      metadata: {
        executionTime: Date.now() - startTime,
        endpointPath: extractEndpointPath(endpoint),
        method: endpoint.definition.method,
      },
    };
  }
}
