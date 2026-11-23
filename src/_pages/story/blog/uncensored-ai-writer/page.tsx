/**
 * Blog post: uncensored AI writer for fiction (dark scenes, long manuscripts).
 * /[locale]/story/blog/uncensored-ai-writer
 *
 * Model facts (which uncensored models are live, method, context window,
 * context in printed pages, strengths, price per message) come from the
 * registry via loadUncensoredRows. The picks are hand-ordered preferences
 * with registry fallbacks, so a model that goes offline drops out instead of
 * leaving stale copy. Our credits and plans come from loadUsFacts.
 */

import type { Metadata } from "next";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { ModelUtility } from "next-vibe/agent/models/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { PenTool } from "next-vibe/ui/components/icons/PenTool";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import { formatTokenCount } from "@/_pages/models/_shared/model-facts";
import { formatNumber } from "@/_pages/models/_shared/model-format";
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
  findOwnWorldviewRow,
  loadComparePairs,
  loadUncensoredRows,
  pickRow,
  UncensoredModelTable,
  type UncensoredRow,
} from "../uncensored-rows";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "uncensored-ai-writer";

/** Skills built for fiction, linked from the skills section. */
const WRITER_SKILL_ID = "uncensored-writer";
const STORYTELLER_SKILL_ID = "storyteller";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** Preferred model per writing job; the registry fills the gap if one is offline. */
const DARK_PREFERENCE: readonly ChatModelId[] = [
  ChatModelId.VENICE_UNCENSORED_ROLEPLAY,
  ChatModelId.DRUMMER_ARTEMIS_31B,
];
const POLISH_PREFERENCE: readonly ChatModelId[] = [
  ChatModelId.GLM_5_3_UNCENSORED,
  ChatModelId.KIMI_K3_1_PRO_UNCENSORED,
];

const PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED_ROLEPLAY],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.DRUMMER_ARTEMIS_31B],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED],
];

type PickKey = "dark" | "long" | "voice" | "polish" | "draft";

/** Display order of the picks. */
const PICK_ORDER: readonly PickKey[] = [
  "dark",
  "long",
  "voice",
  "polish",
  "draft",
];

const STEPS: readonly ("outline" | "scene" | "switch" | "revise")[] = [
  "outline",
  "scene",
  "switch",
  "revise",
];

const FAQ_KEYS: readonly (
  | "best"
  | "free"
  | "adult"
  | "novel"
  | "rights"
  | "kinds"
)[] = ["best", "free", "adult", "novel", "rights", "kinds"];

interface WriterPick {
  key: PickKey;
  row: UncensoredRow;
}

export interface WriterPostPageData {
  locale: CountryLanguage;
  us: UsParams;
  rows: UncensoredRow[];
  pairs: ComparePair[];
}

/**
 * Gab's own terms ban sexually explicit content (compare research data), so
 * its model is no pick for a fiction writer even though the registry tags it
 * creative.
 */
const NOT_FOR_FICTION: ReadonlySet<string> = new Set<string>([
  ChatModelId.GAB_AI_ARYA,
]);

function isCreative(row: UncensoredRow): boolean {
  if (NOT_FOR_FICTION.has(row.id)) {
    return false;
  }
  return (
    row.strengths.includes(ModelUtility.CREATIVE) ||
    row.strengths.includes(ModelUtility.ROLEPLAY_DARK)
  );
}

/** One model per writing job, no model twice, skipped when nothing fits. */
function buildPicks(rows: readonly UncensoredRow[]): WriterPick[] {
  const used = new Set<string>();
  const picks: WriterPick[] = [];
  const add = (key: PickKey, row: UncensoredRow | undefined): void => {
    if (row !== undefined && !used.has(row.id)) {
      used.add(row.id);
      picks.push({ key, row });
    }
  };
  // Longest memory first (all rows), so its "largest context" claim holds.
  add(
    "long",
    rows.toSorted(
      (a, b) =>
        b.contextWindow - a.contextWindow ||
        a.creditsPerMessage - b.creditsPerMessage,
    )[0],
  );
  add(
    "dark",
    pickRow(
      rows.filter((row) => !used.has(row.id)),
      DARK_PREFERENCE,
    ) ??
      rows.find(
        (row) =>
          !used.has(row.id) &&
          row.strengths.includes(ModelUtility.ROLEPLAY_DARK),
      ),
  );
  add("voice", findOwnWorldviewRow(rows));
  add(
    "polish",
    pickRow(
      rows.filter((row) => !used.has(row.id)),
      POLISH_PREFERENCE,
    ),
  );
  add(
    "draft",
    rows.find((row) => !used.has(row.id)),
  );
  return picks.toSorted(
    (a, b) => PICK_ORDER.indexOf(a.key) - PICK_ORDER.indexOf(b.key),
  );
}

