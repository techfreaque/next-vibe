/**
 * Thread Navigation Hook
 * Handles thread creation and selection with navigation
 */

import { useRouter } from "next-vibe-ui/hooks";
import { useCallback } from "react";

import {
  DefaultFolderId,
  isDefaultFolderId,
} from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatFolder } from "./store";

interface UseThreadNavigationProps {
  locale: CountryLanguage;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  folders: Record<string, ChatFolder>;
  navigateToThread: (threadId: string) => void;
  navigateToNewThread: (
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void;
  deleteThread: (threadId: string) => Promise<void>;
  logger: EndpointLogger;
}

interface UseThreadNavigationReturn {
  handleSelectThread: (threadId: string) => void;
  handleCreateThread: (folderId?: string | null) => void;
  handleDeleteThread: (threadId: string) => Promise<void>;
}

export function useThreadNavigation({
  locale,
  currentRootFolderId,
  currentSubFolderId,
  folders,
  navigateToThread,
  navigateToNewThread,
  deleteThread,
  logger,
}: UseThreadNavigationProps): UseThreadNavigationReturn {
  const router = useRouter();

  // Handle thread selection with navigation
  const handleSelectThread = useCallback(
    (threadId: string): void => {
      navigateToThread(threadId);
    },
    [navigateToThread],
  );

  // Handle new thread creation with navigation
  const handleCreateThread = useCallback(
    (folderId?: string | null): void => {
      // Determine root folder and subfolder from folderId
      let rootFolderId: DefaultFolderId;
      let subFolderId: string | null;

      if (!folderId) {
        // No folder specified, use current folder
        rootFolderId = currentRootFolderId;
        subFolderId = currentSubFolderId;
      } else if (isDefaultFolderId(folderId)) {
        // Root folder
        rootFolderId = folderId;
        subFolderId = null;
      } else {
        // Subfolder - need to get root folder ID
        const folder = folders[folderId];
        if (folder) {
          rootFolderId = folder.rootFolderId;
          subFolderId = folderId;
        } else {
          // Fallback if folder not found
          rootFolderId = DefaultFolderId.PRIVATE;
          subFolderId = null;
        }
      }

      navigateToNewThread(rootFolderId, subFolderId);
    },
    [currentRootFolderId, currentSubFolderId, folders, navigateToNewThread],
  );

  // Handle thread deletion
  const handleDeleteThread = useCallback(
    async (threadId: string): Promise<void> => {
      logger.debug("Chat: Handling thread deletion", { threadId });

      // Delete the thread
      await deleteThread(threadId);

      // Navigate to the root folder page
      const url = `/${locale}/threads/${currentRootFolderId}`;
      logger.debug("Chat: Navigating after thread deletion", { url });
      router.push(url);
    },
    [deleteThread, logger, locale, currentRootFolderId, router],
  );

  return {
    handleSelectThread,
    handleCreateThread,
    handleDeleteThread,
  };
}
