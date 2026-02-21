/**
 * Unified Task Runner Repository
 * Implements single unified task runner as per spec.md requirements
 * Handles both cron tasks and side tasks with overlap prevention
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import {
  isFileResponse,
  isStreamingResponse,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/user/auth/types";
import { users as usersTable } from "@/app/api/[locale]/user/db";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CronTaskExecution } from "../cron/db";
import { CronTasksRepository } from "../cron/repository";
import { CronTaskStatus } from "../enum";
import type {
  UnifiedRunnerRequestOutput,
  UnifiedRunnerResponseOutput,
} from "./definition";
import type {
  CronTaskAny,
  JsonValue,
  ResolveRouteIdResult,
  Task,
  TaskRunner,
  TaskStatus,
} from "./types";

/**
 * Resolve a routeId to its full endpoint path.
 * Resolution order:
 *  1. aliasToPathMap (endpoint aliases/paths) → { kind: "endpoint" }
 *  2. unknown → { kind: "unknown" }
 */
export async function resolveRouteId(
  routeId: string,
): Promise<ResolveRouteIdResult> {
  const { getFullPath } =
    await import("@/app/api/[locale]/system/generated/endpoint");
  const path = getFullPath(routeId);
  if (path !== null) {
    return { kind: "endpoint", path };
  }

  return { kind: "unknown" };
}

// System user for cron task execution
const CRON_SYSTEM_USER: JwtPrivatePayloadType = {
  id: "system-cron",
  leadId: "system-cron-lead",
  isPublic: false,
  roles: [UserPermissionRole.ADMIN],
};

/**
 * Task Runner Manager Interface
 * Enhanced to match spec.md unified task runner requirements
 */
export interface TaskRunnerManager {
  name: "unified-task-runner";
  description: string;

  // Environment-specific behavior
  environment: "development" | "production" | "serverless";

  // Task execution with overlap prevention
  executeCronTask: (
    task: CronTaskAny,
  ) => Promise<ResponseType<{ status: string; message: string }>>;
  startTaskRunner: (
    task: TaskRunner,
    signal: AbortSignal,
  ) => Promise<ResponseType<void>>;
  stopTaskRunner: (taskName: string) => void;

  // Task state management
  getTaskStatus: (taskName: string) => TaskStatus;
  isTaskRunning: (taskName: string) => boolean;
  getRunningTasks: () => string[];

  // Core lifecycle methods
  start(
    tasks: Task[],
    signal: AbortSignal,
    systemLocale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<void>;
  stop(systemLocale: CountryLanguage): Promise<ResponseType<void>>;
  getStatus(): {
    running: boolean;
    activeTasks: string[];
    errors: Array<{ taskName: string; error: string; timestamp: Date }>;
  };

  manageRunner(
    data: UnifiedRunnerRequestOutput,
    user: JwtPayloadType,
    systemLocale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UnifiedRunnerResponseOutput>>;
}

/**
 * Unified Task Runner Repository Implementation
 * Implements the complete unified task runner as per spec.md
 */
export class UnifiedTaskRunnerRepositoryImpl implements TaskRunnerManager {
  name = "unified-task-runner" as const;
  description =
    "app.api.system.unifiedInterface.tasks.unifiedRunner.description" as const;
  environment: "development" | "production" | "serverless" = "development";

  private runningTasks = new Map<string, TaskStatus>();
  private runningProcesses = new Map<string, AbortController>();
  isRunning = false;
  private errors: Array<{
    taskName: string;
    error: string;
    timestamp: Date;
  }> = [];

  // Execution context stored when runner starts
  systemLocale!: CountryLanguage;
  logger!: EndpointLogger;
  private cronUser: JwtPrivatePayloadType = CRON_SYSTEM_USER;

  async manageRunner(
    data: UnifiedRunnerRequestOutput,
    user: JwtPayloadType,
    systemLocale: CountryLanguage,
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
          await this.startAndBlock(systemLocale, logger);
          // Never reached when blocking - but needed for restart case
          return success({
            success: true,
            actionResult: data.action,
            message:
              "app.api.system.unifiedInterface.tasks.unifiedRunner.post.response.message",
            timestamp,
          });

        case "stop":
          await this.stop(systemLocale);
          return success({
            success: true,
            actionResult: data.action,
            message:
              "app.api.system.unifiedInterface.tasks.unifiedRunner.post.response.message",
            timestamp,
          });

        case "restart":
          await this.stop(systemLocale);
          await this.startAndBlock(systemLocale, logger);
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
    task: CronTaskAny,
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

    // Look up system task DB record by routeId to get its ID, priority, and config
    const dbTaskResponse = await CronTasksRepository.getSystemTaskByRouteId(
      taskName,
      this.logger,
    );
    const dbTask = dbTaskResponse.success ? dbTaskResponse.data : null;

    // taskInput: DB value overrides file-task default.
    // splitTaskArgs() splits the flat merged input by URL-param schema at execution time.
    const resolvedInput: Record<string, JsonValue> =
      dbTask?.taskInput ?? task.taskInput ?? {};

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
          config: resolvedInput,
          triggeredBy: "schedule",
        },
        this.logger,
      );
      if (execResponse.success) {
        executionDbId = execResponse.data.id;
      }
    }

