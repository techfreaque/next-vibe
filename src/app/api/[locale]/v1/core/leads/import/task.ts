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
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { env } from "@/config/env";
import { CRON_SCHEDULES, TASK_TIMEOUTS } from "@/app/api/[locale]/v1/core/system/tasks/constants";
import { CronTaskPriority } from "@/app/api/[locale]/v1/core/system/tasks/enum";
import type { TaskExecutionContext } from "@/app/api/[locale]/v1/core/system/tasks/types/repository";
import { parseError } from "next-vibe/shared/utils";

import { importRepository } from "../../import/repository";
import { type CsvImportJob, csvImportJobs } from "./db";
import { CsvImportJobStatus } from "./enum";
import { leadsImportRepository } from "./repository";

/**
 * Task Configuration Schema
 */
export const taskConfigSchema = z.object({
  maxJobsPerRun: z.number().min(1).max(10),
  maxRetriesPerJob: z.number().min(1).max(5),
  dryRun: z.boolean(),
});

export type TaskConfigType = z.infer<typeof taskConfigSchema>;

/**
 * Task Result Schema
 */
export const taskResultSchema = z.object({
  jobsProcessed: z.number(),
  totalRowsProcessed: z.number(),
  successfulImports: z.number(),
  failedImports: z.number(),
  errors: z.array(
    z.object({
      jobId: z.string(),
      stage: z.string(),
      error: z.string(),
    }),
  ),
  summary: z.object({
    totalJobs: z.number(),
    pendingJobs: z.number(),
    processingJobs: z.number(),
    completedJobs: z.number(),
    failedJobs: z.number(),
  }),
});

export type TaskResultType = z.infer<typeof taskResultSchema>;

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

        if (!config.dryRun) {
          // Mark job as processing
          await db
            .update(csvImportJobs)
            .set({
              status: CsvImportJobStatus.PROCESSING,
              startedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(csvImportJobs.id, job.id));
        }

        // Process the CSV import
        const importResult = await leadsImportRepository.processImportJob(
          {
            jobId: job.id,
            chunkSize: 100, // Process in chunks of 100 rows
            validateOnly: config.dryRun,
          },
          {
            userId: "system",
            email: "system@example.com",
            roles: ["admin"],
          },
          "en-GLOBAL",
          logger,
        );

        if (importResult.success && importResult.data) {
          successfulImports++;
          totalRowsProcessed += importResult.data.rowsProcessed || 0;

          if (!config.dryRun) {
            await db
              .update(csvImportJobs)
              .set({
                status: CsvImportJobStatus.COMPLETED,
                completedAt: new Date(),
                processedRows: importResult.data.rowsProcessed || 0,
                successfulRows: importResult.data.successfulRows || 0,
                failedRows: importResult.data.failedRows || 0,
                updatedAt: new Date(),
              })
              .where(eq(csvImportJobs.id, job.id));
          }

          logger.info("tasks.csv_processor.job_completed", {
            jobId: job.id,
            rowsProcessed: importResult.data.rowsProcessed,
            successfulRows: importResult.data.successfulRows,
            failedRows: importResult.data.failedRows,
          });
        } else {
          failedImports++;
          const errorMessage: string =
            importResult.message || "tasks.csv_processor.unknown_error";

          errors.push({
            jobId: job.id,
            stage: "processing",
            error: errorMessage,
          });

          if (!config.dryRun) {
            await db
              .update(csvImportJobs)
              .set({
                status: CsvImportJobStatus.FAILED,
                error: errorMessage,
                retryCount: job.retryCount + 1,
                updatedAt: new Date(),
              })
              .where(eq(csvImportJobs.id, job.id));
          }

          logger.error("tasks.csv_processor.job_failed", {
            jobId: job.id,
            error: errorMessage,
            retryCount: job.retryCount + 1,
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
    return createSuccessResponse(result);
  } catch (error) {
    logger.error("tasks.csv_processor.failed", {
      error:
        error instanceof Error
          ? error.message
          : "tasks.csv_processor.unknown_error",
    });

    return createErrorResponse(
      "error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}

/**
 * Validate function for the task
 */
async function validateCsvProcessor(): Promise<ResponseType<boolean>> {
  try {
    // Basic validation - check if database is accessible
    await db.select().from(csvImportJobs).limit(1);
    return createSuccessResponse(true);
  } catch {
    return createErrorResponse(
      "error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}

/**
 * Rollback function for the task
 */
function rollbackCsvProcessor(): ResponseType<boolean> {
  // No rollback needed for CSV processor
  return createSuccessResponse(true);
}

import type { Task } from "../../system/tasks/types/repository";

/**
 * CSV Processor Task (Unified Format)
 */
const csvProcessorTask: Task = {
  type: "cron",
  name: "csv-processor",
  description: "tasks.csv_processor.description",
  schedule: CRON_SCHEDULES.EVERY_MINUTE, // Every minute
  category: "leads",
  enabled: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.LONG, // 10 minutes

  run: async () => {
    // Initialize logger for task execution
    const logger = createEndpointLogger(
      env.NODE_ENV === "development",
      Date.now(),
      "en", // Default locale for cron tasks
    );
    
    logger.info("leads.import.task.start");

    try {
      // Create a mock execution context for the task
      const context: TaskExecutionContext<TaskConfigType> = {
        config: {
          maxJobsPerRun: 5,
          maxRetriesPerJob: 3,
          dryRun: false,
        },
        logger,
      };

      const result = await executeCsvProcessor(context);

      if (result.success) {
        logger.info("leads.import.task.completed", result.data);
      } else {
        logger.error("leads.import.task.failed", result.error);
        throw new Error(result.error?.message || "CSV processor failed");
      }
    } catch (error) {
      logger.error("leads.import.task.error", error);
      throw error;
    }
  },

  onError: async (error: Error) => {
    // Initialize logger for error handling
    const logger = createEndpointLogger(
      env.NODE_ENV === "development",
      Date.now(),
      "en", // Default locale for cron tasks
    );
    logger.error("leads.import.task.onError", error);
  },
};

/**
 * Export all tasks for leads import subdomain
 */
export const tasks: Task[] = [
  csvProcessorTask,
];

export default tasks;

/**
 * Legacy exports for backward compatibility
 */
export const taskDefinition = {
  name: "csv-processor",
  description: "tasks.csv_processor.description",
  version: "1.0.0",
  schedule: CRON_SCHEDULES.EVERY_MINUTE, // Every minute
  timezone: "UTC",
  enabled: false,
  timeout: TASK_TIMEOUTS.LONG, // 10 minutes
  retries: 3,
  retryDelay: 5000,
  priority: CronTaskPriority.MEDIUM,
  defaultConfig: {
    maxJobsPerRun: 5,
    maxRetriesPerJob: 3,
    dryRun: false,
  },
  configSchema: taskConfigSchema,
  resultSchema: taskResultSchema,
  tags: ["csv", "import", "leads"],
  dependencies: [],
};

export const execute = executeCsvProcessor;
export const validate = validateCsvProcessor;
export const rollback = rollbackCsvProcessor;
