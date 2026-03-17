/**
 * Central Chat Store
 * Zustand store for managing all chat state
 */

import { create } from "zustand";

import type { ChatFolder, ChatThread } from "../db";
import { saveThread as saveIncognitoThread } from "../incognito/storage";

export type { ChatFolder, ChatThread };

/**
 * UI tool model — used by the tool selection modal.
 * Converted to/from availableTools/pinnedTools when persisting to settings.
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
  folders: Record<string, ChatFolder>;

  // UI state
  isLoading: boolean;

  // Tracks threads created this session that haven't been persisted to server yet.
  // Prevents useLazyBranchLoader from fetching messages for brand-new threads (404).
  pendingNewThreadIds: Set<string>;

  // Lazy loading state - tracks whether a thread's messages are fully or partially loaded
  // 'full' = all messages loaded (original behavior), 'partial' = only active branch path
  threadLoadMode: Record<string, "full" | "partial">;

  // Thread actions
  addThread: (thread: ChatThread) => void;
  updateThread: (threadId: string, updates: Partial<ChatThread>) => void;
  deleteThread: (threadId: string) => void;

  // Folder actions
  addFolder: (folder: ChatFolder) => void;
  updateFolder: (folderId: string, updates: Partial<ChatFolder>) => void;
  deleteFolder: (folderId: string) => void;

  // Thread load mode
  setThreadLoadMode: (threadId: string, mode: "full" | "partial") => void;

  // Loading state
  setLoading: (loading: boolean) => void;

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
  folders: {},
  isLoading: false,
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
      folders: {},
      isLoading: false,
      threadLoadMode: {},
    });
  },
}));
