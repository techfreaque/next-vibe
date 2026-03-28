/**
 * Navigation utilities for chat interface
 * Handles routing logic for threads and folders
 */

import type { Route } from "next";

import {
  DefaultFolderId,
  isDefaultFolderId,
} from "@/app/api/[locale]/agent/chat/config";
import type { ChatFolder } from "@/app/api/[locale]/agent/chat/hooks/store";
import type { CountryLanguage } from "@/i18n/core/config";
import type { ChatTranslationKey } from "@/app/[locale]/chat/i18n";

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
): Route<
  | `/${CountryLanguage}/threads/${DefaultFolderId}/${string}`
  | `/${CountryLanguage}/threads/${DefaultFolderId}`
> {
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
): ChatTranslationKey {
  switch (rootFolderId) {
    case DefaultFolderId.PRIVATE:
      return "common.newPrivateChat";
    case DefaultFolderId.SHARED:
      return "common.newSharedChat";
    case DefaultFolderId.PUBLIC:
      return "common.newPublicChat";
    case DefaultFolderId.INCOGNITO:
      return "common.newIncognitoChat";
    default:
      return "common.newChat";
  }
}

/**
 * Get the translation key for "New Folder" button based on root folder
 * @param rootFolderId - ID of the root folder
 * @returns Translation key like "app.chat.common.newPrivateFolder"
 */
export function getNewFolderTranslationKey(
  rootFolderId: DefaultFolderId,
): ChatTranslationKey {
  switch (rootFolderId) {
    case DefaultFolderId.PRIVATE:
      return "common.newPrivateFolder";
    case DefaultFolderId.SHARED:
      return "common.newSharedFolder";
    case DefaultFolderId.PUBLIC:
      return "common.newPublicFolder";
    case DefaultFolderId.INCOGNITO:
      return "common.newIncognitoFolder";
    default:
      return "folderList.newFolder";
  }
}
