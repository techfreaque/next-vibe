"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";

import { SetupStep } from "./setup-step";

interface SelectorOnboardingProps {
  locale: CountryLanguage;
  onDone: (firstCompanionId: string | null) => void;
}

/**
 * First-run setup shown inside the selector when the user has no favorites.
 * One screen: companion (preselected) + optional specialists + start.
 */
export function SelectorOnboarding({
  locale,
  onDone,
}: SelectorOnboardingProps): JSX.Element {
  return <SetupStep locale={locale} onDone={onDone} />;
}
