import "server-only";

import { eq } from "drizzle-orm";

import { chatThreads } from "../../../agent/chat/db";
import { ThreadStreamingState } from "../../../agent/chat/enum";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "../../../core/route/response.schema";
import { db } from "../../../database";
import type { JwtPayloadType } from "../../../identity/auth/types";
import { UserPermissionRole } from "../../../identity/roles/enum";
import type { EndpointLogger } from "../../../logger/types";
import type { AiT } from "../../../platforms/ai/i18n";
import { ControlSignals } from "../../repository/control-signals";
import { PendingCalls } from "../../repository/pending-calls";
import type {
  DetachCallRequestOutput,
  DetachCallResponseOutput,
} from "./definition";

export class DetachCallRepository {
  /**
   * Detach a tool call from the turn — "run it in the background, discard the
   * result, unblock now". Handles BOTH lifecycle stages of a call (this is the
   * unified successor to the legacy dismiss-task):
   *
   *   1. LIVE in-flight WAIT call → deliver a `detach` control signal; execute-tool
   *      converts it to DETACH mid-flight (keeps running, result discarded).
   *   2. Already-PARKED wakeUp call (no live waiter) → discard the pending call
   *      (cancel revival + timers) and unblock the thread (waiting → idle +
   *      stream-finished), so the UI's "run in background" button works on a
   *      call that already returned {taskId} and is awaiting /report.
   *
   * `delivered=true` whenever either path acted; idempotent (a call that already
   * settled is a success no-op).
   */
  static async detach(
    data: DetachCallRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: AiT,
  ): Promise<ResponseType<DetachCallResponseOutput>> {
    const { callId } = data;

    // 1. Live in-flight call — publish a `detach` control event on the pub/sub bus.
    // The running execution (subscribed to its control channel, in whatever process
    // it runs) reacts by converting itself to DETACH. Fire-and-forget across
    // processes: no synchronous knowledge of a subscriber, so we ALSO handle the
    // parked case below. Both are idempotent.
    ControlSignals.deliver(callId, "detach", user, logger);

    // 2. Parked wakeUp call — discard the pending call + unblock the thread. Only
    // one of (live, parked) is ever real for a given callId, so acting on both is
    // safe: a live call has no parked entry, a parked call has no live subscriber.
    const entry = PendingCalls.get(callId);
    if (!entry) {
      logger.debug("[detach] Control published; no parked call for callId", {
        callId,
      });
      return success({ delivered: true });
    }

    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    if (!isAdmin && entry.userId !== null && entry.userId !== user.id) {
      logger.warn("[detach] User attempted to detach a call they don't own", {
        callId,
        callUserId: entry.userId,
        requestUserId: user.id,
      });
      return fail({
        message: t("detachCall.post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const { threadId } = entry;
    PendingCalls.discard(callId);
    logger.debug("[detach] Discarded parked pending call", {
      callId,
      threadId,
    });

    if (threadId) {
      await DetachCallRepository.unblockThread(threadId, user, logger);
    }
    return success({ delivered: true });
  }

  /** Transition a thread waiting → idle and emit stream-finished on all views. */
  private static async unblockThread(
    threadId: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<void> {
    const [thread] = await db
      .select({
        id: chatThreads.id,
        rootFolderId: chatThreads.rootFolderId,
        folderId: chatThreads.folderId,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);
    if (!thread) {
      logger.warn("[detach] Thread not found in DB", { threadId });
      return;
    }

    await db
      .update(chatThreads)
      .set({
        streamingState: ThreadStreamingState.IDLE,
        updatedAt: new Date(),
      })
      .where(eq(chatThreads.id, threadId))
      .catch((err: Error) => {
        logger.warn("[detach] Failed to mark thread idle", {
          threadId,
          error: err.message,
        });
      });

    const [{ createMessagesGetEmitter }, { createThreadsGetEmitter }] =
      await Promise.all([
        import("../../../agent/chat/threads/[threadId]/messages/emitter"),
        import("../../../agent/chat/threads/emitter"),
      ]);
    const now = new Date();
    const threadUpdate = {
      id: threadId,
      streamingState: ThreadStreamingState.IDLE,
      updatedAt: now,
      type: "thread" as const,
      rootFolderId: thread.rootFolderId,
      folderId: thread.folderId,
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
        await import("../../../agent/chat/folder-contents/[rootFolderId]/emitter");
      createFolderContentsEmitter(
        logger,
        user,
        thread.rootFolderId,
      )("stream-finished", {
        responseData: { items: [threadUpdate] },
      });
    }
    logger.debug("[detach] Emitted stream-finished, thread unblocked", {
      threadId,
    });
  }
}
