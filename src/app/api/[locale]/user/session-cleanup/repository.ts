/**
 * Session Cleanup Repository
 * Contains all business logic for cleaning up expired sessions and tokens
 */

import "server-only";

import { lt, sql } from "drizzle-orm";
import {
  AUTH_TOKEN_COOKIE_MAX_AGE_DAYS,
  RESET_TOKEN_EXPIRY,
} from "@/config/constants";
import {
  success,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../auth/types";
import { sessions } from "../private/session/db";
import { passwordResets } from "../public/reset-password/db";
import type {
  SessionCleanupConfigType,
  SessionCleanupRequestOutput,
  SessionCleanupResponseOutput,
} from "./types";

/**
 * Session Cleanup Repository Interface
 */
export interface SessionCleanupRepository {
  executeSessionCleanup(
    data: SessionCleanupRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SessionCleanupResponseOutput>>;
}

/**
 * Session Cleanup Repository Implementation
 */
export class SessionCleanupRepositoryImpl implements SessionCleanupRepository {
  async executeSessionCleanup(
    data: SessionCleanupRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SessionCleanupResponseOutput>> {
    const startTime = Date.now();

    try {
      logger.debug("Starting session cleanup task", {
        config: data,
        locale,
        userId: user.isPublic ? null : user.id,
      });

      // Ensure database connection is available
      await db.execute(sql`SELECT 1`);

      let sessionsDeleted = 0;
      let tokensDeleted = 0;
      let totalProcessed = 0;
      const errors: string[] = [];

      // Calculate cutoff dates
      const sessionCutoffDate = new Date();
      sessionCutoffDate.setDate(
        sessionCutoffDate.getDate() - data.sessionRetentionDays,
      );

      const tokenCutoffDate = new Date();
      tokenCutoffDate.setDate(
        tokenCutoffDate.getDate() - data.tokenRetentionDays,
      );

      // Clean up expired sessions
      try {
        if (data.dryRun) {
          // In dry run mode, just count what would be deleted
          const sessionCount = await db
            .select()
            .from(sessions)
            .where(lt(sessions.expiresAt, sessionCutoffDate));

          sessionsDeleted = sessionCount.length;
        } else {
          const sessionResult = await db
            .delete(sessions)
            .where(lt(sessions.expiresAt, sessionCutoffDate));

          sessionsDeleted = sessionResult.rowCount || 0;
        }

        logger.debug("Session cleanup completed", {
          sessionsDeleted,
          dryRun: data.dryRun,
          sessionCutoffDate: sessionCutoffDate.toISOString(),
        });
      } catch (error) {
        const errorMessage = parseError(error).message;
        errors.push(errorMessage);
        logger.error("Session cleanup failed", parseError(error));
      }

      // Clean up expired password reset tokens
      try {
        if (data.dryRun) {
          // In dry run mode, just count what would be deleted
          const tokenCount = await db
            .select()
            .from(passwordResets)
            .where(lt(passwordResets.expiresAt, tokenCutoffDate));

          tokensDeleted = tokenCount.length;
        } else {
          const tokenResult = await db
            .delete(passwordResets)
            .where(lt(passwordResets.expiresAt, tokenCutoffDate));

          tokensDeleted = tokenResult.rowCount || 0;
        }

        logger.debug("Password reset token cleanup completed", {
          tokensDeleted,
          dryRun: data.dryRun,
          tokenCutoffDate: tokenCutoffDate.toISOString(),
        });
      } catch (error) {
        const errorMessage = parseError(error).message;
        errors.push(errorMessage);
        logger.error("Token cleanup failed", parseError(error));
      }

      totalProcessed = sessionsDeleted + tokensDeleted;
      const executionTimeMs = Date.now() - startTime;

      const result: SessionCleanupResponseOutput = {
        sessionsDeleted,
        tokensDeleted,
        totalProcessed,
        executionTimeMs,
        errors,
      };

      logger.debug("Session cleanup task completed", {
        result,
      });

      // Return error if there were any errors, otherwise success
      if (errors.length > 0) {
        return fail({
          message: "app.api.user.session-cleanup.errors.partial_failure.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            errors:
              result.errors?.join(", ") ||
              "app.api.user.session-cleanup.errors.unknown_error.title",
          },
        });
      }

      return success(result);
    } catch (error) {
      const executionTimeMs = Date.now() - startTime;
      const errorMessage = parseError(error).message;

      logger.error("Session cleanup task failed", {
        error: errorMessage,
        executionTimeMs,
      });

      return fail({
        message: "app.api.user.session-cleanup.errors.execution_failed.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage },
      });
    }
  }

  /**
   * Get default configuration for session cleanup
   */
  getDefaultConfig(): SessionCleanupConfigType {
    return {
      sessionRetentionDays: AUTH_TOKEN_COOKIE_MAX_AGE_DAYS,
      tokenRetentionDays: RESET_TOKEN_EXPIRY,
      batchSize: 200,
      dryRun: false,
    };
  }

  /**
   * Validate task configuration
   */
  async validateConfig(
    config: SessionCleanupConfigType,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      // Validate database connection
      await db.execute(sql`SELECT 1`);

      // Validate configuration values
      if (
        config.sessionRetentionDays < 1 ||
        config.sessionRetentionDays > 365
      ) {
        return fail({
          message:
            "app.api.user.session-cleanup.errors.invalid_session_retention.title",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { sessionRetentionDays: config.sessionRetentionDays },
        });
      }

      if (config.tokenRetentionDays < 1 || config.tokenRetentionDays > 365) {
        return fail({
          message:
            "app.api.user.session-cleanup.errors.invalid_token_retention.title",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { tokenRetentionDays: config.tokenRetentionDays },
        });
      }

      if (config.batchSize < 1 || config.batchSize > 1000) {
        return fail({
          message:
            "app.api.user.session-cleanup.errors.invalid_batch_size.title",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { batchSize: config.batchSize },
        });
      }

      logger.debug("Session cleanup configuration validation passed");
      return success(true);
    } catch (error) {
      logger.error(
        "Session cleanup configuration validation failed",
        parseError(error),
      );
      return fail({
        message: "app.api.user.session-cleanup.errors.validation_failed.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

export const sessionCleanupRepository = new SessionCleanupRepositoryImpl();
