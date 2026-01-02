/**
 * Folder Handler Hook
 * Contains business logic for folder UI operations like reordering and moving
 * Extracted from UI components as per requirement #4
 */

import { useCallback } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { FolderUpdate } from "../folders/hooks/use-operations";
import type { ChatFolder } from "./store";

interface FolderHandlersDeps {
  folders: Record<string, ChatFolder>;
  updateFolder: (folderId: string, updates: FolderUpdate) => Promise<void>;
  logger: EndpointLogger;
}

export interface FolderHandlers {
  handleReorderFolder: (folderId: string, direction: "up" | "down") => void;
  handleMoveFolderToParent: (folderId: string, newParentId: string | null) => void;
  handleCreateThreadInFolder: (folderId: string) => void;
}

export function useFolderHandlers(
  deps: FolderHandlersDeps,
  createThread: (folderId?: string | null) => void,
): FolderHandlers {
  const { folders, updateFolder, logger } = deps;

  const handleReorderFolder = useCallback(
    (folderId: string, direction: "up" | "down") => {
      logger.debug("Folder handlers: Reorder folder", {
        folderId,
        direction,
      });

      const folder = folders[folderId];
      if (!folder) {
        logger.error("Folder not found for reordering", { folderId });
        return;
      }

      // Get all sibling folders (same parent and rootFolderId)
      const allSiblings = Object.values(folders)
        .filter((f) => f.rootFolderId === folder.rootFolderId && f.parentId === folder.parentId)
        .toSorted((a, b) => {
          // First sort by sortOrder
          if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }
          // If sortOrder is the same, use createdAt as tiebreaker
          return a.createdAt.getTime() - b.createdAt.getTime();
        });

      // Find current folder's index in the sorted list
      const currentIndex = allSiblings.findIndex((f) => f.id === folderId);

      if (currentIndex === -1) {
        logger.error("Folder not found in siblings list", { folderId });
        return;
      }

      if (direction === "up" && currentIndex > 0) {
        // Move folder up by swapping positions with previous sibling
        const prevSibling = allSiblings[currentIndex - 1];
        if (prevSibling) {
          void updateFolder(folderId, { sortOrder: currentIndex - 1 });
          void updateFolder(prevSibling.id, { sortOrder: currentIndex });
        }
      } else if (direction === "down" && currentIndex < allSiblings.length - 1) {
        // Move folder down by swapping positions with next sibling
        const nextSibling = allSiblings[currentIndex + 1];
        if (nextSibling) {
          void updateFolder(folderId, { sortOrder: currentIndex + 1 });
          void updateFolder(nextSibling.id, { sortOrder: currentIndex });
        }
      }
    },
    [folders, updateFolder, logger],
  );

  const handleMoveFolderToParent = useCallback(
    (folderId: string, newParentId: string | null) => {
      logger.debug("Folder handlers: Moving folder to parent", {
        folderId,
        newParentId,
      });
      void updateFolder(folderId, { parentId: newParentId });
    },
    [updateFolder, logger],
  );

  const handleCreateThreadInFolder = useCallback(
    (folderId: string) => {
      logger.debug("Folder handlers: Creating thread in folder", { folderId });
      createThread(folderId);
    },
    [createThread, logger],
  );

  return {
    handleReorderFolder,
    handleMoveFolderToParent,
    handleCreateThreadInFolder,
  };
}
