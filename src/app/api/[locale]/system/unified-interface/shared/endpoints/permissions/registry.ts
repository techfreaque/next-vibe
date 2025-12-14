/**
 * Permissions Registry
 * Single source for ALL permission and access control logic
 * Consolidates platform access, user role checks, and endpoint filtering
 * Used by all adapters (definitions, definition, route-execution)
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  filterPlatformMarkers,
  filterUserPermissionRoles,
  PlatformMarker,
  type PlatformMarkerValue,
  UserPermissionRole,
  type UserPermissionRoleValue,
  UserRole,
  type UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";

import type { EndpointLogger } from "../../logger/endpoint";
import type { CreateApiEndpointAny } from "../../types/endpoint";
import { Platform } from "../../types/platform";
import type { InferJwtPayloadTypeFromRoles } from "../route/handler";

/**
 * Platform access check result
 */
interface PlatformAccessResult {
  allowed: boolean;
  reason?: string;
  blockedByRole?: UserRoleValue;
}

/**
 * User role check result
 */
interface UserRoleCheckResult {
  allowed: boolean;
  reason?: string;
  userRoles?: readonly (typeof UserPermissionRoleValue)[];
  requiredRoles?: readonly (typeof UserPermissionRoleValue)[];
}

/**
 * Interface for Permissions Registry
 * Public API - only methods that should be called from outside
 */
interface IPermissionsRegistry {
  // === Access Control ===
  /**
   * Validate endpoint access - consolidated platform and permission checking
   * Returns ResponseType with detailed error information
   * Used by handler.ts and loader.ts for consistent access validation
   */
  validateEndpointAccess(
    endpoint: CreateApiEndpointAny,
    user: JwtPayloadType,
    platform: Platform,
  ): ResponseType<true>;

  // === Endpoint Discovery & Filtering ===
  /**
   * Check if endpoint is accessible on platform (used by definitions registry)
   */
  checkPlatformAccess(
    allowedRoles: readonly UserRoleValue[],
    platform: Platform,
  ): PlatformAccessResult;

  /**
   * Filter endpoints by user permissions (used by definitions, MCP, AI)
   * Requires logger to fetch user roles from DB (not from JWT/cookies)
   */
  filterEndpointsByPermissions(
    endpoints: CreateApiEndpointAny[],
    user: JwtPayloadType,
    platform: Platform,
    logger: EndpointLogger,
  ): CreateApiEndpointAny[];

  /**
   * Get endpoint count by category for user (used by definitions registry)
   */
  getEndpointCountByCategory(
    endpoints: CreateApiEndpointAny[],
    user: JwtPayloadType,
    platform: Platform,
    logger: EndpointLogger,
  ): Record<string, number>;
}

/**
 * Permissions Registry Class
 * Consolidates ALL permission, authentication, and validation logic
 */
