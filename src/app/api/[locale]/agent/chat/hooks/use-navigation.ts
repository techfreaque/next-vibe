/**
 * Navigation hooks for chat interface
 * Updates the Zustand navigation store + pushes URL via history API.
 * Store update is instant (re-renders immediately), URL follows synchronously.
 * Uses window.history.pushState to avoid triggering server component re-renders.
 */

"use client";

import { useCallback } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { DefaultFolderId } from "../config";
import type { ChatThread } from "./store";
import { useChatNavigationStore } from "./use-chat-navigation-store";

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
 * Updates Zustand store (instant) + pushes URL via history API
 */
export function useNavigation(
  locale: CountryLanguage,
  logger: EndpointLogger,
  threads: Record<string, ChatThread>,
): NavigationOperations {
  const setNavigation = useChatNavigationStore((s) => s.setNavigation);

  const navigateToThread = useCallback(
    (threadId: string): void => {
      logger.debug("Navigation: Navigating to thread", { threadId });

      // Update store — single source of truth
      const thread = threads[threadId];
      setNavigation({
        activeThreadId: threadId,
        currentRootFolderId: thread?.rootFolderId ?? undefined,
        currentSubFolderId: thread?.folderId ?? undefined,
      });

      // Update URL without triggering server re-render
      const url = buildThreadUrl(locale, threadId, threads);
      window.history.pushState(null, "", url);
    },
    [locale, logger, threads, setNavigation],
  );

  const navigateToFolder = useCallback(
    (rootFolderId: DefaultFolderId, subFolderId: string | null): void => {
      logger.debug("Navigation: Navigating to folder", {
        rootFolderId,
        subFolderId,
      });

      setNavigation({
        activeThreadId: null,
        currentRootFolderId: rootFolderId,
        currentSubFolderId: subFolderId,
      });

      const url = buildFolderUrl(locale, rootFolderId, subFolderId);
      window.history.pushState(null, "", url);
    },
    [locale, logger, setNavigation],
  );

  const navigateToNewThread = useCallback(
    (rootFolderId: DefaultFolderId, subFolderId: string | null): void => {
      logger.debug("Navigation: Navigating to new thread", {
        rootFolderId,
        subFolderId,
      });

      setNavigation({
        activeThreadId: "new",
        currentRootFolderId: rootFolderId,
        currentSubFolderId: subFolderId,
      });

      const url = buildNewThreadUrl(locale, rootFolderId, subFolderId);
      window.history.pushState(null, "", url);
    },
    [locale, logger, setNavigation],
  );

  return {
    navigateToThread,
    navigateToFolder,
    navigateToNewThread,
  };
}
