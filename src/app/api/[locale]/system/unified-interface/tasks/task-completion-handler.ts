/**
 * Task Completion Handler
 * Shared logic called by both complete-task and /report after a task finishes.
 *
 * Responsibilities:
 * 1. Backfill result into the originating tool call message in DB (cache-stable via sortObjectKeys)
 * 2. Emit TASK_COMPLETED WS event (UI notification only)
 * 3. For callbackMode=wakeUp or wait:
 *    - Always schedule a resume-stream one-shot cron task.
 *    - resume-stream checks isStreaming:
 *      - true  → result already in DB from step 1; live loop will pick it up naturally
 *      - false → runs runHeadlessAiStream(threadMode:"append") to continue the thread
 */

import "server-only";

import { eq } from "drizzle-orm";

import { scopedTranslation as aiStreamScopedTranslation } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { createMessagesEmitter } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/emitter";
import { db } from "@/app/api/[locale]/system/db";
import {
  CallbackMode,
  type CallbackModeValue,
} from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { RESUME_STREAM_ALIAS } from "../../../agent/ai-stream/resume-stream/constants";
import { cronTasks } from "./cron/db";
import { createTaskEmitters } from "./cron/emitter";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "./enum";

/**
 * Recursively sort object keys for stable serialization (cache-friendly).
 * Matches the sortObjectKeys used in ToolResultHandler so the AI SDK sees
 * identical bytes whether the result came from a live tool call or /report.
 */
function sortObjectKeys(obj: WidgetData): WidgetData {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (typeof obj === "string") {
    if (
      (obj.startsWith("{") && obj.endsWith("}")) ||
      (obj.startsWith("[") && obj.endsWith("]"))
    ) {
      try {
        const parsed = JSON.parse(obj) as WidgetData;
        return sortObjectKeys(parsed);
      } catch {
        return obj;
      }
    }
    return obj;
  }
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  if (obj instanceof Date) {
    return obj;
  }
  const sorted: Record<string, WidgetData> = {};
  for (const key of Object.keys(obj).toSorted()) {
    const value = obj[key];
    if (value !== undefined) {
      sorted[key] = sortObjectKeys(value);
    }
  }
  return sorted;
}

