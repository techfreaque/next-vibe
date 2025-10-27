/**
 * Logout repository implementation
 * Handles user logout operations
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";

import type { JwtPrivatePayloadType } from "../../auth/definition";
import { authRepository } from "../../auth/repository";
import { sessionRepository } from "../session/repository";
import type {
  LogoutPostRequestOutput,
  LogoutPostResponseOutput,
} from "./definition";

/**
 * Logout repository interface
 */
export interface LogoutRepository {
  /**
   * Logout a user
   * @param data - Request data (empty for logout)
   * @param user - User from JWT
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns Success message
   */
  logout(
    data: LogoutPostRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<LogoutPostResponseOutput>>;
}

/**
 * Logout repository implementation
 */
export class LogoutRepositoryImpl implements LogoutRepository {
  /**
   * Logout a user
   * @param data - Request data (empty for logout)
   * @param user - User from JWT
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns Success message
   */
  async logout(
    data: LogoutPostRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<LogoutPostResponseOutput>> {
    // Removed locale parameter - translation keys handled by client

    try {
      if (!user.id) {
        return createErrorResponse(
          "app.api.v1.core.user.private.logout.errors.invalid_user.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }
      const userId = user.id;
      logger.debug("app.api.v1.core.user.private.logout.debug.loggingOutUser", {
        userId,
      });

      // Clear auth cookies
      const cookieResult = await authRepository.clearAuthCookies(logger);
      if (cookieResult.success) {
        logger.debug(
          "app.api.v1.core.user.private.logout.debug.authCookiesClearedSuccessfully",
          { userId },
        );
      } else {
        logger.error(
          "app.api.v1.core.user.private.logout.debug.errorClearingAuthCookies",
          cookieResult,
        );
        // Continue even if cookie deletion fails
      }

      // Remove sessions from database
      try {
        await sessionRepository.deleteByUserId(userId);
        logger.debug(
          "app.api.v1.core.user.private.logout.debug.deletedUserSessions",
          { userId },
        );
      } catch (error) {
        logger.error(
          "app.api.v1.core.user.private.logout.debug.errorDeletingUserSessions",
          error,
        );
        // Use a specific error for session deletion failure
        return createErrorResponse(
          "app.api.v1.core.user.private.logout.errors.session_deletion_failed.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          {
            resourceType: "user.sessions",
            userId,
            error: parseError(error).message,
          },
        );
      }

      // Return success with proper response structure
      return createSuccessResponse({
        success: true,
        message: "app.api.v1.core.user.private.logout.success.message",
        sessionsCleaned: 1, // We cleaned one session
        nextSteps: [
          "app.api.v1.core.user.private.logout.nextSteps.redirectToLogin",
          "app.api.v1.core.user.private.logout.nextSteps.clearBrowserData",
        ],
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.private.logout.debug.errorDuringLogoutProcess",
        error,
      );
      return createErrorResponse(
        "app.api.v1.core.user.private.logout.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          userId: user.id ?? "unknown",
          error: parseError(error).message,
        },
      );
    }
  }
}

// Export singleton instance of the repository
export const logoutRepository = new LogoutRepositoryImpl();
