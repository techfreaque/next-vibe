/**
 * Blog post: an uncensored LLM API. Abliterated and uncensored models over
 * OpenAI and Anthropic compatible endpoints.
 * /[locale]/story/blog/uncensored-llm-api
 *
 * Model ids, context, tool support and prices come from the registry via
 * loadUncensoredRows (API-callable rows only). Base URL, unlock prices, rate
 * limit and output cap come from the API config. Other providers' API facts
 * come from the comparison research data.
 */

import type { Metadata } from "next";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { EyeOff } from "next-vibe/ui/components/icons/EyeOff";
import { Key } from "next-vibe/ui/components/icons/Key";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import { API_UNLOCK_PATH, getApiAccessPrices } from "@/api-keys/access";
import {
  API_KEY_PLACEHOLDER,
  buildPublicApiBaseUrl,
} from "@/api-keys/coding-tools";
import {
  API_DOCS_PATH,
  API_KEY_DEFAULT_RATE_LIMIT_PER_MINUTE,
  API_KEYS_PAGE_PATH,
} from "@/api-keys/constants";
import { configScopedTranslation } from "@/env/i18n";
import { V1_MAX_OUTPUT_TOKENS } from "@/v1/shared/constants";

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
import { LINK_CLASS } from "../../compare/_shared/compare-ui";
import {
  isVersusKey,
  type PlatformKey,
  PLATFORMS,
  versusPath,
} from "../../compare/_shared/platforms";
import { scopedTranslation as compareScopedTranslation } from "../../compare/i18n";
import {
  findOwnWorldviewRow,
  loadUncensoredRows,
  UncensoredModelTable,
  type UncensoredRow,
} from "../uncensored-rows";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "uncensored-llm-api";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** Other places to get uncensored models over an API, in list order. */
const OTHER_APIS: readonly PlatformKey[] = [
  "venice",
  "nanoGpt",
  "uncensoredAi",
  "openRouter",
  "ollama",
];

const FAQ_KEYS: readonly (
  | "free"
  | "ids"
  | "sdk"
  | "refuse"
  | "logs"
  | "local"
)[] = ["free", "ids", "sdk", "refuse", "logs", "local"];

