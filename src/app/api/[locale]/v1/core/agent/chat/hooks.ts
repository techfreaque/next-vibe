/**
 * Central Chat Hook
 * Combines all chat functionality - production ready, 100% typesafe
 * This is the ONLY hook that should be imported in the chat folder
 */

"use client";

import { AUTH_STATUS_COOKIE_PREFIX } from "next-vibe/shared/constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { apiClient } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/store";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useAIStream } from "./ai-stream/hooks";
import { useAIStreamStore } from "./ai-stream/store";
import type { DefaultFolderId } from "./config";
import { createCreditUpdateCallback } from "./credit-updater";
import creditsDefinition from "./credits/definition";
import type { IconValue } from "./model-access/icons";
import type { ModelId } from "./model-access/models";
import { getModelById } from "./model-access/models";
import type { PersonaListResponseOutput } from "./personas/definition";
import { usePersonasList } from "./personas/hooks";
import {
  type ChatFolder,
  type ChatMessage,
  type ChatThread,
  type ToolCall,
  useChatStore,
} from "./store";
import threadsDefinition from "./threads/definition";

// Re-export types for convenience
export type { ChatFolder, ChatMessage, ChatThread };

/**
 * Thread update type
 */
export interface ThreadUpdate {
  title?: string;
  rootFolderId?: DefaultFolderId;
  folderId?: string | null;
  status?: "active" | "archived" | "deleted";
  defaultModel?: ModelId | null;
  defaultTone?: string | null;
  systemPrompt?: string | null;
  pinned?: boolean;
  archived?: boolean;
  tags?: string[];
}

/**
 * Folder update type
 */
export interface FolderUpdate {
  name?: string;
  icon?: IconValue | null;
  color?: string | null;
  parentId?: string | null;
  expanded?: boolean;
  sortOrder?: number;
}

/**
 * Return type for useChat hook
 */
export interface UseChatReturn {
  // State
  threads: Record<string, ChatThread>;
  messages: Record<string, ChatMessage>;
  folders: Record<string, ChatFolder>;
  personas: Record<string, { id: string; name: string; icon: string }>;
  activeThread: ChatThread | null;
  activeThreadMessages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;

  // Current context
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;

  // Input
  input: string;
  setInput: (input: string) => void;

