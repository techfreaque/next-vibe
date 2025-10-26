/**
 * Brave Search API Route Handler
 * Handles GET requests for web search
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/types";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import type {
  BraveSearchGetRequestOutput,
  BraveSearchGetResponseOutput,
  BraveSearchGetUrlVariablesOutput,
} from "./definition";
import braveSearchDefinition from "./definition";
import { getBraveSearchService, SEARCH_MESSAGES } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: braveSearchDefinition,
  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        BraveSearchGetRequestOutput,
        BraveSearchGetUrlVariablesOutput,
        typeof braveSearchDefinition.GET.allowedRoles
      >,
    ): Promise<ResponseType<BraveSearchGetResponseOutput>> => {
      const { data, logger } = props;

      try {
        // Validate that query is provided
        if (
          !data.query ||
          typeof data.query !== "string" ||
          data.query.trim() === ""
        ) {
          return createErrorResponse(
            "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.validation.title" as const,
            ErrorResponseTypes.VALIDATION_ERROR,
            { message: SEARCH_MESSAGES.QUERY_REQUIRED },
          );
        }

        const searchService = getBraveSearchService();
        const searchResults = await searchService.search(data.query, {
          maxResults: data.maxResults,
          includeNews: data.includeNews,
          freshness: data.freshness,
        });

        if (searchResults.results.length === 0) {
          return createSuccessResponse({
            success: false,
            message: `${SEARCH_MESSAGES.NO_RESULTS_PREFIX}: ${data.query}`,
            results: [],
          });
        }

        return createSuccessResponse({
          success: true,
          message: `${SEARCH_MESSAGES.FOUND_RESULTS_PREFIX} ${searchResults.results.length} ${SEARCH_MESSAGES.FOUND_RESULTS_SUFFIX}: ${data.query}`,
          results: searchResults.results.map((result) => ({
            title: result.title,
            url: result.url,
            snippet: result.description,
            age: result.age,
            source: result.source,
          })),
          cached: searchResults.cached,
          timestamp: new Date(searchResults.timestamp).toISOString(),
        });
      } catch (error) {
        const searchService = getBraveSearchService();
        const braveError =
          error instanceof Error
            ? searchService.handleError(error)
            : new Error(SEARCH_MESSAGES.UNKNOWN_ERROR);

        logger.error("Brave Search error", {
          error: braveError.message,
          query: data.query,
        });

        return createErrorResponse(
          "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.internal.title" as const,
          ErrorResponseTypes.INTERNAL_ERROR,
          { message: braveError.message },
        );
      }
    },
  },
});
