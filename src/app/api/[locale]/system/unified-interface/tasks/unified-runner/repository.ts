/**
 * Unified Task Runner Repository
 * Implements single unified task runner as per spec.md requirements
 * Handles both cron tasks and side tasks with overlap prevention
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import {
  isContentResponse,
  isFileResponse,
  isStreamingResponse,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { getFullPath } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/user/auth/types";
import {
  userRoles as userRolesTable,
  users as usersTable,
} from "@/app/api/[locale]/user/db";
import {
  UserPermissionRole,
  UserRoleDB,
} from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CronTaskExecution } from "../cron/db";
import { CronTasksRepository } from "../cron/repository";
import { CronTaskStatus } from "../enum";
import { scopedTranslation as tasksScopedTranslation } from "../i18n";
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

interface ExecuteCronTaskResult {
  status: string;
  message: string;
}

/**
 * Unified Task Runner Repository
 * Implements the complete unified task runner as per spec.md
 */
export class UnifiedTaskRunnerRepository {
  /**
   * Resolve a routeId to its full endpoint path.
   * Resolution order:
   *  1. pathToAliasMap (endpoint aliases/paths) → { kind: "endpoint" }
   *  2. unknown → { kind: "unknown" }
   */
  static async resolveRouteId(routeId: string): Promise<ResolveRouteIdResult> {
    const path = getFullPath(routeId);
    if (path !== null) {
      return { kind: "endpoint", path };
    }

    return { kind: "unknown" };
  }
  /**
   * Fallback user for system tasks (userId IS NULL in DB).
   * Only used when a task has no owner — e.g. seeded infrastructure tasks.
   * User-created tasks always execute as their owner's actual roles.
   */
  private static readonly CRON_SYSTEM_USER: JwtPrivatePayloadType = {
    id: "system-cron",
    leadId: "system-cron-lead",
    isPublic: false,
    roles: [UserPermissionRole.ADMIN],
  };
  static name = "unified-task-runner" as const;
  static description = "description" as const;
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
  ): Promise<ResponseType<UnifiedRunnerResponseOutput>> {
    const { t } = tasksScopedTranslation.scopedT(systemLocale);
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
            message: "unifiedRunner.post.response.message",
            timestamp,
          });

        case "start":
          // Load task registry and start the runner for real
          await UnifiedTaskRunnerRepository.startAndBlock(systemLocale, logger);
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
          await UnifiedTaskRunnerRepository.startAndBlock(systemLocale, logger);
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

  // TaskRunnerManager interface implementation
  static async executeCronTask(
    task: CronTaskAny,
  ): Promise<ResponseType<ExecuteCronTaskResult>> {
    const { t } = tasksScopedTranslation.scopedT(
      UnifiedTaskRunnerRepository.systemLocale!,
    );
    const taskName = task.name;

    // Check if task is already running (overlap prevention)
    if (UnifiedTaskRunnerRepository.isTaskRunning(taskName)) {
      return success({
        status: CronTaskStatus.SKIPPED,
        reason: "Previous instance still running",
        message: "Task skipped",
      });
    }

    // Mark task as running
    UnifiedTaskRunnerRepository.markTaskAsRunning(taskName, "cron");

    // Ensure execution context is available
    if (!UnifiedTaskRunnerRepository.logger) {
      const errorMsg = "Task runner not properly initialized with logger";
      UnifiedTaskRunnerRepository.markTaskAsFailed(taskName, errorMsg);
      return fail({
        message: t("errors.startTaskRunner"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMsg, taskName },
      });
    }

    // Look up system task DB record by routeId to get its ID, priority, and config
    const dbTaskResponse = await CronTasksRepository.getSystemTaskByRouteId(
      taskName,
      t,
      UnifiedTaskRunnerRepository.logger!,
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
          serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          executedByInstance: null,
        },
        t,
        UnifiedTaskRunnerRepository.logger!,
      );
      if (execResponse.success) {
        executionDbId = execResponse.data.id;
      }
    }

    const startTime = Date.now();

    // Resolve user locale and roles: if task has a userId, use their locale and roles;
    // otherwise fall back to systemLocale and ADMIN system user.
    let userLocale: CountryLanguage = UnifiedTaskRunnerRepository.systemLocale!;
    let taskUser: JwtPrivatePayloadType =
      UnifiedTaskRunnerRepository.systemCronUser;

    if (dbTask?.userId) {
      const ownerRow = await db
        .select({ locale: usersTable.locale })
        .from(usersTable)
        .where(eq(usersTable.id, dbTask.userId))
        .limit(1);

      if (ownerRow[0]) {
        if (ownerRow[0].locale) {
          userLocale = ownerRow[0].locale;
        }

        // Load the task owner's actual roles — execute with their permissions,
        // not the hardcoded ADMIN system user. Prevents privilege escalation
        // where a CUSTOMER creates a cron task that calls an ADMIN-only endpoint.
        const roleRows = await db
          .select({ role: userRolesTable.role })
          .from(userRolesTable)
          .where(
            and(
              eq(userRolesTable.userId, dbTask.userId),
              inArray(userRolesTable.role, [...UserRoleDB]),
            ),
          );

        const roles = roleRows.map(
          (r) => r.role,
        ) as (typeof UserRoleDB)[number][];

        taskUser = {
          id: dbTask.userId,
          // leadId is not stored on users table (users can have multiple leads).
          // Use task id as a stable, unique scope for cron-executed AI operations.
          leadId: dbTask.userId,
          isPublic: false,
          roles: roles.length > 0 ? roles : [UserPermissionRole.CUSTOMER],
        };
      }
    }

    try {
      // Split flat taskInput into { data, urlPathParams } using the endpoint's URL-param schema.
      const { splitTaskArgs } = await import("../cron/arg-splitter");
      const { getPreferredToolName } =
        await import("@/app/api/[locale]/system/unified-interface/shared/utils/path");
      const path = getPreferredToolName(task.definition);
      const { data, urlPathParams } = await splitTaskArgs(path, resolvedInput);

      // Call the route handler directly — no more string-based resolution
      const taskAbortController = new AbortController();
      const result = await task.route({
        data,
        urlPathParams,
        user: taskUser,
        locale: userLocale,
        logger: UnifiedTaskRunnerRepository.logger!,
        platform: Platform.CRON,
        cronTaskId: dbTask?.id,
        streamContext: {
          rootFolderId: DefaultFolderId.CRON,
          threadId: undefined,
          aiMessageId: undefined,
          currentToolMessageId: undefined,
          callerToolCallId: undefined,
          pendingToolMessages: undefined,
          pendingTimeoutMs: undefined,
          leafMessageId: undefined,
          skillId: undefined,
          modelId: undefined,
          favoriteId: undefined,
          headless: undefined,
          waitingForRemoteResult: undefined,
          abortSignal: taskAbortController.signal,
          callerCallbackMode: undefined,
          onEscalatedTaskCancel: undefined,
          escalateToTask: undefined,
        },
      });

      const durationMs = Date.now() - startTime;

      // Cron tasks should not return streaming/file/content responses
      if (
        isStreamingResponse(result) ||
        isFileResponse(result) ||
        isContentResponse(result)
      ) {
        UnifiedTaskRunnerRepository.markTaskAsCompleted(taskName);
        return success({
          status: CronTaskStatus.COMPLETED,
          message: `Task ${taskName} returned a non-standard response`,
        });
      }

      if (!result.success) {
        const errorMsgStr =
          "message" in result && typeof result.message === "string"
            ? result.message
            : "Task failed";
        const errorMsg =
          "message" in result && result.message
            ? result.message
            : t("errors.executeCronTask");
        UnifiedTaskRunnerRepository.markTaskAsFailed(taskName, errorMsgStr);

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
            t,
            UnifiedTaskRunnerRepository.logger!,
          );
          await CronTasksRepository.updateTask(
            dbTask.id,
            {
              lastExecutedAt: startedAt,
              lastExecutionStatus: CronTaskStatus.FAILED,
              lastExecutionDuration: durationMs,
              executionCount: dbTask.executionCount + 1,
              errorCount: dbTask.errorCount + 1,
            },
            null,
            UnifiedTaskRunnerRepository.systemLocale!,
            UnifiedTaskRunnerRepository.logger!,
          );

          // Run-once: disable task after first execution (success or failure)
          if (dbTask.runOnce) {
            await CronTasksRepository.updateTask(
              dbTask.id,
              { enabled: false },
              null,
              UnifiedTaskRunnerRepository.systemLocale!,
              UnifiedTaskRunnerRepository.logger!,
            );
            UnifiedTaskRunnerRepository.logger!.info(
              `[run-once] Task "${taskName}" disabled after single execution`,
            );
          }
        }

        return fail({
          message: t("errors.executeCronTask"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: errorMsg, taskName },
        });
      }

      // If the handler manages its own lifecycle (e.g. interactive Claude Code sessions),
      // leave the task as RUNNING — the handler will mark it done via complete-task.
      if (result.taskLifecycleManagedExternally) {
        UnifiedTaskRunnerRepository.logger!.info(
          `Task "${taskName}" lifecycle managed externally — skipping automatic completion`,
        );
        return success({
          status: CronTaskStatus.RUNNING,
          message: `Task "${taskName}" running with external lifecycle management`,
        });
      }

      UnifiedTaskRunnerRepository.markTaskAsCompleted(taskName);

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
          t,
          UnifiedTaskRunnerRepository.logger!,
        );
        // Compute rolling average execution time
        const prevAvg = dbTask.averageExecutionTime ?? 0;
        const newCount = dbTask.executionCount + 1;
        const newAverageExecutionTime = Math.round(
          (prevAvg * dbTask.executionCount + durationMs) / newCount,
        );

        await CronTasksRepository.updateTask(
          dbTask.id,
          {
            lastExecutedAt: startedAt,
            lastExecutionStatus: CronTaskStatus.COMPLETED,
            lastExecutionDuration: durationMs,
            executionCount: newCount,
            successCount: dbTask.successCount + 1,
            averageExecutionTime: newAverageExecutionTime,
          },
          null,
          UnifiedTaskRunnerRepository.systemLocale!,
          UnifiedTaskRunnerRepository.logger!,
        );

        // Run-once: disable task after first execution (success or failure)
        if (dbTask.runOnce) {
          await CronTasksRepository.updateTask(
            dbTask.id,
            { enabled: false },
            null,
            UnifiedTaskRunnerRepository.systemLocale!,
            UnifiedTaskRunnerRepository.logger!,
          );
          UnifiedTaskRunnerRepository.logger!.info(
            `[run-once] Task "${taskName}" disabled after single execution`,
          );
        }
      }

      return success({
        status: CronTaskStatus.COMPLETED,
        message: t("errors.executeCronTask"),
      });
    } catch (error) {
      const errorMsg = parseError(error).message;
      const durationMs = Date.now() - startTime;
      UnifiedTaskRunnerRepository.markTaskAsFailed(taskName, errorMsg);

      // Persist failure
      if (dbTask && executionDbId) {
        await CronTasksRepository.updateExecution(
          executionDbId,
          {
            status: CronTaskStatus.FAILED,
            completedAt: new Date(),
            durationMs,
            error: fail({
              message: t("errors.executeCronTask"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
              messageParams: { error: errorMsg },
            }),
          },
          t,
          UnifiedTaskRunnerRepository.logger!,
        );
        await CronTasksRepository.updateTask(
          dbTask.id,
          {
            lastExecutedAt: startedAt,
            lastExecutionStatus: CronTaskStatus.FAILED,
            lastExecutionDuration: durationMs,
            executionCount: dbTask.executionCount + 1,
            errorCount: dbTask.errorCount + 1,
          },
          null,
          UnifiedTaskRunnerRepository.systemLocale!,
          UnifiedTaskRunnerRepository.logger!,
        );

        // Run-once: disable task after first execution (success or failure)
        if (dbTask.runOnce) {
          await CronTasksRepository.updateTask(
            dbTask.id,
            { enabled: false },
            null,
            UnifiedTaskRunnerRepository.systemLocale!,
            UnifiedTaskRunnerRepository.logger!,
          );
          UnifiedTaskRunnerRepository.logger!.info(
            `[run-once] Task "${taskName}" disabled after single execution`,
          );
        }
      }

      return fail({
        message: t("errors.executeCronTask"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMsg, taskName },
      });
    }
  }

  static async startTaskRunner(
    task: TaskRunner<string>,
    signal: AbortSignal,
  ): Promise<ResponseType<void>> {
    const { t } = tasksScopedTranslation.scopedT(
      UnifiedTaskRunnerRepository.systemLocale!,
    );
    const taskName = task.name;

    if (UnifiedTaskRunnerRepository.isTaskRunning(taskName)) {
      return fail({
        message: t("errors.startTaskRunner"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: { taskName },
      });
    }

    UnifiedTaskRunnerRepository.markTaskAsRunning(taskName, "task-runner");

    try {
      await task.run({
        signal,
        logger: UnifiedTaskRunnerRepository.logger!,
        systemLocale: UnifiedTaskRunnerRepository.systemLocale!,
        userLocale: UnifiedTaskRunnerRepository.systemLocale!,
        cronUser: UnifiedTaskRunnerRepository.systemCronUser,
      });
      UnifiedTaskRunnerRepository.markTaskAsCompleted(taskName);
      return success();
    } catch (error) {
      const errorObj = parseError(error);
      UnifiedTaskRunnerRepository.markTaskAsFailed(taskName, errorObj.message);
      if (task.onError) {
        await task.onError({
          error: errorObj,
          logger: UnifiedTaskRunnerRepository.logger!,
          systemLocale: UnifiedTaskRunnerRepository.systemLocale!,
          userLocale: UnifiedTaskRunnerRepository.systemLocale!,
          cronUser: UnifiedTaskRunnerRepository.systemCronUser,
        });
      }
      return fail({
        message: t("errors.startTaskRunner"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorObj.message, taskName },
      });
    }
  }

  static stopTaskRunner(taskName: string): void {
    const controller =
      UnifiedTaskRunnerRepository.runningProcesses.get(taskName);
    if (controller) {
      controller.abort();
      UnifiedTaskRunnerRepository.runningProcesses.delete(taskName);
      UnifiedTaskRunnerRepository.runningTasks.delete(taskName);
    }
  }

  static getTaskStatus(taskName: string): TaskStatus {
    return (
      UnifiedTaskRunnerRepository.runningTasks.get(taskName) || {
        name: taskName,
        type: "cron",
        status: "stopped",
        runCount: 0,
        errorCount: 0,
        successCount: 0,
      }
    );
  }

  static isTaskRunning(taskName: string): boolean {
    const status = UnifiedTaskRunnerRepository.runningTasks.get(taskName);
    return status?.status === "running";
  }

  static getRunningTasks(): string[] {
    return [...UnifiedTaskRunnerRepository.runningTasks.keys()].filter(
      (taskName) => UnifiedTaskRunnerRepository.isTaskRunning(taskName),
    );
  }

  static start(
    tasks: Task[],
    signal: AbortSignal,
    systemLocale: CountryLanguage,
    logger: EndpointLogger,
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
      // not scheduled here — pulse fires every minute and uses isCronTaskDue()
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
  ): Promise<never> {
    const { taskRegistry } =
      await import("@/app/api/[locale]/system/generated/tasks-index");

    // Upsert task definitions into DB so they appear in the UI
    const { prod: seedTasks } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/seeds");
    await seedTasks(logger);

    const abortController = new AbortController();
    const { signal } = abortController;

    const startResult = UnifiedTaskRunnerRepository.start(
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

  static async stop(
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
