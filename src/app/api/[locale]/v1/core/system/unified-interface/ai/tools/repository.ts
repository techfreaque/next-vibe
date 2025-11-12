/**
 * AI Tools Repository
 * Business logic for fetching available AI tools
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { Platform } from "../../shared/server-only/config";
import { BaseToolsRepositoryImpl } from "../../shared/server-only/repositories/tools";
import { getToolRegistry } from "../registry";
import type { DiscoveredEndpoint } from "../types";
import type {
  AIToolsListRequestOutput,
  AIToolsListResponseOutput,
} from "./definition";

/**
 * AI Tools repository implementation
 * Extends BaseToolsRepositoryImpl to eliminate duplication
 */
export class AIToolsRepositoryImpl extends BaseToolsRepositoryImpl<
  AIToolsListRequestOutput,
  AIToolsListResponseOutput
> {
  constructor() {
    // eslint-disable-next-line i18next/no-literal-string
    super("AI Tools Repository");
  }

  /**
   * Get all available AI tools for current user
   */
  async getTools(
    data: AIToolsListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<AIToolsListResponseOutput> {
    this.logFetchStart(logger, user);

    // Get tool registry
    const registry = getToolRegistry();

    // Get endpoints filtered by user permissions at framework level
    // The registry automatically filters by:
    // 1. Platform opt-out (AI_TOOL_OFF)
    // 2. User role-based permissions (allowedRoles from endpoint definitions)
    // 3. Public vs authenticated user access
    //
    // NOTE: We fetch user roles from database to properly check permissions.
    // The authentication layer already validated that the user can access THIS endpoint.
    // The registry will filter OTHER endpoints based on their allowedRoles:
    // - If user.isPublic === true → only return endpoints with PUBLIC in allowedRoles
    // - If user.isPublic === false → fetch user roles from DB and return endpoints where user has required role
    const userContext = this.createUserContext(user);

    let filteredEndpoints: DiscoveredEndpoint[];
    try {
      // eslint-disable-next-line no-console
      console.log("[AI Tools Repository] Calling getEndpointsAsync", {
        hasRegistry: !!registry,
        hasMethod: typeof registry.getEndpointsAsync === "function",
        userContext,
        platform: Platform.AI,
      });
      filteredEndpoints = await registry.getEndpointsAsync(
        userContext,
        Platform.AI,
        logger,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[AI Tools Repository] Caught error:", error);
      logger.error("[AI Tools Repository] Error calling getEndpointsAsync", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      this.logError(logger, error instanceof Error ? error : String(error));
      // Return empty array on error - route handler will handle error response
      filteredEndpoints = [];
    }

    logger.info("[AI Tools Repository] Filtered endpoints by permissions", {
      totalEndpoints: registry.getStats().totalEndpoints,
      filteredEndpoints: filteredEndpoints.length,
      isPublic: user.isPublic,
      userId: user.isPublic ? undefined : user.id,
    });

    // Filter out alias endpoints - only keep the canonical "core_" prefixed endpoints
    // Aliases create separate route files, but we want to show them as metadata on the main endpoint
    const canonicalEndpoints = filteredEndpoints.filter((endpoint) => {
      // Keep endpoints that start with "core_" (canonical endpoints)
      // Filter out alias endpoints (e.g., "newsletter-unsubscribe", "unsubscribe", "search")
      return endpoint.toolName.startsWith("core_");
    });

    logger.info("[AI Tools Repository] Filtered alias endpoints", {
      beforeFiltering: filteredEndpoints.length,
      afterFiltering: canonicalEndpoints.length,
      removedAliases: filteredEndpoints.length - canonicalEndpoints.length,
    });

    // Get translation function
    const { t } = simpleT(locale);

    // Transform endpoints to serializable format and resolve translation keys
    const serializableTools = canonicalEndpoints.map(
      (endpoint: DiscoveredEndpoint) => {
        const definition = endpoint.definition;

        // Extract method from endpoint ID (format: "get_v1_path_to_endpoint")
        const methodMatch = endpoint.id.match(/^([a-z]+)_v1_/);
        const method = methodMatch ? methodMatch[1].toUpperCase() : "GET";

        // Resolve translation keys to actual text
        const descriptionKey = definition.description || definition.title;
        const categoryKey = definition.category;
        const tags = definition.tags;

        let description = "";
        try {
          // Try to translate description
          if (descriptionKey) {
            description = t(descriptionKey);
          }
        } catch {
          // Keep original if translation fails
          description = String(descriptionKey);
        }

        let category = "";
        try {
          // Try to translate category
          if (categoryKey) {
            category = t(categoryKey);
          }
        } catch {
          // Keep original if translation fails
          category = String(categoryKey);
        }

        // Try to translate tags
        const translatedTags = tags.map((tag) => {
          try {
            return t(tag);
          } catch {
            return String(tag);
          }
        });

        return {
          name: endpoint.toolName,
          method,
          description: description || "",
          category: category || undefined,
          tags: translatedTags,
          endpointId: endpoint.id,
          allowedRoles: endpoint.definition.allowedRoles
            ? [...endpoint.definition.allowedRoles]
            : [],
          aliases: endpoint.definition.aliases
            ? [...endpoint.definition.aliases]
            : undefined,
          // Omit parameters as Zod schemas cannot be JSON serialized
        };
      },
    );

    const result = {
      tools: serializableTools,
    };

    // Log a few sample tools to verify structure
    logger.info("[AI Tools Repository] Sample tools", {
      count: serializableTools.length,
      samples: serializableTools.slice(0, 3).map((t) => ({
        name: t.name,
        method: t.method,
        endpointId: t.endpointId,
        aliases: t.aliases,
      })),
    });

    this.logResult(
      logger,
      result,
      serializableTools.length,
      serializableTools[0] as
        | Record<string, string | number | boolean | null | string[]>
        | undefined,
    );

    // Return plain object - route handler will wrap with success
    return result;
  }
}

// Export singleton instance of the repository
export const aiToolsRepository = new AIToolsRepositoryImpl();