    const startTime = Date.now();

    // Resolve user locale: if task has a userId, use their locale; otherwise fall back to systemLocale
    let userLocale: CountryLanguage = this.systemLocale;
    if (dbTask?.userId) {
      const ownerRow = await db
        .select({ locale: usersTable.locale })
        .from(usersTable)
        .where(eq(usersTable.id, dbTask.userId))
        .limit(1);
      if (ownerRow[0]?.locale) {
        userLocale = ownerRow[0].locale;
      }
    }

    try {
      // Split flat taskInput into { data, urlPathParams } using the endpoint's URL-param schema.
      const { splitTaskArgs } = await import("../cron/arg-splitter");
      const path = `${task.definition.path.join("_")}_${task.definition.method}`;
      const { data, urlPathParams } = await splitTaskArgs(path, resolvedInput);

      // Call the route handler directly — no more string-based resolution
      const result = await task.route({
        data,
        urlPathParams,
        user: this.cronUser,
        locale: userLocale,
        logger: this.logger,
        platform: Platform.CLI,
      });

      const durationMs = Date.now() - startTime;

      // Cron tasks should not return streaming/file responses
      if (isStreamingResponse(result) || isFileResponse(result)) {
        this.markTaskAsCompleted(taskName);
        return success({
          status: CronTaskStatus.COMPLETED,
          message: `Task ${taskName} returned a non-standard response`,
        });
      }

      if (!result.success) {
        const errorMsg =
          "message" in result && typeof result.message === "string"
            ? result.message
            : "Task failed";
        this.markTaskAsFailed(taskName, errorMsg);

        // Persist failure
        if (dbTask && executionDbId) {
          await CronTasksRepository.updateExecution(
            executionDbId,
            {
              status: CronTaskStatus.FAILED,
              completedAt: new Date(),
              durationMs,
              error: fail({
                message: errorMsg,
                errorType: ErrorResponseTypes.INTERNAL_ERROR,
              }),
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
            null,
            this.logger,
          );

          // Run-once: disable task after first execution (success or failure)
          if (dbTask.runOnce) {
            await CronTasksRepository.updateTask(
              dbTask.id,
              { enabled: false },
              null,
              this.logger,
            );
            this.logger.info(
              `[run-once] Task "${taskName}" disabled after single execution`,
            );
          }
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
        const resultPayload: CronTaskExecution["result"] =
          result.data !== undefined && result.data !== null
            ? result.data
            : null;
        await CronTasksRepository.updateExecution(
          executionDbId,
          {
            status: CronTaskStatus.COMPLETED,
            completedAt: new Date(),
            durationMs,
            result: resultPayload,
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
          null,
          this.logger,
        );

        // Run-once: disable task after first execution (success or failure)
        if (dbTask.runOnce) {
          await CronTasksRepository.updateTask(
            dbTask.id,
            { enabled: false },
            null,
            this.logger,
          );
          this.logger.info(
            `[run-once] Task "${taskName}" disabled after single execution`,
          );
        }
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
            error: fail({
              message: errorMsg,
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            }),
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
          null,
          this.logger,
        );

        // Run-once: disable task after first execution (success or failure)
        if (dbTask.runOnce) {
          await CronTasksRepository.updateTask(
            dbTask.id,
            { enabled: false },
            null,
            this.logger,
          );
          this.logger.info(
            `[run-once] Task "${taskName}" disabled after single execution`,
          );
        }
      }

      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.unifiedRunner.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMsg, taskName },
      });
    }
  }

  async startTaskRunner(
    task: TaskRunner,
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

    this.markTaskAsRunning(taskName, "task-runner");

    try {
      await task.run({
        signal,
        logger: this.logger,
        systemLocale: this.systemLocale,
        userLocale: this.systemLocale,
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
          systemLocale: this.systemLocale,
          userLocale: this.systemLocale,
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

  stopTaskRunner(taskName: string): void {
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
    systemLocale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<void> {
    try {
      // Store execution context
      this.systemLocale = systemLocale;
      this.logger = logger;

      this.logger.debug("Starting unified task runner", {
        taskCount: tasks.length,
        environment: this.environment,
      });

      this.isRunning = true;

      // Start all side tasks and task runners in background
      void this.startTasksInBackground(tasks, signal, systemLocale);

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
    systemLocale: CountryLanguage,
  ): void {
    try {
      // Start all task runners
      const taskRunners = tasks.filter(
        (task): task is TaskRunner => task.type === "task-runner",
      );

      this.logger.debug("Starting task runners", {
        taskRunnerCount: taskRunners.length,
        taskNames: taskRunners.map((t) => t.name),
      });

      // Start each task runner in parallel
      const taskRunnerPromises = taskRunners.map(async (task) => {
        if (!task.enabled) {
          this.logger.debug(`Skipping disabled task runner: ${task.name}`);
          return;
        }

        this.logger.debug(`Starting task runner: ${task.name}`);

        try {
          // Create abort controller for this specific task runner
          const taskController = new AbortController();
          this.runningProcesses.set(task.name, taskController);

          // Mark task runner as running
          this.markTaskAsRunning(task.name, "task-runner");

          // Start the task runner
          await task.run({
            signal: taskController.signal,
            logger: this.logger,
            systemLocale: this.systemLocale,
            userLocale: this.systemLocale,
            cronUser: this.cronUser,
          });

          this.logger.debug(`Task runner completed: ${task.name}`);
          this.markTaskAsCompleted(task.name);
        } catch (error) {
          const errorObj = parseError(error);
          this.logger.error(`Task runner failed: ${task.name}`, errorObj);
          this.markTaskAsFailed(task.name, errorObj.message);

          if (task.onError) {
            await task.onError({
              error: errorObj,
              logger: this.logger,
              systemLocale: this.systemLocale,
              userLocale: this.systemLocale,
              cronUser: this.cronUser,
            });
          }
        }
      });

      // Don't await all promises - let them run in background
      void Promise.allSettled(taskRunnerPromises)
        .then(() => {
          this.logger.debug("All task runners have completed or failed");
          return;
        })
        .catch((error) => {
          this.logger.error("Error in task runner promises", parseError(error));
        });

      // Cron tasks are executed by the pulse runner (task-runner.ts),
      // not scheduled here — pulse fires every minute and uses isCronTaskDue()
      const cronTasks = tasks.filter(
        (task): task is CronTaskAny => task.type === "cron",
      );
      this.logger.debug("Cron tasks registered (executed via pulse runner)", {
        cronTaskCount: cronTasks.length,
        taskNames: cronTasks.map((t) => t.name),
      });

      this.logger.debug("Task runner startup completed", {
        totalTasks: tasks.length,
        taskRunnersStarted: taskRunners.filter((t) => t.enabled).length,
        cronTasksScheduled: cronTasks.filter((t) => t.enabled).length,
        systemLocale,
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
    systemLocale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<never> {
    const { taskRegistry } =
      await import("@/app/api/[locale]/system/generated/tasks-index");

    // Upsert task definitions into DB so they appear in the UI
    const { prod: seedTasks } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/seeds");
    await seedTasks(logger);

    const abortController = new AbortController();
    const { signal } = abortController;

    const startResult = this.start(
      taskRegistry.allTasks,
      signal,
      systemLocale,
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
        void this.stop(systemLocale).then(() => {
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

  async stop(systemLocale: CountryLanguage): Promise<ResponseType<void>> {
    // Mark parameter as used for now
    void systemLocale;

    this.isRunning = false;

    // Stop all running task runners
    for (const [taskName] of this.runningProcesses) {
      this.stopTaskRunner(taskName);
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
  private markTaskAsRunning(
    taskName: string,
    type: "cron" | "task-runner",
  ): void {
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

    // Keep only the most recent 100 errors to prevent unbounded memory growth
    if (this.errors.length > 100) {
      this.errors.splice(0, this.errors.length - 100);
    }

    this.runningProcesses.delete(taskName);
  }
}

// Export singleton instance
export const unifiedTaskRunnerRepository =
  new UnifiedTaskRunnerRepositoryImpl();
