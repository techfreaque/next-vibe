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
import folderContentsDefinition from "../../../../folder-contents/[rootFolderId]/definition";
import { useChatStore } from "../../../../hooks/store";
import threadsDefinition from "../../../definition";
import { buildMessagesChannel } from "../channel";
import messagesDefinition from "../definition";
import type { CreditsDeductedEventData } from "../events";
import { StreamEventType } from "../events";
import pathDefinitions from "../path/definition";
import { createMessageEventHandlers } from "./event-handlers";
import { upsertMessage } from "./update-messages";
import { subscribeToMessages } from "./use-messages-ws";

/**
 * Options for the messages subscription hook.
 */
export interface MessagesSubscriptionOptions {
  /** Called when CREDITS_DEDUCTED fires - for optimistic UI credit updates */
  onCreditsDeducted?: (data: CreditsDeductedEventData) => void;
  /** Called when remote stream finishes - to invalidate lazy branch cache */
  invalidateThread?: (threadId: string) => void;
  /** Called when a stream starts (local or remote) */
  onStreamStarted?: () => void;
  /** Called when STREAM_FINISHED fires */
  onStreamFinished?: () => void;
  /** Called when STREAMING_STATE_CHANGED fires with state="waiting" */
  onStreamingStateWaiting?: () => void;
  /**
   * Initial streaming state from DB (passed on mount for page load recovery).
   * If "waiting", sets the waitingThreadIds flag in the store immediately.
   */
  initialStreamingState?: "idle" | "streaming" | "aborting" | "waiting";
  /** Whether TTS audio chunks should be played - guards against cross-client audio bleed */
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

