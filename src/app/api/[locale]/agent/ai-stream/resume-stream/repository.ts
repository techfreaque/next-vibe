/**
 * Resume Stream Repository v3
 * Continues an existing thread after an async remote task completes (callbackMode=wakeUp).
 *
 * isStreaming check:
 * - true  → stream is still live; emit TOOL_RESULT WS event so the UI bubble
 *           updates and the running loop picks up the backfilled result naturally.
 * - false → stream is dead; insert a synthetic ASSISTANT + deferred TOOL message
 *           pair into the thread (same sequenceId, model/skill metadata),
 *           emit WS events, then fire a headless "wakeup-resume" stream so the AI
 *           continues the thread seeing the full result in context without any
 *           CONTINUE_CONVERSATION_PROMPT injection.
 *
 * wakeup-resume vs answer-as-ai:
 * - "answer-as-ai" injects CONTINUE_CONVERSATION_PROMPT — wrong for revival
 * - "wakeup-resume" loads DB history normally, finds deferred TOOL as last
 *   context item, and lets the AI respond naturally to it
 *
 * Deferred message chain:
 *   ... → lastAssistantMsg → syntheticAssistant(sequenceId) → deferredTool(sequenceId) → [AI revival]
 *
 * Race safety:
 * - isStreaming is read once. If it flips between read and act the worst outcome
 *   is an extra stream turn or a missed WS event — not data corruption.
 * - Message insertion uses random UUIDs so it is safe to call once.
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import {
  type ToolCall,
  type ToolCallResult,
  chatMessages,
  chatThreads,
} from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { buildMessagesChannel } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/channel";
import { createStreamEvent } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/events";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { publishWsEvent } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { NO_SKILL_ID } from "../../chat/skills/constants";
import { walkToLeafMessage } from "../repository/core/branch-utils";
import { resolveFavorite, runHeadlessAiStream } from "../repository/headless";
import { publishWakeUpSignal } from "../repository/core/wake-up-channel";
import type { AiStreamT } from "../stream/i18n";
import type {
  ResumeStreamRequestOutput,
  ResumeStreamResponseOutput,
} from "./definition";

export class ResumeStreamRepository {
  static async resume(
    data: ResumeStreamRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: AiStreamT,
  ): Promise<ResponseType<ResumeStreamResponseOutput>> {
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

    try {
      // Read thread state — streamingState tells us if the live loop is still running.
      // If state is 'streaming', wait for it to settle (the stream is ending soon —
      // escalateToTask already set 'waiting' in DB; we just need to let the stream
      // finish its finally block before we attempt revival).
      let thread:
        | { streamingState: string | null; rootFolderId: string | null }
        | undefined;
      const maxWaitMs = 10_000;
      const pollIntervalMs = 500;
      const waitStart = Date.now();
      while (true) {
        const [row] = await db
          .select({
            streamingState: chatThreads.streamingState,
            rootFolderId: chatThreads.rootFolderId,
          })
          .from(chatThreads)
          .where(eq(chatThreads.id, threadId))
          .limit(1);
        thread = row;
        const state = row?.streamingState ?? "idle";
        if (state !== "streaming" || Date.now() - waitStart >= maxWaitMs) {
          break;
        }
        logger.info(
          "[ResumeStream] Stream still active — waiting for it to settle",
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

      const streamingState = thread?.streamingState ?? "idle";
      // A live stream is actively running ('streaming'). 'aborting' means user
      // requested cancel — the live stream will die shortly; treat as dead so we
      // don't try to signal a dying stream via publishWakeUpSignal.
      const isLive = streamingState === "streaming";
      const isAborting = streamingState === "aborting";

      // Atomic revival claim: atomically flip streamingState 'idle'→'streaming'.
      // If 0 rows updated, another resume-stream task already claimed this revival slot.
      // This prevents the parallel wakeUp race where two simultaneous completions both
      // try to fire a headless revival on the same thread.
      // Note: we do NOT claim if streamingState='aborting' — that means user cancelled.
      const claimRevival = async (claimThreadId: string): Promise<boolean> => {
        const claimed = await db
          .update(chatThreads)
          .set({ streamingState: "streaming" })
          .where(
            and(
              eq(chatThreads.id, claimThreadId),
              sql`${chatThreads.streamingState} IN ('idle', 'waiting')`,
            ),
          )
          .returning({ id: chatThreads.id });
        return claimed.length > 0;
      };
      // Use the thread's actual rootFolderId for revival so the system prompt tone
      // matches the original conversation context (private/public/shared/cron).
      const threadRootFolderId =
        (thread?.rootFolderId as DefaultFolderId | null) ??
        DefaultFolderId.PRIVATE;

      logger.info("[ResumeStream] State check", {
        threadId,
        toolMessageId,
        isLive,
        isAborting,
        streamingState,
        threadFound: !!thread,
      });

      // If the stream is aborting (user cancelled), skip revival entirely.
      // The live stream's abort handler + finally block will clear streamingState
      // and emit STREAM_FINISHED. No deferred messages or headless revival needed.
      if (isAborting) {
        logger.info(
          "[ResumeStream] Thread is aborting — skipping revival (user cancelled)",
          { threadId, toolMessageId },
        );
        return success({ resumed: false, lastAiMessageId: null });
      }

      // For wakeUp: inject a deferred result message so it appears in the thread UI.
      // Live case:  emit TOOL_RESULT WS event — the running loop already has the
      //             backfilled result in DB and will present it to the AI naturally.
      // Dead case:  insert synthetic ASSISTANT + deferred TOOL messages (same sequenceId,
      //             model/skill metadata), emit WS events, then revive with headless
      //             wakeup-resume stream.
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

        const toolCall = existing?.metadata?.toolCall;
        const effectiveThreadId = existing?.threadId ?? threadId;

        logger.info("[ResumeStream] Tool message lookup", {
          toolMessageId,
          existingFound: !!existing,
          toolCallFound: !!toolCall,
          toolCallStatus: toolCall?.status,
        });

        if (toolCall) {
          const isWakeUpMode = callbackMode === "wakeUp";
          const isWaitMode = callbackMode === "wait";

          // Resolve model + skill (needed for deferred insertion and revival).
          const userId = !user.isPublic ? user.id : undefined;
          let resolvedModel = modelId;
          let resolvedSkill = skillId ?? NO_SKILL_ID;

          if (favoriteId && userId) {
            const resolved = await resolveFavorite(
              favoriteId,
              userId,
              user,
              logger,
              locale,
            );
            if (resolved) {
              resolvedModel = resolvedModel ?? resolved.model;
              resolvedSkill = skillId ?? resolved.skill;
            }
          }

          if (!resolvedModel) {
            logger.error(
              "[ResumeStream] No model resolved — cannot revive stream",
              { threadId, favoriteId, modelId },
            );
            return fail({
              message: t("errors.unexpectedError", {
                error: "No model resolved",
              }),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }

          // ── WAKE_UP mode ─────────────────────────────────────────────────
          // Flow for parallel wakeUp calls:
          // - Both arrive concurrently. We must ensure NO siblings — deferred messages
          //   must form a linear chain (parent → child), never branch off the same parent.
          // - Strategy: insert deferred AFTER we know where we stand in the queue.
          //   The first to claim revival inserts at the current leaf and runs.
          //   The second backs off, re-walks (finding first's deferred + AI response),
          //   then inserts its deferred as a child of that new leaf, then runs.
          if (isWakeUpMode) {
            logger.info("[ResumeStream] wakeUp — starting", {
              toolMessageId,
              hasResult: !!wakeUpResultObj,
              isLive,
            });

            // Idempotency check: if a deferred message already exists for this toolCallId,
            // skip insertion (handles fallback cron task running after live stream already inserted it).
            const originalToolCallId = toolCall.toolCallId;
            const [existingDeferred] = await db
              .select({ id: chatMessages.id })
              .from(chatMessages)
              .where(
                and(
                  eq(chatMessages.threadId, effectiveThreadId),
                  sql`(${chatMessages.metadata}->'toolCall'->>'originalToolCallId') = ${originalToolCallId}`,
                  sql`(${chatMessages.metadata}->'toolCall'->>'isDeferred')::boolean = true`,
                ),
              )
              .limit(1);

            if (existingDeferred) {
              logger.info(
                "[ResumeStream] wakeUp — deferred already exists (fallback cron re-run), skipping",
                { toolMessageId, existingDeferredId: existingDeferred.id },
              );
              return success({ resumed: false, lastAiMessageId: null });
            }

            // wakeUpResult arrives as a parsed object (deepParseJsonStrings in request-validator
            // auto-parses the JSON string from taskInput). Use it directly as ToolCallResult.
            const parsedResult = wakeUpResultObj
              ? (wakeUpResultObj as ToolCallResult)
              : undefined;
            const deferredStatus =
              wakeUpStatus === "completed"
                ? ("completed" as const)
                : ("failed" as const);

            const deferredSequenceId = crypto.randomUUID();
            const deferredId = crypto.randomUUID();

            const deferredToolCall: ToolCall = {
              ...toolCall,
              // Reuse original toolCallId so the AI recognizes this as the result
              // of the tool call it made. The original is superseded (skipped) in
              // message-converter; this deferred one takes its place.
              toolCallId: toolCall.toolCallId,
              result: parsedResult,
              status: deferredStatus,
              originalToolCallId: toolCall.toolCallId,
              callbackMode: "wakeUp",
              isDeferred: true,
              // Do NOT propagate isConfirmed — this is an async background result,
              // not a user-confirmation action. Prevents "Confirmed by you" badge.
              isConfirmed: false,
            };

            // If the thread's live stream is still running, signal it with the full
            // payload. The live stream inserts the deferred message itself in its
            // finally block — this is the only correct place since only one live stream
            // runs per thread, eliminating any concurrent-insertion race.
            if (isLive) {
              publishWakeUpSignal(effectiveThreadId, {
                toolMessageId,
                authorId: existing.authorId,
                originalSequenceId: existing.sequenceId,
                originalToolCall: toolCall,
                wakeUpResult: parsedResult,
                wakeUpStatus,
                resolvedModel,
                resolvedSkill,
                leafMessageId: leafMessageId ?? undefined,
                favoriteId: favoriteId ?? undefined,
              });
              logger.info(
                "[ResumeStream] wakeUp — published wake-up signal to live stream (insertion deferred to stream finally)",
                { threadId: effectiveThreadId, toolMessageId },
              );

              // Cleanup cron tasks — live stream handles insertion + revival, these are no longer needed.
              const liveWakeUpCleanupIds = [wakeUpTaskId, resumeTaskId].filter(
                Boolean,
              ) as string[];
              if (liveWakeUpCleanupIds.length > 0) {
                try {
                  await Promise.all(
                    liveWakeUpCleanupIds.map((id) =>
                      db.delete(cronTasks).where(eq(cronTasks.id, id)),
                    ),
                  );
                  logger.info(
                    "[ResumeStream] Cleaned up cron tasks (live wakeUp signal)",
                    { deletedIds: liveWakeUpCleanupIds },
                  );
                } catch (cleanupErr) {
                  logger.warn(
                    "[ResumeStream] Live wakeUp cleanup failed (non-fatal)",
                    {
                      liveWakeUpCleanupIds,
                      error: parseError(cleanupErr).message,
                    },
                  );
                }
              }

              return success({ resumed: false, lastAiMessageId: null });
            }

            // Stream is dead. Try to claim revival slot first.
            // If we claim it: walk to leaf, insert deferred as child of leaf, run revival.
            // If we don't claim it (sibling beat us): back off until sibling finishes,
            //   re-walk to find sibling's AI response as new leaf, insert our deferred
            //   as child of that new leaf, claim revival, run.
            // This guarantees linear chain: leaf → deferredA → aiResponse1 → deferredB → aiResponse2.

            if (!(await claimRevival(effectiveThreadId))) {
              // Sibling claimed revival first. Back off until it finishes (isStreaming→false).
              logger.info(
                "[ResumeStream] wakeUp — revival claimed by sibling, backing off until sibling finishes",
                { threadId: effectiveThreadId, toolMessageId },
              );

              // Poll until isStreaming=false (sibling finished) or timeout.
              const backoffStart = Date.now();
              const backoffTimeoutMs = 30_000;
              while (Date.now() - backoffStart < backoffTimeoutMs) {
                await new Promise<void>((resolve) => {
                  setTimeout(resolve, 2_000);
                });
                const [currentThread] = await db
                  .select({ streamingState: chatThreads.streamingState })
                  .from(chatThreads)
                  .where(eq(chatThreads.id, effectiveThreadId))
                  .limit(1);
                const siblingState = currentThread?.streamingState;
                if (siblingState === "idle") {
                  break;
                }
                // If thread is aborting (user cancelled), bail out immediately.
                // The aborting stream will clear itself to 'idle', but we should
                // not attempt revival on a cancelled thread.
                if (siblingState === "aborting") {
                  logger.info(
                    "[ResumeStream] wakeUp — thread aborting during backoff, skipping revival",
                    { threadId: effectiveThreadId, toolMessageId },
                  );
                  return success({ resumed: false, lastAiMessageId: null });
                }
              }

              // Retry the claim.
              if (!(await claimRevival(effectiveThreadId))) {
                logger.info(
                  "[ResumeStream] wakeUp — revival claim failed after backoff, giving up",
                  { threadId: effectiveThreadId, toolMessageId },
                );
                return success({ resumed: false, lastAiMessageId: null });
              }
            }

            // We have the revival claim. Now walk to the true current leaf and insert
            // our deferred as its child. This ensures linear chain regardless of order.
            const chainParentId = await walkToLeafMessage(
              effectiveThreadId,
              leafMessageId ?? null,
              toolMessageId,
            );

            // Insert deferred TOOL message with the real async result
            await db.insert(chatMessages).values({
              id: deferredId,
              threadId: effectiveThreadId,
              role: ChatMessageRole.TOOL,
              content: null,
              parentId: chainParentId,
              authorId: existing.authorId,
              sequenceId: deferredSequenceId,
              isAI: true,
              model: resolvedModel,
              skill: resolvedSkill,
              metadata: { toolCall: deferredToolCall },
            });

            // Emit WS events so the UI shows the deferred result bubble
            publishWsEvent(
              {
                channel: buildMessagesChannel(effectiveThreadId),
                event: "message-created",
                data: createStreamEvent.messageCreated({
                  messageId: deferredId,
                  threadId: effectiveThreadId,
                  role: ChatMessageRole.TOOL,
                  parentId: chainParentId,
                  content: null,
                  model: resolvedModel,
                  skill: resolvedSkill,
                  sequenceId: deferredSequenceId,
                  toolCall: deferredToolCall,
                }).data,
              },
              logger,
            );

            publishWsEvent(
              {
                channel: buildMessagesChannel(effectiveThreadId),
                event: "tool-result",
                data: createStreamEvent.toolResult({
                  messageId: deferredId,
                  toolName: deferredToolCall.toolName,
                  result: deferredToolCall.result,
                  error: deferredToolCall.error,
                  toolCall: deferredToolCall,
                }).data,
              },
              logger,
            );

            logger.info("[ResumeStream] wakeUp — deferred message inserted", {
              threadId,
              toolMessageId,
              deferredId,
              chainParentId,
            });

            // Fire wakeup-resume headless stream — loads full DB history (all deferred TOOLs
            // now in chain), AI sees all results naturally without any continuation prompt.
            // Pass favoriteId so the revival streamContext has it set (needed if the AI calls
            // escalateToTask() during revival — otherwise favoriteId would be undefined).
            void runHeadlessAiStream({
              favoriteId: favoriteId ?? undefined,
              model: resolvedModel,
              skill: resolvedSkill,
              prompt: "",
              wakeUpRevival: true,
              explicitParentMessageId: deferredId,
              sequenceIdOverride: deferredSequenceId,
              threadMode: "append",
              threadId: effectiveThreadId,
              rootFolderId: threadRootFolderId,
              user,
              locale,
              logger,
              t,
            })
              .then(async (result) => {
                publishWsEvent(
                  {
                    channel: buildMessagesChannel(threadId),
                    event: "stream-finished",
                    data: createStreamEvent.streamFinished({
                      threadId,
                      reason: "completed",
                      finalState: "idle",
                    }).data,
                  },
                  logger,
                );
                logger.info("[ResumeStream] wakeUp revival complete", {
                  threadId,
                  success: result.success,
                  lastAiMessageId: result.success
                    ? result.data.lastAiMessageId
                    : null,
                });

                // Cleanup: delete the wakeUp task and this resume-stream task.
                const taskIdsToDelete = [wakeUpTaskId, resumeTaskId].filter(
                  Boolean,
                ) as string[];
                if (taskIdsToDelete.length > 0) {
                  try {
                    await Promise.all(
                      taskIdsToDelete.map((id) =>
                        db.delete(cronTasks).where(eq(cronTasks.id, id)),
                      ),
                    );
                    logger.info("[ResumeStream] Cleaned up cron tasks", {
                      deletedIds: taskIdsToDelete,
                    });
                  } catch (cleanupErr) {
                    logger.warn("[ResumeStream] Cleanup failed (non-fatal)", {
                      taskIdsToDelete,
                      error: parseError(cleanupErr).message,
                    });
                  }
                }
                return;
              })
              .catch((err) => {
                logger.error("[ResumeStream] wakeUp headless revival failed", {
                  threadId,
                  error: parseError(err).message,
                });
              });

            return success({ resumed: true, lastAiMessageId: null });
          }

          // ── Non-wakeUp: isLive check ─────────────────────────────────────
          if (isLive) {
            // Stream still running — live loop will pick up the backfilled result.
            // Emit TOOL_RESULT WS so the UI bubble updates immediately.
            publishWsEvent(
              {
                channel: buildMessagesChannel(effectiveThreadId),
                event: "tool-result",
                data: createStreamEvent.toolResult({
                  messageId: toolMessageId,
                  toolName: toolCall.toolName,
                  result: toolCall.result,
                  error: toolCall.error,
                  toolCall,
                }).data,
              },
              logger,
            );

            logger.info(
              "[ResumeStream] Stream live — emitted TOOL_RESULT WS, live loop picks up result",
              { threadId, toolMessageId },
            );

            // Cleanup cron tasks — live stream handles the result, these are no longer needed.
            const liveCleanupIds = [wakeUpTaskId, resumeTaskId].filter(
              Boolean,
            ) as string[];
            if (liveCleanupIds.length > 0) {
              try {
                await Promise.all(
                  liveCleanupIds.map((id) =>
                    db.delete(cronTasks).where(eq(cronTasks.id, id)),
                  ),
                );
                logger.info(
                  "[ResumeStream] Cleaned up cron tasks (live stream)",
                  { deletedIds: liveCleanupIds },
                );
              } catch (cleanupErr) {
                logger.warn("[ResumeStream] Live cleanup failed (non-fatal)", {
                  liveCleanupIds,
                  error: parseError(cleanupErr).message,
                });
              }
            }

            return success({ resumed: false, lastAiMessageId: null });
          }

          // ── WAIT mode (stream dead) ──────────────────────────────────────
          // Result is already backfilled in the original tool message.
          // Emit tool-result WS so UI updates, then fire headless stream.
          if (isWaitMode) {
            // Emit tool-result WS so the UI bubble shows the real result.
            publishWsEvent(
              {
                channel: buildMessagesChannel(effectiveThreadId),
                event: "tool-result",
                data: createStreamEvent.toolResult({
                  messageId: toolMessageId,
                  toolName: toolCall.toolName,
                  result: toolCall.result,
                  error: toolCall.error,
                  toolCall,
                }).data,
              },
              logger,
            );

            logger.info(
              "[ResumeStream] WAIT mode — emitted tool-result WS, firing headless stream",
              { threadId, toolMessageId, resolvedModel },
            );

            // Atomic revival claim: flip isStreaming false→true. If another resume-stream
            // task already claimed this thread (parallel wakeUp/wait race), skip.
            if (!(await claimRevival(effectiveThreadId))) {
              logger.info(
                "[ResumeStream] WAIT — revival already claimed by another task, skipping",
                { threadId: effectiveThreadId, toolMessageId },
              );
              return success({ resumed: false, lastAiMessageId: null });
            }

            void runHeadlessAiStream({
              favoriteId: favoriteId ?? undefined,
              model: resolvedModel,
              skill: resolvedSkill,
              prompt: "",
              wakeUpRevival: true,
              explicitParentMessageId: toolMessageId,
              sequenceIdOverride: existing.sequenceId ?? undefined,
              threadMode: "append",
              threadId: effectiveThreadId,
              rootFolderId: threadRootFolderId,
              user,
              locale,
              logger,
              t,
            })
              .then(async (result) => {
                publishWsEvent(
                  {
                    channel: buildMessagesChannel(threadId),
                    event: "stream-finished",
                    data: createStreamEvent.streamFinished({
                      threadId,
                      reason: "completed",
                      finalState: "idle",
                    }).data,
                  },
                  logger,
                );
                logger.info("[ResumeStream] WAIT revival complete", {
                  threadId,
                  success: result.success,
                  lastAiMessageId: result.success
                    ? result.data.lastAiMessageId
                    : null,
                });

                // Cleanup cron tasks
                const taskIdsToDelete = [wakeUpTaskId, resumeTaskId].filter(
                  Boolean,
                ) as string[];
                if (taskIdsToDelete.length > 0) {
                  try {
                    await Promise.all(
                      taskIdsToDelete.map((id) =>
                        db.delete(cronTasks).where(eq(cronTasks.id, id)),
                      ),
                    );
                    logger.info("[ResumeStream] Cleaned up cron tasks", {
                      deletedIds: taskIdsToDelete,
                    });
                  } catch (cleanupErr) {
                    logger.warn("[ResumeStream] Cleanup failed (non-fatal)", {
                      taskIdsToDelete,
                      error: parseError(cleanupErr).message,
                    });
                  }
                }
                return;
              })
              .catch((err) => {
                logger.error("[ResumeStream] WAIT headless revival failed", {
                  threadId,
                  error: parseError(err).message,
                });
              });

            return success({ resumed: true, lastAiMessageId: null });
          }
        } else {
          logger.warn(
            "[ResumeStream] toolMessageId provided but message/toolCall not found",
            {
              threadId,
              toolMessageId,
            },
          );
        }
      }

      if (isLive) {
        // No toolMessageId path — just bail, live loop handles everything.
        logger.info("[ResumeStream] Stream still live — skipping resume", {
          threadId,
        });
        return success({ resumed: false, lastAiMessageId: null });
      }

      // No toolMessageId + stream dead: nothing to do.
      logger.info("[ResumeStream] No toolMessageId and stream dead — no-op", {
        threadId,
      });
      return success({ resumed: false, lastAiMessageId: null });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[ResumeStream] Failed", { threadId, error: msg });
      return fail({
        message: t("errors.unexpectedError", { error: msg }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
