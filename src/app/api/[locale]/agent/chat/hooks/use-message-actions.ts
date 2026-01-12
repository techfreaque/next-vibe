/**
 * Message Actions Hook
 * Handles message deletion with confirmation dialog
 */

import { useCallback, useState } from "react";

import type { ChatMessage } from "../db";

interface UseMessageActionsProps {
  messagesRecord: Record<string, ChatMessage>;
  deleteMessage: (messageId: string) => Promise<void>;
}

interface UseMessageActionsReturn {
  deleteDialogOpen: boolean;
  messageToDelete: string | null;
  handleDeleteMessage: (messageId: string) => void;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
  countMessageChildren: (messageId: string) => number;
}

export function useMessageActions({
  messagesRecord,
  deleteMessage,
}: UseMessageActionsProps): UseMessageActionsReturn {
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  // Count children of a message (recursively)
  const countMessageChildren = useCallback(
    (messageId: string): number => {
      const children = Object.values(messagesRecord).filter(
        (msg) => msg.parentId === messageId,
      );
      if (children.length === 0) {
        return 0;
      }
      // Count direct children + all descendants
      return children.reduce(
        (total, child) => total + 1 + countMessageChildren(child.id),
        0,
      );
    },
    [messagesRecord],
  );

  // Wrapper for delete message that ALWAYS shows confirmation dialog
  const handleDeleteMessage = useCallback((messageId: string): void => {
    // Always show confirmation dialog for better UX
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  }, []);

  // Confirm delete message with children
  const handleConfirmDelete = useCallback((): void => {
    if (messageToDelete) {
      void deleteMessage(messageToDelete);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  }, [messageToDelete, deleteMessage]);

  // Cancel delete
  const handleCancelDelete = useCallback((): void => {
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
  }, []);

  return {
    deleteDialogOpen,
    messageToDelete,
    handleDeleteMessage,
    handleConfirmDelete,
    handleCancelDelete,
    countMessageChildren,
  };
}
