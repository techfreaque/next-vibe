"use client";
/* eslint-disable react-compiler/react-compiler -- Complex mount-only effect requires intentional dependency exclusion */

import { useRouter } from "next-vibe-ui/hooks";
import React, { useCallback, useEffect, useState } from "react";
import type { CallBackProps } from "react-joyride";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";

import { buildFolderUrl } from "@/app/[locale]/chat/lib/utils/navigation";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
  const setPersonaSelectorOpen = useTourState(
    (state) => state.setPersonaSelectorOpen,
  );
  const setModelSelectorShowAll = useTourState(
    (state) => state.setModelSelectorShowAll,
  );
  const setPersonaSelectorShowAll = useTourState(
    (state) => state.setPersonaSelectorShowAll,
  );

  // Helper to check if the correct modal is actually open
  const isCorrectModalOpen = useCallback(
    (requiredType: "model" | "persona" | null): boolean => {
      if (!requiredType) {
        // No modal required - check that no modal is open
        return !document.querySelector("[role='dialog']");
      }

      // Modal required - check if correct modal is open
      const modalDialog = document.querySelector("[role='dialog']");
      if (!modalDialog) {
        return false;
      }

      // Check if the modal contains the expected elements
      // Look for favorites element which is always present (not search which only shows in "Show all" mode)
      if (requiredType === "model") {
        return !!modalDialog.querySelector(
          getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_FAVORITES),
        );
      }
      return !!modalDialog.querySelector(
        getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_FAVORITES),
      );
    },
    [],
  );

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
  // The callbacks used inside (isSidebarTarget, ensureSidebarOpen, etc.) are stable and defined below
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

        // Ensure modal is open if resuming on a modal step
        const requiredModalType = getRequiredModalType(target);
        if (requiredModalType) {
          // Open modal using tour state
          if (requiredModalType === "model") {
            setModelSelectorOpen(true);
          } else {
            setPersonaSelectorOpen(true);
          }

          // If this step requires "show all" mode, enable it
          if (requiresShowAll(target)) {
            if (requiredModalType === "model") {
              setModelSelectorShowAll(true);
            } else {
              setPersonaSelectorShowAll(true);
            }
          }
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
      target === getTourSelector(TOUR_DATA_ATTRS.SIDEBAR_LOGIN)
    );
  }, []);

  // Helper to check if a target is inside model selector modal
  const isModelSelectorModalTarget = useCallback((target: string): boolean => {
    return (
      target === getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_FAVORITES) ||
      target === getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_SHOW_ALL) ||
      target === getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_SEARCH) ||
      target === getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_GROUP)
    );
  }, []);

  // Helper to check if a target is inside persona selector modal
  const isPersonaSelectorModalTarget = useCallback(
    (target: string): boolean => {
      return (
        target ===
          getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_FAVORITES) ||
        target === getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_SHOW_ALL) ||
        target === getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_SEARCH) ||
        target === getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_GROUP)
      );
    },
    [],
  );

  // Helper to check if a target requires "show all" mode
  const requiresShowAll = useCallback((target: string): boolean => {
    return (
      target === getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_SEARCH) ||
      target === getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_GROUP) ||
      target === getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_SEARCH) ||
      target === getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_GROUP)
    );
  }, []);

  // Helper to ensure sidebar is open
  const ensureSidebarOpen = useCallback((): void => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  }, [sidebarCollapsed, setSidebarCollapsed]);

  // Helper to get which modal type a step needs (if any)
  const getRequiredModalType = useCallback(
    (target: string): "model" | "persona" | null => {
      if (isModelSelectorModalTarget(target)) {
        return "model";
      }
      if (isPersonaSelectorModalTarget(target)) {
        return "persona";
      }
      return null;
    },
    [isModelSelectorModalTarget, isPersonaSelectorModalTarget],
  );

  // Helper to open modal using tour state
  const openModal = useCallback(
    async (modalType: "model" | "persona"): Promise<void> => {
      // Set tour state to open the modal
      if (modalType === "model") {
        setModelSelectorOpen(true);
      } else {
        setPersonaSelectorOpen(true);
      }

      // Wait for modal to actually render (poll with timeout)
      const maxAttempts = 20; // 2 seconds max
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
        if (isCorrectModalOpen(modalType)) {
          return;
        }
      }
    },
    [isCorrectModalOpen, setModelSelectorOpen, setPersonaSelectorOpen],
  );

  // Helper to close modal using tour state
  const closeModal = useCallback((): void => {
    setModelSelectorOpen(false);
    setPersonaSelectorOpen(false);
  }, [setModelSelectorOpen, setPersonaSelectorOpen]);

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, type, action, index } = data;

      // Handle STEP_BEFORE - ensure modal is open BEFORE Joyride tries to find target
      if (type === EVENTS.STEP_BEFORE) {
        const currentStep = steps[index];
        if (currentStep?.target) {
          const target = currentStep.target as string;
          const requiredModalType = getRequiredModalType(target);

          // If this step needs a modal, ensure it's open (async but don't wait)
          if (requiredModalType) {
            void openModal(requiredModalType);
          }

          // If this step requires "show all" mode, ensure it's enabled
          if (requiresShowAll(target)) {
            if (requiredModalType === "model") {
              setModelSelectorShowAll(true);
            } else if (requiredModalType === "persona") {
              setPersonaSelectorShowAll(true);
            }
          }

          // If this step needs sidebar, ensure it's open
          if (isSidebarTarget(target)) {
            ensureSidebarOpen();
          }
        }
        return;
      }

      // Handle TARGET_NOT_FOUND - this fires when Joyride can't find the target element
      if (type === EVENTS.TARGET_NOT_FOUND) {
        const currentStep = steps[index];
        if (currentStep?.target) {
          const target = currentStep.target as string;

          // Try to open modal if needed
          const requiredModalType = getRequiredModalType(target);
          if (requiredModalType) {
            void openModal(requiredModalType);
          }

          // Try to open sidebar if needed
          if (isSidebarTarget(target)) {
            ensureSidebarOpen();
          }
        }
        return; // Don't continue to STEP_AFTER logic
      }

      // Handle step changes
      if (type === EVENTS.STEP_AFTER) {
        // Navigate to appropriate folder BEFORE moving to next step
        if (action === ACTIONS.NEXT) {
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

            // Only change sidebar state if transitioning
            if (currentIsSidebar !== nextIsSidebar) {
              if (isMobile) {
                if (nextIsSidebar) {
                  // Transitioning TO sidebar - open it
                  ensureSidebarOpen();
                } else if (!sidebarCollapsed) {
                  // Transitioning FROM sidebar - collapse it
                  setSidebarCollapsed(true);
                }
              } else if (nextIsSidebar) {
                // On desktop, ensure sidebar is open for sidebar targets
                ensureSidebarOpen();
              }
            }

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
            } else if (
              target === getTourSelector(TOUR_DATA_ATTRS.NEW_CHAT_BUTTON)
            ) {
              // Navigate to Private if authenticated, otherwise Incognito
              const folderId = isAuthenticated
                ? DefaultFolderId.PRIVATE
                : DefaultFolderId.INCOGNITO;
              const url = buildFolderUrl(locale, folderId, null);
              router.push(url);
            }

            // Handle modal state for next step
            const nextRequiredModalType = getRequiredModalType(target);
            const currentRequiredModalType = currentTarget
              ? getRequiredModalType(currentTarget)
              : null;

            // Set show all state if needed for next step
            if (requiresShowAll(target)) {
              if (nextRequiredModalType === "model") {
                setModelSelectorShowAll(true);
              } else if (nextRequiredModalType === "persona") {
                setPersonaSelectorShowAll(true);
              }
            }

            // Update modal state - wait for modal to be ready before advancing
            if (
              nextRequiredModalType &&
              nextRequiredModalType !== currentRequiredModalType
            ) {
              // Need to open a different modal
              if (currentRequiredModalType) {
                closeModal(); // Close current modal first
              }
              void openModal(nextRequiredModalType).then(() => {
                setStepIndex(nextIndex);
                localStorage.setItem(TOUR_LAST_STEP_KEY, nextIndex.toString());
                return undefined;
              });
              return; // Don't advance synchronously
            } else if (!nextRequiredModalType && currentRequiredModalType) {
              // Need to close modal
              closeModal();
            } else if (
              nextRequiredModalType === currentRequiredModalType &&
              nextRequiredModalType
            ) {
              // Same modal - ensure it's still open
              void openModal(nextRequiredModalType).then(() => {
                setStepIndex(nextIndex);
                localStorage.setItem(TOUR_LAST_STEP_KEY, nextIndex.toString());
                return undefined;
              });
              return; // Don't advance synchronously
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
                // Open sidebar for sidebar targets
                ensureSidebarOpen();
              } else if (!sidebarCollapsed) {
                // Collapse sidebar for non-sidebar targets on mobile
                setSidebarCollapsed(true);
              }
            } else if (isSidebarTarget(target)) {
              // On desktop, ensure sidebar is open for sidebar targets
              ensureSidebarOpen();
            }

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
            } else if (
              target === getTourSelector(TOUR_DATA_ATTRS.NEW_CHAT_BUTTON)
            ) {
              // Navigate to Private if authenticated, otherwise Incognito
              const folderId = isAuthenticated
                ? DefaultFolderId.PRIVATE
                : DefaultFolderId.INCOGNITO;
              const url = buildFolderUrl(locale, folderId, null);
              router.push(url);
            }

            // Handle modal state for prev step
            const prevRequiredModalType = getRequiredModalType(target);

            // Check current step's modal requirement
            const currentStep = steps[index];
            const currentRequiredModalType = currentStep?.target
              ? getRequiredModalType(currentStep.target as string)
              : null;

            // Update modal state - wait for modal to be ready before going back
            if (
              prevRequiredModalType &&
              prevRequiredModalType !== currentRequiredModalType
            ) {
              // Need to open a different modal
              if (currentRequiredModalType) {
                closeModal(); // Close current modal first
              }
              void openModal(prevRequiredModalType).then(() => {
                setStepIndex(prevIndex);
                localStorage.setItem(TOUR_LAST_STEP_KEY, prevIndex.toString());
                return undefined;
              });
              return; // Don't go back synchronously
            } else if (!prevRequiredModalType && currentRequiredModalType) {
              // Need to close modal
              closeModal();
            } else if (
              prevRequiredModalType === currentRequiredModalType &&
              prevRequiredModalType
            ) {
              // Same modal - ensure it's still open
              void openModal(prevRequiredModalType).then(() => {
                setStepIndex(prevIndex);
                localStorage.setItem(TOUR_LAST_STEP_KEY, prevIndex.toString());
                return undefined;
              });
              return; // Don't go back synchronously
            }
          }

          // Go back
          setStepIndex(prevIndex);
          localStorage.setItem(TOUR_LAST_STEP_KEY, prevIndex.toString());
        }
      }

      // Handle tour completion or closure
      if (status === STATUS.FINISHED) {
        setRun(false);
        setTourActive(false);
        closeModal();
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
        setTourActive(false);
        closeModal();
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
      getRequiredModalType,
      requiresShowAll,
      isMobile,
      sidebarCollapsed,
      setSidebarCollapsed,
      openModal,
      closeModal,
      setTourActive,
      setModelSelectorShowAll,
      setPersonaSelectorShowAll,
    ],
  );

  // Public method to restart tour
  const restartTour = useCallback((): void => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    localStorage.removeItem(TOUR_SKIPPED_KEY);
    localStorage.removeItem(TOUR_AUTH_PENDING_KEY);
    localStorage.removeItem(TOUR_LAST_STEP_KEY);
    localStorage.removeItem(TOUR_IN_PROGRESS_KEY);

    // Close any open modals
    closeModal();

    // Reset tour state
    setSteps(tourSteps);
    setStepIndex(0);
    setTourActive(true);
    localStorage.setItem(TOUR_IN_PROGRESS_KEY, "true");
    localStorage.setItem(TOUR_LAST_STEP_KEY, "0");
    setRun(true);
  }, [tourSteps, closeModal, setTourActive]);

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
