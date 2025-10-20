import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ID_GENERATION } from "../config/constants";
import { defaultModel } from "../config/models";
import { generateThreadTitle } from "./message-tree";
import type {
  ChatFolder,
  ChatState,
  ChatThread,
  NewFolderInput,
  NewThreadInput,
} from "./types";
import {
  DEFAULT_FOLDER_CONFIGS,
  DEFAULT_FOLDERS,
  isDefaultFolder,
} from "./types";

/**
 * Generate a unique ID with a given prefix
 */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(ID_GENERATION.RANDOM_BASE).substring(ID_GENERATION.RANDOM_SUBSTRING_START, ID_GENERATION.RANDOM_SUBSTRING_END)}`;
}

/**
 * Generate a unique ID for threads
 */
export function generateThreadId(): string {
  return generateId("thread");
}

/**
 * Generate a unique ID for folders
 */
export function generateFolderId(): string {
  return generateId("folder");
}

/**
 * Create a new thread without any initial messages
 */
export function createThread(
  locale: CountryLanguage,
  input?: Partial<NewThreadInput>,
): ChatThread {
  const threadId = input?.id || generateThreadId();
  const now = Date.now();
  const { t } = simpleT(locale);

  const thread: ChatThread = {
    id: threadId,
    title: input?.title || t("app.chat.common.newChat"),
    folderId: input?.folderId || null,
    createdAt: input?.createdAt || now,
    updatedAt: input?.updatedAt || now,
    messages: {},
    rootMessageId: null,
    currentPath: {
      messageIds: [],
      branchIndices: {},
    },
    settings: {
      ...input?.settings,
      // Ensure default model is always set for provider icon and API mapping
      defaultModel: input?.settings?.defaultModel ?? defaultModel,
    },
    metadata: input?.metadata,
  };

  return thread;
}

/**
 * Create a new folder
 */
export function createFolder(input: NewFolderInput): ChatFolder {
  const now = Date.now();

  return {
    id: input.id || generateFolderId(),
    name: input.name,
    icon: input.icon || "folder",
    parentId: input.parentId,
    childrenIds: input.childrenIds || [],
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now,
  };
}

/**
 * Create initial chat state with default folders
 */
export function createInitialChatState(locale: CountryLanguage): ChatState {
  const { t } = simpleT(locale);

  // Create default folders from centralized config
  const folders: Record<string, ChatFolder> = {};
  const rootFolderIds: string[] = [];

  for (const config of DEFAULT_FOLDER_CONFIGS) {
    const folder = createFolder({
      id: config.id,
      name: t(config.translationKey),
      translationKey: config.translationKey,
      isUserCustomized: false,
      parentId: null,
      icon: config.icon,
      expanded: true,
    });
    folders[config.id] = folder;
    rootFolderIds.push(config.id);
  }

  const initialThread = createThread(locale, {
    folderId: DEFAULT_FOLDERS.PRIVATE,
  });

  return {
    threads: {
      [initialThread.id]: initialThread,
    },
    folders,
    activeThreadId: initialThread.id,
    rootFolderIds,
    unfiledThreadIds: [],
    lastUpdated: Date.now(),
    version: 2,
  };
}

/**
 * Add a thread to the state
 */
export function addThreadToState(
  state: ChatState,
  thread: ChatThread,
): ChatState {
  const updatedState = { ...state };
  updatedState.threads = {
    ...state.threads,
    [thread.id]: thread,
  };

  // Add to folder or unfiled list
  if (thread.folderId) {
    // Folder will be updated separately if needed
  } else {
    if (!updatedState.unfiledThreadIds.includes(thread.id)) {
      updatedState.unfiledThreadIds = [...state.unfiledThreadIds, thread.id];
    }
  }

  updatedState.lastUpdated = Date.now();
  return updatedState;
}

/**
 * Update a thread in the state
 */
export function updateThreadInState(
  state: ChatState,
  threadId: string,
  updates: Partial<ChatThread>,
): ChatState {
  const existingThread = state.threads[threadId];
  if (!existingThread) {
    return state;
  }

  const updatedThread = {
    ...existingThread,
    ...updates,
    updatedAt: Date.now(),
  };

  return {
    ...state,
    threads: {
      ...state.threads,
      [threadId]: updatedThread,
    },
    lastUpdated: Date.now(),
  };
}

/**
 * Delete a thread from the state
 */
export function deleteThreadFromState(
  state: ChatState,
  threadId: string,
): ChatState {
  const thread = state.threads[threadId];
  if (!thread) {
    return state;
  }

  const updatedThreads = { ...state.threads };
  delete updatedThreads[threadId];

  // Remove from unfiled list
  const updatedUnfiledIds = state.unfiledThreadIds.filter(
    (id) => id !== threadId,
  );

  // Update active thread if needed
  let newActiveThreadId = state.activeThreadId;
  if (state.activeThreadId === threadId) {
    const remainingThreadIds = Object.keys(updatedThreads);
    newActiveThreadId =
      remainingThreadIds.length > 0 ? remainingThreadIds[0] : null;
  }

  return {
    ...state,
    threads: updatedThreads,
    unfiledThreadIds: updatedUnfiledIds,
    activeThreadId: newActiveThreadId,
    lastUpdated: Date.now(),
  };
}

/**
 * Move a thread to a different folder
 */
export function moveThreadToFolder(
  state: ChatState,
  threadId: string,
  folderId: string | null,
): ChatState {
  const thread = state.threads[threadId];
  if (!thread) {
    return state;
  }

  const updatedThread = {
    ...thread,
    folderId,
    updatedAt: Date.now(),
  };

  let updatedUnfiledIds = [...state.unfiledThreadIds];

  // Remove from unfiled if moving to a folder
  if (folderId !== null) {
    updatedUnfiledIds = updatedUnfiledIds.filter((id) => id !== threadId);
  } else {
    // Add to unfiled if moving out of a folder
    if (!updatedUnfiledIds.includes(threadId)) {
      updatedUnfiledIds.push(threadId);
    }
  }

  return {
    ...state,
    threads: {
      ...state.threads,
      [threadId]: updatedThread,
    },
    unfiledThreadIds: updatedUnfiledIds,
    lastUpdated: Date.now(),
  };
}

/**
 * Add a folder to the state
 */
export function addFolderToState(
  state: ChatState,
  folder: ChatFolder,
): ChatState {
  // Validate: Only default folders can be at root level (parentId === null)
  if (!folder.parentId && !isDefaultFolder(folder.id)) {
    // eslint-disable-next-line no-console -- Validation error
    console.error(
      // eslint-disable-next-line i18next/no-literal-string -- Error message
      "Cannot add non-default folder at root level. Folder must have a parent.",
      folder,
    );
    return state; // Return unchanged state
  }

  const updatedState = { ...state };
  updatedState.folders = {
    ...state.folders,
    [folder.id]: folder,
  };

  // Add to root folders if no parent (only for default folders)
  if (!folder.parentId && !updatedState.rootFolderIds.includes(folder.id)) {
    updatedState.rootFolderIds = [...state.rootFolderIds, folder.id];
  }

  // Add to parent's children if has parent
  if (folder.parentId && updatedState.folders[folder.parentId]) {
    const parent = updatedState.folders[folder.parentId];
    if (!parent.childrenIds.includes(folder.id)) {
      updatedState.folders[folder.parentId] = {
        ...parent,
        childrenIds: [...parent.childrenIds, folder.id],
      };
    }
  }

  updatedState.lastUpdated = Date.now();
  return updatedState;
}

/**
 * Delete a folder and optionally its threads
 */
export function deleteFolderFromState(
  state: ChatState,
  folderId: string,
  deleteThreads = false,
): ChatState {
  const folder = state.folders[folderId];
  if (!folder) {
    return state;
  }

  let updatedState = { ...state };

  // Handle threads in this folder
  const threadsInFolder = Object.values(state.threads).filter(
    (t) => t.folderId === folderId,
  );

  if (deleteThreads) {
    // Delete all threads in folder
    threadsInFolder.forEach((thread) => {
      updatedState = deleteThreadFromState(updatedState, thread.id);
    });
  } else {
    // Move threads to unfiled
    threadsInFolder.forEach((thread) => {
      updatedState = moveThreadToFolder(updatedState, thread.id, null);
    });
  }

  // Remove folder
  const updatedFolders = { ...updatedState.folders };
  delete updatedFolders[folderId];

  // Remove from parent's children or root folders
  if (folder.parentId && updatedFolders[folder.parentId]) {
    const parent = updatedFolders[folder.parentId];
    updatedFolders[folder.parentId] = {
      ...parent,
      childrenIds: parent.childrenIds.filter((id) => id !== folderId),
    };
  } else {
    updatedState.rootFolderIds = updatedState.rootFolderIds.filter(
      (id) => id !== folderId,
    );
  }

  return {
    ...updatedState,
    folders: updatedFolders,
    lastUpdated: Date.now(),
  };
}

/**
 * Get all threads in a folder
 */
export function getThreadsInFolder(
  state: ChatState,
  folderId: string | null,
): ChatThread[] {
  return Object.values(state.threads)
    .filter((thread) => thread.folderId === folderId)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Auto-update thread title based on first message
 */
export function autoUpdateThreadTitle(
  state: ChatState,
  threadId: string,
): ChatState {
  const thread = state.threads[threadId];
  if (!thread) {
    return state;
  }

  const newTitle = generateThreadTitle(thread);

  return updateThreadInState(state, threadId, {
    title: newTitle,
  });
}

/**
 * Ensure all default folders exist in the state
 * This function guarantees that the 4 default folders are always present
 */
export function ensureDefaultFolders(
  state: ChatState,
  locale: CountryLanguage,
): ChatState {
  const { t } = simpleT(locale);
  let updatedState = { ...state };
  let needsUpdate = false;

  // Check each default folder

  // Use centralized default folder configs
  for (const config of DEFAULT_FOLDER_CONFIGS) {
    if (!updatedState.folders[config.id]) {
      // Folder doesn't exist, create it
      const newFolder = createFolder({
        id: config.id,
        name: t(config.translationKey),
        translationKey: config.translationKey,
        isUserCustomized: false,
        parentId: null,
        icon: config.icon,
        expanded: true,
      });

      updatedState.folders[config.id] = newFolder;

      // Add to root folders if not already there
      if (!updatedState.rootFolderIds.includes(config.id)) {
        updatedState.rootFolderIds = [...updatedState.rootFolderIds, config.id];
      }

      needsUpdate = true;
    }
  }

  if (needsUpdate) {
    updatedState.lastUpdated = Date.now();
  }

  return updatedState;
}

/**
 * Get the display name for a folder
 * For default folders, always use the translation key from DEFAULT_FOLDER_CONFIGS
 * For custom folders, if user has customized the name, use stored name
 * Otherwise, translate the translation key if available
 */
export function getFolderDisplayName(
  folder: ChatFolder,
  locale: CountryLanguage,
): string {
  const { t } = simpleT(locale);

  // For default folders, always use the translation key from config
  // This ensures names update when translations change
  if (isDefaultFolder(folder.id)) {
    const config = DEFAULT_FOLDER_CONFIGS.find((c) => c.id === folder.id);
    if (config) {
      return t(config.translationKey);
    }
  }

  // If user has customized the name, always use the stored name
  if (folder.isUserCustomized) {
    return folder.name;
  }

  // If folder has a translation key, translate it
  if (folder.translationKey) {
    return t(folder.translationKey);
  }

  // Fallback to stored name
  return folder.name;
}
