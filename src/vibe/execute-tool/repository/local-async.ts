/**
 * Local async execution — DETACH / WAKE_UP paths.
 *
 * Extracted from local.ts to keep local.ts free of DB/cron imports.
 * All methods here touch the DB (cronTasks, cronTaskExecutions, chatMessages).
 * The WAIT path (execute / generateTaskId) stays in local.ts.
 *
 * DETACH and WAKE_UP share ONE async flow; they differ only in what happens
 * after the tool finishes:
 *   DETACH  — no revival, no backfill; the dispatch message keeps { taskId }
 *             and the result lives in task execution history (await-task
 *             retrieves it). Completion still emits TASK_COMPLETED + reconciles
 *             thread state via TaskCompletion.handle's DETACH policy.
 *   WAKE_UP — revival fires with the result (deferred message + fresh AI turn
 *             via resume-stream).
 *
 * Everything else is identical: RUNNING task row, fire-and-forget goroutine
 * with a fresh AbortController (survives parent stream death), execution
 * history insert, and the atomic claim race against await-task upgrades.
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { Platform } from "next-vibe/platforms/platforms";
import { cronTaskExecutions, cronTasks } from "next-vibe/tasks/cron/db";
import type { CronTaskStatusDB } from "next-vibe/tasks/enum";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "next-vibe/tasks/enum";

import {
  CallbackMode,
  type CallbackModeValue,
  DISPATCH_HINTS,
} from "../constants";
import type { RouteExecuteResponseOutput } from "../definition";
import { TaskCompletion } from "./completion";
import { RouteExecutionExecutor } from "./core";
import { PendingCalls } from "./pending-calls";
import type { GoroutineResult, RouteExecuteContext } from "./types";

export class LocalExecutionAsync {
  /**
   * Local async execution (DETACH / WAKE_UP): RUNNING task row + fire-and-forget
   * goroutine, returns { taskId } to the AI immediately.
   */
  static async executeAsync(params: {
    ctx: RouteExecuteContext;
    input: Record<string, WidgetData> | undefined;
    mode: typeof CallbackMode.DETACH | typeof CallbackMode.WAKE_UP;
  }): Promise<ResponseType<RouteExecuteResponseOutput>> {
    const { ctx, input, mode } = params;
    const { toolName, user, logger, toolExecutionContext } = ctx;
    const isWakeUp = mode === CallbackMode.WAKE_UP;

    // Receiver side of a remote dispatch: the requester's callId IS the task
    // identity on this instance too — one ID names the work everywhere, so
    // await-task targeted at either side resolves the same task.
    const taskId =
      toolExecutionContext.remoteDispatchCallId ??
      LocalExecutionAsync.generateTaskId(isWakeUp ? "local-wu" : "local-bg", {
        toolCallId: toolExecutionContext.callerToolCallId,
        toolExecutionContext: toolExecutionContext,
      });

    const effectiveThreadId = toolExecutionContext.threadId;

    // Resolve the tool message ID for this specific parallel tool call.
    // Priority: (1) pendingToolMessages map (set by tools-loader before execute())
    //           (2) currentToolMessageId (set by stream-part-handler, may lag)
    //           (3) DB lookup by toolCallId (authoritative fallback for races)
    //           (4) aiMessageId (last resort)
    const pendingEntry = toolExecutionContext.callerToolCallId
      ? toolExecutionContext.pendingToolMessages?.get(
          toolExecutionContext.callerToolCallId,
        )
      : undefined;

    let resolvedToolMessageId: string | undefined =
      pendingEntry?.messageId ?? toolExecutionContext.currentToolMessageId;
    let resolvedLeafMessageId: string | null =
      pendingEntry?.toolCallData?.parentId ??
      toolExecutionContext.leafMessageId ??
      null;

    if (
      !resolvedToolMessageId &&
      toolExecutionContext.callerToolCallId &&
      effectiveThreadId
    ) {
      const row = await LocalExecutionAsync.resolveToolMessageFromDb({
        callerToolCallId: toolExecutionContext.callerToolCallId,
        threadId: effectiveThreadId,
      });
      if (row) {
        resolvedToolMessageId = row.id;
        resolvedLeafMessageId = resolvedLeafMessageId ?? row.parentId;
      }
    }

    const effectiveToolMessageId =
      resolvedToolMessageId ?? toolExecutionContext.aiMessageId;
    const effectiveLeafMessageId = resolvedLeafMessageId;

    logger.debug("[RouteExecute] Creating local async task (RUNNING)", {
      toolName,
      taskId,
      mode,
      effectiveThreadId,
      effectiveToolMessageId,
    });

    // RUNNING from creation: the goroutine below is already executing.
    // Streams and await-task discover in-flight work by this status.
    await LocalExecutionAsync.createLocalTask({
      taskId,
      toolName,
      callbackMode: mode,
      input,
      userId: user.id,
    });

    // Fire-and-forget goroutine — returns { taskId } to the AI immediately.
    void (async (): Promise<void> => {
      const startedAt = new Date();

      // selfEscalated: tools that call escalateToTask() self-manage revival via
      // complete-task. When set, skip all completion handling here.
      let selfEscalated = false;
      type EscalateOpts = Parameters<
        NonNullable<typeof toolExecutionContext.escalateToTask>
      >[0];
      type EscalateResult = ReturnType<
        NonNullable<typeof toolExecutionContext.escalateToTask>
      >;
      const wrappedEscalateToTask = toolExecutionContext.escalateToTask
        ? async (opts?: EscalateOpts): EscalateResult => {
            selfEscalated = true;
            return toolExecutionContext.escalateToTask!(opts);
          }
        : undefined;

      // Fresh AbortController: the goroutine survives parent stream death for
      // BOTH modes (the parent's signal fires when its stream ends; background
      // work is independent of the dispatching turn).
      const goroutineAbortController = new AbortController();
      const goroutinetoolExecutionContext: typeof toolExecutionContext = {
        ...toolExecutionContext,
        // Reset per-call fields — the goroutine is independent of the parent stream.
        currentToolMessageId: undefined,
        callerToolCallId: undefined,
        callerCallbackMode: mode,
        pendingToolMessages: undefined,
        duplicateToolCallKeys: undefined,
        executeClaimCount: undefined,
        pendingTimeoutMs: undefined,
        waitingForRemoteResult: undefined,
        onEscalatedTaskCancel: undefined,
        cancelPendingStreamTimer: undefined,
        abortSignal: goroutineAbortController.signal,
        escalateToTask: wrappedEscalateToTask,
        // Per-dispatch identity/hook — must NOT leak into tools this goroutine
        // itself dispatches (a nested async dispatch would reuse the callId as
        // its task PK and double-fire the settled relay).
        remoteDispatchCallId: undefined,
        onAsyncTaskSettled: undefined,
      };

      let finalResult: Record<string, WidgetData> | null = null;
      let finalStatus: (typeof CronTaskStatusDB)[number] =
        CronTaskStatus.FAILED;
      let errorMessage: string | null = null;

      try {
        const executed = await LocalExecutionAsync.executeInGoroutine({
          ctx,
          input,
          taskId,
          startedAt,
          goroutinetoolExecutionContext,
          triggeredBy: isWakeUp ? "wakeup" : "detach",
        });
        finalResult = executed.finalResult;
        finalStatus = executed.finalStatus;
        errorMessage = executed.errorMessage;

        logger.debug("[RouteExecute] Async task finished", {
          taskId,
          toolName,
          mode,
          finalStatus,
          durationMs: Date.now() - startedAt.getTime(),
        });
      } catch (err) {
        errorMessage = err instanceof Error ? err.message : String(err);
        finalResult = TaskCompletion.failedOutputFromMessage(errorMessage);
        logger.error("[RouteExecute] Async task execution failed", {
          taskId,
          toolName,
          mode,
          error: errorMessage,
        });
      } finally {
        if (selfEscalated) {
          logger.debug(
            "[RouteExecute] Tool self-escalated - skipping completion handling",
            { taskId, toolName, mode },
          );
        } else {
          try {
            await LocalExecutionAsync.markTaskCompleted(taskId);

            // If await-task parked a revival (WAIT/WAKE_UP), merge the result into
            // the parked task's taskInput and enable+fire it.
            const revived = await TaskCompletion.enableAndFireParkedResumeTask({
              taskId,
              status:
                finalStatus === CronTaskStatus.COMPLETED
                  ? "completed"
                  : "failed",
              output: finalResult,
              locale: ctx.locale,
              logger,
              abortSignal: goroutineAbortController.signal,
            });

            // For DETACH (no parked revival) or wakeUp dispatched by this goroutine
            // directly (no await-task waiter), still fire TaskCompletion.handle for
            // TASK_COMPLETED emit and thread reconcile.
            if (
              !revived &&
              effectiveToolMessageId &&
              effectiveThreadId &&
              !user.isPublic
            ) {
              const ownerUser: JwtPrivatePayloadType = user;
              await TaskCompletion.handle({
                toolMessageId: effectiveToolMessageId,
                threadId: effectiveThreadId,
                callbackMode: mode,
                status: finalStatus,
                output: finalResult,
                taskId,
                modelId: null,
                skillId: toolExecutionContext.skillId ?? null,
                favoriteId: toolExecutionContext.favoriteId ?? null,
                leafMessageId: effectiveLeafMessageId,
                subAgentDepth: toolExecutionContext.subAgentDepth ?? 0,
                ownerUser,
                logger,
                directResumeLocale: ctx.locale,
                abortSignal: goroutineAbortController.signal,
              });
            }
          } catch (completionErr) {
            logger.error("[RouteExecute] Async task completion failed", {
              taskId,
              mode,
              error:
                completionErr instanceof Error
                  ? completionErr.message
                  : String(completionErr),
            });
          }
        }

        // Wake in-process await-task waiters (event-driven — no DB polling).
        // The task row is terminal and the execution result persisted by now.
        PendingCalls.notifyTaskCompletion(taskId, finalStatus);

        // Receiver side of a remote dispatch: relay the settled outcome back to
        // the requester (emits the tool-execute-result wire event). Fires for
        // self-escalated tools too — the requester still needs the result.
        if (toolExecutionContext.onAsyncTaskSettled) {
          await toolExecutionContext
            .onAsyncTaskSettled({
              taskId,
              status:
                finalStatus === CronTaskStatus.COMPLETED
                  ? "completed"
                  : "failed",
              output: finalResult,
              errorMessage,
            })
            .catch((settleErr: Error) => {
              logger.warn("[RouteExecute] onAsyncTaskSettled hook failed", {
                taskId,
                error: settleErr.message,
              });
            });
        }
      }
    })();

    // Return taskId immediately — the AI completes its current turn while the
    // task runs in the background. The hint steers the model per mode (see
    // DISPATCH_HINTS in ../constants.ts for why the wakeUp wording is load-bearing).
    return success({
      taskId,
      hint: isWakeUp ? DISPATCH_HINTS.wakeUp : DISPATCH_HINTS.detach,
    });
  }

  /**
   * Convert an ALREADY-RUNNING inline WAIT call to an async (DETACH / WAKE_UP)
   * task mid-flight — the reaction to a `detach` / `resume-when-done` control tool.
   *
   * The tool is already executing (execPromise). We must NOT re-execute it (that
   * would run the side effect twice). Instead: create the RUNNING task row, return
   * { taskId, hint } NOW so the turn ends, and in the background await the EXISTING
   * execPromise and run the same completion tail as executeAsync (revive for
   * wakeUp, reconcile-and-discard for detach). Behaviour is identical to having
   * dispatched the call in that mode from the start — the mid-flight tools mirror
   * the callback modes exactly.
   */
  static async convertInFlightToAsync(params: {
    ctx: RouteExecuteContext;
    mode: typeof CallbackMode.DETACH | typeof CallbackMode.WAKE_UP;
    input: Record<string, WidgetData> | undefined;
    execPromise: Promise<ResponseType<WidgetData>>;
    callId: string | undefined;
  }): Promise<ResponseType<RouteExecuteResponseOutput>> {
    const { ctx, mode, input, execPromise } = params;
    const { toolName, user, logger, toolExecutionContext } = ctx;
    const isWakeUp = mode === CallbackMode.WAKE_UP;

    const taskId =
      toolExecutionContext.remoteDispatchCallId ??
      LocalExecutionAsync.generateTaskId(isWakeUp ? "local-wu" : "local-bg", {
        toolCallId: toolExecutionContext.callerToolCallId,
        toolExecutionContext,
      });

    const effectiveThreadId = toolExecutionContext.threadId;
    const pendingEntry = toolExecutionContext.callerToolCallId
      ? toolExecutionContext.pendingToolMessages?.get(
          toolExecutionContext.callerToolCallId,
        )
      : undefined;
    let resolvedToolMessageId: string | undefined =
      pendingEntry?.messageId ?? toolExecutionContext.currentToolMessageId;
    let resolvedLeafMessageId: string | null =
      pendingEntry?.toolCallData?.parentId ??
      toolExecutionContext.leafMessageId ??
      null;
    if (
      !resolvedToolMessageId &&
      toolExecutionContext.callerToolCallId &&
      effectiveThreadId
    ) {
      const row = await LocalExecutionAsync.resolveToolMessageFromDb({
        callerToolCallId: toolExecutionContext.callerToolCallId,
        threadId: effectiveThreadId,
      });
      if (row) {
        resolvedToolMessageId = row.id;
        resolvedLeafMessageId = resolvedLeafMessageId ?? row.parentId;
      }
    }
    const effectiveToolMessageId =
      resolvedToolMessageId ?? toolExecutionContext.aiMessageId;
    const effectiveLeafMessageId = resolvedLeafMessageId;

    await LocalExecutionAsync.createLocalTask({
      taskId,
      toolName,
      callbackMode: mode,
      input,
      userId: user.id,
    });

    // Background: await the EXISTING execution (no re-run), persist history, then
    // run the standard completion tail (revive for wakeUp, reconcile for detach).
    void (async (): Promise<void> => {
      const startedAt = new Date();
      const goroutineAbort = new AbortController();
      let finalResult: Record<string, WidgetData> | null = null;
      let finalStatus: (typeof CronTaskStatusDB)[number] =
        CronTaskStatus.FAILED;
      let errorMessage: string | null = null;

      try {
        const result = await execPromise;
        finalStatus = result.success
          ? CronTaskStatus.COMPLETED
          : CronTaskStatus.FAILED;
        errorMessage =
          !result.success && "message" in result
            ? String(result.message)
            : null;
        finalResult = result.success
          ? result.data !== undefined
            ? PendingCalls.toOutputObject(result.data)
            : null
          : TaskCompletion.failedOutput(result);
        await LocalExecutionAsync.insertExecutionHistory({
          taskId,
          toolName,
          startedAt,
          finalStatus,
          finalResult,
          triggeredBy: isWakeUp ? "wakeup" : "detach",
          logger,
        });
      } catch (err) {
        errorMessage = err instanceof Error ? err.message : String(err);
        finalResult = TaskCompletion.failedOutputFromMessage(errorMessage);
        logger.error("[RouteExecute] In-flight conversion execution failed", {
          taskId,
          toolName,
          mode,
          error: errorMessage,
        });
      } finally {
        try {
          await LocalExecutionAsync.markTaskCompleted(taskId);
          const revived = await TaskCompletion.enableAndFireParkedResumeTask({
            taskId,
            status:
              finalStatus === CronTaskStatus.COMPLETED ? "completed" : "failed",
            output: finalResult,
            locale: ctx.locale,
            logger,
            abortSignal: goroutineAbort.signal,
          });
          if (
            !revived &&
            effectiveToolMessageId &&
            effectiveThreadId &&
            !user.isPublic
          ) {
            const ownerUser: JwtPrivatePayloadType = user;
            await TaskCompletion.handle({
              toolMessageId: effectiveToolMessageId,
              threadId: effectiveThreadId,
              callbackMode: mode,
              status: finalStatus,
              output: finalResult,
              taskId,
              modelId: null,
              skillId: toolExecutionContext.skillId ?? null,
              favoriteId: toolExecutionContext.favoriteId ?? null,
              leafMessageId: effectiveLeafMessageId,
              subAgentDepth: toolExecutionContext.subAgentDepth ?? 0,
              ownerUser,
              logger,
              directResumeLocale: ctx.locale,
              abortSignal: goroutineAbort.signal,
            });
          }
        } catch (completionErr) {
          logger.error(
            "[RouteExecute] In-flight conversion completion failed",
            {
              taskId,
              mode,
              error:
                completionErr instanceof Error
                  ? completionErr.message
                  : String(completionErr),
            },
          );
        }
        PendingCalls.notifyTaskCompletion(taskId, finalStatus);
      }
    })();

    // Flip the ORIGINAL tool message to PENDING in the UI: patch its callbackMode
    // to the new mode + a { taskId, status: pending } result, then emit the regular
    // definition-driven `tool-result-updated` event. The message renders as pending
    // (tool-parts keys pending off callbackMode detach/wakeUp) and is updated to its
    // final state by TaskCompletion.handle's own event when the work completes.
    if (effectiveToolMessageId && effectiveThreadId && !user.isPublic) {
      await LocalExecutionAsync.emitConvertedPending({
        toolMessageId: effectiveToolMessageId,
        threadId: effectiveThreadId,
        mode,
        taskId,
        user,
        logger,
      });
    }

    logger.debug("[RouteExecute] Converted in-flight call to async", {
      toolName,
      taskId,
      mode,
    });
    return success({
      taskId,
      hint: isWakeUp ? DISPATCH_HINTS.wakeUp : DISPATCH_HINTS.detach,
    });
  }

  /* ── Internals ──────────────────────────────────────────────────────────── */

  /**
   * Generate a task ID for local async tasks and remote dispatch callIds.
   * Duplicated from LocalExecution to avoid importing from local.ts (which would
   * re-introduce a static dependency on this file from that module).
   */
  static generateTaskId(
    type: "local-bg" | "local-wu" | "remote-ws" | "remote-direct",
    options?: {
      instanceId?: string;
      toolCallId?: string;
      toolExecutionContext: ToolExecutionContext;
    },
  ): string {
    const { instanceId, toolCallId, toolExecutionContext } = options ?? {};
    const prefix = instanceId ? `${type}-${instanceId}` : type;
    if (!toolCallId) {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    const token = toolCallId
      .replaceAll(/[^a-zA-Z0-9]+/g, "-")
      .replaceAll(/^-+|-+$/g, "");
    const deterministic = `${prefix}-${token}`;
    if (toolExecutionContext) {
      return deterministic;
    }
    return `${deterministic}-${Math.random().toString(36).slice(2, 8)}`;
  }

  /**
   * Patch a tool message to the PENDING state after a mid-flight conversion and
   * emit `tool-result-updated`. Sets callbackMode to the new async mode so the UI
   * renders it as pending; the completion path later emits the final result.
   */
  private static async emitConvertedPending(params: {
    toolMessageId: string;
    threadId: string;
    mode: typeof CallbackMode.DETACH | typeof CallbackMode.WAKE_UP;
    taskId: string;
    user: JwtPrivatePayloadType;
    logger: RouteExecuteContext["logger"];
  }): Promise<void> {
    const { toolMessageId, threadId, mode, taskId, user, logger } = params;
    const { chatMessages, chatThreads } =
      await import("next-vibe/agent/chat/db");
    const [msg] = await db
      .select({ metadata: chatMessages.metadata })
      .from(chatMessages)
      .where(eq(chatMessages.id, toolMessageId))
      .limit(1);
    if (!msg?.metadata?.toolCall) {
      return;
    }
    const patchedToolCall = {
      ...msg.metadata.toolCall,
      callbackMode: mode,
      result: { taskId, status: "status.pending" },
    };
    await db
      .update(chatMessages)
      .set({
        metadata: { ...msg.metadata, toolCall: patchedToolCall },
        updatedAt: new Date(),
      })
      .where(eq(chatMessages.id, toolMessageId));

    const [threadRow] = await db
      .select({ rootFolderId: chatThreads.rootFolderId })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);
    if (!threadRow?.rootFolderId) {
      return;
    }
    const { createMessagesEmitter } =
      await import("next-vibe/agent/chat/threads/[threadId]/messages/emitter");
    createMessagesEmitter(logger, user, {
      threadId,
      rootFolderId: threadRow.rootFolderId,
    })("tool-result-updated", {
      responseData: {
        messages: [
          { id: toolMessageId, metadata: { toolCall: patchedToolCall } },
        ],
      },
    });
  }

  /**
   * Execute the tool inside a goroutine-local toolExecutionContext.
   * Returns the raw execution result for the caller to handle revival.
   */
  private static async executeInGoroutine(params: {
    ctx: RouteExecuteContext;
    input: Record<string, WidgetData> | undefined;
    taskId: string;
    startedAt: Date;
    goroutinetoolExecutionContext: RouteExecuteContext["toolExecutionContext"];
    triggeredBy: string;
  }): Promise<GoroutineResult> {
    const {
      ctx,
      input,
      taskId,
      startedAt,
      goroutinetoolExecutionContext,
      triggeredBy,
    } = params;
    const { toolName, logger } = ctx;

    // Hard max-duration guard: a background task MUST NOT hang forever. If the
    // handler (e.g. a media-gen sub-stream whose provider stalls) never
    // settles, the goroutine would never reach its completion/finally and the
    // await-task waiter would wait indefinitely. Race the handler against a
    // ceiling; on timeout treat the task as FAILED so the parked revival still
    // fires with a terminal result instead of pinning the thread. Generous
    // enough for real media gen (a few minutes).
    const GOROUTINE_MAX_DURATION_MS = 300_000;
    const timeoutSentinel = Symbol("goroutine-timeout");
    const handlerPromise = RouteExecutionExecutor.executeGenericHandler<
      Record<string, WidgetData>
    >({
      toolName,
      data: input ?? {},
      user: ctx.user,
      locale: ctx.locale,
      logger,
      platform: Platform.MCP,
      toolExecutionContext: goroutinetoolExecutionContext,
    });
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<typeof timeoutSentinel>((resolve) => {
      timeoutHandle = setTimeout(
        () => resolve(timeoutSentinel),
        GOROUTINE_MAX_DURATION_MS,
      );
    });
    const raced = await Promise.race([handlerPromise, timeoutPromise]);
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
    if (raced === timeoutSentinel) {
      logger.error(
        "[RouteExecute] Async task exceeded max duration - marking FAILED",
        { taskId, toolName, maxMs: GOROUTINE_MAX_DURATION_MS },
      );
      const timedOutAt = new Date();
      const timeoutMessage = `Background task exceeded ${String(GOROUTINE_MAX_DURATION_MS)}ms`;
      const timeoutResult =
        TaskCompletion.failedOutputFromMessage(timeoutMessage);
      await LocalExecutionAsync.insertExecutionHistory({
        taskId,
        toolName,
        startedAt,
        completedAt: timedOutAt,
        finalStatus: CronTaskStatus.FAILED,
        finalResult: timeoutResult,
        triggeredBy,
        logger,
      });
      return {
        finalStatus: CronTaskStatus.FAILED,
        finalResult: timeoutResult,
        errorMessage: timeoutMessage,
        completedAt: timedOutAt,
      };
    }
    const result = raced;

    const completedAt = new Date();
    const finalStatus: (typeof CronTaskStatusDB)[number] = result.success
      ? CronTaskStatus.COMPLETED
      : CronTaskStatus.FAILED;
    const errorMessage =
      !result.success && "message" in result ? String(result.message) : null;
    const finalResult = result.success
      ? (result.data ?? null)
      : TaskCompletion.failedOutput(result);

    await LocalExecutionAsync.insertExecutionHistory({
      taskId,
      toolName,
      startedAt,
      completedAt,
      finalStatus,
      finalResult,
      triggeredBy,
      logger,
    });

    return { finalStatus, finalResult, errorMessage, completedAt };
  }

  /**
   * Append a cron_task_executions history row. Shared by the goroutine path
   * (executeInGoroutine) and the mid-flight conversion (convertInFlightToAsync).
   * Append-only: the timestamp tail keeps executionId unique when a deterministic
   * (fixture-mode) taskId re-runs. Non-fatal on failure — the parent cron_tasks
   * row may have been deleted (test teardown).
   */
  private static async insertExecutionHistory(params: {
    taskId: string;
    toolName: string;
    startedAt: Date;
    completedAt?: Date;
    finalStatus: (typeof CronTaskStatusDB)[number];
    finalResult: Record<string, WidgetData> | null;
    triggeredBy: string;
    logger?: RouteExecuteContext["logger"];
  }): Promise<void> {
    const {
      taskId,
      toolName,
      startedAt,
      finalStatus,
      finalResult,
      triggeredBy,
    } = params;
    const completedAt = params.completedAt ?? new Date();
    try {
      await db.insert(cronTaskExecutions).values({
        taskId,
        taskName: toolName,
        executionId: `${triggeredBy}-${taskId}-${startedAt.getTime()}`,
        status: finalStatus,
        priority: CronTaskPriority.HIGH,
        startedAt,
        completedAt,
        durationMs: completedAt.getTime() - startedAt.getTime(),
        result: finalResult ?? undefined,
        triggeredBy,
        config: {},
      });
    } catch (execInsertErr) {
      params.logger?.warn(
        "[execute-tool] Failed to insert execution history (parent deleted?)",
        {
          taskId,
          error:
            execInsertErr instanceof Error
              ? execInsertErr.message
              : String(execInsertErr),
        },
      );
    }
  }

  /**
   * Flip the task row terminal (COMPLETED). With requiredMode set this is the
   * atomic dispatch-mode→COMPLETED claim: the row flips ONLY IF
   * wakeUpCallbackMode still equals the mode the task was dispatched with. If
   * await-task upgraded the mode in the meantime (wrote WAIT/WAKE_UP waiter
   * context), rowCount is 0 — the goroutine lost the race and must fire the
   * waiter's revival instead (after calling this again unconditionally).
   */
  private static async markTaskCompleted(taskId: string): Promise<boolean> {
    const updated = await db
      .update(cronTasks)
      .set({
        lastExecutionStatus: CronTaskStatus.COMPLETED,
        lastExecutedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(cronTasks.id, taskId));

    return updated.rowCount !== null && updated.rowCount > 0;
  }

  /**
   * DB fallback: resolve toolMessageId + leafMessageId from the chatMessages table
   * when the in-memory pendingToolMessages lookup missed (race with stream-part-handler).
   */
  private static async resolveToolMessageFromDb(params: {
    callerToolCallId: string;
    threadId: string;
  }): Promise<{ id: string; parentId: string | null } | null> {
    const { callerToolCallId, threadId } = params;
    const { chatMessages } = await import("next-vibe/agent/chat/db");
    const [row] = await db
      .select({ id: chatMessages.id, parentId: chatMessages.parentId })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.threadId, threadId),
          sql`(${chatMessages.metadata}->'toolCall'->>'toolCallId') = ${callerToolCallId}`,
        ),
      )
      .orderBy(sql`${chatMessages.createdAt} DESC`)
      .limit(1);
    return row ?? null;
  }

  /**
   * Insert a cronTasks row for a local DETACH or WAKE_UP task. The mode only
   * changes the fields that depend on it (displayName, wakeUpModelId, tags).
   */
  private static async createLocalTask(params: {
    taskId: string;
    toolName: string;
    callbackMode: CallbackModeValue; // DETACH or WAKE_UP
    input: Record<string, WidgetData> | undefined;
    userId: string | undefined;
  }): Promise<void> {
    const { taskId, toolName, callbackMode, input, userId } = params;

    const isWakeUp = callbackMode === CallbackMode.WAKE_UP;

    // Idempotent on the primary key. Task ids are DETERMINISTIC under fixture mode
    // (derived from the AI SDK toolCallId, no random tail) so the SAME id recurs on
    // every replay of a given AI turn — a fresh dispatch must REUSE the existing row
    // (reset to RUNNING) rather than 23505-duplicate-key on the prior run's terminal
    // row. In production the id carries a random tail, so this conflict path is only
    // ever hit by an exact retry of the same dispatch, where overwrite is also correct.
    await db
      .insert(cronTasks)
      .values({
        id: taskId,
        shortId: taskId,
        routeId: toolName,
        displayName: isWakeUp
          ? `WakeUp: ${toolName}`
          : `Background: ${toolName}`,
        category: TaskCategory.SYSTEM,
        schedule: "* * * * *",
        priority: CronTaskPriority.HIGH,
        enabled: false,
        runOnce: true,
        lastExecutionStatus: CronTaskStatus.RUNNING,
        taskInput: input ?? {},
        outputMode: TaskOutputMode.STORE_ONLY,
        notificationTargets: [],
        tags: [isWakeUp ? "wakeup" : "detach", "local"],
        userId,
      })
      .onConflictDoUpdate({
        target: cronTasks.id,
        set: {
          routeId: toolName,
          lastExecutionStatus: CronTaskStatus.RUNNING,
          enabled: false,
          taskInput: input ?? {},
          userId,
          updatedAt: new Date(),
        },
      });
  }
}
