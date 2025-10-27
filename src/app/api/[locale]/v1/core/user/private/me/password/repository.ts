/**
 * Password repository implementation
 * Handles password resets and updates
 */

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { hashPassword, verifyPassword } from "next-vibe/shared/utils/password";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { CountryLanguage } from "@/i18n/core/config";

import { users } from "../../../db";
import { UserDetailLevel } from "../../../enum";
import { userRepository } from "../../../repository";
import type {
  PasswordPostRequestOutput,
  PasswordPostResponseOutput,
} from "./definition";

/**
 * Password repository interface
 */
export interface PasswordUpdateRepository {
  /**
   * Update a user's password
   * @param userId - The user ID
   * @param passwords - The password data
   * @returns ResponseType with null data on success
   */
  updatePassword(
    userId: DbId,
    passwords: PasswordPostRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<PasswordPostResponseOutput>>;

  /**
   * Set a user's password
   * This is used for initial password setup and password reset
   * @param userId - The user ID
   * @param newPassword - The new password
   * @returns ResponseType with null data on success
   */
  setPassword(
    userId: DbId,
    newPassword: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<null>>;
}

/**
 * Password repository implementation
 */
export class PasswordUpdateRepositoryImpl implements PasswordUpdateRepository {
  /**
   * Update a user's password
   * @param userId - The user ID
   * @param passwords - The password data
   * @returns ResponseType with null data on success
   */
  async updatePassword(
    userId: DbId,
    passwords: PasswordPostRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PasswordPostResponseOutput>> {
    try {
      logger.debug(
        "app.api.v1.core.user.private.me.password.debug.updatingPassword",
        { userId },
      );

      // Safely access nested properties
      if (!passwords.currentCredentials || !passwords.newCredentials) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.password.errors.invalid_request.title",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      const currentCredentials = passwords.currentCredentials as {
        currentPassword: string;
      };
      const newCredentials = passwords.newCredentials as {
        newPassword: string;
        confirmPassword: string;
      };

      const { currentPassword } = currentCredentials;
      const { newPassword, confirmPassword } = newCredentials;

      // Validate passwords match
      if (newPassword !== confirmPassword) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.password.errors.passwords_do_not_match",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Get user to verify current password
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.password.errors.user_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      // Verify current password
      const user = await db
        .select({ password: users.password })
        .from(users)
        .where(eq(users.id, userId))
        .then((results) => results[0]);

      if (!user) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.password.errors.user_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      // Check if current password is correct
      const isPasswordValid = await verifyPassword(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.password.errors.incorrect_password",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      const setPasswordResponse = await this.setPassword(
        userId,
        newPassword,
        logger,
      );
      if (!setPasswordResponse.success) {
        return setPasswordResponse as ResponseType<PasswordPostResponseOutput>;
      }

      return createSuccessResponse<PasswordPostResponseOutput>({
        response: {
          success: true,
          message: "app.api.v1.core.user.private.me.password.success.updated",
          securityTip:
            "app.api.v1.core.user.private.me.password.success.securityTip",
          nextSteps: [
            "app.api.v1.core.user.private.me.password.success.nextSteps.logoutOther",
            "app.api.v1.core.user.private.me.password.success.nextSteps.enable2fa",
          ],
        },
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.private.me.password.debug.errorUpdatingPassword",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.private.me.password.errors.update_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        {
          userId,
          error: parseError(error).message,
        },
      );
    }
  }

  /**
   * Set a user's password
   * This is used for initial password setup and password reset
   * @param userId - The user ID
   * @param newPassword - The new password
   * @returns ResponseType with null data on success
   */
  async setPassword(
    userId: DbId,
    newPassword: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<null>> {
    try {
      logger.debug(
        "app.api.v1.core.user.private.me.password.debug.settingPassword",
        { userId },
      );

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password in database
      await db
        .update(users)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return createSuccessResponse(null);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.private.me.password.debug.errorSettingPassword",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.private.me.password.errors.token_creation_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        {
          userId,
          error: parseError(error).message,
        },
      );
    }
  }
}

// Export singleton instance of the repository
export const passwordUpdateRepository = new PasswordUpdateRepositoryImpl();
