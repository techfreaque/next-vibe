/**
 * Message Operations Hook
 * Handles all message-related CRUD operations (send, retry, branch, delete, vote)
 * Located in threads/[threadId]/messages/ folder as per architectural standards
 */

import { parseError } from "next-vibe/shared/utils";
import { useCallback } from "react";

import { answerAsAI as answerAsAIOp } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/answer-as-ai";
import { branchMessage as branchMessageOp } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/branch-message";
import { retryMessage as retryMessageOp } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/retry-message";
import { sendMessage as sendMessageOp } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/send-message";
import messageIdDefinitions from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/[messageId]/definition";
import voteDefinitions from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/[messageId]/vote/definition";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { useApiMutation } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation";
import {
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { UseAIStreamReturn } from "../../../../../ai-stream/stream/hooks/use-ai-stream";
import { DefaultFolderId } from "../../../../config";
import type { ChatMessage } from "../../../../db";
import type { ToolConfigItem } from "../../../../settings/definition";
import { useStreamingMessagesStore } from "./streaming-messages-store";

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
    },
    onThreadCreated?: (
      threadId: string,
      rootFolderId: DefaultFolderId,
      subFolderId: string | null,
    ) => void,
  ) => Promise<void>;
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
interface MessageOperationsDeps {
  aiStream: UseAIStreamReturn;
  // Navigation state - passed separately, not from chatStore
  activeThreadId: string | null;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  chatStore: {
    messages: Record<string, ChatMessage>;
    threads: Record<string, { rootFolderId: DefaultFolderId }>;
    setLoading: (loading: boolean) => void;
    getThreadMessages: (threadId: string) => ChatMessage[];
    getBranchIndices: (threadId: string) => Record<string, number>;
    deleteMessage: (messageId: string) => void;
    updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  };
  settings: {
    selectedModel: ModelId;
    selectedCharacter: string;
    allowedTools: ToolConfigItem[] | null;
    pinnedTools: ToolConfigItem[] | null;
    ttsAutoplay: boolean;
    ttsVoice: typeof TtsVoiceValue;
  };
  setInput: (input: string) => void;
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])) => void;
}

/**
 * Hook for message operations
 */
