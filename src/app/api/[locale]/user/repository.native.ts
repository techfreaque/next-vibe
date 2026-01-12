/**
 * Native User Repository
 * Implements UserRepository interface for React Native
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { DbId } from "@/app/api/[locale]/system/db/types";
import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { NewUser } from "./db";
import { UserDetailLevel } from "./enum";
import userProfileEndpoints from "./private/me/definition";
import type { UserRepositoryType } from "./repository";
import type {
  ExtendedUserDetailLevel,
  ExtendedUserType,
  StandardUserType,
  UserFetchOptions,
  UserSearchOptions,
  UserType,
} from "./types";
import type { UserRoleValue } from "./user-roles/enum";

/**
 * Native User Repository - Static class pattern
 */
export class UserRepository {
  static async getUserById<T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD>(
    // oxlint-disable-next-line no-unused-vars
    _userId: DbId,
    // oxlint-disable-next-line no-unused-vars
    _detailLevel: T = UserDetailLevel.STANDARD as T,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getUserById is not implemented on native");
  }

  static async getUserByEmail<T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD>(
    // oxlint-disable-next-line no-unused-vars
    _email: string,
    // oxlint-disable-next-line no-unused-vars
    _detailLevel: T = UserDetailLevel.STANDARD as T,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getUserByEmail is not implemented on native");
  }

  static async getUserByAuth<
    T extends typeof UserDetailLevel.MINIMAL | ExtendedUserDetailLevel =
      typeof UserDetailLevel.MINIMAL,
  >(
    // oxlint-disable-next-line no-unused-vars
    _options: Omit<UserFetchOptions, "detailLevel"> & { detailLevel?: T },
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserType<T>>> {
    const response = await nativeEndpoint(userProfileEndpoints.GET, {}, logger, locale);

    if (response.success) {
      return {
        success: true,
        data: response.data as UserType<T>,
        message: response.message,
      };
    }

    return {
      success: false,
      errorType: response.errorType,
      message: response.message,
      messageParams: response.messageParams,
    };
  }

  static async exists(
    // oxlint-disable-next-line no-unused-vars
    _userId: DbId,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("exists is not implemented on native");
  }

  static async emailExists(
    // oxlint-disable-next-line no-unused-vars
    _email: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("emailExists is not implemented on native");
  }

  static async emailExistsByOtherUser(
    // oxlint-disable-next-line no-unused-vars
    _email: string,
    // oxlint-disable-next-line no-unused-vars
    _excludeUserId: DbId,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("emailExistsByOtherUser is not implemented on native");
  }

  static async createWithHashedPassword(
    // oxlint-disable-next-line no-unused-vars
    _data: NewUser,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("createWithHashedPassword is not implemented on native");
  }

  static async searchUsers(
    // oxlint-disable-next-line no-unused-vars
    _query: string,
    // oxlint-disable-next-line no-unused-vars
    _options: UserSearchOptions,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType[]>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("searchUsers is not implemented on native");
  }

  static async getAllUsers(
    // oxlint-disable-next-line no-unused-vars
    _options: UserSearchOptions,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType[]>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getAllUsers is not implemented on native");
  }

  static async getUserSearchCount(
    // oxlint-disable-next-line no-unused-vars
    _query: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getUserSearchCount is not implemented on native");
  }

  static async searchUsersWithPagination(
    // oxlint-disable-next-line no-unused-vars
    _searchTerm: string,
    // oxlint-disable-next-line no-unused-vars
    _options: {
      limit?: number;
      offset?: number;
      roles?: UserRoleValue[];
    },
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      users: Array<StandardUserType & { createdAt: string; updatedAt: string }>;
      pagination: {
        currentPage: number;
        totalPages: number;
        itemsPerPage: number;
        totalItems: number;
        hasMore: boolean;
        hasPrevious: boolean;
      };
      searchInfo: {
        searchTerm: string | undefined;
        appliedFilters: UserRoleValue[];
        searchTime: string;
        totalResults: number;
      };
    }>
  > {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("searchUsersWithPagination is not implemented on native");
  }

  static async getActiveUserCount(
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getActiveUserCount is not implemented on native");
  }

  static async getUserPublicName(
    // oxlint-disable-next-line no-unused-vars
    _userId: string | undefined,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<string | null> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getUserPublicName is not implemented on native");
  }
}

// Compile-time type check
const _typeCheck: UserRepositoryType = UserRepository;
void _typeCheck;
