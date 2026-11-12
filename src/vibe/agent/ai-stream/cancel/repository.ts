/**
 * AI Stream Cancel Repository
 * Handles cancellation of active AI streams with ownership verification.
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { REVIVAL_ALIAS as RESUME_STREAM_ALIAS } from "next-vibe/execute-tool/revival/definition";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { CronTaskStatus } from "next-vibe/tasks/enum";

import type { DefaultFolderId } from "../../../core/execution-context";
import { chatMessages, chatThreads } from "../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../chat/enum";
import { createMessagesEmitter } from "../../chat/threads/[threadId]/messages/emitter";
import { MessagesRepository } from "../../chat/threads/[threadId]/messages/repository";
import { StreamErrorType } from "../repository/core/constants";
import { buildSseMessageRow } from "../repository/core/db-writer/sse-row";
import {
  clearStreamingState,
  setStreamingStateAborting,
} from "../repository/core/stream";
import { StreamControl } from "../repository/core/stream-control";
import type {
  AiStreamCancelPostRequestOutput,
  AiStreamCancelPostResponseOutput,
} from "./definition";
import type { AiStreamCancelT } from "./i18n";

/** How long a cancelled stream gets to finalize itself before the cancel
 *  path treats it as orphaned. Below the client's 15s safety timeout. */
const ORPHAN_REAP_DELAY_MS = 8000;

export class cancelRepository {
  /**
   * Check if the user is the owner of the thread.
   * Supports both authenticated users (userId match) and public users (leadId match).
   */
  private static isThreadOwner(
    user: JwtPayloadType,
    thread: { userId: string | null; leadId: string | null },
  ): boolean {
    // Authenticated user: match userId
    if (!user.isPublic && "id" in user && user.id && thread.userId) {
      return user.id === thread.userId;
    }
    // Public user: match leadId
    if (user.isPublic && user.leadId && thread.leadId) {
      return user.leadId === thread.leadId;
    }
    return false;
  }

  /**
   * After a cancel was delivered to a 'streaming' thread, verify a live stream
   * actually finalized it. Still ABORTING with the SAME run claim after
   * ORPHAN_REAP_DELAY_MS means no process owns the stream any more: clear the
   * state (owner-guarded, so a newer stream's claim is never clobbered) and
   * emit stream-finished so every client unlocks.
   */
  private static scheduleOrphanReap(params: {
    threadId: string;
    rootFolderId: DefaultFolderId;
    runId: string | null;
    user: JwtPayloadType;
    logger: EndpointLogger;
  }): void {
    const { threadId, rootFolderId, runId, user, logger } = params;
    const cancelledAt = Date.now();
    setTimeout(() => {
      void (async (): Promise<void> => {
        try {
          const [current] = await db
            .select({
              streamingState: chatThreads.streamingState,
              streamingRunId: chatThreads.streamingRunId,
            })
            .from(chatThreads)
            .where(eq(chatThreads.id, threadId))
            .limit(1);
          if (
            !current ||
            current.streamingState !== ThreadStreamingState.ABORTING ||
            current.streamingRunId !== runId
          ) {
            // Finalized normally (or a newer stream took over) - nothing to do.
            return;
          }
          logger.warn(
            "[Cancel] No live stream finalized the cancel - clearing orphaned streaming state",
            {
              threadId,
              runId,
              elapsedMs: Date.now() - cancelledAt,
              reapDelayMs: ORPHAN_REAP_DELAY_MS,
            },
          );
          const cleared = await clearStreamingState(
            threadId,
            logger,
            user,
            runId ?? undefined,
          );
          if (cleared.superseded) {
            return;
          }
          createMessagesEmitter(logger, user, {
            threadId,
            rootFolderId,
          })("stream-finished", {
            responseData: { streamingState: cleared.state },
          });
        } catch (error) {
          logger.error("[Cancel] Orphaned-stream reap failed", {
            threadId,
            runId,
            error: parseError(error).message,
          });
        }
      })();
    }, ORPHAN_REAP_DELAY_MS);
  }

