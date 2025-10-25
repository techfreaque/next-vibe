/**
 * Endpoint Adapter
 * Converts shared generated endpoints to DiscoveredEndpoint format for AI tools
 * This is the single source of truth adapter - all systems use generated/endpoints.ts
 */

import "server-only";

import { setupEndpoints } from "@/app/api/[locale]/v1/core/system/generated/endpoints";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { EndpointDefinition } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/types";

import type { DiscoveredEndpoint } from "./types";

/**
 * Convert generated endpoints to DiscoveredEndpoint format
 * This function traverses the nested endpoint structure and flattens it
 */
export function getDiscoveredEndpoints(): DiscoveredEndpoint[] {
  const endpoints = setupEndpoints();
  const discovered: DiscoveredEndpoint[] = [];

  // Recursively traverse the endpoint tree
  function traverse(
    obj: Record<string, unknown>,
    pathSegments: string[] = [],
  ): void {
    if (!obj || typeof obj !== "object") {
      return;
    }

    // Check if this is an endpoint definition (has GET, POST, etc. methods)
    const methods = Object.keys(obj).filter((key) =>
      Object.values(Methods).includes(key as Methods),
    );

    if (methods.length > 0) {
      // This is an endpoint - create DiscoveredEndpoint for each method
      for (const method of methods) {
        const methodKey = method as Methods;
        const definition = obj[methodKey] as EndpointDefinition | undefined;

        if (!definition) {
          continue;
        }

        // Generate endpoint ID
        const methodLower = method.toLowerCase();
        const pathJoined = pathSegments.join("_");
        // eslint-disable-next-line i18next/no-literal-string
        const id = `${methodLower}_v1_${pathJoined}`;

        // Generate tool name (snake_case)
        const toolName = pathSegments.join("_");

        // Generate file paths
        const pathStr = pathSegments.join("/");
        const definitionPath = `/home/max/projects/next-vibe/src/app/api/[locale]/v1/${pathStr}/definition.ts`;
        const routePath = `/home/max/projects/next-vibe/src/app/api/[locale]/v1/${pathStr}/route.ts`;

        // Extract allowed roles from definition
        const allowedRoles = definition.allowedRoles || [];

        // Create discovered endpoint
        discovered.push({
          id,
          method: methodKey,
          path: ["v1", ...pathSegments] as readonly string[],
          toolName,
          aliases: [] as readonly string[],
          allowedRoles: allowedRoles as readonly string[],
          definitionPath,
          routePath,
          definition: obj as Record<string, EndpointDefinition>,
          enabled: true,
          discoveredAt: Date.now(),
        });
      }
    } else {
      // This is a nested object - traverse children
      for (const [key, value] of Object.entries(obj)) {
        if (
          key.startsWith("_") ||
          typeof value !== "object" ||
          value === null
        ) {
          continue;
        }
        traverse(value as Record<string, unknown>, [...pathSegments, key]);
      }
    }
  }

  // Start traversal from root
  traverse(endpoints as Record<string, unknown>);

  return discovered;
}

/**
 * Get static endpoints (compatibility function)
 * This replaces the old static-registry.ts getStaticEndpoints function
 */
export function getStaticEndpoints(): DiscoveredEndpoint[] {
  return getDiscoveredEndpoints();
}
