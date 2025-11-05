/**
 * Central Chat Store
 * Zustand store for managing all chat state
 */

import { create } from "zustand";

import type { DefaultFolderId } from "../config";
import type { MessageMetadata, ToolCall } from "../db";
import type { IconValue } from "../model-access/icons";
import { ModelId, type ModelId as ModelIdType } from "../model-access/models";
import { type ChatMessageRole } from "../enum";
import { type UserRoleValue } from "../../../user/user-roles/enum";

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
  rolesView?: (typeof UserRoleValue)[] | null; // Roles that can view/read this thread
  rolesEdit?: (typeof UserRoleValue)[] | null; // Roles that can edit thread properties
  rolesPost?: (typeof UserRoleValue)[] | null; // Roles that can post messages in this thread
  rolesModerate?: (typeof UserRoleValue)[] | null; // Roles that can moderate/hide messages
  rolesAdmin?: (typeof UserRoleValue)[] | null; // Roles that can delete this thread
  // Permission flags - computed server-side based on user's actual permissions
  canEdit?: boolean; // Whether current user can edit thread title/settings
  canPost?: boolean; // Whether current user can post messages
  canModerate?: boolean; // Whether current user can moderate/hide messages
  canDelete?: boolean; // Whether current user can delete thread
  canManagePermissions?: boolean; // Whether current user can manage permissions
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat message type
 */
export interface ChatMessage {
  id: string;
  threadId: string;
  role: ChatMessageRole;
  content: string;
  parentId: string | null;
  depth: number;
  sequenceId: string | null; // Links messages in the same AI response sequence
  sequenceIndex: number; // Order within sequence
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
  metadata?: MessageMetadata; // Message metadata (reasoning, tool calls, etc.)
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
  metadata: Record<string, string | number | boolean | null>;
  rolesView?: (typeof UserRoleValue)[] | null; // Roles that can view/read this folder
  rolesManage?: (typeof UserRoleValue)[] | null; // Roles that can edit folder and create subfolders
  rolesCreateThread?: (typeof UserRoleValue)[] | null; // Roles that can create threads in this folder
  rolesPost?: (typeof UserRoleValue)[] | null; // Roles that can post messages in threads
  rolesModerate?: (typeof UserRoleValue)[] | null; // Roles that can hide/moderate this folder
  rolesAdmin?: (typeof UserRoleValue)[] | null; // Roles that can delete this folder
  // Permission flags - computed server-side based on user's actual permissions
  canManage?: boolean; // Whether current user can edit folder/create subfolders
  canCreateThread?: boolean; // Whether current user can create threads
  canModerate?: boolean; // Whether current user can moderate content
  canDelete?: boolean; // Whether current user can delete folder
  canManagePermissions?: boolean; // Whether current user can manage permissions
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
  enabledToolIds: string[];
}

/**
 * Root folder permissions type
 */
export interface RootFolderPermissions {
  canCreateThread: boolean;
  canCreateFolder: boolean;
}

/**
 * Chat state
 * NOTE: Navigation state (activeThreadId, currentRootFolderId, currentSubFolderId) removed
 * These are now derived from URL and passed as props instead of stored in state
 */
interface ChatState {
  // Data
  threads: Record<string, ChatThread>;
  messages: Record<string, ChatMessage>;
  folders: Record<string, ChatFolder>;
  rootFolderPermissions: Record<string, RootFolderPermissions>; // Keyed by root folder ID

  // UI state
  isLoading: boolean;

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

  // Settings actions
  hydrateSettings: () => void;
  updateSettings: (updates: Partial<ChatSettings>) => void;

  // Folder actions
  addFolder: (folder: ChatFolder) => void;
  updateFolder: (folderId: string, updates: Partial<ChatFolder>) => void;
  deleteFolder: (folderId: string) => void;

  // Root folder permissions actions
  setRootFolderPermissions: (
    rootFolderId: DefaultFolderId,
    permissions: RootFolderPermissions,
  ) => void;

  // Loading state
  setLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

// Default settings (used for both server and initial client render)
const getDefaultSettings = (): ChatSettings => ({
  selectedModel: ModelId.GPT_5_NANO,
  selectedPersona: "default",
  temperature: 0.7,
  maxTokens: 2000,
  ttsAutoplay: false,
  sidebarCollapsed: false,
  theme: "dark",
  viewMode: "linear",
  enabledToolIds: [],
});

/**
 * Migrate old tool ID format to new format
 * Old format: "core_credits", "core_agent_chat_personas"
 * New format: "get_v1_core_credits", "get_v1_core_agent_chat_personas"
 */
const migrateToolIds = (toolIds: string[]): string[] => {
  return toolIds
    .map((id) => {
      // If ID already has method prefix (contains _v1_), it's already in new format
      if (id.includes("_v1_")) {
        return id;
      }

      // Old format detected - migrate to new format
      // Default to GET method for most tools
      // Special cases can be added here if needed
      return `get_v1_${id}`;
    })
    .filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates
};

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

      // Migrate old tool IDs to new format
      if (parsed.enabledToolIds && Array.isArray(parsed.enabledToolIds)) {
        const migratedToolIds = migrateToolIds(parsed.enabledToolIds);

        // If migration happened, save the migrated version back to localStorage
        if (
          JSON.stringify(migratedToolIds) !==
          JSON.stringify(parsed.enabledToolIds)
        ) {
          const migratedSettings = {
            ...defaults,
            ...parsed,
            enabledToolIds: migratedToolIds,
          };
          saveSettings(migratedSettings);
          return migratedSettings;
        }
      }

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
  rootFolderPermissions: {},
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
      };
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
      .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
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

  // Root folder permissions actions
  setRootFolderPermissions: (
    rootFolderId: DefaultFolderId,
    permissions: RootFolderPermissions,
  ): void =>
    set((state) => ({
      rootFolderPermissions: {
        ...state.rootFolderPermissions,
        [rootFolderId]: permissions,
      },
    })),

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
      rootFolderPermissions: {},
      isLoading: false,
      settings: defaultSettings,
    });
  },
}));