export function useMessageOperations(
  deps: MessageOperationsDeps,
): MessageOperations {
  const {
    aiStream,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    chatStore,
    settings,
    setInput,
    setAttachments,
  } = deps;

  const user = useWidgetUser();
  const logger = useWidgetLogger();

  const {
    streamingMessages,
    reset: streamReset,
    addMessage: streamAddMessage,
  } = useStreamingMessagesStore();

  const deleteMutation = useApiMutation(
    messageIdDefinitions.DELETE,
    logger,
    user,
  );
  const voteMutation = useApiMutation(voteDefinitions.POST, logger, user);

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
      },
      onThreadCreated?: (
        threadId: string,
        rootFolderId: DefaultFolderId,
        subFolderId: string | null,
      ) => void,
    ): Promise<void> => {
      await sendMessageOp(
        params,
        {
          logger,
          aiStream,
          activeThreadId,
          currentRootFolderId,
          currentSubFolderId,
          chatStore,
          settings,
          setInput,
          setAttachments,
        },
        onThreadCreated,
      );
    },
    [
      logger,
      aiStream,
      activeThreadId,
      currentRootFolderId,
      currentSubFolderId,
      chatStore,
      settings,
      setInput,
      setAttachments,
    ],
  );

  const retryMessage = useCallback(
    async (
      messageId: string,
      attachments: File[] | undefined,
    ): Promise<void> => {
      await retryMessageOp(messageId, attachments, {
        logger,
        aiStream,
        currentRootFolderId,
        currentSubFolderId,
        chatStore,
        settings,
      });
    },
    [
      logger,
      aiStream,
      currentRootFolderId,
      currentSubFolderId,
      chatStore,
      settings,
    ],
  );

  const branchMessage = useCallback(
    async (
      messageId: string,
      newContent: string,
      audioInput: { file: File } | undefined,
      attachments: File[] | undefined,
    ): Promise<void> => {
      await branchMessageOp(messageId, newContent, audioInput, attachments, {
        logger,
        aiStream,
        currentRootFolderId,
        currentSubFolderId,
        chatStore,
        settings,
      });
    },
    [
      logger,
      aiStream,
      currentRootFolderId,
      currentSubFolderId,
      chatStore,
      settings,
    ],
  );

  const answerAsAI = useCallback(
    async (
      messageId: string,
      content: string,
      attachments: File[] | undefined,
    ): Promise<void> => {
      await answerAsAIOp(messageId, content, attachments, {
        logger,
        aiStream,
        currentRootFolderId,
        currentSubFolderId,
        chatStore,
        settings,
      });
    },
    [
      logger,
      aiStream,
      currentRootFolderId,
      currentSubFolderId,
      chatStore,
      settings,
    ],
  );

  const deleteMessage = useCallback(
    async (messageId: string): Promise<void> => {
      logger.debug("Message operations: Deleting message", { messageId });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("Message operations: Message not found", { messageId });
        return;
      }

      const thread = chatStore.threads[message.threadId];
      if (!thread) {
        logger.error("Message operations: Thread not found for message", {
          messageId,
          threadId: message.threadId,
        });
        return;
      }

      // Determine if this is an incognito thread or streaming message
      // Both are handled client-side only
      const isIncognitoThread =
        thread.rootFolderId === DefaultFolderId.INCOGNITO;
      const isStreamingMessage = streamingMessages[messageId] !== undefined;

      logger.debug("Message operations: Delete message thread type check", {
        messageId,
        threadRootFolderId: thread.rootFolderId,
        isIncognitoThread,
        isStreamingMessage,
        willUseServerAPI: !isIncognitoThread && !isStreamingMessage,
      });

      // Handle incognito or streaming message deletion (client-side only)
      if (isIncognitoThread || isStreamingMessage) {
        logger.debug(
          "Message operations: Deleting message (client-side only)",
          {
            messageId,
            rootFolderId: thread.rootFolderId,
            reason: isIncognitoThread
              ? "incognito thread"
              : "streaming message",
          },
        );

        chatStore.deleteMessage(messageId);

        if (streamingMessages[messageId]) {
          // eslint-disable-next-line no-unused-vars -- Rest destructuring to exclude key
          const { [messageId]: excluded, ...remainingMessages } =
            streamingMessages;
          streamReset();
          Object.values(remainingMessages).forEach((msg) => {
            streamAddMessage(msg);
          });
        }

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

        const result = await deleteMutation.mutateAsync({
          requestData: { rootFolderId: thread.rootFolderId },
          urlPathParams: { threadId: message.threadId, messageId },
        });

        if (!result.success) {
          if (result.errorType.errorCode === 404) {
            logger.warn(
              "Message operations: Message not found on server (already deleted?), removing from local store",
              { messageId, threadId: message.threadId },
            );
            chatStore.deleteMessage(messageId);
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

        chatStore.deleteMessage(messageId);

        if (streamingMessages[messageId]) {
          // eslint-disable-next-line no-unused-vars -- Rest destructuring to exclude key
          const { [messageId]: excluded, ...remainingMessages } =
            streamingMessages;
          streamReset();
          Object.values(remainingMessages).forEach((msg) => {
            streamAddMessage(msg);
          });
        }
      } catch (error) {
        logger.error(
          "Message operations: Exception during message deletion",
          parseError(error),
        );
      }
    },
    [
      logger,
      chatStore,
      streamingMessages,
      streamReset,
      streamAddMessage,
      deleteMutation,
    ],
  );

  const voteMessage = useCallback(
    async (messageId: string, vote: 1 | -1 | 0): Promise<void> => {
      logger.debug("Message operations: Voting on message", {
        messageId,
        vote,
      });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("Message operations: Message not found", { messageId });
        return;
      }

      const thread = chatStore.threads[message.threadId];
      if (!thread) {
        logger.error("Message operations: Thread not found for message", {
          messageId,
          threadId: message.threadId,
        });
        return;
      }

      // Voting is only supported for server threads (not incognito)
      const isIncognitoThread =
        thread.rootFolderId === DefaultFolderId.INCOGNITO;

      if (isIncognitoThread) {
        logger.debug(
          "Message operations: Voting not supported in incognito mode",
          {
            messageId,
            rootFolderId: thread.rootFolderId,
          },
        );
        return;
      }

      const voteString = vote === 1 ? "up" : vote === -1 ? "down" : "remove";

      try {
        const result = await voteMutation.mutateAsync({
          requestData: { vote: voteString },
          urlPathParams: { threadId: message.threadId, messageId },
        });

        if (!result.success) {
          logger.error("Message operations: Failed to vote on message", {
            message: result.message,
          });
          return;
        }

        const updates: Partial<ChatMessage> = {};
        if (vote === 1) {
          updates.upvotes = (message.upvotes || 0) + 1;
        } else if (vote === -1) {
          updates.downvotes = (message.downvotes || 0) + 1;
        }
        chatStore.updateMessage(messageId, updates);
      } catch (error) {
        logger.error(
          "Message operations: Failed to vote on message",
          parseError(error),
        );
      }
    },
    [logger, chatStore, voteMutation],
  );

  const stopGeneration = useCallback((): void => {
    logger.debug("Message operations: Stopping generation and TTS playback");
    if (activeThreadId) {
      void aiStream.cancelStream(activeThreadId);
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
  }, [logger, aiStream, activeThreadId]);

  return {
    sendMessage,
    retryMessage,
    branchMessage,
    answerAsAI,
    deleteMessage,
    voteMessage,
    stopGeneration,
  };
}
