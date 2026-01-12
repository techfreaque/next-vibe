/**
 * CSV Processor Task (Unified Format)
 * Processes CSV import jobs in chunks
 *
 * This file follows the unified task format as specified in spec.md
 */
import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { z } from "zod";

import { db } from "@/app/api/[locale]/system/db";
import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type {
  Task,
  TaskExecutionContext,
} from "@/app/api/[locale]/system/unified-interface/tasks/types/repository";

import { csvImportJobs } from "./db";
import { CsvImportJobStatus } from "./enum";

/**
 * Task Configuration Schema
 */
export const taskConfigSchema = z.object({
  maxJobsPerRun: z.coerce.number().min(1).max(10).default(5),
  maxRetriesPerJob: z.coerce.number().min(1).max(5).default(3),
  dryRun: z.boolean().default(false),
});

export type TaskConfigType = z.output<typeof taskConfigSchema>;

/**
 * Task Result Schema
 */
export const taskResultSchema = z.object({
  jobsProcessed: z.coerce.number(),
  totalRowsProcessed: z.coerce.number(),
  successfulImports: z.coerce.number(),
  failedImports: z.coerce.number(),
  errors: z.array(
    z.object({
      jobId: z.string(),
      stage: z.string(),
      error: z.string(),
    }),
  ),
  summary: z.object({
    totalJobs: z.coerce.number(),
    pendingJobs: z.coerce.number(),
    processingJobs: z.coerce.number(),
    completedJobs: z.coerce.number(),
    failedJobs: z.coerce.number(),
  }),
});

export type TaskResultType = z.output<typeof taskResultSchema>;

/**
 * CSV Processor Task Implementation
 */
async function executeCsvProcessor(
  context: TaskExecutionContext<TaskConfigType>,
): Promise<ResponseType<TaskResultType>> {
  const config = context.config;
  const { logger } = context;

  logger.info("tasks.csv_processor.start", { config });

  let jobsProcessed = 0;
  let totalRowsProcessed = 0;
  let successfulImports = 0;
  let failedImports = 0;
  const errors: TaskResultType["errors"] = [];

  try {
    // Step 1: Get pending CSV import jobs
    const pendingJobs = await db
      .select()
      .from(csvImportJobs)
      .where(
        and(
          eq(csvImportJobs.status, CsvImportJobStatus.PENDING),
          sql`${csvImportJobs.retryCount} < ${config.maxRetriesPerJob}`,
        ),
      )
      .limit(config.maxJobsPerRun);

    logger.info("tasks.csv_processor.found_jobs", {
      count: pendingJobs.length,
    });

    // Step 2: Process each job
    for (const job of pendingJobs) {
      try {
        jobsProcessed++;
        logger.debug("tasks.csv_processor.processing_job", {
          jobId: job.id,
          fileName: job.fileName,
          totalRows: job.totalRows,
        });

        // Process the import job using the import repository
        const { importRepository } =
          await import("@/app/api/[locale]/import/repository");
        const { leadsImportRepository } = await import("./repository");

        // Process one batch of the job
        const batchResult = await importRepository.processBatch(
          job.id,
          leadsImportRepository,
          logger,
        );

        if (batchResult.success) {
          successfulImports++;
          totalRowsProcessed += batchResult.data.processed;

          logger.info("tasks.csv_processor.job_batch_processed", {
            jobId: job.id,
            processed: batchResult.data.processed,
            hasMore: batchResult.data.hasMore,
          });
        } else {
          failedImports++;
          errors.push({
            jobId: job.id,
            stage: "batch_processing",
            error: batchResult.message,
          });

          logger.error("tasks.csv_processor.job_batch_failed", {
            jobId: job.id,
            error: batchResult.message,
          });
        }
      } catch (error) {
        failedImports++;
        const errorMessage: string =
          error instanceof Error
            ? error.message
            : "tasks.csv_processor.unknown_error";

        errors.push({
          jobId: job.id,
          stage: "execution",
          error: errorMessage,
        });

        logger.error("tasks.csv_processor.job_error", {
          jobId: job.id,
          error: errorMessage,
        });

        if (!config.dryRun) {
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
              updateError: parseError(updateError),
            });
          }
        }
      }
    }

    // Step 3: Get summary statistics
    const [summaryStats] = await db
      .select({
        total: db.$count(csvImportJobs),
        pending: db.$count(
          csvImportJobs,
          eq(csvImportJobs.status, CsvImportJobStatus.PENDING),
        ),
        processing: db.$count(
          csvImportJobs,
          eq(csvImportJobs.status, CsvImportJobStatus.PROCESSING),
        ),
        completed: db.$count(
          csvImportJobs,
          eq(csvImportJobs.status, CsvImportJobStatus.COMPLETED),
        ),
        failed: db.$count(
          csvImportJobs,
          eq(csvImportJobs.status, CsvImportJobStatus.FAILED),
        ),
      })
      .from(csvImportJobs);

    const result: TaskResultType = {
      jobsProcessed,
      totalRowsProcessed,
      successfulImports,
      failedImports,
      errors,
      summary: {
        totalJobs: summaryStats?.total || 0,
        pendingJobs: summaryStats?.pending || 0,
        processingJobs: summaryStats?.processing || 0,
        completedJobs: summaryStats?.completed || 0,
        failedJobs: summaryStats?.failed || 0,
      },
    };

    logger.info("tasks.csv_processor.completed", result.summary);
    return success(result);
  } catch (error) {
    logger.error("tasks.csv_processor.failed", {
      error:
        error instanceof Error
          ? error.message
          : "tasks.csv_processor.unknown_error",
    });

    return fail({
      message: "app.api.leads.import.post.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * CSV Processor Task (Unified Format)
 */
const csvProcessorTask: Task = {
  type: "cron",
  name: "csv-processor",
  description: "tasks.csv_processor.description",
  schedule: CRON_SCHEDULES.EVERY_MINUTE, // Every minute
  category: TaskCategory.MAINTENANCE,
  enabled: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.LONG, // 10 minutes

  run: async ({ logger, locale, cronUser }) => {
    const context: TaskExecutionContext<TaskConfigType> = {
      config: {
        maxJobsPerRun: 5,
        maxRetriesPerJob: 3,
        dryRun: false,
      },
      logger,
      taskName: "csv-processor",
      signal: new AbortController().signal,
      startTime: Date.now(),
      locale,
      cronUser,
    };

    const result = await executeCsvProcessor(context);

    if (!result.success) {
      return fail({
        message: "app.api.leads.import.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        cause: result,
      });
    }
    // Returns void implicitly on success
  },

  onError: ({ error, logger }) => {
    logger.error("CSV processor task error", parseError(error));
  },
};

/**
 * Export all tasks for leads import subdomain
 */
export const tasks: Task[] = [csvProcessorTask];

export default tasks;
