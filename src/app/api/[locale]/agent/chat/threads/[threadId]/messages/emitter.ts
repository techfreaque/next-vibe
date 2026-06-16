/**
 * Messages Channel Emitter
 *
 * Server-side emitter for broadcasting stream events on the messages WS channel.
 * Typed against MessagesWsEmit (= EmitEventNamed<GET.types.EventPayloads>)
 * so every emit is validated against the definition's events map at compile time.
 *
 * Events are batched via createBatchingEmitter so rapid deltas (content-delta,
 * compacting-delta) are accumulated and sent in a single WS frame instead of one
 * HTTP POST per chunk. Call flush() at stream end to drain the queue immediately.
 *
 * Sidebar updates (stream-finished, streaming-state-changed, thread-title-updated)
 * are published as separate events on the sidebar channels so the threads and
 * folder-contents caches auto-update. These low-frequency events are sent directly
 * (not through the batching emitter) so they flush immediately.
 *
 * thread-title-updated is sidebar-only - use emitThreadTitleUpdated() directly,
 * NOT through MessagesWsEmit (title lives on the thread, not on messages).
 */

import "server-only";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { ThreadStatus } from "@/app/api/[locale]/agent/chat/enum";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  broadcastLiveMessageEvent,
  createBatchingEmitter,
} from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import { RemoteConnectionRepository } from "@/app/api/[locale]/remote-connection/repository";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/endpoint-emitter";
import type { WsWireMessage } from "@/app/api/[locale]/system/unified-interface/websocket/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import folderContentsDefinitions from "@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/definition";
import threadsDefinitions from "@/app/api/[locale]/agent/chat/threads/definition";
import { buildMessagesChannel, buildSupportFeedChannel } from "./channel";
import type { MessagesWsEmit } from "./definition";

export type WsEmitCallback = MessagesWsEmit & {
  flush: () => void;
  setStreamPreview: (p: { preview: string | null; updatedAt: Date }) => void;
};

/**
 * Emit thread-title-updated directly to sidebar channels.
 * Title lives on the thread, not on messages - do NOT use MessagesWsEmit for this.
 */
export function emitThreadTitleUpdated(
  threadId: string,
  title: string,
  rootFolderId: DefaultFolderId | null,
  logger: EndpointLogger,
  user: JwtPayloadType,
): void {
  const emitThreads = createEndpointEmitter(
    threadsDefinitions.GET,
    logger,
    user,
  );
  emitThreads("thread-title-updated", { threads: [{ id: threadId, title }] });
  if (rootFolderId) {
    const emitFolderContents = createEndpointEmitter(
      folderContentsDefinitions.GET,
      logger,
      user,
      { rootFolderId },
    );
    emitFolderContents("thread-title-updated", {
      items: [{ id: threadId, title }],
    });
  }
}

/**
 * Emit thread-created to sidebar channels with all required fields.
 * Used for new threads so other tabs/clients can render the thread in the
 * sidebar without a full refetch (the optimistic update only lives in the
 * creating client's cache).
 */
export function emitThreadCreated(
  threadId: string,
  title: string,
  rootFolderId: DefaultFolderId,
  folderId: string | null,
  logger: EndpointLogger,
  user: JwtPayloadType,
): void {
  const now = new Date();
  const emitThreads = createEndpointEmitter(
    threadsDefinitions.GET,
    logger,
    user,
  );
  const emitFolderContents = createEndpointEmitter(
    folderContentsDefinitions.GET,
    logger,
    user,
    { rootFolderId },
  );
  emitThreads("thread-created", {
    threads: [
      {
        id: threadId,
        title,
        rootFolderId,
        folderId,
        status: ThreadStatus.ACTIVE,
        streamingState: "streaming" as const,
        createdAt: now,
        updatedAt: now,
      },
    ],
  });
  emitFolderContents("thread-created", {
    items: [
      {
        id: threadId,
        type: "thread" as const,
        title,
        rootFolderId,
        folderId,
        status: ThreadStatus.ACTIVE,
        streamingState: "streaming" as const,
        createdAt: now,
        updatedAt: now,
      },
    ],
  });
}

/**
 * Build an emitter for the messages channel of a thread.
 *
 * Returns the typed emit function + a flush() to drain the batching queue at
 * stream end. High-frequency events (content-delta, compacting-delta) go through
 * the batching queue. Low-frequency events that also update sidebar caches
 * (stream-finished, streaming-state-changed) are flushed immediately and also
 * re-emitted to the sidebar channels.
 */
export function createMessagesEmitter(
  threadId: string,
  rootFolderId: DefaultFolderId | null,
  logger: EndpointLogger,
  user: JwtPayloadType,
  supportSessionId?: string | null,
): MessagesWsEmit & {
  flush: () => void;
  setStreamPreview: (p: { preview: string | null; updatedAt: Date }) => void;
} {
  const channel = buildMessagesChannel(threadId);
  const emitThreads = createEndpointEmitter(
    threadsDefinitions.GET,
    logger,
    user,
  );
  const emitFolderContents = rootFolderId
    ? createEndpointEmitter(folderContentsDefinitions.GET, logger, user, {
        rootFolderId,
      })
    : null;

  // When a support session is active, also broadcast key events to the support feed channel
  // so local supporters subscribed to this session see live updates.
  const supportChannel = supportSessionId
    ? buildSupportFeedChannel(supportSessionId)
    : null;

  const batcher = createBatchingEmitter(logger, user);

  // Set by clearStreamingState before stream-finished is emitted.
  let streamPreview: { preview: string | null; updatedAt: Date } | null = null;

  function doEmit(eventName: string, payload: WsWireMessage["data"]): void {
    batcher.emit(channel, eventName, payload);

    // Fan-out to support session channel so local supporters see live updates
    if (supportChannel) {
      batcher.emit(supportChannel, eventName, payload);
    }

    const typedPayload =
      payload !== null && typeof payload === "object" && !Array.isArray(payload)
        ? (payload as {
            streamingState?: "idle" | "streaming" | "aborting" | "waiting";
          })
        : null;

    if (eventName === "stream-finished") {
      // Flush the batch immediately so the UI sees the stream end without the 16ms delay
      batcher.flush();

      const finalStreamingState: "idle" | "waiting" =
        typedPayload?.streamingState === "waiting" ? "waiting" : "idle";

      const threadUpdate = {
        id: threadId,
        streamingState: finalStreamingState,
        preview: streamPreview?.preview ?? null,
        updatedAt: streamPreview?.updatedAt ?? new Date(),
      };

      emitThreads("stream-finished", { threads: [threadUpdate] });
      emitFolderContents?.("stream-finished", { items: [threadUpdate] });
    } else if (eventName === "streaming-state-changed") {
      const streamingState = typedPayload?.streamingState;
      if (streamingState !== undefined) {
        emitThreads("streaming-state-changed", {
          threads: [{ id: threadId, streamingState }],
        });
        emitFolderContents?.("streaming-state-changed", {
          items: [{ id: threadId, streamingState }],
        });
      }
    }
  }

  const emit = doEmit as MessagesWsEmit & {
    flush: () => void;
    setStreamPreview: (p: { preview: string | null; updatedAt: Date }) => void;
  };
  emit.flush = batcher.flush;
  emit.setStreamPreview = (p): void => {
    streamPreview = p;
  };

  return emit;
}
