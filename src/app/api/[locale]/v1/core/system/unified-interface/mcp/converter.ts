/**
 * MCP Converter
 * Converts endpoint definitions to MCP tool format
 * Uses shared base converter to eliminate duplication
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";

import {
  safeTranslate,
  zodSchemaToJsonSchema,
} from "../shared/conversion/endpoint-to-metadata";
import type { DiscoveredEndpointMetadata } from "../shared/server-only/types/registry";
import type { MCPTool, MCPToolMetadata } from "./types";

/**
 * Convert MCP tool metadata to MCP tool (wire format)
 */
export function toolMetadataToMCPTool(
  metadata: MCPToolMetadata,
  locale: CountryLanguage,
): MCPTool {
  // Convert Zod schema to JSON Schema
  const baseSchema = metadata.requestSchema
    ? zodSchemaToJsonSchema(metadata.requestSchema)
    : { type: "object", properties: {}, required: [] };

  // Extract properties safely from JSON Schema
  const hasProperties = baseSchema && typeof baseSchema === "object" && "properties" in baseSchema;
  const hasRequired = baseSchema && typeof baseSchema === "object" && "required" in baseSchema;
  const hasAdditionalProperties = baseSchema && typeof baseSchema === "object" && "additionalProperties" in baseSchema;

  const properties = hasProperties ? baseSchema.properties : undefined;
  const required = hasRequired ? baseSchema.required : undefined;
  const additionalProperties = hasAdditionalProperties ? baseSchema.additionalProperties : undefined;

  // Safely handle properties as Record<string, unknown>
  const typedProperties: Record<string, Record<string, string | number | boolean | object | null>> | undefined =
    properties && typeof properties === "object" ? properties : undefined;
  const typedRequired: string[] | undefined =
    Array.isArray(required) ? required : undefined;
  const typedAdditionalProperties: boolean | undefined =
    typeof additionalProperties === "boolean" ? additionalProperties : undefined;

  return {
    name: metadata.name,
    description: safeTranslate(metadata.description, locale, metadata.name),
    inputSchema: {
      type: "object",
      properties: typedProperties,
      required: typedRequired,
      additionalProperties: typedAdditionalProperties,
    },
  };
}

/**
 * Convert endpoint directly to MCP tool (convenience function)
 */
export function endpointToMCPTool(
  endpoint: DiscoveredEndpointMetadata,
  locale: CountryLanguage,
): MCPTool {
  return toolMetadataToMCPTool(endpoint, locale);
}
