/**
 * AI Tool Discovery System
 * Recursively discovers all endpoints with definition.ts files
 */

import "server-only";

import fs from "fs/promises";
import path from "path";
import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { createEndpointLogger } from "../cli/vibe/endpoints/endpoint-handler/logger";
import type { Methods } from "../cli/vibe/endpoints/endpoint-types/core/enums";
import type { UnifiedField } from "../cli/vibe/endpoints/endpoint-types/core/types";
import type { CreateApiEndpoint } from "../cli/vibe/endpoints/endpoint-types/endpoint/create";
import { CacheManager } from "./cache-manager";
import { aiToolConfig } from "./config";
import { AI_TOOL_CONSTANTS } from "./constants";
import type {
  DiscoveredEndpoint,
  IToolDiscovery,
  ToolDiscoveryOptions,
} from "./types";

/**
 * Tool Discovery Implementation
 */
export class ToolDiscovery implements IToolDiscovery {
  private cache: CacheManager<DiscoveredEndpoint[]>;
  private watchers: Map<string, () => void>;

  constructor() {
    this.cache = new CacheManager();
    this.watchers = new Map();
  }

  /**
   * Discover all endpoints
   * Uses static registry in production/Next.js environment
   * Uses dynamic discovery in development/standalone scripts
   */
  async discover(
    options: ToolDiscoveryOptions = {},
  ): Promise<DiscoveredEndpoint[]> {
    const opts = { ...this.getDefaultOptions(), ...options };

    // Check cache
    if (opts.cache) {
      const cached = this.getFromCache("all");
      if (cached) {
        return cached;
      }
    }

    // Use shared generated endpoints via adapter (single source of truth)
    try {
      const { getStaticEndpoints } = await import("./endpoint-adapter");
      const staticEndpoints = getStaticEndpoints();

      // Filter by included methods
      const filteredEndpoints = opts.includeMethods
        ? staticEndpoints.filter((e) => opts.includeMethods?.includes(e.method))
        : staticEndpoints;

      // Cache results
      if (opts.cache && opts.cacheTTL) {
        this.setCache("all", filteredEndpoints, opts.cacheTTL);
      }

      return filteredEndpoints;
    } catch {
      // Static registry not available, fall back to dynamic discovery
      // This path is used during build-time generation
      const rootDir = path.resolve(
        process.cwd(),
        opts.rootDir || aiToolConfig.rootDir,
      );

      const endpoints = await this.discoverInDirectory(rootDir, opts);

      // Filter by included methods
      const filteredEndpoints = opts.includeMethods
        ? endpoints.filter((e) => opts.includeMethods?.includes(e.method))
        : endpoints;

      // Cache results
      if (opts.cache && opts.cacheTTL) {
        this.setCache("all", filteredEndpoints, opts.cacheTTL);
      }

      return filteredEndpoints;
    }
  }

