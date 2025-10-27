/**
 * AI Tool Executor
 * Executes tools via the existing route delegation handler
 */

import "server-only";

import type {
  CliRequestData,
  DiscoveredRoute,
  RouteExecutionContext,
} from "@/app/api/[locale]/v1/core/system/unified-backend/cli/route-executor";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import { simpleT } from "@/i18n/core/shared";

import { BaseExecutor } from "../shared/base-executor";
import { AI_CONFIG } from "../shared/config";
import type {
  AIToolExecutionContext,
  AIToolExecutionResult,
  IToolExecutor,
  ToolExecutorOptions,
  ToolParameterValue,
} from "./types";

/**
 * Tool Executor Implementation
 * Extends BaseExecutor to eliminate duplication
 */
export class ToolExecutor extends BaseExecutor implements IToolExecutor {
  constructor() {
    super();
  }

  /**
   * Execute a tool
   */
  async execute(
    context: AIToolExecutionContext,
    options: ToolExecutorOptions = {},
  ): Promise<AIToolExecutionResult> {
    const startTime = Date.now();
    const { t } = simpleT(context.locale);
    try {
      // Get endpoint by tool name
      const endpoint = this.getEndpointByToolName(context.toolName);

      if (!endpoint) {
        const emptyPath = "";
        const emptyMethod = "";
        // eslint-disable-next-line i18next/no-literal-string
        const errorMessage = `Tool not found: ${context.toolName}`;
        return {
          success: false,
          error: errorMessage,
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: emptyPath,
            method: emptyMethod,
          },
        };
      }

      // Validate parameters
      const validation = this.validateParameters(
        context.toolName,
        context.parameters,
      );

      if (!validation.valid) {
        const errorSeparator = ", ";
        const pathSeparator = "/";
        const errorMessages = validation.errors ?? [];
        // eslint-disable-next-line i18next/no-literal-string
        const errorMessage = `Parameter validation failed: ${errorMessages.join(errorSeparator)}`;
        return {
          success: false,
          error: errorMessage,
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: endpoint.definition.path.join(pathSeparator),
            method: endpoint.definition.method,
          },
        };
      }

      // Log execution
      context.logger.info(
        `[AI Tool Executor] Executing tool: ${context.toolName}`,
        {
          toolName: context.toolName,
          userId: context.user.id,
          parameters: context.parameters,
        },
      );

      // Dry run mode
      if (options.dryRun) {
        const dryRunPathSeparator = "/";
        return {
          success: true,
          data: {
            dryRun: true,
            toolName: context.toolName,
            parameters: context.parameters,
            endpoint: endpoint.definition.path.join(dryRunPathSeparator),
          },
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: endpoint.definition.path.join(dryRunPathSeparator),
            method: endpoint.definition.method,
          },
        };
      }

      // Convert endpoint to route format
      const pathSeparator = "/";
      const route: DiscoveredRoute = {
        alias: context.toolName,
        path: endpoint.definition.path.join(pathSeparator),
        method: endpoint.definition.method,
        routePath: endpoint.routePath,
        description: endpoint.definition.description,
      };

      // Prepare execution context for route handler
      const defaultOutputFormat = "json";
      const routeContext: RouteExecutionContext = {
        command: context.toolName,
        data: context.parameters as CliRequestData,
        user: context.user,
        locale: context.locale,
        options: {
          verbose: options.verbose || false,
          dryRun: false,
          interactive: false,
          output: defaultOutputFormat,
        },
      };

      // Execute via route delegation handler
      const result = await this.routeHandler.executeRoute(
        route,
        routeContext,
        context.logger,
        context.locale,
        t,
      );

      // Log result with detailed data inspection
      context.logger.info(`[AI Tool Executor] Tool execution completed`, {
        toolName: context.toolName,
        success: result.success,
        executionTime: Date.now() - startTime,
        hasData: !!result.data,
        dataType: typeof result.data,
        dataKeys:
          result.data && typeof result.data === "object"
            ? Object.keys(result.data)
            : [],
        // Log the actual data structure
        resultDataStructure: JSON.stringify(result.data, null, 2),
      });

      // Extract the actual data from the ResponseType wrapper
      // result.data is ResponseType<T> which has { success, data, message, errorType, ... }
      // We need to check if it's a ResponseType wrapper and extract the inner data field
      // A ResponseType has both 'success' and 'data' fields at the top level
      const isResponseTypeWrapper =
        result.data &&
        typeof result.data === "object" &&
        "success" in result.data &&
        "data" in result.data;

      const actualData = isResponseTypeWrapper
        ? (result.data as { data: unknown }).data
        : result.data;

      context.logger.info(`[AI Tool Executor] Extracted data`, {
        isResponseTypeWrapper,
        hasActualData: !!actualData,
        actualDataType: typeof actualData,
        actualDataKeys:
          actualData && typeof actualData === "object"
            ? Object.keys(actualData)
            : [],
        // Log the extracted data structure
        actualDataStructure: JSON.stringify(actualData, null, 2),
      });

      const resultPathSeparator = "/";
      return {
        success: result.success,
        data: actualData,
        error: result.error,
        metadata: {
          executionTime: Date.now() - startTime,
          endpointPath: endpoint.definition.path.join(resultPathSeparator),
          method: endpoint.definition.method,
          ...result.metadata,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      context.logger.error(
        `[AI Tool Executor] Tool execution failed: ${context.toolName}`,
        {
          toolName: context.toolName,
          error: errorMessage,
          executionTime: Date.now() - startTime,
        },
      );

      return {
        success: false,
        error: errorMessage,
        metadata: {
          executionTime: Date.now() - startTime,
          endpointPath: "",
          method: "",
        },
      };
    }
  }

  /**
   * Execute multiple tools in parallel
   */
  async executeParallel(
    contexts: AIToolExecutionContext[],
    options: ToolExecutorOptions = {},
  ): Promise<AIToolExecutionResult[]> {
    if (!AI_CONFIG.features.parallelExecution) {
      // Execute sequentially if parallel execution disabled
      const results: AIToolExecutionResult[] = [];
      for (const context of contexts) {
        const result = await this.execute(context, options);
        results.push(result);
      }
      return results;
    }

    // Execute in parallel
    return await Promise.all(
      contexts.map((context) => this.execute(context, options)),
    );
  }

  /**
   * Validate tool parameters (override for AI-specific types)
   */
  validateParameters(
    toolName: string,
    parameters: Record<string, ToolParameterValue>,
  ): { valid: boolean; errors?: string[] } {
    return super.validateParameters(toolName, parameters);
  }

  /**
   * Create execution context helper
   */
  static createContext(
    toolName: string,
    parameters: Record<string, ToolParameterValue>,
    user: AIToolExecutionContext["user"],
    locale: AIToolExecutionContext["locale"],
    logger: EndpointLogger,
    metadata?: AIToolExecutionContext["metadata"],
  ): AIToolExecutionContext {
    return {
      toolName,
      parameters,
      user,
      locale,
      logger,
      metadata: metadata || {
        timestamp: Date.now(),
      },
    };
  }
}

/**
 * Singleton instance
 */
let toolExecutorInstance: ToolExecutor | null = null;

/**
 * Get or create tool executor instance
 */
export function getToolExecutor(): ToolExecutor {
  if (!toolExecutorInstance) {
    toolExecutorInstance = new ToolExecutor();
  }
  return toolExecutorInstance;
}

/**
 * Export singleton
 */
export const toolExecutor = getToolExecutor();
