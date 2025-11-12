/**
 * AI Tool Filter
 * Filters tools based on user permissions and opt-out logic
 *
 * NOTE: This uses the unified platform system for filtering.
 * See: src/app/api/[locale]/v1/core/system/unified-interface/shared/
 */

import "server-only";

import {
  UserRole,
  type UserRoleValue,
} from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { userRolesRepository } from "@/app/api/[locale]/v1/core/user/user-roles/repository";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

import {
  AI_CONFIG,
  type AIPlatformSpecific,
  Platform,
} from "../shared/server-only/config";
import type {
  AIToolExecutionContext,
  DiscoveredEndpoint,
  IToolFilter,
  ToolFilterCriteria,
} from "./types";

/**
 * Tool Filter Implementation with Opt-Out Logic
 * Now works with DiscoveredEndpoint[] directly
 */
export class ToolFilter implements IToolFilter {
  /**
   * Filter endpoints by user permissions (synchronous - uses fallback role assumptions)
   * For proper role checking, use filterEndpointsByPermissionsAsync
   */
  filterEndpointsByPermissions(
    endpoints: DiscoveredEndpoint[],
    user: AIToolExecutionContext["user"],
    platform: Platform = Platform.AI,
  ): DiscoveredEndpoint[] {
    return endpoints.filter((endpoint) =>
      this.hasEndpointPermission(endpoint, user, platform),
    );
  }

  /**
   * Filter endpoints by user permissions (async - fetches actual user roles from database)
   * This is the preferred method for accurate permission checking
   */
  async filterEndpointsByPermissionsAsync(
    endpoints: DiscoveredEndpoint[],
    user: AIToolExecutionContext["user"],
    platform: Platform = Platform.AI,
    logger: EndpointLogger,
  ): Promise<DiscoveredEndpoint[]> {
    // For public users, use synchronous check (no DB lookup needed)
    if (user.isPublic) {
      return this.filterEndpointsByPermissions(endpoints, user, platform);
    }

    // For authenticated users, fetch their actual roles from database
    if (!user.id) {
      logger.warn(
        "Authenticated user has no ID, falling back to synchronous check",
      );
      return this.filterEndpointsByPermissions(endpoints, user, platform);
    }

    // Fetch user roles from database
    const userRolesResult = await userRolesRepository.getUserRoles(
      user.id,
      logger,
    );
    if (!userRolesResult.success || !userRolesResult.data) {
      logger.warn(
        "Failed to fetch user roles, falling back to synchronous check",
        {
          userId: user.id,
          error: userRolesResult.success ? undefined : userRolesResult.message,
        },
      );
      return this.filterEndpointsByPermissions(endpoints, user, platform);
    }

    const userRoles = userRolesResult.data;
    logger.debug("Filtering endpoints with user roles", {
      userId: user.id,
      userRoles,
      totalEndpoints: endpoints.length,
    });

    // Filter endpoints based on actual user roles
    const filtered = endpoints.filter((endpoint) => {
      // Check platform opt-out first
      if (this.isEndpointOptedOutOfPlatform(endpoint, platform)) {
        return false;
      }

      // Safety check: if allowedRoles is undefined or not an array, deny access
      if (
        !endpoint.definition?.allowedRoles ||
        !Array.isArray(endpoint.definition.allowedRoles)
      ) {
        return false;
      }

      // Filter out opt-out roles from allowed roles for permission check
      const effectiveAllowedRoles = endpoint.definition.allowedRoles.filter(
        (role: typeof UserRoleValue) => !this.isOptOutRole(role),
      );

      // Check if endpoint is PUBLIC-only (authenticated users cannot access)
      const isPublicOnly =
        effectiveAllowedRoles.length === 1 &&
        effectiveAllowedRoles[0] === UserRole.PUBLIC;

      if (isPublicOnly) {
        return false;
      }

      // Check if user has at least one of the required roles
      const hasRequiredRole = effectiveAllowedRoles.some((role) =>
        userRoles.includes(role),
      );

      return hasRequiredRole;
    });

    logger.debug("Filtered endpoints by user roles", {
      userId: user.id,
      totalEndpoints: endpoints.length,
      filteredEndpoints: filtered.length,
    });

    return filtered;
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
      filtered = filtered.filter(
        (e) =>
          e.definition?.allowedRoles &&
          criteria.roles!.some((role) =>
            e.definition.allowedRoles.includes(role),
          ),
      );
    }

