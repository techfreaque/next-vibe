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
import { RouteExecutionExecutor } from "../shared/endpoints/route/executor";
import type { CreateApiEndpointAny } from "../shared/types/endpoint";
import { Platform } from "../shared/types/platform";
import { endpointToToolName, getPreferredToolName } from "../shared/utils/path";

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
  requiresConfirmation: boolean,
): CoreTool {
  const { t } = endpoint.scopedTranslation.scopedT(context.locale);
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

  // Get tool names
  // Internal name (full path): Used for internal tracking/debugging only
  const internalToolName = endpointToToolName(endpoint);
  // Preferred name (alias if available): Used for AI SDK, execution, and all lookups
  const toolName = getPreferredToolName(endpoint);

  // Generate schemas for splitting params
  const requestDataSchema = endpoint.fields
    ? (generateSchemaForUsage<typeof endpoint.fields, FieldUsage.RequestData>(
        endpoint.fields,
        FieldUsage.RequestData,
      ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever)
    : z.never();

  const urlPathParamsSchema = endpoint.fields
    ? (generateSchemaForUsage<
        typeof endpoint.fields,
        FieldUsage.RequestUrlParams
      >(endpoint.fields, FieldUsage.RequestUrlParams) as
        | z.ZodObject<Record<string, z.ZodTypeAny>>
        | z.ZodNever)
    : z.never();

  // Get field names for each schema
  const requestFields =
    requestDataSchema instanceof z.ZodObject
      ? Object.keys(requestDataSchema.shape)
      : [];
  const urlPathParamsFields =
    urlPathParamsSchema instanceof z.ZodObject
      ? Object.keys(urlPathParamsSchema.shape)
      : [];

  return tool({
    description,
    inputSchema,
    execute: async (params) => {
      // Params are already validated and transformed by the validate function above
      const transformedParams = params;

      // Split combined params into data and urlPathParams
      const data: Record<string, never> = {};
      const urlPathParams: Record<string, never> = {};

      for (const [key, value] of Object.entries(transformedParams)) {
        if (urlPathParamsFields.includes(key)) {
          urlPathParams[key] = value as never;
        } else if (requestFields.includes(key)) {
          data[key] = value as never;
        }
      }

      // Execute using shared generic handler
      // toolName must be in full path format: "agent.brave-search.GET"
      // Platform.AI is valid for tool execution, type restriction is overly specific
      const result = await RouteExecutionExecutor.executeGenericHandler({
        toolName,
        data,
        urlPathParams,
        user: context.user,
        locale: context.locale,
        logger: context.logger,
        platform: Platform.AI,
      });

      if (!result.success) {
        // Throw error for AI SDK with translated message
        const errorMessage = result.message
          ? t(result.message, result.messageParams)
          : simpleT(context.locale).t(
              "app.api.agent.aiStream.errors.toolExecutionFailed" as const,
            );
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Tool error must be thrown for AI SDK
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- Tool error must be thrown for AI SDK
        throw new Error(errorMessage);
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
  /** Map of tool IDs to their confirmation requirements (from API request) */
  toolConfirmationConfig?: Map<string, boolean>;
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
    params.logger.info("[Tools Loader] === FILTERING TOOLS ===", {
      requestedTools: params.requestedTools,
      allEndpointsCount: allEndpoints.length,
    });

    const enabledEndpoints = allEndpoints.filter((e) => {
      const fullPath = endpointToToolName(e);
      const matchesByFullPath = params.requestedTools!.includes(fullPath);
      const matchesByAlias = e.aliases
        ? e.aliases.some((alias) => params.requestedTools!.includes(alias))
        : false;
      const matched = matchesByFullPath || matchesByAlias;
      return matched;
    });

    params.logger.info("Loaded tools by toolNames", {
      requestedCount: params.requestedTools.length,
      loadedCount: enabledEndpoints.length,
      enabledPaths: enabledEndpoints.map((e) => endpointToToolName(e)),
    });

    if (enabledEndpoints.length === 0) {
      return { tools: undefined, systemPrompt: params.systemPrompt };
    }

    // Create AI SDK tools
    // AI SDK tool names must use full endpointToToolName format for proper lookup
    const toolsMap = new Map<string, CoreTool>();

    for (const endpoint of enabledEndpoints) {
      // Internal name for lookups and execution (full path with method)
      const internalToolName = endpointToToolName(endpoint);
      // Preferred name for AI model (first alias if available, otherwise internal name)
      const preferredToolName = getPreferredToolName(endpoint);

      try {
        // Check if this tool requires confirmation from the API request config
        // Check both preferred name and internal name for backwards compatibility
        const requiresConfirmation =
          params.toolConfirmationConfig?.get(preferredToolName) ??
          params.toolConfirmationConfig?.get(internalToolName) ??
          false;

        params.logger.debug("Creating tool", {
          internalToolName,
          preferredToolName,
          endpoint: [...endpoint.path],
          requiresConfirmation,
        });

        const createdTool = createToolFromEndpoint(
          endpoint,
          {
            user: params.user,
            locale: params.locale,
            logger: params.logger,
          },
          requiresConfirmation,
        );

        // Register tool with preferred name (alias) for AI model to see
        toolsMap.set(preferredToolName, createdTool);

        params.logger.debug("Tool created successfully", {
          internalToolName,
          preferredToolName,
          requiresConfirmation,
        });
      } catch (error) {
        const parsedError = parseError(error);
        params.logger.error("Failed to create tool - skipping", {
          internalToolName,
          preferredToolName,
          endpoint: [...endpoint.path],
          error: parsedError.message,
          fullError: parsedError,
        });
      }
    }

    const tools = Object.fromEntries(toolsMap.entries());

    params.logger.info("Tools created", {
      count: toolsMap.size,
      preferredToolNames: [...toolsMap.keys()],
    });

    return { tools, systemPrompt: params.systemPrompt };
  } catch (error) {
    params.logger.error("Failed to load tools", {
      error: parseError(error).message,
    });
    return { tools: undefined, systemPrompt: params.systemPrompt };
  }
}
