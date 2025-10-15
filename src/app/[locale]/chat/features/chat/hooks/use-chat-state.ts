import { useCallback, useEffect, useState } from "react";

import { debouncedStorage } from "../../../lib/storage/debounced-storage";
import { quickSearchThreads } from "../../../lib/storage/search";
import {
  addFolderToState,
  addThreadToState,
  autoUpdateThreadTitle,
  createFolder,
  createInitialChatState,
  createThread,
  deleteFolderFromState,
  deleteThreadFromState,
  getThreadsInFolder,
  moveThreadToFolder,
  updateThreadInState,
} from "../../../lib/storage/thread-manager";
import type {
  ChatFolder,
  ChatState,
  ChatThread,
  ChatUIPreferences,
  ViewMode,
} from "../../../lib/storage/types";
import { STORAGE_KEYS } from "../../../lib/storage/types";

/**
 * Chat state constants
 */
const CHAT_STATE_CONSTANTS = {
  /** Default name for the general folder */
  GENERAL_FOLDER_NAME: "Private Chats",

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
export function useChatState() {
  const [state, setState] = useState<ChatState>(() => {
    if (typeof window === "undefined") {
      return createInitialChatState();
    }
    return loadStateFromStorage();
  });

  const [uiPreferences, setUIPreferences] = useState<ChatUIPreferences>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_UI_PREFERENCES;
    }
    return loadUIPreferencesFromStorage();
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

    const handleStorageChange = (e: StorageEvent) => {
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
          console.error("Failed to sync chat state from other tab:", error);
        }
      }

      // Handle UI preferences changes
      if (e.key === STORAGE_KEYS.UI_PREFERENCES && e.newValue) {
        try {
          const newPreferences = JSON.parse(e.newValue) as ChatUIPreferences;
          setUIPreferences((prev) => ({ ...prev, ...newPreferences }));
        } catch (error) {
          console.error("Failed to sync UI preferences from other tab:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Thread operations
  const createNewThread = useCallback((folderId?: string | null): string => {
    let newThreadId = "";

    setState((prev) => {
      // Check if current active thread is empty (no messages at all)
      const currentThread = prev.activeThreadId
        ? prev.threads[prev.activeThreadId]
        : null;

      let stateAfterCleanup = prev;

      if (currentThread) {
        const messages = Object.values(currentThread.messages);

        // If current thread is completely empty, delete it
        if (messages.length === 0) {
          stateAfterCleanup = deleteThreadFromState(prev, currentThread.id);
        }
      }

      // Ensure thread always has a folder - use General if not specified
      const generalFolder = Object.values(stateAfterCleanup.folders).find(
        (f) => f.id === "folder-general",
      );
      const targetFolderId = folderId || generalFolder?.id || null;

      const newThread = createThread({ folderId: targetFolderId });
      newThreadId = newThread.id;

      const updated = addThreadToState(stateAfterCleanup, newThread);
      return {
        ...updated,
        activeThreadId: newThread.id,
      };
    });

    return newThreadId;
  }, []);

  const updateThread = useCallback(
    (
      threadId: string,
      updates: Partial<ChatThread> | ((prev: ChatThread) => ChatThread),
    ) => {
      setState((prevState) => {
        const existingThread = prevState.threads[threadId];
        if (!existingThread) {
          console.warn(`Thread ${threadId} not found, skipping update`);
          return prevState;
        }

        // Support functional updates for race condition prevention
        const updatedThread =
          typeof updates === "function"
            ? updates(existingThread)
            : { ...existingThread, ...updates, updatedAt: Date.now() };

        return updateThreadInState(prevState, threadId, updatedThread);
      });
    },
    [],
  );

  const deleteThread = useCallback((threadId: string) => {
    setState((prev) => deleteThreadFromState(prev, threadId));
  }, []);

  const setActiveThread = useCallback((threadId: string | null) => {
    setState((prev) => ({
      ...prev,
      activeThreadId: threadId,
    }));
  }, []);

  const moveThread = useCallback(
    (threadId: string, folderId: string | null) => {
      setState((prev) => moveThreadToFolder(prev, threadId, folderId));
    },
    [],
  );

  const updateThreadTitle = useCallback((threadId: string) => {
    setState((prev) => autoUpdateThreadTitle(prev, threadId));
  }, []);

  // Folder operations
  const createNewFolder = useCallback(
    (name: string, parentId?: string | null): string => {
      const newFolder = createFolder({
        name,
        parentId: parentId || null,
      });
      setState((prev) => addFolderToState(prev, newFolder));
      return newFolder.id;
    },
    [],
  );

  const updateFolder = useCallback(
    (folderId: string, updates: Partial<ChatFolder>) => {
      setState((prev) => ({
        ...prev,
        folders: {
          ...prev.folders,
          [folderId]: {
            ...prev.folders[folderId],
            ...updates,
            updatedAt: Date.now(),
          },
        },
        lastUpdated: Date.now(),
      }));
    },
    [],
  );

  const deleteFolder = useCallback(
    (folderId: string, deleteThreads = false) => {
      setState((prev) => {
        const folder = prev.folders[folderId];

        // Special handling for General folder - empty it and restore default
        if (folder && folder.id === "folder-general") {
          // Move all threads out of General folder
          const threadsInFolder = Object.values(prev.threads).filter(
            (t) => t.folderId === folderId,
          );

          let newState = { ...prev };

          // Delete all threads in General folder
          threadsInFolder.forEach((thread) => {
            newState = deleteThreadFromState(newState, thread.id);
          });

          // Restore General folder to default
          newState.folders[folderId] = {
            ...newState.folders[folderId],
            name: CHAT_STATE_CONSTANTS.GENERAL_FOLDER_NAME,
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
    const initialState = createInitialChatState();
    setState(initialState);
    setUIPreferences(DEFAULT_UI_PREFERENCES);
  }, []);

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

    // UI preferences
    updateUIPreferences,
    toggleSidebar,
    setViewMode,

    // Utilities
    getActiveThread,
    getThreadsInFolderById,
    searchThreads,
    resetState,
  };
}

/**
 * Load state from localStorage
 * Uses direct localStorage access (not debounced) for initial load
 */
function loadStateFromStorage(): ChatState {
  const stored = debouncedStorage.getItem(STORAGE_KEYS.CHAT_STATE);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as ChatState;
      // Validate version and migrate if needed
      if (parsed.version === 2) {
        return parsed;
      }
    } catch (error) {
      console.error("Failed to parse chat state:", error);
    }
  }
  return createInitialChatState();
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
function loadUIPreferencesFromStorage(): ChatUIPreferences {
  const stored = debouncedStorage.getItem(STORAGE_KEYS.UI_PREFERENCES);
  if (stored) {
    try {
      return { ...DEFAULT_UI_PREFERENCES, ...JSON.parse(stored) };
    } catch (error) {
      console.error("Failed to parse UI preferences:", error);
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
