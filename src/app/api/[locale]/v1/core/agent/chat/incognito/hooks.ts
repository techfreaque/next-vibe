/**
 * Incognito Mode Hooks
 * Provides localStorage-based chat operations for incognito mode
 */

"use client";

import { useCallback, useEffect, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { DefaultFolderId } from "../config";
import { CHAT_CONSTANTS } from "../config";
import { ChatMessageRole } from "../enum";
import type { ModelId } from "../model-access/models";
import type { ChatFolder, ChatMessage, ChatThread } from "../hooks/store";
import {
  createIncognitoMessage,
  createIncognitoThread,
  deleteMessage,
  deleteThread,
  getMessagesForThread,
  loadIncognitoState,
  type IncognitoState,
  setActiveThread as setActiveThreadStorage,
  setCurrentFolder as setCurrentFolderStorage,
  updateIncognitoMessage,
  updateIncognitoThread,
} from "./storage";

/**
 * Incognito chat operations
 */
export interface UseIncognitoChatReturn {
  // State
  threads: Record<string, ChatThread>;
  messages: Record<string, ChatMessage>;
  folders: Record<string, ChatFolder>;
  activeThread: ChatThread | null;
  activeThreadMessages: ChatMessage[];

  // Thread operations
  createThread: (title: string) => ChatThread;
  updateThread: (threadId: string, updates: Partial<ChatThread>) => void;
  deleteThread: (threadId: string) => void;
  setActiveThread: (threadId: string | null) => void;

  // Message operations
  addMessage: (
    threadId: string,
    role: ChatMessageRole,
    content: string,
    parentId?: string | null,
    model?: ModelId | null,
    persona?: string | null,
  ) => ChatMessage;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  deleteMessage: (messageId: string) => void;

  // Folder operations
  setCurrentFolder: (
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void;

  // AI operations (client-side only - no server)
  sendMessage: (content: string, model: ModelId) => Promise<void>;
}

/**
 * Hook for incognito mode chat operations
 * All data stays in localStorage, never sent to server
 */
export function useIncognitoChat(
  locale: CountryLanguage,
  logger: EndpointLogger,
  currentRootFolderId: DefaultFolderId,
  currentSubFolderId: string | null,
): UseIncognitoChatReturn {
  const { t } = simpleT(locale);

  // Load initial state from storage
  const [state, setState] = useState<IncognitoState>({
    threads: {},
    messages: {},
    folders: {},
    activeThreadId: null,
    currentRootFolderId: "incognito",
    currentSubFolderId: null,
  });

  // Load state on mount and when folder changes
  useEffect(() => {
    async function loadState(): Promise<void> {
      const loadedState = await loadIncognitoState();
      setState(loadedState);
    }
    void loadState();
  }, [currentRootFolderId, currentSubFolderId]);

  // Get active thread
  const activeThread = state.activeThreadId
    ? state.threads[state.activeThreadId] || null
    : null;

  // Get active thread messages
  const [activeThreadMessages, setActiveThreadMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function loadMessages(): Promise<void> {
      if (state.activeThreadId) {
        const messages = await getMessagesForThread(state.activeThreadId);
        setActiveThreadMessages(messages);
      } else {
        setActiveThreadMessages([]);
      }
    }
    void loadMessages();
  }, [state.activeThreadId]);

  // Thread operations
  const createThread = useCallback(
    (title: string): ChatThread => {
      logger.debug("Incognito: Creating thread", { title });

      void (async (): Promise<void> => {
        const thread = await createIncognitoThread(
          title || t(CHAT_CONSTANTS.DEFAULT_THREAD_TITLE),
          currentRootFolderId,
          currentSubFolderId,
        );

        setState((prev: IncognitoState) => ({
          ...prev,
          threads: { ...prev.threads, [thread.id]: thread },
        }));
      })();

      // Return a placeholder thread that will be updated
      const placeholderId = `thread-${Date.now()}`;
      return {
        id: placeholderId,
        userId: "incognito",
        title: title || t(CHAT_CONSTANTS.DEFAULT_THREAD_TITLE),
        rootFolderId: currentRootFolderId,
        folderId: currentSubFolderId,
        status: "active",
        defaultModel: null,
        defaultPersona: null,
        systemPrompt: null,
        pinned: false,
        archived: false,
        tags: [],
        preview: null,
        canPost: true,
        canEdit: true,
        canModerate: true,
        canDelete: true,
        canManagePermissions: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    [logger, t, currentRootFolderId, currentSubFolderId],
  );

  const updateThreadCallback = useCallback(
    (threadId: string, updates: Partial<ChatThread>): void => {
      logger.debug("Incognito: Updating thread", {
        threadId,
        updatedFields: Object.keys(updates).join(", "),
      });

      void updateIncognitoThread(threadId, updates);

      setState((prev: IncognitoState) => ({
        ...prev,
        threads: {
          ...prev.threads,
          [threadId]: { ...prev.threads[threadId], ...updates },
        },
      }));
    },
    [logger],
  );

  const deleteThreadCallback = useCallback(
    (threadId: string): void => {
      logger.debug("Incognito: Deleting thread", { threadId });

      void deleteThread(threadId);

      setState((prev: IncognitoState) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [threadId]: _removed, ...remainingThreads } = prev.threads;
        return {
          ...prev,
          threads: remainingThreads,
          activeThreadId:
            prev.activeThreadId === threadId ? null : prev.activeThreadId,
        };
      });
    },
    [logger],
  );

  const setActiveThreadCallback = useCallback(
    (threadId: string | null): void => {
      logger.debug("Incognito: Setting active thread", { threadId });

      void setActiveThreadStorage(threadId);

      setState((prev: IncognitoState) => ({
        ...prev,
        activeThreadId: threadId,
      }));
    },
    [logger],
  );

  // Message operations
  const addMessage = useCallback(
    (
      threadId: string,
      role: ChatMessage["role"],
      content: string,
      parentId: string | null = null,
      model: ModelId | null = null,
      persona: string | null = null,
    ): ChatMessage => {
      logger.debug("Incognito: Adding message", {
        threadId,
        role,
        content,
      });

      // Create placeholder message that will be updated
      const placeholderId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const placeholderMessage: ChatMessage = {
        id: placeholderId,
        threadId,
        role,
        content,
        parentId,
        depth: 0,
        authorId: "incognito",
        authorName: null,
        isAI: role === "assistant",
        model,
        persona,
        errorType: null,
        errorMessage: null,
        edited: false,
        tokens: null,
        upvotes: null,
        downvotes: null,
        sequenceId: null,
        sequenceIndex: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      void (async (): Promise<void> => {
        const message = await createIncognitoMessage(
          threadId,
          role,
          content,
          parentId,
          model,
          persona,
        );

        setState((prev: IncognitoState) => ({
          ...prev,
          messages: { ...prev.messages, [message.id]: message },
        }));
      })();

      return placeholderMessage;
    },
    [logger],
  );

  const updateMessageCallback = useCallback(
    (messageId: string, updates: Partial<ChatMessage>): void => {
      logger.debug("Incognito: Updating message", {
        messageId,
        updatedFields: Object.keys(updates).join(", "),
      });

      void updateIncognitoMessage(messageId, updates);

      setState((prev: IncognitoState) => ({
        ...prev,
        messages: {
          ...prev.messages,
          [messageId]: { ...prev.messages[messageId], ...updates },
        },
      }));
    },
    [logger],
  );

  const deleteMessageCallback = useCallback(
    (messageId: string): void => {
      logger.debug("Incognito: Deleting message", { messageId });

      void deleteMessage(messageId);

      setState((prev: IncognitoState) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [messageId]: _removed, ...remainingMessages } = prev.messages;
        return {
          ...prev,
          messages: remainingMessages,
        };
      });
    },
    [logger],
  );

  // Folder operations
  const setCurrentFolderCallback = useCallback(
    (rootFolderId: DefaultFolderId, subFolderId: string | null): void => {
      logger.debug("Incognito: Setting current folder", {
        rootFolderId,
        subFolderId,
      });

      void setCurrentFolderStorage(rootFolderId, subFolderId);

      setState((prev: IncognitoState) => ({
        ...prev,
        currentRootFolderId: rootFolderId,
        currentSubFolderId: subFolderId,
      }));
    },
    [logger],
  );

  // AI operations (client-side only)
  const sendMessage = useCallback(
    (content: string, model: ModelId): Promise<void> => {
      logger.debug("Incognito: Sending message (client-side)", {
        content,
        model,
      });

      // Create user message
      const userMessage = addMessage(
        state.activeThreadId || "",
        ChatMessageRole.USER,
        content,
        null,
        model,
        null,
      );

      // Incognito mode uses server-side streaming via /api/chat/ai-stream endpoint
      // Messages are not persisted to database
      /* eslint-disable i18next/no-literal-string */
      const placeholderMessage =
        "Incognito mode: messages are not saved. Use the chat input to send messages.";
      /* eslint-enable i18next/no-literal-string */
      addMessage(
        state.activeThreadId || "",
        ChatMessageRole.ASSISTANT,
        placeholderMessage,
        userMessage.id,
        model,
        null,
      );

      return Promise.resolve();
    },
    [logger, addMessage, state.activeThreadId],
  );

  return {
    threads: state.threads,
    messages: state.messages,
    folders: state.folders,
    activeThread,
    activeThreadMessages,
    createThread,
    updateThread: updateThreadCallback,
    deleteThread: deleteThreadCallback,
    setActiveThread: setActiveThreadCallback,
    addMessage,
    updateMessage: updateMessageCallback,
    deleteMessage: deleteMessageCallback,
    setCurrentFolder: setCurrentFolderCallback,
    sendMessage,
  };
}
