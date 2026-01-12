/**
 * Incognito Mode Hooks
 * Provides localStorage-based chat operations for incognito mode
 */

"use client";

import { useCallback, useEffect, useState } from "react";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { DefaultFolderId } from "../config";
import { CHAT_CONSTANTS } from "../constants";
import type { ChatFolder, ChatMessage, ChatThread } from "../db";
import { ChatMessageRole, ThreadStatus } from "../enum";
import {
  createIncognitoMessage,
  createIncognitoThread,
  deleteMessage,
  deleteThread,
  getMessagesForThread,
  type IncognitoState,
  loadIncognitoState,
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
    parentId: string | null | undefined,
    model: ModelId | null | undefined,
    character: string | null | undefined,
    userMessageId: string,
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
  const [activeThreadMessages, setActiveThreadMessages] = useState<
    ChatMessage[]
  >([]);

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

      const threadId = crypto.randomUUID();

      void (async (): Promise<void> => {
        const thread = await createIncognitoThread(
          title || t(CHAT_CONSTANTS.DEFAULT_THREAD_TITLE),
          currentRootFolderId,
          currentSubFolderId,
          threadId,
        );

        setState((prev: IncognitoState) => ({
          ...prev,
          threads: { ...prev.threads, [thread.id]: thread },
        }));
      })();

      return {
        id: threadId,
        userId: "incognito",
        leadId: null,
        title: title || t(CHAT_CONSTANTS.DEFAULT_THREAD_TITLE),
        rootFolderId: currentRootFolderId,
        folderId: currentSubFolderId,
        status: ThreadStatus.ACTIVE,
        defaultModel: null,
        defaultCharacter: null,
        systemPrompt: null,
        pinned: false,
        archived: false,
        tags: [],
        preview: null,
        metadata: {},
        rolesView: null,
        rolesEdit: null,
        rolesPost: null,
        rolesModerate: null,
        rolesAdmin: null,
        published: false,
        canPost: true,
        canEdit: true,
        canModerate: true,
        canDelete: true,
        canManagePermissions: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        searchVector: null,
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
      character: string | null = null,
      userMessageId: string,
    ): ChatMessage => {
      logger.debug("Incognito: Adding message", {
        threadId,
        role,
        content,
        userMessageId,
      });

      const message: ChatMessage = {
        id: userMessageId,
        threadId,
        role,
        content,
        parentId,
        depth: 0,
        sequenceId: null,
        authorId: "incognito",
        authorName: null,
        authorAvatar: null,
        authorColor: null,
        isAI: role === "assistant",
        model,
        character,
        errorType: null,
        errorMessage: null,
        errorCode: null,
        edited: false,
        originalId: null,
        tokens: null,
        metadata: {},
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        searchVector: null,
      };

      void (async (): Promise<void> => {
        await createIncognitoMessage(
          threadId,
          role,
          content,
          parentId,
          model,
          character,
          {},
          userMessageId,
        );

        setState((prev: IncognitoState) => ({
          ...prev,
          messages: { ...prev.messages, [message.id]: message },
        }));
      })();

      return message;
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

      // Create user message with client-generated ID
      const userMessageId = crypto.randomUUID();
      const userMessage = addMessage(
        state.activeThreadId || "",
        ChatMessageRole.USER,
        content,
        null,
        model,
        null,
        userMessageId,
      );

      // Incognito mode uses server-side streaming via /api/chat/ai-stream endpoint
      // Messages are not persisted to database
      /* eslint-disable i18next/no-literal-string */
      const placeholderMessage =
        "Incognito mode: messages are not saved. Use the chat input to send messages.";
      /* eslint-enable i18next/no-literal-string */
      const assistantMessageId = crypto.randomUUID();
      addMessage(
        state.activeThreadId || "",
        ChatMessageRole.ASSISTANT,
        placeholderMessage,
        userMessage.id,
        model,
        null,
        assistantMessageId,
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
