"use client";

import type { JSX } from "react";
import { useCallback, useState } from "react";

import { useWidgetUser } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { CountryLanguage } from "@/i18n/core/config";

import type { BudgetTier } from "./companion-step";
import { CompanionStep } from "./companion-step";
import { GuestStep } from "./guest-step";
import { UsecasesStep } from "./usecases-step";
import { WelcomeStep } from "./welcome-step";

type OnboardingStep = "welcome" | "guest" | "companion" | "usecases";

interface SelectorOnboardingProps {
  locale: CountryLanguage;
  onDone: () => void;
}

export function SelectorOnboarding({
  locale,
  onDone,
}: SelectorOnboardingProps): JSX.Element {
  const user = useWidgetUser();

  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [selectedCompanionId, setSelectedCompanionId] = useState<string | null>(
    null,
  );
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>("brilliant");

  const goToNext = useCallback(
    (current: OnboardingStep) => {
      if (current === "welcome") {
        // Show guest warning only for public (logged-out) users
        setStep(user.isPublic ? "guest" : "companion");
        return;
      }
      if (current === "guest") {
        setStep("companion");
        return;
      }
      if (current === "companion") {
        setStep("usecases");
        return;
      }
    },
    [user.isPublic],
  );

  const goBack = useCallback(
    (current: OnboardingStep) => {
      if (current === "guest") {
        setStep("welcome");
        return;
      }
      if (current === "companion") {
        setStep(user.isPublic ? "guest" : "welcome");
        return;
      }
      if (current === "usecases") {
        setStep("companion");
        return;
      }
    },
    [user.isPublic],
  );

  if (step === "guest") {
    return (
      <GuestStep
        locale={locale}
        onContinue={() => goToNext("guest")}
        onBack={() => goBack("guest")}
      />
    );
  }

  if (step === "companion") {
    return (
      <CompanionStep
        selectedId={selectedCompanionId}
        selectedBudget={selectedBudget}
        locale={locale}
        setSelectedId={setSelectedCompanionId}
        setSelectedBudget={setSelectedBudget}
        onContinue={() => goToNext("companion")}
        onBack={() => goBack("companion")}
      />
    );
  }

  if (step === "usecases" && selectedCompanionId) {
    return (
      <UsecasesStep
        companionId={selectedCompanionId}
        budget={selectedBudget}
        locale={locale}
        onDone={onDone}
        onBack={() => goBack("usecases")}
      />
    );
  }

  return <WelcomeStep locale={locale} onContinue={() => goToNext("welcome")} />;
}
