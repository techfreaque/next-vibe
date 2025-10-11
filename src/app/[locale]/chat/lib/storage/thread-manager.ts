import type {
  ChatState,
  ChatThread,
  NewThreadInput,
  ChatFolder,
  NewFolderInput,
} from "./types";
import { DEFAULT_FOLDERS } from "./types";
import { generateThreadTitle } from "./message-tree";
import { defaultModel } from "../config/models";

/**
 * Generate a unique ID with a given prefix
 */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
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
export function createThread(input?: Partial<NewThreadInput>): ChatThread {
  const threadId = input?.id || generateThreadId();
  const now = Date.now();

  const thread: ChatThread = {
    id: threadId,
    title: input?.title || "New Chat",
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
      defaultModel: (input?.settings?.defaultModel) ?? defaultModel,
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
export function createInitialChatState(): ChatState {
  const generalFolder = createFolder({
    id: DEFAULT_FOLDERS.GENERAL,
    name: "Private Chats",
    parentId: null,
    icon: "folder",
  });

  const initialThread = createThread({
    folderId: DEFAULT_FOLDERS.GENERAL,
  });

  return {
    threads: {
      [initialThread.id]: initialThread,
    },
    folders: {
      [generalFolder.id]: generalFolder,
    },
    activeThreadId: initialThread.id,
    rootFolderIds: [DEFAULT_FOLDERS.GENERAL],
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
    newActiveThreadId = remainingThreadIds.length > 0 ? remainingThreadIds[0] : null;
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
  const updatedState = { ...state };
  updatedState.folders = {
    ...state.folders,
    [folder.id]: folder,
  };

  // Add to root folders if no parent
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
  deleteThreads: boolean = false,
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