export interface UncensoredApiPostPageData {
  locale: CountryLanguage;
  baseUrl: string;
  subPrice: string;
  rows: UncensoredRow[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<UncensoredApiPostPageData> {
  const { locale } = await params;
  const rows = (await loadUncensoredRows(locale)).filter(
    (row) => row.apiCallable,
  );
  return {
    locale,
    baseUrl: buildPublicApiBaseUrl(envClient.NEXT_PUBLIC_APP_URL, locale),
    subPrice: getApiAccessPrices(locale).subPrice,
    rows,
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

function curlSample(baseUrl: string, model: string, prompt: string): string {
  return `curl ${baseUrl}/chat/completions \\
  -H "Authorization: Bearer ${API_KEY_PLACEHOLDER}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "messages": [
      { "role": "user", "content": ${JSON.stringify(prompt)} }
    ]
  }'`;
}

function pythonSample(baseUrl: string, model: string, prompt: string): string {
  return `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}",
    api_key="${API_KEY_PLACEHOLDER}",
)

reply = client.chat.completions.create(
    model="${model}",
    messages=[{"role": "user", "content": ${JSON.stringify(prompt)}}],
)
print(reply.choices[0].message.content)`;
}

export function TanstackPage({
  locale,
  baseUrl,
  subPrice,
  rows,
}: UncensoredApiPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const { t: compareT } = compareScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const own = findOwnWorldviewRow(rows);
  const example = rows[0];
  const stats = {
    appName,
    count: rows.length,
    subPrice,
    ownModel: own?.name ?? "",
    rateLimit: API_KEY_DEFAULT_RATE_LIMIT_PER_MINUTE,
    maxTokens: V1_MAX_OUTPUT_TOKENS,
    example: example?.id ?? "",
  };
  const prompt = t("code.prompt");
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
          <Callout icon={Key} tone="warning">
            {t("intro.access", stats)}{" "}
            <Link href={`/${locale}/${API_UNLOCK_PATH}`} className={LINK_CLASS}>
              {t("intro.accessLink")}
            </Link>
          </Callout>
        </Div>

        <ArticleSection
          id="models"
          title={t("models.title", stats)}
          intro={t("models.intro", stats)}
        >
          <UncensoredModelTable
            rows={rows}
            columns={["apiId", "context", "tools", "price"]}
            locale={locale}
            labels={{
              model: t("models.colModel"),
              apiId: t("models.colId"),
              context: t("models.colContext"),
              tools: t("models.colTools"),
              price: t("models.colPrice"),
              yes: t("models.yes"),
              no: t("models.no"),
            }}
          />
          <ArticleP>{t("models.footnote")}</ArticleP>
        </ArticleSection>

        {example !== undefined && (
          <ArticleSection
            id="code"
            title={t("code.title")}
            intro={t("code.intro", stats)}
          >
            <Div className="flex min-w-0 flex-col gap-2">
              <Span className="text-sm font-semibold text-foreground">
                {t("code.curl")}
              </Span>
              <ArticleCode
                code={curlSample(baseUrl, example.id, prompt)}
                language="bash"
                filename="request.sh"
              />
            </Div>
            <Div className="flex min-w-0 flex-col gap-2">
              <Span className="text-sm font-semibold text-foreground">
                {t("code.python")}
              </Span>
              <ArticleCode
                code={pythonSample(baseUrl, example.id, prompt)}
                language="python"
                filename="uncensored.py"
              />
            </Div>
            <ArticleP>{t("code.anthropic")}</ArticleP>
          </ArticleSection>
        )}

        <ArticleSection
          id="consent"
          title={t("consent.title")}
          intro={t("consent.intro")}
        >
          <ArticleList
            items={[
              <Span key="where">
                {t("consent.where")}{" "}
                <Link
                  href={`/${locale}/${API_KEYS_PAGE_PATH}`}
                  className={LINK_CLASS}
                >
                  {t("consent.link")}
                </Link>
              </Span>,
              t("consent.error"),
              t("consent.once"),
            ]}
          />
        </ArticleSection>

        <ArticleSection
          id="kinds"
          title={t("kinds.title")}
          intro={t("kinds.intro")}
        >
          <ArticleList
            items={[
              t("kinds.abliterated"),
              t("kinds.fineTuned"),
              t("kinds.own", stats),
            ]}
          />
          <CardLink
            href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
            label={t("kinds.link")}
          />
        </ArticleSection>

        <ArticleSection
          id="limits"
          title={t("limits.title")}
          intro={t("limits.intro")}
        >
          <ArticleList
            items={[
              t("limits.stateless"),
              t("limits.maxTokens", stats),
              t("limits.rateLimit", stats),
              t("limits.tools"),
              t("limits.refusals"),
            ]}
          />
        </ArticleSection>

        <ArticleSection
          id="privacy"
          title={t("privacy.title")}
          intro={t("privacy.intro")}
        >
          <ArticleList items={[t("privacy.noStore"), t("privacy.upstream")]} />
          <Callout icon={EyeOff} tone="neutral">
            {t("privacy.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="others"
          title={t("others.title")}
          intro={t("others.intro", stats)}
        >
          {OTHER_APIS.map((key) => {
            const platform = PLATFORMS[key];
            return (
              <Div
                key={key}
                data-platform={key}
                className="flex flex-col gap-2"
              >
                <ArticleH3>{platform.name}</ArticleH3>
                <ArticleP>{compareT(`platforms.${key}.api`)}</ArticleP>
                <ArticleP>{compareT(`platforms.${key}.models`)}</ArticleP>
                {isVersusKey(key) && (
                  <CardLink
                    href={`/${locale}${versusPath(key)}`}
                    label={t("others.versusLink", {
                      appName,
                      name: platform.name,
                    })}
                  />
                )}
              </Div>
            );
          })}
          <CardLink
            href={`/${locale}/story/blog/openai-anthropic-compatible-api`}
            label={t("others.routerLink")}
          />
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
              href={`/${locale}/${API_DOCS_PATH}`}
              label={t("faq.docsLink")}
            />
            <CardLink
              href={`/${locale}/story/abliterated-ai-chat`}
              label={t("faq.directoryLink")}
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
                href={example?.chatHref ?? `/${locale}/threads/incognito/new`}
                label={t("cta.chat")}
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

export default async function UncensoredLlmApiPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
