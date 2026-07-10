/**
 * Task Execute Repository
 * Executes a single cron task by ID with permission enforcement
 */

import "server-only";

import { and, eq, isNull, ne, or, sql } from "drizzle-orm";
import { getFullPath } from "next-vibe/core/core-utils/path";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isFileResponse,
  isStreamingResponse,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { splitTaskArgs } from "next-vibe/tasks/cron/arg-splitter";
import { cronTasks, dbUserIdToOwner } from "next-vibe/tasks/cron/db";
import { createTaskEmitters } from "next-vibe/tasks/cron/emitter";
import { CronTasksRepository } from "next-vibe/tasks/cron/repository";
import { resolveTaskOwnerUser } from "next-vibe/tasks/cron/resolve-task-user";
import type { TaskExecuteT } from "next-vibe/tasks/execute/i18n";
import { scopedTranslation as tasksScopedTranslation } from "next-vibe/tasks/i18n";

import { makeHeadlessContext } from "@/app/api/[locale]/agent/chat/config";

import { CronTaskStatus, type CronTaskStatusValue } from "../enum";
import type {
  TaskExecuteRequestOutput,
  TaskExecuteResponseOutput,
} from "./definition";

export class TaskExecuteRepository {
  /**
   * Execute a single cron task by its DB id.
   * Permission rules:
   *   - ADMIN: can run any task (including system tasks where userId is null)
   *   - CUSTOMER: can only run tasks where task.userId === current user's id
   */
  static async executeTask(
    data: TaskExecuteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TaskExecuteT,
    abortSignal: AbortSignal,
  ): Promise<ResponseType<TaskExecuteResponseOutput>> {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    const currentUserId = !user.isPublic ? user.id : null;

    // 1. Fetch the task
    const rows = await db
      .select()
      .from(cronTasks)
      .where(eq(cronTasks.id, data.taskId))
      .limit(1);

    const task = rows[0];
    if (!task) {
      return fail({
        message: t("errors.notFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { taskId: data.taskId },
      });
    }

    // 2. Permission check
    if (!isAdmin) {
      // Customers can only run their own tasks
      const taskOwner = dbUserIdToOwner(task.userId);
      if (
        taskOwner.type === "system" ||
        (taskOwner.type === "user" && taskOwner.userId !== currentUserId)
      ) {
        return fail({
          message: t("errors.forbidden"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
    }

    // 3. Overlap prevention - skip if still running
    if (task.lastExecutionStatus === CronTaskStatus.RUNNING) {
      return fail({
        message: t("errors.alreadyRunning"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    // 4. Atomically claim the task
    const claimed = await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(cronTasks)
        .where(
          and(
            eq(cronTasks.id, task.id),
            or(
              isNull(cronTasks.lastExecutionStatus),
              ne(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING),
            ),
          ),
        )
        .for("update", { skipLocked: true })
        .limit(1);

      if (!row) {
        return null;
      }

      await tx
        .update(cronTasks)
        .set({
          lastExecutionStatus: CronTaskStatus.RUNNING,
          ...(task.runOnce ? { enabled: false } : {}),
          updatedAt: new Date(),
        })
        .where(eq(cronTasks.id, task.id));

      return row;
    });

    if (!claimed) {
      return fail({
        message: t("errors.alreadyRunning"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    // Emit task-updated (RUNNING) to WS subscribers
    {
      const { emitTaskList, emitTaskQueue } = createTaskEmitters(logger, user);
      const runningPayload = {
        tasks: [
          {
            id: task.id,
            lastExecutionStatus: CronTaskStatus.RUNNING,
            enabled: task.runOnce ? false : task.enabled,
          },
        ],
      };
      emitTaskList("task-updated", { responseData: runningPayload });
      emitTaskQueue("task-updated", { responseData: runningPayload });
    }

    // 5. Resolve execution user context - always the task owner, never the caller
    const taskUserContext = await resolveTaskOwnerUser(
      dbUserIdToOwner(task.userId),
      locale,
      logger,
    );

    if (!taskUserContext) {
      await db
        .update(cronTasks)
        .set({
          lastExecutionStatus: CronTaskStatus.FAILED,
          updatedAt: new Date(),
        })
        .where(eq(cronTasks.id, task.id));

      return fail({
        message: t("errors.executeTask"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const { user: execUser, locale: execLocale } = taskUserContext;
    const { t: tTask } = tasksScopedTranslation.scopedT(execLocale);

    // 6. Resolve routeId → handler
    const path = getFullPath(task.routeId);
    const handler = path
      ? await import("@/generated/routes/handlers").then((m) =>
          m.getRouteHandler(path),
        )
      : null;

    if (!path || !handler) {
      await db
        .update(cronTasks)
        .set({
          lastExecutionStatus: CronTaskStatus.FAILED,
          updatedAt: new Date(),
        })
        .where(eq(cronTasks.id, task.id));

      return fail({
        message: t("errors.executeTask"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const startedAt = new Date();
    const timeoutMs = task.timeout ?? 300000;
    const maxRetries = task.retries ?? 0;
    const retryDelayMs = task.retryDelay ?? 30000;

    const taskInput = task.taskInput ?? {};
    const { urlPathParams, data: handlerData } = await splitTaskArgs(
      path,
      taskInput,
    );

    let finalStatus: typeof CronTaskStatusValue = CronTaskStatus.FAILED;
    let finalMessage: string | null = null;
    let finalDurationMs = 0;
    let taskSucceeded = false;
    let firstExecutionId: string | null = null;
    let didLogHistory = false;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        logger.debug(
          `TaskExecute: retrying "${task.displayName}" (attempt ${attempt + 1}/${maxRetries + 1}) after ${retryDelayMs}ms`,
        );
        await new Promise<void>((resolve) => {
          setTimeout(resolve, retryDelayMs);
        });
      }

      const attemptStart = Date.now();
      const taskAbortController = new AbortController();
      abortSignal.addEventListener("abort", () => taskAbortController.abort(), {
        once: true,
      });

      let typedResult: ResponseType<Record<string, string | number | boolean>>;
      try {
        const result = (await Promise.race([
          handler({
            data: handlerData,
            urlPathParams,
            user: execUser,
            locale: execLocale,
            logger,
            platform: Platform.CRON,
            cronTaskId: task.id,
            // no user context — UTC (dates not user-facing here)
            streamContext: makeHeadlessContext(
              taskAbortController.signal,
              undefined,
              "UTC",
            ),
          }),
          new Promise<never>((...[, reject]) => {
            setTimeout(() => reject(new Error("TASK_TIMEOUT")), timeoutMs);
          }),
        ])) as Awaited<ReturnType<typeof handler>>;

        typedResult =
          isStreamingResponse(result) || isFileResponse(result)
            ? (fail({
                message: tTask("errors.repositoryInternalError"),
                errorType: ErrorResponseTypes.INTERNAL_ERROR,
              }) as ResponseType<Record<string, string | number | boolean>>)
            : (result as ResponseType<
                Record<string, string | number | boolean>
              >);
      } catch (taskErr) {
        const isTimeout =
          taskErr instanceof Error && taskErr.message === "TASK_TIMEOUT";
        typedResult = fail({
          message: tTask("errors.repositoryInternalError"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        }) as ResponseType<Record<string, string | number | boolean>>;
        finalStatus = isTimeout
          ? CronTaskStatus.TIMEOUT
          : CronTaskStatus.FAILED;
      }

      const attemptDuration = Date.now() - attemptStart;
      const attemptStatus: typeof CronTaskStatusValue = typedResult.success
        ? CronTaskStatus.COMPLETED
        : finalStatus === CronTaskStatus.TIMEOUT
          ? CronTaskStatus.TIMEOUT
          : CronTaskStatus.FAILED;

      const shouldLogHistory =
        !typedResult.success ||
        !task.historyInterval ||
        !task.lastHistoryLoggedAt ||
        Date.now() - task.lastHistoryLoggedAt.getTime() >= task.historyInterval;

      if (shouldLogHistory) {
        const execResponse = await CronTasksRepository.createExecution(
          {
            taskId: task.id,
            taskName: task.displayName,
            executionId: crypto.randomUUID(),
            status: attemptStatus,
            priority: task.priority,
            startedAt: new Date(attemptStart),
            completedAt: new Date(),
            durationMs: attemptDuration,
            config: taskInput,
            result: typedResult.success ? (typedResult.data ?? null) : null,
            retryAttempt: attempt,
            parentExecutionId: firstExecutionId,
            triggeredBy: "manual",
          },
          tTask,
          logger,
        );

        if (attempt === 0 && execResponse.success) {
          firstExecutionId = execResponse.data.id;
        }
        didLogHistory = true;
      }

      finalDurationMs += attemptDuration;

      if (typedResult.success) {
        taskSucceeded = true;
        finalStatus = CronTaskStatus.COMPLETED;
        finalMessage = null;
        break;
      }

      finalStatus = attemptStatus;
      finalMessage = typedResult.message ?? null;
    }

    // 7. Update task stats atomically
    const newConsecutiveFailures = taskSucceeded
      ? 0
      : (task.consecutiveFailures ?? 0) + 1;

    await db
      .update(cronTasks)
      .set({
        lastExecutedAt: startedAt,
        lastExecutionStatus: finalStatus,
        lastExecutionDuration: finalDurationMs,
        executionCount: sql`${cronTasks.executionCount} + 1`,
        consecutiveFailures: newConsecutiveFailures,
        ...(taskSucceeded
          ? { successCount: sql`${cronTasks.successCount} + 1` }
          : { errorCount: sql`${cronTasks.errorCount} + 1` }),
        ...(didLogHistory ? { lastHistoryLoggedAt: new Date() } : {}),
        updatedAt: new Date(),
      })
      .where(eq(cronTasks.id, task.id));

    // Emit task-updated (final status) to WS subscribers
    {
      const { emitTaskList, emitTaskQueue } = createTaskEmitters(logger, user);
      const completedPayload = {
        tasks: [
          {
            id: task.id,
            lastExecutionStatus: finalStatus,
            lastExecutedAt: startedAt.toISOString(),
            lastExecutionDuration: finalDurationMs,
            consecutiveFailures: newConsecutiveFailures,
          },
        ],
      };
      emitTaskList("task-updated", { responseData: completedPayload });
      emitTaskQueue("task-updated", { responseData: completedPayload });
    }

    if (!taskSucceeded) {
      logger.error("Task execution failed", {
        taskId: task.id,
        message: finalMessage,
      });
      return fail({
        message: t("errors.executeTask"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return success<TaskExecuteResponseOutput>({
      success: true,
      taskId: task.id,
      taskName: task.displayName,
      executedAt: startedAt,
      duration: finalDurationMs,
      status: finalStatus,
    });
  }
}
