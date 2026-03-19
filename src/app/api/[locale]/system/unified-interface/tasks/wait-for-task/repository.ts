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

import { CallbackMode } from "../../ai/execute-tool/constants";
import { cronTaskExecutions, cronTasks } from "../cron/db";
import { CronTaskStatus } from "../enum";
import type { TasksT } from "../i18n";
import type {
  WaitForTaskRequestOutput,
  WaitForTaskResponseOutput,
} from "./definition";

export class WaitForTaskRepository {
  static async waitForTask(
    data: WaitForTaskRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: TasksT,
    streamContext?: ToolExecutionContext,
  ): Promise<ResponseType<WaitForTaskResponseOutput>> {
    const { taskId } = data;

    try {
      // tools-loader injects currentToolMessageId from pendingToolMessages before execute() is called.
      // No polling needed — by the time execute() runs, tool-call has already been processed.

      // Short retry to handle the parallel-batch race: if execute-tool(wakeUp) and
      // wait-for-task run in the same parallel tool batch, execute-tool may not have
      // finished inserting the task row when wait-for-task queries for it.
      let task = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const [found] = await db
          .select()
          .from(cronTasks)
          .where(eq(cronTasks.id, taskId))
          .limit(1);
        if (found) {
          task = found;
          break;
        }
        if (attempt < 4) {
          await new Promise((resolve) => {
            setTimeout(resolve, 200);
          });
        }
      }

      if (!task) {
        // Task not found — it was already completed and cleaned up by revival.
        // This is not an error: the wakeUp result was already injected into the thread.
        // Return success so the AI can continue gracefully.
        logger.info(
          "[WaitForTask] Task not found — already completed and cleaned up",
          { taskId },
        );
        return success({
          status: CronTaskStatus.COMPLETED,
          result: { message: "Task already completed and result injected." },
          waiting: false,
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
        const streamSkillId = streamContext?.skillId;
        const streamFavoriteId = streamContext?.favoriteId;

        const streamLeafMessageId = streamContext?.leafMessageId;

        // Write revival context to typed wakeUp* columns — not into taskInput JSON blob.
        await db
          .update(cronTasks)
          .set({
            wakeUpCallbackMode: CallbackMode.WAKE_UP,
            wakeUpThreadId: effectiveThreadId,
            wakeUpToolMessageId: effectiveToolMessageId,
            wakeUpModelId: streamModelId ?? null,
            wakeUpSkillId: streamSkillId ?? null,
            wakeUpFavoriteId: streamFavoriteId ?? null,
            wakeUpLeafMessageId: streamLeafMessageId ?? null,
            // Use the calling user's ID so resume-stream runs as the stream owner
            userId: !user.isPublic ? user.id : (task.userId ?? null),
            updatedAt: new Date(),
          })
          .where(eq(cronTasks.id, taskId));

        logger.info(
          "[WaitForTask] Registered thread as waiter on pending task",
          {
            taskId,
            threadId: effectiveThreadId,
            toolMessageId: effectiveToolMessageId,
          },
        );

        // Pause the stream — resume-stream will revive when the task completes.
        // Set pendingTimeoutMs so finish-step-handler starts the 90s abort timer.
        if (streamContext) {
          streamContext.waitingForRemoteResult = true;
          streamContext.pendingTimeoutMs = 90_000;
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
}
