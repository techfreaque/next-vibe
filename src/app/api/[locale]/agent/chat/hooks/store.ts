/**
 * Central Chat Store
 * Zustand store for managing all chat state
 */

import { storage } from "next-vibe-ui/lib/storage";
import { create } from "zustand";

import { aliasToPathMap } from "../../../system/generated/endpoint";
import {
  DEFAULT_TTS_VOICE,
  type TtsVoiceValue,
} from "../../text-to-speech/enum";
import { DEFAULT_TOOL_IDS } from "../config";
import type { ChatFolder, ChatMessage, ChatThread } from "../db";
import { ViewMode, type ViewModeValue } from "../enum";
import {
  saveMessage as saveIncognitoMessage,
  saveThread as saveIncognitoThread,
} from "../incognito/storage";
import { ModelId, type ModelId as ModelIdType } from "../model-access/models";

export type { ChatFolder, ChatMessage, ChatThread };

/**
 * Chat settings type
 */
export interface ChatSettings {
  selectedModel: ModelIdType;
  selectedCharacter: string;
  temperature: number;
  maxTokens: number;
  ttsAutoplay: boolean;
  ttsVoice: typeof TtsVoiceValue;
  theme: "light" | "dark";
  viewMode: typeof ViewModeValue;
  enabledToolIds: string[];
}

/**
 * Chat state
 * NOTE: Navigation state (activeThreadId, currentRootFolderId, currentSubFolderId) removed
 * These are now derived from URL and passed as props instead of stored in state
 * NOTE: rootFolderPermissions removed - now computed server-side and passed as props
 */
interface ChatState {
  // Data
  threads: Record<string, ChatThread>;
  messages: Record<string, ChatMessage>;
  folders: Record<string, ChatFolder>;

  // UI state
  isLoading: boolean;
  isDataLoaded: boolean;

  // Branch state - tracks which branch is selected at each level for each thread
  // Key: threadId, Value: Record<parentMessageId, branchIndex>
  branchIndices: Record<string, Record<string, number>>;

  // Settings (persisted to localStorage)
  settings: ChatSettings;

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

  // Settings actions
  hydrateSettings: () => Promise<void>;
  updateSettings: (updates: Partial<ChatSettings>) => void;

  // Folder actions
  addFolder: (folder: ChatFolder) => void;
  updateFolder: (folderId: string, updates: Partial<ChatFolder>) => void;
  deleteFolder: (folderId: string) => void;

  // Loading state
  setLoading: (loading: boolean) => void;
  setDataLoaded: (loaded: boolean) => void;

  // Reset
  reset: () => void;
}

// Default settings (used for both server and initial client render)
const getDefaultSettings = (): ChatSettings => ({
  selectedModel: ModelId.CLAUDE_HAIKU_4_5,
  selectedCharacter: "default",
  temperature: 0.7,
  maxTokens: 2000,
  ttsAutoplay: false,
  ttsVoice: DEFAULT_TTS_VOICE,
  theme: "dark",
  viewMode: ViewMode.LINEAR,
  enabledToolIds: [...DEFAULT_TOOL_IDS],
});

// Helper to load settings from localStorage (client-only, called after mount)
const loadSettings = async (): Promise<ChatSettings> => {
  const defaults = getDefaultSettings();

  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const stored = await storage.getItem("chat-settings");
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ChatSettings>;

      // Validate tool IDs against aliasToPathMap
      // Filter out any tools that no longer exist
      if (parsed.enabledToolIds && Array.isArray(parsed.enabledToolIds)) {
        const validToolIds = parsed.enabledToolIds.filter((toolId) => {
          // Check if the tool exists in aliasToPathMap
          return toolId in aliasToPathMap;
        });

        // If some tools were filtered out, update localStorage
        if (validToolIds.length !== parsed.enabledToolIds.length) {
          const cleanedSettings = {
            ...defaults,
            ...parsed,
            enabledToolIds: validToolIds,
          };
          // Save the cleaned settings back to localStorage
          void saveSettings(cleanedSettings);
          return cleanedSettings;
        }

        parsed.enabledToolIds = validToolIds;
      }

      // User has stored settings - return them as-is without merging defaults
      // This preserves the user's explicit tool choices
      return {
        ...defaults,
        ...parsed,
      };
    }
    // No stored settings - return defaults (new user gets default tools)
  } catch {
    // Silently fail and return defaults
  }

  return defaults;
};

// Helper to save settings to storage
const saveSettings = async (settings: ChatSettings): Promise<void> => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await storage.setItem("chat-settings", JSON.stringify(settings));
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
  isLoading: false,
  isDataLoaded: false,
  branchIndices: {},

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
  hydrateSettings: async (): Promise<void> => {
    const settings = await loadSettings();
    set({ settings });
  },

  updateSettings: (updates: Partial<ChatSettings>): void =>
    set((state) => {
      const newSettings = {
        ...state.settings,
        ...updates,
      };
      void saveSettings(newSettings);
      return {
        settings: newSettings,
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

  // Reset
  reset: (): void => {
    const defaultSettings = getDefaultSettings();
    void saveSettings(defaultSettings);
    set({
      threads: {},
      messages: {},
      folders: {},
      isLoading: false,
      isDataLoaded: false,
      settings: defaultSettings,
    });
  },
}));
