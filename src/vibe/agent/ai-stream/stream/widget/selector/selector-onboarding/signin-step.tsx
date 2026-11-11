"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Cloud } from "next-vibe/ui/components/icons/Cloud";
import { LogIn } from "next-vibe/ui/components/icons/LogIn";
import { Save } from "next-vibe/ui/components/icons/Save";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import { scopedTranslation } from "../../../i18n";

interface SignInStepProps {
  onContinue: () => void;
  locale: CountryLanguage;
}

type BenefitIcon = React.ComponentType<{ className?: string }>;

const BENEFIT_ICONS: BenefitIcon[] = [Cloud, Save, Shield];

/**
 * First-run sign-in gate shown inside the selector for guests only.
 * Signed-in users skip straight to the setup step - this screen never renders
 * for them. Honest value: synced setup, nothing lost on this device, private.
 */
export function SignInStep({
  onContinue,
  locale,
}: SignInStepProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const benefitKeys = ["sync", "keep", "private"] as const;

  return (
    <Div
      className="flex flex-col gap-5 px-5 pt-6 pb-4"
      data-testid="selector-signin"
    >
      {/* Header */}
      <Div className="flex flex-col items-center gap-3 text-center">
        <Div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <LogIn className="h-6 w-6 text-primary" />
        </Div>
        <Div className="flex flex-col gap-1">
          <H3 className="text-lg font-semibold tracking-tight">
            {t("onboarding.signin.title")}
          </H3>
          <P className="text-sm text-muted-foreground leading-snug">
            {t("onboarding.signin.subtitle")}
          </P>
        </Div>
      </Div>

      {/* Benefits */}
      <Div className="flex flex-col gap-2.5">
        {benefitKeys.map((key, index) => {
          const IconComp = BENEFIT_ICONS[index] ?? Cloud;
          return (
            <Div
              key={key}
              className={cn(
                "flex items-start gap-3 rounded-xl border border-border bg-card px-3.5 py-3",
              )}
            >
              <Div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <IconComp className="h-4 w-4 text-primary" />
              </Div>
              <Div className="flex min-w-0 flex-col">
                <Span className="text-sm font-semibold leading-tight">
                  {t(`onboarding.signin.benefits.${key}.title`)}
                </Span>
                <Span className="text-xs text-muted-foreground leading-snug">
                  {t(`onboarding.signin.benefits.${key}.body`)}
                </Span>
              </Div>
            </Div>
          );
        })}
      </Div>

      {/* Primary CTA - sign in / create account */}
      <Div className="flex flex-col gap-2">
        <Button type="button" className="h-11 w-full gap-2 text-base" asChild>
          <Link href={`/${locale}/user/signup`}>
            <LogIn className="h-4 w-4" />
            {t("onboarding.signin.cta")}
          </Link>
        </Button>

        {/* Continue as guest */}
        <Button
          type="button"
          variant="ghost"
          className="h-10 w-full gap-2 text-sm text-muted-foreground"
          onClick={onContinue}
        >
          {t("onboarding.signin.continueAsGuest")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Div>

      <P className="text-center text-xs text-muted-foreground">
        {t("onboarding.signin.note")}
      </P>
    </Div>
  );
}
