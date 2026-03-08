/**
 * Wait For Task Repository
 * Registers the calling AI stream as a waiter on a pending background task.
 *
 * If the task is already completed: returns the result immediately (stream continues).
 * If pending: writes callbackMode=wakeUp + threadId + toolMessageId onto the task row,
 * sets streamContext.waitingForRemoteResult=true (stream pauses), and the AI is
 * revived via resume-stream when the task eventually calls handleTaskCompletion.
 */

import "server-only";

import { desc, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  CallbackMode,
  type TaskRoutingContext,
} from "../../ai/execute-tool/constants";
import { cronTaskExecutions, cronTasks } from "../cron/db";
import { CronTaskStatus } from "../enum";
import type { scopedTranslation } from "../i18n";
import type {
  WaitForTaskRequestOutput,
  WaitForTaskResponseOutput,
} from "./definition";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export async function waitForTask(
  data: WaitForTaskRequestOutput,
  user: JwtPayloadType,
  logger: EndpointLogger,
  t: ModuleT,
  streamContext?: ToolExecutionContext,
): Promise<ResponseType<WaitForTaskResponseOutput>> {
  const { taskId } = data;

  try {
    // Wait for stream-part-handler to set currentToolMessageId.
    // execute() starts concurrently with stream-part-handler's tool-call processing —
    // poll up to 200ms to let stream-part-handler catch up and set the field.
    if (streamContext && !streamContext.currentToolMessageId) {
      for (let i = 0; i < 40; i++) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 5);
        });
        if (streamContext.currentToolMessageId) {
          break;
        }
      }
    }

    const [task] = await db
      .select()
      .from(cronTasks)
      .where(eq(cronTasks.id, taskId))
      .limit(1);

    if (!task) {
      return fail({
        message: t("waitForTask.post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // If already completed, return result immediately — stream continues as normal.
    if (
      task.lastExecutionStatus === CronTaskStatus.COMPLETED ||
      task.lastExecutionStatus === CronTaskStatus.FAILED ||
      task.lastExecutionStatus === CronTaskStatus.CANCELLED
    ) {
      // Fetch the most recent execution record for the result payload
      const [execution] = await db
        .select({ result: cronTaskExecutions.result })
        .from(cronTaskExecutions)
        .where(eq(cronTaskExecutions.taskId, taskId))
        .orderBy(desc(cronTaskExecutions.completedAt))
        .limit(1);

      logger.info("[WaitForTask] Task already completed — returning result", {
        taskId,
        status: task.lastExecutionStatus,
      });

      // Cancel any pending resume-stream task and delete the original wakeUp task row —
      // the AI is handling the result inline so all context is now in the thread.
      try {
        await db
          .delete(cronTasks)
          .where(
            sql`${cronTasks.tags} @> ${JSON.stringify([taskId])}::jsonb AND ${cronTasks.routeId} = 'resume-stream'`,
          );
        await db.delete(cronTasks).where(eq(cronTasks.id, taskId));
        logger.info(
          "[WaitForTask] Cleaned up wakeUp task and pending resume-stream",
          { taskId },
        );
      } catch (cleanupErr) {
        logger.warn("[WaitForTask] Cleanup failed (non-fatal)", {
          taskId,
          error:
            cleanupErr instanceof Error
              ? cleanupErr.message
              : String(cleanupErr),
        });
      }

      return success({
        status: task.lastExecutionStatus,
        result: execution?.result ?? undefined,
        waiting: false,
      });
    }

    // Task is pending/running — register the calling thread as a waiter.
    // When the task completes, handleTaskCompletion will backfill the tool
    // message and schedule resume-stream to revive the AI.
    const effectiveThreadId = streamContext?.threadId;
    const effectiveToolMessageId =
      streamContext?.currentToolMessageId ?? streamContext?.aiMessageId;

    if (effectiveThreadId && effectiveToolMessageId) {
      const streamModelId = streamContext?.modelId;
      const streamCharacterId = streamContext?.characterId;
      const streamFavoriteId = streamContext?.favoriteId;

      await db
        .update(cronTasks)
        .set({
          taskInput: {
            ...(task.taskInput ?? {}),
            ...({
              callbackMode: CallbackMode.WAKE_UP,
              threadId: effectiveThreadId,
              toolMessageId: effectiveToolMessageId,
            } satisfies TaskRoutingContext),
            ...(streamModelId ? { modelId: streamModelId } : {}),
            ...(streamCharacterId ? { characterId: streamCharacterId } : {}),
            ...(streamFavoriteId ? { favoriteId: streamFavoriteId } : {}),
          },
          // Use the calling user's ID so resume-stream runs as the stream owner
          userId: !user.isPublic ? user.id : (task.userId ?? null),
          updatedAt: new Date(),
        })
        .where(eq(cronTasks.id, taskId));

      logger.info("[WaitForTask] Registered thread as waiter on pending task", {
        taskId,
        threadId: effectiveThreadId,
        toolMessageId: effectiveToolMessageId,
      });

      // Pause the stream — resume-stream will revive when the task completes.
      if (streamContext) {
        streamContext.waitingForRemoteResult = true;
      }
    } else {
      logger.warn(
        "[WaitForTask] No streamContext — cannot register waiter, returning pending status",
        { taskId },
      );
    }

    return success({
      status: CronTaskStatus.PENDING,
      waiting: true,
    });
  } catch (error) {
    const msg = parseError(error).message;
    logger.error("[WaitForTask] Failed", { taskId, error: msg });
    return fail({
      message: t("waitForTask.post.errors.internal.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
