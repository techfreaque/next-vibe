/**
 * ModelsLab price fetcher.
 *
 * Prices come from the structured Inertia page data embedded in each model
 * detail page (`<div id="app" data-page="{...}">` on modelslab.com/models/<slug>),
 * never from the page's visible text: that text also carries subscription plan
 * prices ("$149/month Open Source Unlimited plan") and hand-written blurbs that
 * lag behind the billed price.
 *
 * `props.model` (the same record ModelsLab bills from):
 *   model_price_type "per_generation" → model_price = USD per image / clip / video
 *   model_price_type "per_second"     → model_price = USD per second
 *   model_price_type "multiplier"     → price_rules.base_price, scaled by
 *     price_rules.multipliers: a linear `duration` multiplier makes it USD per
 *     second; a `resolution` lookup ({"720p": 1, "1080p": 1.5}) gives per-tier
 *     prices (→ pricingByResolution).
 * `props.model_facts.price` ("$0.054 per image", "From $0.1 per second of
 * video") is the fallback when model_price_type is missing.
 *
 * Every parsed price passes a plausibility guard (plan prices listed on the
 * page, absolute USD caps, ratio to the current definition value); a value that
 * fails it is reported as a failure, never emitted.
 *
 * Settings (durations, resolutions, aspect ratios) come from each model's llms.txt,
 * which lists API parameters with types and allowed values.
 *
 * Maps providerModel → detail page URL slug via DETAIL_PAGE_SLUGS.
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { imageGenModelDefinitions } from "../../../image-generation/models";
import { musicGenModelDefinitions } from "../../../music-generation/models";
import { videoGenModelDefinitions } from "../../../video-generation/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult, SettingsUpdate } from "./base";
import { PriceFetcher } from "./base";

const BASE_URL = "https://modelslab.com/models";

/**
 * Maps providerModel → detail page URL slug (path after /models/).
 * The slug is the {provider}/{model-slug} portion of the detail page URL.
 *
 * To find a slug: go to modelslab.com/models, filter by use case,
 * and copy the URL path from the model card link.
 */
const DETAIL_PAGE_SLUGS: Record<string, string> = {
  // === Video: Text-to-Video ===
  "wan2.7-t2v": "alibaba_cloud/wan-2.7-text-to-video",
  "grok-t2v": "xai/grok-imagine-text-to-video",
  "ltx-2-pro-t2v": "ltx/ltx-2-pro-t2v",
  "seedance-1-5-pro": "byteplus/seedance-15-pro-text-to-video",
  "Hailuo-2.3-t2v": "minimax/Hailuo-2.3-text-to-video",
  "kling-v2-1-master-t2v": "klingai/kling-v2.1-master-t2v",
  "kling-v2-5-turbo-t2v": "klingai/kling-v2-5-turbo-t2v",
  "veo-3.1": "google/Veo-3.1",
  "veo-3.1-fast": "google/Veo-3.1-fast",
  "sora-2": "openai/sora-2-t2v",
  "kling-v3-t2v": "klingai/kling-v3.0-text-to-video",

  // === Video: Image-to-Video ===
  "wan2.6-i2v": "alibaba_cloud/wan-2.6-image-to-video",
  "wan2.6-i2v-flash": "alibaba_cloud/wan2.6-i2v-flash",
  "grok-i2v": "xai/grok-imagine-image-to-video",
  "ltx-2-3-pro-i2v": "ltx/ltx-2-3-pro-i2v",
  "Hailuo-2.3-i2v": "minimax/Hailuo-2.3-image-to-video",
  "Hailuo-2.3-Fast-i2v": "minimax/minimax-hailuo2.3-fast-image-to-video",
  "kling-v2-5-turbo-i2v": "klingai/Kling-V2-5-Turbo-image-to-video",
  "kling-v2-1-master-i2v": "klingai/kling-v2-1-master-image-to-video",
  "omni-human-1.5": "byteplus/omnihuman-1.5",
  "sora-2-pro-t2v": "openai/sora-2-pro-t2v",
  gen4_aleph: "runway_ml/gen4_aleph",
  "lipsync-2": "sync/lipsync-2",

  // === Image: Text-to-Image ===
  gen4_image_turbo: "runway_ml/gen4_image_turbo",
  gen4_image: "runway_ml/gen4_image",
  "wan-2.7-t2i": "alibaba_cloud/wan-2.7-text-to-image",
  "grok-t2i": "xai/grok-imagine-text-to-image",
  "z-image-base": "modelslab/z-image-base",
  "z-image-turbo": "modelslab/z-image-turbo",
  "flux-2-max": "bfl/flux-2-max-text-to-image",
  "flux-pro-1.1-ultra": "bfl/flux-pro-1.1-ultra-text-to-image",
  "flux-pro-1.1": "bfl/black-forest-labs-flux-pro-1.1",
  "flux-2-pro": "bfl/flux-2-pro-text-to-image",
  "seedream-4.5": "byteplus/seedream-45-text-to-image",
  "imagen-4.0-ultra": "google/text-to-image-ultra",
  "imagen-4.0": "google/text-to-image",
  "imagen-4.0-fast": "google/imagen-4.0-fast",
  "nano-banana-pro": "google/nano-banana-pro-text2image",
  "nano-banana": "google/banana-text-to-image",
  "qwen-t2i": "modelslab/qwen-text-to-image",
  "realtime-t2i": "modelslab/realtime-text-to-image",

  // === Music ===
  music_gen: "modelslab/music-generation",
  music_v1: "elevenlabs/music-generation",
  sonauto_song: "sonauto/music-gen",
  "lyria-3": "google/lyria-3",
};

