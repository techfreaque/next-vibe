/**
 * Incognito Storage Adapter
 * Handles storage operations for incognito mode
 * All data stays in browser, never sent to server
 */

"use client";

import { storage } from "next-vibe-ui/lib/storage";

import type { DefaultFolderId } from "../config";
import type { ChatFolder, ChatMessage, ChatThread } from "../db";
import { ThreadStatus } from "../enum";

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
 * Get item from storage with error handling
 */
async function getItem<T>(key: string, defaultValue: T): Promise<T> {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const item = await storage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    // Silent fail - return default value
    return defaultValue;
  }
}

/**
 * Set item in storage with error handling
 */
async function setItem<T>(key: string, value: T): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await storage.setItem(key, JSON.stringify(value));
  } catch {
    // Silent fail - storage might be full or disabled
  }
}

/**
 * Load all incognito state from storage
 */
export async function loadIncognitoState(): Promise<IncognitoState> {
  return {
    threads: await getItem(STORAGE_KEYS.THREADS, {}),
    messages: await getItem(STORAGE_KEYS.MESSAGES, {}),
    folders: await getItem(STORAGE_KEYS.FOLDERS, {}),
    activeThreadId: await getItem(STORAGE_KEYS.ACTIVE_THREAD, null),
    currentRootFolderId: await getItem(
      STORAGE_KEYS.CURRENT_ROOT_FOLDER,
      "incognito",
    ),
    currentSubFolderId: await getItem(STORAGE_KEYS.CURRENT_SUB_FOLDER, null),
  };
}

/**
 * Save thread to storage
 */
export async function saveThread(thread: ChatThread): Promise<void> {
  const threads = await getItem<Record<string, ChatThread>>(
    STORAGE_KEYS.THREADS,
    {},
  );
  threads[thread.id] = thread;
  await setItem(STORAGE_KEYS.THREADS, threads);
}

/**
 * Message save queue to prevent race conditions
 */
let messageSaveQueue: Promise<void> = Promise.resolve();

/**
 * Save message to storage
 * Uses a queue to prevent concurrent writes from causing race conditions
 */
export async function saveMessage(message: ChatMessage): Promise<void> {
  // Chain this save operation after the previous one completes
  messageSaveQueue = messageSaveQueue.then(async () => {
    const messages = await getItem<Record<string, ChatMessage>>(
      STORAGE_KEYS.MESSAGES,
      {},
    );
    messages[message.id] = message;
    await setItem(STORAGE_KEYS.MESSAGES, messages);
    return undefined;
  });

  // Wait for this operation to complete
  await messageSaveQueue;
}

/**
 * Save folder to storage
 */
export async function saveFolder(folder: ChatFolder): Promise<void> {
  const folders = await getItem<Record<string, ChatFolder>>(
    STORAGE_KEYS.FOLDERS,
    {},
  );
  folders[folder.id] = folder;
  await setItem(STORAGE_KEYS.FOLDERS, folders);
}

/**
 * Delete thread from storage
 */
export async function deleteThread(threadId: string): Promise<void> {
  const threads = await getItem<Record<string, ChatThread>>(
    STORAGE_KEYS.THREADS,
    {},
  );
  delete threads[threadId];
  await setItem(STORAGE_KEYS.THREADS, threads);

  // Also delete all messages in this thread
  const messages = await getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
  );
  const updatedMessages = Object.fromEntries(
    Object.entries(messages).filter(([, msg]) => msg.threadId !== threadId),
  );
  await setItem(STORAGE_KEYS.MESSAGES, updatedMessages);
}

/**
 * Delete message from storage
 */
export async function deleteMessage(messageId: string): Promise<void> {
  const messages = await getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
  );
  delete messages[messageId];
  await setItem(STORAGE_KEYS.MESSAGES, messages);
}

/**
 * Delete folder from storage
 * Also deletes all threads and messages inside the folder
 */
export async function deleteFolder(folderId: string): Promise<void> {
  const folders = await getItem<Record<string, ChatFolder>>(
    STORAGE_KEYS.FOLDERS,
    {},
  );
  delete folders[folderId];
  await setItem(STORAGE_KEYS.FOLDERS, folders);

  // Delete all threads in this folder
  const threads = await getItem<Record<string, ChatThread>>(
    STORAGE_KEYS.THREADS,
    {},
  );
  const threadsToDelete = Object.entries(threads)
    .filter(([, thread]) => thread.folderId === folderId)
    .map(([threadId]) => threadId);

  // Delete each thread (which will also delete its messages)
  for (const threadId of threadsToDelete) {
    await deleteThread(threadId);
  }
}

/**
 * Set active thread
 */
export async function setActiveThread(threadId: string | null): Promise<void> {
  await setItem(STORAGE_KEYS.ACTIVE_THREAD, threadId);
}

