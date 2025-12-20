import { create } from "zustand";

interface TourState {
  isActive: boolean;
  modelSelectorOpen: boolean;
  personaSelectorOpen: boolean;
  modelSelectorShowAll: boolean;
  personaSelectorShowAll: boolean;
  // Pause tour while selector is open (hides tooltip)
  isPaused: boolean;
  // Current tour step index (for coordination)
  currentStepIndex: number;
  // Control sidebar footer expansion during tour
  bottomSheetExpanded: boolean;
  // Callback to advance tour (set by welcome-tour)
  advanceTour: (() => void) | null;
  setTourActive: (active: boolean) => void;
  setModelSelectorOpen: (open: boolean) => void;
  setPersonaSelectorOpen: (open: boolean) => void;
  setModelSelectorShowAll: (showAll: boolean) => void;
  setPersonaSelectorShowAll: (showAll: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setCurrentStepIndex: (index: number) => void;
  setBottomSheetExpanded: (expanded: boolean) => void;
  setAdvanceTour: (callback: (() => void) | null) => void;
}

export const useTourState = create<TourState>((set) => ({
  isActive: false,
  modelSelectorOpen: false,
  personaSelectorOpen: false,
  modelSelectorShowAll: false,
  personaSelectorShowAll: false,
  isPaused: false,
  currentStepIndex: 0,
  bottomSheetExpanded: false,
  advanceTour: null,
  setTourActive: (active): void => {
    set({ isActive: active });
  },
  setModelSelectorOpen: (open): void => {
    set({ modelSelectorOpen: open });
  },
  setPersonaSelectorOpen: (open): void => {
    set({ personaSelectorOpen: open });
  },
  setModelSelectorShowAll: (showAll): void => {
    set({ modelSelectorShowAll: showAll });
  },
  setPersonaSelectorShowAll: (showAll): void => {
    set({ personaSelectorShowAll: showAll });
  },
  setIsPaused: (paused): void => {
    set({ isPaused: paused });
  },
  setCurrentStepIndex: (index): void => {
    set({ currentStepIndex: index });
  },
  setBottomSheetExpanded: (expanded): void => {
    set({ bottomSheetExpanded: expanded });
  },
  setAdvanceTour: (callback): void => {
    set({ advanceTour: callback });
  },
}));
