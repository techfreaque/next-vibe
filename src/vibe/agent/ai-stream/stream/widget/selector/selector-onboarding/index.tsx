"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { useWidgetUser } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useCallback, useState } from "react";

import { SetupStep } from "./setup-step";
import { SignInStep } from "./signin-step";

type OnboardingStep = "signin" | "setup";

interface SelectorOnboardingProps {
  locale: CountryLanguage;
  onDone: (firstCompanionId: string | null) => void;
}

/**
 * First-run setup shown inside the selector when the user has no favorites.
 * Guests see a sign-in gate first (it converts before they try the product),
 * then the setup screen. Signed-in users skip straight to setup.
 */
export function SelectorOnboarding({
  locale,
  onDone,
}: SelectorOnboardingProps): JSX.Element {
  const user = useWidgetUser();

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
