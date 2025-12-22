/**
 * Message Operations Hook
 * Handles all message-related CRUD operations (send, retry, branch, delete, vote)
 * Located in threads/[threadId]/messages/ folder as per architectural standards
 */

import { parseError } from "next-vibe/shared/utils";
import { useCallback } from "react";

import { getLastMessageInBranch } from "@/app/[locale]/chat/lib/utils/thread-builder";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { UseAIStreamReturn } from "../../../../../ai-stream/hooks/use-ai-stream";
import { DefaultFolderId } from "../../../../config";
import { createCreditUpdateCallback } from "../../../../credit-updater";
import type { ChatMessage } from "../../../../db";
import { ChatMessageRole, NEW_MESSAGE_ID } from "../../../../enum";
import type { ModelId } from "../../../../model-access/models";
import { useVoiceModeStore } from "../../../../voice-mode/store";
import { getCallModeKey } from "../../../../voice-mode/types";

// TODO: Get from tool config
const REQUIRE_TOOL_CONFIRMATION = false;

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
    },
    onThreadCreated?: (
      threadId: string,
      rootFolderId: DefaultFolderId,
      subFolderId: string | null,
    ) => void,
  ) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  branchMessage: (
    messageId: string,
    newContent: string,
    /** Optional audio input for voice-to-voice mode */
    audioInput?: { file: File },
  ) => Promise<void>;
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
      },
      onThreadCreated?: (
        threadId: string,
        rootFolderId: DefaultFolderId,
        subFolderId: string | null,
      ) => void,
    ): Promise<void> => {
      const content = params.content;
      logger.debug("Message operations: Sending message", {
        content: content.slice(0, 50),
        activeThreadId,
        currentRootFolderId,
        hasToolConfirmation: !!params.toolConfirmation,
      });

      chatStore.setLoading(true);

      try {
        // If toolConfirmation is provided, use its threadId and parentId
        // Otherwise use the normal flow with activeThreadId
        let threadIdToUse: string | null;
        if (params.toolConfirmation) {
          threadIdToUse = params.threadId ?? null;
        } else {
          // Check if activeThreadId is actually a valid thread
          // The URL parser can't distinguish between folder UUIDs and thread UUIDs
          // If activeThreadId is set but doesn't exist in threads store, it's likely a folder ID
          // In that case, treat it as null to create a new thread
          // Also handle "new" from URL parser - convert to null for API
          threadIdToUse =
            activeThreadId === NEW_MESSAGE_ID ? null : activeThreadId;
        }

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
        let messageHistory: ChatMessage[] | null | undefined;

        // Load thread messages for incognito mode and for setting parentId
        if (threadIdToUse) {
          let threadMessages: ChatMessage[] = [];
          if (currentRootFolderId === "incognito") {
            const { getMessagesForThread } = await import(
              "../../../../incognito/storage"
            );
            threadMessages = await getMessagesForThread(threadIdToUse);
          } else {
            threadMessages = chatStore.getThreadMessages(threadIdToUse);
          }

          // If toolConfirmation is provided, use its parentId directly
          if (params.toolConfirmation && params.parentId) {
            parentMessageId = params.parentId;
          } else if (threadMessages.length > 0) {
            // Get branch indices for this thread to find the correct parent
            const branchIndices = chatStore.getBranchIndices(threadIdToUse);

            // Use branch-aware function to get the last message in the selected branch
            const lastMessage = getLastMessageInBranch(
              threadMessages,
              branchIndices,
            );

            if (lastMessage) {
              parentMessageId = lastMessage.id;
              logger.debug(
                "Message operations: Using last message in branch as parent",
                {
                  parentMessageId,
                  lastMessageContent: lastMessage.content.slice(0, 50),
                  isIncognito: currentRootFolderId === "incognito",
                  branchIndices,
                },
              );
            } else {
              // Fallback to last message by creation time if branch path is empty
              const fallbackMessage = threadMessages[threadMessages.length - 1];
              parentMessageId = fallbackMessage.id;
              logger.debug(
                "Message operations: Using fallback last message as parent",
                {
                  parentMessageId,
                  lastMessageContent: fallbackMessage.content.substring(0, 50),
                },
              );
            }
          }

          // ALWAYS build messageHistory for incognito mode (needed for tool confirmations)
          if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
            messageHistory = threadMessages;
            logger.debug(
              "Message operations: Built message history for incognito mode",
              {
                messageCount: messageHistory.length,
                threadId: threadIdToUse,
                hasToolConfirmation: !!params.toolConfirmation,
              },
            );
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

        // Get voice mode settings for streaming TTS
        // Call mode is stored per model+persona combination
        const voiceModeSettings = useVoiceModeStore.getState().settings;
        const callModeKey = getCallModeKey(
          settings.selectedModel,
          settings.selectedCharacter ?? "default",
        );
        const isCallModeEnabled =
          voiceModeSettings.callModeByConfig?.[callModeKey] ?? false;

        // Voice mode for TTS: always stream TTS for voice input, but only auto-play if call mode is enabled
        // For text input, only enable TTS if call mode is enabled
        const effectiveVoiceMode = params.audioInput
          ? {
              // Voice input: always generate TTS, but respect callMode for auto-play
              streamTTS: true,
              callMode: isCallModeEnabled, // Respect the actual toggle state
              voice: "MALE" as const,
            }
          : isCallModeEnabled
            ? {
                // Text input with call mode: generate and auto-play TTS
                streamTTS: true,
                callMode: true,
                voice: "MALE" as const,
              }
            : null;

        await aiStream.startStream(
          {
            operation: "send" as const,
            rootFolderId: currentRootFolderId,
            subFolderId: currentSubFolderId ?? null,
            threadId: threadIdToUse ?? null,
            parentMessageId: parentMessageId ?? null,
            content,
            role: ChatMessageRole.USER,
            model: settings.selectedModel,
            character: settings.selectedCharacter ?? null,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
            tools:
              settings.enabledToolIds?.map((toolId) => ({
                toolId,
                requiresConfirmation: REQUIRE_TOOL_CONFIRMATION,
              })) ?? null,
            toolConfirmation: params.toolConfirmation ?? null,
            messageHistory: messageHistory ?? null,
            voiceMode: effectiveVoiceMode,
            audioInput: params.audioInput ?? { file: null },
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

        // Only clear input if stream was successful (no error in stream store)
        // If stream failed with SSE error during streaming, the error is set in stream store
        // and we should NOT clear the input so user can try again
        // IMPORTANT: Use getState() to get current value from Zustand store
        const { useAIStreamStore } = await import(
          "../../../../../ai-stream/hooks/store"
        );
        const streamError = useAIStreamStore.getState().error;
        if (streamError) {
          logger.warn("Message operations: Stream failed, preserving input", {
            error: streamError,
          });
        } else {
          setInput("");
          logger.debug(
            "Message operations: Input cleared after successful stream",
          );
        }
      } catch (error) {
        const errorMessage = parseError(error);
        logger.error(
          "❌ CATCH BLOCK: Failed to send message - preserving input",
          {
            error: errorMessage.message,
            stack: errorMessage.stack,
            inputLength: content.length,
          },
        );
        // DO NOT clear input on HTTP errors (403, 500, network errors, etc)
        // User should be able to retry without re-typing their message
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
        let messageHistory: ChatMessage[] | null | undefined;

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
            subFolderId: currentSubFolderId ?? null,
            threadId: message.threadId ?? null,
            parentMessageId: messageId ?? null,
            content: message.content,
            role: message.role,
            model: settings.selectedModel,
            character: settings.selectedCharacter ?? null,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
            tools:
              settings.enabledToolIds?.map((toolId) => ({
                toolId,
                requiresConfirmation: REQUIRE_TOOL_CONFIRMATION,
              })) ?? null,
            messageHistory: messageHistory ?? null,
            voiceMode: null,
            audioInput: { file: null },
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
    async (
      messageId: string,
      newContent: string,
      audioInput?: { file: File },
    ): Promise<void> => {
      logger.debug("Message operations: Branching message", {
        messageId,
        newContent,
        hasAudioInput: !!audioInput,
      });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("Message operations: Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        let messageHistory: ChatMessage[] | null | undefined;

        // Branch should be a sibling to the source message
        // So the parent is the source message's parent (the AI response before it)
        const branchParentId = message.parentId;

        logger.info("Branch operation details", {
          sourceMessageId: messageId,
          sourceMessageContent: message.content.slice(0, 50),
          sourceMessageParentId: message.parentId,
          sourceMessageDepth: message.depth,
          branchParentId,
        });

        if (currentRootFolderId === DefaultFolderId.INCOGNITO) {
          const threadMessages = Object.values(chatStore.messages)
            .filter((msg) => msg.threadId === message.threadId)
            .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

          // For incognito, we need to include up to the parent message in history
          if (branchParentId) {
            const parentIndex = threadMessages.findIndex(
              (msg) => msg.id === branchParentId,
            );

            if (parentIndex !== -1) {
              messageHistory = threadMessages.slice(0, parentIndex + 1);
            }
          }
        }

        // Get voice mode settings for streaming TTS (same logic as sendMessage)
        const voiceModeSettings = useVoiceModeStore.getState().settings;
        const callModeKey = getCallModeKey(
          settings.selectedModel,
          settings.selectedCharacter ?? "default",
        );
        const isCallModeEnabled =
          voiceModeSettings.callModeByConfig?.[callModeKey] ?? false;

        // Voice mode for TTS: always stream TTS for voice input, but only auto-play if call mode is enabled
        const effectiveVoiceMode = audioInput
          ? {
              streamTTS: true,
              callMode: isCallModeEnabled,
              voice: "MALE" as const,
            }
          : isCallModeEnabled
            ? {
                streamTTS: true,
                callMode: true,
                voice: "MALE" as const,
              }
            : null;

        await aiStream.startStream(
          {
            operation: "edit" as const,
            rootFolderId: currentRootFolderId,
            subFolderId: currentSubFolderId ?? null,
            threadId: message.threadId ?? null,
            parentMessageId: branchParentId ?? null,
            content: newContent,
            role: ChatMessageRole.USER,
            model: settings.selectedModel,
            character: settings.selectedCharacter ?? null,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
            tools:
              settings.enabledToolIds?.map((toolId) => ({
                toolId,
                requiresConfirmation: REQUIRE_TOOL_CONFIRMATION,
              })) ?? null,
            messageHistory: messageHistory ?? null,
            voiceMode: effectiveVoiceMode,
            audioInput: audioInput ?? { file: null },
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
        let messageHistory: ChatMessage[] | null | undefined;

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
            subFolderId: currentSubFolderId ?? null,
            threadId: message.threadId ?? null,
            parentMessageId: messageId ?? null,
            content,
            role: ChatMessageRole.ASSISTANT,
            model: settings.selectedModel,
            character: settings.selectedCharacter ?? null,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
            tools:
              settings.enabledToolIds?.map((toolId) => ({
                toolId,
                requiresConfirmation: REQUIRE_TOOL_CONFIRMATION,
              })) ?? null,
            messageHistory: messageHistory ?? null,
            voiceMode: null,
            audioInput: { file: null },
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
