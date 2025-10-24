/**
 * Endpoint Registry Converter
 * Converts the nested endpoints structure from generated/endpoints.ts
 * into the flat array format needed by the registry
 */

import "server-only";

import type { Methods } from "../../cli/vibe/endpoints/endpoint-types/core/enums";
import type { EndpointDefinition } from "../../cli/vibe/endpoints/endpoint-types/core/types";
import type { DiscoveredEndpointMetadata } from "./types";

/**
 * Convert nested endpoint structure to flat array
 */
export function convertEndpointsToMetadata(
  endpoints: any,
  basePath: string[] = [],
): DiscoveredEndpointMetadata[] {
  const result: DiscoveredEndpointMetadata[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  for (const [key, value] of Object.entries(endpoints)) {
    const currentPath = [...basePath, key];

    // Check if this is an endpoint definition (has HTTP methods)
    if (value && typeof value === "object") {
      const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as Methods[];
      const availableMethods = methods.filter(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (method) => (value as any)[method],
      );

      if (availableMethods.length > 0) {
        // This is an endpoint definition
        for (const method of availableMethods) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          const methodDef = (value as any)[method] as EndpointDefinition[Methods];

          if (methodDef) {
            // Convert path array to API path
            const apiPath = currentPath
              .map((segment) => {
                if (segment === "_locale_") return "";
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
              title: methodDef.title || "",
              description: methodDef.description || "",
              category: methodDef.category || "",
              tags: methodDef.tags || [],
              allowedRoles: methodDef.allowedRoles || [],
              requiresAuth: !methodDef.allowedRoles?.includes("PUBLIC"),
              requestSchema: methodDef.requestSchema,
              responseSchema: methodDef.responseSchema,
              aiTool: methodDef.aiTool,
              aliases: methodDef.aliases || [],
            };

            result.push(metadata);
          }
        }
      } else {
        // Recurse into nested structure
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const nested = convertEndpointsToMetadata(value, currentPath);
        result.push(...nested);
      }
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