/**
 * Plausibility caps in USD. ModelsLab per-generation prices are cents to low
 * dollars; anything above these is a misparse (e.g. a plan price), not a price.
 */
const MAX_USD_PER_IMAGE = 5;
const MAX_USD_PER_CLIP = 20;
const MAX_USD_PER_SECOND = 3;
/** A parsed price above this multiple of the current definition value is rejected */
const MAX_RATIO_TO_CURRENT = 4;

/** "0.054000" (DB decimal) or 0.054 */
const usdAmountSchema = z.union([
  z.number(),
  z
    .string()
    .regex(/^\d+(?:\.\d+)?$/)
    .transform(Number),
]);

const priceMultiplierSchema = z.object({
  type: z.string(),
  values: z.record(z.string(), z.number()).optional().catch(undefined),
});

const priceRulesSchema = z.object({
  base_price: z.number(),
  multipliers: z.record(z.string(), priceMultiplierSchema).optional(),
});

/** Inertia page props of a model detail page (only the fields read here) */
const detailPageSchema = z.object({
  props: z.object({
    model: z.object({
      model_id: z.string().nullish(),
      model_price: usdAmountSchema.nullish(),
      model_price_type: z.string().nullish(),
      // null, [] (no rules) or a rules object
      price_rules: priceRulesSchema.nullish().catch(null),
    }),
    model_facts: z.object({ price: z.string().nullish() }).nullish(),
  }),
});

type DetailPage = z.infer<typeof detailPageSchema>;

interface ParsedPrice {
  /** USD per second (for video/audio) or per generation (for image) */
  usdPrice: number;
  /** "per_second" or "per_generation" */
  priceType: "per_second" | "per_generation";
  /** USD per resolution tier ("720p" → 0.1), same unit as usdPrice */
  resolutionPricing?: Record<string, number>;
  /** The API model_id the page describes */
  pageModelId: string | null;
  /** Prices of subscription plans mentioned on the page ($/month, $/year) */
  planPricesUsd: ReadonlySet<number>;
}

type PriceParseResult =
  | { ok: true; price: ParsedPrice }
  | { ok: false; reason: string };

const NAMED_HTML_ENTITIES: Record<string, string> = {
  quot: '"',
  amp: "&",
  lt: "<",
  gt: ">",
  apos: "'",
  nbsp: " ",
};