/**
 * Set current folder
 */
export async function setCurrentFolder(
  rootFolderId: DefaultFolderId,
  subFolderId: string | null,
): Promise<void> {
  await setItem(STORAGE_KEYS.CURRENT_ROOT_FOLDER, rootFolderId);
  await setItem(STORAGE_KEYS.CURRENT_SUB_FOLDER, subFolderId);
}

/**
 * Get threads for a specific folder
 */
export async function getThreadsForFolder(
  rootFolderId: DefaultFolderId,
  subFolderId: string | null,
): Promise<ChatThread[]> {
  const threads = await getItem<Record<string, ChatThread>>(
    STORAGE_KEYS.THREADS,
    {},
  );

  return Object.values(threads).filter(
    (thread) =>
      thread.rootFolderId === rootFolderId && thread.folderId === subFolderId,
  );
}

/**
 * Parse message from storage - convert string dates to Date objects
 */
function parseMessage(message: ChatMessage): ChatMessage {
  return {
    ...message,
    createdAt:
      typeof message.createdAt === "string"
        ? new Date(message.createdAt)
        : message.createdAt,
    updatedAt:
      typeof message.updatedAt === "string"
        ? new Date(message.updatedAt)
        : message.updatedAt,
  };
}

/**
 * Get messages for a specific thread
 */
export async function getMessagesForThread(
  threadId: string,
): Promise<ChatMessage[]> {
  const messages = await getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
  );

  return Object.values(messages)
    .filter((msg) => msg.threadId === threadId)
    .map(parseMessage) // Parse dates
    .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

/**
 * Clear all incognito data
 */
export async function clearIncognitoData(): Promise<void> {
  if (typeof window !== "undefined") {
    for (const key of Object.values(STORAGE_KEYS)) {
      await storage.removeItem(key);
    }
    // Files are stored in message metadata and cleared with messages
  }
}

/**
 * Generate unique ID for incognito mode
 */
export function generateIncognitoId(): string {
  // Generate a valid UUID for compatibility with server validation
  // The prefix is not used anymore since we need proper UUIDs
  return crypto.randomUUID();
}

/**
 * Create new thread in incognito mode
 */
export async function createIncognitoThread(
  title: string,
  rootFolderId: DefaultFolderId,
  subFolderId: string | null,
): Promise<ChatThread> {
  const thread: ChatThread = {
    id: generateIncognitoId(),
    userId: "incognito",
    leadId: null,
    title,
    rootFolderId: rootFolderId,
    folderId: subFolderId,
    status: ThreadStatus.ACTIVE,
    defaultModel: null,
    defaultCharacter: null,
    systemPrompt: null,
    pinned: false,
    archived: false,
    tags: [],
    preview: null,
    metadata: {},
    rolesView: null,
    rolesEdit: null,
    rolesPost: null,
    rolesModerate: null,
    rolesAdmin: null,
    published: false,
    canPost: true,
    canEdit: true,
    canModerate: true,
    canDelete: true,
    canManagePermissions: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    searchVector: null,
  };

  await saveThread(thread);
  return thread;
}

/**
 * Create new message in incognito mode
 */
export async function createIncognitoMessage(
  threadId: string,
  role: ChatMessage["role"],
  content: string,
  parentId: string | null = null,
  model: ChatMessage["model"] = null,
  character: string | null = null,
  metadata: ChatMessage["metadata"] = {},
): Promise<ChatMessage> {
  const message: ChatMessage = {
    id: generateIncognitoId(),
    threadId,
    role,
    content,
    parentId,
    depth: 0,
    sequenceId: null,
    authorId: "incognito",
    authorName: null,
    authorAvatar: null,
    authorColor: null,
    isAI: role === "assistant",
    model,
    character,
    errorType: null,
    errorMessage: null,
    errorCode: null,
    edited: false,
    originalId: null,
    tokens: null,
    metadata,
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    searchVector: null,
  };

  await saveMessage(message);
  return message;
}

/**
 * Update thread in incognito mode
 */
export async function updateIncognitoThread(
  threadId: string,
  updates: Partial<ChatThread>,
): Promise<void> {
  const threads = await getItem<Record<string, ChatThread>>(
    STORAGE_KEYS.THREADS,
    {},
  );
  const thread = threads[threadId];

  if (thread) {
    threads[threadId] = {
      ...thread,
      ...updates,
      updatedAt: new Date(),
    };
    await setItem(STORAGE_KEYS.THREADS, threads);
  }
}

/**
 * Update message in incognito mode
 */
export async function updateIncognitoMessage(
  messageId: string,
  updates: Partial<ChatMessage>,
): Promise<void> {
  const messages = await getItem<Record<string, ChatMessage>>(
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
    await setItem(STORAGE_KEYS.MESSAGES, messages);
  }
}
