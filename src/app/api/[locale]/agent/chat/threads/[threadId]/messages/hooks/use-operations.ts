/**
 * Message Operations Hook
 * Handles all message-related CRUD operations (send, retry, branch, delete, vote)
 * Located in threads/[threadId]/messages/ folder as per architectural standards
 */

import { parseError } from "next-vibe/shared/utils";
import { useCallback } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { UseAIStreamReturn } from "../../../../../ai-stream/hooks/use-ai-stream";
import { DefaultFolderId } from "../../../../config";
import type { ChatMessage } from "../../../../db";
import type { ModelId } from "../../../../model-access/models";

import { answerAsAI as answerAsAIOp } from "./operations/answer-as-ai";
import { branchMessage as branchMessageOp } from "./operations/branch-message";
import { retryMessage as retryMessageOp } from "./operations/retry-message";
import { sendMessage as sendMessageOp } from "./operations/send-message";

/**
 * Message operations interface
 */
export interface MessageOperations {
  sendMessage: (
    params: {
      content: string;
      threadId?: string;
      parentId?: string;
      toolConfirmation?: {
        messageId: string;
        confirmed: boolean;
        updatedArgs?: Record<string, string | number | boolean | null>;
      };
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
  locale: CountryLanguage;
  logger: EndpointLogger;
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
  streamStore: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    streamingMessages: Record<string, any>;
    error: string | null;
    reset: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addMessage: (message: any) => void;
  };
  settings: {
    selectedModel: ModelId;
    selectedCharacter: string;
    temperature: number;
    maxTokens: number;
    enabledTools: Array<{ id: string; requiresConfirmation: boolean }>;
  };
  setInput: (input: string) => void;
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])) => void;
  deductCredits: (creditCost: number, feature: string) => void;
}

/**
 * Hook for message operations
 */
export function useMessageOperations(
  deps: MessageOperationsDeps,
): MessageOperations {
  const {
    locale,
    logger,
    aiStream,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    chatStore,
    streamStore,
    settings,
    setInput,
    setAttachments,
    deductCredits,
  } = deps;

  const sendMessage = useCallback(
    async (
      params: {
        content: string;
        threadId?: string;
        parentId?: string;
        toolConfirmation?: {
          messageId: string;
          confirmed: boolean;
          updatedArgs?: Record<string, string | number | boolean | null>;
        };
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
          deductCredits,
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
      deductCredits,
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
        deductCredits,
      });
    },
    [
      logger,
      aiStream,
      currentRootFolderId,
      currentSubFolderId,
      chatStore,
      settings,
      deductCredits,
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
        deductCredits,
      });
    },
    [
      logger,
      aiStream,
      currentRootFolderId,
      currentSubFolderId,
      chatStore,
      settings,
      deductCredits,
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
        deductCredits,
      });
    },
    [
      logger,
      aiStream,
      currentRootFolderId,
      currentSubFolderId,
      chatStore,
      settings,
      deductCredits,
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
      const isStreamingMessage =
        streamStore.streamingMessages[messageId] !== undefined;

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

        if (streamStore.streamingMessages[messageId]) {
          // eslint-disable-next-line no-unused-vars -- Rest destructuring to exclude key
          const { [messageId]: excluded, ...remainingMessages } =
            streamStore.streamingMessages;
          streamStore.reset();
          Object.values(remainingMessages).forEach((msg) => {
            streamStore.addMessage(msg);
          });
        }

        try {
          const { deleteMessage: deleteIncognitoMessage } = await import(
            "../../../../incognito/storage"
          );
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
          url: `/api/${locale}/agent/chat/threads/${message.threadId}/messages/${messageId}`,
          threadId: message.threadId,
          messageId,
        });

        const response = await fetch(
          `/api/${locale}/agent/chat/threads/${message.threadId}/messages/${messageId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const errorText = await response.text();

          // If message not found (404), it might already be deleted
          // In this case, remove it from local store anyway
          if (response.status === 404) {
            logger.warn(
              "Message operations: Message not found on server (already deleted?), removing from local store",
              {
                messageId,
                threadId: message.threadId,
                errorBody: errorText,
              },
            );
            chatStore.deleteMessage(messageId);
            return;
          }

          // For other errors, log and don't delete from store
          logger.error("Message operations: Server failed to delete message", {
            status: response.status,
            statusText: response.statusText,
            errorBody: errorText,
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

        if (streamStore.streamingMessages[messageId]) {
          // eslint-disable-next-line no-unused-vars -- Rest destructuring to exclude key
          const { [messageId]: excluded, ...remainingMessages } =
            streamStore.streamingMessages;
          streamStore.reset();
          Object.values(remainingMessages).forEach((msg) => {
            streamStore.addMessage(msg);
          });
        }
      } catch (error) {
        logger.error(
          "Message operations: Exception during message deletion",
          parseError(error),
        );
      }
    },
    [logger, chatStore, streamStore, locale],
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
        const response = await fetch(
          `/api/${locale}/agent/chat/threads/${message.threadId}/messages/${messageId}/vote`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ vote: voteString }),
          },
        );

        if (!response.ok) {
          logger.error("Message operations: Failed to vote on message", {
            status: response.status,
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
    [logger, chatStore, locale],
  );

  const stopGeneration = useCallback((): void => {
    logger.debug("Message operations: Stopping generation");
    aiStream.stopStream();
  }, [logger, aiStream]);

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
