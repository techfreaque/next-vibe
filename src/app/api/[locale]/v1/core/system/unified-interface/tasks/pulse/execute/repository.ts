/**
 * Pulse Execute Repository
 * Handles pulse health check execution logic
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type {
  PulseExecuteRequestOutput,
  PulseExecuteResponseOutput,
} from "./definition";

/**
 * Pulse Execute Repository Interface
 */
export interface PulseExecuteRepository {
  /**
   * Execute pulse health check cycle
   */
  executePulse(
    data: PulseExecuteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecuteResponseOutput>>;
}

/**
 * Pulse Execute Repository Implementation
 */
export class PulseExecuteRepositoryImpl implements PulseExecuteRepository {
  /**
   * Execute pulse health check cycle
   */
  async executePulse(
    data: PulseExecuteRequestOutput,
    _user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecuteResponseOutput>> {
    const { t } = simpleT(locale);
    try {
      logger.debug("Executing pulse health check cycle", {
        userId: _user.id,
        dryRun: data.dryRun,
        force: data.force,
        taskNames: data.taskNames,
      });

      const executedAt = new Date().toISOString();
      const results: Array<{
        taskName: string;
        success: boolean;
        duration: number;
        message?: string;
      }> = [];

      // Define available tasks
      const availableTasks = [
        "health-check",
        "database-sync",
        "cache-warmup",
        "memory-cleanup",
        "log-rotation",
      ];

      // Determine which tasks to execute
      const tasksToExecute = data.taskNames?.length
        ? data.taskNames.filter((task) => availableTasks.includes(task))
        : availableTasks;

      logger.info("Pulse execution started", {
        tasksToExecute,
        dryRun: data.dryRun,
        force: data.force,
      });

      // Execute each task
      for (const taskName of tasksToExecute) {
        const startTime = Date.now();

        try {
          // Simulate task execution
          const taskResult = await this.executeTask(
            taskName,
            data.dryRun || false,
            data.force || false,
          );

          const duration = Date.now() - startTime;

          results.push({
            taskName,
            success: taskResult.success,
            duration,
            message: taskResult.message,
          });

          logger.debug(`Task ${taskName} completed`, {
            success: taskResult.success,
            duration,
            message: taskResult.message,
          });
        } catch (error) {
          const duration = Date.now() - startTime;
          const parsedError = parseError(error);

          results.push({
            taskName,
            success: false,
            duration,
            message: t(
              "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.response.executionFailed",
            ),
          });

          logger.error(`Task ${taskName} failed`, {
            error: parsedError.message,
            duration,
          });
        }
      }

      const successfulTasks = results.filter((r) => r.success).length;
      const totalTasks = results.length;
      const allSuccessful = successfulTasks === totalTasks;

      const response: PulseExecuteResponseOutput = {
        success: allSuccessful,
        message: data.dryRun
          ? t(
              "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.response.dryRunSuccess",
            )
          : t(
              "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.response.executionSuccess",
            ),
        executedAt,
        tasksExecuted: totalTasks,
        results,
      };

      logger.vibe("Pulse execution completed", {
        success: allSuccessful,
        tasksExecuted: totalTasks,
        successfulTasks,
        dryRun: data.dryRun,
      });

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to execute pulse cycle", {
        error: parsedError.message,
        dryRun: data.dryRun,
      });

      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Execute a specific pulse task
   */
  private async executeTask(
    taskName: string,
    dryRun: boolean,
    force: boolean,
  ): Promise<{ success: boolean; message?: string }> {
    // Simulate task execution with different outcomes
    const TASK_MESSAGES = {
      healthCheck: "Health check completed",
      databaseSynced: "Database synced",
      databaseFailed: "Database sync failed",
      cacheWarmed: "Cache warmed up",
      memoryCleanup: "Memory cleanup completed",
      logRotation: "Log rotation completed",
      unknownTask: "Unknown task",
      wouldExecute: "Would execute",
    } as const;

    const taskSimulations: Record<
      string,
      () => Promise<{ success: boolean; message?: string }>
    > = {
      "health-check": async () => {
        await this.delay(100);
        return {
          success: true,
          message: TASK_MESSAGES.healthCheck,
        };
      },
      "database-sync": async () => {
        await this.delay(200);
        // Simulate occasional failure
        const success = force || Math.random() > 0.1;
        return {
          success,
          message: success
            ? TASK_MESSAGES.databaseSynced
            : TASK_MESSAGES.databaseFailed,
        };
      },
      "cache-warmup": async () => {
        await this.delay(150);
        return { success: true, message: TASK_MESSAGES.cacheWarmed };
      },
      "memory-cleanup": async () => {
        await this.delay(80);
        return { success: true, message: TASK_MESSAGES.memoryCleanup };
      },
      "log-rotation": async () => {
        await this.delay(50);
        return { success: true, message: TASK_MESSAGES.logRotation };
      },
    };

    const simulation = taskSimulations[taskName];
    if (!simulation) {
      return {
        success: false,
        message: `${TASK_MESSAGES.unknownTask}: ${taskName}`,
      };
    }

    if (dryRun) {
      return {
        success: true,
        message: `${TASK_MESSAGES.wouldExecute} ${taskName}`,
      };
    }

    return await simulation();
  }

  /**
   * Utility function to simulate async delay
   */
  private async delay(ms: number): Promise<void> {
    return await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

// Export singleton instance of the repository
export const pulseExecuteRepository = new PulseExecuteRepositoryImpl();
