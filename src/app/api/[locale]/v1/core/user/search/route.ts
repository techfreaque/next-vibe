/**
 * User Search API Route Handler
 * Handles GET requests for searching users
 */

import { createSuccessResponse } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { userRepository } from "../repository";
import definitions, { type UserSearchGetResponseOutput } from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ data, logger }): Promise<ReturnType<typeof createSuccessResponse<UserSearchGetResponseOutput>>> => {
      const searchResult = await userRepository.searchUsers(
        data.searchCriteria?.search || "", // Empty string for all users
        {
          limit: data.pagination?.limit || 20,
          offset: data.pagination?.offset || 0,
          roles: data.filters?.roles,
        },
        logger,
      );

      if (!searchResult.success) {
        return searchResult;
      }

      // Get total count for the search query
      const totalCountResult = await userRepository.getUserSearchCount(
        data.searchCriteria?.search || "",
        logger,
      );

      if (!totalCountResult.success) {
        return totalCountResult;
      }

      const total = totalCountResult.data;
      const currentOffset = data.pagination?.offset ?? 0;
      const currentLimit = data.pagination?.limit ?? 20;
      const hasMore = currentOffset + searchResult.data.length < total;
      const totalPages = Math.ceil(total / currentLimit);
      const currentPage = Math.floor(currentOffset / currentLimit) + 1;

      return createSuccessResponse({
        success: true,
        message: "app.api.v1.core.user.search.response.message",
        searchInfo: {
          searchTerm: data.searchCriteria?.search,
          appliedFilters: data.filters?.roles || [],
          searchTime: "0.5s",
          totalResults: total,
        },
        users: searchResult.data,
        pagination: {
          currentPage,
          totalPages,
          itemsPerPage: currentLimit,
          totalItems: total,
          hasMore,
          hasPrevious: currentOffset > 0,
        },
        actions: [
          {
            action: "view-details",
            label: "app.api.v1.core.user.search.actions.viewUser.label",
            description:
              "app.api.v1.core.user.search.actions.viewUser.description",
          },
        ],
      });
    },
  },
});
