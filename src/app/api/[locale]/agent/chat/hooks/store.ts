/**
 * Central Chat Store
 * Zustand store for managing all chat state
 */

import { create } from "zustand";

import type { ChatFolder, ChatMessage, ChatThread } from "../db";
import {
  saveMessage as saveIncognitoMessage,
  saveThread as saveIncognitoThread,
} from "../incognito/storage";

export type { ChatFolder, ChatMessage, ChatThread };

/**
 * UI tool model — used by the tool selection modal.
 * Converted to/from allowedTools/pinnedTools when persisting to settings.
 */
export interface EnabledTool {
  id: string;
  requiresConfirmation: boolean;
  /** true = tool is pinned to the AI context window (always loaded) */
  pinned: boolean;
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
  isLoading: boolean;
  isDataLoaded: boolean;

  // Tracks threads created this session that haven't been persisted to server yet.
  // Prevents useLazyBranchLoader from fetching messages for brand-new threads (404).
  pendingNewThreadIds: Set<string>;

  // Branch state - tracks which branch is selected at each level for each thread
  // Key: threadId, Value: Record<parentMessageId, branchIndex>
  branchIndices: Record<string, Record<string, number>>;

  // Lazy loading state - tracks whether a thread's messages are fully or partially loaded
  // 'full' = all messages loaded (original behavior), 'partial' = only active branch path
  threadLoadMode: Record<string, "full" | "partial">;

  // Thread actions
  addThread: (thread: ChatThread) => void;
  updateThread: (threadId: string, updates: Partial<ChatThread>) => void;
  deleteThread: (threadId: string) => void;

  // Message actions
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  deleteMessage: (messageId: string) => void;
  getThreadMessages: (threadId: string) => ChatMessage[];

  // Branch actions
  getBranchIndices: (threadId: string) => Record<string, number>;
  setBranchIndices: (threadId: string, indices: Record<string, number>) => void;
  updateBranchIndex: (
    threadId: string,
    parentMessageId: string,
    branchIndex: number,
  ) => void;

  // Folder actions
  addFolder: (folder: ChatFolder) => void;
  updateFolder: (folderId: string, updates: Partial<ChatFolder>) => void;
  deleteFolder: (folderId: string) => void;

  // Thread load mode
  setThreadLoadMode: (threadId: string, mode: "full" | "partial") => void;

  // Loading state
  setLoading: (loading: boolean) => void;
  setDataLoaded: (loaded: boolean) => void;

  // Pending new threads
  markThreadPendingCreate: (threadId: string) => void;
  clearThreadPendingCreate: (threadId: string) => void;
  isThreadPendingCreate: (threadId: string) => boolean;

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
  isLoading: false,
  isDataLoaded: false,
  branchIndices: {},
  threadLoadMode: {},
  pendingNewThreadIds: new Set<string>(),

  // Thread actions
  addThread: (thread: ChatThread): void => {
    set((state) => ({
      threads: {
        ...state.threads,
        [thread.id]: thread,
      },
    }));

    // Only save to localStorage for incognito threads
    if (thread.rootFolderId === "incognito") {
      void saveIncognitoThread(thread);
    }
  },

  updateThread: (threadId: string, updates: Partial<ChatThread>): void =>
    set((state) => {
      const thread = state.threads[threadId];
      if (!thread) {
        return state;
      }

      const updatedThread = {
        ...thread,
        ...updates,
        updatedAt: new Date(),
      };

      // Only save to localStorage for incognito threads
      if (updatedThread.rootFolderId === "incognito") {
        void saveIncognitoThread(updatedThread);
      }

      return {
        threads: {
          ...state.threads,
          [threadId]: updatedThread,
        },
      };
    }),

  deleteThread: (threadId: string): void =>
    set((state) => {
      const thread = state.threads[threadId];

      // If incognito thread, also delete from localStorage
      if (thread?.rootFolderId === "incognito") {
        void import("../incognito/storage")
          .then(({ deleteThread }) => {
            return deleteThread(threadId);
          })
          .catch(() => {
            // Silently fail - localStorage cleanup is not critical
          });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [threadId]: _deleted, ...remainingThreads } = state.threads;
      return {
        threads: remainingThreads,
      };
    }),

