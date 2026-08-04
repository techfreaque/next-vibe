import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";

import type { ChatModelId } from "../../agent/ai-stream/models";
import { resolveModelSkill } from "../../agent/ai-stream/repository/core/modality-resolver";
import {
  claimRevivalSlot,
  resetStreamingToIdle as resetStreamingToIdleShared,
} from "../../agent/ai-stream/repository/core/stream";
import { walkToLeafMessage } from "../../agent/ai-stream/repository/core/tree-walk";
import {
  emitStreamFinished,
  fireWakeUpRevival,
  insertDeferredWakeUpMessage,
  publishWakeUpSignal,
  type WakeUpPayload,
} from "../../agent/ai-stream/repository/revival/revival";
import type { AiStreamT } from "../../agent/ai-stream/stream/i18n";
import { scopedTranslation as aiStreamScopedTranslation } from "../../agent/ai-stream/stream/i18n";
import { chatMessages, chatThreads, type ToolCall } from "../../agent/chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../agent/chat/enum";
import { createMessagesEmitter } from "../../agent/chat/threads/[threadId]/messages/emitter";
import type { FavoriteConfig } from "../../agent/skills/favorites/db";
import type { CountryLanguage } from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import { db } from "../../database";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { CronTasksRepository } from "../../tasks/cron/repository";
import {
  endpoints as revivalEndpoints,
  type RevivalRequestOutput,
  type RevivalResponseOutput,
} from "./definition";
import type { RevivalT } from "./i18n";

export class RevivalRepository {
  /** Emit the backfilled tool result to the thread's messages channel so the
   *  frontend bubble updates. Same event for every callbackMode. */
  private static emitToolResult(params: {
    threadId: string;
    rootFolderId: DefaultFolderId;
    toolMessageId: string;
    toolCall: ToolCall;
    logger: EndpointLogger;
    user: JwtPayloadType;
  }): void {
    createMessagesEmitter(params.logger, params.user, {
      threadId: params.threadId,
      rootFolderId: params.rootFolderId,
    })("tool-result", {
      responseData: {
        messages: [
          { id: params.toolMessageId, metadata: { toolCall: params.toolCall } },
        ],
      },
    });
  }

  /**
   * Grace period before actually deleting a completed cron task row. A
   * client-side retry or duplicate completion report arriving within this
   * window still finds the row and hits the idempotency check in
   * TaskReportRepository (execute-tool/complete/repository.ts) instead of a
   * false "task not found" - deleting synchronously on first completion was
   * destroying the very state that check needs to detect retries.
   */
  private static readonly CLEANUP_GRACE_PERIOD_MS = 60_000;

  /** Delete cron task rows by id — best-effort, non-fatal, deferred (see CLEANUP_GRACE_PERIOD_MS). */
  private static async cleanupCronTasks(
    taskIds: Array<string | null | undefined>,
    logger: EndpointLogger,
  ): Promise<void> {
    const ids = taskIds.filter((id): id is string => Boolean(id));
    if (ids.length === 0) {
      return;
    }
    setTimeout(() => {
      void (async (): Promise<void> => {
        try {
          await CronTasksRepository.deleteByIds(ids);
          logger.debug("[Revival] Cleaned up cron tasks", { taskIds: ids });
        } catch (cleanupErr) {
          logger.warn("[Revival] Cleanup failed (non-fatal)", {
            taskIds: ids,
            error: parseError(cleanupErr).message,
          });
        }
      })();
    }, RevivalRepository.CLEANUP_GRACE_PERIOD_MS);
  }

