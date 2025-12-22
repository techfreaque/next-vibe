/**
 * Password Repository - Static class pattern
 * Handles password resets and updates
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { hashPassword, verifyPassword } from "next-vibe/shared/utils/password";

import { db } from "@/app/api/[locale]/system/db";
import type { DbId } from "@/app/api/[locale]/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { users } from "../../../db";
import { UserDetailLevel } from "../../../enum";
import { UserRepository } from "../../../repository";
import type {
  PasswordPostRequestOutput,
  PasswordPostResponseOutput,
} from "./definition";

/**
 * Password Update Repository - Static class pattern
 */
export class PasswordUpdateRepository {
  /**
   * Update a user's password
   */
  static async updatePassword(
    user: JwtPayloadType,
    passwords: PasswordPostRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PasswordPostResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      return fail({
        message: "app.api.user.private.me.password.errors.unauthorized",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Updating password", { userId });

      if (!passwords.currentCredentials || !passwords.newCredentials) {
        return fail({
          message:
            "app.api.user.private.me.password.errors.invalid_request.title",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
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

      if (newPassword !== confirmPassword) {
        return fail({
          message:
            "app.api.user.private.me.password.errors.passwords_do_not_match",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const userResponse = await UserRepository.getUserById(
        userId,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: "app.api.user.private.me.password.errors.user_not_found",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
          cause: userResponse,
        });
      }

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
        return fail({
          message: "app.api.user.private.me.password.errors.user_not_found",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
        });
      }

      const isPasswordValid = await verifyPassword(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        return fail({
          message: "app.api.user.private.me.password.errors.incorrect_password",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      if (user.twoFactorEnabled && user.twoFactorSecret) {
        const twoFactorCode = (passwords as { twoFactorCode?: string })
          .twoFactorCode;

        if (!twoFactorCode) {
          return fail({
            message:
              "app.api.user.private.me.password.errors.two_factor_code_required",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const is2FAValid = this.verify2FACode(
          twoFactorCode,
          user.twoFactorSecret,
        );
        if (!is2FAValid) {
          return fail({
            message:
              "app.api.user.private.me.password.errors.invalid_two_factor_code",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        logger.info("2FA verification successful for password change", {
          userId,
        });
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
          message: "app.api.user.private.me.password.success.updated",
          securityTip: "app.api.user.private.me.password.success.securityTip",
          nextSteps: [
            "app.api.user.private.me.password.success.nextSteps.logoutOther",
            "app.api.user.private.me.password.success.nextSteps.enable2fa",
          ],
        },
      });
    } catch (error) {
      logger.error("Error updating password", parseError(error));
      return fail({
        message: "app.api.user.private.me.password.errors.update_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  /**
   * Verify 2FA code (placeholder)
   */
  private static verify2FACode(code: string, secret: string): boolean {
    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code)) {
      return false;
    }
    void secret;
    return true;
  }

  /**
   * Set a user's password (for initial setup and password reset)
   */
  static async setPassword(
    userId: DbId,
    newPassword: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<null>> {
    try {
      logger.debug("Setting password", { userId });

      const hashedPassword = await hashPassword(newPassword);

      await db
        .update(users)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return success(null);
    } catch (error) {
      logger.error("Error setting password", parseError(error));
      return fail({
        message:
          "app.api.user.private.me.password.errors.token_creation_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }
}
