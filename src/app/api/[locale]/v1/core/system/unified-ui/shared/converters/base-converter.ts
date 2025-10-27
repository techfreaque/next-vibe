/**
 * Base Converter
 * Shared conversion logic for all platforms
 * Eliminates duplication across MCP, AI, CLI converters
 */

import "server-only";

import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  DiscoveredEndpoint,
  DiscoveredEndpointMetadata,
} from "../../../unified-backend/shared/discovery/endpoint-registry-types";

/**
 * JSON Schema type
 */
export interface JsonSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
  [key: string]: unknown;
}

/**
 * Base tool metadata
 */
export interface BaseToolMetadata {
  name: string;
  description: string;
  category?: string;
  tags: string[];
  endpointId: string;
  endpointPath: string;
  method: string;
  routePath: string;
  allowedRoles: readonly string[];
  requestSchema?: z.ZodSchema;
}

/**
 * Convert Zod schema to JSON Schema
 */
export function zodSchemaToJsonSchema(schema: z.ZodSchema): JsonSchema {
  try {
    const jsonSchema = zodToJsonSchema(schema, {
      target: "jsonSchema7",
      $refStrategy: "none",
    });

    // Ensure it's an object schema
    if (typeof jsonSchema === "object" && jsonSchema !== null) {
      return {
        type: "object",
        properties: (jsonSchema as { properties?: Record<string, unknown> })
          .properties,
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
 * Safe translation helper
 */
export function safeTranslate(
  key: string | undefined,
  locale: CountryLanguage,
  fallback?: string,
): string {
  if (!key) {
    return fallback || "";
  }

  try {
    const { t } = simpleT(locale);
    return t(key as TranslationKey);
  } catch {
    return fallback || key;
  }
}

/**
 * Generate tool name from endpoint path
 */
export function generateToolName(path: string[]): string {
  return path
    .filter((segment) => !segment.startsWith("[") && !segment.endsWith("]"))
    .join("_")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_");
}

/**
 * Generate tool description from endpoint
 */
export function generateToolDescription(
  endpoint: DiscoveredEndpoint,
  locale: CountryLanguage,
): string {
  // Try description first
  if (endpoint.definition.description) {
    return safeTranslate(
      endpoint.definition.description,
      locale,
      endpoint.definition.description,
    );
  }

  // Try title
  if (endpoint.definition.title) {
    return safeTranslate(
      endpoint.definition.title,
      locale,
      endpoint.definition.title,
    );
  }

  // Fallback to tool name
  return endpoint.toolName;
}

/**
 * Extract endpoint path as string
 */
export function extractEndpointPath(endpoint: DiscoveredEndpoint): string {
  return endpoint.definition.path.join("/");
}

/**
 * Convert endpoint to base tool metadata
 */
export function endpointToBaseMetadata(
  endpoint: DiscoveredEndpoint,
): BaseToolMetadata {
  return {
    name: endpoint.toolName,
    description: endpoint.definition.description || endpoint.definition.title,
    category: endpoint.definition.category,
    tags: endpoint.definition.tags || [],
    endpointId: endpoint.id,
    endpointPath: extractEndpointPath(endpoint),
    method: endpoint.definition.method,
    routePath: endpoint.routePath,
    allowedRoles: endpoint.definition.allowedRoles,
    requestSchema: endpoint.definition.requestSchema,
  };
}

/**
 * Check if endpoint has request schema
 */
export function hasRequestSchema(endpoint: DiscoveredEndpoint): boolean {
  return !!endpoint.definition.requestSchema;
}

/**
 * Convert DiscoveredEndpoint to DiscoveredEndpointMetadata
 */
export function endpointToMetadata(
  endpoint: DiscoveredEndpoint,
): DiscoveredEndpointMetadata {
  const definition = endpoint.definition;
  return {
    id: endpoint.id,
    name: endpoint.toolName,
    path: `/${definition.path.join("/")}`,
    routePath: endpoint.routePath,
    definitionPath: endpoint.definitionPath,
    method: definition.method,
    title: typeof definition.title === "string" ? definition.title : "",
    description:
      typeof definition.description === "string" ? definition.description : "",
    category: typeof definition.category === "string" ? definition.category : "",
    tags: Array.isArray(definition.tags) ? definition.tags : [],
    allowedRoles: definition.allowedRoles,
    requiresAuth: !definition.allowedRoles.includes("PUBLIC"),
    requestSchema: definition.requestSchema,
    responseSchema: definition.responseSchema,
    credits: typeof definition.credits === "number" ? definition.credits : undefined,
    aiTool: definition.aiTool,
    aliases: definition.cli?.aliases,
  };
}

/**
 * Check if endpoint has response schema
 */
export function hasResponseSchema(endpoint: DiscoveredEndpoint): boolean {
  return !!endpoint.definition.responseSchema;
}

/**
 * Extract allowed roles as string array
 */
export function extractAllowedRoles(
  endpoint: DiscoveredEndpoint,
): readonly string[] {
  return endpoint.definition.allowedRoles || [];
}

/**
 * Check if endpoint requires authentication
 */
export function requiresAuth(endpoint: DiscoveredEndpoint): boolean {
  const roles = extractAllowedRoles(endpoint);
  return !roles.includes("PUBLIC");
}

/**
 * Generate endpoint ID
 */
export function generateEndpointId(method: string, path: string): string {
  return `${method.toLowerCase()}_${path.replace(/\//g, "_").replace(/[^a-z0-9_]/g, "_")}`;
}

/**
 * Parse path segments from string
 */
export function parsePathSegments(path: string): string[] {
  return path
    .split("/")
    .filter((segment) => segment.length > 0)
    .map((segment) => {
      // Convert [id] to _id_
      if (segment.startsWith("[") && segment.endsWith("]")) {
        return `_${segment.slice(1, -1)}_`;
      }
      return segment;
    });
}

/**
 * Format path segments to API path
 */
export function formatPathToApi(segments: string[]): string {
  return segments
    .map((segment) => {
      if (segment === "_locale_") {
        return "";
      }
      if (segment.startsWith("_") && segment.endsWith("_")) {
        // Convert _id_ to [id]
        return `[${segment.slice(1, -1)}]`;
      }
      return segment;
    })
    .filter(Boolean)
    .join("/");
}

/**
 * Extract category from path
 */
export function extractCategoryFromPath(path: string[]): string {
  // Use the first non-version segment as category
  const versionSegments = ["v1", "v2", "core"];
  const categorySegment = path.find(
    (segment) => !versionSegments.includes(segment),
  );
  return categorySegment || "general";
}

/**
 * Extract tags from endpoint
 */
export function extractTags(endpoint: DiscoveredEndpoint): string[] {
  const tags = endpoint.definition.tags || [];
  const category = endpoint.definition.category;

  // Add category as tag if not already present
  if (category && !tags.includes(category)) {
    return [...tags, category];
  }

  return tags;
}

/**
 * Check if endpoint is enabled for platform
 */
export function isEnabledForPlatform(
  endpoint: DiscoveredEndpoint,
  platform: "CLI" | "AI" | "WEB" | "MCP",
): boolean {
  const roles = extractAllowedRoles(endpoint);
  const optOutRole = `${platform}_OFF`;
  return !roles.includes(optOutRole);
}
