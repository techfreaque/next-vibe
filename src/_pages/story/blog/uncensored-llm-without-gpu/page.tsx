/**
 * Blog post: run an uncensored LLM online, without a GPU or a local install.
 * /[locale]/story/blog/uncensored-llm-without-gpu
 *
 * Model facts (which uncensored models are live, method, context window,
 * parameter count, price per message) come from the registry via
 * loadUncensoredRows. Local memory figures are computed from the registry's
 * parameter count (weights only). Local runner facts (Ollama, LM Studio)
 * come from the comparison research data. Our credits and plans come from
 * loadUsFacts.
 */

import type { Metadata } from "next";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Cpu } from "next-vibe/ui/components/icons/Cpu";
import { EyeOff } from "next-vibe/ui/components/icons/EyeOff";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
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
import { scopedTranslation as compareScopedTranslation } from "../../compare/i18n";
import {
  type ComparePair,
  findOwnWorldviewRow,
  UncensoredModelTable,
  type UncensoredRow,
} from "../uncensored-rows";
import { loadComparePairs, loadUncensoredRows } from "../uncensored-rows-data";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "uncensored-llm-without-gpu";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** Base model next to its uncensored build: what changes when you go hosted. */
const PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.GLM_5_3_FLASH, ChatModelId.GLM_5_3_FLASH_UNCENSORED],
  [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED],
  [
    ChatModelId.DEEPSEEK_V4_1_FLASH,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
];

const STEPS: readonly ("open" | "pick" | "confirm" | "ask")[] = [
  "open",
  "pick",
  "confirm",
  "ask",
];

const FAQ_KEYS: readonly (
  | "gpu"
  | "free"
  | "vram"
  | "private"
  | "offline"
  | "truly"
)[] = ["gpu", "free", "vram", "private", "offline", "truly"];

export interface NoGpuPostPageData {
  locale: CountryLanguage;
  us: UsParams;
  rows: UncensoredRow[];
  pairs: ComparePair[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<NoGpuPostPageData> {
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
}: NoGpuPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareScopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const sized = rows.filter((row) => row.parameterCount !== null);
  const own = findOwnWorldviewRow(rows);
  const cheapest = rows[0];
  const stats = {
    ...us,
    count: rows.length,
    ownModel: own?.name ?? us.ownModel,
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
          id="hardware"
          title={t("hardware.title")}
          intro={t("hardware.intro")}
        >
          {sized.length > 0 && (
            <UncensoredModelTable
              rows={sized}
              columns={["params", "memory", "context"]}
              locale={locale}
              labels={{
                model: t("table.model"),
                params: t("hardware.colParams"),
                memory: t("hardware.colMemory"),
                context: t("table.context"),
                price: t("table.price"),
                paramsValue: (billions) =>
                  t("hardware.paramsValue", {
                    count: formatNumber(billions, locale),
                  }),
                memoryValue: (q4, q8) =>
                  t("hardware.memoryValue", {
                    q4: formatNumber(q4, locale),
                    q8: formatNumber(q8, locale),
                  }),
                unknown: t("hardware.unknown"),
              }}
            />
          )}
          <ArticleP>{t("hardware.footnote")}</ArticleP>
          <ArticleList
            items={[
              t("hardware.small"),
              t("hardware.mid"),
              t("hardware.large"),
            ]}
          />
          <Callout icon={Cpu} tone="neutral">
            {t("hardware.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="local"
          title={t("local.title")}
          intro={t("local.intro")}
        >
          <ArticleH3>{t("local.winsTitle")}</ArticleH3>
          <ArticleList
            items={[
              compareT("platforms.ollama.privacy"),
              compareT("platforms.ollama.pricingNote"),
              t("local.offline"),
            ]}
          />
          <ArticleH3>{t("local.catchTitle")}</ArticleH3>
          <ArticleList
            items={[
              compareT("platforms.ollama.con1"),
              compareT("platforms.ollama.con2"),
              compareT("platforms.ollama.filter"),
            ]}
          />
          <ArticleP>{t("local.verdict")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="online"
          title={t("online.title", stats)}
          intro={t("online.intro", stats)}
        >
          <UncensoredModelTable
            rows={rows}
            columns={["context", "price", "chat"]}
            locale={locale}
            labels={{
              model: t("table.model"),
              context: t("table.context"),
              price: t("table.price"),
              chat: t("online.colChat"),
              chatLink: (name) => t("online.chatLink", { model: name }),
            }}
          />
          <ArticleP>{t("online.footnote")}</ArticleP>
          <CardLink
            href={`/${locale}/story/abliterated-ai-chat`}
            label={t("online.directoryLink")}
          />
        </ArticleSection>

        <ArticleSection
          id="start"
          title={t("steps.title")}
          intro={t("steps.intro")}
        >
          <StepList>
            {STEPS.map((step, index) => (
              <Step
                key={step}
                number={index + 1}
                title={t(`steps.${step}.title`)}
                description={t(`steps.${step}.body`, stats)}
              />
            ))}
          </StepList>
        </ArticleSection>

        <ArticleSection
          id="kinds"
          title={t("kinds.title")}
          intro={t("kinds.intro")}
        >
          <ArticleList
            items={[t("kinds.abliterated"), t("kinds.own", stats)]}
          />
          <CardLink
            href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
            label={t("kinds.link")}
          />
        </ArticleSection>

        <ArticleSection
          id="privacy"
          title={t("privacy.title")}
          intro={t("privacy.intro")}
        >
          <ArticleList
            items={[
              t("privacy.transit"),
              t("privacy.incognito"),
              <Span key="self">
                {t("privacy.selfHost", stats)}{" "}
                <Link
                  href={`/${locale}/story/self-host`}
                  className={LINK_CLASS}
                >
                  {t("privacy.selfHostLink", stats)}
                </Link>
              </Span>,
            ]}
          />
          <Callout icon={EyeOff} tone="neutral">
            {t("privacy.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="cost"
          title={t("cost.title")}
          intro={t("cost.intro")}
        >
          <ArticleList
            items={[
              t("cost.guest", stats),
              t("cost.plan", stats),
              t("cost.local"),
            ]}
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
                  key={`${pair.a.slug}-${pair.b.slug}`}
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
              href={`/${locale}/story/uncensored-ai`}
              label={t("faq.chatLink")}
            />
            <CardLink
              href={`/${locale}/story/compare/uncensored-ai-platforms`}
              label={t("faq.platformsLink")}
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
                href={cheapest?.chatHref ?? `/${locale}/threads/incognito/new`}
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

export default async function UncensoredLlmWithoutGpuPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
