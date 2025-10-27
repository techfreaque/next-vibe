/**
 * Endpoint Registry Converter
 * Converts the nested endpoints structure from generated/endpoints.ts
 * into the flat array format needed by the registry
 */

import "server-only";

import type { z } from "zod";

import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import type { DiscoveredEndpointMetadata } from "./endpoint-registry-types";

/**
 * Simplified endpoint definition type for registry conversion
 * Matches the structure of CreateApiEndpoint but with optional fields
 */
interface SimpleEndpointDefinition {
  title?: string;
  description?: string;
  category?: string;
  tags?: readonly string[];
  allowedRoles?: readonly string[];
  requestSchema?: z.ZodTypeAny;
  responseSchema?: z.ZodTypeAny;
  credits?: number;
  aiTool?: {
    instructions: string;
    displayName: string;
    icon: string;
    color: string;
    priority: number;
  };
  aliases?: readonly string[];
}

/**
 * Type for nested endpoint structure
 */
interface NestedEndpoints {
  [key: string]:
    | NestedEndpoints
    | Partial<Record<Methods, SimpleEndpointDefinition>>;
}

/**
 * Type guard to check if value is an endpoint definition
 */
function isEndpointDefinition<T>(
  value: T,
): value is T & Partial<Record<Methods, SimpleEndpointDefinition>> {
  if (!value || typeof value !== "object") {
    return false;
  }
  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as Methods[];
  return methods.some((method) => method in value);
}

/**
 * Convert nested endpoint structure to flat array
 */
export function convertEndpointsToMetadata(
  endpoints: NestedEndpoints,
  basePath: string[] = [],
): DiscoveredEndpointMetadata[] {
  const result: DiscoveredEndpointMetadata[] = [];

  for (const [key, value] of Object.entries(endpoints)) {
    const currentPath = [...basePath, key];

    // Check if this is an endpoint definition (has HTTP methods)
    if (isEndpointDefinition(value)) {
      const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as Methods[];
      const availableMethods = methods.filter((method) => method in value);

      if (availableMethods.length > 0) {
        // This is an endpoint definition
        for (const method of availableMethods) {
          const methodDef = value[method];

          if (methodDef) {
            // Convert path array to API path
            const apiPath = currentPath
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

            const fullPath = `/v1/${apiPath}`;

            // Generate ID and name
            const id = generateEndpointId(method, fullPath);
            const name = generateEndpointName(fullPath);

            // Generate routePath and definitionPath from the API path
            // Convert /v1/core/system/server/dev to @/app/api/[locale]/v1/core/system/server/dev
            const routePath = `@/app/api/[locale]${fullPath}/route.ts`;
            const definitionPath = `@/app/api/[locale]${fullPath}/definition.ts`;

            // Create metadata
            const metadata: DiscoveredEndpointMetadata = {
              id,
              name,
              path: fullPath,
              routePath,
              definitionPath,
              method,
              title: typeof methodDef.title === "string" ? methodDef.title : "",
              description:
                typeof methodDef.description === "string"
                  ? methodDef.description
                  : "",
              category:
                typeof methodDef.category === "string"
                  ? methodDef.category
                  : "",
              tags: Array.isArray(methodDef.tags) ? methodDef.tags : [],
              allowedRoles: Array.isArray(methodDef.allowedRoles)
                ? (methodDef.allowedRoles as readonly string[])
                : [],
              requiresAuth: !methodDef.allowedRoles?.includes("PUBLIC"),
              requestSchema: methodDef.requestSchema,
              responseSchema: methodDef.responseSchema,
              credits:
                typeof methodDef.credits === "number"
                  ? methodDef.credits
                  : undefined,
              aiTool: methodDef.aiTool,
              aliases: Array.isArray(methodDef.aliases)
                ? methodDef.aliases
                : [],
            };

            result.push(metadata);
          }
        }
      } else if (typeof value === "object" && value !== null) {
        // Recurse into nested structure
        const nested = convertEndpointsToMetadata(
          value as NestedEndpoints,
          currentPath,
        );
        result.push(...nested);
      }
    } else if (typeof value === "object" && value !== null) {
      // Not an endpoint definition, recurse
      const nested = convertEndpointsToMetadata(value, currentPath);
      result.push(...nested);
    }
  }

  return result;
}

/**
 * Generate endpoint ID
 */
function generateEndpointId(method: Methods, apiPath: string): string {
  const pathPart = apiPath.replace(/^\/v1\//, "").replace(/\//g, "_");
  // eslint-disable-next-line i18next/no-literal-string
  return `${method.toLowerCase()}_v1_${pathPart}`;
}

/**
 * Generate endpoint name
 */
function generateEndpointName(apiPath: string): string {
  return apiPath.replace(/^\/v1\//, "").replace(/\//g, "_");
}
