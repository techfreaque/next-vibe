/**
 * Blog post: Chub AI alternatives for character roleplay.
 * /[locale]/story/blog/chub-ai-alternatives
 *
 * Chub AI facts come from its own public pages, read on CHECKED and
 * linked below. The other alternatives come from the shared comparison data
 * (compare/_shared/platforms.ts and _alternatives/catalog.ts). Our own
 * numbers (models, credits, plans) are read live from config via loadUsFacts.
 */

import type { Metadata } from "next";
import { roleplaySkillSkill } from "next-vibe/agent/skills/default-skills/roleplay-character/skill";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Theater } from "next-vibe/ui/components/icons/Theater";
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
import { CardLink, Cta } from "../../_shared/marketing";
import {
  allPlansText,
  CompareInlineLinks,
  formatCompareDate,
  freeText,
  LINK_CLASS,
  planText,
  SourceList,
} from "../../compare/_shared/compare-ui";
import {
  isVersusKey,
  PLATFORMS,
  versusPath,
} from "../../compare/_shared/platforms";
import type { UsParams } from "../../compare/_shared/us-facts";
import { scopedTranslation as compareScopedTranslation } from "../../compare/i18n";
import { MARKET_PLATFORMS } from "../_alternatives/catalog";
import {
  AlternativesComparison,
  alternativesFaq,
  AlternativesLinks,
  alternativesTotal,
} from "../_alternatives/comparison";
import { ALTERNATIVE_GUIDES } from "../_alternatives/selection";
import { guideCards } from "../guide-links";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "chub-ai-alternatives";
/** Day the Chub AI facts below were read on its own pages. */
const CHECKED = "2026-11-25";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** Alternatives with a full write-up, in list order (from the selection). */
const DETAILED = ALTERNATIVE_GUIDES[SLUG].platforms;

/** Public reports on why people leave, newest first. */
const WHY = [
  {
    key: "paywall",
    url: "https://www.roborhythms.com/best-chub-ai-alternatives/",
  },
  {
    key: "mobile",
    url: "https://www.roborhythms.com/use-venus-chub-ai-for-free/",
  },
  {
    key: "setup",
    url: "https://arcanumrpgs.com/blog/chub-ai-review/",
  },
] as const;

const FAQ_KEYS = ["best", "free", "filter", "privacy", "move"] as const;

const RELATED = [
  "janitor-ai-alternatives",
  "sillytavern-alternatives",
  "ai-roleplay-without-filter",
] as const;

export interface PageData {
  locale: CountryLanguage;
  /** Our live facts, flattened for i18n (credits, plans, models, upstream). */
  us: UsParams;
}

export async function tanstackLoader({ params }: Props): Promise<PageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  return { locale, us: usParams(await loadUsFacts(locale)) };
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

function sourceHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}

export function TanstackPage({ locale, us }: PageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareScopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const plans = planText(MARKET_PLATFORMS.chub.plan, locale, compareT);
  const stats = {
    ...us,
    date: formatCompareDate(CHECKED, locale),
    count: alternativesTotal(SLUG, []),
    plans,
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
        subtitle={t("hero.subtitle", stats)}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.lead")}</ArticleLead>
          <ArticleP>{t("intro.p2", stats)}</ArticleP>
        </Div>

        <ArticleSection
          id="subject"
          title={t("subject.title", stats)}
          intro={t("subject.intro", stats)}
        >
          <ArticleList
            items={[
              t("subject.plans", stats),
              t("subject.filter"),
              t("subject.privacy"),
              t("subject.extra"),
            ]}
          />
          <SourceList
            name="Chub AI"
            sources={MARKET_PLATFORMS.chub.sources}
            locale={locale}
          />
        </ArticleSection>

        <ArticleSection id="why" title={t("why.title")} intro={t("why.intro")}>
          <ArticleList
            items={WHY.map(({ key, url }) => (
              <Span key={key}>
                {t(`why.${key}`)}{" "}
                <ExternalLink
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={LINK_CLASS}
                >
                  {sourceHost(url)}
                </ExternalLink>
              </Span>
            ))}
          />
        </ArticleSection>

        <ArticleSection
          id="criteria"
          title={t("criteria.title")}
          intro={t("criteria.intro")}
        >
          <ArticleList
            items={[
              t("criteria.one"),
              t("criteria.two"),
              t("criteria.three"),
              t("criteria.four"),
              t("criteria.five"),
            ]}
          />
        </ArticleSection>

        <AlternativesComparison
          locale={locale}
          slug={SLUG}
          us={us}
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
              t("us.fit", stats),
              t("us.privacy"),
              t("us.price", stats),
              t("us.api", stats),
            ]}
          />
          <ArticleP>{t("us.weak", stats)}</ArticleP>
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/skill/${roleplaySkillSkill.id}`}
              label={t("us.skillLink")}
            />
            <CardLink
              href={`/${locale}/models/${toModelSlug(OWN_WORLDVIEW_UNCENSORED_MODEL_ID)}`}
              label={t("us.ownLink", stats)}
            />
          </Div>
        </ArticleSection>

        <ArticleSection
          id="alternatives"
          title={t("list.title")}
          intro={t("list.intro", stats)}
        >
          {DETAILED.map((key, index) => {
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
                    <Span key="price">
                      <Span className="font-semibold text-foreground">
                        {t("list.price")}
                      </Span>{" "}
                      {t("list.priceValue", {
                        free: freeText(platform, compareT),
                        plans: allPlansText(platform, locale, compareT),
                      })}
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
          title={t("stay.title", stats)}
          intro={t("stay.intro")}
        >
          <ArticleList
            items={[t("stay.one"), t("stay.two"), t("stay.three")]}
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
            {guideCards(locale, RELATED).map((card) => (
              <CardLink
                key={card.slug}
                href={`/${locale}${card.path}`}
                label={card.title}
              />
            ))}
            <CompareInlineLinks
              locale={locale}
              versus={["janitorAi", "characterAi", "venice", "nanoGpt"]}
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
                href={`/${locale}/skill/${roleplaySkillSkill.id}`}
                label={t("cta.start")}
                icon={Theater}
              />
              <Cta
                href={`/${locale}/threads/incognito/new`}
                label={t("cta.chat")}
                icon={MessageSquare}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function ChubAiAlternativesPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
