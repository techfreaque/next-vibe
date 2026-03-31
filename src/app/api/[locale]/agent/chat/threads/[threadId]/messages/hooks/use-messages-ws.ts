"use client";

/**
 * Messages WebSocket Subscription
 *
 * Typed subscription system for the messages WS channel.
 * The messages endpoint owns the complete event lifecycle:
 *   definition (Zod schemas) → emission (emitter.ts) → channel (channel.ts) → consumption (this file)
 *
 * Types flow directly from StreamEventDataMap - no casts, no assertions.
 */

import {
  disconnectChannel,
  subscribeToChannel,
} from "@/app/api/[locale]/system/unified-interface/websocket/client";

import { buildMessagesChannel } from "../channel";
import { type StreamEventDataMap, StreamEventType } from "../events";

/**
 * Handler map - one optional callback per event type.
 * Each handler receives the correctly typed data for that event.
 */
export type MessagesEventHandlers = {
  [K in StreamEventType]?: (data: StreamEventDataMap[K]) => void;
};

/**
 * Subscribe to a single message event with full type safety.
 * Returns an unsubscribe function (or null if no handler provided).
 */
function sub<K extends StreamEventType>(
  channel: string,
  event: K,
  handler: ((data: StreamEventDataMap[K]) => void) | undefined,
): (() => void) | null {
  if (!handler) {
    return null;
  }
  return subscribeToChannel(channel, event, handler);
}

/**
 * Subscribe to all message events on a thread's WS channel.
 *
 * Returns a cleanup function that unsubscribes all handlers
 * and optionally disconnects the channel.
 *
 * @param threadId - Thread to subscribe to
 * @param handlers - Typed handler map (only provided events are subscribed)
 * @param keepAlive - If true, don't disconnect the channel on cleanup (default: false)
 * @returns Cleanup function
 */
export function subscribeToMessages(
  threadId: string,
  handlers: MessagesEventHandlers,
  keepAlive = false,
): () => void {
  const channel = buildMessagesChannel(threadId);

  // Each call has a literal event type, so TypeScript can correlate
  // the handler's data parameter with the correct StreamEventDataMap entry.
  const unsubs = [
    sub(
      channel,
      StreamEventType.MESSAGE_CREATED,
      handlers[StreamEventType.MESSAGE_CREATED],
    ),
    sub(
      channel,
      StreamEventType.CONTENT_DELTA,
      handlers[StreamEventType.CONTENT_DELTA],
    ),
    sub(
      channel,
      StreamEventType.CONTENT_DONE,
      handlers[StreamEventType.CONTENT_DONE],
    ),
    sub(
      channel,
      StreamEventType.REASONING_DELTA,
      handlers[StreamEventType.REASONING_DELTA],
    ),
    sub(
      channel,
      StreamEventType.REASONING_DONE,
      handlers[StreamEventType.REASONING_DONE],
    ),
    sub(
      channel,
      StreamEventType.TOOL_CALL,
      handlers[StreamEventType.TOOL_CALL],
    ),
    sub(
      channel,
      StreamEventType.TOOL_WAITING,
      handlers[StreamEventType.TOOL_WAITING],
    ),
    sub(
      channel,
      StreamEventType.TOOL_RESULT,
      handlers[StreamEventType.TOOL_RESULT],
    ),
    sub(channel, StreamEventType.ERROR, handlers[StreamEventType.ERROR]),
    sub(
      channel,
      StreamEventType.VOICE_TRANSCRIBED,
      handlers[StreamEventType.VOICE_TRANSCRIBED],
    ),
    sub(
      channel,
      StreamEventType.AUDIO_CHUNK,
      handlers[StreamEventType.AUDIO_CHUNK],
    ),
    sub(
      channel,
      StreamEventType.FILES_UPLOADED,
      handlers[StreamEventType.FILES_UPLOADED],
    ),
    sub(
      channel,
      StreamEventType.CREDITS_DEDUCTED,
      handlers[StreamEventType.CREDITS_DEDUCTED],
    ),
    sub(
      channel,
      StreamEventType.TOKENS_UPDATED,
      handlers[StreamEventType.TOKENS_UPDATED],
    ),
    sub(
      channel,
      StreamEventType.COMPACTING_DELTA,
      handlers[StreamEventType.COMPACTING_DELTA],
    ),
    sub(
      channel,
      StreamEventType.COMPACTING_DONE,
      handlers[StreamEventType.COMPACTING_DONE],
    ),
    sub(
      channel,
      StreamEventType.THREAD_TITLE_UPDATED,
      handlers[StreamEventType.THREAD_TITLE_UPDATED],
    ),
    sub(
      channel,
      StreamEventType.STREAM_FINISHED,
      handlers[StreamEventType.STREAM_FINISHED],
    ),
    sub(
      channel,
      StreamEventType.TASK_COMPLETED,
      handlers[StreamEventType.TASK_COMPLETED],
    ),
    sub(
      channel,
      StreamEventType.STREAMING_STATE_CHANGED,
      handlers[StreamEventType.STREAMING_STATE_CHANGED],
    ),
    sub(
      channel,
      StreamEventType.GENERATED_MEDIA_ADDED,
      handlers[StreamEventType.GENERATED_MEDIA_ADDED],
    ),
    sub(
      channel,
      StreamEventType.GAP_FILL_STARTED,
      handlers[StreamEventType.GAP_FILL_STARTED],
    ),
    sub(
      channel,
      StreamEventType.GAP_FILL_COMPLETED,
      handlers[StreamEventType.GAP_FILL_COMPLETED],
    ),
  ];

  return (): void => {
    for (const unsub of unsubs) {
      unsub?.();
    }
    if (!keepAlive) {
      disconnectChannel(channel);
    }
  };
}
