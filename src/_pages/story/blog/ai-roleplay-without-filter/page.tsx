/**
 * Blog post: AI roleplay without a filter, an honest Character.AI alternative.
 * /[locale]/story/blog/ai-roleplay-without-filter
 *
 * Model names, slugs, filter levels, context windows, image input and the
 * price per reply come from the model registry (model page facts). The
 * Roleplay skill's variants are read from the skill definition. Free credits,
 * plans and packs come from the products catalog. Nothing numeric is
 * hardcoded in copy.
 */

import type { Metadata } from "next";
import {
  chatModelDefinitions,
  ChatModelId,
} from "next-vibe/agent/ai-stream/models";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { roleplaySkillSkill } from "next-vibe/agent/skills/default-skills/roleplay-character/skill";
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
import { EyeOff } from "next-vibe/ui/components/icons/EyeOff";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Theater } from "next-vibe/ui/components/icons/Theater";
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
import {
  formatTokenCount,
  getModelFacts,
} from "@/_pages/models/_shared/model-facts";
import {
  creditValueText,
  formatNumber,
  tierName,
} from "@/_pages/models/_shared/model-format";
import { scopedTranslation as modelsScopedTranslation } from "@/_pages/models/i18n";
import { configScopedTranslation } from "@/env/i18n";
import {
  CREDIT_VALUE_USD,
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_SIGNED_IN_TOTAL,
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
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "ai-roleplay-without-filter";
const ROLEPLAY_SKILL_ID = roleplaySkillSkill.id;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

type ModelKey =
  | "uncensoredLm"
  | "artemis"
  | "veniceRoleplay"
  | "deepseekFlash"
  | "glmFlash"
  | "venice"
  | "minimaxFlash"
  | "kimi"
  | "sonnet";

/** Roleplay models in the comparison, uncensored first. */
const MODELS: readonly { key: ModelKey; id: ChatModelId }[] = [
  { key: "uncensoredLm", id: ChatModelId.UNCENSORED_LM_V1_2 },
  { key: "artemis", id: ChatModelId.DRUMMER_ARTEMIS_31B },
  { key: "veniceRoleplay", id: ChatModelId.VENICE_UNCENSORED_ROLEPLAY },
  {
    key: "deepseekFlash",
    id: ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  },
  { key: "glmFlash", id: ChatModelId.GLM_5_3_FLASH_UNCENSORED },
  { key: "venice", id: ChatModelId.VENICE_UNCENSORED },
  { key: "minimaxFlash", id: ChatModelId.MINIMAX_M3_1_FLASH },
  { key: "kimi", id: ChatModelId.KIMI_K3 },
  { key: "sonnet", id: ChatModelId.CLAUDE_SONNET_5_5 },
];

type PickGroup = "dark" | "long" | "cheap" | "filtered";

const PICKS: readonly { key: PickGroup; models: readonly ModelKey[] }[] = [
  { key: "dark", models: ["uncensoredLm", "artemis"] },
  { key: "long", models: ["deepseekFlash", "artemis", "veniceRoleplay"] },
  { key: "cheap", models: ["minimaxFlash", "glmFlash", "venice"] },
  { key: "filtered", models: ["kimi", "sonnet"] },
];

/** Featured pairs (same URL order as the sitemap). */
const COMPARE_PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.VENICE_UNCENSORED_ROLEPLAY],
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.DRUMMER_ARTEMIS_31B],
  [
    ChatModelId.UNCENSORED_LM_V1_2,
    ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ],
];

const SETUP_STEPS: readonly (
  | "skill"
  | "variant"
  | "character"
  | "switch"
  | "art"
)[] = ["skill", "variant", "character", "switch", "art"];

type VariantKey = "creative" | "deep" | "uncensored";

const FAQ_KEYS: readonly (
  | "exists"
  | "free"
  | "nsfw"
  | "memory"
  | "private"
  | "account"
)[] = ["exists", "free", "nsfw", "memory", "private", "account"];

export interface RoleplayModelRow {
  key: ModelKey;
  id: ChatModelId;
  slug: string;
  name: string;
  content: typeof ContentLevelValue;
  contextWindow: number;
  contextPages: number;
  readsImages: boolean;
  creditsPerMessage: number;
  messagePrice: string;
  /** Replies one unit of currency buys. Null when free. */
  perUnit: number | null;
}

export interface RoleplayCompareLink {
  path: string;
  a: string;
  b: string;
}

export interface RoleplayVariant {
  key: VariantKey;
  modelName: string;
}

export interface RoleplayPostPageData {
  locale: CountryLanguage;
  rows: RoleplayModelRow[];
  variants: RoleplayVariant[];
  /** Locale-less compare page paths with both model names. */
  compares: RoleplayCompareLink[];
  unit: string;
  subPrice: string;
  subCredits: number;
  packPrice: string;
  packCredits: number;
}

/** Same rule as the model pages: 1 credit = 0.01 EUR in DE, else 0.01 USD. */
function creditCurrency(locale: CountryLanguage): Currencies {
  return getCountryFromLocale(locale) === "DE" ? "EUR" : "USD";
}

