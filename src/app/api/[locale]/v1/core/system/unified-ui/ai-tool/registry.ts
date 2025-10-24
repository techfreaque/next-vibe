/**
 * AI Tool Registry
 * Central registry for managing and accessing AI tools
 * Now uses shared endpoint registry for discovery
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";

import { createEndpointLogger } from "../cli/vibe/endpoints/endpoint-handler/logger";
import { getEndpointRegistry } from "../shared/endpoint-registry";

import { aiToolConfig, isAIToolSystemEnabled } from "./config";
import { toolExecutor } from "./executor";
import { toolFilter } from "./filter";
import type {
  AIToolExecutionContext,
  AIToolExecutionResult,
  AIToolMetadata,
  CoreTool,
  IToolRegistry,
  ToolExecutorOptions,
  ToolFilterCriteria,
  ToolRegistryStats,
} from "./types";

/**
 * Tool Registry Implementation
 */
export class ToolRegistry implements IToolRegistry {
  private initialized = false;
  private tools: AIToolMetadata[] = [];
  private cacheStats = {
    hits: 0,
    misses: 0,
    lastRefresh: 0,
  };

  /**
   * Initialize the registry using shared endpoint registry
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const logger = createEndpointLogger(false, Date.now(), "en-GLOBAL");

    if (!isAIToolSystemEnabled()) {
      logger.warn("[Tool Registry] AI Tool system is disabled");
      return;
    }

    try {
      logger.info("[Tool Registry] Starting discovery...");

      // Use shared endpoint registry
      const endpointRegistry = getEndpointRegistry(logger);
      await endpointRegistry.initialize({
        rootDir: aiToolConfig.rootDir,
        excludePaths: aiToolConfig.excludePaths,
      });

      // Get all endpoints
      const endpoints = await endpointRegistry.getAllEndpoints();

      logger.info("[Tool Registry] Discovery complete", {
        endpointsFound: endpoints.length,
        sampleEndpoints: endpoints.slice(0, 5).map((e) => e.name),
      });

      // Convert to tool metadata using shared endpoint metadata
      this.tools = endpoints.map((endpoint) => ({
        name: endpoint.name,
        description: endpoint.description || endpoint.title || "",
        category: endpoint.category || "general",
        tags: Array.isArray(endpoint.tags) ? endpoint.tags : [],
        endpointId: endpoint.id,
        allowedRoles: Array.isArray(endpoint.allowedRoles)
          ? endpoint.allowedRoles
          : [],
        isManualTool: false,
        parameters: endpoint.requestSchema,
      }));

      logger.info("[Tool Registry] Conversion complete", {
        toolsRegistered: this.tools.length,
      });

      this.cacheStats.lastRefresh = Date.now();
      this.initialized = true;
    } catch (error) {
      logger.error("[Tool Registry] Initialization failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get all tools filtered by criteria
   */
  async getTools(criteria?: ToolFilterCriteria): Promise<AIToolMetadata[]> {
    await this.ensureInitialized();

    if (!criteria) {
      return this.tools;
    }

    return toolFilter.filterByCriteria(this.tools, criteria);
  }

  /**
   * Get tools as AI SDK CoreTool[]
   * Note: This method is deprecated. Use the AI stream repository to create tools with proper execution context.
   */
  getAISDKTools(): CoreTool[] {
    // This method is no longer used - tools are created in the AI stream repository
    // with proper execution context
    return [];
  }

  /**
   * Get tools for a specific user
   * Note: This method is deprecated. Use the AI stream repository to create tools with proper execution context.
   */
  getToolsForUser(): CoreTool[] {
    // This method is no longer used - tools are created in the AI stream repository
    // with proper execution context
    return [];
  }

  /**
   * Get tool metadata by name
   */
  async getToolByName(name: string): Promise<AIToolMetadata | null> {
    await this.ensureInitialized();
    return this.tools.find((t) => t.name === name) || null;
  }

  /**
   * Execute a tool
   */
  async executeTool(
    context: AIToolExecutionContext,
    options?: ToolExecutorOptions,
  ): Promise<AIToolExecutionResult> {
    await this.ensureInitialized();

    // Check if user has permission
    const toolMeta = await this.getToolByName(context.toolName);
    if (!toolMeta) {
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

    if (!toolFilter.hasPermission(toolMeta, context.user)) {
      return {
        success: false,
        error: "app.api.v1.core.system.unifiedUi.aiTool.errors.permissionDenied",
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
   * Refresh the registry (rediscover endpoints)
   */
  async refresh(): Promise<void> {
    const logger = createEndpointLogger(false, Date.now(), "en-GLOBAL");

    // Get shared endpoint registry and refresh it
    const endpointRegistry = getEndpointRegistry(logger);
    await endpointRegistry.refresh({
      rootDir: aiToolConfig.rootDir,
      excludePaths: aiToolConfig.excludePaths,
    });

    // Re-initialize
    this.initialized = false;
    this.tools = [];

    await this.initialize();
  }

  /**
   * Get registry statistics
   */
  getStats(): ToolRegistryStats {
    const toolsByCategory: Record<string, number> = {};
    const toolsByRole: Record<string, number> = {};
    let manualTools = 0;
    let dynamicTools = 0;

    for (const tool of this.tools) {
      // Count by category
      if (tool.category) {
        toolsByCategory[tool.category] =
          (toolsByCategory[tool.category] || 0) + 1;
      }

      // Count by role
      for (const role of tool.allowedRoles) {
        toolsByRole[role] = (toolsByRole[role] || 0) + 1;
      }

      // Count manual vs dynamic
      if (tool.isManualTool) {
        manualTools++;
      } else {
        dynamicTools++;
      }
    }

    return {
      totalEndpoints: this.tools.length,
      totalTools: this.tools.length,
      toolsByCategory,
      toolsByRole,
      manualTools,
      dynamicTools,
      cacheStats: {
        size: this.tools.length,
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
    const logger = createEndpointLogger(false, Date.now(), "en-GLOBAL");

    // Clear shared endpoint registry cache
    const endpointRegistry = getEndpointRegistry(logger);
    void endpointRegistry.refresh({
      rootDir: aiToolConfig.rootDir,
      excludePaths: aiToolConfig.excludePaths,
    });

    this.cacheStats.hits = 0;
    this.cacheStats.misses = 0;
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
if (isAIToolSystemEnabled() && aiToolConfig.cache.enabled) {
  // Pre-initialize in background if caching enabled
  aiToolRegistry.initialize().catch(() => {
    // Background initialization failed, will retry on first access
  });
}
