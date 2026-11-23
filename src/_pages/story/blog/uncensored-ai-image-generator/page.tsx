/**
 * Blog post: uncensored AI image generators next to every other image model,
 * from the model registry.
 * /[locale]/story/blog/uncensored-ai-image-generator
 *
 * Models, labs, filter levels, inputs and prices are read from
 * src/vibe/agent/image-generation/models.ts (cheapest public route, standard
 * markup, same rounding as billing). Free credits, plans and packs come from
 * the products catalog. Nothing numeric is hardcoded in copy.
 */

import type { Metadata } from "next";
import {
  type AgentEnvAvailability,
  getEnvAvailability,
} from "next-vibe/agent/env-availability";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "next-vibe/agent/image-generation/constants";
import {
  getImageGenModelById,
  ImageGenModelId,
} from "next-vibe/agent/image-generation/models";
import {
  chargeForProviderCredits,
  isModelOptionImageBased,
} from "next-vibe/agent/models/models";
import {
  ContentLevel,
  type ContentLevelValue,
  ModelSelectionType,
} from "next-vibe/agent/skills/enum";
import type {
  CountryLanguage,
  Currencies,
} from "next-vibe/core/i18n/core/config";
import { getCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { formatCurrency } from "next-vibe/core/i18n/core/localization-utils";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Image as ImageIcon } from "next-vibe/ui/components/icons/Image";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { ShieldOff } from "next-vibe/ui/components/icons/ShieldOff";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { JsonLd } from "next-vibe/ui/components/json-ld";
import { Link } from "next-vibe/ui/components/link";
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
import { createHref } from "@/_pages/create/_shared/create-kinds";
import { formatNumber, tierName } from "@/_pages/models/_shared/model-format";
import { listMediaFacts } from "@/_pages/models/_shared/model-media-facts";
import { configScopedTranslation } from "@/env/i18n";
import {
  CREDIT_VALUE_USD,
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_SIGNED_IN_TOTAL,
  STANDARD_MARKUP_PERCENTAGE,
} from "@/products/constants";
import { ProductIds, productsRepository } from "@/products/platform-products";

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
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "uncensored-ai-image-generator";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** One current (non-legacy) image model with a flat per-image price. */
export interface ImageModelRow {
  id: ImageGenModelId;
  slug: string;
  name: string;
  lab: string;
  content: typeof ContentLevelValue;
  /** Takes a reference image (edits, image to image). */
  edits: boolean;
  /** Charged credits per image (markup included, billing rounding). */
  credits: number;
  price: string;
  /** Whole images one unit of currency ($1 / 1 EUR) buys. */
  perUnit: number;
}

export interface ImagePostPageData {
  locale: CountryLanguage;
  rows: ImageModelRow[];
  labCount: number;
  /** One unit of the credit currency, formatted ("$1.00", "1,00 €"). */
  unit: string;
  defaultModelName: string;
  subPrice: string;
  subCredits: number;
  packPrice: string;
  packCredits: number;
}

type PickGroup =
  | "uncensored"
  | "uncensoredEdit"
  | "cheap"
  | "quality"
  | "text"
  | "references";

/** Picks per job. Only rows that exist (and match the group's rule) render. */
const PICKS: readonly {
  key: PickGroup;
  models: readonly ImageGenModelId[];
  keep: (row: ImageModelRow) => boolean;
}[] = [
  {
    key: "uncensored",
    models: [ImageGenModelId.CHROMA, ImageGenModelId.LUSTIFY_V8],
    keep: (row) => row.content === ContentLevel.UNCENSORED,
  },
  {
    key: "uncensoredEdit",
    models: [ImageGenModelId.QWEN_EDIT, ImageGenModelId.FIRERED_IMAGE_EDIT],
    keep: (row) => row.content === ContentLevel.UNCENSORED && row.edits,
  },
  {
    key: "cheap",
    models: [
      ImageGenModelId.RECRAFT_V4_1_FLASH,
      ImageGenModelId.FLUX_3_KLEIN,
      ImageGenModelId.Z_IMAGE_TURBO,
      ImageGenModelId.SEEDREAM_5_5,
    ],
    keep: () => true,
  },
  {
    key: "quality",
    models: [
      ImageGenModelId.FLUX_3_IMAGE,
      ImageGenModelId.SEEDREAM_5_5,
      ImageGenModelId.FLUX_PRO_1_1_ULTRA,
    ],
    keep: () => true,
  },
  {
    key: "text",
    models: [
      ImageGenModelId.RECRAFT_V4_1,
      ImageGenModelId.GPT_IMAGE_2_6_SUNBURST,
      ImageGenModelId.QWEN_IMAGE_3_PRO,
      ImageGenModelId.RECRAFT_V4_1_PRO,
    ],
    keep: () => true,
  },
  {
    key: "references",
    models: [
      ImageGenModelId.SEEDREAM_5_5,
      ImageGenModelId.FLUX_2_PRO,
      ImageGenModelId.QWEN_IMAGE_3,
      ImageGenModelId.GROK_IMAGINE_IMAGE_2,
    ],
    keep: (row) => row.edits,
  },
];

