/**
 * Unified Platform Abstraction
 * Single interface for all platforms (CLI, AI, MCP, Web, Mobile)
 *
 * This is the main entry point for platform-agnostic endpoint access.
 * All platforms should use this instead of their own discovery/filtering systems.
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";

import type { PlatformConfig } from "./config";
import { getPlatformConfig, Platform } from "./config";
import type { DiscoveryResult, UnifiedDiscoveryOptions } from "./discovery";
import { getUnifiedDiscovery } from "./discovery";
import type { DiscoveredEndpoint } from "../../unified-backend/shared/discovery/endpoint-registry-types";
import type { EndpointGroup, GroupingOptions } from "./grouping";
import { getUnifiedGrouping } from "./grouping";

/**
 * Platform context for operations
 */
export interface PlatformContext {
  /** Platform type */
  platform: Platform;

  /** Logger instance */
  logger: EndpointLogger;

  /** User context (optional) */
  user?: {
    id?: string;
    roles: string[];
    isPublic: boolean;
  };

  /** Custom configuration overrides */
  config?: Partial<PlatformConfig>;
}

/**
 * Unified Platform Service
 * Main interface for all platform operations
 */
export class UnifiedPlatformService {
  private context: PlatformContext;
  private config: PlatformConfig;
  private discovery: ReturnType<typeof getUnifiedDiscovery>;
  private grouping: ReturnType<typeof getUnifiedGrouping>;

  constructor(context: PlatformContext) {
    this.context = context;
    this.config = context.config
      ? { ...getPlatformConfig(context.platform), ...context.config }
      : getPlatformConfig(context.platform);
    this.discovery = getUnifiedDiscovery(context.logger);
    this.grouping = getUnifiedGrouping();
  }

  /**
   * Discover endpoints with platform-specific filtering
   * Automatically applies platform opt-out filtering (CLI_OFF, AI_TOOL_OFF, WEB_OFF)
   */
  discoverEndpoints(
    options?: Partial<UnifiedDiscoveryOptions>,
  ): DiscoveryResult {
    const discoveryOptions: UnifiedDiscoveryOptions = {
      includeMethods: this.config.includeMethods,
      excludePaths: this.config.excludePaths,
      cache: this.config.cache.enabled,
      cacheTTL: this.config.cache.ttl,
      platform: this.context.platform, // Add platform for opt-out filtering
      ...options,
    };

    // Apply user role filtering if user context provided
    if (this.context.user && !options?.roles) {
      discoveryOptions.roles = this.context.user.roles;
    }

    return this.discovery.discover(discoveryOptions);
  }

  /**
   * Get endpoint by ID
   */
  getEndpoint(id: string): DiscoveredEndpoint | null {
    return this.discovery.getEndpointById(id);
  }

  /**
   * Search endpoints
   */
  searchEndpoints(query: string): DiscoveryResult {
    return this.discoverEndpoints({ searchQuery: query });
  }

  /**
   * Get endpoints by path pattern
   */
  getEndpointsByPath(pathPattern: string): DiscoveredEndpoint[] {
    return this.discovery.getEndpointsByPath(pathPattern);
  }

  /**
   * Group endpoints
   */
  groupEndpoints(
    options: GroupingOptions,
    discoveryOptions?: Partial<UnifiedDiscoveryOptions>,
  ): EndpointGroup[] {
    const result = this.discoverEndpoints(discoveryOptions);
    return this.grouping.groupEndpoints(result.endpoints, options);
  }

  /**
   * Get platform configuration
   */
  getConfig(): PlatformConfig {
    return this.config;
  }

