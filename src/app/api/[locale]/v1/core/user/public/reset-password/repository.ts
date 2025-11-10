/**
 * Password reset repository
 * Manages password reset tokens and operations
 */

import "server-only";

import { randomBytes } from "node:crypto";

import { and, eq, gt, lt, or } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { RESET_TOKEN_EXPIRY } from "@/config/constants";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserDetailLevel } from "../../enum";
import { passwordUpdateRepository } from "../../private/me/password/repository";
import { userRepository } from "../../repository";
import type { NewPasswordReset, PasswordReset } from "./db";
import { insertPasswordResetSchema, passwordResets } from "./db";

/**
 * Password reset token payload
 */
export interface PasswordResetTokenPayload {
  email: string;
  userId: string;
}

/**
 * Password reset repository interface
 * Combines database operations and API methods
 */
export interface PasswordRepository {
  /**
   * Find a valid password reset by token
   */
  findValidByToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<PasswordReset | null>>;

  /**
   * Find a password reset by user ID
   */
  findByUserId(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<PasswordReset | null>>;

  /**
   * Delete a password reset by token
   */
  deleteByToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<null>>;

  /**
   * Delete a password reset by user ID
   */
  deleteByUserId(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<null>>;

  /**
   * Delete expired password resets
   */
  deleteExpired(logger: EndpointLogger): Promise<ResponseType<null>>;

  /**
   * Create a password reset token
   */
  createResetToken(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>>;

  /**
   * Verify a password reset token
   */
  verifyResetToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>>;

  /**
   * Request a password reset
   */
  requestPasswordReset(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>>;

  /**
   * Confirm a password reset
   */
  confirmPasswordReset(
    token: string,
    email: string,
    password: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>>;
}

/**
 * Password repository implementation
 */
export class PasswordRepositoryImpl implements PasswordRepository {
  /**
   * Find a password reset by token (alias for findValidByToken for compatibility)
   */
  async findByToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<PasswordReset | null>> {
    return await this.findValidByToken(token, logger);
  }

  /**
   * Find a valid password reset by token
   */
  async findValidByToken(
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
      logger.error("Error finding valid reset token", {
        error: parseError(error),
        token,
      });
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenValidationFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { operation: "findValidByToken" },
      });
    }
  }

  /**
   * Find a password reset by user ID
   */
  async findByUserId(
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
      logger.error("Error finding reset by user ID", {
        error: parseError(error),
        userId,
      });
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.userLookupFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { userId, operation: "findByUserId" },
      });
    }
  }

  /**
   * Delete a password reset by token
   */
  async deleteByToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<null>> {
    try {
      await db.delete(passwordResets).where(eq(passwordResets.token, token));
      return success(null);
    } catch (error) {
      logger.error("Error deleting reset token", {
        error: parseError(error),
        token,
      });
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenDeletionFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { operation: "deleteByToken" },
      });
    }
  }

  /**
   * Delete a password reset by user ID
   */
  async deleteByUserId(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<null>> {
    try {
      await db.delete(passwordResets).where(eq(passwordResets.userId, userId));
      return success(null);
    } catch (error) {
      logger.error("Error deleting reset by user ID", {
        error: parseError(error),
        userId,
      });
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.userDeletionFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { userId, operation: "deleteByUserId" },
      });
    }
  }

  /**
   * Delete expired password resets
   */
  async deleteExpired(logger: EndpointLogger): Promise<ResponseType<null>> {
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
      logger.error("Error deleting expired reset tokens", {
        error: parseError(error),
      });
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.resetFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { operation: "deleteExpired" },
      });
    }
  }

  /**
   * Generate a JWT token for password reset
   */
  private async generateJwtToken(
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
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenCreationFailed",
          errorType: ErrorResponseTypes.DATABASE_ERROR,
                      messageParams: {
              error:
                "app.api.v1.core.user.public.resetPassword.errors.noDataReturned",
            },
      });
        }
      }

      return success(token);
    } catch (error) {
      logger.error("Error generating JWT token", {
        error: parseError(error),
        email,
        userId,
      });
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenCreationFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { email, userId, operation: "generateJwtToken" },
      });
    }
  }

  /**
   * Verify a JWT token
   */
  private async verifyJwtToken(
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

        const resetRecordResponse = await this.findByUserId(
          payload.userId,
          logger,
        );
        if (!resetRecordResponse.success || !resetRecordResponse.data) {
          return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenInvalid",
          errorType: ErrorResponseTypes.NOT_FOUND,
      });
        }

        const resetRecord = resetRecordResponse.data;
        if (resetRecord.expiresAt < new Date()) {
          const deleteResponse = await this.deleteByUserId(
            payload.userId,
            logger,
          );
          if (!deleteResponse.success) {
            logger.debug("Failed to delete expired token", {
              userId: payload.userId,
            });
          }

          return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenExpired",
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
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenInvalid",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
      }
    } catch (error) {
      logger.error("Error verifying JWT token", parseError(error));
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenVerificationFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { operation: "verifyJwtToken" },
      });
    }
  }

  /**
   * Create a password reset token
   */
  async createResetToken(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Creating password reset token", { email });

      // Find user by email
      const userResponse = await userRepository.getUserByEmail(
        email,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.userNotFound",
          errorType: ErrorResponseTypes.NOT_FOUND,
                    messageParams: { email },
      });
      }

      const userId = userResponse.data.id;

      // Generate token using JWT
      return await this.generateJwtToken(email, userId, logger);
    } catch (error) {
      logger.error("Error creating password reset token", {
        error: parseError(error),
        email,
      });
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenCreationFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { email, operation: "createResetToken" },
      });
    }
  }

  /**
   * Verify a password reset token
   */
  async verifyResetToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Verifying password reset token");

      // Find token in database
      const passwordResetResponse = await this.findValidByToken(token, logger);

      if (!passwordResetResponse.success || !passwordResetResponse.data) {
        return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenInvalid",
          errorType: ErrorResponseTypes.NOT_FOUND,
      });
      }

      return success(passwordResetResponse.data.userId);
    } catch (error) {
      logger.error("Error verifying password reset token", {
        error: parseError(error),
      });
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenVerificationFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { operation: "verifyResetToken" },
      });
    }
  }

  /**
   * Reset a password using a token
   */
  private async resetPassword(
    token: string,
    newPassword: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<null>> {
    try {
      logger.debug("Resetting password with token");

      // Verify token and get user ID
      const verifyResponse = await this.verifyResetToken(token, logger);
      if (!verifyResponse.success) {
        return verifyResponse as ResponseType<null>;
      }

      const userId = verifyResponse.data;

      // Update password
      const updatedUser = await passwordUpdateRepository.setPassword(
        userId,
        newPassword,
        logger,
      );

      if (!updatedUser) {
        return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.passwordUpdateFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                    messageParams: { userId },
      });
      }

      // Delete the used token
      await this.deleteByToken(token, logger);

      return success(null);
    } catch (error) {
      logger.error("Error resetting password with token", {
        error: parseError(error),
        token,
      });
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.passwordResetFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { operation: "resetPassword" },
      });
    }
  }

  /**
   * Request a password reset
   */
  async requestPasswordReset(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Password reset request received", { email });

      // Create a password reset token
      await this.createResetToken(email, locale, logger);

      // We don't want to reveal if the email exists or not for security reasons
      // So we always return a success message
      return success(
        "app.api.v1.core.user.auth.resetPassword.emailSent",
      );
    } catch (error) {
      logger.error("Error requesting password reset", {
        error: parseError(error),
        email,
      });
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.requestFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { email, operation: "requestPasswordReset" },
      });
    }
  }

  /**
   * Confirm a password reset
   */
  async confirmPasswordReset(
    token: string,
    email: string,
    password: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Processing password reset confirmation", {
        email,
      });

      // Verify the reset token
      const resetPayloadResponse = await this.verifyJwtToken(token, logger);
      if (!resetPayloadResponse.success) {
        logger.debug("Invalid or expired token", { email });
        return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.tokenExpired",
          errorType: ErrorResponseTypes.TOKEN_EXPIRED_ERROR,
      });
      }

      const resetPayload = resetPayloadResponse.data;

      // Verify that the email matches the token
      if (resetPayload.email !== email) {
        logger.debug("Email mismatch", {
          email,
          tokenEmail: resetPayload.email,
        });
        return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.emailMismatch",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
                    messageParams: { email, tokenEmail: resetPayload.email },
      });
      }

      // Find the user
      const userResponse = await userRepository.getUserById(
        resetPayload.userId,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!userResponse.success) {
        logger.debug("User not found", { userId: resetPayload.userId });
        return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.userNotFound",
          errorType: ErrorResponseTypes.NOT_FOUND,
                    messageParams: { userId: resetPayload.userId },
      });
      }

      // Update the user's password
      const updateResponse = await this.resetPassword(token, password, logger);
      if (!updateResponse.success) {
        return updateResponse as ResponseType<string>;
      }

      logger.debug("Password reset successful", {
        userId: resetPayload.userId,
        email,
      });
      return success(
        "app.api.v1.core.user.auth.resetPassword.success",
      );
    } catch (error) {
      logger.error("Error confirming password reset", {
        error: parseError(error),
        email,
      });
      return fail({
          message: "app.api.v1.core.user.public.resetPassword.errors.confirmationFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: { email, operation: "confirmPasswordReset" },
      });
    }
  }
}

// Export singleton instance of the repository
export const passwordRepository = new PasswordRepositoryImpl();
