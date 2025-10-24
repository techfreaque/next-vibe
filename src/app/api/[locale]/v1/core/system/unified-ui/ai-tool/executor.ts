/**
 * AI Tool Executor
 * Executes tools via the existing route delegation handler
 */

import "server-only";

import type { EndpointLogger } from "../cli/vibe/endpoints/endpoint-handler/logger";
import {
  type DiscoveredRoute,
  RouteDelegationHandler,
  type RouteExecutionContext,
} from "../cli/vibe/utils/route-delegation-handler";

import { aiToolConfig } from "./config";
import { toolDiscovery } from "./discovery";
import type {
  AIToolExecutionContext,
  AIToolExecutionResult,
  DiscoveredEndpoint,
  IToolExecutor,
  ToolExecutorOptions,
  ToolParameterValue,
} from "./types";

/**
 * Tool Executor Implementation
 */
export class ToolExecutor implements IToolExecutor {
  private routeHandler: RouteDelegationHandler;

  constructor() {
    this.routeHandler = new RouteDelegationHandler();
  }

  /**
   * Execute a tool
   */
  async execute(
    context: AIToolExecutionContext,
    options: ToolExecutorOptions = {},
  ): Promise<AIToolExecutionResult> {
    const startTime = Date.now();

    try {
      // Get endpoint by tool name
      const endpoint = await this.getEndpointByToolName(context.toolName);

      if (!endpoint) {
        const emptyPath = "";
        const emptyMethod = "";
        return {
          success: false,
          error: `Tool not found: ${context.toolName}`,
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: emptyPath,
            method: emptyMethod,
          },
        };
      }

      // Validate parameters
      const validation = await this.validateParameters(
        context.toolName,
        context.parameters,
      );

      if (!validation.valid) {
        const errorSeparator = ", ";
        const pathSeparator = "/";
        return {
          success: false,
          error: `Parameter validation failed: ${validation.errors?.join(errorSeparator)}`,
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: endpoint.path.join(pathSeparator),
            method: endpoint.method,
          },
        };
      }

      // Log execution
      if (aiToolConfig.logging.logExecution) {
        const hiddenPlaceholder = "[hidden]";
        context.logger.info(
          `[AI Tool Executor] Executing tool: ${context.toolName}`,
          {
            toolName: context.toolName,
            userId: context.user.id,
            parameters: aiToolConfig.logging.logParameters
              ? context.parameters
              : hiddenPlaceholder,
          },
        );
      }

      // Dry run mode
      if (options.dryRun) {
        const dryRunPathSeparator = "/";
        return {
          success: true,
          data: {
            dryRun: true,
            toolName: context.toolName,
            parameters: context.parameters,
            endpoint: endpoint.path.join(dryRunPathSeparator),
          },
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: endpoint.path.join(dryRunPathSeparator),
            method: endpoint.method,
          },
        };
      }

      // Convert endpoint to route format
      const pathSeparator = "/";
      const route: DiscoveredRoute = {
        alias: context.toolName,
        path: endpoint.path.join(pathSeparator),
        method: endpoint.method,
        routePath: endpoint.routePath,
        description: endpoint.definition.description,
      };

      // Prepare execution context for route handler
      const defaultOutputFormat = "json";
      const routeContext: RouteExecutionContext = {
        command: context.toolName,
        data: context.parameters as Record<
          string,
          string | number | boolean | null | undefined
        >,
        user: context.user as RouteExecutionContext["user"],
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
        (key: string) => key, // Simple t function - routes handle their own translation
      );

      // Log result
      if (aiToolConfig.logging.logExecution) {
        context.logger.info(`[AI Tool Executor] Tool execution completed`, {
          toolName: context.toolName,
          success: result.success,
          executionTime: Date.now() - startTime,
        });
      }

      const resultPathSeparator = "/";
      return {
        success: result.success,
        data: result.data,
        error: result.error,
        metadata: {
          executionTime: Date.now() - startTime,
          endpointPath: endpoint.path.join(resultPathSeparator),
          method: endpoint.method,
          ...result.metadata,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      context.logger.error(`[AI Tool Executor] Execution failed`, {
        toolName: context.toolName,
        error: errorMessage,
      });

      const emptyPath = "";
      const emptyMethod = "";
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
  }

  /**
   * Execute multiple tools in parallel
   */
  async executeParallel(
    contexts: AIToolExecutionContext[],
    options: ToolExecutorOptions = {},
  ): Promise<AIToolExecutionResult[]> {
    if (!aiToolConfig.features.parallelExecution) {
      // Execute sequentially if parallel execution disabled
      const results: AIToolExecutionResult[] = [];
      for (const context of contexts) {
        const result = await this.execute(context, options);
        results.push(result);
      }
      return results;
    }

    // Execute in parallel
    return Promise.all(
      contexts.map((context) => this.execute(context, options)),
    );
  }

  /**
   * Validate tool parameters
   */
  async validateParameters(
    toolName: string,
    parameters: Record<string, ToolParameterValue>,
  ): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      // Get endpoint
      const endpoint = await this.getEndpointByToolName(toolName);

      if (!endpoint) {
        return {
          valid: false,
          errors: [`Tool not found: ${toolName}`],
        };
      }

      // Validate using endpoint's request schema
      if (endpoint.definition.requestSchema) {
        const result = endpoint.definition.requestSchema.safeParse(parameters);

        if (!result.success) {
          const pathSeparator = ".";
          const errorSeparator = ": ";
          const zodError = result.error;
          return {
            valid: false,
            errors: zodError.issues.map(
              (issue) => `${issue.path.join(pathSeparator)}${errorSeparator}${issue.message}`,
            ),
          };
        }
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  /**
   * Get endpoint by tool name
   */
  private async getEndpointByToolName(
    toolName: string,
  ): Promise<DiscoveredEndpoint | null> {
    const endpoints = await toolDiscovery.discover();
    return endpoints.find((e) => e.toolName === toolName) || null;
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
