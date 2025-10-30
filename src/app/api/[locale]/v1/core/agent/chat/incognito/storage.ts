/**
 * Incognito Storage Adapter
 * Handles localStorage operations for incognito mode
 * All data stays in browser, never sent to server
 */

"use client";

import type { DefaultFolderId } from "../config";
import type { ChatFolder, ChatMessage, ChatThread } from "../store";

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  THREADS: "incognito_threads",
  MESSAGES: "incognito_messages",
  FOLDERS: "incognito_folders",
  ACTIVE_THREAD: "incognito_active_thread",
  CURRENT_ROOT_FOLDER: "incognito_current_root_folder",
  CURRENT_SUB_FOLDER: "incognito_current_sub_folder",
} as const;

/**
 * Incognito storage state
 */
export interface IncognitoState {
  threads: Record<string, ChatThread>;
  messages: Record<string, ChatMessage>;
  folders: Record<string, ChatFolder>;
  activeThreadId: string | null;
  currentRootFolderId: string;
  currentSubFolderId: string | null;
}

/**
 * Get item from localStorage with error handling
 */
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    // Silent fail - return default value
    return defaultValue;
  }
}

/**
 * Set item in localStorage with error handling
 */
function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silent fail - localStorage might be full or disabled
  }
}

/**
 * Load all incognito state from localStorage
 */
export function loadIncognitoState(): IncognitoState {
  return {
    threads: getItem(STORAGE_KEYS.THREADS, {}),
    messages: getItem(STORAGE_KEYS.MESSAGES, {}),
    folders: getItem(STORAGE_KEYS.FOLDERS, {}),
    activeThreadId: getItem(STORAGE_KEYS.ACTIVE_THREAD, null),
    currentRootFolderId: getItem(STORAGE_KEYS.CURRENT_ROOT_FOLDER, "incognito"),
    currentSubFolderId: getItem(STORAGE_KEYS.CURRENT_SUB_FOLDER, null),
  };
}

/**
 * Save thread to localStorage
 */
export function saveThread(thread: ChatThread): void {
  const threads = getItem<Record<string, ChatThread>>(STORAGE_KEYS.THREADS, {});
  threads[thread.id] = thread;
  setItem(STORAGE_KEYS.THREADS, threads);
}

/**
 * Save message to localStorage
 */
export function saveMessage(message: ChatMessage): void {
  const messages = getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
  );
  messages[message.id] = message;
  setItem(STORAGE_KEYS.MESSAGES, messages);
}

/**
 * Save folder to localStorage
 */
export function saveFolder(folder: ChatFolder): void {
  const folders = getItem<Record<string, ChatFolder>>(STORAGE_KEYS.FOLDERS, {});
  folders[folder.id] = folder;
  setItem(STORAGE_KEYS.FOLDERS, folders);
}

/**
 * Delete thread from localStorage
 */
export function deleteThread(threadId: string): void {
  const threads = getItem<Record<string, ChatThread>>(STORAGE_KEYS.THREADS, {});
  delete threads[threadId];
  setItem(STORAGE_KEYS.THREADS, threads);

  // Also delete all messages in this thread
  const messages = getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
  );
  const updatedMessages = Object.fromEntries(
    Object.entries(messages).filter(([, msg]) => msg.threadId !== threadId),
  );
  setItem(STORAGE_KEYS.MESSAGES, updatedMessages);
}

/**
 * Delete message from localStorage
 */
export function deleteMessage(messageId: string): void {
  const messages = getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
  );
  delete messages[messageId];
  setItem(STORAGE_KEYS.MESSAGES, messages);
}

/**
 * Delete folder from localStorage
 */
export function deleteFolder(folderId: string): void {
  const folders = getItem<Record<string, ChatFolder>>(STORAGE_KEYS.FOLDERS, {});
  delete folders[folderId];
  setItem(STORAGE_KEYS.FOLDERS, folders);
}

/**
 * Set active thread
 */
