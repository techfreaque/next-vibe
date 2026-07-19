/**
 * Session Cleanup Repository
 * Contains all business logic for cleaning up expired sessions and tokens
 */

import "server-only";

import { lt, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { sessions } from "next-vibe/identity/session/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { passwordResets } from "../public/reset-password/db";
import type {
  SessionCleanupPostRequestOutput,
  SessionCleanupPostResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Session Cleanup Repository
 */
export class SessionCleanupRepository {
  static async executeSessionCleanup(
    data: SessionCleanupPostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SessionCleanupPostResponseOutput>> {
    const startTime = Date.now();

    try {
      logger.debug("Starting session cleanup task", {
        config: data,
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

      const result: SessionCleanupPostResponseOutput = {
        sessionsDeleted,
        tokensDeleted,
        totalProcessed,
        executionTimeMs,
      };

      logger.debug("Session cleanup task completed", {
        result,
        errors,
      });

      // Return error if there were any errors, otherwise success
      if (errors.length > 0) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.partial_failure.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            errors: errors.join(", ") || t("errors.unknown_error.title"),
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

      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.execution_failed.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage },
      });
    }
  }
}