/** Decode the HTML entities of an attribute value (&quot; &#039; &#x2F; ...) */
function decodeHtmlAttribute(value: string): string {
  return value.replaceAll(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
    (match: string, entity: string): string => {
      if (entity.startsWith("#")) {
        const isHex = entity[1] === "x" || entity[1] === "X";
        const codePoint = parseInt(
          entity.slice(isHex ? 2 : 1),
          isHex ? 16 : 10,
        );
        return Number.isInteger(codePoint) && codePoint <= 0x10ffff
          ? String.fromCodePoint(codePoint)
          : match;
      }
      return NAMED_HTML_ENTITIES[entity.toLowerCase()] ?? match;
    },
  );
}

/** Subscription plan prices the page mentions ("$149/month") */
function extractPlanPricesUsd(html: string): Set<number> {
  const prices = new Set<number>();
  for (const m of html.matchAll(
    /\$\s*(\d+(?:\.\d+)?)\s*\/\s*(?:month|mo|year|yr)\b/gi,
  )) {
    const price = parseFloat(m[1] ?? "");
    if (price > 0) {
      prices.add(price);
    }
  }
  return prices;
}

/** "$0.054 per image", "From $0.1 per second of video", "$0.05 per generation" */
function parseFactsPrice(
  factsPrice: string | null | undefined,
): Pick<ParsedPrice, "usdPrice" | "priceType"> | null {
  const m =
    /^\s*(?:from\s+)?\$(\d+(?:\.\d+)?)\s+per\s+(image|generation|video|clip|second)\b/i.exec(
      factsPrice ?? "",
    );
  if (!m) {
    return null;
  }
  const usdPrice = parseFloat(m[1] ?? "");
  if (!(usdPrice > 0)) {
    return null;
  }
  return {
    usdPrice,
    priceType:
      m[2]?.toLowerCase() === "second" ? "per_second" : "per_generation",
  };
}

/**
 * Resolution tiers from a price_rules `resolution` lookup. Only "720" / "720p" /
 * "720P" keys map to our resolution labels; pixel sizes ("1920x1080") are skipped.
 */
function parseResolutionTiers(
  basePrice: number,
  values: Record<string, number> | undefined,
): Record<string, number> | undefined {
  if (!values) {
    return undefined;
  }
  const tiers: Record<string, number> = {};
  for (const [key, multiplier] of Object.entries(values)) {
    const m = /^(\d{3,4})[pP]?$/.exec(key.trim());
    if (m && multiplier > 0) {
      tiers[`${m[1] ?? ""}p`] = basePrice * multiplier;
    }
  }
  return Object.keys(tiers).length > 1 ? tiers : undefined;
}

/** Read the price from the structured Inertia props of a detail page */
function parsePriceFromPageData(
  page: DetailPage,
  planPricesUsd: ReadonlySet<number>,
): PriceParseResult {
  const { model, model_facts: facts } = page.props;
  const pageModelId = model.model_id ?? null;
  const priceType = model.model_price_type;
  const modelPrice = model.model_price;

  if (
    (priceType === "per_generation" || priceType === "per_second") &&
    modelPrice !== null &&
    modelPrice !== undefined &&
    modelPrice > 0
  ) {
    return {
      ok: true,
      price: { usdPrice: modelPrice, priceType, pageModelId, planPricesUsd },
    };
  }

  if (priceType === "multiplier") {
    const rules = model.price_rules;
    if (!rules || !(rules.base_price > 0)) {
      return {
        ok: false,
        reason: `model_price_type "multiplier" without a usable price_rules.base_price`,
      };
    }
    const multipliers = rules.multipliers ?? {};
    return {
      ok: true,
      price: {
        usdPrice: rules.base_price,
        priceType:
          multipliers["duration"]?.type === "linear"
            ? "per_second"
            : "per_generation",
        resolutionPricing: parseResolutionTiers(
          rules.base_price,
          multipliers["resolution"]?.values,
        ),
        pageModelId,
        planPricesUsd,
      },
    };
  }

  const fromFacts = parseFactsPrice(facts?.price);
  if (fromFacts) {
    return {
      ok: true,
      price: { ...fromFacts, pageModelId, planPricesUsd },
    };
  }

  return {
    ok: false,
    reason: `no usable price in page data (model_price_type: ${String(priceType)}, model_price: ${String(modelPrice)}, model_facts.price: ${String(facts?.price)})`,
  };
}

