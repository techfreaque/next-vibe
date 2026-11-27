/**
 * Comparison hub: the uncensored AI platforms people search for, side by
 * side. /[locale]/story/compare/uncensored-ai-platforms
 *
 * Competitor facts come from ../_shared/platforms.ts (verified on their own
 * pages, sources listed per platform). Our side is read from config at
 * render time (../_shared/us-facts.ts). Server-rendered: the whole table is
 * in the initial HTML.
 */

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { JsonLd, type JsonLdNode } from "next-vibe/ui/components/json-ld";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import {
  buildBreadcrumbList,
  pageUrl,
} from "@/_pages/_components/structured-data";

import {
  ArticleBody,
  ArticleEnd,
  ArticleH3,
  ArticleHeader,
  ArticleLead,
  ArticleList,
  ArticleP,
  ArticleSection,
} from "../../_shared/article";
import { Callout, CardLink, Cta } from "../../_shared/marketing";
import { AlternativesLinks } from "../../blog/_alternatives/comparison";
import { scopedTranslation as uncensoredChatTranslation } from "../../uncensored-ai/i18n";
import {
  allPlansText,
  apiText,
  buildCompareArticle,
  formatCompareDate,
  LINK_CLASS,
  mediaText,
  openSourceText,
  platformRow,
  usRow,
} from "../_shared/compare-data";
import { CompareLinks, CompareTable, SourceList } from "../_shared/compare-ui";
import {
  ABLITERATION_SOURCES,
  COMPARE_HUB_PATH,
  COMPARE_LATEST_CHECK_DATE,
  isVersusKey,
  PLATFORM_KEYS,
  platformCheckedDate,
  PLATFORMS,
  VERSUS_KEYS,
  versusPath,
} from "../_shared/platforms";
import {
  loadUsFacts,
  type UsFacts,
  type UsParams,
  usParams,
} from "../_shared/us-facts";
import { scopedTranslation } from "../i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

const PICK_KEYS = [
  "oneApp",
  "ownWorldview",
  "privacy",
  "roleplay",
  "companions",
  "developers",
  "local",
  "filtered",
] as const;

const FAQ_KEYS = [
  "best",
  "free",
  "private",
  "difference",
  "veniceVs",
  "characterAi",
  "gabAi",
  "uncensoredAi",
  "openRouter",
  "local",
  "legal",
] as const;

export interface HubPageData {
  locale: CountryLanguage;
  facts: UsFacts;
  params: UsParams;
}

export async function tanstackLoader({ params }: Props): Promise<HubPageData> {
  const { locale } = await params;
  const facts = await loadUsFacts(locale);
  return { locale, facts, params: usParams(facts) };
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const data = await tanstackLoader({ params });
  const meta = { ...data.params, count: PLATFORM_KEYS.length };
  return metadataGenerator(locale, {
    path: COMPARE_HUB_PATH.slice(1),
    title: t("hub.meta.title", meta),
    category: t("hub.meta.category"),
    description: t("hub.meta.description", meta),
    imageAlt: t("hub.meta.imageAlt", meta),
    keywords: [t("hub.meta.keywords", meta)],
  });
};

