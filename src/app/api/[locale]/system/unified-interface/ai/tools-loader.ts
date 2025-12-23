/**
 * AI Tools Loader
 * ONLY file in AI folder - creates AI SDK CoreTool objects from endpoints
 * All other logic (discovery, filtering, execution) is in shared/
 */

import "server-only";

import { jsonSchema, type JSONSchema7, tool } from "ai";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { z } from "zod";

import { generateSchemaForUsage } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { definitionsRegistry } from "../shared/endpoints/definitions/registry";
import { routeExecutionExecutor } from "../shared/endpoints/route/executor";
import type { CreateApiEndpointAny } from "../shared/types/endpoint";
import { Platform } from "../shared/types/platform";
import { endpointToToolName } from "../shared/utils/path";

/**
 * CoreTool type from AI SDK
 * This is the ONLY tool type we use - no custom wrappers or conversions
 * The actual types are inferred by the tool() function at creation time
 * We don't specify generic parameters - they're inferred from the tool() call
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CoreTool = ReturnType<typeof tool<any, any>>;

/**
 * Create AI SDK CoreTool from endpoint
 * This is the ONLY AI-specific logic - converting to AI SDK format
 */
function createToolFromEndpoint(
  endpoint: CreateApiEndpointAny,
  context: {
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
  },
): CoreTool {
  const { t } = simpleT(context.locale);
  // Generate description
  const description = t(endpoint.description || endpoint.title);

  // Generate Zod schema from fields (with transforms)
  const zodSchemaWithTransforms = generateInputSchema(endpoint);

  // Target draft-7 to ensure compatibility with AI SDK's JSONSchema7 type
  const jsonSchemaObject = z.toJSONSchema(zodSchemaWithTransforms, {
    target: "draft-7",
  });

  // Wrap JSON Schema in AI SDK's jsonSchema() function
  // This creates a FlexibleSchema that the AI SDK can use
  const inputSchema = jsonSchema(jsonSchemaObject as JSONSchema7, {
    validate: (value) => {
      // Use the original Zod schema (with transforms) for validation
      const result = zodSchemaWithTransforms.safeParse(value);
      if (result.success) {
        return { success: true, value: result.data };
      }
      return {
        success: false,
        error: result.error,
      };
    },
  });

  // Create AI SDK CoreTool
  const toolName = endpointToToolName(endpoint);

  return tool({
    description,
    inputSchema,
    execute: async (params) => {
      // Params are already validated and transformed by the validate function above
      const transformedParams = params;

      // Execute using shared generic handler
      // toolName must be in full path format: "agent.brave-search.GET"
      const result = await routeExecutionExecutor.executeGenericHandler({
        toolName,
        data: transformedParams as Record<string, never>,
        user: context.user,
        locale: context.locale,
        logger: context.logger,
        platform: Platform.AI,
      });

      if (!result.success) {
        // Throw error for AI SDK
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Tool error must be thrown for AI SDK
        throw new Error(result.message ?? "errors.toolExecutionFailed");
      }

      // Return the data to AI SDK
      // Must be JSON-serializable for streaming
      return result.data;
    },
  });
}

/**
 * Generate Zod input schema from endpoint fields
 * Combines RequestData and RequestUrlParams for AI tools
 */
function generateInputSchema(
  endpoint: CreateApiEndpointAny,
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  if (!endpoint.fields) {
    return z.object({});
  }

  try {
    // Combine request data and URL params
    const requestDataSchema = generateSchemaForUsage<
      typeof endpoint.fields,
      FieldUsage.RequestData
    >(endpoint.fields, FieldUsage.RequestData) as
      | z.ZodObject<Record<string, z.ZodTypeAny>>
      | z.ZodNever;

    const urlPathParamsSchema = generateSchemaForUsage<
      typeof endpoint.fields,
      FieldUsage.RequestUrlParams
    >(endpoint.fields, FieldUsage.RequestUrlParams) as
      | z.ZodObject<Record<string, z.ZodTypeAny>>
      | z.ZodNever;

    const combinedShape: { [key: string]: z.ZodTypeAny } = {};

    if (requestDataSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, requestDataSchema.shape);
    }

    if (urlPathParamsSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, urlPathParamsSchema.shape);
    }

    if (Object.keys(combinedShape).length === 0) {
      return z.object({});
    }

    return z.object(combinedShape);
  } catch {
    return z.object({});
  }
}

/**
 * Load tools for AI streaming
 */
export async function loadTools(params: {
  requestedTools: string[] | null | undefined;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  systemPrompt: string;
}): Promise<{
  tools: Record<string, CoreTool> | undefined;
  systemPrompt: string;
}> {
  if (
    params.requestedTools === null ||
    params.requestedTools === undefined ||
    params.requestedTools.length === 0
  ) {
    params.logger.debug("No tools requested, skipping tool loading");
    return { tools: undefined, systemPrompt: params.systemPrompt };
  }

  try {
    // Get all endpoints for user (filtered by permissions using roles from JWT)
    const allEndpoints = definitionsRegistry.getEndpointsForUser(
      Platform.AI,
      params.user,
      params.logger,
    );

    // Filter by requested toolNames (full path with underscores or alias)
    const enabledEndpoints = allEndpoints.filter((e) => {
      const fullPath = endpointToToolName(e);
      const matchesByFullPath = params.requestedTools!.includes(fullPath);
      const matchesByAlias = e.aliases
        ? e.aliases.some((alias) => params.requestedTools!.includes(alias))
        : false;
      return matchesByFullPath || matchesByAlias;
    });

    params.logger.debug("Loaded tools by toolNames", {
      requestedCount: params.requestedTools.length,
      loadedCount: enabledEndpoints.length,
    });

    if (enabledEndpoints.length === 0) {
      return { tools: undefined, systemPrompt: params.systemPrompt };
    }

    // Create AI SDK tools
    // AI SDK tool names must use full endpointToToolName format for proper lookup
    const toolsMap = new Map<string, CoreTool>();

    for (const endpoint of enabledEndpoints) {
      const aiSdkToolName = endpointToToolName(endpoint);
      try {
        params.logger.debug("Creating tool", {
          toolName: aiSdkToolName,
          endpoint: [...endpoint.path],
        });

        const createdTool = createToolFromEndpoint(endpoint, {
          user: params.user,
          locale: params.locale,
          logger: params.logger,
        });

        // Use full toolName format (e.g., "v1_core_agent_brave-search_GET")
        toolsMap.set(aiSdkToolName, createdTool);

        params.logger.debug("Tool created successfully", {
          toolName: aiSdkToolName,
        });
      } catch (error) {
        const parsedError = parseError(error);
        params.logger.error("Failed to create tool - skipping", {
          toolName: aiSdkToolName,
          endpoint: [...endpoint.path],
          error: parsedError.message,
          fullError: parsedError,
        });
      }
    }

    const tools = Object.fromEntries(toolsMap.entries());

    params.logger.info("Tools created", {
      count: toolsMap.size,
      aiSdkToolNames: [...toolsMap.keys()],
    });

    return { tools, systemPrompt: params.systemPrompt };
  } catch (error) {
    params.logger.error("Failed to load tools", {
      error: parseError(error).message,
    });
    return { tools: undefined, systemPrompt: params.systemPrompt };
  }
}
