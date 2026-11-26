/**
 * Blog post: FreedomGPT alternatives.
 * /[locale]/story/blog/freedomgpt-alternatives
 *
 * FreedomGPT facts (model claim, plans, credit estimates, privacy wording,
 * API, desktop repo activity) were read on its own pages and GitHub on
 * FREEDOMGPT_CHECKED_DATE and live in this post's i18n with the source links
 * below. The alternatives reuse the comparison research data
 * (compare/_shared/platforms.ts + compare i18n), checked on
 * COMPARE_CHECKED_DATE. Our own numbers (credits, plans, model counts, which
 * models we serve through FreedomGPT) are read live via loadUsFacts.
 */

import type { Metadata } from "next";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
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
import {
  AlternativesComparison,
  alternativesFaq,
  AlternativesLinks,
  alternativesTotal,
} from "../_alternatives/comparison";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "freedomgpt-alternatives";

/** Day the FreedomGPT facts in this post were read on its own pages. */
const FREEDOMGPT_CHECKED_DATE = "2026-11-24";

/** FreedomGPT's own pages (and repo) the facts in this post come from. */
const FREEDOMGPT_SOURCES = {
  home: "https://www.freedomgpt.com/",
  pricing: "https://chat.freedomgpt.com/pricing",
  privacy: "https://www.freedomgpt.com/privacy-policy",
  api: "https://docs.freedomgpt.com/",
  repo: "https://github.com/ohmplatform/FreedomGPT",
} as const;

/** FreedomGPT Pro and its own credit estimates, from its pricing page. */
const FREEDOMGPT_PRO = {
  price: 20,
  credits: 2200,
  reply: 10,
  image: 25,
  video: 400,
} as const;

/** Last commit on FreedomGPT's open-source desktop repo (GitHub API). */
const FREEDOMGPT_DESKTOP_LAST_COMMIT = "2024-06-13";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** The alternatives, in list order. */
const ALTERNATIVES: readonly PlatformKey[] = [
  "venice",
  "nanoGpt",
  "uncensoredAi",
  "gabAi",
  "lmStudio",
  "ollama",
];

const FAQ_KEYS: readonly (
  | "best"
  | "free"
  | "liberty"
  | "desktop"
  | "private"
  | "api"
)[] = ["best", "free", "liberty", "desktop", "private", "api"];

export interface FreedomGptAlternativesPageData {
  locale: CountryLanguage;
  /** Our live facts, flattened for i18n (credits, plans, models, upstream). */
  us: UsParams;
}

export async function tanstackLoader({
  params,
}: Props): Promise<FreedomGptAlternativesPageData> {
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
}: FreedomGptAlternativesPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareScopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const number = new Intl.NumberFormat(locale);
  const proPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(FREEDOMGPT_PRO.price);
  const stats = {
    ...us,
    date: formatCompareDate(COMPARE_CHECKED_DATE, locale),
    fgDate: formatCompareDate(FREEDOMGPT_CHECKED_DATE, locale),
    desktopDate: formatCompareDate(FREEDOMGPT_DESKTOP_LAST_COMMIT, locale),
    count: ALTERNATIVES.length,
    proPrice,
    proCredits: number.format(FREEDOMGPT_PRO.credits),
    replyCost: FREEDOMGPT_PRO.reply,
    imageCost: FREEDOMGPT_PRO.image,
    videoCost: FREEDOMGPT_PRO.video,
    replies: number.format(
      Math.floor(FREEDOMGPT_PRO.credits / FREEDOMGPT_PRO.reply),
    ),
    images: number.format(
      Math.floor(FREEDOMGPT_PRO.credits / FREEDOMGPT_PRO.image),
    ),
    videos: number.format(
      Math.floor(FREEDOMGPT_PRO.credits / FREEDOMGPT_PRO.video),
    ),
  };
  const servesLiberty = Number(us.freedomGptModels) > 0;
  const faq = [
    ...FAQ_KEYS.map((key) => ({
      key,
      question: t(`faq.${key}.q`, stats),
      answer: t(
        key === "liberty" && !servesLiberty
          ? "faq.liberty.aOff"
          : `faq.${key}.a`,
        stats,
      ),
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
        })}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.lead")}</ArticleLead>
          <ArticleP>
            {t("intro.p2", {
              ...stats,
              count: alternativesTotal(SLUG, ALTERNATIVES),
            })}
          </ArticleP>
          {servesLiberty && <ArticleP>{t("intro.relation", stats)}</ArticleP>}
        </Div>

        <ArticleSection
          id="freedomgpt"
          title={t("fg.title")}
          intro={t("fg.intro", stats)}
        >
          <ArticleList
            items={[
              t("fg.models"),
              t("fg.filter"),
              t("fg.price", stats),
              t("fg.bonus"),
              t("fg.privacy"),
              t("fg.apps", stats),
            ]}
          />
          <ArticleP>{t("fg.why")}</ArticleP>
          <Span className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {(
              [
                ["home", t("fg.sourceHome")],
                ["pricing", t("fg.sourcePricing")],
                ["privacy", t("fg.sourcePrivacy")],
                ["api", t("fg.sourceApi")],
                ["repo", t("fg.sourceRepo")],
              ] as const
            ).map(([key, label]) => (
              <ExternalLink
                key={key}
                href={FREEDOMGPT_SOURCES[key]}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={LINK_CLASS}
              >
                {label}
              </ExternalLink>
            ))}
          </Span>
        </ArticleSection>

        <ArticleSection
          id="credits"
          title={t("credits.title", stats)}
          intro={t("credits.intro", stats)}
        >
          <ArticleList
            items={[
              t("credits.replies", stats),
              t("credits.images", stats),
              t("credits.videos", stats),
            ]}
          />
          <ArticleP>{t("credits.us", stats)}</ArticleP>
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
              t("criteria.offline"),
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
              t(servesLiberty ? "us.liberty" : "us.libertyOff", stats),
              t("us.privacy"),
              t("us.price", stats),
              t("us.open"),
            ]}
          />
          <ArticleP>{t("us.weak", stats)}</ArticleP>
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/uncensored-ai`}
              label={t("us.hubLink")}
            />
            <CardLink
              href={`/${locale}/story/abliterated-ai-chat`}
              label={t("us.abliteratedLink")}
            />
            {servesLiberty && (
              <CardLink
                href={`/${locale}/models/${toModelSlug(ChatModelId.FREEDOMGPT_LIBERTY)}`}
                label={t("us.libertyLink", stats)}
              />
            )}
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
            items={[
              t("privacy.fg"),
              t("privacy.us", stats),
              t("privacy.local"),
            ]}
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
              href={`/${locale}/story/blog/gab-ai-alternatives`}
              label={t("faq.gabLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/nofiltergpt-alternatives`}
              label={t("faq.nofilterLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/uncensored-llm-without-gpu`}
              label={t("faq.noGpuLink")}
            />
            <CompareInlineLinks
              locale={locale}
              includeHub={false}
              versus={["freedomGpt", "gabAi", "venice", "nanoGpt"]}
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

export default async function FreedomGptAlternativesPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