export async function tanstackLoader({
  params,
}: Props): Promise<WriterPostPageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  const [facts, rows, pairs] = await Promise.all([
    loadUsFacts(locale),
    loadUncensoredRows(locale),
    loadComparePairs(PAIRS),
  ]);
  return { locale, us: usParams(facts), rows: rows.filter(isCreative), pairs };
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
}: WriterPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const picks = buildPicks(rows);
  const own = findOwnWorldviewRow(rows);
  const dark = picks.find((pick) => pick.key === "dark")?.row;
  const longest = rows.toSorted((a, b) => b.contextWindow - a.contextWindow)[0];
  const stats = {
    ...us,
    count: rows.length,
    ownModel: own?.name ?? us.ownModel,
    ownPages: own === undefined ? "" : formatNumber(own.contextPages, locale),
    maxPages:
      longest === undefined ? "" : formatNumber(longest.contextPages, locale),
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
          id="softening"
          title={t("softening.title")}
          intro={t("softening.intro")}
        >
          <ArticleList
            items={[
              t("softening.refuse"),
              t("softening.aside"),
              t("softening.fade"),
              t("softening.flatten"),
            ]}
          />
          <Callout icon={PenTool} tone="neutral">
            {t("softening.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="models"
          title={t("models.title", stats)}
          intro={t("models.intro", stats)}
        >
          <UncensoredModelTable
            rows={rows}
            columns={["pages", "strengths", "price", "chat"]}
            locale={locale}
            labels={{
              model: t("table.model"),
              context: t("table.context"),
              pages: t("table.pages"),
              strengths: t("table.strengths"),
              price: t("table.price"),
              chat: t("table.chat"),
              chatLink: (name) => t("table.chatLink", { model: name }),
              pagesValue: (pages) => t("table.pagesValue", { pages }),
            }}
          />
          <ArticleP>{t("models.footnote")}</ArticleP>
        </ArticleSection>

        {picks.length > 0 && (
          <ArticleSection
            id="picks"
            title={t("picks.title")}
            intro={t("picks.intro")}
          >
            {picks.map(({ key, row }) => {
              const params = {
                ...stats,
                model: row.name,
                context: formatTokenCount(row.contextWindow),
                pages: formatNumber(row.contextPages, locale),
                price: row.messagePrice,
              };
              return (
                <Div key={key} data-pick={key} className="flex flex-col gap-2">
                  <ArticleH3>{t(`picks.${key}.title`, params)}</ArticleH3>
                  <ArticleP>{t(`picks.${key}.body`, params)}</ArticleP>
                  <Link href={row.chatHref} className={LINK_CLASS}>
                    {t("table.chatLink", { model: row.name })}
                  </Link>
                </Div>
              );
            })}
          </ArticleSection>
        )}

        <ArticleSection
          id="workflow"
          title={t("workflow.title")}
          intro={t("workflow.intro")}
        >
          <StepList>
            {STEPS.map((step, index) => (
              <Step
                key={step}
                number={index + 1}
                title={t(`workflow.${step}.title`)}
                description={t(`workflow.${step}.body`, stats)}
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
            <CardLink
              href={`/${locale}/skill/${WRITER_SKILL_ID}`}
              label={t("skills.writer")}
            />
            <CardLink
              href={`/${locale}/skill/${STORYTELLER_SKILL_ID}`}
              label={t("skills.storyteller")}
            />
            <CardLink
              href={`/${locale}/story/blog/ai-roleplay-without-filter`}
              label={t("skills.roleplay")}
            />
          </Div>
        </ArticleSection>

        <ArticleSection
          id="limits"
          title={t("limits.title")}
          intro={t("limits.intro")}
        >
          <ArticleList
            items={[
              t("limits.adult"),
              t("limits.terms"),
              t("limits.rights"),
              t("limits.incognito"),
            ]}
          />
          <CardLink
            href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
            label={t("limits.kindsLink")}
          />
        </ArticleSection>

        {pairs.length > 0 && (
          <ArticleSection
            id="pairs"
            title={t("pairs.title")}
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
              href={`/${locale}/story/blog/best-uncensored-llm`}
              label={t("faq.bestLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/chatgpt-jailbreak-alternative`}
              label={t("faq.jailbreakLink")}
            />
            <CardLink
              href={`/${locale}/story/uncensored-ai`}
              label={t("faq.chatLink")}
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
                href={dark?.chatHref ?? `/${locale}/threads/incognito/new`}
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

export default async function UncensoredAiWriterPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
