/**
 * ModelsLab price fetcher.
 *
 * Scrapes pricing data from individual model detail pages on modelslab.com,
 * and settings (durations, resolutions, aspect ratios) from each model's llms.txt.
 *
 * Detail pages show prices in text like:
 *   "Cost for 720P: $0.10/second, 1080P: $0.15/second"
 *   "Per second video generation will cost $0.48"
 *   "Per image generation will cost 0.088$"
 *
 * llms.txt files list API parameters with types and allowed values.
 *
 * Maps providerModel → detail page URL slug via DETAIL_PAGE_SLUGS.
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
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
  "lipsync-2": "byteplus/lipsync-2",

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

interface ParsedPrice {
  /** USD per second (for video/audio) or per generation (for image) */
  usdPrice: number;
  /** "per_second" or "per_generation" */
  priceType: "per_second" | "per_generation";
  /** If resolution-based pricing exists, lowest tier price is used as base */
  resolutionPricing?: Record<string, number>;
}

interface ParsedSettings {
  /** Duration options in seconds (e.g. [5, 10, 15]) */
  durations?: number[];
  /** Resolution options (e.g. ["720p", "1080p"]) */
  resolutions?: string[];
  /** Aspect ratio options (e.g. ["16:9", "9:16"]) */
  aspectRatios?: string[];
}

/**
 * Parse pricing text from a ModelsLab model detail page.
 */
function parsePriceFromDetailPage(html: string): ParsedPrice | null {
  const text = html
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/<[^>]+>/g, " ");

  // Pattern 1: Resolution-based pricing "Cost for 720P: $0.10/second, 1080P: $0.15/second"
  const resolutionPattern =
    /(\d+[Pp]|FHD|2K|4K|HD|480[Pp])[\s:]*\$?([\d.]+)\/?(?:second|sec)/gi;
  const resMatches = [...text.matchAll(resolutionPattern)];
  if (resMatches.length > 0) {
    const resolutionPricing: Record<string, number> = {};
    let minPrice = Infinity;
    for (const m of resMatches) {
      const resolution = m[1] ?? "";
      const price = parseFloat(m[2] ?? "0");
      if (!isNaN(price) && price > 0) {
        resolutionPricing[resolution] = price;
        if (price < minPrice) {
          minPrice = price;
        }
      }
    }
    if (minPrice < Infinity) {
      return {
        usdPrice: minPrice,
        priceType: "per_second",
        resolutionPricing,
      };
    }
  }

  // Pattern 2: "Per sec(ond) ... will cost X.XX$" or "$X.XX" with per-second context
  const perSecCostPattern =
    /per sec(?:ond)?[^.]*?(?:cost|price)[^.]*?([\d.]+)\s*\$|per sec(?:ond)?[^.]*?\$([\d.]+)/gi;
  const secCostMatch = perSecCostPattern.exec(text);
  if (secCostMatch) {
    const price = parseFloat(secCostMatch[1] ?? secCostMatch[2] ?? "0");
    if (!isNaN(price) && price > 0) {
      return { usdPrice: price, priceType: "per_second" };
    }
  }

  // Pattern 3: "$X.XX/sec" or "$X.XX/second" or "$X.XX per second"
  const simpleSecPattern =
    /\$([\d.]+)\s*(?:\/\s*sec(?:ond)?|per sec(?:ond)?)/gi;
  const simpleSecMatch = simpleSecPattern.exec(text);
  if (simpleSecMatch) {
    const price = parseFloat(simpleSecMatch[1] ?? "0");
    if (!isNaN(price) && price > 0) {
      return { usdPrice: price, priceType: "per_second" };
    }
  }

  // Pattern 4: "Per second video generation will cost $X.XX"
  const perSecondDollarFirst =
    /(?:per sec(?:ond)?|per-second|\/second|\/sec)[^.]*?\$([\d.]+)/gi;
  const secDollarMatch = perSecondDollarFirst.exec(text);
  if (secDollarMatch) {
    const price = parseFloat(secDollarMatch[1] ?? "0");
    if (!isNaN(price) && price > 0) {
      return { usdPrice: price, priceType: "per_second" };
    }
  }

  // Pattern 5: "per image generation will cost X.XX$" or "cost $X.XX" (per generation)
  const perGenCostPattern =
    /per (?:image|generation)[^.]*?(?:cost|price)[^.]*?([\d.]+)\s*\$|(?:cost|price)[^.]*?\$([\d.]+)/gi;
  const genCostMatch = perGenCostPattern.exec(text);
  if (genCostMatch) {
    const price = parseFloat(genCostMatch[1] ?? genCostMatch[2] ?? "0");
    if (!isNaN(price) && price > 0) {
      return { usdPrice: price, priceType: "per_generation" };
    }
  }

  // Pattern 6: "X.XX$" standalone (number followed by dollar sign)
  const trailingDollarPattern = /(?:^|\s)([\d.]+)\$/gm;
  const trailingMatch = trailingDollarPattern.exec(text);
  if (trailingMatch) {
    const price = parseFloat(trailingMatch[1] ?? "0");
    if (!isNaN(price) && price > 0) {
      return { usdPrice: price, priceType: "per_generation" };
    }
  }

  // Pattern 7: "$X.XX/video" → per_generation
  const perVideoPattern = /\$([\d.]+)\s*\/\s*video/gi;
  const vidMatch = perVideoPattern.exec(text);
  if (vidMatch) {
    const price = parseFloat(vidMatch[1] ?? "0");
    if (!isNaN(price) && price > 0) {
      return { usdPrice: price, priceType: "per_generation" };
    }
  }

  return null;
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
  const trimmed = s.trim().replace(/[()]/g, "");
  // Valid resolution patterns: 720p, 1080p, 480P, FHD, 2K, 4K, HD
  return /^\d+[pP]$|^(?:FHD|HD|2K|4K|UHD|SD)$/i.test(trimmed);
}

