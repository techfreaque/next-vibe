import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { CHAT_MESSAGE_PRICE_REFERENCE } from "next-vibe/agent/models/models";
import { isUncensoredContent } from "next-vibe/agent/models/uncensored-consent/constants";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import { buildBreadcrumbList } from "@/_pages/_components/structured-data";
import {
  canonicalComparisonPath,
  FEATURED_COMPARISON_PAIRS,
  listModelFacts,
  type ModelRef,
} from "@/_pages/models/_shared/model-facts";
import {
  chatHref,
  formatNumber,
  modelHref,
  type UncensoredKind,
  uncensoredKind,
} from "@/_pages/models/_shared/model-format";
import { scopedTranslation as modelsScopedTranslation } from "@/_pages/models/i18n";
import { configScopedTranslation } from "@/env/i18n";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";

import { buildBreadcrumbTrail } from "../_shared/breadcrumbs";
import { CardLink, Cta, PageHero, PageSection } from "../_shared/marketing";
import { GuideCardGrid } from "../blog/guide-links";
import { getBlogPostCard } from "../blog/posts-cards";
import { HUB_GUIDES, TOPIC_HUB_PATHS } from "../blog/topics";
import { CompareInlineLinks } from "../compare/_shared/compare-ui";
import { COMPARE_HUB_PATH, VERSUS_KEYS } from "../compare/_shared/platforms";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

interface ChatChoice extends ModelRef {
  contextWindow: number;
  creditsPerMessage: number;
  kind: UncensoredKind;
}

interface Comparison {
  a: string;
  b: string;
  path: string;
}

interface PageData {
  locale: CountryLanguage;
  models: ChatChoice[];
  comparisons: Comparison[];
}

export async function tanstackLoader({ params }: Props): Promise<PageData> {
  const { locale } = await params;
  const facts = listModelFacts(await getEnvAvailability());
  const live = facts.filter((model) => !model.isLegacy);
  // Featured head-to-heads where both models are live, canonical order.
  const comparisons = FEATURED_COMPARISON_PAIRS.flatMap(([leftId, rightId]) => {
    const left = live.find((model) => model.id === leftId);
    const right = live.find((model) => model.id === rightId);
    if (left === undefined || right === undefined) {
      return [];
    }
    const path = canonicalComparisonPath(left, right);
    const [first, second] = path.endsWith(`/${right.slug}`)
      ? [left, right]
      : [right, left];
    return [{ a: first.name.trim(), b: second.name.trim(), path }];
  });
  const models = facts
    .filter((model) => !model.isLegacy && isUncensoredContent(model.content))
    .toSorted(
      (a, b) =>
        a.creditsPerMessage - b.creditsPerMessage ||
        a.name.localeCompare(b.name),
    )
    .map((model) => ({
      id: model.id,
      slug: model.slug,
      name: model.name.trim(),
      contextWindow: model.contextWindow,
      creditsPerMessage: model.creditsPerMessage,
      kind: uncensoredKind(model) ?? "unlisted",
    }));
  return { locale, models, comparisons };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "story/uncensored-ai",
    title: t("metaTitle", { appName: configT("appName") }),
    description: t("description"),
    category: t("title"),
    imageAlt: t("title"),
    keywords: [t("keywords")],
  });
}

