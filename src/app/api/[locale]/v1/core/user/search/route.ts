/**
 * User Search API Route Handler
 * Handles GET requests for searching users
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { createSuccessResponse } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { userRepository } from "../repository";
import definitions, { type UserSearchGetResponseOutput } from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({
      data,
      logger,
    }): Promise<ResponseType<UserSearchGetResponseOutput>> => {
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

      // Serialize dates to strings
      const serializedUsers = searchResult.data.map((user) => ({
        ...user,
        createdAt:
          user.createdAt instanceof Date
            ? user.createdAt.toISOString()
            : typeof user.createdAt === "string"
              ? user.createdAt
              : new Date(user.createdAt).toISOString(),
        updatedAt:
          user.updatedAt instanceof Date
            ? user.updatedAt.toISOString()
            : typeof user.updatedAt === "string"
              ? user.updatedAt
              : new Date(user.updatedAt).toISOString(),
      }));

      const responseData: UserSearchGetResponseOutput = {
        response: {
          success: Boolean(true),
          message: "app.api.v1.core.user.search.response.message",
          searchInfo: {
            searchTerm: data.searchCriteria?.search,
            appliedFilters: data.filters?.roles || [],
            searchTime: "0.5s",
            totalResults: total,
          },
          users: serializedUsers,
          pagination: {
            currentPage,
            totalPages,
            itemsPerPage: currentLimit,
            totalItems: total,
            hasMore,
            hasPrevious: currentOffset > 0,
          },
          actions: undefined,
        },
      };

      return createSuccessResponse(responseData);
    },
  },
});
