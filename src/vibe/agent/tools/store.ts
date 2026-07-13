/**
 * AI Tools Modal Store
 * Manages the open/close state of the AI tools modal
 */

import { create } from "zustand";

interface ToolsModalStore {
  isOpen: boolean;
  open: () => void;
  setOpen: (open: boolean) => void;
}

export const useToolsModalStore = create<ToolsModalStore>((set) => ({
  isOpen: false,
  open: (): void => set({ isOpen: true }),
  setOpen: (open: boolean): void => set({ isOpen: open }),
}));
