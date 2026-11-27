import "server-only";

import { and, eq, inArray, lt, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";
import { cronTasks } from "next-vibe/tasks/cron/db";

import { csvImportJobs } from "../../db";
import { CsvImportJobStatus as CsvImportJobStatusEnum } from "../../enum";
import type { JobidRetryT } from "./retry/i18n";
import type { JobidStopT } from "./stop/i18n";

export class LeadsImportJobRepository {
  static async retryJob(
    userId: string,
    jobId: string,
    logger: EndpointLogger,
    t: JobidRetryT,
  ): Promise<ResponseType<{ result: { success: boolean; message: string } }>> {
    try {
      const ownerMatch = and(
        eq(csvImportJobs.id, jobId),
        eq(csvImportJobs.uploadedBy, userId),
      );
      const queued = await db.transaction(async (tx) => {
        const [job] = await tx
          .update(csvImportJobs)
          .set({
            status: CsvImportJobStatusEnum.PENDING,
            error: null,
            retryCount: sql`${csvImportJobs.retryCount} + 1`,
            completedAt: null,
            updatedAt: new Date(),
          })
          .where(
            and(
              ownerMatch,
              eq(csvImportJobs.status, CsvImportJobStatusEnum.FAILED),
              lt(csvImportJobs.retryCount, csvImportJobs.maxRetries),
            ),
          )
          .returning({ id: csvImportJobs.id });
        if (job) {
          await tx
            .update(cronTasks)
            .set({ enabled: true, updatedAt: new Date() })
            .where(eq(cronTasks.id, `leads-import-${jobId}`));
        }
        return job;
      });
      if (!queued) {
        const [existing] = await db
          .select({ id: csvImportJobs.id })
          .from(csvImportJobs)
          .where(ownerMatch)
          .limit(1);
        return fail({
          message: t(
            existing
              ? "post.errors.conflict.title"
              : "post.errors.notFound.title",
          ),
          errorType: existing
            ? ErrorResponseTypes.CONFLICT
            : ErrorResponseTypes.NOT_FOUND,
        });
      }

      logger.info("Retried import job", { jobId, userId });

      return success({
        result: {
          success: true,
          message: t("post.success.description"),
        },
      });
    } catch (error) {
      logger.error("Error retrying import job", parseError(error));
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async stopJob(
    userId: string,
    jobId: string,
    logger: EndpointLogger,
    t: JobidStopT,
  ): Promise<ResponseType<{ result: { success: boolean; message: string } }>> {
    try {
      const ownerMatch = and(
        eq(csvImportJobs.id, jobId),
        eq(csvImportJobs.uploadedBy, userId),
      );
      const [stopped] = await db
        .update(csvImportJobs)
        .set({
          status: CsvImportJobStatusEnum.FAILED,
          error: null,
          updatedAt: new Date(),
          completedAt: new Date(),
        })
        .where(
          and(
            ownerMatch,
            inArray(csvImportJobs.status, [
              CsvImportJobStatusEnum.PENDING,
              CsvImportJobStatusEnum.PROCESSING,
            ]),
          ),
        )
        .returning({ id: csvImportJobs.id });
      if (!stopped) {
        const [existing] = await db
          .select({ id: csvImportJobs.id })
          .from(csvImportJobs)
          .where(ownerMatch)
          .limit(1);
        return fail({
          message: t(
            existing
              ? "post.errors.conflict.title"
              : "post.errors.notFound.title",
          ),
          errorType: existing
            ? ErrorResponseTypes.CONFLICT
            : ErrorResponseTypes.NOT_FOUND,
        });
      }

      logger.info("Stopped import job", { jobId, userId });

      return success({
        result: {
          success: true,
          message: t("post.success.description"),
        },
      });
    } catch (error) {
      logger.error("Error stopping import job", parseError(error));
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
