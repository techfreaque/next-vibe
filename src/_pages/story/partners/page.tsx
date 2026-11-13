import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Details } from "next-vibe/ui/components/details";
import { Div } from "next-vibe/ui/components/div";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Video } from "next-vibe/ui/components/icons/Video";
import { Span } from "next-vibe/ui/components/span";
import { Summary } from "next-vibe/ui/components/summary";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { getReferralParams } from "@/_pages/user/(account)/referral/i18n/utils";
import { configScopedTranslation } from "@/env/i18n";

import {
  Cta,
  CtaBand,
  FeatureCard,
  FeatureGrid,
  PageHero,
  PageSection,
  StatGrid,
  Step,
  StepList,
} from "../_shared/marketing";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

const TERM_ROWS = [
  "commission",
  "duration",
  "cap",
  "hold",
  "payout",
  "minimum",
  "second",
  "tracking",
] as const;

const FAQ_IDS = [
  "audience",
  "counts",
  "attribution",
  "placements",
  "refunds",
  "payout",
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const referral = getReferralParams(locale);
  return metadataGenerator(locale, {
    path: "story/partners",
    title: t("meta.title", { appName, ...referral }),
    category: t("meta.category"),
    description: t("meta.description", { appName, ...referral }),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
}

export interface PartnersPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<PartnersPageData> {
  const { locale } = await params;
  return { locale };
}

export function TanstackPage({ locale }: PartnersPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  // Every number derives from REFERRAL_CONFIG - never hardcode a percentage.
  const referral = getReferralParams(locale);
  const referralPath = `/${locale}/user/referral`;
  // Logged out: sign up, then land on the referral page.
  // Logged in: the signup page forwards straight to the callback.
  const joinHref = `/${locale}/user/signup?callbackUrl=${encodeURIComponent(referralPath)}`;

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        eyebrowIcon={TrendingUp}
        title={t("hero.title")}
        subtitle={t("hero.subtitle", referral)}
        actions={
          <>
            <Cta href={joinHref} label={t("hero.ctaPrimary")} />
            <Cta
              href="#terms"
              label={t("hero.ctaSecondary")}
              variant="secondary"
            />
          </>
        }
      >
        <StatGrid
          items={[
            { value: referral.directPct, label: t("facts.commission") },
            { value: t("facts.capValue"), label: t("facts.cap") },
            { value: t("facts.holdValue", referral), label: t("facts.hold") },
            { value: referral.minPayout, label: t("facts.minPayout") },
          ]}
        />
      </PageHero>

      <PageSection
        label={t("audience.label")}
        title={t("audience.title")}
        intro={t("audience.intro")}
      >
        <FeatureGrid columns={3}>
          <FeatureCard icon={Video} title={t("audience.creators.title")}>
            {t("audience.creators.body")}
          </FeatureCard>
          <FeatureCard icon={Mail} title={t("audience.newsletters.title")}>
            {t("audience.newsletters.body")}
          </FeatureCard>
          <FeatureCard icon={Layers} title={t("audience.directories.title")}>
            {t("audience.directories.body")}
          </FeatureCard>
        </FeatureGrid>
      </PageSection>

      <PageSection
        tone="muted"
        label={t("steps.label")}
        title={t("steps.title")}
        intro={t("steps.intro")}
      >
        <Div className="max-w-3xl">
          <StepList>
            <Step
              number={1}
              title={t("steps.step1.title")}
              description={t("steps.step1.body")}
            />
            <Step
              number={2}
              title={t("steps.step2.title")}
              description={t("steps.step2.body")}
            />
            <Step
              number={3}
              title={t("steps.step3.title")}
              description={t("steps.step3.body")}
            />
            <Step
              number={4}
              title={t("steps.step4.title")}
              description={t("steps.step4.body", referral)}
            />
          </StepList>
        </Div>
      </PageSection>

      <PageSection
        id="terms"
        label={t("terms.label")}
        title={t("terms.title")}
        intro={t("terms.intro")}
      >
        <Div className="max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          {TERM_ROWS.map((row, index) => (
            <Div
              key={row}
              data-term={row}
              className={
                index === 0
                  ? "grid gap-1 border-b border-border bg-primary/5 px-4 py-4 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-6 md:px-6"
                  : "grid gap-1 border-b border-border px-4 py-4 last:border-b-0 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-6 md:px-6"
              }
            >
              <Span
                className={
                  index === 0
                    ? "text-sm font-semibold text-primary"
                    : "text-sm font-semibold text-foreground"
                }
              >
                {t(`terms.rows.${row}.term`)}
              </Span>
              <Span className="text-sm leading-relaxed text-muted-foreground">
                {t(`terms.rows.${row}.value`, referral)}
              </Span>
            </Div>
          ))}
        </Div>
      </PageSection>

      <PageSection
        tone="muted"
        label={t("product.label")}
        title={t("product.title")}
        intro={t("product.intro")}
      >
        <FeatureGrid columns={3}>
          <FeatureCard icon={MessageSquare} title={t("product.choice.title")}>
            {t("product.choice.body")}
          </FeatureCard>
          <FeatureCard icon={Shield} title={t("product.control.title")}>
            {t("product.control.body")}
          </FeatureCard>
          <FeatureCard icon={Sparkles} title={t("product.free.title")}>
            {t("product.free.body")}
          </FeatureCard>
        </FeatureGrid>
      </PageSection>

      <PageSection label={t("faq.label")} title={t("faq.title")}>
        <Div className="flex max-w-3xl flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQ_IDS.map((id) => (
            <Details
              key={id}
              className="group px-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <Summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-medium">
                {t(`faq.items.${id}.q`)}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </Summary>
              <P className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {t(`faq.items.${id}.a`, referral)}
              </P>
            </Details>
          ))}
        </Div>
      </PageSection>

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle", referral)}
        actions={
          <>
            <Cta href={joinHref} label={t("cta.primary")} />
            <Cta
              href={`/${locale}/story/earn`}
              label={t("cta.secondary")}
              icon={BookOpen}
              variant="secondary"
            />
          </>
        }
      />
    </Div>
  );
}

export default async function PartnersPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
