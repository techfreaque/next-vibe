/**
 * AI Tool Registry
 * Central registry for managing and accessing AI tools
 *
 * NOTE: This registry now uses the unified platform system internally.
 * For new code, consider using createAIPlatform() from shared/platform/unified-platform.ts
 *
 * @see src/app/api/[locale]/v1/core/system/unified-ui/shared/platform/unified-platform.ts
 */

import "server-only";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";

import { Platform } from "../shared/config";
import { getDiscoveredEndpoints } from "../shared/endpoint-adapter";
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
 * Now stores DiscoveredEndpoint[] directly - no conversion needed
 */
export class ToolRegistry implements IToolRegistry {
  private initialized = false;
  private endpoints: DiscoveredEndpoint[] = [];
  private cacheStats = {
    hits: 0,
    misses: 0,
    lastRefresh: 0,
  };

  /**
   * Initialize the registry using generated endpoints
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }

    const logger = createEndpointLogger(false, Date.now(), "en-GLOBAL");

    // AI Tool system is always enabled - controlled by platform config
    // No need for separate enable/disable flag

    try {
      logger.debug("[Tool Registry] Loading from generated endpoints...");

      // Get endpoints from generated/endpoints.ts via adapter
      // No conversion needed - store directly
      this.endpoints = getDiscoveredEndpoints();

      logger.debug("[Tool Registry] Endpoints loaded", {
        endpointsFound: this.endpoints.length,
      });

      this.cacheStats.lastRefresh = Date.now();
      this.initialized = true;
    } catch (error) {
      logger.error("[Tool Registry] Initialization failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      this.initialized = false;
      this.endpoints = [];
    }
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

    let filtered = this.endpoints;

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
   * Get endpoint by tool name
   */
  getEndpointByToolName(toolName: string): DiscoveredEndpoint | null {
    this.ensureInitialized();
    return this.endpoints.find((e) => e.toolName === toolName) || null;
  }

  /**
   * Get endpoint by ID
   */
  getEndpointById(id: string): DiscoveredEndpoint | null {
    this.ensureInitialized();
    return this.endpoints.find((e) => e.id === id) || null;
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
    const endpoint = this.getEndpointByToolName(context.toolName);
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
   * Refresh the registry (reload from generated endpoints)
   */
  refresh(): void {
    this.initialized = false;
    this.endpoints = [];
    this.initialize();
  }

  /**
   * Get registry statistics
   */
  getStats(): ToolRegistryStats {
    const toolsByCategory: Record<string, number> = {};
    const toolsByRole: Record<string, number> = {};
    let manualTools = 0;
    let dynamicTools = 0;

    for (const endpoint of this.endpoints) {
      // Count by category
      const category = endpoint.definition.category;
      if (category) {
        toolsByCategory[category] = (toolsByCategory[category] || 0) + 1;
      }

      // Count by role
      for (const role of endpoint.definition.allowedRoles) {
        const roleKey = role as string;
        toolsByRole[roleKey] = (toolsByRole[roleKey] || 0) + 1;
      }

      // All endpoints are dynamic (from generated endpoints)
      dynamicTools++;
    }

    return {
      totalEndpoints: this.endpoints.length,
      totalTools: this.endpoints.length,
      toolsByCategory,
      toolsByRole,
      manualTools,
      dynamicTools,
      cacheStats: {
        size: this.endpoints.length,
        hits: this.cacheStats.hits,
        misses: this.cacheStats.misses,
        lastRefresh: this.cacheStats.lastRefresh,
      },
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
  private ensureInitialized(): void {
    if (!this.initialized) {
      this.initialize();
    }
  }
}

/**
 * Singleton instance
 */
let toolRegistryInstance: ToolRegistry | null = null;

/**
 * Get or create tool registry instance
 */
export function getToolRegistry(): ToolRegistry {
  if (!toolRegistryInstance) {
    toolRegistryInstance = new ToolRegistry();
  }
  return toolRegistryInstance;
}

/**
 * Export singleton
 */
export const aiToolRegistry = getToolRegistry();

/**
 * Initialize registry on module load (lazy)
 * Only initializes when first accessed
 */
// Pre-initialize in background
try {
  aiToolRegistry.initialize();
} catch {
  // Background initialization failed, will retry on first access
}
