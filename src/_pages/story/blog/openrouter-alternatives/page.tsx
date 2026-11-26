/**
 * Blog post: OpenRouter alternatives for developers who want one API key,
 * uncensored models included.
 * /[locale]/story/blog/openrouter-alternatives
 *
 * Competitor facts (what each one is, models, API, pricing, pros and cons)
 * come from the comparison research data (compare/_shared/platforms.ts +
 * compare i18n), checked on COMPARE_CHECKED_DATE. Our numbers (model counts,
 * models routed through OpenRouter, markup, API unlock price) are read live
 * via loadUsFacts. The model table lists every uncensored model callable on
 * the /v1 API, with its id, from the registry.
 */

import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import {
  API_KEY_PLACEHOLDER,
  buildPublicApiBaseUrl,
} from "@/api-keys/coding-tools";
import { API_DOCS_PATH, API_KEYS_PAGE_PATH } from "@/api-keys/constants";
import { configScopedTranslation } from "@/env/i18n";

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
import { ArticleCode } from "../../_shared/article-code";
import { Callout, CardLink, Cta } from "../../_shared/marketing";
import {
  allPlansText,
  formatCompareDate,
  freeText,
  LINK_CLASS,
} from "../../compare/_shared/compare-data";
import { CompareInlineLinks } from "../../compare/_shared/compare-ui";
import {
  COMPARE_CHECKED_DATE,
  isVersusKey,
  type PlatformKey,
  PLATFORMS,
  versusPath,
} from "../../compare/_shared/platforms";
import type { UsParams } from "../../compare/_shared/us-facts";
import { scopedTranslation as compareScopedTranslation } from "../../compare/i18n";
import { MARKET_CHECKED_DATE } from "../_alternatives/catalog";
import {
  AlternativesComparison,
  alternativesFaq,
  AlternativesLinks,
  alternativesTotal,
} from "../_alternatives/comparison";
import { UncensoredModelTable, type UncensoredRow } from "../uncensored-rows";
import { loadUncensoredRows } from "../uncensored-rows-data";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "openrouter-alternatives";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** The alternatives, in list order. OpenRouter itself closes the table. */
const ALTERNATIVES: readonly PlatformKey[] = [
  "nanoGpt",
  "venice",
  "uncensoredAi",
  "gabAi",
  "freedomGpt",
  "ollama",
];

const FAQ_KEYS: readonly (
  | "best"
  | "cheaper"
  | "uncensored"
  | "sdk"
  | "anthropic"
  | "free"
)[] = ["best", "cheaper", "uncensored", "sdk", "anthropic", "free"];

