/**
 * User Repository
 * Core functionality for user operations
 */

import "server-only";

import { and, count, eq, ilike, inArray, not, or } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { hashPassword } from "next-vibe/shared/utils/password";

import { db } from "@/app/api/[locale]/system/db";
import type { DbId } from "@/app/api/[locale]/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadAuthRepository } from "../leads/auth/repository";
import { userLeadLinks } from "../leads/db";
import { AuthRepository } from "./auth/repository";
import type { NewUser, User } from "./db";
import { users } from "./db";
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
import { UserRolesRepository } from "./user-roles/repository";

/**
 * 24h cache for active user count
 */
let activeUserCountCache: { count: number; timestamp: number } | null = null;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * User Repository
 */
export class UserRepository {
  /**
   * Get authenticated user with specified detail level
   */
  static async getUserByAuth<
    T extends typeof UserDetailLevel.MINIMAL | ExtendedUserDetailLevel =
      typeof UserDetailLevel.MINIMAL,
  >(
    options: Omit<UserFetchOptions, "detailLevel"> & { detailLevel?: T },
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserType<T>>> {
    try {
      const {
        roles = [UserRole.CUSTOMER] as readonly UserRoleValue[],
        detailLevel = UserDetailLevel.MINIMAL,
      } = options;

      logger.debug("Getting user by auth", {
        roles: roles.map(String),
        detailLevel: String(detailLevel),
      });

      const verifiedUser = await AuthRepository.getAuthMinimalUser(
        roles,
        { platform: Platform.NEXT_PAGE, locale },
        logger,
      );

      if (!verifiedUser) {
        return fail({
          message: "app.api.user.errors.auth_required",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          messageParams: { roles: roles.join(",") },
        });
      }

      if (detailLevel === UserDetailLevel.MINIMAL) {
        return success(verifiedUser) as ResponseType<UserType<T>>;
      }

      if (verifiedUser.isPublic || !("id" in verifiedUser) || !verifiedUser.id) {
        logger.debug("No user ID in JWT payload (public user)", {
          isPublic: verifiedUser.isPublic,
        });
        return fail({
          message: "app.api.user.auth.errors.jwt_payload_missing_id",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return (await UserRepository.getUserById(
        verifiedUser.id,
        detailLevel,
        locale,
        logger,
      )) as ResponseType<UserType<T>>;
    } catch (error) {
      logger.error("Error getting authenticated user", parseError(error));
      return fail({
        message: "app.api.user.errors.auth_retrieval_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get user by ID with specified detail level
   */
  static async getUserById<T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD>(
    userId: DbId,
    detailLevel: T = UserDetailLevel.STANDARD as T,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    try {
      logger.debug("Getting user by ID", { userId, detailLevel });

      const results = await db.select().from(users).where(eq(users.id, userId));

      if (results.length === 0) {
        return fail({
          message: "app.api.user.errors.not_found",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
        });
      }

      const user = results[0];

      const userRolesResponse = await UserRolesRepository.findByUserId(userId, logger);
      if (!userRolesResponse.success) {
        return fail({
          message: "app.api.user.errors.roles_lookup_failed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { userId },
          cause: userRolesResponse,
        });
      }

      const leadResult = await LeadAuthRepository.getAuthenticatedUserLeadId(
        userId,
        undefined,
        locale,
        logger,
      );

      const standardUser: StandardUserType = {
        id: user.id,
        leadId: leadResult.leadId,
        isPublic: false,
        privateName: user.privateName,
        publicName: user.publicName,
        email: user.email,
        locale: user.locale,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        requireTwoFactor: false,
        marketingConsent: user.marketingConsent ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        userRoles: userRolesResponse.data,
      };

      if (detailLevel === UserDetailLevel.STANDARD) {
        return success(standardUser) as ResponseType<ExtendedUserType<T>>;
      }

      const completeUser: CompleteUserType = {
        ...standardUser,
        stripeCustomerId: user.stripeCustomerId,
      };

      return success(completeUser) as ResponseType<ExtendedUserType<T>>;
    } catch (error) {
      logger.error("Error getting user by ID", parseError(error));
      return fail({
        message: "app.api.user.errors.id_lookup_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { userId, error: parseError(error).message },
      });
    }
  }

  /**
   * Get user by email with specified detail level
   */
  static async getUserByEmail<T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD>(
    email: string,
    detailLevel: T = UserDetailLevel.STANDARD as T,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    try {
      logger.debug("Getting user by email", { email, detailLevel });

      const results = await db.select({ id: users.id }).from(users).where(eq(users.email, email));

      if (results.length === 0) {
        return fail({
          message: "app.api.user.errors.not_found",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { email },
        });
      }

      return await UserRepository.getUserById(results[0].id, detailLevel, locale, logger);
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Error getting user by email", parseError(error));
      return fail({
        message: "app.api.user.errors.email_lookup_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { email, error: errorMessage },
      });
    }
  }

  /**
   * Check if user exists by ID
   */
  static async exists(userId: DbId, logger: EndpointLogger): Promise<ResponseType<boolean>> {
    try {
      const results = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      return success(results.length > 0);
    } catch (error) {
      logger.error("Error checking if user exists", parseError(error));
      return fail({
        message: "app.api.user.errors.id_lookup_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { userId, error: parseError(error).message },
      });
    }
  }

  /**
   * Check if an email is already registered
   */
  static async emailExists(email: string, logger: EndpointLogger): Promise<ResponseType<boolean>> {
    try {
      const results = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return success(results.length > 0);
    } catch (error) {
      logger.error("Error checking if email exists", parseError(error));
      return fail({
        message: "app.api.user.errors.email_check_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { email, error: parseError(error).message },
      });
    }
  }

  /**
   * Check if an email is already registered by another user
   */
  static async emailExistsByOtherUser(
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

      return success(results.length > 0);
    } catch (error) {
      logger.error("Error checking if email exists by other user", parseError(error));
      return fail({
        message: "app.api.user.errors.email_duplicate_check_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          email,
          excludeUserId,
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Search for users
   */
  static async searchUsers(
    query: string,
    options: UserSearchOptions,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType[]>> {
    try {
      const { limit = 10, offset = 0 } = options;

      logger.debug("Searching users", { query, limit, offset });

      let searchResults;

      if (query.trim().length === 0) {
        searchResults = await db
          .select()
          .from(users)
          .limit(limit)
          .offset(offset)
          .orderBy(users.privateName, users.publicName);
      } else {
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

      const userIds = searchResults.map((u) => u.id);
      const rolesMapResponse = await UserRolesRepository.findByUserIds(userIds, logger);

      if (!rolesMapResponse.success) {
        return fail({
          message: "app.api.user.errors.roles_batch_fetch_failed",
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: { count: userIds.length },
          cause: rolesMapResponse,
        });
      }

      const rolesMap = rolesMapResponse.data;

      const leadLinks = await db
        .select({ userId: userLeadLinks.userId, leadId: userLeadLinks.leadId })
        .from(userLeadLinks)
        .where(inArray(userLeadLinks.userId, userIds));
      const leadIdMap = new Map(leadLinks.map((l) => [l.userId, l.leadId]));

      const mappedResults: StandardUserType[] = searchResults.map((user) => ({
        id: user.id,
        leadId: leadIdMap.get(user.id) ?? "",
        isPublic: false,
        privateName: user.privateName,
        publicName: user.publicName,
        email: user.email,
        locale: user.locale,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        requireTwoFactor: false,
        marketingConsent: user.marketingConsent ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        userRoles: rolesMap.get(user.id) || [],
      }));

      return success(mappedResults);
    } catch (error) {
      logger.error("Error searching users", parseError(error));
      return fail({
        message: "app.api.user.errors.search_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { query, error: parseError(error).message },
      });
    }
  }

  /**
   * Get all users with pagination
   */
  static async getAllUsers(
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

      const userIds = allUsers.map((u) => u.id);
      const rolesMapResponse = await UserRolesRepository.findByUserIds(userIds, logger);

      if (!rolesMapResponse.success) {
        return fail({
          message: "app.api.user.errors.roles_batch_fetch_failed",
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: { count: userIds.length },
          cause: rolesMapResponse,
        });
      }

      const rolesMap = rolesMapResponse.data;

      const leadLinks = await db
        .select({ userId: userLeadLinks.userId, leadId: userLeadLinks.leadId })
        .from(userLeadLinks)
        .where(inArray(userLeadLinks.userId, userIds));
      const leadIdMap = new Map(leadLinks.map((l) => [l.userId, l.leadId]));

      const mappedResults: StandardUserType[] = allUsers.map((user) => ({
        id: user.id,
        leadId: leadIdMap.get(user.id) ?? user.id,
        privateName: user.privateName,
        publicName: user.publicName,
        email: user.email,
        locale: user.locale,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        isPublic: false,
        requireTwoFactor: false,
        marketingConsent: user.marketingConsent ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        userRoles: rolesMap.get(user.id) || [],
      }));

      return success(mappedResults);
    } catch (error) {
      logger.error("Error getting all users", parseError(error));
      return fail({
        message: "app.api.user.errors.search_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get total count of users matching search query
   */
  static async getUserSearchCount(
    query: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      logger.debug("Getting user search count", { query });

      let countQuery;

      if (query.trim().length === 0) {
        countQuery = db.select({ count: count() }).from(users);
      } else {
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

      return success(totalCount);
    } catch (error) {
      logger.error("Error getting user search count", parseError(error));
      return fail({
        message: "app.api.user.errors.search_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { query, error: parseError(error).message },
      });
    }
  }

  /**
   * Create a new user with hashed password
   */
  static async createWithHashedPassword(
    data: NewUser,
    logger: EndpointLogger,
  ): Promise<ResponseType<StandardUserType>> {
    try {
      logger.debug("Creating user with hashed password");

      const hashedPassword = await hashPassword(data.password);

      const hashedData: NewUser = {
        ...data,
        password: hashedPassword,
      };
      const results = await db.insert(users).values(hashedData).returning();
      if (results.length === 0) {
        return fail({
          message: "app.api.user.errors.creation_failed",
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: { error: "app.api.user.errors.no_data_returned" },
        });
      }
      const createdUser = results[0] as User;

      const standardUser: StandardUserType = {
        id: createdUser.id,
        leadId: "" as string,
        isPublic: false,
        privateName: createdUser.privateName,
        publicName: createdUser.publicName,
        email: createdUser.email,
        locale: createdUser.locale,
        emailVerified: createdUser.emailVerified,
        isActive: createdUser.isActive,
        requireTwoFactor: false,
        marketingConsent: createdUser.marketingConsent ?? false,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
        userRoles: [],
      };

      return success(standardUser);
    } catch (error) {
      logger.error("Error creating user with hashed password", parseError(error));
      return fail({
        message: "app.api.user.errors.password_hashing_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { email: data.email, error: parseError(error).message },
      });
    }
  }

  /**
   * Search users with pagination metadata
   */
  static async searchUsersWithPagination(
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
    const currentLimit = options.limit ?? 20;
    const currentOffset = options.offset ?? 0;

    const searchResult = await UserRepository.searchUsers(
      searchTerm,
      { limit: currentLimit, offset: currentOffset, roles: options.roles },
      logger,
    );

    if (!searchResult.success) {
      return searchResult;
    }

    const totalCountResult = await UserRepository.getUserSearchCount(searchTerm, logger);

    if (!totalCountResult.success) {
      return totalCountResult;
    }

    const total = totalCountResult.data;
    const hasMore = currentOffset + searchResult.data.length < total;
    const totalPages = Math.ceil(total / currentLimit);
    const currentPage = Math.floor(currentOffset / currentLimit) + 1;

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

    return success({
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

  /**
   * Get total count of active users with 24h caching
   */
  static async getActiveUserCount(logger: EndpointLogger): Promise<ResponseType<number>> {
    try {
      const now = Date.now();

      if (activeUserCountCache && now - activeUserCountCache.timestamp < CACHE_DURATION_MS) {
        logger.debug("Returning cached active user count", {
          count: activeUserCountCache.count,
          age: `${Math.floor((now - activeUserCountCache.timestamp) / 1000 / 60 / 60)}h`,
        });
        return success(activeUserCountCache.count);
      }

      logger.debug("Fetching fresh active user count from database");

      const [{ total }] = await db
        .select({ total: count() })
        .from(users)
        .where(eq(users.isActive, true));

      activeUserCountCache = {
        count: total,
        timestamp: now,
      };

      logger.debug("Active user count fetched and cached", { count: total });

      return success(total);
    } catch (error) {
      logger.error("Error getting active user count", parseError(error));
      return fail({
        message: "app.api.user.errors.count_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
  static async getUserPublicName(
    userId: string | undefined,
    logger: EndpointLogger,
  ): Promise<string | null> {
    if (!userId) {
      return null;
    }

    try {
      const userResult = await db
        .select({ publicName: users.publicName })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (userResult.length === 0) {
        logger.warn("User not found when fetching public name", { userId });
        return null;
      }

      return userResult[0].publicName || null;
    } catch (error) {
      logger.error("Failed to fetch user public name", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }
}

/**
 * Type for the static interface of UserRepository
 * Used by repository.native.ts for compile-time type checking
 */
export type UserRepositoryType = typeof UserRepository;