/** Normalize resolution values: "720P" → "720p", keep named ones as-is */
function normalizeResolution(s: string): string {
  const trimmed = s.trim().replace(/[()]/g, "");
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
      .map((s) => s.trim().replace(/[()]/g, "").split(/\s/)[0]?.trim() ?? "");
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

/** Fetch a URL with standard headers, returning text or null on failure */
async function fetchPage(
  url: string,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
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
      return null;
    }
    return await response.text();
  } catch (err) {
    logger.warn("ModelsLab page fetch error", {
      url,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
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
        });
      }
    }

    // De-duplicate fetches by slug
    const slugToPrice = new Map<string, ParsedPrice | null>();
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

      // Fetch detail page + llms.txt (cached per slug)
      if (!slugToPrice.has(slug)) {
        const detailUrl = `${BASE_URL}/${slug}`;
        const llmsUrl = `${detailUrl}/llms.txt`;

        const detailHtml = await fetchPage(detailUrl, logger);
        if (detailHtml) {
          const parsed = parsePriceFromDetailPage(detailHtml);
          slugToPrice.set(slug, parsed);
          if (parsed) {
            modelsFound++;
          } else {
            logger.warn("Could not parse price from detail page", {
              slug,
              url: detailUrl,
            });
          }
        } else {
          slugToPrice.set(slug, null);
        }

        // Fetch llms.txt for settings
        const llmsText = await fetchPage(llmsUrl, logger);
        if (llmsText) {
          slugToSettings.set(slug, parseSettingsFromLlmsTxt(llmsText));
        } else {
          slugToSettings.set(slug, null);
        }
      }

      const parsed = slugToPrice.get(slug);
      if (!parsed) {
        failures.push({
          modelId: config.id,
          provider: ApiProvider.MODELSLAB,
          reason: `Could not parse price from detail page for "${config.providerModel}" (slug: "${slug}")`,
        });
        continue;
      }

      const detailUrl = `${BASE_URL}/${slug}`;

      // === Price updates ===
      if (config.isImage) {
        updates.push({
          modelId: config.id,
          name: config.def.name,
          provider: ApiProvider.MODELSLAB,
          field: "creditCostPerImage",
          value: this.usdToCredits(parsed.usdPrice),
          source: detailUrl,
          providerModel: config.providerModel,
        });
      } else if (config.isVideo) {
        if (parsed.priceType === "per_generation") {
          const duration = config.defaultDurationSeconds || 5;
          const perSecond = parsed.usdPrice / duration;
          updates.push({
            modelId: config.id,
            name: config.def.name,
            provider: ApiProvider.MODELSLAB,
            field: "creditCostPerSecond",
            value: this.usdToCredits(perSecond),
            source: detailUrl,
            providerModel: config.providerModel,
          });
        } else {
          updates.push({
            modelId: config.id,
            name: config.def.name,
            provider: ApiProvider.MODELSLAB,
            field: "creditCostPerSecond",
            value: this.usdToCredits(parsed.usdPrice),
            source: detailUrl,
            providerModel: config.providerModel,
          });
        }

        // Resolution-based pricing → pricingByResolution
        if (parsed.resolutionPricing) {
          const pricingObj: Record<string, number> = {};
          for (const [res, usd] of Object.entries(parsed.resolutionPricing)) {
            pricingObj[normalizeResolution(res)] = this.usdToCredits(usd);
          }
          settingsUpdates.push({
            providerModel: config.providerModel,
            field: "pricingByResolution",
            tsLiteral: JSON.stringify(pricingObj)
              .replace(/"/g, '"')
              .replace(/,/g, ", "),
            source: detailUrl,
          });
        }
      } else {
        // Audio clip
        const usdPerClip =
          parsed.priceType === "per_second"
            ? parsed.usdPrice * (config.defaultDurationSeconds || 30)
            : parsed.usdPrice;
        updates.push({
          modelId: config.id,
          name: config.def.name,
          provider: ApiProvider.MODELSLAB,
          field: "creditCostPerClip",
          value: this.usdToCredits(usdPerClip),
          source: detailUrl,
          providerModel: config.providerModel,
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

    return {
      provider: this.providerName,
      modelsFound,
      modelsUpdated: updates.length,
      updates,
      settingsUpdates,
      failures,
    };
  }
}
