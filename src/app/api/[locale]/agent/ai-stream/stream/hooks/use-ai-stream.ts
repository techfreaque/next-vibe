/**
 * AI Stream Hook — POST Trigger + Cancel
 *
 * Pure fire-and-forget: makes the POST request to start a stream,
 * handles HTTP errors, and provides cancel functionality.
 *
 * All WS event handling (deltas, stream lifecycle, etc.) is owned
 * by useMessagesSubscription in the messages widget.
 */

import { toast } from "next-vibe-ui/hooks/use-toast";
import { useCallback } from "react";

import { useApiMutation } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { preWarmChannel } from "../../../../system/unified-interface/websocket/client";
import { buildMessagesChannel } from "../../../chat/threads/[threadId]/messages/channel";
import { addErrorMessageToChat } from "../../../chat/threads/[threadId]/messages/hooks/event-handlers";
import cancelEndpoints from "../../cancel/definition";
import { serializeError } from "../../repository/error-utils";
import type { AiStreamPostRequestOutput } from "../definition";
import definitions from "../definition";
import { scopedTranslation } from "../i18n";
import { getAudioQueue } from "./audio-queue";
import type { StreamingThread } from "./store";
import { useAIStreamStore } from "./store";

/**
 * Hook return type
 */
export interface UseAIStreamReturn {
  startStream: (data: AiStreamPostRequestOutput) => Promise<void>;
  cancelStream: (threadId: string) => Promise<void>;
  isStreaming: boolean;
  isStreamingThread: (threadId: string) => boolean;
  threads: Record<string, StreamingThread>;
}

/**
 * Hook for AI streaming operations.
 *
 * POST is fire-and-forget — it returns immediately with threadId.
 * All stream events arrive via WebSocket and are handled by
 * useMessagesSubscription in the messages widget.
 *
 * Cancel sends a server-side abort via the cancel endpoint.
 */
export function useAIStream(): UseAIStreamReturn {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const store = useAIStreamStore();
  const streamMutation = useApiMutation(definitions.POST, logger, user);
  const cancelMutation = useApiMutation(cancelEndpoints.POST, logger, user);

  /**
   * Start an AI stream.
   *
   * 1. Registers stream in store (so isStreaming becomes true)
   * 2. Makes the POST request (fire-and-forget on server)
   * 3. On HTTP error, adds error message to chat and cleans up
   *
   * WS subscription is handled by useMessagesSubscription (always-on).
   */
  const startStream = useCallback(
    async (data: AiStreamPostRequestOutput): Promise<void> => {
      const threadId = data.threadId ?? "";

      // Reset audio queue to prevent old audio from playing
      const audioQueue = getAudioQueue();
      audioQueue.stop();

      // Generate stream ID and register in store (per-thread)
      const streamId = crypto.randomUUID();
      store.startStream(threadId, streamId);

      // ================================================================
      // Pre-warm the WS channel BEFORE the POST so the connection is
      // established by the time the server starts emitting events.
      // Without this, the first WS event arrives before the client has
      // opened the socket, causing a ~1s reconnect delay.
      // ================================================================
      if (threadId) {
        preWarmChannel(buildMessagesChannel(threadId));
      }

      // ================================================================
      // Make the POST request via useApiMutation (type-safe, handles
      // FormData automatically when File objects are present).
      // The server fires-and-forgets the stream — POST returns immediately.
      // WS events (handled by useMessagesSubscription) drive all UI updates.
      // ================================================================
      logger.info("Making AI stream request", {
        operation: data.operation,
        model: data.model,
        hasAudioInput: !!data.audioInput?.file,
        messageHistoryLength: data.messageHistory?.length ?? 0,
      });

      const result = await streamMutation.mutateAsync({
        requestData: data,
      });

      if (!result.success) {
        logger.error("Stream request failed", {
          message: result.message,
        });

        const activeThreadId = data.threadId;
        if (activeThreadId) {
          addErrorMessageToChat(
            activeThreadId,
            serializeError(result),
            "HTTP_ERROR",
            null,
          );
        }

        toast({
          title: t("error.title"),
          description: t(result.message as Parameters<typeof t>[0]),
          variant: "destructive",
          duration: Infinity,
        });

        store.stopStream(threadId);
        return;
      }

      // POST returned successfully — stream is now running on the server.
      // WS events will drive all UI updates. STREAM_FINISHED will clean up.
      logger.info("Stream triggered successfully (fire-and-forget)", {
        threadId,
      });
    },
    [logger, store, t, streamMutation],
  );

  /**
   * Cancel the stream for a specific thread.
   *
   * 1. Calls the server-side cancel endpoint (triggers AbortErrorHandler for credits).
   * 2. Stops audio playback immediately.
   * 3. Sets drain mode in store so delta events are suppressed.
   * 4. WS STREAM_FINISHED event (handled by useMessagesSubscription) does final cleanup.
   */
  const cancelStream = useCallback(
    async (threadId: string): Promise<void> => {
      logger.info("Cancel stream requested by user", { threadId });

      // Stop audio immediately
      getAudioQueue().stop();

      // Set drain mode in store — suppresses delta events while server finalizes
      store.setDraining(threadId, true);

      // Call server-side cancel endpoint via typesafe mutation
      try {
        const result = await cancelMutation.mutateAsync({
          requestData: { threadId },
        });

        if (result.success) {
          logger.info("Cancel endpoint called successfully", { threadId });
        } else {
          logger.error("Cancel endpoint returned error", {
            message: result.message,
            threadId,
          });

          // Even if cancel endpoint fails, stop the UI
          store.stopStream(threadId);
        }
      } catch (error) {
        logger.error("Failed to call cancel endpoint", {
          error: error instanceof Error ? error.message : String(error),
          threadId,
        });

        // Even if cancel endpoint fails, stop the UI
        store.stopStream(threadId);
      }

      // Server will send STREAM_FINISHED which triggers final cleanup
      // via useMessagesSubscription.
    },
    [logger, store, cancelMutation],
  );

  return {
    startStream,
    cancelStream,
    isStreaming: store.isStreaming,
    isStreamingThread: store.isStreamingThread,
    threads: store.threads,
  };
}
