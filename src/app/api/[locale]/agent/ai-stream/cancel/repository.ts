/**
 * AI Stream Cancel Repository
 * Handles cancellation of active AI streams with ownership verification.
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { publishWsEvent } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import { buildMessagesChannel } from "../../../agent/chat/threads/[threadId]/messages/channel";
import { createStreamEvent } from "../../../agent/chat/threads/[threadId]/messages/events";
import {
  clearStreamingState,
  setStreamingStateAborting,
  StreamRegistry,
} from "../repository/core/stream-registry";
import type {
  AiStreamCancelPostRequestOutput,
  AiStreamCancelPostResponseOutput,
} from "./definition";
import type { AiStreamCancelT } from "./i18n";

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

  static async cancelStream(
    data: AiStreamCancelPostRequestOutput,
    user: JwtPayloadType,
    t: AiStreamCancelT,
    logger: EndpointLogger,
  ): Promise<ResponseType<AiStreamCancelPostResponseOutput>> {
    try {
      const { threadId } = data;

      // Look up the thread to verify ownership
      const [thread] = await db
        .select({
          id: chatThreads.id,
          userId: chatThreads.userId,
          leadId: chatThreads.leadId,
        })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
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

      // Mark as aborting before sending abort signal - gives frontend immediate feedback
      await setStreamingStateAborting(threadId);

      // Cancel the stream via the registry
      const wasActive = StreamRegistry.cancel(threadId);

      if (wasActive) {
        logger.info("[Cancel] Stream cancelled via registry", { threadId });
        // The abort triggers AbortErrorHandler which handles:
        // - Credit deduction for partial results
        // - DB content save
        // - isStreaming = false (via clearStreamingState in abort handler)
        // - WS error/interruption event
      } else {
        // No active stream in registry - thread may be in "waiting" state
        // (stream died, escalated task still in flight).
        // Find the waiting tracking task, write a cancelled result to its tool
        // message, then cancel the task and emit STREAM_FINISHED.

        // Find the waiting tracking task for this thread
        const [waitingTask] = await db
          .select({
            id: cronTasks.id,
            wakeUpToolMessageId: cronTasks.wakeUpToolMessageId,
          })
          .from(cronTasks)
          .where(eq(cronTasks.wakeUpThreadId, threadId))
          .limit(1);

        // Write cancelled result to the waiting tool message
        if (waitingTask?.wakeUpToolMessageId) {
          try {
            const [existing] = await db
              .select({ metadata: chatMessages.metadata })
              .from(chatMessages)
              .where(eq(chatMessages.id, waitingTask.wakeUpToolMessageId));

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
                .where(eq(chatMessages.id, waitingTask.wakeUpToolMessageId));

              publishWsEvent(
                {
                  channel: buildMessagesChannel(threadId),
                  event: "tool-result",
                  data: createStreamEvent.toolResult({
                    messageId: waitingTask.wakeUpToolMessageId,
                    toolName: toolCall.toolName,
                    result: undefined,
                    toolCall: {
                      ...toolCall,
                      status: "failed" as const,
                      result: undefined,
                    },
                  }).data,
                },
                logger,
              );

              logger.info(
                "[Cancel] Wrote cancelled result to waiting tool message",
                {
                  toolMessageId: waitingTask.wakeUpToolMessageId,
                  threadId,
                },
              );
            }
          } catch (writeErr) {
            logger.warn(
              "[Cancel] Failed to write cancelled result to tool message",
              {
                toolMessageId: waitingTask.wakeUpToolMessageId,
                error: parseError(writeErr).message,
              },
            );
          }
        }

        // Cancel any tracking tasks for this thread
        try {
          await db
            .update(cronTasks)
            .set({
              lastExecutionStatus: CronTaskStatus.CANCELLED,
              enabled: false,
            })
            .where(eq(cronTasks.wakeUpThreadId, threadId));
        } catch (cancelErr) {
          logger.warn("[Cancel] Failed to cancel escalated tasks", {
            threadId,
            error: parseError(cancelErr).message,
          });
        }
        // Emit STREAM_FINISHED so the frontend stops showing the streaming
        // state - without this the client stays stuck in aborting/isStreaming.
        await clearStreamingState(threadId, logger);
        publishWsEvent(
          {
            channel: buildMessagesChannel(threadId),
            event: "stream-finished",
            data: createStreamEvent.streamFinished({
              threadId,
              reason: "cancelled",
              finalState: "idle",
            }).data,
          },
          logger,
        );
        logger.info(
          "[Cancel] No active stream found - cleared DB flag, cancelled tasks, emitted STREAM_FINISHED",
          { threadId },
        );
      }

      return success({ cancelled: wasActive });
    } catch (error) {
      logger.error("Failed to cancel stream", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
