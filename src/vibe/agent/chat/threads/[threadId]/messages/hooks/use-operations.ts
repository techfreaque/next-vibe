/**
 * Message Operations Hook
 * Handles all message-related CRUD operations (send, retry, branch, delete, vote)
 * Located in threads/[threadId]/messages/ folder as per architectural standards
 */

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { parseError } from "next-vibe/core/utils/parse-error";
import { toast } from "next-vibe/ui/hooks/use-toast";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";

import { useCredits } from "@/credits/hooks";
import type { ChatModelId } from "../../../../../ai-stream/models";
import { getChatModelById } from "../../../../../ai-stream/models";
import { answerAsAI as answerAsAIOp } from "../../../../../ai-stream/stream/hooks/answer-as-ai";
import { branchMessage as branchMessageOp } from "../../../../../ai-stream/stream/hooks/branch-message";
import { retryMessage as retryMessageOp } from "../../../../../ai-stream/stream/hooks/retry-message";
import { sendMessage as sendMessageOp } from "../../../../../ai-stream/stream/hooks/send-message";
import type { StartStreamFn } from "../../../../../ai-stream/stream/hooks/shared";
import type { UseAIStreamReturn } from "../../../../../ai-stream/stream/hooks/use-ai-stream";
import type { AiStreamT } from "../../../../../ai-stream/stream/i18n";
import { scopedTranslation as aiStreamScopedTranslation } from "../../../../../ai-stream/stream/i18n";
import {
  DEFAULT_INPUT_TOKENS,
  DEFAULT_OUTPUT_TOKENS,
} from "../../../../../models/constants";
import { useChatInputStore } from "../../../../../ai-stream/stream/hooks/input-store";
import { calculateCreditCost } from "../../../../../models/models";
import type { FavoriteConfig } from "../../../../../skills/favorites/db";
import { NEW_MESSAGE_ID } from "../../../../enum";
import { useChatBootContext } from "../../../../hooks/context";
import { useChatNavigationStore } from "../../../../hooks/use-chat-navigation-store";
import messageIdDefinitions from "../[messageId]/definition";
import voteDefinitions from "../[messageId]/vote/definition";
import messagesDefinition from "../definition";
import { patchMessage, removeMessage } from "./update-messages";

type CancelStreamFn = UseAIStreamReturn["cancelStream"];

/**
 * Message operations interface
 */
export interface MessageOperations {
  sendMessage: (
    params: {
      content: string;
      threadId?: string;
      parentId?: string;
      toolConfirmations?: Array<{
        messageId: string;
        confirmed: boolean;
        updatedArgs?: Record<string, string | number | boolean | null>;
      }>;
      /** Audio input for voice-to-voice mode - bypasses text content */
      audioInput?: { file: File };
      /** File attachments */
      attachments: File[];
      /** Image generation settings */
      imageSize?: string;
      imageQuality?: string;
      /** Music generation settings */
      musicDuration?: string;
    },
    onThreadCreated?: (
      threadId: string,
      rootFolderId: DefaultFolderId,
      subFolderId: string | null,
    ) => void,
  ) => Promise<{ success: boolean; createdThreadId: string | null }>;
  retryMessage: (
    messageId: string,
    attachments: File[] | undefined,
  ) => Promise<void>;
  branchMessage: (
    messageId: string,
    newContent: string,
    /** Optional audio input for voice-to-voice mode */
    audioInput: { file: File } | undefined,
    /** File attachments */
    attachments: File[] | undefined,
  ) => Promise<void>;
  answerAsAI: (
    messageId: string,
    content: string,
    attachments: File[] | undefined,
  ) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  voteMessage: (messageId: string, vote: 1 | -1 | 0) => Promise<void>;
  stopGeneration: () => void;
  /** Infinity while the balance is unknown (load failed) - never a fake 0 */
  creditsTotal: number;
  /** Balance could not be loaded (server and client) - show retry, not "0" */
  creditsLoadFailed: boolean;
  retryCredits: () => void;
}

/**
 * Message operations dependencies
 */
