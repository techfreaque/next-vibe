/**
 * Message Operations Hook
 * Handles all message-related CRUD operations (send, retry, branch, delete, vote)
 * Located in threads/[threadId]/messages/ folder as per architectural standards
 */

import { toast } from "next-vibe-ui/hooks/use-toast";
import { parseError } from "next-vibe/shared/utils";
import { useCallback, useMemo, useRef } from "react";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { answerAsAI as answerAsAIOp } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/answer-as-ai";
import { branchMessage as branchMessageOp } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/branch-message";
import { retryMessage as retryMessageOp } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/retry-message";
import { sendMessage as sendMessageOp } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/send-message";
import type { FavoriteConfig } from "@/app/api/[locale]/agent/chat/favorites/db";
import messageIdDefinitions from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/[messageId]/definition";
import voteDefinitions from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/[messageId]/vote/definition";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useApiMutation } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { StartStreamFn } from "../../../../../ai-stream/stream/hooks/shared";
import type { UseAIStreamReturn } from "../../../../../ai-stream/stream/hooks/use-ai-stream";
import { DefaultFolderId } from "../../../../config";
import { useChatNavigationStore } from "../../../../hooks/use-chat-navigation-store";
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
  depsRef.current = deps;

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
      if (!d.settings.selectedModel) {
        toast({
          title: "No model selected",
          description:
            "Please select a model before sending a message. Check your API keys and model settings.",
          variant: "destructive",
        });
        return { success: false, createdThreadId: null };
      }
      return sendMessageOp(
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
    },
    [logger, user, locale],
  );

  const retryMessage = useCallback(
    async (
      messageId: string,
      attachments: File[] | undefined,
    ): Promise<void> => {
      const d = depsRef.current;
      if (!d.settings.selectedModel) {
        toast({
          title: "No model selected",
          description:
            "Please select a model before retrying. Check your API keys and model settings.",
          variant: "destructive",
        });
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
    [logger, user, setLeafMessageId, locale],
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
        toast({
          title: "No model selected",
          description:
            "Please select a model before editing. Check your API keys and model settings.",
          variant: "destructive",
        });
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
        toast({
          title: "No model selected",
          description:
            "Please select a model before answering. Check your API keys and model settings.",
          variant: "destructive",
        });
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
      });
    },
    [logger],
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
          deleteIncognitoMessage(messageId);
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

        const result = await deleteMutateAsync({
          requestData: { rootFolderId: currentRootFolderId },
          urlPathParams: { threadId: message.threadId, messageId },
        });

        if (!result.success) {
          if (result.errorType.errorCode === 404) {
            logger.warn(
              "Message operations: Message not found on server (already deleted?), removing from local cache",
              { messageId, threadId: message.threadId },
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
            threadId: message.threadId,
          });
          return;
        }

        logger.debug("Message operations: Server deletion successful", {
          messageId,
          threadId: message.threadId,
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

      try {
        const result = await voteMutateAsync({
          requestData: { vote: voteString, rootFolderId: currentRootFolderId },
          urlPathParams: { threadId: message.threadId, messageId },
        });

        if (!result.success) {
          logger.error("Message operations: Failed to vote on message", {
            message: result.message,
          });
          return;
        }

        // Update message with authoritative server counts and current user's vote in metadata
        const userId = user?.id;
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
        logger.error(
          "Message operations: Failed to vote on message",
          parseError(error),
        );
      }
    },
    [logger, activeThreadId, currentRootFolderId, voteMutateAsync, user?.id],
  );

  const stopGeneration = useCallback((): void => {
    logger.debug("Message operations: Stopping generation and TTS playback");
    if (activeThreadId) {
      void cancelStream(activeThreadId);
    }

    // Also stop TTS playback if it's playing
    if (typeof window !== "undefined") {
      void import("../../../../../ai-stream/stream/hooks/audio-queue")
        .then(({ getAudioQueue }) => {
          const audioQueue = getAudioQueue();
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
    }),
    [
      sendMessage,
      retryMessage,
      branchMessage,
      answerAsAI,
      deleteMessage,
      voteMessage,
      stopGeneration,
    ],
  );
}
