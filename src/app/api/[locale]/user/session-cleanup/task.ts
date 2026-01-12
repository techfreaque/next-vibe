/**
 * Session Cleanup Task Implementation
 * Handles background session and token cleanup using the proper task system
 * Runs via pulse route in production or task runner in development
 */
import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/types/repository";

import { sessionCleanupRepository } from "./repository";
import type { SessionCleanupResponseOutput } from "./types";

/**
 * Main task execution - runs via pulse route in production
 * Runs via task runner in development
 */
export async function executeTask(
  logger: EndpointLogger,
): Promise<ResponseType<SessionCleanupResponseOutput>> {
  logger.debug("Starting session cleanup task execution");

  // Get default configuration for automated execution
  const defaultConfig = sessionCleanupRepository.getDefaultConfig();

  // Validate configuration before execution
  const validationResult = await sessionCleanupRepository.validateConfig(defaultConfig, logger);

  if (!validationResult.success) {
    logger.error("Session cleanup configuration validation failed");
    return fail({
      message: "app.api.user.session-cleanup.errors.default",
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
      cause: validationResult,
    });
  }

  return await sessionCleanupRepository.executeSessionCleanup(defaultConfig, logger);
}

/**
 * Task configuration
 */
export const taskConfig = {
  name: "user-session-cleanup",
  schedule: CRON_SCHEDULES.DAILY_6AM, // Daily at 6 AM
  enabled: true,
  maxConcurrent: 1, // Only one instance running
  timeout: TASK_TIMEOUTS.MEDIUM, // 5 minutes
};

/**
 * Session Cleanup Task (Unified Format)
 */
const sessionCleanupTask: Task = {
  type: "cron",
  name: "user-session-cleanup",
  description: "app.api.user.sessionCleanup.task.description",
  schedule: CRON_SCHEDULES.DAILY_6AM, // Daily at 6 AM
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.MEDIUM, // 5 minutes

  run: async ({ logger }) => {
    const result = await executeTask(logger);

    if (!result.success) {
      return fail({
        message: "app.api.user.session-cleanup.errors.default",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        cause: result,
      });
    }
    // Returns void implicitly on success
  },

  onError: ({ error, logger }) => {
    logger.error("Session cleanup task failed", parseError(error));
  },
};

/**
 * Export all tasks for user session-cleanup subdomain
 */
export const tasks: Task[] = [sessionCleanupTask];

export default tasks;
