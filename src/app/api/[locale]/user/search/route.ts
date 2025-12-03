/**
 * User Search API Route Handler
 * Handles GET requests for searching users
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { userRepository } from "../repository";
import definitions, { type UserSearchGetResponseOutput } from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({
      data,
      logger,
    }): Promise<ResponseType<UserSearchGetResponseOutput>> => {
      const result = await userRepository.searchUsersWithPagination(
        data.searchCriteria?.search || "",
        {
          limit: data.pagination?.limit,
          offset: data.pagination?.offset,
          roles: data.filters?.roles,
        },
        logger,
      );

      if (!result.success) {
        return result;
      }

      return success({
        response: {
          success: true,
          message: "app.api.user.search.response.message",
          searchInfo: result.data.searchInfo,
          users: result.data.users,
          pagination: result.data.pagination,
          actions: undefined,
        },
      });
    },
  },
});
