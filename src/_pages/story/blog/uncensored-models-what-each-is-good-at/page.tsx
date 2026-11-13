/**
 * Blog post: the uncensored models, model by model.
 * /[locale]/story/blog/uncensored-models-what-each-is-good-at
 *
 * Names and slugs come from the model registry so the post stays in sync.
 * Live content-level counts come from env availability, same as the model
 * refresh post. Neutral, factual framing: diverse options are the point.
 */

import type { Metadata } from "next";
import {
  ChatModelId,
  chatModelDefinitions,
} from "next-vibe/agent/ai-stream/models";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import {
  getAvailableChatModelCountsByContentLevel,
  type ModelCountsByContentLevel,
} from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Star } from "next-vibe/ui/components/icons/Star";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { toModelSlug } from "@/_pages/models/_shared/model-facts";
import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleEnd,
  ArticleHeader,
  ArticleLead,
  ArticleP,
  ArticleSection,
} from "../../_shared/article";
import { Callout, CardLink, Cta } from "../../_shared/marketing";
import { formatPostDate } from "../posts-meta";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "story/blog/uncensored-models-what-each-is-good-at",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

/** Which i18n block carries each model's good/bad copy. */
type CardKey =
  | "uncensoredLm"
  | "freedomgpt"
  | "arya"
  | "venice"
  | "veniceRoleplay"
  | "gemma"
  | "qwen"
  | "deepseekFlash"
  | "mimo"
  | "glm53"
  | "glm53Flash";

/** Card id -> registry model it describes. Names/slugs read from the registry. */
const CARD_MODEL: Record<CardKey, ChatModelId> = {
  uncensoredLm: ChatModelId.UNCENSORED_LM_V1_2,
  freedomgpt: ChatModelId.FREEDOMGPT_LIBERTY,
  arya: ChatModelId.GAB_AI_ARYA,
  venice: ChatModelId.VENICE_UNCENSORED,
  veniceRoleplay: ChatModelId.VENICE_UNCENSORED_ROLEPLAY,
  gemma: ChatModelId.GEMMA_4_UNCENSORED,
  qwen: ChatModelId.QWEN_3_6_PLUS_UNCENSORED,
  deepseekFlash: ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  mimo: ChatModelId.MIMO_V2_6_FLASH_ABLITERATED,
  glm53: ChatModelId.GLM_5_3_UNCENSORED,
  glm53Flash: ChatModelId.GLM_5_3_FLASH_UNCENSORED,
};

/** Models that have no live public page (hidden/404) get no deep link. */
const LINKED_CARDS: ReadonlySet<CardKey> = new Set<CardKey>([
  "uncensoredLm",
  "venice",
  "veniceRoleplay",
  "gemma",
  "qwen",
  "deepseekFlash",
  "mimo",
  "glm53",
  "glm53Flash",
]);

type GroupKey =
  | "builtUncensored"
  | "creative"
  | "viewpoint"
  | "reasoning"
  | "fast";

/**
 * Use-case sections. `topPick` renders a highlighted lead recommendation
 * (with a compare link against the strongest alternative) above the
 * alternative cards. UncensoredLM leads dark roleplay/fiction and
 * politics/viewpoints: it is the one model trained uncensored, the rest only
 * had refusals removed and keep their base framing.
 */
/** Sections that lead with a top pick (they carry a `topPickReason`). */
type TopPickGroupKey = "creative" | "viewpoint";

interface TopPickSpec {
  group: TopPickGroupKey;
  card: CardKey;
  compareWith: CardKey;
}

const GROUPS: readonly {
  key: GroupKey;
  topPick?: TopPickSpec;
  cards: readonly CardKey[];
}[] = [
  { key: "builtUncensored", cards: ["uncensoredLm"] },
  {
    key: "creative",
    topPick: {
      group: "creative",
      card: "uncensoredLm",
      compareWith: "veniceRoleplay",
    },
    cards: ["veniceRoleplay", "venice", "deepseekFlash"],
  },
  {
    key: "viewpoint",
    topPick: {
      group: "viewpoint",
      card: "uncensoredLm",
      compareWith: "venice",
    },
    cards: ["arya", "freedomgpt"],
  },
  { key: "reasoning", cards: ["glm53", "qwen"] },
  { key: "fast", cards: ["glm53Flash", "gemma", "mimo"] },
];

/**
 * Built-uncensored vs refusal-stripped, then vs ChatGPT's model. Same URL
 * order as the sitemap (FEATURED_COMPARISON_PAIRS in model-facts).
 */
const COMPARE_PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED_ROLEPLAY],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED],
  [
    ChatModelId.UNCENSORED_LM_V1_2,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.QWEN_3_6_PLUS_UNCENSORED],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GPT_6_1_SOL],
];

function compareHref(
  locale: CountryLanguage,
  a: ChatModelId,
  b: ChatModelId,
): string {
  return `/${locale}/models/compare/${toModelSlug(a)}/${toModelSlug(b)}`;
}

function modelName(id: ChatModelId): string {
  return chatModelDefinitions[id].name;
}

export interface UncensoredGuidePageData {
  locale: CountryLanguage;
  counts: ModelCountsByContentLevel;
}

