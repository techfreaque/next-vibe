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
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { AwaitTaskT } from "next-vibe/execute-tool/await-task/i18n";
import { resolveStreamModelId } from "next-vibe/execute-tool/handlers/completion";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { cronTaskExecutions, cronTasks } from "next-vibe/tasks/cron/db";
import { CronTaskStatus } from "next-vibe/tasks/enum";

import { RESUME_STREAM_ALIAS } from "@/app/api/[locale]/agent/ai-stream/resume-stream/constants";
import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { chatMessages } from "@/app/api/[locale]/agent/chat/db";

import { CallbackMode } from "../constants";
import type {
  AwaitTaskRequestOutput,
  AwaitTaskResponseOutput,
} from "./definition";

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
      } = await import("../pending-calls");
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
            originalArgs: pendingCall.input ?? undefined,
          });
        }

        // Receiver-owns-task: for a remote dispatch the durable result lives in
        // the OWNER instance's task history. The local entry can be stale — a
        // detach dispatch message is never backfilled, and the result event may
        // have been consumed by ANOTHER process on this instance (its registry,
        // not ours). Ask the owner directly before parking this thread.
        if (pendingCall.instanceId) {
          const { RouteExecuteRepository } =
            await import("next-vibe/execute-tool/repository");
          const { default: awaitTaskDefinition } = await import("./definition");
          const remote = await RouteExecuteRepository.runInProcessTyped({
            definition: awaitTaskDefinition.POST,
            instanceId: pendingCall.instanceId,
            input: { taskId },
            user,
            locale: defaultLocale,
            logger,
            callbackMode: CallbackMode.WAIT,
          });
          if (
            remote.success &&
            remote.data.waiting !== true &&
            (remote.data.status === CronTaskStatus.COMPLETED ||
              remote.data.status === CronTaskStatus.FAILED)
          ) {
            discardPendingCall(taskId);
            logger.debug(
              "[AwaitTask] Owner instance returned settled result — delivering inline",
              { taskId, instanceId: pendingCall.instanceId },
            );
            return success<AwaitTaskResponseOutput>({
              ...remote.data,
              originalToolName:
                remote.data.originalToolName ?? pendingCall.toolName,
              originalArgs:
                remote.data.originalArgs ?? pendingCall.input ?? undefined,
            });
          }
          logger.debug(
            "[AwaitTask] Owner instance has no settled result yet — parking locally",
            { taskId, instanceId: pendingCall.instanceId },
          );
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

          // Restart/cross-process safety (same pattern as the wakeUp park):
          // persist the callId on the await-task tool message so ANY process
          // that receives the result event can revive this parked thread from
          // the DB — the in-memory revival above only helps the process that
          // parked it.
          const { storePendingCallId } = await import("../handlers/remote");
          await storePendingCallId(pendToolMessageId, taskId, logger);

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
          originalArgs: pendingCall.input ?? undefined,
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

        // Task execution history is the canonical result store for EVERY mode
        // (detach never backfills the tool message). Read it first; only fall
        // back to the tool-message backfill (wakeUp/wait) if history is empty.
        let storedResult: WidgetData | undefined = undefined;
        const [execRow] = await db
          .select({ result: cronTaskExecutions.result })
          .from(cronTaskExecutions)
          .where(eq(cronTaskExecutions.taskId, taskId))
          .orderBy(desc(cronTaskExecutions.startedAt))
          .limit(1);
        if (execRow?.result !== null && execRow?.result !== undefined) {
          storedResult = execRow.result as WidgetData;
        } else if (task.wakeUpToolMessageId) {
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
              sql`${cronTasks.tags} @> ${JSON.stringify([taskId])}::jsonb AND ${cronTasks.routeId} = ${RESUME_STREAM_ALIAS}`,
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

        // Bounded inline wait. The dispatched task usually completes within a
        // second or two (fixture replay; or a fast tool). Delivering the result
        // INLINE — letting the current, still-alive stream continue past the
        // await-task call with the result injected — is the correct, race-free
        // path: it matches the already-terminal branch above and the regular-mode
        // behaviour. It also avoids the pause→resume-stream revival, whose revived
        // turn would RE-ISSUE the await-task call on a now-deleted task (a
        // duplicate, second "failed" await-task tool message — the direct-mode
        // T5b regression). We only fall through to the WAIT pause+revival below
        // for genuinely long-running tasks that don't finish within this window.
        //
        // This also closes the original race: the detach/wakeUp goroutine may have
        // read its completion context BEFORE our WAIT upgrade landed and flipped
        // the task terminal with callbackMode=DETACH (firing no revival) — the
        // poll still observes the terminal state and delivers inline.
        // 15s covers a cheap media/tool task dispatched locally OR routed to a
        // remote instance (direct-http relay adds round-trips). Long enough that
        // ordinary detaches resolve inline; still bounded so a genuinely
        // long-running task falls through to the WAIT pause + revival.
        const INLINE_WAIT_MS = 15_000;
        const INLINE_POLL_MS = 200;
        const inlineDeadline = Date.now() + INLINE_WAIT_MS;
        let afterUpgrade: { lastExecutionStatus: string | null } | undefined =
          undefined;
        while (Date.now() < inlineDeadline) {
          const [row] = await db
            .select({ lastExecutionStatus: cronTasks.lastExecutionStatus })
            .from(cronTasks)
            .where(eq(cronTasks.id, taskId))
            .limit(1);
          afterUpgrade = row;
          if (
            row &&
            (row.lastExecutionStatus === CronTaskStatus.COMPLETED ||
              row.lastExecutionStatus === CronTaskStatus.FAILED ||
              row.lastExecutionStatus === CronTaskStatus.CANCELLED)
          ) {
            break;
          }
          // Row gone = the goroutine completed and cleaned up; treat as done.
          if (!row) {
            break;
          }
          await new Promise<void>((resolve) => {
            setTimeout(resolve, INLINE_POLL_MS);
          });
        }
        if (
          afterUpgrade &&
          (afterUpgrade.lastExecutionStatus === CronTaskStatus.COMPLETED ||
            afterUpgrade.lastExecutionStatus === CronTaskStatus.FAILED ||
            afterUpgrade.lastExecutionStatus === CronTaskStatus.CANCELLED)
        ) {
          logger.info(
            "[AwaitTask] Task completed during inline wait — delivering inline",
            { taskId, status: afterUpgrade.lastExecutionStatus },
          );
          const [execRow] = await db
            .select({ result: cronTaskExecutions.result })
            .from(cronTaskExecutions)
            .where(eq(cronTaskExecutions.taskId, taskId))
            .orderBy(desc(cronTaskExecutions.startedAt))
            .limit(1);
          const inlineResult =
            execRow?.result !== null && execRow?.result !== undefined
              ? (execRow.result as WidgetData)
              : undefined;
          try {
            await db
              .delete(cronTasks)
              .where(
                sql`${cronTasks.tags} @> ${JSON.stringify([taskId])}::jsonb AND ${cronTasks.routeId} = ${RESUME_STREAM_ALIAS}`,
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
            status: afterUpgrade.lastExecutionStatus,
            result: inlineResult,
            waiting: false,
            originalToolName,
            originalArgs,
          });
        }

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
