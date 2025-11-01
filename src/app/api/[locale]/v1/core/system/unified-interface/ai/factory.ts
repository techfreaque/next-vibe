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

import { Platform } from "../shared/server-only/config";
import type {
  AIToolExecutionContext,
  CoreTool,
  DiscoveredEndpoint,
  IToolExecutor,
  ToolParameterValue,
} from "./types";

/**
 * Type-safe helper to check if schema has a property
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasProperty<T extends string>(obj: any, prop: T): obj is Record<T, any> {
  return obj && typeof obj === "object" && prop in obj;
}

/**
 * Strip transforms and refinements from a Zod schema to make it JSON Schema compatible
 * This is needed for AI tools because the AI SDK needs to serialize schemas to JSON Schema
 * Transforms and refinements are runtime-only features that can't be represented in JSON Schema
 *
 * This implementation uses runtime property checking instead of type guards
 * to avoid issues with Zod v4 internal type changes
 */
function stripTransformsAndRefinements(schema: z.ZodTypeAny): z.ZodTypeAny {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schemaDef = (schema as any)._def;

  if (!schemaDef || typeof schemaDef.typeName !== "string") {
    return schema;
  }

  // Handle ZodEffects (transforms, refinements, preprocessors)
  if (schemaDef.typeName === "ZodEffects" && hasProperty(schemaDef, "schema")) {
    return stripTransformsAndRefinements(schemaDef.schema as z.ZodTypeAny);
  }

  // Handle ZodBranded - unwrap to underlying type
  // This handles cases like: z.string() as z.ZodType<TranslationKey>
  if (schemaDef.typeName === "ZodBranded" && hasProperty(schemaDef, "type")) {
    return stripTransformsAndRefinements(schemaDef.type as z.ZodTypeAny);
  }

  // Handle ZodOptional - has unwrap() method
  if (schemaDef.typeName === "ZodOptional" && hasProperty(schema, "unwrap")) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unwrapped = stripTransformsAndRefinements((schema as any).unwrap());
    return unwrapped.optional();
  }

  // Handle ZodNullable - has unwrap() method
  if (schemaDef.typeName === "ZodNullable" && hasProperty(schema, "unwrap")) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unwrapped = stripTransformsAndRefinements((schema as any).unwrap());
    return unwrapped.nullable();
  }

  // Handle ZodDefault - has removeDefault() method
  if (schemaDef.typeName === "ZodDefault" && hasProperty(schema, "removeDefault")) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const innerSchema = stripTransformsAndRefinements((schema as any).removeDefault());
    // Get the default value from _def
    const defaultValue = schemaDef.defaultValue;
    const resolvedDefault = typeof defaultValue === "function" ? defaultValue() : defaultValue;
    return innerSchema.default(resolvedDefault);
  }

  // Handle ZodObject - recursively strip from all properties
  if (schemaDef.typeName === "ZodObject" && hasProperty(schema, "shape")) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shape = (schema as any).shape as Record<string, z.ZodTypeAny>;
    const strippedShape: Record<string, z.ZodTypeAny> = {};

    for (const [key, value] of Object.entries(shape)) {
      strippedShape[key] = stripTransformsAndRefinements(value);
    }

    return z.object(strippedShape);
  }

  // Handle ZodArray - has element property
  if (schemaDef.typeName === "ZodArray" && hasProperty(schema, "element")) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = (schema as any).element as z.ZodTypeAny;
    const stripped = stripTransformsAndRefinements(element);
    return z.array(stripped);
  }

  // Handle ZodUnion - has options property
  if (schemaDef.typeName === "ZodUnion" && hasProperty(schema, "options")) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = (schema as any).options as z.ZodTypeAny[];
    const strippedOptions = options.map((option) =>
      stripTransformsAndRefinements(option),
    ) as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]];
    return z.union(strippedOptions);
  }

  // Handle ZodIntersection - access left and right through _def
  if (schemaDef.typeName === "ZodIntersection" && hasProperty(schemaDef, "left") && hasProperty(schemaDef, "right")) {
    const left = schemaDef.left as z.ZodTypeAny;
    const right = schemaDef.right as z.ZodTypeAny;
    const strippedLeft = stripTransformsAndRefinements(left);
    const strippedRight = stripTransformsAndRefinements(right);
    return z.intersection(strippedLeft, strippedRight);
  }

  // For all other types (primitives, etc.), return as-is
  return schema;
}

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
    },
    options: ToolFactoryOptions = {},
  ): CoreTool {
    // Generate description from endpoint definition
    const description =
      options.description ||
      endpoint.definition.description ||
      endpoint.definition.title ||
      endpoint.toolName;

    // Generate PROPER Zod schema from fields (not from requestSchema!)
    // Keep the original schema with transforms for validation
    const rawParameters = this.generateInputSchema(endpoint);

    // Strip transforms and refinements for JSON Schema serialization (AI SDK requirement)
    // The AI SDK's tool() function internally calls zodToJsonSchema() which can't handle transforms
    const parameters = stripTransformsAndRefinements(
      rawParameters,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>>;

    // Log schema type for debugging
    context.logger.debug("[Tool Factory] Generated schema", {
      toolName: endpoint.toolName,
      schemaType: parameters.constructor.name,
      isZodObject: parameters instanceof z.ZodObject,
    });

    // Create the AI SDK CoreTool - return type is inferred from tool() function
    // The tool() function infers types from inputSchema and execute return type
    try {
      return tool({
        description,
        inputSchema: parameters,
        execute: async (params: z.infer<typeof parameters>) => {
          // Apply the original schema (with transforms) to the params
          // This ensures transforms like .toLowerCase().trim() are applied
          const transformedParams = rawParameters.parse(params);

          const executionContext: AIToolExecutionContext = {
            toolName: endpoint.toolName,
            // Transform validated params to tool parameter format
            data: transformedParams as Record<string, ToolParameterValue>,
            user: context.user,
            platform: Platform.AI,
            locale: context.locale,
            logger: context.logger,
            metadata: {
              timestamp: Date.now(),
              endpointId: endpoint.id,
            },
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
        },
      });
    } catch (error) {
      // Log the specific tool that failed and re-throw
      context.logger.error("[Tool Factory] Failed to create tool", {
        toolName: endpoint.toolName,
        endpointId: endpoint.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
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
    },
    options: ToolFactoryOptions = {},
  ): Map<string, CoreTool> {
    const tools = new Map<string, CoreTool>();

    for (const endpoint of endpoints) {
      try {
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
      } catch (error) {
        // Skip tools that have schemas with custom types that can't be serialized to JSON Schema
        context.logger.warn("[Tool Factory] Skipping tool with invalid schema", {
          toolName: endpoint.toolName,
          error: error instanceof Error ? error.message : String(error),
        });
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
