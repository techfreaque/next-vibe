/**
 * Blog post: every AI video generator on the platform compared, from the
 * model registry.
 * /[locale]/story/blog/ai-video-generators-compared
 *
 * Models, inputs, frame control, clip lengths, resolutions, audio and prices
 * are read from src/vibe/agent/video-generation/models.ts with the same
 * route resolution and billing math the generator uses. Nothing numeric is
 * hardcoded in copy.
 */

import type { Metadata } from "next";
import {
  type AgentEnvAvailability,
  getEnvAvailability,
} from "next-vibe/agent/env-availability";
import {
  ApiProvider,
  type ModelProviderConfig,
  type ModelProviderConfigVideoBased,
  roundMediaCost,
} from "next-vibe/agent/models/models";
import { ModelSelectionType } from "next-vibe/agent/skills/enum";
import {
  DEFAULT_VIDEO_DURATION_SECONDS,
  DEFAULT_VIDEO_GEN_MODEL_SELECTION,
} from "next-vibe/agent/video-generation/constants";
import {
  getVideoGenModelById,
  resolveVideoClipSeconds,
  resolveVideoGenRouteForImageInput,
  videoGenModelDefinitions,
  VideoGenModelId,
  type VideoGenModelOption,
} from "next-vibe/agent/video-generation/models";
import type {
  CountryLanguage,
  Currencies,
} from "next-vibe/core/i18n/core/config";
import { getCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { formatCurrency } from "next-vibe/core/i18n/core/localization-utils";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Video } from "next-vibe/ui/components/icons/Video";
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
import { formatNumber } from "@/_pages/models/_shared/model-format";
import { listMediaFacts } from "@/_pages/models/_shared/model-media-facts";
import { configScopedTranslation } from "@/env/i18n";
import {
  CREDIT_VALUE_USD,
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
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

const SLUG = "ai-video-generators-compared";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/** One current (non-legacy) video model, as the generator would run it. */
export interface VideoModelRow {
  id: VideoGenModelId;
  slug: string;
  name: string;
  lab: string;
  /** Any route takes a reference image (image-to-video). */
  imageToVideo: boolean;
  /** Any route edits existing footage (video-to-video, lip sync). */
  videoInput: boolean;
  /** Any route takes an audio track to sync the footage to. */
  audioInput: boolean;
  firstFrame: boolean;
  lastFrame: boolean;
  audio: boolean;
  minSeconds: number;
  maxSeconds: number;
  resolutions: string[];
  /** Charged credits per second (markup included), default resolution. */
  creditsPerSecond: number;
  /** Charged credits per second when an image moves the job to another route. */
  imageCreditsPerSecond: number | null;
  /** Charged credits per second for each priced resolution. */
  byResolution: { resolution: string; credits: number }[];
  /** Seconds a request with no explicit length runs at on this route. */
  clipSeconds: number;
  clipCredits: number;
  clipPrice: string;
}

export interface VideoPostPageData {
  locale: CountryLanguage;
  rows: VideoModelRow[];
  labCount: number;
  legacyCount: number;
  defaultModelName: string;
  subPrice: string;
  subCredits: number;
  packPrice: string;
  packCredits: number;
}

type PickGroup = "quality" | "budget" | "long" | "frames" | "audio" | "editing";

/** Picks per job. Only rows that exist (and match the group's rule) render. */
const PICKS: readonly {
  key: PickGroup;
  models: readonly VideoGenModelId[];
  keep: (row: VideoModelRow) => boolean;
}[] = [
  {
    key: "quality",
    models: [
      VideoGenModelId.VEO_3_1,
      VideoGenModelId.SEEDANCE_2_5,
      VideoGenModelId.SORA_2_PRO,
      VideoGenModelId.HAILUO_3,
      VideoGenModelId.RUNWAY_GEN_4_5,
    ],
    keep: () => true,
  },
  {
    key: "budget",
    models: [
      VideoGenModelId.GROK_IMAGINE_VIDEO_1_5_LITE,
      VideoGenModelId.HAILUO_2_3_FAST_I2V,
      VideoGenModelId.KLING_V2_5_TURBO_T2V,
      VideoGenModelId.SEEDANCE_2_MINI,
      VideoGenModelId.VEO_3_1_LITE,
    ],
    keep: () => true,
  },
  {
    key: "long",
    models: [
      VideoGenModelId.WAN_3_0,
      VideoGenModelId.SEEDANCE_2_5,
      VideoGenModelId.KLING_V3_STD_T2V,
      VideoGenModelId.GROK_IMAGINE_VIDEO_1_5,
      VideoGenModelId.GEMINI_OMNI_1_2_FLASH,
    ],
    keep: (row) => row.maxSeconds >= 15,
  },
  {
    key: "frames",
    models: [
      VideoGenModelId.KLING_V3_STD_T2V,
      VideoGenModelId.VEO_3_1_FAST,
      VideoGenModelId.WAN_3_0,
      VideoGenModelId.GEMINI_OMNI_1_2_FLASH,
      VideoGenModelId.SEEDANCE_2_FAST,
      VideoGenModelId.HAILUO_3_MAX,
    ],
    keep: (row) => row.firstFrame && row.lastFrame,
  },
  {
    key: "audio",
    models: [
      VideoGenModelId.VEO_3_1,
      VideoGenModelId.SEEDANCE_2,
      VideoGenModelId.KLING_VIDEO_O1,
      VideoGenModelId.WAN_3_0,
      VideoGenModelId.VEO_3_1_FAST,
    ],
    keep: (row) => row.audio,
  },
  {
    key: "editing",
    models: [
      VideoGenModelId.OMNIHUMAN_1_5,
      VideoGenModelId.LIPSYNC_2,
      VideoGenModelId.GEN4_ALEPH,
    ],
    keep: () => true,
  },
];

type VersusKey = "klingSeedance" | "veoSora" | "hailuoWan" | "grokGemini";

/** Head-to-heads people search for. */
const VERSUS: readonly {
  key: VersusKey;
  a: VideoGenModelId;
  b: VideoGenModelId;
}[] = [
  {
    key: "klingSeedance",
    a: VideoGenModelId.KLING_V3_STD_T2V,
    b: VideoGenModelId.SEEDANCE_2,
  },
  { key: "veoSora", a: VideoGenModelId.VEO_3_1, b: VideoGenModelId.SORA_2 },
  { key: "hailuoWan", a: VideoGenModelId.HAILUO_3, b: VideoGenModelId.WAN_3_0 },
  {
    key: "grokGemini",
    a: VideoGenModelId.GROK_IMAGINE_VIDEO_1_5,
    b: VideoGenModelId.GEMINI_OMNI_1_2_FLASH,
  },
];

const CHAT_STEPS: readonly (
  | "ask"
  | "model"
  | "image"
  | "lastFrame"
  | "result"
)[] = ["ask", "model", "image", "lastFrame", "result"];

const FAQ_KEYS: readonly (
  | "best"
  | "klingVsSeedance"
  | "imageToVideo"
  | "watermark"
  | "cost"
  | "free"
  | "length"
  | "uncensored"
)[] = [
  "best",
  "klingVsSeedance",
  "imageToVideo",
  "watermark",
  "cost",
  "free",
  "length",
  "uncensored",
];

function isVideoRoute(
  provider: ModelProviderConfig,
): provider is ModelProviderConfigVideoBased {
  return (
    "creditCostPerSecond" in provider &&
    provider.creditCostPerSecond !== undefined &&
    "defaultDurationSeconds" in provider &&
    provider.defaultDurationSeconds !== undefined
  );
}

/** What the user is charged per second: provider rate plus the standard markup. */
function chargedPerSecond(providerCredits: number): number {
  return providerCredits * (1 + STANDARD_MARKUP_PERCENTAGE);
}

/**
 * Shortest and longest clip a request can actually get on this route: the
 * generator clamps then snaps every requested length (resolveVideoClipSeconds).
 * A route that lists no lengths runs at the requested default.
 */
function secondsRange(
  option: VideoGenModelOption,
  clipSeconds: number,
): { min: number; max: number } {
  const listed = (option.supportedDurations?.length ?? 0) > 0;
  if (!listed && option.maxDurationSeconds === undefined) {
    return { min: clipSeconds, max: clipSeconds };
  }
  return {
    min: resolveVideoClipSeconds(option, 1),
    max: resolveVideoClipSeconds(option, Number.MAX_SAFE_INTEGER),
  };
}

function buildRow(
  id: VideoGenModelId,
  locale: CountryLanguage,
  currency: Currencies,
  availability: AgentEnvAvailability,
): VideoModelRow | null {
  const def = videoGenModelDefinitions[id];
  const facts = listMediaFacts(availability).find(
    (f) => f.type === "video" && f.modelId === id,
  );
  const option = getVideoGenModelById(id);
  if (!facts || facts.isLegacy || !option) {
    return null;
  }
  // Capabilities come from the model's own public routes; the UNBOTTLED route
  // forwards to another instance and reports nothing of its own.
  const routes = def.providers
    .filter(isVideoRoute)
    .filter(
      (p) => p.apiProvider !== ApiProvider.UNBOTTLED && p.adminOnly !== true,
    );
  const frames = new Set(routes.flatMap((p) => p.supportedFrameImages ?? []));
  const imageRoute = resolveVideoGenRouteForImageInput(option);
  const imageCreditsPerSecond =
    imageRoute && imageRoute.id === id && imageRoute !== option
      ? chargedPerSecond(imageRoute.creditCostPerSecond)
      : null;
  const clipSeconds = resolveVideoClipSeconds(
    option,
    DEFAULT_VIDEO_DURATION_SECONDS,
  );
  const clipCredits = roundMediaCost(
    chargedPerSecond(option.creditCostPerSecond) * clipSeconds,
  );
  const range = secondsRange(option, clipSeconds);
  return {
    id,
    slug: facts.slug,
    name: def.name,
    lab: facts.labName,
    imageToVideo: facts.inputs.includes("image"),
    videoInput: facts.inputs.includes("video"),
    audioInput: facts.inputs.includes("audio"),
    firstFrame: frames.has("first_frame"),
    lastFrame: frames.has("last_frame"),
    audio: routes.some((p) => p.generateAudio === true),
    minSeconds: range.min,
    maxSeconds: range.max,
    resolutions: [...(option.supportedResolutions ?? [])],
    creditsPerSecond: chargedPerSecond(option.creditCostPerSecond),
    imageCreditsPerSecond,
    byResolution: Object.entries(option.pricingByResolution ?? {}).flatMap(
      ([resolution, credits]) =>
        credits === undefined
          ? []
          : [{ resolution, credits: chargedPerSecond(credits) }],
    ),
    clipSeconds,
    clipCredits,
    clipPrice: formatCurrency(clipCredits * CREDIT_VALUE_USD, currency, locale),
  };
}

/** Same rule as the model pages: 1 credit = 0.01 EUR in DE, else 0.01 USD. */
function creditCurrency(locale: CountryLanguage): Currencies {
  return getCountryFromLocale(locale) === "DE" ? "EUR" : "USD";
}

export async function tanstackLoader({
  params,
}: Props): Promise<VideoPostPageData> {
  const { locale } = await params;
  const availability = await getEnvAvailability();
  const products = productsRepository.getProducts(locale);
  const subscription = products[ProductIds.SUBSCRIPTION];
  const pack = products[ProductIds.CREDIT_PACK];
  const rows = Object.values(VideoGenModelId)
    .flatMap((id) => {
      const row = buildRow(id, locale, creditCurrency(locale), availability);
      return row ? [row] : [];
    })
    .toSorted((a, b) => a.creditsPerSecond - b.creditsPerSecond);
  const legacyCount = listMediaFacts(availability).filter(
    (f) => f.type === "video" && f.isLegacy,
  ).length;
  const defaultId =
    DEFAULT_VIDEO_GEN_MODEL_SELECTION.selectionType ===
    ModelSelectionType.MANUAL
      ? DEFAULT_VIDEO_GEN_MODEL_SELECTION.manualModelId
      : VideoGenModelId.VEO_3_1;
  return {
    locale,
    rows,
    labCount: new Set(rows.map((r) => r.lab)).size,
    legacyCount,
    defaultModelName: videoGenModelDefinitions[defaultId].name,
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
  return metadataGenerator(locale, {
    path: `story/blog/${SLUG}`,
    title: t("meta.title", { appName, modelCount }),
    category: t("meta.category"),
    description: t("meta.description", { appName, modelCount }),
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071",
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
  row: VideoModelRow;
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
  legacyCount,
  defaultModelName,
  subPrice,
  subCredits,
  packPrice,
  packCredits,
}: VideoPostPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const num = (value: number): string => formatNumber(value, locale);
  const byId = new Map(rows.map((row) => [row.id, row]));

  const modelCount = rows.length;
  const cheapest = rows[0];
  const priciest = rows.at(-1);
  const cheapestClip = rows.toSorted(
    (a, b) => a.clipCredits - b.clipCredits,
  )[0];
  const priciestClip = rows
    .toSorted((a, b) => a.clipCredits - b.clipCredits)
    .at(-1);
  const longest = rows.toSorted((a, b) => b.maxSeconds - a.maxSeconds)[0];
  const stats = {
    appName,
    modelCount,
    labCount,
    legacyCount,
    i2vCount: rows.filter((r) => r.imageToVideo).length,
    lastFrameCount: rows.filter((r) => r.lastFrame).length,
    audioCount: rows.filter((r) => r.audio).length,
    minRate: num(cheapest?.creditsPerSecond ?? 0),
    maxRate: num(priciest?.creditsPerSecond ?? 0),
    cheapestName: cheapest?.name ?? "",
    priciestName: priciest?.name ?? "",
    cheapestClipName: cheapestClip?.name ?? "",
    cheapestClipCredits: num(cheapestClip?.clipCredits ?? 0),
    cheapestClipPrice: cheapestClip?.clipPrice ?? "",
    priciestClipName: priciestClip?.name ?? "",
    priciestClipCredits: num(priciestClip?.clipCredits ?? 0),
    priciestClipPrice: priciestClip?.clipPrice ?? "",
    longestName: longest?.name ?? "",
    longestSeconds: longest?.maxSeconds ?? 0,
    seconds: DEFAULT_VIDEO_DURATION_SECONDS,
    markup: Math.round(STANDARD_MARKUP_PERCENTAGE * 100),
    creditValue: formatCurrency(
      CREDIT_VALUE_USD,
      creditCurrency(locale),
      locale,
    ),
    defaultModel: defaultModelName,
    subPrice,
    subCredits,
    packPrice,
    packCredits,
  };

  const inputText = (row: VideoModelRow): string =>
    row.videoInput
      ? row.audioInput
        ? t("table.videoAudio")
        : t("table.v2v")
      : row.imageToVideo
        ? t("table.i2v")
        : t("table.t2v");
  const framesText = (row: VideoModelRow): string =>
    row.firstFrame && row.lastFrame
      ? t("table.framesFirstLast")
      : row.firstFrame
        ? t("table.framesFirst")
        : t("table.framesNone");
  const resText = (row: VideoModelRow): string =>
    row.resolutions.length > 0
      ? row.resolutions.join(", ")
      : t("table.resolutionDefault");
  const factLine = (row: VideoModelRow): string =>
    t("picks.factLine", {
      rate: num(row.creditsPerSecond),
      min: row.minSeconds,
      max: row.maxSeconds,
      resolution: resText(row),
      audio: row.audio ? t("table.audioYes") : t("table.audioNo"),
      frames: framesText(row),
    });

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        post={{ slug: SLUG, locale }}
        title={t("hero.title", stats)}
        subtitle={t("hero.subtitle", stats)}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.lead")}</ArticleLead>
          <ArticleP>{t("intro.p2", stats)}</ArticleP>
        </Div>

        <ArticleSection
          id="table"
          title={t("table.title", stats)}
          intro={t("table.intro", stats)}
        >
          <ArticleScroll>
            <Div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table className="min-w-[48rem]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {(
                      [
                        "colModel",
                        "colInput",
                        "colFrames",
                        "colLength",
                        "colResolution",
                        "colAudio",
                        "colRate",
                        "colClip",
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
                        {inputText(row)}
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {framesText(row)}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums text-muted-foreground">
                        {row.minSeconds === row.maxSeconds
                          ? t("table.secondsFixed", { max: row.maxSeconds })
                          : t("table.seconds", {
                              min: row.minSeconds,
                              max: row.maxSeconds,
                            })}
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {resText(row)}
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {row.audio ? t("table.audioYes") : t("table.audioNo")}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums text-foreground">
                        {num(row.creditsPerSecond)}
                        {row.imageCreditsPerSecond !== null && (
                          <Span className="block text-xs text-muted-foreground">
                            {t("table.withImage", {
                              credits: num(row.imageCreditsPerSecond),
                            })}
                          </Span>
                        )}
                        {row.byResolution.length > 1 && (
                          <Span className="block text-xs text-muted-foreground">
                            {row.byResolution
                              .map((r) => `${r.resolution} ${num(r.credits)}`)
                              .join(" · ")}
                          </Span>
                        )}
                      </TableCell>
                      <TableCell className="align-top text-sm tabular-nums font-semibold text-foreground">
                        {row.clipPrice}
                        <Span className="block text-xs font-normal text-muted-foreground">
                          {t("table.clipValue", {
                            credits: num(row.clipCredits),
                            seconds: row.clipSeconds,
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
          <CardLink
            href={`/${locale}/models`}
            label={t("table.allModels", stats)}
          />
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
          id="versus"
          title={t("versus.title")}
          intro={t("versus.intro")}
        >
          {VERSUS.map((pair) => {
            const a = byId.get(pair.a);
            const b = byId.get(pair.b);
            if (!a || !b) {
              return null;
            }
            return (
              <Div key={pair.key} className="flex flex-col gap-3">
                <ArticleH3>
                  {t("versus.pairTitle", { a: a.name, b: b.name })}
                </ArticleH3>
                <ArticleP>
                  {t(`versus.${pair.key}`, {
                    a: a.name,
                    b: b.name,
                    aRate: num(a.creditsPerSecond),
                    bRate: num(b.creditsPerSecond),
                    aMax: a.maxSeconds,
                    bMax: b.maxSeconds,
                  })}
                </ArticleP>
                <ArticleList
                  items={[a, b].map((row) => (
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
          <Callout icon={Scale} tone="neutral">
            {t("versus.verdict", stats)}
          </Callout>
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
          <ArticleP>{t("chat.toolPage", stats)}</ArticleP>
          <CardLink
            href={createHref(locale, "video")}
            label={t("chat.toolLink")}
          />
        </ArticleSection>

        <ArticleSection
          id="pricing"
          title={t("pricing.title")}
          intro={t("pricing.intro", stats)}
        >
          <ArticleList
            items={[
              t("pricing.perSecond", stats),
              t("pricing.cheapest", stats),
              t("pricing.priciest", stats),
              t("pricing.resolution", stats),
              t("pricing.failed", stats),
              t("pricing.reported", stats),
            ]}
          />
          <ArticleList
            items={[t("pricing.sub", stats), t("pricing.pack", stats)]}
          />
          <CardLink
            href={`/${locale}/subscription/overview`}
            label={t("pricing.link")}
          />
        </ArticleSection>

        <ArticleSection
          id="watermark"
          title={t("watermark.title")}
          intro={t("watermark.intro", stats)}
        >
          <ArticleList
            items={[
              t("watermark.ours", stats),
              t("watermark.provenance", stats),
              t("watermark.storage", stats),
            ]}
          />
        </ArticleSection>

        <ArticleSection
          id="limits"
          title={t("limits.title")}
          intro={t("limits.intro", stats)}
        >
          <ArticleList
            items={[
              t("limits.time", stats),
              t("limits.cost", stats),
              t("limits.filters", stats),
              t("limits.chatControls", stats),
              t("limits.snap", stats),
              t("limits.legacy", stats),
            ]}
          />
          <Callout icon={AlertTriangle} tone="warning">
            {t("limits.callout", stats)}
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
              href={`/${locale}/models`}
              label={t("faq.modelsLink", stats)}
            />
            <CardLink
              href={`/${locale}/subscription/overview`}
              label={t("faq.pricingLink")}
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
          post={{ slug: SLUG, locale }}
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle", stats)}
          actions={
            <>
              <Cta
                href={createHref(locale, "video")}
                label={t("cta.generate")}
                icon={Video}
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

export default async function VideoGeneratorsPostPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
