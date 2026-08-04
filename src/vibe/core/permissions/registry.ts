import { VibeMode } from "../../env/env-util";
import type { JwtPayloadType } from "../../identity/auth/types";
import {
  filterPlatformMarkers,
  filterUserPermissionRoles,
  PlatformMarker,
  UserPermissionRole,
  UserRole,
  type UserRoleValue,
} from "../../identity/roles/enum";
import { Platform } from "../../platforms/platforms";
import type { CreateApiEndpointAny } from "../definition/endpoint-base";
import { coreClientEnv as envClient } from "../env-client";
import type { EndpointAccessResult, PlatformAccessResult } from "./types";

interface IPermissionsRegistry {
  validateEndpointAccess(
    endpoint: CreateApiEndpointAny,
    user: JwtPayloadType,
    platform: Platform,
  ): EndpointAccessResult;

  checkPlatformAccess(
    allowedRoles: readonly UserRoleValue[],
    platform: Platform,
  ): PlatformAccessResult;

  checkMcpDiscoveryAccess(
    allowedRoles: readonly UserRoleValue[],
  ): PlatformAccessResult;

  checkRolePermission(
    allowedRoles: readonly UserRoleValue[],
    allowedClientRoles: readonly UserRoleValue[] | undefined,
    user: JwtPayloadType,
    platform: Platform,
  ): boolean;

  filterEndpointsByPermissions(
    endpoints: CreateApiEndpointAny[],
    user: JwtPayloadType,
    platform: Platform,
  ): CreateApiEndpointAny[];

  getAvailablePlatforms(endpoint: CreateApiEndpointAny): Platform[];
}

