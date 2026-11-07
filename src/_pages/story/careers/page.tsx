import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Activity } from "next-vibe/ui/components/icons/Activity";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Building } from "next-vibe/ui/components/icons/Building";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Code } from "next-vibe/ui/components/icons/Code";
import { Cpu } from "next-vibe/ui/components/icons/Cpu";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { Plug } from "next-vibe/ui/components/icons/Plug";
import { Settings } from "next-vibe/ui/components/icons/Settings";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

import {
  Callout,
  CardLink,
  Cta,
  CtaBand,
  FeatureCard,
  FeatureGrid,
  PageHero,
  PageSection,
} from "../_shared/marketing";
import { scopedTranslation } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    title: t("meta.title", { appName }),
    description: t("meta.description"),
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle", { appName }),
        description: t("meta.ogDescription"),
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/story/careers`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: t("meta.twitterTitle", { appName }),
        description: t("meta.twitterDescription"),
      },
    },
    path: "story/careers",
    category: t("meta.category"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/careers-hero.jpg`,
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
}

export interface CareersPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<CareersPageData> {
  const { locale } = await params;
  return { locale };
}

const AUDIENCE = [
  { key: "freelancers", icon: Users },
  { key: "businessDevs", icon: Building },
  { key: "industrialDevs", icon: Cpu },
  { key: "enterpriseDevs", icon: Layers },
] as const;

const USE_CASES = [
  { key: "erpIntegration", icon: Plug },
  { key: "desktopAutomation", icon: Monitor },
  { key: "productionLine", icon: Settings },
  { key: "autopilotScheduling", icon: Clock },
  { key: "vibeSenseMonitoring", icon: Activity },
  { key: "skillEconomy", icon: TrendingUp },
] as const;

const SURFACE_KEYS = ["web", "cli", "mcp", "native", "cron", "ai"] as const;

export function TanstackPage({ locale }: CareersPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        eyebrowIcon={Code}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        actions={
          <>
            <Cta
              href={`/${locale}/story/framework`}
              label={t("hero.ctaPrimary")}
            />
            <Cta
              href={`${GITHUB_REPO_URL}/blob/main/docs/README.md`}
              label={t("hero.ctaSecondary")}
              icon={BookOpen}
              variant="secondary"
              external
            />
          </>
        }
      />

      {/* Architecture */}
      <PageSection
        title={t("architecture.title")}
        intro={t("architecture.subtitle")}
      >
        <Div className="rounded-2xl border border-border bg-card p-6 shadow-xs md:p-10">
          <Div className="flex flex-wrap gap-2">
            {SURFACE_KEYS.map((key) => (
              <Span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
              >
                <Check className="h-3.5 w-3.5" />
                {t(`architecture.surfaces.${key}`)}
              </Span>
            ))}
          </Div>
          <P className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {t("architecture.description")}
          </P>
        </Div>
      </PageSection>

      {/* Audience */}
      <PageSection tone="muted" title={t("audience.title")}>
        <FeatureGrid columns={4}>
          {AUDIENCE.map(({ key, icon }) => (
            <FeatureCard
              key={key}
              icon={icon}
              title={t(`audience.items.${key}.title`)}
            >
              {t(`audience.items.${key}.description`)}
            </FeatureCard>
          ))}
        </FeatureGrid>
      </PageSection>

      {/* Use cases */}
      <PageSection title={t("useCases.title")}>
        <FeatureGrid columns={3}>
          {USE_CASES.map(({ key, icon }) => (
            <FeatureCard
              key={key}
              icon={icon}
              title={t(`useCases.items.${key}.title`)}
            >
              {t(`useCases.items.${key}.description`)}
            </FeatureCard>
          ))}
        </FeatureGrid>
        <Callout icon={TrendingUp} className="mt-6 md:mt-8">
          <Span className="font-semibold">{t("referral.title")}</Span>{" "}
          <Span className="text-muted-foreground">
            {t("referral.description")}
          </Span>
          <Div className="mt-2">
            <CardLink
              href={`/${locale}/story/earn`}
              label={t("referral.cta")}
            />
          </Div>
        </Callout>
      </PageSection>

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        actions={
          <>
            <Cta href={`/${locale}/threads`} label={t("cta.primary")} />
            <Cta
              href={`/${locale}/story/blog`}
              label={t("cta.secondary")}
              variant="secondary"
            />
          </>
        }
      />
    </Div>
  );
}

export default async function CareersPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
