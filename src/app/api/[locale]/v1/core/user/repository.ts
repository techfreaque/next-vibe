/**
 * User Repository
 * Core functionality for user operations
 */

import "server-only";

import { and, count, eq, ilike, not, or } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { hashPassword } from "next-vibe/shared/utils/password";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import { leadAuthRepository } from "../leads/auth/repository";
import { authRepository } from "./auth/repository";
import type { NewUser, User } from "./db";
import { insertUserSchema, users } from "./db";
import { UserDetailLevel } from "./enum";
import type {
  CompleteUserType,
  ExtendedUserDetailLevel,
  ExtendedUserType,
  StandardUserType,
  UserFetchOptions,
  UserSearchOptions,
  UserType,
} from "./types";
import { UserRole, type UserRoleValue } from "./user-roles/enum";
import { userRolesRepository } from "./user-roles/repository";

/**
 * User Repository Interface
 * User-related functionality
 */
export interface UserRepository {
  /**
   * Get user by ID
   */
  getUserById<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
    userId: DbId,
    detailLevel: T,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>>;

  /**
   * Get user by email
   */
  getUserByEmail<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
    email: string,
    detailLevel: T,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>>;

  /**
   * Get authenticated user
   */
  getUserByAuth<
    T extends
      | typeof UserDetailLevel.MINIMAL
      | ExtendedUserDetailLevel = typeof UserDetailLevel.MINIMAL,
  >(
    options: Omit<UserFetchOptions, "detailLevel"> & { detailLevel?: T },
    logger: EndpointLogger,
  ): Promise<ResponseType<UserType<T>>>;

  /**
   * Check if user exists
   */
  exists(userId: DbId, logger: EndpointLogger): Promise<ResponseType<boolean>>;

