/**
 * Error Logs Cleanup Repository
 * Deletes error_logs older than 6 months and caps total rows at 100K.
 */

import "server-only";

import { count, inArray, lt } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { errorLogs } from "../db";
import type { CleanupPostResponseOutput } from "./definition";

export class ErrorLogsCleanupRepository {
  /** Retention period in days (6 months) */
  private static readonly RETENTION_DAYS = 180;

  /** Maximum number of rows to keep */
  private static readonly MAX_ROWS = 100_000;

  static async cleanup(
    logger: EndpointLogger,
  ): Promise<ResponseType<CleanupPostResponseOutput>> {
    // 1. Time-based: delete logs older than 6 months
    const cutoff = new Date(
      Date.now() -
        ErrorLogsCleanupRepository.RETENTION_DAYS * 24 * 60 * 60 * 1000,
    );

    logger.debug(
      `Cleaning up error logs older than ${cutoff.toISOString()} (${ErrorLogsCleanupRepository.RETENTION_DAYS} days)`,
    );

    const timeResult = await db
      .delete(errorLogs)
      .where(lt(errorLogs.createdAt, cutoff))
      .returning({ id: errorLogs.id });

    const deletedByTime = timeResult.length;

    // 2. Count-based: if total > 100K, delete oldest excess
    const [countResult] = await db.select({ count: count() }).from(errorLogs);
    const total = countResult?.count ?? 0;
    let deletedByCount = 0;

    if (total > ErrorLogsCleanupRepository.MAX_ROWS) {
      const excess = total - ErrorLogsCleanupRepository.MAX_ROWS;
      const oldestToDelete = await db
        .select({ id: errorLogs.id })
        .from(errorLogs)
        .orderBy(errorLogs.createdAt)
        .limit(excess);

      if (oldestToDelete.length > 0) {
        const ids = oldestToDelete.map((r) => r.id);
        await db.delete(errorLogs).where(inArray(errorLogs.id, ids));
        deletedByCount = ids.length;
      }
    }

    const deletedCount = deletedByTime + deletedByCount;

    if (deletedCount > 0) {
      logger.info(
        `Cleaned up ${deletedCount} error logs (${deletedByTime} by time, ${deletedByCount} by count cap)`,
      );
    } else {
      logger.debug("No old error logs to clean up");
    }

    return success({
      deletedCount,
      deletedByTime,
      deletedByCount,
      retentionDays: ErrorLogsCleanupRepository.RETENTION_DAYS,
      maxRows: ErrorLogsCleanupRepository.MAX_ROWS,
    });
  }
}