class PermissionsRegistry implements IPermissionsRegistry {
  checkPlatformAccess(
    allowedRoles: readonly UserRoleValue[],
    platform: Platform,
  ): PlatformAccessResult {
    const platformMarkers = filterPlatformMarkers(allowedRoles);

    if (
      envClient.NODE_ENV === "production" &&
      envClient.NEXT_PUBLIC_VIBE_MODE === VibeMode.CLOUD &&
      platformMarkers.includes(PlatformMarker.PRODUCTION_OFF)
    ) {
      return {
        allowed: false,
        reason: "productionDisabled",
        blockedByRole: PlatformMarker.PRODUCTION_OFF,
      };
    }

    switch (platform) {
      case Platform.CLI:
        if (platformMarkers.includes(PlatformMarker.CLI_OFF)) {
          return {
            allowed: false,
            reason: "platformExcluded",
            blockedByRole: PlatformMarker.CLI_OFF,
          };
        }
        break;

      case Platform.MCP:
        // MCP execution uses opt-out semantics (like CLI/AI).
        // Tool *discovery* uses checkMcpDiscoveryAccess() which enforces MCP_VISIBLE opt-in.
        if (
          platformMarkers.includes(PlatformMarker.MCP_OFF) ||
          platformMarkers.includes(PlatformMarker.CLI_OFF)
        ) {
          return {
            allowed: false,
            reason: "platformExcluded",
            blockedByRole: platformMarkers.includes(PlatformMarker.MCP_OFF)
              ? PlatformMarker.MCP_OFF
              : PlatformMarker.CLI_OFF,
          };
        }
        break;

      case Platform.REMOTE_SKILL:
        if (platformMarkers.includes(PlatformMarker.SKILL_OFF)) {
          return {
            allowed: false,
            reason: "platformExcluded",
            blockedByRole: PlatformMarker.SKILL_OFF,
          };
        }
        break;

      case Platform.CLI_PACKAGE:
        if (platformMarkers.includes(PlatformMarker.CLI_OFF)) {
          return {
            allowed: false,
            reason: "platformExcluded",
            blockedByRole: PlatformMarker.CLI_OFF,
          };
        }
        if (!platformMarkers.includes(PlatformMarker.CLI_AUTH_BYPASS)) {
          return {
            allowed: false,
            reason: "cliPackageAuthRequired",
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
            reason: "platformExcluded",
            blockedByRole: platformMarkers.includes(PlatformMarker.AI_TOOL_OFF)
              ? PlatformMarker.AI_TOOL_OFF
              : PlatformMarker.WEB_OFF,
          };
        }
        break;

      case Platform.CRON:
        // CRON is an internal executor — only blocked by WEB_OFF (truly server-side-only endpoints).
        if (platformMarkers.includes(PlatformMarker.WEB_OFF)) {
          return {
            allowed: false,
            reason: "platformExcluded",
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
            reason: "platformExcluded",
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

  checkMcpDiscoveryAccess(
    allowedRoles: readonly UserRoleValue[],
  ): PlatformAccessResult {
    const platformMarkers = filterPlatformMarkers(allowedRoles);

    if (
      envClient.NODE_ENV === "production" &&
      envClient.NEXT_PUBLIC_VIBE_MODE === VibeMode.CLOUD &&
      platformMarkers.includes(PlatformMarker.PRODUCTION_OFF)
    ) {
      return {
        allowed: false,
        reason: "productionDisabled",
        blockedByRole: PlatformMarker.PRODUCTION_OFF,
      };
    }

    if (!platformMarkers.includes(PlatformMarker.MCP_VISIBLE)) {
      return {
        allowed: false,
        reason: "mcpNotListed",
        blockedByRole: PlatformMarker.MCP_VISIBLE,
      };
    }

    if (
      platformMarkers.includes(PlatformMarker.MCP_OFF) ||
      platformMarkers.includes(PlatformMarker.CLI_OFF)
    ) {
      return {
        allowed: false,
        reason: "platformExcluded",
        blockedByRole: platformMarkers.includes(PlatformMarker.MCP_OFF)
          ? PlatformMarker.MCP_OFF
          : PlatformMarker.CLI_OFF,
      };
    }

    return { allowed: true };
  }

  validateEndpointAccess(
    endpoint: CreateApiEndpointAny,
    user: JwtPayloadType,
    platform: Platform,
  ): EndpointAccessResult {
    if (!endpoint.allowedRoles || !Array.isArray(endpoint.allowedRoles)) {
      return { allowed: false, denial: { cause: "allowedRolesMissing" } };
    }

    const platformAccess = this.checkPlatformAccess(
      endpoint.allowedRoles,
      platform,
    );
    if (!platformAccess.allowed) {
      return {
        allowed: false,
        denial: {
          cause: "platformDenied",
          platform,
          reason: platformAccess.reason ?? "platformExcluded",
        },
      };
    }

    const hasPermission = this.checkRolePermission(
      endpoint.allowedRoles,
      endpoint.allowedClientRoles,
      user,
      platform,
    );
    if (!hasPermission) {
      return {
        allowed: false,
        denial: {
          cause: "insufficientRoles",
          userId: user.isPublic ? null : user.id,
          requiredRoles: endpoint.allowedRoles,
          userRoles: user.roles ?? [],
        },
      };
    }

    return { allowed: true };
  }

  checkRolePermission(
    allowedRoles: readonly UserRoleValue[],
    allowedClientRoles: readonly UserRoleValue[] | undefined,
    user: JwtPayloadType,
    platform: Platform,
  ): boolean {
    if (this.isOptedOutOfPlatform(allowedRoles, platform)) {
      return false;
    }

    const platformMarkers = filterPlatformMarkers(allowedRoles);
    if (
      platform === Platform.CLI_PACKAGE &&
      platformMarkers.includes(PlatformMarker.CLI_AUTH_BYPASS)
    ) {
      return true;
    }

    const effectiveAllowedRoles = allowedRoles.filter(
      (role: UserRoleValue[number]) => !this.isOptOutRole(role),
    );

    const permissionRoles = filterUserPermissionRoles(effectiveAllowedRoles);

    // PUBLIC-only endpoint: accessible by every caller (signed-in users included)
    if (
      permissionRoles.length === 1 &&
      permissionRoles.includes(UserPermissionRole.PUBLIC)
    ) {
      return true;
    }

    if (user.isPublic && permissionRoles.includes(UserPermissionRole.PUBLIC)) {
      return true;
    }

    const userRoles: readonly UserRoleValue[] = user.roles;
    const hasRequiredRole = effectiveAllowedRoles.some((requiredRole) =>
      userRoles.includes(requiredRole),
    );

    if (!hasRequiredRole && allowedClientRoles) {
      const effectiveClientRoles = allowedClientRoles.filter(
        (role: UserRoleValue[number]) => !this.isOptOutRole(role),
      );
      const clientPermissionRoles =
        filterUserPermissionRoles(effectiveClientRoles);

      if (
        user.isPublic &&
        clientPermissionRoles.includes(UserPermissionRole.PUBLIC)
      ) {
        return true;
      }

      return effectiveClientRoles.some((requiredRole) =>
        userRoles.includes(requiredRole),
      );
    }

    return hasRequiredRole;
  }

  filterEndpointsByPermissions(
    endpoints: CreateApiEndpointAny[],
    user: JwtPayloadType,
    platform: Platform,
  ): CreateApiEndpointAny[] {
    return endpoints.filter((endpoint) =>
      endpoint.allowedRoles && Array.isArray(endpoint.allowedRoles)
        ? this.checkRolePermission(
            endpoint.allowedRoles,
            endpoint.allowedClientRoles,
            user,
            platform,
          )
        : false,
    );
  }

  getAvailablePlatforms(endpoint: CreateApiEndpointAny): Platform[] {
    const platforms: Platform[] = [];

    if (!endpoint?.allowedRoles || !Array.isArray(endpoint.allowedRoles)) {
      return platforms;
    }

    if (!endpoint.allowedRoles.includes(UserRole.CLI_OFF)) {
      platforms.push(Platform.CLI);
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
      platforms.push(Platform.TRPC);
      platforms.push(Platform.NEXT_PAGE);
      platforms.push(Platform.NEXT_API);
    }

    return platforms;
  }

  private isOptedOutOfPlatform(
    allowedRoles: readonly UserRoleValue[],
    platform: Platform,
  ): boolean {
    if (
      envClient.NODE_ENV === "production" &&
      envClient.NEXT_PUBLIC_VIBE_MODE === VibeMode.CLOUD &&
      allowedRoles.includes(UserRole.PRODUCTION_OFF)
    ) {
      return true;
    }

    const platformStr = String(platform).toLowerCase();

    switch (platformStr) {
      case "cli":
      case "cli-package":
        return allowedRoles.includes(UserRole.CLI_OFF);
      case "mcp":
        return (
          allowedRoles.includes(UserRole.MCP_OFF) ||
          allowedRoles.includes(UserRole.CLI_OFF)
        );
      case "ai":
        return allowedRoles.includes(UserRole.AI_TOOL_OFF);
      // NOTE: no Platform value stringifies to "web" — web platforms are
      // "trpc" / "next-page" / "next-api" / "electron" / "frame". This case
      // is unreachable; checkPlatformAccess enforces WEB_OFF correctly.
      case "web":
        return allowedRoles.includes(UserRole.WEB_OFF);
      default:
        return false;
    }
  }

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

export const permissionsRegistry = new PermissionsRegistry();
