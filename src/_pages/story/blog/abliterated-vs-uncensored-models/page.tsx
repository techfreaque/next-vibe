/**
 * Blog post: the three kinds of uncensored AI model (abliterated, fine-tuned,
 * own worldview) and how to tell them apart.
 * /[locale]/story/blog/abliterated-vs-uncensored-models
 *
 * Every model fact comes from the registry at render time: which uncensored
 * models exist, how each one was made (`uncensoredMethod`, set only where the
 * provider documents it), filter level, context window and price per message.
 * The base-vs-uncensored pairs read both sides from the registry too, so the
 * price gap stays current. Free credits come from the products constants.
 */

import type { Metadata } from "next";
import {
  chatModelDefinitions,
  ChatModelId,
} from "next-vibe/agent/ai-stream/models";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import type { UncensoredModelMethod } from "next-vibe/agent/models/models";
import {
  ContentLevel,
  type ContentLevelValue,
} from "next-vibe/agent/skills/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Microscope } from "next-vibe/ui/components/icons/Microscope";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import type { JSX } from "react";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import {
  formatTokenCount,
  getModelFacts,
  listModelFacts,
  OWN_WORLDVIEW_UNCENSORED_MODEL_ID,
} from "@/_pages/models/_shared/model-facts";
import {
  formatMoney,
  priceFootnote,
  tierName,
} from "@/_pages/models/_shared/model-format";
import { scopedTranslation as modelsScopedTranslation } from "@/_pages/models/i18n";
import { configScopedTranslation } from "@/env/i18n";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";

import {
  ArticleBody,
  ArticleEnd,
  ArticleH3,
  ArticleHeader,
  ArticleLead,
  ArticleList,
  ArticleP,
  ArticleScroll,
  ArticleSection,
} from "../../_shared/article";
import {
  Callout,
  CardLink,
  Cta,
  Step,
  StepList,
} from "../../_shared/marketing";
import { CompareInlineLinks } from "../../compare/_shared/compare-ui";
import { ABLITERATION_SOURCES } from "../../compare/_shared/platforms";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "abliterated-vs-uncensored-models";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** Base models and the corresponding uncensored variants in the catalog. */
const PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED],
  [
    ChatModelId.DEEPSEEK_V4_1_FLASH,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
  [ChatModelId.KIMI_K3_1_PRO, ChatModelId.KIMI_K3_1_PRO_UNCENSORED],
];

/** Registry method, or "unlisted" when the provider does not document it. */
type KindKey = UncensoredModelMethod | "unlisted";

const KIND_ORDER: readonly KindKey[] = [
  "abliterated",
  "fineTuned",
  "ownWorldview",
  "unlisted",
];

const TEST_STEPS: readonly ("refusal" | "voice" | "worldview" | "switch")[] = [
  "refusal",
  "voice",
  "worldview",
  "switch",
];

const FAQ_KEYS: readonly (
  | "whatIs"
  | "difference"
  | "identify"
  | "worse"
  | "truly"
  | "free"
  | "legal"
)[] = ["whatIs", "difference", "identify", "worse", "truly", "free", "legal"];

export interface KindModel {
  id: ChatModelId;
  slug: string;
  name: string;
}

export interface KindGroup {
  key: KindKey;
  models: KindModel[];
}

export interface PairSide {
  id: ChatModelId;
  slug: string;
  name: string;
  content: typeof ContentLevelValue;
  contextWindow: number;
  messagePrice: string;
}

export interface PairRow {
  base: PairSide;
  uncensored: PairSide;
  method: KindKey;
  /** Uncensored price per message divided by the base price. */
  ratio: number;
}

export interface AbliteratedPostPageData {
  locale: CountryLanguage;
  groups: KindGroup[];
  pairs: PairRow[];
  uncensoredCount: number;
  ownName: string;
  ownSlug: string;
  ownContext: number;
}