function isVariantKey(id: string): id is VariantKey {
  return id === "creative" || id === "deep" || id === "uncensored";
}

export async function tanstackLoader({
  params,
}: Props): Promise<RoleplayPostPageData> {
  const { locale } = await params;
  const currency = creditCurrency(locale);
  const products = productsRepository.getProducts(locale);
  const subscription = products[ProductIds.SUBSCRIPTION];
  const pack = products[ProductIds.CREDIT_PACK];
  const availability = await getEnvAvailability();
  const rows = MODELS.flatMap(({ key, id }) => {
    const facts = getModelFacts(id, availability);
    if (facts === null || facts.isLegacy) {
      return [];
    }
    return [
      {
        key,
        id,
        slug: facts.slug,
        name: facts.name,
        content: facts.content,
        contextWindow: facts.contextWindow,
        contextPages: facts.contextPages,
        readsImages: facts.inputs.includes("image"),
        creditsPerMessage: facts.creditsPerMessage,
        messagePrice: formatCurrency(
          facts.creditsPerMessage * CREDIT_VALUE_USD,
          currency,
          locale,
        ),
        perUnit: facts.messagesPerCurrencyUnit,
      },
    ];
  });
  const variants = roleplaySkillSkill.variants.flatMap((variant) => {
    const selection = variant.modelSelection;
    if (
      !isVariantKey(variant.id) ||
      selection.selectionType !== ModelSelectionType.MANUAL
    ) {
      return [];
    }
    return [
      {
        key: variant.id,
        modelName: chatModelDefinitions[selection.manualModelId].name,
      },
    ];
  });
  const compares = COMPARE_PAIRS.flatMap(([a, b]) => {
    const factsA = getModelFacts(a, availability);
    const factsB = getModelFacts(b, availability);
    if (factsA === null || factsB === null) {
      return [];
    }
    return [
      {
        path: `/models/compare/${factsA.slug}/${factsB.slug}`,
        a: factsA.name,
        b: factsB.name,
      },
    ];
  });
  return {
    locale,
    rows,
    variants,
    compares,
    unit: formatCurrency(1, currency, locale),
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
  return metadataGenerator(locale, {
    path: `story/blog/${SLUG}`,
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2068",
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
  row: RoleplayModelRow;
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
  variants,
  compares,
  unit,
  subPrice,
  subCredits,
  packPrice,
  packCredits,
}: RoleplayPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const { t: modelsT } = modelsScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const num = (value: number): string => formatNumber(value, locale);
  const byKey = new Map(rows.map((row) => [row.key, row]));

  const uncensoredRows = rows.filter(
    (r) => r.content === ContentLevel.UNCENSORED,
  );
  const cheapest = rows.toSorted(
    (a, b) => a.creditsPerMessage - b.creditsPerMessage,
  )[0];
  const cheapestUncensored = uncensoredRows.toSorted(
    (a, b) => a.creditsPerMessage - b.creditsPerMessage,
  )[0];
  const longest = rows.toSorted((a, b) => b.contextWindow - a.contextWindow)[0];
  const ownWorldview = byKey.get("uncensoredLm");
  const roleplayRow = byKey.get("veniceRoleplay");

  const stats = {
    appName,
    modelCount: rows.length,
    uncensoredCount: uncensoredRows.length,
    unit,
    creditValue: creditValueText(locale, modelsT),
    cheapestName: cheapest?.name ?? "",
    cheapestCredits: num(cheapest?.creditsPerMessage ?? 0),
    cheapestPrice: cheapest?.messagePrice ?? "",
    cheapestPerUnit: num(cheapest?.perUnit ?? 0),
    uncensoredName: cheapestUncensored?.name ?? "",
    uncensoredCredits: num(cheapestUncensored?.creditsPerMessage ?? 0),
    uncensoredPrice: cheapestUncensored?.messagePrice ?? "",
    uncensoredPerUnit: num(cheapestUncensored?.perUnit ?? 0),
    longestName: longest?.name ?? "",
    longestContext: formatTokenCount(longest?.contextWindow ?? 0),
    longestPages: num(longest?.contextPages ?? 0),
    ownName: ownWorldview?.name ?? "",
    ownContext: formatTokenCount(ownWorldview?.contextWindow ?? 0),
    ownPages: num(ownWorldview?.contextPages ?? 0),
    ownPrice: ownWorldview?.messagePrice ?? "",
    roleplayName: roleplayRow?.name ?? "",
    roleplayContext: formatTokenCount(roleplayRow?.contextWindow ?? 0),
    guestCredits: FREE_CREDIT_ALLOWANCE.guest,
    freeCredits: FREE_CREDIT_SIGNED_IN_TOTAL,
    subPrice,
    subCredits,
    packPrice,
    packCredits,
  };

  const variantModel = (key: VariantKey): string =>
    variants.find((v) => v.key === key)?.modelName ?? "";

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

        <ArticleSection id="exists" title={t("exists.title")}>
          <ArticleP>{t("exists.p1")}</ArticleP>
          <ArticleP>{t("exists.p2", stats)}</ArticleP>
          <Callout icon={AlertTriangle} tone="neutral">
            {t("exists.consent")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="levels"
          title={t("levels.title")}
          intro={t("levels.intro")}
        >
          <ArticleList
            items={[
              t("levels.mainstream"),
              t("levels.open"),
              t("levels.uncensored"),
            ]}
          />
          <ArticleP>{t("levels.twoKinds", stats)}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="table"
          title={t("table.title")}
          intro={t("table.intro", stats)}
        >
          <ArticleScroll>
            <Div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table className="min-w-[44rem]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {(
                      [
                        "colModel",
                        "colFilter",
                        "colMemory",
                        "colImages",
                        "colPrice",
                      ] as const
                    ).map((col) => (
                      <TableHead
                        key={col}
                        className="text-xs font-semibold uppercase tracking-wide"
                      >
                        {t(`table.${col}`)}
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
                          {t(`models.${row.key}`)}
                        </Span>
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {tierName(row.content, locale)}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums text-muted-foreground">
                        {t("table.memory", {
                          context: formatTokenCount(row.contextWindow),
                          pages: num(row.contextPages),
                        })}
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {row.readsImages ? t("table.yes") : t("table.no")}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums font-semibold text-foreground">
                        {row.messagePrice}
                        <Span className="block text-xs font-normal text-muted-foreground">
                          {t("table.credits", {
                            credits: num(row.creditsPerMessage),
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
        </ArticleSection>

        <ArticleSection
          id="picks"
          title={t("picks.title")}
          intro={t("picks.intro")}
        >
          {PICKS.map((group) => {
            const picked = group.models.flatMap((key) => {
              const row = byKey.get(key);
              return row ? [row] : [];
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
                    <ModelLink key={row.id} row={row} locale={locale} />
                  ))}
                />
              </Div>
            );
          })}
          <Div className="flex flex-col">
            {compares.map((link) => (
              <CardLink
                key={link.path}
                href={`/${locale}${link.path}`}
                label={t("picks.compareLink", { a: link.a, b: link.b })}
              />
            ))}
          </Div>
        </ArticleSection>

        <ArticleSection
          id="memory"
          title={t("memory.title")}
          intro={t("memory.intro")}
        >
          <ArticleP>{t("memory.p1", stats)}</ArticleP>
          <ArticleP>{t("memory.p2")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          id="setup"
          title={t("setup.title")}
          intro={t("setup.intro")}
        >
          <StepList>
            {SETUP_STEPS.map((step, index) => (
              <Step
                key={step}
                number={index + 1}
                title={t(`setup.steps.${step}.title`)}
                description={t(`setup.steps.${step}.body`, {
                  ...stats,
                  creative: variantModel("creative"),
                  deep: variantModel("deep"),
                  uncensored: variantModel("uncensored"),
                })}
              />
            ))}
          </StepList>
          <Div className="flex flex-col">
            <CardLink
              href={`/${locale}/skill/${ROLEPLAY_SKILL_ID}`}
              label={t("setup.skillLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/uncensored-ai-image-generator`}
              label={t("setup.imageLink")}
            />
          </Div>
        </ArticleSection>

        <ArticleSection
          id="privacy"
          title={t("privacy.title")}
          intro={t("privacy.intro")}
        >
          <ArticleList
            items={[
              t("privacy.incognito"),
              t("privacy.transit"),
              t("privacy.private"),
            ]}
          />
          <Callout icon={EyeOff} tone="neutral">
            {t("privacy.callout")}
          </Callout>
        </ArticleSection>

        <ArticleSection
          id="pricing"
          title={t("pricing.title")}
          intro={t("pricing.intro")}
        >
          <ArticleList
            items={[
              t("pricing.perReply", stats),
              t("pricing.cheapest", stats),
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
          id="characterai"
          title={t("characterAi.title")}
          intro={t("characterAi.intro")}
        >
          <ArticleList
            items={[
              t("characterAi.library"),
              t("characterAi.flatRate"),
              t("characterAi.wantFilter"),
            ]}
          />
          <Callout icon={Scale} tone="neutral">
            {t("characterAi.callout")}
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
              href={`/${locale}/story/blog/uncensored-models-what-each-is-good-at`}
              label={t("faq.guideLink")}
            />
            <CardLink
              href={`/${locale}/story/blog/chatgpt-alternative-without-filters`}
              label={t("faq.chatgptLink")}
            />
          </Div>
        </ArticleSection>

        <Callout icon={Wallet} tone="primary">
          <Span>{t("partners.body", stats)}</Span>{" "}
          <Link href={`/${locale}/story/partners`} className={LINK_CLASS}>
            {t("partners.link")}
          </Link>
        </Callout>

        <ArticleEnd
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle", stats)}
          actions={
            <>
              <Cta
                href={`/${locale}/skill/${ROLEPLAY_SKILL_ID}`}
                label={t("cta.start")}
                icon={Theater}
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

export default async function RoleplayWithoutFilterPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
