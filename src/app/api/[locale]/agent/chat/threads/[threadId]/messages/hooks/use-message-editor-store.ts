/**
 * Message Editor Store
 * Zustand store for message editing/retry/answer state.
 * Replaces useState-based state from use-message-editor-actions.ts
 * so multiple components can read editor state without context.
 */

"use client";

import { create } from "zustand";

interface MessageEditorState {
  editingMessageId: string | null;
  retryingMessageId: string | null;
  answeringMessageId: string | null;
  deletingMessageId: string | null;
  answerContent: string;
  editorAttachments: File[];
  isLoadingRetryAttachments: boolean;

  // Actions
  startEdit: (messageId: string) => void;
  setRetrying: (messageId: string) => void;
  startAnswer: (messageId: string) => void;
  startDelete: (messageId: string) => void;
  setLoadingRetryAttachments: (loading: boolean) => void;
  setEditorAttachments: (
    attachments: File[] | ((prev: File[]) => File[]),
  ) => void;
  setAnswerContent: (content: string) => void;
  cancelAction: () => void;
  /** Clear editing state only (after successful save) */
  clearEditing: () => void;
  /** Clear retrying state + attachments (after successful retry) */
  clearRetrying: () => void;
  /** Clear answering state + content + attachments (after successful answer) */
  clearAnswering: () => void;
  /** Clear deleting state (after successful delete) */
  clearDeleting: () => void;
}

const INITIAL_STATE = {
  editingMessageId: null,
  retryingMessageId: null,
  answeringMessageId: null,
  deletingMessageId: null,
  answerContent: "",
  editorAttachments: [] as File[],
  isLoadingRetryAttachments: false,
};

export const useMessageEditorStore = create<MessageEditorState>((set) => ({
  ...INITIAL_STATE,

  startEdit: (messageId): void =>
    set({ ...INITIAL_STATE, editingMessageId: messageId }),

  setRetrying: (messageId): void =>
    set((state) => ({
      retryingMessageId: messageId,
      isLoadingRetryAttachments: false,
      // Keep editorAttachments that were loaded during the async phase
      editorAttachments: state.editorAttachments,
    })),

  startAnswer: (messageId): void =>
    set({ ...INITIAL_STATE, answeringMessageId: messageId }),

  startDelete: (messageId): void =>
    set({ ...INITIAL_STATE, deletingMessageId: messageId }),

  setLoadingRetryAttachments: (loading): void =>
    set({ isLoadingRetryAttachments: loading }),

  setEditorAttachments: (attachments): void =>
    set((state) => ({
      editorAttachments:
        typeof attachments === "function"
          ? attachments(state.editorAttachments)
          : attachments,
    })),

  setAnswerContent: (content): void => set({ answerContent: content }),

  cancelAction: (): void => set(INITIAL_STATE),

  clearEditing: (): void =>
    set({ editingMessageId: null, editorAttachments: [] }),

  clearRetrying: (): void =>
    set({ retryingMessageId: null, editorAttachments: [] }),

  clearAnswering: (): void =>
    set({
      answeringMessageId: null,
      answerContent: "",
      editorAttachments: [],
    }),

  clearDeleting: (): void => set({ deletingMessageId: null }),
}));
