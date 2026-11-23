/**
 * Blog post: Claude without filters. Why Claude refuses, why jailbreaks and
 * "uncensored Claude" don't hold, and the setup that works: Claude plus
 * uncensored models in one thread.
 * /[locale]/story/blog/claude-without-filters
 *
 * Model facts (which Claude and uncensored models are live, uncensored
 * method, context, strengths, price per message) come from the registry via
 * loadModelRowsByIds. The newest live Claude anchors the compare links,
 * which only render for pairs whose two models are both live. Credits and
 * plans come from loadUsFacts.
 */

import type { Metadata } from "next";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { ShieldOff } from "next-vibe/ui/components/icons/ShieldOff";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
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

const SLUG = "claude-without-filters";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** Claude models, newest and strongest first. The first live one leads. */
const CLAUDE_IDS: readonly ChatModelId[] = [
  ChatModelId.CLAUDE_OPUS_5_5,
  ChatModelId.CLAUDE_SONNET_5_5,
  ChatModelId.CLAUDE_FABLE_5_2,
  ChatModelId.CLAUDE_HAIKU_5_5,
  ChatModelId.CLAUDE_OPUS_5,
  ChatModelId.CLAUDE_SONNET_5,
];

/** How many Claude rows the table shows. */
const CLAUDE_ROWS = 2;

type PickKey = "long" | "fast" | "contrary" | "roleplay" | "cheap";

/** One uncensored model per writing job, in list order. */
const PICKS: readonly (readonly [PickKey, ChatModelId])[] = [
  ["long", ChatModelId.KIMI_K3_1_PRO_UNCENSORED],
  ["fast", ChatModelId.GLM_5_3_UNCENSORED],
  ["contrary", ChatModelId.UNCENSORED_LM_V1_2],
  ["roleplay", ChatModelId.VENICE_UNCENSORED_ROLEPLAY],
  ["cheap", ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED],
];

const SWITCH_STEPS: readonly ("draft" | "switch" | "back" | "compare")[] = [
  "draft",
  "switch",
  "back",
  "compare",
];

const FAQ_KEYS: readonly (
  | "can"
  | "jailbreak"
  | "best"
  | "same"
  | "api"
  | "free"
)[] = ["can", "jailbreak", "best", "same", "api", "free"];

