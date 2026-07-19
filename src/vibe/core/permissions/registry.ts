/**
 * Permissions Registry
 * Single source for ALL permission and access control logic
 * Consolidates platform access, user role checks, and endpoint filtering
 * Used by all adapters (definitions, definition, route-execution)
 */

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { scopedTranslation } from "next-vibe/core/i18n/shared";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import {
  filterPlatformMarkers,
  filterUserPermissionRoles,
  PlatformMarker,
  type PlatformMarkerValue,
  UserPermissionRole,
  UserRole,
  type UserRoleValue,
} from "next-vibe/identity/roles/enum";
import { scopedTranslation as userRolesScopedTranslation } from "next-vibe/identity/roles/i18n";
import { Platform } from "next-vibe/platforms/platforms";

/**
 * Platform access check result
 */
interface PlatformAccessResult {
  allowed: boolean;
  reason?: string;
  blockedByRole?: UserRoleValue;
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
    locale: CountryLanguage,
  ): ResponseType<true>;

  // === Endpoint Discovery & Filtering ===
  /**
   * Check if endpoint is accessible on platform for *execution* (used by definitions registry
   * for non-MCP platforms, and by validateEndpointAccess).
   * For MCP, use checkMcpDiscoveryAccess for tool listing.
   */
  checkPlatformAccess(
    allowedRoles: readonly UserRoleValue[],
    platform: Platform,
  ): PlatformAccessResult;

  /**
   * Check if endpoint should appear in the MCP server's tool discovery list.
   * MCP discovery is opt-in: requires MCP_VISIBLE marker and must not have CLI_OFF or MCP_OFF.
   */
  checkMcpDiscoveryAccess(
    allowedRoles: readonly UserRoleValue[],
  ): PlatformAccessResult;

  /**
   * Filter endpoints by user permissions (used by definitions, MCP, AI)
   */
  filterEndpointsByPermissions(
    endpoints: CreateApiEndpointAny[],
    user: JwtPayloadType,
    platform: Platform,
  ): CreateApiEndpointAny[];

  /**
   * Get platforms an endpoint is available on
   */
  getAvailablePlatforms(endpoint: CreateApiEndpointAny): Platform[];
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
    // Skip when local mode is active (NEXT_PUBLIC_LOCAL_MODE=true)
    if (
      process.env["NODE_ENV"] === "production" &&
      process.env["NEXT_PUBLIC_LOCAL_MODE"] !== "true" &&
      platformMarkers.includes(PlatformMarker.PRODUCTION_OFF)
    ) {
      return {
        allowed: false,
        reason: "Endpoint is disabled in production environment",
        blockedByRole: PlatformMarker.PRODUCTION_OFF,
      };
    }

    switch (platform) {
      case Platform.CLI:
        if (platformMarkers.includes(PlatformMarker.CLI_OFF)) {
          return {
            allowed: false,
            reason: `Endpoint is not accessible via ${Platform.CLI} platform`,
            blockedByRole: PlatformMarker.CLI_OFF,
          };
        }
        break;

      case Platform.MCP:
        // MCP execution uses opt-out semantics (like CLI/AI):
        // blocked by MCP_OFF or CLI_OFF, otherwise accessible.
        // Tool *discovery* (which tools appear in the MCP server list) uses the separate
        // checkMcpDiscoveryAccess() which enforces MCP_VISIBLE opt-in.
        if (
          platformMarkers.includes(PlatformMarker.MCP_OFF) ||
          platformMarkers.includes(PlatformMarker.CLI_OFF)
        ) {
          return {
            allowed: false,
            reason: `Endpoint is not accessible via ${Platform.MCP} platform`,
            blockedByRole: platformMarkers.includes(PlatformMarker.MCP_OFF)
              ? PlatformMarker.MCP_OFF
              : PlatformMarker.CLI_OFF,
          };
        }
        break;

      case Platform.REMOTE_SKILL:
        // REMOTE_SKILL uses opt-out model: all endpoints are accessible unless SKILL_OFF is set
        // These endpoints appear in AI-ready skill markdown files (AGENT.md, PUBLIC_USER_SKILL.md, etc.)
        if (platformMarkers.includes(PlatformMarker.SKILL_OFF)) {
          return {
            allowed: false,
            reason: `Endpoint is excluded from ${Platform.REMOTE_SKILL} platform (has SKILL_OFF marker)`,
            blockedByRole: PlatformMarker.SKILL_OFF,
          };
        }
        break;

      case Platform.CLI_PACKAGE:
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
            reason:
              "Endpoint requires authentication which is not available in CLI_PACKAGE mode",
            blockedByRole: PlatformMarker.CLI_AUTH_BYPASS,
          };
        }
        break;

      case Platform.AI:
        if (
          platformMarkers.includes(PlatformMarker.AI_TOOL_OFF) ||
          platformMarkers.includes(PlatformMarker.WEB_OFF)
        ) {
          return {
            allowed: false,
            reason: "Endpoint is not accessible via AI tools",
            blockedByRole: platformMarkers.includes(PlatformMarker.AI_TOOL_OFF)
              ? PlatformMarker.AI_TOOL_OFF
              : PlatformMarker.WEB_OFF,
          };
        }
        break;

      case Platform.CRON:
        // CRON is an internal executor - not blocked by AI_TOOL_OFF (which only prevents
        // AI tool exposure). Only block if WEB_OFF is set (truly server-side-only endpoints).
        if (platformMarkers.includes(PlatformMarker.WEB_OFF)) {
          return {
            allowed: false,
            reason: "Endpoint is not accessible via cron platform",
            blockedByRole: PlatformMarker.WEB_OFF,
          };
        }
        break;

      case Platform.NEXT_PAGE:
      case Platform.NEXT_API:
      case Platform.TRPC:
      case Platform.ELECTRON:
      case Platform.FRAME:
        if (platformMarkers.includes(PlatformMarker.WEB_OFF)) {
          return {
            allowed: false,
            reason: "Endpoint is not accessible via Web platform",
            blockedByRole: PlatformMarker.WEB_OFF,
          };
        }
        break;
      default: {
        const _exhaustiveCheck: never = platform;
        void _exhaustiveCheck;
        break;
      }
    }

    return { allowed: true };
  }

  /**
   * Check if endpoint should appear in the MCP server's tool discovery list.
   * Opt-in: requires MCP_VISIBLE, and must not have CLI_OFF or MCP_OFF.
   */
  checkMcpDiscoveryAccess(
    allowedRoles: readonly UserRoleValue[],
  ): PlatformAccessResult {
    const platformMarkers = filterPlatformMarkers(allowedRoles);

    if (
      process.env["NODE_ENV"] === "production" &&
      process.env["NEXT_PUBLIC_LOCAL_MODE"] !== "true" &&
      platformMarkers.includes(PlatformMarker.PRODUCTION_OFF)
    ) {
      return {
        allowed: false,
        reason: "Endpoint is disabled in production environment",
        blockedByRole: PlatformMarker.PRODUCTION_OFF,
      };
    }

    if (!platformMarkers.includes(PlatformMarker.MCP_VISIBLE)) {
      return {
        allowed: false,
        reason: "Endpoint is not listed on MCP (requires MCP_VISIBLE marker)",
        blockedByRole: PlatformMarker.MCP_VISIBLE,
      };
    }

    if (
      platformMarkers.includes(PlatformMarker.MCP_OFF) ||
      platformMarkers.includes(PlatformMarker.CLI_OFF)
    ) {
      return {
        allowed: false,
        reason: "Endpoint is explicitly excluded from MCP",
        blockedByRole: platformMarkers.includes(PlatformMarker.MCP_OFF)
          ? PlatformMarker.MCP_OFF
          : PlatformMarker.CLI_OFF,
      };
    }

    return { allowed: true };
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
    locale: CountryLanguage,
  ): ResponseType<true> {
    // Safety check: if allowedRoles is undefined or not an array, deny access
    if (!endpoint.allowedRoles || !Array.isArray(endpoint.allowedRoles)) {
      const { t } = scopedTranslation.scopedT(locale);
      return {
        success: false,
        message: t("shared.permissions.errors.definitionError"),
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
        message: scopedTranslation
          .scopedT(locale)
          .t("shared.permissions.errors.platformAccessDenied", {
            platform: String(platform),
            reason: platformAccess.reason || "Platform not allowed",
          }),
        errorType: ErrorResponseTypes.FORBIDDEN,
      };
    }

    // 2. Check user permissions
    const hasPermission = this.hasEndpointPermission(endpoint, user, platform);
    if (!hasPermission) {
      const { t: tRoles } = userRolesScopedTranslation.scopedT(locale);
      return {
        success: false,
        message: scopedTranslation
          .scopedT(locale)
          .t("shared.permissions.errors.insufficientRoles", {
            userId: user.isPublic ? "public" : user.id,
            requiredRoles: endpoint.allowedRoles
              .map((role) => tRoles(role))
              .join(", "),
            userRoles: user.roles?.length
              ? user.roles.map((role) => tRoles(role)).join(", ")
              : "none",
          }),
        errorType: ErrorResponseTypes.FORBIDDEN,
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
   * - Also checks allowedClientRoles for client-side access
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

    // Check for CLI auth bypass - only bypasses role check for CLI_PACKAGE platform
    const platformMarkers = filterPlatformMarkers(endpoint.allowedRoles);
    if (
      platform === Platform.CLI_PACKAGE &&
      this.allowsCliAuthBypass(platformMarkers)
    ) {
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
    const userRoles: readonly UserRoleValue[] = user.roles;

    const hasRequiredRole = effectiveAllowedRoles.some((requiredRole) =>
      userRoles.includes(requiredRole),
    );

    // If server route permission failed, check if user has permission via client route
    if (!hasRequiredRole && endpoint.allowedClientRoles) {
      const effectiveClientRoles = endpoint.allowedClientRoles.filter(
        (role: UserRoleValue[number]) => !this.isOptOutRole(role),
      );
      const clientPermissionRoles =
        filterUserPermissionRoles(effectiveClientRoles);

      // Check PUBLIC role for client routes
      if (
        user.isPublic &&
        clientPermissionRoles.includes(UserPermissionRole.PUBLIC)
      ) {
        return true;
      }

      // Check if user has any of the required client roles
      return effectiveClientRoles.some((requiredRole) =>
        userRoles.includes(requiredRole),
      );
    }

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
  ): CreateApiEndpointAny[] {
    const filtered = endpoints.filter((endpoint) =>
      this.hasEndpointPermission(endpoint, user, platform),
    );

    return filtered;
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
   * Get platforms endpoint is available on
   */
  getAvailablePlatforms(endpoint: CreateApiEndpointAny): Platform[] {
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
    if (
      !endpoint.allowedRoles.includes(UserRole.MCP_OFF) &&
      !endpoint.allowedRoles.includes(UserRole.CLI_OFF)
    ) {
      platforms.push(Platform.MCP);
    }
    if (!endpoint.allowedRoles.includes(UserRole.AI_TOOL_OFF)) {
      platforms.push(Platform.AI);
    }
    if (!endpoint.allowedRoles.includes(PlatformMarker.SKILL_OFF)) {
      platforms.push(Platform.REMOTE_SKILL);
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
    // Skip when local mode is active (NEXT_PUBLIC_LOCAL_MODE=true)
    if (
      process.env["NODE_ENV"] === "production" &&
      process.env["NEXT_PUBLIC_LOCAL_MODE"] !== "true" &&
      endpoint.allowedRoles.includes(UserRole.PRODUCTION_OFF)
    ) {
      return true;
    }

    // Normalize platform to lowercase string
    const platformStr = String(platform).toLowerCase();

    switch (platformStr) {
      case "cli":
      case "cli-package":
        return endpoint.allowedRoles.includes(UserRole.CLI_OFF);
      case "mcp":
        return (
          endpoint.allowedRoles.includes(UserRole.MCP_OFF) ||
          endpoint.allowedRoles.includes(UserRole.CLI_OFF)
        );
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
      role === UserRole.MCP_OFF ||
      role === UserRole.PRODUCTION_OFF
    );
  }
}

/**
 * Singleton instance
 */
export const permissionsRegistry = new PermissionsRegistry();
