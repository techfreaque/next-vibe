import "server-only";

import { endpointToToolName } from "next-vibe/core/core-utils/path";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { Methods } from "next-vibe/core/definition/enums";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { scopedTranslation } from "next-vibe/core/i18n/shared";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
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
import type { EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";

import { pathToAliasMap } from "@/generated/endpoints/alias-map";
import { getEndpoint } from "@/generated/endpoints/endpoint";

export interface SerializableToolMetadata {
  name: string;
  method: Methods;
  title: string;
  description: string;
  category: string;
  tags: string[];
  toolName: string;
  allowedRoles: UserRoleValue[];
  aliases?: string[];
  requiresConfirmation?: boolean;
  /** Credit cost for this endpoint (only present when > 0) */
  credits?: number;
  /** Raw examples from the endpoint definition (requests + urlPathParams merged, responses keyed by example name) */
  examples?: {
    /** Merged request data + url path params - what the caller passes as flat args */
    inputs?: Record<string, Record<string, WidgetData>>;
    responses?: Record<string, Record<string, WidgetData>>;
  };
}

export interface IDefinitionsRegistry {
  getEndpointsForUser(
    platform: Platform,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<CreateApiEndpointAny[]>;

  getEndpointCountByCategory(
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<Record<string, number>>;

  getSerializedToolsForUser(
    platform: Platform,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<SerializableToolMetadata[]>;
}

const TOOLS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface ToolsCacheEntry {
  data: SerializableToolMetadata[];
  expiresAt: number;
}

/** All definitions loaded once at first call, then cached permanently. */
let allDefinitionsCache: CreateApiEndpointAny[] | null = null;

async function loadAllDefinitions(
  logger: EndpointLogger,
): Promise<CreateApiEndpointAny[]> {
  if (allDefinitionsCache !== null) {
    return allDefinitionsCache;
  }

  // Collect unique canonical paths (values in pathToAliasMap are canonical)
  const canonical = new Set(Object.values(pathToAliasMap));

  const results = await Promise.all(
    [...canonical].map((path) => getEndpointWithRetry(path, logger)),
  );

  allDefinitionsCache = results.filter(
    (d): d is CreateApiEndpointAny => d !== null,
  );
  return allDefinitionsCache;
}

// dynamic imports may throw "Cannot access 'X' before initialization"
// on first load. Retry once with a short yield to let the module settle.
async function getEndpointWithRetry(
  path: string,
  logger: EndpointLogger,
): Promise<CreateApiEndpointAny | null> {
  try {
    return await getEndpoint(path);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("before initialization")) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
      try {
        return await getEndpoint(path);
      } catch (retryError) {
        logger.error(
          "[registry] Failed to load endpoint",
          parseError(retryError),
          path,
        );
        return null;
      }
    }
    logger.error("[registry] Failed to load endpoint", parseError(error), path);
    return null;
  }
}

export class DefinitionsRegistry implements IDefinitionsRegistry {
  private toolsCache = new Map<string, ToolsCacheEntry>();

  private getToolsCacheKey(
    platform: Platform,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): string {
    const roles = user.isPublic ? "public" : user.roles.toSorted().join(",");
    return `${platform}:${locale}:${roles}`;
  }

  private async getAllForPlatform(
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<CreateApiEndpointAny[]> {
    const all = await loadAllDefinitions(logger);
    return all.filter((definition) => {
      if (!definition.allowedRoles) {
        return true;
      }
      return permissionsRegistry.checkPlatformAccess(
        definition.allowedRoles,
        platform,
      ).allowed;
    });
  }

  async getEndpointsForUser(
    platform: Platform,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<CreateApiEndpointAny[]> {
    const discovered = await this.getAllForPlatform(platform, logger);
    return permissionsRegistry.filterEndpointsByPermissions(
      discovered,
      user,
      platform,
    );
  }

  async getEndpointCountByCategory(
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<Record<string, number>> {
    const allEndpoints = await this.getAllForPlatform(platform, logger);
    const counts: Record<string, number> = {};
    for (const endpoint of allEndpoints) {
      const category = endpoint.category;
      counts[category] = (counts[category] ?? 0) + 1;
    }
    return counts;
  }

  private static mergeExampleInputs(
    requests: Record<string, Record<string, WidgetData>> | undefined,
    urlPathParams: Record<string, Record<string, WidgetData>> | undefined,
  ): Record<string, Record<string, WidgetData>> | undefined {
    if (!requests && !urlPathParams) {
      return undefined;
    }
    const keys = new Set([
      ...Object.keys(requests ?? {}),
      ...Object.keys(urlPathParams ?? {}),
    ]);
    const merged: Record<string, Record<string, WidgetData>> = {};
    for (const key of keys) {
      merged[key] = {
        ...(requests?.[key] ?? {}),
        ...(urlPathParams?.[key] ?? {}),
      };
    }
    return merged;
  }

  private serializeEndpoints(
    endpoints: CreateApiEndpointAny[],
    locale: CountryLanguage,
  ): SerializableToolMetadata[] {
    return endpoints.map((definition) => {
      const { t } = definition.scopedTranslation.scopedT(locale);
      const method = definition.method;
      const toolName = endpointToToolName(definition);

      return {
        name: toolName,
        method,
        title: t(definition.title),
        description: t(definition.description),
        category: definition.category,
        tags: definition.tags.map((tag) => t(tag)),
        toolName,
        allowedRoles: definition.allowedRoles
          ? [...definition.allowedRoles]
          : [],
        aliases: definition.aliases ? [...definition.aliases] : undefined,
        requiresConfirmation: definition.requiresConfirmation,
        ...(definition.credits && definition.credits > 0
          ? { credits: definition.credits }
          : {}),
        examples: definition.examples
          ? {
              inputs: DefinitionsRegistry.mergeExampleInputs(
                definition.examples.requests as
                  | Record<string, Record<string, WidgetData>>
                  | undefined,
                definition.examples.urlPathParams as
                  | Record<string, Record<string, WidgetData>>
                  | undefined,
              ),
              responses: definition.examples.responses as
                | Record<string, Record<string, WidgetData>>
                | undefined,
            }
          : undefined,
      };
    });
  }

  async getSerializedToolsForUser(
    platform: Platform,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<SerializableToolMetadata[]> {
    const cacheKey = this.getToolsCacheKey(platform, user, locale);
    const cached = this.toolsCache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    // Evict all expired entries before writing a new one
    for (const [key, entry] of this.toolsCache) {
      if (entry.expiresAt <= now) {
        this.toolsCache.delete(key);
      }
    }

    const filteredEndpoints = await this.getEndpointsForUser(
      platform,
      user,
      logger,
    );
    const result = this.serializeEndpoints(filteredEndpoints, locale);

    this.toolsCache.set(cacheKey, {
      data: result,
      expiresAt: now + TOOLS_CACHE_TTL_MS,
    });
    return result;
  }
}

export const definitionsRegistry = new DefinitionsRegistry();

// ============================================================================
// PERMISSIONS REGISTRY
// ----------------------------------------------------------------------------
// Merged here from core/permissions/registry.ts. It previously existed TWICE —
// core/permissions/registry.ts (client-safe, envClient + NEXT_PUBLIC_LOCAL_MODE)
// and identity/roles/registry.ts (server-only coreEnv, no LOCAL_MODE escape) —
// two drifted copies of the same class, each exporting `permissionsRegistry`.
//
// The client-safe implementation is the one kept: NEXT_PUBLIC_LOCAL_MODE is a
// live feature (25 files) and `coreEnv` is server-only, which the other copy
// dragged into client-reachable callers (core/definition/loader.ts).
//
// It lives next to DefinitionsRegistry because that was already its only real
// consumer for endpoint filtering — the two registries answer the same question
// ("may this user reach this endpoint on this platform?") from one place.
// ============================================================================
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
   * Check whether a user may access an endpoint described only by its roles.
   * Same rules as the endpoint-based check, for callers that hold generated meta
   * rather than a full definition.
   */
  checkRolePermission(
    allowedRoles: readonly UserRoleValue[],
    allowedClientRoles: readonly UserRoleValue[] | undefined,
    user: JwtPayloadType,
    platform: Platform,
  ): boolean;

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
      envClient.NODE_ENV === "production" &&
      !envClient.NEXT_PUBLIC_LOCAL_MODE &&
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
      envClient.NODE_ENV === "production" &&
      !envClient.NEXT_PUBLIC_LOCAL_MODE &&
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

    return this.checkRolePermission(
      endpoint.allowedRoles,
      endpoint.allowedClientRoles,
      user,
      platform,
    );
  }

  /**
   * Canonical role check, expressed over exactly the fields it reads:
   * allowedRoles + allowedClientRoles + user + platform. No endpoint needed, so
   * callers holding only generated meta (help-tool, agent/chat) use this directly
   * instead of re-implementing the rules against stringly-typed role arrays.
   */
  checkRolePermission(
    allowedRoles: readonly UserRoleValue[],
    allowedClientRoles: readonly UserRoleValue[] | undefined,
    user: JwtPayloadType,
    platform: Platform,
  ): boolean {
    // Check platform opt-out first
    if (this.isOptedOutOfPlatform(allowedRoles, platform)) {
      return false;
    }

    // Check for CLI auth bypass - only bypasses role check for CLI_PACKAGE platform
    const platformMarkers = filterPlatformMarkers(allowedRoles);
    if (
      platform === Platform.CLI_PACKAGE &&
      this.allowsCliAuthBypass(platformMarkers)
    ) {
      return true;
    }

    // Filter out opt-out roles from allowed roles for permission check
    const effectiveAllowedRoles = allowedRoles.filter(
      (role: UserRoleValue[number]) => !this.isOptOutRole(role),
    );

    // Extract user permission roles from effective allowed roles
    const permissionRoles = filterUserPermissionRoles(effectiveAllowedRoles);

    // An endpoint whose only permission role is PUBLIC is reachable by every caller.
    // AuthRepository.authenticate downgrades an authenticated caller to a public user
    // for exactly this case (onlyPublicAllowed), so at execution time `user` is always
    // already public here and this returns what the isPublic branch below would.
    // Discovery callers (help-tool) pass the real, undowngraded user, and need the
    // same answer - otherwise public tools disappear from listings for signed-in users.
    if (
      permissionRoles.length === 1 &&
      permissionRoles.includes(UserPermissionRole.PUBLIC)
    ) {
      return true;
    }

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
    if (!hasRequiredRole && allowedClientRoles) {
      const effectiveClientRoles = allowedClientRoles.filter(
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

    return this.isOptedOutOfPlatform(endpoint.allowedRoles, platform);
  }

  /** Roles-based form of isEndpointOptedOutOfPlatform. */
  private isOptedOutOfPlatform(
    allowedRoles: readonly UserRoleValue[],
    platform: Platform,
  ): boolean {
    // Check if endpoint is disabled in production environment
    // Skip when local mode is active (NEXT_PUBLIC_LOCAL_MODE=true)
    if (
      process.env.NODE_ENV === "production" &&
      !envClient.NEXT_PUBLIC_LOCAL_MODE &&
      allowedRoles.includes(UserRole.PRODUCTION_OFF)
    ) {
      return true;
    }

    // Normalize platform to lowercase string
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
      // NOTE: no Platform value stringifies to "web" (the web platforms are
      // "trpc" / "next-page" / "next-api" / "electron" / "frame"), so this case is
      // unreachable and WEB_OFF is not enforced here. Every execution path also runs
      // checkPlatformAccess, which does enforce it correctly, so this is not
      // exploitable today; kept as-is rather than silently changing an auth result.
      case "web":
        return allowedRoles.includes(UserRole.WEB_OFF);
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
