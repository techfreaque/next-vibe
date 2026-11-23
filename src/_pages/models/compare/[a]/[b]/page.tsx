/**
 * Public model comparison: /[locale]/models/compare/[a]/[b]
 * Verdict, side-by-side fact sheet, FAQ and further comparisons for two chat
 * models. All content is computed server-side from the model registry
 * (../../../_shared/model-compare via model-page-loaders) and rendered in the
 * initial HTML.
 */

import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { JsonLd, type JsonLdNode } from "next-vibe/ui/components/json-ld";
import { notFound } from "next-vibe/ui/lib/not-found";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import type {
  CompareLink,
  CompareVerdict,
} from "../../../_shared/model-compare";
import {
  buildComparePickers,
  canonicalComparisonPath,
  type ModelFacts,
} from "../../../_shared/model-facts";
import {
  buildComparePageSeo,
  resolveComparePair,
} from "../../../_shared/model-page-loaders";
import { compareMeta } from "../../../_shared/model-seo";
import {
  type ModelSeoContent,
  ModelSeoSections,
} from "../../../_shared/model-seo-sections";
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
    imageAlt: t("meta.compare.imageAlt", vars),
    keywords: [t("meta.compare.keywords", vars)],
  });
}

export interface ComparePageData {
  locale: CountryLanguage;
  left: ModelFacts;
  right: ModelFacts;
  pickers: ReturnType<typeof buildComparePickers>;
  verdict: CompareVerdict;
  moreLeft: CompareLink[];
  moreRight: CompareLink[];
  /** FAQ + read-more cards (FAQPage JSON-LD comes from the visible FAQ). */
  seo: ModelSeoContent;
  /** Service per model + BreadcrumbList JSON-LD: Home > Models > A vs B. */
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
  return {
    locale,
    ...buildComparePageSeo(pair.left, pair.right, locale, availability),
    left: pair.left,
    right: pair.right,
    pickers: buildComparePickers(pair.left, pair.right, availability),
  };
}

export function TanstackPage(data: ComparePageData): JSX.Element {
  return (
    <>
      <JsonLd id="compare-structured-data" data={data.structuredData} />
      <ComparePageClient
        key={`${data.left.id}/${data.right.id}`}
        locale={data.locale}
        left={data.left}
        right={data.right}
        pickers={data.pickers}
        verdict={data.verdict}
        moreLeft={data.moreLeft}
        moreRight={data.moreRight}
        sections={
          <ModelSeoSections
            locale={data.locale}
            model={scopedTranslation
              .scopedT(data.locale)
              .t("compare.title", { a: data.left.name, b: data.right.name })}
            content={data.seo}
          />
        }
      />
    </>
  );
}

export default async function ComparePage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
