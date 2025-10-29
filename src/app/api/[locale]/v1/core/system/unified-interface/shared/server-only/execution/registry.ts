/**
 * Base Registry
 * Shared registry logic for all platforms (AI, MCP, CLI)
 * Eliminates duplication across platform-specific registries
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import { getErrorMessage } from "../../utils/error";
import { getDiscoveredEndpoints } from "../discovery/adapter";
import type { DiscoveredEndpoint } from "../types/registry";

/**
 * Base registry configuration
 */
export interface BaseRegistryConfig {
  platformName: string;
  enabledCheck?: () => boolean;
}

/**
 * Base registry statistics
 */
export interface BaseRegistryStats {
  totalEndpoints: number;
  lastRefresh: number;
  initialized: boolean;
}

/**
 * Base Registry Class
 * Provides common initialization and endpoint management
 */
export abstract class BaseRegistry {
  protected initialized = false;
  protected endpoints: DiscoveredEndpoint[] = [];
  protected logger: EndpointLogger;
  protected config: BaseRegistryConfig;
  protected lastRefresh = 0;

  constructor(config: BaseRegistryConfig, logger?: EndpointLogger) {
    this.logger =
      logger || this.createEndpointLogger(false, Date.now(), config.locale);
    this.config = config;
  }

  /**
   * Initialize the registry
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Check if platform is enabled
    if (this.config.enabledCheck && !this.config.enabledCheck()) {
      this.logger.warn(`[${this.config.platformName}] Platform is disabled`);
      return;
    }

    try {
      this.logger.info(
        `[${this.config.platformName}] Starting initialization...`,
      );

      // Load endpoints from shared source
      this.endpoints = getDiscoveredEndpoints();

      this.logger.info(
        `[${this.config.platformName}] Initialization complete`,
        {
          endpointsFound: this.endpoints.length,
        },
      );

      this.lastRefresh = Date.now();
      this.initialized = true;

      // Call platform-specific post-initialization
      await this.onInitialized();
    } catch (error) {
      this.logger.error(`[${this.config.platformName}] Initialization failed`, {
        error: getErrorMessage(error),
      });
      this.initialized = false;
      this.endpoints = [];
    }
  }

  /**
   * Get all endpoints (unfiltered)
   */
  getEndpoints(): DiscoveredEndpoint[] {
    this.ensureInitialized();
    return this.endpoints;
  }

  /**
   * Get endpoints filtered by user permissions
   * @param user - User context for permission filtering
   * @param platform - Platform to filter by (optional)
   */
  getEndpointsByPermissions(
    user: { id?: string; email?: string; role?: string; isPublic: boolean },
    platform?: string,
  ): DiscoveredEndpoint[] {
    this.ensureInitialized();

    return toolFilter.filterEndpointsByPermissions(
      this.endpoints,
      user,
      platform,
    );
  }

  /**
   * Get endpoint by ID
   */
  getEndpointById(id: string): DiscoveredEndpoint | null {
    this.ensureInitialized();
    return this.endpoints.find((e) => e.id === id) || null;
  }

  /**
   * Get endpoint by tool name
   */
  getEndpointByToolName(toolName: string): DiscoveredEndpoint | null {
    this.ensureInitialized();
    return this.endpoints.find((e) => e.toolName === toolName) || null;
  }

  /**
   * Refresh the registry
   */
  async refresh(): Promise<void> {
    this.logger.info(`[${this.config.platformName}] Refreshing...`);
    this.initialized = false;
    this.endpoints = [];
    await this.initialize();
  }

  /**
   * Get registry statistics
   */
  getStats(): BaseRegistryStats {
    return {
      totalEndpoints: this.endpoints.length,
      lastRefresh: this.lastRefresh,
      initialized: this.initialized,
    };
  }

  /**
   * Check if registry is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Ensure registry is initialized
   */
  protected ensureInitialized(): void {
    if (!this.initialized) {
      this.logger.warn(
        `[${this.config.platformName}] Registry not initialized, initializing now...`,
      );
      // Synchronous initialization attempt - will be empty if fails
      this.endpoints = [];
    }
  }

  /**
   * Check if user has permission to access endpoint
   * Uses shared toolFilter for consistent permission logic
   */
  protected hasPermission(
    endpoint: DiscoveredEndpoint,
    user: { id?: string; email?: string; role?: string; isPublic: boolean },
  ): boolean {
    // Import toolFilter dynamically to avoid circular dependencies
    return toolFilter.hasEndpointPermission(endpoint, user);
  }

  /**
   * Count endpoints by a key function
   */
  protected countByKey<K extends string | number>(
    endpoints: DiscoveredEndpoint[],
    keyFn: (endpoint: DiscoveredEndpoint) => K | K[] | null | undefined,
  ): { [key: string]: number } {
    const counts: { [key: string]: number } = {};

    for (const endpoint of endpoints) {
      const keys = keyFn(endpoint);
      if (!keys) {
        continue;
      }

      const keyArray = Array.isArray(keys) ? keys : [keys];
      for (const key of keyArray) {
        const keyStr = String(key);
        counts[keyStr] = (counts[keyStr] || 0) + 1;
      }
    }

    return counts;
  }

  /**
   * Platform-specific post-initialization hook
   * Override in subclasses for custom logic
   */
  protected async onInitialized(): Promise<void> {
    // Default: no-op
  }
}
