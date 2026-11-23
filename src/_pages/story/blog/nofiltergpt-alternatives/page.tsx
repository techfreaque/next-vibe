/**
 * Blog post: NoFilterGPT alternatives.
 * /[locale]/story/blog/nofiltergpt-alternatives
 *
 * NoFilterGPT facts (plans, model, payments, privacy wording) were read on
 * its own home page and privacy policy on NOFILTERGPT_CHECKED_DATE and live
 * in this post's i18n with the source links below. The alternatives reuse the
 * comparison research data (compare/_shared/platforms.ts + compare i18n),
 * checked on COMPARE_CHECKED_DATE. Our own numbers (credits, plans, model
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
  allPlansText,
  CompareInlineLinks,
  CompareTable,
  formatCompareDate,
  freeText,
  LINK_CLASS,
  platformRow,
  usRow,
} from "../../compare/_shared/compare-ui";
import {
  COMPARE_CHECKED_DATE,
  isVersusKey,
  type PlatformKey,
  PLATFORMS,
  versusPath,
} from "../../compare/_shared/platforms";
import type { UsParams } from "../../compare/_shared/us-facts";
import { scopedTranslation as compareScopedTranslation } from "../../compare/i18n";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "nofiltergpt-alternatives";

/** Day the NoFilterGPT facts in this post were read on its own pages. */
const NOFILTERGPT_CHECKED_DATE = "2026-11-23";

/** NoFilterGPT's own pages the facts in this post come from. */
const NOFILTERGPT_SOURCES = {
  home: "https://nofiltergpt.com/",
  privacy: "https://nofiltergpt.com/privacy",
} as const;

/** NoFilterGPT's paid plan, USD per month, from its home page. */
const NOFILTERGPT_PRO_PRICE = 11.99;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** The alternatives, in list order. */
const ALTERNATIVES: readonly PlatformKey[] = [
  "venice",
  "uncensoredAi",
  "freedomGpt",
  "nanoGpt",
  "gabAi",
  "lmStudio",
];

const FAQ_KEYS: readonly (
  | "best"
  | "free"
  | "models"
  | "private"
  | "api"
  | "account"
)[] = ["best", "free", "models", "private", "api", "account"];

export interface NoFilterGptAlternativesPageData {
  locale: CountryLanguage;
  /** Our live facts, flattened for i18n (credits, plans, models, upstream). */
  us: UsParams;
}

export async function tanstackLoader({
  params,
}: Props): Promise<NoFilterGptAlternativesPageData> {
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
}: NoFilterGptAlternativesPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareScopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const proPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(NOFILTERGPT_PRO_PRICE);
  const stats = {
    ...us,
    date: formatCompareDate(COMPARE_CHECKED_DATE, locale),
    nfDate: formatCompareDate(NOFILTERGPT_CHECKED_DATE, locale),
    count: ALTERNATIVES.length,
    proPrice,
  };
  const rows = [
    usRow(locale, compareT, us),
    ...ALTERNATIVES.map((key) => platformRow(PLATFORMS[key], locale, compareT)),
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
          id="nofiltergpt"
          title={t("nfg.title")}
          intro={t("nfg.intro", stats)}
        >
          <ArticleList
            items={[
              t("nfg.model"),
              t("nfg.price", stats),
              t("nfg.media"),
              t("nfg.privacy"),
              t("nfg.payments"),
            ]}
          />
          <ArticleP>{t("nfg.why")}</ArticleP>
          <Span className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <ExternalLink
              href={NOFILTERGPT_SOURCES.home}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={LINK_CLASS}
            >
              {t("nfg.sourceHome")}
            </ExternalLink>
            <ExternalLink
              href={NOFILTERGPT_SOURCES.privacy}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={LINK_CLASS}
            >
              {t("nfg.sourcePrivacy")}
            </ExternalLink>
          </Span>
        </ArticleSection>

        <ArticleSection
          id="criteria"
          title={t("criteria.title")}
          intro={t("criteria.intro")}
        >
          <ArticleList
            items={[
              t("criteria.models"),
              t("criteria.filter"),
              t("criteria.privacy"),
              t("criteria.price"),
              t("criteria.api"),
            ]}
          />
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
              t("us.models", stats),
              t("us.switch"),
              t("us.privacy"),
              t("us.price", stats),
              t("us.api", stats),
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
                    <Span key="models">
                      <Span className="font-semibold text-foreground">
                        {t("list.models")}
                      </Span>{" "}
                      {compareT(`platforms.${key}.models`)}
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
          id="privacy"
          title={t("privacy.title")}
          intro={t("privacy.intro")}
        >
          <ArticleList
            items={[t("privacy.nfg"), t("privacy.us"), t("privacy.transit")]}
          />
          <Callout icon={EyeOff} tone="neutral">
            {t("privacy.callout")}
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
              href={`/${locale}/story/blog/chatgpt-alternative-without-filters`}
              label={t("faq.chatgptLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
              label={t("faq.kindsLink")}
            />
            <CompareInlineLinks
              locale={locale}
              versus={["venice", "freedomGpt", "nanoGpt"]}
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

export default async function NoFilterGptAlternativesPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
