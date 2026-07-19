/**
 * Folder utility functions
 * Helper functions for working with folders in the new API structure
 */

import {
  DEFAULT_FOLDER_CONFIGS,
  DefaultFolderId,
  isDefaultFolderId,
} from "next-vibe/agent/chat/config";
import type { ChatFolder } from "next-vibe/agent/chat/db";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

import { scopedTranslation as chatScopedTranslation } from "@/_pages/chat/i18n";

/**
 * Check if a folder ID is a default/root folder
 * Default folders are the 4 root folders: private, incognito, shared, public
 */
export function isDefaultFolder(folderId: string): folderId is DefaultFolderId {
  return isDefaultFolderId(folderId);
}

/**
 * Scaffold sub-folders under REMOTE/<peer>/ use the names "private" and
 * "background" — they mirror the local root folders but have UUID ids.
 * Map by name to the matching DefaultFolderId config so they share the same
 * icon, color, and translation key as their local counterparts.
 */
const SCAFFOLD_NAME_TO_DEFAULT: Readonly<
  Partial<Record<string, DefaultFolderId>>
> = {
  private: DefaultFolderId.PRIVATE,
  background: DefaultFolderId.BACKGROUND,
};

function getScaffoldConfig(
  name: string | null | undefined,
): (typeof DEFAULT_FOLDER_CONFIGS)[DefaultFolderId] | null {
  if (!name) {
    return null;
  }
  const defaultId = SCAFFOLD_NAME_TO_DEFAULT[name];
  return defaultId !== undefined ? DEFAULT_FOLDER_CONFIGS[defaultId] : null;
}

/**
 * Get the icon for a folder.
 * Default folders → config icon. Scaffold mirrors ("private"/"background" by
 * name) → same icon as their local root. Custom folders → stored icon or "folder".
 */
export function getFolderIcon(
  folderId: string,
  customIcon?: IconKey | null,
  folderName?: string | null,
): IconKey {
  if (isDefaultFolder(folderId)) {
    return DEFAULT_FOLDER_CONFIGS[folderId].icon;
  }
  const scaffold = getScaffoldConfig(folderName);
  if (scaffold) {
    return scaffold.icon;
  }
  return customIcon || "folder";
}

/**
 * Get the color for a folder.
 * Default folders → config color. Scaffold mirrors → same color as their local
 * root. Custom folders → stored color or null.
 */
export function getFolderColor(
  folderId: string,
  customColor?: string | null,
  folderName?: string | null,
): string | null {
  if (isDefaultFolder(folderId)) {
    return DEFAULT_FOLDER_CONFIGS[folderId].color;
  }
  const scaffold = getScaffoldConfig(folderName);
  if (scaffold) {
    return scaffold.color;
  }
  return customColor || null;
}

/**
 * Get the display name for a folder.
 * Default folders → translation key from config. Scaffold mirrors
 * ("private"/"background" by name) → same translation as their local root,
 * resolved at render time from the locale. Custom folders → stored name.
 */
export function getFolderDisplayName(
  folder: Pick<ChatFolder, "id" | "name">,
  locale: CountryLanguage,
): string {
  const { t } = chatScopedTranslation.scopedT(locale);

  if (isDefaultFolder(folder.id)) {
    return t(DEFAULT_FOLDER_CONFIGS[folder.id].translationKey);
  }

  const scaffold = getScaffoldConfig(folder.name);
  if (scaffold) {
    return t(scaffold.translationKey);
  }

  return folder.name;
}
