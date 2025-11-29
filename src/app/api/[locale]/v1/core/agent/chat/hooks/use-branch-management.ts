/**
 * Branch Management Hook
 * Handles branch switching and auto-switching for linear message view
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../db";

interface UseBranchManagementProps {
  activeThreadMessages: ChatMessage[];
}

interface UseBranchManagementReturn {
  branchIndices: Record<string, number>;
  handleSwitchBranch: (parentMessageId: string, branchIndex: number) => void;
}

export function useBranchManagement({
  activeThreadMessages,
}: UseBranchManagementProps): UseBranchManagementReturn {
  // Branch indices for linear view - tracks which branch is selected at each level
  // Key: parent message ID, Value: index of selected child
  const [branchIndices, setBranchIndices] = useState<Record<string, number>>(
    {},
  );

  // Track the last message count to detect new messages
  const lastMessageCountRef = useRef<number>(0);

  // Handler for switching branches in linear view
  const handleSwitchBranch = useCallback(
    (parentMessageId: string, branchIndex: number): void => {
      setBranchIndices((prev) => ({
        ...prev,
        [parentMessageId]: branchIndex,
      }));
    },
    [],
  );

  // Auto-switch to newly created branches
  useEffect(() => {
    const currentMessageCount = activeThreadMessages.length;

    // Only process if we have new messages
    if (currentMessageCount <= lastMessageCountRef.current) {
      lastMessageCountRef.current = currentMessageCount;
      return;
    }

    lastMessageCountRef.current = currentMessageCount;

    // Find the most recently created message (any role)
    const sortedMessages = [...activeThreadMessages].toSorted(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const latestMessage = sortedMessages[0];

    if (!latestMessage?.parentId) {
      return;
    }

    // Find all siblings (messages with the same parent)
    const siblings = activeThreadMessages
      .filter((msg) => msg.parentId === latestMessage.parentId)
      .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (siblings.length <= 1) {
      return; // No branches to switch to
    }

    // Find the index of the latest message among its siblings
    const latestIndex = siblings.findIndex(
      (msg) => msg.id === latestMessage.id,
    );

    if (latestIndex >= 0 && latestMessage.parentId) {
      // Auto-switch to the newly created branch
      setBranchIndices((prev) => ({
        ...prev,
        [latestMessage.parentId!]: latestIndex,
      }));
    }
  }, [activeThreadMessages]);

  return {
    branchIndices,
    handleSwitchBranch,
  };
}
