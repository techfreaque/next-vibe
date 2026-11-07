"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Form } from "next-vibe/ui/components/form/form";
import { CalendarDays } from "next-vibe/ui/components/icons/CalendarDays";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Send } from "next-vibe/ui/components/icons/Send";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { X } from "next-vibe/ui/components/icons/X";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { Input } from "next-vibe/ui/components/input";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import { scrollToTop } from "next-vibe/ui/lib/dom";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";
import { useEffect, useRef } from "react";

import { configScopedTranslation } from "@/env/i18n";
import { useNewsletterManager } from "@/newsletter/hooks";

import {
  Callout,
  CONTAINER,
  CtaBand,
  Eyebrow,
  FeatureCard,
  FeatureGrid,
  PageSection,
} from "../../_shared/marketing";
import { scopedTranslation } from "../i18n";

interface NewsletterPageProps {
  locale: CountryLanguage;
  prefilledEmail?: string;
  user: JwtPayloadType;
  userEmail: string | undefined;
}

export function NewsletterPage({
  locale,
  prefilledEmail,
  user,
  userEmail,
}: NewsletterPageProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  const {
    email,
    setEmail,
    isLoggedIn,
    isSubmitting,
    isUnsubscribing,
    isAnyOperationInProgress,
    notification,
    showConfirmUnsubscribe,
    subscribe,
    unsubscribe,
    isSubscribed,
    handleEmailChange,
  } = useNewsletterManager(user, userEmail);

  // Track if we've already set the prefilled email to prevent infinite loops
  const hasSetPrefilledEmail = useRef(false);
  const lastPrefilledEmail = useRef<string | undefined>(undefined);

  // Set prefilled email when component mounts
  useEffect(() => {
    if (
      prefilledEmail !== undefined &&
      prefilledEmail.length > 0 &&
      !isLoggedIn &&
      !hasSetPrefilledEmail.current &&
      lastPrefilledEmail.current !== prefilledEmail
    ) {
      setEmail(prefilledEmail);
      hasSetPrefilledEmail.current = true;
      lastPrefilledEmail.current = prefilledEmail;
    }
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledEmail, isLoggedIn]);

  const hasPrefilledEmail =
    prefilledEmail !== undefined && prefilledEmail.length > 0;

  const benefits = [
    {
      icon: Sparkles,
      title: t("page.benefits.benefit1.title"),
      description: t("page.benefits.benefit1.description"),
    },
    {
      icon: Zap,
      title: t("page.benefits.benefit2.title"),
      description: t("page.benefits.benefit2.description"),
    },
    {
      icon: MessageSquare,
      title: t("page.benefits.benefit3.title"),
      description: t("page.benefits.benefit3.description"),
    },
    {
      icon: Gift,
      title: t("page.benefits.benefit4.title"),
      description: t("page.benefits.benefit4.description"),
    },
  ];

  const submitLabel = isSubscribed
    ? showConfirmUnsubscribe
      ? t("subscription.unsubscribe.confirmButton")
      : t("subscription.unsubscribe.title")
    : t("page.cta.subscribeButton");

  return (
    <Div className="min-h-screen bg-background">
      {/* Hero + form */}
      <Div className="border-b border-border bg-linear-to-b from-primary/[0.06] via-background to-background">
        <Div
          className={cn(
            CONTAINER,
            "grid items-center gap-10 pt-12 pb-14 md:pt-20 md:pb-24 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16",
          )}
        >
          <Div className="max-w-2xl">
            <Eyebrow icon={Mail}>{t("page.eyebrow", { appName })}</Eyebrow>
            <H1 className="mt-5 text-4xl font-semibold tracking-tight text-balance md:text-6xl md:leading-[1.05]">
              {hasPrefilledEmail
                ? t("page.emailProvided.title")
                : t("page.title", { appName })}
            </H1>
            <P className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
              {hasPrefilledEmail
                ? t("page.emailProvided.description")
                : t("page.heroDescription")}
            </P>
          </Div>

          {/* Newsletter form */}
          <Div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <Form
              onSubmit={() => {
                if (!email.includes("@")) {
                  return;
                }
                if (isSubscribed) {
                  unsubscribe(email);
                } else {
                  subscribe(email);
                }
              }}
              className="flex flex-col gap-3"
            >
              <Input<"email">
                type="email"
                placeholder={t("emailPlaceholder")}
                className="h-12 text-base"
                autoComplete="email"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={handleEmailChange}
                aria-label={t("emailPlaceholder")}
                disabled={isAnyOperationInProgress || isLoggedIn}
                name="email"
                id="newsletter-email-page"
              />

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full gap-2 text-base font-medium"
                variant={
                  isSubscribed
                    ? showConfirmUnsubscribe
                      ? "destructive"
                      : "outline"
                    : "default"
                }
                aria-label={submitLabel}
                disabled={isAnyOperationInProgress}
              >
                {isSubmitting || isUnsubscribing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isSubscribed ? (
                  showConfirmUnsubscribe ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <X className="h-5 w-5" />
                  )
                ) : (
                  <Send className="h-5 w-5" />
                )}
                {submitLabel}
              </Button>

              {notification && (
                <Div
                  className={cn(
                    "rounded-lg border p-3 text-sm",
                    notification.type === "error" &&
                      "border-destructive/30 bg-destructive/10 text-destructive",
                    notification.type === "success" &&
                      "border-success/30 bg-success/10 text-success",
                    notification.type === "info" &&
                      "border-primary/30 bg-primary/10 text-primary",
                    notification.type === "confirm" &&
                      "border-warning/30 bg-warning/10 text-warning",
                  )}
                >
                  {notification.message}
                </Div>
              )}
            </Form>

            <Div className="mt-5 flex flex-col gap-1 border-t border-border pt-4 text-sm text-muted-foreground">
              <Span className="inline-flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                {t("page.privacyNote")}
              </Span>
              <Span>
                {t("page.unsubscribeText")}{" "}
                <Link
                  href={`/${locale}/story/newsletter/unsubscribe`}
                  className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline"
                >
                  {t("page.unsubscribeLink")}
                </Link>
              </Span>
            </Div>
          </Div>
        </Div>
      </Div>

      <PageSection
        title={t("page.benefits.title")}
        intro={t("page.benefits.subtitle")}
      >
        <FeatureGrid columns={4}>
          {benefits.map((benefit) => (
            <FeatureCard
              key={benefit.title}
              icon={benefit.icon}
              title={benefit.title}
            >
              {benefit.description}
            </FeatureCard>
          ))}
        </FeatureGrid>
        <Callout icon={CalendarDays} tone="neutral" className="mt-6 md:mt-8">
          <Span className="font-semibold">{t("page.frequency.title")}</Span>{" "}
          <Span className="text-muted-foreground">
            {t("page.frequency.description")}
          </Span>
        </Callout>
      </PageSection>

      <CtaBand
        title={t("page.cta.title")}
        subtitle={t("page.cta.description")}
        actions={
          <Button
            onClick={() => {
              scrollToTop();
            }}
            size="lg"
            className="h-12 w-full gap-2 px-6 text-base font-medium sm:w-auto"
          >
            <Send className="h-4 w-4" />
            {t("page.cta.subscribeButton")}
          </Button>
        }
      />
    </Div>
  );
}
