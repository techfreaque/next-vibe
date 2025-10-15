/**
 * Custom hook for managing message action states
 * Handles editing, retrying, and answering states for messages
 */

import { useCallback, useState } from "react";

import { logError } from "../../lib/utils/error-handling";

export type MessageActionType = "edit" | "retry" | "answer" | null;

export interface MessageActionState {
  messageId: string | null;
  actionType: MessageActionType;
}

export interface UseMessageActionsReturn {
  // Current action state
  editingMessageId: string | null;
  retryingMessageId: string | null;
  answeringMessageId: string | null;
  deletingMessageId: string | null;

  // Check if a message is in a specific state
  isEditing: (messageId: string) => boolean;
  isRetrying: (messageId: string) => boolean;
  isAnswering: (messageId: string) => boolean;
  isDeleting: (messageId: string) => boolean;

  // Action handlers
  startEdit: (messageId: string) => void;
  startRetry: (messageId: string) => void;
  startAnswer: (messageId: string) => void;
  startDelete: (messageId: string) => void;
  cancelAction: () => void;

  // Combined handlers for save operations
  handleSaveEdit: (
    messageId: string,
    content: string,
    onEdit: (id: string, content: string) => Promise<void>,
  ) => Promise<void>;
  handleBranchEdit: (
    messageId: string,
    content: string,
    onBranch?: (id: string, content: string) => Promise<void>,
  ) => Promise<void>;
  handleConfirmRetry: (
    messageId: string,
    onRetry?: (id: string) => Promise<void>,
  ) => Promise<void>;
  handleConfirmAnswer: (
    messageId: string,
    onAnswer?: (id: string) => Promise<void>,
  ) => Promise<void>;
  handleConfirmDelete: (
    messageId: string,
    onDelete?: (id: string) => void,
  ) => void;
}

/**
 * Hook for managing message action states
 */
export function useMessageActions(): UseMessageActionsReturn {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [retryingMessageId, setRetryingMessageId] = useState<string | null>(
    null,
  );
  const [answeringMessageId, setAnsweringMessageId] = useState<string | null>(
    null,
  );
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
    null,
  );

  // Check functions
  const isEditing = useCallback(
    (messageId: string) => editingMessageId === messageId,
    [editingMessageId],
  );
  const isRetrying = useCallback(
    (messageId: string) => retryingMessageId === messageId,
    [retryingMessageId],
  );
  const isAnswering = useCallback(
    (messageId: string) => answeringMessageId === messageId,
    [answeringMessageId],
  );
  const isDeleting = useCallback(
    (messageId: string) => deletingMessageId === messageId,
    [deletingMessageId],
  );

  // Helper: Reset all action states except the one being set
  const resetAllActions = useCallback(() => {
    setEditingMessageId(null);
    setRetryingMessageId(null);
    setAnsweringMessageId(null);
    setDeletingMessageId(null);
  }, []);

  // Start action handlers
  const startEdit = useCallback(
    (messageId: string) => {
      resetAllActions();
      setEditingMessageId(messageId);
    },
    [resetAllActions],
  );

  const startRetry = useCallback(
    (messageId: string) => {
      resetAllActions();
      setRetryingMessageId(messageId);
    },
    [resetAllActions],
  );

  const startAnswer = useCallback(
    (messageId: string) => {
      resetAllActions();
      setAnsweringMessageId(messageId);
    },
    [resetAllActions],
  );

  const startDelete = useCallback(
    (messageId: string) => {
      resetAllActions();
      setDeletingMessageId(messageId);
    },
    [resetAllActions],
  );

  const cancelAction = resetAllActions;

  // Combined save handlers
  const handleSaveEdit = useCallback(
    async (
      messageId: string,
      content: string,
      onEdit: (id: string, content: string) => Promise<void>,
    ) => {
      try {
        await onEdit(messageId, content);
        setEditingMessageId(null);
      } catch (error) {
        logError(error, "handleSaveEdit");
        // Don't clear editing state on error so user can retry
      }
    },
    [],
  );

  const handleBranchEdit = useCallback(
    async (
      messageId: string,
      content: string,
      onBranch?: (id: string, content: string) => Promise<void>,
    ) => {
      if (!onBranch) {
        return;
      }

      try {
        await onBranch(messageId, content);
        setEditingMessageId(null);
      } catch (error) {
        logError(error, "handleBranchEdit");
      }
    },
    [],
  );

  const handleConfirmRetry = useCallback(
    async (messageId: string, onRetry?: (id: string) => Promise<void>) => {
      if (!onRetry) {
        return;
      }

      try {
        await onRetry(messageId);
        setRetryingMessageId(null);
      } catch (error) {
        logError(error, "handleConfirmRetry");
      }
    },
    [],
  );

  const handleConfirmAnswer = useCallback(
    async (messageId: string, onAnswer?: (id: string) => Promise<void>) => {
      if (!onAnswer) {
        return;
      }

      try {
        await onAnswer(messageId);
        setAnsweringMessageId(null);
      } catch (error) {
        logError(error, "handleConfirmAnswer");
      }
    },
    [],
  );

  const handleConfirmDelete = useCallback(
    (messageId: string, onDelete?: (id: string) => void) => {
      if (!onDelete) {
        return;
      }

      try {
        onDelete(messageId);
        setDeletingMessageId(null);
      } catch (error) {
        logError(error, "handleConfirmDelete");
      }
    },
    [],
  );

  return {
    editingMessageId,
    retryingMessageId,
    answeringMessageId,
    deletingMessageId,
    isEditing,
    isRetrying,
    isAnswering,
    isDeleting,
    startEdit,
    startRetry,
    startAnswer,
    startDelete,
    cancelAction,
    handleSaveEdit,
    handleBranchEdit,
    handleConfirmRetry,
    handleConfirmAnswer,
    handleConfirmDelete,
  };
}
