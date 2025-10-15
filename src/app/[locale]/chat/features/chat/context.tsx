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

import { useTranslation } from "@/i18n/core/client";

import { API_CONFIG, TIMING } from "../../lib/config/constants";
import type { ModelId } from "../../lib/config/models";
import { defaultModel } from "../../lib/config/models";
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
import { getUserErrorMessage, logError } from "../../lib/utils/error-handling";
import { ValidationError } from "../../lib/utils/errors";
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
  sendMessage: (content: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => void;
  switchMessageBranch: (messageId: string, branchIndex: number) => void;
  branchMessage: (messageId: string, newContent: string) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  answerAsModel: (messageId: string) => Promise<void>;
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
  createNewFolder: (name: string, parentId?: string | null) => string;
  updateFolder: (folderId: string, updates: Partial<ChatFolder>) => void;
  deleteFolder: (folderId: string, deleteThreads: boolean) => void;
  toggleFolderExpanded: (folderId: string) => void;

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
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
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

export function ChatProvider({ children }: ChatProviderProps): JSX.Element {
  const { locale, t } = useTranslation("chat");
  const chatState = useChatState();

  // Initialize from localStorage
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string>(() => {
    return getGlobalTone() || "professional";
  });
  const [selectedModel, setSelectedModel] = useState<ModelId>(() => {
    return getGlobalModel() || defaultModel;
  });
  const [enableSearch, setEnableSearch] = useState<boolean>(() => {
    return getGlobalEnableSearch(); // defaults to false
  });
  const [ttsAutoplay, setTTSAutoplay] = useState<boolean>(() => {
    return getGlobalTTSAutoplay(); // defaults to false
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mountedRef = useRef(true);
  const activeStreamsRef = useRef<Map<string, AbortController>>(new Map());

  const activeThread = chatState.getActiveThread();
  const messages = activeThread ? getMessagesInPath(activeThread) : [];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      // Abort all active streams
      activeStreamsRef.current.forEach((controller) => controller.abort());
      activeStreamsRef.current.clear();
    };
  }, []);

  // Sync model selection to localStorage
  useEffect(() => {
    saveGlobalModel(selectedModel);
  }, [selectedModel]);

  // Sync tone selection to localStorage
  useEffect(() => {
    saveGlobalTone(selectedTone);
  }, [selectedTone]);

  // Sync enable search to localStorage
  useEffect(() => {
    saveGlobalEnableSearch(enableSearch);
  }, [enableSearch]);

  // Sync TTS autoplay to localStorage
  useEffect(() => {
    saveGlobalTTSAutoplay(ttsAutoplay);
  }, [ttsAutoplay]);

  // Restore draft when active thread changes
  useEffect(() => {
    if (activeThread) {
      const draft = getDraft(activeThread.id);
      setInput(draft);
    } else {
      setInput("");
    }
  }, [activeThread?.id]);

  // Save draft when input changes (debounced via effect)
  useEffect(() => {
    if (activeThread && input !== undefined) {
      const timeoutId = setTimeout(() => {
        saveDraft(activeThread.id, input);
      }, TIMING.DRAFT_SAVE_DEBOUNCE);

      return () => clearTimeout(timeoutId);
    }
  }, [activeThread?.id, input]);

  // Get AI response for a given parent message (internal helper)
  const getAIResponse = useCallback(
    async (
      threadId: string,
      parentMessageId: string,
      threadOverride?: ChatThread,
    ) => {
      // Check if component is still mounted
      if (!mountedRef.current) {
        return;
      }

      // Use provided thread or get from state
      const thread = threadOverride || chatState.state.threads[threadId];
      if (!thread) {
        return;
      }

      // Generate unique stream ID for tracking
      const streamId = `stream-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const controller = new AbortController();
      abortControllerRef.current = controller;
      activeStreamsRef.current.set(streamId, controller);

      try {
        // Build the correct API path with locale
        const apiPath = `/api/${locale}/v1/core/agent/chat/ai-stream`;

        // Build request with enhanced context using utility function
        const requestBody = buildChatCompletionRequest(
          thread,
          selectedModel,
          selectedTone,
          parentMessageId,
          API_CONFIG.DEFAULT_TEMPERATURE,
          API_CONFIG.DEFAULT_MAX_TOKENS,
          enableSearch,
        );

        if (requestBody.messages.length === 0) {
          throw new ValidationError("No valid messages to send to API");
        }

        const response = await fetch(apiPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        if (!response.ok) {
          await handleAPIError(response);
        }

        // Stream the response using Vercel AI SDK format
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let assistantContent = "";
          // Create assistant message
          const threadWithAssistant = addMessageToThread(thread, {
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
              // No content received - replace assistant message with error
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

                // Remove the empty assistant message and add error message instead
                const messagesWithoutEmpty = { ...prevThread.messages };
                delete messagesWithoutEmpty[assistantMessageId];

                const currentMessages = getMessagesInPath({
                  ...prevThread,
                  messages: messagesWithoutEmpty,
                });
                const lastMsg = currentMessages[currentMessages.length - 1];

                return addMessageToThread(
                  { ...prevThread, messages: messagesWithoutEmpty },
                  {
                    role: "error",
                    content: t("errors.noResponse"),
                    parentId: lastMsg?.id || null,
                  },
                );
              });
            }
          } finally {
            reader.releaseLock();
          }
        } else {
          // No reader available - add error message
          chatState.updateThread(threadId, (prevThread) => {
            if (!prevThread) {
              return prevThread;
            }

            const currentMessages = getMessagesInPath(prevThread);
            const lastMsg = currentMessages[currentMessages.length - 1];

            return addMessageToThread(prevThread, {
              role: "error",
              content: t("errors.noStream"),
              parentId: lastMsg?.id || null,
            });
          });
        }
      } catch (error: unknown) {
        // Log error for debugging
        logError(error, "streamAIResponse");

        // Only show error if not aborted and component is still mounted
        if (
          mountedRef.current &&
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          // Use functional update to safely add error message
          chatState.updateThread(threadId, (prevThread) => {
            if (shouldSkipThreadUpdate(mountedRef, prevThread)) {
              return prevThread;
            }

            const currentMessages = getMessagesInPath(prevThread);
            const lastMsg = currentMessages[currentMessages.length - 1];

            return addMessageToThread(prevThread, {
              role: "error",
              content: getUserErrorMessage(error),
              parentId: lastMsg?.id || null,
            });
          });
        }
      } finally {
        // Cleanup
        activeStreamsRef.current.delete(streamId);
        abortControllerRef.current = null;
      }
    },
    [chatState, selectedModel, enableSearch, locale, t],
  );

  // Send a new message
  const sendMessage = useCallback(
    async (content: string) => {
      // Capture thread ID early - this is our stable reference
      const threadId = chatState.state.activeThreadId;
      if (!threadId || !content.trim() || isLoading) {
        return;
      }

      // Get initial thread state - only used for local operations
      const initialThread = chatState.state.threads[threadId];
      if (!initialThread) {
        return;
      }

      const trimmedContent = content.trim();
      setInput("");
      clearDraft(threadId); // Clear draft from localStorage
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
        await getAIResponse(threadId, userMessageId, threadWithUserMessage);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [isLoading, selectedTone, chatState, getAIResponse, t],
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

          // Can't branch from first message (no parent to branch from)
          if (!message.parentId) {
            console.warn("Cannot branch from first message - no parent");
            return currentThread;
          }

          // Create a branch with the new message
          const threadWithBranch = createBranchFromMessage(
            currentThread,
            message.parentId,
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
        }
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTone, chatState, getAIResponse, isLoading],
  );

  // Edit a message - same as branching (creates a new branch from the parent)
  const editMessage = branchMessage;

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
      } finally {
        setIsLoading(false);
      }
    },
    [chatState, getAIResponse, isLoading],
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
      } finally {
        setIsLoading(false);
      }
    },
    [chatState, getAIResponse, isLoading],
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
      retryMessage,
      answerAsModel,
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
    }),
    [
      activeThread,
      messages,
      isLoading,
      input,
      setInput,
      selectedTone,
      selectedModel,
      enableSearch,
      ttsAutoplay,
      setSelectedTone,
      setSelectedModel,
      setEnableSearch,
      setTTSAutoplay,
      sendMessage,
      editMessage,
      deleteMessage,
      switchMessageBranch,
      branchMessage,
      retryMessage,
      answerAsModel,
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
      chatState.uiPreferences,
      chatState.toggleSidebar,
      chatState.setViewMode,
      chatState.searchThreads,
      inputRef,
      chatState.state,
    ],
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}
