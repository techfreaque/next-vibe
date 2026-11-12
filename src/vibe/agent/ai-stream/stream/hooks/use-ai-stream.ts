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

import {
  isBrowserNetworkLossMessage,
  isErrorResponseType,
  parseError,
} from "next-vibe/core/utils/parse-error";
import { preWarmChannel } from "next-vibe/realtime/client/client";
import { buildWsChannel } from "next-vibe/realtime/core/channel";
import { toast } from "next-vibe/ui/hooks/use-toast";
import { getVisibilityState } from "next-vibe/ui/lib/dom";
import { isOnline } from "next-vibe/ui/lib/media";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import { useCallback, useMemo } from "react";
import { z } from "zod";

import { DefaultFolderId } from "../../../../core/execution-context";
import messagesDefinitions from "../../../chat/threads/[threadId]/messages/definition";
import {
  addErrorMessageToChat,
  discardOptimisticTurn,
} from "../../../chat/threads/[threadId]/messages/hooks/update-messages";
import cancelEndpoints from "../../cancel/definition";
import { serializeError } from "../../repository/errors/error-utils";
import type { AiStreamPostRequestOutput } from "../definition";
import definitions from "../definition";
import { scopedTranslation } from "../i18n";
import { isOutOfCreditsErrorCode } from "../widget/out-of-credits-card";
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
  const storeSetPending = useAIStreamStore((s) => s.setPending);
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
   * Streaming state is tracked by the framework via WS events - not here.
   */
  const startStream = useCallback(
    async (data: AiStreamPostRequestOutput): Promise<boolean> => {
      const threadId = data.threadId ?? "";

      // Reset audio queue to prevent old audio from playing
      const audioQueue = getAudioQueue(logger);
      audioQueue.stop();

      // Incognito content exists ONLY in localStorage and arrives ONLY via WS
      // events — register the stream so the IncognitoStreamKeeper holds a
      // headless subscription even if the user navigates away mid-stream.
      // stream-finished (messages definition onEvent) unregisters it.
      const isIncognitoStream =
        data.rootFolderId === DefaultFolderId.INCOGNITO && !!threadId;
      if (isIncognitoStream) {
        useAIStreamStore.getState().addIncognitoStream(threadId);
      }

      // Pre-warm the WS channel BEFORE the POST so the connection is
      // established by the time the server starts emitting events.
      if (threadId) {
        preWarmChannel(
          buildWsChannel(
            messagesDefinitions.GET,
            { threadId },
            { rootFolderId: data.rootFolderId },
            logger,
          ),
          locale,
          logger,
          {
            endpointPath: messagesDefinitions.GET.path,
            method: messagesDefinitions.GET.method,
            urlPathParams: { threadId },
            requestData: { rootFolderId: data.rootFolderId },
          },
        );
      }

      // Mark thread as pending immediately — shows stop button before first WS event.
      if (threadId) {
        storeSetPending(threadId, true);
      }

      // Make the POST request via useApiMutation (type-safe, handles
      // FormData automatically when File objects are present).
      // The server fires-and-forgets the stream - POST returns immediately.
      // WS events (handled by useMessagesSubscription) drive all UI updates.
      logger.debug("Making AI stream request", {
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
        if (threadId) {
          storeSetPending(threadId, false);
        }
        if (isIncognitoStream) {
          useAIStreamStore.getState().removeIncognitoStream(threadId);
        }
        // mutateAsync throws the full ErrorResponseType on non-success
        // responses - BOTH a server-returned failure (403, 402, 500 ...) AND a
        // browser-level fetch failure (callApi wraps those as an
        // INTERNAL_ERROR "Request to ... failed: Failed to fetch").
        const parsedErr = parseError(err);
        const failMessage = parsedErr.message;
        const errorType = isErrorResponseType(err) ? err.errorType : null;
        // Browser-level connectivity loss ("Load failed" on Safari, "Failed
        // to fetch" on Chrome, Firefox's NetworkError) is most likely the
        // user's network (a server outage looks the same) - warn. Anything
        // else (timeout, malformed response, server rejection) stays an error.
        const isBrowserNetworkLoss = isBrowserNetworkLossMessage(failMessage);
        // Credit refusal (402) is an expected outcome, shown as a card below.
        const isCreditRefusal =
          errorType !== null && isOutOfCreditsErrorCode(errorType.errorCode);
        // Only a request that never got a response is a "network error"; a
        // server answer (4xx/5xx) is labelled as such with its status.
        const label = isBrowserNetworkLoss
          ? "Stream request network error"
          : errorType !== null
            ? "Stream request rejected by server"
            : "Stream request failed (no server response)";
        (isBrowserNetworkLoss || isCreditRefusal
          ? logger.warn
          : logger.error
        ).bind(logger)(label, {
          message: failMessage,
          errorKey: errorType?.errorKey ?? null,
          errorCode: errorType?.errorCode ?? null,
          errorName: parsedErr.name,
          operation: data.operation,
          model: data.model,
          threadId: data.threadId,
          rootFolderId: data.rootFolderId,
          online: isOnline(),
        });

        const activeThreadId = data.threadId;
        // Credit refusal (402): the composer shows a sign-up / top-up card
        // (visible on new and existing threads alike) - no error bubble, no
        // destructive toast.
        if (isCreditRefusal) {
          if (activeThreadId) {
            discardOptimisticTurn(activeThreadId, data.rootFolderId, logger);
          }
          useAIStreamStore.getState().setCreditRefusal(true);
          return false;
        }
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
        if (threadId) {
          storeSetPending(threadId, false);
        }
        if (isIncognitoStream) {
          useAIStreamStore.getState().removeIncognitoStream(threadId);
        }
        const resultMessage = result.message;
        // 4xx (no credits, forbidden folder) is shown to the user - warn;
        // a server failure is an error.
        const isServerFailure = (result.errorType?.errorCode ?? 500) >= 500;
        (isServerFailure ? logger.error : logger.warn).bind(logger)(
          "Stream request failed",
          {
            message: resultMessage,
            errorType: result.errorType?.errorCode,
            operation: data.operation,
            model: data.model,
            threadId: data.threadId,
          },
        );

        const activeThreadId = data.threadId;
        if (isOutOfCreditsErrorCode(result.errorType?.errorCode)) {
          if (activeThreadId) {
            discardOptimisticTurn(activeThreadId, data.rootFolderId, logger);
          }
          useAIStreamStore.getState().setCreditRefusal(true);
          return false;
        }
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
          description: resultMessage,
          variant: "destructive",
          duration: Infinity,
        });

        return false;
      }

      // POST returned successfully - stream is now running on the server.
      // WS events will drive all UI updates. stream-finished will clean up.
      useAIStreamStore.getState().setCreditRefusal(false);
      logger.debug("Stream triggered successfully (fire-and-forget)", {
        threadId,
      });
      return true;
    },
    [logger, t, streamMutation, locale, storeSetPending],
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
      getAudioQueue(logger).stop();

      // Set aborting - shows spinner on stop button until stream-finished arrives
      storeSetAborting(threadId, true);

      // Safety timeout: if stream-finished doesn't arrive within 15s, force-clear
      // the aborting state so the stop button doesn't stay stuck indefinitely.
      // What the server answered decides where the stuck stream-finished got
      // lost: "pending" = the cancel POST itself hung, "cancelled" = the
      // stream was signalled but never emitted stream-finished, "idle" = the
      // server saw no live stream (the finish event was lost on the WS).
      // "cancelled" with no stream-finished is what a stream orphaned by a
      // server restart looks like; the cancel endpoint now reaps those after
      // 8s and emits stream-finished, so a timeout here with cancelOutcome
      // "cancelled" means that event was lost on the WS too.
      let cancelOutcome: "pending" | "cancelled" | "idle" = "pending";
      const cancelStartedAt = Date.now();
      let cancelAckMs: number | null = null;
      const safetyTimeout = setTimeout(() => {
        if (useAIStreamStore.getState().isAborting(threadId)) {
          logger.warn(
            "Cancel safety timeout fired - force-clearing aborting state",
            {
              threadId,
              cancelOutcome,
              cancelAckMs,
              elapsedMs: Date.now() - cancelStartedAt,
              isPending: useAIStreamStore.getState().isPending(threadId),
              online: isOnline(),
              visibilityState: getVisibilityState(),
            },
          );
          storeClearThread(threadId);
        }
      }, 15_000);

      // Placeholder ids (e.g. "new" before the thread exists) have nothing to
      // cancel server-side - the endpoint would just reject them as invalid UUIDs.
      if (!z.string().uuid().safeParse(threadId).success) {
        logger.warn("Cancel skipped: thread id is not a UUID", { threadId });
        clearTimeout(safetyTimeout);
        storeClearThread(threadId);
        return;
      }

      // Call server-side cancel endpoint via typesafe mutation
      try {
        const result = await cancelMutation.mutateAsync({
          requestData: { threadId },
        });
        cancelAckMs = Date.now() - cancelStartedAt;

        if (result.success) {
          cancelOutcome = result.data.cancelled ? "cancelled" : "idle";
          logger.info("Cancel endpoint called successfully", { threadId });
        } else {
          logger.error("Cancel endpoint returned error", {
            message: result.message,
            threadId,
          });

          // Even if cancel endpoint fails, clear aborting UI
          clearTimeout(safetyTimeout);
          storeClearThread(threadId);
        }
      } catch (error) {
        logger.error("Failed to call cancel endpoint", {
          error: parseError(error).message,
          threadId,
        });

        // Even if cancel endpoint fails, clear aborting UI
        clearTimeout(safetyTimeout);
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
