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

import type { JSONValue } from "ai";
import { eq } from "drizzle-orm";

import { resumeStreamRequestSchema } from "@/app/api/[locale]/agent/ai-stream/resume-stream/definition";
import { ResumeStreamRepository } from "@/app/api/[locale]/agent/ai-stream/resume-stream/repository";
import { scopedTranslation as aiStreamScopedTranslation } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import type {
  ToolCall,
  ToolCallResult,
} from "@/app/api/[locale]/agent/chat/db";
import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { buildMessagesChannel } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/channel";
import { createStreamEvent } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/events";
import { db } from "@/app/api/[locale]/system/db";
import {
  CallbackMode,
  type CallbackModeValue,
} from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { publishWsEvent } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { cronTasks } from "./cron/db";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "./enum";
import type { JsonValue } from "./unified-runner/types";

/**
 * Recursively sort object keys for stable serialization (cache-friendly).
 * Matches the sortObjectKeys used in ToolResultHandler so the AI SDK sees
 * identical bytes whether the result came from a live tool call or /report.
 */
function sortObjectKeys(obj: JSONValue): JSONValue {
  if (obj === null) {
    return obj;
  }
  if (typeof obj === "string") {
    if (
      (obj.startsWith("{") && obj.endsWith("}")) ||
      (obj.startsWith("[") && obj.endsWith("]"))
    ) {
      try {
        const parsed = JSON.parse(obj) as JSONValue;
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
  const sorted: Record<string, JSONValue> = {};
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
  output: ToolCallResult | null;
  taskId: string;
  /** Revival routing - typed columns from the cron task row */
  modelId?: string | null;
  skillId?: string | null;
  favoriteId?: string | null;
  /** Branch leaf message ID at tool-call time - typed column wakeUpLeafMessageId */
  leafMessageId?: string | null;
  /** userId of the task owner - resume-stream cron task must run as this user */
  userId: string;
  logger: EndpointLogger;
  /**
   * When provided, fire resume-stream directly (fire-and-forget) instead of waiting
   * for the cron pulse. Always provided for local wakeUp/wait flows. Falls back to
   * the cron task as a safety net (no-op if already claimed by direct fire).
   */
  directResumeUser?: JwtPayloadType;
  directResumeLocale?: CountryLanguage;
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
    userId,
    logger,
    directResumeUser,
    directResumeLocale,
  } = params;

  const toolStatus =
    status === CronTaskStatus.COMPLETED
      ? "completed"
      : status === CronTaskStatus.CANCELLED
        ? "failed"
        : "failed";

  // Holds the deferred result message inserted for endLoop mode.
  // Populated in step 1, consumed in step 2 (TASK_COMPLETED WS event).
  let deferredMessageForEvent:
    | {
        id: string;
        threadId: string;
        parentId: string | null;
        sequenceId: string | null;
        toolCall: ToolCall;
      }
    | undefined;

  // 1. Backfill result into the originating tool call message (cache-stable).
  //    For endLoop: also insert a deferred second message so the result
  //    is visible even if the original was compacted. The deferred message carries
  //    a new unique toolCallId and copies args from the original.
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
            ? (sortObjectKeys(
                JSON.parse(JSON.stringify(output)) as JSONValue,
              ) as ToolCallResult)
            : undefined;

        // wakeUp: do NOT touch the original tool message at all. The original stays
        // exactly as the AI saw it ({taskId, hint, status: pending}). The real result
        // is inserted as a completely separate deferred TOOL message by resume-stream.
        if (callbackMode !== CallbackMode.WAKE_UP) {
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
                    }
                  : undefined,
              },
              updatedAt: new Date(),
            })
            .where(eq(chatMessages.id, toolMessageId));

          logger.info("[TaskCompletion] Backfilled tool message with result", {
            toolMessageId,
            toolStatus,
            taskId,
          });
        } else {
          logger.info(
            "[TaskCompletion] wakeUp - original untouched, deferred handled by resume-stream",
            { toolMessageId, taskId },
          );
        }

        // For endLoop: insert a deferred result message so the result is visible
        // in UI and AI context even if the original is later compacted.
        // wakeUp: deferred insertion is handled by resume-stream (after stream dies).
        // detach: never injects into the thread - result is only in task history.
        // Uses a new unique toolCallId; originalToolCallId links back to the original.
        const effectiveThreadId = threadId ?? existing.threadId;
        if (
          callbackMode === CallbackMode.END_LOOP &&
          effectiveThreadId &&
          toolCall
        ) {
          const deferredToolCallId = `deferred_${toolCall.toolCallId}_${Date.now()}`;
          const deferredId = crypto.randomUUID();
          const deferredStatus =
            toolStatus === "completed"
              ? ("completed" as const)
              : ("failed" as const);
          const deferredToolCall: ToolCall = {
            ...toolCall,
            toolCallId: deferredToolCallId,
            result: stableResult,
            status: deferredStatus,
            originalToolCallId: toolCall.toolCallId,
            isDeferred: true,
          };
          await db.insert(chatMessages).values({
            id: deferredId,
            threadId: effectiveThreadId,
            role: ChatMessageRole.TOOL,
            content: null,
            parentId: toolMessageId,
            authorId: existing.authorId,
            sequenceId: null,
            isAI: true,
            model: null,
            skill: null,
            metadata: {
              toolCall: deferredToolCall,
            },
          });

          deferredMessageForEvent = {
            id: deferredId,
            threadId: effectiveThreadId,
            parentId: toolMessageId,
            sequenceId: null,
            toolCall: deferredToolCall,
          };

          logger.info("[TaskCompletion] Inserted deferred result message", {
            toolMessageId,
            deferredToolCallId,
            originalToolCallId: toolCall.toolCallId,
            callbackMode,
          });
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
    publishWsEvent(
      {
        channel: buildMessagesChannel(threadId),
        event: "task-completed",
        data: createStreamEvent.taskCompleted({
          threadId,
          taskId,
          status: toolStatus,
          lastMessageId: toolMessageId || null,
          deferredMessage: deferredMessageForEvent,
        }).data,
      },
      logger,
    );

    logger.info("[TaskCompletion] Emitted TASK_COMPLETED WS event", {
      threadId,
      taskId,
      toolMessageId,
    });
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

      publishWsEvent(
        {
          channel: buildMessagesChannel(threadId),
          event: "streaming-state-changed",
          data: createStreamEvent.streamingStateChanged({
            threadId,
            state: "idle",
          }).data,
        },
        logger,
      );

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
        // Only pass wakeUpResult when output is a non-null object (z.record schema rejects null).
        ...(callbackMode === CallbackMode.WAKE_UP &&
        output !== undefined &&
        output !== null &&
        typeof output === "object" &&
        !Array.isArray(output)
          ? {
              wakeUpResult: output as Record<string, ToolCallResult>,
              wakeUpStatus: toolStatus,
            }
          : callbackMode === CallbackMode.WAKE_UP
            ? { wakeUpStatus: toolStatus }
            : {}),
        // Cleanup: pass both task IDs so resume-stream can delete them after revival.
        wakeUpTaskId: taskId,
        resumeTaskId,
      });

      logger.info("[TaskCompletion] Scheduling resume-stream task", {
        threadId,
        toolMessageId,
        taskId,
        callbackMode,
        resumeTaskId,
      });

      await db.insert(cronTasks).values({
        id: resumeTaskId,
        shortId: resumeTaskId,
        routeId: "resume-stream",
        displayName: `Resume stream for ${taskId}`,
        category: TaskCategory.SYSTEM,
        schedule: "* * * * *",
        priority: CronTaskPriority.HIGH,
        enabled: true,
        runOnce: true,
        taskInput: JSON.parse(JSON.stringify(resumeInput)) as Record<
          string,
          JsonValue
        >,
        outputMode: TaskOutputMode.STORE_ONLY,
        notificationTargets: [],
        tags: ["resume-stream", taskId],
        userId,
      });

      logger.info("[TaskCompletion] resume-stream task scheduled", {
        resumeTaskId,
        threadId,
        taskId,
      });

      // Direct fire: when user + locale are available (local flows), fire resume-stream
      // immediately instead of waiting for the cron pulse. The cron task above serves
      // as a safety net - resume-stream's atomic isStreaming claim prevents double-firing.
      if (directResumeUser && directResumeLocale) {
        const { t } = aiStreamScopedTranslation.scopedT(directResumeLocale);
        void ResumeStreamRepository.resume(
          resumeInput,
          directResumeUser,
          directResumeLocale,
          logger,
          t,
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
        logger.info("[TaskCompletion] Fired resume-stream directly", {
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