/** Parse the price from a ModelsLab model detail page's embedded Inertia data */
function parsePriceFromDetailPage(html: string): PriceParseResult {
  const match = /\sdata-page="([^"]*)"/.exec(html);
  const encoded = match?.[1];
  if (!encoded) {
    return {
      ok: false,
      reason: "no Inertia data-page attribute (page layout changed)",
    };
  }
  let page: DetailPage;
  try {
    const parsed = detailPageSchema.safeParse(
      JSON.parse(decodeHtmlAttribute(encoded)),
    );
    if (!parsed.success) {
      return {
        ok: false,
        reason: `unexpected data-page shape: ${parsed.error.message}`,
      };
    }
    page = parsed.data;
  } catch (err) {
    return {
      ok: false,
      reason: `data-page is not valid JSON: ${parseError(err).message}`,
    };
  }
  return parsePriceFromPageData(page, extractPlanPricesUsd(html));
}

/**
 * Reject values that cannot be a per-generation / per-second price.
 * @param usdRaw - the price as parsed (before per-clip / per-second conversion)
 * @param usdValue - the price in the unit of `field`
 */
function implausiblePriceReason(params: {
  field: "creditCostPerImage" | "creditCostPerClip" | "creditCostPerSecond";
  usdRaw: number;
  usdValue: number;
  credits: number;
  currentCredits: number | undefined;
  planPricesUsd: ReadonlySet<number>;
}): string | null {
  const { field, usdRaw, usdValue, credits, currentCredits, planPricesUsd } =
    params;
  if (!(usdValue > 0) || !Number.isFinite(usdValue)) {
    return `parsed ${field} is not a positive number (${String(usdValue)} USD)`;
  }
  if (planPricesUsd.has(usdRaw) || planPricesUsd.has(usdValue)) {
    return `parsed $${String(usdRaw)} matches a subscription plan price on the page, not a per-generation price`;
  }
  const cap =
    field === "creditCostPerImage"
      ? MAX_USD_PER_IMAGE
      : field === "creditCostPerClip"
        ? MAX_USD_PER_CLIP
        : MAX_USD_PER_SECOND;
  if (usdValue > cap) {
    return `parsed ${field} $${String(usdValue)} exceeds the $${String(cap)} sanity cap`;
  }
  if (
    currentCredits !== undefined &&
    currentCredits > 0 &&
    credits > currentCredits * MAX_RATIO_TO_CURRENT
  ) {
    return `parsed ${field} ${String(credits)} credits is more than ${String(MAX_RATIO_TO_CURRENT)}x the current ${String(currentCredits)}`;
  }
  return null;
}

interface ParsedSettings {
  /** Duration options in seconds (e.g. [5, 10, 15]) */
  durations?: number[];
  /** Resolution options (e.g. ["720p", "1080p"]) */
  resolutions?: string[];
  /** Aspect ratio options (e.g. ["16:9", "9:16"]) */
  aspectRatios?: string[];
  /** The API takes an `init_image` parameter (image-to-video / image input) */
  acceptsInitImage?: boolean;
}

/**
 * Extract a parameter section from llms.txt text.
 * Looks for lines mentioning the parameter name and captures nearby text.
 */
function extractParamSection(text: string, paramName: string): string | null {
  // Match parameter name in various formats and capture text until next parameter or section
  const patterns = [
    // Table row: | param_name | type | values |
    new RegExp(`\\|\\s*\`?${paramName}\`?\\s*\\|([^\\n]+)`, "i"),
    // Markdown bold: **`param_name`** (type) or **param_name** ...
    new RegExp(`\\*\\*\`?${paramName}\`?\\*\\*[^\\n]*\\n?[^\\n]*`, "i"),
    // Plain text mention with values nearby
    new RegExp(
      `${paramName}[^\\n]*(?:options|values?|select|range)[^\\n]*`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match) {
      return match[0];
    }
  }
  return null;
}