export async function tanstackLoader({
  params,
}: Props): Promise<UncensoredGuidePageData> {
  const { locale } = await params;
  const availability = await getEnvAvailability();
  return {
    locale,
    counts: getAvailableChatModelCountsByContentLevel(false, availability),
  };
}

function ModelCard({
  cardKey,
  locale,
}: {
  cardKey: CardKey;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const id = CARD_MODEL[cardKey];
  const name = modelName(id);
  const linked = LINKED_CARDS.has(cardKey);

  return (
    <Div className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-5 md:p-6">
      <Div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <Span className="text-base font-semibold tracking-tight text-foreground [overflow-wrap:anywhere]">
          {name}
        </Span>
        <Span className="text-xs font-medium text-muted-foreground">
          {t(`cards.${cardKey}.maker`)}
        </Span>
      </Div>
      <P className="mt-1 text-xs text-muted-foreground">
        {t(`cards.${cardKey}.basis`)}
      </P>
      <Div className="mt-4 flex flex-col gap-3">
        <Div className="grid grid-cols-[5.75rem_minmax(0,1fr)] gap-3">
          <Span className="text-xs font-semibold uppercase tracking-wide text-success">
            {t("cards.goodLabel")}
          </Span>
          <Span className="text-sm leading-relaxed text-foreground/90">
            {t(`cards.${cardKey}.good`)}
          </Span>
        </Div>
        <Div className="grid grid-cols-[5.75rem_minmax(0,1fr)] gap-3">
          <Span className="text-xs font-semibold uppercase tracking-wide text-warning">
            {t("cards.weakLabel")}
          </Span>
          <Span className="text-sm leading-relaxed text-muted-foreground">
            {t(`cards.${cardKey}.weak`)}
          </Span>
        </Div>
      </Div>
      {linked && (
        <Link
          href={`/${locale}/models/${toModelSlug(id)}`}
          className="group mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          {t("cards.pageLink", { model: name })}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </Div>
  );
}

/** Highlighted lead recommendation for a use-case section. */
function TopPick({
  pick,
  locale,
}: {
  pick: TopPickSpec;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const id = CARD_MODEL[pick.card];
  const name = modelName(id);
  const otherId = CARD_MODEL[pick.compareWith];

  return (
    <Div className="flex min-w-0 flex-col rounded-xl border border-primary/30 bg-primary/5 p-5 md:p-6">
      <Div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <Star className="h-3.5 w-3.5" />
          {t("cards.topPickLabel")}
        </Span>
        <Span className="text-base font-semibold tracking-tight text-foreground [overflow-wrap:anywhere]">
          {name}
        </Span>
      </Div>
      <P className="mt-3 text-sm leading-relaxed text-foreground/90 md:text-base">
        {t(`groups.${pick.group}.topPickReason`)}
      </P>
      <Div className="mt-3 flex flex-col gap-x-6 sm:flex-row sm:flex-wrap">
        <CardLink
          href={`/${locale}/models/${toModelSlug(id)}`}
          label={t("cards.pageLink", { model: name })}
        />
        <CardLink
          href={compareHref(locale, id, otherId)}
          label={t("howToPick.compareLink", {
            a: name,
            b: modelName(otherId),
          })}
        />
      </Div>
    </Div>
  );
}

export function TanstackPage({
  locale,
  counts,
}: UncensoredGuidePageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("uncensored-models-what-each-is-good-at", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>
            {t("intro.lead", { uncensoredCount: counts.uncensored })}
          </ArticleLead>
          <ArticleP>{t("intro.p2")}</ArticleP>
        </Div>

        <ArticleSection title={t("whatItMeans.title")}>
          <ArticleP>{t("whatItMeans.p1")}</ArticleP>
          <Callout icon={Scale} tone="neutral">
            {t("whatItMeans.callout")}
          </Callout>
          <ArticleP>{t("whatItMeans.p2")}</ArticleP>
        </ArticleSection>

        {GROUPS.map((group) => (
          <ArticleSection
            key={group.key}
            title={t(`groups.${group.key}.title`)}
            intro={t(`groups.${group.key}.intro`)}
          >
            {group.topPick !== undefined && (
              <TopPick pick={group.topPick} locale={locale} />
            )}
            {group.topPick !== undefined && (
              <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("cards.alternativesLabel")}
              </Span>
            )}
            <Div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {group.cards.map((cardKey) => (
                <ModelCard key={cardKey} cardKey={cardKey} locale={locale} />
              ))}
            </Div>
          </ArticleSection>
        ))}

        <ArticleSection title={t("why.title")} intro={t("why.intro")}>
          <ArticleP>{t("why.p1")}</ArticleP>
          <ArticleP>{t("why.p2")}</ArticleP>
          <Callout icon={Scale} tone="primary">
            {t("why.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("howToPick.title")}>
          <ArticleP>{t("howToPick.p1")}</ArticleP>
          <ArticleP>{t("howToPick.p2")}</ArticleP>
          <Div className="flex flex-col">
            {COMPARE_PAIRS.map(([a, b]) => (
              <CardLink
                key={`${a}-${b}`}
                href={compareHref(locale, a, b)}
                label={t("howToPick.compareLink", {
                  a: modelName(a),
                  b: modelName(b),
                })}
              />
            ))}
          </Div>
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          actions={
            <>
              <Cta
                href={`/${locale}/threads`}
                label={t("cta.chat")}
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

export default async function UncensoredGuidePage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
