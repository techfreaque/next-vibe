/**
 * Shared Endpoint Registry
 * Common registry implementation used by both CLI and AI Tool systems
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { getStaticEndpoints } from "./endpoint-adapter";
import type {
  DiscoveredEndpointMetadata,
  EndpointDiscoveryOptions,
  EndpointFilterCriteria,
  EndpointRegistryStats,
  IEndpointRegistry,
} from "../../unified-backend/shared/discovery/endpoint-registry-types";
/**
 * Singleton instance using shared factory
 */
import { createSingletonGetter } from "./utils/singleton-factory";

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
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.logger.debug("[Endpoint Registry] Initializing...");

    try {
      // Use shared generated endpoints via adapter (single source of truth)
      const staticEndpoints = await Promise.resolve(getStaticEndpoints());

      // Convert to shared endpoint metadata format
      this.endpoints = staticEndpoints.map(
        (endpoint): DiscoveredEndpointMetadata => {
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
              typeof definition.description === "string"
                ? definition.description
                : "",
            category:
              typeof definition.category === "string"
                ? definition.category
                : "",
            tags: Array.isArray(definition.tags) ? definition.tags : [],
            allowedRoles: definition.allowedRoles,
            requiresAuth: !definition.allowedRoles.includes("PUBLIC"),
            requestSchema: definition.requestSchema,
            responseSchema: definition.responseSchema,
          };
        },
      );

      this.lastRefresh = Date.now();
      this.initialized = true;

      this.logger.debug("[Endpoint Registry] Initialization complete", {
        totalEndpoints: this.endpoints.length,
      });
    } catch {
      this.logger.error("[Endpoint Registry] Initialization failed", {
        error: "Failed to initialize endpoint registry",
      });
      return;
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

const getRegistryInstance = createSingletonGetter(
  () =>
    new EndpointRegistry(
      // Default logger - will be replaced on first use
      {
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
      } as EndpointLogger,
    ),
);

export function getEndpointRegistry(logger: EndpointLogger): EndpointRegistry {
  const instance = getRegistryInstance();
  // Update logger if provided
  (instance as { logger: EndpointLogger }).logger = logger;
  return instance;
}
