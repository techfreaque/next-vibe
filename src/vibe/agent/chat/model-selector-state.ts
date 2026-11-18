"use client";

import { create } from "zustand";

/**
 * Shared chat UI state:
 * - open state of the model/skill selector popover, so any part of the chat
 *   (empty state, input, error bubbles, skill cards) can open or close it
 * - whether the first-run onboarding dialog is up, so other one-time dialogs
 *   (18+ consent) wait for it instead of stacking on top
 */
interface ModelSelectorState {
  modelSelectorOpen: boolean;
  setModelSelectorOpen: (open: boolean) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
}

export const useModelSelectorState = create<ModelSelectorState>()((set) => ({
  modelSelectorOpen: false,
  setModelSelectorOpen: (open: boolean): void => {
    set({ modelSelectorOpen: open });
  },
  onboardingOpen: false,
  setOnboardingOpen: (open: boolean): void => {
    set({ onboardingOpen: open });
  },
}));
