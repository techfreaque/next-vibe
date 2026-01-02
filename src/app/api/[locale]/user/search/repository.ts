/**
 * User Search Repository
 * Handles user search operations with proper response formatting
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { UserRepository } from "../repository";
import type { UserSearchGetRequestOutput, UserSearchGetResponseOutput } from "./definition";

/**
 * User Search Repository - Static class pattern
 * All methods return ResponseType for consistent error handling
 */
export class UserSearchRepository {
  /**
   * Search users with pagination and filtering
   * Wraps response in expected format
   */
  static async searchUsers(
    data: UserSearchGetRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserSearchGetResponseOutput>> {
    const result = await UserRepository.searchUsersWithPagination(
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
  }
}