  // Message actions
  addMessage: (message: ChatMessage): void => {
    set((state) => {
      // Check if this message belongs to an incognito thread
      const thread = state.threads[message.threadId];
      const isIncognito = thread?.rootFolderId === "incognito";

      // Only save to localStorage for incognito messages
      if (isIncognito) {
        void saveIncognitoMessage(message);
      }

      return {
        messages: {
          ...state.messages,
          [message.id]: message,
        },
      };
    });
  },

  updateMessage: (messageId: string, updates: Partial<ChatMessage>): void =>
    set((state) => {
      const message = state.messages[messageId];
      if (!message) {
        return state;
      }

      const updatedMessage = {
        ...message,
        ...updates,
        // Merge metadata instead of replacing it
        metadata: updates.metadata
          ? { ...message.metadata, ...updates.metadata }
          : message.metadata,
        updatedAt: new Date(),
      };

      // Check if this message belongs to an incognito thread
      const thread = state.threads[message.threadId];
      const isIncognito = thread?.rootFolderId === "incognito";

      // Only save to localStorage for incognito messages
      if (isIncognito) {
        void saveIncognitoMessage(updatedMessage);
      }

      return {
        messages: {
          ...state.messages,
          [messageId]: updatedMessage,
        },
      };
    }),

  deleteMessage: (messageId: string): void =>
    set((state) => {
      const message = state.messages[messageId];

      // If incognito message, also delete from localStorage
      if (message) {
        const thread = state.threads[message.threadId];
        if (thread?.rootFolderId === "incognito") {
          void import("../incognito/storage")
            .then(({ deleteMessage }) => {
              return deleteMessage(messageId);
            })
            .catch(() => {
              // Silently fail - localStorage cleanup is not critical
            });
        }
      }

      // Re-parent children to the deleted message's parent so the
      // conversation tree stays connected (e.g. deleting a compacting
      // message keeps the AI response visible).
      const updatedMessages = { ...state.messages };
      delete updatedMessages[messageId];

      if (message) {
        for (const msg of Object.values(updatedMessages)) {
          if (msg.parentId === messageId) {
            updatedMessages[msg.id] = {
              ...msg,
              parentId: message.parentId,
              depth: message.depth,
            };
          }
        }
      }

      return {
        messages: updatedMessages,
      };
    }),

  getThreadMessages: (threadId: string): ChatMessage[] => {
    const state = get();
    return Object.values(state.messages)
      .filter((msg) => msg.threadId === threadId)
      .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  // Branch actions
  getBranchIndices: (threadId: string): Record<string, number> => {
    const state = get();
    return state.branchIndices[threadId] || {};
  },

  setBranchIndices: (
    threadId: string,
    indices: Record<string, number>,
  ): void => {
    set((state) => ({
      branchIndices: {
        ...state.branchIndices,
        [threadId]: indices,
      },
    }));
  },

  updateBranchIndex: (
    threadId: string,
    parentMessageId: string,
    branchIndex: number,
  ): void => {
    set((state) => {
      const currentIndices = state.branchIndices[threadId] || {};
      return {
        branchIndices: {
          ...state.branchIndices,
          [threadId]: {
            ...currentIndices,
            [parentMessageId]: branchIndex,
          },
        },
      };
    });
  },

  // Thread load mode
  setThreadLoadMode: (threadId: string, mode: "full" | "partial"): void =>
    set((state) => ({
      threadLoadMode: {
        ...state.threadLoadMode,
        [threadId]: mode,
      },
    })),

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [folderId]: _deleted, ...remainingFolders } = state.folders;
      return {
        folders: remainingFolders,
      };
    }),

  // Loading state
  setLoading: (loading: boolean): void =>
    set({
      isLoading: loading,
    }),

  setDataLoaded: (loaded: boolean): void =>
    set({
      isDataLoaded: loaded,
    }),

  // Pending new threads
  markThreadPendingCreate: (threadId: string): void =>
    set((state) => ({
      pendingNewThreadIds: new Set([...state.pendingNewThreadIds, threadId]),
    })),

  clearThreadPendingCreate: (threadId: string): void =>
    set((state) => {
      const next = new Set(state.pendingNewThreadIds);
      next.delete(threadId);
      return { pendingNewThreadIds: next };
    }),

  isThreadPendingCreate: (threadId: string): boolean =>
    get().pendingNewThreadIds.has(threadId),

  // Reset
  reset: (): void => {
    set({
      threads: {},
      messages: {},
      folders: {},
      isLoading: false,
      isDataLoaded: false,
      threadLoadMode: {},
    });
  },
}));
