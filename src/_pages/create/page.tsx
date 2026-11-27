export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import type { JSX } from "react";

import {
  studioData,
  type StudioKindSummary,
  type StudioPageData,
  studioSummaries,
} from "./_shared/studio-data";
import { StudioHub } from "./hub-client";
import { scopedTranslation } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "create",
    title: t("hub.metaTitle"),
    description: t("hub.metaDescription"),
    category: t("meta.category"),
    imageAlt: t("studio"),
    keywords: [t("hub.keywords")],
  });
}

export type StudioHubData = Omit<StudioPageData, "models" | "commercialUse"> & {
  summaries: StudioKindSummary[];
};

export async function tanstackLoader({
  params,
}: Props): Promise<StudioHubData> {
  const { locale } = await params;
  const data = await studioData(locale);
  return {
    user: data.user,
    locale: data.locale,
    platform: data.platform,
    history: data.history,
    summaries: await studioSummaries(data.user),
  };
}

export function TanstackPage(data: StudioHubData): JSX.Element {
  return <StudioHub {...data} />;
}

export default async function StudioPage(props: Props): Promise<JSX.Element> {
  return <TanstackPage {...await tanstackLoader(props)} />;
}