export function setActiveThread(threadId: string | null): void {
  setItem(STORAGE_KEYS.ACTIVE_THREAD, threadId);
}

/**
 * Set current folder
 */
export function setCurrentFolder(
  rootFolderId: string,
  subFolderId: string | null,
): void {
  setItem(STORAGE_KEYS.CURRENT_ROOT_FOLDER, rootFolderId);
  setItem(STORAGE_KEYS.CURRENT_SUB_FOLDER, subFolderId);
}

/**
 * Get threads for a specific folder
 */
export function getThreadsForFolder(
  rootFolderId: string,
  subFolderId: string | null,
): ChatThread[] {
  const threads = getItem<Record<string, ChatThread>>(STORAGE_KEYS.THREADS, {});

  return Object.values(threads).filter(
    (thread) =>
      thread.rootFolderId === rootFolderId && thread.folderId === subFolderId,
  );
}

/**
 * Get messages for a specific thread
 */
export function getMessagesForThread(threadId: string): ChatMessage[] {
  const messages = getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
  );

  return Object.values(messages)
    .filter((msg) => msg.threadId === threadId)
    .toSorted((a, b) => {
      // Convert string dates to Date objects if needed
      const aDate =
        typeof a.createdAt === "string" ? new Date(a.createdAt) : a.createdAt;
      const bDate =
        typeof b.createdAt === "string" ? new Date(b.createdAt) : b.createdAt;
      return aDate.getTime() - bDate.getTime();
    });
}

/**
 * Clear all incognito data
 */
export function clearIncognitoData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Generate unique ID for incognito mode
 */
export function generateIncognitoId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create new thread in incognito mode
 */
export function createIncognitoThread(
  title: string,
  rootFolderId: DefaultFolderId,
  subFolderId: string | null,
): ChatThread {
  const thread: ChatThread = {
    id: generateIncognitoId("thread"),
    userId: "incognito", // Special user ID for incognito mode
    title,
    rootFolderId: rootFolderId,
    folderId: subFolderId,
    status: "active",
    defaultModel: null,
    defaultPersona: null,
    systemPrompt: null,
    pinned: false,
    archived: false,
    tags: [],
    preview: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  saveThread(thread);
  return thread;
}

/**
 * Create new message in incognito mode
 */
export function createIncognitoMessage(
  threadId: string,
  role: "user" | "assistant" | "system" | "error",
  content: string,
  parentId: string | null = null,
  model: ChatMessage["model"] = null,
  persona: string | null = null,
): ChatMessage {
  const message: ChatMessage = {
    id: generateIncognitoId("msg"),
    threadId,
    role,
    content,
    parentId,
    depth: 0, // Will be calculated based on parent
    authorId: "incognito",
    authorName: null,
    isAI: role === "assistant",
    model,
    persona,
    errorType: null,
    errorMessage: null,
    edited: false,
    tokens: null,
    upvotes: null,
    downvotes: null,
    sequenceId: null,
    sequenceIndex: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  saveMessage(message);
  return message;
}

/**
 * Update thread in incognito mode
 */
export function updateIncognitoThread(
  threadId: string,
  updates: Partial<ChatThread>,
): void {
  const threads = getItem<Record<string, ChatThread>>(STORAGE_KEYS.THREADS, {});
  const thread = threads[threadId];

  if (thread) {
    threads[threadId] = {
      ...thread,
      ...updates,
      updatedAt: new Date(),
    };
    setItem(STORAGE_KEYS.THREADS, threads);
  }
}

/**
 * Update message in incognito mode
 */
export function updateIncognitoMessage(
  messageId: string,
  updates: Partial<ChatMessage>,
): void {
  const messages = getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
  );
  const message = messages[messageId];

  if (message) {
    messages[messageId] = {
      ...message,
      ...updates,
      updatedAt: new Date(),
    };
    setItem(STORAGE_KEYS.MESSAGES, messages);
  }
}
