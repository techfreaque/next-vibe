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

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadAuthRepository } from "../leads/auth/repository";
import { userLeadLinks } from "../leads/db";
import { scopedTranslation as authScopedTranslation } from "./auth/i18n";
import { AuthRepository } from "./auth/repository";
import type { NewUser, User } from "./db";
import { users } from "./db";
import { UserDetailLevel } from "./enum";
import { scopedTranslation as userScopedTranslation } from "./i18n";
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
 * User Repository
 */
export class UserRepository {
  /**
   * 24h cache for active user count
   */
  private static activeUserCountCache: {
    count: number;
    timestamp: number;
  } | null = null;
  private static readonly CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
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

      logger.debug(
        `Getting user by auth (roles: ${roles.map(String).join(", ")}, detailLevel: ${String(detailLevel)})`,
      );

      const { t: authT } = authScopedTranslation.scopedT(locale);
      const { t } = userScopedTranslation.scopedT(locale);
      const verifiedUser = await AuthRepository.getAuthMinimalUser(
        roles,
        { platform: Platform.NEXT_PAGE, locale },
        logger,
      );

      if (!verifiedUser) {
        return fail({
          message: t("errors.auth_required"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          messageParams: { roles: roles.join(",") },
        });
      }

      if (detailLevel === UserDetailLevel.MINIMAL) {
        return success(verifiedUser) as ResponseType<UserType<T>>;
      }

      if (
        verifiedUser.isPublic ||
        !("id" in verifiedUser) ||
        !verifiedUser.id
      ) {
        logger.debug("No user ID in JWT payload (public user)", {
          isPublic: verifiedUser.isPublic,
        });
        return fail({
          message: authT("errors.jwt_payload_missing_id"),
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
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.auth_retrieval_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get user by ID with specified detail level
   */
  static async getUserById<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
    userId: string,
    detailLevel: T = UserDetailLevel.STANDARD as T,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    try {
      const { t } = userScopedTranslation.scopedT(locale);
      const results = await db.select().from(users).where(eq(users.id, userId));

      if (results.length === 0) {
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
        });
      }

      const user = results[0];

      const userRolesResponse = await UserRolesRepository.findByUserId(
        userId,
        logger,
        locale,
      );
      if (!userRolesResponse.success) {
        return fail({
          message: t("errors.roles_lookup_failed"),
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
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.id_lookup_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { userId, error: parseError(error).message },
      });
    }
  }

  /**
   * Get user by email with specified detail level
   */
  static async getUserByEmail<
    T extends ExtendedUserDetailLevel = typeof UserDetailLevel.STANDARD,
  >(
    email: string,
    detailLevel: T = UserDetailLevel.STANDARD as T,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExtendedUserType<T>>> {
    try {
      const { t } = userScopedTranslation.scopedT(locale);
      const results = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email));

      if (results.length === 0) {
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { email },
        });
      }

      return await UserRepository.getUserById(
        results[0].id,
        detailLevel,
        locale,
        logger,
      );
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Error getting user by email", "");
      logger.debug("Error getting user by email", parseError(error));
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.email_lookup_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { email, error: errorMessage },
      });
    }
  }

  /**
   * Check if user exists by ID
   */
  static async exists(
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<boolean>> {
    try {
      const results = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      return success(results.length > 0);
    } catch (error) {
      logger.error("Error checking if user exists", parseError(error));
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.id_lookup_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { userId, error: parseError(error).message },
      });
    }
  }

  /**
   * Check if an email is already registered
   */
  static async emailExists(
    email: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<boolean>> {
    try {
      const results = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return success(results.length > 0);
    } catch (error) {
      logger.error("Error checking if email exists", parseError(error));
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.email_check_failed"),
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
    excludeUserId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<boolean>> {
    try {
      const results = await db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.email, email), not(eq(users.id, excludeUserId))))
        .limit(1);

      return success(results.length > 0);
    } catch (error) {
      logger.error(
        "Error checking if email exists by other user",
        parseError(error),
      );
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.email_duplicate_check_failed"),
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
    locale: CountryLanguage,
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
      const rolesMapResponse = await UserRolesRepository.findByUserIds(
        userIds,
        logger,
        locale,
      );

      if (!rolesMapResponse.success) {
        const { t } = userScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.roles_batch_fetch_failed"),
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
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.search_failed"),
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
    locale: CountryLanguage,
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
      const rolesMapResponse = await UserRolesRepository.findByUserIds(
        userIds,
        logger,
        locale,
      );

      if (!rolesMapResponse.success) {
        const { t } = userScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.roles_batch_fetch_failed"),
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
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.search_failed"),
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
    locale: CountryLanguage,
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
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.search_failed"),
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
    locale: CountryLanguage,
  ): Promise<ResponseType<StandardUserType>> {
    try {
      const hashedPassword = await hashPassword(data.password);

      const hashedData: NewUser = {
        ...data,
        password: hashedPassword,
      };
      const results = await db.insert(users).values(hashedData).returning();
      if (results.length === 0) {
        const { t } = userScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.creation_failed"),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: { error: "no data returned" },
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
      logger.error(
        "Error creating user with hashed password",
        parseError(error),
      );
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.password_hashing_failed"),
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
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      users: Array<StandardUserType & { createdAt: Date; updatedAt: Date }>;
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
      locale,
    );

    if (!searchResult.success) {
      return searchResult;
    }

    const totalCountResult = await UserRepository.getUserSearchCount(
      searchTerm,
      logger,
      locale,
    );

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
          ? user.createdAt
          : new Date(user.createdAt),
      updatedAt:
        user.updatedAt instanceof Date
          ? user.updatedAt
          : new Date(user.updatedAt),
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
  static async getActiveUserCount(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<number>> {
    try {
      const now = Date.now();

      if (
        UserRepository.activeUserCountCache &&
        now - UserRepository.activeUserCountCache.timestamp <
          UserRepository.CACHE_DURATION_MS
      ) {
        logger.debug("Returning cached active user count", {
          count: UserRepository.activeUserCountCache.count,
          age: `${Math.floor((now - UserRepository.activeUserCountCache.timestamp) / 1000 / 60 / 60)}h`,
        });
        return success(UserRepository.activeUserCountCache.count);
      }

      logger.debug("Fetching fresh active user count from database");

      const [{ total }] = await db
        .select({ total: count() })
        .from(users)
        .where(eq(users.isActive, true));

      UserRepository.activeUserCountCache = {
        count: total,
        timestamp: now,
      };

      logger.debug("Active user count fetched and cached", { count: total });

      return success(total);
    } catch (error) {
      logger.error("Error getting active user count", parseError(error));
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.count_failed"),
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

// Type for native repository type checking
export type UserRepositoryType = Pick<
  typeof UserRepository,
  keyof typeof UserRepository
>;
