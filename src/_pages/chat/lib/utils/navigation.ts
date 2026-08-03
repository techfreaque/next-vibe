/**
 * Navigation utilities for chat interface
 * Handles routing logic for threads and folders
 */

import type { Route } from "next";
import type { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

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
