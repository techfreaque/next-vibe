/**
 * Central Chat Store
 * Zustand store for managing all chat state
 */

import { create } from "zustand";

import type { DefaultFolderId } from "./config";
import type { ModelId } from "./model-access/models";

/**
 * Chat thread type
 */
export interface ChatThread {
  id: string;
  userId: string;
  title: string;
  rootFolderId: DefaultFolderId;
  folderId: string | null;
  status: "active" | "archived" | "deleted";
  defaultModel: ModelId | null;
  defaultTone: string | null;
  systemPrompt: string | null;
  pinned: boolean;
  archived: boolean;
  tags: string[];
  preview: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat message type
 */
export interface ChatMessage {
  id: string;
  threadId: string;
  role: "user" | "assistant" | "system" | "error";
  content: string;
  parentId: string | null;
  depth: number;
  authorId: string | null;
  authorName: string | null;
  isAI: boolean;
  model: ModelId | null;
  tone: string | null;
  errorType: string | null;
  errorMessage: string | null;
  edited: boolean;
  tokens: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat folder type
 */
export interface ChatFolder {
  id: string;
  userId: string;
  rootFolderId: DefaultFolderId;
  name: string;
  icon: string | null;
  color: string | null;
  parentId: string | null;
  expanded: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat state
 */
interface ChatState {
  // Data
  threads: Record<string, ChatThread>;
  messages: Record<string, ChatMessage>;
  folders: Record<string, ChatFolder>;

  // UI state
  activeThreadId: string | null;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  isLoading: boolean;

  // Thread actions
  addThread: (thread: ChatThread) => void;
  updateThread: (threadId: string, updates: Partial<ChatThread>) => void;
  deleteThread: (threadId: string) => void;
  setActiveThread: (threadId: string | null) => void;

  // Message actions
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  deleteMessage: (messageId: string) => void;
  getThreadMessages: (threadId: string) => ChatMessage[];

  // Folder actions
  addFolder: (folder: ChatFolder) => void;
  updateFolder: (folderId: string, updates: Partial<ChatFolder>) => void;
  deleteFolder: (folderId: string) => void;

  // Navigation
  setCurrentFolder: (
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void;

  // Loading state
  setLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

/**
 * Create chat store
 */
export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  threads: {},
  messages: {},
  folders: {},
  activeThreadId: null,
  currentRootFolderId: "private",
  currentSubFolderId: null,
  isLoading: false,

  // Thread actions
  addThread: (thread: ChatThread): void =>
    set((state) => ({
      threads: {
        ...state.threads,
        [thread.id]: thread,
      },
    })),

  updateThread: (threadId: string, updates: Partial<ChatThread>): void =>
    set((state) => {
      const thread = state.threads[threadId];
      if (!thread) {
        return state;
      }

      return {
        threads: {
          ...state.threads,
          [threadId]: {
            ...thread,
            ...updates,
            updatedAt: new Date(),
          },
        },
      };
    }),

  deleteThread: (threadId: string): void =>
    set((state) => {
      const { [threadId]: _deleted, ...remainingThreads } = state.threads;
      return {
        threads: remainingThreads,
        activeThreadId:
          state.activeThreadId === threadId ? null : state.activeThreadId,
      };
    }),

  setActiveThread: (threadId: string | null): void =>
    set({
      activeThreadId: threadId,
    }),

  // Message actions
  addMessage: (message: ChatMessage): void =>
    set((state) => ({
      messages: {
        ...state.messages,
        [message.id]: message,
      },
    })),

  updateMessage: (messageId: string, updates: Partial<ChatMessage>): void =>
    set((state) => {
      const message = state.messages[messageId];
      if (!message) {
        return state;
      }

      return {
        messages: {
          ...state.messages,
          [messageId]: {
            ...message,
            ...updates,
            updatedAt: new Date(),
          },
        },
      };
    }),

  deleteMessage: (messageId: string): void =>
    set((state) => {
      const { [messageId]: _deleted, ...remainingMessages } = state.messages;
      return {
        messages: remainingMessages,
      };
    }),

  getThreadMessages: (threadId: string): ChatMessage[] => {
    const state = get();
    return Object.values(state.messages)
      .filter((msg) => msg.threadId === threadId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  // Folder actions
  addFolder: (folder: ChatFolder): void =>
    set((state) => ({
      folders: {
        ...state.folders,
        [folder.id]: folder,
      },
    })),

  updateFolder: (folderId: string, updates: Partial<ChatFolder>): void =>
    set((state) => {
      const folder = state.folders[folderId];
      if (!folder) {
        return state;
      }

      return {
        folders: {
          ...state.folders,
          [folderId]: {
            ...folder,
            ...updates,
            updatedAt: new Date(),
          },
        },
      };
    }),

  deleteFolder: (folderId: string): void =>
    set((state) => {
      const { [folderId]: _deleted, ...remainingFolders } = state.folders;
      return {
        folders: remainingFolders,
      };
    }),

  // Navigation
  setCurrentFolder: (
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ): void =>
    set({
      currentRootFolderId: rootFolderId,
      currentSubFolderId: subFolderId,
    }),

  // Loading state
  setLoading: (loading: boolean): void =>
    set({
      isLoading: loading,
    }),

  // Reset
  reset: (): void =>
    set({
      threads: {},
      messages: {},
      folders: {},
      activeThreadId: null,
      currentRootFolderId: "private",
      currentSubFolderId: null,
      isLoading: false,
    }),
}));
