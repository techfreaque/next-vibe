/**
 * Cortex Modal Store
 * Manages the open/close state of the cortex browser modal
 */

import { create } from "zustand";

interface CortexModalStore {
  isOpen: boolean;
  open: () => void;
  setOpen: (open: boolean) => void;
}

export const useCortexModalStore = create<CortexModalStore>((set) => ({
  isOpen: false,
  open: (): void => set({ isOpen: true }),
  setOpen: (open: boolean): void => set({ isOpen: open }),
}));
