/**
 * Logout repository implementation
 * Handles user logout operations
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

import { authRepository } from "../../auth/repository";
import type { JwtPrivatePayloadType } from "../../auth/types";
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
   * @param request - Next.js request object for platform detection
   * @param logger - Logger instance for debugging and monitoring
   * @returns Success message
   */
  logout(
    data: LogoutPostRequestOutput,
    user: JwtPrivatePayloadType,
    request: NextRequest,
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
   * @param request - Next.js request object for platform detection
   * @param logger - Logger instance for debugging and monitoring
   * @returns Success message
   */
  async logout(
    data: LogoutPostRequestOutput,
    user: JwtPrivatePayloadType,
    request: NextRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<LogoutPostResponseOutput>> {
    // Removed locale parameter - translation keys handled by client

    try {
      if (!user.id) {
        return fail({
          message: "app.api.v1.core.user.private.logout.errors.invalid_user.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      const userId = user.id;
      logger.debug("app.api.v1.core.user.private.logout.debug.loggingOutUser", {
        userId,
      });

      // Clear auth token using platform-specific handler
      const clearResult = await authRepository.clearAuthTokenForPlatform(
        request,
        logger,
      );
      if (clearResult.success) {
        logger.debug(
          "app.api.v1.core.user.private.logout.debug.authTokenClearedSuccessfully",
          { userId },
        );
      } else {
        logger.error(
          "app.api.v1.core.user.private.logout.debug.errorClearingAuthToken",
        );
        // Continue even if token deletion fails
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
          parseError(error),
        );
        // Use a specific error for session deletion failure
        return fail({
          message: "app.api.v1.core.user.private.logout.errors.session_deletion_failed.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                    messageParams: {
            resourceType: "user.sessions",
            userId,
            error: parseError(error).message,
          },
          },
        );
      }

      // Return success with proper response structure
      return success({
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
        parseError(error),
      );
      return fail({
          message: "app.api.v1.core.user.private.logout.errors.internal.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: {
          userId: user.id ?? "unknown",
          error: parseError(error).message,
        },
        },
      );
    }
  }
}

// Export singleton instance of the repository
export const logoutRepository = new LogoutRepositoryImpl();
