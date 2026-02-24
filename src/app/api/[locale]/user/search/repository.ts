/**
 * User Search Repository
 * Handles user search operations with proper response formatting
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserRepository } from "../repository";
import type {
  UserSearchGetRequestOutput,
  UserSearchGetResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

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
    locale: CountryLanguage,
    t: ModuleT,
  ): Promise<ResponseType<UserSearchGetResponseOutput>> {
    const result = await UserRepository.searchUsersWithPagination(
      data.searchCriteria?.search || "",
      {
        limit: data.pagination?.limit,
        offset: data.pagination?.offset,
        roles: data.filters?.roles,
      },
      logger,
      locale,
    );

    if (!result.success) {
      return result;
    }

    return success({
      response: {
        success: true,
        message: t("success.title"),
        searchInfo: result.data.searchInfo,
        users: result.data.users,
        pagination: result.data.pagination,
        actions: undefined,
      },
    });
  }
}
