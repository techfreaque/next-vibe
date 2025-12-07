/**
 * Branch Management Hook
 * Handles branch switching and auto-switching for linear message view
 *
 * Features:
 * - Recursive auto-switching to new branches (including nested branches)
 * - Persistence of user-selected branches (survives page refresh)
 * - Distinguishes between user-initiated and automatic switches
 * - Safe validation of stored state
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../db";
import { useBranchPersistence } from "./use-branch-persistence";
import type { EndpointLogger } from "../../../system/unified-interface/shared/logger/endpoint";

interface UseBranchManagementProps {
  activeThreadMessages: ChatMessage[];
  threadId: string;
  logger: EndpointLogger;
}

interface UseBranchManagementReturn {
  branchIndices: Record<string, number>;
  handleSwitchBranch: (parentMessageId: string, branchIndex: number) => void;
}

export function useBranchManagement({
  activeThreadMessages,
  threadId,
  logger,
}: UseBranchManagementProps): UseBranchManagementReturn {
  // Branch indices for linear view - tracks which branch is selected at each level
  // Key: parent message ID (or "__root__"), Value: index of selected child
  const [branchIndices, setBranchIndices] = useState<Record<string, number>>(
    {},
  );

  // Track initialization state
  const isInitializedRef = useRef(false);

  // Track message IDs to detect new messages (more reliable than count)
  const messageIdsRef = useRef<Set<string>>(new Set());

  // Track message count to detect deletions
  const messageCountRef = useRef<number>(0);

  // Persistence hooks
  const { loadPersistedState, saveUserSelection, validateIndices } =
    useBranchPersistence({
      threadId,
      messages: activeThreadMessages,
      logger,
    });

  /**
   * Load persisted branch state when thread changes
   * Resets state when switching to a different thread
   */
  useEffect(() => {
    // Reset initialization flag when thread changes
    isInitializedRef.current = false;
    messageIdsRef.current = new Set();
    messageCountRef.current = 0;

    // Load persisted state for this thread
    void (async (): Promise<void> => {
      const persistedIndices = await loadPersistedState();
      setBranchIndices(persistedIndices);

      // Mark as initialized
      isInitializedRef.current = true;
    })();
  }, [threadId, loadPersistedState]);

  /**
   * Handler for user-initiated branch switching
   * Saves selection to localStorage
   */
  const handleSwitchBranch = useCallback(
    (parentMessageId: string, branchIndex: number): void => {
      setBranchIndices((prev) => ({
        ...prev,
        [parentMessageId]: branchIndex,
      }));

      // Save user's selection for persistence
      saveUserSelection(parentMessageId, branchIndex);
    },
    [saveUserSelection],
  );

  /**
   * Build a map of all branch points in the message tree
   * Returns: Map<parentId, children[]> where children.length > 1
   */
  const buildBranchMap = useCallback(
    (messages: ChatMessage[]): Map<string, ChatMessage[]> => {
      const branchMap = new Map<string, ChatMessage[]>();

      // Group messages by parent
      const childrenMap = new Map<string, ChatMessage[]>();
      const rootMessages: ChatMessage[] = [];

      for (const msg of messages) {
        if (!msg.parentId) {
          rootMessages.push(msg);
        } else {
          const siblings = childrenMap.get(msg.parentId) || [];
          siblings.push(msg);
          childrenMap.set(msg.parentId, siblings);
        }
      }

      // Add root branches if multiple roots exist
      if (rootMessages.length > 1) {
        branchMap.set(
          "__root__",
          rootMessages.toSorted(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
          ),
        );
      }

      // Add all branch points (where children > 1)
      for (const [parentId, children] of childrenMap.entries()) {
        if (children.length > 1) {
          branchMap.set(
            parentId,
            children.toSorted(
              (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
            ),
          );
        }
      }

      return branchMap;
    },
    [],
  );

  /**
   * Recursive auto-switching to newly created branches
   * Detects new messages and switches to them if they create new branches
   */
  useEffect(() => {
    if (!isInitializedRef.current) {
      // Wait for initialization to complete
      return;
    }

    // Build set of current message IDs
    const currentMessageIds = new Set(activeThreadMessages.map((m) => m.id));

    // Find new messages (IDs that didn't exist before)
    const newMessageIds = [...currentMessageIds].filter(
      (id) => !messageIdsRef.current.has(id),
    );

    // Update tracked IDs
    messageIdsRef.current = currentMessageIds;

    if (newMessageIds.length === 0) {
      return; // No new messages
    }

    // Get the new messages sorted by creation time (newest first)
    const newMessages = activeThreadMessages
      .filter((msg) => newMessageIds.includes(msg.id))
      .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (newMessages.length === 0) {
      return;
    }

    // Build branch map to understand the tree structure
    const branchMap = buildBranchMap(activeThreadMessages);

    // Process each new message and check if it creates a branch
    const updatesToApply: Record<string, number> = {};

    for (const newMsg of newMessages) {
      const parentKey = newMsg.parentId || "__root__";
      const siblings = branchMap.get(parentKey);

      if (!siblings || siblings.length <= 1) {
        continue; // No branching at this level
      }

      // Find the index of the new message among its siblings
      const newMsgIndex = siblings.findIndex((s) => s.id === newMsg.id);

      if (newMsgIndex >= 0) {
        // This is a new branch - auto-switch to it
        // Only if we haven't already set this in this batch
        if (!(parentKey in updatesToApply)) {
          updatesToApply[parentKey] = newMsgIndex;
        }
      }
    }

    // Apply all updates at once if any were found
    if (Object.keys(updatesToApply).length > 0) {
      setBranchIndices((prev) => ({
        ...prev,
        ...updatesToApply,
      }));
      // Note: We don't save auto-switches to localStorage
      // Only user-initiated switches are persisted
    }
  }, [activeThreadMessages, buildBranchMap]);

  /**
   * Validate branch indices when messages are DELETED
   * Only runs when message count decreases (deletion detected)
   * This prevents race conditions with the auto-switch effect
   */
  useEffect(() => {
    if (!isInitializedRef.current) {
      return;
    }

    const currentCount = activeThreadMessages.length;
    const previousCount = messageCountRef.current;

    // Update count for next time
    messageCountRef.current = currentCount;

    // Only validate when messages are deleted (count decreased)
    // or when switching threads (count changes significantly)
    const isMessageDeleted = currentCount < previousCount;
    const isThreadSwitch = Math.abs(currentCount - previousCount) > 5; // Heuristic

    if (!isMessageDeleted && !isThreadSwitch) {
      return; // Skip validation for message additions
    }

    setBranchIndices((prev) => {
      const validated = validateIndices(prev);

      // Only update if something changed
      if (JSON.stringify(validated) !== JSON.stringify(prev)) {
        return validated;
      }
      return prev;
    });
  }, [activeThreadMessages, validateIndices]);

  return {
    branchIndices,
    handleSwitchBranch,
  };
}
