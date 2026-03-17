"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Link } from "next-vibe-ui/ui/link";
import { H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { scopedTranslation } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

interface GuestStepProps {
  onContinue: () => void;
  onBack: () => void;
  locale: CountryLanguage;
}

export function GuestStep({
  onContinue,
  onBack,
  locale,
}: GuestStepProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col p-6 overflow-y-auto">
      {/* Back button */}
      <Div className="mb-2 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground px-0 h-8"
          onClick={onBack}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("onboarding.back")}
        </Button>
      </Div>

      {/* Header */}
      <Div className="text-center mb-5 shrink-0">
        <Div className="flex justify-center mb-3">
          <AlertTriangle className="h-10 w-10 text-amber-500" />
        </Div>
        <H3 className="text-lg font-bold mb-1">
          {t("onboarding.guest.title")}
        </H3>
      </Div>

      {/* Warning box */}
      <Div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-5 shrink-0">
        <Div className="space-y-3 text-sm">
          <P className="text-foreground">{t("onboarding.guest.line1")}</P>
          <P className="text-muted-foreground">{t("onboarding.guest.line2")}</P>
        </Div>
      </Div>

      {/* Sign in CTA */}
      <Div className="mb-3 shrink-0">
        <Button type="button" className="w-full h-11 text-base gap-2" asChild>
          <Link href={`/${locale}/user/signup`}>
            <LogIn className="h-4 w-4" />
            {t("onboarding.guest.signIn")}
          </Link>
        </Button>
      </Div>

      {/* Continue anyway */}
      <Div className="shrink-0">
        <Button
          type="button"
          variant="ghost"
          className="w-full h-10 text-sm gap-2 text-muted-foreground"
          onClick={onContinue}
        >
          {t("onboarding.guest.continueAnyway")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Div>

      {/* Note */}
      <P className="text-xs text-muted-foreground text-center mt-3 shrink-0">
        {t("onboarding.guest.note")}
      </P>
    </Div>
  );
}
