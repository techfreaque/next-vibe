/**
 * AI Tool Registry
 * Central registry for managing and accessing AI tools
 */

import "server-only";

import { defaultLocale } from "@/i18n/core/config";

import { Platform } from "../shared/server-only/config";
import { BaseRegistry } from "../shared/server-only/execution/registry";
import { toolFilter } from "../shared/server-only/permissions/filter";
/**
 * Singleton instance
 */
import { createSingletonGetter } from "../shared/utils/singleton";
import { toolExecutor } from "./executor";
import type {
  AIToolExecutionContext,
  AIToolExecutionResult,
  DiscoveredEndpoint,
  IToolRegistry,
  ToolExecutorOptions,
  ToolFilterCriteria,
  ToolRegistryStats,
} from "./types";

/**
 * Tool Registry Implementation
 * Extends BaseRegistry to eliminate duplication
 */
export class ToolRegistry extends BaseRegistry implements IToolRegistry {
  private cacheStats = {
    hits: 0,
    misses: 0,
    lastRefresh: 0,
  };

  constructor() {
    // eslint-disable-next-line i18next/no-literal-string
    const platformName = "AI Tool Registry";
    super({
      platformName,
      locale: defaultLocale,
    });
  }

  /**
   * Initialize the registry using generated endpoints
   */
  async initialize(): Promise<void> {
    await super.initialize();
  }

  /**
   * Post-initialization hook
   */
  protected async onInitialized(): Promise<void> {
    this.cacheStats.lastRefresh = Date.now();
    await Promise.resolve(); // Satisfy async requirement
  }

  /**
   * Get all endpoints with optional filtering by user permissions and platform
   * @param user - User context for permission filtering (optional)
   * @param platform - Platform to filter by (optional, defaults to AI)
   * @param criteria - Additional filter criteria (optional)
   */
  getEndpoints(
    user?: AIToolExecutionContext["user"],
    platform?: Platform,
    criteria?: ToolFilterCriteria,
  ): DiscoveredEndpoint[] {
    this.ensureInitialized();

    // Use base class method for permission filtering
    let filtered = user
      ? super.getEndpointsByPermissions(user, platform || Platform.AI)
      : super.getEndpoints();

    // Apply additional criteria if provided
    if (criteria) {
      filtered = toolFilter.filterEndpointsByCriteria(filtered, criteria);
    }

    return filtered;
  }

  /**
   * Execute a tool
   */
  async executeTool(
    context: AIToolExecutionContext,
    options?: ToolExecutorOptions,
  ): Promise<AIToolExecutionResult> {
    this.ensureInitialized();

    // Check if user has permission
    const endpoint = super.getEndpointByToolName(context.toolName);
    if (!endpoint) {
      return {
        success: false,
        error: "app.api.v1.core.system.unifiedInterface.aiTool.errors.toolNotFound",
        metadata: {
          executionTime: 0,
          endpointPath: "",
          method: "",
        },
      };
    }

    if (!super.hasPermission(endpoint, context.user)) {
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
   * Get registry statistics
   */
  getStats(): ToolRegistryStats {
    const allEndpoints = super.getEndpoints();

    // Use shared counting utility
    const toolsByCategory = this.countByKey(
      allEndpoints,
      (e) => e.definition.category,
    );
    const toolsByRole = this.countByKey(allEndpoints, (e) =>
      Array.isArray(e.definition?.allowedRoles)
        ? e.definition.allowedRoles
        : null,
    );

    // All endpoints are dynamic (from generated endpoints)
    const dynamicTools = allEndpoints.length;
    const manualTools = 0;

    return {
      totalEndpoints: allEndpoints.length,
      totalTools: allEndpoints.length,
      toolsByCategory,
      toolsByRole,
      manualTools,
      dynamicTools,
      cacheStats: {
        size: allEndpoints.length,
        hits: this.cacheStats.hits,
        misses: this.cacheStats.misses,
        lastRefresh: this.cacheStats.lastRefresh,
      },
      lastRefresh: this.cacheStats.lastRefresh,
      initialized: this.initialized,
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cacheStats.hits = 0;
    this.cacheStats.misses = 0;
  }

  /**
   * Ensure registry is initialized
   */
  protected ensureInitialized(): void {
    if (!this.initialized) {
      void this.initialize();
    }
  }
}

export const getToolRegistry = createSingletonGetter(() => new ToolRegistry());
export const aiToolRegistry = getToolRegistry();

// Initialize on module load
try {
  void aiToolRegistry.initialize();
} catch {
  // Will retry on first access
}
