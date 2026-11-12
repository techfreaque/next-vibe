/**
 * Incognito Storage Adapter
 * Handles storage operations for incognito mode
 * All data stays in browser, never sent to server
 */

"use client";

import type { DefaultFolderId } from "next-vibe/core/execution-context";
import { storage } from "next-vibe/ui/lib/storage";

import { reportStorageFailure } from "../../../logger/storage-failure";
import type { EndpointLogger } from "../../../logger/types";

import type { ChatFolder, ChatMessage, ChatThread } from "../db";
import {
  ThreadModerationStatus,
  ThreadStatus,
  ThreadStreamingState,
} from "../enum";

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
async function getItem<T>(
  key: string,
  defaultValue: T,
  logger: EndpointLogger,
): Promise<T> {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  // storage.getItem reports its own read failures
  const item = await storage.getItem(key, logger);
  if (!item) {
    return defaultValue;
  }
  try {
    return JSON.parse(item) as T;
  } catch (error) {
    // Corrupt incognito blob: the user's local threads/messages look empty
    reportStorageFailure(logger, {
      platform: "web",
      area: "localStorage",
      operation: "parse",
      key: `incognito:${key}`,
      error: error instanceof Error ? error : String(error),
      valueLength: item.length,
    });
    return defaultValue;
  }
}

/**
 * Set item in storage with error handling
 */
async function setItem<T>(
  key: string,
  value: T,
  logger: EndpointLogger,
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch (error) {
    // Circular/BigInt value - the incognito write is lost
    reportStorageFailure(logger, {
      platform: "web",
      area: "localStorage",
      operation: "set",
      key: `incognito:${key}`,
      error: error instanceof Error ? error : String(error),
    });
    return;
  }
  // storage.setItem reports quota/security failures with the key + size
  await storage.setItem(key, serialized, logger);
}

/**
 * Load all incognito state from storage
 */
export async function loadIncognitoState(
  logger: EndpointLogger,
): Promise<IncognitoState> {
  return {
    threads: await getItem(STORAGE_KEYS.THREADS, {}, logger),
    messages: await getItem(STORAGE_KEYS.MESSAGES, {}, logger),
    folders: await getItem(STORAGE_KEYS.FOLDERS, {}, logger),
    activeThreadId: await getItem(STORAGE_KEYS.ACTIVE_THREAD, null, logger),
    currentRootFolderId: await getItem(
      STORAGE_KEYS.CURRENT_ROOT_FOLDER,
      "incognito",
      logger,
    ),
    currentSubFolderId: await getItem(
      STORAGE_KEYS.CURRENT_SUB_FOLDER,
      null,
      logger,
    ),
  };
}

/**
 * Save thread to storage
 */
export async function saveThread(
  thread: ChatThread,
  logger: EndpointLogger,
): Promise<void> {
  const threads = await getItem<Record<string, ChatThread>>(
    STORAGE_KEYS.THREADS,
    {},
    logger,
  );
  threads[thread.id] = thread;
  await setItem(STORAGE_KEYS.THREADS, threads, logger);
}

/**
 * Message save queue to prevent race conditions
 */
let messageSaveQueue: Promise<void> = Promise.resolve();

/**
 * Save message to storage
 * Uses a queue to prevent concurrent writes from causing race conditions
 */
