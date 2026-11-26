/**
 * Blog post: AI chat with no sign-up, and what "anonymous" honestly means.
 * /[locale]/story/blog/ai-chat-no-sign-up
 *
 * Credits, plans and model counts come from loadUsFacts. The starter table is
 * the cheapest current text models per content tier, read from the registry
 * via loadCheapestRowsByTier. Privacy statements stick to what the privacy
 * policy says (first-party cookie only, guest media retention) and to how
 * incognito chats are stored (in the browser, see agent/chat/incognito).
 */

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
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
import { LINK_CLASS } from "../../compare/_shared/compare-data";
import type { UsParams } from "../../compare/_shared/us-facts";
import { UncensoredModelTable, type UncensoredRow } from "../uncensored-rows";
import { loadCheapestRowsByTier } from "../uncensored-rows-data";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "ai-chat-no-sign-up";

/** Starter models shown per content tier. */
const PER_TIER = 2;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

const STEPS: readonly ("open" | "pick" | "confirm" | "ask")[] = [
  "open",
  "pick",
  "confirm",
  "ask",
];

const FAQ_KEYS: readonly (
  | "exists"
  | "anonymous"
  | "free"
  | "uncensored"
  | "saved"
  | "runOut"
)[] = ["exists", "anonymous", "free", "uncensored", "saved", "runOut"];

export interface NoSignUpPostPageData {
  locale: CountryLanguage;
  us: UsParams;
  rows: UncensoredRow[];
}

export async function tanstackLoader({
  params,
}: Props): Promise<NoSignUpPostPageData> {
  const { locale } = await params;
  const { loadUsFacts, usParams } =
    await import("../../compare/_shared/us-facts");
  const [facts, rows] = await Promise.all([
    loadUsFacts(locale),
    loadCheapestRowsByTier(locale, PER_TIER),
  ]);
  return { locale, us: usParams(facts), rows };
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
}: NoSignUpPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const cheapest = rows.toSorted(
    (a, b) => a.creditsPerMessage - b.creditsPerMessage,
  )[0];
  const guestCredits = Number(us.guestCredits);
  const stats = {
    ...us,
    cheapestModel: cheapest?.name ?? "",
    cheapestPrice: cheapest?.messagePrice ?? "",
    guestMessages:
      cheapest === undefined || cheapest.creditsPerMessage <= 0
        ? ""
        : formatNumber(
            Math.floor(guestCredits / cheapest.creditsPerMessage),
            locale,
          ),
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
          id="without-account"
          title={t("guest.title")}
          intro={t("guest.intro")}
        >
          <ArticleList
            items={[
              t("guest.credits", stats),
              t("guest.models", stats),
              t("guest.uncensored", stats),
              <Span key="media">
                {t("guest.media", stats)}{" "}
                <Link href={`/${locale}/create`} className={LINK_CLASS}>
                  {t("guest.mediaLink")}
                </Link>
              </Span>,
            ]}
          />
        </ArticleSection>

        {rows.length > 0 && (
          <ArticleSection
            id="starters"
            title={t("starters.title")}
            intro={t("starters.intro", stats)}
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
            <ArticleP>{t("starters.footnote", stats)}</ArticleP>
          </ArticleSection>
        )}

        <ArticleSection
          id="anonymous"
          title={t("anonymous.title")}
          intro={t("anonymous.intro")}
        >
          <ArticleH3>{t("anonymous.yesTitle")}</ArticleH3>
          <ArticleList
            items={[
              t("anonymous.noEmail"),
              t("anonymous.incognito"),
              t("anonymous.trackers"),
            ]}
          />
          <ArticleH3>{t("anonymous.noTitle")}</ArticleH3>
          <ArticleList
            items={[
              t("anonymous.provider"),
              t("anonymous.media"),
              t("anonymous.network"),
            ]}
          />
          <Callout icon={EyeOff} tone="neutral">
            {t("anonymous.callout")}
          </Callout>
          <CardLink
            href={`/${locale}/story/privacy-policy`}
            label={t("anonymous.policyLink")}
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
          id="account"
          title={t("account.title")}
          intro={t("account.intro")}
        >
          <ArticleList
            items={[
              t("account.credits", stats),
              t("account.sync"),
              t("account.control"),
              t("account.plans", stats),
            ]}
          />
        </ArticleSection>

        <ArticleSection
          id="stricter"
          title={t("stricter.title")}
          intro={t("stricter.intro")}
        >
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/self-host`}
              label={t("stricter.selfHost", stats)}
            />
            <CardLink
              href={`/${locale}/story/blog/uncensored-llm-without-gpu`}
              label={t("stricter.local")}
            />
            <CardLink
              href={`/${locale}/story/blog/venice-ai-alternatives`}
              label={t("stricter.venice")}
            />
          </Div>
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
              href={`/${locale}/story/blog/chatgpt-alternative-without-filters`}
              label={t("faq.chatgptLink")}
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
                href={`/${locale}/threads/incognito/new`}
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

export default async function AiChatNoSignUpPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
