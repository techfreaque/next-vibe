/**
 * AI Tools Repository
 * Business logic for fetching available AI tools
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { Platform } from "../../shared/config";
import { getToolRegistry } from "../registry";
import type {
  AIToolsListRequestOutput,
  AIToolsListResponseOutput,
} from "./definition";

/**
 * AI Tools repository interface
 */
export interface AIToolsRepository {
  /**
   * Get all available AI tools for current user
   * @param data - Request data (empty for GET)
   * @param user - User from authentication (not used currently)
   * @param logger - Logger instance for debugging and monitoring
   * @param locale - Locale for translating tool descriptions
   * @returns List of available AI tools
   */
  getTools(
    data: AIToolsListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale?: CountryLanguage,
  ): AIToolsListResponseOutput;
}

/**
 * AI Tools repository implementation
 */
export class AIToolsRepositoryImpl implements AIToolsRepository {
  /**
   * Get all available AI tools for current user
   */
  getTools(
    data: AIToolsListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): AIToolsListResponseOutput {
    logger.info("[AI Tools Repository] Fetching available tools", {
      userId: user.isPublic ? undefined : user.id,
      isPublic: user.isPublic,
    });

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
    const userContext = {
      id: user.isPublic ? undefined : user.id,
      isPublic: user.isPublic,
    };

    const filteredEndpoints = registry.getEndpoints(userContext, Platform.AI);

    logger.info("[AI Tools Repository] Filtered endpoints by permissions", {
      totalEndpoints: registry.getStats().totalEndpoints,
      filteredEndpoints: filteredEndpoints.length,
      isPublic: user.isPublic,
    });

    // Get translation function
    const { t } = simpleT(locale);

    // Transform endpoints to serializable format and resolve translation keys
    const serializableTools = filteredEndpoints.map((endpoint) => {
      const definition = endpoint.definition;

      // Resolve translation keys to actual text
      const descriptionKey = definition.description || definition.title || "";
      const categoryKey = definition.category;
      const tags = Array.isArray(definition.tags) ? definition.tags : [];

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
          return tag as string;
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
    });

    const result = {
      tools: serializableTools,
    };

    logger.info("[AI Tools Repository] Returning result", {
      resultKeys: Object.keys(result),
      toolsCount: serializableTools.length,
      sampleTool: serializableTools[0],
    });

    // Return plain object - route handler will wrap with createSuccessResponse
    return result;
  }
}

// Export singleton instance of the repository
export const aiToolsRepository = new AIToolsRepositoryImpl();