  // Settings
  selectedPersona: string;
  selectedModel: ModelId;
  temperature: number;
  maxTokens: number;
  ttsAutoplay: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  viewMode: "linear" | "flat" | "threaded";
  enableSearch: boolean;
  enabledToolIds: string[];
  setSelectedPersona: (persona: string) => void;
  setSelectedModel: (model: ModelId) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setTTSAutoplay: (autoplay: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  setViewMode: (mode: "linear" | "flat" | "threaded") => void;
  setEnableSearch: (enabled: boolean) => void;
  setEnabledToolIds: (toolIds: string[]) => void;

  // Message operations
  sendMessage: (
    content: string,
    onThreadCreated?: (threadId: string, rootFolderId: string) => void,
  ) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  branchMessage: (messageId: string, newContent: string) => Promise<void>;
  answerAsAI: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  voteMessage: (messageId: string, vote: 1 | -1 | 0) => Promise<void>;
  stopGeneration: () => void;

  // Thread operations
  createNewThread: () => string;
  setActiveThread: (threadId: string | null) => void;
  deleteThread: (threadId: string) => Promise<void>;
  updateThread: (threadId: string, updates: ThreadUpdate) => Promise<void>;

  // Folder operations
  createFolder: (
    name: string,
    rootFolderId: DefaultFolderId,
    parentId: string | null,
    icon?: string,
  ) => Promise<string>;
  updateFolder: (folderId: string, updates: FolderUpdate) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;

  // Navigation
  setCurrentFolder: (
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void;

  // Refs
  inputRef: React.RefObject<HTMLTextAreaElement | null>;

  // Logger
  logger: EndpointLogger;
}

/**
 * Central hook that provides all chat functionality
 * Uses Zustand stores for state management
 * No prop drilling - all state is managed centrally
 */
export function useChat(
  locale: CountryLanguage,
  logger: EndpointLogger,
): UseChatReturn {
  // Get stores - subscribe to specific properties to ensure re-renders
  const threads = useChatStore((state) => state.threads);
  const messages = useChatStore((state) => state.messages);
  const folders = useChatStore((state) => state.folders);
  const activeThreadId = useChatStore((state) => state.activeThreadId);
  const currentRootFolderId = useChatStore(
    (state) => state.currentRootFolderId,
  );
  const currentSubFolderId = useChatStore((state) => state.currentSubFolderId);
  const isLoading = useChatStore((state) => state.isLoading);
  const settings = useChatStore((state) => state.settings);

  // Get store actions (these don't need selectors as they don't change)
  const chatStore = useChatStore();
  const streamStore = useAIStreamStore();

  // Hydrate settings from localStorage after mount (avoid hydration mismatch)
  useEffect(() => {
    chatStore.hydrateSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Get translations
  const { t } = simpleT(locale);

  // Get AI stream hook with proper translation
  const aiStream = useAIStream(locale, logger, t);

  // Fetch data from server
  const personasEndpoint = usePersonasList(logger);

  // Load all threads and folders on mount - ONLY ONCE
  // Use ref to track if data has been loaded to prevent infinite loops
  const dataLoadedRef = useRef(false);

  // Track which threads have had their messages loaded to prevent duplicate requests
  const loadedThreadsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Skip if already loaded
    if (dataLoadedRef.current) {
      return;
    }

    dataLoadedRef.current = true;

    const loadData = async (): Promise<void> => {
      // Check if user is authenticated by checking auth_status cookie
      const authStatusCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(AUTH_STATUS_COOKIE_PREFIX));
      const isAuthenticated = authStatusCookie !== undefined;

      logger.debug("useChat", "Checking authentication before loading data", {
        isAuthenticated,
      });

      // ALWAYS load incognito data from localStorage (for both authenticated and non-authenticated users)
      try {
        const { loadIncognitoState } = await import("./incognito/storage");
        const incognitoState = loadIncognitoState();

        logger.debug("useChat", "Loading incognito data from localStorage", {
          threadCount: Object.keys(incognitoState.threads).length,
          messageCount: Object.keys(incognitoState.messages).length,
          folderCount: Object.keys(incognitoState.folders).length,
        });

        // Load threads into store (convert date strings back to Date objects)
        Object.values(incognitoState.threads).forEach((thread) => {
          chatStore.addThread({
            ...thread,
            createdAt: new Date(thread.createdAt),
            updatedAt: new Date(thread.updatedAt),
          });
        });

        // Load messages into store (convert date strings back to Date objects)
        Object.values(incognitoState.messages).forEach((message) => {
          chatStore.addMessage({
            ...message,
            createdAt: new Date(message.createdAt),
            updatedAt: new Date(message.updatedAt),
          });
        });

        // Load folders into store (convert date strings back to Date objects)
        Object.values(incognitoState.folders).forEach((folder) => {
          chatStore.addFolder({
            ...folder,
            createdAt: new Date(folder.createdAt),
            updatedAt: new Date(folder.updatedAt),
          });
        });

        logger.info("useChat", "Incognito data loaded successfully", {
          threadCount: Object.keys(incognitoState.threads).length,
          messageCount: Object.keys(incognitoState.messages).length,
          folderCount: Object.keys(incognitoState.folders).length,
        });
      } catch (error) {
        logger.error("useChat", "Failed to load incognito data", { error });
      }

      // Skip loading server data for non-authenticated users
      if (!isAuthenticated) {
        logger.info(
          "useChat",
          "User not authenticated, skipping server data load",
        );
        return;
      }

      // Load ALL threads (no rootFolderId filter)
      try {
        const threadsResponse = await apiClient.fetch(
          threadsDefinition.GET,
          logger,
          {
            pagination: {
              page: 1,
              limit: 100,
            },
            filters: {},
          },
          {},
          t,
          locale,
        );

        logger.debug("useChat", "Loaded threads", { threadsResponse });

        if (threadsResponse.success) {
          const responseData = threadsResponse.data as {
            response: {
              threads: Array<{
                id: string;
                title: string;
                rootFolderId: DefaultFolderId;
                folderId: string | null;
                status: "active" | "archived" | "deleted";
                pinned: boolean;
                preview: string | null;
                createdAt: Date;
                updatedAt: Date;
              }>;
              totalCount: number;
              pageCount: number;
              page: number;
              limit: number;
            };
          };

          if (responseData.response?.threads) {
            responseData.response.threads.forEach((thread) => {
              chatStore.addThread({
                id: thread.id,
                userId: "",
                title: thread.title,
                rootFolderId: thread.rootFolderId,
                folderId: thread.folderId,
                status: thread.status,
                defaultModel: null,
                defaultPersona: null,
                systemPrompt: null,
                pinned: thread.pinned,
                archived: false,
                tags: [],
                preview: thread.preview,
                createdAt: new Date(thread.createdAt),
                updatedAt: new Date(thread.updatedAt),
              });
            });
            logger.debug("useChat", "Threads loaded successfully", {
              count: responseData.response.threads.length,
            });
          }
        }
      } catch (error) {
        logger.error("useChat", "Failed to load threads", { error });
      }

      // Folders are not loaded from server - they are managed client-side only
      // This keeps the architecture simple and avoids unnecessary API calls
    };

    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]); // Only depend on locale - chatStore and logger are stable

  const personas = useMemo(() => {
    const response = personasEndpoint.read?.response as
      | PersonaListResponseOutput
      | undefined;
    const personasList = response?.personas;
    const personasMap: Record<
      string,
      { id: string; name: string; icon: string }
    > = {};

    if (personasList && Array.isArray(personasList)) {
      personasList.forEach((p) => {
        personasMap[p.id] = {
          id: p.id,
          name: p.name,
          icon: p.icon,
        };
      });
    }

    return personasMap;
  }, [personasEndpoint.read?.response]);

  // Local state for input
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get settings from store (persisted to localStorage) - already subscribed above
  const selectedPersona = settings.selectedPersona;
  const selectedModel = settings.selectedModel;
  const temperature = settings.temperature;
  const maxTokens = settings.maxTokens;
  const ttsAutoplay = settings.ttsAutoplay;
  const sidebarCollapsed = settings.sidebarCollapsed;
  const theme = settings.theme;
  const viewMode = settings.viewMode;
  const enableSearch = settings.enableSearch;
  const enabledToolIds = settings.enabledToolIds;

  // Settings setters that update the store
  const setSelectedPersona = useCallback(
    (persona: string) => {
      chatStore.updateSettings({ selectedPersona: persona });
    },
    [chatStore],
  );

  const setSelectedModel = useCallback(
    (model: ModelId) => {
      chatStore.updateSettings({ selectedModel: model });
    },
    [chatStore],
  );

  const setTemperature = useCallback(
    (temp: number) => {
      chatStore.updateSettings({ temperature: temp });
    },
    [chatStore],
  );

  const setMaxTokens = useCallback(
    (tokens: number) => {
      chatStore.updateSettings({ maxTokens: tokens });
    },
    [chatStore],
  );

  const setTTSAutoplay = useCallback(
    (autoplay: boolean) => {
      chatStore.updateSettings({ ttsAutoplay: autoplay });
    },
    [chatStore],
  );

  const setSidebarCollapsed = useCallback(
    (collapsed: boolean) => {
      chatStore.updateSettings({ sidebarCollapsed: collapsed });
    },
    [chatStore],
  );

  const setTheme = useCallback(
    (newTheme: "light" | "dark") => {
      chatStore.updateSettings({ theme: newTheme });
    },
    [chatStore],
  );

  const setViewMode = useCallback(
    (mode: "linear" | "flat" | "threaded") => {
      chatStore.updateSettings({ viewMode: mode });
    },
    [chatStore],
  );

  const setEnableSearch = useCallback(
    (enabled: boolean) => {
      chatStore.updateSettings({ enableSearch: enabled });
    },
    [chatStore],
  );

  const setEnabledToolIds = useCallback(
    (toolIds: string[]) => {
      chatStore.updateSettings({ enabledToolIds: toolIds });
    },
    [chatStore],
  );

  // Get active thread and messages - use subscribed variables
  const activeThread = activeThreadId ? threads[activeThreadId] || null : null;
  const activeThreadMessages = activeThreadId
    ? chatStore.getThreadMessages(activeThreadId)
    : [];

  // Sync streaming messages to chat store
  useEffect(() => {
    Object.values(streamStore.streamingMessages).forEach((streamMsg) => {
      const existingMsg = chatStore.messages[streamMsg.messageId];
      if (!existingMsg) {
        chatStore.addMessage({
          id: streamMsg.messageId,
          threadId: streamMsg.threadId,
          role: streamMsg.role,
          content: streamMsg.content,
          parentId: streamMsg.parentId,
          depth: streamMsg.depth,
          authorId: null,
          authorName: null,
          isAI: streamMsg.role === "assistant",
          model: streamMsg.model || null,
          persona: null,
          errorType: streamMsg.error
            ? t("app.api.v1.core.agent.chat.aiStream.errorTypes.streamError")
            : null,
          errorMessage: streamMsg.error || null,
          edited: false,
          tokens: streamMsg.totalTokens || null,
          upvotes: null,
          downvotes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else if (existingMsg.content !== streamMsg.content) {
        chatStore.updateMessage(streamMsg.messageId, {
          content: streamMsg.content,
          tokens: streamMsg.totalTokens || null,
          errorType: streamMsg.error
            ? t("app.api.v1.core.agent.chat.errorTypes.streamError")
            : null,
          errorMessage: streamMsg.error || null,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamStore.streamingMessages, t]); // chatStore is stable, don't include it

  // Sync streaming threads to chat store
  useEffect(() => {
    Object.values(streamStore.threads).forEach((streamThread) => {
      const existingThread = chatStore.threads[streamThread.threadId];
      if (!existingThread) {
        chatStore.addThread({
          id: streamThread.threadId,
          userId: "",
          title: streamThread.title,
          rootFolderId: streamThread.rootFolderId,
          folderId: streamThread.subFolderId,
          status: "active",
          defaultModel: null,
          defaultPersona: null,
          systemPrompt: null,
          pinned: false,
          archived: false,
          tags: [],
          preview: null,
          createdAt: streamThread.createdAt,
          updatedAt: streamThread.createdAt,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamStore.threads]); // chatStore is stable, don't include it

  // Load messages from server when activeThreadId changes
  useEffect(() => {
    if (!activeThreadId) {
      return;
    }

    // Skip if messages already loaded for this thread
    if (loadedThreadsRef.current.has(activeThreadId)) {
      return;
    }

    // Check if user is authenticated
    const authStatusCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(AUTH_STATUS_COOKIE_PREFIX));
    const isAuthenticated = authStatusCookie !== undefined;

    // Skip loading for incognito mode (messages are in localStorage)
    const thread = threads[activeThreadId];
    if (!thread || thread.rootFolderId === "incognito") {
      return;
    }

    // Skip if not authenticated (shouldn't happen for non-incognito threads)
    if (!isAuthenticated) {
      return;
    }

    // Mark as loaded before starting the request to prevent duplicate requests
    loadedThreadsRef.current.add(activeThreadId);

    // Load messages from server
    const loadMessages = async (): Promise<void> => {
      try {
        logger.debug("useChat", "Loading messages for thread", {
          threadId: activeThreadId,
        });

        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/threads/${activeThreadId}/messages`,
        );

        if (response.ok) {
          const data = await response.json();
          logger.debug("useChat", "Loaded messages", {
            threadId: activeThreadId,
            count: data.data?.messages?.length || 0,
          });

          if (data.success && data.data?.messages) {
            // Add messages to store
            data.data.messages.forEach(
              (message: {
                id: string;
                threadId: string;
                role: "user" | "assistant" | "system";
                content: string;
                model: string | null;
                persona: string | null;
                parentId: string | null;
                depth: number;
                childrenIds: string[];
                toolCalls?: Array<{
                  toolName: string;
                  // eslint-disable-next-line no-restricted-syntax
                  args: Record<string, unknown>;
                }> | null;
                createdAt: string;
                updatedAt: string;
              }) => {
                chatStore.addMessage({
                  id: message.id,
                  threadId: message.threadId,
                  role: message.role,
                  content: message.content,
                  model: message.model as ModelId | null,
                  persona: message.persona,
                  parentId: message.parentId,
                  depth: message.depth,
                  authorId: null,
                  authorName: null,
                  isAI: message.role === "assistant",
                  errorType: null,
                  errorMessage: null,
                  edited: false,
                  tokens: null,
                  toolCalls: message.toolCalls
                    ? (message.toolCalls.map((tc) => ({
                        toolName: tc.toolName,
                        args: tc.args as Record<
                          string,
                          string | number | boolean | null
                        >,
                      })) as ToolCall[])
                    : null,
                  upvotes: null,
                  downvotes: null,
                  createdAt: new Date(message.createdAt),
                  updatedAt: new Date(message.updatedAt),
                });
              },
            );
          }
        } else {
          logger.error("useChat", "Failed to load messages", {
            threadId: activeThreadId,
            status: response.status,
          });
          // Remove from loaded set on error so it can be retried
          loadedThreadsRef.current.delete(activeThreadId);
        }
      } catch (error) {
        logger.error("useChat", "Error loading messages", {
          threadId: activeThreadId,
          error,
        });
        // Remove from loaded set on error so it can be retried
        loadedThreadsRef.current.delete(activeThreadId);
      }
    };

    void loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId, locale, logger, chatStore]); // threads intentionally excluded to prevent infinite loop

  // Message operations
  const sendMessage = useCallback(
    async (
      content: string,
      onThreadCreated?: (threadId: string, rootFolderId: string) => void,
    ): Promise<void> => {
      logger.debug("useChat", "Sending message", { content });

      chatStore.setLoading(true);

      try {
        // Get the last message in the thread to use as parent
        // This ensures new messages continue the conversation instead of creating branches
        let parentMessageId: string | null = null;
        if (chatStore.activeThreadId) {
          // For incognito mode, get messages from localStorage
          // For authenticated mode, get messages from chat store
          let threadMessages: ChatMessage[] = [];
          if (chatStore.currentRootFolderId === "incognito") {
            // Import incognito storage dynamically to avoid circular dependencies
            const { getMessagesForThread } = await import(
              "./incognito/storage"
            );
            threadMessages = getMessagesForThread(chatStore.activeThreadId);
          } else {
            threadMessages = chatStore.getThreadMessages(
              chatStore.activeThreadId,
            );
          }

          if (threadMessages.length > 0) {
            // Get the last message (most recent)
            const lastMessage = threadMessages[threadMessages.length - 1];
            parentMessageId = lastMessage.id;
            logger.debug("useChat", "Using last message as parent", {
              parentMessageId,
              lastMessageContent: lastMessage.content.substring(0, 50),
              isIncognito: chatStore.currentRootFolderId === "incognito",
            });
          }
        }

        await aiStream.startStream(
          {
            operation: "send",
            rootFolderId: chatStore.currentRootFolderId,
            subFolderId: chatStore.currentSubFolderId,
            threadId: chatStore.activeThreadId,
            parentMessageId,
            content,
            role: "user",
            model: selectedModel,
            persona: selectedPersona,
            temperature,
            maxTokens,
            enableSearch,
            enabledToolIds,
          },
          {
            onThreadCreated: (data) => {
              logger.debug("useChat", "Thread created during send", {
                threadId: data.threadId,
                rootFolderId: data.rootFolderId,
              });

              // Set the active thread in the chat store
              // This ensures subsequent messages use the correct threadId
              chatStore.setActiveThread(data.threadId);
              logger.debug("useChat", "Set active thread after creation", {
                threadId: data.threadId,
              });

              // Call the callback if provided
              if (onThreadCreated) {
                onThreadCreated(data.threadId, data.rootFolderId);
              }
            },
            onContentDone: createCreditUpdateCallback(selectedModel, logger),
          },
        );

        setInput("");
      } catch (error) {
        logger.error("useChat", "Failed to send message", { error });
      } finally {
        chatStore.setLoading(false);
      }
    },
    [
      logger,
      chatStore,
      aiStream,
      selectedModel,
      selectedPersona,
      temperature,
      maxTokens,
      enableSearch,
      enabledToolIds,
      locale,
    ],
  );

  const retryMessage = useCallback(
    async (messageId: string): Promise<void> => {
      logger.debug("useChat", "Retrying message (creating branch)", {
        messageId,
      });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("useChat", "Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        // Use "retry" operation which creates a branch with the same user message content
        // For incognito mode, we need to provide the content since there's no database
        // For authenticated mode, the backend will fetch it from the database
        await aiStream.startStream(
          {
            operation: "retry",
            rootFolderId: chatStore.currentRootFolderId,
            subFolderId: chatStore.currentSubFolderId,
            threadId: message.threadId,
            parentMessageId: messageId,
            content: message.content, // Provide content for incognito mode
            role: message.role.toLowerCase() as "user" | "assistant" | "system",
            model: selectedModel,
            persona: selectedPersona,
            temperature,
            maxTokens,
            enableSearch: false,
            enabledToolIds,
          },
          {
            onContentDone: createCreditUpdateCallback(selectedModel, logger),
          },
        );
      } catch (error) {
        logger.error("useChat", "Failed to retry message", { error });
      } finally {
        chatStore.setLoading(false);
      }
    },
    [
      logger,
      chatStore,
      aiStream,
      selectedModel,
      selectedPersona,
      temperature,
      maxTokens,
      enabledToolIds,
    ],
  );

  const branchMessage = useCallback(
    async (messageId: string, newContent: string): Promise<void> => {
      logger.debug("useChat", "Branching message", { messageId, newContent });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("useChat", "Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        // Use "edit" operation which creates a branch with the same parent
        await aiStream.startStream(
          {
            operation: "edit",
            rootFolderId: chatStore.currentRootFolderId,
            subFolderId: chatStore.currentSubFolderId,
            threadId: message.threadId,
            parentMessageId: messageId,
            content: newContent,
            role: "user",
            model: selectedModel,
            persona: selectedPersona,
            temperature,
            maxTokens,
            enableSearch: false,
            enabledToolIds,
          },
          {
            onContentDone: createCreditUpdateCallback(selectedModel, logger),
          },
        );
      } catch (error) {
        logger.error("useChat", "Failed to branch message", { error });
      } finally {
        chatStore.setLoading(false);
      }
    },
    [
      logger,
      chatStore,
      aiStream,
      selectedModel,
      selectedPersona,
      temperature,
      maxTokens,
      enableSearch,
      enabledToolIds,
    ],
  );

  const answerAsAI = useCallback(
    async (messageId: string, content: string): Promise<void> => {
      logger.debug("useChat", "Answering as AI", { messageId, content });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("useChat", "Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        await aiStream.startStream(
          {
            operation: "answer-as-ai",
            rootFolderId: chatStore.currentRootFolderId,
            subFolderId: chatStore.currentSubFolderId,
            threadId: message.threadId,
            parentMessageId: messageId,
            content,
            role: "assistant",
            model: selectedModel,
            persona: selectedPersona,
            temperature,
            maxTokens,
            enableSearch: false,
            enabledToolIds,
          },
          {
            onContentDone: createCreditUpdateCallback(selectedModel, logger),
          },
        );
      } catch (error) {
        logger.error("useChat", "Failed to answer as AI", { error });
      } finally {
        chatStore.setLoading(false);
      }
    },
    [
      logger,
      chatStore,
      aiStream,
      selectedModel,
      selectedPersona,
      temperature,
      maxTokens,
      enabledToolIds,
    ],
  );

  const stopGeneration = useCallback((): void => {
    logger.debug("useChat", "Stopping generation");
    aiStream.stopStream();
  }, [logger, aiStream]);

  // Thread operations
  const createNewThread = useCallback((): string => {
    logger.debug("useChat", "Creating new thread");
    const threadId = crypto.randomUUID();
    chatStore.setActiveThread(threadId);
    return threadId;
  }, [logger, chatStore]);

  const setActiveThreadCallback = useCallback(
    (threadId: string | null): void => {
      logger.debug("useChat", "Setting active thread", { threadId });
      chatStore.setActiveThread(threadId);
    },
    [logger, chatStore],
  );

  const deleteMessage = useCallback(
    async (messageId: string): Promise<void> => {
      logger.debug("useChat", "Deleting message", { messageId });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("useChat", "Message not found", { messageId });
        return;
      }

      // Get the thread to check if it's incognito
      const thread = chatStore.threads[message.threadId];
      if (!thread) {
        logger.error("useChat", "Thread not found for message", {
          messageId,
          threadId: message.threadId,
        });
        return;
      }

      // Check if user is authenticated
      const authStatusCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(AUTH_STATUS_COOKIE_PREFIX));
      const isAuthenticated = authStatusCookie !== undefined;

      // For incognito mode, delete from both store and localStorage (no API call)
      if (!isAuthenticated || thread.rootFolderId === "incognito") {
        logger.debug(
          "useChat",
          "Deleting incognito message (client-side only)",
          {
            messageId,
            isAuthenticated,
            rootFolderId: thread.rootFolderId,
          },
        );

        // Delete from store (in-memory)
        chatStore.deleteMessage(messageId);

        // Also delete from localStorage
        try {
          const { deleteMessage: deleteIncognitoMessage } = await import(
            "./incognito/storage"
          );
          deleteIncognitoMessage(messageId);
          logger.debug(
            "useChat",
            "Deleted incognito message from localStorage",
            {
              messageId,
            },
          );
        } catch (error) {
          logger.error(
            "useChat",
            "Failed to delete incognito message from localStorage",
            { error },
          );
        }

        return;
      }

      // For authenticated users, delete from server
      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/threads/${message.threadId}/messages/${messageId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          logger.error("useChat", "Failed to delete message", {
            status: response.status,
          });
          return;
        }

        // Remove from store
        chatStore.deleteMessage(messageId);
      } catch (error) {
        logger.error("useChat", "Failed to delete message", { error });
      }
    },
    [logger, chatStore, locale],
  );

  const voteMessage = useCallback(
    async (messageId: string, vote: 1 | -1 | 0): Promise<void> => {
      logger.debug("useChat", "Voting on message", { messageId, vote });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("useChat", "Message not found", { messageId });
        return;
      }

      // Get the thread to check if it's incognito
      const thread = chatStore.threads[message.threadId];
      if (!thread) {
        logger.error("useChat", "Thread not found for message", {
          messageId,
          threadId: message.threadId,
        });
        return;
      }

      // Check if user is authenticated
      const authStatusCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(AUTH_STATUS_COOKIE_PREFIX));
      const isAuthenticated = authStatusCookie !== undefined;

      // Incognito mode doesn't support voting
      if (!isAuthenticated || thread.rootFolderId === "incognito") {
        logger.debug("useChat", "Voting not supported in incognito mode", {
          messageId,
          isAuthenticated,
          rootFolderId: thread.rootFolderId,
        });
        return;
      }

      // Convert number vote to string format expected by backend
      const voteString = vote === 1 ? "up" : vote === -1 ? "down" : "remove";

      // For authenticated users, vote on server
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
          logger.error("useChat", "Failed to vote on message", {
            status: response.status,
          });
          return;
        }

        // Update local state - optimistic update
        const updates: Partial<ChatMessage> = {};
        if (vote === 1) {
          updates.upvotes = (message.upvotes || 0) + 1;
        } else if (vote === -1) {
          updates.downvotes = (message.downvotes || 0) + 1;
        }
        chatStore.updateMessage(messageId, updates);
      } catch (error) {
        logger.error("useChat", "Failed to vote on message", { error });
      }
    },
    [logger, chatStore, locale],
  );

  const deleteThread = useCallback(
    async (threadId: string): Promise<void> => {
      logger.debug("useChat", "Deleting thread", { threadId });

      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/threads/${threadId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          logger.error("useChat", "Failed to delete thread", {
            status: response.status,
          });
          return;
        }

        // Remove from store
        chatStore.deleteThread(threadId);

        // If this was the active thread, clear it
        if (chatStore.activeThreadId === threadId) {
          chatStore.setActiveThread(null);
        }
      } catch (error) {
        logger.error("useChat", "Failed to delete thread", { error });
      }
    },
    [logger, chatStore, locale],
  );

  const updateThread = useCallback(
    async (threadId: string, updates: ThreadUpdate): Promise<void> => {
      logger.debug("useChat", "Updating thread", { threadId, updates });

      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/threads/${threadId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updates }),
          },
        );

        if (!response.ok) {
          logger.error("useChat", "Failed to update thread", {
            status: response.status,
          });
          return;
        }

        // Update local store
        chatStore.updateThread(threadId, updates);
      } catch (error) {
        logger.error("useChat", "Failed to update thread", { error });
      }
    },
    [logger, chatStore, locale],
  );

  const createFolder = useCallback(
    async (
      name: string,
      rootFolderId: DefaultFolderId,
      parentId: string | null,
      icon?: string,
    ): Promise<string> => {
      logger.debug("useChat", "Creating folder", {
        name,
        rootFolderId,
        parentId,
        icon,
      });

      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/folders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              folder: {
                name,
                rootFolderId,
                ...(parentId && { parentId }),
                ...(icon && { icon }),
              },
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          logger.error("useChat", "Failed to create folder", {
            status: response.status,
            error: errorData,
          });
          return "";
        }

        const data = (await response.json()) as {
          success: boolean;
          data: { response: { folder: ChatFolder } };
        };
        const folder = data.data.response.folder;

        // Add to store
        chatStore.addFolder(folder);

        return folder.id;
      } catch (error) {
        logger.error("useChat", "Failed to create folder", { error });
        return "";
      }
    },
    [logger, chatStore, locale],
  );

  const updateFolder = useCallback(
    async (folderId: string, updates: FolderUpdate): Promise<void> => {
      logger.debug("useChat", "Updating folder", { folderId, updates });

      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/folders/${folderId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updates }),
          },
        );

        if (!response.ok) {
          logger.error("useChat", "Failed to update folder", {
            status: response.status,
          });
          return;
        }

        // Update local store
        chatStore.updateFolder(folderId, updates);
      } catch (error) {
        logger.error("useChat", "Failed to update folder", { error });
      }
    },
    [logger, chatStore, locale],
  );

  const deleteFolder = useCallback(
    async (folderId: string): Promise<void> => {
      logger.debug("useChat", "Deleting folder", { folderId });

      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/folders/${folderId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          logger.error("useChat", "Deleting folder", {
            status: response.status,
          });
          return;
        }

        // Remove from store
        chatStore.deleteFolder(folderId);
      } catch (error) {
        logger.error("useChat", "Failed to delete folder", { error });
      }
    },
    [logger, chatStore, locale],
  );

  const setCurrentFolder = useCallback(
    (rootFolderId: DefaultFolderId, subFolderId: string | null): void => {
      logger.debug("useChat", "Setting current folder", {
        rootFolderId,
        subFolderId,
      });
      chatStore.setCurrentFolder(rootFolderId, subFolderId);
    },
    [logger, chatStore],
  );

  return {
    // State - use subscribed variables for reactivity
    threads,
    messages,
    folders,
    personas,
    activeThread,
    activeThreadMessages,
    isLoading,
    isStreaming: streamStore.isStreaming,

    // Current context - use subscribed variables
    currentRootFolderId,
    currentSubFolderId,

    // Input
    input,
    setInput,

    // Settings
    selectedPersona,
    selectedModel,
    temperature,
    maxTokens,
    ttsAutoplay,
    sidebarCollapsed,
    theme,
    viewMode,
    enableSearch,
    enabledToolIds,
    setSelectedPersona,
    setSelectedModel,
    setTemperature,
    setMaxTokens,
    setTTSAutoplay,
    setSidebarCollapsed,
    setTheme,
    setViewMode,
    setEnableSearch,
    setEnabledToolIds,

    // Message operations
    sendMessage,
    retryMessage,
    branchMessage,
    answerAsAI,
    deleteMessage,
    voteMessage,
    stopGeneration,

    // Thread operations
    createNewThread,
    setActiveThread: setActiveThreadCallback,
    deleteThread,
    updateThread,

    // Folder operations
    createFolder,
    updateFolder,
    deleteFolder,

    // Navigation
    setCurrentFolder,

    // Refs
    inputRef,

    // Logger
    logger,
  };
}
