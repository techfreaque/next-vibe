/**
 * Native User Repository
 * Implements UserRepository interface for React Native
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { NewUser } from "./db";
import { UserDetailLevel } from "./enum";
import userProfileEndpoints, {
  type MeGetResponseOutput,
} from "./private/me/definition";
import type {
  ExtendedUserDetailLevel,
  ExtendedUserType,
  StandardUserType,
  UserFetchOptions,
  UserSearchOptions,
} from "./types";
import type { UserRoleValue } from "./user-roles/enum";

/**
 * Native User Repository - Static class pattern
 */
export class UserRepository {
  private static activeUserCountCache: {
    count: number;
    timestamp: number;
  } | null = null;
  private static readonly CACHE_DURATION_MS = 0;

  static async getUserById<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
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

  static async getUserByEmail<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
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

  static async getUserByAuth(
    // oxlint-disable-next-line no-unused-vars
    _options: Omit<UserFetchOptions, "detailLevel"> & {
      detailLevel?: ExtendedUserDetailLevel;
    },
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MeGetResponseOutput>> {
    return nativeEndpoint(userProfileEndpoints.GET, {}, logger, locale);
  }

  static async exists(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): Promise<ResponseType<boolean>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("exists is not implemented on native");
  }

  static async emailExists(
    // oxlint-disable-next-line no-unused-vars
    _email: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): Promise<ResponseType<boolean>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("emailExists is not implemented on native");
  }

  static async emailExistsByOtherUser(
    // oxlint-disable-next-line no-unused-vars
    _email: string,
    // oxlint-disable-next-line no-unused-vars
    _excludeUserId: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): Promise<ResponseType<boolean>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("emailExistsByOtherUser is not implemented on native");
  }

  static async createWithHashedPassword(
    // oxlint-disable-next-line no-unused-vars
    _data: NewUser,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
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
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): Promise<ResponseType<StandardUserType[]>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("searchUsers is not implemented on native");
  }

  static async getAllUsers(
    // oxlint-disable-next-line no-unused-vars
    _options: UserSearchOptions,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): Promise<ResponseType<StandardUserType[]>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getAllUsers is not implemented on native");
  }

  static async getUserSearchCount(
    // oxlint-disable-next-line no-unused-vars
    _query: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
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
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
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
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
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
