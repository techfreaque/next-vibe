/**
 * Credit Expiration Cron Task
 * Expires old subscription credits daily
 */
import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";

import { CreditRepository } from "../repository";

/**
 * Execute credit expiration task
 */
async function executeTask(
  logger: EndpointLogger,
): Promise<ResponseType<{ expiredCount: number }>> {
  try {
    logger.info("Starting credit expiration task");

    // Expire old subscription credits
    const result = await CreditRepository.expireCredits(logger);

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
    logger.error("Credit expiration task crashed", parseError(error));
    return fail({
      message: "app.api.agent.chat.credits.expire.task.error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

/**
 * Credit Expiration Task (Unified Format)
 */
const creditExpirationTask: Task = {
  type: "cron",
  name: "credit-expiration",
  description: "app.api.agent.chat.credits.expire.task.description",
  schedule: CRON_SCHEDULES.DAILY_MIDNIGHT, // Daily at midnight
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.MEDIUM,
  timeout: TASK_TIMEOUTS.SHORT, // 1 minute

  run: async ({ logger }: { logger: EndpointLogger }) => {
    const result = await executeTask(logger);

    if (!result.success) {
      return fail({
        message: "app.api.agent.chat.credits.expire.task.error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        cause: result,
      });
    }
    // Returns void implicitly on success
  },

  onError: ({ error, logger }: { error: Error; logger: EndpointLogger }) => {
    logger.error("Credit expiration task failed", parseError(error));
  },
};

/**
 * Export all tasks for credit expiration subdomain
 */
export const tasks: Task[] = [creditExpirationTask];

export default tasks;
