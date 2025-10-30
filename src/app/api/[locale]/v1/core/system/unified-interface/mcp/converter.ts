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

  // Build MCP input schema from JSON schema
  const inputSchema = buildMCPInputSchema(baseSchema);

  return {
    name: metadata.name,
    description: safeTranslate(metadata.description, locale, metadata.name),
    inputSchema,
  };
}

/**
 * Type guard for MCP property
 */
function isMCPProperty(
  value: unknown
): value is Record<string, string | number | boolean | null | object> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  // Check all values are valid primitive types or objects
  for (const v of Object.values(value)) {
    const type = typeof v;
    if (
      type !== "string" &&
      type !== "number" &&
      type !== "boolean" &&
      type !== "object" &&
      v !== null
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Build MCP input schema from JSON schema
 * Safely extracts and types properties for MCP format
 */
function buildMCPInputSchema(
  schema: ReturnType<typeof zodSchemaToJsonSchema>
): MCPTool["inputSchema"] {
  const defaultSchema: MCPTool["inputSchema"] = {
    type: "object",
    properties: undefined,
    required: undefined,
    additionalProperties: undefined,
  };

  if (!schema || typeof schema !== "object") {
    return defaultSchema;
  }

  // Extract properties
  const properties = "properties" in schema ? schema.properties : undefined;
  const required = "required" in schema ? schema.required : undefined;
  const additionalProperties = "additionalProperties" in schema ? schema.additionalProperties : undefined;

  // Validate and build properties
  let typedProperties: MCPTool["inputSchema"]["properties"];
  if (properties && typeof properties === "object" && !Array.isArray(properties)) {
    typedProperties = {};
    for (const [key, value] of Object.entries(properties)) {
      if (isMCPProperty(value)) {
        typedProperties[key] = value;
      }
    }
  }

  return {
    type: "object",
    properties: typedProperties,
    required: Array.isArray(required) ? required : undefined,
    additionalProperties: typeof additionalProperties === "boolean" ? additionalProperties : undefined,
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