/** Check if a string looks like a resolution value (not an aspect ratio) */
function isResolutionValue(s: string): boolean {
  const trimmed = s.trim().replaceAll(/[()]/g, "");
  // Valid resolution patterns: 720p, 1080p, 480P, FHD, 2K, 4K, HD
  return /^\d+[pP]$|^(?:FHD|HD|2K|4K|UHD|SD)$/i.test(trimmed);
}

/** Normalize resolution values: "720P" → "720p", keep named ones as-is */
function normalizeResolution(s: string): string {
  const trimmed = s.trim().replaceAll(/[()]/g, "");
  // Lowercase the 'p' suffix: "720P" → "720p"
  return trimmed.replace(/^(\d+)[pP]$/, "$1p");
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Convert pixel dimensions like "1280:720" to standard aspect ratios like "16:9" */
function normalizeAspectRatio(s: string): string {
  const match = /^(\d+):(\d+)$/.exec(s);
  if (!match) {
    return s;
  }
  const w = parseInt(match[1] ?? "0", 10);
  const h = parseInt(match[2] ?? "0", 10);
  // If both numbers are small (≤ 100), it's already a standard aspect ratio
  if (w <= 100 && h <= 100) {
    return s;
  }
  // Convert pixel dimensions to standard aspect ratios via GCD
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}

/**
 * Parse settings from a ModelsLab model's llms.txt page.
 * Extracts duration, resolution, and aspect_ratio parameter options.
 */
function parseSettingsFromLlmsTxt(text: string): ParsedSettings {
  const settings: ParsedSettings = {};

  // === Image input ===
  // Parameters are listed as "- **`init_image`** (required|optional): ...".
  // ModelsLab's img2video endpoint takes one init_image = the first frame.
  settings.acceptsInitImage = /^-\s*\*\*`init_image`\*\*/m.test(text);

  // === Duration ===
  const durSection = extractParamSection(text, "duration");
  if (durSection) {
    // Check for select options: "5, 10, 15" or "5s, 10s, 15s" or "4s, 8s, 12s"
    const selectNums = [...durSection.matchAll(/\b(\d{1,2})s?\b/g)]
      .map((m) => parseInt(m[1] ?? "0", 10))
      .filter((n) => n > 0 && n <= 60); // duration values are always <= 60 seconds

    if (selectNums.length > 0) {
      settings.durations = [...new Set(selectNums)].toSorted((a, b) => a - b);
    }
  }
  // Fallback: look for "duration" with range "1-15" or "1 to 15"
  if (!settings.durations) {
    const rangePattern =
      /duration[^.]*?(?:range\s*(?:of\s*)?|from\s+)(\d+)\s*(?:to|-)\s*(\d+)\s*(?:seconds?)?/i;
    const rangeMatch = rangePattern.exec(text);
    if (rangeMatch) {
      const min = parseInt(rangeMatch[1] ?? "0", 10);
      const max = parseInt(rangeMatch[2] ?? "0", 10);
      if (min > 0 && max > 0 && max <= 60) {
        settings.durations = [min, max];
      }
    }
  }

  // === Resolution ===
  const resSection = extractParamSection(text, "resolution");
  if (resSection) {
    // Extract tokens that look like resolutions
    const tokens = resSection
      .split(/[,|]/)
      .map(
        (s) => s.trim().replaceAll(/[()]/g, "").split(/\s/)[0]?.trim() ?? "",
      );
    const resValues = tokens.filter(isResolutionValue).map(normalizeResolution);
    if (resValues.length > 0) {
      settings.resolutions = [...new Set(resValues)];
    }
  }
  // Fallback: search broader text for "resolution" ... "720p, 1080p" pattern
  if (!settings.resolutions) {
    const resFallback =
      /resolution[^.]*?((?:\d+[pP]|FHD|HD|2K|4K)(?:\s*,\s*(?:\d+[pP]|FHD|HD|2K|4K))*)/i;
    const resFallbackMatch = resFallback.exec(text);
    if (resFallbackMatch) {
      const resStr = resFallbackMatch[1] ?? "";
      const resValues = resStr
        .split(",")
        .map((s) => s.trim())
        .filter(isResolutionValue)
        .map(normalizeResolution);
      if (resValues.length > 0) {
        settings.resolutions = [...new Set(resValues)];
      }
    }
  }

  // === Aspect Ratio ===
  const arSection = extractParamSection(text, "aspect_ratio");
  if (arSection) {
    const arValues = [...arSection.matchAll(/(\d+:\d+)/g)].map((m) =>
      normalizeAspectRatio(m[1] ?? ""),
    );
    if (arValues.length > 0) {
      settings.aspectRatios = [...new Set(arValues)];
    }
  }
  // Fallback: search broader text
  if (!settings.aspectRatios) {
    const arFallback = /aspect.?ratio[^.]*?((?:\d+:\d+)(?:\s*,\s*\d+:\d+)*)/i;
    const arFallbackMatch = arFallback.exec(text);
    if (arFallbackMatch) {
      const arStr = arFallbackMatch[1] ?? "";
      const arValues = [...arStr.matchAll(/(\d+:\d+)/g)].map((m) =>
        normalizeAspectRatio(m[1] ?? ""),
      );
      if (arValues.length > 0) {
        settings.aspectRatios = [...new Set(arValues)];
      }
    }
  }

  return settings;
}

type PageFetchResult =
  | { ok: true; text: string }
  | { ok: false; reason: string };

/** Fetch a URL with standard headers */
async function fetchPage(
  url: string,
  logger: EndpointLogger,
): Promise<PageFetchResult> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; unbottled-ai/1.0)",
      },
    });
    if (!response.ok) {
      logger.warn("ModelsLab page fetch failed", {
        url,
        status: response.status,
      });
      return {
        ok: false,
        reason:
          response.status === 404
            ? `${url} returned HTTP 404 (model removed or slug moved upstream)`
            : `${url} returned HTTP ${String(response.status)}`,
      };
    }
    return { ok: true, text: await response.text() };
  } catch (err) {
    const message = parseError(err).message;
    logger.warn("ModelsLab page fetch error", { url, error: message });
    return { ok: false, reason: `${url} fetch error: ${message}` };
  }
}