export function TanstackPage({
  locale,
  models,
  comparisons,
}: PageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: modelsT } = modelsScopedTranslation.scopedT(locale);
  const crumbs = [{ name: t("breadcrumb"), path: TOPIC_HUB_PATHS.uncensored }];
  const firstModel = models[0];
  // The "truly uncensored" example comes from the live catalog, never copy.
  const worldviewModel = models.find((model) => model.kind === "ownWorldview");
  const chatgptGuide = getBlogPostCard(
    "chatgpt-alternative-without-filters",
    locale,
  );
  const faq = [
    {
      question: t("faq.access.q"),
      answer: t("faq.access.a", {
        credits: formatNumber(FREE_CREDIT_ALLOWANCE.guest, locale),
      }),
    },
    {
      question: t("faq.chatgpt.q"),
      answer: t("faq.chatgpt.a"),
    },
    ...(worldviewModel !== undefined
      ? [
          {
            question: t("faq.kinds.q"),
            answer: t("faq.kinds.a", { model: worldviewModel.name }),
          },
        ]
      : []),
    {
      question: t("faq.filters.q"),
      answer: t("faq.filters.a"),
    },
    {
      question: t("faq.privacy.q"),
      answer: t("faq.privacy.a"),
    },
    {
      question: t("faq.legal.q"),
      answer: t("faq.legal.a"),
    },
    {
      question: t("faq.outOfCredits.q"),
      answer: t("faq.outOfCredits.a", {
        credits: formatNumber(FREE_CREDIT_SIGNED_IN_TOTAL, locale),
      }),
    },
    {
      question: t("faq.local.q"),
      answer: t("faq.local.a"),
    },
  ];

  return (
    <>
      <JsonLd
        id="uncensored-chat-breadcrumbs"
        data={{
          "@context": "https://schema.org",
          ...buildBreadcrumbList(locale, crumbs),
        }}
      />
      <PageHero
        breadcrumbs={buildBreadcrumbTrail(locale, crumbs)}
        title={t("title")}
        subtitle={t("intro")}
        actions={
          firstModel !== undefined ? (
            <>
              <Cta
                href={chatHref(locale, firstModel)}
                label={t("tryModel", { model: firstModel.name })}
                className="h-auto min-h-12 whitespace-normal py-2 text-center"
              />
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full bg-card px-6 text-base font-medium sm:w-auto"
              >
                <ExternalLink href="#chat-models">
                  {t("chooseModel")}
                </ExternalLink>
              </Button>
            </>
          ) : undefined
        }
      />
      <PageSection
        id="chat-models"
        title={t("models")}
        intro={models.length > 0 ? t("choose") : t("empty")}
      >
        {models.length > 0 && (
          <Div className="mb-6 flex max-w-3xl flex-col gap-3">
            <P className="text-sm text-muted-foreground">{t("start")}</P>
            <P className="text-sm text-muted-foreground">
              {t("order", {
                input: formatNumber(
                  CHAT_MESSAGE_PRICE_REFERENCE.inputTokens,
                  locale,
                ),
                output: formatNumber(
                  CHAT_MESSAGE_PRICE_REFERENCE.outputTokens,
                  locale,
                ),
              })}
            </P>
          </Div>
        )}
        <Div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <Div
              key={model.id}
              className="flex min-w-0 flex-col items-start gap-3 rounded-xl border border-border bg-card p-5"
            >
              <H3 className="text-lg font-semibold">
                <Link
                  href={modelHref(locale, model.slug)}
                  className="hover:underline"
                >
                  {model.name}
                </Link>
              </H3>
              <P className="text-sm text-muted-foreground">
                {modelsT(`uncensoredKind.${model.kind}.name`)}
              </P>
              <P className="text-sm text-muted-foreground">
                {t("context", {
                  tokens: formatNumber(model.contextWindow, locale),
                })}
              </P>
              <P className="text-sm text-muted-foreground">
                {t("price", {
                  credits: formatNumber(model.creditsPerMessage, locale),
                })}
              </P>
              <Cta
                href={chatHref(locale, model)}
                label={t("chat", { model: model.name })}
                variant="secondary"
                className="h-auto min-h-12 max-w-full whitespace-normal py-2 text-center"
              />
            </Div>
          ))}
        </Div>
      </PageSection>
      <PageSection title={t("questions")} tone="muted" narrow>
        <JsonLd id="uncensored-chat-faq" data={buildFaqStructuredData(faq)} />
        <Div className="flex flex-col gap-6">
          {faq.map(({ question, answer }) => (
            <Div key={question}>
              <H3 className="font-semibold">{question}</H3>
              <P className="mt-2 text-muted-foreground">{answer}</P>
            </Div>
          ))}
        </Div>
      </PageSection>
      <PageSection
        id="guides"
        title={t("guidesTitle")}
        intro={t("guidesIntro")}
      >
        <GuideCardGrid locale={locale} slugs={HUB_GUIDES.uncensored} />
      </PageSection>
      {comparisons.length > 0 && (
        <PageSection
          id="comparisons"
          title={t("comparisons")}
          intro={t("comparisonsIntro")}
          tone="muted"
        >
          <Div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((pair) => (
              <CardLink
                key={pair.path}
                href={`/${locale}${pair.path}`}
                label={t("versus", { a: pair.a, b: pair.b })}
              />
            ))}
          </Div>
        </PageSection>
      )}
      <PageSection title={t("guides")} narrow>
        <Div className="flex flex-col items-start gap-1">
          {chatgptGuide !== undefined && (
            <CardLink
              href={`/${locale}${chatgptGuide.path}`}
              label={t("chatgptGuide")}
            />
          )}
          <CardLink
            href={`/${locale}${TOPIC_HUB_PATHS.abliterated}`}
            label={t("abliteratedChat")}
          />
          <CardLink
            href={`/${locale}${COMPARE_HUB_PATH}`}
            label={t("compare")}
          />
          <CompareInlineLinks
            locale={locale}
            versus={VERSUS_KEYS}
            includeHub={false}
          />
          <CardLink
            href={`/${locale}/story/refusal-index`}
            label={t("benchmark")}
          />
          <CardLink href={`/${locale}/models`} label={t("chooseModel")} />
        </Div>
      </PageSection>
    </>
  );
}

export default async function UncensoredChatPage(
  props: Props,
): Promise<JSX.Element> {
  return <TanstackPage {...await tanstackLoader(props)} />;
}
