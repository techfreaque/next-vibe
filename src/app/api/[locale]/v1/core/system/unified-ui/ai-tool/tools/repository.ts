/**
 * AI Tools Repository
 * Business logic for fetching available AI tools
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
    locale: CountryLanguage = "en-GLOBAL",
  ): AIToolsListResponseOutput {
    logger.info("[AI Tools Repository] Fetching available tools");

    // Get tool registry
    const registry = getToolRegistry();

    // Get ALL endpoints without any filters
    const allEndpoints = registry.getEndpoints();

    logger.info("[AI Tools Repository] Found endpoints", {
      count: allEndpoints.length,
    });

    // Get translation function
    const { t } = simpleT(locale);

    // Transform endpoints to serializable format and resolve translation keys
    const serializableTools = allEndpoints.map((endpoint) => {
      const definition = endpoint.definition;

      // Resolve translation keys to actual text
      let description = definition.description || definition.title || "";
      let category = definition.category;
      const tags = Array.isArray(definition.tags) ? definition.tags : [];

      try {
        // Try to translate description
        if (description) {
          description = t(description);
        }
      } catch {
        // Keep original if translation fails
      }

      try {
        // Try to translate category
        if (category) {
          category = t(category);
        }
      } catch {
        // Keep original if translation fails
      }

      // Try to translate tags
      const translatedTags = tags.map((tag: string) => {
        try {
          return t(tag);
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
        allowedRoles: Array.from(endpoint.allowedRoles),
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
