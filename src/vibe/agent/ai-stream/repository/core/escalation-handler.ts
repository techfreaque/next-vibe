/**
 * Escalation handler — wires escalateToTask into a ToolExecutionContext.
 *
 * Extracted from stream-setup.ts to make the ~200-line closure independently
 * testable and to slim stream-setup.ts.
 *
 * Task-row creation is delegated to execute-tool/repository/completion.ts.
 * This file owns only stream-state wiring: waitingForRemoteResult, pendingTimeoutMs,
 * thread-state WS events, and the cancel handler.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import type { CallbackModeValue } from "next-vibe/execute-tool/constants";
import { TaskCompletion } from "next-vibe/execute-tool/repository/completion";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { CronTaskStatus } from "next-vibe/tasks/enum";

import type { ToolExecutionContext } from "../../../chat/config";
import { ThreadStreamingState } from "../../../chat/enum";
import type { ChatModelId } from "../../models";
import { transitionStreamingState } from "./streaming-state";

/**
 * Wire `toolExecutionContext.escalateToTask` so tools can escape the 90-second stream
 * timeout for long-running work (SSH, claude-code, etc.).
 *
 * The stream aborts via REMOTE_TOOL_WAIT — the UI stays in a visible, cancellable
 * waiting state. User cancel fires `onEscalatedTaskCancel` which marks the task
 * CANCELLED and unlocks the thread.
 */
export function wireEscalateToTask({
  toolExecutionContext,
  user,
  locale,
  logger,
  model,
}: {
  toolExecutionContext: ToolExecutionContext;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  model: ChatModelId | undefined;
}): void {
  toolExecutionContext.escalateToTask = async (options?: {
    callbackMode?: CallbackModeValue;
    displayName?: string;
  }): Promise<{
    taskId: string;
    onComplete: (
      result:
        | { success: true; data?: Record<string, WidgetData> }
        | ErrorResponseType,
    ) => Promise<void>;
  }> => {
    const { CallbackMode } = await import("next-vibe/execute-tool/constants");

    const callbackMode = options?.callbackMode ?? CallbackMode.WAKE_UP;

    const taskThreadId = toolExecutionContext.threadId;
    if (!taskThreadId) {
      // Escalation defers work to a task whose result routes back to THIS
      // thread — there is nothing to escalate without a persisted thread.
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- escalateToTask has no ResponseType channel; a missing thread is a programmer error
      throw new Error("escalateToTask: no threadId on the stream context");
    }
    const taskToolMessageId =
      toolExecutionContext.currentToolMessageId ??
      toolExecutionContext.aiMessageId;
    const taskLeafMessageId = toolExecutionContext.leafMessageId;

    const escalatedTaskId = await TaskCompletion.createEscalationTask(
      {
        callbackMode,
        displayName: options?.displayName,
        threadId: taskThreadId,
        toolMessageId: taskToolMessageId ?? null,
        leafMessageId: taskLeafMessageId ?? null,
        modelId: model ?? null,
        skillId: toolExecutionContext.skillId ?? null,
        favoriteId: toolExecutionContext.favoriteId ?? null,
        subAgentDepth: toolExecutionContext.subAgentDepth,
        userId: user.id ?? "",
      },
      logger,
    );

    // Always abort via REMOTE_TOOL_WAIT — stream dies, thread → waiting.
    // callbackMode controls what happens ON revival, not how the stream stops.
    toolExecutionContext.waitingForRemoteResult = true;
    toolExecutionContext.pendingEscalatedTaskId = escalatedTaskId;
    const escalateTimeoutMs = toolExecutionContext.callerTimeoutMs;
    if (escalateTimeoutMs === undefined) {
      toolExecutionContext.pendingTimeoutMs = 90_000;
    } else if (escalateTimeoutMs > 0) {
      toolExecutionContext.pendingTimeoutMs = escalateTimeoutMs;
    }

    if (taskThreadId) {
      try {
        // Write WAITING + fan out on all three channels (routed to the thread's
        // real folder) so every view shows the stop button while the escalated
        // task runs.
        await transitionStreamingState({
          threadId: taskThreadId,
          state: ThreadStreamingState.WAITING,
          logger,
          user,
        });
      } catch (err) {
        logger.warn("[StreamSetup] Failed to set thread waiting state", {
          taskThreadId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    logger.debug("[StreamSetup] Tool escalated to task", {
      taskId: escalatedTaskId,
      callbackMode,
      taskThreadId,
      taskToolMessageId,
    });

    // Wire cancel propagation: when the user cancels, mark the task CANCELLED.
    toolExecutionContext.onEscalatedTaskCancel = async (): Promise<void> => {
      toolExecutionContext.onEscalatedTaskCancel = undefined;
      try {
        await db
          .update(cronTasks)
          .set({
            lastExecutionStatus: CronTaskStatus.CANCELLED,
            enabled: false,
          })
          .where(eq(cronTasks.id, escalatedTaskId));
        logger.debug("[StreamSetup] Escalated task marked CANCELLED", {
          taskId: escalatedTaskId,
        });
        if (taskThreadId) {
          // Cancelled → back to idle, fanned out so every view clears the
          // stop button (was a silent DB write before).
          await transitionStreamingState({
            threadId: taskThreadId,
            state: ThreadStreamingState.IDLE,
            logger,
            user,
          });
        }
      } catch (err) {
        logger.warn("[StreamSetup] Failed to cancel escalated task", {
          taskId: escalatedTaskId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };

    const onComplete = async (
      result:
        | { success: true; data?: Record<string, WidgetData> }
        | ErrorResponseType,
    ): Promise<void> => {
      toolExecutionContext.onEscalatedTaskCancel = undefined;
      const { CallbackMode: CM } =
        await import("next-vibe/execute-tool/constants");

      const finalStatus = result.success
        ? CronTaskStatus.COMPLETED
        : CronTaskStatus.FAILED;
      const finalOutput: Record<string, WidgetData> | null = result.success
        ? (result.data ?? null)
        : TaskCompletion.failedOutput(result);

      const effectiveMode =
        callbackMode === CM.WAIT
          ? CM.WAIT
          : callbackMode === CM.DETACH
            ? CM.DETACH
            : callbackMode === CM.END_LOOP
              ? CM.END_LOOP
              : CM.WAKE_UP;

      if (taskToolMessageId && taskThreadId && user.id) {
        await TaskCompletion.handle({
          toolMessageId: taskToolMessageId,
          threadId: taskThreadId,
          callbackMode: effectiveMode,
          status: finalStatus,
          output: finalOutput,
          taskId: escalatedTaskId,
          modelId: model ?? null,
          skillId: toolExecutionContext.skillId ?? null,
          favoriteId: toolExecutionContext.favoriteId ?? null,
          leafMessageId: taskLeafMessageId ?? null,
          subAgentDepth: toolExecutionContext.subAgentDepth,
          ownerUser: user,
          logger,
          directResumeLocale: locale,
          abortSignal: new AbortController().signal,
        });
      }

      try {
        await db.delete(cronTasks).where(eq(cronTasks.id, escalatedTaskId));
      } catch {
        // Non-fatal
      }
    };

    return { taskId: escalatedTaskId, onComplete };
  };
}
