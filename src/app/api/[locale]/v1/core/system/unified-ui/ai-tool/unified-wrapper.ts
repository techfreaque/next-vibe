/**
 * Unified Platform Wrapper for AI Tools
 * Provides backward compatibility while using the new unified platform system
 *
 * This wrapper allows existing AI tool code to work without changes
 * while internally using the unified platform architecture.
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import {
  createAIPlatform,
  GroupingStrategy,
  type PlatformStats,
} from "@/app/api/[locale]/v1/core/system/unified-ui/shared";

import type {
  DiscoveredEndpoint,
  IToolDiscovery,
  ToolDiscoveryOptions,
} from "./types";

/**
 * Unified Tool Discovery (backward compatible)
 * Uses the new unified platform system internally
 */
export class UnifiedToolDiscovery implements IToolDiscovery {
  private logger: EndpointLogger;
  private platform: ReturnType<typeof createAIPlatform>;

  constructor(logger: EndpointLogger) {
    this.logger = logger;
    this.platform = createAIPlatform(logger);
  }

  /**
   * Discover all endpoints (backward compatible)
   */
  async discover(
    options: ToolDiscoveryOptions = {},
  ): Promise<DiscoveredEndpoint[]> {
    const result = await this.platform.discoverEndpoints({
      includeMethods: options.includeMethods,
      excludePaths: options.excludePaths,
      cache: options.cache,
      cacheTTL: options.cacheTTL,
    });

    return result.endpoints;
  }

  /**
   * Get endpoint by ID
   */
  async getEndpointById(id: string): Promise<DiscoveredEndpoint | null> {
    return await this.platform.getEndpoint(id);
  }

  /**
   * Get endpoints by path
   */
  async getEndpointsByPath(pathPattern: string): Promise<DiscoveredEndpoint[]> {
    return await this.platform.getEndpointsByPath(pathPattern);
  }

  /**
   * Filter endpoints by role
   */
  async filterByRole(role: string): Promise<DiscoveredEndpoint[]> {
    const result = await this.platform.discoverEndpoints({
      roles: [role],
      cache: true,
      cacheTTL: 60000,
    });

    return result.endpoints;
  }

  /**
   * Search endpoints
   */
  async search(query: string): Promise<DiscoveredEndpoint[]> {
    const result = await this.platform.searchEndpoints(query);
    return result.endpoints;
  }

  /**
   * Group endpoints by path
   */
  async groupByPath(maxDepth = 3): Promise<Map<string, DiscoveredEndpoint[]>> {
    const groups = await this.platform.groupEndpoints({
      strategy: GroupingStrategy.BY_PATH,
      maxDepth,
    });

    const result = new Map<string, DiscoveredEndpoint[]>();
    for (const group of groups) {
      result.set(group.id, group.endpoints);
    }

    return result;
  }

  /**
   * Group endpoints by category
   */
  async groupByCategory(): Promise<Map<string, DiscoveredEndpoint[]>> {
    const groups = await this.platform.groupEndpoints({
      strategy: GroupingStrategy.BY_CATEGORY,
    });

    const result = new Map<string, DiscoveredEndpoint[]>();
    for (const group of groups) {
      result.set(group.id, group.endpoints);
    }

    return result;
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<PlatformStats> {
    return await this.platform.getStats();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.platform.clearCache();
  }

  /**
   * Watch for changes (not implemented in unified platform yet)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  watch(_callback: () => void): () => void {
    this.logger.warn(
      "[Unified Tool Discovery] Watch not implemented in unified platform",
    );
    return () => {}; // No-op unsubscribe
  }

  /**
   * Unwatch (not implemented in unified platform yet)
   */
  unwatch(): void {
    this.logger.warn(
      "[Unified Tool Discovery] Unwatch not implemented in unified platform",
    );
  }
}

/**
 * Factory function for backward compatibility
 */
export function createUnifiedToolDiscovery(
  logger: EndpointLogger,
): UnifiedToolDiscovery {
  return new UnifiedToolDiscovery(logger);
}
