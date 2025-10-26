/**
 * AI Tool Filter
 * Filters tools based on user permissions and opt-out logic
 *
 * NOTE: This uses the unified platform system for filtering.
 * See: src/app/api/[locale]/v1/core/system/unified-ui/shared/
 */

import "server-only";

import {
  UserRole,
  type UserRoleValue,
} from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { Platform } from "../shared/config/platform-config";
import { aiToolConfig } from "./config";
import type {
  AIToolExecutionContext,
  DiscoveredEndpoint,
  IToolFilter,
  ToolFilterCriteria,
} from "./types";

/**
 * Platform type for opt-out checking
 * @deprecated Use Platform enum from shared/config/platform-config instead
 */
type LegacyPlatform = "cli" | "web" | "ai";

/**
 * Tool Filter Implementation with Opt-Out Logic
 * Now works with DiscoveredEndpoint[] directly
 */
export class ToolFilter implements IToolFilter {
  /**
   * Filter endpoints by user permissions
   */
  filterEndpointsByPermissions(
    endpoints: DiscoveredEndpoint[],
    user: AIToolExecutionContext["user"],
    platform: LegacyPlatform | Platform = Platform.AI,
  ): DiscoveredEndpoint[] {
    return endpoints.filter((endpoint) =>
      this.hasEndpointPermission(endpoint, user, platform),
    );
  }

  /**
   * Filter endpoints by criteria
   */
  filterEndpointsByCriteria(
    endpoints: DiscoveredEndpoint[],
    criteria: ToolFilterCriteria,
  ): DiscoveredEndpoint[] {
    let filtered = endpoints;

    // Filter by roles
    if (criteria.roles && criteria.roles.length > 0) {
      filtered = filtered.filter((e) =>
        criteria.roles!.some((role) => e.allowedRoles.includes(role)),
      );
    }

    // Filter by categories
    if (criteria.categories && criteria.categories.length > 0) {
      filtered = filtered.filter((e) =>
        criteria.categories!.includes(e.definition.category || ""),
      );
    }

    // Filter by tags
    if (criteria.tags && criteria.tags.length > 0) {
      filtered = filtered.filter((e) =>
        criteria.tags!.some((tag) => e.definition.tags?.includes(tag)),
      );
    }

    // Include only enabled tools
    if (criteria.enabledOnly) {
      filtered = filtered.filter((e) => e.enabled);
    }

    // Search query
    if (criteria.searchQuery) {
      const query = criteria.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.toolName.toLowerCase().includes(query) ||
          e.definition.title?.toLowerCase().includes(query) ||
          e.definition.description?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }

  /**
   * Check if user has permission for endpoint on specific platform
   * Uses OPT-OUT logic:
   * - Endpoint is accessible by default if user has the required role
   * - Endpoint can opt-out of specific platforms using CLI_OFF, AI_TOOL_OFF, WEB_OFF
   */
  hasEndpointPermission(
    endpoint: DiscoveredEndpoint,
    user: AIToolExecutionContext["user"],
    platform: LegacyPlatform | Platform = Platform.AI,
  ): boolean {
    // Check platform opt-out first
    if (this.isEndpointOptedOutOfPlatform(endpoint, platform)) {
      return false;
    }

    // Public user - only public endpoints
    if (user.isPublic) {
      return endpoint.allowedRoles.includes(UserRole.PUBLIC);
    }

    // Authenticated user - check role
    if (!user.role) {
      return false;
    }

    // Filter out opt-out roles from allowed roles for permission check
    const effectiveAllowedRoles = endpoint.allowedRoles.filter(
      (role) => !this.isOptOutRole(role),
    );

    // Check if user's role is in effective allowed roles
    return effectiveAllowedRoles.includes(user.role);
  }

  /**
   * Check if endpoint is opted out of specific platform
   */
  private isEndpointOptedOutOfPlatform(
    endpoint: DiscoveredEndpoint,
    platform: LegacyPlatform | Platform,
  ): boolean {
    // Normalize platform to lowercase string
    const platformStr = String(platform).toLowerCase();

    switch (platformStr) {
      case "cli":
        return endpoint.allowedRoles.includes(UserRole.CLI_OFF);
      case "ai":
        return endpoint.allowedRoles.includes(UserRole.AI_TOOL_OFF);
      case "web":
        return endpoint.allowedRoles.includes(UserRole.WEB_OFF);
      default:
        return false;
    }
  }

  /**
   * Check if role is an opt-out role
   */
  private isOptOutRole(role: typeof UserRoleValue): boolean {
    return (
      role === UserRole.CLI_OFF ||
      role === UserRole.AI_TOOL_OFF ||
      role === UserRole.WEB_OFF
    );
  }

  /**
   * Get role priority (higher = more privileged)
   */
  private getRolePriority(role: string): number {
    const priorities: Record<string, number> = {
      [UserRole.PUBLIC]: 0,
      [UserRole.CUSTOMER]: 5,
      [UserRole.PARTNER_EMPLOYEE]: 20,
      [UserRole.PARTNER_ADMIN]: 50,
      [UserRole.ADMIN]: 100,
      // Opt-out roles don't have priority
      [UserRole.CLI_OFF]: -1,
      [UserRole.AI_TOOL_OFF]: -1,
      [UserRole.WEB_OFF]: -1,
    };

    return priorities[role] || 0;
  }

  /**
   * Check if role A can access role B's resources
   */
  canAccessRole(userRole: string, requiredRole: string): boolean {
    // Opt-out roles can't be used for access checks
    if (this.isOptOutRole(requiredRole)) {
      return false;
    }
    return this.getRolePriority(userRole) >= this.getRolePriority(requiredRole);
  }

  /**
   * Get available endpoints count by category for user
   */
  getEndpointCountByCategory(
    endpoints: DiscoveredEndpoint[],
    user: AIToolExecutionContext["user"],
    platform: LegacyPlatform | Platform = Platform.AI,
  ): Record<string, number> {
    const filtered = this.filterEndpointsByPermissions(
      endpoints,
      user,
      platform,
    );
    const counts: Record<string, number> = {};

    for (const endpoint of filtered) {
      const category = endpoint.definition.category;
      if (category) {
        counts[category] = (counts[category] || 0) + 1;
      }
    }

    return counts;
  }

  /**
   * Get available endpoints count by role
   */
  getEndpointCountByRole(
    endpoints: DiscoveredEndpoint[],
  ): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const endpoint of endpoints) {
      for (const role of endpoint.allowedRoles) {
        // Only count actual user roles, not opt-out roles
        if (!this.isOptOutRole(role)) {
          const roleKey = role as string;
          counts[roleKey] = (counts[roleKey] || 0) + 1;
        }
      }
    }

