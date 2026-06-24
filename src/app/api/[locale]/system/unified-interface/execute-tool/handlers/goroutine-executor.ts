/**
 * Shared goroutine execution core for local async execute-tool handlers.
 *
 * Both local-detach and local-wakeup fire a goroutine that:
 *   1. calls RouteExecutionExecutor.executeGenericHandler
 *   2. inserts a cronTaskExecutions row
 *   3. re-reads the task row (picks up await-task upgrade)
 *   4. calls handleTaskCompletion
 *   5. flips cronTask to terminal
 *
 * This file owns that shared pattern. local-detach and local-wakeup differ only
 * in: (a) how they resolve the effective tool-message ID, (b) the atomic
 * WAKE_UP→WAIT claim race used by wakeup, (c) the selfEscalated / fresh
 * AbortController logic for wakeup, and (d) the needsReReconcile re-clear for
 * detach.
 */

import "server-only";

import { and, eq, sql as drizzleSql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { handleTaskCompletion } from "@/app/api/[locale]/system/unified-interface/execute-tool/handlers/task-completion-handler";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  cronTaskExecutions,
  cronTasks,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import type { CronTaskStatusDB } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { CallbackMode, type CallbackModeValue } from "../constants";
import type { RouteExecuteContext } from "./types";

export interface GoroutineResult {
  finalStatus: (typeof CronTaskStatusDB)[number];
  finalResult: Record<string, WidgetData> | null;
  completedAt: Date;
}

/**
 * Execute the tool inside a goroutine-local streamContext.
 * Returns the raw execution result for the caller to handle revival.
 */
export async function executeInGoroutine(params: {
  ctx: RouteExecuteContext;
  input: Record<string, WidgetData> | undefined;
  taskId: string;
  startedAt: Date;
  goroutineStreamContext: RouteExecuteContext["streamContext"];
  triggeredBy: string;
}): Promise<GoroutineResult> {
  const { ctx, input, taskId, startedAt, goroutineStreamContext, triggeredBy } =
    params;
  const { toolName, logger } = ctx;

  const result = await RouteExecutionExecutor.executeGenericHandler<
    Record<string, WidgetData>
  >({
    toolName,
    data: input ?? {},
    user: ctx.user,
    locale: ctx.locale,
    logger,
    platform: Platform.MCP,
    streamContext: goroutineStreamContext,
  });

  const completedAt = new Date();
  const finalStatus: (typeof CronTaskStatusDB)[number] = result.success
    ? CronTaskStatus.COMPLETED
    : CronTaskStatus.FAILED;
  const finalResult =
    result.success && result.data !== undefined ? result.data : null;

  try {
    await db.insert(cronTaskExecutions).values({
      taskId,
      taskName: toolName,
      executionId: `${triggeredBy}-${taskId}`,
      status: finalStatus,
      priority: CronTaskPriority.HIGH,
      startedAt,
      completedAt,
      durationMs: completedAt.getTime() - startedAt.getTime(),
      result: finalResult ?? undefined,
      triggeredBy,
      config: {},
    });
  } catch (execInsertErr) {
    // Parent cron_tasks row may have been deleted (e.g. test teardown cancelThreadTasks).
    logger.warn(
      "[execute-tool goroutine] Failed to insert execution history (parent deleted?)",
      {
        taskId,
        error:
          execInsertErr instanceof Error
            ? execInsertErr.message
            : String(execInsertErr),
      },
    );
  }

  return { finalStatus, finalResult, completedAt };
}

/**
 * Re-read task row for upgraded wakeUp context (set by await-task).
 * Returns the latest columns.
 */
export async function readLatestTaskContext(taskId: string): Promise<{
  wakeUpCallbackMode: string | null;
  wakeUpThreadId: string | null;
  wakeUpToolMessageId: string | null;
  wakeUpModelId: string | null;
  wakeUpSkillId: string | null;
  wakeUpFavoriteId: string | null;
  wakeUpLeafMessageId: string | null;
  wakeUpSubAgentDepth: number | null;
}> {
  const [row] = await db
    .select({
      wakeUpCallbackMode: cronTasks.wakeUpCallbackMode,
      wakeUpThreadId: cronTasks.wakeUpThreadId,
      wakeUpToolMessageId: cronTasks.wakeUpToolMessageId,
      wakeUpModelId: cronTasks.wakeUpModelId,
      wakeUpSkillId: cronTasks.wakeUpSkillId,
      wakeUpFavoriteId: cronTasks.wakeUpFavoriteId,
      wakeUpLeafMessageId: cronTasks.wakeUpLeafMessageId,
      wakeUpSubAgentDepth: cronTasks.wakeUpSubAgentDepth,
    })
    .from(cronTasks)
    .where(eq(cronTasks.id, taskId))
    .limit(1);

  return {
    wakeUpCallbackMode: row?.wakeUpCallbackMode ?? null,
    wakeUpThreadId: row?.wakeUpThreadId ?? null,
    wakeUpToolMessageId: row?.wakeUpToolMessageId ?? null,
    wakeUpModelId: row?.wakeUpModelId ?? null,
    wakeUpSkillId: row?.wakeUpSkillId ?? null,
    wakeUpFavoriteId: row?.wakeUpFavoriteId ?? null,
    wakeUpLeafMessageId: row?.wakeUpLeafMessageId ?? null,
    wakeUpSubAgentDepth: row?.wakeUpSubAgentDepth ?? null,
  };
}

/**
 * Attempt the atomic WAKE_UP→COMPLETED claim for wakeup goroutines.
 * Returns true if we won (rowCount > 0), false if await-task intercepted.
 */
export async function claimWakeUpCompletion(taskId: string): Promise<boolean> {
  const updated = await db
    .update(cronTasks)
    .set({
      lastExecutionStatus: CronTaskStatus.COMPLETED,
      lastExecutedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      drizzleSql`${cronTasks.id} = ${taskId} AND ${cronTasks.wakeUpCallbackMode} = ${CallbackMode.WAKE_UP}`,
    );

  return updated.rowCount !== null && updated.rowCount > 0;
}

/**
 * Force-update task to COMPLETED (used when await-task won the claim race
 * and we need to mark the row terminal before firing the waiter revival).
 */
export async function forceCompleteTask(taskId: string): Promise<void> {
  await db
    .update(cronTasks)
    .set({
      lastExecutionStatus: CronTaskStatus.COMPLETED,
      lastExecutedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(cronTasks.id, taskId));
}

/**
 * DB fallback: resolve toolMessageId + leafMessageId from the chatMessages table
 * when the in-memory pendingToolMessages lookup missed (race with stream-part-handler).
 */
export async function resolveToolMessageFromDb(params: {
  callerToolCallId: string;
  threadId: string;
}): Promise<{ id: string; parentId: string | null } | null> {
  const { callerToolCallId, threadId } = params;
  const { chatMessages } = await import("@/app/api/[locale]/agent/chat/db");
  const [row] = await db
    .select({ id: chatMessages.id, parentId: chatMessages.parentId })
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.threadId, threadId),
        drizzleSql`(${chatMessages.metadata}->'toolCall'->>'toolCallId') = ${callerToolCallId}`,
      ),
    )
    .orderBy(drizzleSql`${chatMessages.createdAt} DESC`)
    .limit(1);
  return row ?? null;
}