export interface ClaudeWithoutFiltersPageData {
  locale: CountryLanguage;
  us: UsParams;
  claudeRows: UncensoredRow[];
  pickRows: UncensoredRow[];
  pairs: ComparePair[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<ClaudeWithoutFiltersPageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  const [facts, claudeRows, pickRows] = await Promise.all([
    loadUsFacts(locale),
    loadModelRowsByIds(CLAUDE_IDS, locale),
    loadModelRowsByIds(
      PICKS.map(([, id]) => id),
      locale,
    ),
  ]);
  const lead = CLAUDE_IDS.find((id) => claudeRows.some((row) => row.id === id));
  const pairs =
    lead === undefined
      ? []
      : await loadComparePairs(
          PICKS.slice(0, 3).map(
            ([, id]): readonly [ChatModelId, ChatModelId] => [lead, id],
          ),
        );
  return {
    locale,
    us: usParams(facts),
    claudeRows: claudeRows.slice(0, CLAUDE_ROWS),
    pickRows,
    pairs,
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
  claudeRows,
  pickRows,
  pairs,
}: ClaudeWithoutFiltersPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const claude = claudeRows[0];
  const picks = PICKS.flatMap(([key, id]) => {
    const row = pickRows.find((candidate) => candidate.id === id);
    return row === undefined ? [] : [{ key, row }];
  });
  const firstPick = picks[0]?.row;
  const stats = {
    ...us,
    count: picks.length,
    claudeName: claude?.name ?? "Claude",
    firstName: firstPick?.name ?? "",
  };
  const faq = FAQ_KEYS.map((key) => ({
    key,
    question: t(`faq.${key}.q`, stats),
    answer: t(`faq.${key}.a`, stats),
  }));
  const tableRows = [...claudeRows, ...pickRows];

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

        <ArticleSection id="why" title={t("why.title")} intro={t("why.intro")}>
          <ArticleList
            items={[t("why.trained"), t("why.policy"), t("why.closed")]}
          />
        </ArticleSection>

        <ArticleSection
          id="tricks"
          title={t("tricks.title")}
          intro={t("tricks.intro")}
        >
          <ArticleList
            items={[
              t("tricks.jailbreak"),
              t("tricks.fiction"),
              t("tricks.fake"),
            ]}
          />
          <Callout icon={AlertTriangle} tone="warning">
            {t("tricks.callout")}
          </Callout>
          <CardLink
            href={`/${locale}/story/blog/chatgpt-jailbreak-alternative`}
            label={t("tricks.jailbreakLink")}
          />
        </ArticleSection>

        <ArticleSection
          id="switch"
          title={t("switch.title")}
          intro={t("switch.intro", stats)}
        >
          <StepList>
            {SWITCH_STEPS.map((step, index) => (
              <Step
                key={step}
                number={index + 1}
                title={t(`switch.steps.${step}.title`)}
                description={t(`switch.steps.${step}.body`, stats)}
              />
            ))}
          </StepList>
        </ArticleSection>

        {tableRows.length > 0 && (
          <ArticleSection
            id="models"
            title={t("models.title")}
            intro={t("models.intro")}
          >
            <UncensoredModelTable
              rows={tableRows}
              columns={["context", "strengths", "price", "chat"]}
              locale={locale}
              labels={{
                model: t("models.colModel"),
                context: t("models.colContext"),
                strengths: t("models.colStrengths"),
                price: t("models.colPrice"),
                chat: t("models.colChat"),
                chatLink: (name) => t("models.chatLink", { model: name }),
              }}
            />
            <ArticleP>{t("models.footnote", stats)}</ArticleP>
          </ArticleSection>
        )}

        {picks.length > 0 && (
          <ArticleSection
            id="picks"
            title={t("picks.title")}
            intro={t("picks.intro")}
          >
            {picks.map(({ key, row }) => (
              <Div
                key={row.id}
                data-model={row.id}
                className="flex flex-col gap-2"
              >
                <ArticleH3>
                  {t(`picks.${key}.title`, { model: row.name })}
                </ArticleH3>
                <ArticleP>
                  {t(`picks.${key}.body`, {
                    model: row.name,
                    price: row.messagePrice,
                  })}
                </ArticleP>
              </Div>
            ))}
            {pairs.length > 0 && (
              <Div className="flex flex-col">
                {pairs.map((pair) => (
                  <CardLink
                    key={`${pair.a.slug}-${pair.b.slug}`}
                    href={`/${locale}${pair.path}`}
                    label={t("picks.compareLink", {
                      a: pair.a.name,
                      b: pair.b.name,
                    })}
                  />
                ))}
              </Div>
            )}
            <CardLink
              href={`/${locale}/story/blog/uncensored-ai-writer`}
              label={t("picks.writerLink")}
            />
          </ArticleSection>
        )}

        <ArticleSection
          id="limits"
          title={t("limits.title")}
          intro={t("limits.intro")}
        >
          <ArticleList
            items={[
              t("limits.style"),
              t("limits.mistakes"),
              t("limits.claude"),
            ]}
          />
          <Callout icon={ShieldOff} tone="neutral">
            {t("limits.callout")}
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
              href={`/${locale}/story/uncensored-ai`}
              label={t("faq.chatLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/ai-roleplay-without-filter`}
              label={t("faq.roleplayLink")}
            />
            <CardLink
              href={`/${locale}/story/refusal-index`}
              label={t("faq.refusalLink")}
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
                href={firstPick?.chatHref ?? `/${locale}/threads/incognito/new`}
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

export default async function ClaudeWithoutFiltersPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
