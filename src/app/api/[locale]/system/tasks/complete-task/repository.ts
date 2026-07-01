/**
 * Complete Task Repository
 * Called by tools (e.g. claude-code interactive) when their async work is done.
 * Accepts the tool's exact response payload and uses it as the wakeUpResult so the
 * deferred TOOL message renders with the correct response fields in the UI.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { CallbackModeValue } from "next-vibe/execute-tool/constants";
import { CallbackMode } from "next-vibe/execute-tool/constants";
import { handleTaskCompletion } from "next-vibe/execute-tool/handlers/task-completion-handler";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  CompleteTaskRequestOutput,
  CompleteTaskResponseOutput,
} from "next-vibe/tasks/complete-task/definition";
import type { NewCronTask } from "next-vibe/tasks/cron/db";
import {
  cronTaskExecutions,
  cronTasks,
  dbUserIdToOwner,
} from "next-vibe/tasks/cron/db";
import { resolveTaskOwnerUser } from "next-vibe/tasks/cron/resolve-task-user";
import type { TasksT } from "next-vibe/tasks/i18n";

import { env } from "@/config/env";

import { CronTaskStatus } from "../enum";

export class CompleteTaskRepository {
  static async completeTask<TRequest, TResponse>(
    data: CompleteTaskRequestOutput<TResponse>,
    logger: EndpointLogger,
    t: TasksT,
    user: JwtPayloadType,
    locale: CountryLanguage,
    abortSignal: AbortSignal,
  ): Promise<ResponseType<CompleteTaskResponseOutput>> {
    const { taskId, response } = data;
    const status = CronTaskStatus.COMPLETED;

    // Find the task
    const [task] = await db
      .select()
      .from(cronTasks)
      .where(eq(cronTasks.id, taskId))
      .limit(1);

    if (!task) {
      return fail({
        message: t("completeTask.post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Idempotency: if already completed (e.g. triggerLocalPulse in tests already handled it),
    // return success without re-firing handleTaskCompletion. Prevents duplicate revivals.
    if (task.lastExecutionStatus === CronTaskStatus.COMPLETED) {
      logger.info(
        "[complete-task] Task already completed - skipping duplicate",
        { taskId },
      );
      return success({
        completed: true,
        updatedAt: (task.lastExecutedAt ?? new Date()).toISOString(),
      });
    }

    // Ownership check: only the user who owns the task may complete it.
    // System tasks (owner.type === "system") have no local owner —
    // any authenticated user on this instance may complete them (e.g. remotely-delegated tasks).
    const taskOwner = dbUserIdToOwner(task.userId);
    if (taskOwner.type === "user" && taskOwner.userId !== user.id) {
      return fail({
        message: t("completeTask.post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const now = new Date();
    const executionId = `complete-${taskId}-${now.getTime()}`;

    // Derive a summary string from the response for remote push and logging
    const summary =
      typeof response["output"] === "string"
        ? (response["output"] as string).slice(0, 200)
        : JSON.stringify(response).slice(0, 200);

    // Update task in local DB
    try {
      const updates: Partial<NewCronTask<TRequest>> & { updatedAt: Date } = {
        lastExecutedAt: now,
        lastExecutionStatus: status,
        lastExecutionDuration: null,
        executionCount: task.executionCount + 1,
        successCount: task.successCount + 1,
        updatedAt: now,
      };

      if (task.runOnce) {
        updates.enabled = false;
      }

      await db.update(cronTasks).set(updates).where(eq(cronTasks.id, taskId));

      await db.insert(cronTaskExecutions).values({
        taskId,
        taskName: task.routeId,
        executionId,
        status,
        priority: task.priority,
        startedAt: now,
        completedAt: now,
        durationMs: Math.round(now.getTime() - task.createdAt.getTime()),
        config: task.taskInput ?? {},
        result: response,
        isManual: true,
        triggeredBy: "manual",
        environment: String(env.NODE_ENV ?? "development"),
      });

      logger.info("[complete-task] Task completed", {
        taskId,
        routeId: task.routeId,
        summary,
      });
    } catch (error) {
      logger.error("[complete-task] Failed to update task", parseError(error));
      return fail({
        message: t("completeTask.post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // Backfill tool message + emit WS + schedule revival
    const toolMessageId = task.wakeUpToolMessageId ?? null;
    const threadId = task.wakeUpThreadId ?? null;
    const rawCallbackMode = task.wakeUpCallbackMode;
    const callbackMode: CallbackModeValue | null =
      rawCallbackMode === CallbackMode.WAIT
        ? CallbackMode.WAIT
        : rawCallbackMode === CallbackMode.DETACH
          ? CallbackMode.DETACH
          : rawCallbackMode === CallbackMode.END_LOOP
            ? CallbackMode.END_LOOP
            : rawCallbackMode === CallbackMode.WAKE_UP
              ? CallbackMode.WAKE_UP
              : rawCallbackMode === CallbackMode.APPROVE
                ? CallbackMode.APPROVE
                : null;

    const owner = dbUserIdToOwner(task.userId);

    if (toolMessageId) {
      // Always resolve the actual task owner - never use the API caller's identity.
      const ownerContext = await resolveTaskOwnerUser(owner, locale, logger);
      if (ownerContext) {
        await handleTaskCompletion({
          toolMessageId,
          threadId,
          callbackMode,
          status,
          output: response,
          taskId,
          modelId: task.wakeUpModelId ?? null,
          skillId: task.wakeUpSkillId ?? null,
          favoriteId: task.wakeUpFavoriteId ?? null,
          leafMessageId: task.wakeUpLeafMessageId ?? null,
          subAgentDepth: task.wakeUpSubAgentDepth ?? 0,
          ownerUser: ownerContext.user,
          logger,
          directResumeLocale: ownerContext.locale,
          abortSignal,
        });
      }

      try {
        await db.delete(cronTasks).where(eq(cronTasks.id, taskId));
        logger.info("[complete-task] Deleted tracking task after revival", {
          taskId,
        });
      } catch (delErr) {
        logger.warn("[complete-task] Failed to delete tracking task", {
          taskId,
          error: delErr instanceof Error ? delErr.message : String(delErr),
        });
      }
    }

    return success({
      completed: true,
      updatedAt: now.toISOString(),
    });
  }
}
