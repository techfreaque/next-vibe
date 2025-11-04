/**
 * Base Converter
 * Shared conversion logic for all platforms
 * Eliminates duplication across MCP, AI, CLI converters
 */

import "server-only";

import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";
import { simpleT } from "@/i18n/core/shared";
import {
  UserRole,
  type UserRoleValue,
} from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type {
  DiscoveredEndpoint,
  DiscoveredEndpointMetadata,
} from "../server-only/types/registry";

/**
 * JSON Schema type from zod-to-json-schema
 */
export type JsonSchema = ReturnType<typeof zodToJsonSchema>;

/**
 * Convert Zod schema to JSON Schema
 */
export function zodSchemaToJsonSchema(schema: z.ZodSchema): JsonSchema {
  try {
    return zodToJsonSchema(schema, {
      target: "jsonSchema7",
      $refStrategy: "none",
    });
  } catch {
    return {
      type: "object",
    };
  }
}

/**
 * Base tool metadata
 */
export interface BaseToolMetadata {
  name: string;
  description: string;
  category?: string;
  tags: readonly string[];
  endpointId: string;
  endpointPath: string;
  method: string;
  routePath: string;
  allowedRoles: readonly (typeof UserRoleValue)[];
  requestSchema?: z.ZodSchema;
}

/**
 * Safe translation helper
 */
export function safeTranslate(
  key: TranslationKey | undefined,
  locale: CountryLanguage,
  fallback?: string,
): string {
  if (!key) {
    return fallback || "";
  }

  try {
    const { t } = simpleT(locale);
    return t(key);
  } catch {
    return fallback || String(key);
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
  const tags = endpoint.definition.tags || [];
  return {
    name: endpoint.toolName,
    description: endpoint.definition.description || endpoint.definition.title,
    category: endpoint.definition.category,
    tags: Array.isArray(tags) ? tags : [],
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
  const aliases = definition.aliases;
  const title = definition.title;
  const description = definition.description;
  const category = definition.category;
  const tags = definition.tags;
  const credits = definition.credits;

  return {
    id: endpoint.id,
    name: endpoint.toolName,
    path: `/${definition.path.join("/")}`,
    routePath: endpoint.routePath,
    definitionPath: endpoint.definitionPath,
    method: definition.method,
    title: title || undefined,
    description: description || undefined,
    category: category || undefined,
    tags: Array.isArray(tags) ? tags : [],
    allowedRoles: definition.allowedRoles,
    requiresAuth: !definition.allowedRoles.includes(UserRole.PUBLIC),
    requestSchema: definition.requestSchema,
    responseSchema: definition.responseSchema,
    credits: typeof credits === "number" ? credits : undefined,
    aiTool: definition.aiTool,
    aliases: aliases && Array.isArray(aliases) ? aliases : undefined,
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
  const categorySegment = path.find((segment) => {
    return segment !== "v1" && segment !== "v2" && segment !== "core";
  });
  return categorySegment || "general";
}

/**
 * Extract tags from endpoint
 */
export function extractTags(endpoint: DiscoveredEndpoint): readonly string[] {
  const tags = endpoint.definition.tags || [];
  const category = endpoint.definition.category;

  if (category) {
    const categoryValue = String(category);
    const tagStrings = tags.map((tag) => String(tag));
    if (!tagStrings.includes(categoryValue)) {
      return [...tagStrings, categoryValue];
    }
    return tagStrings;
  }

  return tags.map((tag) => String(tag));
}

/**
 * Check if endpoint is enabled for platform
 */
export function isEnabledForPlatform(
  endpoint: DiscoveredEndpoint,
  platform: "CLI" | "AI" | "WEB" | "MCP",
): boolean {
  const roles = extractAllowedRoles(endpoint);

  let optOutRole: "CLI_OFF" | "AI_OFF" | "WEB_OFF" | "MCP_OFF";
  switch (platform) {
    case "CLI":
      optOutRole = "CLI_OFF";
      break;
    case "AI":
      optOutRole = "AI_OFF";
      break;
    case "WEB":
      optOutRole = "WEB_OFF";
      break;
    case "MCP":
      optOutRole = "MCP_OFF";
      break;
  }

  return !roles.includes(optOutRole);
}
