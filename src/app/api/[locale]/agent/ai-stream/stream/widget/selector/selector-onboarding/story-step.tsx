"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { P } from "next-vibe-ui/ui/typography";
import { H3 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface StoryStepProps {
  onContinue: () => void;
  locale: CountryLanguage;
}

export function StoryStep({ onContinue, locale }: StoryStepProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Div className="flex flex-col p-6 overflow-y-auto">
      {/* Wave emoji header */}
      <Div className="text-center mb-6 shrink-0">
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        <Div className="text-5xl mb-4">{"\uD83D\uDC4B"}</Div>
        <H3 className="text-xl font-bold mb-2">
          {t("app.chat.onboarding.story.title")}
        </H3>
      </Div>

      {/* Story content */}
      <Div className="bg-muted/50 rounded-xl p-5 mb-6 shrink-0">
        <Div className="space-y-4 text-sm text-muted-foreground">
          <P>{t("app.chat.onboarding.story.line1")}</P>
          <P>{t("app.chat.onboarding.story.line2")}</P>
          <P className="font-medium text-foreground">
            {t("app.chat.onboarding.story.line3")}
          </P>
        </Div>
      </Div>

      {/* Continue button */}
      <Div className="shrink-0">
        <Button
          type="button"
          className="w-full h-11 text-base gap-2"
          onClick={onContinue}
        >
          {t("app.chat.onboarding.story.continue")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Div>
    </Div>
  );
}
