/**
 * Complete Task Repository
 * Marks a cron task as completed/failed/cancelled and pushes result to remote.
 * Supports custom output payloads stored in execution history.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";

import type { NewCronTask } from "../cron/db";
import { cronTaskExecutions, cronTasks } from "../cron/db";
import { CronTaskStatus } from "../enum";
import type { scopedTranslation } from "../i18n";
import { pushStatusToRemote } from "../task-sync/repository";
import type {
  CompleteTaskRequestOutput,
  CompleteTaskResponseOutput,
} from "./definition";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export async function completeTask(
  data: CompleteTaskRequestOutput,
  logger: EndpointLogger,
  t: ModuleT,
): Promise<ResponseType<CompleteTaskResponseOutput>> {
  const { taskId, status, summary, output } = data;

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

  const now = new Date();

  // Build execution ID for both local record and remote push
  const executionId = `complete-${taskId}-${now.getTime()}`;

  // Update task in local DB
  try {
    const updates: Partial<NewCronTask> & { updatedAt: Date } = {
      lastExecutedAt: now,
      lastExecutionStatus: status,
      lastExecutionDuration: null,
      executionCount: task.executionCount + 1,
      updatedAt: now,
    };

    if (status === CronTaskStatus.COMPLETED) {
      updates.successCount = task.successCount + 1;
      updates.lastExecutionError = null;
    } else {
      updates.errorCount = task.errorCount + 1;
      updates.lastExecutionError = summary;
    }

    // Run-once tasks: disable after completion
    if (task.runOnce) {
      updates.enabled = false;
      logger.info(
        `[complete-task] Run-once task "${task.routeId}" disabled after completion`,
      );
    }

    await db.update(cronTasks).set(updates).where(eq(cronTasks.id, taskId));

    // Create execution history record with output payload
    await db.insert(cronTaskExecutions).values({
      taskId,
      taskName: task.routeId,
      executionId,
      status: status as (typeof CronTaskStatus)[keyof typeof CronTaskStatus],
      priority: task.priority,
      startedAt: now,
      completedAt: now,
      durationMs: null,
      config: task.taskInput ?? {},
      result: output,
      isManual: true,
      triggeredBy: "manual",
      environment: String(env.NODE_ENV ?? "development"),
    });

    logger.info("Task marked as complete", {
      taskId,
      routeId: task.routeId,
      status,
      hasOutput: !!output,
      summary: summary.slice(0, 200),
    });
  } catch (error) {
    logger.error("Failed to update task", parseError(error));
    return fail({
      message: t("completeTask.post.errors.internal.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  // Push to remote (fire-and-forget, but report result)
  let pushedToRemote = false;
  if (task.targetInstance) {
    const pushResult = await pushStatusToRemote({
      taskRouteId: task.routeId,
      status,
      summary,
      durationMs: null,
      executionId,
      output: output,
      startedAt: now.toISOString(),
      serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      executedByInstance: null,
      logger,
    });
    pushedToRemote = pushResult.success;
  }

  return success({
    completed: true,
    pushedToRemote,
    updatedAt: now.toISOString(),
  });
}
