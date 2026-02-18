/**
 * Unified Task Runner Repository
 * Implements single unified task runner as per spec.md requirements
 * Handles both cron tasks and side tasks with overlap prevention
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronTasksRepository } from "../cron/repository";
import { parseCronExpression } from "../cron-formatter";
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
  roles: [UserPermissionRole.ADMIN],
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
export class UnifiedTaskRunnerRepositoryImpl implements UnifiedTaskRunnerRepository {
  name = "unified-task-runner" as const;
  description =
    "app.api.system.unifiedInterface.tasks.unifiedRunner.description" as const;
  environment: "development" | "production" | "serverless" = "development";
  supportsSideTasks = true;

  private runningTasks = new Map<string, TaskStatus>();
  private runningProcesses = new Map<string, AbortController>();
  isRunning = false;
  private errors: Array<{
    taskName: string;
    error: string;
    timestamp: Date;
  }> = [];

  // Execution context stored when runner starts
  locale!: CountryLanguage;
  logger!: EndpointLogger;
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
          return success({
            success: true,
            actionResult: data.action,
            message:
              "app.api.system.unifiedInterface.tasks.unifiedRunner.post.response.message",
            timestamp,
          });

        case "start":
          // Load task registry and start the runner for real
          await this.startAndBlock(locale, logger);
          // Never reached when blocking - but needed for restart case
          return success({
            success: true,
            actionResult: data.action,
            message:
              "app.api.system.unifiedInterface.tasks.unifiedRunner.post.response.message",
            timestamp,
          });

        case "stop":
          await this.stop(locale);
          return success({
            success: true,
            actionResult: data.action,
            message:
              "app.api.system.unifiedInterface.tasks.unifiedRunner.post.response.message",
            timestamp,
          });

        case "restart":
          await this.stop(locale);
          await this.startAndBlock(locale, logger);
          return success({
            success: true,
            actionResult: data.action,
            message:
              "app.api.system.unifiedInterface.tasks.unifiedRunner.post.response.message",
            timestamp,
          });

        default:
          return fail({
            message:
              "app.api.system.unifiedInterface.tasks.unifiedRunner.post.errors.validation.title",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: { action: data.action },
          });
      }
    } catch (error) {
      logger.error("Failed to manage unified task runner", {
        error: parseError(error).message,
        action: data.action,
      });

      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.unifiedRunner.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  // TaskRunnerManager interface implementation
  async executeCronTask(
    task: CronTask,
  ): Promise<ResponseType<{ status: string; message: string }>> {
    const taskName = task.name;

    // Check if task is already running (overlap prevention)
    if (this.isTaskRunning(taskName)) {
      return success({
        status: CronTaskStatus.SKIPPED,
        reason:
          "app.api.system.unifiedInterface.tasks.unifiedRunner.reasons.previousInstanceRunning",
        message:
          "app.api.system.unifiedInterface.tasks.unifiedRunner.messages.taskSkipped",
      });
    }

    // Mark task as running
    this.markTaskAsRunning(taskName, "cron");

    // Ensure execution context is available
    if (!this.logger) {
      const errorMsg = "Task runner not properly initialized with logger";
      this.markTaskAsFailed(taskName, errorMsg);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.unifiedRunner.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMsg, taskName },
      });
    }

    // Look up task DB record to get its ID and priority
    const dbTaskResponse = await CronTasksRepository.getTaskByName(
      taskName,
      this.logger,
    );
    const dbTask = dbTaskResponse.success ? dbTaskResponse.data : null;

    const executionId = crypto.randomUUID();
    const startedAt = new Date();

    // Create execution record in DB (if task is known to DB)
    let executionDbId: string | null = null;
    if (dbTask) {
      const execResponse = await CronTasksRepository.createExecution(
        {
          taskId: dbTask.id,
          taskName,
          executionId,
          status: CronTaskStatus.RUNNING,
          priority: dbTask.priority,
          startedAt,
          config: {},
          triggeredBy: "schedule",
        },
        this.logger,
      );
      if (execResponse.success) {
        executionDbId = execResponse.data.id;
      }
    }

    const startTime = Date.now();

    try {
      // Execute task with required props
      const result = await task.run({
        logger: this.logger,
        locale: this.locale,
        cronUser: this.cronUser,
      });

      const durationMs = Date.now() - startTime;

      // Check if task returned an error
      if (result && typeof result === "object" && "error" in result) {
        const errorMsg =
          typeof result.error === "string" ? result.error : "Task failed";
        this.markTaskAsFailed(taskName, errorMsg);

        // Persist failure
        if (dbTask && executionDbId) {
          await CronTasksRepository.updateExecution(
            executionDbId,
            {
              status: CronTaskStatus.FAILED,
              completedAt: new Date(),
              durationMs,
              error: { message: errorMsg },
            },
            this.logger,
          );
          await CronTasksRepository.updateTask(
            dbTask.id,
            {
              lastExecutedAt: startedAt,
              lastExecutionStatus: CronTaskStatus.FAILED,
              lastExecutionError: errorMsg,
              lastExecutionDuration: durationMs,
              executionCount: dbTask.executionCount + 1,
              errorCount: dbTask.errorCount + 1,
            },
            this.logger,
          );
        }

        return fail({
          message:
            "app.api.system.unifiedInterface.tasks.unifiedRunner.post.errors.internal.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: errorMsg, taskName },
        });
      }

      this.markTaskAsCompleted(taskName);

      // Persist success
      if (dbTask && executionDbId) {
        await CronTasksRepository.updateExecution(
          executionDbId,
          {
            status: CronTaskStatus.COMPLETED,
            completedAt: new Date(),
            durationMs,
          },
          this.logger,
        );
        await CronTasksRepository.updateTask(
          dbTask.id,
          {
            lastExecutedAt: startedAt,
            lastExecutionStatus: CronTaskStatus.COMPLETED,
            lastExecutionError: null,
            lastExecutionDuration: durationMs,
            executionCount: dbTask.executionCount + 1,
            successCount: dbTask.successCount + 1,
          },
          this.logger,
        );
      }

      return success({
        status: CronTaskStatus.COMPLETED,
        message:
          "app.api.system.unifiedInterface.tasks.unifiedRunner.messages.taskCompleted",
      });
    } catch (error) {
      const errorMsg = parseError(error).message;
      const durationMs = Date.now() - startTime;
      this.markTaskAsFailed(taskName, errorMsg);

      // Persist failure
      if (dbTask && executionDbId) {
        await CronTasksRepository.updateExecution(
          executionDbId,
          {
            status: CronTaskStatus.FAILED,
            completedAt: new Date(),
            durationMs,
            error: { message: errorMsg },
          },
          this.logger,
        );
        await CronTasksRepository.updateTask(
          dbTask.id,
          {
            lastExecutedAt: startedAt,
            lastExecutionStatus: CronTaskStatus.FAILED,
            lastExecutionError: errorMsg,
            lastExecutionDuration: durationMs,
            executionCount: dbTask.executionCount + 1,
            errorCount: dbTask.errorCount + 1,
          },
          this.logger,
        );
      }

      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.unifiedRunner.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMsg, taskName },
      });
    }
  }

  async startSideTask(
    task: SideTask,
    signal: AbortSignal,
  ): Promise<ResponseType<void>> {
    const taskName = task.name;

    if (this.isTaskRunning(taskName)) {
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.unifiedRunner.post.errors.validation.title",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: { taskName },
      });
    }

    this.markTaskAsRunning(taskName, "side");

    try {
      await task.run({
        signal,
        logger: this.logger,
        locale: this.locale,
        cronUser: this.cronUser,
      });
      this.markTaskAsCompleted(taskName);
      return success();
    } catch (error) {
      const errorObj = parseError(error);
      this.markTaskAsFailed(taskName, errorObj.message);
      if (task.onError) {
        await task.onError({
          error: errorObj,
          logger: this.logger,
          locale: this.locale,
          cronUser: this.cronUser,
        });
      }
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.unifiedRunner.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorObj.message, taskName },
      });
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
    return [...this.runningTasks.keys()].filter((taskName) =>
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

      return success();
    } catch (error) {
      const errorMsg = parseError(error).message;

      // Use logger if available, otherwise fall back to console (during initialization)
      if (this.logger) {
        this.logger.error("Failed to start task runner", {
          error: errorMsg,
        });
      }

      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.unifiedRunner.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMsg },
      });
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
          await task.run({
            signal: taskController.signal,
            logger: this.logger,
            locale: this.locale,
            cronUser: this.cronUser,
          });

          this.logger.debug(`Side task completed: ${task.name}`);
          this.markTaskAsCompleted(task.name);
        } catch (error) {
          const errorObj = parseError(error);
          this.logger.error(`Side task failed: ${task.name}`, errorObj);
          this.markTaskAsFailed(task.name, errorObj.message);

          if (task.onError) {
            await task.onError({
              error: errorObj,
              logger: this.logger,
              locale: this.locale,
              cronUser: this.cronUser,
            });
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
          this.logger.error("Error in side task promises", parseError(error));
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

        cronTasks.forEach((task) => {
          if (!task.enabled) {
            this.logger.debug(`Skipping disabled cron task: ${task.name}`);
            return;
          }
          this.scheduleCronTask(task, signal);
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

  /**
   * Load task registry, call start(), then block forever (never returns).
   * Used by manageRunner("start") when invoked via CLI or HTTP.
   * Exits cleanly on SIGINT/SIGTERM.
   */
  private async startAndBlock(
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<never> {
    const { taskRegistry } =
      await import("@/app/api/[locale]/system/generated/tasks-index");

    // Upsert task definitions into DB so they appear in the UI
    const { dev: seedTasks } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/seeds");
    await seedTasks(logger);

    const abortController = new AbortController();
    const { signal } = abortController;

    this.environment = "production";
    this.supportsSideTasks = true;

    const startResult = this.start(
      taskRegistry.allTasks,
      signal,
      locale,
      logger,
    );
    if (!startResult.success) {
      logger.error("Failed to start task runner", {
        message: startResult.message,
      });
      process.exit(1);
    }

    logger.info(
      `Task runner started with ${taskRegistry.allTasks.length} tasks. Press Ctrl+C to stop.`,
    );

    // Block forever - only exits via process signals
    await new Promise<void>((resolve) => {
      const shutdown = (): void => {
        logger.info("Shutting down task runner...");
        abortController.abort();
        void this.stop(locale).then(() => {
          resolve();
          return undefined;
        });
      };

      process.once("SIGINT", shutdown);
      process.once("SIGTERM", shutdown);
    });

    // Process exits after stop() completes above; this line never actually runs
    return Promise.reject<never>(new Error("unreachable"));
  }

  /**
   * Schedule a cron task using setTimeout loops driven by cron-parser.
   * Calculates next execution time, waits, executes, then reschedules.
   */
  private scheduleCronTask(task: CronTask, signal: AbortSignal): void {
    const scheduleNext = (): void => {
      if (signal.aborted || !this.isRunning) {
        this.logger.debug(`Cron task stopped scheduling: ${task.name}`);
        return;
      }

      const interval = parseCronExpression(this.logger, task.schedule);
      if (!interval) {
        this.logger.error(
          `Invalid cron schedule for task ${task.name}: ${task.schedule}`,
        );
        return;
      }

      const nextRun = interval.next().toDate();
      const now = new Date();
      const delayMs = Math.max(0, nextRun.getTime() - now.getTime());

      this.logger.debug(
        `Next run for ${task.name} in ${Math.round(delayMs / 1000)}s`,
        {
          schedule: task.schedule,
          nextRun: nextRun.toISOString(),
        },
      );

      const timeoutId = setTimeout(() => {
        if (signal.aborted || !this.isRunning) {
          return;
        }

        this.logger.debug(`Executing cron task: ${task.name}`);
        void this.executeCronTask(task)
          .then((result) => {
            if (!result.success) {
              this.logger.error(`Cron task failed: ${task.name}`, {
                message: result.message,
              });
              if (task.onError) {
                void task.onError({
                  error: new Error(result.message),
                  logger: this.logger,
                  locale: this.locale,
                  cronUser: this.cronUser,
                });
              }
            } else {
              this.logger.debug(`Cron task completed: ${task.name}`);
            }
            return undefined;
          })
          .catch((error) => {
            this.logger.error(
              `Cron task threw: ${task.name}`,
              parseError(error),
            );
          })
          .finally(() => {
            // Reschedule for next run
            scheduleNext();
          });
      }, delayMs);

      // Store timeout handle so we can cancel on stop
      const controller = new AbortController();
      this.runningProcesses.set(`cron-timer:${task.name}`, controller);
      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
      });
    };

    scheduleNext();
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

    return success();
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