  /**
   * Check if email is registered
   */
  emailExists(
    email: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>>;

  /**
   * Check if email is registered by another user
   */
  emailExistsByOtherUser(
    email: string,
    excludeUserId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>>;

  /**
   * Create new user
   */
  create(data: NewUser, logger: EndpointLogger): Promise<ResponseType<User>>;

  /**
   * Create user with hashed password
   */
  createWithHashedPassword(
    data: NewUser,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType>>;

  /**
   * Search users
   */
  searchUsers(
    query: string,
    options: UserSearchOptions,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType[]>>;

  /**
   * Get all users with pagination
   */
  getAllUsers(
    options: UserSearchOptions,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType[]>>;

  /**
   * Get total count of users matching search query
   */
  getUserSearchCount(
    query: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>>;

  /**
   * Search users with pagination metadata
   */
  searchUsersWithPagination(
    searchTerm: string,
    options: {
      limit?: number;
      offset?: number;
      roles?: (typeof UserRoleValue)[];
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
        appliedFilters: (typeof UserRoleValue)[];
        searchTime: string;
        totalResults: number;
      };
    }>
  >;
}

/**
 * User Repository Implementation
 * Core user operations
 */
export class BaseUserRepositoryImpl implements UserRepository {
  /**
   * Get authenticated user with specified detail level
   */
  async getUserByAuth<
    T extends
      | typeof UserDetailLevel.MINIMAL
      | ExtendedUserDetailLevel = typeof UserDetailLevel.MINIMAL,
  >(
    options: Omit<UserFetchOptions, "detailLevel"> & { detailLevel?: T },
    logger: EndpointLogger,
  ): Promise<ResponseType<UserType<T>>> {
    try {
      const {
        roles = [
          UserRole.CUSTOMER,
        ] as (typeof UserRoleValue)[keyof typeof UserRoleValue][],
        detailLevel = UserDetailLevel.MINIMAL as T,
      } = options;

      logger.debug("Getting user by auth", {
        roles: roles.map(String),
        detailLevel: String(detailLevel),
      });

      // Locale is required for authentication
      if (!options.locale) {
        return createErrorResponse(
          "app.api.v1.core.user.errors.locale_required",
          ErrorResponseTypes.BAD_REQUEST,
        );
      }
      const locale = options.locale;

      // Get the authenticated user
      const verifiedUser = await authRepository.getAuthMinimalUser(
        roles,
        { platform: "next", locale },
        logger,
      );

      if (!verifiedUser) {
        return createErrorResponse(
          "app.api.v1.core.user.errors.auth_required",
          ErrorResponseTypes.UNAUTHORIZED,
          { roles: roles.join(",") },
        );
      }

      // If minimal detail level is requested and we already have the data, return it
      if (detailLevel === UserDetailLevel.MINIMAL) {
        return createSuccessResponse<UserType<T>>(verifiedUser as UserType<T>);
      }

      // Type guard to check if user has ID property
      if (
        verifiedUser.isPublic ||
        !("id" in verifiedUser) ||
        !verifiedUser.id
      ) {
        // This is expected for public/unauthenticated users, log as debug
        logger.debug("No user ID in JWT payload (public user)", {
          isPublic: verifiedUser.isPublic,
        });
        return createErrorResponse(
          "app.api.v1.core.user.auth.errors.jwt_payload_missing_id",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      // For other detail levels, fetch user by ID with the requested detail level
      return (await this.getUserById(
        verifiedUser.id,
        detailLevel,
        options.locale,
        logger,
      )) as ResponseType<UserType<T>>;
    } catch (error) {
      logger.error("Error getting authenticated user", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.errors.auth_retrieval_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get user by ID with specified detail level
   */
  async getUserById<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
    userId: DbId,
    detailLevel: T = UserDetailLevel.STANDARD as T,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    try {
      logger.debug("Getting user by ID", { userId, detailLevel });

      // Query the database for the user
      const results = await db.select().from(users).where(eq(users.id, userId));

      if (results.length === 0) {
        return createErrorResponse(
          "app.api.v1.core.user.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      const user = results[0];

      // For standard and complete detail levels, we need to fetch roles
      const userRolesResponse = await userRolesRepository.findByUserId(
        userId,
        logger,
      );
      if (!userRolesResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.user.errors.roles_lookup_failed",
          ErrorResponseTypes.INTERNAL_ERROR,
          { userId },
        );
      }

      const leadResult = await leadAuthRepository.getAuthenticatedUserLeadId(
        userId,
        undefined,
        locale,
        logger,
      );

      // Standard user data
      const standardUser: StandardUserType = {
        id: user.id,
        leadId: leadResult.leadId,
        isPublic: false,
        privateName: user.privateName,
        publicName: user.publicName,
        email: user.email,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        requireTwoFactor: false,
        marketingConsent: user.marketingConsent ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        userRoles: userRolesResponse.data,
      };

      if (detailLevel === UserDetailLevel.STANDARD) {
        return createSuccessResponse<ExtendedUserType<T>>(
          standardUser as ExtendedUserType<T>,
        );
      }

      // For complete detail level, add additional profile data
      const completeUser: CompleteUserType = {
        ...standardUser,
        stripeCustomerId: user.stripeCustomerId,
      };

      return createSuccessResponse<ExtendedUserType<T>>(
        completeUser as ExtendedUserType<T>,
      );
    } catch (error) {
      logger.error("Error getting user by ID", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.errors.id_lookup_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { userId, error: parseError(error).message },
      );
    }
  }

  /**
   * Get user by email with specified detail level
   */
  async getUserByEmail<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
    email: string,
    detailLevel: T = UserDetailLevel.STANDARD as T,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    try {
      logger.debug("Getting user by email", { email, detailLevel });

      // Just get the ID and use getUserById for full details
      const results = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(eq(users.email, email));

      if (results.length === 0) {
        return createErrorResponse(
          "app.api.v1.core.user.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
          { email },
        );
      }

      // Use the found ID to get complete user details
      return await this.getUserById(results[0].id, detailLevel, locale, logger);
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Error getting user by email", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.errors.email_lookup_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { email, error: errorMessage },
      );
    }
  }

  /**
   * Check if user exists by ID
   */
  async exists(
    userId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      const results = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      return createSuccessResponse(results.length > 0);
    } catch (error) {
      logger.error("Error checking if user exists", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.errors.id_lookup_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { userId, error: parseError(error).message },
      );
    }
  }

  /**
   * Check if an email is already registered
   */
  async emailExists(
    email: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      const results = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return createSuccessResponse(results.length > 0);
    } catch (error) {
      logger.error("Error checking if email exists", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.errors.email_check_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { email, error: parseError(error).message },
      );
    }
  }

  /**
   * Check if an email is already registered by another user
   */
  async emailExistsByOtherUser(
    email: string,
    excludeUserId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      const results = await db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.email, email), not(eq(users.id, excludeUserId))))
        .limit(1);

      return createSuccessResponse(results.length > 0);
    } catch (error) {
      logger.error(
        "Error checking if email exists by other user",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.errors.email_duplicate_check_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { email, excludeUserId, error: parseError(error).message },
      );
    }
  }

  /**
   * Search for users
   */
  async searchUsers(
    query: string,
    options: UserSearchOptions,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType[]>> {
    try {
      const { limit = 10, offset = 0 } = options;

      logger.debug("Searching users", { query, limit, offset });

      let searchResults;

      if (query.trim().length === 0) {
        // Get all users when no search query
        searchResults = await db
          .select()
          .from(users)
          .limit(limit)
          .offset(offset)
          .orderBy(users.privateName, users.publicName);
      } else {
        // Search users with query
        const privateNamePattern = `%${query}%`;
        const publicNamePattern = `%${query}%`;
        const emailPattern = `%${query}%`;

        searchResults = await db
          .select()
          .from(users)
          .where(
            or(
              ilike(users.privateName, privateNamePattern),
              ilike(users.publicName, publicNamePattern),
              ilike(users.email, emailPattern),
            ),
          )
          .limit(limit)
          .offset(offset)
          .orderBy(users.privateName, users.publicName);
      }

      // Map to StandardUserType with all required fields
      const mappedResults: StandardUserType[] = [];

      for (const user of searchResults) {
        // Get user roles for each user
        const userRolesResponse = await userRolesRepository.findByUserId(
          user.id,
          logger,
        );
        if (!userRolesResponse.success) {
          // Skip users where we can't fetch roles
          continue;
        }

        const standardUser: StandardUserType = {
          id: user.id,
          leadId: null,
          isPublic: false,
          privateName: user.privateName,
          publicName: user.publicName,
          email: user.email,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          requireTwoFactor: false,
          marketingConsent: user.marketingConsent ?? false,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          userRoles: userRolesResponse.data,
        };

        mappedResults.push(standardUser);
      }

      return createSuccessResponse(mappedResults);
    } catch (error) {
      logger.error("Error searching users", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.errors.search_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { query, error: parseError(error).message },
      );
    }
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(
    options: UserSearchOptions,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType[]>> {
    try {
      const { limit = 10, offset = 0 } = options;

      logger.debug("Getting all users", { limit, offset });

      const allUsers = await db
        .select()
        .from(users)
        .limit(limit)
        .offset(offset)
        .orderBy(users.privateName, users.publicName);

      // Map to StandardUserType with all required fields
      const mappedResults: StandardUserType[] = [];

      for (const user of allUsers) {
        // Get user roles for each user
        const userRolesResponse = await userRolesRepository.findByUserId(
          user.id,
          logger,
        );

        if (!userRolesResponse.success) {
          logger.error("Error getting user roles", {
            message: userRolesResponse.message,
            errorCode: userRolesResponse.errorType.errorCode,
          });
          continue; // Skip this user if we can't get roles
        }

        const standardUser: StandardUserType = {
          id: user.id,
          leadId: null,
          privateName: user.privateName,
          publicName: user.publicName,
          email: user.email,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          isPublic: false,
          requireTwoFactor: false,
          marketingConsent: user.marketingConsent ?? false,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          userRoles: userRolesResponse.data,
        };

        mappedResults.push(standardUser);
      }

      return createSuccessResponse(mappedResults);
    } catch (error) {
      logger.error("Error getting all users", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.errors.search_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get total count of users matching search query
   */
  async getUserSearchCount(
    query: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      logger.debug("Getting user search count", { query });

      let countQuery;

      if (query.trim().length === 0) {
        // Count all users
        countQuery = db.select({ count: count() }).from(users);
      } else {
        // Count users matching search criteria
        const privateNamePattern = `%${query}%`;
        const publicNamePattern = `%${query}%`;
        const emailPattern = `%${query}%`;

        countQuery = db
          .select({ count: count() })
          .from(users)
          .where(
            or(
              ilike(users.privateName, privateNamePattern),
              ilike(users.publicName, publicNamePattern),
              ilike(users.email, emailPattern),
            ),
          );
      }

      const result = await countQuery;
      const totalCount = result[0]?.count || 0;

      return createSuccessResponse(totalCount);
    } catch (error) {
      logger.error("Error getting user search count", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.errors.search_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { query, error: parseError(error).message },
      );
    }
  }

  /**
   * Create a new user
   */
  async create(
    data: NewUser,
    logger: EndpointLogger,
  ): Promise<ResponseType<User>> {
    try {
      logger.debug("Creating user", { email: data.email });

      // Check if email already exists
      const emailExistsResponse = await this.emailExists(data.email, logger);
      if (emailExistsResponse.success && emailExistsResponse.data) {
        return createErrorResponse(
          "app.api.v1.core.user.errors.email_already_in_use",
          ErrorResponseTypes.VALIDATION_ERROR,
          { email: data.email },
        );
      }
      const validatedData = insertUserSchema.parse(data);
      const results = await db.insert(users).values(validatedData).returning();
      if (results.length === 0) {
        return createErrorResponse(
          "app.api.v1.core.user.errors.creation_failed",
          ErrorResponseTypes.DATABASE_ERROR,
          { error: "app.api.v1.core.user.errors.no_data_returned" },
        );
      }
      return createSuccessResponse(results[0] as User);
    } catch (error) {
      logger.error("Error creating user", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.errors.creation_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { email: data.email, error: parseError(error).message },
      );
    }
  }

  /**
   * Create a new user with hashed password
   */
  async createWithHashedPassword(
    data: NewUser,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType>> {
    try {
      logger.debug("Creating user with hashed password");

      const hashedPassword = await hashPassword(data.password);

      const validatedData = insertUserSchema.parse({
        ...data,
        password: hashedPassword,
      });
      const results = await db.insert(users).values(validatedData).returning();
      if (results.length === 0) {
        return createErrorResponse(
          "app.api.v1.core.user.errors.creation_failed",
          ErrorResponseTypes.DATABASE_ERROR,
          { error: "app.api.v1.core.user.errors.no_data_returned" },
        );
      }
      const createdUser = results[0] as User;

      // Return minimal user data without fetching leadId (which doesn't exist yet)
      const standardUser: StandardUserType = {
        id: createdUser.id,
        leadId: "" as string, // Empty string as placeholder - will be set when lead is created
        isPublic: false,
        privateName: createdUser.privateName,
        publicName: createdUser.publicName,
        email: createdUser.email,
        emailVerified: createdUser.emailVerified,
        isActive: createdUser.isActive,
        requireTwoFactor: false,
        marketingConsent: createdUser.marketingConsent ?? false,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
        userRoles: [],
      };

      return createSuccessResponse(standardUser);
    } catch (error) {
      logger.error(
        "Error creating user with hashed password",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.errors.password_hashing_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { email: data.email, error: parseError(error).message },
      );
    }
  }

  /**
   * Search users with pagination metadata
   */
  async searchUsersWithPagination(
    searchTerm: string,
    options: {
      limit?: number;
      offset?: number;
      roles?: (typeof UserRoleValue)[];
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
        appliedFilters: (typeof UserRoleValue)[];
        searchTime: string;
        totalResults: number;
      };
    }>
  > {
    const currentLimit = options.limit ?? 20;
    const currentOffset = options.offset ?? 0;

    // Search users
    const searchResult = await this.searchUsers(
      searchTerm,
      {
        limit: currentLimit,
        offset: currentOffset,
        roles: options.roles,
      },
      logger,
    );

    if (!searchResult.success) {
      return searchResult;
    }

    // Get total count
    const totalCountResult = await this.getUserSearchCount(searchTerm, logger);

    if (!totalCountResult.success) {
      return totalCountResult;
    }

    const total = totalCountResult.data;
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

    return createSuccessResponse({
      users: serializedUsers,
      pagination: {
        currentPage,
        totalPages,
        itemsPerPage: currentLimit,
        totalItems: total,
        hasMore,
        hasPrevious: currentOffset > 0,
      },
      searchInfo: {
        searchTerm: searchTerm || undefined,
        appliedFilters: options.roles || [],
        searchTime: "0.5s",
        totalResults: total,
      },
    });
  }
}

export const userRepository = new BaseUserRepositoryImpl();
