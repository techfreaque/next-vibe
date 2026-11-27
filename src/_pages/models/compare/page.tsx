import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import type { JSX } from "react";

import { buildBreadcrumbList } from "../../_components/structured-data";
import { buildBreadcrumbTrail } from "../../story/_shared/breadcrumbs";
import { CardLink, PageHero } from "../../story/_shared/marketing";
import {
  canonicalComparisonPath,
  FEATURED_COMPARISON_PAIRS,
  getModelFacts,
  isIndexableComparison,
} from "../_shared/model-facts";
import { scopedTranslation } from "../i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

interface CompareHubPageData {
  locale: CountryLanguage;
  links: { path: string; a: string; b: string }[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "models/compare",
    title: t("compareHub.title"),
    description: t("compareHub.description"),
    category: t("meta.category"),
    imageAlt: t("compareHub.title"),
    keywords: [t("compareHub.title")],
  });
}

export async function tanstackLoader({
  params,
}: Props): Promise<CompareHubPageData> {
  const { locale } = await params;
  const availability = await getEnvAvailability();
  const links = FEATURED_COMPARISON_PAIRS.flatMap(([a, b]) => {
    const left = getModelFacts(a, availability);
    const right = getModelFacts(b, availability);
    if (
      left === null ||
      right === null ||
      !isIndexableComparison(left, right)
    ) {
      return [];
    }
    return [
      {
        path: canonicalComparisonPath(left, right),
        a: left.name,
        b: right.name,
      },
    ];
  });
  return { locale, links };
}

export function TanstackPage({
  locale,
  links,
}: CompareHubPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const crumbs = [
    { name: t("breadcrumb.models"), path: "/models" },
    { name: t("compareHub.title"), path: "/models/compare" },
  ];

  return (
    <>
      <JsonLd
        id="model-comparison-hub-structured-data"
        data={{
          "@context": "https://schema.org",
          ...buildBreadcrumbList(locale, crumbs),
        }}
      />
      <PageHero
        title={t("compareHub.title")}
        subtitle={t("compareHub.description")}
        breadcrumbs={buildBreadcrumbTrail(locale, crumbs)}
      />
      <Div className="mx-auto flex w-full max-w-4xl flex-col px-4 pb-12">
        {links.map(({ path, a, b }) => (
          <CardLink
            key={path}
            href={`/${locale}${path}`}
            label={t("compare.title", { a, b })}
          />
        ))}
        <CardLink href={`/${locale}/models`} label={t("breadcrumb.models")} />
      </Div>
    </>
  );
}

export default async function CompareHubPage({
  params,
}: Props): Promise<JSX.Element> {
  return <TanstackPage {...await tanstackLoader({ params })} />;
}
