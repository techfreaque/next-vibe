/**
 * Blog post: the best uncensored LLM, picked per job, plus the GLM vs
 * DeepSeek head-to-head.
 * /[locale]/story/blog/best-uncensored-llm
 *
 * Every model fact (which uncensored models are live, method, context window,
 * strengths, price per message) comes from the registry via
 * loadUncensoredRows. Picks are hand-ordered preferences with a registry
 * strength fallback, so a model that goes offline drops out or gets replaced
 * by the next model with the same strength. Our credits and plans come from
 * loadUsFacts.
 */

import type { Metadata } from "next";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import {
  ModelUtility,
  type ModelUtilityValue,
} from "next-vibe/agent/models/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Trophy } from "next-vibe/ui/components/icons/Trophy";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import { formatTokenCount } from "@/_pages/models/_shared/model-facts";
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
import { LINK_CLASS } from "../../compare/_shared/compare-data";
import { CompareInlineLinks } from "../../compare/_shared/compare-ui";
import type { UsParams } from "../../compare/_shared/us-facts";
import {
  type ComparePair,
  findOwnWorldviewRow,
  pickRow,
  UncensoredModelTable,
  type UncensoredRow,
} from "../uncensored-rows";
import { loadComparePairs, loadUncensoredRows } from "../uncensored-rows-data";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "best-uncensored-llm";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

type JobKey =
  | "reasoning"
  | "everyday"
  | "coding"
  | "fiction"
  | "viewpoint"
  | "vision";

interface Job {
  key: JobKey;
  /** Preferred models, in order. */
  prefer: readonly ChatModelId[];
  /** Registry strength a fallback model must carry; null = no fallback. */
  strength: typeof ModelUtilityValue | null;
}

const JOBS: readonly Job[] = [
  {
    key: "reasoning",
    prefer: [
      ChatModelId.GLM_5_3_UNCENSORED,
      ChatModelId.KIMI_K3_1_PRO_UNCENSORED,
    ],
    strength: ModelUtility.REASONING,
  },
  {
    key: "everyday",
    prefer: [
      ChatModelId.GLM_5_3_FLASH_UNCENSORED,
      ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
    ],
    strength: ModelUtility.FAST,
  },
  {
    key: "coding",
    prefer: [
      ChatModelId.QWEN_3_6_PLUS_UNCENSORED,
      ChatModelId.DEEPSEEK_V4_1_FLASH_CSF,
    ],
    strength: ModelUtility.CODING,
  },
  {
    key: "fiction",
    prefer: [
      ChatModelId.VENICE_UNCENSORED_ROLEPLAY,
      ChatModelId.DRUMMER_ARTEMIS_31B,
    ],
    strength: ModelUtility.ROLEPLAY_DARK,
  },
  {
    key: "viewpoint",
    prefer: [ChatModelId.UNCENSORED_LM_V1_2],
    strength: null,
  },
  {
    key: "vision",
    prefer: [ChatModelId.GEMMA_4_UNCENSORED, ChatModelId.SUPERGEMMA_4_26B],
    strength: ModelUtility.VISION,
  },
];

/** The two abliterated flagships people compare most. */
const HEAD_TO_HEAD: readonly [ChatModelId, ChatModelId] = [
  ChatModelId.GLM_5_3_UNCENSORED,
  ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
];

const PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  HEAD_TO_HEAD,
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
  [
    ChatModelId.UNCENSORED_LM_V1_2,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
  [ChatModelId.KIMI_K3_1_PRO, ChatModelId.KIMI_K3_1_PRO_UNCENSORED],
  [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED],
];

const FAQ_KEYS: readonly (
  | "best"
  | "free"
  | "roleplay"
  | "coding"
  | "quality"
  | "api"
)[] = ["best", "free", "roleplay", "coding", "quality", "api"];

interface JobPick {
  key: JobKey;
  row: UncensoredRow;
}

export interface BestUncensoredLlmPageData {
  locale: CountryLanguage;
  us: UsParams;
  rows: UncensoredRow[];
  pairs: ComparePair[];
}

/** One model per job, no model twice; a job with no fitting model is skipped. */
function buildPicks(rows: readonly UncensoredRow[]): JobPick[] {
  const used = new Set<string>();
  const picks: JobPick[] = [];
  for (const job of JOBS) {
    const free = rows.filter((row) => !used.has(row.id));
    const strength = job.strength;
    const row =
      pickRow(free, job.prefer) ??
      (strength === null
        ? undefined
        : free.find((candidate) => candidate.strengths.includes(strength)));
    if (row !== undefined) {
      used.add(row.id);
      picks.push({ key: job.key, row });
    }
  }
  return picks;
}

