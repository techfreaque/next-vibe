/**
 * AI Tool Registry
 * Central registry for managing and accessing AI tools
 */

import "server-only";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";

import { BaseRegistry } from "../shared/base-registry";
import { Platform } from "../shared/config";
/**
 * Singleton instance
 */
import { createSingletonGetter } from "../shared/utils/singleton-factory";
import { toolExecutor } from "./executor";
import { toolFilter } from "./filter";
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
    const logger = createEndpointLogger(false, Date.now(), "en-GLOBAL");
    // eslint-disable-next-line i18next/no-literal-string
    const platformName = "AI Tool Registry";
    super(logger, {
      platformName,
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
    user: AIToolExecutionContext["user"],
    platform?: Platform,
    criteria?: ToolFilterCriteria,
  ): DiscoveredEndpoint[] {
    this.ensureInitialized();

    let filtered = super.getEndpoints();

    // Filter by user permissions and platform if provided
    if (user !== undefined) {
      const platformValue = platform || Platform.AI;
      filtered = toolFilter.filterEndpointsByPermissions(
        filtered,
        user,
        platformValue,
      );
    }

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
        error: "app.api.v1.core.system.unifiedUi.aiTool.errors.toolNotFound",
        metadata: {
          executionTime: 0,
          endpointPath: "",
          method: "",
        },
      };
    }

    if (!toolFilter.hasEndpointPermission(endpoint, context.user)) {
      return {
        success: false,
        error:
          "app.api.v1.core.system.unifiedUi.aiTool.errors.permissionDenied",
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
    const toolsByCategory: Record<string, number> = {};
    const toolsByRole: Record<string, number> = {};
    let manualTools = 0;
    let dynamicTools = 0;

    const allEndpoints = super.getEndpoints();
    for (const endpoint of allEndpoints) {
      // Count by category
      const category = endpoint.definition.category;
      if (category) {
        toolsByCategory[category] = (toolsByCategory[category] || 0) + 1;
      }

      // Count by role
      // Safety check: skip if allowedRoles is undefined or not an array
      if (
        endpoint.definition?.allowedRoles &&
        Array.isArray(endpoint.definition.allowedRoles)
      ) {
        for (const role of endpoint.definition.allowedRoles) {
          const roleKey = role as string;
          toolsByRole[roleKey] = (toolsByRole[roleKey] || 0) + 1;
        }
      }

      // All endpoints are dynamic (from generated endpoints)
      dynamicTools++;
    }

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
