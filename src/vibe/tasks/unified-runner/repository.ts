/**
 * Unified Task Runner Repository
 * Implements single unified task runner as per spec.md requirements
 * Handles both cron tasks and side tasks with overlap prevention
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { scopedTranslation as tasksScopedTranslation } from "next-vibe/tasks/i18n";

import type {
  UnifiedRunnerRequestOutput,
  UnifiedRunnerResponseOutput,
} from "./definition";
import type { CronTaskAny, Task, TaskRunner, TaskStatus } from "./types";

/**
 * Unified Task Runner Repository
 * Implements the complete unified task runner as per spec.md
 */
export class UnifiedTaskRunnerRepository {
  /**
   * Fallback user for system tasks (userId IS NULL in DB).
   * Only used when a task has no owner - e.g. seeded infrastructure tasks.
   * User-created tasks always execute as their owner's actual roles.
   */
  private static readonly CRON_SYSTEM_USER: JwtPrivatePayloadType = {
    id: "system-cron",
    leadId: "system-cron-lead",
    isPublic: false,
    roles: [UserPermissionRole.ADMIN],
  };
  static runnerName = "unified-task-runner" as const;
  static runnerDescription = "description" as const;
  static environment: "development" | "production" | "serverless" =
    "development";

  private static runningTasks = new Map<string, TaskStatus>();
  private static runningProcesses = new Map<string, AbortController>();
  static isRunning = false;
  private static errors: Array<{
    taskName: string;
    error: string;
    timestamp: Date;
  }> = [];

  // Execution context stored when runner starts
  static systemLocale: CountryLanguage | undefined = undefined;
  static logger: EndpointLogger | undefined = undefined;
  private static systemCronUser: JwtPrivatePayloadType =
    UnifiedTaskRunnerRepository.CRON_SYSTEM_USER;

