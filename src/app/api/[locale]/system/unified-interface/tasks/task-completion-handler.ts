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

import {
  type ResumeStreamRequestInput,
  resumeStreamRequestSchema,
} from "@/app/api/[locale]/agent/ai-stream/resume-stream/definition";
import type {
  ToolCall,
  ToolCallResult,
} from "@/app/api/[locale]/agent/chat/db";
import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
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

import { cronTasks, taskInputSchema } from "./cron/db";
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
  toolMessageId: string;
  threadId: string | null;
  callbackMode: CallbackModeValue | null;
  status: string;
  output: ToolCallResult | null;
  taskId: string;
  /** taskInput from the originating cron task — carries modelId and characterId for resume-stream */
  taskInput?: Record<string, JsonValue> | null;
  /** userId of the task owner — resume-stream cron task must run as this user */
  userId: string;
  logger: EndpointLogger;
}): Promise<void> {
  const {
    toolMessageId,
    threadId,
    callbackMode,
    status,
    output,
    taskId,
    taskInput,
    userId,
    logger,
  } = params;

  const toolStatus =
    status === CronTaskStatus.COMPLETED
      ? "completed"
      : status === CronTaskStatus.CANCELLED
        ? "failed"
        : "failed";

  // Holds the deferred result message inserted for background/noLoop modes.
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
  //    For background/noLoop: also insert a deferred second message so the result
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
        // Apply sortObjectKeys to result for cache-stable serialization — same as ToolResultHandler
        const stableResult =
          output !== null && output !== undefined
            ? (sortObjectKeys(
                JSON.parse(JSON.stringify(output)) as JSONValue,
              ) as ToolCallResult)
            : undefined;

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

        // For endLoop: insert a deferred result message so the result is visible
        // in UI and AI context even if the original is later compacted.
        // detach never injects into the thread — result is only in task history.
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
            character: null,
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

  // 3. Schedule a resume-stream one-shot cron task for wakeUp or wait modes.
  //    resume-stream checks isStreaming and either no-ops (live loop picks up the
  //    backfilled result naturally) or runs a headless stream to continue the thread.
  if (
    (callbackMode === CallbackMode.WAKE_UP ||
      callbackMode === CallbackMode.WAIT) &&
    threadId
  ) {
    try {
      const resumeTaskId = `resume-stream-${taskId}-${Date.now()}`;

      // Parse resume-stream input via the route's own schema — types flow from definition.
      const resumeInput = resumeStreamRequestSchema.parse({
        ...(taskInput ?? {}),
        threadId,
        // For wakeUp: pass the tool message ID so resume-stream can inject
        // a deferred result message into the thread before headless append.
        ...(callbackMode === CallbackMode.WAKE_UP && toolMessageId
          ? { wakeUpToolMessageId: toolMessageId }
          : {}),
        // Cleanup: pass both task IDs so resume-stream can delete them after revival.
        wakeUpTaskId: taskId,
        resumeTaskId,
      } satisfies ResumeStreamRequestInput);

      logger.info("[TaskCompletion] Scheduling resume-stream task", {
        threadId,
        toolMessageId,
        taskId,
        callbackMode,
        resumeTaskId,
      });

      await db.insert(cronTasks).values({
        id: resumeTaskId,
        routeId: "resume-stream",
        displayName: `Resume stream for ${taskId}`,
        category: TaskCategory.SYSTEM,
        schedule: "* * * * *",
        priority: CronTaskPriority.HIGH,
        enabled: true,
        runOnce: true,
        taskInput: taskInputSchema.parse(resumeInput),
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
    } catch (err) {
      logger.error("[TaskCompletion] Failed to schedule resume-stream task", {
        threadId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
