import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Card, CardContent, CardHeader } from "next-vibe/ui/components/card";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Link } from "next-vibe/ui/components/link";
import { Separator } from "next-vibe/ui/components/separator";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

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

const SURFACE_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50",
  "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800/50",
  "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800/50",
  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50",
  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50",
  "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50",
] as const;

const AUDIENCE_ICONS = ["🧑‍💻", "🏭", "⚙️", "🏢"] as const;

const USE_CASE_ICONS = ["🔌", "🖥️", "🏗️", "⏱️", "📡", "💸"] as const;

export function TanstackPage({ locale }: CareersPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const audienceKeys = [
    "freelancers",
    "businessDevs",
    "industrialDevs",
    "enterpriseDevs",
  ] as const;

  const caseKeys = [
    "erpIntegration",
    "desktopAutomation",
    "productionLine",
    "autopilotScheduling",
    "vibeSenseMonitoring",
    "skillEconomy",
  ] as const;

  const surfaceKeys = ["web", "cli", "mcp", "native", "cron", "ai"] as const;

  return (
    <Div className="min-h-screen bg-background">
      {/* Hero */}
      <Div className="relative overflow-hidden border-b">
        <Div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        <Div className="container relative mx-auto px-4 pt-20 pb-16 max-w-4xl">
          <Span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            {t("hero.eyebrow")}
          </Span>
          <H1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            {t("hero.title")}
          </H1>
          <P className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
            {t("hero.subtitle")}
          </P>
          <Div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href={`/${locale}/story/blog`}>
                {t("hero.ctaPrimary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/${locale}/story/blog`}>
                {t("hero.ctaSecondary")}
              </Link>
            </Button>
          </Div>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16 max-w-5xl space-y-20">
        {/* Architecture callout */}
        <Div>
          <Div className="text-center mb-8">
            <H2 className="text-2xl md:text-3xl font-bold mb-3">
              {t("architecture.title")}
            </H2>
            <P className="text-muted-foreground">
              {t("architecture.subtitle")}
            </P>
          </Div>
          <Div className="flex flex-wrap justify-center gap-2 mb-6">
            {surfaceKeys.map((key, i) => (
              <Badge
                key={key}
                variant="outline"
                className={`text-sm px-3 py-1 ${SURFACE_COLORS[i % SURFACE_COLORS.length]}`}
              >
                {t(`architecture.surfaces.${key}`)}
              </Badge>
            ))}
          </Div>
          <P className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            {t("architecture.description")}
          </P>
        </Div>

        <Separator />

        {/* Who builds with next-vibe */}
        <Div>
          <H2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t("audience.title")}
          </H2>
          <Div className="grid md:grid-cols-2 gap-6">
            {audienceKeys.map((key, i) => (
              <Card key={key} className="border">
                <CardHeader className="pb-2">
                  <Div className="flex items-center gap-3">
                    <Span className="text-2xl">{AUDIENCE_ICONS[i]}</Span>
                    <H3 className="font-semibold text-base">
                      {t(`audience.items.${key}.title`)}
                    </H3>
                  </Div>
                </CardHeader>
                <CardContent>
                  <P className="text-sm text-muted-foreground leading-relaxed">
                    {t(`audience.items.${key}.description`)}
                  </P>
                </CardContent>
              </Card>
            ))}
          </Div>
        </Div>

        <Separator />

        {/* Use cases */}
        <Div>
          <H2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t("useCases.title")}
          </H2>
          <Div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseKeys.map((key, i) => (
              <Card
                key={key}
                className="border hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <Span className="text-2xl mb-1 block">
                    {USE_CASE_ICONS[i]}
                  </Span>
                  <H3 className="font-semibold text-sm leading-snug">
                    {t(`useCases.items.${key}.title`)}
                  </H3>
                </CardHeader>
                <CardContent>
                  <P className="text-xs text-muted-foreground leading-relaxed">
                    {t(`useCases.items.${key}.description`)}
                  </P>
                </CardContent>
              </Card>
            ))}
          </Div>
        </Div>

        <Separator />

        {/* Referral / skill economy */}
        <Div className="rounded-xl border bg-muted/30 p-8 md:p-12 text-center">
          <H2 className="text-2xl md:text-3xl font-bold mb-4">
            {t("referral.title")}
          </H2>
          <P className="text-muted-foreground max-w-xl mx-auto mb-6">
            {t("referral.description")}
          </P>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/story/referral`}>
              {t("referral.cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Div>

        {/* CTA */}
        <Div className="text-center space-y-4">
          <H2 className="text-2xl md:text-3xl font-bold">{t("cta.title")}</H2>
          <P className="text-muted-foreground max-w-xl mx-auto">
            {t("cta.subtitle")}
          </P>
          <Div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button size="lg" asChild>
              <Link href={`/${locale}/chat`}>
                {t("cta.primary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/${locale}/story/blog`}>{t("cta.secondary")}</Link>
            </Button>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

export default async function CareersPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
