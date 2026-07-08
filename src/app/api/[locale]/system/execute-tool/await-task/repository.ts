/**
 * Await Task Repository
 *
 * Registers the calling AI stream as a waiter on any task dispatched by execute-tool
 * (DETACH, WAKE_UP, or remote pending call).
 *
 * Already completed → returns result inline (stream continues).
 * Still running     → writes WAIT revival context onto the task row,
 *                     sets streamContext.waitingForRemoteResult=true (stream pauses),
 *                     revived via resume-stream when the task calls TaskCompletion.handle.
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
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { cronTaskExecutions, cronTasks } from "next-vibe/tasks/cron/db";
import { CronTaskStatus, type CronTaskStatusValue } from "next-vibe/tasks/enum";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { REVIVAL_ALIAS as RESUME_STREAM_ALIAS } from "@/app/api/[locale]/system/execute-tool/revival/definition";

import { CallbackMode } from "../constants";
import { TaskCompletion } from "../repository/completion";
import { PendingCalls } from "../repository/pending-calls";
import { RemoteDispatch } from "../repository/remote";
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
      const pendingCall = await PendingCalls.getReconciled(taskId);
      if (pendingCall) {
        // Suppress any wakeUp signal for the original dispatch tool message —
        // await-task is taking over delivery.
        AwaitTaskRepository.suppressWakeUp(
          streamContext,
          pendingCall.toolMessageId,
        );

        if (pendingCall.result) {
          PendingCalls.discard(taskId);
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
            PendingCalls.discard(taskId);
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
          const pendModelId = await TaskCompletion.resolveStreamModelId(
            streamContext,
            user,
          );

          PendingCalls.setRevival(taskId, {
            threadId: pendThreadId,
            toolMessageId: pendToolMessageId,
            callbackMode: CallbackMode.WAIT,
            leafMessageId: streamContext.leafMessageId ?? null,
            modelId: pendModelId,
            skillId: streamContext.skillId ?? null,
            favoriteId: streamContext.favoriteId ?? null,
            subAgentDepth: streamContext.subAgentDepth ?? 0,
            userId: user.id ?? "",
          });

          // Persist callId on the await-task tool message so ANY process that
          // receives the result event can enable+fire the parked task.
          await RemoteDispatch.storePendingCallId(
            pendToolMessageId,
            taskId,
            logger,
          );

          // Close the park race: the result event may have landed in a sibling
          // process between the reconcile above and the anchor write — that
          // process saw no anchor and persisted to pending_call_results. One
          // final reconcile catches it; otherwise the park would never revive
          // (the event already fired).
          const settledLate = await PendingCalls.getReconciled(taskId);
          if (settledLate?.result) {
            PendingCalls.discard(taskId);
            logger.debug(
              "[AwaitTask] Result landed during park setup - returning inline",
              { taskId, status: settledLate.result.status },
            );
            return success<AwaitTaskResponseOutput>({
              status:
                settledLate.result.status === "completed"
                  ? CronTaskStatus.COMPLETED
                  : CronTaskStatus.FAILED,
              result: settledLate.result.output ?? undefined,
              waiting: false,
              originalToolName: pendingCall.toolName,
              originalArgs: pendingCall.input ?? undefined,
            });
          }

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
      if (AwaitTaskRepository.isTerminal(task.lastExecutionStatus)) {
        logger.debug("[AwaitTask] Task already completed - returning result", {
          taskId,
          status: task.lastExecutionStatus,
        });

        // Task execution history is the canonical result store for EVERY mode
        // (detach never backfills the tool message). Read it first; only fall
        // back to the tool-message backfill (wakeUp/wait) if history is empty.
        let storedResult = await AwaitTaskRepository.readStoredResult(taskId);
        if (storedResult === undefined && task.wakeUpToolMessageId) {
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
        AwaitTaskRepository.suppressWakeUp(
          streamContext,
          task.wakeUpToolMessageId,
        );

        await AwaitTaskRepository.cleanupTask(taskId, logger);

        return success<AwaitTaskResponseOutput>({
          status: task.lastExecutionStatus,
          result: storedResult !== undefined ? storedResult : undefined,
          waiting: false,
          originalToolName,
          originalArgs,
        });
      }

      // Task still running — register this stream as a waiter via WAIT mode.
      // TaskCompletion.handle will backfill the tool message and schedule resume-stream.
      const effectiveThreadId = streamContext.threadId;
      const effectiveToolMessageId =
        streamContext.currentToolMessageId ?? streamContext.aiMessageId;

      // Cross-instance / headless caller with NOTHING to park: returning
      // "pending" is useless (there is no local stream to pause and revive —
      // the caller would just re-poll the wire). Block on the goroutine's
      // completion SIGNAL (event-driven, no DB polling), then do one read.
      // The caller's inline WAIT stays open (await-task declares timeoutMs: 0).
      // 10 min runaway-task backstop.
      if (!effectiveThreadId || !effectiveToolMessageId) {
        await PendingCalls.waitForTaskCompletion(taskId, 600_000);
        // Single read after the signal (or after timeout — covers a
        // completion that landed in another process before registration).
        const [row] = await db
          .select({ lastExecutionStatus: cronTasks.lastExecutionStatus })
          .from(cronTasks)
          .where(eq(cronTasks.id, taskId))
          .limit(1);
        const terminal =
          !row || AwaitTaskRepository.isTerminal(row.lastExecutionStatus);
        if (!terminal) {
          logger.warn(
            "[AwaitTask] Cross-instance wait exhausted — returning pending",
            { taskId },
          );
          return success<AwaitTaskResponseOutput>({
            status: CronTaskStatus.PENDING,
            waiting: true,
            originalToolName,
            originalArgs,
          });
        }
        const status = row?.lastExecutionStatus ?? CronTaskStatus.COMPLETED;
        const settledResult =
          await AwaitTaskRepository.readStoredResult(taskId);
        await AwaitTaskRepository.cleanupTask(taskId, logger);
        logger.info("[AwaitTask] Cross-instance wait settled — delivering", {
          taskId,
          status,
        });
        return success<AwaitTaskResponseOutput>({
          status,
          result: settledResult,
          waiting: false,
          originalToolName,
          originalArgs,
        });
      }

      const modelId = await TaskCompletion.resolveStreamModelId(
        streamContext,
        user,
      );

      await db
        .update(cronTasks)
        .set({
          wakeUpCallbackMode: CallbackMode.WAIT,
          wakeUpThreadId: effectiveThreadId,
          wakeUpToolMessageId: effectiveToolMessageId,
          wakeUpModelId: modelId,
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
      // Event-driven: block on the goroutine's completion signal, then read the
      // row ONCE. The single read also closes the original race: the goroutine
      // may have flipped the task terminal with callbackMode=DETACH (firing no
      // revival) before our WAIT upgrade landed — the read still observes the
      // terminal state and delivers inline. 15s is long enough that ordinary
      // detaches resolve inline; genuinely long-running tasks fall through to
      // the WAIT pause + revival below.
      await PendingCalls.waitForTaskCompletion(taskId, 15_000);
      const [afterUpgrade] = await db
        .select({ lastExecutionStatus: cronTasks.lastExecutionStatus })
        .from(cronTasks)
        .where(eq(cronTasks.id, taskId))
        .limit(1);
      if (
        afterUpgrade &&
        AwaitTaskRepository.isTerminal(afterUpgrade.lastExecutionStatus)
      ) {
        logger.info(
          "[AwaitTask] Task completed during inline wait — delivering inline",
          { taskId, status: afterUpgrade.lastExecutionStatus },
        );
        const inlineResult = await AwaitTaskRepository.readStoredResult(taskId);
        await AwaitTaskRepository.cleanupTask(taskId, logger);
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
      AwaitTaskRepository.suppressWakeUp(
        streamContext,
        task.wakeUpToolMessageId,
      );

      streamContext.waitingForRemoteResult = true;
      streamContext.pendingTimeoutMs = 90_000;

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

  /** Whether a task status is terminal (completed/failed/cancelled). */
  private static isTerminal(
    status: typeof CronTaskStatusValue | null,
  ): status is typeof CronTaskStatusValue {
    return (
      status === CronTaskStatus.COMPLETED ||
      status === CronTaskStatus.FAILED ||
      status === CronTaskStatus.CANCELLED
    );
  }

  /** Latest execution-history result for a task, or undefined when empty. */
  private static async readStoredResult(
    taskId: string,
  ): Promise<WidgetData | undefined> {
    const [execRow] = await db
      .select({ result: cronTaskExecutions.result })
      .from(cronTaskExecutions)
      .where(eq(cronTaskExecutions.taskId, taskId))
      .orderBy(desc(cronTaskExecutions.startedAt))
      .limit(1);
    return execRow?.result !== null && execRow?.result !== undefined
      ? (execRow.result as WidgetData)
      : undefined;
  }

  /**
   * Suppress the pending wakeUp revival for a dispatch tool message —
   * await-task is taking over delivery of the result.
   */
  private static suppressWakeUp(
    streamContext: ToolExecutionContext,
    toolMessageId: string | null | undefined,
  ): void {
    if (!streamContext || !toolMessageId) {
      return;
    }
    if (!streamContext.suppressedWakeUpToolMessageIds) {
      streamContext.suppressedWakeUpToolMessageIds = new Set();
    }
    streamContext.suppressedWakeUpToolMessageIds.add(toolMessageId);
  }

  /** Delete the task row and any pending resume-stream cron task (non-fatal). */
  private static async cleanupTask(
    taskId: string,
    logger: EndpointLogger,
  ): Promise<void> {
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
          cleanupErr instanceof Error ? cleanupErr.message : String(cleanupErr),
      });
    }
  }
}
