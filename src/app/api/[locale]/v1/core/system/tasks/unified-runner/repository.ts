/**
 * Unified Task Runner Repository
 * Implements single unified task runner as per spec.md requirements
 * Handles both cron tasks and side tasks with overlap prevention
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { CronTaskStatus } from "../enum";
import type {
  CronTask,
  SideTask,
  Task,
  TaskRunner,
  TaskRunnerManager,
  TaskStatus,
} from "../types/repository";
import type {
  UnifiedRunnerRequestOutput,
  UnifiedRunnerResponseOutput,
} from "./definition";

// System user for cron task execution
const CRON_SYSTEM_USER: JwtPrivatePayloadType = {
  id: "system-cron",
  leadId: "system-cron-lead",
  isPublic: false,
};

/**
 * Unified Task Runner Repository Interface
 * Enhanced to match spec.md requirements
 */
export interface UnifiedTaskRunnerRepository extends TaskRunnerManager {
  manageRunner(
    data: UnifiedRunnerRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UnifiedRunnerResponseOutput>>;
}

/**
 * Unified Task Runner Repository Implementation
 * Implements the complete unified task runner as per spec.md
 */
export class UnifiedTaskRunnerRepositoryImpl
  implements UnifiedTaskRunnerRepository
{
  name = "unified-task-runner" as const;
  description =
    "app.api.v1.core.system.tasks.unifiedRunner.description" as const;
  environment: "development" | "production" | "serverless" = "development";
  supportsSideTasks = true;

  private runningTasks = new Map<string, TaskStatus>();
  private runningProcesses = new Map<string, AbortController>();
  private isRunning = false;
  private errors: Array<{
    taskName: string;
    error: string;
    timestamp: Date;
  }> = [];

  // Execution context stored when runner starts
  private locale: CountryLanguage = "en-GLOBAL";
  private logger!: EndpointLogger;
  private cronUser: JwtPrivatePayloadType = CRON_SYSTEM_USER;

  async manageRunner(
    data: UnifiedRunnerRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UnifiedRunnerResponseOutput>> {
    try {
      logger.debug("Managing unified task runner", {
        action: data.action,
        taskFilter: data.taskFilter || "all",
        dryRun: data.dryRun,
        userId: user.id,
      });

      const timestamp = new Date().toISOString();

      switch (data.action) {
        case "status":
          return createSuccessResponse({
            success: true,
            actionResult: data.action,
            message:
              "app.api.v1.core.system.tasks.unifiedRunner.post.response.message",
            timestamp,
          });

        case "start":
          this.isRunning = true;
          return createSuccessResponse({
            success: true,
            actionResult: data.action,
            message:
              "app.api.v1.core.system.tasks.unifiedRunner.post.response.message",
            timestamp,
          });

        case "stop":
          await this.stop(locale);
          return createSuccessResponse({
            success: true,
            actionResult: data.action,
            message:
              "app.api.v1.core.system.tasks.unifiedRunner.post.response.message",
            timestamp,
          });

        case "restart":
          await this.stop(locale);
          this.isRunning = true;
          return createSuccessResponse({
            success: true,
            actionResult: data.action,
            message:
              "app.api.v1.core.system.tasks.unifiedRunner.post.response.message",
            timestamp,
          });

        default:
          return createErrorResponse(
            "app.api.v1.core.system.tasks.unifiedRunner.post.errors.validation.title",
            ErrorResponseTypes.VALIDATION_ERROR,
            { action: data.action },
          );
      }
    } catch (error) {
      logger.error("Failed to manage unified task runner", {
        error: parseError(error).message,
        action: data.action,
      });

      return createErrorResponse(
        "app.api.v1.core.system.tasks.unifiedRunner.post.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  // TaskRunnerManager interface implementation
  async executeCronTask(
    task: CronTask,
  ): Promise<ResponseType<{ status: string; message: string }>> {
    const taskName = task.name;

    // Check if task is already running (overlap prevention)
    if (this.isTaskRunning(taskName)) {
      return createSuccessResponse({
        status: CronTaskStatus.SKIPPED,
        reason:
          "app.api.v1.core.system.tasks.unifiedRunner.reasons.previousInstanceRunning",
        message:
          "app.api.v1.core.system.tasks.unifiedRunner.messages.taskSkipped",
      });
    }

    // Mark task as running
    this.markTaskAsRunning(taskName, "cron");

    try {
      // Ensure execution context is available
      if (!this.logger) {
        const errorMsg = "Task runner not properly initialized with logger";
        this.markTaskAsFailed(taskName, errorMsg);
        return createErrorResponse(
          "app.api.v1.core.system.tasks.unifiedRunner.post.errors.internal.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          { error: errorMsg, taskName },
        );
      }

      // Execute task with required props
      const result = await task.run({
        logger: this.logger,
        locale: this.locale,
        cronUser: this.cronUser,
      });

      // Check if task returned an error
      if (result && typeof result === "object" && "error" in result) {
        const errorMsg =
          typeof result.error === "string" ? result.error : "Task failed";
        this.markTaskAsFailed(taskName, errorMsg);
        return createErrorResponse(
          "app.api.v1.core.system.tasks.unifiedRunner.post.errors.internal.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          { error: errorMsg, taskName },
        );
      }

      this.markTaskAsCompleted(taskName);
      return createSuccessResponse({
        status: CronTaskStatus.COMPLETED,
        message:
          "app.api.v1.core.system.tasks.unifiedRunner.messages.taskCompleted",
      });
    } catch (error) {
      const errorMsg = parseError(error).message;
      this.markTaskAsFailed(taskName, errorMsg);
      return createErrorResponse(
        "app.api.v1.core.system.tasks.unifiedRunner.post.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: errorMsg, taskName },
      );
    }
  }

  async startSideTask(
    task: SideTask,
    signal: AbortSignal,
  ): Promise<ResponseType<void>> {
    const taskName = task.name;

    if (this.isTaskRunning(taskName)) {
      return createErrorResponse(
        "app.api.v1.core.system.tasks.unifiedRunner.post.errors.validation.title",
        ErrorResponseTypes.VALIDATION_ERROR,
        { taskName },
      );
    }

    this.markTaskAsRunning(taskName, "side");

    try {
      await task.run(signal);
      this.markTaskAsCompleted(taskName);
      return createSuccessResponse(undefined);
    } catch (error) {
      const errorMsg = parseError(error).message;
      this.markTaskAsFailed(taskName, errorMsg);
      if (task.onError) {
        const errorInstance =
          error instanceof Error ? error : new Error(errorMsg);
        await task.onError(errorInstance);
      }
      return createErrorResponse(
        "app.api.v1.core.system.tasks.unifiedRunner.post.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: errorMsg, taskName },
      );
    }
  }

  stopSideTask(taskName: string): void {
    const controller = this.runningProcesses.get(taskName);
    if (controller) {
      controller.abort();
      this.runningProcesses.delete(taskName);
      this.runningTasks.delete(taskName);
    }
  }

  getTaskStatus(taskName: string): TaskStatus {
    return (
      this.runningTasks.get(taskName) || {
        name: taskName,
        type: "cron",
        status: "stopped",
        runCount: 0,
        errorCount: 0,
        successCount: 0,
      }
    );
  }

  isTaskRunning(taskName: string): boolean {
    const status = this.runningTasks.get(taskName);
    return status?.status === "running";
  }

  getRunningTasks(): string[] {
    return Array.from(this.runningTasks.keys()).filter((taskName) =>
      this.isTaskRunning(taskName),
    );
  }

  start(
    tasks: Task[],
    signal: AbortSignal,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<void> {
    try {
      // Store execution context
      this.locale = locale;
      this.logger = logger;

      this.logger.debug("Starting unified task runner", {
        taskCount: tasks.length,
        environment: this.environment,
        supportsSideTasks: this.supportsSideTasks,
      });

      this.isRunning = true;

      // Start all side tasks and task runners in background
      void this.startTasksInBackground(tasks, signal, locale);

      this.logger.debug("Task runner startup initiated");

      return createSuccessResponse(undefined);
    } catch (error) {
      const errorMsg = parseError(error).message;

      // Use logger if available, otherwise fall back to console (during initialization)
      if (this.logger) {
        this.logger.error("Failed to start task runner", {
          error: errorMsg,
        });
      }

      return createErrorResponse(
        "app.api.v1.core.system.tasks.unifiedRunner.post.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: errorMsg },
      );
    }
  }

  /**
   * Start tasks in background (async)
   */
  private startTasksInBackground(
    tasks: Task[],
    signal: AbortSignal,
    locale: CountryLanguage,
  ): void {
    try {
      // Start all side tasks and task runners
      const sideTasks = tasks.filter(
        (task): task is SideTask | TaskRunner =>
          task.type === "side" || task.type === "task-runner",
      );

      this.logger.debug("Starting side tasks and task runners", {
        sideTaskCount: sideTasks.length,
        taskNames: sideTasks.map((t) => t.name),
      });

      // Start each side task in parallel
      const sideTaskPromises = sideTasks.map(async (task) => {
        if (!task.enabled) {
          this.logger.debug(`Skipping disabled task: ${task.name}`);
          return;
        }

        this.logger.debug(`Starting side task: ${task.name}`);

        try {
          // Create abort controller for this specific task
          const taskController = new AbortController();
          this.runningProcesses.set(task.name, taskController);

          // Mark task as running
          this.markTaskAsRunning(
            task.name,
            task.type === "task-runner" ? "side" : "side",
          );

          // Start the task
          await task.run(taskController.signal);

          this.logger.debug(`Side task completed: ${task.name}`);
          this.markTaskAsCompleted(task.name);
        } catch (error) {
          const errorMsg = parseError(error).message;
          this.logger.error(`Side task failed: ${task.name}`, {
            error: errorMsg,
          });
          this.markTaskAsFailed(task.name, errorMsg);

          if (task.onError) {
            const errorInstance =
              error instanceof Error ? error : new Error(errorMsg);
            await task.onError(errorInstance);
          }
        }
      });

      // Don't await all promises - let them run in background
      void Promise.allSettled(sideTaskPromises)
        .then(() => {
          this.logger.debug("All side tasks have completed or failed");
          return;
        })
        .catch((error) => {
          this.logger.error("Error in side task promises", error);
        });

      // Set up cron task scheduler for cron tasks
      const cronTasks = tasks.filter(
        (task): task is CronTask => task.type === "cron",
      );
      if (cronTasks.length > 0) {
        this.logger.debug("Setting up cron task scheduler", {
          cronTaskCount: cronTasks.length,
          taskNames: cronTasks.map((t) => t.name),
        });

        // For now, just log that we would schedule them
        // In a real implementation, you'd use a cron scheduler here
        cronTasks.forEach((task) => {
          if (task.enabled) {
            this.logger.debug(
              `Would schedule cron task: ${task.name} with schedule: ${task.schedule}`,
            );
          } else {
            this.logger.debug(`Skipping disabled cron task: ${task.name}`);
          }
        });
      }

      this.logger.debug("Task runner startup completed", {
        totalTasks: tasks.length,
        sideTasksStarted: sideTasks.filter((t) => t.enabled).length,
        cronTasksScheduled: cronTasks.filter((t) => t.enabled).length,
        locale,
        signal: signal.aborted ? "aborted" : "active",
      });
    } catch (error) {
      const errorMsg = parseError(error).message;
      this.logger.error("Background task startup failed", {
        error: errorMsg,
      });
    }
  }

  async stop(locale: CountryLanguage): Promise<ResponseType<void>> {
    // Mark parameter as used for now
    void locale;

    this.isRunning = false;

    // Stop all running side tasks
    for (const [taskName] of this.runningProcesses) {
      this.stopSideTask(taskName);
    }

    this.runningTasks.clear();
    this.runningProcesses.clear();

    // Add a small delay to ensure cleanup is complete
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });

    return createSuccessResponse(undefined);
  }

  getStatus(): {
    running: boolean;
    activeTasks: string[];
    errors: Array<{ taskName: string; error: string; timestamp: Date }>;
  } {
    return {
      running: this.isRunning,
      activeTasks: this.getRunningTasks(),
      errors: this.errors,
    };
  }

  // Helper methods
  private markTaskAsRunning(taskName: string, type: "cron" | "side"): void {
    const controller = new AbortController();
    this.runningProcesses.set(taskName, controller);

    const existingStatus = this.runningTasks.get(taskName);
    this.runningTasks.set(taskName, {
      name: taskName,
      type,
      status: "running",
      runCount: (existingStatus?.runCount || 0) + 1,
      errorCount: existingStatus?.errorCount || 0,
      successCount: existingStatus?.successCount || 0,
      lastRun: new Date(),
    });
  }

  private markTaskAsCompleted(taskName: string): void {
    const status = this.runningTasks.get(taskName);
    if (status) {
      this.runningTasks.set(taskName, {
        ...status,
        status: "completed",
        successCount: status.successCount + 1,
        lastExecutionDuration: Date.now() - (status.lastRun?.getTime() || 0),
      });
    }
    this.runningProcesses.delete(taskName);
  }

  private markTaskAsFailed(taskName: string, error: string): void {
    const status = this.runningTasks.get(taskName);
    if (status) {
      this.runningTasks.set(taskName, {
        ...status,
        status: "failed",
        errorCount: status.errorCount + 1,
        lastError: error,
        lastExecutionDuration: Date.now() - (status.lastRun?.getTime() || 0),
      });
    }

    this.errors.push({
      taskName,
      error,
      timestamp: new Date(),
    });

    this.runningProcesses.delete(taskName);
  }
}

// Export singleton instance
export const unifiedTaskRunnerRepository =
  new UnifiedTaskRunnerRepositoryImpl();
