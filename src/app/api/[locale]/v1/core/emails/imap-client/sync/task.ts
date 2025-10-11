/**
 * IMAP Sync Task (Unified Format)
 * Automated synchronization of IMAP accounts, folders, and messages
 *
 * This file follows the unified task format as specified in spec.md
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/v1/core/system/tasks/constants";
import { CronTaskPriority } from "@/app/api/[locale]/v1/core/system/tasks/enum";
import type {
  Task,
  TaskExecutionContext,
} from "@/app/api/[locale]/v1/core/system/tasks/types/repository";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPrivatePayloadType } from "../../../user/auth/definition";
import { imapSyncTaskRepository } from "../sync-task/repository";

/**
 * Task Configuration Schema
 */
export const taskConfigSchema = z.object({
  maxAccountsPerRun: z.number().min(1).max(50),
  enableFolderSync: z.boolean(),
  enableMessageSync: z.boolean(),
  dryRun: z.boolean(),
});

export type TaskConfigType = z.infer<typeof taskConfigSchema>;

/**
 * Task Result Schema
 */
export const taskResultSchema = z.object({
  accountsProcessed: z.number(),
  accountsSuccessful: z.number(),
  accountsFailed: z.number(),
  foldersProcessed: z.number().optional(),
  messagesProcessed: z.number().optional(),
  errors: z.array(
    z.object({
      accountId: z.string(),
      stage: z.string(),
      error: z.string(),
    }),
  ),
  summary: z.object({
    totalAccounts: z.number(),
    activeAccounts: z.number(),
    syncedAccounts: z.number(),
    failedAccounts: z.number(),
  }),
});

export type TaskResultType = z.infer<typeof taskResultSchema>;

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
    const syncResult = await imapSyncTaskRepository.executeImapSync(
      { config },
      { id: "system", isPublic: false }, // System context for CRON
      "en-US",
      logger,
    );

    if (syncResult.success && syncResult.data) {
      logger.info("tasks.imap_sync.completed", syncResult.data.result.summary);
      return createSuccessResponse(syncResult.data.result);
    } else {
      logger.error("tasks.imap_sync.failed", {
        error: syncResult.message,
      });
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  } catch (error) {
    logger.error("tasks.imap_sync.failed", {
      error:
        error instanceof Error
          ? error.message
          : "tasks.imap_sync.unknown_error",
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
async function validateImapSync(
  logger: EndpointLogger,
  locale: CountryLanguage,
  cronUser: JwtPrivatePayloadType,
): Promise<ResponseType<boolean>> {
  try {
    // Use the repository to validate the IMAP sync task
    const validationResult = await imapSyncTaskRepository.validateImapSync(
      {},
      cronUser, // System context for CRON
      locale,
      logger,
    );

    if (validationResult.success && validationResult.data) {
      return createSuccessResponse(validationResult.data.isValid);
    } else {
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
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
function rollbackImapSync(): ResponseType<boolean> {
  // No rollback needed for IMAP sync
  return createSuccessResponse(true);
}

/**
 * IMAP Sync Task (Unified Format)
 */
const imapSyncTask: Task = {
  type: "cron",
  name: "imap-sync",
  description: "tasks.imap_sync.description",
  schedule: CRON_SCHEDULES.EVERY_15_MINUTES, // Every 15 minutes
  category: "emails",
  enabled: false,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.EXTENDED, // 30 minutes

  run: async ({ logger, locale, cronUser }) => {
    logger.info("emails.imap.sync.task.start");

    try {
      // Create a mock execution context for the task
      const context: TaskExecutionContext<TaskConfigType> = {
        config: {
          maxAccountsPerRun: 10,
          enableFolderSync: true,
          enableMessageSync: true,
          dryRun: false,
        },
        logger,
      };

      const result = await executeImapSync(context);

      if (result.success) {
        logger.info("emails.imap.sync.task.completed", result.data);
      } else {
        logger.error("emails.imap.sync.task.failed", result.error);
        throw new Error(result.error?.message || "IMAP sync failed");
      }
    } catch (error) {
      logger.error("emails.imap.sync.task.error", error);
      throw error;
    }
  },

  onError: async (props: { error: Error; logger: EndpointLogger }) => {
    logger.error("emails.imap.sync.task.onError", error);
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
