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

import { MAX_UPLOAD_BYTES } from "next-vibe/core/route/body-limit";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import {
  isBrowserNetworkLossMessage,
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

import { creditPolicyReason } from "@/credits/anti-farming/reason";

import { DefaultFolderId } from "../../../../core/execution-context";
import messagesDefinitions from "../../../chat/threads/[threadId]/messages/definition";
import {
  addErrorMessageToChat,
  discardOptimisticTurn,
} from "../../../chat/threads/[threadId]/messages/hooks/update-messages";
import { isUncensoredContent } from "../../../models/uncensored-consent/constants";
import {
  getCachedUncensoredConsent,
  markUncensoredConsentMissing,
  useUncensoredConsentGate,
} from "../../../models/uncensored-consent/hooks";
import cancelEndpoints from "../../cancel/definition";
import { getChatModelById } from "../../models";
import type { AiStreamPostRequestOutput } from "../definition";
import definitions from "../definition";
import { scopedTranslation } from "../i18n";
import { getAudioQueue } from "./audio-queue";
import { useAIStreamStore } from "./store";
import { getUploadTooLargeMessage } from "./upload-limit";

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
   * Consent missing for an uncensored model (client check or server 403
   * CONSENT_REQUIRED): drop the optimistic turn, keep the composer text (the
   * caller restores it) and open the consent dialog. A plain send goes out by
   * itself right after the person agrees. Never an error bubble or toast.
   */
  const holdForConsent = useCallback(
    (data: AiStreamPostRequestOutput, modelName: string): void => {
      if (data.threadId) {
        discardOptimisticTurn(data.threadId, data.rootFolderId, logger);
      }
      logger.info("Stream held: uncensored model needs consent", {
        model: data.model,
        operation: data.operation,
        threadId: data.threadId,
      });
      useUncensoredConsentGate.getState().request({
        prompt: "send",
        modelName,
        resendOnAgree: data.operation === "send",
      });
    },
    [logger],
  );

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
      useAIStreamStore.getState().setLastSendCreditRefusalRequestId(null);

      // Uncensored model without the one-time 18+ consent: hold the send and
      // show the consent dialog instead of a request the server refuses.
      // Tool confirmations continue a turn that already runs - never held.
      // Unknown status (never loaded) goes through; the server decides.
      const model = getChatModelById(data.model);
      const isContinuation =
        !!data.toolConfirmations && data.toolConfirmations.length > 0;
      if (
        !isContinuation &&
        isUncensoredContent(model?.content) &&
        getCachedUncensoredConsent(logger) === false
      ) {
        holdForConsent(data, model?.name ?? data.model);
        return false;
      }

      // Files above the proxy body limit arrive truncated and the server
      // sees an empty body. Stop here with the real reason.
      const uploadTooLargeMessage = getUploadTooLargeMessage(data, locale);
      if (uploadTooLargeMessage) {
        const errorMessageId = data.threadId
          ? addErrorMessageToChat(
              data.threadId,
              data.rootFolderId,
              uploadTooLargeMessage,
              "HTTP_ERROR",
              null,
              null,
              logger,
            )
          : null;
        logger.warn("Stream request blocked: upload too large", {
          operation: data.operation,
          threadId: data.threadId,
          errorMessageId,
          rootFolderId: data.rootFolderId,
          attachmentCount: data.attachments?.length ?? 0,
          uploadLimitBytes: MAX_UPLOAD_BYTES,
          audioUploadBytes: data.audioInput?.file?.size ?? 0,
          uploadBytes:
            (data.attachments?.reduce((sum, file) => sum + file.size, 0) ?? 0) +
            (data.audioInput?.file?.size ?? 0),
        });
        toast({
          title: t("error.title"),
          description: uploadTooLargeMessage,
          variant: "destructive",
        });
        return false;
      }

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

      const attempt: { requestId?: string } = {};
      const result = await streamMutation.mutateAsync({
        requestData: data,
        onRequestId: (id) => {
          attempt.requestId = id;
        },
      });
      if (!result.success) {
        if (threadId) {
          storeSetPending(threadId, false);
        }
        if (isIncognitoStream) {
          useAIStreamStore.getState().removeIncognitoStream(threadId);
        }
        // mutateAsync resolves with the full ErrorResponseType on non-success
        // responses - BOTH a server-returned failure (403, 402, 500 ...) AND a
        // browser-level fetch failure (callApi wraps those as an
        // INTERNAL_ERROR "Request to ... failed: Failed to fetch").
        const parsedErr = parseError(result);
        const failMessage = parsedErr.message;
        const { errorType } = result;
        // Browser-level connectivity loss ("Load failed" on Safari, "Failed
        // to fetch" on Chrome, Firefox's NetworkError) is most likely the
        // user's network (a server outage looks the same) - warn. Anything
        // else (timeout, malformed response, server rejection) stays an error.
        const isBrowserNetworkLoss = isBrowserNetworkLossMessage(failMessage);
        // Credit refusal (402) is an expected outcome, shown as a card below.
        const isCreditRefusal =
          errorType.errorCode === ErrorResponseTypes.PAYMENT_REQUIRED.errorCode;
        // Consent refusal (403 CONSENT_REQUIRED) is expected too: dialog below.
        const isConsentRefusal =
          errorType.errorKey === ErrorResponseTypes.CONSENT_REQUIRED.errorKey;
        // HTTP_ERROR = callApi got a response that is not our API's JSON
        // (e.g. a 200 text/html page from a proxy, captive portal or content
        // filter). It is not a handler rejection: the HTTP status, headers and
        // body snippet live on the "callApi: non-JSON response" row with the
        // same tabId, and errorCode below is only the type's default (500).
        const isNonApiResponse =
          errorType.errorKey === ErrorResponseTypes.HTTP_ERROR.errorKey;
        // Only a request that never got a response is a "network error"; a
        // server answer (4xx/5xx) is labelled as such with its status.
        const label = isBrowserNetworkLoss
          ? "Stream request network error"
          : isNonApiResponse
            ? "Stream request got a non-API response"
            : "Stream request rejected by server";
        const activeThreadId = data.threadId;
        const errorMessageId =
          activeThreadId && !isCreditRefusal && !isConsentRefusal
            ? addErrorMessageToChat(
                activeThreadId,
                data.rootFolderId,
                failMessage,
                "HTTP_ERROR",
                null,
                null,
                logger,
              )
            : null;
        const occurrence = {
          message: failMessage,
          model: data.model,
          threadId: data.threadId,
          rootFolderId: data.rootFolderId,
        };
        (isBrowserNetworkLoss || isCreditRefusal || isConsentRefusal
          ? logger.warn
          : logger.error
        ).bind(logger)(label, {
          requestId: attempt.requestId,
          errorKey: errorType.errorKey,
          errorCode: errorType.errorCode,
          errorName: parsedErr.name,
          operation: data.operation,
          errorMessageId,
          online: isOnline(),
          // A credit refusal is ONE client row per refusal (callApi leaves it
          // to the server, the rollback below is its designed recovery). The
          // translated amounts, model and thread stay out of the fingerprint.
          ...(isCreditRefusal
            ? {
                refusalDetail: {
                  ...occurrence,
                  recovery: data.threadId
                    ? "optimistic turn discarded, draft restored, top-up card shown"
                    : "top-up card shown",
                },
              }
            : occurrence),
        });

        // Consent refusal (uncensored model, no 18+ confirmation yet): the
        // consent dialog, not an error. Status is stale - mark it missing.
        if (isConsentRefusal) {
          markUncensoredConsentMissing(logger);
          holdForConsent(data, model?.name ?? data.model);
          return false;
        }

        // Credit refusal (402): the composer shows a sign-up / top-up card
        // (visible on new and existing threads alike) - no error bubble, no
        // destructive toast.
        if (isCreditRefusal) {
          useAIStreamStore
            .getState()
            .setLastSendCreditRefusalRequestId(attempt.requestId ?? "unknown");
          if (activeThreadId) {
            discardOptimisticTurn(activeThreadId, data.rootFolderId, logger);
          }
          useAIStreamStore
            .getState()
            .setCreditRefusal(
              creditPolicyReason(errorType.errorKey) ?? true,
              result.message,
              result.allowance,
            );
          return false;
        }
        toast({
          title: t("error.title"),
          description: failMessage,
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
    [logger, t, streamMutation, locale, storeSetPending, holdForConsent],
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
      // lost: "pending" = the mutation has not settled, "cancelled" = the
      // stream was signalled but the UI did not receive stream-finished, and
      // "idle" = the server saw no live stream.
      // "cancelled" with no stream-finished is what a stream orphaned by a
      // server restart looks like; the cancel endpoint now reaps those after
      // 8s and emits stream-finished, so a timeout here with cancelOutcome
      // "cancelled" means that event was lost on the WS too.
      const cancelStartedAt = Date.now();
      const attempt: {
        outcome: "pending" | "cancelled" | "idle";
        ackMs: number | null;
        requestId: string | null;
        requestStartedAt: number | null;
        timedOut: boolean;
      } = {
        outcome: "pending",
        ackMs: null,
        requestId: null,
        requestStartedAt: null,
        timedOut: false,
      };
      const safetyTimeout = setTimeout(() => {
        if (useAIStreamStore.getState().isAborting(threadId)) {
          attempt.timedOut = true;
          logger.warn(
            "Cancel safety timeout fired - force-clearing aborting state",
            {
              threadId,
              cancelOutcome: attempt.outcome,
              cancelAckMs: attempt.ackMs,
              requestId: attempt.requestId,
              cancelDispatchMs:
                attempt.requestStartedAt === null
                  ? null
                  : attempt.requestStartedAt - cancelStartedAt,
              elapsedMs: Date.now() - cancelStartedAt,
              isPending: useAIStreamStore.getState().isPending(threadId),
              cancelRequestAcknowledged: attempt.ackMs !== null,
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
          onRequestId: (id) => {
            attempt.requestId = id;
            attempt.requestStartedAt = Date.now();
          },
        });
        const elapsedMs = Date.now() - cancelStartedAt;

        if (result.success) {
          attempt.ackMs = elapsedMs;
          attempt.outcome = result.data.cancelled ? "cancelled" : "idle";
          const context = {
            threadId,
            requestId: attempt.requestId,
            cancelOutcome: attempt.outcome,
            cancelAckMs: attempt.ackMs,
          };
          if (attempt.timedOut) {
            logger.warn(
              "Cancel endpoint acknowledged after the safety timeout",
              context,
            );
          } else {
            logger.info("Cancel endpoint called successfully", context);
          }
          // "idle": the server saw no live stream and already reset the thread
          // to IDLE. Its stream-finished WS event is only a courtesy copy and
          // is lost whenever the socket is suspended (hidden mobile tab), which
          // left the stop button spinning until the 15s safety timeout.
          // The HTTP answer is authoritative: unlock now.
          if (!result.data.cancelled) {
            clearTimeout(safetyTimeout);
            storeClearThread(threadId);
          }
        } else {
          logger.error("Cancel endpoint returned error", {
            message: result.message,
            threadId,
            requestId: attempt.requestId,
            elapsedMs,
            safetyTimedOut: attempt.timedOut,
            errorKey: result.errorType.errorKey,
            status: result.errorType.errorCode,
          });

          // Even if cancel endpoint fails, clear aborting UI
          clearTimeout(safetyTimeout);
          storeClearThread(threadId);
        }
      } catch (error) {
        logger.error("Failed to call cancel endpoint", {
          error: parseError(error).message,
          threadId,
          requestId: attempt.requestId,
          elapsedMs: Date.now() - cancelStartedAt,
          safetyTimedOut: attempt.timedOut,
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
