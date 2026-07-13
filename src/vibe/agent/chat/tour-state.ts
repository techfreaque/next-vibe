"use client";

import {
  getLocalItem,
  removeLocalItem,
  setLocalItem,
} from "next-vibe/ui/lib/storage";
import { create } from "zustand";
import type { StorageValue } from "zustand/middleware";
import { persist } from "zustand/middleware";

interface TourState {
  isActive: boolean;
  modelSelectorOpen: boolean;
  modelSelectorOnboarding: boolean;
  onboardingComplete: boolean;
  onboardingCompanionId: string | null;
  currentStepIndex: number;
  advanceTour: (() => void) | null;
  setTourActive: (active: boolean) => void;
  setModelSelectorOpen: (open: boolean) => void;
  setModelSelectorOnboarding: (onboarding: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setOnboardingCompanionId: (id: string | null) => void;
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
      onboardingCompanionId: null,
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
      setOnboardingCompanionId: (id: string | null): void => {
        set({ onboardingCompanionId: id });
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
      // Persist only the durable onboarding flags; transient UI state and the
      // action callbacks are recreated from the store's initializer on rehydrate.
      // Returns a full TourState (the custom PersistStorage typing requires it) by
      // spreading the live state and pinning the ephemeral fields to their
      // defaults so nothing stale is written.
      partialize: (state): TourState => ({
        ...state,
        isActive: false,
        modelSelectorOpen: false,
        modelSelectorOnboarding: false,
        currentStepIndex: 0,
        advanceTour: null,
      }),
      storage: {
        getItem: (key: string): StorageValue<TourState> | null => {
          try {
            const raw = getLocalItem(key);
            if (!raw) {
              return null;
            }
            return JSON.parse(raw) as StorageValue<TourState>;
          } catch {
            return null;
          }
        },
        setItem: (key: string, value: StorageValue<TourState>): void => {
          try {
            setLocalItem(key, JSON.stringify(value));
          } catch {
            // ignore
          }
        },
        removeItem: (key: string): void => {
          try {
            removeLocalItem(key);
          } catch {
            // ignore
          }
        },
      },
    },
  ),
);
