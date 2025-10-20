/**
 * AI Stream Hooks
 * Client-side hooks for AI streaming operations using SSE
 * NO Vercel AI SDK - custom implementation with 100% type safety
 */

import "client-only";

import { useCallback, useRef } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { AiStreamPostRequestOutput } from "./definition";
import {
  type ContentDeltaEventData,
  type ContentDoneEventData,
  type ErrorEventData,
  type MessageCreatedEventData,
  parseSSEEvent,
  StreamEventType,
  type ThreadCreatedEventData,
} from "./events";
import {
  type StreamingMessage,
  type StreamingThread,
  useAIStreamStore,
} from "./store";

/**
 * SSE Stream Options
 */
export interface StreamOptions {
  onThreadCreated?: (data: ThreadCreatedEventData) => void;
  onMessageCreated?: (data: MessageCreatedEventData) => void;
  onContentDelta?: (data: ContentDeltaEventData) => void;
  onContentDone?: (data: ContentDoneEventData) => void;
  onError?: (data: ErrorEventData) => void;
  signal?: AbortSignal;
}

/**
 * Hook return type
 */
export interface UseAIStreamReturn {
  startStream: (
    data: AiStreamPostRequestOutput,
    options?: StreamOptions,
  ) => Promise<void>;
  stopStream: () => void;
  isStreaming: boolean;
  error: string | null;
  streamingMessages: Record<string, StreamingMessage>;
  threads: Record<string, StreamingThread>;
}

/**
 * Hook for AI streaming operations
 * Uses fetch + SSE parsing with Zustand state management
 */
export function useAIStream(
  locale: CountryLanguage,
  logger: EndpointLogger,
  t: TFunction,
): UseAIStreamReturn {
  const store = useAIStreamStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Start an AI stream
   */
  const startStream = useCallback(
    async (
      data: AiStreamPostRequestOutput,
      options: StreamOptions = {},
    ): Promise<void> => {
      // Cancel any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Generate stream ID
      const streamId = crypto.randomUUID();
      store.startStream(streamId);

      try {
        // Make fetch request
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/ai-stream`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            signal: options.signal || abortController.signal,
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          const errorMessage = `HTTP ${response.status}: ${errorText}`;
          logger.error("Stream request failed", { status: response.status });
          store.setError(errorMessage);
          store.stopStream();
          return;
        }

        if (!response.body) {
          logger.error("Stream response has no body");
          store.setError(
            t(
              "app.api.v1.core.agent.chat.aiStream.route.errors.noResponseBody",
            ),
          );
          store.stopStream();
          return;
        }

        // Process SSE stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Decode chunk
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Process complete events (separated by \n\n)
          const events = buffer.split("\n\n");
          buffer = events.pop() || ""; // Keep incomplete event in buffer

          for (const eventString of events) {
            if (!eventString.trim()) {
              continue;
            }

            // Parse SSE event
            const event = parseSSEEvent(eventString);
            if (!event) {
              logger.warn("Failed to parse SSE event", { eventString });
              continue;
            }

            // Handle event based on type
            switch (event.type) {
              case StreamEventType.THREAD_CREATED: {
                const eventData = event.data as ThreadCreatedEventData;
                store.addThread({
                  threadId: eventData.threadId,
                  title: eventData.title,
                  rootFolderId: eventData.rootFolderId,
                  subFolderId: eventData.subFolderId,
                  createdAt: new Date(),
                });
                options.onThreadCreated?.(eventData);
                break;
              }

              case StreamEventType.MESSAGE_CREATED: {
                const eventData = event.data as MessageCreatedEventData;
                store.addMessage({
                  messageId: eventData.messageId,
                  threadId: eventData.threadId,
                  role: eventData.role,
                  content: eventData.content,
                  parentId: eventData.parentId,
                  depth: eventData.depth,
                  model: eventData.model,
                  persona: eventData.persona,
                  isStreaming: eventData.role === "assistant",
                });
                options.onMessageCreated?.(eventData);
                break;
              }

              case StreamEventType.CONTENT_DELTA: {
                const eventData = event.data as ContentDeltaEventData;
                const currentMessage =
                  store.streamingMessages[eventData.messageId];
                if (currentMessage) {
                  const newContent = currentMessage.content + eventData.delta;
                  store.updateMessageContent(eventData.messageId, newContent);
                }
                options.onContentDelta?.(eventData);
                break;
              }

              case StreamEventType.CONTENT_DONE: {
                const eventData = event.data as ContentDoneEventData;
                store.finalizeMessage(
                  eventData.messageId,
                  eventData.content,
                  eventData.totalTokens,
                  eventData.finishReason,
                );
                options.onContentDone?.(eventData);
                break;
              }

              case StreamEventType.ERROR: {
                const eventData = event.data as ErrorEventData;
                store.setError(eventData.message);
                options.onError?.(eventData);
                break;
              }
            }
          }
        }

        // Stream completed successfully
        store.stopStream();
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            logger.info("Stream aborted");
          } else {
            logger.error("Stream error", { error: error.message });
            store.setError(error.message);
          }
        }
        store.stopStream();
      } finally {
        abortControllerRef.current = null;
      }
    },
    [locale, logger, store, t],
  );

  /**
   * Stop the current stream
   */
  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    store.stopStream();
  }, [store]);

  return {
    startStream,
    stopStream,
    isStreaming: store.isStreaming,
    error: store.error,
    streamingMessages: store.streamingMessages,
    threads: store.threads,
  };
}
