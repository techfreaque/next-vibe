"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { scopedTranslation } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

interface WelcomeStepProps {
  onContinue: () => void;
  locale: CountryLanguage;
}

export function WelcomeStep({
  onContinue,
  locale,
}: WelcomeStepProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <Div className="text-center mb-6 shrink-0">
        <Div className="flex justify-center mb-4">
          <Sparkles className="h-12 w-12 text-primary" />
        </Div>
        <H3 className="text-xl font-bold mb-2">
          {t("onboarding.welcome.title")}
        </H3>
      </Div>

      {/* Story content */}
      <Div className="bg-muted/50 rounded-xl p-5 mb-6 shrink-0">
        <Div className="space-y-4 text-sm text-muted-foreground">
          <P>{t("onboarding.welcome.line1")}</P>
          <P>{t("onboarding.welcome.line2")}</P>
          <P className="font-medium text-foreground">
            {t("onboarding.welcome.line3")}
          </P>
        </Div>
      </Div>

      {/* Continue */}
      <Div className="shrink-0">
        <Button
          type="button"
          className="w-full h-11 text-base gap-2"
          onClick={onContinue}
        >
          {t("onboarding.welcome.continue")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Div>
    </Div>
  );
}