class PermissionsRegistry implements IPermissionsRegistry {
  /**
   * Check if endpoint is accessible on the given platform
   * Enforces _OFF platform markers for platform exclusion
   */
  checkPlatformAccess(
    allowedRoles: readonly UserRoleValue[],
    platform: Platform,
  ): PlatformAccessResult {
    const platformMarkers = filterPlatformMarkers(allowedRoles);

    // Check production environment restrictions
    if (
      envClient.NODE_ENV === "production" &&
      platformMarkers.includes(PlatformMarker.PRODUCTION_OFF)
    ) {
      return {
        allowed: false,
        reason: "Endpoint is disabled in production environment",
        blockedByRole: PlatformMarker.PRODUCTION_OFF,
      };
    }

    // Check platform-specific _OFF restrictions
    const platformStr = String(platform).toLowerCase();

    switch (platformStr) {
      case "cli":
      case "mcp":
        if (platformMarkers.includes(PlatformMarker.CLI_OFF)) {
          return {
            allowed: false,
            reason: `Endpoint is not accessible via ${platformStr.toUpperCase()} platform`,
            blockedByRole: PlatformMarker.CLI_OFF,
          };
        }
        break;

      case "cli-package":
        // CLI_PACKAGE can only access endpoints with CLI_AUTH_BYPASS marker
        // This restricts npm package users to unauthenticated endpoints only
        if (platformMarkers.includes(PlatformMarker.CLI_OFF)) {
          return {
            allowed: false,
            reason: "Endpoint is not accessible via CLI_PACKAGE platform",
            blockedByRole: PlatformMarker.CLI_OFF,
          };
        }
        if (!platformMarkers.includes(PlatformMarker.CLI_AUTH_BYPASS)) {
          return {
            allowed: false,
            reason: "Endpoint requires authentication which is not available in CLI_PACKAGE mode",
            blockedByRole: PlatformMarker.CLI_AUTH_BYPASS,
          };
        }
        break;

      case "ai":
        if (platformMarkers.includes(PlatformMarker.AI_TOOL_OFF)) {
          return {
            allowed: false,
            reason: "Endpoint is not accessible via AI tools",
            blockedByRole: PlatformMarker.AI_TOOL_OFF,
          };
        }
        break;

      case "web":
      case "next":
      case "trpc":
        if (platformMarkers.includes(PlatformMarker.WEB_OFF)) {
          return {
            allowed: false,
            reason: "Endpoint is not accessible via Web platform",
            blockedByRole: PlatformMarker.WEB_OFF,
          };
        }
        break;

      case "mobile":
      case "native":
        // Mobile follows web rules for now
        if (platformMarkers.includes(PlatformMarker.WEB_OFF)) {
          return {
            allowed: false,
            reason: "Endpoint is not accessible via Mobile platform",
            blockedByRole: PlatformMarker.WEB_OFF,
          };
        }
        break;
    }

    return { allowed: true };
  }

  /**
   * Check if user has required permission roles for the endpoint
   */
  checkUserRoles(
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    permissionRoles: readonly (typeof UserPermissionRoleValue)[],
    userRoles: (typeof UserPermissionRoleValue)[],
  ): UserRoleCheckResult {
    // If no permission roles defined, endpoint is open to all
    if (permissionRoles.length === 0) {
      return { allowed: true };
    }

    // Check if PUBLIC is allowed (anyone can access)
    if (permissionRoles.includes(UserPermissionRole.PUBLIC)) {
      return { allowed: true };
    }

    // For public users (not authenticated), check if PUBLIC is allowed
    if (user.isPublic) {
      return {
        allowed: false,
        reason:
          "Authentication required - endpoint does not allow public access",
        userRoles: [],
        requiredRoles: permissionRoles,
      };
    }

    // Check if user has any of the required roles
    const hasRequiredRole = permissionRoles.some((requiredRole) =>
      userRoles.includes(requiredRole),
    );

    if (!hasRequiredRole) {
      return {
        allowed: false,
        reason: "User does not have required role for this endpoint",
        userRoles,
        requiredRoles: permissionRoles,
      };
    }

    return {
      allowed: true,
      userRoles,
      requiredRoles: permissionRoles,
    };
  }

