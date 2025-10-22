import { TaskCategory } from "@/app/api/[locale]/v1/core/system/tasks/enum";
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
  maxAccountsPerRun: z.number().min(1).max(50).default(10),
  enableFolderSync: z.boolean().default(true),
  enableMessageSync: z.boolean().default(true),
  dryRun: z.boolean().default(false),
});

export type TaskConfigType = z.output<typeof taskConfigSchema>;

/**
 * Task Result Schema
 */
export const taskResultSchema = z.object({
  accountsProcessed: z.number().default(0),
  accountsSuccessful: z.number().default(0),
  accountsFailed: z.number().default(0),
  foldersProcessed: z.number().optional(),
  messagesProcessed: z.number().optional(),
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
    totalAccounts: z.number().default(0),
    activeAccounts: z.number().default(0),
    syncedAccounts: z.number().default(0),
    failedAccounts: z.number().default(0),
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
    // System user context for CRON execution
    const systemUser: JwtPrivatePayloadType = {
      id: "system",
      leadId: "system",
      isPublic: false,
    };

    // Use the repository to execute the IMAP sync task
    const syncResult = await imapSyncTaskRepository.executeImapSync(
      { config },
      systemUser,
      "en-US" as CountryLanguage,
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
        "app.api.v1.core.emails.error.default",
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
      "app.api.v1.core.emails.error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}

/**
 * Validate function for the task
 */
function validateImapSync(
  logger: EndpointLogger,
  locale: CountryLanguage,
  cronUser: JwtPrivatePayloadType,
): ResponseType<boolean> {
  try {
    // Use the repository to validate the IMAP sync task
    const validationResult = imapSyncTaskRepository.validateImapSync(
      {},
      cronUser,
      locale,
      logger,
    );

    if (validationResult.success && validationResult.data) {
      return createSuccessResponse(validationResult.data.isValid);
    } else {
      return createErrorResponse(
        "app.api.v1.core.emails.error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  } catch {
    return createErrorResponse(
      "app.api.v1.core.emails.error.default",
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
      return createErrorResponse(
        "app.api.v1.core.emails.error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
    // Returns void implicitly on success
  },

  onError: ({ error, logger }) => {
    logger.error("IMAP sync task error", error);
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
