/**
 * Await Task Repository
 *
 * Registers the calling AI stream as a waiter on any task dispatched by execute-tool
 * (DETACH, WAKE_UP, or remote pending call).
 *
 * Already completed → returns result inline (stream continues).
 * Still running     → writes WAIT revival context onto the task row,
 *                     sets streamContext.waitingForRemoteResult=true (stream pauses),
 *                     revived via resume-stream when the task calls handleTaskCompletion.
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
import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { CallbackMode } from "@/app/api/[locale]/system/unified-interface/execute-tool/constants";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import {
  cronTaskExecutions,
  cronTasks,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import type {
  AwaitTaskRequestOutput,
  AwaitTaskResponseOutput,
} from "./definition";
import type { AwaitTaskT } from "./i18n";

async function resolveStreamModelId(
  streamContext: ToolExecutionContext,
  user: JwtPayloadType,
): Promise<string | undefined> {
  const userId = !user.isPublic ? user.id : undefined;
  const { resolveFavoriteConfig } =
    await import("@/app/api/[locale]/agent/skills/favorites/repository");
  const { resolveSkillVariant } =
    await import("@/app/api/[locale]/agent/skills/resolver");
  const { resolveChatModelId } =
    await import("@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver");
  const { parseSkillId } =
    await import("@/app/api/[locale]/agent/chat/slugify");
  const { getInstanceAvailability } =
    await import("@/app/api/[locale]/agent/env-availability");

  const fav = await resolveFavoriteConfig(streamContext.favoriteId, userId);
  const skill = await resolveSkillVariant(
    streamContext.skillId,
    fav ? parseSkillId(fav.skillId).variantId : null,
  );
  const availability = await getInstanceAvailability();
  return (
    resolveChatModelId(
      fav?.modelSelection ?? undefined,
      skill?.modelSelection ?? undefined,
      user,
      availability,
    ) ?? undefined
  );
}

export class AwaitTaskRepository {
  static async awaitTask(
    data: AwaitTaskRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: AwaitTaskT,
    streamContext: ToolExecutionContext,
  ): Promise<ResponseType<AwaitTaskResponseOutput>> {
    const { taskId } = data;

    try {
      // ── Remote pending call (no DB task row — remote dispatch via execute-tool) ──
      // These live in the in-memory pending-calls registry, not in cronTasks.
      const {
        getPendingCallReconciled,
        setPendingCallRevival,
        discardPendingCall,
      } =
        await import("@/app/api/[locale]/system/unified-interface/execute-tool/pending-calls");
      const pendingCall = await getPendingCallReconciled(taskId);
      if (pendingCall) {
        // Suppress any wakeUp signal for the original dispatch tool message —
        // await-task is taking over delivery.
        if (streamContext && pendingCall.toolMessageId) {
          if (!streamContext.suppressedWakeUpToolMessageIds) {
            streamContext.suppressedWakeUpToolMessageIds = new Set();
          }
          streamContext.suppressedWakeUpToolMessageIds.add(
            pendingCall.toolMessageId,
          );
        }

        if (pendingCall.result) {
          discardPendingCall(taskId);
          logger.debug(
            "[AwaitTask] Pending remote call already completed - returning inline",
            { taskId, status: pendingCall.result.status },
          );
          return success<AwaitTaskResponseOutput>({
            status:
              pendingCall.result.status === "completed"
                ? CronTaskStatus.COMPLETED
                : CronTaskStatus.FAILED,
            result: pendingCall.result.output ?? undefined,
            waiting: false,
            originalToolName: pendingCall.toolName,
            originalArgs: undefined,
          });
        }

        const pendThreadId = streamContext.threadId;
        const pendToolMessageId =
          streamContext.currentToolMessageId ?? streamContext.aiMessageId;
        if (pendThreadId && pendToolMessageId) {
          const pendModelId = await resolveStreamModelId(streamContext, user);

          setPendingCallRevival(taskId, {
            threadId: pendThreadId,
            toolMessageId: pendToolMessageId,
            callbackMode: CallbackMode.WAIT,
            leafMessageId: streamContext.leafMessageId ?? null,
            modelId: pendModelId ?? null,
            skillId: streamContext.skillId ?? null,
            favoriteId: streamContext.favoriteId ?? null,
            subAgentDepth: streamContext.subAgentDepth ?? 0,
            userId: user.id ?? "",
          });

          streamContext.waitingForRemoteResult = true;
          streamContext.pendingTimeoutMs = 90_000;
          logger.info(
            "[AwaitTask] Registered thread as waiter on pending remote call",
            {
              taskId,
              threadId: pendThreadId,
              toolMessageId: pendToolMessageId,
            },
          );
        } else {
          logger.warn(
            "[AwaitTask] No streamContext target - returning pending status",
            { taskId },
          );
        }

        return success<AwaitTaskResponseOutput>({
          status: CronTaskStatus.PENDING,
          waiting: true,
          originalToolName: pendingCall.toolName,
          originalArgs: undefined,
        });
      }

      // ── DB task row (DETACH or WAKE_UP dispatched by execute-tool) ──
      // Retry briefly to handle parallel-batch race: await-task and execute-tool
      // may run in the same parallel tool batch.
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
        logger.error("[AwaitTask] Task not found", { taskId });
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Non-admin users can only await their own tasks
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      if (!isAdmin && task.userId !== null && task.userId !== user.id) {
        logger.warn("[AwaitTask] User attempted to await task they don't own", {
          taskId,
          taskUserId: task.userId,
          requestUserId: user.id,
        });
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const originalToolName = task.routeId ?? undefined;
      const rawTaskInput = task.taskInput as Record<string, WidgetData> | null;
      const cleanTaskInput = rawTaskInput ?? {};
      const originalArgs =
        Object.keys(cleanTaskInput).length > 0 ? cleanTaskInput : undefined;

      // Already terminal — return result inline.
      if (
        task.lastExecutionStatus === CronTaskStatus.COMPLETED ||
        task.lastExecutionStatus === CronTaskStatus.FAILED ||
        task.lastExecutionStatus === CronTaskStatus.CANCELLED
      ) {
        logger.debug("[AwaitTask] Task already completed - returning result", {
          taskId,
          status: task.lastExecutionStatus,
        });

        let storedResult: WidgetData | undefined = undefined;
        if (task.wakeUpToolMessageId) {
          // Poll briefly: the DB row flips terminal before the tool message backfill lands.
          for (let attempt = 0; attempt < 15; attempt++) {
            const [toolMessage] = await db
              .select({ metadata: chatMessages.metadata })
              .from(chatMessages)
              .where(eq(chatMessages.id, task.wakeUpToolMessageId))
              .limit(1);
            const toolCall = toolMessage?.metadata?.toolCall;
            const terminal =
              toolCall?.status === "completed" || toolCall?.status === "failed";
            if (terminal) {
              const backfilled = toolCall.result;
              if (backfilled !== null && backfilled !== undefined) {
                storedResult = backfilled;
              }
              break;
            }
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 200);
            });
          }
        } else {
          // No tool message (headless / test scenario): read result from execution history.
          const [execRow] = await db
            .select({ result: cronTaskExecutions.result })
            .from(cronTaskExecutions)
            .where(eq(cronTaskExecutions.taskId, taskId))
            .orderBy(desc(cronTaskExecutions.startedAt))
            .limit(1);
          if (execRow?.result !== null && execRow?.result !== undefined) {
            storedResult = execRow.result as WidgetData;
          }
        }

        // Suppress any pending wakeUp revival — we're delivering inline.
        const originalWakeUpToolMessageId = task.wakeUpToolMessageId;
        if (streamContext && originalWakeUpToolMessageId) {
          if (!streamContext.suppressedWakeUpToolMessageIds) {
            streamContext.suppressedWakeUpToolMessageIds = new Set();
          }
          streamContext.suppressedWakeUpToolMessageIds.add(
            originalWakeUpToolMessageId,
          );
        }

        // Clean up the task row and any pending resume-stream cron task.
        try {
          await db
            .delete(cronTasks)
            .where(
              sql`${cronTasks.tags} @> ${JSON.stringify([taskId])}::jsonb AND ${cronTasks.routeId} = 'resume-stream'`,
            );
          await db.delete(cronTasks).where(eq(cronTasks.id, taskId));
        } catch (cleanupErr) {
          logger.warn("[AwaitTask] Cleanup failed (non-fatal)", {
            taskId,
            error:
              cleanupErr instanceof Error
                ? cleanupErr.message
                : String(cleanupErr),
          });
        }

        return success<AwaitTaskResponseOutput>({
          status: task.lastExecutionStatus,
          result: storedResult !== undefined ? storedResult : undefined,
          waiting: false,
          originalToolName,
          originalArgs,
        });
      }

      // Task still running — register this stream as a waiter via WAIT mode.
      // handleTaskCompletion will backfill the tool message and schedule resume-stream.
      const effectiveThreadId = streamContext.threadId;
      const effectiveToolMessageId =
        streamContext.currentToolMessageId ?? streamContext.aiMessageId;

      if (effectiveThreadId && effectiveToolMessageId) {
        const modelId = await resolveStreamModelId(streamContext, user);

        await db
          .update(cronTasks)
          .set({
            wakeUpCallbackMode: CallbackMode.WAIT,
            wakeUpThreadId: effectiveThreadId,
            wakeUpToolMessageId: effectiveToolMessageId,
            wakeUpModelId: modelId ?? null,
            wakeUpSkillId: streamContext.skillId ?? null,
            wakeUpFavoriteId: streamContext.favoriteId ?? null,
            wakeUpLeafMessageId: streamContext.leafMessageId ?? null,
            wakeUpSubAgentDepth: streamContext.subAgentDepth ?? 0,
            userId: !user.isPublic ? user.id : (task.userId ?? null),
            updatedAt: new Date(),
          })
          .where(eq(cronTasks.id, taskId));

        logger.info("[AwaitTask] Registered thread as waiter on pending task", {
          taskId,
          threadId: effectiveThreadId,
          toolMessageId: effectiveToolMessageId,
        });

        // Suppress any existing wakeUp revival that may have been queued.
        const originalWakeUpMsgId = task.wakeUpToolMessageId;
        if (originalWakeUpMsgId) {
          if (!streamContext.suppressedWakeUpToolMessageIds) {
            streamContext.suppressedWakeUpToolMessageIds = new Set();
          }
          streamContext.suppressedWakeUpToolMessageIds.add(originalWakeUpMsgId);
        }

        streamContext.waitingForRemoteResult = true;
        streamContext.pendingTimeoutMs = 90_000;
      } else {
        logger.warn(
          "[AwaitTask] No streamContext - cannot register waiter, returning pending status",
          { taskId },
        );
      }

      return success<AwaitTaskResponseOutput>({
        status: CronTaskStatus.PENDING,
        waiting: true,
        originalToolName,
        originalArgs,
      });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[AwaitTask] Failed", { taskId, error: msg });
      return fail({
        message: t("post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