/** Copy block per uncensored model; a new uncensored model falls back to "other". */
const UNCENSORED_COPY_KEY: Partial<
  Record<ImageGenModelId, "lustify" | "chroma" | "qwenEdit" | "fireRed">
> = {
  [ImageGenModelId.LUSTIFY_V8]: "lustify",
  [ImageGenModelId.CHROMA]: "chroma",
  [ImageGenModelId.QWEN_EDIT]: "qwenEdit",
  [ImageGenModelId.FIRERED_IMAGE_EDIT]: "fireRed",
};

const CHAT_STEPS: readonly ("ask" | "model" | "edit" | "result")[] = [
  "ask",
  "model",
  "edit",
  "result",
];

const FAQ_KEYS: readonly (
  | "exists"
  | "free"
  | "cheapest"
  | "edit"
  | "consent"
  | "watermark"
  | "api"
)[] = ["exists", "free", "cheapest", "edit", "consent", "watermark", "api"];

/** Uncensored first, then open, then mainstream. */
const TIER_RANK: Record<typeof ContentLevelValue, number> = {
  [ContentLevel.UNCENSORED]: 0,
  [ContentLevel.OPEN]: 1,
  [ContentLevel.MAINSTREAM]: 2,
};

/** Same rule as the model pages: 1 credit = 0.01 EUR in DE, else 0.01 USD. */
function creditCurrency(locale: CountryLanguage): Currencies {
  return getCountryFromLocale(locale) === "DE" ? "EUR" : "USD";
}

function buildRows(
  locale: CountryLanguage,
  availability: AgentEnvAvailability,
): ImageModelRow[] {
  const currency = creditCurrency(locale);
  return listMediaFacts(availability)
    .filter((facts) => facts.type === "image" && !facts.isLegacy)
    .flatMap((facts) => {
      const id = Object.values(ImageGenModelId).find(
        (value) => value === facts.modelId,
      );
      if (id === undefined) {
        return [];
      }
      const option = getImageGenModelById(id);
      // Token-priced models have no flat per-image price; they stay on /models.
      if (
        option === undefined ||
        option.id !== id ||
        !isModelOptionImageBased(option)
      ) {
        return [];
      }
      const credits = chargeForProviderCredits(option.creditCostPerImage);
      if (credits <= 0) {
        return [];
      }
      return [
        {
          id,
          slug: facts.slug,
          name: facts.name,
          lab: facts.labName,
          content: facts.content,
          edits: facts.inputs.includes("image"),
          credits,
          price: formatCurrency(credits * CREDIT_VALUE_USD, currency, locale),
          perUnit: Math.floor(1 / (credits * CREDIT_VALUE_USD)),
        },
      ];
    })
    .toSorted(
      (a, b) =>
        TIER_RANK[a.content] - TIER_RANK[b.content] || a.credits - b.credits,
    );
}

