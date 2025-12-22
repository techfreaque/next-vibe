/**
 * Password Reset Repository
 * Manages password reset tokens and operations
 */

import "server-only";

import { randomBytes } from "node:crypto";

import { and, eq, gt, lt, or } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { RESET_TOKEN_EXPIRY } from "@/config/constants";
import { env } from "@/config/env";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserDetailLevel } from "../../enum";
import { UserRepository } from "../../repository";
import { PasswordUpdateRepository } from "../../private/me/password/repository";
import type { NewPasswordReset, PasswordReset } from "./db";
import { insertPasswordResetSchema, passwordResets } from "./db";
import type { ResetPasswordRequestPostResponseOutput } from "./request/definition";
import type { ResetPasswordValidateGetResponseOutput } from "./validate/definition";

/**
 * Password reset token payload
 */
interface PasswordResetTokenPayload {
  email: string;
  userId: string;
}

/**
 * Password Repository - Static class pattern
 */
export class PasswordRepository {
  /**
   * Find a valid password reset by token
   */
  static async findValidByToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<PasswordReset | null>> {
    try {
      const now = new Date();
      const results = await db
        .select()
        .from(passwordResets)
        .where(
          and(
            eq(passwordResets.token, token),
            gt(passwordResets.expiresAt, now),
          ),
        );

      return success(results.length > 0 ? results[0] : null);
    } catch (error) {
      logger.error("Error finding valid reset token", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.tokenValidationFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Find a password reset by user ID
   */
  static async findByUserId(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<PasswordReset | null>> {
    try {
      const results = await db
        .select()
        .from(passwordResets)
        .where(eq(passwordResets.userId, userId));

      return success(results.length > 0 ? results[0] : null);
    } catch (error) {
      logger.error("Error finding reset by user ID", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.userLookupFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete a password reset by token
   */
  static async deleteByToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<null>> {
    try {
      await db.delete(passwordResets).where(eq(passwordResets.token, token));
      return success(null);
    } catch (error) {
      logger.error("Error deleting reset token", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.tokenDeletionFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete a password reset by user ID
   */
  static async deleteByUserId(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<null>> {
    try {
      await db.delete(passwordResets).where(eq(passwordResets.userId, userId));
      return success(null);
    } catch (error) {
      logger.error("Error deleting reset by user ID", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.userDeletionFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete expired password resets
   */
  static async deleteExpired(logger: EndpointLogger): Promise<ResponseType<null>> {
    try {
      const now = new Date();
      await db
        .delete(passwordResets)
        .where(
          or(
            eq(passwordResets.expiresAt, new Date(0)),
            lt(passwordResets.expiresAt, now),
          ),
        );
      return success(null);
    } catch (error) {
      logger.error("Error deleting expired reset tokens", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.resetFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Generate a JWT token for password reset
   */
  private static async generateJwtToken(
    email: string,
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET_KEY);
      const RESET_TOKEN_EXPIRY_STRING = `${RESET_TOKEN_EXPIRY}h`;
      const randomToken = randomBytes(16).toString("hex");

      const token = await new SignJWT({ email, userId, randomToken })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(RESET_TOKEN_EXPIRY_STRING)
        .sign(SECRET_KEY);

      const expiryDate = new Date(
        Date.now() + RESET_TOKEN_EXPIRY * 60 * 60 * 1000,
      );
      const existingRecordResponse = await this.findByUserId(userId, logger);

      if (existingRecordResponse.success && existingRecordResponse.data) {
        await db
          .update(passwordResets)
          .set({
            token,
            expiresAt: expiryDate,
          })
          .where(eq(passwordResets.userId, userId));
      } else {
        const resetData: NewPasswordReset = {
          userId,
          token,
          expiresAt: expiryDate,
        };

        const validatedData = insertPasswordResetSchema.parse(resetData);

        const results = await db
          .insert(passwordResets)
          .values(validatedData)
          .returning();

        if (!results || results.length === 0) {
          return fail({
            message: "app.api.user.public.resetPassword.errors.tokenCreationFailed",
            errorType: ErrorResponseTypes.DATABASE_ERROR,
          });
        }
      }

      return success(token);
    } catch (error) {
      logger.error("Error generating JWT token", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.tokenCreationFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Verify a JWT token
   */
  private static async verifyJwtToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<PasswordResetTokenPayload>> {
    try {
      const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET_KEY);

      try {
        const { payload } = await jwtVerify<PasswordResetTokenPayload>(
          token,
          SECRET_KEY,
        );

        const resetRecordResponse = await this.findByUserId(payload.userId, logger);
        if (!resetRecordResponse.success || !resetRecordResponse.data) {
          return fail({
            message: "app.api.user.public.resetPassword.errors.tokenInvalid",
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        const resetRecord = resetRecordResponse.data;
        if (resetRecord.expiresAt < new Date()) {
          const deleteResponse = await this.deleteByUserId(payload.userId, logger);
          if (!deleteResponse.success) {
            logger.debug("Failed to delete expired token", { userId: payload.userId });
          }

          return fail({
            message: "app.api.user.public.resetPassword.errors.tokenExpired",
            errorType: ErrorResponseTypes.TOKEN_EXPIRED_ERROR,
          });
        }

        return success({
          email: payload.email,
          userId: payload.userId,
        });
      } catch (jwtError) {
        logger.debug("Invalid JWT token", parseError(jwtError));
        return fail({
          message: "app.api.user.public.resetPassword.errors.tokenInvalid",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
    } catch (error) {
      logger.error("Error verifying JWT token", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.tokenVerificationFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create a password reset token
   */
  static async createResetToken(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Creating password reset token", { email });

      const userResponse = await UserRepository.getUserByEmail(
        email,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: "app.api.user.public.resetPassword.errors.userNotFound",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const userId = userResponse.data.id;

      return await this.generateJwtToken(email, userId, logger);
    } catch (error) {
      logger.error("Error creating password reset token", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.tokenCreationFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Internal: Verify token and return userId
   */
  private static async verifyTokenInternal(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      const passwordResetResponse = await this.findValidByToken(token, logger);

      if (!passwordResetResponse.success || !passwordResetResponse.data) {
        return fail({
          message: "app.api.user.public.resetPassword.errors.tokenInvalid",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(passwordResetResponse.data.userId);
    } catch (error) {
      logger.error("Error verifying password reset token", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.tokenVerificationFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Verify a password reset token - returns full endpoint response
   */
  static async verifyResetToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<ResetPasswordValidateGetResponseOutput>> {
    logger.debug("Verifying password reset token");

    const verifyResult = await this.verifyTokenInternal(token, logger);

    if (!verifyResult.success) {
      return verifyResult;
    }

    return success({
      response: {
        valid: true,
        message: "app.api.user.public.resetPassword.validate.response.validationMessage",
        userId: verifyResult.data,
        expiresAt: undefined,
        nextSteps: [
          "app.api.user.public.resetPassword.validate.response.nextSteps.steps.0",
          "app.api.user.public.resetPassword.validate.response.nextSteps.steps.1",
        ],
      },
    });
  }

  /**
   * Handle password reset request - returns full endpoint response
   * The email handler does the actual token creation work
   */
  static async handleResetRequest(
    logger: EndpointLogger,
  ): Promise<ResponseType<ResetPasswordRequestPostResponseOutput>> {
    logger.debug("Password reset request processed");
    return success({
      response: {
        success: true,
        message: "app.api.user.public.resetPassword.request.response.success.message",
        nextSteps: [
          "app.api.user.public.resetPassword.request.response.nextSteps.checkEmail",
          "app.api.user.public.resetPassword.request.response.nextSteps.clickLink",
          "app.api.user.public.resetPassword.request.response.nextSteps.createPassword",
        ],
      },
    });
  }

  /**
   * Reset a password using a token
   */
  private static async resetPassword(
    token: string,
    newPassword: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<null>> {
    try {
      logger.debug("Resetting password with token");

      const verifyResponse = await this.verifyTokenInternal(token, logger);
      if (!verifyResponse.success) {
        return verifyResponse as ResponseType<null>;
      }

      const userId = verifyResponse.data;

      const updatedUser = await PasswordUpdateRepository.setPassword(
        userId,
        newPassword,
        logger,
      );

      if (!updatedUser) {
        return fail({
          message: "app.api.user.public.resetPassword.errors.passwordUpdateFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      await this.deleteByToken(token, logger);

      return success(null);
    } catch (error) {
      logger.error("Error resetting password with token", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.passwordResetFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Request a password reset
   */
  static async requestPasswordReset(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Password reset request received", { email });

      await this.createResetToken(email, locale, logger);

      // We don't want to reveal if the email exists or not for security reasons
      return success("app.api.user.auth.resetPassword.emailSent");
    } catch (error) {
      logger.error("Error requesting password reset", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.requestFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Confirm a password reset
   */
  static async confirmPasswordReset(
    token: string,
    email: string,
    password: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Processing password reset confirmation", { email });

      const resetPayloadResponse = await this.verifyJwtToken(token, logger);
      if (!resetPayloadResponse.success) {
        return fail({
          message: "app.api.user.public.resetPassword.errors.tokenExpired",
          errorType: ErrorResponseTypes.TOKEN_EXPIRED_ERROR,
        });
      }

      const resetPayload = resetPayloadResponse.data;

      if (resetPayload.email !== email) {
        logger.debug("Email mismatch", { email, tokenEmail: resetPayload.email });
        return fail({
          message: "app.api.user.public.resetPassword.errors.emailMismatch",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const userResponse = await UserRepository.getUserById(
        resetPayload.userId,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: "app.api.user.public.resetPassword.errors.userNotFound",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const updateResponse = await this.resetPassword(token, password, logger);
      if (!updateResponse.success) {
        return updateResponse as ResponseType<string>;
      }

      logger.debug("Password reset successful", { userId: resetPayload.userId, email });
      return success("app.api.user.auth.resetPassword.success");
    } catch (error) {
      logger.error("Error confirming password reset", parseError(error));
      return fail({
        message: "app.api.user.public.resetPassword.errors.confirmationFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
