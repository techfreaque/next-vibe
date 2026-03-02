/**
 * Delete Dialog Store
 * Zustand store for message delete confirmation dialog state.
 * Triggered from message views, rendered at ChatInterface level.
 */

"use client";

import { create } from "zustand";

interface DeleteDialogState {
  /** Whether the delete confirmation dialog is open */
  deleteDialogOpen: boolean;
  /** ID of the message pending deletion */
  messageToDelete: string | null;
  /** Stored delete callback — set when opening, called on confirm */
  deleteCallback: ((messageId: string) => Promise<void>) | null;
  /** Open the delete dialog for a specific message */
  openDeleteDialog: (
    messageId: string,
    deleteCallback?: (messageId: string) => Promise<void>,
  ) => void;
  /** Close the delete dialog and clear the pending message */
  closeDeleteDialog: () => void;
  /** Confirm deletion: call stored callback + close */
  confirmDelete: () => void;
}

export const useDeleteDialogStore = create<DeleteDialogState>((set, get) => ({
  deleteDialogOpen: false,
  messageToDelete: null,
  deleteCallback: null,
  openDeleteDialog: (messageId, deleteCallback): void =>
    set({
      deleteDialogOpen: true,
      messageToDelete: messageId,
      deleteCallback: deleteCallback ?? get().deleteCallback,
    }),
  closeDeleteDialog: (): void =>
    set({ deleteDialogOpen: false, messageToDelete: null }),
  confirmDelete: (): void => {
    const { messageToDelete, deleteCallback } = get();
    if (messageToDelete && deleteCallback) {
      void deleteCallback(messageToDelete);
    }
    set({ deleteDialogOpen: false, messageToDelete: null });
  },
}));
