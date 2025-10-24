/**
 * Shared Endpoint Registry
 * Common registry implementation used by both CLI and AI Tool systems
 */

import "server-only";

import type { EndpointLogger } from "../../cli/vibe/endpoints/endpoint-handler/logger";
import type { Methods } from "../../cli/vibe/endpoints/endpoint-types/core/enums";

import type {
  DiscoveredEndpointMetadata,
  EndpointDiscoveryOptions,
  EndpointFilterCriteria,
  EndpointRegistryStats,
  IEndpointRegistry,
} from "./types";

/**
 * Shared Endpoint Registry Implementation
 * Uses static registry from AI tool system for Next.js compatibility
 */
export class EndpointRegistry implements IEndpointRegistry {
  private endpoints: DiscoveredEndpointMetadata[] = [];
  private initialized = false;
  private logger: EndpointLogger;
  private lastRefresh = 0;

  constructor(logger: EndpointLogger) {
    this.logger = logger;
  }

  /**
   * Initialize the registry by loading from static registry
   */
  async initialize(_options: EndpointDiscoveryOptions = {}): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.logger.debug("[Endpoint Registry] Initializing...");

    try {
      // Use static registry from AI tool system (Next.js compatible)
      const { getStaticEndpoints } = await import("../../ai-tool/static-registry");
      const staticEndpoints = getStaticEndpoints();

      // Convert to shared endpoint metadata format
      this.endpoints = staticEndpoints.map((endpoint) => {
        const method = endpoint.method;
        const definition = endpoint.definition[method];

        return {
          id: endpoint.id,
          name: endpoint.toolName,
          path: `/${endpoint.path.join("/")}`,
          routePath: endpoint.routePath,
          definitionPath: endpoint.definitionPath,
          method: endpoint.method,
          title: definition?.title || "",
          description: definition?.description || "",
          category: definition?.category || "",
          tags: definition?.tags || [],
          allowedRoles: endpoint.allowedRoles,
          requiresAuth: !endpoint.allowedRoles.includes("PUBLIC"),
          requestSchema: definition?.fields?.schema,
          responseSchema: definition?.fields?.schema,
        };
      });

      this.lastRefresh = Date.now();
      this.initialized = true;

      this.logger.debug("[Endpoint Registry] Initialization complete", {
        totalEndpoints: this.endpoints.length,
      });
    } catch (error) {
      this.logger.error("[Endpoint Registry] Initialization failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get all discovered endpoints
   */
  async getAllEndpoints(): Promise<DiscoveredEndpointMetadata[]> {
    await this.ensureInitialized();
    return this.endpoints;
  }

  /**
   * Get endpoint by ID
   */
  async getEndpointById(
    id: string,
  ): Promise<DiscoveredEndpointMetadata | null> {
    await this.ensureInitialized();
    return this.endpoints.find((e) => e.id === id) || null;
  }

  /**
   * Get endpoints by filter criteria
   */
  async getEndpoints(
    criteria: EndpointFilterCriteria,
  ): Promise<DiscoveredEndpointMetadata[]> {
    await this.ensureInitialized();

    let filtered = this.endpoints;

    // Filter by methods
    if (criteria.methods && criteria.methods.length > 0) {
      filtered = filtered.filter((e) => criteria.methods?.includes(e.method));
    }

    // Filter by roles
    if (criteria.roles && criteria.roles.length > 0) {
      filtered = filtered.filter((e) =>
        criteria.roles?.some((role) => e.allowedRoles.includes(role)),
      );
    }

    // Filter by categories
    if (criteria.categories && criteria.categories.length > 0) {
      filtered = filtered.filter((e) =>
        criteria.categories?.includes(e.category),
      );
    }

    // Filter by tags
    if (criteria.tags && criteria.tags.length > 0) {
      filtered = filtered.filter((e) =>
        criteria.tags?.some((tag) => e.tags.includes(tag)),
      );
    }

    // Filter by auth requirement
    if (criteria.requiresAuth !== undefined) {
      filtered = filtered.filter(
        (e) => e.requiresAuth === criteria.requiresAuth,
      );
    }

    // Filter by search query
    if (criteria.searchQuery) {
      const query = criteria.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.path.toLowerCase().includes(query),
      );
    }

    return filtered;
  }

  /**
   * Check if registry is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get registry statistics
   */
  getStats(): EndpointRegistryStats {
    const endpointsByMethod: Record<Methods, number> = {
      GET: 0,
      POST: 0,
      PUT: 0,
      PATCH: 0,
      DELETE: 0,
    };

    const endpointsByCategory: Record<string, number> = {};

    for (const endpoint of this.endpoints) {
      // Count by method
      endpointsByMethod[endpoint.method] =
        (endpointsByMethod[endpoint.method] || 0) + 1;

      // Count by category
      endpointsByCategory[endpoint.category] =
        (endpointsByCategory[endpoint.category] || 0) + 1;
    }

    return {
      totalEndpoints: this.endpoints.length,
      endpointsByMethod,
      endpointsByCategory,
      lastRefresh: this.lastRefresh,
      initialized: this.initialized,
    };
  }

  /**
   * Refresh the registry by re-loading from static registry
   */
  async refresh(options: EndpointDiscoveryOptions = {}): Promise<void> {
    this.logger.debug("[Endpoint Registry] Refreshing...");
    this.initialized = false;
    await this.initialize(options);
  }

  /**
   * Ensure registry is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}

/**
 * Create a singleton instance of the endpoint registry
 */
let registryInstance: EndpointRegistry | null = null;

export function getEndpointRegistry(logger: EndpointLogger): EndpointRegistry {
  if (!registryInstance) {
    registryInstance = new EndpointRegistry(logger);
  }
  return registryInstance;
}

