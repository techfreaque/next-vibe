/**
 * User Profile Repository
 * Handles user profile operations with proper interfaces and logger pattern
 */

import "server-only";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPrivatePayloadType } from "../../auth/definition";
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
        return createErrorResponse(
          "app.api.v1.core.user.private.me.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }
      const userId: string = user.id; // We know it exists due to check above
      logger.debug("Getting user profile", { userId });

      // Get complete user data
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.COMPLETE,
        logger,
      );
      if (!userResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.get.errors.internal.title",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      logger.debug("Successfully retrieved user profile", { userId });
      return createSuccessResponse({
        user: userResponse.data,
      });
    } catch (error) {
      logger.error("Error getting user profile", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.user.private.me.get.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { userId: user.id ?? "unknown", error: parsedError.message },
      );
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
        return createErrorResponse(
          "app.api.v1.core.user.private.me.update.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }
      const userId: string = user.id;
      logger.debug("Updating user profile", { userId, data });

      // Check if user exists
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.COMPLETE,
        logger,
      );
      if (!userResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.update.errors.unauthorized.title",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
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
          return createErrorResponse(
            "auth.errors.validation_failed",
            ErrorResponseTypes.VALIDATION_ERROR,
            {
              field: "email",
              message: t("app.api.v1.core.user.errors.emailAlreadyInUse"),
            },
          );
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
        if (data.basicInfo.firstName !== undefined) {
          updateData.firstName = data.basicInfo.firstName;
        }
        if (data.basicInfo.lastName !== undefined) {
          updateData.lastName = data.basicInfo.lastName;
        }
        if (data.basicInfo.email !== undefined) {
          updateData.email = data.basicInfo.email;
        }
      }

      // Flatten profileDetails fields
      if (data.profileDetails) {
        if (data.profileDetails.imageUrl !== undefined) {
          updateData.imageUrl = data.profileDetails.imageUrl;
        }
        if (data.profileDetails.company !== undefined) {
          updateData.company = data.profileDetails.company;
        }
      }

      // Handle visibility field from privacySettings
      if (data.privacySettings?.visibility) {
        // Handle both single value and array for visibility
        if (Array.isArray(data.privacySettings.visibility)) {
          updateData.visibility =
            data.privacySettings.visibility.length > 0
              ? String(data.privacySettings.visibility[0])
              : undefined;
        } else {
          updateData.visibility = String(data.privacySettings.visibility);
        }
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
        logger,
      );
      if (!updatedUserResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.update.errors.internal.title",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      // Create list of changed fields
      const changedFields = Object.keys(updateData).filter(
        (key) => key !== "updatedAt",
      );

      // Return the correct response structure
      return createSuccessResponse({
        response: {
          success: true,
          message: "app.api.v1.core.user.private.me.update.success.message",
          user: updatedUserResponse.data,
          changesSummary: {
            totalChanges: changedFields.length,
            changedFields: changedFields,
            verificationRequired: false,
            lastUpdated: new Date().toISOString(),
          },
          nextSteps: [
            t("app.api.v1.core.user.private.me.update.success.nextSteps"),
          ],
        },
      });
    } catch (error) {
      logger.error("Error updating user profile", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.user.private.me.update.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { userId: user.id ?? "unknown", error: parsedError.message },
      );
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
        return createErrorResponse(
          "app.api.v1.core.user.private.me.delete.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }
      const userId: string = user.id;
      logger.debug("Deleting user account", { userId });

      // Check if user exists
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.COMPLETE,
        logger,
      );
      if (!userResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.delete.errors.unauthorized.title",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      // Delete user from database
      // In a real implementation, you might want to soft delete instead
      await db.delete(users).where(eq(users.id, userId));

      logger.debug("Successfully deleted user account", { userId });

      return createSuccessResponse({
        exists: true,
      });
    } catch (error) {
      logger.error("Error deleting user account", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.user.private.me.delete.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { userId: user.id ?? "unknown", error: parsedError.message },
      );
    }
  }
}

/**
 * User profile repository singleton instance
 */
export const userProfileRepository = new UserProfileRepositoryImpl();