export async function tanstackLoader({
  params,
}: Props): Promise<AbliteratedPostPageData> {
  const { locale } = await params;
  const availability = await getEnvAvailability();
  const uncensored = listModelFacts(availability).filter(
    (facts) => !facts.isLegacy && facts.content === ContentLevel.UNCENSORED,
  );
  const groups = KIND_ORDER.flatMap((key) => {
    const models = uncensored
      .filter((facts) => (facts.uncensoredMethod ?? "unlisted") === key)
      .map((facts) => ({ id: facts.id, slug: facts.slug, name: facts.name }));
    return models.length > 0 ? [{ key, models }] : [];
  });
  const pairs = PAIRS.flatMap(([baseId, uncensoredId]): PairRow[] => {
    const base = getModelFacts(baseId, availability);
    const unc = getModelFacts(uncensoredId, availability);
    if (base === null || unc === null || base.isLegacy || unc.isLegacy) {
      return [];
    }
    const side = (facts: typeof base): PairSide => ({
      id: facts.id,
      slug: facts.slug,
      name: facts.name,
      content: facts.content,
      contextWindow: facts.contextWindow,
      messagePrice: formatMoney(facts.creditsPerMessage, locale),
    });
    return [
      {
        base: side(base),
        uncensored: side(unc),
        method: unc.uncensoredMethod ?? "unlisted",
        ratio:
          base.creditsPerMessage > 0
            ? unc.creditsPerMessage / base.creditsPerMessage
            : 0,
      },
    ];
  });
  const own = uncensored.find(
    (facts) => facts.id === OWN_WORLDVIEW_UNCENSORED_MODEL_ID,
  );
  const ownDefinition = chatModelDefinitions[OWN_WORLDVIEW_UNCENSORED_MODEL_ID];
  return {
    locale,
    groups,
    pairs,
    uncensoredCount: uncensored.length,
    ownName: ownDefinition.name,
    ownSlug: own?.slug ?? "",
    ownContext: ownDefinition.contextWindow,
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
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

const LINK_CLASS =
  "font-medium text-primary underline-offset-4 hover:underline";

function ModelLink({
  model,
  locale,
}: {
  model: { slug: string; name: string };
  locale: CountryLanguage;
}): JSX.Element {
  return (
    <Link href={`/${locale}/models/${model.slug}`} className={LINK_CLASS}>
      {model.name}
    </Link>
  );
}

export function TanstackPage({
  locale,
  groups,
  pairs,
  uncensoredCount,
  ownName,
  ownSlug,
  ownContext,
}: AbliteratedPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const { t: modelsT } = modelsScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const ratioText = (value: number): string =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
  const countOf = (key: KindKey): number =>
    groups.find((group) => group.key === key)?.models.length ?? 0;
  const abliteratedModels =
    groups.find((group) => group.key === "abliterated")?.models ?? [];
  const otherGroups = groups.filter((group) => group.key !== "abliterated");
  const stats = {
    appName,
    uncensoredCount,
    abliteratedCount: countOf("abliterated"),
    fineTunedCount: countOf("fineTuned"),
    ownName,
    ownContext: formatTokenCount(ownContext),
    guestCredits: FREE_CREDIT_ALLOWANCE.guest,
    freeCredits: FREE_CREDIT_SIGNED_IN_TOTAL,
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
          id="online"
          title={t("online.title")}
          intro={t("online.compare", stats)}
        >
          <CardLink
            href={`/${locale}/story/abliterated-ai-chat`}
            label={t("online.directoryLink")}
          />
          {abliteratedModels.length > 0 && (
            <Div className="flex flex-col gap-3">
              <ArticleH3>
                {t("ours.abliterated.title", {
                  count: abliteratedModels.length,
                })}
              </ArticleH3>
              <ArticleP>{t("ours.abliterated.body")}</ArticleP>
              <ArticleList
                items={abliteratedModels.map((model) => (
                  <ModelLink key={model.id} model={model} locale={locale} />
                ))}
              />
            </Div>
          )}
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/uncensored-ai`}
              label={t("online.guideLink")}
            />
            {ownSlug !== "" && (
              <CardLink
                href={`/${locale}/models/${ownSlug}`}
                label={t("faq.ownLink", stats)}
              />
            )}
          </Div>
        </ArticleSection>

        <ArticleSection id="label" title={t("label.title")}>
          <ArticleP>{t("label.p1")}</ArticleP>
          <ArticleP>{t("label.p2")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="methods"
          title={t("methods.title")}
          intro={t("methods.intro")}
        >
          {(["abliterated", "fineTuned", "ownWorldview"] as const).map(
            (key) => (
              <Div key={key} className="flex flex-col gap-3">
                <ArticleH3>{t(`methods.${key}.title`)}</ArticleH3>
                <ArticleP>{t(`methods.${key}.how`, stats)}</ArticleP>
                <ArticleList
                  items={[
                    t(`methods.${key}.keeps`),
                    t(`methods.${key}.changes`),
                  ]}
                />
              </Div>
            ),
          )}
          <Callout icon={Layers} tone="neutral">
            {t("methods.callout", stats)}
          </Callout>
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
                  `methods.sources.${source.kind === "paper" ? "paper" : "blog"}`,
                )}
              </ExternalLink>
            ))}
          />
        </ArticleSection>

        <ArticleSection
          id="ours"
          title={t("ours.title")}
          intro={t("ours.intro", stats)}
        >
          {otherGroups.map((group) => (
            <Div key={group.key} className="flex flex-col gap-3">
              <ArticleH3>
                {t(`ours.${group.key}.title`, {
                  count: group.models.length,
                })}
              </ArticleH3>
              <ArticleP>{t(`ours.${group.key}.body`)}</ArticleP>
              <ArticleList
                items={group.models.map((model) => (
                  <ModelLink key={model.id} model={model} locale={locale} />
                ))}
              />
            </Div>
          ))}
        </ArticleSection>

        <ArticleSection
          id="pairs"
          title={t("pairs.title")}
          intro={t("pairs.intro", stats)}
        >
          <ArticleScroll>
            <Div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table className="min-w-[46rem]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {(
                      [
                        "colBase",
                        "colUncensored",
                        "colMethod",
                        "colContext",
                        "colPrice",
                      ] as const
                    ).map((col) => (
                      <TableHead
                        key={col}
                        className="text-xs font-semibold uppercase tracking-wide"
                      >
                        {t(`pairs.${col}`)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pairs.map((pair) => (
                    <TableRow
                      key={pair.uncensored.id}
                      data-model={pair.uncensored.id}
                    >
                      <TableCell className="align-top">
                        <ModelLink model={pair.base} locale={locale} />
                        <Span className="block text-xs text-muted-foreground">
                          {tierName(pair.base.content, locale)}
                        </Span>
                      </TableCell>
                      <TableCell className="align-top">
                        <ModelLink model={pair.uncensored} locale={locale} />
                        <Span className="block text-xs text-muted-foreground">
                          {tierName(pair.uncensored.content, locale)}
                        </Span>
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {t(`pairs.method.${pair.method}`)}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums text-muted-foreground">
                        {formatTokenCount(pair.uncensored.contextWindow)}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums text-foreground">
                        {t("pairs.price", {
                          base: pair.base.messagePrice,
                          uncensored: pair.uncensored.messagePrice,
                        })}
                        {pair.ratio > 0 && (
                          <Span className="block text-xs text-muted-foreground">
                            {t("pairs.ratio", { ratio: ratioText(pair.ratio) })}
                          </Span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Div>
          </ArticleScroll>
          <ArticleP>
            {priceFootnote(locale, modelsT)} {t("pairs.footnote")}
          </ArticleP>
          <Div className="flex flex-col">
            {pairs.map((pair) => (
              <CardLink
                key={pair.uncensored.id}
                href={`/${locale}/models/compare/${pair.base.slug}/${pair.uncensored.slug}`}
                label={t("pairs.compareLink", {
                  a: pair.base.name,
                  b: pair.uncensored.name,
                })}
              />
            ))}
          </Div>
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
          <Callout icon={Microscope} tone="neutral">
            {t("test.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="tradeoffs"
          title={t("tradeoffs.title")}
          intro={t("tradeoffs.intro")}
        >
          <ArticleList
            items={[
              t("tradeoffs.abliterated"),
              t("tradeoffs.fineTuned"),
              t("tradeoffs.ownWorldview", stats),
            ]}
          />
        </ArticleSection>

        <ArticleSection id="pick" title={t("pick.title")}>
          <ArticleList
            items={[
              t("pick.capability"),
              t("pick.fiction"),
              t("pick.viewpoint", stats),
              t("pick.unsure"),
            ]}
          />
          <Callout icon={AlertTriangle} tone="neutral">
            {t("pick.consent")}
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
              href={`/${locale}/story/blog/uncensored-models-what-each-is-good-at`}
              label={t("faq.guideLink")}
            />
            <CompareInlineLinks locale={locale} versus={["venice"]} />
          </Div>
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle", stats)}
          actions={
            <>
              <Cta
                href={`/${locale}/threads/incognito/new`}
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

export default async function AbliteratedVsUncensoredPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