export function TanstackPage({
  locale,
  facts,
  params,
}: HubPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: chatT } = uncensoredChatTranslation.scopedT(locale);
  const checked = formatCompareDate(COMPARE_LATEST_CHECK_DATE, locale);
  const stats = {
    ...params,
    count: PLATFORM_KEYS.length,
    versusCount: VERSUS_KEYS.length,
    date: checked,
  };
  const back = {
    href: `/${locale}/story/blog`,
    label: t("common.backToBlog"),
  };
  const rows = [
    usRow(locale, t, params),
    ...PLATFORM_KEYS.map((key) => platformRow(PLATFORMS[key], locale, t)),
  ];
  const title = t("hub.hero.title", stats);
  const description = t("hub.meta.description", stats);

  const structuredData: JsonLdNode = {
    "@context": "https://schema.org",
    "@graph": [
      buildCompareArticle({
        locale,
        path: COMPARE_HUB_PATH,
        headline: title,
        description,
        dateModified: COMPARE_LATEST_CHECK_DATE,
      }),
      buildBreadcrumbList(locale, [
        { name: t("common.breadcrumb"), path: COMPARE_HUB_PATH },
      ]),
      {
        "@type": "ItemList",
        name: title,
        numberOfItems: rows.length,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: String(params.appName),
            url: pageUrl(locale, "/story"),
          },
          ...PLATFORM_KEYS.map((key, index) => ({
            "@type": "ListItem",
            position: index + 2,
            name: PLATFORMS[key].name,
            url: isVersusKey(key)
              ? pageUrl(locale, versusPath(key))
              : PLATFORMS[key].url,
          })),
        ],
      },
    ],
  };

  return (
    <Div className="min-h-screen bg-background">
      <JsonLd id="compare-structured-data" data={structuredData} />
      <ArticleHeader
        back={back}
        category={t("hub.hero.category")}
        readTime={t("hub.hero.readTime")}
        date={t("common.updated", { date: checked })}
        title={title}
        subtitle={t("hub.hero.subtitle", stats)}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("hub.intro.lead")}</ArticleLead>
          <ArticleP>{t("hub.intro.p2", stats)}</ArticleP>
          <Callout icon={Info} tone="neutral">
            {t("hub.intro.disclosure", stats)}
          </Callout>
        </Div>

        <ArticleSection
          id="picks"
          title={t("hub.picks.title")}
          intro={t("hub.picks.intro")}
        >
          <ArticleList
            items={PICK_KEYS.map((key) => (
              <Span key={key} className="flex flex-col gap-0.5">
                <Span className="font-semibold text-foreground">
                  {t(`hub.picks.${key}.title`, stats)}
                </Span>
                <Span className="text-sm text-muted-foreground">
                  {t(`hub.picks.${key}.body`, stats)}
                </Span>
              </Span>
            ))}
          />
        </ArticleSection>

        <ArticleSection
          id="table"
          title={t("hub.table.title", stats)}
          intro={t("hub.table.intro", stats)}
        >
          <CompareTable rows={rows} locale={locale} />
          <ArticleP>{t("hub.table.footnote", stats)}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="two-kinds"
          title={t("hub.kinds.title")}
          intro={t("hub.kinds.intro")}
        >
          <ArticleList
            items={[
              t("hub.kinds.abliterated"),
              t("hub.kinds.finetuned"),
              t("hub.kinds.ownWorldview", stats),
              t("hub.kinds.filtered"),
            ]}
          />
          <ArticleP>{t("hub.kinds.tradeoff")}</ArticleP>
          <SourceList
            name={t("hub.kinds.sourceName")}
            sources={ABLITERATION_SOURCES}
            locale={locale}
          />
        </ArticleSection>

        <ArticleSection
          id="platforms"
          title={t("hub.platforms.title", stats)}
          intro={t("hub.platforms.intro", stats)}
        >
          {PLATFORM_KEYS.map((key) => {
            const platform = PLATFORMS[key];
            return (
              <Div
                key={key}
                id={`platform-${key}`}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 md:p-6"
              >
                <Div className="flex flex-wrap items-baseline justify-between gap-2">
                  <ArticleH3>{platform.name}</ArticleH3>
                  <ExternalLink
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={`${LINK_CLASS} text-sm`}
                  >
                    {platform.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </ExternalLink>
                </Div>
                <ArticleP>{t(`platforms.${key}.what`)}</ArticleP>
                <ArticleList
                  items={[
                    t("hub.platforms.price", {
                      plans: allPlansText(platform, locale, t),
                      note: t(`platforms.${key}.pricingNote`),
                    }),
                    t("hub.platforms.models", {
                      text: t(`platforms.${key}.models`),
                    }),
                    t("hub.platforms.filter", {
                      text: t(`platforms.${key}.filter`),
                    }),
                    t("hub.platforms.privacy", {
                      text: t(`platforms.${key}.privacy`),
                    }),
                    t("hub.platforms.api", {
                      short: apiText(platform, t),
                      text: t(`platforms.${key}.api`),
                    }),
                    t("hub.platforms.media", {
                      text: mediaText(platform, t),
                    }),
                    t("hub.platforms.open", {
                      text: openSourceText(platform, t),
                    }),
                    t("hub.platforms.forWho", {
                      text: t(`platforms.${key}.forWho`),
                    }),
                  ]}
                />
                <Div className="grid gap-3 md:grid-cols-2">
                  <Div className="flex flex-col gap-1">
                    <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("hub.platforms.strengths")}
                    </Span>
                    <ArticleList
                      items={[
                        t(`platforms.${key}.pro1`),
                        t(`platforms.${key}.pro2`),
                      ]}
                    />
                  </Div>
                  <Div className="flex flex-col gap-1">
                    <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("hub.platforms.limits")}
                    </Span>
                    <ArticleList
                      items={[
                        t(`platforms.${key}.con1`),
                        t(`platforms.${key}.con2`),
                      ]}
                    />
                  </Div>
                </Div>
                {platform.upstream !== null &&
                  facts.upstream[platform.upstream].models > 0 && (
                    <Callout icon={Layers} tone="primary">
                      {t("hub.upstream", {
                        appName: String(params.appName),
                        name: platform.name,
                        models: facts.upstream[platform.upstream].models,
                        uncensored:
                          facts.upstream[platform.upstream].uncensored,
                        examples:
                          facts.upstream[platform.upstream].examples.join(", "),
                      })}
                    </Callout>
                  )}
                {isVersusKey(key) && (
                  <CardLink
                    href={`/${locale}${versusPath(key)}`}
                    label={t("links.versus", {
                      appName: String(params.appName),
                      name: platform.name,
                    })}
                  />
                )}
                <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("hub.platforms.sources", {
                    date: formatCompareDate(platformCheckedDate(key), locale),
                  })}
                </Span>
                <SourceList
                  name={platform.name}
                  sources={platform.sources}
                  locale={locale}
                />
              </Div>
            );
          })}
        </ArticleSection>

        <ArticleSection
          id="unbottled"
          title={t("hub.us.title", stats)}
          intro={t("hub.us.intro", stats)}
        >
          <ArticleList
            items={[
              t("hub.us.models", stats),
              t("hub.us.upstream", stats),
              t("hub.us.consent", stats),
              t("hub.us.privacy", stats),
              t("hub.us.pricing", stats),
              t("hub.us.api", stats),
              t("hub.us.media", stats),
              t("hub.us.open", stats),
            ]}
          />
          <ArticleH3>{t("hub.us.weakTitle")}</ArticleH3>
          <ArticleList
            items={[
              t("hub.us.weak1", stats),
              t("hub.us.weak2", stats),
              t("hub.us.weak3", stats),
              t("hub.us.weak4", stats),
            ]}
          />
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/uncensored-ai`}
              label={chatT("title")}
            />
            <CardLink
              href={`/${locale}/models`}
              label={t("hub.us.modelsLink", stats)}
            />
            <CardLink
              href={`/${locale}/subscription/overview`}
              label={t("hub.us.pricingLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/uncensored-models-what-each-is-good-at`}
              label={t("hub.us.guideLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/uncensored-llm-api`}
              label={t("hub.us.apiLink")}
            />
          </Div>
        </ArticleSection>

        <ArticleSection
          id="versus"
          title={t("hub.versus.title")}
          intro={t("hub.versus.intro", stats)}
        >
          <CompareLinks locale={locale} includeHub={false} />
        </ArticleSection>

        <AlternativesLinks locale={locale} />

        <ArticleSection
          id="methodology"
          title={t("hub.method.title")}
          intro={t("hub.method.intro", stats)}
        >
          <ArticleList
            items={[
              t("hub.method.sources", stats),
              t("hub.method.prices", stats),
              t("hub.method.noScores"),
              t("hub.method.us", stats),
              t("hub.method.bias", stats),
              t("hub.method.changes", stats),
            ]}
          />
          <Callout icon={Scale} tone="neutral">
            <Span>{t("hub.method.corrections", stats)}</Span>{" "}
            <Link href={`/${locale}/help`} className={LINK_CLASS}>
              {t("hub.method.correctionsLink")}
            </Link>
          </Callout>
        </ArticleSection>

        <ArticleSection id="faq" title={t("hub.faq.title")}>
          <JsonLd
            id="faq-structured-data"
            data={buildFaqStructuredData(
              FAQ_KEYS.map((key) => ({
                question: t(`hub.faq.${key}.q`, stats),
                answer: t(`hub.faq.${key}.a`, stats),
              })),
            )}
          />
          {FAQ_KEYS.map((key) => (
            <Div key={key} className="flex flex-col gap-2">
              <ArticleH3>{t(`hub.faq.${key}.q`, stats)}</ArticleH3>
              <ArticleP>{t(`hub.faq.${key}.a`, stats)}</ArticleP>
            </Div>
          ))}
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t("hub.cta.title")}
          subtitle={t("hub.cta.subtitle", stats)}
          actions={
            <>
              <Cta
                href={`/${locale}/threads/incognito/new`}
                label={t("hub.cta.try")}
                icon={MessageSquare}
              />
              <Cta
                href={`/${locale}/models`}
                label={t("hub.cta.models")}
                icon={Layers}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function UncensoredPlatformsComparePage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