  /**
   * Full access check combining platform and user role checks (PRIVATE - used internally)
   */
  private async checkFullAccess(
    allowedRoles: readonly UserRoleValue[],
    platform: Platform | string,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    userRoles: (typeof UserPermissionRoleValue)[],
    logger: EndpointLogger,
  ): Promise<ResponseType<true>> {
    // Separate concerns: filter platform markers and permission roles
    const platformMarkers = filterPlatformMarkers(allowedRoles);
    const permissionRoles = filterUserPermissionRoles(allowedRoles);

    logger.debug("Access check - separated concerns", {
      platformMarkers,
      permissionRoles,
      platform,
    });

    // 1. Check platform access first
    const platformAccess = this.checkPlatformAccess(
      allowedRoles,
      platform as Platform,
    );
    if (!platformAccess.allowed) {
      logger.warn("Platform access denied", {
        platform,
        reason: platformAccess.reason,
        blockedByRole: platformAccess.blockedByRole,
      });

      return {
        success: false,
        message:
          "app.api.system.unifiedInterface.shared.permissions.errors.platformAccessDenied",
        errorType: ErrorResponseTypes.FORBIDDEN,
        messageParams: {
          platform: String(platform),
          reason: platformAccess.reason || "Platform not allowed",
        },
      };
    }

    // 2. Check if CLI auth bypass is allowed (skip role check if true)
    if (this.allowsCliAuthBypass(platformMarkers)) {
      logger.debug("CLI auth bypass enabled for endpoint", {
        userId: user.isPublic ? "public" : user.id,
        platformMarkers,
      });
      return { success: true, data: true };
    }

    // 3. Check user role permissions
    const roleAccess = this.checkUserRoles(user, permissionRoles, userRoles);
    if (!roleAccess.allowed) {
      logger.warn("User role access denied", {
        userId: user.isPublic ? "public" : user.id,
        reason: roleAccess.reason,
        userRoles: roleAccess.userRoles
          ? (roleAccess.userRoles as string[]).join(", ")
          : undefined,
        requiredRoles: roleAccess.requiredRoles
          ? (roleAccess.requiredRoles as string[]).join(", ")
          : undefined,
      });

      return {
        success: false,
        message:
          "app.api.system.unifiedInterface.shared.permissions.errors.insufficientRoles",
        errorType: ErrorResponseTypes.FORBIDDEN,
        messageParams: {
          userRoles: (roleAccess.userRoles || []).join(", ") || "none",
          requiredRoles: (roleAccess.requiredRoles || []).join(", "),
        },
      };
    }

    return { success: true, data: true };
  }

  /**
   * Validate endpoint access - consolidated platform and permission checking
   * Returns ResponseType with detailed error information
   * Used by handler.ts and loader.ts for consistent access validation
   */
  validateEndpointAccess(
    endpoint: CreateApiEndpointAny,
    user: JwtPayloadType,
    platform: Platform,
  ): ResponseType<true> {
    // Safety check: if allowedRoles is undefined or not an array, deny access
    if (!endpoint.allowedRoles || !Array.isArray(endpoint.allowedRoles)) {
      return {
        success: false,
        message:
          "app.api.system.unifiedInterface.shared.permissions.errors.definitionError",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: "Endpoint allowedRoles is not properly configured",
        },
      };
    }

    // 1. Check platform access first
    const platformAccess = this.checkPlatformAccess(
      endpoint.allowedRoles,
      platform,
    );
    if (!platformAccess.allowed) {
      return {
        success: false,
        message:
          "app.api.system.unifiedInterface.shared.permissions.errors.platformAccessDenied",
        errorType: ErrorResponseTypes.FORBIDDEN,
        messageParams: {
          platform: String(platform),
          reason: platformAccess.reason || "Platform not allowed",
        },
      };
    }

    // 2. Check user permissions
    const hasPermission = this.hasEndpointPermission(endpoint, user, platform);
    if (!hasPermission) {
      return {
        success: false,
        message:
          "app.api.system.unifiedInterface.shared.permissions.errors.insufficientRoles",
        errorType: ErrorResponseTypes.FORBIDDEN,
        messageParams: {
          userId: user.isPublic ? "public" : user.id,
          requiredRoles: endpoint.allowedRoles.join(", "),
          userRoles: user.roles?.join(", ") || "none",
        },
      };
    }