  static async cancelStream(
    data: AiStreamCancelPostRequestOutput,
    user: JwtPayloadType,
    t: AiStreamCancelT,
    logger: EndpointLogger,
  ): Promise<ResponseType<AiStreamCancelPostResponseOutput>> {
    try {
      const { threadId } = data;

      // Look up the thread to verify ownership + read its streaming state (the
      // cross-process truth of whether a stream is live, replacing the old
      // in-process registry lookup).
      const [thread] = await db
        .select({
          id: chatThreads.id,
          userId: chatThreads.userId,
          leadId: chatThreads.leadId,
          rootFolderId: chatThreads.rootFolderId,
          streamingState: chatThreads.streamingState,
          streamingRunId: chatThreads.streamingRunId,
          loopInstanceId: chatThreads.loopInstanceId,
        })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      if (!thread) {
        // Incognito (client-only) threads are never written to DB. The threadId
        // itself is the ownership proof. Deliver a cancel on the thread's control
        // channel — the running stream (this process, or another via the redis
        // bus) aborts itself. Fire-and-forget: no live stream simply has no reactor.
        StreamControl.deliver(threadId, "cancel", user, logger);
        logger.info("[Cancel] Incognito cancel signal delivered", { threadId });
        return success({ cancelled: true });
      }

      // Check ownership: only the thread owner (or admin) can cancel
      const isAdmin =
        !user.isPublic &&
        "roles" in user &&
        Array.isArray(user.roles) &&
        user.roles.includes(UserPermissionRole.ADMIN);

      if (!isAdmin && !cancelRepository.isThreadOwner(user, thread)) {
        logger.warn("[Cancel] User is not the thread owner", {
          threadId,
          isPublic: user.isPublic,
        });
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // STREAMING: deliver abort signal immediately — before any DB writes — so
      // the stream loop stops as fast as possible. DB bookkeeping follows.
      const isStreaming =
        thread.streamingState === ThreadStreamingState.STREAMING;
      // WAITING: the stream already exited (parked an escalated task or a remote
      // WAIT call). No live stream subscriber — StreamControl.deliver() fires into
      // a vacuum. Must run the parked-task cancellation path instead.
      const isWaiting = thread.streamingState === ThreadStreamingState.WAITING;

      if (isStreaming) {
        StreamControl.deliver(threadId, "cancel", user, logger);
      }

      // Mark as aborting in DB (gives cross-process visibility + frontend feedback)
      await setStreamingStateAborting(threadId, logger, user);

      if (isStreaming) {
        logger.info("[Cancel] Stream cancelled via control channel", {
          threadId,
        });
        // The control signal is fire-and-forget: if the process that owned
        // the stream died (deploy/restart mid-turn) the DB still says
        // 'streaming' but nothing reacts, no stream-finished is ever emitted
        // and the stop button hangs until the client's 15s safety timeout.
        // Locally-looped threads only - a remote loop answers via the relay.
        if (thread.loopInstanceId === null) {
          cancelRepository.scheduleOrphanReap({
            threadId,
            rootFolderId: thread.rootFolderId,
            runId: thread.streamingRunId,
            user,
            logger,
          });
        }
        // The abort triggers AbortErrorHandler which handles:
        // - Credit deduction for partial results
        // - DB content save
        // - isStreaming = false (via clearStreamingState in abort handler)
        // - WS error/interruption event
        return success({ cancelled: true });
      }

      if (!isWaiting) {
        // Thread is IDLE or ABORTING — nothing to cancel. The setStreamingStateAborting
        // above was a no-op; reset to IDLE so the frontend unlocks.
        await clearStreamingState(threadId, logger, user, undefined);
        createMessagesEmitter(logger, user, {
          threadId,
          rootFolderId: thread.rootFolderId,
        })("stream-finished", {
          responseData: { streamingState: ThreadStreamingState.IDLE },
        });
        logger.info("[Cancel] Thread not streaming - nothing to cancel", {
          threadId,
          state: thread.streamingState,
        });
        return success({ cancelled: false });
      }

      // WAITING state: stream died but a parked escalated task or in-flight remote
      // call is keeping the thread locked. Cancel the parked task and clear state.
      {
        // No active stream in registry - thread is in "waiting" state
        // (stream died, escalated task still in flight).
        // Find the waiting tracking task, write a cancelled result to its tool
        // message, then cancel the task and emit STREAM_FINISHED.

        // Find the parked resume-stream task for this thread via taskInput jsonb.
        const [parkedTask] = await db
          .select({
            id: cronTasks.id,
            taskInput: cronTasks.taskInput,
          })
          .from(cronTasks)
          .where(
            and(
              eq(cronTasks.routeId, RESUME_STREAM_ALIAS),
              sql`${cronTasks.taskInput}->>'threadId' = ${threadId}`,
              eq(cronTasks.enabled, false),
            ),
          )
          .limit(1);

        const wakeUpToolMessageId =
          (
            parkedTask?.taskInput as
              | { wakeUpToolMessageId?: string }
              | undefined
          )?.wakeUpToolMessageId ?? null;

        // Track the parentId for the interruption error message
        let interruptionParentId: string | null = null;

        // Write cancelled result to the waiting tool message
        if (wakeUpToolMessageId) {
          try {
            const [existing] = await db
              .select({
                metadata: chatMessages.metadata,
                parentId: chatMessages.parentId,
              })
              .from(chatMessages)
              .where(eq(chatMessages.id, wakeUpToolMessageId));

            // Use the tool message's parentId so the interruption error message
            // lands as a sibling of the tool call (same branch).
            interruptionParentId = existing?.parentId ?? null;

            if (existing?.metadata?.toolCall) {
              const toolCall = existing.metadata.toolCall;
              await db
                .update(chatMessages)
                .set({
                  metadata: {
                    ...existing.metadata,
                    toolCall: {
                      ...toolCall,
                      status: "failed" as const,
                      result: undefined,
                    },
                  },
                  updatedAt: new Date(),
                })
                .where(eq(chatMessages.id, wakeUpToolMessageId));

              createMessagesEmitter(logger, user, {
                threadId,
                rootFolderId: thread.rootFolderId,
              })("tool-result", {
                responseData: {
                  messages: [
                    {
                      id: wakeUpToolMessageId,
                      metadata: {
                        toolCall: {
                          ...toolCall,
                          status: "failed" as const,
                          result: undefined,
                        },
                      },
                    },
                  ],
                },
              });

              logger.info(
                "[Cancel] Wrote cancelled result to waiting tool message",
                {
                  toolMessageId: wakeUpToolMessageId,
                  threadId,
                },
              );
            }
          } catch (writeErr) {
            logger.warn(
              "[Cancel] Failed to write cancelled result to tool message",
              {
                toolMessageId: wakeUpToolMessageId,
                error: parseError(writeErr).message,
              },
            );
          }
        }

        // Cancel any parked resume-stream tasks for this thread
        if (parkedTask) {
          try {
            await db
              .update(cronTasks)
              .set({
                lastExecutionStatus: CronTaskStatus.CANCELLED,
                enabled: false,
              })
              .where(eq(cronTasks.id, parkedTask.id));
          } catch (cancelErr) {
            logger.warn("[Cancel] Failed to cancel parked resume task", {
              threadId,
              parkedTaskId: parkedTask.id,
              error: parseError(cancelErr).message,
            });
          }
        }
        // Drain in-memory pending remote calls so clearStreamingState can set IDLE.
        // A remote call in PendingCalls.hasForThread() would pin the thread to WAITING.
        const { PendingCalls } =
          await import("next-vibe/execute-tool/repository/pending-calls");
        PendingCalls.cancelAllForThread(threadId);

        // Emit interruption error message so the UI shows "stopped" indicator.
        const interruptionContent = t("post.streamInterrupted");
        const errorMessageId = crypto.randomUUID();
        try {
          await MessagesRepository.createErrorMessage({
            messageId: errorMessageId,
            threadId,
            content: interruptionContent,
            errorType: StreamErrorType.STREAM_INTERRUPTED,
            parentId: interruptionParentId,
            user,
            sequenceId: null,
            logger,
          });
        } catch (msgErr) {
          logger.warn("[Cancel] Failed to persist interruption error message", {
            threadId,
            error: parseError(msgErr).message,
          });
        }

        // Emit STREAM_FINISHED so the frontend stops showing the streaming
        // state - without this the client stays stuck in aborting/isStreaming.
        await clearStreamingState(threadId, logger, user, undefined);

        const emit = createMessagesEmitter(logger, user, {
          threadId,
          rootFolderId: thread.rootFolderId,
        });
        emit("message-created", {
          responseData: {
            streamingState: ThreadStreamingState.IDLE,
            messages: [
              buildSseMessageRow({
                id: errorMessageId,
                threadId,
                role: ChatMessageRole.ERROR,
                content: interruptionContent,
                parentId: interruptionParentId,
                authorId: "id" in user ? (user.id ?? null) : null,
                errorType: StreamErrorType.STREAM_INTERRUPTED,
              }),
            ],
          },
        });
        emit("stream-finished", {
          responseData: { streamingState: ThreadStreamingState.IDLE },
        });
        logger.info(
          "[Cancel] WAITING thread cleared - cancelled parked tasks, emitted STREAM_INTERRUPTED + STREAM_FINISHED",
          { threadId },
        );
      }

      return success({ cancelled: true });
    } catch (error) {
      logger.error("Failed to cancel stream", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
