/**
 * AI Tool Registry
 */

import "server-only";

import { Platform } from "../shared/types/platform";
import type { EndpointLogger } from "../shared/logger/endpoint";
import { getDiscoveredEndpoints } from "../shared/server-only/registry/endpoint-adapter";
import { toolFilter } from "./filter";
import { toolExecutor } from "./executor";
import type {
  AIToolExecutionContext,
  AIToolExecutionResult,
  DiscoveredEndpoint,
  ToolExecutorOptions,
  ToolFilterCriteria,
  ToolRegistryStats,
} from "./types";

/**
 * Registry state
 */
let initialized = false;
let endpoints: DiscoveredEndpoint[] = [];
let cacheStats = {
  hits: 0,
  misses: 0,
  lastRefresh: 0,
};

/**
 * AI Tool Registry
 */
export class ToolRegistry {
  /**
   * Initialize the registry
   */
  static async initialize(): Promise<void> {
    if (initialized) {
      return;
    }

    endpoints = getDiscoveredEndpoints();
    initialized = true;
    cacheStats.lastRefresh = Date.now();
  }

  /**
   * Get endpoints with filtering
   */
  static getEndpoints(
    user?: AIToolExecutionContext["user"],
    platform?: Platform,
    criteria?: ToolFilterCriteria,
  ): DiscoveredEndpoint[] {
    ToolRegistry.ensureInitialized();

    let filtered = user
      ? toolFilter.filterEndpointsByPermissions(
          endpoints,
          user,
          platform || Platform.AI,
        )
      : endpoints;

    if (criteria) {
      filtered = toolFilter.filterEndpointsByCriteria(filtered, criteria);
    }

    return filtered;
  }

  /**
   * Get endpoints async with proper role checking
   */
  static async getEndpointsAsync(
    user: AIToolExecutionContext["user"],
    platform: Platform = Platform.AI,
    logger: EndpointLogger,
    criteria?: ToolFilterCriteria,
  ): Promise<DiscoveredEndpoint[]> {
    ToolRegistry.ensureInitialized();

    let filtered = await toolFilter.filterEndpointsByPermissionsAsync(
      endpoints,
      user,
      platform,
      logger,
    );

    if (criteria) {
      filtered = toolFilter.filterEndpointsByCriteria(filtered, criteria);
    }

    return filtered;
  }

  /**
   * Get endpoints by tool names
   */
  static async getEndpointsByToolNamesLazy(
    toolNames: string[],
    user?: AIToolExecutionContext["user"],
    platform?: Platform,
  ): Promise<DiscoveredEndpoint[]> {
    ToolRegistry.ensureInitialized();

    const filtered = endpoints.filter((e) => toolNames.includes(e.toolName));

    return user
      ? toolFilter.filterEndpointsByPermissions(
          filtered,
          user,
          platform || Platform.AI,
        )
      : filtered;
  }

  /**
   * Get endpoints by IDs
   */
  static async getEndpointsByIdsLazy(
    endpointIds: string[],
    user?: AIToolExecutionContext["user"],
    platform?: Platform,
  ): Promise<DiscoveredEndpoint[]> {
    ToolRegistry.ensureInitialized();

    const filtered = endpoints.filter((e) => endpointIds.includes(e.id));

    return user
      ? toolFilter.filterEndpointsByPermissions(
          filtered,
          user,
          platform || Platform.AI,
        )
      : filtered;
  }

  /**
   * Execute a tool
   */
  static async executeTool(
    context: AIToolExecutionContext,
    options?: ToolExecutorOptions,
  ): Promise<AIToolExecutionResult> {
    ToolRegistry.ensureInitialized();

    const endpoint = endpoints.find((e) => e.toolName === context.toolName);
    if (!endpoint) {
      return {
        success: false,
        error:
          "app.api.v1.core.system.unifiedInterface.aiTool.errors.toolNotFound",
        metadata: {
          executionTime: 0,
          endpointPath: "",
          method: "",
        },
      };
    }

    const hasPermission = toolFilter.hasEndpointPermission(
      endpoint,
      context.user,
      Platform.AI,
    );
    if (!hasPermission) {
      return {
        success: false,
        error:
          "app.api.v1.core.system.unifiedInterface.aiTool.errors.permissionDenied",
        metadata: {
          executionTime: 0,
          endpointPath: "",
          method: "",
        },
      };
    }

    return await toolExecutor.execute(context, options);
  }

  /**
   * Get statistics
   */
  static getStats(): ToolRegistryStats {
    const toolsByCategory: Record<string, number> = {};
    const toolsByRole: Record<string, number> = {};

    for (const endpoint of endpoints) {
      const category = endpoint.definition.category;
      if (category) {
        toolsByCategory[category] = (toolsByCategory[category] || 0) + 1;
      }

      if (Array.isArray(endpoint.definition?.allowedRoles)) {
        for (const role of endpoint.definition.allowedRoles) {
          toolsByRole[role] = (toolsByRole[role] || 0) + 1;
        }
      }
    }

    return {
      totalEndpoints: endpoints.length,
      totalTools: endpoints.length,
      toolsByCategory,
      toolsByRole,
      manualTools: 0,
      dynamicTools: endpoints.length,
      cacheStats: {
        size: endpoints.length,
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        lastRefresh: cacheStats.lastRefresh,
      },
      lastRefresh: cacheStats.lastRefresh,
      initialized,
    };
  }

  /**
   * Clear cache
   */
  static clearCache(): void {
    cacheStats.hits = 0;
    cacheStats.misses = 0;
  }

  /**
   * Ensure initialized
   */
  private static ensureInitialized(): void {
    if (!initialized) {
      void ToolRegistry.initialize();
    }
  }
}

// Initialize on load
try {
  void ToolRegistry.initialize();
} catch {
  // Will retry on first access
}