  /**
   * Get platform statistics
   */
  getStats(): PlatformStats {
    const result = this.discoverEndpoints();
    const cacheStats = this.discovery.getCacheStats();

    // Count by method
    const byMethod: Record<string, number> = {};
    for (const endpoint of result.endpoints) {
      byMethod[endpoint.definition.method] =
        (byMethod[endpoint.definition.method] || 0) + 1;
    }

    // Count by role
    const byRole: Record<string, number> = {};
    for (const endpoint of result.endpoints) {
      // Safety check: skip if allowedRoles is undefined or not an array
      if (
        !endpoint.definition?.allowedRoles ||
        !Array.isArray(endpoint.definition.allowedRoles)
      ) {
        continue;
      }

      for (const role of endpoint.definition.allowedRoles) {
        byRole[role] = (byRole[role] || 0) + 1;
      }
    }

    return {
      platform: this.context.platform,
      totalEndpoints: result.totalCount,
      filteredEndpoints: result.filteredCount,
      endpointsByMethod: byMethod,
      endpointsByRole: byRole,
      cache: {
        enabled: this.config.cache.enabled,
        size: cacheStats.size,
        ttl: this.config.cache.ttl,
      },
      features: this.config.features,
    };
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.discovery.clearCache();
    this.context.logger.info("[Unified Platform] Cache cleared", {
      platform: this.context.platform,
    });
  }

  /**
   * Check if endpoint is accessible for current user
   * Respects platform opt-out logic (CLI_OFF, AI_TOOL_OFF, WEB_OFF)
   */
  canAccessEndpoint(endpoint: DiscoveredEndpoint): boolean {
    // Check platform opt-out first
    if (this.isOptedOutOfPlatform(endpoint)) {
      return false;
    }

    if (!this.context.user) {
      // No user context - allow only public endpoints
      return endpoint.definition.allowedRoles.includes("PUBLIC");
    }

    // Check if user has any of the required roles
    return endpoint.definition.allowedRoles.some((role) =>
      this.context.user!.roles.includes(role),
    );
  }

  /**
   * Check if endpoint is opted out of current platform
   * Uses OPT-OUT logic: CLI_OFF, AI_TOOL_OFF, WEB_OFF
   */
  private isOptedOutOfPlatform(endpoint: DiscoveredEndpoint): boolean {
    const platformStr = this.context.platform.toLowerCase();

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
   * Filter endpoints by user permissions
   */
  getAccessibleEndpoints(): DiscoveredEndpoint[] {
    const result = this.discoverEndpoints();
    return result.endpoints.filter((e) => this.canAccessEndpoint(e));
  }
}

/**
 * Platform statistics
 */
export interface PlatformStats {
  platform: Platform;
  totalEndpoints: number;
  filteredEndpoints: number;
  endpointsByMethod: Record<string, number>;
  endpointsByRole: Record<string, number>;
  cache: {
    enabled: boolean;
    size: number;
    ttl: number;
  };
  features: PlatformConfig["features"];
}

/**
 * Factory function to create platform service
 */
export function createPlatformService(
  context: PlatformContext,
): UnifiedPlatformService {
  return new UnifiedPlatformService(context);
}

/**
 * Convenience functions for each platform
 */

export function createCLIPlatform(
  logger: EndpointLogger,
): UnifiedPlatformService {
  return createPlatformService({
    platform: Platform.CLI,
    logger,
  });
}

export function createAIPlatform(
  logger: EndpointLogger,
  user?: PlatformContext["user"],
): UnifiedPlatformService {
  return createPlatformService({
    platform: Platform.AI,
    logger,
    user,
  });
}

export function createMCPPlatform(
  logger: EndpointLogger,
  user?: PlatformContext["user"],
): UnifiedPlatformService {
  return createPlatformService({
    platform: Platform.MCP,
    logger,
    user,
  });
}

export function createWebPlatform(
  logger: EndpointLogger,
  user?: PlatformContext["user"],
): UnifiedPlatformService {
  return createPlatformService({
    platform: Platform.WEB,
    logger,
    user,
  });
}

export function createMobilePlatform(
  logger: EndpointLogger,
  user?: PlatformContext["user"],
): UnifiedPlatformService {
  return createPlatformService({
    platform: Platform.MOBILE,
    logger,
    user,
  });
}