export interface MessageOperationsDeps {
  startStream: StartStreamFn;
  cancelStream: CancelStreamFn;
  activeThreadId: string | null;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  /** leafMessageId - must be passed as prop, not read from nav store, to support nested AI streams */
  leafMessageId: string | null;
  settings: {
    selectedModel: ChatModelId | null;
    selectedSkill: string;
    ttsAutoplay: boolean;
  };
  /** Active favorite config for model/tool resolution */
  favoriteConfig: FavoriteConfig | null;
}

/** Toast shown when a turn is attempted with no model selected. */
function toastNoModel(t: AiStreamT): void {
  toast({
    title: t("input.noModel.title"),
    description: t("input.noModel.description"),
    variant: "destructive",
  });
}

/**
 * Block a turn the balance cannot cover (cost estimated at default turn size)
 * and tell the customer why. Returns true when the turn may proceed.
 */
function passesCreditGuard(
  t: AiStreamT,
  creditsTotal: number,
  modelId: ChatModelId,
  isGuest: boolean,
): boolean {
  if (creditsTotal <= 0) {
    toast({
      // Guests can't top up — point them at a free account instead
      title: isGuest
        ? t("outOfCredits.guest.title")
        : t("input.noCredits.title"),
      description: isGuest
        ? t("outOfCredits.guest.description")
        : t("input.noCredits.description"),
      variant: "destructive",
      duration: Infinity,
    });
    return false;
  }
  const modelInfo = getChatModelById(modelId);
  if (modelInfo) {
    const modelCost = calculateCreditCost(
      modelInfo,
      DEFAULT_INPUT_TOKENS,
      DEFAULT_OUTPUT_TOKENS,
    );
    if (creditsTotal < modelCost) {
      toast({
        title: t("input.insufficientCredits.title", {
          cost: modelCost.toFixed(1),
          balance: creditsTotal.toFixed(1),
        }),
        description: t("input.insufficientCredits.description"),
        variant: "destructive",
        duration: Infinity,
      });
      return false;
    }
  }
  return true;
}

/**
 * Hook for message operations
 */
