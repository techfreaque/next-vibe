/**
 * Blog post: uncensored alternatives to AWS Bedrock for API users.
 * /[locale]/story/blog/bedrock-alternatives
 *
 * Bedrock, Azure, Vertex and Together facts plus competitor prices come from
 * ../_cloud-alternatives/data and this post's i18n (read at the official AWS
 * pages on CLOUD_CHECKED_DATE). Our numbers, model ids and per-token prices
 * are read live via loadUsFacts and the registry.
 */

import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Cloud } from "next-vibe/ui/components/icons/Cloud";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import {
  buildPublicApiBaseUrl,
  CODING_TOOL_STRONG_MODEL,
  CODING_TOOL_UNCENSORED_MODEL,
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
import { formatCompareDate } from "../../compare/_shared/compare-data";
import { CompareInlineLinks } from "../../compare/_shared/compare-ui";
import type { UsParams } from "../../compare/_shared/us-facts";
import {
  CloudAlternatives,
  CloudRulesTable,
  PriceTable,
} from "../_cloud-alternatives/components";
import {
  CLOUD_ALTERNATIVE_KEYS,
  CLOUD_CHECKED_DATE,
} from "../_cloud-alternatives/data";
import type { OurTokenPrice } from "../_cloud-alternatives/prices";
import {
  anthropicClientSample,
  bedrockClaudeSample,
} from "../_cloud-alternatives/samples";
import { UncensoredModelTable, type UncensoredRow } from "../uncensored-rows";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "bedrock-alternatives";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

const FAQ_KEYS: readonly (
  | "guardrails"
  | "uncensored"
  | "cost"
  | "claude"
  | "converse"
  | "enterprise"
)[] = ["guardrails", "uncensored", "cost", "claude", "converse", "enterprise"];

export interface BedrockAlternativesPageData {
  locale: CountryLanguage;
  us: UsParams;
  baseUrl: string;
  /** Uncensored models callable on the /v1 API, cheapest first. */
  rows: UncensoredRow[];
  /** Claude model for the Messages example, when live on this instance. */
  claudeId: string | null;
  prices: OurTokenPrice[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<BedrockAlternativesPageData> {
  const { locale } = await params;
  const [
    { loadUsFacts, usParams },
    { loadModelRowsByIds, loadUncensoredRows },
    { loadOurTokenPrices },
  ] = await Promise.all([
    import("../../compare/_shared/us-facts"),
    import("../uncensored-rows-data"),
    import("../_cloud-alternatives/prices"),
  ]);
  const [facts, rows, claude, prices] = await Promise.all([
    loadUsFacts(locale),
    loadUncensoredRows(locale),
    loadModelRowsByIds([CODING_TOOL_STRONG_MODEL], locale),
    loadOurTokenPrices(),
  ]);
  return {
    locale,
    us: usParams(facts),
    baseUrl: buildPublicApiBaseUrl(envClient.NEXT_PUBLIC_APP_URL, locale),
    rows: rows.filter((row) => row.apiCallable),
    claudeId: claude.find((row) => row.apiCallable)?.id ?? null,
    prices,
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

export function TanstackPage({
  locale,
  us,
  baseUrl,
  rows,
  claudeId,
  prices,
}: BedrockAlternativesPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const uncensored =
    rows.find((row) => row.id === CODING_TOOL_UNCENSORED_MODEL) ?? rows[0];
  const sampleModel = claudeId ?? uncensored?.id;
  const stats = {
    ...us,
    date: formatCompareDate(CLOUD_CHECKED_DATE, locale),
    count: CLOUD_ALTERNATIVE_KEYS.length,
    apiUncensored: rows.length,
    uncensoredExample: uncensored?.id ?? "",
  };
  const faq = FAQ_KEYS.map((key) => ({
    key,
    question: t(`faq.${key}.q`, stats),
    answer: t(`faq.${key}.a`, stats),
  }));

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        post={{ slug: SLUG, locale }}
        title={t("hero.title")}
        subtitle={t("hero.subtitle", stats)}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.lead")}</ArticleLead>
          <ArticleP>{t("intro.p2", stats)}</ArticleP>
        </Div>

        <ArticleSection
          id="bedrock"
          title={t("bedrock.title")}
          intro={t("bedrock.intro")}
        >
          <ArticleList
            items={[
              t("bedrock.guardrails"),
              t("bedrock.refusals"),
              t("bedrock.csam"),
              t("bedrock.policy"),
              t("bedrock.retention"),
              t("bedrock.models"),
            ]}
          />
        </ArticleSection>

        <ArticleSection
          id="custom-model-import"
          title={t("import.title")}
          intro={t("import.intro")}
        >
          <ArticleList
            items={[
              t("import.architectures"),
              t("import.excluded"),
              t("import.format"),
              t("import.cost"),
            ]}
          />
          <Callout icon={Cloud} tone="warning">
            {t("import.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="prices"
          title={t("prices.title")}
          intro={t("prices.intro")}
        >
          <ArticleP>{t("prices.list")}</ArticleP>
          {prices.length > 0 && (
            <>
              <ArticleH3>{t("prices.oursTitle")}</ArticleH3>
              <ArticleP>{t("prices.oursIntro")}</ArticleP>
              <PriceTable locale={locale} prices={prices} us={us} />
            </>
          )}
        </ArticleSection>

        <ArticleSection
          id="apis"
          title={t("apis.title")}
          intro={t("apis.intro")}
        >
          <ArticleP>{t("apis.claude")}</ArticleP>
          {sampleModel !== undefined && (
            <>
              <Div className="flex min-w-0 flex-col gap-2">
                <Span className="text-sm font-semibold text-foreground">
                  {t("apis.before")}
                </Span>
                <ArticleCode
                  code={bedrockClaudeSample()}
                  language="python"
                  filename="bedrock.py"
                />
              </Div>
              <Div className="flex min-w-0 flex-col gap-2">
                <Span className="text-sm font-semibold text-foreground">
                  {t("apis.after", stats)}
                </Span>
                <ArticleCode
                  code={anthropicClientSample(baseUrl, sampleModel)}
                  language="python"
                  filename="unbottled.py"
                />
              </Div>
            </>
          )}
          {uncensored !== undefined && (
            <ArticleP>{t("apis.swap", stats)}</ArticleP>
          )}
          <ArticleP>{t("apis.converse")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="clouds"
          title={t("rules.title")}
          intro={t("rules.intro")}
        >
          <CloudRulesTable
            locale={locale}
            us={us}
            keys={["bedrock", "azure", "vertex", "together"]}
          />
        </ArticleSection>

        <ArticleSection
          id="us"
          title={t("us.title", stats)}
          intro={t("us.intro", stats)}
        >
          <ArticleList
            items={[
              t("us.models", stats),
              t("us.formats"),
              t("us.consent"),
              t("us.billing", stats),
            ]}
          />
          <ArticleP>{t("us.weak")}</ArticleP>
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/${API_DOCS_PATH}`}
              label={t("us.docsLink")}
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
          </ArticleSection>
        )}

        <ArticleSection
          id="alternatives"
          title={t("list.title")}
          intro={t("list.intro", stats)}
        >
          <CloudAlternatives
            locale={locale}
            us={us}
            keys={CLOUD_ALTERNATIVE_KEYS}
          />
        </ArticleSection>

        <ArticleSection
          id="stay"
          title={t("stay.title")}
          intro={t("stay.intro")}
        >
          <ArticleList
            items={[
              t("stay.compliance"),
              t("stay.retention"),
              t("stay.weights"),
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
              href={`/${locale}/story/blog/azure-openai-alternatives`}
              label={t("faq.azureLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/openrouter-alternatives`}
              label={t("faq.openRouterLink")}
            />
            <CardLink
              href={`/${locale}/${API_KEYS_PAGE_PATH}`}
              label={t("faq.keysLink")}
            />
            <CompareInlineLinks
              locale={locale}
              versus={["openRouter", "venice", "nanoGpt"]}
            />
          </Div>
        </ArticleSection>

        <ArticleEnd
          post={{ slug: SLUG, locale }}
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle", stats)}
          actions={
            <>
              <Cta
                href={
                  uncensored?.chatHref ?? `/${locale}/threads/incognito/new`
                }
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

export default async function BedrockAlternativesPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
