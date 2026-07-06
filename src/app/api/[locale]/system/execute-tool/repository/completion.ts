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

import { and, eq, gt, ne } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { createTaskEmitters } from "next-vibe/tasks/cron/emitter";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "next-vibe/tasks/enum";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { RESUME_STREAM_ALIAS } from "@/app/api/[locale]/agent/ai-stream/resume-stream/constants";
import { scopedTranslation as aiStreamScopedTranslation } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import type { ToolCall } from "@/app/api/[locale]/agent/chat/db";
import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import {
  ChatMessageRole,
  ThreadStreamingState,
} from "@/app/api/[locale]/agent/chat/enum";
import { createMessagesEmitter } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/emitter";
import { getEnvAvailability } from "@/app/api/[locale]/agent/env-availability";

import { CallbackMode, type CallbackModeValue } from "../constants";
import type { PendingCallRevival, WakeUpConfirmRaceResult } from "./types";

export class TaskCompletion {
  static async handle(params: {
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
      status === CronTaskStatus.COMPLETED ? "completed" : "failed";

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
          await import("@/app/api/[locale]/agent/ai-stream/repository/core/stream");

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
          );
          createMessagesEmitter(logger, ownerUser, {
            threadId,
            rootFolderId: currentThread.rootFolderId,
          })("streaming-state-changed", {
            responseData: { streamingState: cleared.state },
          });
          // Also update the thread LIST so sidebar badges reflect the new state.
          const { createThreadsGetEmitter } =
            await import("@/app/api/[locale]/agent/chat/threads/emitter");
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
          // where directResumeLocale is provided and direct fire handles revival).
          ...(selfInstanceId ? { targetInstance: selfInstanceId } : {}),
        });

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
            const { t } = aiStreamScopedTranslation.scopedT(directResumeLocale);
            // Always use ownerUser for the revival stream - correct credit validation.
            // Await so callers that await TaskCompletion.handle (e.g. pulse) get a
            // fully resolved revival.
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
   * Resolve the task owner from a pending-call revival target and fire
   * TaskCompletion.handle with the revival's context. The ONE shared path for
   * every "a result landed for a parked call in THIS process" site: the
   * tool-execute-result wire handler, cross-process reconciliation, and the
   * dispatch deadline backstop all delegate here.
   */
  static async fireRevivalForOwner(params: {
    revival: PendingCallRevival;
    status: "completed" | "failed";
    output: Record<string, WidgetData> | null;
    taskId: string;
    logger: EndpointLogger;
  }): Promise<void> {
    const { revival, status, output, taskId, logger } = params;
    const { resolveTaskOwnerUser } =
      await import("next-vibe/tasks/cron/resolve-task-user");
    const { dbUserIdToOwner } = await import("next-vibe/tasks/cron/db");
    const { defaultLocale } = await import("next-vibe/core/i18n/core/config");

    const ownerCtx = await resolveTaskOwnerUser(
      dbUserIdToOwner(revival.userId),
      defaultLocale,
      logger,
    );
    if (!ownerCtx) {
      return;
    }
    await TaskCompletion.handle({
      toolMessageId: revival.toolMessageId,
      threadId: revival.threadId,
      callbackMode:
        revival.callbackMode === CallbackMode.WAIT
          ? CallbackMode.WAIT
          : CallbackMode.WAKE_UP,
      status:
        status === "completed"
          ? CronTaskStatus.COMPLETED
          : CronTaskStatus.FAILED,
      output,
      taskId,
      modelId: revival.modelId,
      skillId: revival.skillId,
      favoriteId: revival.favoriteId,
      leafMessageId: revival.leafMessageId,
      subAgentDepth: revival.subAgentDepth,
      ownerUser: ownerCtx.user,
      logger,
      directResumeLocale: defaultLocale,
      // Fresh controller: the revival is independent of whichever stream or
      // event handler delivered the result.
      abortSignal: new AbortController().signal,
    });
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
            searchVector: null,
          },
        ],
        streamingState: ThreadStreamingState.STREAMING,
      },
    });

    // Backfill wakeUpToolMessageId on the task row so TaskCompletion.handle
    // can find the right tool message when the goroutine finishes.
    if (pendingTaskId) {
      try {
        await db
          .update(cronTasks)
          .set({
            wakeUpToolMessageId: toolMessageId,
            updatedAt: new Date(),
          })
          .where(eq(cronTasks.id, pendingTaskId));
      } catch (updateErr) {
        logger.warn(
          "[wakeup-confirm] Failed to backfill wakeUpToolMessageId (non-fatal)",
          {
            pendingTaskId,
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
  static async createEscalationTask(opts: {
    callbackMode: string;
    displayName?: string;
    threadId: string | null;
    toolMessageId: string | null;
    leafMessageId: string | null;
    modelId: string | null;
    skillId: string | null;
    favoriteId: string | null;
    subAgentDepth: number;
    userId: string;
  }): Promise<string> {
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
      wakeUpCallbackMode: opts.callbackMode,
      wakeUpThreadId: opts.threadId,
      wakeUpToolMessageId: opts.toolMessageId,
      wakeUpLeafMessageId: opts.leafMessageId,
      wakeUpModelId: opts.modelId,
      wakeUpSkillId: opts.skillId,
      wakeUpFavoriteId: opts.favoriteId,
      wakeUpSubAgentDepth: opts.subAgentDepth,
      outputMode: TaskOutputMode.STORE_ONLY,
      notificationTargets: [],
      tags: ["escalated", "local"],
      userId: opts.userId,
    });

    return taskId;
  }

  /**
   * Resolve the chat model ID from the current stream context's
   * favorite/skill cascade. The ONE model-cascade resolution shared by the
   * execute-tool orchestrator and await-task.
   */
  static async resolveStreamModelId(
    streamContext: ToolExecutionContext,
    user: JwtPayloadType,
  ): Promise<ChatModelId | null> {
    const userId = !user.isPublic ? user.id : undefined;
    const { resolveSkillFavoriteContext } =
      await import("@/app/api/[locale]/agent/skills/resolver");
    const { resolveChatModelId } =
      await import("@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver");

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
