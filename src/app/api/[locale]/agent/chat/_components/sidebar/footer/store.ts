/**
 * Sidebar Footer Store
 * Manages sidebar footer state (bottom sheet expansion)
 */

import { create } from "zustand";

interface SidebarFooterStore {
  // Bottom sheet expansion state
  isBottomSheetExpanded: boolean;
  setBottomSheetExpanded: (expanded: boolean) => void;
}

export const useSidebarFooterStore = create<SidebarFooterStore>((set) => ({
  // Bottom sheet state
  isBottomSheetExpanded: false,
  setBottomSheetExpanded: (expanded: boolean): void => {
    set({ isBottomSheetExpanded: expanded });
  },
}));