/**
 * Insert a cronTasks row for a local DETACH or WAKE_UP task.
 * Shared by local-detach.ts and local-wakeup.ts — they differ only in the
 * fields that depend on callbackMode (displayName, wakeUpModelId, tags).
 */
export async function createLocalTask(params: {
  taskId: string;
  toolName: string;
  callbackMode: CallbackModeValue; // DETACH or WAKE_UP
  input: Record<string, WidgetData> | undefined;
  effectiveThreadId: string | undefined;
  effectiveToolMessageId: string | undefined;
  effectiveLeafMessageId: string | null;
  resolvedModelId: string | null | undefined; // only stored for WAKE_UP
  skillId: string | null | undefined;
  favoriteId: string | null | undefined;
  subAgentDepth: number;
  userId: string | undefined;
}): Promise<void> {
  const {
    taskId,
    toolName,
    callbackMode,
    input,
    effectiveThreadId,
    effectiveToolMessageId,
    effectiveLeafMessageId,
    resolvedModelId,
    skillId,
    favoriteId,
    subAgentDepth,
    userId,
  } = params;

  const isWakeUp = callbackMode === CallbackMode.WAKE_UP;

  await db.insert(cronTasks).values({
    id: taskId,
    shortId: taskId,
    routeId: toolName,
    displayName: isWakeUp ? `WakeUp: ${toolName}` : `Background: ${toolName}`,
    category: TaskCategory.SYSTEM,
    schedule: "* * * * *",
    priority: CronTaskPriority.HIGH,
    enabled: false,
    runOnce: true,
    lastExecutionStatus: CronTaskStatus.RUNNING,
    taskInput: input ?? {},
    wakeUpCallbackMode: callbackMode,
    wakeUpThreadId: effectiveThreadId ?? null,
    wakeUpToolMessageId: effectiveToolMessageId ?? null,
    // Only store modelId for WAKE_UP — DETACH never wakes up the AI with a specific model.
    wakeUpModelId: isWakeUp ? (resolvedModelId ?? undefined) : undefined,
    wakeUpSkillId: skillId ?? null,
    wakeUpFavoriteId: favoriteId ?? null,
    wakeUpLeafMessageId: effectiveLeafMessageId,
    wakeUpSubAgentDepth: subAgentDepth,
    outputMode: TaskOutputMode.STORE_ONLY,
    notificationTargets: [],
    tags: [isWakeUp ? "wakeup" : "detach", "local"],
    userId,
  });
}

/**
 * Fire handleTaskCompletion. Both local-detach and local-wakeup call this.
 * ownerUser must be non-public (callers guard with !user.isPublic).
 */
export async function fireTaskCompletion(params: {
  toolMessageId: string;
  threadId: string;
  callbackMode: CallbackModeValue | null;
  finalStatus: (typeof CronTaskStatusDB)[number];
  finalResult: Record<string, WidgetData> | null;
  taskId: string;
  modelId: string | null;
  skillId: string | null;
  favoriteId: string | null;
  leafMessageId: string | null;
  subAgentDepth: number;
  ctx: RouteExecuteContext;
  abortSignal: AbortSignal;
}): Promise<void> {
  const {
    toolMessageId,
    threadId,
    callbackMode,
    finalStatus,
    finalResult,
    taskId,
    modelId,
    skillId,
    favoriteId,
    leafMessageId,
    subAgentDepth,
    ctx,
    abortSignal,
  } = params;

  if (ctx.user.isPublic) {
    return;
  }
  const ownerUser: JwtPrivatePayloadType = ctx.user;

  await handleTaskCompletion({
    toolMessageId,
    threadId,
    callbackMode,
    status: finalStatus,
    output: finalResult,
    taskId,
    modelId,
    skillId,
    favoriteId,
    leafMessageId,
    subAgentDepth,
    ownerUser,
    logger: ctx.logger,
    directResumeLocale: ctx.locale,
    abortSignal,
  });
}
