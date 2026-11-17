/**
 * One "unbottled.ai vs <platform>" page (client-safe render half; the
 * loader and metadata live in ./versus-loader.ts). Each versus route is a
 * thin page.tsx that passes its key here. Competitor facts come from PLATFORMS
 * (sources listed on the page), ours from config at render time.
 * Server-rendered: every fact is in the initial HTML.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { JsonLd, type JsonLdNode } from "next-vibe/ui/components/json-ld";
import { Span } from "next-vibe/ui/components/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import { buildBreadcrumbList } from "@/_pages/_components/structured-data";

import {
  ArticleBody,
  ArticleEnd,
  ArticleH3,
  ArticleHeader,
  ArticleLead,
  ArticleList,
  ArticleP,
  ArticleScroll,
  ArticleSection,
} from "../../_shared/article";
import { Callout, CardLink, Cta } from "../../_shared/marketing";
import { scopedTranslation } from "../i18n";
import {
  allPlansText,
  apiText,
  buildCompareArticle,
  CompareLinks,
  formatCompareDate,
  freeText,
  mediaText,
  openSourceText,
  SourceList,
} from "./compare-ui";
import {
  COMPARE_CHECKED_DATE,
  COMPARE_HUB_PATH,
  PLATFORMS,
  type VersusKey,
  versusPath,
} from "./platforms";
import type { UsParams } from "./us-facts";

export interface VersusPageData {
  locale: CountryLanguage;
  versus: VersusKey;
  params: UsParams;
}

const ROW_KEYS = [
  "price",
  "free",
  "models",
  "filter",
  "privacy",
  "api",
  "media",
  "open",
  "forWho",
] as const;

type RowKey = (typeof ROW_KEYS)[number];

const FAQ_KEYS = ["q1", "q2", "q3", "q4"] as const;

type ListKey =
  | "themPros"
  | "themCons"
  | "usPros"
  | "usCons"
  | "chooseThem"
  | "chooseUs";

const LIST_ITEMS = ["a", "b", "c"] as const;

/** Copy params for a versus page: our facts plus the platform name and date. */
export function pageParams(data: VersusPageData): UsParams {
  return {
    ...data.params,
    name: PLATFORMS[data.versus].name,
    date: formatCompareDate(COMPARE_CHECKED_DATE, data.locale),
  };
}