export async function tanstackLoader({
  params,
}: Props): Promise<BestUncensoredLlmPageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  const [facts, rows, pairs] = await Promise.all([
    loadUsFacts(locale),
    loadUncensoredRows(locale),
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
}: BestUncensoredLlmPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const picks = buildPicks(rows);
  const own = findOwnWorldviewRow(rows);
  const cheapest = rows[0];
  const headToHead = HEAD_TO_HEAD.flatMap((id) => {
    const row = rows.find((candidate) => candidate.id === id);
    return row === undefined ? [] : [row];
  });
  // Both head-to-head models live ⇔ their pair survived loadComparePairs as pairs[0].
  const headToHeadPair = headToHead.length === 2 ? pairs[0] : undefined;
  const otherPairs = headToHead.length === 2 ? pairs.slice(1) : pairs;
  const topPick =
    picks.find((pick) => pick.key === "reasoning")?.row ?? picks[0]?.row;
  const stats = {
    ...us,
    count: rows.length,
    ownModel: own?.name ?? us.ownModel,
    cheapestModel: cheapest?.name ?? "",
    cheapestPrice: cheapest?.messagePrice ?? "",
    topModel: topPick?.name ?? "",
  };
  const faq = FAQ_KEYS.map((key) => ({
    key,
    question: t(`faq.${key}.q`, stats),
    answer: t(`faq.${key}.a`, stats),
  }));
  const tableLabels = {
    model: t("table.model"),
    context: t("table.context"),
    strengths: t("table.strengths"),
    price: t("table.price"),
    chat: t("table.chat"),
    chatLink: (name: string): string => t("table.chatLink", { model: name }),
  };

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
          id="method"
          title={t("method.title")}
          intro={t("method.intro")}
        >
          <ArticleList
            items={[
              t("method.answers"),
              t("method.base"),
              t("method.context"),
              t("method.price"),
            ]}
          />
          <Callout icon={Trophy} tone="neutral">
            {t("method.callout")}
          </Callout>
          <CardLink
            href={`/${locale}/story/refusal-index`}
            label={t("method.refusalLink")}
          />
        </ArticleSection>

        {picks.length > 0 && (
          <ArticleSection
            id="picks"
            title={t("picks.title")}
            intro={t("picks.intro")}
          >
            {picks.map(({ key, row }, index) => {
              const params = {
                ...stats,
                number: index + 1,
                model: row.name,
                context: formatTokenCount(row.contextWindow),
                price: row.messagePrice,
                strengths: row.strengthText,
              };
              return (
                <Div key={key} data-pick={key} className="flex flex-col gap-2">
                  <ArticleH3>{t(`picks.${key}.title`, params)}</ArticleH3>
                  <ArticleP>{t(`picks.${key}.body`, params)}</ArticleP>
                  <ArticleP>{t("picks.facts", params)}</ArticleP>
                  <Link href={row.chatHref} className={LINK_CLASS}>
                    {t("table.chatLink", { model: row.name })}
                  </Link>
                </Div>
              );
            })}
          </ArticleSection>
        )}

        {headToHead.length === 2 && (
          <ArticleSection
            id="glm-vs-deepseek"
            title={t("versus.title", {
              a: headToHead[0]?.name ?? "",
              b: headToHead[1]?.name ?? "",
            })}
            intro={t("versus.intro")}
          >
            <UncensoredModelTable
              rows={headToHead}
              columns={["context", "strengths", "price", "chat"]}
              locale={locale}
              labels={tableLabels}
            />
            <ArticleList
              items={[
                t("versus.glm", { model: headToHead[0]?.name ?? "" }),
                t("versus.deepseek", { model: headToHead[1]?.name ?? "" }),
                t("versus.verdict"),
              ]}
            />
            {headToHeadPair !== undefined && (
              <CardLink
                href={`/${locale}${headToHeadPair.path}`}
                label={t("versus.compareLink", {
                  a: headToHeadPair.a.name,
                  b: headToHeadPair.b.name,
                })}
              />
            )}
          </ArticleSection>
        )}

        <ArticleSection
          id="all"
          title={t("all.title", stats)}
          intro={t("all.intro", stats)}
        >
          <UncensoredModelTable
            rows={rows}
            columns={["context", "strengths", "price", "chat"]}
            locale={locale}
            labels={tableLabels}
          />
          <ArticleP>{t("all.footnote")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="kinds"
          title={t("kinds.title")}
          intro={t("kinds.intro")}
        >
          <ArticleList
            items={[t("kinds.abliterated"), t("kinds.own", stats)]}
          />
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
              label={t("kinds.explainerLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/uncensored-models-what-each-is-good-at`}
              label={t("kinds.tourLink")}
            />
          </Div>
        </ArticleSection>

        <ArticleSection
          id="local"
          title={t("local.title")}
          intro={t("local.intro")}
        >
          <ArticleList
            items={[t("local.local"), t("local.hosted"), t("local.api", stats)]}
          />
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/blog/uncensored-llm-without-gpu`}
              label={t("local.noGpuLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/uncensored-llm-api`}
              label={t("local.apiLink")}
            />
          </Div>
        </ArticleSection>

        {otherPairs.length > 0 && (
          <ArticleSection
            id="pairs"
            title={t("pairs.title")}
            intro={t("pairs.intro")}
          >
            <Div className="flex flex-col">
              {otherPairs.map((pair) => (
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
              href={`/${locale}/story/blog/uncensored-ai-writer`}
              label={t("faq.writerLink")}
            />
            <CardLink
              href={`/${locale}/story/abliterated-ai-chat`}
              label={t("faq.directoryLink")}
            />
            <CardLink
              href={`/${locale}/story/compare/uncensored-ai-platforms`}
              label={t("faq.platformsLink")}
            />
            <CompareInlineLinks
              locale={locale}
              versus={["venice", "nanoGpt", "uncensoredAi"]}
              includeHub={false}
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
                href={topPick?.chatHref ?? `/${locale}/threads/incognito/new`}
                label={t("cta.start", stats)}
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

export default async function BestUncensoredLlmPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