  // Page load recovery: if the thread is in "waiting" state from DB, set it immediately.
  // This restores the stop button visibility after a page refresh.
  const initialStreamingState = options.initialStreamingState;
  useEffect(() => {
    if (threadId && initialStreamingState === "waiting") {
      useAIStreamStore.getState().setWaiting(threadId, true);
      optionsRef.current.onStreamingStateWaiting?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, initialStreamingState]);

  useEffect(() => {
    if (!threadId) {
      return;
    }

    const store = useAIStreamStore.getState;

    // Get self-contained message handlers from event-handlers.ts
    const messageHandlers = createMessageEventHandlers(
      threadId,
      rootFolderId,
      logger,
    );

    const cleanup = subscribeToMessages(
      threadId,
      {
        // Message creation - also detect remote streams
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

        // Reasoning events - suppressed during drain
        [StreamEventType.REASONING_DELTA]: (e) => {
          if (store().isDraining(threadId)) {
            return;
          }
          messageHandlers[StreamEventType.REASONING_DELTA]?.(e);
        },
        [StreamEventType.REASONING_DONE]:
          messageHandlers[StreamEventType.REASONING_DONE],

        // Content delta - suppressed during drain
        [StreamEventType.CONTENT_DELTA]: (e) => {
          if (store().isDraining(threadId)) {
            return;
          }
          messageHandlers[StreamEventType.CONTENT_DELTA]?.(e);
        },

        // Content done
        [StreamEventType.CONTENT_DONE]:
          messageHandlers[StreamEventType.CONTENT_DONE],

        // Compacting events - delta suppressed during drain
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

        // Audio chunk - suppressed during drain or when call mode is off on this client
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

        // Thread title update - update sidebar cache immediately
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
          // Also update folder-contents cache (primary sidebar data source)
          apiClient.updateEndpointData(
            folderContentsDefinition.GET,
            logger,
            (old) => {
              if (!old?.success) {
                return old;
              }
              return success({
                ...old.data,
                items: old.data.items.map((item) =>
                  item.id === e.threadId ? { ...item, title: e.title } : item,
                ),
              });
            },
            {
              urlPathParams: { rootFolderId: rootFolderId },
              requestData: { subFolderId: subFolderId ?? null },
            },
          );
        },

        // TASK_COMPLETED: task finished - remove from backgroundTasks cache + handle deferred message
        [StreamEventType.TASK_COMPLETED]: (e) => {
          // Remove the completed task from the backgroundTasks list in the messages cache
          apiClient.updateEndpointData(
            messagesDefinition.GET,
            logger,
            (old) => {
              if (!old?.success) {
                return old;
              }
              return {
                ...old,
                data: {
                  ...old.data,
                  backgroundTasks: old.data.backgroundTasks.filter(
                    (task) => task.id !== e.taskId,
                  ),
                },
              };
            },
            {
              urlPathParams: { threadId },
              requestData: { rootFolderId },
            },
          );

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
          upsertMessage(msgThreadId, rootFolderId, logger, {
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
            skill: null,
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
        },

        // STREAMING_STATE_CHANGED: thread state changed server-side (e.g. → "waiting" or back to "idle")
        [StreamEventType.STREAMING_STATE_CHANGED]: (e) => {
          if (e.state === "waiting") {
            store().setWaiting(threadId, true);
            optionsRef.current.onStreamingStateWaiting?.();
          } else if (e.state === "idle") {
            store().setWaiting(threadId, false);
            optionsRef.current.onStreamFinished?.();
          }
        },

        // STREAM_FINISHED: definitive "stream is over" signal
        [StreamEventType.STREAM_FINISHED]: (e) => {
          logger.info("[Messages] STREAM_FINISHED received", {
            threadId,
            finalState: e.finalState,
          });

          const wasLocalStream = store().isLocalStream(threadId);
          store().stopStream(threadId);
          if (e.finalState === "waiting") {
            store().setWaiting(threadId, true);
            optionsRef.current.onStreamingStateWaiting?.();
          } else {
            optionsRef.current.onStreamFinished?.();
          }

          // Seed the path cache with the messages already in the messages cache.
          // This prevents the path endpoint from refetching from the server when
          // isPendingCreate clears - we already have all messages optimistically.
          const existingMessages = apiClient.getEndpointData(
            messagesDefinition.GET,
            logger,
            {
              urlPathParams: { threadId },
              requestData: { rootFolderId },
            },
          );
          if (
            existingMessages?.success &&
            existingMessages.data.messages.length > 0
          ) {
            const msgs = existingMessages.data.messages;
            const lastMsg = msgs[msgs.length - 1];
            apiClient.updateEndpointData(
              pathDefinitions.GET,
              logger,
              (old) => {
                if (old?.success) {
                  return old; // already seeded, don't overwrite
                }
                return success({
                  messages: msgs,
                  hasOlderHistory: false,
                  hasNewerMessages: false,
                  resolvedLeafMessageId: lastMsg?.id ?? null,
                  oldestLoadedMessageId: msgs[0]?.id ?? null,
                  compactionBoundaryId: null,
                  newerChunkAnchorId: null,
                });
              },
              {
                urlPathParams: { threadId },
              },
            );
          }

          // Clear pending-create flag so path/messages queries can now fire.
          // The thread is now persisted in DB after the stream completes.
          useChatStore.getState().clearThreadPendingCreate(threadId);

          // NOTE: pending-create flag clearing was previously in useChatStore;
          // once useChatStore message slice is removed this is no longer needed.

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
      // keepAlive: true - channel cleanup is handled by the effect cleanup below
      true,
    );

    return (): void => {
      cleanup();
      // If a local stream is still running when the component unmounts,
      // patch the sidebar caches directly (do NOT use optionsRef.current.onStreamFinished
      // because optionsRef is updated on every render and may already reference a new
      // activeThreadId after navigation - causing the wrong thread's cache to be patched).
      // STREAM_FINISHED won't arrive after unmount since the WS channel is disconnected below.
      if (store().isLocalStream(threadId)) {
        store().stopStream(threadId);
        // Patch folder-contents cache (sidebar primary source) using closed-over ids.
        apiClient.updateEndpointData(
          folderContentsDefinition.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            return success({
              ...old.data,
              items: old.data.items.map((item) =>
                item.type === "thread" && item.id === threadId
                  ? { ...item, streamingState: "idle" }
                  : item,
              ),
            });
          },
          {
            urlPathParams: { rootFolderId },
            requestData: { subFolderId: subFolderId ?? null },
          },
        );
        // Also patch threads cache.
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
                t.id === threadId ? { ...t, streamingState: "idle" } : t,
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
      }
      // Always disconnect the channel on unmount - the thread is no longer viewed.
      disconnectChannel(buildMessagesChannel(threadId));
    };
  }, [threadId, rootFolderId, logger, subFolderId]);
}
