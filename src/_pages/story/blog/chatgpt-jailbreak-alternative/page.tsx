/**
 * Blog post: why ChatGPT jailbreak prompts keep breaking, and the models
 * that answer without one.
 * /[locale]/story/blog/chatgpt-jailbreak-alternative
 *
 * Model facts (which uncensored models are live, method, context window,
 * price per message) come from the registry via loadUncensoredRows. The
 * head-to-head links only render for pairs whose two models are both live.
 * Abliteration sources are the shared research citations. Credits and plans
 * come from loadUsFacts.
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
import { ExternalLink } from "next-vibe/ui/components/link";
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
import { LINK_CLASS } from "../../compare/_shared/compare-ui";
import { ABLITERATION_SOURCES } from "../../compare/_shared/platforms";
import type { UsParams } from "../../compare/_shared/us-facts";
import {
  type ComparePair,
  findOwnWorldviewRow,
  UncensoredModelTable,
  type UncensoredRow,
} from "../uncensored-rows";
import { loadComparePairs, loadUncensoredRows } from "../uncensored-rows-data";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "chatgpt-jailbreak-alternative";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** GPT against an uncensored model, then base models against their builds. */
const PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.GPT_6_2_SOL, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.GPT_6_2_SOL, ChatModelId.UNCENSORED_LM_V1_2],
  [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.KIMI_K3_1_PRO, ChatModelId.KIMI_K3_1_PRO_UNCENSORED],
  [
    ChatModelId.DEEPSEEK_V4_1_FLASH,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
];

const TEST_STEPS: readonly ("ask" | "switch" | "compare" | "keep")[] = [
  "ask",
  "switch",
  "compare",
  "keep",
];

const FAQ_KEYS: readonly ("work" | "dan" | "ban" | "gpt" | "legal" | "free")[] =
  ["work", "dan", "ban", "gpt", "legal", "free"];

export interface JailbreakPostPageData {
  locale: CountryLanguage;
  us: UsParams;
  rows: UncensoredRow[];
  pairs: ComparePair[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<JailbreakPostPageData> {
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
}: JailbreakPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
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

        <ArticleSection id="why" title={t("why.title")} intro={t("why.intro")}>
          <ArticleList
            items={[t("why.weights"), t("why.patched"), t("why.layer")]}
          />
        </ArticleSection>

        <ArticleSection
          id="cost"
          title={t("cost.title")}
          intro={t("cost.intro")}
        >
          <ArticleList
            items={[
              t("cost.quality"),
              t("cost.unstable"),
              t("cost.account"),
              t("cost.time"),
            ]}
          />
          <Callout icon={AlertTriangle} tone="warning">
            {t("cost.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="instead"
          title={t("instead.title")}
          intro={t("instead.intro")}
        >
          <ArticleH3>{t("instead.abliteratedTitle")}</ArticleH3>
          <ArticleP>{t("instead.abliterated")}</ArticleP>
          <ArticleH3>{t("instead.ownTitle", stats)}</ArticleH3>
          <ArticleP>{t("instead.own", stats)}</ArticleP>
          <ArticleList
            items={ABLITERATION_SOURCES.map((source) => (
              <ExternalLink
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={LINK_CLASS}
              >
                {t(
                  `instead.sources.${source.kind === "paper" ? "paper" : "blog"}`,
                )}
              </ExternalLink>
            ))}
          />
          <CardLink
            href={`/${locale}/story/blog/abliterated-vs-uncensored-models`}
            label={t("instead.link")}
          />
        </ArticleSection>

        <ArticleSection
          id="models"
          title={t("models.title", stats)}
          intro={t("models.intro")}
        >
          <UncensoredModelTable
            rows={rows}
            columns={["context", "price", "chat"]}
            locale={locale}
            labels={{
              model: t("models.colModel"),
              context: t("models.colContext"),
              price: t("models.colPrice"),
              chat: t("models.colChat"),
              chatLink: (name) => t("models.chatLink", { model: name }),
            }}
          />
          <ArticleP>{t("models.footnote")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="test"
          title={t("test.title")}
          intro={t("test.intro")}
        >
          <StepList>
            {TEST_STEPS.map((step, index) => (
              <Step
                key={step}
                number={index + 1}
                title={t(`test.steps.${step}.title`)}
                description={t(`test.steps.${step}.body`, stats)}
              />
            ))}
          </StepList>
          {pairs.length > 0 && (
            <Div className="flex flex-col">
              {pairs.map((pair) => (
                <CardLink
                  key={`${pair.a.slug}-${pair.b.slug}`}
                  href={`/${locale}${pair.path}`}
                  label={t("test.compareLink", {
                    a: pair.a.name,
                    b: pair.b.name,
                  })}
                />
              ))}
            </Div>
          )}
        </ArticleSection>

        <ArticleSection
          id="limits"
          title={t("limits.title")}
          intro={t("limits.intro")}
        >
          <ArticleList
            items={[t("limits.decline"), t("limits.wrong"), t("limits.adult")]}
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
              href={`/${locale}/story/blog/chatgpt-alternative-without-filters`}
              label={t("faq.alternativeLink")}
            />
            <CardLink
              href={`/${locale}/story/refusal-index`}
              label={t("faq.refusalLink")}
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

export default async function ChatgptJailbreakAlternativePostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
