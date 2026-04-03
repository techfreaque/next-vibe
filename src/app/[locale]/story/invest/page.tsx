import fs from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { configScopedTranslation } from "@/config/i18n";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { scopedTranslation } from "./i18n";
import { FrameworkContent } from "../framework/_components/framework-content";

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
  const investContent = fs.readFileSync(investPath, "utf-8");
  return { locale, investContent };
}

export function TanstackPage({ investContent }: InvestPageData): JSX.Element {
  return (
    <Div className="min-h-screen">
      <Container size="lg" className="py-12">
        <Div className="prose prose-lg dark:prose-invert mx-auto">
          <FrameworkContent content={investContent} />
        </Div>
      </Container>
    </Div>
  );
}

export default async function InvestPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
