/**
 * Message Operations Hook
 * Handles all message-related CRUD operations (send, retry, branch, delete, vote)
 * Located in threads/[threadId]/messages/ folder as per architectural standards
 */

import { useCallback } from "react";

import { AUTH_STATUS_COOKIE_PREFIX } from "@/config/constants";
import { parseError } from "next-vibe/shared/utils";
import { getCookie } from "next-vibe-ui/lib/cookies";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { DefaultFolderId } from "../../../../config";
import { ChatMessageRole, NEW_MESSAGE_ID } from "../../../../enum";
import type { ModelId } from "../../../../model-access/models";
import type { ChatMessage } from "../../../../hooks/store";
import type { UseAIStreamReturn } from "../../../../../ai-stream/hooks/use-ai-stream";
import { createCreditUpdateCallback } from "../../../../credit-updater";

/**
 * Message operations interface
 */
export interface MessageOperations {
  sendMessage: (
    content: string,
    onThreadCreated?: (
      threadId: string,
      rootFolderId: DefaultFolderId,
      subFolderId: string | null,
    ) => void,
  ) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  branchMessage: (messageId: string, newContent: string) => Promise<void>;
  answerAsAI: (messageId: string, content: string) => Promise<void>;
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
    deleteMessage: (messageId: string) => void;
    updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  };
  streamStore: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    streamingMessages: Record<string, any>;
    reset: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addMessage: (message: any) => void;
  };
  settings: {
    selectedModel: ModelId;
    selectedPersona: string;
    temperature: number;
    maxTokens: number;
    enabledToolIds: string[];
  };
  setInput: (input: string) => void;
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
    deductCredits,
  } = deps;

  const sendMessage = useCallback(
    async (
      content: string,
      onThreadCreated?: (
        threadId: string,
        rootFolderId: DefaultFolderId,
        subFolderId: string | null,
      ) => void,
    ): Promise<void> => {
      logger.debug("Message operations: Sending message", {
        content: content.substring(0, 50),
        activeThreadId,
        currentRootFolderId,
      });

      chatStore.setLoading(true);

      try {
        // CRITICAL FIX: Check if activeThreadId is actually a valid thread
        // The URL parser can't distinguish between folder UUIDs and thread UUIDs
        // If activeThreadId is set but doesn't exist in threads store, it's likely a folder ID
        // In that case, treat it as null to create a new thread
        // Also handle "new" from URL parser - convert to null for API
        let threadIdToUse =
          activeThreadId === NEW_MESSAGE_ID ? null : activeThreadId;

        logger.debug("Message operations: Checking activeThreadId", {
          activeThreadId: threadIdToUse,
          currentRootFolderId,
          threadsCount: Object.keys(chatStore.threads).length,
          threadIds: Object.keys(chatStore.threads),
        });

        if (threadIdToUse && currentRootFolderId !== "incognito") {
          // Check if this ID exists in the threads store
          const threadExists = chatStore.threads[threadIdToUse];
          logger.debug("Message operations: Thread existence check", {
            threadIdToUse,
            threadExists: !!threadExists,
            threadData: threadExists,
          });
          if (!threadExists) {
            logger.debug(
              "Message operations: activeThreadId not found in threads store, treating as folder ID",
              {
                activeThreadId: threadIdToUse,
                threadsCount: Object.keys(chatStore.threads).length,
              },
            );
            threadIdToUse = null;
          }
        }

        let parentMessageId: string | null = null;
        let messageHistory:
          | Array<{ role: ChatMessageRole; content: string }>
          | null
          | undefined;

        if (threadIdToUse) {
          let threadMessages: ChatMessage[] = [];
          if (currentRootFolderId === "incognito") {
            const { getMessagesForThread } =
              await import("../../../../incognito/storage");
            threadMessages = await getMessagesForThread(threadIdToUse);
          } else {
            threadMessages = chatStore.getThreadMessages(threadIdToUse);
          }

          if (threadMessages.length > 0) {
            const lastMessage = threadMessages[threadMessages.length - 1];
            parentMessageId = lastMessage.id;
            logger.debug("Message operations: Using last message as parent", {
              parentMessageId,
              lastMessageContent: lastMessage.content.substring(0, 50),
              isIncognito: currentRootFolderId === "incognito",
            });

            if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
              messageHistory = threadMessages;
              logger.debug(
                "Message operations: Built message history for incognito mode",
                {
                  messageCount: messageHistory.length,
                  threadId: threadIdToUse,
                },
              );
            }
          }
        } else {
          logger.debug(
            "Message operations: No active thread, creating new thread",
            {
              rootFolderId: currentRootFolderId,
              subFolderId: currentSubFolderId,
            },
          );
        }

        await aiStream.startStream(
          {
            operation: "send" as const,
            rootFolderId: currentRootFolderId,
            subFolderId: currentSubFolderId,
            threadId: threadIdToUse,
            parentMessageId,
            content,
            role: ChatMessageRole.USER,
            model: settings.selectedModel,
            persona: settings.selectedPersona,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
            tools: settings.enabledToolIds,
            messageHistory: messageHistory ?? null,
          },
          {
            onThreadCreated: (data) => {
              logger.debug("Message operations: Thread created during send", {
                threadId: data.threadId,
                rootFolderId: data.rootFolderId,
                subFolderId: data.subFolderId,
              });

              if (onThreadCreated) {
                onThreadCreated(
                  data.threadId,
                  data.rootFolderId,
                  data.subFolderId,
                );
              }
            },
            onContentDone: createCreditUpdateCallback(
              settings.selectedModel,
              deductCredits,
            ),
          },
        );

        setInput("");
      } catch (error) {
        const errorMessage = parseError(error);
        logger.error("Message operations: Failed to send message", {
          error: errorMessage.message,
          stack: errorMessage.stack,
        });
      } finally {
        chatStore.setLoading(false);
      }
    },
    [
      logger,
      chatStore,
      aiStream,
      settings,
      setInput,
      activeThreadId,
      currentRootFolderId,
      currentSubFolderId,
      deductCredits,
    ],
  );

  const retryMessage = useCallback(
    async (messageId: string): Promise<void> => {
      logger.debug("Message operations: Retrying message", { messageId });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("Message operations: Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        let messageHistory:
          | Array<{ role: ChatMessageRole; content: string }>
          | null
          | undefined;

        if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
          const threadMessages = Object.values(chatStore.messages)
            .filter((msg) => msg.threadId === message.threadId)
            .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

          const messageIndex = threadMessages.findIndex(
            (msg) => msg.id === messageId,
          );

          if (messageIndex !== -1 && messageIndex > 0) {
            messageHistory = threadMessages.slice(0, messageIndex);
            logger.debug(
              "Message operations: Built message history for incognito retry",
              {
                messageCount: messageHistory.length,
                threadId: message.threadId,
              },
            );
          }
        }

        await aiStream.startStream(
          {
            operation: "retry" as const,
            rootFolderId: currentRootFolderId,
            subFolderId: currentSubFolderId,
            threadId: message.threadId,
            parentMessageId: messageId,
            content: message.content,
            role: message.role,
            model: settings.selectedModel,
            persona: settings.selectedPersona,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
            tools: settings.enabledToolIds,
            messageHistory: messageHistory ?? null,
          },
          {
            onContentDone: createCreditUpdateCallback(
              settings.selectedModel,
              deductCredits,
            ),
          },
        );
      } catch (error) {
        logger.error(
          "Message operations: Failed to retry message",
          parseError(error),
        );
      } finally {
        chatStore.setLoading(false);
      }
    },
    [
      logger,
      chatStore,
      aiStream,
      settings,
      currentRootFolderId,
      currentSubFolderId,
      deductCredits,
    ],
  );

  const branchMessage = useCallback(
    async (messageId: string, newContent: string): Promise<void> => {
      logger.debug("Message operations: Branching message", {
        messageId,
        newContent,
      });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("Message operations: Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        let messageHistory:
          | Array<{ role: ChatMessageRole; content: string }>
          | null
          | undefined;

        const branchParentId = message.parentId;

        if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
          const threadMessages = Object.values(chatStore.messages)
            .filter((msg) => msg.threadId === message.threadId)
            .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

          if (branchParentId) {
            const parentIndex = threadMessages.findIndex(
              (msg) => msg.id === branchParentId,
            );

            if (parentIndex !== -1) {
              messageHistory = threadMessages.slice(0, parentIndex + 1);
            }
          }
        }

        await aiStream.startStream(
          {
            operation: "edit" as const,
            rootFolderId: currentRootFolderId,
            subFolderId: currentSubFolderId,
            threadId: message.threadId,
            parentMessageId: branchParentId,
            content: newContent,
            role: ChatMessageRole.USER,
            model: settings.selectedModel,
            persona: settings.selectedPersona,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
            tools: settings.enabledToolIds,
            messageHistory: messageHistory ?? null,
          },
          {
            onContentDone: createCreditUpdateCallback(
              settings.selectedModel,
              deductCredits,
            ),
          },
        );
      } catch (error) {
        logger.error(
          "Message operations: Failed to branch message",
          parseError(error),
        );
      } finally {
        chatStore.setLoading(false);
      }
    },
    [
      logger,
      chatStore,
      aiStream,
      settings,
      currentRootFolderId,
      currentSubFolderId,
      deductCredits,
    ],
  );

  const answerAsAI = useCallback(
    async (messageId: string, content: string): Promise<void> => {
      logger.debug("Message operations: Answering as AI", {
        messageId,
        content,
      });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("Message operations: Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        let messageHistory:
          | Array<{ role: ChatMessageRole; content: string }>
          | null
          | undefined;

        if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
          const threadMessages = Object.values(chatStore.messages)
            .filter((msg) => msg.threadId === message.threadId)
            .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

          const parentIndex = threadMessages.findIndex(
            (msg) => msg.id === messageId,
          );

          if (parentIndex !== -1) {
            messageHistory = threadMessages.slice(0, parentIndex + 1);
          }
        }

        await aiStream.startStream(
          {
            operation: "answer-as-ai" as const,
            rootFolderId: currentRootFolderId,
            subFolderId: currentSubFolderId,
            threadId: message.threadId,
            parentMessageId: messageId,
            content,
            role: ChatMessageRole.ASSISTANT,
            model: settings.selectedModel,
            persona: settings.selectedPersona,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
            tools: settings.enabledToolIds,
            messageHistory: messageHistory ?? null,
          },
          {
            onContentDone: createCreditUpdateCallback(
              settings.selectedModel,
              deductCredits,
            ),
          },
        );
      } catch (error) {
        logger.error(
          "Message operations: Failed to answer as AI",
          parseError(error),
        );
      } finally {
        chatStore.setLoading(false);
      }
    },
    [
      logger,
      chatStore,
      aiStream,
      settings,
      currentRootFolderId,
      currentSubFolderId,
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

      const authStatusCookie = await getCookie(AUTH_STATUS_COOKIE_PREFIX);
      const isAuthenticated = authStatusCookie !== null;

      // Handle incognito message deletion
      if (!isAuthenticated || thread.rootFolderId === "incognito") {
        logger.debug(
          "Message operations: Deleting incognito message (client-side only)",
          {
            messageId,
            isAuthenticated,
            rootFolderId: thread.rootFolderId,
          },
        );

        chatStore.deleteMessage(messageId);

        if (streamStore.streamingMessages[messageId]) {
          const { [messageId]: _deleted, ...remainingMessages } =
            streamStore.streamingMessages;
          streamStore.reset();
          Object.values(remainingMessages).forEach((msg) => {
            streamStore.addMessage(msg);
          });
        }

        try {
          const { deleteMessage: deleteIncognitoMessage } =
            await import("../../../../incognito/storage");
          deleteIncognitoMessage(messageId);
          logger.debug(
            "Message operations: Deleted incognito message from localStorage",
            { messageId },
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
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/threads/${message.threadId}/messages/${messageId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          logger.error("Message operations: Failed to delete message", {
            status: response.status,
          });
          return;
        }

        chatStore.deleteMessage(messageId);

        if (streamStore.streamingMessages[messageId]) {
          const { [messageId]: _deleted, ...remainingMessages } =
            streamStore.streamingMessages;
          streamStore.reset();
          Object.values(remainingMessages).forEach((msg) => {
            streamStore.addMessage(msg);
          });
        }
      } catch (error) {
        logger.error(
          "Message operations: Failed to delete message",
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

      const authStatusCookie = await getCookie(AUTH_STATUS_COOKIE_PREFIX);
      const isAuthenticated = authStatusCookie !== null;

      if (!isAuthenticated || thread.rootFolderId === "incognito") {
        logger.debug(
          "Message operations: Voting not supported in incognito mode",
          {
            messageId,
            isAuthenticated,
            rootFolderId: thread.rootFolderId,
          },
        );
        return;
      }

      const voteString = vote === 1 ? "up" : vote === -1 ? "down" : "remove";

      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/threads/${message.threadId}/messages/${messageId}/vote`,
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
