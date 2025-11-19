/**
 * Endpoint Adapter
 * Converts shared generated endpoints to DiscoveredEndpoint format for AI tools
 * This is the single source of truth adapter - all systems use generated/endpoints.ts
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { z } from "zod";

import { endpoints } from "@/app/api/[locale]/v1/core/system/generated/endpoints";
import { normalizeRoutePath } from "../../registry/normalize-route-path";
import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import type { UnifiedField } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/endpoint";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { DiscoveredEndpoint } from "../types/registry";

// Simple logger for adapter operations
const logger = {
  warn(message: string, ...args: unknown[]): void {
    const argsStr = args.length ? ` ${JSON.stringify(args)}` : "";
    process.stderr.write(`[Lazy Loader] ${message}${argsStr}\n`);
  },
  error(message: string, error?: unknown): void {
    const errorStr = error ? ` ${parseError(error).message}` : "";
    process.stderr.write(`[Lazy Loader] ${message}${errorStr}\n`);
  },
};

/**
 * Type for the nested endpoint structure from generated/endpoints.ts
 * This is a recursive structure where each level can contain either:
 * - Method keys (GET, POST, etc.) with endpoint definitions
 * - Nested objects with more path segments
 */
type EndpointNode =
  | {
      [K in Methods]?: CreateApiEndpoint<
        string,
        K,
        readonly UserRoleValue[],
        UnifiedField<z.ZodTypeAny>
      >;
    }
  | {
      [key: string]: EndpointNode;
    };

/**
 * Convert generated endpoints to DiscoveredEndpoint format
 * This function traverses the nested endpoint structure and flattens it
 */