export async function handleTaskCompletion(params: {
  /** Typed revival context - read from cron_tasks wakeUp* columns (not from taskInput JSON) */
  toolMessageId: string;
  threadId: string | null;
  callbackMode: CallbackModeValue | null;
  status: string;
  output: WidgetData | null;
  taskId: string;
  /** Revival routing - typed columns from the cron task row */
  modelId?: string | null;
  skillId?: string | null;
  favoriteId?: string | null;
  /** Branch leaf message ID at tool-call time - typed column wakeUpLeafMessageId */
  leafMessageId?: string | null;
  /** The resolved task owner — must come from resolveTaskOwnerUser(), never fabricated */
  ownerUser: JwtPrivatePayloadType;
  logger: EndpointLogger;
  /**
   * When provided, fire resume-stream directly instead of waiting for the cron pulse.
   * Always provided for local wakeUp/wait flows. Falls back to the cron task as a
   * safety net (no-op if already claimed by direct fire).
   * The ownerUser is always used as the identity — this is only the locale signal.
   */
  directResumeLocale?: CountryLanguage;
  /**
   * When provided, pin the resume-stream cron task to this instance via targetInstance.
   * Used by the /report endpoint so the task only runs on the instance that originated
   * the thread (Thea), not on Hermes which also polls the cron table.
   */
  selfInstanceId?: string | null;
  /** Abort signal from the originating route/task handler — propagated to revival headless stream */
  abortSignal: AbortSignal;
  /** Sub-agent nesting depth from the original stream — preserved across task completion/revival */
  subAgentDepth: number;
}): Promise<void> {
  const {
    toolMessageId,
    threadId,
    callbackMode,
    status,
    output,
    taskId,
    modelId,
    skillId,
    favoriteId,
    leafMessageId,
    ownerUser,
    logger,
    directResumeLocale,
    selfInstanceId,
    abortSignal,
    subAgentDepth,
  } = params;

  const toolStatus =
    status === CronTaskStatus.COMPLETED
      ? "completed"
      : status === CronTaskStatus.CANCELLED
        ? "failed"
        : "failed";

  // 1. Backfill result into the originating tool call message (cache-stable).
  //    endLoop behaves the same as wait: backfill original, no deferred child.
  //    wakeUp: backfill deferred to resume-stream (sequenceId check).
  //    detach: no backfill (initial {taskId, status, hint} is the final state).
  if (toolMessageId) {
    try {
      const [existing] = await db
        .select({
          metadata: chatMessages.metadata,
          threadId: chatMessages.threadId,
          authorId: chatMessages.authorId,
        })
        .from(chatMessages)
        .where(eq(chatMessages.id, toolMessageId));

      if (existing) {
        const toolCall = existing.metadata?.toolCall;
        // Apply sortObjectKeys to result for cache-stable serialization - same as ToolResultHandler
        const stableResult =
          output !== null && output !== undefined
            ? sortObjectKeys(JSON.parse(JSON.stringify(output)) as WidgetData)
            : undefined;

        // wakeUp: do NOT backfill here. resume-stream checks the leaf sequenceId:
        //   - same sequenceId → backfill the original tool message directly
        //   - different sequenceId → insert a deferred TOOL message after the new leaf
        // detach: do NOT backfill either. The initial {taskId, status, hint} written by
        //   ToolResultHandler.processToolResult is the correct final state. The real result
        //   lives only in cron_task_executions (task history), not in the thread.
        // All other modes: always backfill the original tool message.
        if (
          callbackMode !== CallbackMode.WAKE_UP &&
          callbackMode !== CallbackMode.DETACH
        ) {
          await db
            .update(chatMessages)
            .set({
              metadata: {
                ...existing.metadata,
                toolCall: toolCall
                  ? {
                      ...toolCall,
                      status: toolStatus,
                      result: stableResult,
                      isPartial: false,
                    }
                  : undefined,
              },
              updatedAt: new Date(),
            })
            .where(eq(chatMessages.id, toolMessageId));

          logger.debug("[TaskCompletion] Backfilled tool message with result", {
            toolMessageId,
            toolStatus,
            taskId,
          });
        } else {
          logger.debug(
            "[TaskCompletion] wakeUp - backfill deferred to resume-stream (sequenceId check)",
            { toolMessageId, taskId },
          );
        }
      } else {
        logger.warn("[TaskCompletion] Tool message not found for backfill", {
          toolMessageId,
          taskId,
        });
      }
    } catch (err) {
      logger.error("[TaskCompletion] Failed to backfill tool message", {
        toolMessageId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // 2. Emit TASK_COMPLETED WS event (UI notification only)
  if (threadId) {
    createMessagesEmitter(
      threadId,
      null,
      logger,
      ownerUser,
    )("task-completed", { backgroundTasks: [{ id: taskId }] });

    logger.debug("[TaskCompletion] Emitted TASK_COMPLETED WS event", {
      threadId,
      taskId,
      toolMessageId,
    });
  }

  // 2a. Emit task-updated to task list/queue WS channels
  {
    const { emitTaskList, emitTaskQueue } = createTaskEmitters(
      logger,
      ownerUser,
    );
    const taskPayload = {
      tasks: [
        {
          id: taskId,
          lastExecutionStatus:
            toolStatus === "completed"
              ? CronTaskStatus.COMPLETED
              : CronTaskStatus.FAILED,
        },
      ],
    };
    emitTaskList("task-updated", taskPayload);
    emitTaskQueue("task-updated", taskPayload);
  }

  // 2b. For endLoop: task is done, no AI continuation - clear thread from "waiting" → "idle".
  //    The abort handler set thread to "waiting" when the stream died. Now that the task
  //    has completed (and TASK_COMPLETED WS was just emitted above), the UI can unlock.
  if (callbackMode === CallbackMode.END_LOOP && threadId) {
    try {
      await db
        .update(chatThreads)
        .set({ streamingState: "idle", updatedAt: new Date() })
        .where(eq(chatThreads.id, threadId));

      createMessagesEmitter(
        threadId,
        null,
        logger,
        ownerUser,
      )("streaming-state-changed", { streamingState: "idle" });

      logger.info(
        "[TaskCompletion] endLoop - cleared thread from waiting to idle",
        { threadId, taskId },
      );
    } catch (clearErr) {
      logger.warn("[TaskCompletion] Failed to clear endLoop thread state", {
        threadId,
        error: clearErr instanceof Error ? clearErr.message : String(clearErr),
      });
    }
  }

  // 3. Schedule a resume-stream one-shot cron task for wakeUp or wait modes.
  //    When directResumeUser/directResumeLocale are provided (local flows), fire
  //    resume-stream directly instead of waiting for the cron pulse.
  //    resume-stream checks isStreaming:
  //      isStreaming=true  → emit TOOL_RESULT WS, live loop picks up result naturally
  //      isStreaming=false → insert deferred msg pair + fire headless revival stream
  if (
    (callbackMode === CallbackMode.WAKE_UP ||
      callbackMode === CallbackMode.WAIT) &&
    threadId
  ) {
    try {
      const resumeTaskId = `resume-stream-${taskId}-${Date.now()}`;

      // Build resume-stream input from typed columns only - never from raw taskInput JSON.
      const { resumeStreamRequestSchema } =
        await import("@/app/api/[locale]/agent/ai-stream/resume-stream/definition");
      const resumeInput = resumeStreamRequestSchema.parse({
        threadId,
        callbackMode,
        // Revival routing - from typed wakeUp* columns on the cron task row.
        ...(modelId ? { modelId } : {}),
        ...(skillId ? { skillId } : {}),
        ...(favoriteId ? { favoriteId } : {}),
        // Pass the tool message ID so resume-stream can find the original tool call metadata.
        ...(toolMessageId ? { wakeUpToolMessageId: toolMessageId } : {}),
        // Branch leaf from typed column - resume-stream appends to the correct branch.
        ...(leafMessageId ? { leafMessageId } : {}),
        // wakeUp: pass the task result so resume-stream can create the deferred TOOL message
        // without touching the original. Stored as object in taskInput JSONB.
        // For failures with no output, synthesize a minimal failure result so the deferred
        // message has real data and the revival AI can confirm the failure.
        ...(callbackMode === CallbackMode.WAKE_UP
          ? {
              wakeUpStatus: toolStatus,
              wakeUpResult:
                output !== undefined &&
                output !== null &&
                typeof output === "object" &&
                !Array.isArray(output)
                  ? output
                  : toolStatus === "failed"
                    ? { success: false, status: "failed" }
                    : undefined,
            }
          : {}),
        // Cleanup: pass both task IDs so resume-stream can delete them after revival.
        wakeUpTaskId: taskId,
        resumeTaskId,
      });

      logger.debug("[TaskCompletion] Scheduling resume-stream task", {
        threadId,
        toolMessageId,
        taskId,
        callbackMode,
        resumeTaskId,
      });

      await db.insert(cronTasks).values({
        id: resumeTaskId,
        shortId: resumeTaskId,
        routeId: RESUME_STREAM_ALIAS,
        displayName: `Resume stream for ${taskId}`,
        category: TaskCategory.SYSTEM,
        schedule: "* * * * *",
        priority: CronTaskPriority.HIGH,
        enabled: true,
        runOnce: true,
        taskInput: JSON.parse(JSON.stringify(resumeInput)) as Record<
          string,
          WidgetData
        >,
        outputMode: TaskOutputMode.STORE_ONLY,
        notificationTargets: [],
        tags: [RESUME_STREAM_ALIAS, taskId],
        hidden: true,
        userId: ownerUser.id,
        // Pin to the instance that owns the thread so the cron pulse only
        // picks it up on the correct machine. Null = any instance (local flows
        // where directResumeUser is provided and direct fire handles revival).
        ...(selfInstanceId ? { targetInstance: selfInstanceId } : {}),
      });

      logger.debug("[TaskCompletion] resume-stream task scheduled", {
        resumeTaskId,
        threadId,
        taskId,
      });

      // Direct fire: when user + locale are available (local flows), fire resume-stream
      // immediately instead of waiting for the cron pulse. The cron task above serves
      // as a safety net - resume-stream's atomic isStreaming claim prevents double-firing.
      // Use the task owner's user (built from task.userId) so the revival headless stream
      // runs with the correct leadId for credit validation - not the complete-task caller's identity.
      if (directResumeLocale) {
        const { t } = aiStreamScopedTranslation.scopedT(directResumeLocale);
        // Always use ownerUser for the revival stream — correct credit validation.
        // Await so callers that await handleTaskCompletion (e.g. pulse) get a fully
        // resolved revival. The cron task above is a safety net if this throws.
        const { ResumeStreamRepository } =
          await import("@/app/api/[locale]/agent/ai-stream/resume-stream/repository");
        await ResumeStreamRepository.resume(
          resumeInput,
          ownerUser,
          directResumeLocale,
          logger,
          t,
          abortSignal,
          subAgentDepth,
        ).catch((fireErr) => {
          logger.warn(
            "[TaskCompletion] Direct resume-stream fire failed (cron fallback active)",
            {
              resumeTaskId,
              error:
                fireErr instanceof Error ? fireErr.message : String(fireErr),
            },
          );
        });
        logger.debug("[TaskCompletion] Fired resume-stream directly", {
          resumeTaskId,
          threadId,
        });
      }
    } catch (err) {
      logger.error("[TaskCompletion] Failed to schedule resume-stream task", {
        threadId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
