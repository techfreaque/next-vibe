import "server-only";

import { z } from "zod";

import { zodSchemaToJsonSchema } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/endpoint-to-metadata";
import { generateSchemaForUsage } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { CountryLanguage } from "@/i18n/core/config";

import type { MCPTool } from "./types";

function toolNameToApiPath(toolName: string): string {
  const parts = toolName.split("_");
  const method = parts.at(-1);
  const pathParts = parts.slice(0, -1);
  const apiPath = pathParts.join("/");
  return `api/[locale]/${apiPath} (${method})`;
}

/**
 * Generate input schema from endpoint fields with descriptions
 * Combines RequestData and RequestUrlParams for MCP tools
 */
function generateInputSchema(
  endpoint: CreateApiEndpointAny,
  locale: CountryLanguage,
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  if (!endpoint.fields) {
    return z.object({});
  }

  try {
    // Combine request data and URL params
    const requestDataSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestData,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

    const urlPathParamsSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestUrlParams,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

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
    // Add descriptions from field metadata
    const shapeWithDescriptions = addFieldDescriptions(
      combinedShape,
      endpoint.fields,
      locale,
      endpoint,
    );

    return z.object(shapeWithDescriptions);
  } catch {
    return z.object({});
  }
}

/**
 * Add descriptions to schema fields from endpoint field metadata
 */
function addFieldDescriptions(
  shape: Record<string, z.ZodTypeAny>,
  fields: CreateApiEndpointAny["fields"],
  locale: CountryLanguage,
  endpoint: CreateApiEndpointAny,
): Record<string, z.ZodTypeAny> {
  if (!fields || fields.type !== "object" || !fields.children) {
    return shape;
  }

  const enhancedShape: Record<string, z.ZodTypeAny> = {};

  for (const [key, schema] of Object.entries(shape)) {
    const fieldDef = fields.children[key];
    if (!fieldDef || fieldDef.type === "widget") {
      enhancedShape[key] = schema;
      continue;
    }

    // Get description from field UI config
    let description: string | undefined;
    if (
      fieldDef.ui &&
      "description" in fieldDef.ui &&
      fieldDef.ui.description
    ) {
      const descKey = fieldDef.ui.description as string;
      const { t } = endpoint.scopedTranslation.scopedT(locale);

      description = t(descKey);
    }

    // Add description to schema
    enhancedShape[key] = description ? schema.describe(description) : schema;
  }

  return enhancedShape;
}

/**
 * Convert endpoint to MCP tool format
 * Uses shared zodSchemaToJsonSchema for consistent schema conversion
 */
export function endpointToMCPTool(
  endpoint: CreateApiEndpointAny,
  locale: CountryLanguage,
): MCPTool {
  const toolName = `${endpoint.path.join("_")}_${endpoint.method.toUpperCase()}`;
  const apiPath = toolNameToApiPath(toolName);

  // Translate description and title keys
  const { t } = endpoint.scopedTranslation.scopedT(locale);
  const descriptionKey = endpoint.description || endpoint.title;
  const translatedDescription = descriptionKey ? t(descriptionKey) : "";

  const description = translatedDescription
    ? `${translatedDescription}\n📁 ${apiPath}`
    : apiPath;

  // Generate Zod schema from endpoint fields with translated descriptions
  const zodSchema = generateInputSchema(endpoint, locale);

  // Convert to JSON Schema using shared utility
  // z.toJSONSchema automatically handles transforms and includes descriptions
  const jsonSchema = zodSchemaToJsonSchema(zodSchema);

  return {
    name: toolName,
    description,
    inputSchema: jsonSchema as MCPTool["inputSchema"],
  };
}
