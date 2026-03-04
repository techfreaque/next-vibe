/**
 * Sidebar Footer Store
 * Manages sidebar footer state (bottom sheet expansion).
 * Lives here so both the welcome-tour (api layer) and sidebar-footer (page layer) can share it.
 */

import { create } from "zustand";

interface SidebarFooterStore {
  isBottomSheetExpanded: boolean;
  setBottomSheetExpanded: (expanded: boolean) => void;
}

export const useSidebarFooterStore = create<SidebarFooterStore>((set) => ({
  isBottomSheetExpanded: false,
  setBottomSheetExpanded: (expanded: boolean): void => {
    set({ isBottomSheetExpanded: expanded });
  },
}));
