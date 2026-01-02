import { endpoints } from "@/app/api/[locale]/system/generated/endpoints";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../logger/endpoint";
import type { CreateApiEndpointAny } from "../../types/endpoint";
import { Methods } from "../../types/enums";
import type { Platform } from "../../types/platform";
import { endpointToToolName } from "../../utils/path";
import { getTranslatorFromEndpoint } from "../../widgets/utils/field-helpers";
import { permissionsRegistry } from "../permissions/registry";

type EndpointNode =
  | {
      [K in Methods]?: CreateApiEndpointAny;
    }
  | {
      [key: string]: EndpointNode;
    };

export interface SerializableToolMetadata {
  name: string;
  method: Methods;
  description: string;
  category?: string;
  tags: string[];
  toolName: string;
  allowedRoles: UserRoleValue[];
  aliases?: string[];
  requiresConfirmation?: boolean;
}

export interface IDefinitionsRegistry {
  /**
   * Get all endpoints for a platform, filtered by user permissions
   */
  getEndpointsForUser(
    platform: Platform,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): CreateApiEndpointAny[];

  /**
   * Get endpoint count by category
   */
  getEndpointCountByCategory(platform: Platform): Record<string, number>;

  /**
   * Get serialized tools for a user (convenience method)
   */
  getSerializedToolsForUser(
    platform: Platform,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): SerializableToolMetadata[];
}

export class DefinitionsRegistry implements IDefinitionsRegistry {
  /**
   * Get all endpoints for a platform (metadata only, no permission filtering)
   */
  private getEndpoints(platform: Platform): CreateApiEndpointAny[] {
    const endpointsData = endpoints as EndpointNode;
    const discovered: CreateApiEndpointAny[] = [];

    const traverse = (obj: EndpointNode, pathSegments: string[] = []): void => {
      if (!obj || typeof obj !== "object") {
        return;
      }

      const methods = Object.keys(obj).filter((key) =>
        Object.values(Methods).includes(key as Methods),
      );

      // Process methods if they exist
      if (methods.length > 0) {
        for (const method of methods) {
          const methodKey = method as Methods;
          const definition = obj[methodKey] as CreateApiEndpointAny;

          if (!definition) {
            continue;
          }

          // Check platform access (no user required, just platform markers)
          if (definition.allowedRoles) {
            const access = permissionsRegistry.checkPlatformAccess(
              definition.allowedRoles,
              platform,
            );
            if (!access.allowed) {
              continue;
            }
          }

          discovered.push(definition);
        }
      }

      // Always traverse child nodes (nodes can have both methods and children)
      for (const [key, value] of Object.entries(obj)) {
        if (
          key.startsWith("_") ||
          Object.values(Methods).includes(key as Methods) ||
          typeof value !== "object" ||
          value === null
        ) {
          continue;
        }
        traverse(value as EndpointNode, [...pathSegments, key]);
      }
    };

    traverse(endpointsData);
    return discovered;
  }

  /**
   * Get all endpoints for a platform, filtered by user permissions
   */
  getEndpointsForUser(
    platform: Platform,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): CreateApiEndpointAny[] {
    logger.debug("[Definitions Registry] Discovering endpoints for user", {
      platform,
      userId: user.isPublic ? "public" : user.id,
    });

    const discovered = this.getEndpoints(platform);

    // Filter by user permissions
    const filtered = permissionsRegistry.filterEndpointsByPermissions(
      discovered,
      user,
      platform,
      logger,
    );

    logger.debug("[Definitions Registry] Filtered endpoints", {
      total: discovered.length,
      filtered: filtered.length,
    });

    return filtered;
  }

  /**
   * Get endpoint count by category (no permission filtering)
   */
  getEndpointCountByCategory(platform: Platform): Record<string, number> {
    const allEndpoints = this.getEndpoints(platform);
    const counts: Record<string, number> = {};

    for (const endpoint of allEndpoints) {
      const category = endpoint.category || "Other";
      counts[category] = (counts[category] || 0) + 1;
    }

    return counts;
  }

  /**
   * Serialize endpoints to tool metadata format
   */
  private serializeEndpoints(
    endpoints: CreateApiEndpointAny[],
    locale: CountryLanguage,
  ): SerializableToolMetadata[] {
    return endpoints.map((definition) => {
      const { t } = getTranslatorFromEndpoint(definition)(locale);

      const method = definition.method;
      const toolName = endpointToToolName(definition);

      const descriptionKey = definition.description || definition.title;
      const categoryKey = definition.category;
      const tags = definition.tags;

      let description = "";
      try {
        if (descriptionKey) {
          description = t(descriptionKey);
        }
      } catch {
        description = String(descriptionKey);
      }

      let category = "";
      try {
        if (categoryKey) {
          category = t(categoryKey);
        }
      } catch {
        category = String(categoryKey);
      }

      const translatedTags = tags.map((tag) => {
        try {
          return t(tag);
        } catch {
          return String(tag);
        }
      });

      return {
        name: toolName,
        method,
        description: description || "",
        category: category || undefined,
        tags: translatedTags,
        toolName,
        allowedRoles: definition.allowedRoles ? [...definition.allowedRoles] : [],
        aliases: definition.aliases ? [...definition.aliases] : undefined,
        requiresConfirmation: definition.requiresConfirmation,
      };
    });
  }

  /**
   * Get serialized tools for a user (convenience method)
   */
  getSerializedToolsForUser(
    platform: Platform,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): SerializableToolMetadata[] {
    logger.debug("[Definitions Registry] Getting serialized tools for user", {
      platform,
      isPublic: user.isPublic,
      userId: user.isPublic ? undefined : user.id,
    });

    const filteredEndpoints = this.getEndpointsForUser(platform, user, logger);

    logger.info("[Definitions Registry] Filtered endpoints by permissions", {
      filteredEndpoints: filteredEndpoints.length,
      isPublic: user.isPublic,
      userId: user.isPublic ? undefined : user.id,
    });

    const serializableTools = this.serializeEndpoints(filteredEndpoints, locale);

    logger.info("[Definitions Registry] Serialized tools", {
      count: serializableTools.length,
      samples: serializableTools.slice(0, 3).map((t) => ({
        name: t.name,
        method: t.method,
        toolName: t.toolName,
        aliases: t.aliases,
      })),
    });

    return serializableTools;
  }
}

export const definitionsRegistry = new DefinitionsRegistry();
