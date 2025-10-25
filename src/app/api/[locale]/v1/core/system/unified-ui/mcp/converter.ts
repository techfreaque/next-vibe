/**
 * MCP Converter
 * Converts endpoint definitions to MCP tool format
 */

import "server-only";

import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { DiscoveredEndpointMetadata } from "../shared/endpoint-registry/types";
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
  const { t } = simpleT(locale);

  // Safely translate a key
  const safeTranslate = (key: string | undefined): string => {
    if (!key) {
      return "";
    }
    try {
      return t(key as Parameters<typeof t>[0]);
    } catch {
      return key;
    }
  };

  // Convert Zod schema to JSON Schema
  const inputSchema = metadata.requestSchema
    ? zodSchemaToJsonSchema(metadata.requestSchema)
    : { type: "object" as const, properties: {}, required: [] };

  return {
    name: metadata.name,
    description: safeTranslate(metadata.description) || metadata.name,
    inputSchema,
  };
}

/**
 * Convert Zod schema to JSON Schema (MCP compatible)
 */
function zodSchemaToJsonSchema(schema: z.ZodTypeAny): {
  type: "object";
  // eslint-disable-next-line no-restricted-syntax
  properties?: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
} {
  try {
    const jsonSchema = zodToJsonSchema(schema, {
      target: "jsonSchema7",
      $refStrategy: "none",
    });

    // Ensure it's an object schema
    if (typeof jsonSchema === "object" && jsonSchema !== null) {
      return {
        type: "object",
        properties: (
          jsonSchema as {
            // eslint-disable-next-line no-restricted-syntax
            properties?: Record<string, unknown>;
          }
        ).properties,
        required: (jsonSchema as { required?: string[] }).required,
        additionalProperties: (
          jsonSchema as {
            additionalProperties?: boolean;
          }
        ).additionalProperties,
      };
    }

    // Fallback to empty object schema
    return {
      type: "object",
      properties: {},
      required: [],
    };
  } catch {
    // If conversion fails, return empty object schema
    return {
      type: "object",
      properties: {},
      required: [],
    };
  }
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
