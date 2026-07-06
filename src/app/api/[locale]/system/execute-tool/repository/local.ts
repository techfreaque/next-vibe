/**
 * Local execution — sync (WAIT/endLoop/approve gate) + async (DETACH/WAKE_UP
 * task + goroutine).
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
 * history insert, and the atomic claim race against await-task upgrades:
 *
 *   1. Goroutine finishes → CAS: flip terminal ONLY IF wakeUpCallbackMode
 *      still equals the dispatch mode.
 *   2. Claim WON → complete under the dispatch mode's policy.
 *   3. Claim LOST → await-task upgraded the task (wrote WAIT/WAKE_UP waiter
 *      context). Force the row terminal and fire the WAITER's revival instead.
 */

import "server-only";

import { and, eq, sql as drizzleSql } from "drizzle-orm";
import { formatValidationErrorCompact } from "next-vibe/core/core-utils/format-validation-error";
import { Platform } from "next-vibe/core/definition/platform";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { cronTaskExecutions, cronTasks } from "next-vibe/tasks/cron/db";
import type { CronTaskStatusDB } from "next-vibe/tasks/enum";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "next-vibe/tasks/enum";

import { makeHeadlessContext } from "@/app/api/[locale]/agent/chat/config";
import { getEndpoint } from "@/generated/endpoints/endpoint";

import {
  CallbackMode,
  type CallbackModeValue,
  DISPATCH_HINTS,
} from "../constants";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseOutput,
} from "../definition";
import { TaskCompletion } from "./completion";
import { RouteExecutionExecutor } from "./core";
import { ExecuteToolGuards } from "./guards";
import { PendingCalls } from "./pending-calls";
import type { GoroutineResult, RouteExecuteContext } from "./types";

