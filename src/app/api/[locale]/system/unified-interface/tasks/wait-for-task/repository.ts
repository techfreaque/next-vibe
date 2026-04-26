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

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
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
    streamContext: ToolExecutionContext,
  ): Promise<ResponseType<WaitForTaskResponseOutput>> {
    let { taskId } = data;

    try {
      // tools-loader injects currentToolMessageId from pendingToolMessages before execute() is called.
      // No polling needed - by the time execute() runs, tool-call has already been processed.

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
        logger.error(
          "[WaitForTask] Task not found - taskId does not exist in DB",
          { taskId },
        );
        return fail({
          message: t("waitForTask.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Helper: extract original tool info from task row for widget rendering
      const originalToolName = task.routeId ?? undefined;
      const rawTaskInput = task.taskInput as Record<string, WidgetData> | null;
      // Strip internal __result sentinel if present
      const { __result: taskInputResult, ...cleanTaskInput } =
        rawTaskInput ?? {};
      const originalArgs =
        Object.keys(cleanTaskInput).length > 0 ? cleanTaskInput : undefined;

      // If already completed (goroutine stored result in taskInput.__result), return inline.
      if (
        task.lastExecutionStatus === CronTaskStatus.COMPLETED ||
        task.lastExecutionStatus === CronTaskStatus.FAILED ||
        task.lastExecutionStatus === CronTaskStatus.CANCELLED
      ) {
        logger.debug(
          "[WaitForTask] Task already completed - returning result",
          {
            taskId,
            status: task.lastExecutionStatus,
          },
        );

        // Resolve result: prefer __result from taskInput (set by execute-tool goroutine),
        // fall back to cron_task_executions.result (set by hermes cron runner).
        let storedResult: WidgetData | undefined = taskInputResult;
        if (storedResult === undefined) {
          const [latestExecution] = await db
            .select({ result: cronTaskExecutions.result })
            .from(cronTaskExecutions)
            .where(eq(cronTaskExecutions.taskId, taskId))
            .orderBy(desc(cronTaskExecutions.completedAt))
            .limit(1);
          if (
            latestExecution?.result !== null &&
            latestExecution?.result !== undefined
          ) {
            storedResult = latestExecution.result;
          }
        }

        // Suppress wakeUp revival signal in the live stream - we're delivering inline.
        // The original wakeUp tool message ID is what resume-stream uses to signal;
        // adding it to suppressedWakeUpToolMessageIds makes the stream's finally block skip it.
        const originalWakeUpToolMessageId = task.wakeUpToolMessageId;
        if (streamContext && originalWakeUpToolMessageId) {
          if (!streamContext.suppressedWakeUpToolMessageIds) {
            streamContext.suppressedWakeUpToolMessageIds = new Set();
          }
          streamContext.suppressedWakeUpToolMessageIds.add(
            originalWakeUpToolMessageId,
          );
        }

        // Cancel pending resume-stream revival and delete task row - AI handles result inline.
        try {
          await db
            .delete(cronTasks)
            .where(
              sql`${cronTasks.tags} @> ${JSON.stringify([taskId])}::jsonb AND ${cronTasks.routeId} = 'resume-stream'`,
            );
          await db.delete(cronTasks).where(eq(cronTasks.id, taskId));
          logger.debug(
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

        return success<WaitForTaskResponseOutput>({
          status: task.lastExecutionStatus,
          result: storedResult !== undefined ? storedResult : undefined,
          waiting: false,
          originalToolName,
          originalArgs,
        });
      }

      // Task is pending/running - register the calling thread as a waiter.
      // When the task completes, handleTaskCompletion will backfill the tool
      // message and schedule resume-stream to revive the AI.
      const effectiveThreadId = streamContext.threadId;
      const effectiveToolMessageId =
        streamContext.currentToolMessageId ?? streamContext.aiMessageId;

      if (effectiveThreadId && effectiveToolMessageId) {
        const streamSkillId = streamContext.skillId;
        const streamFavoriteId = streamContext.favoriteId;
        const streamLeafMessageId = streamContext.leafMessageId;

        // Resolve the active chat model from the favorite/skill cascade.
        const waitUserId = !user.isPublic ? user.id : undefined;
        const { resolveFavoriteConfig } =
          await import("@/app/api/[locale]/agent/chat/favorites/repository");
        const { resolveSkillVariant } =
          await import("@/app/api/[locale]/agent/chat/skills/resolver");
        const { resolveChatModelId } =
          await import("@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver");
        const waitFav = await resolveFavoriteConfig(
          streamFavoriteId,
          waitUserId,
        );
        const { parseSkillId } =
          await import("@/app/api/[locale]/agent/chat/slugify");
        const waitSkill = await resolveSkillVariant(
          streamSkillId,
          waitFav ? parseSkillId(waitFav.skillId).variantId : null,
        );
        const waitModelId = resolveChatModelId(
          waitFav?.modelSelection ?? undefined,
          waitSkill?.modelSelection ?? undefined,
          user,
          streamContext.providerOverride,
        );

        // Write revival context to typed wakeUp* columns - not into taskInput JSON blob.
        // Use WAIT (not WAKE_UP) so handleTaskCompletion backfills the tool message
        // in-place and resumes the stream directly - no deferred message, no new branch.
        await db
          .update(cronTasks)
          .set({
            wakeUpCallbackMode: CallbackMode.WAIT,
            wakeUpThreadId: effectiveThreadId,
            wakeUpToolMessageId: effectiveToolMessageId,
            wakeUpModelId: waitModelId,
            wakeUpSkillId: streamSkillId ?? null,
            wakeUpFavoriteId: streamFavoriteId ?? null,
            wakeUpLeafMessageId: streamLeafMessageId ?? null,
            wakeUpSubAgentDepth: streamContext.subAgentDepth ?? 0,
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

        // Suppress any wakeUp signal for the original tool message - we're taking over delivery.
        // The goroutine may have already queued a wakeUp signal via publishWakeUpSignal;
        // the stream's finally block will skip it if it's in suppressedWakeUpToolMessageIds.
        const originalWakeUpMsgId = task.wakeUpToolMessageId;
        if (originalWakeUpMsgId) {
          if (!streamContext.suppressedWakeUpToolMessageIds) {
            streamContext.suppressedWakeUpToolMessageIds = new Set();
          }
          streamContext.suppressedWakeUpToolMessageIds.add(originalWakeUpMsgId);
        }

        // Pause the stream - resume-stream will revive when the task completes.
        // Set pendingTimeoutMs so finish-step-handler starts the 90s abort timer.
        streamContext.waitingForRemoteResult = true;
        streamContext.pendingTimeoutMs = 90_000;
      } else {
        logger.warn(
          "[WaitForTask] No streamContext - cannot register waiter, returning pending status",
          { taskId },
        );
      }

      return success({
        status: CronTaskStatus.PENDING,
        waiting: true,
        originalToolName,
        originalArgs,
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
