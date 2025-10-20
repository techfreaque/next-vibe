/**
 * Central Chat Hook
 * Combines all chat functionality - production ready, 100% typesafe
 * This is the ONLY hook that should be imported in the chat folder
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useAIStream } from "./ai-stream/hooks";
import { useAIStreamStore } from "./ai-stream/store";
import type { DefaultFolderId } from "./config";
import { useFoldersList } from "./folders/hooks";
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
import { useThreadsList } from "./threads/hooks";

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
  setSelectedPersona: (persona: string) => void;
  setSelectedModel: (model: ModelId) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setTTSAutoplay: (autoplay: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  setViewMode: (mode: "linear" | "flat" | "threaded") => void;
  setEnableSearch: (enabled: boolean) => void;

  // Message operations
  sendMessage: (content: string) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
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
  // Get stores
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

  // Load all threads and folders on mount
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      // Load ALL threads (no rootFolderId filter)
      try {
        // Build query params for GET request - use dot notation for nested objects
        // Note: pagination and filters objects are required, but their fields are optional
        const params = new URLSearchParams({
          "pagination.page": "1",
          "pagination.limit": "1000",
          // filters object is required but all fields are optional - send empty placeholder
          "filters._placeholder": "",
        });

        const threadsResponse = await fetch(
          `/api/${locale}/v1/core/agent/chat/threads?${params.toString()}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (threadsResponse.ok) {
          const threadsData = await threadsResponse.json();
          logger.debug("useChat", "Loaded threads", { threadsData });

          if (threadsData.success && threadsData.data?.response?.threads) {
            threadsData.data.response.threads.forEach(
              (thread: {
                id: string;
                title: string;
                rootFolderId: string;
                folderId: string | null;
                status: string;
                pinned: boolean;
                preview: string | null;
                createdAt: string;
                updatedAt: string;
              }) => {
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
                  pinned: thread.pinned || false,
                  archived: false,
                  tags: [],
                  preview: thread.preview || null,
                  createdAt: new Date(thread.createdAt),
                  updatedAt: new Date(thread.updatedAt),
                });
              },
            );
            logger.debug("useChat", "Threads loaded successfully", {
              count: threadsData.data.response.threads.length,
            });
          }
        } else {
          logger.error("useChat", "Failed to load threads", {
            status: threadsResponse.status,
            statusText: threadsResponse.statusText,
          });
        }
      } catch (error) {
        logger.error("useChat", "Failed to load threads", { error });
      }

      // Load folders for each root folder (skip incognito - no server folders)
      const rootFolders: DefaultFolderId[] = ["private", "shared", "public"];
      for (const rootFolderId of rootFolders) {
        try {
          const params = new URLSearchParams({
            rootFolderId,
          });

          const foldersResponse = await fetch(
            `/api/${locale}/v1/core/agent/chat/folders?${params.toString()}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            },
          );

          if (foldersResponse.ok) {
            const foldersData = await foldersResponse.json();
            logger.debug("useChat", "Loaded folders", {
              rootFolderId,
              foldersData,
            });

            if (foldersData.success && foldersData.data?.folders) {
              foldersData.data.folders.forEach(
                (folder: {
                  id: string;
                  userId: string;
                  name: string;
                  icon: string | null;
                  color: string | null;
                  rootFolderId: string;
                  parentId: string | null;
                  expanded: boolean;
                  sortOrder: number;
                  createdAt: string;
                  updatedAt: string;
                }) => {
                  chatStore.addFolder({
                    id: folder.id,
                    userId: folder.userId,
                    name: folder.name,
                    icon: folder.icon,
                    color: folder.color,
                    rootFolderId: folder.rootFolderId,
                    parentId: folder.parentId,
                    expanded: folder.expanded,
                    sortOrder: folder.sortOrder,
                    createdAt: new Date(folder.createdAt),
                    updatedAt: new Date(folder.updatedAt),
                  });
                },
              );
              logger.debug("useChat", "Folders loaded successfully", {
                rootFolderId,
                count: foldersData.data.folders.length,
              });
            }
          } else {
            logger.error("useChat", "Failed to load folders", {
              rootFolderId,
              status: foldersResponse.status,
              statusText: foldersResponse.statusText,
            });
          }
        } catch (error) {
          logger.error("useChat", "Failed to load folders", {
            rootFolderId,
            error,
          });
        }
      }
    };

    void loadData();
  }, [locale, chatStore, logger]);

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

  // Get settings from store (persisted to localStorage)
  const settings = chatStore.settings;
  const selectedPersona = settings.selectedPersona;
  const selectedModel = settings.selectedModel;
  const temperature = settings.temperature;
  const maxTokens = settings.maxTokens;
  const ttsAutoplay = settings.ttsAutoplay;
  const sidebarCollapsed = settings.sidebarCollapsed;
  const theme = settings.theme;
  const viewMode = settings.viewMode;
  const enableSearch = settings.enableSearch;

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

  // Get active thread and messages
  const activeThread = chatStore.activeThreadId
    ? chatStore.threads[chatStore.activeThreadId] || null
    : null;
  const activeThreadMessages = chatStore.activeThreadId
    ? chatStore.getThreadMessages(chatStore.activeThreadId)
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
  }, [streamStore.streamingMessages, chatStore, t]);

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
  }, [streamStore.threads, chatStore]);

  // Message operations
  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      logger.debug("useChat", "Sending message", { content });

      chatStore.setLoading(true);

      try {
        await aiStream.startStream({
          operation: "send",
          rootFolderId: chatStore.currentRootFolderId,
          subFolderId: chatStore.currentSubFolderId,
          threadId: chatStore.activeThreadId,
          parentMessageId: null,
          content,
          role: "user",
          model: selectedModel,
          persona: selectedPersona,
          temperature,
          maxTokens,
          enableSearch: false,
        });

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
    ],
  );

  const retryMessage = useCallback(
    async (messageId: string): Promise<void> => {
      logger.debug("useChat", "Retrying message", { messageId });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("useChat", "Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        await aiStream.startStream({
          operation: "retry",
          rootFolderId: chatStore.currentRootFolderId,
          subFolderId: chatStore.currentSubFolderId,
          threadId: message.threadId,
          parentMessageId: messageId,
          content: message.content,
          role: message.role as "user" | "assistant" | "system",
          model: selectedModel,
          persona: selectedPersona,
          temperature,
          maxTokens,
          enableSearch: false,
        });
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
    ],
  );

  const editMessage = useCallback(
    async (messageId: string, newContent: string): Promise<void> => {
      logger.debug("useChat", "Editing message", { messageId, newContent });

      const message = chatStore.messages[messageId];
      if (!message) {
        logger.error("useChat", "Message not found", { messageId });
        return;
      }

      chatStore.setLoading(true);

      try {
        await aiStream.startStream({
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
        });
      } catch (error) {
        logger.error("useChat", "Failed to edit message", { error });
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
        await aiStream.startStream({
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
        });
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

      try {
        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/threads/${message.threadId}/messages/${messageId}/vote`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ vote }),
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
    ): Promise<string> => {
      logger.debug("useChat", "Creating folder", {
        name,
        rootFolderId,
        parentId,
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
                parentId,
              },
            }),
          },
        );

        if (!response.ok) {
          logger.error("useChat", "Failed to create folder", {
            status: response.status,
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
    // State
    threads: chatStore.threads,
    messages: chatStore.messages,
    folders: chatStore.folders,
    personas,
    activeThread,
    activeThreadMessages,
    isLoading: chatStore.isLoading,
    isStreaming: streamStore.isStreaming,

    // Current context
    currentRootFolderId: chatStore.currentRootFolderId,
    currentSubFolderId: chatStore.currentSubFolderId,

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
    setSelectedPersona,
    setSelectedModel,
    setTemperature,
    setMaxTokens,
    setTTSAutoplay,
    setSidebarCollapsed,
    setTheme,
    setViewMode,
    setEnableSearch,

    // Message operations
    sendMessage,
    retryMessage,
    editMessage,
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
