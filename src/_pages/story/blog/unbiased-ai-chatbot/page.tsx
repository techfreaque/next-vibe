/**
 * Blog post: is there an unbiased AI chatbot? Why none is neutral, and how
 * to hear every side by asking several models.
 * /[locale]/story/blog/unbiased-ai-chatbot
 *
 * The lineup (tier, method, context, price per message) comes from the
 * registry via loadModelRowsByIds; models that go offline drop out. Gab's
 * self-description matches the comparison research data
 * (compare i18n platforms.gabAi). Our credits come from loadUsFacts.
 */

import type { Metadata } from "next";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { ExternalLink } from "next-vibe/ui/components/link";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import { OWN_WORLDVIEW_UNCENSORED_MODEL_ID } from "@/_pages/models/_shared/model-facts";
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
import {
  Callout,
  CardLink,
  Cta,
  Step,
  StepList,
} from "../../_shared/marketing";
import { LINK_CLASS } from "../../compare/_shared/compare-ui";
import type { UsParams } from "../../compare/_shared/us-facts";
import {
  type ComparePair,
  loadComparePairs,
  loadModelRowsByIds,
  UncensoredModelTable,
  type UncensoredRow,
} from "../uncensored-rows";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "unbiased-ai-chatbot";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** One question, several frames: mainstream, open, abliterated, own worldview, openly slanted. */
const LINEUP: readonly ChatModelId[] = [
  ChatModelId.GPT_6_2_SOL,
  ChatModelId.CLAUDE_SONNET_5_5,
  ChatModelId.GROK_4_7,
  ChatModelId.GLM_5_3_UNCENSORED,
  ChatModelId.UNCENSORED_LM_V1_2,
  ChatModelId.GAB_AI_ARYA,
];

const PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GPT_6_2_SOL],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.CLAUDE_SONNET_5_5],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GROK_4_7],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
];

/** Skills that argue, question or present several sides. */
const SKILLS: readonly {
  id: string;
  key: "historian" | "advocate" | "debater" | "chan";
}[] = [
  { id: "unbiased-historian", key: "historian" },
  { id: "devils-advocate", key: "advocate" },
  { id: "debater", key: "debater" },
  { id: "4chan", key: "chan" },
];

/** Public sources for the "no AI is neutral" section. */
const SOURCES: readonly { key: "openai" | "paper"; url: string }[] = [
  {
    key: "openai",
    url: "https://openai.com/index/defining-and-evaluating-political-bias-in-llms/",
  },
  { key: "paper", url: "https://arxiv.org/abs/2503.05728" },
];

const STEPS: readonly ("ask" | "switch" | "steelman" | "check")[] = [
  "ask",
  "switch",
  "steelman",
  "check",
];

const FAQ_KEYS: readonly (
  | "exists"
  | "chatgpt"
  | "conservative"
  | "truth"
  | "side"
  | "free"
)[] = ["exists", "chatgpt", "conservative", "truth", "side", "free"];

export interface UnbiasedPostPageData {
  locale: CountryLanguage;
  us: UsParams;
  rows: UncensoredRow[];
  pairs: ComparePair[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<UnbiasedPostPageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  const [facts, rows, pairs] = await Promise.all([
    loadUsFacts(locale),
    loadModelRowsByIds(LINEUP, locale),
    loadComparePairs(PAIRS),
  ]);
  return { locale, us: usParams(facts), rows, pairs };
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
  rows,
  pairs,
}: UnbiasedPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const own = rows.find((row) => row.id === OWN_WORLDVIEW_UNCENSORED_MODEL_ID);
  const gab = rows.find((row) => row.id === ChatModelId.GAB_AI_ARYA);
  const stats = {
    ...us,
    count: rows.length,
    ownModel: own?.name ?? us.ownModel,
    gabModel: gab?.name ?? "Gab AI Arya",
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
          id="no-neutral"
          title={t("neutral.title")}
          intro={t("neutral.intro")}
        >
          <ArticleList
            items={[t("neutral.data"), t("neutral.tuning"), t("neutral.rules")]}
          />
          <ArticleP>{t("neutral.sourcesIntro")}</ArticleP>
          <ArticleList
            items={SOURCES.map((source) => (
              <ExternalLink
                key={source.key}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={LINK_CLASS}
              >
                {t(`neutral.sources.${source.key}`)}
              </ExternalLink>
            ))}
          />
          <Callout icon={Scale} tone="neutral">
            {t("neutral.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="frames"
          title={t("frames.title")}
          intro={t("frames.intro")}
        >
          <ArticleList
            items={[
              t("frames.mainstream"),
              t("frames.abliterated"),
              t("frames.own", stats),
              t("frames.gab", stats),
            ]}
          />
          <CardLink
            href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
            label={t("frames.kindsLink")}
          />
        </ArticleSection>

        {rows.length > 0 && (
          <ArticleSection
            id="lineup"
            title={t("lineup.title", stats)}
            intro={t("lineup.intro")}
          >
            <UncensoredModelTable
              rows={rows}
              columns={["context", "price", "chat"]}
              locale={locale}
              labels={{
                model: t("table.model"),
                context: t("table.context"),
                price: t("table.price"),
                chat: t("table.chat"),
                chatLink: (name) => t("table.chatLink", { model: name }),
              }}
            />
            <ArticleP>{t("lineup.footnote")}</ArticleP>
          </ArticleSection>
        )}

        <ArticleSection
          id="method"
          title={t("method.title")}
          intro={t("method.intro")}
        >
          <StepList>
            {STEPS.map((step, index) => (
              <Step
                key={step}
                number={index + 1}
                title={t(`method.${step}.title`)}
                description={t(`method.${step}.body`, stats)}
              />
            ))}
          </StepList>
        </ArticleSection>

        <ArticleSection
          id="skills"
          title={t("skills.title")}
          intro={t("skills.intro")}
        >
          <Div className="flex flex-col">
            {SKILLS.map((skill) => (
              <CardLink
                key={skill.id}
                href={`/${locale}/skill/${skill.id}`}
                label={t(`skills.${skill.key}`)}
              />
            ))}
          </Div>
        </ArticleSection>

        {pairs.length > 0 && (
          <ArticleSection
            id="pairs"
            title={t("pairs.title", stats)}
            intro={t("pairs.intro")}
          >
            <Div className="flex flex-col">
              {pairs.map((pair) => (
                <CardLink
                  key={pair.path}
                  href={`/${locale}${pair.path}`}
                  label={t("pairs.link", { a: pair.a.name, b: pair.b.name })}
                />
              ))}
            </Div>
          </ArticleSection>
        )}

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
              href={`/${locale}/story/refusal-index`}
              label={t("faq.refusalLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/chatgpt-jailbreak-alternative`}
              label={t("faq.jailbreakLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/best-uncensored-llm`}
              label={t("faq.bestLink")}
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
                href={own?.chatHref ?? `/${locale}/threads/incognito/new`}
                label={t("cta.start")}
                icon={MessageSquare}
              />
              <Cta
                href={`/${locale}/models`}
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

export default async function UnbiasedAiChatbotPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
