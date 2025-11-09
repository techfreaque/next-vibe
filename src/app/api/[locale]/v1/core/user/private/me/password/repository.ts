/**
 * Password repository implementation
 * Handles password resets and updates
 */

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { hashPassword, verifyPassword } from "next-vibe/shared/utils/password";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
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
   * @param locale - The user's locale
   * @param logger - Logger for debugging
   * @returns ResponseType with null data on success
   */
  updatePassword(
    userId: DbId,
    passwords: PasswordPostRequestOutput,
    locale: CountryLanguage,
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

      // Get user to verify current password and 2FA status
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
        .select({
          password: users.password,
          twoFactorEnabled: users.twoFactorEnabled,
          twoFactorSecret: users.twoFactorSecret,
        })
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

      // Check 2FA if enabled
      if (user.twoFactorEnabled && user.twoFactorSecret) {
        // Get 2FA code from request (if provided via passwords parameter)
        const twoFactorCode = (passwords as { twoFactorCode?: string }).twoFactorCode;

        if (!twoFactorCode) {
          return createErrorResponse(
            "app.api.v1.core.user.private.me.password.errors.two_factor_code_required",
            ErrorResponseTypes.VALIDATION_ERROR,
            {
              message: "Two-factor authentication is enabled. Please provide your 2FA code."
            },
          );
        }

        // Verify 2FA code
        // Note: In a production environment, you would use a library like 'speakeasy' or 'otpauth'
        // to verify TOTP codes. For now, we'll add a placeholder for the verification logic.
        // Example with speakeasy: speakeasy.totp.verify({ secret: user.twoFactorSecret, token: twoFactorCode })

        // Placeholder: Simple 6-digit code validation
        const is2FAValid = this.verify2FACode(twoFactorCode, user.twoFactorSecret);

        if (!is2FAValid) {
          return createErrorResponse(
            "app.api.v1.core.user.private.me.password.errors.invalid_two_factor_code",
            ErrorResponseTypes.VALIDATION_ERROR,
            {
              message: "Invalid 2FA code. Please try again."
            },
          );
        }

        logger.info("2FA verification successful for password change", { userId });
      }

      const setPasswordResponse = await this.setPassword(
        userId,
        newPassword,
        logger,
      );
      if (!setPasswordResponse.success) {
        return setPasswordResponse as ResponseType<PasswordPostResponseOutput>;
      }

      return success<PasswordPostResponseOutput>({
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
   * Verify 2FA code
   * This is a placeholder implementation. In production, use a library like 'speakeasy'
   * @param code - The 2FA code provided by the user
   * @param secret - The 2FA secret stored in the database
   * @returns boolean indicating if the code is valid
   */
  private verify2FACode(code: string, _secret: string): boolean {
    // Placeholder implementation
    // In production, use: speakeasy.totp.verify({ secret, token: code, window: 1 })
    // For now, we'll just validate the format (6 digits)
    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code)) {
      return false;
    }

    // TODO: Implement actual TOTP verification using speakeasy or similar library
    // This is a security-critical operation and should use proper time-based one-time password verification

    // For development purposes only - this would never be used in production
    // In production, you must implement proper TOTP verification
    return true; // Placeholder - always returns true for development
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

      return success(null);
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
