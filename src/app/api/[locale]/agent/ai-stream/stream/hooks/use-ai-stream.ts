/**
 * AI Stream Hook - POST Trigger + Cancel
 *
 * Pure fire-and-forget: makes the POST request to start a stream,
 * handles HTTP errors, and provides cancel functionality.
 *
 * All WS event handling (deltas, stream lifecycle, etc.) is owned
 * by useMessagesSubscription in the messages widget.
 *
 * Streaming state is derived from the framework's cache (streamingState
 * on messagesDefinition.GET), NOT from this hook.
 */

import { toast } from "next-vibe-ui/hooks/use-toast";
import { parseError } from "next-vibe/shared/utils";
import { useCallback, useMemo } from "react";

import { useApiMutation } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { preWarmChannel } from "../../../../system/unified-interface/websocket/client";
import { buildMessagesChannel } from "../../../chat/threads/[threadId]/messages/channel";
import { addErrorMessageToChat } from "../../../chat/threads/[threadId]/messages/hooks/update-messages";
import cancelEndpoints from "../../cancel/definition";
import { serializeError } from "../../repository/error-utils";
import type { AiStreamPostRequestOutput } from "../definition";
import definitions from "../definition";
import { scopedTranslation } from "../i18n";
import { getAudioQueue } from "./audio-queue";
import { useAIStreamStore } from "./store";

/**
 * Hook return type
 */
export interface UseAIStreamReturn {
  startStream: (data: AiStreamPostRequestOutput) => Promise<boolean>;
  cancelStream: (threadId: string) => Promise<void>;
}

/**
 * Hook for AI streaming operations.
 *
 * POST is fire-and-forget - it returns immediately with threadId.
 * All stream events arrive via WebSocket and are handled by
 * useMessagesSubscription in the messages widget.
 *
 * Cancel sends a server-side abort via the cancel endpoint.
 */
export function useAIStream(): UseAIStreamReturn {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const { t } = useMemo(() => scopedTranslation.scopedT(locale), [locale]);
  const storeSetAborting = useAIStreamStore((s) => s.setAborting);
  const storeClearThread = useAIStreamStore((s) => s.clearThread);
  const streamMutation = useApiMutation(definitions.POST, logger, user);
  const cancelMutation = useApiMutation(cancelEndpoints.POST, logger, user);

  /**
   * Start an AI stream.
   *
   * 1. Pre-warms WS channel
   * 2. Makes the POST request (fire-and-forget on server)
   * 3. On HTTP error, adds error message to chat and cleans up
   *
   * WS subscription is handled by useMessagesSubscription (always-on).
   * Streaming state is tracked by the framework via WS events — not here.
   */
  const startStream = useCallback(
    async (data: AiStreamPostRequestOutput): Promise<boolean> => {
      const threadId = data.threadId ?? "";

      // Reset audio queue to prevent old audio from playing
      const audioQueue = getAudioQueue();
      audioQueue.stop();

      // Pre-warm the WS channel BEFORE the POST so the connection is
      // established by the time the server starts emitting events.
      if (threadId) {
        preWarmChannel(buildMessagesChannel(threadId));
      }

      // Make the POST request via useApiMutation (type-safe, handles
      // FormData automatically when File objects are present).
      // The server fires-and-forgets the stream - POST returns immediately.
      // WS events (handled by useMessagesSubscription) drive all UI updates.
      logger.info("Making AI stream request", {
        operation: data.operation,
        model: data.model,
        hasAudioInput: !!data.audioInput?.file,
        messageHistoryLength: data.messageHistory?.length ?? 0,
      });

      let result: Awaited<ReturnType<typeof streamMutation.mutateAsync>>;
      try {
        result = await streamMutation.mutateAsync({
          requestData: data,
        });
      } catch (err) {
        // mutateAsync throws the full ErrorResponseType on non-success responses
        const failMessage = parseError(err).message;
        logger.error("Stream request failed", { message: failMessage });

        const activeThreadId = data.threadId;
        if (activeThreadId) {
          addErrorMessageToChat(
            activeThreadId,
            data.rootFolderId,
            failMessage,
            "HTTP_ERROR",
            null,
            null,
            logger,
          );
        }

        toast({
          title: t("error.title"),
          description: failMessage,
          variant: "destructive",
          duration: Infinity,
        });

        return false;
      }

      if (!result.success) {
        logger.error("Stream request failed", {
          message: result.message,
        });

        const activeThreadId = data.threadId;
        if (activeThreadId) {
          addErrorMessageToChat(
            activeThreadId,
            data.rootFolderId,
            serializeError(result),
            "HTTP_ERROR",
            null,
            null,
            logger,
          );
        }

        toast({
          title: t("error.title"),
          description: result.message,
          variant: "destructive",
          duration: Infinity,
        });

        return false;
      }

      // POST returned successfully - stream is now running on the server.
      // WS events will drive all UI updates. stream-finished will clean up.
      logger.info("Stream triggered successfully (fire-and-forget)", {
        threadId,
      });
      return true;
    },
    [logger, t, streamMutation],
  );

  /**
   * Cancel the stream for a specific thread.
   *
   * 1. Calls the server-side cancel endpoint (triggers AbortErrorHandler for credits).
   * 2. Stops audio playback immediately.
   * 3. Sets aborting state so the stop button shows a spinner.
   * 4. WS stream-finished event (handled by framework + onEvent) does final cleanup.
   */
  const cancelStream = useCallback(
    async (threadId: string): Promise<void> => {
      logger.info("Cancel stream requested by user", { threadId });

      // Stop audio immediately
      getAudioQueue().stop();

      // Set aborting - shows spinner on stop button until stream-finished arrives
      storeSetAborting(threadId, true);

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

          // Even if cancel endpoint fails, clear aborting UI
          storeClearThread(threadId);
        }
      } catch (error) {
        logger.error("Failed to call cancel endpoint", {
          error: error instanceof Error ? error.message : String(error),
          threadId,
        });

        // Even if cancel endpoint fails, clear aborting UI
        storeClearThread(threadId);
      }

      // Server will send stream-finished which triggers final cleanup
      // via useMessagesSubscription + onEvent handler.
    },
    [logger, storeSetAborting, storeClearThread, cancelMutation],
  );

  return {
    startStream,
    cancelStream,
  };
}
