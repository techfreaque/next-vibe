/**
 * IMAP Sync Task (Unified Format)
 * Automated synchronization of IMAP accounts, folders, and messages
 *
 * This file follows the unified task format as specified in spec.md
 */
import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
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

import { imapSyncTaskRepository } from "../sync-task/repository";

/**
 * Task Configuration Schema
 */
export const taskConfigSchema = z.object({
  maxAccountsPerRun: z.coerce.number().min(1).max(50).default(10),
  enableFolderSync: z.boolean().default(true),
  enableMessageSync: z.boolean().default(true),
  dryRun: z.boolean().default(false),
});

export type TaskConfigType = z.output<typeof taskConfigSchema>;

/**
 * Task Result Schema
 */
export const taskResultSchema = z.object({
  accountsProcessed: z.coerce.number().default(0),
  accountsSuccessful: z.coerce.number().default(0),
  accountsFailed: z.coerce.number().default(0),
  foldersProcessed: z.coerce.number().optional(),
  messagesProcessed: z.coerce.number().optional(),
  errors: z
    .array(
      z.object({
        accountId: z.string(),
        stage: z.string(),
        error: z.string(),
      }),
    )
    .default([]),
  summary: z.object({
    totalAccounts: z.coerce.number().default(0),
    activeAccounts: z.coerce.number().default(0),
    syncedAccounts: z.coerce.number().default(0),
    failedAccounts: z.coerce.number().default(0),
  }),
});

export type TaskResultType = z.output<typeof taskResultSchema>;

/**
 * IMAP Sync Task Implementation
 */
async function executeImapSync(
  context: TaskExecutionContext<TaskConfigType>,
): Promise<ResponseType<TaskResultType>> {
  const config = context.config;
  const { logger } = context;

  logger.info("tasks.imap_sync.start", { config });

  try {
    // Use the repository to execute the IMAP sync task
    const syncResult = await imapSyncTaskRepository.executeImapSync({ config }, logger);

    if (syncResult.success && syncResult.data) {
      logger.info("tasks.imap_sync.completed", syncResult.data.result.summary);
      return success(syncResult.data.result);
    }
    logger.error("tasks.imap_sync.failed", {
      error: syncResult.message,
    });
    return fail({
      message: "app.api.emails.error.default",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  } catch (error) {
    logger.error("tasks.imap_sync.failed", {
      error: error instanceof Error ? error.message : "tasks.imap_sync.unknown_error",
    });

    return fail({
      message: "app.api.emails.error.default",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Validate function for the task
 */
function validateImapSync(logger: EndpointLogger): ResponseType<boolean> {
  try {
    // Use the repository to validate the IMAP sync task
    const validationResult = imapSyncTaskRepository.validateImapSync(logger);

    if (validationResult.success && validationResult.data) {
      return success(validationResult.data.isValid);
    }
    return fail({
      message: "app.api.emails.error.default",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  } catch {
    return fail({
      message: "app.api.emails.error.default",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Rollback function for the task
 */
function rollbackImapSync(): ResponseType<boolean> {
  // No rollback needed for IMAP sync
  return success(true);
}

/**
 * IMAP Sync Task (Unified Format)
 */
const imapSyncTask: Task = {
  type: "cron",
  name: "imap-sync",
  description: "tasks.imap_sync.description",
  schedule: CRON_SCHEDULES.EVERY_15_MINUTES, // Every 15 minutes
  category: TaskCategory.SYSTEM,
  enabled: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.EXTENDED, // 30 minutes

  run: async ({ logger, locale, cronUser }) => {
    const context: TaskExecutionContext<TaskConfigType> = {
      config: {
        maxAccountsPerRun: 10,
        enableFolderSync: true,
        enableMessageSync: true,
        dryRun: false,
      },
      logger,
      taskName: "imap-sync",
      signal: new AbortController().signal,
      startTime: Date.now(),
      locale,
      cronUser,
    };

    const result = await executeImapSync(context);

    if (!result.success) {
      return fail({
        message: "app.api.emails.error.default",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    // Returns void implicitly on success
  },

  onError: ({ error, logger }) => {
    logger.error("IMAP sync task error", parseError(error));
  },
};

/**
 * Export all tasks for emails imap-client sync subdomain
 */
export const tasks: Task[] = [imapSyncTask];

export default tasks;

/**
 * Legacy exports for backward compatibility
 */
export const taskDefinition = {
  name: "imap-sync",
  description: "tasks.imap_sync.description",
  version: "1.0.0",
  schedule: CRON_SCHEDULES.EVERY_15_MINUTES, // Every 15 minutes
  timezone: "UTC",
  enabled: false,
  timeout: TASK_TIMEOUTS.EXTENDED, // 30 minutes
  retries: 2,
  retryDelay: 10000,
  priority: CronTaskPriority.MEDIUM,
  defaultConfig: {
    maxAccountsPerRun: 10,
    enableFolderSync: true,
    enableMessageSync: true,
    dryRun: false,
  },
  configSchema: taskConfigSchema,
  resultSchema: taskResultSchema,
  tags: ["email", "imap", "sync"],
  dependencies: [],
};

export const execute = executeImapSync;
export const validate = validateImapSync;
export const rollback = rollbackImapSync;
