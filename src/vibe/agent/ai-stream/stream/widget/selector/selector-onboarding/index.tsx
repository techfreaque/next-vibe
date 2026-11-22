"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useCallback, useEffect, useState } from "react";

import { useModelSelectorState } from "../../../../../chat/model-selector-state";
import { useArrivalStore } from "./arrival-store";
import { SetupStep } from "./setup-step";
import { SignInStep } from "./signin-step";
import { trackOnboarding } from "./track";

type OnboardingStep = "signin" | "setup";

interface SelectorOnboardingProps {
  locale: CountryLanguage;
  onDone: () => void;
}

/**
 * First-run setup shown inside the selector when the user has no favorites.
 * Guests see a sign-in gate first (it converts before they try the product),
 * then the setup screen. Signed-in users skip straight to setup. A skill the
 * visitor arrived with (skill landing page) goes through the same steps and
 * is shown preselected on the setup screen.
 */
export function SelectorOnboarding({
  locale,
  onDone,
}: SelectorOnboardingProps): JSX.Element {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const setOnboardingOpen = useModelSelectorState((s) => s.setOnboardingOpen);

  // Other one-time dialogs (18+ consent) wait while the setup is up.
  // (Dismissal is decided by the controller when the selector closes.)
  useEffect(() => {
    setOnboardingOpen(true);
    const pendingAtStart = useArrivalStore.getState().pendingSkillId;
    trackOnboarding(logger, "shown", {
      mode: pendingAtStart ? "arrival" : "full",
      arrivalSkillId: pendingAtStart ?? undefined,
    });
    return (): void => {
      setOnboardingOpen(false);
    };
  }, [setOnboardingOpen, logger]);

  const [step, setStep] = useState<OnboardingStep>(
    user.isPublic ? "signin" : "setup",
  );

  const goToSetup = useCallback(() => {
    setStep("setup");
  }, []);

  if (step === "signin") {
    return <SignInStep locale={locale} onContinue={goToSetup} />;
  }

  return <SetupStep locale={locale} onDone={onDone} />;
}
