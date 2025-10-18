/**
 * Thread Operations Utilities
 *
 * Pure utility functions for thread CRUD operations.
 * These functions are extracted from UI components to:
 * 1. Improve testability
 * 2. Enable reuse across components
 * 3. Prepare for future DB migration
 * 4. Separate business logic from UI
 */

import type { CountryLanguage } from "@/i18n/core/config";

import {
  addThreadToState,
  autoUpdateThreadTitle,
  createThread,
  deleteThreadFromState,
  moveThreadToFolder,
  updateThreadInState,
} from "../storage/thread-manager";
import type { ChatState, ChatThread } from "../storage/types";

/**
 * Create a new thread with automatic cleanup of empty threads
 *
 * @param state - Current chat state
 * @param locale - User's locale for thread creation
 * @param folderId - Optional folder ID (defaults to "general")
 * @returns Tuple of [updated state, new thread ID]
 */
export function createNewThreadInState(
  state: ChatState,
  locale: CountryLanguage,
  folderId?: string | null,
): [ChatState, string] {
  // Check if current active thread is empty (no messages at all)
  const currentThread = state.activeThreadId
    ? state.threads[state.activeThreadId]
    : null;

  let stateAfterCleanup = state;

  if (currentThread) {
    const messages = Object.values(currentThread.messages);

    // If current thread is completely empty, delete it
    if (messages.length === 0) {
      stateAfterCleanup = deleteThreadFromState(state, currentThread.id);
    }
  }

  // Use the exact folderId passed - NO FALLBACK!
  // Each new chat button must pass the correct folder ID
  const targetFolderId = folderId ?? null;

  const newThread = createThread(locale, { folderId: targetFolderId });
  const newThreadId = newThread.id;

  const updated = addThreadToState(stateAfterCleanup, newThread);

  return [
    {
      ...updated,
      activeThreadId: newThreadId,
    },
    newThreadId,
  ];
}

/**
 * Update a thread with new properties
 * Supports both partial updates and functional updates for race condition prevention
 *
 * @param state - Current chat state
 * @param threadId - ID of thread to update
 * @param updates - Partial thread updates or update function
 * @returns Updated chat state
 */
export function updateThreadInStateWrapper(
  state: ChatState,
  threadId: string,
  updates: Partial<ChatThread> | ((prev: ChatThread) => ChatThread),
): ChatState {
  const existingThread = state.threads[threadId];
  if (!existingThread) {
    return state;
  }

  // Support functional updates for race condition prevention
  const updatedThread =
    typeof updates === "function"
      ? updates(existingThread)
      : { ...existingThread, ...updates, updatedAt: Date.now() };

  return updateThreadInState(state, threadId, updatedThread);
}

/**
 * Delete a thread from state
 *
 * @param state - Current chat state
 * @param threadId - ID of thread to delete
 * @returns Updated chat state
 */
export function deleteThreadInState(
  state: ChatState,
  threadId: string,
): ChatState {
  return deleteThreadFromState(state, threadId);
}

/**
 * Set the active thread
 *
 * @param state - Current chat state
 * @param threadId - ID of thread to set as active (null to clear)
 * @returns Updated chat state
 */
export function setActiveThreadInState(
  state: ChatState,
  threadId: string | null,
): ChatState {
  return {
    ...state,
    activeThreadId: threadId,
  };
}

/**
 * Move a thread to a different folder
 *
 * @param state - Current chat state
 * @param threadId - ID of thread to move
 * @param folderId - ID of target folder (null for root)
 * @returns Updated chat state
 */
export function moveThreadInState(
  state: ChatState,
  threadId: string,
  folderId: string | null,
): ChatState {
  return moveThreadToFolder(state, threadId, folderId);
}

/**
 * Auto-update thread title based on first message
 *
 * @param state - Current chat state
 * @param threadId - ID of thread to update title for
 * @returns Updated chat state
 */
export function updateThreadTitleInState(
  state: ChatState,
  threadId: string,
): ChatState {
  return autoUpdateThreadTitle(state, threadId);
}

/**
 * Check if a thread can be deleted
 * All threads can be deleted
 *
 * @param threadId - ID of thread to check
 * @returns True if thread can be deleted
 */
export function canDeleteThread(threadId: string): boolean {
  return !!threadId;
}

/**
 * Check if a thread can be moved
 * All threads can be moved
 *
 * @param threadId - ID of thread to check
 * @returns True if thread can be moved
 */
export function canMoveThread(threadId: string): boolean {
  return !!threadId;
}

/**
 * Check if a thread can be renamed
 * All threads can be renamed
 *
 * @param threadId - ID of thread to check
 * @returns True if thread can be renamed
 */
export function canRenameThread(threadId: string): boolean {
  return !!threadId;
}

/**
 * Get all threads in a folder
 *
 * @param state - Current chat state
 * @param folderId - ID of folder to get threads from
 * @returns Array of thread IDs in the folder
 */
export function getThreadsInFolderIds(
  state: ChatState,
  folderId: string,
): string[] {
  return Object.values(state.threads)
    .filter((thread) => thread.folderId === folderId)
    .map((thread) => thread.id);
}

/**
 * Get thread count in a folder
 *
 * @param state - Current chat state
 * @param folderId - ID of folder to count threads in
 * @returns Number of threads in the folder
 */
export function getThreadCountInFolder(
  state: ChatState,
  folderId: string,
): number {
  return getThreadsInFolderIds(state, folderId).length;
}

/**
 * Check if a thread exists
 *
 * @param state - Current chat state
 * @param threadId - ID of thread to check
 * @returns True if thread exists
 */
export function threadExists(state: ChatState, threadId: string): boolean {
  return !!state.threads[threadId];
}

/**
 * Get thread by ID
 *
 * @param state - Current chat state
 * @param threadId - ID of thread to get
 * @returns Thread or null if not found
 */
export function getThreadById(
  state: ChatState,
  threadId: string,
): ChatThread | null {
  return state.threads[threadId] || null;
}
