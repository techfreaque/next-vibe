/**
 * Logout repository implementation
 * Handles user logout operations
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";

import { AuthRepository } from "../../auth/repository";
import type { JwtPrivatePayloadType } from "../../auth/types";
import { scopedTranslation as sessionScopedTranslation } from "../session/i18n";
import { SessionRepository } from "../session/repository";
import type { LogoutPostResponseOutput } from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/**
 * Logout Repository - Static class pattern
 */
export class LogoutRepository {
  /**
   * Logout a user
   * @param user - User from JWT
   * @param logger - Logger instance for debugging and monitoring
   * @param platform - Platform context (web, cli, ai-tool, etc.)
   * @returns Success message
   */
  static async logout(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    platform: Platform,
    locale: CountryLanguage,
    t: ModuleT,
  ): Promise<ResponseType<LogoutPostResponseOutput>> {
    const { t: sessionT } = sessionScopedTranslation.scopedT(locale);
    try {
      if (!user.id) {
        return fail({
          message: t("errors.invalid_user.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      const userId = user.id;
      logger.debug("Logging out user", {
        userId,
      });

      // Clear auth token using platform-specific handler
      const clearResult = await AuthRepository.clearAuthTokenForPlatform(
        platform,
        logger,
        locale,
      );
      if (clearResult.success) {
        logger.debug("Auth token cleared successfully", { userId });
      } else {
        logger.error("Error clearing auth token");
        // Continue even if token deletion fails
      }

      // Remove only the current session from database
      const currentSession =
        await SessionRepository.getCurrentSession(sessionT);
      if (currentSession.success) {
        const sessionFindResult = await SessionRepository.findByToken(
          currentSession.data.token,
          sessionT,
        );
        if (sessionFindResult.success) {
          await SessionRepository.deleteById(
            sessionFindResult.data.id,
            sessionT,
          );
          logger.debug("Deleted current session", {
            userId,
            sessionId: sessionFindResult.data.id,
          });
        }
      } else {
        logger.debug("No current session cookie, skipping session deletion", {
          userId,
        });
      }

      // Return success with proper response structure
      return success({
        success: true,
        message: t("success.message"),
      });
    } catch (error) {
      logger.error("Error during logout process", parseError(error));
      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          userId: user.id ?? "unknown",
          error: parseError(error).message,
        },
      });
    }
  }
}