    // Filter by categories
    if (criteria.categories && criteria.categories.length > 0) {
      filtered = filtered.filter((e) =>
        criteria.categories!.includes(e.definition.category),
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
   *
   * Permission Logic:
   * - Public users (isPublic: true) → only endpoints with PUBLIC in allowedRoles
   * - Authenticated users (isPublic: false) → must have at least one of the required roles
   *   (roles are fetched from database via userRolesRepository)
   *
   * NOTE: This method is synchronous and cannot fetch user roles from database.
   * Use filterEndpointsByPermissionsAsync for proper role checking.
   * This method assumes authenticated users have CUSTOMER role for backwards compatibility.
   */
  hasEndpointPermission(
    endpoint: DiscoveredEndpoint,
    user: AIToolExecutionContext["user"],
    platform: Platform = Platform.AI,
  ): boolean {
    // Safety check: if allowedRoles is undefined or not an array, deny access
    if (
      !endpoint.definition?.allowedRoles ||
      !Array.isArray(endpoint.definition.allowedRoles)
    ) {
      return false;
    }

    // Check platform opt-out first
    if (this.isEndpointOptedOutOfPlatform(endpoint, platform)) {
      return false;
    }

    // Filter out opt-out roles from allowed roles for permission check
    const effectiveAllowedRoles = endpoint.definition.allowedRoles.filter(
      (role: typeof UserRoleValue) => !this.isOptOutRole(role),
    );

    // Public user - only public endpoints
    if (user.isPublic) {
      return effectiveAllowedRoles.includes(UserRole.PUBLIC);
    }

    // Authenticated user - for backwards compatibility, assume CUSTOMER role
    // This is a fallback when user roles cannot be fetched (synchronous context)
    // For proper role checking, use filterEndpointsByPermissionsAsync
    const isPublicOnly =
      effectiveAllowedRoles.length === 1 &&
      effectiveAllowedRoles[0] === UserRole.PUBLIC;

    // If endpoint is PUBLIC-only, authenticated users cannot access it
    if (isPublicOnly) {
      return false;
    }

    // Check if user has CUSTOMER role (backwards compatibility assumption)
    return effectiveAllowedRoles.includes(UserRole.CUSTOMER);
  }

  /**
   * Check if endpoint is opted out of specific platform
   */
  private isEndpointOptedOutOfPlatform(
    endpoint: DiscoveredEndpoint,
    platform: Platform,
  ): boolean {
    // Safety check: if allowedRoles is undefined or not an array, not opted out
    if (
      !endpoint.definition?.allowedRoles ||
      !Array.isArray(endpoint.definition.allowedRoles)
    ) {
      return false;
    }

    // Normalize platform to lowercase string
    const platformStr = String(platform).toLowerCase();

    switch (platformStr) {
      case "cli":
        return endpoint.definition.allowedRoles.includes(UserRole.CLI_OFF);
      case "ai":
        return endpoint.definition.allowedRoles.includes(UserRole.AI_TOOL_OFF);
      case "web":
        return endpoint.definition.allowedRoles.includes(UserRole.WEB_OFF);
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
  private getRolePriority(role: typeof UserRoleValue): number {
    const priorities: Record<typeof UserRoleValue, number> = {
      [UserRole.PUBLIC]: 0,
      [UserRole.CUSTOMER]: 5,
      [UserRole.PARTNER_EMPLOYEE]: 20,
      [UserRole.PARTNER_ADMIN]: 50,
      [UserRole.ADMIN]: 100,
      // Opt-out roles don't have priority
      [UserRole.CLI_OFF]: -1,
      [UserRole.AI_TOOL_OFF]: -1,
      [UserRole.WEB_OFF]: -1,
      [UserRole.PRODUCTION_OFF]: -1,
    };

    return priorities[role];
  }

  /**
   * Check if role A can access role B's resources
   */
  canAccessRole(
    userRole: typeof UserRoleValue,
    requiredRole: typeof UserRoleValue,
  ): boolean {
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
    platform: Platform = Platform.AI,
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
      // Safety check: skip if allowedRoles is undefined or not an array
      if (
        !endpoint.definition?.allowedRoles ||
        !Array.isArray(endpoint.definition.allowedRoles)
      ) {
        continue;
      }

      for (const role of endpoint.definition.allowedRoles) {
        // Only count actual user roles, not opt-out roles
        const roleValue = role as typeof UserRoleValue;
        if (!this.isOptOutRole(roleValue)) {
          counts[roleValue] = (counts[roleValue] || 0) + 1;
        }
      }
    }

    return counts;
  }

  /**
   * Check if user can execute batch operations
   */
  canExecuteBatchOperations(user: AIToolExecutionContext["user"]): boolean {
    // Only authenticated users can execute multiple tools in parallel
    // Public users are limited to single tool execution
    return !user.isPublic;
  }

  /**
   * Get maximum tools per message for user
   */
  getMaxToolsPerMessage(user: AIToolExecutionContext["user"]): number {
    if (user.isPublic) {
      return 3; // Limited for public users
    }

    const aiSpecific = AI_CONFIG.platformSpecific as AIPlatformSpecific;
    const maxTools =
      typeof aiSpecific?.maxToolsPerRequest === "number"
        ? aiSpecific.maxToolsPerRequest
        : 10;

    // Authenticated users get full access
    return maxTools;
  }

  /**
   * Get platforms endpoint is available on
   */
  getAvailablePlatforms(endpoint: DiscoveredEndpoint): Platform[] {
    const platforms: Platform[] = [];

    // Safety check: if allowedRoles is undefined or not an array, return empty array
    if (
      !endpoint.definition?.allowedRoles ||
      !Array.isArray(endpoint.definition.allowedRoles)
    ) {
      return platforms;
    }

    if (!endpoint.definition.allowedRoles.includes(UserRole.CLI_OFF)) {
      platforms.push(Platform.CLI);
    }
    if (!endpoint.definition.allowedRoles.includes(UserRole.AI_TOOL_OFF)) {
      platforms.push(Platform.AI);
    }
    if (!endpoint.definition.allowedRoles.includes(UserRole.WEB_OFF)) {
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