  /**
   * Discover endpoints in a specific directory
   */
  async discoverInDirectory(
    dirPath: string,
    options?: ToolDiscoveryOptions,
  ): Promise<DiscoveredEndpoint[]> {
    const opts = { ...this.getDefaultOptions(), ...options };
    const endpoints: DiscoveredEndpoint[] = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        // Skip excluded paths
        if (this.isExcluded(fullPath, opts.excludePaths || [])) {
          continue;
        }

        if (entry.isDirectory()) {
          // Recurse into subdirectories
          const subEndpoints = await this.discoverInDirectory(fullPath, opts);
          endpoints.push(...subEndpoints);
        } else if (entry.name === "definition.ts") {
          // Found a definition file, try to load it
          const endpoint = await this.loadEndpointFromDefinition(
            fullPath,
            dirPath,
          );
          if (endpoint) {
            endpoints.push(endpoint);
          }
        }
      }
    } catch {
      // Directory read failed, continue silently
    }

    return endpoints;
  }

  /**
   * Watch for changes (development mode)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  watch(_callback: (endpoints: DiscoveredEndpoint[]) => void): () => void {
    if (!aiToolConfig.development.enableWatch) {
      return () => {}; // No-op if watching disabled
    }

    const watchId = Math.random().toString(36).substring(7);

    // Implement file watching logic here if needed
    // For now, return a cleanup function
    const cleanup = (): void => {
      this.watchers.delete(watchId);
    };

    this.watchers.set(watchId, cleanup);
    return cleanup;
  }

  /**
   * Load endpoint from definition file
   */
  private async loadEndpointFromDefinition(
    definitionPath: string,
    routeDir: string,
  ): Promise<DiscoveredEndpoint | null> {
    try {
      // Import the definition module
      const definitionModule = (await import(definitionPath)) as {
        default: Record<
          string,
          CreateApiEndpoint<
            string,
            Methods,
            readonly (typeof UserRoleValue)[],
            UnifiedField<z.ZodTypeAny>
          >
        >;
      };
      const definitions = definitionModule.default;

      if (!definitions || typeof definitions !== "object") {
        return null;
      }

      // Check for route.ts in the same directory
      const routePath = path.join(routeDir, "route.ts");
      try {
        await fs.access(routePath);
      } catch {
        // No route.ts file, skip this endpoint
        return null;
      }

      // Get the first definition (usually POST, GET, etc.)
      const methods = Object.keys(definitions) as Methods[];
      if (methods.length === 0) {
        return null;
      }

      // For now, take the first method
      // TODO: Support multiple methods per endpoint
      const method = methods[0];
      const definition = definitions[method];

      if (!definition) {
        return null;
      }

      // Generate unique ID from path
      const id = this.generateEndpointId(definition.path, method);

      // Generate tool name
      const toolName = this.pathToToolName(definition.path);

      const endpoint: DiscoveredEndpoint = {
        id,
        routePath,
        definitionPath,
        method,
        path: definition.path,
        toolName,
        aliases: definition.aliases || [],
        allowedRoles: definition.allowedRoles,
        definition,
        enabled: true,
        discoveredAt: Date.now(),
      };

      return endpoint;
    } catch (error) {
      // Log error for debugging in development
      if (aiToolConfig.development.debug) {
        const logger = createEndpointLogger(true, Date.now(), "en-GLOBAL");
        logger.error("[Discovery] Failed to load endpoint", {
          definitionPath,
          error: error instanceof Error ? error.message : String(error),
        });
      }
      return null;
    }
  }

  /**
   * Check if path is excluded
   */
  private isExcluded(fullPath: string, excludePaths: string[]): boolean {
    const relativePath = path.relative(process.cwd(), fullPath);

    return excludePaths.some((pattern) => {
      // Simple glob matching
      if (pattern.endsWith("/**")) {
        const prefix = pattern.slice(0, -3);
        return relativePath.startsWith(prefix);
      }
      return relativePath.includes(pattern);
    });
  }

  /**
   * Generate endpoint ID
   */
  private generateEndpointId(
    pathSegments: readonly string[],
    method: Methods,
  ): string {
    const separator = "_";
    return `${method.toLowerCase()}${separator}${pathSegments.join(separator)}`;
  }

  /**
   * Convert path to tool name
   */
  private pathToToolName(pathSegments: readonly string[]): string {
    const { prefix, separator } = aiToolConfig.naming;

    // Remove version and core segments
    const versionSegments = AI_TOOL_CONSTANTS.discovery.versionSegments;
    const filteredSegments = pathSegments.filter(
      (segment) => !(versionSegments as readonly string[]).includes(segment),
    );

    // Convert to snake_case
    const specialCharsRegex = /[^a-zA-Z0-9]+/g;
    const camelCaseRegex = /([a-z])([A-Z])/g;
    const underscore = AI_TOOL_CONSTANTS.converter.underscore;
    const dollarOne = AI_TOOL_CONSTANTS.converter.dollarOne;
    const dollarTwo = AI_TOOL_CONSTANTS.converter.dollarTwo;
    const name = filteredSegments
      .map((segment) =>
        segment
          .replace(specialCharsRegex, underscore)
          .replace(camelCaseRegex, `${dollarOne}${underscore}${dollarTwo}`)
          .toLowerCase(),
      )
      .join(separator);

    return prefix ? `${prefix}${separator}${name}` : name;
  }

  /**
   * Get default discovery options
   */
  private getDefaultOptions(): Required<ToolDiscoveryOptions> {
    return {
      rootDir: aiToolConfig.rootDir,
      excludePaths: aiToolConfig.excludePaths,
      includeMethods: aiToolConfig.includeMethods,
      cache: aiToolConfig.cache.enabled,
      cacheTTL: aiToolConfig.cache.ttl,
      followSymlinks: false,
    };
  }

  /**
   * Get from cache
   */
  private getFromCache(key: string): DiscoveredEndpoint[] | null {
    return this.cache.get(key);
  }

  /**
   * Set cache
   */
  private setCache(key: string, data: DiscoveredEndpoint[], ttl: number): void {
    this.cache.set(key, data, ttl);

    // Cleanup old cache entries
    if (this.cache.size() > aiToolConfig.cache.maxSize) {
      const firstKey = this.cache.keys()[0];
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Singleton instance
 */
let toolDiscoveryInstance: ToolDiscovery | null = null;

/**
 * Get or create tool discovery instance
 */
export function getToolDiscovery(): ToolDiscovery {
  if (!toolDiscoveryInstance) {
    toolDiscoveryInstance = new ToolDiscovery();
  }
  return toolDiscoveryInstance;
}

/**
 * Export singleton
 */
export const toolDiscovery = getToolDiscovery();
