/**
 * Native User Repository
 * Implements UserRepository interface for React Native
 *
 * POLYFILL PATTERN: This file makes the same repository interface work on native
 * by calling HTTP endpoints instead of direct database access using typesafe endpoint definitions.
 *
 * IMPLEMENTATION STRATEGY:
 * - getUserByAuth(): Fully implemented with nativeEndpoint() (used in 8 page.tsx files)
 * - Other methods: Return "not implemented" errors (not used in page.tsx, can be added when needed)
 *
 * Server code (like page.tsx) can call userRepository.getUserByAuth() and it will:
 * - On Web/Server: Query the database directly
 * - On React Native: Make HTTP call via nativeEndpoint() with full type safety
 *
 * This allows the SAME code to work on both platforms!
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { DbId } from "@/app/api/[locale]/system/db/types";
import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { NewUser } from "./db";
import type { UserDetailLevel } from "./enum";
import { GET as getUserMeEndpoint } from "./private/me/definition";
// Import the interface for type compatibility
import type { UserRepository } from "./repository";
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
 * Native User Repository Implementation
 * Uses HTTP client to call API endpoints, providing the same interface as server
 */
class UserRepositoryNativeImpl implements UserRepository {
  private createNotImplementedError<T>(method: string): ResponseType<T> {
    return fail({
      message: "app.api.user.errors.not_implemented_on_native",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { method },
    });
  }

  async getUserById<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
    userId: DbId,
    detailLevel: T,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    logger.error("getUserById not implemented on native", {
      userId,
      detailLevel: String(detailLevel),
      locale,
    });
    return await Promise.resolve(
      this.createNotImplementedError<ExtendedUserType<T>>("getUserById"),
    );
  }

  async getUserByEmail<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
    email: string,
    detailLevel: T,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    logger.error("getUserByEmail not implemented on native", {
      email,
      detailLevel: String(detailLevel),
      locale,
    });
    return await Promise.resolve(
      this.createNotImplementedError<ExtendedUserType<T>>("getUserByEmail"),
    );
  }

  async getUserByAuth<
    T extends typeof UserDetailLevel.MINIMAL | ExtendedUserDetailLevel =
      typeof UserDetailLevel.MINIMAL,
  >(
    options: Omit<UserFetchOptions, "detailLevel"> & { detailLevel?: T },
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserType<T>>> {
    logger.debug("getUserByAuth on native", {
      detailLevel: String(options.detailLevel),
      locale,
    });
    // Use typesafe nativeEndpoint() with endpoint definition
    // This provides full type inference from the endpoint's schema
    const response = await nativeEndpoint(
      getUserMeEndpoint,
      {},
      logger,
      locale,
    );

    // The response from /me endpoint returns flat user data (CompleteUserType)
    // Since native always calls GET /me which returns CompleteUserType,
    // and CompleteUserType satisfies all UserType<T> variants (it's the most complete),
    // we can safely return it for any UserType<T> generic parameter.
    if (response.success) {
      return {
        success: true,
        data: response.data as UserType<T>,
        message: response.message,
      };
    }

    // Error response - preserve all error information
    return {
      success: false,
      errorType: response.errorType,
      message: response.message,
      messageParams: response.messageParams,
    };
  }

  async exists(
    userId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    logger.error("exists not implemented on native", { userId });
    return await Promise.resolve(
      this.createNotImplementedError<boolean>("exists"),
    );
  }

  async emailExists(
    email: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    logger.error("emailExists not implemented on native", { email });
    return await Promise.resolve(
      this.createNotImplementedError<boolean>("emailExists"),
    );
  }

  async emailExistsByOtherUser(
    email: string,
    excludeUserId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    logger.error("emailExistsByOtherUser not implemented on native", {
      email,
      excludeUserId,
    });
    return await Promise.resolve(
      this.createNotImplementedError<boolean>("emailExistsByOtherUser"),
    );
  }

  async createWithHashedPassword(
    data: NewUser,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType>> {
    logger.error("createWithHashedPassword not implemented on native", {
      email: data.email,
    });
    return await Promise.resolve(
      this.createNotImplementedError<StandardUserType>(
        "createWithHashedPassword",
      ),
    );
  }

  async searchUsers(
    query: string,
    options: UserSearchOptions,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType[]>> {
    logger.error("searchUsers not implemented on native", {
      query,
      limit: options.limit,
      offset: options.offset,
    });
    return await Promise.resolve(
      this.createNotImplementedError<StandardUserType[]>("searchUsers"),
    );
  }

  async getAllUsers(
    options: UserSearchOptions,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType[]>> {
    logger.error("getAllUsers not implemented on native", {
      limit: options.limit,
      offset: options.offset,
    });
    return await Promise.resolve(
      this.createNotImplementedError<StandardUserType[]>("getAllUsers"),
    );
  }

  async getUserSearchCount(
    query: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    logger.error("getUserSearchCount not implemented on native", { query });
    return await Promise.resolve(
      this.createNotImplementedError<number>("getUserSearchCount"),
    );
  }

  async searchUsersWithPagination(
    searchTerm: string,
    options: {
      limit?: number;
      offset?: number;
      roles?: UserRoleValue[];
    },
    logger: EndpointLogger,
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
    logger.warn("searchUsersWithPagination not implemented on native", {
      searchTerm,
      limit: options.limit,
      offset: options.offset,
      roles: options.roles,
    });
    return await Promise.resolve(
      this.createNotImplementedError<{
        users: Array<
          StandardUserType & { createdAt: string; updatedAt: string }
        >;
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
      }>("searchUsersWithPagination"),
    );
  }

  async getActiveUserCount(
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    logger.error("getActiveUserCount not implemented on native");
    return await Promise.resolve(
      this.createNotImplementedError<number>("getActiveUserCount"),
    );
  }
}

/**
 * Singleton instance
 * Export with same name as server implementation for drop-in replacement
 */
export const userRepository = new UserRepositoryNativeImpl();
