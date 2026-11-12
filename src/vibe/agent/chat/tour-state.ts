"use client";

import {
  getLocalItem,
  removeLocalItem,
  setLocalItem,
} from "next-vibe/ui/lib/storage";
import { create } from "zustand";
import type { StorageValue } from "zustand/middleware";
import { persist } from "zustand/middleware";

import { defaultLocale } from "../../core/i18n/core/config";
import { createClientLogger } from "../../logger/client";
import { reportStorageFailure } from "../../logger/storage-failure";

/**
 * zustand's persist storage runs outside React (hydrate + every set), so it
 * cannot reach the LoggerProvider - a module-level client logger reports
 * storage failures instead of swallowing them.
 */
const tourStorageLogger = createClientLogger(false, defaultLocale);

interface TourState {
  isActive: boolean;
  modelSelectorOpen: boolean;
  modelSelectorOnboarding: boolean;
  onboardingComplete: boolean;
  onboardingCompanionId: string | null;
  currentStepIndex: number;
  /** Set by "Take the tour" buttons; WelcomeTour starts and clears it */
  tourRequested: boolean;
  advanceTour: (() => void) | null;
  requestTour: () => void;
  clearTourRequest: () => void;
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
      tourRequested: false,
      advanceTour: null,
      requestTour: (): void => {
        set({ tourRequested: true });
      },
      clearTourRequest: (): void => {
        set({ tourRequested: false });
      },
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
        tourRequested: false,
        advanceTour: null,
      }),
      storage: {
        getItem: (key: string): StorageValue<TourState> | null => {
          const raw = getLocalItem(key, tourStorageLogger);
          if (!raw) {
            return null;
          }
          try {
            return JSON.parse(raw) as StorageValue<TourState>;
          } catch (error) {
            reportStorageFailure(tourStorageLogger, {
              platform: "web",
              area: "localStorage",
              operation: "parse",
              key,
              error: error instanceof Error ? error : String(error),
              valueLength: raw.length,
            });
            return null;
          }
        },
        setItem: (key: string, value: StorageValue<TourState>): void => {
          let serialized: string;
          try {
            serialized = JSON.stringify(value);
          } catch (error) {
            reportStorageFailure(tourStorageLogger, {
              platform: "web",
              area: "localStorage",
              operation: "set",
              key,
              error: error instanceof Error ? error : String(error),
            });
            return;
          }
          // setLocalItem reports its own quota/security failures
          setLocalItem(key, serialized, tourStorageLogger);
        },
        removeItem: (key: string): void => {
          removeLocalItem(key, tourStorageLogger);
        },
      },
    },
  ),
);
