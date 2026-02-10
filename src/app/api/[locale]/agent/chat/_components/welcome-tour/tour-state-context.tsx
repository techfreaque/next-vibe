import { create } from "zustand";

interface TourState {
  isActive: boolean;
  modelSelectorOpen: boolean;
  modelSelectorOnboarding: boolean;
  // Pause tour while selector is open (hides tooltip)
  isPaused: boolean;
  // Current tour step index (for coordination)
  currentStepIndex: number;
  // Callback to advance tour (set by welcome-tour)
  advanceTour: (() => void) | null;
  setTourActive: (active: boolean) => void;
  setModelSelectorOpen: (open: boolean) => void;
  setModelSelectorOnboarding: (onboarding: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setCurrentStepIndex: (index: number) => void;
  setAdvanceTour: (callback: (() => void) | null) => void;
}

export const useTourState = create<TourState>((set) => ({
  isActive: false,
  modelSelectorOpen: false,
  modelSelectorOnboarding: false,
  isPaused: false,
  currentStepIndex: 0,
  advanceTour: null,
  setTourActive: (active): void => {
    set({ isActive: active });
  },
  setModelSelectorOpen: (open): void => {
    set({ modelSelectorOpen: open });
  },
  setModelSelectorOnboarding: (onboarding): void => {
    set({ modelSelectorOnboarding: onboarding });
  },
  setIsPaused: (paused): void => {
    set({ isPaused: paused });
  },
  setCurrentStepIndex: (index): void => {
    set({ currentStepIndex: index });
  },
  setAdvanceTour: (callback): void => {
    set({ advanceTour: callback });
  },
}));
