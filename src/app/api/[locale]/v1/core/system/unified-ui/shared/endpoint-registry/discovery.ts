/**
 * Shared Endpoint Discovery
 * Common endpoint discovery logic used by both CLI and AI Tool systems
 *
 * @deprecated This file is deprecated. Use the unified discovery system instead:
 * import { getUnifiedDiscovery } from "../discovery/unified-discovery";
 *
 * This file is kept for backward compatibility only.
 */

import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import type { EndpointLogger } from "../../cli/vibe/endpoints/endpoint-handler/logger";
import type { Methods } from "../../cli/vibe/endpoints/endpoint-types/core/enums";
import type {
  DiscoveredEndpointMetadata,
  EndpointDiscoveryOptions,
} from "./types";

/**
 * Endpoint Discovery Service
 * Discovers endpoints by scanning the filesystem for route.ts and definition.ts files
 */
export class EndpointDiscoveryService {
  private logger: EndpointLogger;
  private cache: Map<string, DiscoveredEndpointMetadata[]> = new Map();

  constructor(logger: EndpointLogger) {
    this.logger = logger;
  }

  /**
   * Discover all endpoints in the given directory
   */
  async discover(
    options: EndpointDiscoveryOptions = {},
  ): Promise<DiscoveredEndpointMetadata[]> {
    const rootDir = options.rootDir || "src/app/api/[locale]/v1";
    const fullPath = path.resolve(process.cwd(), rootDir);

    // Check cache first
    if (options.cache) {
      const cached = this.cache.get(fullPath);
      if (cached) {
        return cached;
      }
    }

    this.logger.info("[Endpoint Discovery] Starting discovery", { rootDir });

    const endpoints = await this.discoverInDirectory(fullPath, options);

    // Filter by included methods
    const filteredEndpoints = options.includeMethods
      ? endpoints.filter((e) => options.includeMethods?.includes(e.method))
      : endpoints;

    // Cache results
    if (options.cache) {
      this.cache.set(fullPath, filteredEndpoints);
    }

    this.logger.info("[Endpoint Discovery] Discovery complete", {
      endpointsFound: filteredEndpoints.length,
      sampleEndpoints: filteredEndpoints.slice(0, 5).map((e) => e.name),
    });

    return filteredEndpoints;
  }

  /**
   * Discover endpoints in a specific directory recursively
   */
  private async discoverInDirectory(
    dirPath: string,
    options: EndpointDiscoveryOptions,
  ): Promise<DiscoveredEndpointMetadata[]> {
    const endpoints: DiscoveredEndpointMetadata[] = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        // Skip excluded paths
        if (this.isExcluded(fullPath, options.excludePaths || [])) {
          continue;
        }

        if (entry.isDirectory()) {
          // Recurse into subdirectories
          const subEndpoints = await this.discoverInDirectory(
            fullPath,
            options,
          );
          endpoints.push(...subEndpoints);
        } else if (entry.name === "route.ts") {
          // Found a route file, try to load endpoint metadata
          const endpoint = await this.loadEndpointFromRoute(fullPath, dirPath);
          if (endpoint) {
            endpoints.push(endpoint);
          }
        }
      }
    } catch (error) {
      // Directory read failed, continue silently
      // These are expected during development (permission issues, symlinks, etc.)
    }

    return endpoints;
  }

  /**
   * Load endpoint metadata from a route.ts file
   */
  private async loadEndpointFromRoute(
    routePath: string,
    dirPath: string,
  ): Promise<DiscoveredEndpointMetadata | null> {
    // Check for definition.ts FIRST before attempting any imports
    // This avoids import errors for endpoints without definitions (webhooks, tracking pixels, etc.)
    const definitionPath = path.join(dirPath, "definition.ts");
    const definitionExists = await fs
      .access(definitionPath)
      .then(() => true)
      .catch(() => false);

    if (!definitionExists) {
      // No definition file, skip this endpoint silently
      return null;
    }

    try {
      // Import the route module
      const routeModule = await import(routePath);

      // Import the definition module
      const definitionModule = await import(definitionPath);
      const definition = definitionModule.default;

      if (!definition) {
        return null;
      }

      // Extract metadata from definition
      const metadata = await this.extractMetadata(
        definition,
        routePath,
        definitionPath,
        routeModule,
      );

      return metadata;
    } catch (error) {
      // Definition file exists but failed to load - this is a real error
      // Suppress warnings for now as these are expected during development
      // (TypeScript path aliases don't work in dynamic imports during discovery)
      return null;
    }
  }

  /**
   * Extract metadata from endpoint definition
   */
  private async extractMetadata(
    definition: any,
    routePath: string,
    definitionPath: string,
    routeModule: any,
  ): Promise<DiscoveredEndpointMetadata | null> {
    try {
      // Determine which HTTP methods are available
      const availableMethods: Methods[] = [];
      for (const method of [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
      ] as Methods[]) {
        if (routeModule[method] || definition[method]) {
          availableMethods.push(method);
        }
      }

      if (availableMethods.length === 0) {
        return null;
      }

      // Use the first available method for metadata
      const method = availableMethods[0];
      const methodDef = definition[method];

      if (!methodDef) {
        return null;
      }

      // Extract path from file system location
      const apiPath = this.extractApiPath(routePath);

      // Generate ID and name
      const id = this.generateEndpointId(method, apiPath);
      const name = this.generateEndpointName(apiPath);

      // Extract metadata
      const metadata: DiscoveredEndpointMetadata = {
        id,
        name,
        path: apiPath,
        routePath,
        definitionPath,
        method,
        title: methodDef.title || "",
        description: methodDef.description || "",
        category: methodDef.category || "",
        tags: methodDef.tags || [],
        allowedRoles: methodDef.allowedRoles || [],
        requiresAuth: this.determineAuthRequirement(methodDef.allowedRoles),
        requestSchema: methodDef.fields?.schema,
        responseSchema: methodDef.fields?.schema,
      };

      return metadata;
    } catch (error) {
      // Suppress warnings for metadata extraction failures
      // These are expected during development (TypeScript path aliases, etc.)
      return null;
    }
  }

  /**
   * Extract API path from file system path
   */
  private extractApiPath(routePath: string): string {
    // Convert file path to API path
    // e.g., /path/to/src/app/api/[locale]/v1/core/user/profile/route.ts
    // -> /v1/core/user/profile
    const match = routePath.match(/\/v1\/(.+)\/route\.ts$/);
    if (match) {
      return `/v1/${match[1]}`;
    }
    return "";
  }

  /**
   * Generate endpoint ID
   */
  private generateEndpointId(method: Methods, apiPath: string): string {
    const pathPart = apiPath.replace(/^\/v1\//, "").replace(/\//g, "_");
    // eslint-disable-next-line i18next/no-literal-string
    return `${method.toLowerCase()}_v1_${pathPart}`;
  }

  /**
   * Generate endpoint name
   */
  private generateEndpointName(apiPath: string): string {
    return apiPath.replace(/^\/v1\//, "").replace(/\//g, "_");
  }

  /**
   * Determine if endpoint requires authentication
   */
  private determineAuthRequirement(allowedRoles: readonly any[]): boolean {
    // If PUBLIC role is in allowed roles, auth is not required
    return !allowedRoles.includes("PUBLIC");
  }

  /**
   * Check if path should be excluded
   */
  private isExcluded(fullPath: string, excludePaths: string[]): boolean {
    return excludePaths.some((excluded) => fullPath.includes(excluded));
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
