/**
 * Central Chat Store
 * Zustand store for managing all chat state
 */

import { create } from "zustand";

import type { DefaultFolderId } from "./config";
import type { IconValue } from "./model-access/icons";
import { ModelId, type ModelId as ModelIdType } from "./model-access/models";

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
  defaultPersona: string | null;
  systemPrompt: string | null;
  pinned: boolean;
  archived: boolean;
  tags: string[];
  preview: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tool call information
 */
export interface ToolCall {
  toolName: string;
  args: Record<string, string | number | boolean | null>;
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
  persona: string | null;
  errorType: string | null;
  errorMessage: string | null;
  edited: boolean;
  tokens: number | null;
  toolCalls?: ToolCall[] | null;
  upvotes: number | null;
  downvotes: number | null;
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
  icon: IconValue | null;
  color: string | null;
  parentId: string | null;
  expanded: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat settings type
 */
export interface ChatSettings {
  selectedModel: ModelIdType;
  selectedPersona: string;
  temperature: number;
  maxTokens: number;
  ttsAutoplay: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  viewMode: "linear" | "flat" | "threaded";
  enableSearch: boolean;
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

  // Settings (persisted to localStorage)
  settings: ChatSettings;

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

  // Settings actions
  hydrateSettings: () => void;
  updateSettings: (updates: Partial<ChatSettings>) => void;

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

// Default settings (used for both server and initial client render)
const getDefaultSettings = (): ChatSettings => ({
  selectedModel: ModelId.KIMI_K2_FREE,
  selectedPersona: "default",
  temperature: 0.7,
  maxTokens: 2000,
  ttsAutoplay: false,
  sidebarCollapsed: false,
  theme: "dark",
  viewMode: "linear",
  enableSearch: false,
});

// Helper to load settings from localStorage (client-only, called after mount)
const loadSettings = (): ChatSettings => {
  const defaults = getDefaultSettings();

  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const stored = localStorage.getItem("chat-settings");
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ChatSettings>;
      // Merge with defaults to handle missing fields from old versions
      return { ...defaults, ...parsed };
    }
  } catch {
    // Silently fail and return defaults
  }

  return defaults;
};

// Helper to save settings to localStorage
const saveSettings = (settings: ChatSettings): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem("chat-settings", JSON.stringify(settings));
  } catch {
    // Silently fail
  }
};

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

  // Use default settings for SSR - will be hydrated from localStorage after mount
  settings: getDefaultSettings(),

  // Thread actions
  addThread: (thread: ChatThread): void => {
    set((state) => ({
      threads: {
        ...state.threads,
        [thread.id]: thread,
      },
    }));
  },

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [folderId]: _deleted, ...remainingFolders } = state.folders;
      return {
        folders: remainingFolders,
      };
    }),

  // Settings actions
  hydrateSettings: (): void => {
    const settings = loadSettings();
    set({ settings });
  },

  updateSettings: (updates: Partial<ChatSettings>): void =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        ...updates,
      };
      saveSettings(newSettings);
      return {
        settings: newSettings,
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
  reset: (): void => {
    const defaultSettings = getDefaultSettings();
    saveSettings(defaultSettings);
    set({
      threads: {},
      messages: {},
      folders: {},
      activeThreadId: null,
      currentRootFolderId: "private",
      currentSubFolderId: null,
      isLoading: false,
      settings: defaultSettings,
    });
  },
}));
