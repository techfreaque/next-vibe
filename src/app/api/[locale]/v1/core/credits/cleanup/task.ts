/**
 * Orphaned Lead Wallet Cleanup Task
 * Cleans up lead wallets that are linked to users but never merged
 */
import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/enum";
import type { Task } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/types/repository";

import { creditRepository } from "../repository";

/**
 * Execute orphaned wallet cleanup task
 */
async function executeTask(
  logger: EndpointLogger,
): Promise<ResponseType<{ cleanedCount: number }>> {
  try {
    logger.info("Starting orphaned lead wallet cleanup task");

    // Clean up orphaned lead wallets
    const result = await creditRepository.cleanupOrphanedLeadWallets(logger);

    if (!result.success) {
      logger.error("Failed to cleanup orphaned wallets", {
        error: result.message,
      });
      return result;
    }

    const cleanedCount = result.data;

    logger.info("Orphaned wallet cleanup task completed", {
      cleanedCount,
    });

    return {
      success: true,
      data: { cleanedCount },
    };
  } catch (error) {
    logger.error("Orphaned wallet cleanup task crashed", parseError(error));
    return fail({
      message: "app.api.v1.core.credits.cleanup.task.error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

/**
 * Orphaned Wallet Cleanup Task (Unified Format)
 */
const orphanedWalletCleanupTask: Task = {
  type: "cron",
  name: "orphaned-wallet-cleanup",
  description: "app.api.v1.core.credits.cleanup.task.description",
  schedule: CRON_SCHEDULES.WEEKLY_SUNDAY_MIDNIGHT, // Weekly on Sunday at midnight
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM, // 5 minutes

  run: async ({ logger }: { logger: EndpointLogger }) => {
    const result = await executeTask(logger);

    if (!result.success) {
      return fail({
        message: "app.api.v1.core.credits.cleanup.task.error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        cause: result,
      });
    }
    // Returns void implicitly on success
  },

  onError: ({ error, logger }: { error: Error; logger: EndpointLogger }) => {
    logger.error("Orphaned wallet cleanup task failed", parseError(error));
  },
};

/**
 * Export all tasks for credit cleanup subdomain
 */
export const tasks: Task[] = [orphanedWalletCleanupTask];

export default tasks;