export class LocalExecution {
  /**
   * Generate a task ID for local async tasks and remote dispatch callIds.
   *
   * The deterministic part is derived from the originating AI SDK toolCallId
   * (e.g. "functions.execute-tool:11"): it is baked into the recorded model
   * response, so it is identical on fixture record and replay AND identical on
   * every instance that processes the same AI turn. That is exactly what the
   * AI's conversation needs when it later echoes the task id back into a prompt.
   *
   * In production the toolCallId is only unique WITHIN one AI turn (a per-turn
   * counter), so a short random tail is appended to guarantee a globally-unique
   * cronTasks primary key across threads. On a fixture-driven execution
   * (the dispatch carries a fixtureContext) that tail is dropped so the id
   * stays fully reproducible on replay and identical across instances.
   *
   * When no toolCallId is present (a task not originating from an AI tool call)
   * the whole id is random — those paths need neither replay nor cross-instance
   * stability.
   */
  static generateTaskId(
    type: "local-bg" | "local-wu" | "remote-ws" | "remote-direct",
    options?: {
      instanceId?: string;
      toolCallId?: string;
      fixtureContext?: FixtureContext;
    },
  ): string {
    const { instanceId, toolCallId, fixtureContext } = options ?? {};
    const prefix = instanceId ? `${type}-${instanceId}` : type;
    if (!toolCallId) {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    // Sanitise the toolCallId into an id-safe token.
    const token = toolCallId
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const deterministic = `${prefix}-${token}`;
    if (fixtureContext) {
      return deterministic;
    }
    return `${deterministic}-${Math.random().toString(36).slice(2, 8)}`;
  }

  /**
   * Local WAIT execution — the terminal phase of the orchestrator for local
   * tools that run inline:
   *   1. Resolve tool permissions (favorite → skill → null) and enforce whitelist/denylist.
   *   2. Enforce requiresConfirmation (the same gate as a direct call — the
   *      endpoint definition AND the per-context confirmation cascade apply to
   *      the TARGET tool when the AI routes through execute-tool).
   *   3. Execute the target via RouteExecutionExecutor.executeGenericHandler.
   *   4. Discard the result if the stream was cancelled mid-execution.
   *   5. Compact validation errors and wrap the success data in { result: ... }.
   */
  static async execute(params: {
    ctx: RouteExecuteContext;
    data: RouteExecuteRequestOutput;
    input: RouteExecuteRequestOutput["input"];
    instanceId: string | undefined;
    callbackMode: CallbackModeValue | null;
  }): Promise<ResponseType<RouteExecuteResponseOutput>> {
    const { ctx, data, input, instanceId, callbackMode } = params;
    const { toolName, user, locale, logger, t, streamContext, platform } = ctx;
    const { preloadedHandler, urlPathParams } = ctx;

    logger.debug("[RouteExecute] Executing route", { toolName });

    // Resolve tool whitelist + denylist from favorite → skill → null cascade.
    // Uses the streamContext's favoriteId/skillId (set by the AI loop that called us),
    // or undefined for headless/cron callers (→ all tools allowed, only folder blocks apply).
    const userId = !user.isPublic && "id" in user ? user.id : undefined;
    const permissions = await ExecuteToolGuards.resolveToolPermissions({
      favoriteId: streamContext.favoriteId,
      skillId: streamContext.skillId,
      userId,
      rootFolderId: streamContext.rootFolderId,
    });

    const permissionBlock = ExecuteToolGuards.checkToolPermission(
      toolName,
      permissions,
    );
    if (permissionBlock !== null) {
      logger.debug("[RouteExecute] Tool blocked by permission cascade", {
        toolName,
        reason: permissionBlock,
      });
      return fail({
        message: t("executeTool.post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // Enforce requiresConfirmation for the TARGET tool — shared gate with the
    // remote dispatch path: the endpoint definition AND the per-context
    // confirmation cascade both apply uniformly wherever the tool would run.
    if (!instanceId && streamContext) {
      const gate = await ExecuteToolGuards.applyConfirmationGate({
        toolName,
        data: { callbackMode: data.callbackMode },
        streamContext,
        logger,
      });
      if (gate) {
        return success({ result: gate });
      }
    }

    if (streamContext) {
      streamContext.callerCallbackMode = callbackMode ?? undefined;
    }

    const result =
      await RouteExecutionExecutor.executeGenericHandler<WidgetData>({
        toolName,
        data: input ?? {},
        urlPathParams,
        user,
        locale,
        logger,
        platform,
        preloadedHandler,
        streamContext: streamContext ?? {
          ...makeHeadlessContext(),
          callerCallbackMode: callbackMode ?? undefined,
        },
      });

    // Discard result if stream was cancelled during tool execution.
    // The abort signal may have fired while the tool was running - any result
    // returned after cancellation should be ignored to prevent ghost responses.
    if (streamContext.abortSignal.aborted) {
      logger.debug(
        "[RouteExecute] Stream was cancelled during tool execution - discarding result",
        { toolName },
      );
      return fail({
        message: t("executeTool.post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    if (!result.success) {
      const endpoint = await getEndpoint(toolName);
      const compactDetails = formatValidationErrorCompact(
        result.messageParams as Record<string, string | number> | undefined,
        endpoint,
      );
      if (compactDetails) {
        return {
          ...result,
          message: compactDetails as typeof result.message,
        };
      }
      return result;
    }

    // Wrap target's .data in `result` so MCP/UI renders it. Preserve the target's
    // isErrorResponse / performance metadata — CLI relies on isErrorResponse for
    // exit codes (e.g. vibe check) and on performance for its execution summary.
    return success(
      { result: result.data },
      {
        ...(result.isErrorResponse && { isErrorResponse: true }),
        ...(result.performance && { performance: result.performance }),
      },
    );
  }

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
    const { toolName, resolvedModelId, user, logger, streamContext } = ctx;
    const isWakeUp = mode === CallbackMode.WAKE_UP;

    // Receiver side of a remote dispatch: the requester's callId IS the task
    // identity on this instance too — one ID names the work everywhere, so
    // await-task targeted at either side resolves the same task.
    const taskId =
      streamContext.remoteDispatchCallId ??
      LocalExecution.generateTaskId(isWakeUp ? "local-wu" : "local-bg", {
        toolCallId: streamContext.callerToolCallId,
        fixtureContext: streamContext.fixtureContext,
      });

    const effectiveThreadId = streamContext.threadId;

    // Resolve the tool message ID for this specific parallel tool call.
    // Priority: (1) pendingToolMessages map (set by tools-loader before execute())
    //           (2) currentToolMessageId (set by stream-part-handler, may lag)
    //           (3) DB lookup by toolCallId (authoritative fallback for races)
    //           (4) aiMessageId (last resort)
    const pendingEntry = streamContext.callerToolCallId
      ? streamContext.pendingToolMessages?.get(streamContext.callerToolCallId)
      : undefined;

    let resolvedToolMessageId: string | undefined =
      pendingEntry?.messageId ?? streamContext.currentToolMessageId;
    let resolvedLeafMessageId: string | null =
      pendingEntry?.toolCallData?.parentId ??
      streamContext.leafMessageId ??
      null;

    if (
      !resolvedToolMessageId &&
      streamContext.callerToolCallId &&
      effectiveThreadId
    ) {
      const row = await LocalExecution.resolveToolMessageFromDb({
        callerToolCallId: streamContext.callerToolCallId,
        threadId: effectiveThreadId,
      });
      if (row) {
        resolvedToolMessageId = row.id;
        resolvedLeafMessageId = resolvedLeafMessageId ?? row.parentId;
      }
    }

    const effectiveToolMessageId =
      resolvedToolMessageId ?? streamContext.aiMessageId;
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
    await LocalExecution.createLocalTask({
      taskId,
      toolName,
      callbackMode: mode,
      input,
      effectiveThreadId,
      effectiveToolMessageId,
      effectiveLeafMessageId,
      resolvedModelId: isWakeUp ? resolvedModelId : null,
      skillId: streamContext.skillId ?? null,
      favoriteId: streamContext.favoriteId ?? null,
      subAgentDepth: streamContext.subAgentDepth ?? 0,
      userId: user.id,
    });

    // Fire-and-forget goroutine — returns { taskId } to the AI immediately.
    void (async (): Promise<void> => {
      const startedAt = new Date();

      // selfEscalated: tools that call escalateToTask() self-manage revival via
      // complete-task. When set, skip all completion handling here.
      let selfEscalated = false;
      type EscalateOpts = Parameters<
        NonNullable<typeof streamContext.escalateToTask>
      >[0];
      type EscalateResult = ReturnType<
        NonNullable<typeof streamContext.escalateToTask>
      >;
      const wrappedEscalateToTask = streamContext.escalateToTask
        ? async (opts?: EscalateOpts): EscalateResult => {
            selfEscalated = true;
            return streamContext.escalateToTask!(opts);
          }
        : undefined;

      // Fresh AbortController: the goroutine survives parent stream death for
      // BOTH modes (the parent's signal fires when its stream ends; background
      // work is independent of the dispatching turn).
      const goroutineAbortController = new AbortController();
      const goroutineStreamContext: typeof streamContext = {
        ...streamContext,
        // Reset per-call fields — the goroutine is independent of the parent stream.
        currentToolMessageId: undefined,
        callerToolCallId: undefined,
        callerCallbackMode: mode,
        pendingToolMessages: undefined,
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
        const executed = await LocalExecution.executeInGoroutine({
          ctx,
          input,
          taskId,
          startedAt,
          goroutineStreamContext,
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
            // Atomic claim: flip terminal ONLY IF the mode is still the dispatch
            // mode. Lost claim = await-task upgraded to a waiter (WAIT/WAKE_UP)
            // — force the row terminal and fire the WAITER's revival instead.
            const claimed = await LocalExecution.markTaskCompleted(
              taskId,
              mode,
            );
            if (!claimed) {
              await LocalExecution.markTaskCompleted(taskId);
            }

            // Latest context picks up waiter target + any routing written by
            // await-task before the race resolved.
            const latest = await LocalExecution.readLatestTaskContext(taskId);
            const upgradedMode: CallbackModeValue | null = !claimed
              ? latest.wakeUpCallbackMode === CallbackMode.WAIT
                ? CallbackMode.WAIT
                : CallbackMode.WAKE_UP
              : null;
            const finalMode: CallbackModeValue = upgradedMode ?? mode;

            const targetToolMessageId =
              latest.wakeUpToolMessageId ?? effectiveToolMessageId;
            const targetThreadId = latest.wakeUpThreadId ?? effectiveThreadId;

            if (targetToolMessageId && targetThreadId && !user.isPublic) {
              const ownerUser: JwtPrivatePayloadType = user;
              // TaskCompletion.handle applies the mode's policy:
              //   DETACH  → no backfill, TASK_COMPLETED emit, thread reconcile.
              //   WAKE_UP → revival scheduled (deferred insert via resume-stream).
              //   WAIT    → backfill in-place + revival (await-task waiter).
              await TaskCompletion.handle({
                toolMessageId: targetToolMessageId,
                threadId: targetThreadId,
                callbackMode: finalMode,
                status: finalStatus,
                output: finalResult,
                taskId,
                modelId: latest.wakeUpModelId ?? null,
                skillId: latest.wakeUpSkillId ?? streamContext.skillId ?? null,
                favoriteId:
                  latest.wakeUpFavoriteId ?? streamContext.favoriteId ?? null,
                leafMessageId:
                  latest.wakeUpLeafMessageId ?? effectiveLeafMessageId,
                subAgentDepth:
                  latest.wakeUpSubAgentDepth ??
                  streamContext.subAgentDepth ??
                  0,
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
        if (streamContext.onAsyncTaskSettled) {
          await streamContext
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

  /* ── Internals ──────────────────────────────────────────────────────────── */

  /**
   * Execute the tool inside a goroutine-local streamContext.
   * Returns the raw execution result for the caller to handle revival.
   */
  private static async executeInGoroutine(params: {
    ctx: RouteExecuteContext;
    input: Record<string, WidgetData> | undefined;
    taskId: string;
    startedAt: Date;
    goroutineStreamContext: RouteExecuteContext["streamContext"];
    triggeredBy: string;
  }): Promise<GoroutineResult> {
    const {
      ctx,
      input,
      taskId,
      startedAt,
      goroutineStreamContext,
      triggeredBy,
    } = params;
    const { toolName, logger } = ctx;

    const result = await RouteExecutionExecutor.executeGenericHandler<
      Record<string, WidgetData>
    >({
      toolName,
      data: input ?? {},
      user: ctx.user,
      locale: ctx.locale,
      logger,
      platform: Platform.MCP,
      streamContext: goroutineStreamContext,
    });

    const completedAt = new Date();
    const finalStatus: (typeof CronTaskStatusDB)[number] = result.success
      ? CronTaskStatus.COMPLETED
      : CronTaskStatus.FAILED;
    const finalResult =
      result.success && result.data !== undefined ? result.data : null;
    const errorMessage =
      !result.success && "message" in result ? String(result.message) : null;

    try {
      await db.insert(cronTaskExecutions).values({
        taskId,
        taskName: toolName,
        // History is append-only: the timestamp tail keeps executionId unique
        // when the SAME deterministic taskId re-runs (fixture-mode ids have no
        // random tail, so every replay of a turn reuses the task id).
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
      // Parent cron_tasks row may have been deleted (e.g. test teardown cancelThreadTasks).
      logger.warn(
        "[execute-tool goroutine] Failed to insert execution history (parent deleted?)",
        {
          taskId,
          error:
            execInsertErr instanceof Error
              ? execInsertErr.message
              : String(execInsertErr),
        },
      );
    }

    return { finalStatus, finalResult, errorMessage, completedAt };
  }

  /**
   * Flip the task row terminal (COMPLETED). With requiredMode set this is the
   * atomic dispatch-mode→COMPLETED claim: the row flips ONLY if
   * wakeUpCallbackMode still equals the mode the task was dispatched with. If
   * await-task upgraded the mode in the meantime (wrote WAIT/WAKE_UP waiter
   * context), rowCount is 0 — the goroutine lost the race and must fire the
   * waiter's revival instead (after calling this again unconditionally).
   */
  private static async markTaskCompleted(
    taskId: string,
    requiredMode?: CallbackModeValue,
  ): Promise<boolean> {
    const updated = await db
      .update(cronTasks)
      .set({
        lastExecutionStatus: CronTaskStatus.COMPLETED,
        lastExecutedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        requiredMode
          ? and(
              eq(cronTasks.id, taskId),
              eq(cronTasks.wakeUpCallbackMode, requiredMode),
            )
          : eq(cronTasks.id, taskId),
      );

    return updated.rowCount !== null && updated.rowCount > 0;
  }

  /**
   * Re-read task row for upgraded wakeUp context (set by await-task).
   * Returns the latest columns.
   */
  private static async readLatestTaskContext(taskId: string): Promise<{
    wakeUpCallbackMode: string | null;
    wakeUpThreadId: string | null;
    wakeUpToolMessageId: string | null;
    wakeUpModelId: string | null;
    wakeUpSkillId: string | null;
    wakeUpFavoriteId: string | null;
    wakeUpLeafMessageId: string | null;
    wakeUpSubAgentDepth: number | null;
  }> {
    const [row] = await db
      .select({
        wakeUpCallbackMode: cronTasks.wakeUpCallbackMode,
        wakeUpThreadId: cronTasks.wakeUpThreadId,
        wakeUpToolMessageId: cronTasks.wakeUpToolMessageId,
        wakeUpModelId: cronTasks.wakeUpModelId,
        wakeUpSkillId: cronTasks.wakeUpSkillId,
        wakeUpFavoriteId: cronTasks.wakeUpFavoriteId,
        wakeUpLeafMessageId: cronTasks.wakeUpLeafMessageId,
        wakeUpSubAgentDepth: cronTasks.wakeUpSubAgentDepth,
      })
      .from(cronTasks)
      .where(eq(cronTasks.id, taskId))
      .limit(1);

    return {
      wakeUpCallbackMode: row?.wakeUpCallbackMode ?? null,
      wakeUpThreadId: row?.wakeUpThreadId ?? null,
      wakeUpToolMessageId: row?.wakeUpToolMessageId ?? null,
      wakeUpModelId: row?.wakeUpModelId ?? null,
      wakeUpSkillId: row?.wakeUpSkillId ?? null,
      wakeUpFavoriteId: row?.wakeUpFavoriteId ?? null,
      wakeUpLeafMessageId: row?.wakeUpLeafMessageId ?? null,
      wakeUpSubAgentDepth: row?.wakeUpSubAgentDepth ?? null,
    };
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
    const { chatMessages } = await import("@/app/api/[locale]/agent/chat/db");
    const [row] = await db
      .select({ id: chatMessages.id, parentId: chatMessages.parentId })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.threadId, threadId),
          drizzleSql`(${chatMessages.metadata}->'toolCall'->>'toolCallId') = ${callerToolCallId}`,
        ),
      )
      .orderBy(drizzleSql`${chatMessages.createdAt} DESC`)
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
    effectiveThreadId: string | undefined;
    effectiveToolMessageId: string | undefined;
    effectiveLeafMessageId: string | null;
    resolvedModelId: string | null | undefined; // only stored for WAKE_UP
    skillId: string | null | undefined;
    favoriteId: string | null | undefined;
    subAgentDepth: number;
    userId: string | undefined;
  }): Promise<void> {
    const {
      taskId,
      toolName,
      callbackMode,
      input,
      effectiveThreadId,
      effectiveToolMessageId,
      effectiveLeafMessageId,
      resolvedModelId,
      skillId,
      favoriteId,
      subAgentDepth,
      userId,
    } = params;

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
        wakeUpCallbackMode: callbackMode,
        wakeUpThreadId: effectiveThreadId ?? null,
        wakeUpToolMessageId: effectiveToolMessageId ?? null,
        // Only store modelId for WAKE_UP — DETACH never wakes up the AI with a specific model.
        wakeUpModelId: isWakeUp ? (resolvedModelId ?? undefined) : undefined,
        wakeUpSkillId: skillId ?? null,
        wakeUpFavoriteId: favoriteId ?? null,
        wakeUpLeafMessageId: effectiveLeafMessageId,
        wakeUpSubAgentDepth: subAgentDepth,
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
          wakeUpCallbackMode: callbackMode,
          wakeUpThreadId: effectiveThreadId ?? null,
          wakeUpToolMessageId: effectiveToolMessageId ?? null,
          wakeUpModelId: isWakeUp ? (resolvedModelId ?? null) : null,
          wakeUpSkillId: skillId ?? null,
          wakeUpFavoriteId: favoriteId ?? null,
          wakeUpLeafMessageId: effectiveLeafMessageId,
          wakeUpSubAgentDepth: subAgentDepth,
          userId,
          updatedAt: new Date(),
        },
      });
  }
}
