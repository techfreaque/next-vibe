/**
 * Folder utility functions
 * Helper functions for working with folders in the new API structure
 */

import {
  DEFAULT_FOLDER_CONFIGS,
  DefaultFolderId,
  isDefaultFolderId,
} from "@/app/api/[locale]/agent/chat/config";
import type { IconValue } from "@/app/api/[locale]/agent/chat/model-access/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { ChatFolder } from "@/app/api/[locale]/agent/chat/hooks/store";

/**
 * Check if a folder ID is a default/root folder
 * Default folders are the 4 root folders: private, incognito, shared, public
 */
export function isDefaultFolder(folderId: string): folderId is DefaultFolderId {
  return isDefaultFolderId(folderId);
}

/**
 * Get the icon for a folder
 * For default folders, use the icon from DEFAULT_FOLDER_CONFIGS
 * For custom folders, use the stored icon or fallback to "folder"
 */
export function getFolderIcon(
  folderId: string,
  customIcon?: IconValue | null,
): IconValue {
  if (isDefaultFolder(folderId)) {
    const config = DEFAULT_FOLDER_CONFIGS.find((c) => c.id === folderId);
    return config?.icon || "folder";
  }
  return customIcon || "folder";
}

/**
 * Get the color for a folder
 * For default folders, use the color from DEFAULT_FOLDER_CONFIGS
 * For custom folders, return the custom color or null
 */
export function getFolderColor(
  folderId: string,
  customColor?: string | null,
): string | null {
  if (isDefaultFolder(folderId)) {
    const config = DEFAULT_FOLDER_CONFIGS.find((c) => c.id === folderId);
    return config?.color || null;
  }
  return customColor || null;
}

/**
 * Get the display name for a folder
 * For default folders, always use the translation key from DEFAULT_FOLDER_CONFIGS
 * For custom folders, use the stored name
 */
export function getFolderDisplayName(
  folder: ChatFolder,
  locale: CountryLanguage,
): string {
  const { t } = simpleT(locale);

  // For default folders, always use the translation key from config
  if (isDefaultFolder(folder.id)) {
    const config = DEFAULT_FOLDER_CONFIGS.find((c) => c.id === folder.id);
    if (config) {
      return t(config.translationKey);
    }
  }

  // For custom folders, use the stored name
  return folder.name;
}

/**
 * Get the number of direct children (subfolders) for a folder
 */
export function getDirectChildrenCount(
  folderId: string,
  folders: Record<string, ChatFolder>,
): number {
  return Object.values(folders).filter((f) => f.parentId === folderId).length;
}

/**
 * Check if a folder can be deleted
 * Default folders cannot be deleted
 */
export function canDeleteFolder(folderId: string): boolean {
  return !isDefaultFolder(folderId);
}

/**
 * Check if a folder can be renamed
 * Default folders cannot be renamed
 */
export function canRenameFolder(folderId: string): boolean {
  return !isDefaultFolder(folderId);
}

/**
 * Check if a folder can be moved to another parent
 * Default folders cannot be moved
 */
export function canMoveFolder(folderId: string): boolean {
  return !isDefaultFolder(folderId);
}

/**
 * Get all ancestor folder IDs for a folder (from parent to root)
 */
export function getAncestorFolderIds(
  folderId: string,
  folders: Record<string, ChatFolder>,
): string[] {
  const ancestors: string[] = [];
  let currentId: string | null = folderId;

  while (currentId) {
    const folder: ChatFolder | undefined = folders[currentId];
    if (!folder?.parentId) {
      break;
    }
    ancestors.push(folder.parentId);
    currentId = folder.parentId;
  }

  return ancestors;
}

/**
 * Check if a folder is a descendant of another folder
 */
export function isFolderDescendant(
  folderId: string,
  ancestorId: string,
  folders: Record<string, ChatFolder>,
): boolean {
  if (folderId === ancestorId) {
    return true;
  }

  const folder = folders[folderId];
  if (!folder?.parentId) {
    return false;
  }

  return isFolderDescendant(folder.parentId, ancestorId, folders);
}

/**
 * Get all child folder IDs (recursive)
 */
export function getAllChildFolderIds(
  folderId: string,
  folders: Record<string, ChatFolder>,
): string[] {
  const children: string[] = [];
  const directChildren = Object.values(folders).filter(
    (f) => f.parentId === folderId,
  );

  for (const child of directChildren) {
    children.push(child.id);
    children.push(...getAllChildFolderIds(child.id, folders));
  }

  return children;
}

/**
 * Get the root folder ID for a given folder
 * This returns the DefaultFolderId (private, incognito, shared, public)
 */
export function getRootFolderIdForFolder(
  folderId: string,
  folders: Record<string, ChatFolder>,
): DefaultFolderId {
  // Check if this is already a root folder - type guard narrows the type
  if (isDefaultFolder(folderId)) {
    return folderId;
  }

  // Find the folder and get its rootFolderId
  const folder = folders[folderId];
  if (!folder) {
    return DefaultFolderId.PRIVATE;
  }

  return folder.rootFolderId;
}
