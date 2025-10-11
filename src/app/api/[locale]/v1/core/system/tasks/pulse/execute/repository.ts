/**
 * Pulse Execute Repository
 * Handles pulse health check execution logic
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "../../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type {
  PulseExecuteRequestTypeOutput,
  PulseExecuteResponseTypeOutput,
} from "./definition";

/**
 * Pulse Execute Repository Interface
 */
export interface PulseExecuteRepository {
  /**
   * Execute pulse health check cycle
   */
  executePulse(
    data: PulseExecuteRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecuteResponseTypeOutput>>;
}

/**
 * Pulse Execute Repository Implementation
 */
export class PulseExecuteRepositoryImpl implements PulseExecuteRepository {
  /**
   * Execute pulse health check cycle
   */
  async executePulse(
    data: PulseExecuteRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecuteResponseTypeOutput>> {
    try {
      logger.debug("Executing pulse health check cycle", {
        userId: user.id,
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
            logger,
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
            message: t("tasks.errors.executionFailed"),
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

      const response: PulseExecuteResponseTypeOutput = {
        success: allSuccessful,
        message: data.dryRun
          ? t("tasks.success.taskExecuted")
          : t("tasks.success.taskExecuted"),
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

      return createSuccessResponse(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to execute pulse cycle", {
        error: parsedError.message,
        userId: user.id,
        dryRun: data.dryRun,
      });

      return createErrorResponse(
        "error.general.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message, userId: user.id },
      );
    }
  }

  /**
   * Execute a specific pulse task
   */
  private async executeTask(
    taskName: string,
    dryRun: boolean,
    force: boolean,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; message?: string }> {
    // Simulate task execution with different outcomes
    const taskSimulations: Record<
      string,
      () => Promise<{ success: boolean; message?: string }>
    > = {
      "health-check": async () => {
        await this.delay(100);
        return {
          success: true,
          message: t("tasks.sideTask.healthCheck.description"),
        };
      },
      "database-sync": async () => {
        await this.delay(200);
        // Simulate occasional failure
        const success = force || Math.random() > 0.1;
        return {
          success,
          message: success
            ? t("tasks.success.taskExecuted")
            : t("tasks.errors.executionFailed"),
        };
      },
      "cache-warmup": async () => {
        await this.delay(150);
        return { success: true, message: t("tasks.success.taskExecuted") };
      },
      "memory-cleanup": async () => {
        await this.delay(80);
        return { success: true, message: "Memory cleanup completed" };
      },
      "log-rotation": async () => {
        await this.delay(50);
        return { success: true, message: "Log rotation completed" };
      },
    };

    const simulation = taskSimulations[taskName];
    if (!simulation) {
      return { success: false, message: `Unknown task: ${taskName}` };
    }

    if (dryRun) {
      return { success: true, message: `Would execute ${taskName}` };
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
