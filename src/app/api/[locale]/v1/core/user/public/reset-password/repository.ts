/**
 * Password reset repository
 * Manages password reset tokens and operations
 */

import "server-only";

import { randomBytes } from "node:crypto";

import { and, eq, gt, lt, or } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { env } from "next-vibe/server/env";
import { RESET_TOKEN_EXPIRY } from "next-vibe/shared/constants";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

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
    logger: EndpointLogger,
  ): Promise<ResponseType<string>>;

  /**
   * Confirm a password reset
   */
  confirmPasswordReset(
    token: string,
    email: string,
    password: string,
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

      return createSuccessResponse(results.length > 0 ? results[0] : null);
    } catch (error) {
      logger.error("Error finding valid reset token", { error, token });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.token_validation_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { operation: "findValidByToken" },
      );
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

      return createSuccessResponse(results.length > 0 ? results[0] : null);
    } catch (error) {
      logger.error("Error finding reset by user ID", { error, userId });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.user_lookup_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { userId, operation: "findByUserId" },
      );
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
      return createSuccessResponse(null);
    } catch (error) {
      logger.error("Error deleting reset token", { error, token });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.token_deletion_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { operation: "deleteByToken" },
      );
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
      return createSuccessResponse(null);
    } catch (error) {
      logger.error("Error deleting reset by user ID", { error, userId });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.user_deletion_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { userId, operation: "deleteByUserId" },
      );
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
      return createSuccessResponse(null);
    } catch (error) {
      logger.error("Error deleting expired reset tokens", { error });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.reset_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { operation: "deleteExpired" },
      );
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
          return createErrorResponse(
            "app.api.v1.core.user.public.reset-password.errors.token_creation_failed",
            ErrorResponseTypes.DATABASE_ERROR,
            {
              error:
                "app.api.v1.core.user.public.reset-password.errors.no_data_returned",
            },
          );
        }
      }

      return createSuccessResponse(token);
    } catch (error) {
      logger.error("Error generating JWT token", { error, email, userId });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.token_creation_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { email, userId, operation: "generateJwtToken" },
      );
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
          return createErrorResponse(
            "app.api.v1.core.user.public.reset-password.errors.token_invalid",
            ErrorResponseTypes.NOT_FOUND,
          );
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

          return createErrorResponse(
            "app.api.v1.core.user.public.reset-password.errors.token_expired",
            ErrorResponseTypes.TOKEN_EXPIRED_ERROR,
          );
        }

        return createSuccessResponse({
          email: payload.email,
          userId: payload.userId,
        });
      } catch (jwtError) {
        logger.debug("Invalid JWT token", jwtError);
        return createErrorResponse(
          "app.api.v1.core.user.public.reset-password.errors.token_invalid",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }
    } catch (error) {
      logger.error("Error verifying JWT token", { error });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.token_verification_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { operation: "verifyJwtToken" },
      );
    }
  }

  /**
   * Create a password reset token
   */
  async createResetToken(
    email: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Creating password reset token", { email });

      // Find user by email
      const userResponse = await userRepository.getUserByEmail(
        email,
        UserDetailLevel.STANDARD,
        logger,
      );
      if (!userResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.user.public.reset-password.errors.user_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { email },
        );
      }

      const userId = userResponse.data.id;

      // Generate token using JWT
      return await this.generateJwtToken(email, userId, logger);
    } catch (error) {
      logger.error("Error creating password reset token", { error, email });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.token_creation_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { email, operation: "createResetToken" },
      );
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
        return createErrorResponse(
          "app.api.v1.core.user.public.reset-password.errors.token_invalid",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(passwordResetResponse.data.userId);
    } catch (error) {
      logger.error("Error verifying password reset token", { error });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.token_verification_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { operation: "verifyResetToken" },
      );
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
        return createErrorResponse(
          "app.api.v1.core.user.public.reset-password.errors.password_update_failed",
          ErrorResponseTypes.INTERNAL_ERROR,
          { userId },
        );
      }

      // Delete the used token
      await this.deleteByToken(token, logger);

      return createSuccessResponse(null);
    } catch (error) {
      logger.error("Error resetting password with token", { error, token });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.password_reset_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { operation: "resetPassword" },
      );
    }
  }

  /**
   * Request a password reset
   */
  async requestPasswordReset(
    email: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Password reset request received", { email });

      // Create a password reset token
      await this.createResetToken(email, logger);

      // We don't want to reveal if the email exists or not for security reasons
      // So we always return a success message
      return createSuccessResponse(
        "app.api.v1.core.user.auth.resetPassword.emailSent",
      );
    } catch (error) {
      logger.error("Error requesting password reset", { error, email });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.request_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { email, operation: "requestPasswordReset" },
      );
    }
  }

  /**
   * Confirm a password reset
   */
  async confirmPasswordReset(
    token: string,
    email: string,
    password: string,
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
        return createErrorResponse(
          "app.api.v1.core.user.public.reset-password.errors.token_expired",
          ErrorResponseTypes.TOKEN_EXPIRED_ERROR,
        );
      }

      const resetPayload = resetPayloadResponse.data;

      // Verify that the email matches the token
      if (resetPayload.email !== email) {
        logger.debug("Email mismatch", {
          email,
          tokenEmail: resetPayload.email,
        });
        return createErrorResponse(
          "app.api.v1.core.user.public.reset-password.errors.email_mismatch",
          ErrorResponseTypes.VALIDATION_ERROR,
          { email, tokenEmail: resetPayload.email },
        );
      }

      // Find the user
      const userResponse = await userRepository.getUserById(
        resetPayload.userId,
        UserDetailLevel.STANDARD,
        logger,
      );
      if (!userResponse.success) {
        logger.debug("User not found", { userId: resetPayload.userId });
        return createErrorResponse(
          "app.api.v1.core.user.public.reset-password.errors.user_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { userId: resetPayload.userId },
        );
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
      return createSuccessResponse(
        "app.api.v1.core.user.auth.resetPassword.success",
      );
    } catch (error) {
      logger.error("Error confirming password reset", { error, email });
      return createErrorResponse(
        "app.api.v1.core.user.public.reset-password.errors.confirmation_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { email, operation: "confirmPasswordReset" },
      );
    }
  }
}

// Export singleton instance of the repository
export const passwordRepository = new PasswordRepositoryImpl();
