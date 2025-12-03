/**
 * User Profile Repository
 * Handles user profile operations with proper interfaces and logger pattern
 */

import "server-only";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  fail,
  success,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPrivatePayloadType } from "../../auth/types";
import { users } from "../../db";
import { UserDetailLevel } from "../../enum";
import { userRepository } from "../../repository";
import type {
  MeDeleteRequestOutput,
  MeDeleteResponseOutput,
  MeGetRequestOutput,
  MeGetResponseOutput,
  MePostRequestOutput,
  MePostResponseOutput,
} from "./definition";

/**
 * User Profile Repository Interface
 * Defines all user profile operations
 */
export interface UserProfileRepository {
  /**
   * Get current user profile
   * @param data - Request data (empty for GET)
   * @param user - User from JWT
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns User profile data
   */
  getProfile(
    data: MeGetRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MeGetResponseOutput>>;

  /**
   * Update a user's profile
   * @param data - The user data to update
   * @param user - User from JWT
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns ResponseType with updated user information
   */
  updateProfile(
    data: MePostRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MePostResponseOutput>>;

  /**
   * Delete a user account
   * @param data - Request data (empty for DELETE)
   * @param user - User from JWT
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns ResponseType with deletion status
   */
  deleteAccount(
    data: MeDeleteRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MeDeleteResponseOutput>>;
}

/**
 * User Profile Repository Implementation
 */
export class UserProfileRepositoryImpl implements UserProfileRepository {
  /**
   * Get current user profile
   * @param data - Request data (empty for GET)
   * @param user - User from JWT
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns User profile data
   */
  async getProfile(
    data: MeGetRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MeGetResponseOutput>> {
    try {
      if (!user.id) {
        return fail({
          message: "app.api.user.private.me.get.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      const userId: string = user.id; // We know it exists due to check above
      logger.debug("Getting user profile", { userId });

      // Get complete user data
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.COMPLETE,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: "app.api.user.private.me.get.errors.internal.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
          cause: userResponse,
        });
      }

      logger.debug("Successfully retrieved user profile", { userId });
      return success({
        user: userResponse.data,
      });
    } catch (error) {
      logger.error("Error getting user profile", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: "app.api.user.private.me.get.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          userId: user.id ?? "unknown",
          error: parsedError.message,
        },
      });
    }
  }

  /**
   * Update a user's profile
   * @param data - The user data to update
   * @param user - User from JWT
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns ResponseType with updated user information
   */
  async updateProfile(
    data: MePostRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MePostResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      if (!user.id) {
        return fail({
          message: "app.api.user.private.me.update.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      const userId: string = user.id;
      logger.debug("Updating user profile", { userId, data });

      // Check if user exists
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.COMPLETE,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: "app.api.user.private.me.update.errors.unauthorized.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
          cause: userResponse,
        });
      }

      const currentUser = userResponse.data;

      // Verify email is not taken by another user
      if (data.basicInfo?.email && data.basicInfo.email !== currentUser.email) {
        const emailExistsResponse = await userRepository.emailExistsByOtherUser(
          data.basicInfo.email,
          userId,
          logger,
        );

        if (emailExistsResponse.success && emailExistsResponse.data) {
          return fail({
            message: "app.api.user.auth.errors.validation_failed",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: {
              field: "email",
              message: t("app.api.user.errors.emailAlreadyInUse"),
            },
          });
        }
      }

      // Flatten the nested data structure for database update
      const updateData: Record<
        string,
        string | boolean | Date | null | undefined
      > = {
        updatedAt: new Date(),
      };

      // Flatten basicInfo fields
      if (data.basicInfo) {
        if (data.basicInfo.privateName !== undefined) {
          updateData.privateName = data.basicInfo.privateName;
        }
        if (data.basicInfo.publicName !== undefined) {
          updateData.publicName = data.basicInfo.publicName;
        }
        if (data.basicInfo.email !== undefined) {
          updateData.email = data.basicInfo.email;
        }
      }

      // Handle marketingConsent from privacySettings
      if (data.privacySettings?.marketingConsent !== undefined) {
        updateData.marketingConsent = data.privacySettings.marketingConsent;
      }

      // Update user in database
      await db.update(users).set(updateData).where(eq(users.id, userId));

      // Revalidate relevant paths
      revalidatePath(`/${locale}/dashboard/profile`);
      revalidatePath(`/${locale}/profile`);

      logger.debug("Successfully updated user profile", { userId });

      // Get the updated user data
      const updatedUserResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.COMPLETE,
        locale,
        logger,
      );
      if (!updatedUserResponse.success) {
        return fail({
          message: "app.api.user.private.me.update.errors.internal.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: updatedUserResponse,
        });
      }

      // Create list of changed fields
      const changedFields = Object.keys(updateData).filter(
        (key) => key !== "updatedAt",
      );

      // Return the correct response structure
      return success({
        response: {
          success: true,
          message: "app.api.user.private.me.update.success.message",
          user: updatedUserResponse.data,
          changesSummary: {
            totalChanges: changedFields.length,
            changedFields: changedFields,
            verificationRequired: false,
            lastUpdated: new Date().toISOString(),
          },
          nextSteps: [t("app.api.user.private.me.update.success.nextSteps")],
        },
      });
    } catch (error) {
      logger.error("Error updating user profile", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: "app.api.user.private.me.update.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          userId: user.id ?? "unknown",
          error: parsedError.message,
        },
      });
    }
  }

  /**
   * Delete a user account
   * @param data - Request data (empty for DELETE)
   * @param user - User from JWT
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns ResponseType with deletion status
   */
  async deleteAccount(
    data: MeDeleteRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MeDeleteResponseOutput>> {
    try {
      if (!user.id) {
        return fail({
          message: "app.api.user.private.me.delete.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      const userId: string = user.id;
      logger.debug("Deleting user account", { userId });

      // Check if user exists
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.COMPLETE,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: "app.api.user.private.me.delete.errors.unauthorized.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
          cause: userResponse,
        });
      }

      // Delete user from database
      // In a real implementation, you might want to soft delete instead
      await db.delete(users).where(eq(users.id, userId));

      logger.debug("Successfully deleted user account", { userId });

      return success({
        exists: true,
      });
    } catch (error) {
      logger.error("Error deleting user account", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: "app.api.user.private.me.delete.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          userId: user.id ?? "unknown",
          error: parsedError.message,
        },
      });
    }
  }
}

/**
 * User profile repository singleton instance
 */
export const userProfileRepository = new UserProfileRepositoryImpl();