    return {
      success: true,
      data: true,
    };
  }

  /**
   * Check if user has permission for endpoint on specific platform
   * Uses OPT-OUT logic:
   * - Endpoint is accessible by default if user has the required role
   * - Endpoint can opt-out of specific platforms using CLI_OFF, AI_TOOL_OFF, WEB_OFF
   */
  private hasEndpointPermission(
    endpoint: CreateApiEndpointAny,
    user: JwtPayloadType,
    platform: Platform,
  ): boolean {
    // Safety check: if allowedRoles is undefined or not an array, deny access
    if (!endpoint.allowedRoles || !Array.isArray(endpoint.allowedRoles)) {
      return false;
    }

    // Check platform opt-out first
    if (this.isEndpointOptedOutOfPlatform(endpoint, platform)) {
      return false;
    }

    // Check for CLI auth bypass - if enabled, allow access without role check
    const platformMarkers = filterPlatformMarkers(endpoint.allowedRoles);
    if (this.allowsCliAuthBypass(platformMarkers)) {
      return true;
    }

    // Filter out opt-out roles from allowed roles for permission check
    const effectiveAllowedRoles = endpoint.allowedRoles.filter(
      (role: UserRoleValue[number]) => !this.isOptOutRole(role),
    );

    // Extract user permission roles from effective allowed roles
    const permissionRoles = filterUserPermissionRoles(effectiveAllowedRoles);

    // Special handling for PUBLIC role
    // PUBLIC role is exclusive to public/unauthenticated users (user.isPublic === true)
    // Public users have empty roles array, so we check isPublic flag instead
    if (user.isPublic && permissionRoles.includes(UserPermissionRole.PUBLIC)) {
      return true;
    }

    // Check if user has any of the required roles
    // User roles come from JWT payload which was populated from DB during login/signup
    const userRoles = user.roles || [];

    const hasRequiredRole = effectiveAllowedRoles.some((requiredRole) =>
      userRoles.includes(requiredRole),
    );

    return hasRequiredRole;
  }

  /**
   * Filter endpoints by user permissions
   * Requires logger to fetch user roles from DB (not from JWT/cookies)
   * Note: Currently uses JWT-based permission check, but logger is required
   * for future enhancement to fetch roles from DB
   */
  filterEndpointsByPermissions(
    endpoints: CreateApiEndpointAny[],
    user: JwtPayloadType,
    platform: Platform,
    logger: EndpointLogger,
  ): CreateApiEndpointAny[] {
    logger.debug("[Permissions Registry] Filtering endpoints by permissions", {
      totalEndpoints: endpoints.length,
      platform,
      isPublic: user.isPublic,
    });

    const filtered = endpoints.filter((endpoint) =>
      this.hasEndpointPermission(endpoint, user, platform),
    );

    logger.debug("[Permissions Registry] Filtered endpoints", {
      totalEndpoints: endpoints.length,
      filteredEndpoints: filtered.length,
    });

    return filtered;
  }

  /**
   * Get available endpoints count by category for user
   */
  getEndpointCountByCategory(
    endpoints: CreateApiEndpointAny[],
    user: JwtPayloadType,
    platform: Platform = Platform.AI,
    logger: EndpointLogger,
  ): Record<string, number> {
    const filtered = this.filterEndpointsByPermissions(
      endpoints,
      user,
      platform,
      logger,
    );
    const counts: Record<string, number> = {};

    for (const endpoint of filtered) {
      const category = endpoint.category;
      if (category) {
        counts[category] = (counts[category] || 0) + 1;
      }
    }

    return counts;
  }

  /**
   * Get available endpoints count by role (PRIVATE - used internally)
   */
  private getEndpointCountByRole(
    endpoints: CreateApiEndpointAny[],
  ): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const endpoint of endpoints) {
      // Safety check: skip if allowedRoles is undefined or not an array
      if (!endpoint?.allowedRoles || !Array.isArray(endpoint.allowedRoles)) {
        continue;
      }

      for (const role of endpoint.allowedRoles) {
        // Only count actual user roles, not opt-out roles
        const roleValue = role as UserRoleValue[number];
        if (!this.isOptOutRole(roleValue)) {
          counts[roleValue] = (counts[roleValue] || 0) + 1;
        }
      }
    }

    return counts;
  }

  /**
   * Check if endpoint allows CLI auth bypass (PRIVATE - used internally)
   */
  private allowsCliAuthBypass(
    platformMarkers: readonly (typeof PlatformMarkerValue)[],
  ): boolean {
    return platformMarkers.includes(PlatformMarker.CLI_AUTH_BYPASS);
  }

  /**
   * Get role priority for permission hierarchy (PRIVATE - used internally)
   */
  private getRolePriority(role: typeof UserPermissionRoleValue): number {
    const priorities: Record<typeof UserPermissionRoleValue, number> = {
      [UserPermissionRole.PUBLIC]: 0,
      [UserPermissionRole.CUSTOMER]: 5,
      [UserPermissionRole.PARTNER_EMPLOYEE]: 20,
      [UserPermissionRole.PARTNER_ADMIN]: 50,
      [UserPermissionRole.ADMIN]: 100,
    };

    return priorities[role];
  }

  /**
   * Check if role A can access role B's resources (PRIVATE - used internally)
   */
  private canAccessRole(
    userRole: typeof UserPermissionRoleValue,
    requiredRole: typeof UserPermissionRoleValue,
  ): boolean {
    // Opt-out roles can't be used for access checks
    if (this.isOptOutRole(requiredRole)) {
      return false;
    }
    const userPriority = this.getRolePriority(userRole);
    const requiredPriority = this.getRolePriority(requiredRole);
    return userPriority >= requiredPriority;
  }

  /**
   * Check if user can execute batch operations (PRIVATE - used internally)
   */
  private canExecuteBatchOperations(user: JwtPayloadType): boolean {
    return !user.isPublic;
  }

  /**
   * Get maximum tools per message for user (PRIVATE - used internally)
   */
  private getMaxToolsPerMessage(user: JwtPayloadType): number {
    if (user.isPublic) {
      return 3; // Limited for public users
    }

    return 10; // Default max tools per request for authenticated users
  }

  /**
   * Get platforms endpoint is available on (PRIVATE - used internally)
   */
  private getAvailablePlatforms(endpoint: CreateApiEndpointAny): Platform[] {
    const platforms: Platform[] = [];

    // Safety check
    if (!endpoint?.allowedRoles || !Array.isArray(endpoint.allowedRoles)) {
      return platforms;
    }

    if (!endpoint.allowedRoles.includes(UserRole.CLI_OFF)) {
      platforms.push(Platform.CLI);
      // CLI_PACKAGE only available for endpoints with CLI_AUTH_BYPASS
      // (unauthenticated endpoints that don't require local auth)
      if (endpoint.allowedRoles.includes(PlatformMarker.CLI_AUTH_BYPASS)) {
        platforms.push(Platform.CLI_PACKAGE);
      }
    }
    if (!endpoint.allowedRoles.includes(UserRole.AI_TOOL_OFF)) {
      platforms.push(Platform.AI);
    }
    if (!endpoint.allowedRoles.includes(UserRole.WEB_OFF)) {
      // WEB_OFF disables all web platforms (TRPC, NEXT_PAGE, NEXT_API)
      platforms.push(Platform.TRPC);
      platforms.push(Platform.NEXT_PAGE);
      platforms.push(Platform.NEXT_API);
    }

    return platforms;
  }

  /**
   * Check if endpoint is opted out of specific platform
   */
  private isEndpointOptedOutOfPlatform(
    endpoint: CreateApiEndpointAny,
    platform: Platform,
  ): boolean {
    // Safety check
    if (!endpoint?.allowedRoles || !Array.isArray(endpoint.allowedRoles)) {
      return false;
    }

    // Check if endpoint is disabled in production environment
    if (
      process.env.NODE_ENV === "production" &&
      endpoint.allowedRoles.includes(UserRole.PRODUCTION_OFF)
    ) {
      return true;
    }

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
  private isOptOutRole(role: UserRoleValue[number]): boolean {
    return (
      role === UserRole.CLI_OFF ||
      role === UserRole.AI_TOOL_OFF ||
      role === UserRole.WEB_OFF ||
      role === UserRole.PRODUCTION_OFF
    );
  }
}

/**
 * Singleton instance
 */
export const permissionsRegistry = new PermissionsRegistry();
