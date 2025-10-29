/**
 * MCP Converter
 * Converts endpoint definitions to MCP tool format
 * Uses shared base converter to eliminate duplication
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";

import {
  type JsonSchemaValue,
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
    : { type: "object" as const, properties: {}, required: [] };

  const inputSchema: {
    type: "object";
    properties?: Record<string, JsonSchemaValue>;
    required?: string[];
    additionalProperties?: boolean;
  } = {
    type: "object",
    properties: baseSchema.properties,
    required: baseSchema.required,
    additionalProperties: baseSchema.additionalProperties,
  };

  return {
    name: metadata.name,
    description: safeTranslate(metadata.description, locale, metadata.name),
    inputSchema: inputSchema as { type: "object"; properties?: Record<string, Record<string, string | number | boolean | object | null>> | undefined; required?: string[] | undefined; additionalProperties?: boolean | undefined; },
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