export function VersusPage(data: VersusPageData): JSX.Element {
  const { locale, versus } = data;
  const { t } = scopedTranslation.scopedT(locale);
  const platform = PLATFORMS[versus];
  const stats = pageParams(data);
  const back = {
    href: `/${locale}${COMPARE_HUB_PATH}`,
    label: t("common.backToHub"),
  };
  const path = versusPath(versus);
  const title = t(`versus.${versus}.hero.title`, stats);

  const themCell: Record<RowKey, string> = {
    price: t("common.versus.priceCell", {
      plans: allPlansText(platform, locale, t),
      note: t(`platforms.${versus}.pricingNote`),
    }),
    free: freeText(platform, t),
    models: t(`platforms.${versus}.models`),
    filter: t(`platforms.${versus}.filter`),
    privacy: t(`platforms.${versus}.privacy`),
    api: t("common.versus.apiCell", {
      short: apiText(platform, t),
      text: t(`platforms.${versus}.api`),
    }),
    media: mediaText(platform, t),
    open: openSourceText(platform, t),
    forWho: t(`platforms.${versus}.forWho`),
  };
  const usCell: Record<RowKey, string> = {
    price: t("us.price", stats),
    free: t("us.free", stats),
    models: t("us.models", stats),
    filter: t("us.filter", stats),
    privacy: t("us.privacy", stats),
    api: t("us.api", stats),
    media: t("us.media", stats),
    open: t("us.open", stats),
    forWho: t("us.forWho", stats),
  };

  const structuredData: JsonLdNode = {
    "@context": "https://schema.org",
    "@graph": [
      buildCompareArticle({
        locale,
        path,
        headline: title,
        description: t(`versus.${versus}.meta.description`, stats),
      }),
      buildBreadcrumbList(locale, [
        { name: t("common.breadcrumb"), path: COMPARE_HUB_PATH },
        { name: title, path },
      ]),
    ],
  };

  const list = (prefix: ListKey): string[] =>
    LIST_ITEMS.map((item) => t(`versus.${versus}.${prefix}.${item}`, stats));

  return (
    <Div className="min-h-screen bg-background">
      <JsonLd id="compare-structured-data" data={structuredData} />
      <ArticleHeader
        back={back}
        category={t("common.category")}
        readTime={t(`versus.${versus}.hero.readTime`)}
        date={t("common.updated", { date: stats.date })}
        title={title}
        subtitle={t(`versus.${versus}.hero.subtitle`, stats)}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t(`versus.${versus}.intro.lead`, stats)}</ArticleLead>
          <ArticleP>{t(`versus.${versus}.intro.p2`, stats)}</ArticleP>
          <Callout icon={Info} tone="neutral">
            {t(`versus.${versus}.relation`, stats)}
          </Callout>
        </Div>

        <ArticleSection id="short-answer" title={t("common.versus.shortTitle")}>
          <ArticleP>{t(`versus.${versus}.verdict`, stats)}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="side-by-side"
          title={t("common.versus.tableTitle", stats)}
          intro={t("common.versus.tableIntro", stats)}
        >
          <ArticleScroll>
            <Div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table className="min-w-[44rem]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-40 text-xs font-semibold uppercase tracking-wide">
                      {t("common.versus.colAspect")}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide">
                      {platform.name}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide">
                      {String(stats.appName)}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROW_KEYS.map((row) => (
                    <TableRow key={row} data-row={row}>
                      <TableCell className="align-top text-sm font-semibold text-foreground">
                        {t(`common.versus.rows.${row}`)}
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {themCell[row]}
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {usCell[row]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Div>
          </ArticleScroll>
          <ArticleP>{t("common.versus.tableFootnote", stats)}</ArticleP>
        </ArticleSection>

        <ArticleSection id="them" title={t("common.versus.themTitle", stats)}>
          <ArticleH3>{t("common.versus.wins", stats)}</ArticleH3>
          <ArticleList items={list("themPros")} />
          <ArticleH3>{t("common.versus.short", stats)}</ArticleH3>
          <ArticleList items={list("themCons")} />
        </ArticleSection>

        <ArticleSection id="us" title={t("common.versus.usTitle", stats)}>
          <ArticleH3>
            {t("common.versus.wins", { name: stats.appName })}
          </ArticleH3>
          <ArticleList items={list("usPros")} />
          <ArticleH3>
            {t("common.versus.short", { name: stats.appName })}
          </ArticleH3>
          <ArticleList items={list("usCons")} />
        </ArticleSection>

        <ArticleSection id="choose" title={t("common.versus.chooseTitle")}>
          <Div className="grid gap-4 md:grid-cols-2">
            <Div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
              <ArticleH3>{t("common.versus.chooseThem", stats)}</ArticleH3>
              <ArticleList items={list("chooseThem")} />
            </Div>
            <Div className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/[0.04] p-5">
              <ArticleH3>{t("common.versus.chooseUs", stats)}</ArticleH3>
              <ArticleList items={list("chooseUs")} />
            </Div>
          </Div>
          <Callout icon={Scale} tone="neutral">
            {t(`versus.${versus}.both`, stats)}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="switch"
          title={t(`versus.${versus}.switch.title`, stats)}
        >
          <ArticleP>{t(`versus.${versus}.switch.body`, stats)}</ArticleP>
        </ArticleSection>

        <ArticleSection id="faq" title={t("common.versus.faqTitle")}>
          <JsonLd
            id="faq-structured-data"
            data={buildFaqStructuredData(
              FAQ_KEYS.map((key) => ({
                question: t(`versus.${versus}.faq.${key}.q`, stats),
                answer: t(`versus.${versus}.faq.${key}.a`, stats),
              })),
            )}
          />
          {FAQ_KEYS.map((key) => (
            <Div key={key} className="flex flex-col gap-2">
              <ArticleH3>{t(`versus.${versus}.faq.${key}.q`, stats)}</ArticleH3>
              <ArticleP>{t(`versus.${versus}.faq.${key}.a`, stats)}</ArticleP>
            </Div>
          ))}
        </ArticleSection>

        <ArticleSection
          id="sources"
          title={t("common.versus.sourcesTitle")}
          intro={t("common.versus.sourcesIntro", stats)}
        >
          <SourceList
            name={platform.name}
            sources={platform.sources}
            locale={locale}
          />
          <Span className="text-sm text-muted-foreground">
            {t("common.versus.ourSources", stats)}
          </Span>
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/models`}
              label={t("common.versus.modelsLink", stats)}
            />
            <CardLink
              href={`/${locale}/subscription/overview`}
              label={t("common.versus.pricingLink")}
            />
            <CardLink
              href={`/${locale}/story/privacy-policy`}
              label={t("common.versus.privacyLink")}
            />
          </Div>
        </ArticleSection>

        <ArticleSection id="more" title={t("common.versus.moreTitle")}>
          <CompareLinks locale={locale} exclude={versus} />
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t(`versus.${versus}.cta.title`, stats)}
          subtitle={t("common.versus.ctaSubtitle", stats)}
          actions={
            <>
              <Cta
                href={`/${locale}/threads/incognito/new`}
                label={t("common.versus.ctaTry")}
                icon={MessageSquare}
              />
              <Cta
                href={`/${locale}/models`}
                label={t("common.versus.ctaModels")}
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
