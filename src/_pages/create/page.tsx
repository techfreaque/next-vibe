export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import type { JSX } from "react";

import { MODELS_OG_IMAGE } from "@/_pages/models/constants";

import { studioData, type StudioPageData } from "./_shared/studio-data";
import { StudioGallery } from "./_shared/studio-gallery";
import { StudioCards, StudioShell } from "./_shared/studio-shell";
import { scopedTranslation } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "create",
    title: t("studio"),
    description: t("overview"),
    category: t("meta.category"),
    image: MODELS_OG_IMAGE,
    imageAlt: t("studio"),
    keywords: [t("studio")],
  });
}

export async function tanstackLoader({
  params,
}: Props): Promise<Pick<StudioPageData, "locale" | "history">> {
  const { locale } = await params;
  const { history } = await studioData(locale);
  return { locale, history };
}

export function TanstackPage({
  locale,
  history,
}: Awaited<ReturnType<typeof tanstackLoader>>): JSX.Element {
  return (
    <StudioShell locale={locale}>
      <Div className="grid gap-6">
        <StudioCards locale={locale} />
        <StudioGallery locale={locale} history={history} />
      </Div>
    </StudioShell>
  );
}

export default async function StudioPage(props: Props): Promise<JSX.Element> {
  return <TanstackPage {...await tanstackLoader(props)} />;
}
