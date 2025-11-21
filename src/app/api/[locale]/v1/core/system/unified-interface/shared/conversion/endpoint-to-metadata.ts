/**
 * Endpoint to Metadata Converter
 * Shared conversion logic for all platforms
 * Eliminates duplication across MCP, AI, CLI converters
 * Pure logic - no server dependencies
 */

import { zodToJsonSchema } from "zod-to-json-schema";
import type { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";
import { simpleT } from "@/i18n/core/shared";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type {
  DiscoveredEndpoint,
  DiscoveredEndpointMetadata,
} from "../server-only/types/registry";
import { Platform } from "../types/platform";

/**
 * JSON Schema type from zod-to-json-schema
 */
export type JsonSchema = ReturnType<typeof zodToJsonSchema>;

/**
 * JSON Schema property value type
 */
interface JsonSchemaPropertyValue {
  [key: string]: string | number | boolean | null | JsonSchemaPropertyValue;
}

/**
 * JSON Schema Object with properties
 */
export interface JsonSchemaObject {
  type: "object";
  properties?: Record<
    string,
    Record<string, string | number | boolean | null | JsonSchemaPropertyValue>
  >;
  required?: string[];
  additionalProperties?: boolean;
}

/**
 * Convert Zod schema to JSON Schema
 */
export function zodSchemaToJsonSchema(schema: z.ZodTypeAny): JsonSchema {
  try {
    // Type assertion needed due to Zod version compatibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return zodToJsonSchema(schema as any, {
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
 * Base endpoint metadata for platform conversion
 * This is the shared type that all platforms (AI, MCP, CLI) extend
 */
export interface BaseEndpointMetadata {
  name: string;
  description: string;
  category?: string;
  tags: readonly string[];
  endpointId: string;
  endpointPath: string;
  method: string;
  routePath: string;
  allowedRoles: readonly UserRoleValue[];
  requiresAuth: boolean;
  requestSchema?: z.ZodSchema;
  responseSchema?: z.ZodSchema;
  aliases?: readonly string[];
}

/**
 * @deprecated Use BaseEndpointMetadata instead
 */
export type BaseToolMetadata = BaseEndpointMetadata;

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
 * Extract tags from endpoint definition with empty array fallback
 */
function extractDefinitionTags(
  endpoint: DiscoveredEndpoint,
): readonly string[] {
  return endpoint.definition.tags || [];
}

/**
 * Convert endpoint to base tool metadata
 */
export function endpointToBaseMetadata(
  endpoint: DiscoveredEndpoint,
): BaseToolMetadata {
  const tags = extractDefinitionTags(endpoint);
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
    requiresAuth: !endpoint.definition.allowedRoles.includes(UserRole.PUBLIC),
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
    title: title,
    description: description,
    category: category,
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
): readonly UserRoleValue[] {
  return endpoint.definition.allowedRoles || [];
}

/**
 * Check if endpoint requires authentication
 */
export function requiresAuth(endpoint: DiscoveredEndpoint): boolean {
  const roles = extractAllowedRoles(endpoint);
  return !roles.includes(UserRole.PUBLIC);
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
    .filter((segment) => segment.length)
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
  const tags = extractDefinitionTags(endpoint);
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
  platform: Platform,
): boolean {
  const roles = extractAllowedRoles(endpoint);

  let optOutRole:
    | typeof UserRole.CLI_OFF
    | typeof UserRole.AI_TOOL_OFF
    | typeof UserRole.WEB_OFF;
  switch (platform) {
    case Platform.CLI:
      optOutRole = UserRole.CLI_OFF;
      break;
    case Platform.AI:
      optOutRole = UserRole.AI_TOOL_OFF;
      break;
    case Platform.WEB:
    case Platform.EMAIL:
      optOutRole = UserRole.WEB_OFF;
      break;
    case Platform.MCP:
      // MCP uses CLI_OFF for now since there's no MCP_OFF role yet
      optOutRole = UserRole.CLI_OFF;
      break;
    case Platform.MOBILE:
      // Mobile uses WEB_OFF for now
      optOutRole = UserRole.WEB_OFF;
      break;
  }

  return !roles.includes(optOutRole);
}
