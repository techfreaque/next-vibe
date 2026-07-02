/**
 * Dismiss Task Repository
 *
 * Cancels a pending wakeUp revival: discards the pending-calls entry so the
 * tool result is silently dropped when it eventually completes, then transitions
 * the thread from waiting → idle and emits stream-finished so the frontend
 * unblocks immediately.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { AiT } from "next-vibe/platforms/ai/i18n";

import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { ThreadStreamingState } from "@/app/api/[locale]/agent/chat/enum";

import { discardPendingCall, getPendingCall } from "../pending-calls";
import type {
  DismissTaskRequestOutput,
  DismissTaskResponseOutput,
} from "./definition";

export class DismissTaskRepository {
  static async dismissTask(
    data: DismissTaskRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: AiT,
  ): Promise<ResponseType<DismissTaskResponseOutput>> {
    const { callId } = data;

    try {
      // 1. Look up pending call to get threadId before discarding.
      const entry = getPendingCall(callId);

      if (!entry) {
        // Already completed or never existed — treat as success (idempotent).
        logger.info("[dismiss-task] Pending call not found (already done?)", {
          callId,
        });
        return success({ dismissed: true });
      }

      // Non-admin users can only dismiss their own pending calls
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      if (!isAdmin && entry.userId !== null && entry.userId !== user.id) {
        logger.warn(
          "[dismiss-task] User attempted to dismiss call they don't own",
          {
            callId,
            callUserId: entry.userId,
            requestUserId: user.id,
          },
        );
        return fail({
          message: t("dismissTask.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const { threadId } = entry;

      // 2. Discard: cancels revival + deadline timers, removes from registry.
      discardPendingCall(callId);

      logger.info("[dismiss-task] Discarded pending call", {
        callId,
        threadId,
      });

      // 3. If there's a thread, transition it from waiting → idle in DB
      //    and emit stream-finished so the frontend unblocks.
      if (threadId) {
        // Fetch thread for rootFolderId (needed for sidebar fan-out).
        const [thread] = await db
          .select({
            id: chatThreads.id,
            rootFolderId: chatThreads.rootFolderId,
            streamingState: chatThreads.streamingState,
          })
          .from(chatThreads)
          .where(eq(chatThreads.id, threadId))
          .limit(1);

        if (thread) {
          await db
            .update(chatThreads)
            .set({
              streamingState: ThreadStreamingState.IDLE,
              updatedAt: new Date(),
            })
            .where(eq(chatThreads.id, threadId))
            .catch((err: Error) => {
              logger.warn("[dismiss-task] Failed to mark thread idle", {
                threadId,
                error: err.message,
              });
            });

          // Emit stream-finished so subscribed clients unblock.
          const [{ createMessagesGetEmitter }, { createThreadsGetEmitter }] =
            await Promise.all([
              import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/emitter"),
              import("@/app/api/[locale]/agent/chat/threads/emitter"),
            ]);
          const now = new Date();
          const threadUpdate = {
            id: threadId,
            streamingState: ThreadStreamingState.IDLE,
            preview: null,
            updatedAt: now,
          };
          createMessagesGetEmitter(logger, user, {
            threadId,
            rootFolderId: thread.rootFolderId,
          })("stream-finished", {
            responseData: { streamingState: ThreadStreamingState.IDLE },
          });
          createThreadsGetEmitter(logger, user, {
            rootFolderId: thread.rootFolderId,
            subFolderId: null,
          })("stream-finished", {
            responseData: { threads: [threadUpdate] },
          });
          if (thread.rootFolderId) {
            const { createFolderContentsEmitter } =
              await import("@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/emitter");
            createFolderContentsEmitter(
              logger,
              user,
              thread.rootFolderId,
            )("stream-finished", {
              responseData: { items: [threadUpdate] },
            });
          }

          logger.info(
            "[dismiss-task] Emitted stream-finished, thread unblocked",
            { threadId },
          );
        } else {
          logger.warn("[dismiss-task] Thread not found in DB", { threadId });
        }
      }

      return success({ dismissed: true });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("[dismiss-task] Unexpected error", {
        callId,
        error: parsedError,
      });
      return fail({
        message: t("dismissTask.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