export async function saveMessage(
  message: ChatMessage,
  logger: EndpointLogger,
): Promise<void> {
  // Never persist optimistic placeholders - they are ephemeral UI state and
  // would show as orphaned branches on reload.
  if (message.metadata?.isOptimistic) {
    return;
  }

  // Chain this save operation after the previous one completes.
  // The catch keeps a failed predecessor from breaking the chain.
  messageSaveQueue = messageSaveQueue
    .catch((error: Error) => {
      logger.warn("[incognito] previous queued message save failed", {
        nextMessageId: message.id,
        threadId: message.threadId,
        errorName: error instanceof Error ? error.name : "UnknownError",
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      return undefined;
    })
    .then(async () => {
      const messages = await getItem<Record<string, ChatMessage>>(
        STORAGE_KEYS.MESSAGES,
        {},
        logger,
      );
      messages[message.id] = message;
      await setItem(STORAGE_KEYS.MESSAGES, messages, logger);
      return undefined;
    });

  // Wait for this operation to complete
  await messageSaveQueue;
}

/**
 * Update folder in incognito mode
 */
export async function updateIncognitoFolder(
  folderId: string,
  updates: Partial<ChatFolder>,
  logger: EndpointLogger,
): Promise<void> {
  const folders = await getItem<Record<string, ChatFolder>>(
    STORAGE_KEYS.FOLDERS,
    {},
    logger,
  );
  const folder = folders[folderId];

  if (folder) {
    folders[folderId] = {
      ...folder,
      ...updates,
      updatedAt: new Date(),
    };
    await setItem(STORAGE_KEYS.FOLDERS, folders, logger);
  }
}

/**
 * Delete thread from storage
 */
export async function deleteThread(
  threadId: string,
  logger: EndpointLogger,
): Promise<void> {
  const threads = await getItem<Record<string, ChatThread>>(
    STORAGE_KEYS.THREADS,
    {},
    logger,
  );
  delete threads[threadId];
  await setItem(STORAGE_KEYS.THREADS, threads, logger);

  // Also delete all messages in this thread
  const messages = await getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
    logger,
  );
  const updatedMessages = Object.fromEntries(
    Object.entries(messages).filter(([, msg]) => msg.threadId !== threadId),
  );
  await setItem(STORAGE_KEYS.MESSAGES, updatedMessages, logger);
}

/**
 * Delete message from storage
 */
export async function deleteMessage(
  messageId: string,
  logger: EndpointLogger,
): Promise<void> {
  const messages = await getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
    logger,
  );
  delete messages[messageId];
  await setItem(STORAGE_KEYS.MESSAGES, messages, logger);
}

/**
 * Delete folder from storage
 * Also deletes all threads and messages inside the folder
 */
export async function deleteFolder(
  folderId: string,
  logger: EndpointLogger,
): Promise<void> {
  const folders = await getItem<Record<string, ChatFolder>>(
    STORAGE_KEYS.FOLDERS,
    {},
    logger,
  );
  delete folders[folderId];
  await setItem(STORAGE_KEYS.FOLDERS, folders, logger);

  // Delete all threads in this folder
  const threads = await getItem<Record<string, ChatThread>>(
    STORAGE_KEYS.THREADS,
    {},
    logger,
  );
  const threadsToDelete = Object.entries(threads)
    .filter(([, thread]) => thread.folderId === folderId)
    .map(([threadId]) => threadId);

  // Delete each thread (which will also delete its messages)
  for (const threadId of threadsToDelete) {
    await deleteThread(threadId, logger);
  }
}

/**
 * Get threads for a specific folder
 */
export async function getThreadsForFolder(
  rootFolderId: DefaultFolderId,
  subFolderId: string | null,
  logger: EndpointLogger,
): Promise<ChatThread[]> {
  const threads = await getItem<Record<string, ChatThread>>(
    STORAGE_KEYS.THREADS,
    {},
    logger,
  );

  return Object.values(threads).filter(
    (thread) =>
      thread.rootFolderId === rootFolderId && thread.folderId === subFolderId,
  );
}

/**
 * Get all folders for a specific root folder
 */
export async function getFoldersForRoot(
  rootFolderId: DefaultFolderId,
  logger: EndpointLogger,
): Promise<ChatFolder[]> {
  const folders = await getItem<Record<string, ChatFolder>>(
    STORAGE_KEYS.FOLDERS,
    {},
    logger,
  );

  return Object.values(folders).filter(
    (folder) => folder.rootFolderId === rootFolderId,
  );
}

/**
 * Parse message from storage - convert string dates to Date objects and
 * sanitize any stale object-typed fields from old storage formats.
 */
function parseMessage(message: ChatMessage): ChatMessage {
  const now = new Date();
  const rawCreatedAt = message.createdAt as Date | string | number | null;
  const rawUpdatedAt = message.updatedAt as Date | string | number | null;
  const createdAt =
    rawCreatedAt instanceof Date
      ? rawCreatedAt
      : typeof rawCreatedAt === "string" && rawCreatedAt.length > 0
        ? new Date(rawCreatedAt)
        : typeof rawCreatedAt === "number"
          ? new Date(rawCreatedAt)
          : now;
  const updatedAt =
    rawUpdatedAt instanceof Date
      ? rawUpdatedAt
      : typeof rawUpdatedAt === "string" && rawUpdatedAt.length > 0
        ? new Date(rawUpdatedAt)
        : typeof rawUpdatedAt === "number"
          ? new Date(rawUpdatedAt)
          : now;
  const rawContent = message.content as string | Record<string, string> | null;
  const rawErrorMessage = message.errorMessage as
    | string
    | Record<string, string>
    | null;
  return {
    ...message,
    createdAt,
    updatedAt,
    content:
      rawContent === null || typeof rawContent === "string"
        ? rawContent
        : JSON.stringify(rawContent),
    errorMessage:
      rawErrorMessage === null || typeof rawErrorMessage === "string"
        ? rawErrorMessage
        : JSON.stringify(rawErrorMessage),
  };
}

