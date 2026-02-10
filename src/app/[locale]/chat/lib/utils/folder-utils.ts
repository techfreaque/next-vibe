/**
 * Folder utility functions
 * Helper functions for working with folders in the new API structure
 */

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import {
  DEFAULT_FOLDER_CONFIGS,
  isDefaultFolderId,
} from "@/app/api/[locale]/agent/chat/config";
import type { ChatFolder } from "@/app/api/[locale]/agent/chat/hooks/store";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
  customIcon?: IconKey | null,
): IconKey {
  if (isDefaultFolder(folderId)) {
    return DEFAULT_FOLDER_CONFIGS[folderId].icon;
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
    return DEFAULT_FOLDER_CONFIGS[folderId].color;
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
    return t(DEFAULT_FOLDER_CONFIGS[folder.id].translationKey);
  }

  // For custom folders, use the stored name
  return folder.name;
}
