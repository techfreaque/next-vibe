/**
 * Blog post: Character.AI alternatives without the filter.
 * /[locale]/story/blog/character-ai-alternatives
 *
 * Competitor facts (plans, filter, privacy, pros and cons, sources) come from
 * the comparison pages' research data (compare/_shared/platforms.ts + compare
 * i18n), checked on COMPARE_CHECKED_DATE. Our own numbers (free credits,
 * plans, packs, model counts, the own-worldview model) are read live from
 * config via loadUsFacts. The referral share comes from the referral config.
 */

import type { Metadata } from "next";
import { SKILL_CREATOR_ID } from "next-vibe/agent/skills/constants";
import { roleplaySkillSkill } from "next-vibe/agent/skills/default-skills/roleplay-character/skill";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Download } from "next-vibe/ui/components/icons/Download";
import { EyeOff } from "next-vibe/ui/components/icons/EyeOff";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Theater } from "next-vibe/ui/components/icons/Theater";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import { configScopedTranslation } from "@/env/i18n";
import { REFERRAL_CONFIG } from "@/referral/config";

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
import {
  Callout,
  CardLink,
  Cta,
  Step,
  StepList,
} from "../../_shared/marketing";
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

const SLUG = "character-ai-alternatives";
const ROLEPLAY_SKILL_ID = roleplaySkillSkill.id;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** The alternatives, in list order. Character.AI itself closes the table. */
const ALTERNATIVES: readonly PlatformKey[] = [
  "janitorAi",
  "sillyTavern",
  "crushOn",
  "kindroid",
  "nomi",
  "venice",
];

const TABLE_KEYS: readonly PlatformKey[] = [...ALTERNATIVES, "characterAi"];

const IMPORT_STEPS: readonly ("account" | "create" | "paste" | "model")[] = [
  "account",
  "create",
  "paste",
  "model",
];

const FAQ_KEYS: readonly (
  | "best"
  | "free"
  | "import"
  | "nsfw"
  | "private"
  | "account"
)[] = ["best", "free", "import", "nsfw", "private", "account"];

export interface CharacterAiAlternativesPageData {
  locale: CountryLanguage;
  /** Our live facts, flattened for i18n (free credits, plans, models). */
  us: UsParams;
}

export async function tanstackLoader({
  params,
}: Props): Promise<CharacterAiAlternativesPageData> {
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
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2068",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

export function TanstackPage({
  locale,
  us,
}: CharacterAiAlternativesPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareScopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const checked = formatCompareDate(COMPARE_CHECKED_DATE, locale);
  const stats = {
    ...us,
    date: checked,
    count: ALTERNATIVES.length,
    referralPercent: Math.round(REFERRAL_CONFIG.DIRECT_PERCENTAGE * 100),
  };
  const rows = [
    usRow(locale, compareT, us),
    ...TABLE_KEYS.map((key) => platformRow(PLATFORMS[key], locale, compareT)),
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
          id="criteria"
          title={t("criteria.title")}
          intro={t("criteria.intro")}
        >
          <ArticleList
            items={[
              t("criteria.filter"),
              t("criteria.memory"),
              t("criteria.price"),
              t("criteria.privacy"),
              t("criteria.characters"),
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
              t("us.characters", stats),
              t("us.import"),
              t("us.privacy"),
              t("us.price", stats),
            ]}
          />
          <ArticleP>{t("us.weak")}</ArticleP>
          <Div className="flex flex-col">
            <CardLink href={`/${locale}/skills`} label={t("us.skillsLink")} />
            <CardLink
              href={`/${locale}/skill/${ROLEPLAY_SKILL_ID}`}
              label={t("us.roleplayLink")}
            />
            <CardLink
              href={`/${locale}/skill/${SKILL_CREATOR_ID}`}
              label={t("us.creatorLink")}
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
                      })}{" "}
                      {compareT(`platforms.${key}.pricingNote`)}
                    </Span>,
                    <Span key="privacy">
                      <Span className="font-semibold text-foreground">
                        {t("list.privacy")}
                      </Span>{" "}
                      {compareT(`platforms.${key}.privacy`)}
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
          id="import"
          title={t("import.title")}
          intro={t("import.intro")}
        >
          <StepList>
            {IMPORT_STEPS.map((step, index) => (
              <Step
                key={step}
                number={index + 1}
                title={t(`import.steps.${step}.title`)}
                description={t(`import.steps.${step}.body`, stats)}
              />
            ))}
          </StepList>
          <Callout icon={Download} tone="neutral">
            {t("import.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="privacy"
          title={t("privacy.title")}
          intro={t("privacy.intro", stats)}
        >
          <ArticleList
            items={[
              t("privacy.incognito"),
              t("privacy.transit"),
              t("privacy.others"),
            ]}
          />
          <Callout icon={EyeOff} tone="neutral">
            {t("privacy.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="stay"
          title={t("stay.title")}
          intro={t("stay.intro")}
        >
          <ArticleList
            items={[t("stay.library"), t("stay.flat"), t("stay.filter")]}
          />
          <Callout icon={Scale} tone="neutral">
            {t("stay.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection id="faq" title={t("faq.title")}>
          <JsonLd
            id="faq-structured-data"
            data={buildFaqStructuredData(
              FAQ_KEYS.map((key) => ({
                question: t(`faq.${key}.q`, stats),
                answer: t(`faq.${key}.a`, stats),
              })),
            )}
          />
          {FAQ_KEYS.map((key) => (
            <Div key={key} className="flex flex-col gap-2">
              <ArticleH3>{t(`faq.${key}.q`, stats)}</ArticleH3>
              <ArticleP>{t(`faq.${key}.a`, stats)}</ArticleP>
            </Div>
          ))}
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/blog/ai-roleplay-without-filter`}
              label={t("faq.roleplayLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
              label={t("faq.kindsLink")}
            />
            <CompareInlineLinks
              locale={locale}
              versus={["characterAi", "janitorAi", "venice"]}
            />
          </Div>
        </ArticleSection>

        <Callout icon={Wallet} tone="primary">
          <Span>{t("partners.body", stats)}</Span>{" "}
          <Link href={`/${locale}/story/partners`} className={LINK_CLASS}>
            {t("partners.link")}
          </Link>
        </Callout>

        <ArticleEnd
          post={{ slug: SLUG, locale }}
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle", stats)}
          actions={
            <>
              <Cta
                href={`/${locale}/skill/${ROLEPLAY_SKILL_ID}`}
                label={t("cta.start")}
                icon={Theater}
              />
              <Cta
                href={`/${locale}/skills`}
                label={t("cta.skills")}
                icon={Users}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function CharacterAiAlternativesPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
