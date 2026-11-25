/**
 * Public model changelog: /[locale]/models/changelog
 * Every dated model change (added, legacy, repriced, tier, removed), built by
 * `vibe gen` from the git history of the model registry. Fully server-rendered;
 * the same entries feed /models-changelog.xml (RSS).
 */

import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { History } from "next-vibe/ui/components/icons/History";
import { JsonLd, type JsonLdNode } from "next-vibe/ui/components/json-ld";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { buildBreadcrumbList } from "../../_components/structured-data";
import { buildBreadcrumbTrail } from "../../story/_shared/breadcrumbs";
import {
  Cta,
  PageHero,
  PageSection,
  StatGrid,
} from "../../story/_shared/marketing";
import {
  buildChangelogPageView,
  type ChangelogPageView,
  MODEL_CHANGELOG_FEED_PATH,
  MODEL_CHANGELOG_PATH,
} from "../_shared/model-changelog";
import { ModelChangelogList } from "../_shared/model-changelog-ui";
import { formatNumber } from "../_shared/model-format";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** Locale-specific RSS URL (the bare feed is the generic English one). */
function feedHref(locale: CountryLanguage): string {
  return `${MODEL_CHANGELOG_FEED_PATH}?locale=${locale}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const metadata = metadataGenerator(locale, {
    path: MODEL_CHANGELOG_PATH.slice(1),
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      types: {
        "application/rss+xml": [
          {
            url: `${configT("websiteUrl").replace(/\/+$/, "")}${feedHref(locale)}`,
            title: t("feed.title", { appName }),
          },
        ],
      },
    },
  };
}

function changelogCrumbs(
  locale: CountryLanguage,
): { name: string; path: string }[] {
  const { t } = scopedTranslation.scopedT(locale);
  return [
    { name: t("breadcrumb.models"), path: "/models" },
    { name: t("breadcrumb.changelog"), path: MODEL_CHANGELOG_PATH },
  ];
}

export interface ModelChangelogPageData {
  locale: CountryLanguage;
  view: ChangelogPageView;
  /** BreadcrumbList JSON-LD: Home > Models > Changelog. */
  structuredData: JsonLdNode;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ModelChangelogPageData> {
  const { locale } = await params;
  const availability = await getEnvAvailability();
  return {
    locale,
    view: buildChangelogPageView(locale, availability),
    structuredData: {
      "@context": "https://schema.org",
      ...buildBreadcrumbList(locale, changelogCrumbs(locale)),
    },
  };
}

export function TanstackPage({
  locale,
  view,
  structuredData,
}: ModelChangelogPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <>
      <JsonLd id="model-changelog-structured-data" data={structuredData} />
      <Div>
        <PageHero
          eyebrow={
            view.latestDateLabel === null
              ? undefined
              : t("hero.eyebrow", { date: view.latestDateLabel })
          }
          eyebrowIcon={History}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          breadcrumbs={buildBreadcrumbTrail(locale, changelogCrumbs(locale))}
          actions={
            <>
              <Cta href={`/${locale}/models`} label={t("hero.allModels")} />
              <Cta
                href={feedHref(locale)}
                label={t("hero.rss")}
                variant="secondary"
                external
              />
            </>
          }
        >
          <StatGrid
            items={[
              {
                value: formatNumber(view.stats.added, locale),
                label: t("stats.added"),
              },
              {
                value: formatNumber(view.stats.legacy, locale),
                label: t("stats.legacy"),
              },
              {
                value: formatNumber(view.stats.repriced, locale),
                label: t("stats.repriced"),
              },
              { value: view.trackingStartLabel, label: t("stats.since") },
            ]}
          />
        </PageHero>

        <ModelChangelogList months={view.months} locale={locale} />

        <PageSection title={t("about.heading")} tone="muted" narrow>
          <Div className="flex flex-col gap-4 text-base leading-relaxed text-pretty text-muted-foreground">
            <P className="m-0">{t("about.body")}</P>
            <P className="m-0">{t("about.prices")}</P>
            <P className="m-0">
              {t("about.start", { date: view.trackingStartLabel })}
            </P>
          </Div>
        </PageSection>
      </Div>
    </>
  );
}

export default async function ModelChangelogPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
