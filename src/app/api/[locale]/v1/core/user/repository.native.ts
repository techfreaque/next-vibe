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
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import { nativeEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import type { NewUser, User } from "./db";
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
import type { UserRole, UserRoleValue } from "./user-roles/enum";

/**
 * Native User Repository Implementation
 * Uses HTTP client to call API endpoints, providing the same interface as server
 */
class UserRepositoryNativeImpl implements UserRepository {
  private createNotImplementedError<T>(method: string): ResponseType<T> {
    return createErrorResponse(
      "app.api.v1.core.user.errors.not_implemented_on_native",
      ErrorResponseTypes.INTERNAL_ERROR,
      { method },
    );
  }

  async getUserById<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
    userId: DbId,
    detailLevel: T,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    logger.warn("getUserById not implemented on native - not used in page.tsx");
    return await Promise.resolve(
      this.createNotImplementedError<ExtendedUserType<T>>("getUserById"),
    );
  }

  async getUserByEmail<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
    email: string,
    detailLevel: T,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    logger.warn(
      "getUserByEmail not implemented on native - not used in page.tsx",
    );
    return await Promise.resolve(
      this.createNotImplementedError<ExtendedUserType<T>>("getUserByEmail"),
    );
  }

  async getUserByAuth<
    T extends
      | typeof UserDetailLevel.MINIMAL
      | ExtendedUserDetailLevel = typeof UserDetailLevel.MINIMAL,
  >(
    options: Omit<UserFetchOptions, "detailLevel"> & { detailLevel?: T },
    logger: EndpointLogger,
  ): Promise<ResponseType<UserType<T>>> {
    // Use typesafe nativeEndpoint() with endpoint definition
    // This provides full type inference from the endpoint's schema
    const response = await nativeEndpoint(getUserMeEndpoint, {}, logger);

    // The response from /me endpoint has shape: { user: CompleteUserType }
    // Extract the user field to match the repository interface
    // Type is correctly inferred from endpoint definition
    if (response.success) {
      return {
        success: true,
        data: response.data.user as UserType<T>,
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
    logger.warn("exists not implemented on native - not used in page.tsx");
    return await Promise.resolve(
      this.createNotImplementedError<boolean>("exists"),
    );
  }

  async emailExists(
    email: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    logger.warn("emailExists not implemented on native - not used in page.tsx");
    return await Promise.resolve(
      this.createNotImplementedError<boolean>("emailExists"),
    );
  }

  async emailExistsByOtherUser(
    email: string,
    excludeUserId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    logger.warn(
      "emailExistsByOtherUser not implemented on native - not used in page.tsx",
    );
    return await Promise.resolve(
      this.createNotImplementedError<boolean>("emailExistsByOtherUser"),
    );
  }

  async create(
    data: NewUser,
    logger: EndpointLogger,
  ): Promise<ResponseType<User>> {
    logger.warn("create not implemented on native - not used in page.tsx");
    return await Promise.resolve(
      this.createNotImplementedError<User>("create"),
    );
  }

  async createWithHashedPassword(
    data: NewUser,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType>> {
    logger.warn(
      "createWithHashedPassword not implemented on native - not used in page.tsx",
    );
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
    logger.warn("searchUsers not implemented on native - not used in page.tsx");
    return await Promise.resolve(
      this.createNotImplementedError<StandardUserType[]>("searchUsers"),
    );
  }

  async getAllUsers(
    options: UserSearchOptions,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType[]>> {
    logger.warn("getAllUsers not implemented on native - not used in page.tsx");
    return await Promise.resolve(
      this.createNotImplementedError<StandardUserType[]>("getAllUsers"),
    );
  }

  async getUserSearchCount(
    query: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    logger.warn(
      "getUserSearchCount not implemented on native - not used in page.tsx",
    );
    return await Promise.resolve(
      this.createNotImplementedError<number>("getUserSearchCount"),
    );
  }

  async searchUsersWithPagination(
    searchTerm: string,
    options: {
      limit?: number;
      offset?: number;
      roles?: (typeof UserRoleValue)[];
    },
    logger: EndpointLogger,
  ) {
    logger.warn(
      "searchUsersWithPagination not implemented on native - not used in page.tsx",
    );
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
          appliedFilters: (typeof UserRole)[];
          searchTime: string;
          totalResults: number;
        };
      }>("searchUsersWithPagination"),
    );
  }
}

/**
 * Singleton instance
 * Export with same name as server implementation for drop-in replacement
 */
export const userRepository = new UserRepositoryNativeImpl();