export async function tanstackLoader({
  params,
}: Props): Promise<ImagePostPageData> {
  const { locale } = await params;
  const products = productsRepository.getProducts(locale);
  const subscription = products[ProductIds.SUBSCRIPTION];
  const pack = products[ProductIds.CREDIT_PACK];
  const availability = await getEnvAvailability();
  const rows = buildRows(locale, availability);
  const defaultId =
    DEFAULT_IMAGE_GEN_MODEL_SELECTION.selectionType ===
    ModelSelectionType.MANUAL
      ? DEFAULT_IMAGE_GEN_MODEL_SELECTION.manualModelId
      : ImageGenModelId.CHROMA;
  return {
    locale,
    rows,
    labCount: new Set(rows.map((r) => r.lab)).size,
    unit: formatCurrency(1, creditCurrency(locale), locale),
    defaultModelName:
      listMediaFacts(availability).find(
        (facts) => facts.type === "image" && facts.modelId === defaultId,
      )?.name ?? "",
    subPrice: formatCurrency(subscription.price, subscription.currency, locale),
    subCredits: subscription.credits,
    packPrice: formatCurrency(pack.price, pack.currency, locale),
    packCredits: pack.credits,
  };
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const { rows } = await tanstackLoader({ params });
  const modelCount = rows.length;
  const uncensoredCount = rows.filter(
    (r) => r.content === ContentLevel.UNCENSORED,
  ).length;
  return metadataGenerator(locale, {
    path: `story/blog/${SLUG}`,
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", {
      appName,
      modelCount,
      uncensoredCount,
    }),
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

const LINK_CLASS =
  "font-medium text-primary underline-offset-4 hover:underline";

function ModelLink({
  row,
  locale,
}: {
  row: ImageModelRow;
  locale: CountryLanguage;
}): JSX.Element {
  return (
    <Link href={`/${locale}/models/${row.slug}`} className={LINK_CLASS}>
      {row.name}
    </Link>
  );
}

export function TanstackPage({
  locale,
  rows,
  labCount,
  unit,
  defaultModelName,
  subPrice,
  subCredits,
  packPrice,
  packCredits,
}: ImagePostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const num = (value: number): string => formatNumber(value, locale);
  const byId = new Map(rows.map((row) => [row.id, row]));

  const byPrice = rows.toSorted((a, b) => a.credits - b.credits);
  const cheapest = byPrice[0];
  const priciest = byPrice.at(-1);
  const uncensored = rows.filter((r) => r.content === ContentLevel.UNCENSORED);
  const cheapestUncensored = uncensored.toSorted(
    (a, b) => a.credits - b.credits,
  )[0];
  const stats = {
    appName,
    modelCount: rows.length,
    labCount,
    unit,
    uncensoredCount: uncensored.length,
    openCount: rows.filter((r) => r.content === ContentLevel.OPEN).length,
    mainstreamCount: rows.filter((r) => r.content === ContentLevel.MAINSTREAM)
      .length,
    editCount: rows.filter((r) => r.edits).length,
    cheapestName: cheapest?.name ?? "",
    cheapestCredits: num(cheapest?.credits ?? 0),
    cheapestPrice: cheapest?.price ?? "",
    cheapestPerUnit: num(cheapest?.perUnit ?? 0),
    priciestName: priciest?.name ?? "",
    priciestCredits: num(priciest?.credits ?? 0),
    priciestPrice: priciest?.price ?? "",
    uncensoredName: cheapestUncensored?.name ?? "",
    uncensoredCredits: num(cheapestUncensored?.credits ?? 0),
    uncensoredPrice: cheapestUncensored?.price ?? "",
    uncensoredPerUnit: num(cheapestUncensored?.perUnit ?? 0),
    freeUncensoredImages: num(
      cheapestUncensored
        ? Math.floor(FREE_CREDIT_SIGNED_IN_TOTAL / cheapestUncensored.credits)
        : 0,
    ),
    markup: Math.round(STANDARD_MARKUP_PERCENTAGE * 100),
    creditValue: formatCurrency(
      CREDIT_VALUE_USD,
      creditCurrency(locale),
      locale,
    ),
    defaultModel: defaultModelName,
    guestCredits: FREE_CREDIT_ALLOWANCE.guest,
    freeCredits: FREE_CREDIT_SIGNED_IN_TOTAL,
    subPrice,
    subCredits,
    packPrice,
    packCredits,
  };

  const factLine = (row: ImageModelRow): string =>
    t("picks.factLine", {
      credits: num(row.credits),
      price: row.price,
      perUnit: num(row.perUnit),
      unit,
      tier: tierName(row.content, locale),
      input: row.edits ? t("table.inputEdit") : t("table.inputText"),
    });

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
          id="uncensored"
          title={t("exists.title")}
          intro={t("exists.intro", stats)}
        >
          <ArticleList
            items={uncensored.map((row) => (
              <Span key={row.id} className="flex flex-col gap-0.5">
                <ModelLink row={row} locale={locale} />
                <Span className="text-sm text-muted-foreground">
                  {t(`exists.models.${UNCENSORED_COPY_KEY[row.id] ?? "other"}`)}
                </Span>
              </Span>
            ))}
          />
          <Callout icon={ShieldOff} tone="neutral">
            {t("exists.consent", stats)}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="levels"
          title={t("levels.title")}
          intro={t("levels.intro")}
        >
          <ArticleList
            items={[
              t("levels.mainstream", stats),
              t("levels.open", stats),
              t("levels.uncensored", stats),
            ]}
          />
          <ArticleP>{t("levels.p1")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="table"
          title={t("table.title", stats)}
          intro={t("table.intro", stats)}
        >
          <ArticleScroll>
            <Div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table className="min-w-[40rem]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {(
                      [
                        "colModel",
                        "colFilter",
                        "colInput",
                        "colCredits",
                        "colPrice",
                      ] as const
                    ).map((col) => (
                      <TableHead
                        key={col}
                        className="text-xs font-semibold uppercase tracking-wide"
                      >
                        {t(`table.${col}`, stats)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} data-model={row.id}>
                      <TableCell className="align-top">
                        <ModelLink row={row} locale={locale} />
                        <Span className="block text-xs text-muted-foreground">
                          {row.lab}
                        </Span>
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {tierName(row.content, locale)}
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {row.edits
                          ? t("table.inputEdit")
                          : t("table.inputText")}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums text-foreground">
                        {num(row.credits)}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums font-semibold text-foreground">
                        {row.price}
                        <Span className="block text-xs font-normal text-muted-foreground">
                          {t("table.perUnit", {
                            perUnit: num(row.perUnit),
                            unit,
                          })}
                        </Span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Div>
          </ArticleScroll>
          <ArticleP>{t("table.footnote", stats)}</ArticleP>
          <CardLink href={`/${locale}/models`} label={t("table.allModels")} />
        </ArticleSection>

        <ArticleSection
          id="picks"
          title={t("picks.title")}
          intro={t("picks.intro")}
        >
          {PICKS.map((group) => {
            const picked = group.models.flatMap((id) => {
              const row = byId.get(id);
              return row && group.keep(row) ? [row] : [];
            });
            if (picked.length === 0) {
              return null;
            }
            return (
              <Div key={group.key} className="flex flex-col gap-3">
                <ArticleH3>{t(`picks.${group.key}.title`)}</ArticleH3>
                <ArticleP>{t(`picks.${group.key}.body`, stats)}</ArticleP>
                <ArticleList
                  items={picked.map((row) => (
                    <Span key={row.id} className="flex flex-col gap-0.5">
                      <ModelLink row={row} locale={locale} />
                      <Span className="text-sm text-muted-foreground">
                        {factLine(row)}
                      </Span>
                    </Span>
                  ))}
                />
              </Div>
            );
          })}
        </ArticleSection>

        <ArticleSection
          id="chat"
          title={t("chat.title")}
          intro={t("chat.intro", stats)}
        >
          <StepList>
            {CHAT_STEPS.map((step, index) => (
              <Step
                key={step}
                number={index + 1}
                title={t(`chat.steps.${step}.title`)}
                description={t(`chat.steps.${step}.body`, stats)}
              />
            ))}
          </StepList>
          <ArticleP>{t("chat.toolPage")}</ArticleP>
          <Div className="flex flex-col">
            <CardLink
              href={createHref(locale, "image")}
              label={t("chat.toolLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/ai-roleplay-without-filter`}
              label={t("chat.roleplayLink")}
            />
          </Div>
        </ArticleSection>

        <ArticleSection
          id="pricing"
          title={t("pricing.title")}
          intro={t("pricing.intro")}
        >
          <ArticleList
            items={[
              t("pricing.perImage", stats),
              t("pricing.range", stats),
              t("pricing.failed"),
              t("pricing.free", stats),
              t("pricing.sub", stats),
              t("pricing.pack", stats),
            ]}
          />
          <CardLink
            href={`/${locale}/subscription/overview`}
            label={t("pricing.link")}
          />
        </ArticleSection>

        <ArticleSection
          id="limits"
          title={t("limits.title")}
          intro={t("limits.intro")}
        >
          <ArticleList
            items={[
              t("limits.textOnly", stats),
              t("limits.specialists"),
              t("limits.upstream"),
              t("limits.video"),
              t("limits.law"),
            ]}
          />
          <Callout icon={AlertTriangle} tone="warning">
            {t("limits.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection id="faq" title={t("faq.title")}>
          <JsonLd
            id="faq-structured-data"
            data={buildFaqStructuredData(
              FAQ_KEYS.map((key) => ({
                question: t(`faq.${key}.q`, stats),
                answer: t(`faq.${key}.a`, stats),
              })),
            )}
          />
          {FAQ_KEYS.map((key) => (
            <Div key={key} className="flex flex-col gap-2">
              <ArticleH3>{t(`faq.${key}.q`, stats)}</ArticleH3>
              <ArticleP>{t(`faq.${key}.a`, stats)}</ArticleP>
            </Div>
          ))}
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/story/blog/ai-video-generators-compared`}
              label={t("faq.videoLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/uncensored-models-what-each-is-good-at`}
              label={t("faq.chatLink")}
            />
            <CompareInlineLinks locale={locale} versus={["venice"]} />
          </Div>
        </ArticleSection>

        <Callout icon={Wallet} tone="primary">
          <Span>{t("partners.body", stats)}</Span>{" "}
          <Link href={`/${locale}/story/partners`} className={LINK_CLASS}>
            {t("partners.link")}
          </Link>
        </Callout>

        <ArticleEnd
          post={{ slug: SLUG, locale }}
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle", stats)}
          actions={
            <>
              <Cta
                href={createHref(locale, "image")}
                label={t("cta.generate")}
                icon={ImageIcon}
              />
              <Cta
                href={`/${locale}/models`}
                label={t("cta.models")}
                icon={Layers}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function UncensoredImageGeneratorPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