  static async manageRunner(
    data: UnifiedRunnerRequestOutput,
    user: JwtPayloadType,
    systemLocale: CountryLanguage,
    logger: EndpointLogger,
    skipTanstack: boolean,
  ): Promise<ResponseType<UnifiedRunnerResponseOutput>> {
    const { t } = tasksScopedTranslation.scopedT(systemLocale);
    try {
      logger.debug("Managing unified task runner", {
        action: data.action,
        taskFilter: data.taskFilter || "all",
        dryRun: data.dryRun,
        userId: user.id,
      });

      const timestamp = new Date();

      switch (data.action) {
        case "status":
          return success({
            success: true,
            actionResult: data.action,
            message: "unifiedRunner.post.response.message",
            timestamp,
          });

        case "start":
          // Load task registry and start the runner for real
          await UnifiedTaskRunnerRepository.startAndBlock(
            systemLocale,
            logger,
            skipTanstack,
          );
          // Never reached when blocking - but needed for restart case
          return success({
            success: true,
            actionResult: data.action,
            message: "unifiedRunner.post.response.message",
            timestamp,
          });

        case "stop":
          await UnifiedTaskRunnerRepository.stop(systemLocale);
          return success({
            success: true,
            actionResult: data.action,
            message: "unifiedRunner.post.response.message",
            timestamp,
          });

        case "restart":
          await UnifiedTaskRunnerRepository.stop(systemLocale);
          await UnifiedTaskRunnerRepository.startAndBlock(
            systemLocale,
            logger,
            skipTanstack,
          );
          return success({
            success: true,
            actionResult: data.action,
            message: "unifiedRunner.post.response.message",
            timestamp,
          });

        default:
          return fail({
            message: t("errors.getTaskRunnerStatus"),
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
        message: t("errors.startTaskRunner"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  private static stopTaskRunner(taskName: string): void {
    const controller =
      UnifiedTaskRunnerRepository.runningProcesses.get(taskName);
    if (controller) {
      controller.abort();
      UnifiedTaskRunnerRepository.runningProcesses.delete(taskName);
      UnifiedTaskRunnerRepository.runningTasks.delete(taskName);
    }
  }

  private static isTaskRunning(taskName: string): boolean {
    const status = UnifiedTaskRunnerRepository.runningTasks.get(taskName);
    return status?.status === "running";
  }

  private static getRunningTasks(): string[] {
    return [...UnifiedTaskRunnerRepository.runningTasks.keys()].filter(
      (taskName) => UnifiedTaskRunnerRepository.isTaskRunning(taskName),
    );
  }

  static start(
    tasks: Task[],
    signal: AbortSignal,
    systemLocale: CountryLanguage,
    logger: EndpointLogger,
    skipTanstack: boolean,
  ): ResponseType<void> {
    try {
      // Store execution context
      UnifiedTaskRunnerRepository.systemLocale = systemLocale;
      UnifiedTaskRunnerRepository.logger = logger;

      UnifiedTaskRunnerRepository.logger!.debug(
        "Starting unified task runner",
        {
          taskCount: tasks.length,
          environment: UnifiedTaskRunnerRepository.environment,
        },
      );

      UnifiedTaskRunnerRepository.isRunning = true;

      // Start all side tasks and task runners in background
      void UnifiedTaskRunnerRepository.startTasksInBackground(
        tasks,
        signal,
        systemLocale,
        skipTanstack,
      );

      UnifiedTaskRunnerRepository.logger!.debug(
        "Task runner startup initiated",
      );

      return success();
    } catch (error) {
      const errorMsg = parseError(error).message;

      // Use logger if available, otherwise fall back to console (during initialization)
      if (UnifiedTaskRunnerRepository.logger) {
        UnifiedTaskRunnerRepository.logger!.error(
          "Failed to start task runner",
          {
            error: errorMsg,
          },
        );
      }

      const { t: tasksT } = tasksScopedTranslation.scopedT(systemLocale);
      return fail({
        message: tasksT("errors.startTaskRunner"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMsg },
      });
    }
  }

  /**
   * Start tasks in background (async)
   */
  private static startTasksInBackground(
    tasks: Task[],
    signal: AbortSignal,
    systemLocale: CountryLanguage,
    skipTanstack: boolean,
  ): void {
    try {
      // Start all task runners
      const taskRunners = tasks.filter(
        (task): task is TaskRunner<string> => task.type === "task-runner",
      );

      UnifiedTaskRunnerRepository.logger!.debug("Starting task runners", {
        taskRunnerCount: taskRunners.length,
        taskNames: taskRunners.map((t) => t.name),
      });

      // Start each task runner in parallel
      const taskRunnerPromises = taskRunners.map(async (task) => {
        if (!task.enabled) {
          UnifiedTaskRunnerRepository.logger!.debug(
            `Skipping disabled task runner: ${task.name}`,
          );
          return;
        }

        UnifiedTaskRunnerRepository.logger!.debug(
          `Starting task runner: ${task.name}`,
        );

        try {
          // Create abort controller for this specific task runner
          const taskController = new AbortController();
          UnifiedTaskRunnerRepository.runningProcesses.set(
            task.name,
            taskController,
          );

          // Mark task runner as running
          UnifiedTaskRunnerRepository.markTaskAsRunning(
            task.name,
            "task-runner",
          );

          // Start the task runner
          await task.run({
            signal: taskController.signal,
            logger: UnifiedTaskRunnerRepository.logger!,
            systemLocale: UnifiedTaskRunnerRepository.systemLocale!,
            userLocale: UnifiedTaskRunnerRepository.systemLocale!,
            cronUser: UnifiedTaskRunnerRepository.systemCronUser,
            skipTanstack,
          });

          UnifiedTaskRunnerRepository.logger!.debug(
            `Task runner completed: ${task.name}`,
          );
          UnifiedTaskRunnerRepository.markTaskAsCompleted(task.name);
        } catch (error) {
          const errorObj = parseError(error);
          UnifiedTaskRunnerRepository.logger!.error(
            `Task runner failed: ${task.name}`,
            errorObj,
          );
          UnifiedTaskRunnerRepository.markTaskAsFailed(
            task.name,
            errorObj.message,
          );

          if (task.onError) {
            await task.onError({
              error: errorObj,
              logger: UnifiedTaskRunnerRepository.logger!,
              systemLocale: UnifiedTaskRunnerRepository.systemLocale!,
              userLocale: UnifiedTaskRunnerRepository.systemLocale!,
              cronUser: UnifiedTaskRunnerRepository.systemCronUser,
            });
          }
        }
      });

      // Don't await all promises - let them run in background
      void Promise.allSettled(taskRunnerPromises)
        .then(() => {
          UnifiedTaskRunnerRepository.logger!.debug(
            "All task runners have completed or failed",
          );
          return;
        })
        .catch((error) => {
          UnifiedTaskRunnerRepository.logger!.error(
            "Error in task runner promises",
            parseError(error),
          );
        });

      // Cron tasks are executed by the pulse runner (task-runner.ts),
      // not scheduled here - pulse fires every minute and uses isCronTaskDue()
      const cronTasks = tasks.filter(
        (task): task is CronTaskAny => task.type === "cron",
      );
      UnifiedTaskRunnerRepository.logger!.debug(
        "Cron tasks registered (executed via pulse runner)",
        {
          cronTaskCount: cronTasks.length,
          taskNames: cronTasks.map((t) => t.name),
        },
      );

      UnifiedTaskRunnerRepository.logger!.debug(
        "Task runner startup completed",
        {
          totalTasks: tasks.length,
          taskRunnersStarted: taskRunners.filter((t) => t.enabled).length,
          cronTasksScheduled: cronTasks.filter((t) => t.enabled).length,
          systemLocale,
          signal: signal.aborted ? "aborted" : "active",
        },
      );
    } catch (error) {
      const errorMsg = parseError(error).message;
      UnifiedTaskRunnerRepository.logger!.error(
        "Background task startup failed",
        {
          error: errorMsg,
        },
      );
    }
  }

  /**
   * Load task registry, call start(), then block forever (never returns).
   * Used by manageRunner("start") when invoked via CLI or HTTP.
   * Exits cleanly on SIGINT/SIGTERM.
   */
  private static async startAndBlock(
    systemLocale: CountryLanguage,
    logger: EndpointLogger,
    skipTanstack: boolean,
  ): Promise<never> {
    const { taskRegistry } = await import("@/generated/tasks/index");

    // Upsert task definitions into DB so they appear in the UI
    const { prod: seedTasks } = await import("next-vibe/dataflow/seeds");
    await seedTasks(logger);

    const abortController = new AbortController();
    const { signal } = abortController;

    const startResult = UnifiedTaskRunnerRepository.start(
      taskRegistry.allTasks,
      signal,
      systemLocale,
      logger,
      skipTanstack,
    );
    if (!startResult.success) {
      logger.error("Failed to start task runner", {
        message: startResult.message,
      });
      process.exit(1);
    }

    logger.debug(
      `Task runner started with ${taskRegistry.allTasks.length} tasks. Press Ctrl+C to stop.`,
    );

    // Block forever - only exits via process signals
    await new Promise<void>((resolve) => {
      const shutdown = (): void => {
        logger.info("Shutting down task runner...");
        abortController.abort();
        void UnifiedTaskRunnerRepository.stop(systemLocale).then(() => {
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

  private static async stop(
    systemLocale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    // Mark parameter as used for now
    void systemLocale;

    UnifiedTaskRunnerRepository.isRunning = false;

    // Stop all running task runners
    for (const [taskName] of UnifiedTaskRunnerRepository.runningProcesses) {
      UnifiedTaskRunnerRepository.stopTaskRunner(taskName);
    }

    UnifiedTaskRunnerRepository.runningTasks.clear();
    UnifiedTaskRunnerRepository.runningProcesses.clear();

    // Add a small delay to ensure cleanup is complete
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });

    return success();
  }

  static getStatus(): {
    running: boolean;
    activeTasks: string[];
    errors: Array<{ taskName: string; error: string; timestamp: Date }>;
  } {
    return {
      running: UnifiedTaskRunnerRepository.isRunning,
      activeTasks: UnifiedTaskRunnerRepository.getRunningTasks(),
      errors: UnifiedTaskRunnerRepository.errors,
    };
  }

  // Helper methods
  private static markTaskAsRunning(
    taskName: string,
    type: "cron" | "task-runner",
  ): void {
    const controller = new AbortController();
    UnifiedTaskRunnerRepository.runningProcesses.set(taskName, controller);

    const existingStatus =
      UnifiedTaskRunnerRepository.runningTasks.get(taskName);
    UnifiedTaskRunnerRepository.runningTasks.set(taskName, {
      name: taskName,
      type,
      status: "running",
      runCount: (existingStatus?.runCount || 0) + 1,
      errorCount: existingStatus?.errorCount || 0,
      successCount: existingStatus?.successCount || 0,
      lastRun: new Date(),
    });
  }

  private static markTaskAsCompleted(taskName: string): void {
    const status = UnifiedTaskRunnerRepository.runningTasks.get(taskName);
    if (status) {
      UnifiedTaskRunnerRepository.runningTasks.set(taskName, {
        ...status,
        status: "completed",
        successCount: status.successCount + 1,
        lastExecutionDuration: Date.now() - (status.lastRun?.getTime() || 0),
      });
    }
    UnifiedTaskRunnerRepository.runningProcesses.delete(taskName);
  }

  private static markTaskAsFailed(taskName: string, error: string): void {
    const status = UnifiedTaskRunnerRepository.runningTasks.get(taskName);
    if (status) {
      UnifiedTaskRunnerRepository.runningTasks.set(taskName, {
        ...status,
        status: "failed",
        errorCount: status.errorCount + 1,
        lastError: error,
        lastExecutionDuration: Date.now() - (status.lastRun?.getTime() || 0),
      });
    }

    UnifiedTaskRunnerRepository.errors.push({
      taskName,
      error,
      timestamp: new Date(),
    });

    // Keep only the most recent 100 errors to prevent unbounded memory growth
    if (UnifiedTaskRunnerRepository.errors.length > 100) {
      UnifiedTaskRunnerRepository.errors.splice(
        0,
        UnifiedTaskRunnerRepository.errors.length - 100,
      );
    }

    UnifiedTaskRunnerRepository.runningProcesses.delete(taskName);
  }
}
