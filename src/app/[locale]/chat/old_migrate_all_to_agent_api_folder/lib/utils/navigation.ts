/**
 * Navigation utilities for chat interface
 * Handles routing logic for threads and folders
 */

import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatFolder, ChatState } from "../storage/types";
import { DEFAULT_FOLDERS } from "../storage/types";

/**
 * Navigation configuration
 */
export const NAVIGATION_CONFIG = {
  /** Special thread ID for new/empty threads */
  NEW_THREAD_ID: "new",

  /** Default folder ID when no folder is specified */
  DEFAULT_FOLDER_ID: "general",
} as const;

/**
 * Get the URL path for a folder
 */
export function getFolderPath(
  folder: ChatFolder | undefined,
  state: ChatState,
): string {
  if (!folder) {
    // Find general folder as fallback
    const generalFolder = Object.values(state.folders).find(
      (f) => f.id === NAVIGATION_CONFIG.DEFAULT_FOLDER_ID,
    );
    return generalFolder?.urlPath || NAVIGATION_CONFIG.DEFAULT_FOLDER_ID;
  }
  return folder.urlPath || folder.id;
}

/**
 * Build URL for a folder
 * @param locale - Current locale
 * @param folderId - ID of the folder
 * @param state - Chat state
 * @returns URL path like /en-US/threads/private or /en-US/threads/private/subfolder
 */
export function buildFolderUrl(
  locale: CountryLanguage,
  folderId: string | null | undefined,
  state: ChatState,
): string {
  const targetFolderId = folderId || NAVIGATION_CONFIG.DEFAULT_FOLDER_ID;
  const folder = state.folders[targetFolderId];

  if (!folder) {
    return `/${locale}/threads/${NAVIGATION_CONFIG.DEFAULT_FOLDER_ID}`;
  }

  // Get root folder ID
  const rootFolderId = getRootFolderId(state, targetFolderId);

  // If this IS the root folder, just return root
  if (targetFolderId === rootFolderId) {
    return `/${locale}/threads/${rootFolderId}`;
  }

  // Otherwise return root + this folder (last subfolder)
  return `/${locale}/threads/${rootFolderId}/${targetFolderId}`;
}

/**
 * Build URL for a new thread in a folder
 */
export function buildNewThreadUrl(
  locale: CountryLanguage,
  folderId: string | null | undefined,
  state: ChatState,
): string {
  const targetFolderId = folderId || NAVIGATION_CONFIG.DEFAULT_FOLDER_ID;
  const folder = state.folders[targetFolderId];

  if (!folder) {
    return `/${locale}/threads/${NAVIGATION_CONFIG.DEFAULT_FOLDER_ID}/${NAVIGATION_CONFIG.NEW_THREAD_ID}`;
  }

  // Get root folder ID
  const rootFolderId = getRootFolderId(state, targetFolderId);

  // If this IS the root folder, return root/new
  if (targetFolderId === rootFolderId) {
    return `/${locale}/threads/${rootFolderId}/${NAVIGATION_CONFIG.NEW_THREAD_ID}`;
  }

  // Otherwise return root/lastsubfolder/new
  return `/${locale}/threads/${rootFolderId}/${targetFolderId}/${NAVIGATION_CONFIG.NEW_THREAD_ID}`;
}

/**
 * Build URL for an existing thread
 */
export function buildThreadUrl(
  locale: CountryLanguage,
  threadId: string,
  state: ChatState,
): string {
  const thread = state.threads[threadId];
  if (!thread?.folderId) {
    return buildNewThreadUrl(locale, null, state);
  }

  const folder = state.folders[thread.folderId];
  if (!folder) {
    return `/${locale}/threads/${NAVIGATION_CONFIG.DEFAULT_FOLDER_ID}/${threadId}`;
  }

  // Get root folder ID
  const rootFolderId = getRootFolderId(state, thread.folderId);

  // If thread is in root folder, return root/threadId
  if (thread.folderId === rootFolderId) {
    return `/${locale}/threads/${rootFolderId}/${threadId}`;
  }

  // Otherwise return root/lastsubfolder/threadId
  return `/${locale}/threads/${rootFolderId}/${thread.folderId}/${threadId}`;
}

/**
 * Check if a thread ID represents a new/empty thread
 */
export function isNewThread(threadId: string | null | undefined): boolean {
  return threadId === NAVIGATION_CONFIG.NEW_THREAD_ID || !threadId;
}

/**
 * Get the translation key for "New Chat" button based on root folder
 * @param rootFolderId - ID of the root folder
 * @returns Translation key like "app.chat.common.newPrivateChat"
 */
