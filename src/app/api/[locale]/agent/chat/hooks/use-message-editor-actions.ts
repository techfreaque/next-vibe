/**
 * Custom hook for managing message action states
 * Handles editing, retrying, and answering states for messages
 */

import { useCallback, useState } from "react";

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { loadMessageAttachments } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/_components/hooks/load-message-attachments";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

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
  answerContent: string;
  editorAttachments: File[];
  isLoadingRetryAttachments: boolean;

  // Check if a message is in a specific state
  isEditing: (messageId: string) => boolean;
  isRetrying: (messageId: string) => boolean;
  isAnswering: (messageId: string) => boolean;
  isDeleting: (messageId: string) => boolean;

  // Action handlers
  startEdit: (messageId: string) => void;
  startRetry: (message: ChatMessage) => Promise<void>;
  startAnswer: (messageId: string) => void;
  startDelete: (messageId: string) => void;
  cancelAction: () => void;
  setAnswerContent: (content: string) => void;
  setEditorAttachments: (
    attachments: File[] | ((prev: File[]) => File[]),
  ) => void;

  // Combined handlers for save operations
  handleSaveEdit: (
    messageId: string,
    content: string,
    onEdit: (id: string, content: string) => Promise<void>,
  ) => Promise<void>;
  handleBranchEdit: (
    messageId: string,
    content: string,
    onBranch?: (
      id: string,
      content: string,
      audioInput: { file: File } | undefined,
      attachments: File[] | undefined,
    ) => Promise<void>,
  ) => Promise<void>;
  handleConfirmRetry: (
    messageId: string,
    onRetry?: (id: string, attachments: File[] | undefined) => Promise<void>,
  ) => Promise<void>;
  handleConfirmAnswer: (
    messageId: string,
    onAnswer?: (
      id: string,
      content: string,
      attachments: File[] | undefined,
    ) => Promise<void>,
  ) => Promise<void>;
  handleConfirmDelete: (
    messageId: string,
    onDelete?: (id: string) => void,
  ) => void;
}

/**
 * Hook for managing message action states
 */
export function useMessageActions(
  logger: EndpointLogger,
): UseMessageActionsReturn {
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
  const [answerContent, setAnswerContent] = useState<string>("");
  const [editorAttachments, setEditorAttachments] = useState<File[]>([]);
  const [isLoadingRetryAttachments, setIsLoadingRetryAttachments] =
    useState<boolean>(false);

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
    setAnswerContent("");
    setEditorAttachments([]);
    setIsLoadingRetryAttachments(false);
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
    async (message: ChatMessage) => {
      resetAllActions();
      setIsLoadingRetryAttachments(true);

      const attachments = await loadMessageAttachments(message, logger);
      setEditorAttachments(attachments);

      setIsLoadingRetryAttachments(false);
      setRetryingMessageId(message.id);
    },
    [resetAllActions, logger],
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
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error(
          "app.chat.messages.actions.handleSaveEdit.error",
          errorObj,
        );
        // Don't clear editing state on error so user can retry
      }
    },
    [logger],
  );

  const handleBranchEdit = useCallback(
    async (
      messageId: string,
      content: string,
      onBranch?: (
        id: string,
        content: string,
        audioInput: { file: File } | undefined,
        attachments: File[] | undefined,
      ) => Promise<void>,
    ) => {
      if (!onBranch) {
        return;
      }

      try {
        await onBranch(
          messageId,
          content,
          undefined,
          editorAttachments.length > 0 ? editorAttachments : undefined,
        );
        setEditingMessageId(null);
        setEditorAttachments([]);
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error(
          "app.chat.messages.actions.handleBranchEdit.error",
          errorObj,
        );
      }
    },
    [logger, editorAttachments],
  );

  const handleConfirmRetry = useCallback(
    async (
      messageId: string,
      onRetry?: (id: string, attachments: File[] | undefined) => Promise<void>,
    ) => {
      if (!onRetry) {
        return;
      }

      try {
        await onRetry(
          messageId,
          editorAttachments.length > 0 ? editorAttachments : undefined,
        );
        setRetryingMessageId(null);
        setEditorAttachments([]);
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error(
          "app.chat.messages.actions.handleConfirmRetry.error",
          errorObj,
        );
      }
    },
    [logger, editorAttachments],
  );

  const handleConfirmAnswer = useCallback(
    async (
      messageId: string,
      onAnswer?: (
        id: string,
        content: string,
        attachments: File[] | undefined,
      ) => Promise<void>,
    ) => {
      if (!onAnswer) {
        return;
      }

      try {
        await onAnswer(
          messageId,
          answerContent,
          editorAttachments.length > 0 ? editorAttachments : undefined,
        );
        setAnsweringMessageId(null);
        setAnswerContent("");
        setEditorAttachments([]);
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error(
          "app.chat.messages.actions.handleConfirmAnswer.error",
          errorObj,
        );
      }
    },
    [logger, answerContent, editorAttachments],
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
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error(
          "app.chat.messages.actions.handleConfirmDelete.error",
          errorObj,
        );
      }
    },
    [logger],
  );

  return {
    editingMessageId,
    retryingMessageId,
    answeringMessageId,
    deletingMessageId,
    answerContent,
    editorAttachments,
    isLoadingRetryAttachments,
    isEditing,
    isRetrying,
    isAnswering,
    isDeleting,
    startEdit,
    startRetry,
    startAnswer,
    startDelete,
    cancelAction,
    setAnswerContent,
    setEditorAttachments,
    handleSaveEdit,
    handleBranchEdit,
    handleConfirmRetry,
    handleConfirmAnswer,
    handleConfirmDelete,
  };
}
