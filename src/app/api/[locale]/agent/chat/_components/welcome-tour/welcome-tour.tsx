"use client";

import React, { useCallback, useEffect, useState } from "react";
import Joyride, { STATUS, EVENTS, ACTIONS } from "react-joyride";
import type { CallBackProps } from "react-joyride";
import { useRouter } from "next-vibe-ui/hooks";
import type { TourStepConfig } from "./tour-config";
import {
  getTourSteps,
  getTourSelector,
  getNewChatUrl,
  getJoyrideLabels,
  TOUR_STORAGE_KEY,
  TOUR_SKIPPED_KEY,
  TOUR_AUTH_PENDING_KEY,
  TOUR_LAST_STEP_KEY,
  TOUR_IN_PROGRESS_KEY,
  TOUR_DATA_ATTRS,
  TOUR_COLORS,
  TOUR_SPACING,
  TOUR_TEXT_ALIGN,
} from "./tour-config";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { buildFolderUrl } from "@/app/[locale]/chat/lib/utils/navigation";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface WelcomeTourProps {
  isAuthenticated: boolean;
  locale: CountryLanguage;
  autoStart?: boolean;
}

export function WelcomeTour({
  isAuthenticated,
  locale,
  autoStart = true,
}: WelcomeTourProps): React.ReactElement | null {
  const { t } = simpleT(locale);
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState<TourStepConfig[]>([]);
  const router = useRouter();

  // Get tour steps with translations
  const tourSteps = getTourSteps(t, locale, isAuthenticated);

  // Initialize tour on mount
  useEffect(() => {
    // Check if tour was already completed or skipped
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    const tourSkipped = localStorage.getItem(TOUR_SKIPPED_KEY);
    if (tourCompleted === "true" || tourSkipped === "true") {
      return;
    }

    // Check if tour was in progress
    const tourInProgress = localStorage.getItem(TOUR_IN_PROGRESS_KEY);
    const lastStep = localStorage.getItem(TOUR_LAST_STEP_KEY);

    if (tourInProgress === "true" && lastStep) {
      // Resume from last step
      const lastStepIndex = parseInt(lastStep, 10);
      setSteps(tourSteps);
      setStepIndex(lastStepIndex);
      setTimeout(() => setRun(true), 500);
      return;
    }

    // Start fresh tour
    if (autoStart) {
      setSteps(tourSteps);
      setStepIndex(0);
      localStorage.setItem(TOUR_IN_PROGRESS_KEY, "true");
      localStorage.setItem(TOUR_LAST_STEP_KEY, "0");
      // Small delay to ensure DOM is ready
      setTimeout(() => setRun(true), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - autoStart is intentionally not a dependency

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, type, action, index } = data;

      // Handle step changes
      if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
        // Navigate to appropriate folder BEFORE moving to next step
        if (action === ACTIONS.NEXT) {
          const nextIndex = index + 1;
          const nextStep = steps[nextIndex];

          if (nextStep?.target) {
            const target = nextStep.target as string;

            // Map tour targets to folder IDs
            if (target === getTourSelector(TOUR_DATA_ATTRS.INCOGNITO_FOLDER)) {
              const url = buildFolderUrl(
                locale,
                DefaultFolderId.INCOGNITO,
                null,
              );
              router.push(url);
            } else if (
              target === getTourSelector(TOUR_DATA_ATTRS.PUBLIC_FOLDER)
            ) {
              const url = buildFolderUrl(locale, DefaultFolderId.PUBLIC, null);
              router.push(url);
            } else if (
              target === getTourSelector(TOUR_DATA_ATTRS.PRIVATE_FOLDER)
            ) {
              const url = buildFolderUrl(locale, DefaultFolderId.PRIVATE, null);
              router.push(url);
            } else if (
              target === getTourSelector(TOUR_DATA_ATTRS.SHARED_FOLDER)
            ) {
              const url = buildFolderUrl(locale, DefaultFolderId.SHARED, null);
              router.push(url);
            }

            // Open modals for modal internal steps
            if (
              target ===
                getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_SEARCH) ||
              target ===
                getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_GROUP) ||
              target ===
                getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_FAVORITES)
            ) {
              // Click model selector button to open modal
              setTimeout(() => {
                const modelSelectorButton = document.querySelector(
                  getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR),
                ) as HTMLElement;
                if (modelSelectorButton) {
                  modelSelectorButton.click();
                }
              }, 100);
            } else if (
              target ===
                getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_SEARCH) ||
              target ===
                getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_GROUP) ||
              target ===
                getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_FAVORITES)
            ) {
              // Click persona selector button to open modal
              setTimeout(() => {
                const personaSelectorButton = document.querySelector(
                  getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR),
                ) as HTMLElement;
                if (personaSelectorButton) {
                  personaSelectorButton.click();
                }
              }, 100);
            }
          }

          setStepIndex(nextIndex);
          // Save progress
          localStorage.setItem(TOUR_LAST_STEP_KEY, nextIndex.toString());
        } else if (action === ACTIONS.PREV) {
          const prevIndex = index - 1;
          const prevStep = steps[prevIndex];

          if (prevStep?.target) {
            const target = prevStep.target as string;

            // Map tour targets to folder IDs (same logic for going back)
            if (target === getTourSelector(TOUR_DATA_ATTRS.INCOGNITO_FOLDER)) {
              const url = buildFolderUrl(
                locale,
                DefaultFolderId.INCOGNITO,
                null,
              );
              router.push(url);
            } else if (
              target === getTourSelector(TOUR_DATA_ATTRS.PUBLIC_FOLDER)
            ) {
              const url = buildFolderUrl(locale, DefaultFolderId.PUBLIC, null);
              router.push(url);
            } else if (
              target === getTourSelector(TOUR_DATA_ATTRS.PRIVATE_FOLDER)
            ) {
              const url = buildFolderUrl(locale, DefaultFolderId.PRIVATE, null);
              router.push(url);
            } else if (
              target === getTourSelector(TOUR_DATA_ATTRS.SHARED_FOLDER)
            ) {
              const url = buildFolderUrl(locale, DefaultFolderId.SHARED, null);
              router.push(url);
            }

            // Open modals for modal internal steps when going back
            if (
              target ===
                getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_SEARCH) ||
              target ===
                getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_GROUP) ||
              target ===
                getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_FAVORITES)
            ) {
              // Click model selector button to open modal
              setTimeout(() => {
                const modelSelectorButton = document.querySelector(
                  getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR),
                ) as HTMLElement;
                if (modelSelectorButton) {
                  modelSelectorButton.click();
                }
              }, 100);
            } else if (
              target ===
                getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_SEARCH) ||
              target ===
                getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_GROUP) ||
              target ===
                getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_FAVORITES)
            ) {
              // Click persona selector button to open modal
              setTimeout(() => {
                const personaSelectorButton = document.querySelector(
                  getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR),
                ) as HTMLElement;
                if (personaSelectorButton) {
                  personaSelectorButton.click();
                }
              }, 100);
            }
          }

          setStepIndex(prevIndex);
          // Save progress
          localStorage.setItem(TOUR_LAST_STEP_KEY, prevIndex.toString());
        }
      }

      // Handle tour completion or closure
      if (status === STATUS.FINISHED) {
        setRun(false);
        localStorage.setItem(TOUR_STORAGE_KEY, "true");
        localStorage.removeItem(TOUR_AUTH_PENDING_KEY);
        localStorage.removeItem(TOUR_LAST_STEP_KEY);
        localStorage.removeItem(TOUR_IN_PROGRESS_KEY);
        localStorage.removeItem(TOUR_SKIPPED_KEY);

        // Navigate to appropriate folder with new thread
        const targetFolder = isAuthenticated
          ? DefaultFolderId.PRIVATE
          : DefaultFolderId.INCOGNITO;
        const newThreadUrl = getNewChatUrl(locale, targetFolder);
        router.push(newThreadUrl);
      }

      if (status === STATUS.SKIPPED) {
        setRun(false);
        localStorage.setItem(TOUR_SKIPPED_KEY, "true");
        localStorage.removeItem(TOUR_AUTH_PENDING_KEY);
        localStorage.removeItem(TOUR_LAST_STEP_KEY);
        localStorage.removeItem(TOUR_IN_PROGRESS_KEY);
        localStorage.removeItem(TOUR_STORAGE_KEY);
      }
    },
    [steps, locale, router, isAuthenticated],
  );

  // Public method to restart tour
  const restartTour = useCallback((): void => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    localStorage.removeItem(TOUR_SKIPPED_KEY);
    localStorage.removeItem(TOUR_AUTH_PENDING_KEY);
    localStorage.removeItem(TOUR_LAST_STEP_KEY);
    localStorage.removeItem(TOUR_IN_PROGRESS_KEY);
    setSteps(tourSteps);
    setStepIndex(0);
    localStorage.setItem(TOUR_IN_PROGRESS_KEY, "true");
    localStorage.setItem(TOUR_LAST_STEP_KEY, "0");
    setRun(true);
  }, [tourSteps]);

  // Expose restart method via window for debugging
  useEffect(() => {
    (
      window as Window & { restartWelcomeTour?: () => void }
    ).restartWelcomeTour = restartTour;
    return (): void => {
      delete (window as Window & { restartWelcomeTour?: () => void })
        .restartWelcomeTour;
    };
  }, [restartTour]);

  if (!run || steps.length === 0) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      disableScrolling={false}
      disableOverlayClose
      spotlightClicks
      styles={{
        options: {
          primaryColor: TOUR_COLORS.PRIMARY,
          zIndex: TOUR_SPACING.Z_INDEX,
          arrowColor: TOUR_COLORS.BACKGROUND,
          backgroundColor: TOUR_COLORS.BACKGROUND,
          textColor: TOUR_COLORS.TEXT,
        },
        tooltip: {
          borderRadius: TOUR_SPACING.TOOLTIP_BORDER_RADIUS,
          padding: TOUR_SPACING.TOOLTIP_PADDING,
        },
        tooltipContainer: {
          textAlign: TOUR_TEXT_ALIGN.LEFT,
        },
        buttonNext: {
          backgroundColor: TOUR_COLORS.PRIMARY,
          borderRadius: TOUR_SPACING.BUTTON_BORDER_RADIUS,
          padding: TOUR_SPACING.BUTTON_PADDING,
          fontSize: TOUR_SPACING.BUTTON_FONT_SIZE,
          fontWeight: TOUR_SPACING.BUTTON_FONT_WEIGHT,
        },
        buttonBack: {
          color: TOUR_COLORS.MUTED,
          marginRight: TOUR_SPACING.BUTTON_MARGIN_RIGHT,
        },
        buttonSkip: {
          color: TOUR_COLORS.MUTED,
        },
      }}
      locale={getJoyrideLabels(t)}
    />
  );
}

// Hook to manage tour state
export function useWelcomeTour(): {
  hasSeenTour: boolean;
  markTourComplete: () => void;
  resetTour: () => void;
} {
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    setHasSeenTour(tourCompleted === "true");
  }, []);

  const markTourComplete = useCallback((): void => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setHasSeenTour(true);
  }, []);

  const resetTour = useCallback((): void => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    localStorage.removeItem(TOUR_SKIPPED_KEY);
    localStorage.removeItem(TOUR_AUTH_PENDING_KEY);
    localStorage.removeItem(TOUR_LAST_STEP_KEY);
    localStorage.removeItem(TOUR_IN_PROGRESS_KEY);
    setHasSeenTour(false);
    const win = window as Window & { restartWelcomeTour?: () => void };
    if (win.restartWelcomeTour) {
      win.restartWelcomeTour();
    }
  }, []);

  return {
    hasSeenTour,
    markTourComplete,
    resetTour,
  };
}