/**
 * Get a single incognito thread by ID
 */
export async function getIncognitoThread(
  threadId: string,
  logger: EndpointLogger,
): Promise<ChatThread | null> {
  const threads = await getItem<Record<string, ChatThread>>(
    STORAGE_KEYS.THREADS,
    {},
    logger,
  );
  return threads[threadId] ?? null;
}

/**
 * Get messages for a specific thread
 */
export async function getMessagesForThread(
  threadId: string,
  logger: EndpointLogger,
): Promise<ChatMessage[]> {
  const messages = await getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
    logger,
  );

  return Object.values(messages)
    .filter((msg) => msg.threadId === threadId)
    .map(parseMessage) // Parse dates
    .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

/**
 * Create new thread in incognito mode
 */
export async function createIncognitoThread(
  title: string,
  rootFolderId: DefaultFolderId,
  subFolderId: string | null,
  threadId: string,
  logger: EndpointLogger,
): Promise<ChatThread> {
  const thread: ChatThread = {
    id: threadId,
    userId: "incognito",
    leadId: null,
    title,
    originInstanceId: null,
    loopInstanceId: null,
    // Incognito never syncs — no server rows, viewer-local only.
    syncEligible: false,
    // Client-created incognito threads are top-level (no sub-stream lineage).
    parentThreadId: null,
    rootFolderId: rootFolderId,
    folderId: subFolderId,
    status: ThreadStatus.ACTIVE,
    defaultModel: null,
    defaultSkill: null,
    systemPrompt: null,
    pinned: false,
    archived: false,
    tags: [],
    description: null,
    rolesView: null,
    rolesEdit: null,
    rolesPost: null,
    rolesModerate: null,
    rolesAdmin: null,
    published: false,
    moderationStatus: ThreadModerationStatus.VISIBLE,
    reportCount: 0,
    streamingState: ThreadStreamingState.IDLE,
    // Incognito threads never claim a streaming run (viewer-local, no revival).
    streamingRunId: null,
    sortOrder: 0,
    canPost: true,
    canEdit: true,
    canModerate: true,
    canDelete: true,
    canManagePermissions: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    searchVector: null,
  };

  await saveThread(thread, logger);
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
  userMessageId: string,
  logger: EndpointLogger,
): Promise<ChatMessage> {
  const message: ChatMessage = {
    id: userMessageId,
    threadId,
    role,
    content,
    parentId,
    sequenceId: null,
    authorId: "incognito",
    authorName: null,
    isAI: role === "assistant",
    model,
    skill: character,
    errorType: null,
    errorMessage: null,
    errorCode: null,
    metadata,
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await saveMessage(message, logger);
  return message;
}

/**
 * Update thread in incognito mode
 */
export async function updateIncognitoThread(
  threadId: string,
  updates: Partial<ChatThread>,
  logger: EndpointLogger,
): Promise<void> {
  const threads = await getItem<Record<string, ChatThread>>(
    STORAGE_KEYS.THREADS,
    {},
    logger,
  );
  const thread = threads[threadId];

  if (thread) {
    threads[threadId] = {
      ...thread,
      ...updates,
      updatedAt: new Date(),
    };
    await setItem(STORAGE_KEYS.THREADS, threads, logger);
  }
}

/**
 * Update message in incognito mode
 */
export async function updateIncognitoMessage(
  messageId: string,
  updates: Partial<ChatMessage>,
  logger: EndpointLogger,
): Promise<void> {
  const messages = await getItem<Record<string, ChatMessage>>(
    STORAGE_KEYS.MESSAGES,
    {},
    logger,
  );
  const message = messages[messageId];

  if (message) {
    messages[messageId] = {
      ...message,
      ...updates,
      updatedAt: new Date(),
    };
    await setItem(STORAGE_KEYS.MESSAGES, messages, logger);
  }
}
