/**
 * Platform Access Control
 * Unified, platform-agnostic access control for all platforms (CLI, Web, AI, MCP, Mobile)
 * Enforces _OFF suffixes and role-based access control
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";

import {
  PlatformMarker,
  UserPermissionRole,
  type UserRoleValue,
  type UserPermissionRoleValue,
  type PlatformMarkerValue,
  filterUserPermissionRoles,
  filterPlatformMarkers,
} from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { env } from "@/config/env";

import type { Platform } from "../../types/platform";
import type { EndpointLogger } from "../../logger/endpoint";
import type { InferJwtPayloadTypeFromRoles } from "../../types/handler";

/**
 * Platform access check result
 */
export interface PlatformAccessResult {
  allowed: boolean;
  reason?: string;
  blockedByRole?: UserRoleValue;
}

/**
 * User role check result
 */
export interface UserRoleCheckResult {
  allowed: boolean;
  reason?: string;
  userRoles?: readonly (typeof UserPermissionRoleValue)[];
  requiredRoles?: readonly (typeof UserPermissionRoleValue)[];
}

/**
 * Unified Platform Access Checker
 * Handles all platform-specific access control logic
 * Uses clean separation between platform markers and user permission roles
 */
export class PlatformAccessChecker {
  /**
   * Check if endpoint is accessible on the given platform
   * Enforces _OFF platform markers for platform exclusion
   *
   * @param platformMarkers - Platform access markers from endpoint definition
   * @param platform - Current platform (cli, web, ai, mcp, mobile)
   * @returns Whether the endpoint is accessible on this platform
   */
  checkPlatformAccess(
    platformMarkers: readonly (typeof PlatformMarkerValue)[],
    platform: Platform | string,
  ): PlatformAccessResult {
    // Check production environment restrictions
    if (
      env.NODE_ENV === "production" &&
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
   * Only checks actual user permission roles (not platform markers)
   *
   * @param user - JWT payload with user info
   * @param permissionRoles - User permission roles from endpoint definition (already filtered)
   * @param userRoles - User's actual roles from database
   * @returns Whether user has permission
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
   * Check if endpoint allows CLI auth bypass
   * Commands with CLI_AUTH_BYPASS can run without authenticated user
   *
   * @param platformMarkers - Platform markers from endpoint definition
   * @returns Whether CLI auth bypass is allowed
   */
  allowsCliAuthBypass(
    platformMarkers: readonly (typeof PlatformMarkerValue)[],
  ): boolean {
    return platformMarkers.includes(PlatformMarker.CLI_AUTH_BYPASS);
  }

  /**
   * Get role priority for permission hierarchy
   * Higher number = more privileged
   * Only applies to user permission roles (not platform markers)
   */
  getRolePriority(role: typeof UserPermissionRoleValue): number {
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
   * Full access check combining platform and user role checks
   * Uses clean separation between platform markers and user permission roles
   *
   * @param allowedRoles - Endpoint's allowed roles (mixed permission roles and platform markers)
   * @param platform - Current platform
   * @param user - User JWT payload
   * @param userRoles - User's database roles (only permission roles)
   * @param logger - Logger for debugging
   * @returns ResponseType with success or error
   */
  async checkFullAccess(
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
    const platformAccess = this.checkPlatformAccess(platformMarkers, platform);
    if (!platformAccess.allowed) {
      logger.warn("Platform access denied", {
        platform,
        reason: platformAccess.reason,
        blockedByRole: platformAccess.blockedByRole,
      });

      return {
        success: false,
        message:
          "app.api.v1.core.system.unifiedInterface.shared.permissions.errors.platformAccessDenied",
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
        userRoles: roleAccess.userRoles ? (roleAccess.userRoles as string[]).join(", ") : undefined,
        requiredRoles: roleAccess.requiredRoles ? (roleAccess.requiredRoles as string[]).join(", ") : undefined,
      });

      return {
        success: false,
        message:
          "app.api.v1.core.system.unifiedInterface.shared.permissions.errors.insufficientRoles",
        errorType: ErrorResponseTypes.FORBIDDEN,
        messageParams: {
          userRoles: (roleAccess.userRoles || []).join(", ") || "none",
          requiredRoles: (roleAccess.requiredRoles || []).join(", "),
        },
      };
    }

    return { success: true, data: true };
  }
}

// Singleton instance for use across the application
export const platformAccessChecker = new PlatformAccessChecker();
