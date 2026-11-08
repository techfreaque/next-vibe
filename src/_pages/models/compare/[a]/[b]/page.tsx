/**
 * Public model comparison: /[locale]/models/compare/[a]/[b]
 * Side-by-side fact sheet for two chat models.
 */

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { notFound } from "next-vibe/ui/lib/not-found";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  buildPickerModels,
  findPublicModelId,
  getModelFacts,
  type ModelFacts,
  type PickerModel,
} from "../../../_shared/model-facts";
import { MODELS_OG_IMAGE } from "../../../constants";
import { scopedTranslation } from "../../../i18n";
import { ComparePageClient } from "./page-client";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage; a: string; b: string }>;
}

function resolvePair(
  a: string,
  b: string,
): { left: ModelFacts; right: ModelFacts } | null {
  const leftId = findPublicModelId(a);
  const rightId = findPublicModelId(b);
  if (leftId === null || rightId === null) {
    return null;
  }
  const left = getModelFacts(leftId);
  const right = getModelFacts(rightId);
  if (left === null || right === null) {
    return null;
  }
  return { left, right };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, a, b } = await params;
  const pair = resolvePair(a, b);
  if (pair === null) {
    notFound();
  }
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const vars = {
    appName: configT("appName"),
    a: pair.left.name,
    b: pair.right.name,
  };
  return metadataGenerator(locale, {
    path: `models/compare/${pair.left.slug}/${pair.right.slug}`,
    title: t("meta.compare.title", vars),
    category: t("meta.category"),
    description: t("meta.compare.description", vars),
    image: MODELS_OG_IMAGE,
    imageAlt: t("meta.compare.imageAlt", vars),
    keywords: [t("meta.compare.keywords", vars)],
  });
}

export interface ComparePageData {
  locale: CountryLanguage;
  left: ModelFacts;
  right: ModelFacts;
  /** Replacement candidates for the left column (anchored on the right). */
  leftPicker: PickerModel[];
  rightPicker: PickerModel[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<ComparePageData> {
  const { locale, a, b } = await params;
  const pair = resolvePair(a, b);
  if (pair === null) {
    notFound();
  }
  return {
    locale,
    left: pair.left,
    right: pair.right,
    leftPicker: buildPickerModels(pair.right, [pair.left.id]),
    rightPicker: buildPickerModels(pair.left, [pair.right.id]),
  };
}

export function TanstackPage(data: ComparePageData): JSX.Element {
  return <ComparePageClient {...data} />;
}

export default async function ComparePage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
