/**
 * Central Chat Hook
 * Combines all chat functionality - production ready, 100% typesafe
 * This is the ONLY hook that should be imported in the chat folder
 */

/* eslint-disable react-compiler/react-compiler */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AUTH_STATUS_COOKIE_PREFIX } from "next-vibe/shared/constants";
import { parseError } from "next-vibe/shared/utils";

import { apiClient } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useAIStream } from "../ai-stream/hooks/hooks";
import { useAIStreamStore } from "../ai-stream/hooks/store";
import type { DefaultFolderId } from "./config";
import { DEFAULT_FOLDER_IDS } from "./config";
import { createCreditUpdateCallback } from "./credit-updater";
import { ChatMessageRole, ThreadStatus } from "./enum";
import {
  GET as foldersGetEndpoint,
  type FolderListResponseOutput,
} from "./folders/definition";
import type { IconValue } from "./model-access/icons";
import type { ModelId } from "./model-access/models";
import type { PersonaListResponseOutput } from "./personas/definition";
import { usePersonasList } from "./personas/hooks";
import {
  type ChatFolder,
  type ChatMessage,
  type ChatThread,
  useChatStore,
} from "./store";
import { GET as threadsGetEndpoint } from "./threads/definition";
import { useTheme } from "next-themes";

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
  enabledToolIds: string[];
  setSelectedPersona: (persona: string) => void;
  setSelectedModel: (model: ModelId) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setTTSAutoplay: (autoplay: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  setViewMode: (mode: "linear" | "flat" | "threaded") => void;
  setEnabledToolIds: (toolIds: string[]) => void;

  // Message operations
  sendMessage: (
    content: string,
    onThreadCreated?: (
      threadId: string,
      rootFolderId: string,
      subFolderId: string | null,
    ) => void,
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

  const { setTheme: setNextTheme } = useTheme();

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

      logger.debug("Chat: Checking authentication before loading data", {
        isAuthenticated,
      });

      // ALWAYS load incognito data from localStorage (for both authenticated and non-authenticated users)
      try {
        const { loadIncognitoState } = await import("./incognito/storage");
        const incognitoState = loadIncognitoState();

        logger.debug("Chat: Loading incognito data from localStorage", {
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

        logger.info("Chat: Incognito data loaded successfully", {
          threadCount: Object.keys(incognitoState.threads).length,
          messageCount: Object.keys(incognitoState.messages).length,
          folderCount: Object.keys(incognitoState.folders).length,
        });
      } catch (error) {
        logger.error(
          "useChat",
          "Failed to load incognito data",
          parseError(error),
        );
      }

      // Load PUBLIC threads and folders for non-authenticated users
      // Load ALL threads and folders for authenticated users
      logger.info("Chat: Loading server data", {
        isAuthenticated,
        loadingScope: isAuthenticated ? "all" : "public only",
      });

      // Load threads (PUBLIC only for non-authenticated, ALL for authenticated)
      // IMPORTANT: Disable local cache to ensure threads are always fresh from server
      // Only incognito threads should use localStorage
      try {
        const threadsResponse = await apiClient.fetch(
          threadsGetEndpoint,
          logger,
          {
            page: 1,
            limit: 100,
          },
          {},
          t,
          locale,
          {
            disableLocalCache: true, // Always fetch fresh from server
          },
        );

        logger.debug("Chat: Loaded threads", {
          success: threadsResponse.success,
          hasData: threadsResponse.success && !!threadsResponse.data,
        });

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
            logger.debug("Chat: Threads loaded successfully", {
              count: responseData.response.threads.length,
            });
          }
        }
      } catch (error) {
        logger.error("Chat: Failed to load threads", parseError(error));
      }

      // Load folders from server
      try {
        const foldersResponse = await apiClient.fetch(
          foldersGetEndpoint,
          logger,
          {},
          {},
          t,
          locale,
          {
            // Disable cache to ensure fresh data
            disableLocalCache: true,
          },
        );

        logger.debug("Chat: Loaded folders", {
          success: foldersResponse.success,
          hasData: foldersResponse.success && !!foldersResponse.data,
        });

        if (foldersResponse.success && foldersResponse.data) {
          const responseData = foldersResponse.data as FolderListResponseOutput;

          if (responseData.folders) {
            responseData.folders.forEach((folder) => {
              chatStore.addFolder({
                id: folder.id,
                userId: folder.userId,
                rootFolderId: folder.rootFolderId,
                name: folder.name,
                icon: folder.icon,
                color: folder.color,
                parentId: folder.parentId,
                expanded: folder.expanded,
                sortOrder: folder.sortOrder,
                metadata: folder.metadata,
                allowedRoles: folder.allowedRoles || [],
                // moderatorIds is not included in the API response, so we set it to undefined
                // It will be loaded separately if needed
                moderatorIds: undefined,
                createdAt: new Date(folder.createdAt),
                updatedAt: new Date(folder.updatedAt),
              });
            });
            logger.debug("Chat: Folders loaded successfully", {
              count: responseData.folders.length,
            });
          }
        }
      } catch (error) {
        logger.error("Chat: Failed to load folders", parseError(error));
      }
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
      setNextTheme(newTheme);
      chatStore.updateSettings({ theme: newTheme });
    },
    [chatStore, setNextTheme],
  );

  const setViewMode = useCallback(
    (mode: "linear" | "flat" | "threaded") => {
      chatStore.updateSettings({ viewMode: mode });
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

  // Compute active thread messages from subscribed messages state
  // This ensures component re-renders when messages change
  const activeThreadMessages = useMemo(() => {
    if (!activeThreadId) {
      return [];
    }
    return Object.values(messages)
      .filter((msg) => msg.threadId === activeThreadId)
      .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }, [activeThreadId, messages]);

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
          isAI: streamMsg.role === ChatMessageRole.ASSISTANT,
          model: streamMsg.model || null,
          persona: null,
          errorType: streamMsg.error
            ? t("app.api.v1.core.agent.chat.aiStream.errorTypes.streamError")
            : null,
          errorMessage: streamMsg.error || null,
          edited: false,
          tokens: streamMsg.totalTokens || null,
          toolCalls: streamMsg.toolCalls || null,
          upvotes: null,
          downvotes: null,
          sequenceId: streamMsg.sequenceId ?? null,
          sequenceIndex: streamMsg.sequenceIndex ?? 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        // Check if we need to update the message
        const needsUpdate =
          existingMsg.content !== streamMsg.content ||
          existingMsg.tokens !== (streamMsg.totalTokens || null) ||
          JSON.stringify(existingMsg.toolCalls) !==
            JSON.stringify(streamMsg.toolCalls || null);

        if (needsUpdate) {
          chatStore.updateMessage(streamMsg.messageId, {
            content: streamMsg.content,
            tokens: streamMsg.totalTokens || null,
            toolCalls: streamMsg.toolCalls || null,
            errorType: streamMsg.error
              ? t("app.api.v1.core.agent.chat.aiStream.errorTypes.streamError")
              : null,
            errorMessage: streamMsg.error || null,
          });
        }
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
          status: ThreadStatus.ACTIVE,
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
        logger.debug("Chat: Loading messages for thread", {
          threadId: activeThreadId,
        });

        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/threads/${activeThreadId}/messages`,
        );

        if (response.ok) {
          const data = (await response.json()) as {
            success: boolean;
            data?: { messages?: ChatMessage[] };
          };
          logger.debug("Chat: Loaded messages", {
            threadId: activeThreadId,
            count: data.data?.messages?.length || 0,
          });

          if (data.success && data.data?.messages) {
            // Add messages to store
            data.data.messages.forEach((message) => {
              chatStore.addMessage({
                id: message.id,
                threadId: message.threadId,
                role: message.role,
                content: message.content,
                model: message.model,
                persona: message.persona,
                parentId: message.parentId,
                depth: message.depth,
                authorId: null,
                authorName: null,
                isAI: message.role === "assistant" || message.role === "tool",
                errorType: null,
                errorMessage: null,
                edited: false,
                tokens: null,
                toolCalls: message.toolCalls,
                upvotes: null,
                downvotes: null,
                sequenceId: message.sequenceId ?? null,
                sequenceIndex: message.sequenceIndex ?? 0,
                createdAt: new Date(message.createdAt),
                updatedAt: new Date(message.updatedAt),
              });
            });
          }
        } else {
          logger.error("Chat: Failed to load messages", {
            threadId: activeThreadId,
            status: response.status,
          });
          // Remove from loaded set on error so it can be retried
          loadedThreadsRef.current.delete(activeThreadId);
        }
      } catch (error) {
        logger.error("Chat: Error loading messages", {
          threadId: activeThreadId,
          error: parseError(error).message,
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
      onThreadCreated?: (
        threadId: string,
        rootFolderId: string,
        subFolderId: string | null,
      ) => void,
    ): Promise<void> => {
      logger.debug("Chat: Sending message", {
        content: content.substring(0, 50),
        activeThreadId: chatStore.activeThreadId,
        currentRootFolderId: chatStore.currentRootFolderId,
      });

      chatStore.setLoading(true);

      try {
        // IMPORTANT: Use activeThreadId from the store at the time of sending
        // This ensures we use the correct thread ID (or null for new threads)
        const threadIdToUse = chatStore.activeThreadId;

        // Get the last message in the thread to use as parent
        // This ensures new messages continue the conversation instead of creating branches
        let parentMessageId: string | null = null;
        let messageHistory:
          | Array<{ role: "user" | "assistant" | "system"; content: string }>
          | undefined;

        if (threadIdToUse) {
          // For incognito mode, get messages from localStorage
          // For authenticated mode, get messages from chat store
          let threadMessages: ChatMessage[] = [];
          if (chatStore.currentRootFolderId === "incognito") {
            // Import incognito storage dynamically to avoid circular dependencies
            const { getMessagesForThread } = await import(
              "./incognito/storage"
            );
            threadMessages = getMessagesForThread(threadIdToUse);
          } else {
            threadMessages = chatStore.getThreadMessages(threadIdToUse);
          }

          if (threadMessages.length > 0) {
            // Get the last message (most recent)
            const lastMessage = threadMessages[threadMessages.length - 1];
            parentMessageId = lastMessage.id;
            logger.debug("Chat: Using last message as parent", {
              parentMessageId,
              lastMessageContent: lastMessage.content.substring(0, 50),
              isIncognito: chatStore.currentRootFolderId === "incognito",
            });

            // CRITICAL FIX: For incognito mode, build complete message history
            // The backend doesn't have database access for incognito, so we must send all messages
            // IMPORTANT: Filter out TOOL messages as they have role="tool" which is not accepted by AI
            if (
              chatStore.currentRootFolderId === DEFAULT_FOLDER_IDS.INCOGNITO
            ) {
              messageHistory = threadMessages
                .filter((msg) => msg.role !== "tool") // Exclude TOOL messages
                .map((msg) => ({
                  role: msg.role.toLowerCase() as
                    | "user"
                    | "assistant"
                    | "system",
                  content: msg.content,
                }));
              logger.debug("Chat: Built message history for incognito mode", {
                messageCount: messageHistory.length,
                threadId: threadIdToUse,
              });
            }
          }
        } else {
          logger.debug("Chat: No active thread, creating new thread", {
            rootFolderId: chatStore.currentRootFolderId,
            subFolderId: chatStore.currentSubFolderId,
          });
        }

        await aiStream.startStream(
          {
            operation: "send",
            rootFolderId: chatStore.currentRootFolderId,
            subFolderId: chatStore.currentSubFolderId,
            threadId: threadIdToUse,
            parentMessageId,
            content,
            role: "user",
            model: selectedModel,
            persona: selectedPersona,
            temperature,
            maxTokens,
            tools: enabledToolIds,
            messageHistory, // Pass message history for incognito mode
          },
          {
            onThreadCreated: (data) => {
              logger.debug("Chat: Thread created during send", {
                threadId: data.threadId,
                rootFolderId: data.rootFolderId,
                subFolderId: data.subFolderId,
              });

              // CRITICAL: Do NOT set active thread here
              // The navigation callback will update the URL, and the URL sync effect
              // in chat-interface.tsx will set the active thread based on the new URL
              // This prevents race conditions where store updates before URL navigation completes

              // Call the navigation callback if provided
              // This will navigate to the new thread URL
              if (onThreadCreated) {
                onThreadCreated(
                  data.threadId,
                  data.rootFolderId,
                  data.subFolderId,
                );
              }
            },
            onContentDone: createCreditUpdateCallback(selectedModel, logger),
          },
        );

        setInput("");
      } catch (error) {
        const errorMessage = parseError(error);
        logger.error("Chat: Failed to send message", {
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
      selectedModel,
      selectedPersona,
      temperature,
      maxTokens,
      enabledToolIds,
      setInput, // Add setInput to dependencies
      // locale is not used in this callback
    ],
  );

  const retryMessage = useCallback(
    async (messageId: string): Promise<void> => {
      logger.debug("Chat: Retrying message (creating branch)", {
        messageId,
      });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("Chat: Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        // Build message history for incognito mode
        let messageHistory:
          | Array<{ role: "user" | "assistant" | "system"; content: string }>
          | undefined;

        if (chatStore.currentRootFolderId === DEFAULT_FOLDER_IDS.INCOGNITO) {
          // Get all messages in the thread up to (not including) the message being retried
          const threadMessages = Object.values(chatStore.messages)
            .filter((msg) => msg.threadId === message.threadId)
            .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

          // Find the message being retried
          const messageIndex = threadMessages.findIndex(
            (msg) => msg.id === messageId,
          );

          if (messageIndex !== -1 && messageIndex > 0) {
            // Include all messages up to (but not including) the message being retried
            // IMPORTANT: Filter out TOOL messages as they have role="tool" which is not accepted by AI
            const contextMessages = threadMessages.slice(0, messageIndex);
            messageHistory = contextMessages
              .filter((msg) => msg.role !== "tool") // Exclude TOOL messages
              .map((msg) => ({
                role: msg.role.toLowerCase() as "user" | "assistant" | "system",
                content: msg.content,
              }));
            logger.debug("Chat: Built message history for incognito retry", {
              messageCount: messageHistory.length,
              threadId: message.threadId,
            });
          }
        }

        // Use "retry" operation which creates a branch with the same user message content
        // For incognito mode, we need to provide the content and history since there's no database
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
            tools: enabledToolIds,
            messageHistory, // Pass message history for incognito mode
          },
          {
            onContentDone: createCreditUpdateCallback(selectedModel, logger),
          },
        );
      } catch (error) {
        logger.error("Chat: Failed to retry message", parseError(error));
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
      logger.debug("Chat: Branching message", { messageId, newContent });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("Chat: Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        // For incognito mode, build message history up to the parent of the message being branched from
        let messageHistory:
          | Array<{
              role: "user" | "assistant" | "system";
              content: string;
            }>
          | undefined;

        // Determine the correct parentId for the new branch
        // For branching, we want to create a sibling of the source message
        // So we use the source message's parentId
        const branchParentId = message.parentId;

        if (chatStore.currentRootFolderId === DEFAULT_FOLDER_IDS.INCOGNITO) {
          // Get all messages in the thread up to (but not including) the message being branched from
          const threadMessages = Object.values(chatStore.messages)
            .filter((msg) => msg.threadId === message.threadId)
            .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

          // Find the parent message
          if (branchParentId) {
            const parentIndex = threadMessages.findIndex(
              (msg) => msg.id === branchParentId,
            );

            if (parentIndex !== -1) {
              // Include all messages up to and including the parent
              // IMPORTANT: Filter out TOOL messages as they have role="tool" which is not accepted by AI
              const contextMessages = threadMessages.slice(0, parentIndex + 1);
              messageHistory = contextMessages
                .filter((msg) => msg.role !== "tool") // Exclude TOOL messages
                .map((msg) => ({
                  role: msg.role.toLowerCase() as
                    | "user"
                    | "assistant"
                    | "system",
                  content: msg.content,
                }));
            }
          }
          // If branchParentId is null (branching from root), messageHistory stays undefined
        }

        // Use "edit" operation which creates a branch with the same parent as the source message
        // For server-side threads, the backend will look up the message and use its parentId
        // For incognito mode, we pass the source message's parentId directly
        await aiStream.startStream(
          {
            operation: "edit",
            rootFolderId: chatStore.currentRootFolderId,
            subFolderId: chatStore.currentSubFolderId,
            threadId: message.threadId,
            parentMessageId: branchParentId, // Pass the source message's parentId to create a sibling
            content: newContent,
            role: "user",
            model: selectedModel,
            persona: selectedPersona,
            temperature,
            maxTokens,
            tools: enabledToolIds,
            messageHistory,
          },
          {
            onContentDone: createCreditUpdateCallback(selectedModel, logger),
          },
        );
      } catch (error) {
        logger.error("Chat: Failed to branch message", parseError(error));
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

  const answerAsAI = useCallback(
    async (messageId: string, content: string): Promise<void> => {
      logger.debug("Chat: Answering as AI", { messageId, content });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("Chat: Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        // For incognito mode, build message history from localStorage
        let messageHistory:
          | Array<{ role: "user" | "assistant" | "system"; content: string }>
          | undefined;

        if (chatStore.currentRootFolderId === DEFAULT_FOLDER_IDS.INCOGNITO) {
          // Get all messages in the thread up to and including the parent message
          const threadMessages = Object.values(chatStore.messages)
            .filter((msg) => msg.threadId === message.threadId)
            .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

          // Find the index of the parent message
          const parentIndex = threadMessages.findIndex(
            (msg) => msg.id === messageId,
          );

          if (parentIndex !== -1) {
            // Include all messages up to and including the parent
            // IMPORTANT: Filter out TOOL messages as they have role="tool" which is not accepted by AI
            const contextMessages = threadMessages.slice(0, parentIndex + 1);
            messageHistory = contextMessages
              .filter((msg) => msg.role !== "tool") // Exclude TOOL messages
              .map((msg) => ({
                role: msg.role.toLowerCase() as "user" | "assistant" | "system",
                content: msg.content,
              }));
          }
        }

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
            tools: enabledToolIds,
            messageHistory,
          },
          {
            onContentDone: createCreditUpdateCallback(selectedModel, logger),
          },
        );
      } catch (error) {
        logger.error("Chat: Failed to answer as AI", parseError(error));
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
    logger.debug("Chat: Stopping generation");
    aiStream.stopStream();
  }, [logger, aiStream]);

  // Thread operations
  const createNewThread = useCallback((): string => {
    logger.debug("Chat: Creating new thread");
    const threadId = crypto.randomUUID();
    chatStore.setActiveThread(threadId);
    return threadId;
  }, [logger, chatStore]);

  const setActiveThreadCallback = useCallback(
    (threadId: string | null): void => {
      logger.debug("Chat: Setting active thread", { threadId });
      chatStore.setActiveThread(threadId);
    },
    [logger, chatStore],
  );

  const deleteMessage = useCallback(
    async (messageId: string): Promise<void> => {
      logger.debug("Chat: Deleting message", { messageId });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("Chat: Message not found", { messageId });
        return;
      }

      // Get the thread to check if it's incognito
      const thread = chatStore.threads[message.threadId];
      if (!thread) {
        logger.error("Chat: Thread not found for message", {
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

        // Also delete from streaming store to prevent re-adding
        if (streamStore.streamingMessages[messageId]) {
          const { [messageId]: _deleted, ...remainingMessages } =
            streamStore.streamingMessages;
          streamStore.reset();
          Object.values(remainingMessages).forEach((msg) => {
            streamStore.addMessage(msg);
          });
        }

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
            parseError(error),
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
          logger.error("Chat: Failed to delete message", {
            status: response.status,
          });
          return;
        }

        // Remove from store
        chatStore.deleteMessage(messageId);

        // Also delete from streaming store to prevent re-adding
        if (streamStore.streamingMessages[messageId]) {
          const { [messageId]: _deleted, ...remainingMessages } =
            streamStore.streamingMessages;
          streamStore.reset();
          Object.values(remainingMessages).forEach((msg) => {
            streamStore.addMessage(msg);
          });
        }
      } catch (error) {
        logger.error("Chat: Failed to delete message", parseError(error));
      }
    },
    [logger, chatStore, streamStore, locale],
  );

  const voteMessage = useCallback(
    async (messageId: string, vote: 1 | -1 | 0): Promise<void> => {
      logger.debug("Chat: Voting on message", { messageId, vote });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("Chat: Message not found", { messageId });
        return;
      }

      // Get the thread to check if it's incognito
      const thread = chatStore.threads[message.threadId];
      if (!thread) {
        logger.error("Chat: Thread not found for message", {
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
        logger.debug("Chat: Voting not supported in incognito mode", {
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
          logger.error("Chat: Failed to vote on message", {
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
        logger.error("Chat: Failed to vote on message", parseError(error));
      }
    },
    [logger, chatStore, locale],
  );

  const deleteThread = useCallback(
    async (threadId: string): Promise<void> => {
      logger.debug("Chat: Deleting thread", { threadId });

      // Check if this is the active thread - we'll need to navigate away
      const isActiveThread = chatStore.activeThreadId === threadId;
      const thread = chatStore.threads[threadId];

      if (!thread) {
        logger.error("Chat: Thread not found", { threadId });
        return;
      }

      // Store thread's folder context for navigation
      const threadRootFolderId = thread.rootFolderId;
      const threadSubFolderId = thread.folderId;

      // Check if this is an incognito thread
      if (thread.rootFolderId === "incognito") {
        logger.debug("Chat: Deleting incognito thread (localStorage only)", {
          threadId,
        });

        // Import incognito storage functions
        const { deleteThread: deleteIncognitoThread } = await import(
          "./incognito/storage"
        );

        // Delete from localStorage
        deleteIncognitoThread(threadId);

        // Remove from store
        chatStore.deleteThread(threadId);

        // If this was the active thread, navigate to new thread page
        if (isActiveThread) {
          chatStore.setActiveThread(null);

          // Navigate to new thread page in the thread's folder context
          const { buildFolderUrl } = await import(
            "@/app/[locale]/chat/lib/utils/navigation"
          );
          const url = `${buildFolderUrl(locale, threadRootFolderId, threadSubFolderId)}/new`;
          logger.debug("Chat: Navigating to new thread page after deletion", {
            url,
            threadRootFolderId,
            threadSubFolderId,
          });
          window.location.href = url;
        }

        return;
      }

      // For non-incognito threads, use API
      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/threads/${threadId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          logger.error("Chat: Failed to delete thread", {
            status: response.status,
          });
          return;
        }

        // Remove from store
        chatStore.deleteThread(threadId);

        // Also delete from streaming store to prevent re-adding
        if (streamStore.threads[threadId]) {
          const { [threadId]: _deleted, ...remainingThreads } =
            streamStore.threads;
          streamStore.reset();
          Object.values(remainingThreads).forEach((thread) => {
            streamStore.addThread(thread);
          });
        }

        // If this was the active thread, navigate to new thread page
        if (isActiveThread) {
          chatStore.setActiveThread(null);

          // Navigate to new thread page in the thread's folder context
          const { buildFolderUrl } = await import(
            "@/app/[locale]/chat/lib/utils/navigation"
          );
          const url = `${buildFolderUrl(locale, threadRootFolderId, threadSubFolderId)}/new`;
          logger.debug("Chat: Navigating to new thread page after deletion", {
            url,
            threadRootFolderId,
            threadSubFolderId,
          });
          window.location.href = url;
        }
      } catch (error) {
        logger.error("Chat: Failed to delete thread", parseError(error));
      }
    },
    [logger, chatStore, locale, streamStore],
  );

  const updateThread = useCallback(
    async (threadId: string, updates: ThreadUpdate): Promise<void> => {
      logger.debug("Chat: Updating thread", {
        threadId,
        updatedFields: Object.keys(updates).join(", "),
      });

      // Check if this is an incognito thread
      const thread = chatStore.threads[threadId];
      if (thread && thread.rootFolderId === "incognito") {
        logger.debug("Chat: Updating incognito thread (localStorage only)", {
          threadId,
        });

        // Import incognito storage functions
        const { updateIncognitoThread } = await import("./incognito/storage");

        // Update in localStorage
        updateIncognitoThread(threadId, updates);

        // Update local store
        chatStore.updateThread(threadId, updates);

        return;
      }

      // For non-incognito threads, use API
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
          logger.error("Chat: Failed to update thread", {
            status: response.status,
          });
          return;
        }

        // Update local store
        chatStore.updateThread(threadId, updates);
      } catch (error) {
        logger.error("Chat: Failed to update thread", parseError(error));
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
      logger.debug("Chat: Creating folder", {
        name,
        rootFolderId,
        parentId,
        icon,
      });

      // Check if this is an incognito folder
      if (rootFolderId === "incognito") {
        logger.debug("Chat: Creating incognito folder (localStorage only)", {
          name,
          rootFolderId,
          parentId,
        });

        // Import incognito storage functions
        const { generateIncognitoId, saveFolder } = await import(
          "./incognito/storage"
        );

        // Create folder in localStorage
        const folder: ChatFolder = {
          id: generateIncognitoId("folder"),
          userId: "incognito",
          rootFolderId,
          name,
          icon: (icon as IconValue) || null,
          color: null,
          parentId,
          expanded: true,
          sortOrder: 0,
          metadata: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        saveFolder(folder);

        // Add to store
        chatStore.addFolder(folder);

        return folder.id;
      }

      // For non-incognito folders, use API
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
          const errorData = (await response
            .json()
            // eslint-disable-next-line no-restricted-syntax
            .catch(() => ({}))) as Record<
            string,
            string | number | boolean | null
          >;
          logger.error("Chat: Failed to create folder", {
            status: response.status,
            error: parseError(errorData).message,
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
        logger.error("Chat: Failed to create folder", parseError(error));
        return "";
      }
    },
    [logger, chatStore, locale],
  );

  const updateFolder = useCallback(
    async (folderId: string, updates: FolderUpdate): Promise<void> => {
      logger.debug("Chat: Updating folder", {
        folderId,
        updatedFields: Object.keys(updates).join(", "),
      });

      // Check if this is an incognito folder
      const folder = chatStore.folders[folderId];
      if (folder && folder.rootFolderId === "incognito") {
        logger.debug("Chat: Updating incognito folder (localStorage only)", {
          folderId,
        });

        // Import incognito storage functions
        const { saveFolder } = await import("./incognito/storage");

        // Update in localStorage
        const updatedFolder = {
          ...folder,
          ...updates,
          updatedAt: new Date(),
        };
        saveFolder(updatedFolder);

        // Update local store
        chatStore.updateFolder(folderId, updates);

        return;
      }

      // For non-incognito folders, use API
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
          logger.error("Chat: Failed to update folder", {
            status: response.status,
          });
          return;
        }

        // Update local store
        chatStore.updateFolder(folderId, updates);
      } catch (error) {
        logger.error("Chat: Failed to update folder", parseError(error));
      }
    },
    [logger, chatStore, locale],
  );

  const deleteFolder = useCallback(
    async (folderId: string): Promise<void> => {
      logger.debug("Chat: Deleting folder", { folderId });

      // Check if this is an incognito folder
      const folder = chatStore.folders[folderId];
      if (folder && folder.rootFolderId === "incognito") {
        logger.debug("Chat: Deleting incognito folder (localStorage only)", {
          folderId,
        });

        // Import incognito storage functions
        const { deleteFolder: deleteIncognitoFolder } = await import(
          "./incognito/storage"
        );

        // Delete from localStorage
        deleteIncognitoFolder(folderId);

        // Remove from store
        chatStore.deleteFolder(folderId);

        return;
      }

      // For non-incognito folders, use API
      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/folders/${folderId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          logger.error("Chat: Deleting folder", {
            status: response.status,
          });
          return;
        }

        // Remove from store
        chatStore.deleteFolder(folderId);
      } catch (error) {
        logger.error("Chat: Failed to delete folder", parseError(error));
      }
    },
    [logger, chatStore, locale],
  );

  const setCurrentFolder = useCallback(
    (rootFolderId: DefaultFolderId, subFolderId: string | null): void => {
      logger.debug("Chat: Setting current folder", {
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
    enabledToolIds,
    setSelectedPersona,
    setSelectedModel,
    setTemperature,
    setMaxTokens,
    setTTSAutoplay,
    setSidebarCollapsed,
    setTheme,
    setViewMode,
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