export function getDiscoveredEndpoints(): DiscoveredEndpoint[] {
  const endpointsData = endpoints as EndpointNode;
  const discovered: DiscoveredEndpoint[] = [];

  // Recursively traverse the endpoint tree
  function traverse(obj: EndpointNode, pathSegments: string[] = []): void {
    if (!obj || typeof obj !== "object") {
      return;
    }

    // Check if this is an endpoint definition (has GET, POST, etc. methods)
    const methods = Object.keys(obj).filter((key) =>
      Object.values(Methods).includes(key as Methods),
    );

    if (methods.length) {
      // This is an endpoint - create DiscoveredEndpoint for each method
      for (const method of methods) {
        const methodKey = method as Methods;
        const definition = obj[methodKey] as
          | CreateApiEndpoint<
              string,
              Methods,
              readonly UserRoleValue[],
              UnifiedField<z.ZodTypeAny>
            >
          | undefined;

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

        // Generate file paths using module paths (@ alias) for Next.js/Turbopack compatibility
        const pathStr = pathSegments.join("/");
        const definitionPath = `@/app/api/[locale]/v1/${pathStr}/definition`;
        const routePath = `@/app/api/[locale]/v1/${pathStr}/route`;

        // Create discovered endpoint - only runtime metadata at top level
        discovered.push({
          id,
          toolName,
          routePath,
          definitionPath,
          definition,
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
        traverse(value as EndpointNode, [...pathSegments, key]);
      }
    }
  }

  // Start traversal from root
  traverse(endpointsData);

  return discovered;
}

/**
 * Get static endpoints (compatibility function)
 * This replaces the old static-registry.ts getStaticEndpoints function
 */
export function getStaticEndpoints(): DiscoveredEndpoint[] {
  return getDiscoveredEndpoints();
}

/**
 * Lazy load specific endpoints by tool names
 * This function dynamically imports only the requested endpoint definitions
 * instead of loading all 143 endpoints upfront
 *
 * @param toolNames - Array of tool names (e.g., ["core_agent_chat_folders", "core_agent_chat_threads"])
 * @returns Array of DiscoveredEndpoint objects for the requested tools
 */
export async function getEndpointsByToolNames(
  toolNames: string[],
): Promise<DiscoveredEndpoint[]> {
  const { getEndpoint } =
    await import("@/app/api/[locale]/v1/core/system/generated/endpoint");

  const discovered: DiscoveredEndpoint[] = [];

  for (const toolName of toolNames) {
    // Convert tool name to path (e.g., "core_agent_chat_folders" -> "core/agent/chat/folders")
    const path = normalizeRoutePath(toolName.replace(/_/g, "/"));

    try {
      // Dynamically import only this specific endpoint definition
      const definition = await getEndpoint(path);

      if (!definition) {
        logger.warn(`Endpoint not found for tool: ${toolName}`);
        continue;
      }

      // Determine the method from the definition
      // The definition object has method keys (GET, POST, etc.)
      const methods = Object.keys(definition).filter((key) =>
        Object.values(Methods).includes(key as Methods),
      );

      if (methods.length === 0) {
        logger.warn(`No HTTP methods found for tool: ${toolName}`);
        continue;
      }

      // Create DiscoveredEndpoint for each method
      for (const method of methods) {
        const methodKey = method as Methods;
        const methodDef = definition[methodKey];

        if (!methodDef) {
          continue;
        }

        // Generate endpoint ID
        const methodLower = method.toLowerCase();
        // eslint-disable-next-line i18next/no-literal-string
        const id = `${methodLower}_v1_${toolName}`;

        // Generate file paths using module paths (@ alias)
        const definitionPath = `@/app/api/[locale]/v1/${path}/definition`;
        const routePath = `@/app/api/[locale]/v1/${path}/route`;

        // Create discovered endpoint
        discovered.push({
          id,
          toolName,
          routePath,
          definitionPath,
          definition: methodDef as CreateApiEndpoint<
            string,
            Methods,
            readonly UserRoleValue[],
            UnifiedField<z.ZodTypeAny>
          >,
          enabled: true,
          discoveredAt: Date.now(),
        });
      }
    } catch (error) {
      logger.error(`Failed to load endpoint for tool: ${toolName}`, error);
    }
  }

  return discovered;
}

/**
 * Lazy load specific endpoints by endpoint IDs
 * This is more precise than getEndpointsByToolNames as it loads exact endpoints
 * instead of loading all 143 endpoints upfront
 *
 * @param endpointIds - Array of endpoint IDs (e.g., ["get_v1_core_agent_chat_folders", "post_v1_core_agent_chat_threads"])
 * @returns Array of DiscoveredEndpoint objects for the requested endpoints
 */
export async function getEndpointsByIds(
  endpointIds: string[],
): Promise<DiscoveredEndpoint[]> {
  const { getEndpoint } =
    await import("@/app/api/[locale]/v1/core/system/generated/endpoint");

  const discovered: DiscoveredEndpoint[] = [];

  for (const endpointId of endpointIds) {
    // Parse endpoint ID format: ${method}_v1_${toolName}
    // Example: "get_v1_core_agent_chat_folders" -> method="get", toolName="core_agent_chat_folders"
    const parts = endpointId.split("_v1_");
    if (parts.length !== 2) {
      logger.warn(`Invalid endpoint ID format: ${endpointId}`);
      continue;
    }

    const [methodLower, toolName] = parts;
    const method = methodLower.toUpperCase() as Methods;

    // Convert tool name to path (e.g., "core_agent_chat_folders" -> "core/agent/chat/folders")
    const path = normalizeRoutePath(toolName.replace(/_/g, "/"));

    try {
      // Dynamically import only this specific endpoint definition
      const definition = await getEndpoint(path);

      if (!definition) {
        logger.warn(`Endpoint not found for ID: ${endpointId}`);
        continue;
      }

      // Get the specific method definition
      const methodDef = definition[method];

      if (!methodDef) {
        logger.warn(`Method ${method} not found for endpoint: ${endpointId}`);
        continue;
      }

      // Generate file paths using module paths (@ alias)
      const definitionPath = `@/app/api/[locale]/v1/${path}/definition`;
      const routePath = `@/app/api/[locale]/v1/${path}/route`;

      // Create discovered endpoint
      discovered.push({
        id: endpointId,
        toolName,
        routePath,
        definitionPath,
        definition: methodDef as CreateApiEndpoint<
          string,
          Methods,
          readonly UserRoleValue[],
          UnifiedField<z.ZodTypeAny>
        >,
        enabled: true,
        discoveredAt: Date.now(),
      });
    } catch (error) {
      logger.error(`Failed to load endpoint for ID: ${endpointId}`, error);
    }
  }

  return discovered;
}
