/**
 * Unified Discovery System
 * Single source of truth for endpoint discovery across all platforms (CLI, AI, MCP, Web)
 *
 * Architecture:
 * - Uses generated/endpoints.ts as the single source
 * - Provides platform-agnostic discovery interface
 * - Supports filtering, caching, and grouping
 * - Works for CLI, AI tools, MCP, and future platforms
 */

import "server-only";

import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";

import { getStaticEndpoints } from "./endpoint-adapter";
import type { DiscoveredEndpoint } from "./endpoint-registry-types";

/**
 * Discovery options (platform-agnostic)
 */
export interface UnifiedDiscoveryOptions {
  /** Include only specific HTTP methods */
  includeMethods?: Methods[];

  /** Exclude specific paths */
  excludePaths?: string[];

  /** Enable caching */
  cache?: boolean;

  /** Cache TTL in milliseconds */
  cacheTTL?: number;

  /** Filter by user roles */
  roles?: string[];

  /** Filter by categories */
  categories?: string[];

  /** Filter by tags */
  tags?: string[];

  /** Search query */
  searchQuery?: string;

  /** Require authentication */
  requiresAuth?: boolean;

  /** Platform for opt-out filtering (CLI_OFF, AI_TOOL_OFF, WEB_OFF) */
  platform?: string;
}

/**
 * Discovery result with metadata
 */
export interface DiscoveryResult {
  /** Discovered endpoints */
  endpoints: DiscoveredEndpoint[];

  /** Total count before filtering */
  totalCount: number;

  /** Filtered count */
  filteredCount: number;

  /** Discovery metadata */
  metadata: {
    /** Discovery timestamp */
    timestamp: number;

    /** Whether result was cached */
    cached: boolean;

    /** Discovery duration in ms */
    duration: number;
  };
}

/**
 * Unified Discovery Service
 * Single discovery system for all platforms
 */
export class UnifiedDiscoveryService {
  private cache: Map<string, { data: DiscoveredEndpoint[]; expiresAt: number }>;
  private logger: EndpointLogger;

  constructor(logger: EndpointLogger) {
    this.logger = logger;
    this.cache = new Map();
  }

  /**
   * Discover endpoints with filtering and caching
   */
  discover(options: UnifiedDiscoveryOptions = {}): DiscoveryResult {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(options);

    // Check cache
    if (options.cache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.logger.debug("[Unified Discovery] Cache hit", { cacheKey });
        return {
          endpoints: cached,
          totalCount: cached.length,
          filteredCount: cached.length,
          metadata: {
            timestamp: Date.now(),
            cached: true,
            duration: Date.now() - startTime,
          },
        };
      }
    }

    // Get all endpoints from shared source
    const allEndpoints = getStaticEndpoints();
    const totalCount = allEndpoints.length;

    this.logger.debug("[Unified Discovery] Loaded endpoints", { totalCount });

    // Apply filters
    let filtered = this.applyFilters(allEndpoints, options);

    // Cache results
    if (options.cache && options.cacheTTL) {
      this.setCache(cacheKey, filtered, options.cacheTTL);
    }

