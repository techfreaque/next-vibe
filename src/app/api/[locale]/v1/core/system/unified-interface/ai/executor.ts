/**
 * AI Tool Executor
 * Executes tools via the existing route delegation handler
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";

import { Platform } from "../shared/types/platform";
import { AI_CONFIG } from "./config";
import {
  BaseExecutor,
  type BaseExecutionResult,
  type BaseExecutionContext,
  type BaseExecutionOptions,
} from "../shared/server-only/execution/executor";
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
  // Import route handler lazily to avoid circular dependencies
  private routeHandler = require("../cli/route-executor").routeHandler;

  /**
   * Execute via route delegation - implements abstract method from BaseExecutor
   */
  protected async executeViaRoute<TData extends Record<string, ToolParameterValue>>(
    context: BaseExecutionContext<TData>,
    options: BaseExecutionOptions,
    t: TFunction,
  ): Promise<BaseExecutionResult> {
    const startTime = Date.now();
    const endpoint = this.getEndpointByToolName(context.toolName);

    if (!endpoint) {
      return {
        success: false,
        error: "Tool not found",
        metadata: { executionTime: Date.now() - startTime, endpointPath: "", method: "" },
      };
    }

    const route = this.endpointToRoute(endpoint, context.toolName);
    const result = await this.routeHandler.executeRoute(route, context, context.logger, context.locale, t);

    return {
      success: result.success,
      data: result.data,
      error: result.error,
      metadata: {
        executionTime: Date.now() - startTime,
        endpointPath: endpoint.definition.path.join("/"),
        method: endpoint.definition.method,
      },
    };
  }

  /**
   * Execute a tool using shared base executor logic
   */
  async execute(
    context: AIToolExecutionContext,
    options: ToolExecutorOptions = {},
  ): Promise<AIToolExecutionResult> {
    const { t } = simpleT(context.locale);

    // Validate parameters before execution
    const validation = this.validateParameters(context.toolName, context.data);

    if (!validation.valid) {
      const startTime = Date.now();
      const endpoint = this.getEndpointByToolName(context.toolName);
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
          endpointPath: endpoint?.definition.path.join(pathSeparator) || "",
          method: endpoint?.definition.method || "",
        },
      };
    }

    // Log execution
    context.logger.info(
      `[AI Tool Executor] Executing tool: ${context.toolName}`,
      {
        toolName: context.toolName,
        userId: context.user.id,
        data: context.data,
      },
    );

    // Use base executor's shared logic
    const result = await this.executeViaRoute(context, options, t);

    // Extract actual data from ResponseType wrapper if needed
    const actualData = this.extractActualData(result.data, context.logger);

    context.logger.info(`[AI Tool Executor] Tool execution completed`, {
      toolName: context.toolName,
      success: result.success,
      executionTime: result.metadata?.executionTime,
    });

    return {
      ...result,
      data: actualData,
    };
  }

  /**
   * Extract actual data from ResponseType wrapper
   */
  private extractActualData(
    data: ToolParameterValue | undefined,
    logger: EndpointLogger,
  ): ToolParameterValue | undefined {
    // Check if it's a ResponseType wrapper
    const isResponseTypeWrapper =
      data && typeof data === "object" && "success" in data && "data" in data;

    if (isResponseTypeWrapper) {
      const actualData = (data as { data: ToolParameterValue }).data;
      logger.debug(
        `[AI Tool Executor] Extracted data from ResponseType wrapper`,
      );
      return actualData;
    }

    return data;
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
  override validateParameters<TData = { [key: string]: ToolParameterValue }>(
    toolName: string,
    parameters: TData,
  ): { valid: boolean; errors?: string[] } {
    return super.validateParameters(toolName, parameters);
  }

  /**
   * Create execution context helper
   */
  static createContext(
    toolName: string,
    data: { [key: string]: ToolParameterValue },
    user: AIToolExecutionContext["user"],
    locale: AIToolExecutionContext["locale"],
    logger: EndpointLogger,
    metadata?: AIToolExecutionContext["metadata"],
  ): AIToolExecutionContext {
    return {
      toolName,
      data,
      user,
      platform: Platform.AI,
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
