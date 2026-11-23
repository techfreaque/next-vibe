/**
 * Public model directory: /[locale]/models
 * Every public chat model grouped by content tier, with search.
 */

import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { JsonLd, type JsonLdNode } from "next-vibe/ui/components/json-ld";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { buildBreadcrumbList } from "../_components/structured-data";
import { CompareSection } from "../story/compare/_shared/compare-ui";
import {
  type CatalogMediaModelCounts,
  getCatalogMediaModelCounts,
} from "./_shared/model-catalog-entries";
import {
  buildModelDirectory,
  type DirectoryGroup,
  ModelDirectory,
} from "./_shared/model-directory";
import { scopedTranslation } from "./i18n";
import { ModelsIndexClient } from "./page-client";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const count = getAvailableChatModelCount(false, await getEnvAvailability());
  return metadataGenerator(locale, {
    path: "models",
    title: t("meta.index.title", { appName, count }),
    category: t("meta.category"),
    description: t("meta.index.description", { appName }),
    imageAlt: t("meta.index.imageAlt", { appName }),
    keywords: [t("meta.index.keywords", { appName })],
  });
}

export interface ModelsIndexPageData {
  locale: CountryLanguage;
  /** Public chat-model count, same figure as the rest of the site */
  chatModelCount: number;
  mediaModelCounts: CatalogMediaModelCounts;
  /** Every model page as a plain link list (crawlable, incl. legacy + media). */
  directory: DirectoryGroup[];
  /** BreadcrumbList JSON-LD: Home > Models. */
  structuredData: JsonLdNode;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ModelsIndexPageData> {
  const { locale } = await params;
  const availability = await getEnvAvailability();
  const { t } = scopedTranslation.scopedT(locale);
  return {
    locale,
    directory: buildModelDirectory(availability),
    structuredData: {
      "@context": "https://schema.org",
      ...buildBreadcrumbList(locale, [
        { name: t("breadcrumb.models"), path: "/models" },
      ]),
    },
    chatModelCount: getAvailableChatModelCount(false, availability),
    mediaModelCounts: getCatalogMediaModelCounts(availability),
  };
}

export function TanstackPage(data: ModelsIndexPageData): JSX.Element {
  return (
    <>
      <JsonLd id="models-structured-data" data={data.structuredData} />
      <ModelsIndexClient
        locale={data.locale}
        chatModelCount={data.chatModelCount}
        mediaModelCounts={data.mediaModelCounts}
        directorySection={
          <>
            <ModelDirectory locale={data.locale} groups={data.directory} />
            <CompareSection locale={data.locale} />
          </>
        }
      />
    </>
  );
}

export default async function ModelsIndexPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
