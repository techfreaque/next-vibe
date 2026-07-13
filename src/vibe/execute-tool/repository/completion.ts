/**
 * Task completion — backfill/emit/revival policy, wakeUp-confirm race,
 * escalation task row, stream-model resolution.
 *
 * TaskCompletion.handle is called after any tool task finishes (local
 * goroutine, remote HTTP/WS, self-escalated tool, or complete-task endpoint):
 * 1. Backfill result into the originating tool call message in DB (cache-stable
 *    via sortObjectKeys)
 * 2. Emit TASK_COMPLETED WS event (UI notification only)
 * 3. For callbackMode=wakeUp or wait: always schedule a resume-stream one-shot
 *    cron task. resume-stream checks isStreaming:
 *      true  → result already in DB from step 1; live loop picks it up naturally
 *      false → runs runHeadlessAiStream(threadMode:"append") to continue the thread
 */

import "server-only";

import { and, eq, gt, ne, sql } from "drizzle-orm";
import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import type { ToolCall } from "next-vibe/agent/chat/db";
import { chatMessages, chatThreads } from "next-vibe/agent/chat/db";
import {
  ChatMessageRole,
  ThreadStreamingState,
} from "next-vibe/agent/chat/enum";
import { createMessagesEmitter } from "next-vibe/agent/chat/threads/[threadId]/messages/emitter";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import {
  endpoints as revivalEndpoints,
  REVIVAL_ALIAS as RESUME_STREAM_ALIAS,
} from "next-vibe/execute-tool/revival/definition";
import { scopedTranslation as revivalScopedTranslation } from "next-vibe/execute-tool/revival/i18n";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { cronTasks, dbUserIdToOwner } from "next-vibe/tasks/cron/db";
import { createTaskEmitters } from "next-vibe/tasks/cron/emitter";
import { CronTasksRepository } from "next-vibe/tasks/cron/repository";
import { resolveTaskOwnerUser } from "next-vibe/tasks/cron/resolve-task-user";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "next-vibe/tasks/enum";

import { CallbackMode, type CallbackModeValue } from "../constants";
import type { WakeUpConfirmRaceResult } from "./types";

export class TaskCompletion {
  /**
   * Serialize a handler's fail() response into the stored task output,
   * preserving the EXACT ErrorResponseType shape ({ success:false, message,
   * messageParams?, errorType, cause? }). The dispatch tool message backfill,
   * the execution-history row, the wakeUp deferred result and the relay wire
   * all read this object — nulling it surfaced failed tasks as a bare
   * { success:false, status:"failed" } with the real cause (e.g. an
   * insufficient-credits 403 from a media-gen sub-stream) lost.
   */
  static failedOutput(error: ErrorResponseType): Record<string, WidgetData> {
    return {
      success: false,
      message: error.message,
      ...(error.messageParams ? { messageParams: error.messageParams } : {}),
      errorType: {
        errorKey: error.errorType.errorKey,
        errorCode: error.errorType.errorCode,
      },
      ...(error.cause
        ? { cause: TaskCompletion.failedOutput(error.cause) }
        : {}),
    };
  }

  /**
   * Same ErrorResponseType shape for failures that never produced a fail()
   * response (thrown exception, goroutine timeout) — the raw message with an
   * internal-error type, so consumers see one uniform failed-output contract.
   */
  static failedOutputFromMessage(
    errorMessage: string,
    errorType: ErrorResponseType["errorType"] = ErrorResponseTypes.INTERNAL_ERROR,
  ): Record<string, WidgetData> {
    return {
      success: false,
      message: errorMessage,
      errorType: {
        errorKey: errorType.errorKey,
        errorCode: errorType.errorCode,
      },
    };
  }

