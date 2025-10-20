import { useCallback, useEffect, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { debouncedStorage } from "../../../lib/storage/debounced-storage";
import { quickSearchThreads } from "../../../lib/storage/search";
import {
  addFolderToState,
  createFolder,
  createInitialChatState,
  deleteFolderFromState,
  ensureDefaultFolders,
  getThreadsInFolder,
} from "../../../lib/storage/thread-manager";
import type {
  ChatFolder,
  ChatState,
  ChatThread,
  ChatUIPreferences,
  ViewMode,
} from "../../../lib/storage/types";
import { STORAGE_KEYS } from "../../../lib/storage/types";
import {
  moveFolderToParent as moveFolderToParentUtil,
  reorderFolderInState,
  updateFolderInState,
} from "../../../lib/utils/folder-operations";
import {
  createNewThreadInState,
  deleteThreadInState as deleteThreadInStateUtil,
  moveThreadInState,
  setActiveThreadInState,
  updateThreadInStateWrapper,
  updateThreadTitleInState,
} from "../../../lib/utils/thread-operations";

/**
 * Chat state constants
 */
const CHAT_STATE_CONSTANTS = {
  /** Default name for the general folder */
  PRIVATE_FOLDER_NAME: "Private Chats",

  /** Default icon for folders */
  DEFAULT_FOLDER_ICON: "folder",
} as const;

/**
 * Default UI preferences
 */
const DEFAULT_UI_PREFERENCES: ChatUIPreferences = {
  sidebarCollapsed: true,
  sidebarWidth: 280,
  showTimestamps: true,
  showBranchIndicators: true,
  viewMode: "linear", // Default to linear (ChatGPT style)
};

/**
 * Hook for managing chat state
 */
export function useChatState(
  locale: CountryLanguage,
  logger: EndpointLogger,
): {
  state: ChatState;
  uiPreferences: ChatUIPreferences;
  mounted: boolean;
  createNewThread: (folderId?: string | null) => string;
  deleteThread: (threadId: string) => void;
  updateThread: (
    threadId: string,
    updates: Partial<ChatThread> | ((prev: ChatThread) => ChatThread),
  ) => void;
  moveThread: (threadId: string, folderId: string | null) => void;
  createNewFolder: (name: string, parentId: string, icon?: string) => string;
  updateFolder: (folderId: string, updates: Partial<ChatFolder>) => void;
  deleteFolder: (folderId: string) => void;
  toggleFolderExpanded: (folderId: string) => void;
  reorderFolder: (folderId: string, direction: "up" | "down") => void;
  moveFolderToParent: (folderId: string, newParentId: string | null) => void;
  updateThreadTitle: (threadId: string) => void;
  searchThreads: (query: string) => ChatThread[];
  getThreadsInFolder: (folderId: string) => ChatThread[];
  updateUIPreferences: (updates: Partial<ChatUIPreferences>) => void;
  toggleSidebar: () => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveThread: (threadId: string | null) => void;
  getActiveThread: () => ChatThread | null;
  getThreadsInFolderById: (folderId: string) => ChatThread[];
  resetState: () => void;
} {
  const [state, setState] = useState<ChatState>(() => {
    if (typeof window === "undefined") {
      return createInitialChatState(locale);
    }
    return loadStateFromStorage(locale, logger);
  });

  const [uiPreferences, setUIPreferences] = useState<ChatUIPreferences>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_UI_PREFERENCES;
    }
    return loadUIPreferencesFromStorage(logger);
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Save state to localStorage whenever it changes (debounced)
  useEffect(() => {
    if (mounted) {
      saveStateToStorage(state);
    }
  }, [state, mounted]);

  // Save UI preferences to localStorage whenever they change (debounced)
  useEffect(() => {
    if (mounted) {
      saveUIPreferencesToStorage(uiPreferences);
    }
  }, [uiPreferences, mounted]);

  // Sync state across tabs using storage events
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (e: StorageEvent): void => {
      // Only handle changes from other tabs (e.storageArea will be null for same-tab changes)
      if (!e.storageArea) {
        return;
      }

      // Handle chat state changes
      if (e.key === STORAGE_KEYS.CHAT_STATE && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue) as ChatState;
          // Validate version before applying
          if (newState.version === 2) {
            setState(newState);
          }
        } catch (error) {
          logger.error("app.chat.storage.syncStateFailed", error);
        }
      }

      // Handle UI preferences changes
      if (e.key === STORAGE_KEYS.UI_PREFERENCES && e.newValue) {
        try {
          const newPreferences = JSON.parse(e.newValue) as ChatUIPreferences;
          setUIPreferences((prev) => ({ ...prev, ...newPreferences }));
        } catch (error) {
          logger.error("app.chat.storage.syncPreferencesFailed", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return (): void =>
      window.removeEventListener("storage", handleStorageChange);
  }, [logger]);

  // Thread operations
  const createNewThread = useCallback(
    (folderId?: string | null): string => {
      let newThreadId = "";

      setState((prev) => {
        const [newState, threadId] = createNewThreadInState(
          prev,
          locale,
          folderId,
        );
        newThreadId = threadId;
        return newState;
      });

      return newThreadId;
    },
    [locale],
  );

  const updateThread = useCallback(
    (
      threadId: string,
      updates: Partial<ChatThread> | ((prev: ChatThread) => ChatThread),
    ) => {
      setState((prevState) => {
        const existingThread = prevState.threads[threadId];
        if (!existingThread) {
          logger.warn("app.chat.state.threadNotFound", { threadId });
          return prevState;
        }

        return updateThreadInStateWrapper(prevState, threadId, updates);
      });
    },
    [logger],
  );

  const deleteThread = useCallback((threadId: string) => {
    setState((prev) => deleteThreadInStateUtil(prev, threadId));
  }, []);

  const setActiveThread = useCallback((threadId: string | null) => {
    setState((prev) => setActiveThreadInState(prev, threadId));
  }, []);

  const moveThread = useCallback(
    (threadId: string, folderId: string | null) => {
      setState((prev) => moveThreadInState(prev, threadId, folderId));
    },
    [],
  );

  const updateThreadTitle = useCallback((threadId: string) => {
    setState((prev) => updateThreadTitleInState(prev, threadId));
  }, []);

  // Folder operations
  const createNewFolder = useCallback(
    (name: string, parentId: string, icon?: string): string => {
      // Validate: parentId must be provided and cannot create root folders
      // Only default folders can be at root level
      if (!parentId) {
        logger.error(
          "Cannot create root-level folders. Folders must have a parent.",
        );
        return "";
      }

      const newFolder = createFolder({
        name,
        parentId,
        icon: icon || "folder",
      });
      setState((prev) => addFolderToState(prev, newFolder));
      return newFolder.id;
    },
    [logger],
  );

  const updateFolder = useCallback(
    (folderId: string, updates: Partial<ChatFolder>) => {
      setState((prev) => updateFolderInState(prev, folderId, updates));
    },
    [],
  );

  const deleteFolder = useCallback(
    (folderId: string, deleteThreads = false) => {
      setState((prev) => {
        const folder = prev.folders[folderId];

        // Special handling for General folder - empty it and restore default
        if (folder && folder.id === "general") {
          // Move all threads out of General folder
          const threadsInFolder = Object.values(prev.threads).filter(
            (t) => t.folderId === folderId,
          );

          let newState = { ...prev };

          // Delete all threads in General folder
          threadsInFolder.forEach((thread) => {
            newState = deleteThreadInStateUtil(newState, thread.id);
          });

          // Restore General folder to default
          newState.folders[folderId] = {
            ...newState.folders[folderId],
            name: CHAT_STATE_CONSTANTS.PRIVATE_FOLDER_NAME,
            icon: CHAT_STATE_CONSTANTS.DEFAULT_FOLDER_ICON,
            expanded: true,
          };

          return newState;
        }

        // Normal folder deletion
        return deleteFolderFromState(prev, folderId, deleteThreads);
      });
    },
    [],
  );

  const toggleFolderExpanded = useCallback((folderId: string) => {
    setState((prev) => {
      const folder = prev.folders[folderId];
      if (!folder) {
        return prev;
      }

      return {
        ...prev,
        folders: {
          ...prev.folders,
          [folderId]: {
            ...folder,
            expanded: !folder.expanded,
          },
        },
      };
    });
  }, []);

  const reorderFolder = useCallback(
    (folderId: string, direction: "up" | "down") => {
      setState((prev) => reorderFolderInState(prev, folderId, direction));
    },
    [],
  );

  const moveFolderToParent = useCallback(
    (folderId: string, newParentId: string | null) => {
      setState((prev) => moveFolderToParentUtil(prev, folderId, newParentId));
    },
    [],
  );

  // UI preferences operations
  const updateUIPreferences = useCallback(
    (updates: Partial<ChatUIPreferences>) => {
      setUIPreferences((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    [],
  );

  const toggleSidebar = useCallback(() => {
    setUIPreferences((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setUIPreferences((prev) => ({
      ...prev,
      viewMode: mode,
    }));
  }, []);

  // Utility functions
  const getActiveThread = useCallback((): ChatThread | null => {
    if (!state.activeThreadId) {
      return null;
    }
    return state.threads[state.activeThreadId] || null;
  }, [state]);

  const getThreadsInFolderById = useCallback(
    (folderId: string | null): ChatThread[] => {
      return getThreadsInFolder(state, folderId);
    },
    [state],
  );

  const searchThreads = useCallback(
    (query: string): ChatThread[] => {
      return quickSearchThreads(state, query);
    },
    [state],
  );

  // Reset to initial state
  const resetState = useCallback(() => {
    const initialState = createInitialChatState(locale);
    setState(initialState);
    setUIPreferences(DEFAULT_UI_PREFERENCES);
  }, [locale]);

  return {
    // State
    state,
    uiPreferences,
    mounted,

    // Thread operations
    createNewThread,
    updateThread,
    deleteThread,
    setActiveThread,
    moveThread,
    updateThreadTitle,

    // Folder operations
    createNewFolder,
    updateFolder,
    deleteFolder,
    toggleFolderExpanded,
    reorderFolder,
    moveFolderToParent,

    // UI preferences
    updateUIPreferences,
    toggleSidebar,
    setViewMode,

    // Utilities
    getActiveThread,
    getThreadsInFolder: getThreadsInFolderById,
    getThreadsInFolderById,
    searchThreads,
    resetState,
  };
}

/**
 * Load state from localStorage
 * Uses direct localStorage access (not debounced) for initial load
 */
function loadStateFromStorage(
  locale: CountryLanguage,
  logger: EndpointLogger,
): ChatState {
  const stored = debouncedStorage.getItem(STORAGE_KEYS.CHAT_STATE);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as ChatState;
      // Validate version and migrate if needed
      if (parsed.version === 2) {
        // Ensure all default folders exist (in case they were deleted or missing)
        return ensureDefaultFolders(parsed, locale);
      }
      // Version 1 or unknown - migrate by ensuring default folders
      if (parsed.version === 1) {
        const migratedState: ChatState = {
          ...parsed,
          version: 2,
        };
        return ensureDefaultFolders(migratedState, locale);
      }
    } catch (error) {
      logger.error("app.chat.storage.parseStateFailed", error);
    }
  }
  return createInitialChatState(locale);
}

/**
 * Save state to localStorage with debouncing
 * Debouncing prevents blocking the main thread during rapid updates (e.g., streaming)
 */
function saveStateToStorage(state: ChatState): void {
  debouncedStorage.setItemJSON(STORAGE_KEYS.CHAT_STATE, state);
}

/**
 * Load UI preferences from localStorage
 * Uses direct localStorage access (not debounced) for initial load
 */
function loadUIPreferencesFromStorage(
  logger: EndpointLogger,
): ChatUIPreferences {
  const stored = debouncedStorage.getItem(STORAGE_KEYS.UI_PREFERENCES);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Partial<ChatUIPreferences>;
      return { ...DEFAULT_UI_PREFERENCES, ...parsed };
    } catch (error) {
      logger.error("app.chat.storage.parsePreferencesFailed", error);
    }
  }
  return DEFAULT_UI_PREFERENCES;
}

/**
 * Save UI preferences to localStorage with debouncing
 */
function saveUIPreferencesToStorage(preferences: ChatUIPreferences): void {
  debouncedStorage.setItemJSON(STORAGE_KEYS.UI_PREFERENCES, preferences);
}
