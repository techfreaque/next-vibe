/**
 * Branch Persistence Hook
 * Safely stores and restores branch selection state
 * Only persists user-initiated changes, not automatic switches
 */

import { storage } from "next-vibe-ui/lib/storage";
import { useCallback, useRef } from "react";

import { parseError } from "../../../shared/utils";
import type { EndpointLogger } from "../../../system/unified-interface/shared/logger/endpoint";
import type { ChatMessage } from "../db";

const STORAGE_KEY_PREFIX = "chat_branch_state_";
const STORAGE_VERSION = 1;

interface BranchState {
  version: number;
  threadId: string;
  branchIndices: Record<string, number>;
  lastUpdated: number;
  // Track which branches were user-selected vs auto-selected
  userSelected: Record<string, boolean>;
}

interface UseBranchPersistenceProps {
  threadId: string;
  messages: ChatMessage[];
  logger: EndpointLogger;
}

interface UseBranchPersistenceReturn {
  // Load persisted state (call once on mount) - now async
  loadPersistedState: () => Promise<Record<string, number>>;
  // Save state (only call for user-initiated changes)
  saveUserSelection: (parentId: string, index: number) => void;
  // Validate that indices are still valid given current messages
  validateIndices: (indices: Record<string, number>) => Record<string, number>;
}

export function useBranchPersistence({
  threadId,
  messages,
  logger,
}: UseBranchPersistenceProps): UseBranchPersistenceReturn {
  // Keep track of latest messages for validation
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  /**
   * Get storage key for this thread
   */
  const getStorageKey = useCallback((): string => {
    return `${STORAGE_KEY_PREFIX}${threadId}`;
  }, [threadId]);

  /**
   * Validate branch indices against current message tree
   * Returns sanitized indices with invalid ones removed
   */
  const validateIndices = useCallback(
    (indices: Record<string, number>): Record<string, number> => {
      const validated: Record<string, number> = {};
      const currentMessages = messagesRef.current;

      // Build map of parent -> children
      const childrenMap = new Map<string, ChatMessage[]>();
      const rootMessages = currentMessages.filter((msg) => !msg.parentId);

      for (const msg of currentMessages) {
        if (msg.parentId) {
          const siblings = childrenMap.get(msg.parentId) || [];
          siblings.push(msg);
          childrenMap.set(msg.parentId, siblings);
        }
      }

      // Validate each stored index
      for (const [parentId, index] of Object.entries(indices)) {
        // Special case: root level branches
        if (parentId === "__root__") {
          if (
            rootMessages.length > 1 &&
            index >= 0 &&
            index < rootMessages.length
          ) {
            validated["__root__"] = index;
          }
          continue;
        }

        // Check if parent exists and has children
        const children = childrenMap.get(parentId);
        if (
          children &&
          children.length > 1 &&
          index >= 0 &&
          index < children.length
        ) {
          validated[parentId] = index;
        }
        // If validation fails, index is simply not included (defaults to 0)
      }

      return validated;
    },
    [],
  );

  /**
   * Load persisted branch state from storage
   * Validates and sanitizes the data
   */
  const loadPersistedState = useCallback(async (): Promise<
    Record<string, number>
  > => {
    // Don't load state if no valid thread ID
    if (!threadId || threadId.length === 0) {
      return {};
    }

    try {
      const key = getStorageKey();
      const stored = await storage.getItem(key);

      if (!stored) {
        return {};
      }

      const state: BranchState = JSON.parse(stored);

      // Validate structure
      if (
        !state ||
        typeof state !== "object" ||
        state.version !== STORAGE_VERSION ||
        state.threadId !== threadId ||
        !state.branchIndices ||
        typeof state.branchIndices !== "object"
      ) {
        logger.warn("[BranchPersistence] Invalid stored state, clearing");
        await storage.removeItem(key);
        return {};
      }

      // Only restore indices that were explicitly user-selected
      const userSelectedIndices: Record<string, number> = {};
      for (const [parentId, index] of Object.entries(state.branchIndices)) {
        if (state.userSelected?.[parentId] === true) {
          userSelectedIndices[parentId] = index;
        }
      }

      // Validate indices against current messages
      return validateIndices(userSelectedIndices);
    } catch (error) {
      logger.error("[BranchPersistence] Error loading state:", {
        error: error instanceof Error ? error.message : String(error),
      });
      return {};
    }
  }, [getStorageKey, threadId, validateIndices, logger]);

  /**
   * Save user's branch selection to storage
   * Only call this when user manually switches branches
   */
  const saveUserSelection = useCallback(
    (parentId: string, index: number): void => {
      // Don't save if no valid thread ID
      if (!threadId || threadId.length === 0) {
        return;
      }

      // Fire and forget async save
      void (async (): Promise<void> => {
        try {
          const key = getStorageKey();
          let state: BranchState;

          // Load existing state or create new
          try {
            const stored = await storage.getItem(key);
            state = stored
              ? JSON.parse(stored)
              : {
                  version: STORAGE_VERSION,
                  threadId,
                  branchIndices: {},
                  userSelected: {},
                  lastUpdated: Date.now(),
                };
          } catch {
            state = {
              version: STORAGE_VERSION,
              threadId,
              branchIndices: {},
              userSelected: {},
              lastUpdated: Date.now(),
            };
          }

          // Update with new user selection
          state.branchIndices[parentId] = index;
          state.userSelected[parentId] = true; // Mark as user-selected
          state.lastUpdated = Date.now();

          // Save to storage
          await storage.setItem(key, JSON.stringify(state));
        } catch (error) {
          // storage might be full or unavailable
          logger.error(
            "[BranchPersistence] Error saving state:",
            parseError(error),
          );
        }
      })();
    },
    [getStorageKey, threadId, logger],
  );

  return {
    loadPersistedState,
    saveUserSelection,
    validateIndices,
  };
}
