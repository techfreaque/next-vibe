/**
 * Error Logs Cleanup Route Handler
 * Deletes error_logs older than 7 days.
 */

import "server-only";

import { lt } from "drizzle-orm";
import { success } from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { errorLogs } from "../db";
import definitions from "./definition";

/** Retention period in days */
const RETENTION_DAYS = 7;

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ logger }) => {
      const cutoff = new Date(
        Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000,
      );

      logger.debug(
        `Cleaning up error logs older than ${cutoff.toISOString()} (${RETENTION_DAYS} days)`,
      );

      const result = await db
        .delete(errorLogs)
        .where(lt(errorLogs.createdAt, cutoff))
        .returning({ id: errorLogs.id });

      const deletedCount = result.length;

      if (deletedCount > 0) {
        logger.info(`Cleaned up ${deletedCount} old error logs`);
      } else {
        logger.debug("No old error logs to clean up");
      }

      return success({
        deletedCount,
        retentionDays: RETENTION_DAYS,
      });
    },
  },
});
