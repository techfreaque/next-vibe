/**
 * Blog post: Grok alternatives for people who want fewer refusals. How
 * unfiltered Grok really is, alternatives by need, and Grok next to
 * uncensored models in one chat.
 * /[locale]/story/blog/grok-alternative
 *
 * Model facts (which models are live, content tier, uncensored method,
 * context, strengths, price per message) come from the registry via
 * loadModelRowsByIds; Grok Imagine media models from listMediaFacts. Compare
 * links only render for pairs whose two models are both live. Credits and
 * plans come from loadUsFacts.
 */

import type { Metadata } from "next";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import {
  createPageHref,
  listMediaFacts,
} from "@/_pages/models/_shared/model-media-facts";
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
  pickRow,
  UncensoredModelTable,
  type UncensoredRow,
} from "../uncensored-rows";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "grok-alternative";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

const GROK_ID = ChatModelId.GROK_4_7;

type NeedKey = "edge" | "reasoning" | "cheap" | "contrary" | "roleplay";

/** One alternative per need, in list order. */
const NEEDS: readonly (readonly [NeedKey, ChatModelId])[] = [
  ["edge", ChatModelId.GLM_5_3_UNCENSORED],
  ["reasoning", ChatModelId.KIMI_K3_1_PRO_UNCENSORED],
  ["cheap", ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED],
  ["contrary", ChatModelId.UNCENSORED_LM_V1_2],
  ["roleplay", ChatModelId.VENICE_UNCENSORED_ROLEPLAY],
];

/** Grok against the uncensored picks, then against a mainstream model. */
const PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [GROK_ID, ChatModelId.GLM_5_3_UNCENSORED],
  [GROK_ID, ChatModelId.KIMI_K3_1_PRO_UNCENSORED],
  [GROK_ID, ChatModelId.UNCENSORED_LM_V1_2],
  [GROK_ID, ChatModelId.GPT_6_2_SOL],
];

const KEEP_STEPS: readonly ("ask" | "switch" | "compare")[] = [
  "ask",
  "switch",
  "compare",
];

const FAQ_KEYS: readonly (
  | "uncensored"
  | "best"
  | "account"
  | "price"
  | "api"
  | "imagine"
)[] = ["uncensored", "best", "account", "price", "api", "imagine"];

interface MediaLink {
  name: string;
  href: string;
}

export interface GrokAlternativePageData {
  locale: CountryLanguage;
  us: UsParams;
  rows: UncensoredRow[];
  pairs: ComparePair[];
  /** Current Grok Imagine image/video models, with a create-page link. */
  imagine: MediaLink[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<GrokAlternativePageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  const [facts, rows, pairs, availability] = await Promise.all([
    loadUsFacts(locale),
    loadModelRowsByIds([GROK_ID, ...NEEDS.map(([, id]) => id)], locale),
    loadComparePairs(PAIRS),
    getEnvAvailability(),
  ]);
  const imagine = listMediaFacts(availability)
    .filter(
      (media) =>
        !media.isLegacy &&
        media.name.startsWith("Grok Imagine") &&
        (media.type === "image" || media.type === "video"),
    )
    .map((media) => ({
      name: media.name,
      href: createPageHref(locale, media),
    }));
  return { locale, us: usParams(facts), rows, pairs, imagine };
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
  imagine,
}: GrokAlternativePageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const grok = pickRow(rows, [GROK_ID]);
  const alternatives = NEEDS.flatMap(([need, id]) => {
    const row = pickRow(rows, [id]);
    return row === undefined ? [] : [{ need, row }];
  });
  const firstAlternative = alternatives[0]?.row;
  const stats = {
    ...us,
    count: alternatives.length,
    grokName: grok?.name ?? "",
    grokTier: grok?.tier ?? "",
    grokPrice: grok?.messagePrice ?? "",
    firstName: firstAlternative?.name ?? "",
    imagineNames: imagine.map((media) => media.name).join(", "),
  };
  const faqKeys = FAQ_KEYS.filter(
    (key) =>
      (key !== "imagine" || imagine.length > 0) &&
      ((key !== "account" && key !== "price") || grok !== undefined),
  );
  const faq = faqKeys.map((key) => ({
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
          id="honest"
          title={t("honest.title")}
          intro={t("honest.intro")}
        >
          <ArticleList
            items={[
              t("honest.looser"),
              t("honest.filtered"),
              t("honest.shifts"),
              ...(grok === undefined ? [] : [t("honest.catalog", stats)]),
            ]}
          />
          <Callout icon={AlertTriangle} tone="warning">
            {t("honest.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection id="why" title={t("why.title")} intro={t("why.intro")}>
          <ArticleList
            items={[t("why.policy"), t("why.account"), t("why.voice")]}
          />
        </ArticleSection>

        {alternatives.length > 0 && (
          <ArticleSection
            id="alternatives"
            title={t("alternatives.title", stats)}
            intro={t("alternatives.intro")}
          >
            {alternatives.map(({ need, row }) => (
              <Div
                key={row.id}
                data-model={row.id}
                className="flex flex-col gap-2"
              >
                <ArticleH3>
                  {t(`alternatives.${need}.title`, { model: row.name })}
                </ArticleH3>
                <ArticleP>
                  {t(`alternatives.${need}.body`, {
                    ...stats,
                    model: row.name,
                    price: row.messagePrice,
                  })}
                </ArticleP>
                <CardLink
                  href={row.chatHref}
                  label={t("alternatives.chatLink", { model: row.name })}
                />
              </Div>
            ))}
            <CardLink
              href={`/${locale}/story/abliterated-ai-chat`}
              label={t("alternatives.directoryLink")}
            />
          </ArticleSection>
        )}

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

        {grok !== undefined && (
          <ArticleSection
            id="keep"
            title={t("keep.title")}
            intro={t("keep.intro", stats)}
          >
            <StepList>
              {KEEP_STEPS.map((step, index) => (
                <Step
                  key={step}
                  number={index + 1}
                  title={t(`keep.steps.${step}.title`)}
                  description={t(`keep.steps.${step}.body`, stats)}
                />
              ))}
            </StepList>
            {pairs.length > 0 && (
              <Div className="flex flex-col">
                {pairs.map((pair) => (
                  <CardLink
                    key={`${pair.a.slug}-${pair.b.slug}`}
                    href={`/${locale}${pair.path}`}
                    label={t("keep.compareLink", {
                      a: pair.a.name,
                      b: pair.b.name,
                    })}
                  />
                ))}
              </Div>
            )}
          </ArticleSection>
        )}

        {imagine.length > 0 && (
          <ArticleSection
            id="imagine"
            title={t("imagine.title")}
            intro={t("imagine.intro", stats)}
          >
            <Div className="flex flex-col">
              {imagine.map((media) => (
                <CardLink
                  key={media.href}
                  href={media.href}
                  label={t("imagine.link", { model: media.name })}
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
              href={`/${locale}/story/blog/chatgpt-alternative-without-filters`}
              label={t("faq.chatgptLink")}
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
                  firstAlternative?.chatHref ??
                  `/${locale}/threads/incognito/new`
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

export default async function GrokAlternativePostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
