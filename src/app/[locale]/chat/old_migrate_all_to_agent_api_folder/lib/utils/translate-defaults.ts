/**
 * Translation helpers for default folder names and thread titles
 *
 * These functions handle translation of default values that may be stored
 * in English in localStorage but need to be displayed in the user's language.
 */

/**
 * Translate a folder name if it's a known default value
 *
 * @param name - The folder name from storage
 * @param t - Translation function from useTranslation
 * @returns Translated name if it's a default, otherwise the original name
 *
 * @example
 * const displayName = translateFolderName(folder.name, t);
 */
export function translateFolderName(
  name: string,
  t: (key: string) => string,
): string {
  // Check if it's the default "Private Chats" folder
  if (name === "Private Chats") {
    return t("app.chat.common.privateChats");
  }

  // Return original name for custom folders
  return name;
}

/**
 * Translate a thread title if it's a known default value
 *
 * @param title - The thread title from storage
 * @param t - Translation function from useTranslation
 * @returns Translated title if it's a default, otherwise the original title
 *
 * @example
 * const displayTitle = translateThreadTitle(thread.title, t);
 */
export function translateThreadTitle(
  title: string,
  t: (key: string) => string,
): string {
  // Check if it's the default "New Chat" title
  if (title === "New Chat") {
    return t("app.chat.common.newChat");
  }

  // Return original title for custom titles
  return title;
}
