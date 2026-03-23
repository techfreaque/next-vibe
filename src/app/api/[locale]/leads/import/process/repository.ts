/**
 * CSV Import Process Repository
 * Processes pending CSV import jobs
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { csvImportJobs } from "../db";
import { CsvImportJobStatus } from "../enum";
import { scopedTranslation } from "../i18n";
import { LeadsImportRepository } from "../repository";
import type {
  ImportProcessPostRequestOutput,
  ImportProcessPostResponseOutput,
} from "./definition";

export class LeadsImportProcessRepository {
  static async process(
    data: ImportProcessPostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ImportProcessPostResponseOutput>> {
    const { maxJobsPerRun, maxRetriesPerJob, dryRun } = data;
    const { t } = scopedTranslation.scopedT(locale);

    let jobsProcessed = 0;
    let totalRowsProcessed = 0;
    let successfulImports = 0;
    let failedImports = 0;

    try {
      const pendingJobs = await db
        .select()
        .from(csvImportJobs)
        .where(
          and(
            eq(csvImportJobs.status, CsvImportJobStatus.PENDING),
            sql`${csvImportJobs.retryCount} <= ${maxRetriesPerJob}`,
          ),
        )
        .limit(maxJobsPerRun);

      for (const job of pendingJobs) {
        try {
          jobsProcessed++;

          const batchResult = await LeadsImportRepository.processBatch(
            job.id,
            LeadsImportRepository,
            logger,
            t,
          );

          if (batchResult.success) {
            successfulImports++;
            totalRowsProcessed += batchResult.data.processed;
          } else {
            failedImports++;
            logger.error("tasks.csv_processor.job_batch_failed", {
              jobId: job.id,
              error: batchResult.message,
            });
          }
        } catch (error) {
          failedImports++;
          const errorMessage =
            error instanceof Error ? error.message : "unknown_error";

          logger.error("tasks.csv_processor.job_error", {
            jobId: job.id,
            error: errorMessage,
          });

          if (!dryRun) {
            try {
              await db
                .update(csvImportJobs)
                .set({
                  status: CsvImportJobStatus.FAILED,
                  error: errorMessage,
                  retryCount: job.retryCount + 1,
                  updatedAt: new Date(),
                })
                .where(eq(csvImportJobs.id, job.id));
            } catch (updateError) {
              logger.error("tasks.csv_processor.update_error", {
                jobId: job.id,
                error: parseError(updateError).message,
              });
            }
          }
        }
      }

      // If this task was assigned a specific job (selfTaskId = "leads-import-${jobId}"),
      // re-enable it for the next batch if the job is still pending.
      // runOnce disables the task after each execution - re-enabling lets Pulse pick it
      // up again next minute without creating duplicate tasks.
      if (!dryRun && data.selfTaskId) {
        const jobId = data.selfTaskId.replace(/^leads-import-/, "");
        const [stillPending] = await db
          .select({ id: csvImportJobs.id })
          .from(csvImportJobs)
          .where(
            and(
              eq(csvImportJobs.id, jobId),
              eq(csvImportJobs.status, CsvImportJobStatus.PENDING),
            ),
          )
          .limit(1);

        if (stillPending) {
          const { cronTasks } =
            await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
          await db
            .update(cronTasks)
            .set({ enabled: true, updatedAt: new Date() })
            .where(eq(cronTasks.id, data.selfTaskId));
          logger.info("tasks.csv_processor.task_re_enabled", {
            taskId: data.selfTaskId,
          });
        }
      }

      return success({
        jobsProcessed,
        totalRowsProcessed,
        successfulImports,
        failedImports,
      });
    } catch (error) {
      logger.error("tasks.csv_processor.failed", {
        error: parseError(error).message,
      });
      return fail({
        message: t("process.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
