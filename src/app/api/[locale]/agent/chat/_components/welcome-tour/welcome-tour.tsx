"use client";
/* eslint-disable react-compiler/react-compiler -- Complex mount-only effect requires intentional dependency exclusion */

import { useRouter } from "next-vibe-ui/hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { CallBackProps } from "react-joyride";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";

import { buildFolderUrl } from "@/app/[locale]/chat/lib/utils/navigation";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useSidebarFooterStore } from "../sidebar/footer/store";
import type { TourStepConfig } from "./tour-config";
import {
  getJoyrideLabels,
  getNewChatUrl,
  getTourSelector,
  getTourSteps,
  TOUR_AUTH_PENDING_KEY,
  TOUR_COLORS,
  TOUR_DATA_ATTRS,
  TOUR_IN_PROGRESS_KEY,
  TOUR_LAST_STEP_KEY,
  TOUR_SKIPPED_KEY,
  TOUR_SPACING,
  TOUR_STORAGE_KEY,
  TOUR_TEXT_ALIGN,
} from "./tour-config";
import { useTourState } from "./tour-state-context";

// Model selector step index (step after welcome)
const MODEL_SELECTOR_STEP_INDEX = 1;

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
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const { sidebarCollapsed, setSidebarCollapsed } = useChatContext();

  // Tour state management
  const setTourActive = useTourState((state) => state.setTourActive);
  const setModelSelectorOpen = useTourState(
    (state) => state.setModelSelectorOpen,
  );
  const setAdvanceTour = useTourState((state) => state.setAdvanceTour);
  const modelSelectorOpen = useTourState((state) => state.modelSelectorOpen);

  // Sidebar footer state (for expanding bottom sheet during tour)
  const setBottomSheetExpanded = useSidebarFooterStore(
    (state) => state.setBottomSheetExpanded,
  );

  // Ref to track if we're waiting for selector to close
  const waitingForSelectorRef = useRef(false);

  // Track if we're waiting for bottom sheet to expand
  const [waitingForBottomSheet, setWaitingForBottomSheet] = useState(false);
  const pendingStepIndexRef = useRef<number | null>(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 930);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return (): void => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get tour steps with translations
  const tourSteps = getTourSteps(t, isAuthenticated);

  // Initialize tour on mount - uses empty deps intentionally as this should only run once
  /* eslint-disable react-hooks/exhaustive-deps */
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
      const resumeStep = tourSteps[lastStepIndex];

      if (resumeStep?.target) {
        const target = resumeStep.target as string;

        // Ensure sidebar is open if resuming on a sidebar step
        if (isSidebarTarget(target)) {
          ensureSidebarOpen();
        } else if (isMobile && target !== "body") {
          // On mobile, collapse sidebar for non-body, non-sidebar steps
          setSidebarCollapsed(true);
        }
      }

      setSteps(tourSteps);
      setStepIndex(lastStepIndex);
      setTourActive(true);
      setTimeout(() => setRun(true), 500);
      return;
    }

    // Start fresh tour
    if (autoStart) {
      // On mobile, collapse sidebar for the initial "body" step
      if (isMobile) {
        setSidebarCollapsed(true);
      }

      setSteps(tourSteps);
      setStepIndex(0);
      setTourActive(true);
      localStorage.setItem(TOUR_IN_PROGRESS_KEY, "true");
      localStorage.setItem(TOUR_LAST_STEP_KEY, "0");
      // Small delay to ensure DOM is ready
      setTimeout(() => setRun(true), 500);
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Helper to check if a target is a sidebar element
  const isSidebarTarget = useCallback((target: string): boolean => {
    return (
      target === getTourSelector(TOUR_DATA_ATTRS.ROOT_FOLDERS) ||
      target === getTourSelector(TOUR_DATA_ATTRS.INCOGNITO_FOLDER) ||
      target === getTourSelector(TOUR_DATA_ATTRS.PUBLIC_FOLDER) ||
      target === getTourSelector(TOUR_DATA_ATTRS.PRIVATE_FOLDER) ||
      target === getTourSelector(TOUR_DATA_ATTRS.SHARED_FOLDER) ||
      target === getTourSelector(TOUR_DATA_ATTRS.NEW_CHAT_BUTTON) ||
      target === getTourSelector(TOUR_DATA_ATTRS.SIDEBAR_LOGIN) ||
      target === getTourSelector(TOUR_DATA_ATTRS.SUBSCRIPTION_BUTTON)
    );
  }, []);

  // Helper to check if a target needs the bottom sheet expanded
  const needsBottomSheetExpanded = useCallback((target: string): boolean => {
    return (
      target === getTourSelector(TOUR_DATA_ATTRS.SIDEBAR_LOGIN) ||
      target === getTourSelector(TOUR_DATA_ATTRS.SUBSCRIPTION_BUTTON)
    );
  }, []);

  // Helper to ensure sidebar is open
  const ensureSidebarOpen = useCallback((): void => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  }, [sidebarCollapsed, setSidebarCollapsed]);

  // Advance to next step
  const goToNextStep = useCallback((): void => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setStepIndex(nextIndex);
      localStorage.setItem(TOUR_LAST_STEP_KEY, nextIndex.toString());
    }
  }, [stepIndex, steps.length]);

  // Register advanceTour callback so Selector can call it
  useEffect(() => {
    if (run) {
      setAdvanceTour(() => goToNextStep);
    }
    return (): void => {
      setAdvanceTour(null);
    };
  }, [run, setAdvanceTour, goToNextStep]);

  // Pause/resume tour based on selector state
  // When selector is open during tour step 2, hide the tooltip
  useEffect(() => {
    // Handle both: clicking "Next" on step 2 (sets waitingForSelectorRef)
    // AND clicking the selector directly during step 2
    const isOnSelectorStep = stepIndex === MODEL_SELECTOR_STEP_INDEX;

    if (modelSelectorOpen && isOnSelectorStep && run) {
      // Selector opened during step 2 - pause tour (hide tooltip)
      waitingForSelectorRef.current = true;
      setRun(false);
    } else if (!modelSelectorOpen && waitingForSelectorRef.current) {
      // Selector closed - resume tour and advance
      waitingForSelectorRef.current = false;
      goToNextStep();
      // Small delay to ensure step index updates before showing tooltip
      setTimeout(() => setRun(true), 100);
    }
  }, [modelSelectorOpen, stepIndex, run, goToNextStep]);

  // Resume tour after bottom sheet animation completes
  useEffect(() => {
    if (waitingForBottomSheet && pendingStepIndexRef.current !== null) {
      // Wait for collapsible animation to complete (~300ms)
      const timer = setTimeout(() => {
        setStepIndex(pendingStepIndexRef.current!);
        localStorage.setItem(
          TOUR_LAST_STEP_KEY,
          pendingStepIndexRef.current!.toString(),
        );
        pendingStepIndexRef.current = null;
        setWaitingForBottomSheet(false);
        setRun(true);
      }, 400);

      return (): void => clearTimeout(timer);
    }
  }, [waitingForBottomSheet]);

  // Helper to navigate based on tour target
  const navigateForTarget = useCallback(
    (target: string): void => {
      if (target === getTourSelector(TOUR_DATA_ATTRS.INCOGNITO_FOLDER)) {
        router.push(buildFolderUrl(locale, DefaultFolderId.INCOGNITO, null));
      } else if (target === getTourSelector(TOUR_DATA_ATTRS.PUBLIC_FOLDER)) {
        router.push(buildFolderUrl(locale, DefaultFolderId.PUBLIC, null));
      } else if (target === getTourSelector(TOUR_DATA_ATTRS.PRIVATE_FOLDER)) {
        router.push(buildFolderUrl(locale, DefaultFolderId.PRIVATE, null));
      } else if (target === getTourSelector(TOUR_DATA_ATTRS.SHARED_FOLDER)) {
        router.push(buildFolderUrl(locale, DefaultFolderId.SHARED, null));
      } else if (target === getTourSelector(TOUR_DATA_ATTRS.NEW_CHAT_BUTTON)) {
        const folderId = isAuthenticated
          ? DefaultFolderId.PRIVATE
          : DefaultFolderId.INCOGNITO;
        router.push(buildFolderUrl(locale, folderId, null));
      } else if (target === getTourSelector(TOUR_DATA_ATTRS.CHAT_INPUT)) {
        // Chat input requires a thread page, not folder page
        const folderId = isAuthenticated
          ? DefaultFolderId.PRIVATE
          : DefaultFolderId.INCOGNITO;
        router.push(getNewChatUrl(locale, folderId));
      }
    },
    [router, locale, isAuthenticated],
  );

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, type, action, index } = data;

      // Handle STEP_BEFORE - prepare for the step
      if (type === EVENTS.STEP_BEFORE) {
        const currentStep = steps[index];
        if (currentStep?.target) {
          const target = currentStep.target as string;

          // If this step needs sidebar, ensure it's open
          if (isSidebarTarget(target)) {
            ensureSidebarOpen();
          }

          // If this step needs bottom sheet expanded, expand it
          if (needsBottomSheetExpanded(target)) {
            setBottomSheetExpanded(true);
          } else {
            setBottomSheetExpanded(false);
          }
        }
        return;
      }

      // Handle TARGET_NOT_FOUND
      if (type === EVENTS.TARGET_NOT_FOUND) {
        const currentStep = steps[index];
        if (currentStep?.target) {
          const target = currentStep.target as string;

          // Try to open sidebar if needed
          if (isSidebarTarget(target)) {
            ensureSidebarOpen();
          }

          // Try to expand bottom sheet if needed
          if (needsBottomSheetExpanded(target)) {
            setBottomSheetExpanded(true);
          }
        }
        return;
      }

      // Handle step changes
      if (type === EVENTS.STEP_AFTER) {
        if (action === ACTIONS.NEXT) {
          // Special handling for MODEL_SELECTOR step
          // When user clicks "Next" on this step, open the selector and wait for it to close
          if (index === MODEL_SELECTOR_STEP_INDEX) {
            // Open the selector modal
            setModelSelectorOpen(true);
            // Mark that we're waiting for the selector to close
            waitingForSelectorRef.current = true;
            // Don't advance - the selector will call advanceTour when done
            return;
          }

          const nextIndex = index + 1;
          const nextStep = steps[nextIndex];

          if (nextStep?.target) {
            const target = nextStep.target as string;

            // Get current step info
            const currentStepData = steps[index];
            const currentTarget = currentStepData?.target as string | undefined;

            // Check if we're transitioning between sidebar and non-sidebar targets
            const currentIsSidebar = currentTarget
              ? isSidebarTarget(currentTarget)
              : false;
            const nextIsSidebar = isSidebarTarget(target);

            // Handle sidebar state transitions
            if (currentIsSidebar !== nextIsSidebar) {
              if (isMobile) {
                if (nextIsSidebar) {
                  ensureSidebarOpen();
                } else if (!sidebarCollapsed) {
                  setSidebarCollapsed(true);
                }
              } else if (nextIsSidebar) {
                ensureSidebarOpen();
              }
            }

            // Navigate to appropriate folder
            navigateForTarget(target);

            // If next step needs bottom sheet, expand it and wait
            if (needsBottomSheetExpanded(target)) {
              setBottomSheetExpanded(true);
              pendingStepIndexRef.current = nextIndex;
              setWaitingForBottomSheet(true);
              setRun(false);
              return;
            }
          }

          // Advance step
          setStepIndex(nextIndex);
          localStorage.setItem(TOUR_LAST_STEP_KEY, nextIndex.toString());
        } else if (action === ACTIONS.PREV) {
          const prevIndex = index - 1;
          const prevStep = steps[prevIndex];

          if (prevStep?.target) {
            const target = prevStep.target as string;

            // Handle sidebar state for mobile
            if (isMobile) {
              if (isSidebarTarget(target)) {
                ensureSidebarOpen();
              } else if (!sidebarCollapsed) {
                setSidebarCollapsed(true);
              }
            } else if (isSidebarTarget(target)) {
              ensureSidebarOpen();
            }

            // Navigate to appropriate folder
            navigateForTarget(target);

            // Handle bottom sheet state
            if (needsBottomSheetExpanded(target)) {
              // Keep it expanded if going back to a bottom sheet step
              setBottomSheetExpanded(true);
            } else {
              // Close bottom sheet if leaving bottom sheet steps
              setBottomSheetExpanded(false);
            }
          }

          // Go back
          setStepIndex(prevIndex);
          localStorage.setItem(TOUR_LAST_STEP_KEY, prevIndex.toString());
        }
      }

      // Handle tour completion
      if (status === STATUS.FINISHED) {
        setRun(false);
        setTourActive(false);
        setModelSelectorOpen(false);
        setBottomSheetExpanded(false);
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

      // Handle tour skip
      if (status === STATUS.SKIPPED) {
        setRun(false);
        setTourActive(false);
        setModelSelectorOpen(false);
        setBottomSheetExpanded(false);
        localStorage.setItem(TOUR_SKIPPED_KEY, "true");
        localStorage.removeItem(TOUR_AUTH_PENDING_KEY);
        localStorage.removeItem(TOUR_LAST_STEP_KEY);
        localStorage.removeItem(TOUR_IN_PROGRESS_KEY);
        localStorage.removeItem(TOUR_STORAGE_KEY);
      }
    },
    [
      steps,
      locale,
      router,
      isAuthenticated,
      isSidebarTarget,
      ensureSidebarOpen,
      navigateForTarget,
      isMobile,
      sidebarCollapsed,
      setSidebarCollapsed,
      setTourActive,
      setModelSelectorOpen,
      setBottomSheetExpanded,
      needsBottomSheetExpanded,
    ],
  );

  // Public method to restart tour
  const restartTour = useCallback((): void => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    localStorage.removeItem(TOUR_SKIPPED_KEY);
    localStorage.removeItem(TOUR_AUTH_PENDING_KEY);
    localStorage.removeItem(TOUR_LAST_STEP_KEY);
    localStorage.removeItem(TOUR_IN_PROGRESS_KEY);

    // Close any open modals and reset UI state
    setModelSelectorOpen(false);
    setBottomSheetExpanded(false);

    // Reset tour state
    setSteps(tourSteps);
    setStepIndex(0);
    setTourActive(true);
    localStorage.setItem(TOUR_IN_PROGRESS_KEY, "true");
    localStorage.setItem(TOUR_LAST_STEP_KEY, "0");
    setRun(true);
  }, [tourSteps, setModelSelectorOpen, setTourActive, setBottomSheetExpanded]);

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
          width: "unset",
        },
        overlay: {},
        tooltip: {
          borderRadius: TOUR_SPACING.TOOLTIP_BORDER_RADIUS,
          padding: TOUR_SPACING.TOOLTIP_PADDING,
          maxWidth: "97vw",
          width: "600px",
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