export function getNewChatTranslationKey(
  rootFolderId: string,
):
  | "app.chat.common.newPrivateChat"
  | "app.chat.common.newSharedChat"
  | "app.chat.common.newPublicChat"
  | "app.chat.common.newIncognitoChat"
  | "app.chat.common.newChat" {
  switch (rootFolderId) {
    case DEFAULT_FOLDERS.PRIVATE:
      return "app.chat.common.newPrivateChat";
    case DEFAULT_FOLDERS.SHARED:
      return "app.chat.common.newSharedChat";
    case DEFAULT_FOLDERS.PUBLIC:
      return "app.chat.common.newPublicChat";
    case DEFAULT_FOLDERS.INCOGNITO:
      return "app.chat.common.newIncognitoChat";
    default:
      return "app.chat.common.newChat";
  }
}

/**
 * Get the translation key for "New Folder" button based on root folder
 * @param rootFolderId - ID of the root folder
 * @returns Translation key like "app.chat.common.newPrivateFolder"
 */
export function getNewFolderTranslationKey(
  rootFolderId: string,
):
  | "app.chat.common.newPrivateFolder"
  | "app.chat.common.newSharedFolder"
  | "app.chat.common.newPublicFolder"
  | "app.chat.common.newIncognitoFolder"
  | "app.chat.folderList.newFolder" {
  switch (rootFolderId) {
    case DEFAULT_FOLDERS.PRIVATE:
      return "app.chat.common.newPrivateFolder";
    case DEFAULT_FOLDERS.SHARED:
      return "app.chat.common.newSharedFolder";
    case DEFAULT_FOLDERS.PUBLIC:
      return "app.chat.common.newPublicFolder";
    case DEFAULT_FOLDERS.INCOGNITO:
      return "app.chat.common.newIncognitoFolder";
    default:
      return "app.chat.folderList.newFolder";
  }
}

/**
 * Get the translation key for "Create New Folder" dialog title based on root folder
 * @param rootFolderId - ID of the root folder
 * @returns Translation key like "app.chat.common.createNewPrivateFolder"
 */
export function getCreateFolderTranslationKey(
  rootFolderId: string,
):
  | "app.chat.common.createNewPrivateFolder"
  | "app.chat.common.createNewSharedFolder"
  | "app.chat.common.createNewPublicFolder"
  | "app.chat.common.createNewIncognitoFolder"
  | "app.chat.newFolder.title" {
  switch (rootFolderId) {
    case DEFAULT_FOLDERS.PRIVATE:
      return "app.chat.common.createNewPrivateFolder";
    case DEFAULT_FOLDERS.SHARED:
      return "app.chat.common.createNewSharedFolder";
    case DEFAULT_FOLDERS.PUBLIC:
      return "app.chat.common.createNewPublicFolder";
    case DEFAULT_FOLDERS.INCOGNITO:
      return "app.chat.common.createNewIncognitoFolder";
    default:
      return "app.chat.newFolder.title";
  }
}

/**
 * Get the root folder ID for a given folder
 * Traverses up the folder hierarchy to find the root
 *
 * @param state - Chat state containing all folders
 * @param folderId - ID of the folder to find root for
 * @returns Root folder ID, or the folder ID itself if it's already a root
 */
export function getRootFolderId(
  state: ChatState,
  folderId: string | null | undefined,
): string {
  if (!folderId) {
    return NAVIGATION_CONFIG.DEFAULT_FOLDER_ID;
  }

  let currentFolder = state.folders[folderId];
  if (!currentFolder) {
    return NAVIGATION_CONFIG.DEFAULT_FOLDER_ID;
  }

  // Traverse up to root
  while (currentFolder.parentId) {
    const parentFolder = state.folders[currentFolder.parentId];
    if (!parentFolder) {
      break;
    }
    currentFolder = parentFolder;
  }

  return currentFolder.id;
}

/**
 * Build full folder path from a folder up to its root
 * Returns array of folder IDs from root to the specified folder
 * Example: ['private', 'work', 'project1'] for a nested folder
 *
 * @param state - Chat state containing all folders
 * @param folderId - ID of the folder to build path for
 * @returns Array of folder IDs from root to target folder, or empty array if folder not found
 */
export function buildFolderPath(
  state: ChatState,
  folderId: string | null | undefined,
): string[] {
  if (!folderId) {
    return [];
  }

  const folder = state.folders[folderId];
  if (!folder) {
    return [];
  }

  // Build path by traversing up to root
  const path: string[] = [];
  let currentFolder: ChatFolder | undefined = folder;

  while (currentFolder) {
    path.unshift(currentFolder.id);

    // Stop if we reached a root folder (no parent)
    if (!currentFolder.parentId) {
      break;
    }

    // Move to parent
    currentFolder = state.folders[currentFolder.parentId];
  }

  return path;
}
