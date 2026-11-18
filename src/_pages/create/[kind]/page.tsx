/**
 * Public generation page: /[locale]/create/[kind]
 * image | video | music | speech | transcribe - the full-control form for
 * each media job, with the model/voice preselectable via query param.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { notFound } from "next-vibe/ui/lib/not-found";
import type { JSX } from "react";

import { MODELS_OG_IMAGE } from "@/_pages/models/constants";
import { configScopedTranslation } from "@/env/i18n";

import { type CreateKind, isCreateKind } from "../_shared/create-kinds";
import { studioData } from "../_shared/studio-data";
import { scopedTranslation } from "../i18n";
import { CreatePageClient } from "./page-client";

interface Props {
  params: Promise<{ locale: CountryLanguage; kind: string }>;
}

export type CreatePageData = Awaited<ReturnType<typeof studioData>> & {
  kind: CreateKind;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, kind } = await params;
  if (!isCreateKind(kind)) {
    notFound();
  }
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: `create/${kind}`,
    title: t(`kinds.${kind}.metaTitle`, { appName }),
    category: t("meta.category"),
    description: t(`kinds.${kind}.description`),
    image: MODELS_OG_IMAGE,
    imageAlt: t("meta.imageAlt", {
      appName,
      title: t(`kinds.${kind}.title`),
    }),
    keywords: [t(`kinds.${kind}.keywords`)],
  });
}

export async function tanstackLoader({
  params,
}: Props): Promise<CreatePageData> {
  const { locale, kind } = await params;
  if (!isCreateKind(kind)) {
    notFound();
  }
  return { ...(await studioData(locale, kind)), kind };
}

export function TanstackPage(data: CreatePageData): JSX.Element {
  return <CreatePageClient {...data} />;
}

export default async function CreatePage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
