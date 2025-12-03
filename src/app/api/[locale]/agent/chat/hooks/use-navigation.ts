/**
 * Navigation hooks for chat interface
 * Provides centralized navigation functions that use router.push()
 * These replace the old setActiveThread() and setCurrentFolder() store methods
 */

"use client";

import { useCallback } from "react";
import { useRouter } from "next-vibe-ui/hooks/use-navigation";

import type { DefaultFolderId } from "../config";
import type { CountryLanguage } from "@/i18n/core/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { ChatThread } from "./store";

/**
 * Build URL for a thread
 * Includes full nested folder path
 */
function buildThreadUrl(
  locale: CountryLanguage,
  threadId: string,
  threads: Record<string, ChatThread>,
): string {
  const thread = threads[threadId];
  if (!thread) {
    // Fallback to private folder if thread not found
    return `/${locale}/threads/private/${threadId}`;
  }

  const { rootFolderId, folderId } = thread;
  if (folderId) {
    return `/${locale}/threads/${rootFolderId}/${folderId}/${threadId}`;
  }
  return `/${locale}/threads/${rootFolderId}/${threadId}`;
}

/**
 * Build URL for a folder
 */
function buildFolderUrl(
  locale: CountryLanguage,
  rootFolderId: DefaultFolderId,
  subFolderId: string | null,
): string {
  if (subFolderId) {
    return `/${locale}/threads/${rootFolderId}/${subFolderId}`;
  }
  return `/${locale}/threads/${rootFolderId}`;
}

/**
 * Build URL for new thread in a folder
 */
function buildNewThreadUrl(
  locale: CountryLanguage,
  rootFolderId: DefaultFolderId,
  subFolderId: string | null,
): string {
  if (subFolderId) {
    return `/${locale}/threads/${rootFolderId}/${subFolderId}/new`;
  }
  return `/${locale}/threads/${rootFolderId}/new`;
}

/**
 * Navigation operations return type
 */
export interface NavigationOperations {
  navigateToThread: (threadId: string) => void;
  navigateToFolder: (
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void;
  navigateToNewThread: (
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void;
}

/**
 * Hook for navigation operations
 * Provides centralized navigation functions that use router.push()
 */
export function useNavigation(
  locale: CountryLanguage,
  logger: EndpointLogger,
  threads: Record<string, ChatThread>,
  _folders: Record<string, { rootFolderId: DefaultFolderId }>,
): NavigationOperations {
  const router = useRouter();

  const navigateToThread = useCallback(
    (threadId: string): void => {
      logger.debug("Navigation: Navigating to thread", { threadId });
      const url = buildThreadUrl(locale, threadId, threads);
      router.push(url);
    },
    [locale, logger, router, threads],
  );

  const navigateToFolder = useCallback(
    (rootFolderId: DefaultFolderId, subFolderId: string | null): void => {
      logger.debug("Navigation: Navigating to folder", {
        rootFolderId,
        subFolderId,
      });
      const url = buildFolderUrl(locale, rootFolderId, subFolderId);
      router.push(url);
    },
    [locale, logger, router],
  );

  const navigateToNewThread = useCallback(
    (rootFolderId: DefaultFolderId, subFolderId: string | null): void => {
      logger.debug("Navigation: Navigating to new thread", {
        rootFolderId,
        subFolderId,
      });
      const url = buildNewThreadUrl(locale, rootFolderId, subFolderId);
      router.push(url);
    },
    [locale, logger, router],
  );

  return {
    navigateToThread,
    navigateToFolder,
    navigateToNewThread,
  };
}
