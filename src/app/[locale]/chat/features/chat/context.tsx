"use client";

import type { JSX, ReactNode } from "react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { API_CONFIG, TIMING } from "../../lib/config/constants";
import type { ModelId } from "../../lib/config/models";
import { defaultModel } from "../../lib/config/models";
import { getPersonaById } from "../../lib/config/personas";
import {
  clearDraft,
  getDraft,
  getGlobalEnableSearch,
  getGlobalModel,
  getGlobalTone,
  getGlobalTTSAutoplay,
  saveDraft,
  saveGlobalEnableSearch,
  saveGlobalModel,
  saveGlobalTone,
  saveGlobalTTSAutoplay,
} from "../../lib/storage/draft-storage";
import {
  addMessageToThread,
  createBranchFromMessage,
  deleteMessageBranch,
  getMessagesInPath,
  switchBranch,
} from "../../lib/storage/message-tree";
import { createThread } from "../../lib/storage/thread-manager";
import type {
  ChatFolder,
  ChatMessage,
  ChatThread,
  ViewMode,
} from "../../lib/storage/types";
import {
  buildChatCompletionRequest,
  handleAPIError,
  stripContextTags,
} from "../../lib/utils/api";
import { getUserErrorMessage } from "../../lib/utils/error-handling";
import { ValidationError } from "../../lib/utils/errors";
import { voteMessage as voteMessageUtil } from "../../lib/utils/message-votes";
import { processStreamReader } from "../../lib/utils/streaming";
import { useChatState } from "./hooks/use-chat-state";

interface ChatContextValue {
  // State
  activeThread: ChatThread | null;
  messages: ChatMessage[];
  isLoading: boolean;

  // Input
  input: string;
  setInput: (input: string) => void;
  currentFolderId: string | null;
  setCurrentFolderId: (folderId: string | null) => void;

  // Settings
  selectedTone: string;
  selectedModel: ModelId;
  enableSearch: boolean;
  ttsAutoplay: boolean;
  setSelectedTone: (tone: string) => void;
  setSelectedModel: (model: ModelId) => void;
  setEnableSearch: (enabled: boolean) => void;
  setTTSAutoplay: (enabled: boolean) => void;

  // Actions
  sendMessage: (
    content: string,
    explicitFolderId?: string | null,
  ) => Promise<string | null>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => void;
  switchMessageBranch: (messageId: string, branchIndex: number) => void;
  branchMessage: (messageId: string, newContent: string) => Promise<void>;
  replyToMessage: (messageId: string, newContent: string) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  answerAsModel: (messageId: string) => Promise<void>;
  voteMessage: (messageId: string, vote: 1 | -1 | 0) => void;
  stopGeneration: () => void;

  // Thread management (from useChatState)
  createNewThread: (folderId?: string | null) => string;
  deleteThread: (threadId: string) => void;
  setActiveThread: (threadId: string | null) => void;
  moveThread: (threadId: string, folderId: string | null) => void;
  updateThread: (
    threadId: string,
    updates: Partial<ChatThread> | ((prev: ChatThread) => ChatThread),
  ) => void;
  updateThreadTitle: (threadId: string) => void;

  // Folder management
  createNewFolder: (name: string, parentId: string, icon?: string) => string;
  updateFolder: (folderId: string, updates: Partial<ChatFolder>) => void;
  deleteFolder: (folderId: string, deleteThreads: boolean) => void;
  toggleFolderExpanded: (folderId: string) => void;
  reorderFolder: (folderId: string, direction: "up" | "down") => void;
  moveFolderToParent: (folderId: string, newParentId: string | null) => void;

  // UI
  uiPreferences: ReturnType<typeof useChatState>["uiPreferences"];
  toggleSidebar: () => void;
  setViewMode: (mode: ViewMode) => void;
  searchThreads: (query: string) => ChatThread[];

  // Refs
  inputRef: React.RefObject<HTMLTextAreaElement | null>;

  // Utility functions
  insertTextAtCursor: (text: string) => void;

  // State from useChatState
  state: ReturnType<typeof useChatState>["state"];

