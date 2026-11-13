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
import { Callout, Cta } from "../../_shared/marketing";
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
  | "glmHeretic"
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
  glmHeretic: ChatModelId.GLM_4_7_FLASH_HERETIC,
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
  "glmHeretic",
  "mimo",
  "glm53",
  "glm53Flash",
]);

const GROUPS: readonly {
  key: "reasoning" | "creative" | "fast" | "viewpoint";
  cards: readonly CardKey[];
}[] = [
  { key: "reasoning", cards: ["glm53", "qwen", "uncensoredLm"] },
  { key: "creative", cards: ["venice", "veniceRoleplay", "freedomgpt"] },
  { key: "fast", cards: ["glm53Flash", "gemma", "glmHeretic", "mimo"] },
  { key: "viewpoint", cards: ["arya"] },
];

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
        <Div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
          <Span className="text-xs font-semibold uppercase tracking-wide text-success">
            {t("cards.goodLabel")}
          </Span>
          <Span className="text-sm leading-relaxed text-foreground/90">
            {t(`cards.${cardKey}.good`)}
          </Span>
        </Div>
        <Div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
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
          <ArticleP>{t("whatItMeans.p2")}</ArticleP>
        </ArticleSection>

        {GROUPS.map((group) => (
          <ArticleSection
            key={group.key}
            title={t(`groups.${group.key}.title`)}
            intro={t(`groups.${group.key}.intro`)}
          >
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
