/**
 * Session Cleanup Task Implementation
 * Handles background session and token cleanup using the proper task system
 * Runs via pulse route in production or task runner in development
 */

import "server-only";

import {
  createErrorResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/v1/core/system/tasks/constants";
import { CronTaskPriority } from "@/app/api/[locale]/v1/core/system/tasks/enum";
import type { Task } from "@/app/api/[locale]/v1/core/system/tasks/types/repository";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import type { SessionCleanupResponseTypeOutput } from "./definition";
import { sessionCleanupRepository } from "./repository";

/**
 * Main task execution - runs via pulse route in production
 * Runs via task runner in development
 */
export async function executeTask(
  logger: EndpointLogger,
): Promise<ResponseType<SessionCleanupResponseTypeOutput>> {
  logger.debug("Starting session cleanup task execution");

  // Get default configuration for automated execution
  const defaultConfig = sessionCleanupRepository.getDefaultConfig();

  // Validate configuration before execution
  const validationResult = await sessionCleanupRepository.validateConfig(
    defaultConfig,
    logger,
  );

  if (!validationResult.success) {
    logger.error(
      "Session cleanup configuration validation failed",
      validationResult,
    );
    return validationResult as ResponseType<SessionCleanupResponseTypeOutput>;
  }

  // Execute session cleanup with system user context
  const systemUser = { isPublic: true as const, id: undefined };

  return await sessionCleanupRepository.executeSessionCleanup(
    defaultConfig,
    systemUser,
    "en-GLOBAL",
    logger,
  );
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
  description: "app.api.v1.core.user.sessionCleanup.task.description",
  schedule: CRON_SCHEDULES.DAILY_6AM, // Daily at 6 AM
  category: "authentication",
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.MEDIUM, // 5 minutes

  run: async ({ logger }) => {
    // Implementation moved to repository
    try {
      const result = await executeTask(logger);

      if (!result.success) {
        return result;
      }
    } catch (error) {
      logger.error("Session cleanup task failed", error);
      return createErrorResponse(
        "user.errors.session_cleanup_execution_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  },

  onError: ({ error, logger }) => {
    logger.error("Session cleanup task failed", error);
  },
};

/**
 * Export all tasks for user session-cleanup subdomain
 */
export const tasks: Task[] = [sessionCleanupTask];

export default tasks;

/**
 * Legacy exports for backward compatibility
 */
export const taskDefinition = {
  name: "user-session-cleanup",
  description: "app.api.v1.core.user.sessionCleanup.task.description",
  version: "1.0.0",
  schedule: CRON_SCHEDULES.DAILY_6AM, // Daily at 6 AM
  timezone: "UTC",
  enabled: true,
  timeout: TASK_TIMEOUTS.MEDIUM, // 5 minutes
  retries: 2,
  retryDelay: 5000,
  priority: CronTaskPriority.MEDIUM,
  defaultConfig: sessionCleanupRepository.getDefaultConfig(),
  tags: ["security", "cleanup", "authentication"],
  dependencies: [],
  monitoring: {
    alertOnFailure: true,
    alertOnLongExecution: false,
    maxExecutionTime: 120000, // 2 minutes
  },
  documentation: {
    purpose: "app.api.v1.core.user.sessionCleanup.task.purpose",
    impact: "app.api.v1.core.user.sessionCleanup.task.impact",
    rollback: "app.api.v1.core.user.sessionCleanup.task.rollback",
  },
};

export const execute = executeTask;
export const validate = (
  config: {
    sessionRetentionDays: number;
    tokenRetentionDays: number;
    batchSize: number;
    dryRun: boolean;
  },
  logger: EndpointLogger,
): Promise<ResponseType<boolean>> =>
  sessionCleanupRepository.validateConfig(config, logger);

/**
 * Rollback function (not applicable for cleanup operations)
 */
export function rollback(): ResponseType<boolean> {
  // This task only deletes expired data, so rollback is not applicable
  return { success: true, data: true };
}