  static async handle(params: {
    /** Typed revival context - read from cron_tasks wakeUp* columns (not from taskInput JSON) */
    toolMessageId: string;
    threadId: string | null;
    callbackMode: CallbackModeValue | null;
    status: string;
    output: WidgetData | null;
    taskId: string;
    /** Revival routing - typed columns from the cron task row */
    modelId?: ChatModelId | null;
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

    // `status` reaches this method in TWO shapes depending on the caller:
    //   • the CronTaskStatus enum value ("status.completed") — cron/task paths
    //   • the raw wire literal ("completed") — reviveFromToolMessage, which
    //     forwards the tool-execute-result event's { status: "completed" }.
    // Treat BOTH success spellings as success; anything else is a failure.
    // (Missing this equated a successful direct-http wakeUp result with "failed"
    // — the deferred tool message rendered a red Error badge despite a valid
    // result payload.)
    const toolStatus =
      status === CronTaskStatus.COMPLETED || status === "completed"
        ? "completed"
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
              ? TaskCompletion.sortObjectKeys(
                  JSON.parse(JSON.stringify(output)) as WidgetData,
                )
              : undefined;

          // DETACH: fire-and-forget — NEVER backfills the dispatch tool message.
          // The result lives only in task execution history; await-task retrieves
          // it (and cleans the task up). wakeUp: resume-stream owns the backfill
          // (sequenceId check). All other modes (wait, endLoop, approve) backfill
          // the original tool message here — it is their canonical result store.
          // (When await-task registers a waiter it upgrades the mode to WAIT, so
          // the awaited detach DOES backfill via that path.)
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
                        // The task that produced this result stays discoverable
                        // after the dispatch placeholder is replaced.
                        remoteTaskId: taskId,
                      }
                    : undefined,
                },
                updatedAt: new Date(),
              })
              .where(eq(chatMessages.id, toolMessageId));

            logger.debug(
              "[TaskCompletion] Backfilled tool message with result",
              {
                toolMessageId,
                toolStatus,
                taskId,
              },
            );

            // Mirror the backfill to peers when this thread is a REMOTE-folder
            // mirror. The live relay stream has already closed by the time a
            // detach/endLoop task completes, so the only way the result reaches
            // the caller's mirror is the sync channel (push-pull on connect +
            // live event push). pushThreadSync no-ops for non-mirrored threads.
            if (existing.threadId) {
              const { pushThreadSync } =
                await import("next-vibe/agent/chat/threads/sync-provider");
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

    // Fetch rootFolderId once for all WS emits that need it.
    const [threadRow] = threadId
      ? await db
          .select({ rootFolderId: chatThreads.rootFolderId })
          .from(chatThreads)
          .where(eq(chatThreads.id, threadId))
          .limit(1)
      : [];

    // 2. Emit TASK_COMPLETED WS event (UI notification only)
    if (threadId && threadRow) {
      createMessagesEmitter(logger, ownerUser, {
        threadId,
        rootFolderId: threadRow.rootFolderId,
      })("task-completed", {
        responseData: { backgroundTasks: [{ id: taskId }] },
      });

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
      emitTaskList("task-updated", { responseData: taskPayload });
      emitTaskQueue("task-updated", { responseData: taskPayload });
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
          await import("next-vibe/agent/ai-stream/repository/core/stream");

        // Skip if the parent stream is still active: a fast-completing detach
        // goroutine must not set the thread idle while the AI is still in its
        // tool-call loop (e.g. about to call await-task). Check via DB since
        // StreamRegistry may be a different module instance in the same process.
        const [currentThread] = await db
          .select({
            streamingState: chatThreads.streamingState,
            rootFolderId: chatThreads.rootFolderId,
          })
          .from(chatThreads)
          .where(eq(chatThreads.id, threadId))
          .limit(1);
        if (currentThread?.streamingState === ThreadStreamingState.STREAMING) {
          logger.warn(
            "[TaskCompletion] no-revival completion - stream still active, skipping clearStreamingState",
            { threadId, taskId, callbackMode },
          );
        } else if (currentThread) {
          const cleared = await clearStreamingState(
            threadId,
            logger,
            ownerUser,
            undefined,
          );
          createMessagesEmitter(logger, ownerUser, {
            threadId,
            rootFolderId: currentThread.rootFolderId,
          })("streaming-state-changed", {
            responseData: { streamingState: cleared.state },
          });
          // Also update the thread LIST so sidebar badges reflect the new state.
          const { createThreadsGetEmitter } =
            await import("next-vibe/agent/chat/threads/emitter");
          createThreadsGetEmitter(logger, ownerUser, {
            rootFolderId: currentThread.rootFolderId,
            subFolderId: null,
          })("streaming-state-changed", {
            responseData: {
              threads: [{ id: threadId, streamingState: cleared.state }],
            },
          });
          logger.debug(
            "[TaskCompletion] no-revival completion - thread state reconciled",
            { threadId, taskId, callbackMode, state: cleared.state },
          );
        }
      } catch (clearErr) {
        logger.warn("[TaskCompletion] Failed to reconcile thread state", {
          threadId,
          error:
            clearErr instanceof Error ? clearErr.message : String(clearErr),
        });
      }
    }

    // 3. Schedule a resume-stream one-shot cron task for wakeUp or wait modes.
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
        const nonNullThreadId = threadId;

        logger.debug("[TaskCompletion] Scheduling resume-stream task", {
          threadId,
          toolMessageId,
          taskId,
          callbackMode,
          resumeTaskId,
        });

        const wakeUpResult: Record<string, WidgetData> | undefined =
          callbackMode === CallbackMode.WAKE_UP
            ? output !== undefined &&
              output !== null &&
              typeof output === "object" &&
              !Array.isArray(output) &&
              !(output instanceof Date)
              ? output
              : toolStatus === "failed"
                ? { success: false, status: "failed" }
                : undefined
            : undefined;

        const resumeInput = await CronTasksRepository.insertTyped(
          revivalEndpoints.POST,
          {
            id: resumeTaskId,
            shortId: resumeTaskId,
            routeId: RESUME_STREAM_ALIAS,
            displayName: `Resume stream for ${taskId}`,
            category: TaskCategory.SYSTEM,
            schedule: "* * * * *",
            priority: CronTaskPriority.HIGH,
            enabled: true,
            runOnce: true,
            taskInput: {
              threadId: nonNullThreadId,
              callbackMode: callbackMode ?? undefined,
              ...(modelId ? { modelId } : {}),
              ...(skillId ? { skillId } : {}),
              ...(favoriteId ? { favoriteId } : {}),
              ...(toolMessageId ? { wakeUpToolMessageId: toolMessageId } : {}),
              ...(leafMessageId ? { leafMessageId } : {}),
              subAgentDepth,
              ...(callbackMode === CallbackMode.WAKE_UP
                ? { wakeUpStatus: toolStatus, wakeUpResult }
                : {}),
              wakeUpTaskId: taskId,
              resumeTaskId,
            },
            outputMode: TaskOutputMode.STORE_ONLY,
            notificationTargets: [],
            tags: [RESUME_STREAM_ALIAS, taskId],
            hidden: true,
            userId: ownerUser.id,
            ...(selfInstanceId ? { targetInstance: selfInstanceId } : {}),
          },
        );

        logger.debug("[TaskCompletion] resume-stream task scheduled", {
          resumeTaskId,
          threadId,
          taskId,
        });

        // Direct fire: when directResumeLocale is provided (local flows), fire
        // resume-stream immediately instead of waiting for the cron pulse. The cron
        // task above serves as a safety net - resume-stream's atomic isStreaming
        // claim prevents double-firing. Use the task owner's user (built from
        // task.userId) so the revival headless stream runs with the correct leadId
        // for credit validation - not the complete-task caller's identity.
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
            const { t } = revivalScopedTranslation.scopedT(directResumeLocale);
            // Always use ownerUser for the revival stream - correct credit validation.
            // Await so callers that await TaskCompletion.handle (e.g. pulse) get a
            // fully resolved revival.
            const { RevivalRepository } =
              await import("next-vibe/execute-tool/revival/repository");
            await RevivalRepository.resume(
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
                    fireErr instanceof Error
                      ? fireErr.message
                      : String(fireErr),
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

  /**
   * wakeUp confirmation race detection.
   *
   * When a tool with callbackMode=wakeUp also requiresConfirmation, confirmation
   * may arrive before OR after the background goroutine finishes. This lives
   * here because it queries cronTasks — execute-tool's internal state.
   *
   * Case A — wakeUp completed BEFORE confirm: a newer sequence already exists
   * in the thread (the revival AI turn wrote it). The confirm handler should
   * insert a deferred message as a leaf child.
   *
   * Case B — confirm fires BEFORE wakeUp completes (goroutine still running):
   * no newer sequence yet. DO NOT set isDeferred — that would race with
   * resume-stream's idempotency check and cause it to skip the revival. Clear
   * waitingForConfirmation on the tool message, backfill wakeUpToolMessageId
   * on the task row, then return wakeUpPending=true so the confirm flow defers
   * to resume-stream for the actual revival.
   *
   * Only call this when isWakeUpConfirm is true, the execution returned
   * { status: "pending", taskId }, and isIncognito is false.
   */
  static async detectWakeUpConfirmRace(params: {
    toolMessage: {
      id: string;
      threadId: string;
      parentId: string | null;
      model: ChatModelId | null;
      skill: string | null;
      sequenceId: string | null;
      createdAt: Date;
      metadata: { toolCall?: ToolCall } | null;
    };
    toolCall: ToolCall;
    toolMessageId: string;
    pendingTaskId: string | undefined;
    user: JwtPayloadType;
    logger: EndpointLogger;
  }): Promise<WakeUpConfirmRaceResult> {
    const {
      toolMessage,
      toolCall,
      toolMessageId,
      pendingTaskId,
      user,
      logger,
    } = params;

    // Check whether the wakeUp result already landed (newer sequence present).
    // Exclude error messages — they belong to prior sequences and should not be
    // counted as evidence that a new sequence has started.
    const newerSequenceMessage = toolMessage.sequenceId
      ? await db
          .select({ id: chatMessages.id })
          .from(chatMessages)
          .where(
            and(
              eq(chatMessages.threadId, toolMessage.threadId),
              gt(chatMessages.createdAt, toolMessage.createdAt),
              ne(chatMessages.sequenceId, toolMessage.sequenceId),
              ne(chatMessages.role, ChatMessageRole.ERROR),
            ),
          )
          .limit(1)
      : [];

    if (newerSequenceMessage.length > 0) {
      // Case A: wakeUp already completed — fall through to deferred insertion.
      logger.debug(
        "[wakeup-confirm] Case A — wakeUp already landed, inserting confirm deferred after revival",
        { toolMessageId },
      );
      return { kind: "case-a" };
    }

    // Case B: goroutine still running.
    // Clear waitingForConfirmation so the UI badge switches to "Running - result
    // will wake up AI" instead of the stale "Pending Confirmation".
    const clearedToolCall: ToolCall = {
      ...toolCall,
      waitingForConfirmation: false,
      isConfirmed: true,
    };
    // Preserve sibling metadata keys - only replace the toolCall object.
    await db
      .update(chatMessages)
      .set({
        metadata: { ...toolMessage.metadata, toolCall: clearedToolCall },
        updatedAt: new Date(),
      })
      .where(eq(chatMessages.id, toolMessageId));

    // Re-emit message-created so the client refreshes the bubble badge immediately.
    const [threadRow] = await db
      .select({ rootFolderId: chatThreads.rootFolderId })
      .from(chatThreads)
      .where(eq(chatThreads.id, toolMessage.threadId))
      .limit(1);
    if (!threadRow) {
      return { kind: "case-b", wakeUpPending: true };
    }
    const emitter = createMessagesEmitter(logger, user, {
      threadId: toolMessage.threadId,
      rootFolderId: threadRow.rootFolderId,
    });
    emitter("message-created", {
      responseData: {
        messages: [
          {
            id: toolMessageId,
            threadId: toolMessage.threadId,
            role: ChatMessageRole.TOOL,
            parentId: toolMessage.parentId ?? null,
            content: null,
            model: toolMessage.model,
            skill: toolMessage.skill,
            sequenceId: toolMessage.sequenceId ?? null,
            metadata: { toolCall: clearedToolCall },
            createdAt: new Date(),
            updatedAt: new Date(),
            isAI: true,
            authorId: null,
            authorName: null,
            errorType: null,
            errorCode: null,
            errorMessage: null,
            upvotes: 0,
            downvotes: 0,
          },
        ],
        streamingState: ThreadStreamingState.STREAMING,
      },
    });

    // Backfill wakeUpToolMessageId into the parked resume-stream task's taskInput jsonb.
    if (pendingTaskId) {
      const parkedId = `resume-stream-parked-${pendingTaskId}`;
      try {
        await db
          .update(cronTasks)
          .set({
            taskInput: sql`${cronTasks.taskInput} || ${JSON.stringify({ wakeUpToolMessageId: toolMessageId })}::jsonb`,
            updatedAt: new Date(),
          })
          .where(eq(cronTasks.id, parkedId));
      } catch (updateErr) {
        logger.warn(
          "[wakeup-confirm] Failed to backfill wakeUpToolMessageId (non-fatal)",
          {
            pendingTaskId,
            parkedId,
            toolMessageId,
            error:
              updateErr instanceof Error
                ? updateErr.message
                : String(updateErr),
          },
        );
      }
    }

    logger.debug(
      "[wakeup-confirm] Case B — goroutine running, resume-stream handles revival",
      { toolMessageId, pendingTaskId },
    );
    return { kind: "case-b", wakeUpPending: true };
  }

  /**
   * Creates a cronTask row for self-escalating tools (SSH, coding agent, etc.)
   * that discover during execution they need more time than the stream timeout.
   *
   * This is intentionally NOT an execute-tool DETACH/WAKE_UP goroutine — it is
   * a revival-context carrier for a tool already running in its own goroutine.
   * The task row lives only long enough for TaskCompletion.handle to read the
   * wakeUp context and schedule resume-stream.
   *
   * Stream-state wiring (waitingForRemoteResult, pendingTimeoutMs, WS events,
   * cancel handler) remains in ai-stream/repository/core/escalation-handler.ts.
   */
  static async createEscalationTask(
    opts: {
      callbackMode: CallbackModeValue;
      displayName?: string;
      threadId: string;
      toolMessageId: string | null;
      leafMessageId: string | null;
      modelId: ChatModelId | null;
      skillId: string | null;
      favoriteId: string | null;
      subAgentDepth: number;
      userId: string;
    },
    logger: EndpointLogger,
  ): Promise<string> {
    const taskId = `escalated-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    await db.insert(cronTasks).values({
      id: taskId,
      shortId: taskId,
      routeId: "escalated-tool",
      displayName: opts.displayName ?? `Escalated: ${taskId}`,
      category: TaskCategory.SYSTEM,
      schedule: "* * * * *",
      priority: CronTaskPriority.HIGH,
      enabled: false,
      runOnce: true,
      lastExecutionStatus: CronTaskStatus.RUNNING,
      taskInput: {},
      outputMode: TaskOutputMode.STORE_ONLY,
      notificationTargets: [],
      tags: ["escalated", "local"],
      userId: opts.userId,
    });

    // Park the revival context as a typed resume-stream task (no wakeUp columns on the task row).
    await TaskCompletion.parkResumeStreamTask({
      taskId,
      callbackMode: opts.callbackMode,
      threadId: opts.threadId,
      toolMessageId: opts.toolMessageId,
      leafMessageId: opts.leafMessageId,
      modelId: opts.modelId,
      skillId: opts.skillId,
      favoriteId: opts.favoriteId,
      subAgentDepth: opts.subAgentDepth,
      ownerUserId: opts.userId,
      selfInstanceId: null,
      logger,
    });

    return taskId;
  }

  /**
   * Pre-create a disabled resume-stream task with the full revival context in
   * its taskInput (typed to resume-stream's schema). Called by await-task when
   * parking a thread. Callers enable it via enableAndFireParkedResumeTask.
   */
  static async parkResumeStreamTask(opts: {
    taskId: string;
    callbackMode: CallbackModeValue;
    threadId: string;
    toolMessageId: string | null;
    leafMessageId: string | null;
    modelId: ChatModelId | null;
    skillId: string | null;
    favoriteId: string | null;
    subAgentDepth: number;
    ownerUserId: string | null;
    selfInstanceId: string | null;
    logger: EndpointLogger;
  }): Promise<string> {
    const {
      taskId,
      callbackMode,
      threadId,
      toolMessageId,
      leafMessageId,
      modelId,
      skillId,
      favoriteId,
      subAgentDepth,
      ownerUserId,
      selfInstanceId,
      logger,
    } = opts;

    const resumeTaskId = `resume-stream-parked-${taskId}`;

    await CronTasksRepository.insertTypedOrIgnore(revivalEndpoints.POST, {
      id: resumeTaskId,
      shortId: resumeTaskId,
      routeId: RESUME_STREAM_ALIAS,
      displayName: `Parked revival for ${taskId}`,
      category: TaskCategory.SYSTEM,
      schedule: "* * * * *",
      priority: CronTaskPriority.HIGH,
      enabled: false,
      runOnce: true,
      taskInput: {
        threadId,
        callbackMode,
        ...(modelId ? { modelId } : {}),
        ...(skillId ? { skillId } : {}),
        ...(favoriteId ? { favoriteId } : {}),
        ...(toolMessageId ? { wakeUpToolMessageId: toolMessageId } : {}),
        ...(leafMessageId ? { leafMessageId } : {}),
        subAgentDepth,
        wakeUpTaskId: taskId,
        resumeTaskId,
      },
      outputMode: TaskOutputMode.STORE_ONLY,
      notificationTargets: [],
      tags: [RESUME_STREAM_ALIAS, taskId],
      hidden: true,
      userId: ownerUserId,
      ...(selfInstanceId ? { targetInstance: selfInstanceId } : {}),
    });

    logger.debug("[TaskCompletion] Parked disabled resume-stream task", {
      resumeTaskId,
      taskId,
      threadId,
      toolMessageId,
    });

    return resumeTaskId;
  }

  /**
   * Merge wakeUpStatus/wakeUpResult into the parked task's taskInput, enable
   * it, then direct-fire via RevivalRepository.resume (same atomic claim+fire
   * as handle()'s directResumeLocale path). Falls back to the cron pulse if
   * direct-fire fails. No-op if no parked task exists (detach/inline WAIT).
   */
  static async enableAndFireParkedResumeTask(params: {
    taskId: string;
    status: "completed" | "failed";
    output: Record<string, WidgetData> | null;
    locale: CountryLanguage;
    logger: EndpointLogger;
    abortSignal: AbortSignal;
  }): Promise<boolean> {
    const { taskId, status, output, locale, logger, abortSignal } = params;
    const parkedId = `resume-stream-parked-${taskId}`;
    const wakeUpStatus = status === "completed" ? "completed" : "failed";
    const wakeUpResult: Record<string, WidgetData> | undefined =
      output !== null && output !== undefined ? output : undefined;

    const extraInput: Record<string, WidgetData> = { wakeUpStatus };
    if (wakeUpResult !== undefined) {
      extraInput["wakeUpResult"] = wakeUpResult;
    }
    const found = await CronTasksRepository.enableWithTaskInputMerge(
      parkedId,
      extraInput,
    );
    if (!found) {
      return false;
    }
    logger.debug(
      "[TaskCompletion] Enabled parked resume-stream task for fire",
      {
        parkedId,
        taskId,
        wakeUpStatus,
      },
    );

    // Read typed taskInput to fire directly.
    const parkedTask = await CronTasksRepository.findByIdTyped(
      revivalEndpoints.POST,
      parkedId,
    );
    if (!parkedTask) {
      return true; // enabled but claimed by concurrent pulse already
    }
    const ownerCtx = await resolveTaskOwnerUser(
      dbUserIdToOwner(parkedTask.userId),
      locale,
      logger,
    );
    if (!ownerCtx) {
      return true;
    }

    // Atomic claim — same as handle()'s direct-fire block.
    const claimedRows = await db
      .update(cronTasks)
      .set({ enabled: false, updatedAt: new Date() })
      .where(and(eq(cronTasks.id, parkedId), eq(cronTasks.enabled, true)))
      .returning({ id: cronTasks.id });

    if (claimedRows.length === 0) {
      logger.debug(
        "[TaskCompletion] parked resume-stream already claimed by pulse",
        { parkedId },
      );
      return true;
    }

    const { t } = revivalScopedTranslation.scopedT(locale);
    const { RevivalRepository } =
      await import("next-vibe/execute-tool/revival/repository");
    await RevivalRepository.resume(
      parkedTask.taskInput,
      ownerCtx.user,
      locale,
      logger,
      t,
      abortSignal,
      parkedTask.taskInput.subAgentDepth ?? 0,
    ).catch(async (fireErr) => {
      logger.warn(
        "[TaskCompletion] Direct parked-task fire failed - re-enabling for cron",
        {
          parkedId,
          error: fireErr instanceof Error ? fireErr.message : String(fireErr),
        },
      );
      await db
        .update(cronTasks)
        .set({ enabled: true, updatedAt: new Date() })
        .where(eq(cronTasks.id, parkedId));
    });

    return true;
  }

  /**
   * Resolve the chat model ID from the current stream context's
   * favorite/skill cascade — the model-only fast path shared by the
   * execute-tool orchestrator and await-task.
   *
   * INTENTIONALLY NOT delegated to the canonical `resolveModelSkill`. The two
   * differ in ways that would change the resolved model, so merging is not
   * behavior-preserving:
   *   - Favorite/skill cascade: this uses resolveSkillFavoriteContext (a single
   *     combined lookup) and cascades favorite.modelSelection →
   *     skill.modelSelection ALWAYS trying BOTH the streamContext favorite AND
   *     its skillId. resolveModelSkill instead, when a favoriteId is present,
   *     resolves the model from the favorite (with the favorite's OWN skill
   *     variant as fallback) and never consults the separately-supplied skillId.
   *   - Availability: this uses getEnvAvailability() (static env); resolveModelSkill
   *     uses getInstanceAvailability() (augmented with live remote-inference
   *     state). Same env can resolve to a different best model.
   *   - Shape: this returns model-only (the sole field every caller reads) with
   *     no locale/logger/t threading; resolveModelSkill returns the full
   *     model+skill+favoriteConfig triple and needs locale/logger/t.
   * Keeping this separate preserves the per-tool-call model-resolution behavior.
   */
  static async resolveStreamModelId(
    streamContext: ToolExecutionContext,
    user: JwtPayloadType,
  ): Promise<ChatModelId | null> {
    const userId = !user.isPublic ? user.id : undefined;
    const { resolveSkillFavoriteContext } =
      await import("next-vibe/agent/skills/resolver");
    const { resolveChatModelId } =
      await import("next-vibe/agent/ai-stream/repository/core/modality-resolver");

    const { favorite: fav, skill } = await resolveSkillFavoriteContext({
      favoriteId: streamContext.favoriteId,
      skillId: streamContext.skillId,
      userId,
    });
    return resolveChatModelId(
      fav?.modelSelection ?? undefined,
      skill?.modelSelection ?? undefined,
      user,
      getEnvAvailability(),
    );
  }

  /**
   * Recursively sort object keys for stable serialization (cache-friendly).
   * Matches the sortObjectKeys used in ToolResultHandler so the AI SDK sees
   * identical bytes whether the result came from a live tool call or /report.
   */
  private static sortObjectKeys(obj: WidgetData): WidgetData {
    if (obj === null || obj === undefined) {
      return obj;
    }
    if (typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => TaskCompletion.sortObjectKeys(item));
    }
    if (obj instanceof Date) {
      return obj;
    }
    const sorted: Record<string, WidgetData> = {};
    for (const key of Object.keys(obj).toSorted()) {
      const value = obj[key];
      if (value !== undefined) {
        sorted[key] = TaskCompletion.sortObjectKeys(value);
      }
    }
    return sorted;
  }
}
