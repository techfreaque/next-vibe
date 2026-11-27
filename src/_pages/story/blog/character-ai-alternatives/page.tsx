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
  availabilityText,
  formatCompareDate,
  freeText,
  LINK_CLASS,
  mediaText,
  openSourceText,
  paidText,
  type TableRowData,
} from "../../compare/_shared/compare-data";
import { CompareInlineLinks } from "../../compare/_shared/compare-ui";
import {
  type PlatformSource,
  VERSUS_KEYS,
  versusPath,
} from "../../compare/_shared/platforms";
import type { UsParams } from "../../compare/_shared/us-facts";
import { scopedTranslation as compareScopedTranslation } from "../../compare/i18n";
import {
  AlternativesComparison,
  alternativesFaq,
  AlternativesLinks,
} from "../_alternatives/comparison";
import { guideCards } from "../guide-links";
import type { RelatedModelLink } from "../related-models-data";
import {
  ALTERNATIVES,
  CHECKED_DATE,
  RESEARCH,
  SWITCH_SOURCES,
  TABLE_KEYS,
} from "./facts";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "character-ai-alternatives";
const ROLEPLAY_SKILL_ID = roleplaySkillSkill.id;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

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
  | "memory"
)[] = ["best", "free", "import", "nsfw", "private", "account", "memory"];

export interface CharacterAiAlternativesPageData {
  locale: CountryLanguage;
  /** Our live facts, flattened for i18n (free credits, plans, models). */
  us: UsParams;
  relatedModels: RelatedModelLink[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<CharacterAiAlternativesPageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  const facts = await loadUsFacts(locale);
  const { loadRelatedModels } = await import("../related-models-data");
  return {
    locale,
    us: usParams(facts),
    relatedModels: await loadRelatedModels(SLUG),
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
  relatedModels,
}: CharacterAiAlternativesPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareScopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const stats = {
    ...us,
    date: formatCompareDate(CHECKED_DATE, locale),
    referralPercent: Math.round(REFERRAL_CONFIG.DIRECT_PERCENTAGE * 100),
  };
  const versusHref = (key: keyof typeof RESEARCH): string | null => {
    const versus = VERSUS_KEYS.find((entry) => entry === key);
    return versus === undefined ? null : `/${locale}${versusPath(versus)}`;
  };
  const rows: TableRowData[] = TABLE_KEYS.map((key): TableRowData => {
    const platform = RESEARCH[key];
    return {
      key,
      name: platform.name,
      href: versusHref(key),
      external: platform.url,
      isUs: false,
      sources: platform.sources.slice(0, 2),
      cells: {
        kind: compareT(`common.kinds.${platform.kind}`),
        free:
          key === "kindroid" || key === "chub"
            ? t(`options.${key}.free`)
            : freeText(platform, compareT),
        paid: paidText(platform, locale, compareT),
        filter: t(`options.${key}.filter`),
        privacy: t(`options.${key}.privacy`),
        api: availabilityText(platform.api, compareT),
        media: mediaText(platform, compareT),
        open: openSourceText(platform, compareT),
      },
    };
  });
  const faq = [
    ...FAQ_KEYS.map((key) => ({
      key,
      question: t(`faq.${key}.q`, stats),
      answer: t(`faq.${key}.a`, stats),
    })),
    alternativesFaq(SLUG, locale, us.appName),
  ];

  const sourceLinks = (platform: {
    name: string;
    sources: readonly PlatformSource[];
  }): JSX.Element => (
    <Span className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {platform.sources.map(({ kind, url }) => (
        <ExternalLink
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={LINK_CLASS}
        >
          {compareT(`common.sourceKinds.${kind}`, { name: platform.name })}
        </ExternalLink>
      ))}
    </Span>
  );

  const platformFacts = (key: keyof typeof RESEARCH): JSX.Element => (
    <ArticleList
      items={[
        <Span key="price">
          <Span className="font-semibold text-foreground">
            {t("list.price")}
          </Span>{" "}
          {t(`options.${key}.pricing`, {
            plans: allPlansText(RESEARCH[key], locale, compareT),
          })}
        </Span>,
        <Span key="filter">
          <Span className="font-semibold text-foreground">
            {t("list.filter")}
          </Span>{" "}
          {t(`options.${key}.filter`)}
        </Span>,
        <Span key="pro">
          <Span className="font-semibold text-foreground">{t("list.pro")}</Span>{" "}
          {t(`options.${key}.pro`)}
        </Span>,
        <Span key="con">
          <Span className="font-semibold text-foreground">{t("list.con")}</Span>{" "}
          {t(`options.${key}.con`)}
        </Span>,
      ]}
    />
  );

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
          id="character-ai"
          title={t("characterAi.title")}
          intro={t("options.characterAi.summary")}
        >
          {platformFacts("characterAi")}
          {sourceLinks(RESEARCH.characterAi)}
        </ArticleSection>

        <ArticleSection
          id="why-switch"
          title={t("switch.title")}
          intro={t("switch.intro")}
        >
          <ArticleList
            items={SWITCH_SOURCES.map(([key, href]) => (
              <Span key={href}>
                {t(`switch.reasons.${key}.body`)}{" "}
                <ExternalLink
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={LINK_CLASS}
                >
                  {t(`switch.reasons.${key}.source`)}
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
              t("criteria.filter"),
              t("criteria.memory"),
              t("criteria.price"),
              t("criteria.privacy"),
              t("criteria.characters"),
            ]}
          />
        </ArticleSection>

        <AlternativesComparison
          locale={locale}
          slug={SLUG}
          us={us}
          customRows={rows}
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
              t("us.characters"),
              t("us.consent"),
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
            const platform = RESEARCH[key];
            const href = versusHref(key);
            return (
              <Div
                key={key}
                data-platform={key}
                className="flex flex-col gap-3"
              >
                <ArticleH3>
                  {t("list.heading", {
                    number: index + 2,
                    name: platform.name,
                    bestFor: t(`options.${key}.bestFor`),
                  })}
                </ArticleH3>
                <ArticleP>{t(`options.${key}.summary`)}</ArticleP>
                {platformFacts(key)}
                {sourceLinks(platform)}
                {href !== null && (
                  <CardLink
                    href={href}
                    label={t("list.versusLink", {
                      appName: us.appName,
                      name: platform.name,
                    })}
                  />
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
          <ArticleList items={[t("privacy.incognito"), t("privacy.transit")]} />
          <Callout icon={EyeOff} tone="neutral">
            {t("privacy.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="stay"
          title={t("stay.title")}
          intro={t("stay.intro")}
        >
          <ArticleList items={[t("stay.library"), t("stay.flat")]} />
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
              href={`/${locale}/story/blog/ai-roleplay-without-filter`}
              label={t("faq.roleplayLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
              label={t("faq.kindsLink")}
            />
            {guideCards(locale, ["janitor-ai-alternatives"]).map((card) => (
              <CardLink
                key={card.slug}
                href={`/${locale}${card.path}`}
                label={card.title}
              />
            ))}
            <CompareInlineLinks
              locale={locale}
              includeHub={false}
              versus={["characterAi", "janitorAi", "venice", "nanoGpt"]}
            />
          </Div>
        </ArticleSection>

        <Callout icon={Wallet} tone="primary">
          <Span>{t("partners.body", stats)}</Span>{" "}
          <Link href={`/${locale}/story/partners`} className={LINK_CLASS}>
            {t("partners.link")}
          </Link>
        </Callout>

        <AlternativesLinks locale={locale} exclude={SLUG} />

        <ArticleEnd
          post={{ slug: SLUG, locale }}
          relatedModels={relatedModels}
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