  /**
   * The shared tail of EVERY revival path: fire the headless wakeUp-revival
   * turn from the given parent, emit stream-finished (thread → idle), and shape
   * the {resumed, lastAiMessageId} result. All three fire-paths (wakeUp
   * fresh/existing-deferred, WAIT) differ only in the parent they revive from.
   */
  private static async fireRevivalAndFinish(params: {
    threadId: string;
    rootFolderId: DefaultFolderId;
    subFolderId?: string;
    explicitParentMessageId: string;
    sequenceIdOverride?: string;
    model: ChatModelId;
    skill: string;
    favoriteId?: string;
    favoriteConfig: FavoriteConfig | null;
    subAgentDepth: number;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    t: AiStreamT;
    abortSignal: AbortSignal;
  }): Promise<{ resumed: boolean; lastAiMessageId: string | null }> {
    const { threadId, rootFolderId, logger, user } = params;
    const result = await fireWakeUpRevival({
      favoriteId: params.favoriteId,
      favoriteConfig: params.favoriteConfig,
      model: params.model,
      skill: params.skill,
      explicitParentMessageId: params.explicitParentMessageId,
      sequenceIdOverride: params.sequenceIdOverride,
      threadId,
      rootFolderId,
      subFolderId: params.subFolderId,
      subAgentDepth: params.subAgentDepth,
      user,
      locale: params.locale,
      logger,
      t: params.t,
      abortSignal: params.abortSignal,
    });
    await emitStreamFinished({
      threadId,
      state: ThreadStreamingState.IDLE,
      updatedAt: new Date(),
      rootFolderId,
      logger,
      user,
    });
    return {
      resumed: result.success,
      lastAiMessageId: result.success ? result.data.lastAiMessageId : null,
    };
  }

