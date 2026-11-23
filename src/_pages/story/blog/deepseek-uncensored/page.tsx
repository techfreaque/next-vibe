/**
 * Blog post: DeepSeek uncensored. Where DeepSeek's censorship sits (app
 * moderation vs trained refusals) and the uncensored DeepSeek builds you can
 * chat with in the browser.
 * /[locale]/story/blog/deepseek-uncensored
 *
 * Model facts (which DeepSeek builds are live, uncensored method, context,
 * strengths, price per message) come from the registry via
 * loadModelRowsByIds. Compare links only render for pairs whose two models
 * are both live. Credits and plans come from loadUsFacts.
 */

import type { Metadata } from "next";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Layers } from "next-vibe/ui/components/icons/Layers";
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
import { Callout, CardLink, Cta } from "../../_shared/marketing";
import type { UsParams } from "../../compare/_shared/us-facts";
import {
  type ComparePair,
  loadComparePairs,
  loadModelRowsByIds,
  pickRow,
  UncensoredModelTable,
  type UncensoredRow,
} from "../uncensored-rows";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "deepseek-uncensored";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** Uncensored DeepSeek builds, most useful first. */
const UNCENSORED_IDS: readonly ChatModelId[] = [
  ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ChatModelId.DEEPSEEK_V4_1_FLASH_CSF,
];

/** The stock DeepSeek models the builds are measured against. */
const STOCK_IDS: readonly ChatModelId[] = [
  ChatModelId.DEEPSEEK_V4_1_FLASH,
  ChatModelId.DEEPSEEK_V4_PRO,
];

/** Stock against each build, the two builds, then a non-DeepSeek rival. */
const PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [
    ChatModelId.DEEPSEEK_V4_1_FLASH,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
  [ChatModelId.DEEPSEEK_V4_1_FLASH, ChatModelId.DEEPSEEK_V4_1_FLASH_CSF],
  [
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
    ChatModelId.DEEPSEEK_V4_1_FLASH_CSF,
  ],
  [
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
    ChatModelId.GLM_5_3_UNCENSORED,
  ],
];

/** Copy key per uncensored build (what makes each one different). */
const BUILD_KEYS: ReadonlyMap<string, "venice" | "csf"> = new Map<
  string,
  "venice" | "csf"
>([
  [ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED, "venice"],
  [ChatModelId.DEEPSEEK_V4_1_FLASH_CSF, "csf"],
]);

const FAQ_KEYS: readonly (
  | "censored"
  | "exists"
  | "local"
  | "china"
  | "api"
  | "free"
)[] = ["censored", "exists", "local", "china", "api", "free"];

export interface DeepseekUncensoredPageData {
  locale: CountryLanguage;
  us: UsParams;
  rows: UncensoredRow[];
  pairs: ComparePair[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<DeepseekUncensoredPageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  const [facts, rows, pairs] = await Promise.all([
    loadUsFacts(locale),
    loadModelRowsByIds([...UNCENSORED_IDS, ...STOCK_IDS], locale),
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
}: DeepseekUncensoredPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const builds = rows.filter((row) =>
    UNCENSORED_IDS.some((id) => id === row.id),
  );
  const stock = pickRow(rows, STOCK_IDS);
  const firstBuild = builds[0];
  const stats = {
    ...us,
    count: builds.length,
    buildName: firstBuild?.name ?? "",
    buildPrice: firstBuild?.messagePrice ?? "",
    stockName: stock?.name ?? "",
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
          id="where"
          title={t("where.title")}
          intro={t("where.intro")}
        >
          <ArticleList
            items={[t("where.app"), t("where.weights"), t("where.hosts")]}
          />
          <Callout icon={Layers} tone="neutral">
            {t("where.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="ways"
          title={t("ways.title")}
          intro={t("ways.intro")}
        >
          <ArticleH3>{t("ways.localTitle")}</ArticleH3>
          <ArticleP>{t("ways.local")}</ArticleP>
          <ArticleH3>{t("ways.hostedTitle")}</ArticleH3>
          <ArticleP>{t("ways.hosted")}</ArticleP>
          <ArticleH3>{t("ways.buildTitle")}</ArticleH3>
          <ArticleP>{t("ways.build")}</ArticleP>
          <CardLink
            href={`/${locale}/story/blog/uncensored-llm-without-gpu`}
            label={t("ways.noGpuLink")}
          />
        </ArticleSection>

        {rows.length > 0 && (
          <ArticleSection
            id="models"
            title={t("models.title")}
            intro={t("models.intro")}
          >
            <UncensoredModelTable
              rows={rows}
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

        {builds.length > 0 && (
          <ArticleSection
            id="builds"
            title={t("builds.title", stats)}
            intro={t("builds.intro")}
          >
            {builds.flatMap((row) => {
              const key = BUILD_KEYS.get(row.id);
              if (key === undefined) {
                return [];
              }
              const params = {
                model: row.name,
                strengths: row.strengthText,
                price: row.messagePrice,
              };
              return [
                <Div
                  key={row.id}
                  data-model={row.id}
                  className="flex flex-col gap-2"
                >
                  <ArticleH3>{row.name}</ArticleH3>
                  <ArticleP>{t(`builds.${key}`, params)}</ArticleP>
                  <CardLink
                    href={row.chatHref}
                    label={t("builds.chatLink", { model: row.name })}
                  />
                </Div>,
              ];
            })}
            <ArticleP>{t("builds.abliteration")}</ArticleP>
            <CardLink
              href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
              label={t("builds.explainerLink")}
            />
          </ArticleSection>
        )}

        {pairs.length > 0 && (
          <ArticleSection
            id="compare"
            title={t("compare.title")}
            intro={t("compare.intro")}
          >
            <Div className="flex flex-col">
              {pairs.map((pair) => (
                <CardLink
                  key={`${pair.a.slug}-${pair.b.slug}`}
                  href={`/${locale}${pair.path}`}
                  label={t("compare.link", { a: pair.a.name, b: pair.b.name })}
                />
              ))}
            </Div>
          </ArticleSection>
        )}

        <ArticleSection
          id="limits"
          title={t("limits.title")}
          intro={t("limits.intro")}
        >
          <ArticleList
            items={[
              t("limits.knowledge"),
              t("limits.slant", stats),
              t("limits.mistakes"),
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
              href={`/${locale}/story/abliterated-ai-chat`}
              label={t("faq.directoryLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/best-uncensored-llm`}
              label={t("faq.bestLink")}
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
                href={
                  firstBuild?.chatHref ?? `/${locale}/threads/incognito/new`
                }
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

export default async function DeepseekUncensoredPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
