import fs from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Markdown } from "next-vibe/ui/components/markdown";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { READING_COLUMN } from "../_shared/article";
import { Cta, CtaBand, PageHero } from "../_shared/marketing";
import { scopedTranslation } from "./i18n";

// Revalidate every hour (ISR)
export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "story/invest",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
}

export interface InvestPageData {
  locale: CountryLanguage;
  investContent: string;
}

export async function tanstackLoader({
  params,
}: Props): Promise<InvestPageData> {
  const { locale } = await params;
  const investPath = path.join(process.cwd(), "docs", "INVEST.md");
  // The hero carries the title - drop the markdown's own H1.
  const investContent = fs
    .readFileSync(investPath, "utf-8")
    .replace(/^# .*\n+/, "");
  return { locale, investContent };
}

export function TanstackPage({
  locale,
  investContent,
}: InvestPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  return (
    <Div className="min-h-screen bg-background">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        eyebrowIcon={TrendingUp}
        title={t("title", { appName })}
        subtitle={t("description")}
        actions={
          <>
            <Cta href="#brief" label={t("hero.ctaPrimary")} />
            <Cta
              href={`/${locale}/story/framework`}
              label={t("hero.ctaSecondary")}
              variant="secondary"
            />
          </>
        }
      />
      <Div
        id="brief"
        className={cn(READING_COLUMN, "scroll-mt-20 py-12 md:py-16")}
      >
        <Div className="min-w-0 text-[1.0625rem] leading-[1.75] md:text-lg [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_hr]:my-10 [&_hr]:border-border [&_pre]:max-w-full [&_pre]:overflow-x-auto">
          <Markdown content={investContent} />
        </Div>
      </Div>
      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        actions={
          <Cta href={`/${locale}/help`} label={t("cta.button")} icon={Mail} />
        }
      />
    </Div>
  );
}

export default async function InvestPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
