/**
 * AI Tools Repository
 * Business logic for fetching available AI tools
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { Platform } from "../../shared/config";
import { BaseToolsRepositoryImpl } from "../../shared/repositories/base-tools-repository";
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
  getTools(
    data: AIToolsListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): AIToolsListResponseOutput {
    this.logFetchStart(logger, user);

    // Get tool registry
    const registry = getToolRegistry();

    // Get endpoints filtered by user permissions at framework level
    // The registry automatically filters by:
    // 1. Platform opt-out (AI_TOOL_OFF)
    // 2. User role-based permissions (allowedRoles from endpoint definitions)
    // 3. Public vs authenticated user access
    //
    // NOTE: We don't need to fetch user roles from database here.
    // The authentication layer already validated that the user can access THIS endpoint.
    // The registry will filter OTHER endpoints based on their allowedRoles:
    // - If user.isPublic === true → only return endpoints with PUBLIC in allowedRoles
    // - If user.isPublic === false → return endpoints with CUSTOMER, ADMIN, etc. (not PUBLIC-only)
    const userContext = this.createUserContext(user);

    let filteredEndpoints: DiscoveredEndpoint[];
    try {
      filteredEndpoints = registry.getEndpoints(userContext, Platform.AI);
    } catch (error) {
      this.logError(logger, error);
      // Return empty array on error - route handler will handle error response
      filteredEndpoints = [];
    }

    logger.info("[AI Tools Repository] Filtered endpoints by permissions", {
      totalEndpoints: registry.getStats().totalEndpoints,
      filteredEndpoints: filteredEndpoints.length,
      isPublic: user.isPublic,
    });

    // Get translation function
    const { t } = simpleT(locale);

    // Transform endpoints to serializable format and resolve translation keys
    const serializableTools = filteredEndpoints.map(
      (endpoint: DiscoveredEndpoint) => {
        const definition = endpoint.definition;

        // Resolve translation keys to actual text
        const descriptionKey: string = (definition.description ||
          definition.title ||
          "") as string;
        const categoryKey: string = definition.category as string;
        const tags: readonly string[] = Array.isArray(definition.tags)
          ? definition.tags
          : [];

        let description: string = descriptionKey;
        try {
          // Try to translate description
          if (descriptionKey) {
            description = t(descriptionKey as never);
          }
        } catch {
          // Keep original if translation fails
        }

        let category: string = categoryKey;
        try {
          // Try to translate category
          if (categoryKey) {
            category = t(categoryKey as never);
          }
        } catch {
          // Keep original if translation fails
        }

        // Try to translate tags
        const translatedTags = tags.map((tag) => {
          try {
            return t(tag as never);
          } catch {
            return tag;
          }
        });

        return {
          name: endpoint.toolName,
          description: description || "",
          category: category || undefined,
          tags: translatedTags,
          endpointId: endpoint.id,
          allowedRoles: endpoint.definition.allowedRoles
            ? Array.from(endpoint.definition.allowedRoles)
            : [],
          // Omit parameters as Zod schemas cannot be JSON serialized
        };
      },
    );

    const result = {
      tools: serializableTools,
    };

    this.logResult(
      logger,
      result,
      serializableTools.length,
      serializableTools[0],
    );

    // Return plain object - route handler will wrap with createSuccessResponse
    return result;
  }
}

// Export singleton instance of the repository
export const aiToolsRepository = new AIToolsRepositoryImpl();
