/**
 * AI Tool Factory
 * Dynamically creates AI SDK tools from endpoint definitions
 */

import "server-only";

import { tool } from "ai";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../cli/vibe/endpoints/endpoint-handler/logger";
import { generateToolDescription } from "./description-generator";
import { extractInputSchema } from "./schema-extractor";
import type {
  AIToolExecutionContext,
  CoreTool,
  DiscoveredEndpoint,
  IToolExecutor,
  ToolParameterValue,
} from "./types";

/**
 * Tool factory options
 */
export interface ToolFactoryOptions {
  /** Whether to include detailed descriptions */
  verbose?: boolean;
  /** Custom tool name override */
  toolName?: string;
  /** Custom description override */
  description?: string;
}

/**
 * Tool Factory Implementation
 * Converts endpoint definitions to AI SDK tools dynamically
 */
export class ToolFactory {
  /**
   * Create an AI SDK tool from an endpoint definition
   */
  createToolFromEndpoint(
    endpoint: DiscoveredEndpoint,
    executor: IToolExecutor,
    context: {
      user: AIToolExecutionContext["user"];
      locale: CountryLanguage;
      logger: EndpointLogger;
    },
    options: ToolFactoryOptions = {},
  ): CoreTool {
    // Generate tool description
    const description = this.generateDescription(endpoint, options);

    // Generate input schema from endpoint definition
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const inputSchema = this.generateInputSchema(endpoint);

    // Create the tool
    const createdTool = tool({
      description,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      parameters: inputSchema,
      execute: async (params: Record<string, ToolParameterValue>) => {
        // Execute the tool via the executor
        const executionContext: AIToolExecutionContext = {
          toolName: endpoint.toolName,
          parameters: params,
          user: context.user,
          locale: context.locale,
          logger: context.logger,
          metadata: {
            timestamp: Date.now(),
            endpointId: endpoint.id,
          },
        };

        const result = await executor.execute(executionContext);

        if (!result.success) {
          // Return error in a format the AI can understand
          return {
            success: false,
            // eslint-disable-next-line i18next/no-literal-string
            error: result.error || "Tool execution failed",
            // eslint-disable-next-line i18next/no-literal-string
            message: result.error || "Tool execution failed",
          };
        }

        // Return the result data
        return result.data;
      },
    });

    return createdTool as CoreTool;
  }

  /**
   * Generate tool description from endpoint definition
   */
  private generateDescription(
    endpoint: DiscoveredEndpoint,
    options: ToolFactoryOptions,
  ): string {
    return generateToolDescription(endpoint, options);
  }

  /**
   * Generate input schema from endpoint definition
   */
  private generateInputSchema(endpoint: DiscoveredEndpoint): z.ZodTypeAny {
    return extractInputSchema(endpoint);
  }

  /**
   * Create multiple tools from endpoints
   */
  createToolsFromEndpoints(
    endpoints: DiscoveredEndpoint[],
    executor: IToolExecutor,
    context: {
      user: AIToolExecutionContext["user"];
      locale: CountryLanguage;
      logger: EndpointLogger;
    },
    options: ToolFactoryOptions = {},
  ): Map<string, CoreTool> {
    const tools = new Map<string, CoreTool>();

    for (const endpoint of endpoints) {
      try {
        const tool = this.createToolFromEndpoint(
          endpoint,
          executor,
          context,
          options,
        );
        tools.set(endpoint.toolName, tool);

        context.logger.debug("[Tool Factory] Created tool from endpoint", {
          toolName: endpoint.toolName,
          endpointId: endpoint.id,
          method: endpoint.method,
          path: endpoint.path.join("/"),
        });
      } catch (error) {
        context.logger.warn(
          "[Tool Factory] Failed to create tool from endpoint",
          {
            endpointId: endpoint.id,
            error: error instanceof Error ? error.message : String(error),
          },
        );
      }
    }

    return tools;
  }

  /**
   * Check if an endpoint is suitable for tool creation
   */
  canCreateTool(endpoint: DiscoveredEndpoint): boolean {
    // Must have a tool name
    if (!endpoint.toolName) {
      return false;
    }

    // Must have a definition
    if (!endpoint.definition) {
      return false;
    }

    // Must be a safe method (GET, POST) or explicitly marked as AI tool
    const safeMethods = ["GET", "POST"];
    if (!safeMethods.includes(endpoint.method) && !endpoint.definition.aiTool) {
      return false;
    }

    return true;
  }

  /**
   * Filter endpoints suitable for tool creation
   */
  filterToolableEndpoints(
    endpoints: DiscoveredEndpoint[],
  ): DiscoveredEndpoint[] {
    return endpoints.filter((endpoint) => this.canCreateTool(endpoint));
  }
}

/**
 * Singleton instance
 */
let toolFactoryInstance: ToolFactory | null = null;

/**
 * Get the tool factory singleton
 */
export function getToolFactory(): ToolFactory {
  if (!toolFactoryInstance) {
    toolFactoryInstance = new ToolFactory();
  }
  return toolFactoryInstance;
}

/**
 * Helper function to create a tool from an endpoint
 */
export function createToolFromEndpoint(
  endpoint: DiscoveredEndpoint,
  executor: IToolExecutor,
  context: {
    user: AIToolExecutionContext["user"];
    locale: CountryLanguage;
    logger: EndpointLogger;
  },
  options?: ToolFactoryOptions,
): CoreTool {
  const factory = getToolFactory();
  return factory.createToolFromEndpoint(endpoint, executor, context, options);
}

/**
 * Helper function to create multiple tools from endpoints
 */
export function createToolsFromEndpoints(
  endpoints: DiscoveredEndpoint[],
  executor: IToolExecutor,
  context: {
    user: AIToolExecutionContext["user"];
    locale: CountryLanguage;
    logger: EndpointLogger;
  },
  options?: ToolFactoryOptions,
): Map<string, CoreTool> {
  const factory = getToolFactory();
  return factory.createToolsFromEndpoints(
    endpoints,
    executor,
    context,
    options,
  );
}
