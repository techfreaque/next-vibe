/**
 * Sidebar Footer Store
 * Manages sidebar footer state (bottom sheet expansion).
 * Shared by the sidebar footer and anything that needs to expand or collapse it.
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
