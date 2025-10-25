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
import {
  excludeManualTools as excludeManualToolsUtil,
  filterByCategories,
  filterByRoles,
  filterBySearchQuery,
  filterByTags,
} from "./filter-utils";
import type {
  AIToolExecutionContext,
  AIToolMetadata,
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
 */
export class ToolFilter implements IToolFilter {
  /**
   * Filter tools by user permissions
   */
  filterByPermissions(
    tools: AIToolMetadata[],
    user: AIToolExecutionContext["user"],
    platform: LegacyPlatform | Platform = Platform.AI,
  ): AIToolMetadata[] {
    return tools.filter((tool) => this.hasPermission(tool, user, platform));
  }

  /**
   * Filter tools by criteria
   */
  filterByCriteria(
    tools: AIToolMetadata[],
    criteria: ToolFilterCriteria,
  ): AIToolMetadata[] {
    let filtered = tools;

    // Filter by roles
    if (criteria.roles && criteria.roles.length > 0) {
      filtered = filterByRoles(filtered, criteria.roles);
    }

    // Filter by categories
    if (criteria.categories && criteria.categories.length > 0) {
      filtered = filterByCategories(filtered, criteria.categories);
    }

    // Filter by tags
    if (criteria.tags && criteria.tags.length > 0) {
      filtered = filterByTags(filtered, criteria.tags);
    }

    // Exclude manual tools
    if (criteria.excludeManualTools) {
      filtered = excludeManualToolsUtil(filtered);
    }

    // Include only enabled tools
    if (criteria.enabledOnly) {
      // All tools in the registry are enabled by default
      // This is a placeholder for future functionality
    }

    // Search query
    if (criteria.searchQuery) {
      filtered = filterBySearchQuery(filtered, criteria.searchQuery);
    }

    return filtered;
  }

  /**
   * Check if user has permission for tool on specific platform
   * Uses OPT-OUT logic:
   * - Tool is accessible by default if user has the required role
   * - Tool can opt-out of specific platforms using CLI_OFF, AI_TOOL_OFF, WEB_OFF
   */
  hasPermission(
    tool: AIToolMetadata,
    user: AIToolExecutionContext["user"],
    platform: LegacyPlatform | Platform = Platform.AI,
  ): boolean {
    // Check platform opt-out first
    if (this.isOptedOutOfPlatform(tool, platform)) {
      return false;
    }

    // Public user - only public tools
    if (user.isPublic) {
      return tool.allowedRoles.includes(UserRole.PUBLIC);
    }

    // Authenticated user - check role
    if (!user.role) {
      return false;
    }

    // Filter out opt-out roles from allowed roles for permission check
    const effectiveAllowedRoles = tool.allowedRoles.filter(
      (role) => !this.isOptOutRole(role),
    );

    // Check if user's role is in effective allowed roles
    return effectiveAllowedRoles.includes(user.role);
  }

  /**
   * Check if tool is opted out of specific platform
   */
  private isOptedOutOfPlatform(
    tool: AIToolMetadata,
    platform: LegacyPlatform | Platform,
  ): boolean {
    // Handle both legacy string values and new Platform enum
    const platformStr =
      typeof platform === "string" ? platform : platform.toLowerCase();

    switch (platformStr) {
      case "cli":
        return tool.allowedRoles.includes(UserRole.CLI_OFF);
      case "ai":
        return tool.allowedRoles.includes(UserRole.AI_TOOL_OFF);
      case "web":
        return tool.allowedRoles.includes(UserRole.WEB_OFF);
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
   * Get available tools count by category for user
   */
  getToolCountByCategory(
    tools: AIToolMetadata[],
    user: AIToolExecutionContext["user"],
    platform: LegacyPlatform | Platform = Platform.AI,
  ): Record<string, number> {
    const filtered = this.filterByPermissions(tools, user, platform);
    const counts: Record<string, number> = {};

    for (const tool of filtered) {
      if (tool.category) {
        counts[tool.category] = (counts[tool.category] || 0) + 1;
      }
    }

    return counts;
  }

  /**
   * Get available tools count by role
   */
  getToolCountByRole(tools: AIToolMetadata[]): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const tool of tools) {
      for (const role of tool.allowedRoles) {
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
   * Get platforms tool is available on
   */
  getAvailablePlatforms(tool: AIToolMetadata): (LegacyPlatform | Platform)[] {
    const platforms: (LegacyPlatform | Platform)[] = [];

    if (!tool.allowedRoles.includes(UserRole.CLI_OFF)) {
      platforms.push(Platform.CLI);
    }
    if (!tool.allowedRoles.includes(UserRole.AI_TOOL_OFF)) {
      platforms.push(Platform.AI);
    }
    if (!tool.allowedRoles.includes(UserRole.WEB_OFF)) {
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
