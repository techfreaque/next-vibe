/**
 * Public model comparison: /[locale]/models/compare/[a]/[b]
 * Side-by-side fact sheet for two chat models.
 */

import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { JsonLd, type JsonLdNode } from "next-vibe/ui/components/json-ld";
import { notFound } from "next-vibe/ui/lib/not-found";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  buildPickerModels,
  canonicalComparisonPath,
  type ModelFacts,
  type PickerModel,
} from "../../../_shared/model-facts";
import { resolveComparePair } from "../../../_shared/model-page-loaders";
import { compareMeta } from "../../../_shared/model-seo";
import { buildCompareStructuredData } from "../../../_shared/model-structured-data";
import { MODELS_OG_IMAGE } from "../../../constants";
import { scopedTranslation } from "../../../i18n";
import { ComparePageClient } from "./page-client";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage; a: string; b: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, a, b } = await params;
  const availability = await getEnvAvailability();
  const pair = resolveComparePair(locale, a, b, availability);
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
  const meta = compareMeta(pair.left, pair.right, locale);
  const path = canonicalComparisonPath(pair.left, pair.right);
  return metadataGenerator(locale, {
    path: path.slice(1),
    generateAlternates: path === `/models/compare/${a}/${b}`,
    title: meta.title,
    category: t("meta.category"),
    description: meta.description,
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
  /** BreadcrumbList JSON-LD: Home > Models > A vs B. */
  structuredData: JsonLdNode;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ComparePageData> {
  const { locale, a, b } = await params;
  const availability = await getEnvAvailability();
  const pair = resolveComparePair(locale, a, b, availability);
  if (pair === null) {
    notFound();
  }
  const { t } = scopedTranslation.scopedT(locale);
  return {
    locale,
    structuredData: buildCompareStructuredData(
      locale,
      t("compare.title", { a: pair.left.name, b: pair.right.name }),
      canonicalComparisonPath(pair.left, pair.right),
    ),
    left: pair.left,
    right: pair.right,
    leftPicker: buildPickerModels(pair.right, availability, [pair.left.id]),
    rightPicker: buildPickerModels(pair.left, availability, [pair.right.id]),
  };
}

export function TanstackPage(data: ComparePageData): JSX.Element {
  return (
    <>
      <JsonLd id="compare-structured-data" data={data.structuredData} />
      <ComparePageClient {...data} />
    </>
  );
}

export default async function ComparePage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
