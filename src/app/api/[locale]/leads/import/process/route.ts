/**
 * CSV Import Process Route Handler
 * Called by cron to process pending CSV import jobs
 */

import "server-only";

import { and, eq, ne, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { csvImportJobs } from "../db";
import { CsvImportJobStatus } from "../enum";
import { leadsImportRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      const { maxJobsPerRun, maxRetriesPerJob, dryRun } = data;

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
              sql`${csvImportJobs.retryCount} < ${maxRetriesPerJob}`,
            ),
          )
          .limit(maxJobsPerRun);

        const { importRepository } =
          await import("@/app/api/[locale]/import/repository");

        for (const job of pendingJobs) {
          try {
            jobsProcessed++;

            const batchResult = await importRepository.processBatch(
              job.id,
              leadsImportRepository,
              logger,
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

        // Self-disable when no pending or processing jobs remain
        const [summaryStats] = await db
          .select({
            pending: db.$count(
              csvImportJobs,
              eq(csvImportJobs.status, CsvImportJobStatus.PENDING),
            ),
            processing: db.$count(
              csvImportJobs,
              eq(csvImportJobs.status, CsvImportJobStatus.PROCESSING),
            ),
          })
          .from(csvImportJobs);

        const hasActiveJobs =
          (summaryStats?.pending || 0) > 0 ||
          (summaryStats?.processing || 0) > 0;

        if (!hasActiveJobs && !dryRun) {
          const { cronTasks } =
            await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
          await db
            .update(cronTasks)
            .set({ enabled: false, updatedAt: new Date() })
            .where(
              and(
                eq(cronTasks.routeId, "leads_import_process_POST"),
                ne(cronTasks.enabled, false),
              ),
            );
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
          message: "app.api.leads.import.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    },
  },
});