    return {
      endpoints: filtered,
      totalCount,
      filteredCount: filtered.length,
      metadata: {
        timestamp: Date.now(),
        cached: false,
        duration: Date.now() - startTime,
      },
    };
  }

  /**
   * Get endpoint by ID
   */
  getEndpointById(id: string): DiscoveredEndpoint | null {
    const result = this.discover({ cache: true, cacheTTL: 60000 });
    return result.endpoints.find((e) => e.id === id) || null;
  }

  /**
   * Get endpoints by path pattern
   */
  getEndpointsByPath(pathPattern: string): DiscoveredEndpoint[] {
    const result = this.discover({ cache: true, cacheTTL: 60000 });
    const pattern = new RegExp(pathPattern);
    return result.endpoints.filter((e) =>
      pattern.test(e.definition.path.join("/")),
    );
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.debug("[Unified Discovery] Cache cleared");
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  // ===== PRIVATE METHODS =====

  /**
   * Apply filters to endpoints
   */
  private applyFilters(
    endpoints: DiscoveredEndpoint[],
    options: UnifiedDiscoveryOptions,
  ): DiscoveredEndpoint[] {
    let filtered = endpoints;

    // Filter by methods
    if (options.includeMethods && options.includeMethods.length > 0) {
      filtered = filtered.filter((e) =>
        options.includeMethods?.includes(e.definition.method),
      );
    }

    // Filter by roles
    if (options.roles && options.roles.length > 0) {
      filtered = filtered.filter((e) =>
        options.roles?.some((role) => e.definition.allowedRoles.includes(role)),
      );
    }

    // Filter by excluded paths
    if (options.excludePaths && options.excludePaths.length > 0) {
      filtered = filtered.filter((e) => {
        const pathStr = e.definition.path.join("/");
        return !options.excludePaths?.some((excluded) =>
          pathStr.includes(excluded),
        );
      });
    }

    // Filter by search query
    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      filtered = filtered.filter((e) => {
        const title =
          typeof e.definition.title === "string" ? e.definition.title : "";
        const description =
          typeof e.definition.description === "string"
            ? e.definition.description
            : "";
        const pathStr = e.definition.path.join("/");

        return (
          e.toolName.toLowerCase().includes(query) ||
          title.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query) ||
          pathStr.toLowerCase().includes(query)
        );
      });
    }

    // Filter by auth requirement
    if (options.requiresAuth !== undefined) {
      filtered = filtered.filter((e) => {
        const requiresAuth = !e.definition.allowedRoles.includes("PUBLIC");
        return requiresAuth === options.requiresAuth;
      });
    }

    // Filter by platform opt-out (CLI_OFF, AI_TOOL_OFF, WEB_OFF)
    if (options.platform) {
      filtered = filtered.filter((e) => {
        return !this.isOptedOutOfPlatform(e, options.platform!);
      });
    }

    return filtered;
  }

  /**
   * Check if endpoint is opted out of specific platform
   */
  private isOptedOutOfPlatform(
    endpoint: DiscoveredEndpoint,
    platform: string,
  ): boolean {
    const platformStr = platform.toLowerCase();

    switch (platformStr) {
      case "cli":
        return endpoint.definition.allowedRoles.includes("CLI_OFF");
      case "ai":
        return endpoint.definition.allowedRoles.includes("AI_TOOL_OFF");
      case "web":
        return endpoint.definition.allowedRoles.includes("WEB_OFF");
      case "mcp":
        // MCP uses same opt-out as AI tools
        return endpoint.definition.allowedRoles.includes("AI_TOOL_OFF");
      case "mobile":
        // Mobile uses same opt-out as web
        return endpoint.definition.allowedRoles.includes("WEB_OFF");
      default:
        return false;
    }
  }

  /**
   * Generate cache key from options
   */
  private getCacheKey(options: UnifiedDiscoveryOptions): string {
    return JSON.stringify({
      methods: options.includeMethods?.sort(),
      roles: options.roles?.sort(),
      categories: options.categories?.sort(),
      tags: options.tags?.sort(),
      search: options.searchQuery,
      auth: options.requiresAuth,
      exclude: options.excludePaths?.sort(),
    });
  }

  /**
   * Get from cache
   */
  private getFromCache(key: string): DiscoveredEndpoint[] | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cache
   */
  private setCache(key: string, data: DiscoveredEndpoint[], ttl: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }
}

/**
 * Singleton instance factory
 */
const instances = new Map<string, UnifiedDiscoveryService>();

export function getUnifiedDiscovery(
  logger: EndpointLogger,
): UnifiedDiscoveryService {
  const key = "default";
  if (!instances.has(key)) {
    instances.set(key, new UnifiedDiscoveryService(logger));
  }
  return instances.get(key)!;
}