export interface OpenrouterAlternativesPageData {
  locale: CountryLanguage;
  us: UsParams;
  baseUrl: string;
  /** Uncensored models callable on the /v1 API, cheapest first. */
  rows: UncensoredRow[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<OpenrouterAlternativesPageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  const [facts, rows] = await Promise.all([
    loadUsFacts(locale),
    loadUncensoredRows(locale),
  ]);
  return {
    locale,
    us: usParams(facts),
    baseUrl: buildPublicApiBaseUrl(envClient.NEXT_PUBLIC_APP_URL, locale),
    rows: rows.filter((row) => row.apiCallable),
  };
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: `story/blog/${SLUG}`,
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

/** The two lines that change when an OpenAI SDK client moves over. */
function switchSample(baseUrl: string, model: string): string {
  return `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}",
    api_key="${API_KEY_PLACEHOLDER}",
)

reply = client.chat.completions.create(
    model="${model}",
    messages=[{"role": "user", "content": "Hello"}],
)
print(reply.choices[0].message.content)`;
}

export function TanstackPage({
  locale,
  us,
  baseUrl,
  rows,
}: OpenrouterAlternativesPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareScopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const checked = formatCompareDate(COMPARE_CHECKED_DATE, locale);
  const example = rows[0];
  const stats = {
    ...us,
    date: checked,
    count: ALTERNATIVES.length,
    apiUncensored: rows.length,
    example: example?.id ?? "",
  };
  const faq = [
    ...FAQ_KEYS.map((key) => ({
      key,
      question: t(`faq.${key}.q`, stats),
      answer: t(`faq.${key}.a`, stats),
    })),
    alternativesFaq(SLUG, locale, us.appName),
  ];

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        post={{ slug: SLUG, locale }}
        title={t("hero.title")}
        subtitle={t("hero.subtitle", {
          ...stats,
          count: alternativesTotal(SLUG, ALTERNATIVES),
          date: formatCompareDate(MARKET_CHECKED_DATE, locale),
        })}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.lead")}</ArticleLead>
          <ArticleP>{t("intro.p2", stats)}</ArticleP>
        </Div>

        <ArticleSection
          id="criteria"
          title={t("criteria.title")}
          intro={t("criteria.intro")}
        >
          <ArticleList
            items={[
              t("criteria.catalog"),
              t("criteria.uncensored"),
              t("criteria.formats"),
              t("criteria.billing"),
              t("criteria.data"),
              t("criteria.chat"),
            ]}
          />
        </ArticleSection>

        <AlternativesComparison
          locale={locale}
          slug={SLUG}
          us={us}
          platforms={ALTERNATIVES}
          title={t("table.title")}
        />

        <ArticleSection
          id="us"
          title={t("us.title", stats)}
          intro={t("us.intro", stats)}
        >
          <ArticleList
            items={[
              t("us.models", stats),
              t("us.formats"),
              t("us.billing", stats),
              t("us.chat", stats),
              t("us.openRouter", stats),
            ]}
          />
          <ArticleP>{t("us.weak", stats)}</ArticleP>
          {example !== undefined && (
            <Div className="flex min-w-0 flex-col gap-2">
              <Span className="text-sm font-semibold text-foreground">
                {t("us.codeLabel")}
              </Span>
              <ArticleCode
                code={switchSample(baseUrl, example.id)}
                language="python"
                filename="switch.py"
              />
            </Div>
          )}
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/${API_DOCS_PATH}`}
              label={t("us.docsLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/openai-anthropic-compatible-api`}
              label={t("us.formatsLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/unbottled-api-in-coding-tools`}
              label={t("us.toolsLink")}
            />
          </Div>
        </ArticleSection>

        {rows.length > 0 && (
          <ArticleSection
            id="models"
            title={t("models.title", stats)}
            intro={t("models.intro")}
          >
            <UncensoredModelTable
              rows={rows}
              columns={["apiId", "context", "price"]}
              locale={locale}
              labels={{
                model: t("models.colModel"),
                apiId: t("models.colId"),
                context: t("models.colContext"),
                price: t("models.colPrice"),
              }}
            />
            <ArticleP>{t("models.footnote", stats)}</ArticleP>
          </ArticleSection>
        )}

        <ArticleSection
          id="alternatives"
          title={t("list.title", stats)}
          intro={t("list.intro", stats)}
        >
          {ALTERNATIVES.map((key, index) => {
            const platform = PLATFORMS[key];
            return (
              <Div
                key={key}
                data-platform={key}
                className="flex flex-col gap-3"
              >
                <ArticleH3>
                  {t("list.heading", {
                    number: index + 1,
                    name: platform.name,
                    kind: compareT(`common.kinds.${platform.kind}`),
                  })}
                </ArticleH3>
                <ArticleP>{compareT(`platforms.${key}.what`)}</ArticleP>
                <ArticleList
                  items={[
                    <Span key="api">
                      <Span className="font-semibold text-foreground">
                        {t("list.api")}
                      </Span>{" "}
                      {compareT(`platforms.${key}.api`)}
                    </Span>,
                    <Span key="models">
                      <Span className="font-semibold text-foreground">
                        {t("list.models")}
                      </Span>{" "}
                      {compareT(`platforms.${key}.models`)}
                    </Span>,
                    <Span key="price">
                      <Span className="font-semibold text-foreground">
                        {t("list.price")}
                      </Span>{" "}
                      {t("list.priceValue", {
                        free: freeText(platform, compareT),
                        plans: allPlansText(platform, locale, compareT),
                      })}{" "}
                      {compareT(`platforms.${key}.pricingNote`)}
                    </Span>,
                    <Span key="pro">
                      <Span className="font-semibold text-foreground">
                        {t("list.pro")}
                      </Span>{" "}
                      {compareT(`platforms.${key}.pro1`)}
                    </Span>,
                    <Span key="con">
                      <Span className="font-semibold text-foreground">
                        {t("list.con")}
                      </Span>{" "}
                      {compareT(`platforms.${key}.con1`)}
                    </Span>,
                  ]}
                />
                <ArticleP>
                  <Span className="font-semibold text-foreground">
                    {t("list.forWho")}
                  </Span>{" "}
                  {compareT(`platforms.${key}.forWho`)}
                </ArticleP>
                {isVersusKey(key) ? (
                  <CardLink
                    href={`/${locale}${versusPath(key)}`}
                    label={t("list.versusLink", {
                      appName: us.appName,
                      name: platform.name,
                    })}
                  />
                ) : (
                  <Span className="text-sm">
                    <ExternalLink
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className={LINK_CLASS}
                    >
                      {t("list.visit", { name: platform.name })}
                    </ExternalLink>
                  </Span>
                )}
              </Div>
            );
          })}
        </ArticleSection>

        <ArticleSection
          id="stay"
          title={t("stay.title")}
          intro={t("stay.intro")}
        >
          <ArticleList
            items={[
              compareT("platforms.openRouter.pro1"),
              compareT("platforms.openRouter.pro2"),
              t("stay.rare"),
            ]}
          />
          <Callout icon={Scale} tone="neutral">
            {t("stay.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection id="faq" title={t("faq.title")}>
          <JsonLd id="faq-structured-data" data={buildFaqStructuredData(faq)} />
          {faq.map(({ key, question, answer }) => (
            <Div key={key} className="flex flex-col gap-2">
              <ArticleH3>{question}</ArticleH3>
              <ArticleP>{answer}</ArticleP>
            </Div>
          ))}
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/blog/uncensored-llm-api`}
              label={t("faq.apiLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/venice-ai-alternatives`}
              label={t("faq.veniceLink")}
            />
            <CardLink
              href={`/${locale}/${API_KEYS_PAGE_PATH}`}
              label={t("faq.keysLink")}
            />
            <CompareInlineLinks
              locale={locale}
              includeHub={false}
              versus={["openRouter", "nanoGpt", "venice"]}
            />
          </Div>
        </ArticleSection>

        <AlternativesLinks locale={locale} exclude={SLUG} />

        <ArticleEnd
          post={{ slug: SLUG, locale }}
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle", stats)}
          actions={
            <>
              <Cta
                href={example?.chatHref ?? `/${locale}/threads/incognito/new`}
                label={t("cta.start")}
                icon={MessageSquare}
              />
              <Cta
                href={`/${locale}/${API_DOCS_PATH}`}
                label={t("cta.docs")}
                icon={BookOpen}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function OpenrouterAlternativesPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
