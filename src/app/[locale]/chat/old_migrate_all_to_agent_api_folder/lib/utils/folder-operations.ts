/**
 * Folder Operations Utilities
 *
 * Pure utility functions for folder CRUD operations.
 * These functions are extracted from UI components to:
 * 1. Improve testability
 * 2. Enable reuse across components
 * 3. Prepare for future DB migration
 * 4. Separate business logic from UI
 */

import type { ChatFolder, ChatState } from "../storage/types";
import { isDefaultFolder } from "../storage/types";

/**
 * Update a folder with new properties
 *
 * @param state - Current chat state
 * @param folderId - ID of folder to update
 * @param updates - Partial folder updates
 * @returns Updated chat state
 */
export function updateFolderInState(
  state: ChatState,
  folderId: string,
  updates: Partial<ChatFolder>,
): ChatState {
  const folder = state.folders[folderId];
  if (!folder) {
    return state;
  }

  // If name is being updated, mark as user-customized
  const isNameUpdate = "name" in updates && updates.name !== folder.name;
  const updatedFolder = {
    ...folder,
    ...updates,
    // Mark as customized if name changed
    isUserCustomized: isNameUpdate ? true : folder.isUserCustomized,
    updatedAt: Date.now(),
  };

  return {
    ...state,
    folders: {
      ...state.folders,
      [folderId]: updatedFolder,
    },
    lastUpdated: Date.now(),
  };
}

/**
 * Reorder a folder within its parent (move up or down)
 *
 * @param state - Current chat state
 * @param folderId - ID of folder to reorder
 * @param direction - Direction to move ("up" or "down")
 * @returns Updated chat state
 */
export function reorderFolderInState(
  state: ChatState,
  folderId: string,
  direction: "up" | "down",
): ChatState {
  const folder = state.folders[folderId];
  if (!folder) {
    return state;
  }

  // Determine which array to modify (root or parent's children)
  const isRoot = folder.parentId === null;
  const targetArray = isRoot
    ? state.rootFolderIds
    : (folder.parentId && state.folders[folder.parentId]?.childrenIds) || [];

  if (!targetArray || targetArray.length === 0) {
    return state;
  }

  const currentIndex = targetArray.indexOf(folderId);
  if (currentIndex === -1) {
    return state;
  }

  // Calculate new index
  const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  // Check bounds
  if (newIndex < 0 || newIndex >= targetArray.length) {
    return state;
  }

  // Create new array with swapped positions
  const newArray = [...targetArray];
  [newArray[currentIndex], newArray[newIndex]] = [
    newArray[newIndex],
    newArray[currentIndex],
  ];

  // Update state
  if (isRoot) {
    return {
      ...state,
      rootFolderIds: newArray,
      lastUpdated: Date.now(),
    };
  } else if (folder.parentId) {
    return {
      ...state,
      folders: {
        ...state.folders,
        [folder.parentId]: {
          ...state.folders[folder.parentId],
          childrenIds: newArray,
          updatedAt: Date.now(),
        },
      },
      lastUpdated: Date.now(),
    };
  }
  return state;
}

/**
 * Move a folder to a new parent
 *
 * @param state - Current chat state
 * @param folderId - ID of folder to move
 * @param newParentId - ID of new parent folder (null for root level)
 * @returns Updated chat state
 */
export function moveFolderToParent(
  state: ChatState,
  folderId: string,
  newParentId: string | null,
): ChatState {
  const folder = state.folders[folderId];
  if (!folder) {
    return state;
  }

  // Can't move folder to itself or its descendants
  const isDescendant = (targetId: string, ancestorId: string): boolean => {
    if (targetId === ancestorId) {
      return true;
    }
    const target = state.folders[targetId];
    if (!target?.parentId) {
      return false;
    }
    return isDescendant(target.parentId, ancestorId);
  };

  if (newParentId && isDescendant(newParentId, folderId)) {
    return state;
  }

  // Already in the target parent
  if (folder.parentId === newParentId) {
    return state;
  }

  let updatedState = { ...state };

  // Remove from old parent
  if (folder.parentId === null) {
    // Remove from rootFolderIds
    updatedState.rootFolderIds = updatedState.rootFolderIds.filter(
      (id) => id !== folderId,
    );
  } else {
    // Remove from old parent's children
    const oldParent = updatedState.folders[folder.parentId];
    if (oldParent) {
      updatedState.folders = {
        ...updatedState.folders,
        [folder.parentId]: {
          ...oldParent,
          childrenIds: oldParent.childrenIds.filter((id) => id !== folderId),
          updatedAt: Date.now(),
        },
      };
    }
  }

  // Add to new parent
  if (newParentId === null) {
    // Add to rootFolderIds
    updatedState.rootFolderIds = [...updatedState.rootFolderIds, folderId];
  } else {
    // Add to new parent's children
    const newParent = updatedState.folders[newParentId];
    if (newParent) {
      updatedState.folders = {
        ...updatedState.folders,
        [newParentId]: {
          ...newParent,
          childrenIds: [...newParent.childrenIds, folderId],
          updatedAt: Date.now(),
        },
      };
    }
  }

  // Update folder's parentId
  updatedState.folders = {
    ...updatedState.folders,
    [folderId]: {
      ...folder,
      parentId: newParentId,
      updatedAt: Date.now(),
    },
  };

  updatedState.lastUpdated = Date.now();

  return updatedState;
}

/**
 * Check if a folder can be moved up in its parent
 *
 * @param state - Current chat state
 * @param folderId - ID of folder to check
 * @returns True if folder can be moved up
 */
export function canMoveFolderUp(state: ChatState, folderId: string): boolean {
  const folder = state.folders[folderId];
  if (!folder) {
    return false;
  }

  const isRoot = folder.parentId === null;
  const targetArray = isRoot
    ? state.rootFolderIds
    : (folder.parentId && state.folders[folder.parentId]?.childrenIds) || [];

  const currentIndex = targetArray.indexOf(folderId);
  return currentIndex > 0;
}

/**
 * Check if a folder can be moved down in its parent
 *
 * @param state - Current chat state
 * @param folderId - ID of folder to check
 * @returns True if folder can be moved down
 */
export function canMoveFolderDown(state: ChatState, folderId: string): boolean {
  const folder = state.folders[folderId];
  if (!folder) {
    return false;
  }

  const isRoot = folder.parentId === null;
  const targetArray = isRoot
    ? state.rootFolderIds
    : (folder.parentId && state.folders[folder.parentId]?.childrenIds) || [];

  const currentIndex = targetArray.indexOf(folderId);
  return currentIndex >= 0 && currentIndex < targetArray.length - 1;
}

/**
 * Check if a folder can be deleted
 * Default folders cannot be deleted
 *
 * @param folderId - ID of folder to check
 * @returns True if folder can be deleted
 */
export function canDeleteFolder(folderId: string): boolean {
  return !isDefaultFolder(folderId);
}

/**
 * Check if a folder can be renamed
 * Default folders cannot be renamed
 *
 * @param folderId - ID of folder to check
 * @returns True if folder can be renamed
 */
export function canRenameFolder(folderId: string): boolean {
  return !isDefaultFolder(folderId);
}

/**
 * Check if a folder can be moved to another parent
 * Default folders cannot be moved
 *
 * @param folderId - ID of folder to check
 * @returns True if folder can be moved
 */
export function canMoveFolder(folderId: string): boolean {
  return !isDefaultFolder(folderId);
}
