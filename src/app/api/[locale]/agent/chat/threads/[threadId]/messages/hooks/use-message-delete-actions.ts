/**
 * Message Actions Hook
 * Handles message deletion with confirmation dialog
 * Dialog state lives in useDeleteDialogStore (Zustand)
 */

import { useCallback } from "react";

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";

import { useDeleteDialogStore } from "./use-delete-dialog-store";

interface UseMessageDeleteActionsProps {
  messagesRecord: Record<string, ChatMessage>;
  deleteMessage: (messageId: string) => Promise<void>;
}

interface UseMessageDeleteActionsReturn {
  handleDeleteMessage: (messageId: string) => void;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
  countMessageChildren: (messageId: string) => number;
}

export function useMessageDeleteActions({
  messagesRecord,
  deleteMessage,
}: UseMessageDeleteActionsProps): UseMessageDeleteActionsReturn {
  const openDeleteDialog = useDeleteDialogStore((s) => s.openDeleteDialog);
  const closeDeleteDialog = useDeleteDialogStore((s) => s.closeDeleteDialog);
  const messageToDelete = useDeleteDialogStore((s) => s.messageToDelete);

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
  const handleDeleteMessage = useCallback(
    (messageId: string): void => {
      openDeleteDialog(messageId);
    },
    [openDeleteDialog],
  );

  // Confirm delete message with children
  const handleConfirmDelete = useCallback((): void => {
    if (messageToDelete) {
      void deleteMessage(messageToDelete);
      closeDeleteDialog();
    }
  }, [messageToDelete, deleteMessage, closeDeleteDialog]);

  // Cancel delete
  const handleCancelDelete = useCallback((): void => {
    closeDeleteDialog();
  }, [closeDeleteDialog]);

  return {
    handleDeleteMessage,
    handleConfirmDelete,
    handleCancelDelete,
    countMessageChildren,
  };
}
