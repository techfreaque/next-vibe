/**
 * MCP Converter
 * Converts endpoint definitions to MCP tool format
 * Uses shared base converter to eliminate duplication
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";

import type { DiscoveredEndpointMetadata } from "../../unified-backend/shared/discovery/endpoint-registry-types";
import {
  safeTranslate,
  zodSchemaToJsonSchema,
} from "../shared/converters/base-converter";
import type { MCPTool, MCPToolMetadata } from "./types";

/**
 * Convert endpoint metadata to MCP tool metadata
 */
export function endpointToMCPToolMetadata(
  endpoint: DiscoveredEndpointMetadata,
): MCPToolMetadata {
  return {
    name: endpoint.name,
    description: endpoint.description || endpoint.title || "",
    category: endpoint.category,
    tags: [...endpoint.tags],
    endpointId: endpoint.id,
    endpointPath: endpoint.path,
    routePath: endpoint.routePath,
    method: endpoint.method,
    allowedRoles: [...endpoint.allowedRoles],
    requiresAuth: endpoint.requiresAuth,
    requestSchema: endpoint.requestSchema,
    responseSchema: endpoint.responseSchema,
  };
}

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

  interface JSONSchemaProperty {
    type: string;
    description?: string;
    enum?: readonly string[];
    items?: JSONSchemaProperty;
    properties?: Record<string, JSONSchemaProperty>;
    required?: readonly string[];
  }

  const inputSchema: {
    type: "object";
    properties?: Record<string, JSONSchemaProperty>;
    required?: string[];
    additionalProperties?: boolean;
  } = {
    type: "object",
    properties: baseSchema.properties as Record<string, JSONSchemaProperty>,
    required: baseSchema.required,
    additionalProperties: baseSchema.additionalProperties,
  };

  return {
    name: metadata.name,
    description: safeTranslate(metadata.description, locale, metadata.name),
    inputSchema,
  };
}

/**
 * Convert endpoint directly to MCP tool (convenience function)
 */
export function endpointToMCPTool(
  endpoint: DiscoveredEndpointMetadata,
  locale: CountryLanguage,
): MCPTool {
  const metadata = endpointToMCPToolMetadata(endpoint);
  return toolMetadataToMCPTool(metadata, locale);
}
