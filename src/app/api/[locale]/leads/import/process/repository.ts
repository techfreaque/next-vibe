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

      // Re-create tasks for any jobs that still need processing. Each job gets its
      // own dedicated task ID (leads-import-${jobId}) so re-inserts are idempotent.
      // The current task has runOnce:true so Pulse disables it after execution.
      if (!dryRun) {
        const { cronTasks } =
          await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
        const { CronTaskPriority, TaskCategory, TaskOutputMode } =
          await import("@/app/api/[locale]/system/unified-interface/tasks/enum");

        const stillPendingJobs = await db
          .select({ id: csvImportJobs.id })
          .from(csvImportJobs)
          .where(
            and(
              eq(csvImportJobs.status, CsvImportJobStatus.PENDING),
              sql`${csvImportJobs.retryCount} <= ${maxRetriesPerJob}`,
            ),
          );

        for (const job of stillPendingJobs) {
          const nextTaskId = `leads-import-${job.id}`;
          await db
            .insert(cronTasks)
            .values({
              id: nextTaskId,
              shortId: nextTaskId,
              routeId: "leads_import_process_POST",
              displayName: `Process import job ${job.id}`,
              category: TaskCategory.MAINTENANCE,
              schedule: "* * * * *",
              priority: CronTaskPriority.MEDIUM,
              enabled: true,
              runOnce: true,
              taskInput: {
                dryRun: false,
                maxJobsPerRun: 1,
                maxRetriesPerJob: 0,
                selfTaskId: nextTaskId,
              },
              outputMode: TaskOutputMode.STORE_ONLY,
              notificationTargets: [],
              tags: ["leads-import", job.id],
            })
            .onConflictDoNothing();
          logger.info("tasks.csv_processor.next_task_created", { nextTaskId });
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
