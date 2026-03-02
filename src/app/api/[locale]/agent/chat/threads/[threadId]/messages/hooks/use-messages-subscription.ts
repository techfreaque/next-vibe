"use client";

/**
 * Messages WebSocket Subscription Hook
 *
 * Always-on WS listener for the active thread.
 * Subscribes when a thread is viewed, handles ALL stream events
 * (local, remote, cross-tab, cross-device).
 *
 * Replaces the previous split between use-ai-stream.ts (local)
 * and use-thread-stream.ts (remote). No local/remote dedup needed.
 */

import { useEffect, useRef } from "react";

import { useAIStreamStore } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { disconnectChannel } from "@/app/api/[locale]/system/unified-interface/websocket/client";

import { ChatMessageRole } from "../../../../enum";
import { useChatStore } from "../../../../hooks/store";
import { buildMessagesChannel } from "../channel";
import type { CreditsDeductedEventData } from "../events";
import { StreamEventType } from "../events";
import { createMessageEventHandlers } from "./event-handlers";
import { subscribeToMessages } from "./use-messages-ws";

/**
 * Options for the messages subscription hook.
 */
export interface MessagesSubscriptionOptions {
  /** Called when CREDITS_DEDUCTED fires — for optimistic UI credit updates */
  onCreditsDeducted?: (data: CreditsDeductedEventData) => void;
  /** Called when remote stream finishes — to invalidate lazy branch cache */
  invalidateThread?: (threadId: string) => void;
}

/**
 * Always-on WS subscription for the active thread.
 *
 * Handles all stream events: message creation, content deltas,
 * stream lifecycle, errors, voice, tools, compacting, etc.
 *
 * @param threadId - The active thread ID (null to disable)
 * @param logger - Endpoint logger
 * @param options - Optional callbacks
 */
export function useMessagesSubscription(
  threadId: string | null,
  logger: EndpointLogger,
  options: MessagesSubscriptionOptions = {},
): void {
  // Use refs for callbacks to avoid re-subscribing on every render
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!threadId) {
      return;
    }

    const store = useAIStreamStore.getState;

    // Get self-contained message handlers from event-handlers.ts
    const messageHandlers = createMessageEventHandlers(threadId, logger);

    const cleanup = subscribeToMessages(
      threadId,
      {
        // Message creation — also detect remote streams
        [StreamEventType.MESSAGE_CREATED]: (e) => {
          messageHandlers[StreamEventType.MESSAGE_CREATED]?.(e);

          // If an assistant message arrives and we're not streaming this thread,
          // it's a remote stream (other tab/device). Mark as streaming.
          if (
            e.role === ChatMessageRole.ASSISTANT &&
            !store().isStreamingThread(threadId)
          ) {
            store().startStream(threadId, crypto.randomUUID());
            // Remove from localStreamThreadIds since this is remote
            useAIStreamStore.setState((s) => {
              const newLocal = new Set(s.localStreamThreadIds);
              newLocal.delete(threadId);
              return { localStreamThreadIds: newLocal };
            });
          }
        },

        // Voice transcription
        [StreamEventType.VOICE_TRANSCRIBED]:
          messageHandlers[StreamEventType.VOICE_TRANSCRIBED],

        // File uploads
        [StreamEventType.FILES_UPLOADED]:
          messageHandlers[StreamEventType.FILES_UPLOADED],

        // Tool events
        [StreamEventType.TOOL_CALL]: messageHandlers[StreamEventType.TOOL_CALL],
        [StreamEventType.TOOL_WAITING]:
          messageHandlers[StreamEventType.TOOL_WAITING],
        [StreamEventType.TOOL_RESULT]:
          messageHandlers[StreamEventType.TOOL_RESULT],

        // Token/credit events
        [StreamEventType.TOKENS_UPDATED]:
          messageHandlers[StreamEventType.TOKENS_UPDATED],
        [StreamEventType.CREDITS_DEDUCTED]: (e) => {
          messageHandlers[StreamEventType.CREDITS_DEDUCTED]?.(e);
          optionsRef.current.onCreditsDeducted?.(e);
        },

        // Reasoning events — suppressed during drain
        [StreamEventType.REASONING_DELTA]: (e) => {
          if (store().isDraining(threadId)) {
            return;
          }
          messageHandlers[StreamEventType.REASONING_DELTA]?.(e);
        },
        [StreamEventType.REASONING_DONE]:
          messageHandlers[StreamEventType.REASONING_DONE],

        // Content delta — suppressed during drain
        [StreamEventType.CONTENT_DELTA]: (e) => {
          if (store().isDraining(threadId)) {
            return;
          }
          messageHandlers[StreamEventType.CONTENT_DELTA]?.(e);
        },

        // Content done
        [StreamEventType.CONTENT_DONE]:
          messageHandlers[StreamEventType.CONTENT_DONE],

        // Compacting events — delta suppressed during drain
        [StreamEventType.COMPACTING_DELTA]: (e) => {
          if (store().isDraining(threadId)) {
            return;
          }
          messageHandlers[StreamEventType.COMPACTING_DELTA]?.(e);
        },
        [StreamEventType.COMPACTING_DONE]:
          messageHandlers[StreamEventType.COMPACTING_DONE],

        // Error
        [StreamEventType.ERROR]: (e) => {
          messageHandlers[StreamEventType.ERROR]?.(e);
        },

        // Audio chunk — suppressed during drain
        [StreamEventType.AUDIO_CHUNK]: (e) => {
          if (store().isDraining(threadId)) {
            return;
          }
          // Audio playback: only if not final chunk and has audio data
          if (e.audioData && !e.isFinal) {
            // Dynamic import to avoid pulling audio-queue into non-voice contexts
            void import("@/app/api/[locale]/agent/ai-stream/stream/hooks/audio-queue").then(
              ({ getAudioQueue }) => {
                const aq = getAudioQueue();
                aq.enqueue(e.audioData, e.chunkIndex);
                return undefined;
              },
            );
          }
        },

        // STREAM_FINISHED: definitive "stream is over" signal
        [StreamEventType.STREAM_FINISHED]: () => {
          logger.info("[Messages] STREAM_FINISHED received", { threadId });

          const wasLocalStream = store().isLocalStream(threadId);
          store().stopStream(threadId);

          // Clear pending-create flag — thread is now persisted on the server
          useChatStore.getState().clearThreadPendingCreate(threadId);

          // If this was a remote stream, invalidate so next navigation fetches fresh data
          if (!wasLocalStream) {
            optionsRef.current.invalidateThread?.(threadId);
          }

          // Only disconnect channel for locally-initiated streams.
          // Remote streams (other tabs/devices) share the same module-level
          // connection — disconnecting here would kill their listeners too.
          if (wasLocalStream) {
            disconnectChannel(buildMessagesChannel(threadId));
          }
        },
      },
      // keepAlive: true — channel cleanup is handled by STREAM_FINISHED handler
      true,
    );

    return (): void => {
      cleanup();
      if (!store().isStreamingThread(threadId)) {
        // No active stream — safe to disconnect completely.
        disconnectChannel(buildMessagesChannel(threadId));
      } else if (!store().isLocalStream(threadId)) {
        // Remote stream running: clear store state so a future mount doesn't
        // see a phantom "streaming" thread. The channel WS will close naturally
        // when the server stops sending (or next mount will reconnect).
        store().stopStream(threadId);
        disconnectChannel(buildMessagesChannel(threadId));
      }
      // Local stream: STREAM_FINISHED will call stopStream + disconnectChannel.
    };
  }, [threadId, logger]);
}
