/**
 * Blog post: free uncensored AI, what each free tier really gives you.
 * /[locale]/story/blog/free-uncensored-ai
 *
 * Written German-first for the native "unzensierte KI kostenlos" /
 * "IA sans censure gratuite" / "IA sin censura gratis" / "AI senza censura
 * gratis" / "AI bez cenzury za darmo" searches (see
 * scratchpad/seo/native-keywords-2026-11-24.md). Every competitor fact comes
 * from the comparison research (compare/_shared/platforms.ts + compare i18n,
 * each platform's own checked date). Our own numbers (credits, plans, model
 * counts) are read live from config via loadUsFacts.
 */

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { EyeOff } from "next-vibe/ui/components/icons/EyeOff";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import {
  OWN_WORLDVIEW_UNCENSORED_MODEL_ID,
  toModelSlug,
} from "@/_pages/models/_shared/model-facts";
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
import { Callout, CardLink, Cta } from "../../_shared/marketing";
import {
  CompareInlineLinks,
  CompareTable,
  formatCompareDate,
  LINK_CLASS,
  platformRow,
  usRow,
} from "../../compare/_shared/compare-ui";
import {
  COMPARE_LATEST_CHECK_DATE,
  isVersusKey,
  platformCheckedDate,
  type PlatformKey,
  PLATFORMS,
  versusPath,
} from "../../compare/_shared/platforms";
import type { UsParams } from "../../compare/_shared/us-facts";
import { scopedTranslation as compareScopedTranslation } from "../../compare/i18n";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "free-uncensored-ai";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** Hosted free tiers first, then the two local tools, in list order. */
const FREE_OPTIONS: readonly PlatformKey[] = [
  "venice",
  "uncensoredAi",
  "freedomGpt",
  "gabAi",
  "nanoGpt",
  "openRouter",
  "lmStudio",
  "ollama",
];

const FAQ_KEYS: readonly (
  | "best"
  | "noAccount"
  | "unlimited"
  | "language"
  | "api"
  | "legal"
)[] = ["best", "noAccount", "unlimited", "language", "api", "legal"];

export interface FreeUncensoredAiPageData {
  locale: CountryLanguage;
  /** Our live facts, flattened for i18n (credits, plans, models, upstream). */
  us: UsParams;
}

export async function tanstackLoader({
  params,
}: Props): Promise<FreeUncensoredAiPageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  const facts = await loadUsFacts(locale);
  return { locale, us: usParams(facts) };
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
}: FreeUncensoredAiPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareScopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const stats = {
    ...us,
    date: formatCompareDate(COMPARE_LATEST_CHECK_DATE, locale),
    count: FREE_OPTIONS.length,
  };
  const rows = [
    usRow(locale, compareT, us),
    ...FREE_OPTIONS.map((key) => platformRow(PLATFORMS[key], locale, compareT)),
  ];
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
          id="short"
          title={t("short.title")}
          intro={t("short.intro")}
        >
          <ArticleList
            items={[t("short.local"), t("short.hosted"), t("short.us", stats)]}
          />
        </ArticleSection>

        <ArticleSection
          id="catch"
          title={t("catch.title")}
          intro={t("catch.intro")}
        >
          <ArticleList
            items={[
              t("catch.limit"),
              t("catch.models"),
              t("catch.account"),
              t("catch.data"),
              t("catch.hardware"),
            ]}
          />
          <Callout icon={EyeOff} tone="neutral">
            {t("catch.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="table"
          title={t("table.title")}
          intro={t("table.intro", stats)}
        >
          <CompareTable rows={rows} locale={locale} />
        </ArticleSection>

        <ArticleSection
          id="us"
          title={t("us.title", stats)}
          intro={t("us.intro", stats)}
        >
          <ArticleList
            items={[
              t("us.guest", stats),
              t("us.account", stats),
              t("us.models", stats),
              t("us.consent"),
              t("us.after", stats),
            ]}
          />
          <ArticleP>{t("us.weak")}</ArticleP>
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/uncensored-ai`}
              label={t("us.hubLink")}
            />
            <CardLink
              href={`/${locale}/models/${toModelSlug(OWN_WORLDVIEW_UNCENSORED_MODEL_ID)}`}
              label={t("us.ownLink", stats)}
            />
          </Div>
        </ArticleSection>

        <ArticleSection
          id="options"
          title={t("list.title", stats)}
          intro={t("list.intro")}
        >
          {FREE_OPTIONS.map((key, index) => {
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
                    <Span key="free">
                      <Span className="font-semibold text-foreground">
                        {t("list.free")}
                      </Span>{" "}
                      {compareT(`platforms.${key}.pricingNote`)}
                    </Span>,
                    <Span key="filter">
                      <Span className="font-semibold text-foreground">
                        {t("list.filter")}
                      </Span>{" "}
                      {compareT(`platforms.${key}.filter`)}
                    </Span>,
                    <Span key="privacy">
                      <Span className="font-semibold text-foreground">
                        {t("list.privacy")}
                      </Span>{" "}
                      {compareT(`platforms.${key}.privacy`)}
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
                <Span className="text-sm text-muted-foreground">
                  {t("list.checked", {
                    date: formatCompareDate(platformCheckedDate(key), locale),
                  })}
                </Span>
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
          id="local"
          title={t("local.title")}
          intro={t("local.intro")}
        >
          <ArticleList
            items={[t("local.cost"), t("local.quality"), t("local.privacy")]}
          />
          <CardLink
            href={`/${locale}/story/blog/uncensored-llm-without-gpu`}
            label={t("local.link")}
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
              href={`/${locale}/story/blog/ai-chat-no-sign-up`}
              label={t("faq.noSignUpLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
              label={t("faq.kindsLink")}
            />
            <CompareInlineLinks
              locale={locale}
              versus={["venice", "uncensoredAi", "freedomGpt", "openRouter"]}
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
                href={`/${locale}/threads/incognito/new`}
                label={t("cta.start")}
                icon={MessageSquare}
              />
              <Cta
                href={`/${locale}/story/uncensored-ai`}
                label={t("cta.models")}
                icon={Scale}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function FreeUncensoredAiPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
