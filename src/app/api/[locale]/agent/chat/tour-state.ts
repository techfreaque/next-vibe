"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TourState {
  isActive: boolean;
  modelSelectorOpen: boolean;
  modelSelectorOnboarding: boolean;
  // Set to true when the selector onboarding finishes (companion + usecases steps done)
  onboardingComplete: boolean;
  // Current tour step index (for coordination)
  currentStepIndex: number;
  // Callback to advance tour (set by welcome-tour)
  advanceTour: (() => void) | null;
  setTourActive: (active: boolean) => void;
  setModelSelectorOpen: (open: boolean) => void;
  setModelSelectorOnboarding: (onboarding: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setCurrentStepIndex: (index: number) => void;
  setAdvanceTour: (callback: (() => void) | null) => void;
}

export const useTourState = create<TourState>()(
  persist(
    (set) => ({
      isActive: false,
      modelSelectorOpen: false,
      modelSelectorOnboarding: false,
      onboardingComplete: false,
      currentStepIndex: 0,
      advanceTour: null,
      setTourActive: (active: boolean): void => {
        set({ isActive: active });
      },
      setModelSelectorOpen: (open: boolean): void => {
        set({ modelSelectorOpen: open });
      },
      setModelSelectorOnboarding: (onboarding: boolean): void => {
        set({ modelSelectorOnboarding: onboarding });
      },
      setOnboardingComplete: (complete: boolean): void => {
        set({ onboardingComplete: complete });
      },
      setCurrentStepIndex: (index: number): void => {
        set({ currentStepIndex: index });
      },
      setAdvanceTour: (callback: (() => void) | null): void => {
        set({ advanceTour: callback });
      },
    }),
    {
      name: "ai-chat-tour-state",
      version: 2,
      // Only persist what's needed across refresh - not transient UI state
      partialize: () => ({}),
    },
  ),
);
