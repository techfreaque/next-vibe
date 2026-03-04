"use client";

import type { JSX } from "react";
import { useCallback, useState } from "react";

import charactersDefinition from "@/app/api/[locale]/agent/chat/characters/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { useWidgetUser } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { CountryLanguage } from "@/i18n/core/config";

import { SelectorOnboardingProvider } from "./context";
import { PickStep } from "./pick-step";
import { StoryStep } from "./story-step";

type OnboardingStep = "story" | "pick" | "specialists";

interface SelectorOnboardingProps {
  locale: CountryLanguage;
}

export function SelectorOnboarding({
  locale,
}: SelectorOnboardingProps): JSX.Element {
  const user = useWidgetUser();
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("story");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleContinueToTeam = useCallback(() => {
    setOnboardingStep("pick");
  }, []);

  const handleContinueToSpecialists = useCallback(() => {
    setOnboardingStep("specialists");
  }, []);

  if (onboardingStep === "pick") {
    return (
      <PickStep
        selectedId={selectedId}
        locale={locale}
        setSelectedId={setSelectedId}
        onContinue={handleContinueToSpecialists}
      />
    );
  }
  if (onboardingStep === "specialists" && selectedId) {
    return (
      <SelectorOnboardingProvider
        isOnboarding={true}
        companionCharacterId={selectedId}
      >
        <EndpointsPage
          endpoint={charactersDefinition}
          locale={locale}
          user={user}
        />
      </SelectorOnboardingProvider>
    );
  }
  return <StoryStep onContinue={handleContinueToTeam} locale={locale} />;
}
