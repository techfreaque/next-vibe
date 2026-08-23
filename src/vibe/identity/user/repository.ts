/**
 * User Repository
 * Core functionality for user operations
 */

import "server-only";

import { and, eq, not } from "drizzle-orm";

import type { CountryLanguage } from "../../core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import { db } from "../../database";
import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";
import { scopedTranslation as authScopedTranslation } from "../auth/i18n";
import { hashPassword } from "../auth/password";
import { AuthRepository } from "../auth/repository";
import { LeadAuthRepository } from "../lead/device-auth";
import { UserRole, type UserRoleValue } from "../roles/enum";
import { UserRolesRepository } from "../roles/repository";
import type { NewUser } from "./db";
import { users } from "./db";
import { UserDetailLevel } from "./enum";
import { scopedTranslation as userScopedTranslation } from "./i18n";
import type {
  CompleteUserType,
  ExtendedUserDetailLevel,
  ExtendedUserType,
  StandardUserType,
  UserFetchOptions,
  UserType,
} from "./types";

/**
 * Derive a URL-safe slug from a display name.
 * "Jane Doe" → "jane-doe", "Ünïcödé!" → "unicode"
 */
export function deriveSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036F]/g, "") // strip diacritics
    .replaceAll(/[^a-z0-9\s-]/g, "") // keep alphanumeric, spaces, hyphens
    .trim()
    .replaceAll(/[\s]+/g, "-") // spaces → hyphens
    .replaceAll(/-{2,}/g, "-") // collapse multiple hyphens
    .slice(0, 60); // max length
}

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
          message: t("errors.auth_required", { roles: roles.join(",") }),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
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
        message: t("errors.auth_retrieval_failed", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
          message: t("errors.not_found_by_id", { userId }),
          errorType: ErrorResponseTypes.NOT_FOUND,
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
          message: t("errors.roles_lookup_failed", { userId }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
        roles: userRolesResponse.data.map((r) => r.role),
      };

      if (detailLevel === UserDetailLevel.STANDARD) {
        return success(standardUser) as ResponseType<ExtendedUserType<T>>;
      }

      const completeUser: CompleteUserType = {
        ...standardUser,
        stripeCustomerId: user.stripeCustomerId,
        creatorSlug: user.creatorSlug ?? deriveSlug(user.publicName),
        bio: user.bio,
        websiteUrl: user.websiteUrl,
        twitterUrl: user.twitterUrl,
        youtubeUrl: user.youtubeUrl,
        instagramUrl: user.instagramUrl,
        tiktokUrl: user.tiktokUrl,
        githubUrl: user.githubUrl,
        discordUrl: user.discordUrl,
        facebookUrl: user.facebookUrl,
        tribeUrl: user.tribeUrl,
        rumbleUrl: user.rumbleUrl,
        odyseeUrl: user.odyseeUrl,
        nostrUrl: user.nostrUrl,
        gabUrl: user.gabUrl,
        creatorAccentColor: user.creatorAccentColor,
        creatorHeaderImageUrl: user.creatorHeaderImageUrl,
        avatarUrl: user.avatarUrl,
      };

      return success(completeUser) as ResponseType<ExtendedUserType<T>>;
    } catch (error) {
      logger.error("Error getting user by ID", parseError(error));
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.id_lookup_failed", {
          userId,
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
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
      const userId = (
        await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
      )[0]?.id;

      if (!userId) {
        return fail({
          message: t("errors.not_found_by_email", { email }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return await UserRepository.getUserById(
        userId,
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
        message: t("errors.email_lookup_failed", {
          email,
          error: errorMessage,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
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
        message: t("errors.id_lookup_failed", {
          userId,
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
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
      const found =
        (
          await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
        ).length > 0;
      return success(found);
    } catch (error) {
      logger.error("Error checking if email exists", parseError(error));
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.email_check_failed", {
          email,
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
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
        message: t("errors.email_duplicate_check_failed", {
          email,
          excludeUserId,
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
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
      const [inserted] = await db
        .insert(users)
        .values(hashedData)
        .returning({ id: users.id });

      if (!inserted) {
        const { t } = userScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.creation_failed", {
            error: t("errors.no_data_returned"),
          }),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
        });
      }

      return await UserRepository.getUserById(
        inserted.id,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
    } catch (error) {
      logger.error(
        "Error creating user with hashed password",
        parseError(error),
      );
      const { t } = userScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.password_hashing_failed", {
          email: data.email,
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
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
