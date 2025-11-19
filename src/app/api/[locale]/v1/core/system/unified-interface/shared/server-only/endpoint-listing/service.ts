/**
 * Unified Endpoint Listing Service
 * Provides a single source of truth for discovering and listing endpoints
 * Used by CLI help, AI tools, MCP tools, and platform access control
 */

import "server-only";

import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import {
  filterPlatformMarkers,
  type UserRoleValue,
} from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../../logger/endpoint";
import { endpoints } from "@/app/api/[locale]/v1/core/system/generated/endpoints";
import { platformAccessChecker } from "../permissions/platform-access";
import { toolFilter } from "../permissions/filter";
import type { Platform } from "../../types/platform";
import type { DiscoveredEndpoint } from "../types/registry";
import type { TranslationKey } from "@/i18n/core/static-types";
import type { ApiSection, CreateApiEndpointAny } from "../../types/endpoint";
import { ALL_METHODS, type Methods } from "../../types/enums";

/**
 * Unified endpoint metadata
 * Common structure used across all platforms
 */
export interface UnifiedEndpointMetadata {
  /** Endpoint unique identifier (e.g., "get_v1_core_system_help") */
  id: string;

  /** Tool/command name (e.g., "core_system_help" or "system:help") */
  name: string;

  /** HTTP method */
  method: string;

  /** API path (e.g., "/v1/core/system/help") */
  path: string;

  /** Route path (e.g., "core/system/help") */
  routePath: string;

  /** Human-readable description (translated) */
  description: string;

  /** Category (translated) */
  category: string;

  /** Tags (translated) */
  tags: string[];

  /** Allowed roles */
  allowedRoles: readonly UserRoleValue[];

  /** Command aliases */
  aliases?: string[];

  /** Whether endpoint is enabled */
  enabled: boolean;

  /** Original discovered endpoint (for advanced use cases) */
  _rawEndpoint?: DiscoveredEndpoint;
}

/**
 * Endpoint listing options
 */
export interface EndpointListingOptions {
  /** Locale for translations */
  locale: CountryLanguage;

  /** Filter by category */
  category?: string;

  /** Filter by user permissions */
  user?: JwtPayloadType;

  /** Filter by platform (applies platform access control) */
  platform?: Platform;

  /** Include raw endpoint data */
  includeRaw?: boolean;

  /** Custom filter function */
  filter?: (endpoint: DiscoveredEndpoint) => boolean;

  /** Apply permission filtering (default: false) */
  filterByPermissions?: boolean;
}

/**
 * Unified Endpoint Listing Service
 */
export class EndpointListingService {
  /**
   * Discover all endpoints from generated endpoints index
   * Returns unified metadata format
   */
  discoverEndpoints(
    logger: EndpointLogger,
    options: EndpointListingOptions,
  ): UnifiedEndpointMetadata[] {
    const { t } = simpleT(options.locale);
    const result: UnifiedEndpointMetadata[] = [];

    logger.debug("Discovering endpoints from generated index", {
      category: options.category,
      locale: options.locale,
      platform: options.platform,
    });

    // Walk the endpoints tree structure
    this.walkEndpoints(endpoints, [], result, t, options);

    // Apply filters
    const filtered = this.applyFilters(result, options, logger);

    logger.debug("Endpoint discovery completed", {
      totalEndpoints: filtered.length,
      filtered: filtered.length !== result.length,
    });

    return filtered;
  }