  /** Find the deferred TOOL message for a wakeUp tool call (idempotency probe). */
  private static async findDeferred(
    threadId: string,
    originalToolCallId: string,
  ): Promise<{ id: string; sequenceId: string | null } | undefined> {
    const [row] = await db
      .select({ id: chatMessages.id, sequenceId: chatMessages.sequenceId })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.threadId, threadId),
          sql`(${chatMessages.metadata}->'toolCall'->>'originalToolCallId') = ${originalToolCallId}`,
          sql`(${chatMessages.metadata}->'toolCall'->>'isDeferred')::boolean = true`,
        ),
      )
      .limit(1);
    return row;
  }

  /**
   * Claim the thread, insert the deferred TOOL message, fire a headless stream,
   * emit stream-finished. Idempotent on cron retry (checks existing deferred).
   * Returns `claimed: false` if slot is taken — caller yields; cron retries.
   */
  private static async fireDeadStreamRevival(params: {
    payload: WakeUpPayload;
    threadId: string;
    rootFolderId: DefaultFolderId;
    subFolderId?: string;
    subAgentDepth: number;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    t: AiStreamT;
    abortSignal: AbortSignal;
    favoriteConfig: FavoriteConfig | null;
    claimRunId: string;
  }): Promise<
    | { claimed: false }
    | { claimed: true; resumed: boolean; lastAiMessageId: string | null }
  > {
    const {
      payload,
      threadId,
      rootFolderId,
      subFolderId,
      subAgentDepth,
      user,
      locale,
      logger,
      t,
      abortSignal,
      favoriteConfig,
      claimRunId,
    } = params;

    const originalToolCallId = payload.originalToolCall.toolCallId;

    // The parent to revive from: the deferred TOOL message. Reuse an existing
    // one (cron retry) or insert a fresh one — the claim + fire tail is shared.
    const existingDeferred = await RevivalRepository.findDeferred(
      threadId,
      originalToolCallId,
    );

    if (existingDeferred) {
      // Fully idempotent: deferred AND a revival response already exist.
      const [existingResponse] = await db
        .select({ id: chatMessages.id })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.parentId, existingDeferred.id),
          ),
        )
        .limit(1);
      if (existingResponse) {
        logger.debug("[Revival] deferred+response exist — fully idempotent", {
          threadId,
          toolMessageId: payload.toolMessageId,
        });
        return {
          claimed: true,
          resumed: false,
          lastAiMessageId: existingResponse.id,
        };
      }
    }

    // Claim the slot before any insert/fire.
    if (!(await claimRevivalSlot(threadId, claimRunId, logger, user))) {
      return { claimed: false };
    }

    let parentId: string;
    let parentSequenceId: string | undefined;
    if (existingDeferred) {
      parentId = existingDeferred.id;
      parentSequenceId = existingDeferred.sequenceId ?? undefined;
    } else {
      // Post-claim idempotency: another process may have inserted the deferred
      // while we waited for the claim (live-injection race). Release and yield.
      const postClaimDeferred = await RevivalRepository.findDeferred(
        threadId,
        originalToolCallId,
      );
      if (postClaimDeferred) {
        logger.debug(
          "[Revival] deferred appeared during claim — releasing, idempotent",
          { threadId, toolMessageId: payload.toolMessageId },
        );
        await resetStreamingToIdleShared(
          threadId,
          ThreadStreamingState.STREAMING,
          rootFolderId,
          logger,
          user,
        );
        return { claimed: true, resumed: false, lastAiMessageId: null };
      }
      const inserted = await insertDeferredWakeUpMessage(
        threadId,
        payload,
        logger,
        user,
      );
      parentId = inserted.deferredId;
      parentSequenceId = inserted.deferredSequenceId;
    }

    const { resumed, lastAiMessageId } =
      await RevivalRepository.fireRevivalAndFinish({
        threadId,
        rootFolderId,
        subFolderId,
        explicitParentMessageId: parentId,
        sequenceIdOverride: parentSequenceId,
        model: payload.resolvedModel,
        skill: payload.resolvedSkill,
        favoriteId: payload.favoriteId,
        favoriteConfig,
        subAgentDepth,
        user,
        locale,
        logger,
        t,
        abortSignal,
      });
    return { claimed: true, resumed, lastAiMessageId };
  }

  /**
   * Claim the thread, walk to the leaf from the tool message, fire a headless
   * stream. No deferred insertion — the WAIT path fires from the existing tool
   * message directly.
   * Returns `claimed: false` if slot is taken — caller yields; cron retries.
   */
  private static async fireWaitModeRevival(params: {
    toolMessageId: string;
    threadId: string;
    rootFolderId: DefaultFolderId;
    subFolderId?: string;
    sequenceIdOverride?: string;
    model: ChatModelId;
    skill: string;
    favoriteId?: string;
    favoriteConfig: FavoriteConfig | null;
    subAgentDepth: number;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    t: AiStreamT;
    abortSignal: AbortSignal;
    claimRunId: string;
  }): Promise<
    | { claimed: false }
    | { claimed: true; resumed: boolean; lastAiMessageId: string | null }
  > {
    const {
      toolMessageId,
      threadId,
      rootFolderId,
      subFolderId,
      sequenceIdOverride,
      model,
      skill,
      favoriteId,
      favoriteConfig,
      subAgentDepth,
      user,
      locale,
      logger,
      t,
      abortSignal,
      claimRunId,
    } = params;

    if (!(await claimRevivalSlot(threadId, claimRunId, logger, user))) {
      return { claimed: false };
    }

    // WAIT fires from the tool message's current leaf (no deferred insertion).
    const parentId = await walkToLeafMessage(
      threadId,
      toolMessageId,
      toolMessageId,
    );

    try {
      const { resumed, lastAiMessageId } =
        await RevivalRepository.fireRevivalAndFinish({
          threadId,
          rootFolderId,
          subFolderId,
          explicitParentMessageId: parentId,
          sequenceIdOverride,
          model,
          skill,
          favoriteId,
          favoriteConfig,
          subAgentDepth,
          user,
          locale,
          logger,
          t,
          abortSignal,
        });
      return { claimed: true, resumed, lastAiMessageId };
    } catch (err) {
      await resetStreamingToIdleShared(
        threadId,
        ThreadStreamingState.STREAMING,
        rootFolderId,
        logger,
        user,
      );
      logger.error("[Revival] WAIT mode: stream error after claim", {
        threadId,
        toolMessageId,
        error: parseError(err).message,
      });
      return { claimed: true, resumed: false, lastAiMessageId: null };
    }
  }

  static async resume(
    data: RevivalRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: RevivalT,
    abortSignal: AbortSignal,
    subAgentDepth: number,
  ): Promise<ResponseType<RevivalResponseOutput>> {
    const {
      threadId,
      favoriteId,
      modelId,
      skillId,
      callbackMode,
      wakeUpToolMessageId: toolMessageId,
      wakeUpResult: wakeUpResultObj,
      wakeUpStatus,
      wakeUpTaskId,
      resumeTaskId,
      leafMessageId,
    } = data;

    // The caller's abortSignal is intentionally NOT propagated: a revival is an
    // independent turn (the original stream's signal is usually already aborted).
    // A fresh, never-triggered signal keeps the revival stream running to end.
    void abortSignal;
    const revivalAbortSignal = new AbortController().signal;
    const { t: aiStreamT } = aiStreamScopedTranslation.scopedT(locale);

    try {
      // Poll briefly to let an active stream finish before we try to revive.
      let thread:
        | {
            streamingState: ThreadStreamingState | null;
            rootFolderId: DefaultFolderId;
            folderId: string | null;
          }
        | undefined;
      const maxWaitMs = 3_000;
      const pollIntervalMs = 500;
      const waitStart = Date.now();
      while (true) {
        const [row] = await db
          .select({
            streamingState: chatThreads.streamingState,
            rootFolderId: chatThreads.rootFolderId,
            folderId: chatThreads.folderId,
          })
          .from(chatThreads)
          .where(eq(chatThreads.id, threadId))
          .limit(1);
        thread = row;
        const state = row?.streamingState ?? ThreadStreamingState.IDLE;
        if (
          state !== ThreadStreamingState.STREAMING ||
          Date.now() - waitStart >= maxWaitMs
        ) {
          break;
        }
        logger.debug(
          "[Revival] Stream still active - waiting for it to settle",
          {
            threadId,
            streamingState: state,
            elapsedMs: Date.now() - waitStart,
          },
        );
        await new Promise<void>((resolve) => {
          setTimeout(resolve, pollIntervalMs);
        });
      }

      // A wakeUp cron run intercepted by await-task (converted to WAIT mode).
      if (wakeUpTaskId && callbackMode === "wakeUp") {
        const parkedId = `resume-stream-parked-${wakeUpTaskId}`;
        const parkedTask = await CronTasksRepository.findByIdTyped(
          revivalEndpoints.POST,
          parkedId,
        );
        const parkedCallbackMode = parkedTask?.taskInput.callbackMode ?? null;
        if (parkedCallbackMode === "wait") {
          logger.debug(
            "[Revival] wakeUp task intercepted by await-task - skipping revival",
            {
              wakeUpTaskId,
              parkedId,
            },
          );
          return success({ resumed: false, lastAiMessageId: null });
        }
      }

      const streamingState =
        thread?.streamingState ?? ThreadStreamingState.IDLE;
      const isLive = streamingState === ThreadStreamingState.STREAMING;
      const isAborting = streamingState === ThreadStreamingState.ABORTING;
      const threadRootFolderId =
        thread?.rootFolderId ?? DefaultFolderId.PRIVATE;
      const threadSubFolderId = thread?.folderId ?? undefined;

      logger.debug("[Revival] State check", {
        threadId,
        toolMessageId,
        isLive,
        isAborting,
        streamingState,
        threadFound: !!thread,
      });

      if (isAborting) {
        logger.debug("[Revival] Thread is aborting - skipping revival", {
          threadId,
        });
        return success({ resumed: false, lastAiMessageId: null });
      }

      if (toolMessageId) {
        const [existing] = await db
          .select({
            metadata: chatMessages.metadata,
            threadId: chatMessages.threadId,
            authorId: chatMessages.authorId,
            sequenceId: chatMessages.sequenceId,
          })
          .from(chatMessages)
          .where(eq(chatMessages.id, toolMessageId))
          .limit(1);

        let toolCall = existing?.metadata?.toolCall;
        let resolvedToolMessageId = toolMessageId;
        let resolvedExisting = existing;
        const effectiveThreadId = existing?.threadId ?? threadId;

        // If the given message is an assistant wrapper rather than the TOOL
        // message, find the child TOOL message with the actual toolCall.
        if (existing && !toolCall) {
          const [childToolMsg] = await db
            .select({
              id: chatMessages.id,
              metadata: chatMessages.metadata,
              threadId: chatMessages.threadId,
              authorId: chatMessages.authorId,
              sequenceId: chatMessages.sequenceId,
            })
            .from(chatMessages)
            .where(
              and(
                eq(chatMessages.parentId, toolMessageId),
                eq(chatMessages.role, ChatMessageRole.TOOL),
              ),
            )
            .limit(1);
          if (childToolMsg?.metadata?.toolCall) {
            toolCall = childToolMsg.metadata.toolCall;
            resolvedToolMessageId = childToolMsg.id;
            resolvedExisting = childToolMsg;
            logger.debug(
              "[Revival] Resolved toolCall from TOOL child of assistant message",
              {
                originalMessageId: toolMessageId,
                resolvedToolMessageId,
              },
            );
          }
        }

        logger.debug("[Revival] Tool message lookup", {
          toolMessageId,
          resolvedToolMessageId,
          existingFound: !!existing,
          toolCallFound: !!toolCall,
          toolCallStatus: toolCall?.status,
        });

        if (toolCall) {
          const isWakeUpMode = callbackMode === "wakeUp";
          const isWaitMode = callbackMode === "wait";

          // Canonical model+skill resolution — EXACTLY ONE source. The original
          // turn already resolved its model, so a stored modelId is the source
          // (source-1, with skillId as its label); the favorite/skill are NOT
          // competing sources here. Only when NO modelId was stored do we fall
          // back to resolving from favoriteId (the favorite-only original turn).
          //
          // LOOP-REMOTE fallback: a wakeUp dispatched inside a relayed executor
          // loop settles in a goroutine whose toolExecutionContext carries no model/
          // favorite/skill (the executor resolves its OWN identity per turn and
          // never stamps them onto the async task). Without a source the revival
          // failed with "No model resolved". The THREAD itself ran the turn, so
          // its persisted defaultModel/defaultSkill IS the resolved identity —
          // fall back to it before giving up.
          let effectiveModelId = modelId;
          let effectiveSkillId = skillId;
          if (!effectiveModelId && !favoriteId) {
            // The async task carried no model (loop-remote wakeUp: the executor
            // goroutine never stamps model/favorite onto the task). Resolve the
            // CONVERSATION's model from the thread's assistant messages — the
            // MOST FREQUENT one, NOT the latest. The latest is unreliable: a
            // `rename-thread` auto-title runs on a DIFFERENT internal model (e.g.
            // gpt-55) and its message is newest, so "last assistant model" picked
            // the wrong model → the revival ran on it and misjudged (observed:
            // FAILED verdict + a spurious rename). The dominant model is the one
            // the actual turns used. Fall back to the thread default if none.
            const lastAsstRows = await db
              .select({
                model: chatMessages.model,
                cnt: sql<number>`count(*)::int`,
              })
              .from(chatMessages)
              .where(
                and(
                  eq(chatMessages.threadId, threadId),
                  eq(chatMessages.role, ChatMessageRole.ASSISTANT),
                  sql`${chatMessages.model} IS NOT NULL`,
                ),
              )
              .groupBy(chatMessages.model)
              .orderBy(sql`count(*) DESC`)
              .limit(1);
            const lastAsst = lastAsstRows[0];
            const [threadDefaults] = await db
              .select({
                defaultModel: chatThreads.defaultModel,
                defaultSkill: chatThreads.defaultSkill,
              })
              .from(chatThreads)
              .where(eq(chatThreads.id, threadId))
              .limit(1);
            effectiveModelId =
              ((lastAsst?.model ??
                threadDefaults?.defaultModel) as ChatModelId | null) ??
              undefined;
            effectiveSkillId =
              effectiveSkillId ?? threadDefaults?.defaultSkill ?? undefined;
          }
          const resolved = await resolveModelSkill({
            model: effectiveModelId ?? undefined,
            skill: effectiveModelId
              ? (effectiveSkillId ?? undefined)
              : undefined,
            favoriteId: effectiveModelId ? undefined : favoriteId,
            favoriteConfig: null,
            user,
            locale,
            logger,
            t: aiStreamT,
          });

          if (!resolved.success) {
            logger.error("[Revival] No model resolved - cannot revive stream", {
              threadId,
              favoriteId,
              modelId,
            });
            return fail({
              message: t("errors.modelNotResolved"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }

          const resolvedModel = resolved.data.model;
          const resolvedSkill = resolved.data.skill;
          const resolvedFavoriteConfig = resolved.data.favoriteConfig;

          if (isWakeUpMode) {
            logger.debug("[Revival] wakeUp - starting", {
              toolMessageId,
              hasResult: !!wakeUpResultObj,
              isLive,
            });

            // Live stream: inject the wakeUp result directly into the running stream.
            if (isLive) {
              const signaled = publishWakeUpSignal(effectiveThreadId, {
                toolMessageId,
                authorId:
                  resolvedExisting?.authorId ?? existing?.authorId ?? null,
                originalSequenceId: existing?.sequenceId ?? null,
                originalToolCall: toolCall,
                wakeUpResult: wakeUpResultObj ?? undefined,
                wakeUpStatus,
                resolvedModel,
                resolvedSkill,
                leafMessageId: leafMessageId ?? undefined,
                favoriteId: favoriteId ?? undefined,
              });

              if (signaled) {
                logger.debug(
                  "[Revival] wakeUp - published wake-up signal to live stream",
                  {
                    threadId: effectiveThreadId,
                    toolMessageId,
                  },
                );
                void RevivalRepository.cleanupCronTasks([wakeUpTaskId], logger);
                return success({ resumed: false, lastAiMessageId: null });
              }

              logger.debug(
                "[Revival] wakeUp - isLive but no handler (stream just ended), falling through to dead-stream revival",
                { threadId: effectiveThreadId, toolMessageId },
              );
            }

            // Dead stream: fireDeadStreamRevival handles idempotency, claim,
            // deferred insert, headless stream, and stream-finished emit.
            // Returns claimed:false if a sibling holds the slot — cron retries.
            const deadResult = await RevivalRepository.fireDeadStreamRevival({
              payload: {
                toolMessageId: resolvedToolMessageId,
                authorId:
                  resolvedExisting?.authorId ?? existing?.authorId ?? null,
                originalSequenceId:
                  resolvedExisting?.sequenceId ?? existing?.sequenceId ?? null,
                originalToolCall: toolCall,
                wakeUpResult: wakeUpResultObj ?? undefined,
                wakeUpStatus,
                resolvedModel,
                resolvedSkill,
                leafMessageId: leafMessageId ?? undefined,
                favoriteId: favoriteId ?? undefined,
              },
              threadId: effectiveThreadId,
              rootFolderId: threadRootFolderId,
              subFolderId: threadSubFolderId,
              subAgentDepth,
              user,
              locale,
              logger,
              t: aiStreamT,
              abortSignal: revivalAbortSignal,
              favoriteConfig: resolvedFavoriteConfig,
              claimRunId: crypto.randomUUID(),
            });

            if (!deadResult.claimed) {
              logger.debug(
                "[Revival] wakeUp - claim taken by sibling, yielding (cron retries)",
                {
                  threadId: effectiveThreadId,
                  toolMessageId,
                },
              );
              return success({ resumed: false, lastAiMessageId: null });
            }

            void RevivalRepository.cleanupCronTasks([wakeUpTaskId], logger);
            return success({
              resumed: deadResult.resumed,
              lastAiMessageId: deadResult.lastAiMessageId,
            });
          }

          // WAIT mode: the await-task tool message was written with a PENDING
          // placeholder result when the task was still running (await-task
          // returned {status:pending, waiting:true}). Now that the task has
          // completed, backfill the REAL result into that message in-place
          // before emitting/reviving — otherwise the tool message keeps the
          // stale pending shape and the AI (and assertions) never see the
          // resolved output. `wakeUpResultObj` carries the completed task's
          // output (merged into the parked task by enableAndFireParkedResumeTask).
          if (isWaitMode) {
            if (wakeUpResultObj !== undefined && wakeUpResultObj !== null) {
              const backfilledStatus =
                wakeUpStatus === "failed"
                  ? ("failed" as const)
                  : ("completed" as const);
              toolCall = {
                ...toolCall,
                result: wakeUpResultObj,
                status: backfilledStatus,
                isPartial: false,
              };
              await db
                .update(chatMessages)
                .set({
                  metadata: {
                    ...resolvedExisting?.metadata,
                    toolCall,
                  },
                  updatedAt: new Date(),
                })
                .where(eq(chatMessages.id, resolvedToolMessageId));
              logger.debug(
                "[Revival] WAIT mode - backfilled await-task message with completed result",
                { threadId, toolMessageId: resolvedToolMessageId },
              );
            }

            // Emit tool-result WS so the frontend sees it, then fire a headless stream.
            RevivalRepository.emitToolResult({
              threadId: effectiveThreadId,
              rootFolderId: threadRootFolderId,
              toolMessageId,
              toolCall,
              logger,
              user,
            });

            logger.debug(
              "[Revival] WAIT mode - emitted tool-result WS, firing headless stream",
              {
                threadId,
                toolMessageId,
                resolvedModel,
              },
            );

            const waitResult = await RevivalRepository.fireWaitModeRevival({
              toolMessageId: resolvedToolMessageId,
              threadId: effectiveThreadId,
              rootFolderId: threadRootFolderId,
              subFolderId: threadSubFolderId,
              sequenceIdOverride: resolvedExisting?.sequenceId ?? undefined,
              model: resolvedModel,
              skill: resolvedSkill,
              favoriteId: favoriteId ?? undefined,
              favoriteConfig: resolvedFavoriteConfig,
              subAgentDepth,
              user,
              locale,
              logger,
              t: aiStreamT,
              abortSignal: revivalAbortSignal,
              claimRunId: crypto.randomUUID(),
            });

            if (!waitResult.claimed) {
              logger.debug(
                "[Revival] WAIT - claim taken by sibling, yielding (cron retries)",
                {
                  threadId: effectiveThreadId,
                  toolMessageId,
                },
              );
              return success({ resumed: false, lastAiMessageId: null });
            }

            if (waitResult.resumed) {
              // Clean up any error messages that were placed while the tool ran.
              void db
                .delete(chatMessages)
                .where(
                  and(
                    eq(chatMessages.parentId, resolvedToolMessageId),
                    eq(chatMessages.role, ChatMessageRole.ERROR),
                  ),
                )
                .catch(() => undefined);
              await RevivalRepository.cleanupCronTasks(
                [resumeTaskId, wakeUpTaskId],
                logger,
              );
            }

            return success({
              resumed: waitResult.resumed,
              lastAiMessageId: waitResult.lastAiMessageId,
            });
          }

          // Non-wakeUp, non-WAIT: emit tool-result WS and let the running or
          // idle stream pick it up naturally.
          RevivalRepository.emitToolResult({
            threadId: effectiveThreadId,
            rootFolderId: threadRootFolderId,
            toolMessageId,
            toolCall,
            logger,
            user,
          });

          logger.debug(
            "[Revival] emitted TOOL_RESULT WS, live loop picks up result",
            {
              threadId,
              toolMessageId,
              isLive,
            },
          );

          await RevivalRepository.cleanupCronTasks(
            [resumeTaskId, wakeUpTaskId],
            logger,
          );
          return success({ resumed: false, lastAiMessageId: null });
        }
        logger.warn(
          "[Revival] toolMessageId provided but message/toolCall not found",
          {
            threadId,
            toolMessageId,
          },
        );
      }

      if (isLive) {
        logger.debug("[Revival] Stream still live - skipping resume", {
          threadId,
        });
        return success({ resumed: false, lastAiMessageId: null });
      }

      if (streamingState === ThreadStreamingState.WAITING) {
        try {
          await resetStreamingToIdleShared(
            threadId,
            ThreadStreamingState.WAITING,
            threadRootFolderId,
            logger,
            user,
          );
          logger.debug(
            "[Revival] Cleared thread from waiting to idle (no-op path)",
            { threadId },
          );
        } catch (clearErr) {
          logger.warn("[Revival] Failed to clear waiting thread state", {
            threadId,
            error: parseError(clearErr).message,
          });
        }
      }

      logger.debug("[Revival] No toolMessageId and stream dead - no-op", {
        threadId,
      });
      return success({ resumed: false, lastAiMessageId: null });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[Revival] Failed", { threadId, error: msg });
      return fail({
        message: t("errors.unexpectedError", { error: msg }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