  // Logger
  logger: ReturnType<typeof createEndpointLogger>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string -- React context hook error, programming error not user-facing
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
  locale: CountryLanguage;
}

/**
 * Helper to validate thread update preconditions
 * Reduces code duplication in state updaters
 */
function shouldSkipThreadUpdate(
  mountedRef: React.RefObject<boolean>,
  prevThread: ChatThread | null | undefined,
  messageId?: string,
): boolean {
  if (!mountedRef.current) {
    return true;
  }
  if (!prevThread) {
    return true;
  }
  if (messageId && !prevThread.messages[messageId]) {
    return true;
  }
  return false;
}

export function ChatProvider({
  children,
  locale,
}: ChatProviderProps): JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const chatState = useChatState(locale, logger);

  // Initialize from localStorage
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<string>(() => {
    return getGlobalTone(logger) || getPersonaById("default").id;
  });
  const [selectedModel, setSelectedModel] = useState<ModelId>(() => {
    return getGlobalModel(logger) || defaultModel;
  });
  const [enableSearch, setEnableSearch] = useState<boolean>(() => {
    return getGlobalEnableSearch(logger); // defaults to false
  });
  const [ttsAutoplay, setTTSAutoplay] = useState<boolean>(() => {
    return getGlobalTTSAutoplay(logger); // defaults to false
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mountedRef = useRef(true);
  const activeStreamsRef = useRef<Map<string, AbortController>>(new Map());

  const activeThread = chatState.getActiveThread();
  const messages = useMemo(
    () => (activeThread ? getMessagesInPath(activeThread) : []),
    [activeThread],
  );

  // Cleanup on unmount
  useEffect(() => {
    // Capture ref value at effect creation time
    const activeStreams = activeStreamsRef.current;
    return (): void => {
      mountedRef.current = false;
      // Abort all active streams
      activeStreams.forEach((controller) => controller.abort());
      activeStreams.clear();
    };
  }, []);

  // Sync model selection to localStorage
  useEffect(() => {
    saveGlobalModel(selectedModel, logger);
  }, [selectedModel, logger]);

  // Sync tone selection to localStorage
  useEffect(() => {
    saveGlobalTone(selectedTone, logger);
  }, [selectedTone, logger]);

  // Sync enable search to localStorage
  useEffect(() => {
    saveGlobalEnableSearch(enableSearch, logger);
  }, [enableSearch, logger]);

  // Sync TTS autoplay to localStorage
  useEffect(() => {
    saveGlobalTTSAutoplay(ttsAutoplay, logger);
  }, [ttsAutoplay, logger]);

  // Restore draft when folder changes
  // Store previous folder ID to detect actual changes
  const prevFolderIdRef = useRef<string | null>(null);

  useEffect(() => {
    const folderId = currentFolderId;
    const prevFolderId = prevFolderIdRef.current;

    // Only restore if the folder ID actually changed
    if (folderId !== prevFolderId) {
      if (folderId) {
        const draft = getDraft(folderId, logger);
        setInput(draft);
      } else if (prevFolderId !== null) {
        // Only clear if we're transitioning from a real folder to no folder
        // Don't clear on initial mount (prevFolderId === null)
        setInput("");
      }

      prevFolderIdRef.current = folderId;
    }
  }, [currentFolderId, logger]);

  // Save draft when input changes (debounced via effect)
  useEffect(() => {
    const folderId = currentFolderId;
    if (folderId && input !== undefined) {
      const timeoutId = setTimeout(() => {
        saveDraft(folderId, input, logger);
      }, TIMING.DRAFT_SAVE_DEBOUNCE);

      return (): void => clearTimeout(timeoutId);
    }
  }, [currentFolderId, input, logger]);

  // Get AI response for a given parent message (internal helper)
  const getAIResponse = useCallback(
    async (
      threadId: string,
      parentMessageId: string,
      threadOverride?: ChatThread,
    ) => {
      logger.debug("Chat", "getAIResponse called", {
        threadId,
        parentMessageId,
        hasThreadOverride: Boolean(threadOverride),
      });

      // Check if component is still mounted
      if (!mountedRef.current) {
        logger.debug("Chat", "Component not mounted, aborting");
        setIsLoading(false);
        abortControllerRef.current = null;
        return;
      }

      // Use provided thread or get from state
      const thread = threadOverride || chatState.state.threads[threadId];
      if (!thread) {
        logger.error("Chat", "Thread not found", { threadId });
        setIsLoading(false);
        abortControllerRef.current = null;
        return;
      }

      logger.debug("Chat", "Thread found, initializing stream");

      // Generate unique stream ID for tracking
      // eslint-disable-next-line i18next/no-literal-string -- Technical ID generation, not user-facing
      const streamId = `stream-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const controller = new AbortController();
      abortControllerRef.current = controller;
      activeStreamsRef.current.set(streamId, controller);

      try {
        // Build the correct API path with locale
        const apiPath = `/api/${locale}/v1/core/agent/chat/ai-stream`;

        logger.debug("Chat", "Building request");
        // Build request with enhanced context using utility function
        const requestBody = buildChatCompletionRequest(
          thread,
          selectedModel,
          selectedTone,
          parentMessageId,
          API_CONFIG.DEFAULT_TEMPERATURE,
          API_CONFIG.DEFAULT_MAX_TOKENS,
          enableSearch,
          locale,
        );

        logger.debug("Chat", "Request built", {
          messageCount: requestBody.messages.length,
          model: requestBody.model,
        });

        if (requestBody.messages.length === 0) {
          logger.error("Chat", "No valid messages to send");
          // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string -- Validation error for API, not user-facing
          throw new ValidationError("No valid messages to send to API");
        }

        logger.debug("Chat", "Calling API", { apiPath });
        const response = await fetch(apiPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        logger.debug("Chat", "API response received", {
          ok: response.ok,
          status: response.status,
        });

        if (!response.ok) {
          await handleAPIError(response);
        }

        // Stream the response using Vercel AI SDK format
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let assistantContent = "";

          // Check if parent message already has children (retry/branch case)
          const parentMessage = thread.messages[parentMessageId];
          const hasExistingResponses =
            parentMessage && parentMessage.childrenIds.length > 0;

          // Create assistant message
          // Use createBranchFromMessage if there are already responses (retry/alternative)
          // Use addMessageToThread for first response (normal flow)
          const threadWithAssistant = hasExistingResponses
            ? createBranchFromMessage(thread, parentMessageId, {
                role: "assistant",
                content: "",
                parentId: parentMessageId,
                model: selectedModel,
                tone: selectedTone,
              })
            : addMessageToThread(thread, {
                role: "assistant",
                content: "",
                parentId: parentMessageId,
                model: selectedModel,
                tone: selectedTone,
              });

          // Get the assistant message ID from the path we just created
          const assistantMessageId =
            threadWithAssistant.currentPath.messageIds[
              threadWithAssistant.currentPath.messageIds.length - 1
            ];

          // Update state immediately to show empty assistant message
          chatState.updateThread(threadId, () => threadWithAssistant);

          try {
            // Process stream using utility function
            assistantContent = await processStreamReader(
              reader,
              decoder,
              (content) => {
                // Debounced update callback
                chatState.updateThread(threadId, (prevThread) => {
                  // Validate before updating
                  if (
                    shouldSkipThreadUpdate(
                      mountedRef,
                      prevThread,
                      assistantMessageId,
                    )
                  ) {
                    return prevThread;
                  }
                  if (!activeStreamsRef.current.has(streamId)) {
                    return prevThread;
                  }

                  return {
                    ...prevThread,
                    messages: {
                      ...prevThread.messages,
                      [assistantMessageId]: {
                        ...prevThread.messages[assistantMessageId],
                        content,
                      },
                    },
                    updatedAt: Date.now(),
                  };
                });
              },
              TIMING.STREAM_UPDATE_INTERVAL,
            );

            // Final update with complete content
            if (assistantContent && mountedRef.current) {
              // Strip any <context> tags that the model may have echoed back
              const cleanedContent = stripContextTags(assistantContent);

              chatState.updateThread(threadId, (prevThread) => {
                if (
                  shouldSkipThreadUpdate(
                    mountedRef,
                    prevThread,
                    assistantMessageId,
                  )
                ) {
                  return prevThread;
                }

                return {
                  ...prevThread,
                  messages: {
                    ...prevThread.messages,
                    [assistantMessageId]: {
                      ...prevThread.messages[assistantMessageId],
                      content: cleanedContent,
                    },
                  },
                  updatedAt: Date.now(),
                };
              });
            } else if (!assistantContent && mountedRef.current) {
              // No content received - replace assistant message with error as a branch
              chatState.updateThread(threadId, (prevThread) => {
                if (
                  shouldSkipThreadUpdate(
                    mountedRef,
                    prevThread,
                    assistantMessageId,
                  )
                ) {
                  return prevThread;
                }

                // Remove the empty assistant message properly (cleans up parent's childrenIds)
                const threadWithoutEmpty = deleteMessageBranch(
                  prevThread,
                  assistantMessageId,
                );

                // Create error message as a branch (sibling of the failed assistant message)
                // This allows retrying to create a new branch
                return createBranchFromMessage(
                  threadWithoutEmpty,
                  parentMessageId,
                  {
                    role: "error",
                    content: t("app.chat.errors.noResponse"),
                    parentId: parentMessageId,
                  },
                );
              });
            }
          } finally {
            reader.releaseLock();
          }
        } else {
          // No reader available - add error message as a branch
          chatState.updateThread(threadId, (prevThread) => {
            if (!prevThread) {
              return prevThread;
            }

            // Create error message as a branch (sibling of any existing responses)
            return createBranchFromMessage(prevThread, parentMessageId, {
              role: "error",
              content: t("app.chat.errors.noStream"),
              parentId: parentMessageId,
            });
          });
        }
        // eslint-disable-next-line no-restricted-syntax -- Browser API catch requires unknown type
      } catch (error: unknown) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));

        // Log error for debugging
        logger.error("app.chat.errors.streamAIResponse", errorObj);

        // Only show error if not aborted and component is still mounted
        if (mountedRef.current && errorObj.name !== "AbortError") {
          // Use functional update to safely add error message as a branch
          chatState.updateThread(threadId, (prevThread) => {
            if (shouldSkipThreadUpdate(mountedRef, prevThread)) {
              return prevThread;
            }

            // Create error message as a branch (sibling of any existing responses)
            // This allows retrying to create a new branch
            return createBranchFromMessage(prevThread, parentMessageId, {
              role: "error",
              content: getUserErrorMessage(errorObj, locale),
              parentId: parentMessageId,
            });
          });
        }
      } finally {
        // Cleanup
        activeStreamsRef.current.delete(streamId);
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    },
    [
      chatState,
      locale,
      selectedModel,
      selectedTone,
      enableSearch,
      t,
      logger,
      setIsLoading,
    ],
  );

  // Send a new message
  // Returns the thread ID (useful for navigation after creating a new thread)
  // folderId parameter allows caller to explicitly specify folder (overrides currentFolderId)
  const sendMessage = useCallback(
    async (
      content: string,
      explicitFolderId?: string | null,
    ): Promise<string | null> => {
      logger.debug("Chat", "sendMessage called", {
        contentLength: content.length,
        isLoading,
        explicitFolderId,
        currentFolderId,
      });

      if (!content.trim() || isLoading) {
        logger.debug("Chat", "sendMessage blocked", {
          hasContent: Boolean(content.trim()),
          isLoading,
        });
        return null;
      }

      // Use explicit folder ID if provided, otherwise use current folder ID
      const targetFolderId = explicitFolderId ?? currentFolderId;

      const trimmedContent = content.trim();
      logger.debug("Chat", "sendMessage starting", { targetFolderId });

      // Get or create thread ID
      let threadId = chatState.state.activeThreadId;
      let initialThread: ChatThread | null = threadId
        ? chatState.state.threads[threadId] || null
        : null;

      // If no active thread, create one
      if (!threadId || !initialThread) {
        logger.debug("Chat", "Creating new thread", { targetFolderId });
        threadId = chatState.createNewThread(targetFolderId);
        if (!threadId) {
          logger.error("Chat", "Failed to create thread");
          return null;
        }
        logger.debug("Chat", "Thread created", { threadId });

        // Create the thread object directly since we just created it
        // This avoids race conditions with state updates
        initialThread = createThread(locale, {
          id: threadId,
          folderId: targetFolderId,
        });
      }

      setInput("");
      // Clear draft from localStorage using folder ID
      if (targetFolderId) {
        clearDraft(targetFolderId, logger);
      }
      logger.debug("Chat", "Setting isLoading to true");
      setIsLoading(true);

      try {
        // Get current messages path from local thread reference
        const currentMessages = getMessagesInPath(initialThread);
        const lastMessage =
          currentMessages.length > 0
            ? currentMessages[currentMessages.length - 1]
            : null;

        // If last message is assistant or error, we're adding a new branch
        // Otherwise we're continuing the conversation
        const parentId = lastMessage?.id || null;

        // Add user message to thread (pure function, no state access)
        const threadWithUserMessage = addMessageToThread(initialThread, {
          role: "user",
          content: trimmedContent,
          parentId,
          tone: selectedTone,
        });

        // Capture the user message ID immediately
        const userMessageId =
          threadWithUserMessage.currentPath.messageIds[
            threadWithUserMessage.currentPath.messageIds.length - 1
          ];

        // Update thread in state - this will trigger re-render and show user message
        chatState.updateThread(threadId, () => threadWithUserMessage);

        // Auto-update title if this is the first user message
        const userMessages = Object.values(
          threadWithUserMessage.messages,
        ).filter((m) => m.role === "user");
        if (userMessages.length === 1) {
          chatState.updateThreadTitle(threadId);
        }

        // Get AI response (pass the updated thread to avoid race condition)
        logger.debug("Chat", "Calling getAIResponse", {
          threadId,
          userMessageId,
        });
        await getAIResponse(threadId, userMessageId, threadWithUserMessage);

        logger.debug("Chat", "sendMessage completed successfully");
        // Return thread ID (especially important for newly created threads)
        return threadId;
      } catch (error) {
        // Only set loading to false on error - getAIResponse handles it on success
        setIsLoading(false);
        abortControllerRef.current = null;
        logger.error("Chat", "Failed to send message", error);
        return null;
      }
    },
    [
      chatState,
      isLoading,
      logger,
      selectedTone,
      getAIResponse,
      currentFolderId,
      locale,
    ],
  );

  // Branch from a message (create new conversation path)
  // Used for both editing and branching - they're the same operation
  const branchMessage = useCallback(
    async (messageId: string, newContent: string) => {
      const threadId = chatState.state.activeThreadId;
      if (!threadId || !newContent.trim() || isLoading) {
        return;
      }

      const trimmedContent = newContent.trim();
      setIsLoading(true);

      try {
        let newUserMessageId: string | null = null;
        let updatedThread: ChatThread | null = null;

        // Update thread using functional update to avoid race conditions
        chatState.updateThread(threadId, (currentThread) => {
          if (!currentThread) {
            return currentThread;
          }

          const message = currentThread.messages[messageId];
          if (!message) {
            return currentThread;
          }

          // Create a branch with the new message (sibling of the original)
          // For root messages (no parent), pass null to create a root-level branch
          const threadWithBranch = createBranchFromMessage(
            currentThread,
            message.parentId, // null for root messages, parent ID otherwise
            {
              role: "user",
              content: trimmedContent,
              parentId: message.parentId,
              tone: selectedTone,
            },
          );

          // Capture the new user message ID
          newUserMessageId =
            threadWithBranch.currentPath.messageIds[
              threadWithBranch.currentPath.messageIds.length - 1
            ];

          updatedThread = threadWithBranch;
          return threadWithBranch;
        });

        // Get AI response for the branched message
        if (newUserMessageId && updatedThread) {
          await getAIResponse(threadId, newUserMessageId, updatedThread);
        } else {
          // No AI response needed, stop loading
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        logger.error("Chat", "Failed to branch message", error);
      }
    },
    [chatState, isLoading, selectedTone, logger, getAIResponse],
  );

  // Edit a message - same as branching (creates a new branch from the parent)
  const editMessage = branchMessage;

  // Reply to a message (create a child message)
  // This is different from branching - it creates a new message as a child of the target message
  const replyToMessage = useCallback(
    async (messageId: string, newContent: string) => {
      const threadId = chatState.state.activeThreadId;
      if (!threadId || !newContent.trim() || isLoading) {
        return;
      }

      const trimmedContent = newContent.trim();
      setIsLoading(true);

      try {
        let newUserMessageId: string | null = null;
        let updatedThread: ChatThread | null = null;

        // Update thread using functional update to avoid race conditions
        chatState.updateThread(threadId, (currentThread) => {
          if (!currentThread) {
            return currentThread;
          }

          const message = currentThread.messages[messageId];
          if (!message) {
            return currentThread;
          }

          // Create a reply as a child of this message
          const threadWithReply = addMessageToThread(currentThread, {
            role: "user",
            content: trimmedContent,
            parentId: messageId, // This message is the parent
            tone: selectedTone,
          });

          // Capture the new user message ID
          newUserMessageId =
            threadWithReply.currentPath.messageIds[
              threadWithReply.currentPath.messageIds.length - 1
            ];

          updatedThread = threadWithReply;
          return threadWithReply;
        });

        // Get AI response for the reply
        if (newUserMessageId && updatedThread) {
          await getAIResponse(threadId, newUserMessageId, updatedThread);
        } else {
          // No AI response needed, stop loading
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        logger.error("Chat", "Failed to reply to message", error);
      }
    },
    [chatState, isLoading, selectedTone, logger, getAIResponse],
  );

  // Delete a message and its descendants
  const deleteMessage = useCallback(
    (messageId: string) => {
      const threadId = chatState.state.activeThreadId;
      if (!threadId) {
        return;
      }

      // Use functional update for consistency
      chatState.updateThread(threadId, (prevThread) => {
        if (!prevThread) {
          return prevThread;
        }
        return deleteMessageBranch(prevThread, messageId);
      });
    },
    [chatState],
  );

  // Vote on a message (upvote, downvote, or remove vote)
  const voteMessage = useCallback(
    (messageId: string, vote: 1 | -1 | 0) => {
      const threadId = chatState.state.activeThreadId;
      if (!threadId) {
        return;
      }

      // Use functional update for consistency
      chatState.updateThread(threadId, (prevThread) => {
        if (!prevThread) {
          return prevThread;
        }
        return voteMessageUtil(prevThread, messageId, vote);
      });
    },
    [chatState],
  );

  // Retry a message with different model/tone
  // This creates a NEW AI response as a branch, never deletes existing responses
  const retryMessage = useCallback(
    async (messageId: string) => {
      const threadId = chatState.state.activeThreadId;
      if (!threadId || isLoading) {
        return;
      }

      const thread = chatState.state.threads[threadId];
      if (!thread) {
        return;
      }

      const message = thread.messages[messageId];
      if (!message || message.role !== "user") {
        return;
      }

      setIsLoading(true);

      try {
        // Simply generate a new AI response
        // This will create a new branch if there are already responses
        // The AI response will be added as a child of the user message
        await getAIResponse(threadId, messageId, thread);
      } catch (error) {
        setIsLoading(false);
        logger.error("Chat", "Failed to retry message", error);
      }
    },
    [chatState, getAIResponse, isLoading, logger],
  );

  // Answer as AI model (generate AI response to an AI message)
  const answerAsModel = useCallback(
    async (messageId: string) => {
      const threadId = chatState.state.activeThreadId;
      if (!threadId || isLoading) {
        return;
      }

      // Get current thread state
      const currentThread = chatState.state.threads[threadId];
      if (!currentThread) {
        return;
      }

      const message = currentThread.messages[messageId];
      if (!message) {
        return;
      }

      setIsLoading(true);

      try {
        // Call getAIResponse with the message as the parent
        await getAIResponse(threadId, messageId, currentThread);
      } catch (error) {
        setIsLoading(false);
        logger.error("Chat", "Failed to answer as model", error);
      }
    },
    [chatState, getAIResponse, isLoading, logger],
  );

  // Switch to a different branch
  const switchMessageBranch = useCallback(
    (messageId: string, branchIndex: number) => {
      const threadId = chatState.state.activeThreadId;
      if (!threadId) {
        return;
      }

      // Use functional update for consistency
      chatState.updateThread(threadId, (prevThread) => {
        if (!prevThread) {
          return prevThread;
        }
        return switchBranch(prevThread, messageId, branchIndex);
      });
    },
    [chatState],
  );

  // Stop generation
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // Insert text at cursor position in input
  const insertTextAtCursor = useCallback(
    (text: string) => {
      const textarea = inputRef.current;
      if (!textarea) {
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = input;

      // Insert text at cursor position
      const newValue =
        currentValue.substring(0, start) + text + currentValue.substring(end);
      setInput(newValue);

      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + text.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, TIMING.TEXT_INSERTION_FOCUS_DELAY);
    },
    [input],
  );

  const contextValue: ChatContextValue = useMemo(
    () => ({
      // State
      activeThread,
      messages,
      isLoading,

      // Input
      input,
      setInput,
      currentFolderId,
      setCurrentFolderId,

      // Settings
      selectedTone,
      selectedModel,
      enableSearch,
      ttsAutoplay,
      setSelectedTone,
      setSelectedModel,
      setEnableSearch,
      setTTSAutoplay,

      // Actions
      sendMessage,
      editMessage,
      deleteMessage,
      switchMessageBranch,
      branchMessage,
      replyToMessage,
      retryMessage,
      answerAsModel,
      voteMessage,
      stopGeneration,

      // Thread management
      createNewThread: chatState.createNewThread,
      deleteThread: chatState.deleteThread,
      setActiveThread: chatState.setActiveThread,
      moveThread: chatState.moveThread,
      updateThread: chatState.updateThread,
      updateThreadTitle: chatState.updateThreadTitle,

      // Folder management
      createNewFolder: chatState.createNewFolder,
      updateFolder: chatState.updateFolder,
      deleteFolder: chatState.deleteFolder,
      toggleFolderExpanded: chatState.toggleFolderExpanded,
      reorderFolder: chatState.reorderFolder,
      moveFolderToParent: chatState.moveFolderToParent,

      // UI
      uiPreferences: chatState.uiPreferences,
      toggleSidebar: chatState.toggleSidebar,
      setViewMode: chatState.setViewMode,
      searchThreads: chatState.searchThreads,

      // Refs
      inputRef,

      // Utility functions
      insertTextAtCursor,

      // State
      state: chatState.state,

      // Logger
      logger,
    }),
    [
      activeThread,
      messages,
      isLoading,
      input,
      currentFolderId,
      selectedTone,
      selectedModel,
      enableSearch,
      ttsAutoplay,
      sendMessage,
      editMessage,
      deleteMessage,
      switchMessageBranch,
      branchMessage,
      replyToMessage,
      retryMessage,
      answerAsModel,
      voteMessage,
      stopGeneration,
      chatState.createNewThread,
      chatState.deleteThread,
      chatState.setActiveThread,
      chatState.moveThread,
      chatState.updateThread,
      chatState.updateThreadTitle,
      chatState.createNewFolder,
      chatState.updateFolder,
      chatState.deleteFolder,
      chatState.toggleFolderExpanded,
      chatState.reorderFolder,
      chatState.moveFolderToParent,
      chatState.uiPreferences,
      chatState.toggleSidebar,
      chatState.setViewMode,
      chatState.searchThreads,
      chatState.state,
      insertTextAtCursor,
      logger,
    ],
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}
