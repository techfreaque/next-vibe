import "server-only";

import { z } from "zod";

import { generateSchemaForUsage } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { zodSchemaToJsonSchema } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/endpoint-to-metadata";

import type { MCPTool } from "./types";

function toolNameToApiPath(toolName: string): string {
  const parts = toolName.split("_");
  const method = parts[parts.length - 1];
  const pathParts = parts.slice(0, -1);
  const apiPath = pathParts.join("/");
  return `api/[locale]/${apiPath} (${method})`;
}

/**
 * Generate input schema from endpoint fields
 * Combines RequestData and RequestUrlParams for MCP tools
 */
function generateInputSchema(
  endpoint: CreateApiEndpointAny,
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

    return z.object(combinedShape);
  } catch {
    return z.object({});
  }
}

/**
 * Convert endpoint to MCP tool format
 * Uses shared zodSchemaToJsonSchema for consistent schema conversion
 */
export function endpointToMCPTool(endpoint: CreateApiEndpointAny): MCPTool {
  const toolName = `${endpoint.path.join("_")}_${endpoint.method.toUpperCase()}`;
  const apiPath = toolNameToApiPath(toolName);
  const description = `${String(endpoint.description || endpoint.title)}\n📁 ${apiPath}`;

  // Generate Zod schema from endpoint fields
  const zodSchema = generateInputSchema(endpoint);

  // Convert to JSON Schema using shared utility
  // z.toJSONSchema automatically handles transforms
  const jsonSchema = zodSchemaToJsonSchema(zodSchema);

  return {
    name: toolName,
    description,
    inputSchema: jsonSchema as MCPTool["inputSchema"],
  };
}