  /**
   * Apply all filters to endpoint list
   */
  private applyFilters(
    endpoints: UnifiedEndpointMetadata[],
    options: EndpointListingOptions,
    logger: EndpointLogger,
  ): UnifiedEndpointMetadata[] {
    let result = endpoints;

    // Platform access control
    if (options.platform) {
      const beforeCount = result.length;
      result = result.filter((ep) => {
        const platformMarkers = filterPlatformMarkers(ep.allowedRoles);
        const platformAccess = platformAccessChecker.checkPlatformAccess(
          platformMarkers,
          options.platform!,
        );
        return platformAccess.allowed;
      });

      logger.debug("Applied platform access control", {
        platform: options.platform,
        beforeFilter: beforeCount,
        afterFilter: result.length,
      });
    }

    // User permission filtering
    if (options.filterByPermissions && options.user && options.includeRaw) {
      result = result.filter((ep) => {
        if (!ep._rawEndpoint) {
          return false;
        }
        return toolFilter.hasEndpointPermission(
          ep._rawEndpoint,
          options.user!,
          options.platform,
        );
      });

      logger.debug("Applied user permission filtering", {
        userId: options.user.isPublic ? "public" : options.user.id,
        afterFilter: result.length,
      });
    }

    // Category filter
    if (options.category) {
      result = result.filter((ep) =>
        ep.category?.toLowerCase().includes(options.category!.toLowerCase()),
      );
    }

    // Custom filter
    if (options.filter && options.includeRaw) {
      result = result.filter(
        (ep) => ep._rawEndpoint && options.filter!(ep._rawEndpoint),
      );
    }

    return result;
  }

  /**
   * Recursively walk endpoints tree and extract metadata
   */
  private walkEndpoints(
    section: ApiSection,
    pathSegments: string[],
    result: UnifiedEndpointMetadata[],
    t: ReturnType<typeof simpleT>["t"],
    options: EndpointListingOptions,
  ): void {
    // Process HTTP method endpoints at this level
    for (const method of ALL_METHODS) {
      const endpoint = section[method] as CreateApiEndpointAny | undefined;
      if (endpoint) {
        const metadata = this.extractMetadata(
          endpoint,
          method,
          pathSegments,
          t,
          options,
        );
        result.push(metadata);
      }
    }

    // Recurse into nested sections
    for (const [key, value] of Object.entries(section)) {
      // Skip HTTP methods
      if (ALL_METHODS.includes(key as Methods)) {
        continue;
      }

      // Recurse into nested section
      if (value && typeof value === "object") {
        this.walkEndpoints(
          value as ApiSection,
          [...pathSegments, key],
          result,
          t,
          options,
        );
      }
    }
  }

  /**
   * Extract metadata from a single endpoint definition
   */
  private extractMetadata(
    endpoint: CreateApiEndpointAny,
    method: Methods,
    pathSegments: string[],
    t: ReturnType<typeof simpleT>["t"],
    options: EndpointListingOptions,
  ): UnifiedEndpointMetadata {
    const routePath = pathSegments.join("/");
    const apiPath = `/v1/${routePath}`;

    // Extract aliases
    const customAliases = Array.isArray(endpoint.aliases)
      ? endpoint.aliases.filter(
          (alias: unknown): alias is string => typeof alias === "string",
        )
      : [];

    // Description
    const description =
      this.translateIfKey(endpoint.description, t) ||
      t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.executeCommand" as TranslationKey,
      );

    // Category
    const category =
      pathSegments.length >= 2
        ? pathSegments.slice(0, -1).join("/")
        : pathSegments[0] || "general";
    const translatedCategory = this.translateIfKey(category, t);

    // Tags
    const tags = Array.isArray(endpoint.tags)
      ? endpoint.tags.map((tag: TranslationKey) => this.translateIfKey(tag, t))
      : [];

    // Names and aliases
    const shortName = pathSegments.slice(-2).join(":");
    const fullName = pathSegments.join(":");
    const allAliases = [
      shortName,
      ...(fullName !== shortName ? [fullName] : []),
      ...customAliases,
    ];

    const primaryName =
      customAliases.length > 0
        ? customAliases[0]
        : `core_${routePath.replace(/\//g, "_")}`;

    const endpointId = `${method.toLowerCase()}_v1_${routePath.replace(/\//g, "_")}`;

    return {
      id: endpointId,
      name: primaryName,
      method,
      path: apiPath,
      routePath: apiPath,
      description,
      category: translatedCategory,
      tags,
      allowedRoles: endpoint.allowedRoles,
      aliases: allAliases,
      enabled: true,
      ...(options.includeRaw && { _rawEndpoint: undefined }),
    };
  }

  /**
   * Translate if value is a translation key, otherwise return as-is
   */
  private translateIfKey(value: string | undefined, t: TFunction): string {
    return t(value as TranslationKey);
  }
}

/**
 * Singleton instance
 */
export const endpointListingService = new EndpointListingService();
