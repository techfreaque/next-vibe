/**
 * AI Tool Factory
 * Creates AI SDK CoreTool instances from endpoint definitions
 * Uses ONLY shared registry and generates proper Zod schemas
 */

import "server-only";

import { tool } from "ai";
import { z } from "zod";

import { generateSchemaForUsage } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import { FieldUsage } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";

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
   * Create an AI SDK CoreTool from an endpoint definition
   * This is the ONLY place where we create tools - no other conversion logic
   * All types are inferred from the endpoint definition
   */
  createToolFromEndpoint(
    endpoint: DiscoveredEndpoint,
    executor: IToolExecutor,
    context: {
      user: AIToolExecutionContext["user"];
      locale: CountryLanguage;
      logger: EndpointLogger;
    });
    options: ToolFactoryOptions = {});
  ): CoreTool {
    // Generate description from endpoint definition
    const description =
      options.description ||
      endpoint.definition.description ||
      endpoint.definition.title ||
      endpoint.toolName;

    // Generate PROPER Zod schema from fields (not from requestSchema!)
    const parameters = this.generateInputSchema(endpoint);

    // Log schema type for debugging
    context.logger.debug("[Tool Factory] Generated schema", {
      toolName: endpoint.toolName,
      schemaType: parameters.constructor.name,
      isZodObject: parameters instanceof z.ZodObject,
    });

    // Create the AI SDK CoreTool - return type is inferred from tool() function
    // The tool() function infers types from inputSchema and execute return type
    return tool({
      description,
      inputSchema: parameters,
      execute: async (params: z.infer<typeof parameters>) => {
        // params is already properly typed from Zod schema inference
        const executionContext: AIToolExecutionContext = {
          toolName: endpoint.toolName,
          data: params,
          user: context.user,
          locale: context.locale,
          logger: context.logger,
          metadata: {
            timestamp: Date.now(),
            endpointId: endpoint.id,
          });
        };

        const result = await executor.execute(executionContext);

        if (!result.success) {
          return {
            success: false,
            error: result.error ?? "errors.toolExecutionFailed",
            message: result.error ?? "errors.toolExecutionFailed",
          };
        }

        return result.data;
      });
    });
  }

  /**
   * Generate PROPER Zod input schema from endpoint fields
   * DO NOT use endpoint.definition.requestSchema - it's in Standard Schema format!
   * Generate fresh from fields using generateSchemaForUsage
   *
   * CRITICAL: For AI tools, we need to combine both RequestData and RequestUrlParams
   * because AI tools can't distinguish between them - they just pass parameters
   */
  private generateInputSchema(
    endpoint: DiscoveredEndpoint,
  ): z.ZodObject<Record<string, z.ZodTypeAny>> {
    // eslint-disable-next-line i18next/no-literal-string
    const noParamsDescription = "No parameters required for this endpoint";

    // For endpoints with no fields, return strict empty object
    if (!endpoint.definition.fields) {
      return z.object({}).strict().describe(noParamsDescription);
    }

    try {
      // For AI tools, we need to combine both request data and URL params
      // because the AI doesn't know the difference - it just passes parameters
      const requestDataSchema = generateSchemaForUsage(
        endpoint.definition.fields,
        FieldUsage.RequestData,
      ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

      const urlPathParamsSchema = generateSchemaForUsage(
        endpoint.definition.fields,
        FieldUsage.RequestUrlParams,
      ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

      // Collect all fields from both schemas
      const combinedShape: { [key: string]: z.ZodTypeAny } = {};

      // Add request data fields - use type assertion to access shape
      if (requestDataSchema instanceof z.ZodObject) {
        const requestShape = requestDataSchema.shape;
        Object.assign(combinedShape, requestShape);
      }

      // Add URL params fields - use type assertion to access shape
      if (urlPathParamsSchema instanceof z.ZodObject) {
        const urlShape = urlPathParamsSchema.shape;
        Object.assign(combinedShape, urlShape);
      }

      // If no fields found, return strict empty object
      if (Object.keys(combinedShape).length === 0) {
        return z.object({});
      }

      // Create combined schema
      return z.object(combinedShape);
    } catch {
      return z.object({});
    }
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
    });
    options: ToolFactoryOptions = {});
  ): Map<string, CoreTool> {
    const tools = new Map<string, CoreTool>();

    for (const endpoint of endpoints) {
      const createdTool = this.createToolFromEndpoint(
        endpoint,
        executor,
        context,
        options,
      );
      tools.set(endpoint.toolName, createdTool);

      context.logger.debug("[Tool Factory] Created tool from endpoint", {
        toolName: endpoint.toolName,
        endpointId: endpoint.id,
        method: endpoint.definition.method,
      });
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
    if (
      !safeMethods.includes(endpoint.definition.method) &&
      !endpoint.definition.aiTool
    ) {
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
  });
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
  });
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
