/**
 * User Profile Repository
 * Handles user profile operations with proper interfaces and logger pattern
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPayloadType, JwtPrivatePayloadType } from "../../auth/types";
import { users } from "../../db";
import { UserDetailLevel } from "../../enum";
import { UserRepository } from "../../repository";
import type {
  MeDeleteResponseOutput,
  MeGetResponseOutput,
  MePostRequestOutput,
  MePostResponseOutput,
} from "./definition";

/**
 * User Profile Repository - Static class pattern
 */
export class UserProfileRepository {
  /**
   * Get current user profile or JWT payload
   * @param data - Request data (empty for GET)
   * @param user - User from JWT (public or private)
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns User profile data (full for private, JWT payload for public)
   */
  static async getProfile(
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MeGetResponseOutput>> {
    try {
      // Handle public users - return JWT payload only
      if (user.isPublic) {
        logger.debug("Getting public user JWT payload", {
          leadId: user.leadId,
        });
        return success({
          isPublic: true,
          leadId: user.leadId,
        });
      }

      // Handle private users - return full profile
      if (!user.id) {
        return fail({
          message: "app.api.user.private.me.get.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      const userId: string = user.id;
      logger.debug("Getting user profile", { userId });

      // Get complete user data
      const userResponse = await UserRepository.getUserById(
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
        ...userResponse.data,
        isPublic: false as const,
      } as MeGetResponseOutput);
    } catch (error) {
      logger.error("Error getting user profile", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: "app.api.user.private.me.get.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          userId: user.isPublic ? "public" : (user.id ?? "unknown"),
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
  static async updateProfile(
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
      const userResponse = await UserRepository.getUserById(
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
        const emailExistsResponse = await UserRepository.emailExistsByOtherUser(
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
      const updateData: Record<string, string | boolean | Date | null | undefined> = {
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

      logger.debug("Successfully updated user profile", { userId });

      // Get the updated user data
      const updatedUserResponse = await UserRepository.getUserById(
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
      const changedFields = Object.keys(updateData).filter((key) => key !== "updatedAt");

      // Return the correct response structure with flattened user fields
      return success({
        response: {
          success: true,
          message: "app.api.user.private.me.update.success.message",
          ...updatedUserResponse.data,
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
  static async deleteAccount(
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
      const userResponse = await UserRepository.getUserById(
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
