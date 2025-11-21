/**
 * Navigation utilities for chat interface
 * Handles routing logic for threads and folders
 */

import {
  DefaultFolderId,
  isDefaultFolderId,
} from "@/app/api/[locale]/v1/core/agent/chat/config";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";
import type { ChatFolder } from "@/app/api/[locale]/v1/core/agent/chat/hooks/store";

/**
 * Get the root folder ID for a given folder
 * @param folders - Record of all folders
 * @param folderId - ID of the folder to check
 * @returns Root folder ID (one of the default folder IDs)
 */
export function getRootFolderId(
  folders: Record<string, ChatFolder>,
  folderId: string | null | undefined,
): DefaultFolderId {
  if (!folderId) {
    return DefaultFolderId.PRIVATE;
  }

  // Check if this is already a root folder
  if (isDefaultFolderId(folderId)) {
    return folderId;
  }

  // Find the folder and traverse up to root
  const folder = folders[folderId];
  if (!folder) {
    return DefaultFolderId.PRIVATE;
  }

  return folder.rootFolderId;
}

/**
 * Build URL for a folder
 * @param locale - Current locale
 * @param rootFolderId - Root folder ID
 * @param subFolderId - Optional subfolder ID
 * @returns URL path like /en-US/threads/private or /en-US/threads/private/subfolder-id
 */
export function buildFolderUrl(
  locale: CountryLanguage,
  rootFolderId: DefaultFolderId,
  subFolderId?: string | null,
): string {
  if (subFolderId) {
    return `/${locale}/threads/${rootFolderId}/${subFolderId}`;
  }
  return `/${locale}/threads/${rootFolderId}`;
}

/**
 * Get the translation key for "New Chat" button based on root folder
 * @param rootFolderId - ID of the root folder
 * @returns Translation key like "app.chat.common.newPrivateChat"
 */
export function getNewChatTranslationKey(
  rootFolderId: DefaultFolderId,
): TranslationKey {
  switch (rootFolderId) {
    case DefaultFolderId.PRIVATE:
      return "app.chat.common.newPrivateChat";
    case DefaultFolderId.SHARED:
      return "app.chat.common.newSharedChat";
    case DefaultFolderId.PUBLIC:
      return "app.chat.common.newPublicChat";
    case DefaultFolderId.INCOGNITO:
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
  rootFolderId: DefaultFolderId,
): TranslationKey {
  switch (rootFolderId) {
    case DefaultFolderId.PRIVATE:
      return "app.chat.common.newPrivateFolder";
    case DefaultFolderId.SHARED:
      return "app.chat.common.newSharedFolder";
    case DefaultFolderId.PUBLIC:
      return "app.chat.common.newPublicFolder";
    case DefaultFolderId.INCOGNITO:
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
  rootFolderId: DefaultFolderId,
): TranslationKey {
  switch (rootFolderId) {
    case DefaultFolderId.PRIVATE:
      return "app.chat.common.createNewPrivateFolder";
    case DefaultFolderId.SHARED:
      return "app.chat.common.createNewSharedFolder";
    case DefaultFolderId.PUBLIC:
      return "app.chat.common.createNewPublicFolder";
    case DefaultFolderId.INCOGNITO:
      return "app.chat.common.createNewIncognitoFolder";
    default:
      return "app.chat.newFolder.title";
  }
}
