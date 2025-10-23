/**
 * Credit Expiration Cron Task
 * Expires old subscription credits daily
 */
import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/v1/core/system/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/v1/core/system/tasks/enum";
import type { Task } from "@/app/api/[locale]/v1/core/system/tasks/types/repository";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { creditRepository } from "../repository";

/**
 * Execute credit expiration task
 */
async function executeTask(
  logger: EndpointLogger,
): Promise<ResponseType<{ expiredCount: number }>> {
  try {
    logger.info("Starting credit expiration task");

    // Expire old subscription credits
    const result = await creditRepository.expireCredits();

    if (!result.success) {
      logger.error("Failed to expire credits", {
        error: result.message,
      });
      return result;
    }

    const expiredCount = result.data;

    logger.info("Credit expiration task completed", {
      expiredCount,
    });

    return {
      success: true,
      data: { expiredCount },
    };
  } catch (error) {
    logger.error("Credit expiration task crashed", { error });
    return createErrorResponse(
      "app.api.v1.core.agent.chat.credits.expire.task.error",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: error instanceof Error ? error.message : String(error) },
    );
  }
}

/**
 * Credit Expiration Task (Unified Format)
 */
const creditExpirationTask: Task = {
  type: "cron",
  name: "credit-expiration",
  description: "app.api.v1.core.agent.chat.credits.expire.task.description",
  schedule: CRON_SCHEDULES.DAILY_MIDNIGHT, // Daily at midnight
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.SHORT, // 1 minute

  run: async ({ logger }) => {
    const result = await executeTask(logger);

    if (!result.success) {
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.expire.task.error",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
    // Returns void implicitly on success
  },

  onError: ({ error, logger }) => {
    logger.error("Credit expiration task failed", error);
  },
};

/**
 * Export all tasks for credit expiration subdomain
 */
export const tasks: Task[] = [creditExpirationTask];

export default tasks;

/**
 * Legacy exports for backward compatibility
 */
export const taskDefinition = {
  name: "credit-expiration",
  description: "app.api.v1.core.agent.chat.credits.expire.task.description",
  version: "1.0.0",
  schedule: CRON_SCHEDULES.DAILY_MIDNIGHT,
  timezone: "UTC",
  enabled: true,
  timeout: TASK_TIMEOUTS.SHORT,
  retries: 2,
  retryDelay: 5000,
  priority: CronTaskPriority.MEDIUM,
  tags: ["credits", "cleanup", "subscription"],
  dependencies: [],
  monitoring: {
    alertOnFailure: true,
    alertOnLongExecution: false,
    maxExecutionTime: 60000, // 1 minute
  },
};