export class ModelslabPriceFetcher extends PriceFetcher {
  readonly providerName = "modelslab";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const settingsUpdates: SettingsUpdate[] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const allDefs = [
      ...Object.values(imageGenModelDefinitions),
      ...Object.values(videoGenModelDefinitions),
      ...Object.values(musicGenModelDefinitions),
    ];

    // Collect all ModelsLab provider configs to fetch
    const modelsLabConfigs: Array<{
      def: (typeof allDefs)[number];
      providerModel: string;
      id: string;
      isVideo: boolean;
      isAudio: boolean;
      isImage: boolean;
      defaultDurationSeconds: number;
      /** Current credit cost in the definition (plausibility baseline) */
      currentCredits: number | undefined;
    }> = [];

    for (const def of allDefs) {
      for (const providerConfig of def.providers) {
        if (providerConfig.apiProvider !== ApiProvider.MODELSLAB) {
          continue;
        }
        const isVideo = "creditCostPerSecond" in providerConfig;
        const isAudio = "creditCostPerClip" in providerConfig;
        const isImage = "creditCostPerImage" in providerConfig;
        if (!isVideo && !isAudio && !isImage) {
          continue;
        }
        modelsLabConfigs.push({
          def,
          providerModel: providerConfig.providerModel,
          id: providerConfig.id,
          isVideo,
          isAudio,
          isImage,
          defaultDurationSeconds:
            "defaultDurationSeconds" in providerConfig
              ? (providerConfig.defaultDurationSeconds ?? 0)
              : 0,
          currentCredits:
            "creditCostPerSecond" in providerConfig
              ? providerConfig.creditCostPerSecond
              : "creditCostPerClip" in providerConfig
                ? providerConfig.creditCostPerClip
                : "creditCostPerImage" in providerConfig
                  ? providerConfig.creditCostPerImage
                  : undefined,
        });
      }
    }

