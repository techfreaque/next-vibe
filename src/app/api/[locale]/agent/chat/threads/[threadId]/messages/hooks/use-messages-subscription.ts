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

import { success } from "next-vibe/shared/types/response.schema";
import { useEffect, useRef } from "react";

import { useAIStreamStore } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/store";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { disconnectChannel } from "@/app/api/[locale]/system/unified-interface/websocket/client";

import type { DefaultFolderId } from "../../../../config";
import { ChatMessageRole } from "../../../../enum";
import { useChatStore } from "../../../../hooks/store";
import threadsDefinition from "../../../definition";
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
  /** Called when a stream starts (local or remote) */
  onStreamStarted?: () => void;
  /** Called when STREAM_FINISHED fires */
  onStreamFinished?: () => void;
  /** Whether TTS audio chunks should be played — guards against cross-client audio bleed */
  ttsAutoplay?: boolean;
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
  rootFolderId: DefaultFolderId,
  subFolderId: string | null | undefined,
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
            optionsRef.current.onStreamStarted?.();
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

        // Audio chunk — suppressed during drain or when call mode is off on this client
        [StreamEventType.AUDIO_CHUNK]: (e) => {
          if (store().isDraining(threadId)) {
            return;
          }
          // Guard against cross-client audio bleed: only play if call mode is enabled here
          if (!optionsRef.current.ttsAutoplay) {
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

        // Thread title update — update sidebar cache immediately
        [StreamEventType.THREAD_TITLE_UPDATED]: (e) => {
          apiClient.updateEndpointData(
            threadsDefinition.GET,
            logger,
            (old) => {
              if (!old?.success) {
                return old;
              }
              return success({
                ...old.data,
                threads: old.data.threads.map((t) =>
                  t.id === e.threadId ? { ...t, title: e.title } : t,
                ),
              });
            },
            {
              requestData: {
                rootFolderId: rootFolderId,
                subFolderId: subFolderId ?? null,
              },
            },
          );
        },

        // TASK_COMPLETED: background/noLoop task finished — add deferred result message to store
        [StreamEventType.TASK_COMPLETED]: (e) => {
          if (!e.deferredMessage) {
            return;
          }
          const {
            id,
            threadId: msgThreadId,
            parentId,
            sequenceId,
            toolCall,
          } = e.deferredMessage;
          useChatStore.getState().addMessage({
            id,
            threadId: msgThreadId,
            role: ChatMessageRole.TOOL,
            content: null,
            parentId,
            sequenceId,
            authorId: "system",
            authorName: null,
            isAI: true,
            model: null,
            character: null,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            metadata: { toolCall },
            upvotes: 0,
            downvotes: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            searchVector: null,
          });
          // Update leaf so the path walker picks up the new message
          useChatStore.getState().setLeafMessageId(msgThreadId, id);
        },

        // STREAM_FINISHED: definitive "stream is over" signal
        [StreamEventType.STREAM_FINISHED]: () => {
          logger.info("[Messages] STREAM_FINISHED received", { threadId });

          const wasLocalStream = store().isLocalStream(threadId);
          store().stopStream(threadId);
          optionsRef.current.onStreamFinished?.();

          // Clear pending-create flag — thread is now persisted on the server
          useChatStore.getState().clearThreadPendingCreate(threadId);

          // If this was a remote stream, invalidate so next navigation fetches fresh data
          if (!wasLocalStream) {
            optionsRef.current.invalidateThread?.(threadId);
          }

          // NOTE: Do NOT disconnect the channel here. The WS channel must stay
          // open while the thread is viewed so that retry/branch operations
          // (which reuse the same threadId) can receive their stream events.
          // The effect cleanup below handles the disconnect on unmount.
        },
      },
      // keepAlive: true — channel cleanup is handled by the effect cleanup below
      true,
    );

    return (): void => {
      cleanup();
      // If a local stream is still running when the component unmounts,
      // stop it in the store (STREAM_FINISHED won't arrive after unmount).
      if (store().isLocalStream(threadId)) {
        store().stopStream(threadId);
      }
      // Always disconnect the channel on unmount — the thread is no longer viewed.
      disconnectChannel(buildMessagesChannel(threadId));
    };
  }, [threadId, rootFolderId, logger, subFolderId]);
}
