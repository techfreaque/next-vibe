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

import { and, eq } from "drizzle-orm";

import { scopedTranslation as aiStreamScopedTranslation } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { createMessagesEmitter } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/emitter";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import {
  CallbackMode,
  type CallbackModeValue,
} from "@/app/api/[locale]/system/unified-interface/execute-tool/constants";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

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
  /** The resolved task owner - must come from resolveTaskOwnerUser(), never fabricated */
  ownerUser: JwtPrivatePayloadType;
  logger: EndpointLogger;
  /**
   * When provided, fire resume-stream directly instead of waiting for the cron pulse.
   * Always provided for local wakeUp/wait flows. Falls back to the cron task as a
   * safety net (no-op if already claimed by direct fire).
   * The ownerUser is always used as the identity - this is only the locale signal.
   */
  directResumeLocale?: CountryLanguage;
  /**
   * When provided, pin the resume-stream cron task to this instance via targetInstance.
   * Used by the /report endpoint so the task only runs on the instance that originated
   * the thread (Thea), not on Hermes which also polls the cron table.
   */
  selfInstanceId?: string | null;
  /** Abort signal from the originating route/task handler - propagated to revival headless stream */
  abortSignal: AbortSignal;
  /** Sub-agent nesting depth from the original stream - preserved across task completion/revival */
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
  //    The tool message is the canonical result store for every callback mode
  //    and every execution location. wakeUp defers the write to resume-stream
  //    (sequenceId check); all other modes backfill here.
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

        // wakeUp: resume-stream owns the backfill — it checks the leaf
        // sequenceId and either backfills the original tool message (same
        // sequence) or inserts a deferred TOOL message after the new leaf.
        // All other modes (wait, endLoop, detach, approve): backfill the
        // original tool message — it is the canonical result store for every
        // execution location.
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
                      isPartial: false,
                      // The task that produced this result stays discoverable
                      // after the dispatch placeholder is replaced.
                      remoteTaskId: taskId,
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

          // Mirror the backfill to peers when this thread is a REMOTE-folder
          // mirror. The live relay stream has already closed by the time a
          // detach/endLoop task completes, so the only way the result reaches
          // the caller's mirror is the sync channel (push-pull on connect +
          // live event push). pushThreadSync no-ops for non-mirrored threads.
          if (existing.threadId) {
            const { pushThreadSync } =
              await import("@/app/api/[locale]/agent/chat/threads/sync-provider");
            await pushThreadSync(existing.threadId, ownerUser.id, logger);
          }
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

  // 2b. No-revival modes (endLoop, detach): the task is done and no AI
  //    continuation follows — reconcile the thread state. A stream that died
  //    into 'waiting' on this task returns to 'idle' unless OTHER work is
  //    still pending (clearStreamingState re-evaluates tasks, scheduled
  //    revivals and in-flight remote calls).
  if (
    (callbackMode === CallbackMode.END_LOOP ||
      callbackMode === CallbackMode.DETACH) &&
    threadId
  ) {
    try {
      const { clearStreamingState } =
        await import("@/app/api/[locale]/agent/ai-stream/repository/core/stream-registry");
      const cleared = await clearStreamingState(threadId, logger, ownerUser);
      createMessagesEmitter(
        threadId,
        null,
        logger,
        ownerUser,
      )("streaming-state-changed", { streamingState: cleared.state });

      logger.debug(
        "[TaskCompletion] no-revival completion - thread state reconciled",
        { threadId, taskId, callbackMode, state: cleared.state },
      );
    } catch (clearErr) {
      logger.warn("[TaskCompletion] Failed to reconcile thread state", {
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
        // Claim the one-shot row before firing — the same enabled→false claim
        // the pulse uses — so exactly one of direct-fire / pulse executes this
        // revival, and stream-exit verdicts never count an in-flight revival
        // as still scheduled.
        const claimedRows = await db
          .update(cronTasks)
          .set({ enabled: false, updatedAt: new Date() })
          .where(
            and(eq(cronTasks.id, resumeTaskId), eq(cronTasks.enabled, true)),
          )
          .returning({ id: cronTasks.id });
        if (claimedRows.length > 0) {
          const { t } = aiStreamScopedTranslation.scopedT(directResumeLocale);
          // Always use ownerUser for the revival stream - correct credit validation.
          // Await so callers that await handleTaskCompletion (e.g. pulse) get a fully
          // resolved revival.
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
          ).catch(async (fireErr) => {
            logger.warn(
              "[TaskCompletion] Direct resume-stream fire failed - re-enabling row for cron fallback",
              {
                resumeTaskId,
                error:
                  fireErr instanceof Error ? fireErr.message : String(fireErr),
              },
            );
            // Hand the revival back to the pulse.
            await db
              .update(cronTasks)
              .set({ enabled: true, updatedAt: new Date() })
              .where(eq(cronTasks.id, resumeTaskId));
          });
          logger.debug("[TaskCompletion] Fired resume-stream directly", {
            resumeTaskId,
            threadId,
          });
        } else {
          logger.debug(
            "[TaskCompletion] resume-stream row already claimed - skipping direct fire",
            { resumeTaskId, threadId },
          );
        }
      }
    } catch (err) {
      logger.error("[TaskCompletion] Failed to schedule resume-stream task", {
        threadId,
        taskId,
        callbackMode,
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        detail: JSON.stringify(
          err,
          Object.getOwnPropertyNames(err instanceof Error ? err : {}),
        ),
      });
    }
  }
}