    const configuredProviderModels = new Set(Object.keys(DETAIL_PAGE_SLUGS));

    // De-duplicate fetches by slug
    const slugToPrice = new Map<string, PriceParseResult>();
    const slugToSettings = new Map<string, ParsedSettings | null>();
    let modelsFound = 0;

    for (const config of modelsLabConfigs) {
      const slug = DETAIL_PAGE_SLUGS[config.providerModel];
      if (!slug) {
        failures.push({
          modelId: config.id,
          provider: ApiProvider.MODELSLAB,
          reason: `No detail page slug configured for providerModel "${config.providerModel}". Add it to DETAIL_PAGE_SLUGS in modelslab.ts`,
        });
        continue;
      }

      const detailUrl = `${BASE_URL}/${slug}`;

      // Fetch detail page + llms.txt (cached per slug)
      let priceResult = slugToPrice.get(slug);
      if (!priceResult) {
        const llmsUrl = `${detailUrl}/llms.txt`;

        const detailPage = await fetchPage(detailUrl, logger);
        priceResult = detailPage.ok
          ? parsePriceFromDetailPage(detailPage.text)
          : detailPage;
        slugToPrice.set(slug, priceResult);
        if (priceResult.ok) {
          modelsFound++;
        } else if (detailPage.ok) {
          logger.warn("Could not parse price from detail page", {
            slug,
            url: detailUrl,
            reason: priceResult.reason,
          });
        }

        // Fetch llms.txt for settings
        const llmsPage = await fetchPage(llmsUrl, logger);
        slugToSettings.set(
          slug,
          llmsPage.ok ? parseSettingsFromLlmsTxt(llmsPage.text) : null,
        );
      }

      if (!priceResult.ok) {
        failures.push({
          modelId: config.id,
          provider: ApiProvider.MODELSLAB,
          reason: `No price for "${config.providerModel}" (slug: "${slug}"): ${priceResult.reason}`,
        });
        continue;
      }
      const parsed = priceResult.price;

      // A slug that now redirects to a sibling model's page (e.g. a retired
      // model folded into its successor) must not price this model.
      if (
        parsed.pageModelId !== null &&
        parsed.pageModelId !== config.providerModel &&
        configuredProviderModels.has(parsed.pageModelId)
      ) {
        failures.push({
          modelId: config.id,
          provider: ApiProvider.MODELSLAB,
          reason: `Detail page for "${config.providerModel}" (slug: "${slug}") now describes "${parsed.pageModelId}"; the model was likely retired or renamed upstream`,
        });
        continue;
      }

      // === Price updates ===
      // Convert the parsed price into the unit of the definition's cost field.
      const videoDuration = config.defaultDurationSeconds || 5;
      const audioDuration = config.defaultDurationSeconds || 30;
      const toFieldUsd = (usd: number): number => {
        if (config.isVideo) {
          return parsed.priceType === "per_generation"
            ? usd / videoDuration
            : usd;
        }
        if (config.isAudio && parsed.priceType === "per_second") {
          return usd * audioDuration;
        }
        return usd;
      };
      const field = config.isImage
        ? "creditCostPerImage"
        : config.isVideo
          ? "creditCostPerSecond"
          : "creditCostPerClip";
      const usdValue = toFieldUsd(parsed.usdPrice);
      const credits = this.usdToCredits(usdValue);

      const implausible = implausiblePriceReason({
        field,
        usdRaw: parsed.usdPrice,
        usdValue,
        credits,
        currentCredits: config.currentCredits,
        planPricesUsd: parsed.planPricesUsd,
      });
      if (implausible) {
        logger.warn("Rejected implausible ModelsLab price", {
          providerModel: config.providerModel,
          url: detailUrl,
          reason: implausible,
        });
        failures.push({
          modelId: config.id,
          provider: ApiProvider.MODELSLAB,
          reason: `Rejected price for "${config.providerModel}" (slug: "${slug}"): ${implausible}`,
        });
        continue;
      }

      updates.push({
        modelId: config.id,
        name: config.def.name,
        provider: ApiProvider.MODELSLAB,
        field,
        value: credits,
        source: detailUrl,
        providerModel: config.providerModel,
      });

      // Resolution-based pricing → pricingByResolution (video only)
      if (config.isVideo && parsed.resolutionPricing) {
        const pricingObj: Record<string, number> = {};
        for (const [res, usd] of Object.entries(parsed.resolutionPricing)) {
          pricingObj[normalizeResolution(res)] = this.usdToCredits(
            toFieldUsd(usd),
          );
        }
        settingsUpdates.push({
          providerModel: config.providerModel,
          field: "pricingByResolution",
          tsLiteral: JSON.stringify(pricingObj).replaceAll(",", ", "),
          source: detailUrl,
        });
      }

      // === Settings updates from llms.txt ===
      const settings = slugToSettings.get(slug);
      if (settings && (config.isVideo || config.isImage || config.isAudio)) {
        const llmsUrl = `${detailUrl}/llms.txt`;

        // Duration settings - video and audio models
        if (
          (config.isVideo || config.isAudio) &&
          settings.durations &&
          settings.durations.length > 0
        ) {
          const durStrings = settings.durations.map((d) => `"${String(d)}"`);
          settingsUpdates.push({
            providerModel: config.providerModel,
            field: "supportedDurations",
            tsLiteral: `[${durStrings.join(", ")}]`,
            source: llmsUrl,
          });

          const maxDur = Math.max(...settings.durations);
          const minDur = Math.min(...settings.durations);
          if (config.isVideo) {
            settingsUpdates.push({
              providerModel: config.providerModel,
              field: "maxDurationSeconds",
              tsLiteral: String(maxDur),
              source: llmsUrl,
            });
          }
          settingsUpdates.push({
            providerModel: config.providerModel,
            field: "minDurationSeconds",
            tsLiteral: String(minDur),
            source: llmsUrl,
          });
        }

        // Resolution settings - video only
        if (
          config.isVideo &&
          settings.resolutions &&
          settings.resolutions.length > 0
        ) {
          const resStrings = settings.resolutions.map((r) => `"${r}"`);
          settingsUpdates.push({
            providerModel: config.providerModel,
            field: "supportedResolutions",
            tsLiteral: `[${resStrings.join(", ")}]`,
            source: llmsUrl,
          });
        }

        // Image input - video only. Written as supportedFrameImages so the
        // route-level signal matches OpenRouter's; the price updater derives
        // the model's `inputs` from it (any image-capable route => "image").
        if (config.isVideo && settings.acceptsInitImage) {
          settingsUpdates.push({
            providerModel: config.providerModel,
            field: "supportedFrameImages",
            tsLiteral: '["first_frame"]',
            source: llmsUrl,
          });
        }

        // Aspect ratios - shared between video and image models
        if (settings.aspectRatios && settings.aspectRatios.length > 0) {
          const arStrings = settings.aspectRatios.map((r) => `"${r}"`);
          settingsUpdates.push({
            providerModel: config.providerModel,
            field: "supportedAspectRatios",
            tsLiteral: `[${arStrings.join(", ")}]`,
            source: llmsUrl,
          });
        }
      }
    }

    // Not a single page yielded a price: ModelsLab is down or changed its page
    // layout. Flag the provider as unverifiable so its models are not disabled.
    const providerDown = modelsLabConfigs.length > 0 && modelsFound === 0;

    return {
      provider: this.providerName,
      modelsFound,
      modelsUpdated: updates.length,
      updates,
      settingsUpdates,
      failures,
      ...(providerDown
        ? {
            error:
              "No ModelsLab detail page yielded a price (site down or page layout changed)",
            failedApiProviders: [ApiProvider.MODELSLAB],
          }
        : {}),
    };
  }
}