export function useMessageOperations(
  deps: MessageOperationsDeps,
): MessageOperations {
  const { cancelStream, activeThreadId, currentRootFolderId } = deps;

  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const setLeafMessageId = useChatNavigationStore((s) => s.setLeafMessageId);
  const { initialCredits } = useChatBootContext();
  const creditsEndpoint = useCredits(user, logger, initialCredits);
  const creditsResponse = creditsEndpoint?.read?.response;
  const creditsTotal = creditsResponse?.success
    ? creditsResponse.data.total
    : (initialCredits?.total ?? Infinity);
  const creditsLoadFailed =
    !initialCredits &&
    creditsResponse !== undefined &&
    !creditsResponse.success;
  const refetchCredits = creditsEndpoint?.refetchCredits;
  const retryCredits = useCallback((): void => {
    refetchCredits?.();
  }, [refetchCredits]);
  const { mutateAsync: deleteMutateAsync } = useApiMutation(
    messageIdDefinitions.DELETE,
    logger,
    user,
  );
  const { mutateAsync: voteMutateAsync } = useApiMutation(
    voteDefinitions.POST,
    logger,
    user,
  );

  // Keep a ref to deps so async callbacks always use the latest values.
  // Prevents stale closures when React batches state updates during navigation.
  const depsRef = useRef(deps);
  // Stop pressed while a new thread's first send had no real id yet.
  const stopRequestedBeforeThreadIdRef = useRef(false);
  useLayoutEffect(() => {
    depsRef.current = deps;
  });
  const userId = user?.id;

  const sendMessage = useCallback(
    async (
      params: {
        content: string;
        threadId?: string;
        parentId?: string;
        toolConfirmations?: Array<{
          messageId: string;
          confirmed: boolean;
          updatedArgs?: Record<string, string | number | boolean | null>;
        }>;
        audioInput?: { file: File };
        attachments: File[];
        imageSize?: string;
        imageQuality?: string;
        musicDuration?: string;
      },
      onThreadCreated?: (
        threadId: string,
        rootFolderId: DefaultFolderId,
        subFolderId: string | null,
      ) => void,
    ): Promise<{ success: boolean; createdThreadId: string | null }> => {
      // Read latest deps from ref to avoid stale closure values
      const d = depsRef.current;
      const { t } = aiStreamScopedTranslation.scopedT(locale);
      if (!d.settings.selectedModel) {
        toastNoModel(t);
        return { success: false, createdThreadId: null };
      }
      if (
        !passesCreditGuard(
          t,
          creditsTotal,
          d.settings.selectedModel,
          user.isPublic,
        )
      ) {
        return { success: false, createdThreadId: null };
      }
      stopRequestedBeforeThreadIdRef.current = false;
      const result = await sendMessageOp(
        params,
        {
          logger,
          startStream: d.startStream,
          activeThreadId: d.activeThreadId,
          currentRootFolderId: d.currentRootFolderId,
          currentSubFolderId: d.currentSubFolderId,
          leafMessageId: d.leafMessageId,
          user,
          settings: {
            ...d.settings,
            selectedModel: d.settings.selectedModel,
          },
          favoriteConfig: d.favoriteConfig,
          locale,
        },
        onThreadCreated,
      );
      if (stopRequestedBeforeThreadIdRef.current) {
        stopRequestedBeforeThreadIdRef.current = false;
        if (result.success && result.createdThreadId) {
          logger.info(
            "Message operations: applying the stop pressed before the new thread had an id",
            { threadId: result.createdThreadId },
          );
          void depsRef.current.cancelStream(result.createdThreadId);
        }
      }
      return result;
    },
    [logger, user, locale, creditsTotal],
  );

  const retryMessage = useCallback(
    async (
      messageId: string,
      attachments: File[] | undefined,
    ): Promise<void> => {
      const d = depsRef.current;
      const { t } = aiStreamScopedTranslation.scopedT(locale);
      if (!d.settings.selectedModel) {
        toastNoModel(t);
        return;
      }
      if (
        !passesCreditGuard(
          t,
          creditsTotal,
          d.settings.selectedModel,
          user.isPublic,
        )
      ) {
        return;
      }
      await retryMessageOp(messageId, attachments, {
        logger,
        startStream: d.startStream,
        currentRootFolderId: d.currentRootFolderId,
        currentSubFolderId: d.currentSubFolderId,
        activeThreadId: d.activeThreadId,
        user,
        settings: {
          ...d.settings,
          selectedModel: d.settings.selectedModel,
        },
        favoriteConfig: d.favoriteConfig,
        setLeafMessageId,
        locale,
      });
    },
    [logger, user, setLeafMessageId, locale, creditsTotal],
  );

  const branchMessage = useCallback(
    async (
      messageId: string,
      newContent: string,
      audioInput: { file: File } | undefined,
      attachments: File[] | undefined,
    ): Promise<void> => {
      const d = depsRef.current;
      if (!d.settings.selectedModel) {
        toastNoModel(aiStreamScopedTranslation.scopedT(locale).t);
        return;
      }
      await branchMessageOp(messageId, newContent, audioInput, attachments, {
        logger,
        startStream: d.startStream,
        currentRootFolderId: d.currentRootFolderId,
        currentSubFolderId: d.currentSubFolderId,
        activeThreadId: d.activeThreadId,
        user,
        settings: {
          ...d.settings,
          selectedModel: d.settings.selectedModel,
        },
        favoriteConfig: d.favoriteConfig,
        setLeafMessageId,
        locale,
      });
    },
    [logger, user, setLeafMessageId, locale],
  );

  const answerAsAI = useCallback(
    async (
      messageId: string,
      content: string,
      attachments: File[] | undefined,
    ): Promise<void> => {
      const d = depsRef.current;
      if (!d.settings.selectedModel) {
        toastNoModel(aiStreamScopedTranslation.scopedT(locale).t);
        return;
      }
      await answerAsAIOp(messageId, content, attachments, {
        logger,
        startStream: d.startStream,
        currentRootFolderId: d.currentRootFolderId,
        currentSubFolderId: d.currentSubFolderId,
        activeThreadId: d.activeThreadId,
        settings: {
          ...d.settings,
          selectedModel: d.settings.selectedModel,
        },
        favoriteConfig: d.favoriteConfig,
        executionContext: { mode: "local" as const },
      });
    },
    [logger, locale],
  );

  const deleteMessage = useCallback(
    async (messageId: string): Promise<void> => {
      logger.debug("Message operations: Deleting message", { messageId });

      if (!activeThreadId) {
        logger.error("Message operations: No active thread", { messageId });
        return;
      }

      // Look up message from apiClient cache
      const cached = apiClient.getEndpointData(messagesDefinition.GET, logger, {
        urlPathParams: { threadId: activeThreadId },
        requestData: { rootFolderId: currentRootFolderId },
      });
      const message = cached?.success
        ? cached.data.messages.find((m) => m.id === messageId)
        : undefined;

      if (!message) {
        logger.error("Message operations: Message not found in cache", {
          messageId,
          activeThreadId,
        });
        return;
      }

      const isIncognitoThread =
        currentRootFolderId === DefaultFolderId.INCOGNITO;

      logger.debug("Message operations: Delete message thread type check", {
        messageId,
        currentRootFolderId,
        isIncognitoThread,
      });

      // Handle incognito deletion (client-side only)
      if (isIncognitoThread) {
        logger.debug(
          "Message operations: Deleting incognito message (client-side only)",
          {
            messageId,
          },
        );

        removeMessage(activeThreadId, currentRootFolderId, logger, messageId);

        try {
          const { deleteMessage: deleteIncognitoMessage } =
            await import("../../../../incognito/storage");
          await deleteIncognitoMessage(messageId, logger);
          logger.debug(
            "Message operations: Deleted incognito message from localStorage",
            {
              messageId,
            },
          );
        } catch (error) {
          logger.error(
            "Message operations: Failed to delete incognito message from localStorage",
            parseError(error),
          );
        }

        return;
      }

      // Handle server-side message deletion
      try {
        logger.debug("Message operations: Making DELETE request to server", {
          threadId: message.threadId,
          messageId,
        });

        // Use activeThreadId, not message.threadId - the cached message row
        // doesn't reliably carry its own threadId, which was reaching the
        // mutation as undefined and failing "Missing URL path parameter".
        // activeThreadId is already confirmed non-null above.
        const result = await deleteMutateAsync({
          requestData: { rootFolderId: currentRootFolderId },
          urlPathParams: { threadId: activeThreadId, messageId },
        });

        if (!result.success) {
          if (result.errorType.errorCode === 404) {
            logger.warn(
              "Message operations: Message not found on server (already deleted?), removing from local cache",
              { messageId, threadId: activeThreadId },
            );
            removeMessage(
              activeThreadId,
              currentRootFolderId,
              logger,
              messageId,
            );
            return;
          }

          logger.error("Message operations: Server failed to delete message", {
            message: result.message,
            messageId,
            threadId: activeThreadId,
          });
          return;
        }

        logger.debug("Message operations: Server deletion successful", {
          messageId,
          threadId: activeThreadId,
        });

        removeMessage(activeThreadId, currentRootFolderId, logger, messageId);
      } catch (error) {
        logger.error(
          "Message operations: Exception during message deletion",
          parseError(error),
        );
      }
    },
    [logger, activeThreadId, currentRootFolderId, deleteMutateAsync],
  );

  const voteMessage = useCallback(
    async (messageId: string, vote: 1 | -1 | 0): Promise<void> => {
      logger.debug("Message operations: Voting on message", {
        messageId,
        vote,
      });

      if (!activeThreadId) {
        logger.error("Message operations: No active thread", { messageId });
        return;
      }

      // Look up message from apiClient cache
      const cached = apiClient.getEndpointData(messagesDefinition.GET, logger, {
        urlPathParams: { threadId: activeThreadId },
        requestData: { rootFolderId: currentRootFolderId },
      });
      const message = cached?.success
        ? cached.data.messages.find((m) => m.id === messageId)
        : undefined;

      if (!message) {
        logger.error("Message operations: Message not found in cache", {
          messageId,
        });
        return;
      }

      const voteString = vote === 1 ? "up" : vote === -1 ? "down" : "remove";
      const voteContext = {
        messageId,
        threadId: activeThreadId,
        rootFolderId: currentRootFolderId,
        role: message.role,
        isAI: message.isAI,
        ageMs: Date.now() - new Date(message.createdAt).getTime(),
      };

      try {
        // Use activeThreadId, not message.threadId - see deleteMessage above.
        const result = await voteMutateAsync({
          requestData: { vote: voteString, rootFolderId: currentRootFolderId },
          urlPathParams: { threadId: activeThreadId, messageId },
        });

        if (!result.success) {
          logger.error("Message operations: Failed to vote on message", {
            message: result.message,
            ...voteContext,
          });
          return;
        }

        // Update message with authoritative server counts and current user's vote in metadata
        const currentVoteDetails = Array.isArray(message.metadata?.voteDetails)
          ? message.metadata.voteDetails.filter((v) => v.userId !== userId)
          : [];
        if (result.data.userVote !== "none" && userId) {
          currentVoteDetails.push({
            userId,
            vote: result.data.userVote,
            timestamp: Date.now(),
          });
        }
        const currentVoterIds = Array.isArray(message.metadata?.voterIds)
          ? message.metadata.voterIds.filter((id) => id !== userId)
          : [];
        if (result.data.userVote !== "none" && userId) {
          currentVoterIds.push(userId);
        }

        patchMessage(activeThreadId, currentRootFolderId, logger, messageId, {
          upvotes: result.data.upvotes,
          downvotes: result.data.downvotes,
          metadata: {
            ...message.metadata,
            voteDetails: currentVoteDetails,
            voterIds: currentVoterIds,
          },
        });
      } catch (error) {
        // A 404 here means the message is in the client cache but not in the
        // DB (client-only row, unpersisted stream, mirror id drift) - the
        // context below says which.
        logger.error(
          "Message operations: Failed to vote on message",
          parseError(error),
          voteContext,
        );
      }
    },
    [logger, activeThreadId, currentRootFolderId, voteMutateAsync, userId],
  );

  const stopGeneration = useCallback((): void => {
    logger.debug("Message operations: Stopping generation and TTS playback");
    if (activeThreadId && activeThreadId !== NEW_MESSAGE_ID) {
      void cancelStream(activeThreadId);
    } else if (useChatInputStore.getState().isSubmitting) {
      // Stop pressed on the new-thread page while the first send is still
      // creating its thread: there is no real id to cancel yet, and cancelling
      // "new" was a no-op that let the stream run on. sendMessage cancels the
      // real thread as soon as its stream has started.
      logger.info(
        "Message operations: stop pressed before the new thread had an id - cancelling once its stream starts",
      );
      stopRequestedBeforeThreadIdRef.current = true;
    }
    // Otherwise there is no stream on the new-thread page: the button only
    // stopped TTS playback, handled below.

    // Also stop TTS playback if it's playing
    if (typeof window !== "undefined") {
      void import("../../../../../ai-stream/stream/hooks/audio-queue")
        .then(({ getAudioQueue }) => {
          const audioQueue = getAudioQueue(logger);
          audioQueue.stop();
          logger.debug("Message operations: TTS playback stopped");
          return undefined;
        })
        .catch((error) => {
          logger.error(
            "Message operations: Failed to stop TTS playback",
            parseError(error),
          );
        });
    }
  }, [logger, cancelStream, activeThreadId]);

  return useMemo(
    () => ({
      sendMessage,
      retryMessage,
      branchMessage,
      answerAsAI,
      deleteMessage,
      voteMessage,
      stopGeneration,
      creditsTotal,
      creditsLoadFailed,
      retryCredits,
    }),
    [
      sendMessage,
      retryMessage,
      branchMessage,
      answerAsAI,
      deleteMessage,
      voteMessage,
      stopGeneration,
      creditsTotal,
      creditsLoadFailed,
      retryCredits,
    ],
  );
}