    return counts;
  }

  /**
   * Check if user can execute batch operations
   */
  canExecuteBatchOperations(user: AIToolExecutionContext["user"]): boolean {
    // Only admins can execute multiple tools in parallel
    return user.role === UserRole.ADMIN;
  }

  /**
   * Get maximum tools per message for user
   */
  getMaxToolsPerMessage(user: AIToolExecutionContext["user"]): number {
    if (user.isPublic) {
      return 3; // Limited for public users
    }

    if (user.role === UserRole.ADMIN) {
      return aiToolConfig.execution.maxCallsPerMessage;
    }

    return Math.floor(aiToolConfig.execution.maxCallsPerMessage / 2); // Half for regular users
  }

  /**
   * Get platforms endpoint is available on
   */
  getAvailablePlatforms(
    endpoint: DiscoveredEndpoint,
  ): (LegacyPlatform | Platform)[] {
    const platforms: (LegacyPlatform | Platform)[] = [];

    if (!endpoint.allowedRoles.includes(UserRole.CLI_OFF)) {
      platforms.push(Platform.CLI);
    }
    if (!endpoint.allowedRoles.includes(UserRole.AI_TOOL_OFF)) {
      platforms.push(Platform.AI);
    }
    if (!endpoint.allowedRoles.includes(UserRole.WEB_OFF)) {
      platforms.push(Platform.WEB);
    }

    return platforms;
  }
}

/**
 * Singleton instance
 */
let toolFilterInstance: ToolFilter | null = null;

/**
 * Get or create tool filter instance
 */
export function getToolFilter(): ToolFilter {
  if (!toolFilterInstance) {
    toolFilterInstance = new ToolFilter();
  }
  return toolFilterInstance;
}

/**
 * Export singleton
 */
export const toolFilter = getToolFilter();
