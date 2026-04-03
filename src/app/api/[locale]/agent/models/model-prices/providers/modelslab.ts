/**
 * ModelsLab price fetcher.
 *
 * Scrapes pricing data from https://modelslab.com/pricing
 * The page embeds JSON model data with model_id, model_price, and model_price_type fields.
 *
 * Supported price types:
 *   per_second     - USD per second of video/audio output
 *   per_generation - USD per generated clip/image
 *   per_million_characters - USD per 1M characters (TTS)
 *   per_million_tokens - USD per 1M tokens (LLM)
 *   multiplier     - a multiplier on base compute cost, NOT a direct USD price.
 *                    Cannot be converted to credits automatically - these models
 *                    will be marked with TODO comments in models.ts.
 *
 * Model ID mapping: providerModel strings in models.ts match the pricing page
 * model_id values directly. Use MODEL_ID_ALIAS for exceptions.
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { imageGenModelDefinitions } from "../../../image-generation/models";
import { musicGenModelDefinitions } from "../../../music-generation/models";
import { videoGenModelDefinitions } from "../../../video-generation/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const PRICING_URL = "https://modelslab.com/pricing";

/**
 * Maps providerModel (API call value) → model_id on the ModelsLab pricing page.
 * Only needed when the API model_id differs from the pricing page model_id.
 * All other providerModel values in models.ts must exactly match the pricing page.
 */
const MODEL_ID_ALIAS: Record<string, string> = {
  // Music: API uses "music_gen", pricing page lists it as "music_v1"
  music_gen: "music_v1",
  // Grok: API uses short names, pricing page uses "grok-imagine-video-*"
  "grok-t2v": "grok-imagine-video-t2v",
  "grok-i2v": "grok-imagine-video-i2v",
  // Veo 2/3: API uses "veo-2"/"veo-3", pricing page abbreviates to "veo2"/"veo3"
  "veo-2": "veo2",
  "veo-3": "veo3",
  // Kling: API uses lowercase, pricing page has mixed case
  "kling-v2-5-turbo-i2v": "Kling-V2-5-Turbo-i2v",
  // Hailuo: pricing page model_id has "-frame" suffix and a trailing space
  // eslint-disable-next-line no-trailing-spaces
  "Hailuo-02-start-end": "Hailuo-02-start-end-frame ",
};

interface ModelslabPriceEntry {
  model_id: string;
  model_name?: string;
  model_price: string;
  model_price_type:
    | "per_second"
    | "per_generation"
    | "per_million_characters"
    | "per_million_tokens"
    | "multiplier"
    | null;
  /** ModelsLab's own credit cost (1 credit = $0.47/100 ≈ their internal rate). Used for multiplier models. */
  api_credit?: number;
}

async function scrapePricing(
  logger: EndpointLogger,
): Promise<{ map: Map<string, ModelslabPriceEntry>; error?: string }> {
  const priceMap = new Map<string, ModelslabPriceEntry>();
  const response = await fetch(PRICING_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; unbottled-ai/1.0)" },
  });
  if (!response.ok) {
    return {
      map: priceMap,
      error: `ModelsLab pricing page returned ${response.status.toString()}`,
    };
  }
  const html = await response.text();

  // The page embeds model pricing as HTML-escaped JSON objects
  const unescaped = html
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'");

  const objectRegex = /\{[^{}]*?model_price[^{}]*?\}/g;
  let match: RegExpExecArray | null;

  while ((match = objectRegex.exec(unescaped)) !== null) {
    try {
      const entry = JSON.parse(match[0]) as ModelslabPriceEntry;
      if (entry.model_id && entry.model_price) {
        priceMap.set(entry.model_id, entry);
      }
    } catch {
      // Skip malformed JSON fragments
    }
  }

  logger.debug("ModelsLab pricing scraped", { count: priceMap.size });
  return { map: priceMap };
}

export class ModelslabPriceFetcher extends PriceFetcher {
  readonly providerName = "modelslab";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const { map: priceMap, error: scrapeError } = await scrapePricing(logger);
    if (scrapeError) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        failures,
        error: scrapeError,
      };
    }

    for (const def of [
      ...Object.values(imageGenModelDefinitions),
      ...Object.values(videoGenModelDefinitions),
      ...Object.values(musicGenModelDefinitions),
    ]) {
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

        const pricingId =
          MODEL_ID_ALIAS[providerConfig.providerModel] ??
          providerConfig.providerModel;
        const entry = priceMap.get(pricingId);
        if (!entry) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.MODELSLAB,
            reason: `Model "${providerConfig.providerModel}" (pricing id: "${pricingId}") not found on ModelsLab pricing page`,
          });
          continue;
        }

        const priceValue = parseFloat(entry.model_price);
        if (isNaN(priceValue) || priceValue <= 0) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.MODELSLAB,
            reason: `Invalid price value for "${providerConfig.providerModel}": ${entry.model_price}`,
          });
          continue;
        }

        if (isImage) {
          if (entry.model_price_type !== "per_generation") {
            failures.push({
              modelId: providerConfig.id,
              provider: ApiProvider.MODELSLAB,
              reason: `Unexpected price type "${entry.model_price_type}" for image model "${providerConfig.providerModel}" (expected per_generation)`,
            });
            continue;
          }
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.MODELSLAB,
            field: "creditCostPerImage",
            value: this.usdToCredits(priceValue),
            source: PRICING_URL,
            providerModel: providerConfig.providerModel,
          });
        } else if (isVideo) {
          if (entry.model_price_type === "multiplier") {
            if (!entry.api_credit || entry.api_credit <= 0) {
              failures.push({
                modelId: providerConfig.id,
                provider: ApiProvider.MODELSLAB,
                reason: `Model "${providerConfig.providerModel}" uses multiplier pricing but has no api_credit value - cannot convert to USD`,
              });
              continue;
            }
            // 1 ModelsLab api_credit = $0.0047 USD (derived from per_second models with known prices)
            const MODELSLAB_CREDIT_USD_RATE = 0.0047;
            const usdPerSecond = entry.api_credit * MODELSLAB_CREDIT_USD_RATE;
            updates.push({
              modelId: providerConfig.id,
              name: def.name,
              provider: ApiProvider.MODELSLAB,
              field: "creditCostPerSecond",
              value: this.usdToCredits(usdPerSecond),
              source: PRICING_URL,
              providerModel: providerConfig.providerModel,
            });
            continue;
          }
          if (entry.model_price_type !== "per_second") {
            failures.push({
              modelId: providerConfig.id,
              provider: ApiProvider.MODELSLAB,
              reason: `Unexpected price type "${entry.model_price_type}" for video model "${providerConfig.providerModel}" (expected per_second)`,
            });
            continue;
          }
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.MODELSLAB,
            field: "creditCostPerSecond",
            value: this.usdToCredits(priceValue),
            source: PRICING_URL,
            providerModel: providerConfig.providerModel,
          });
        } else {
          // Audio clip - accept per_generation or per_second
          if (
            entry.model_price_type !== "per_generation" &&
            entry.model_price_type !== "per_second"
          ) {
            failures.push({
              modelId: providerConfig.id,
              provider: ApiProvider.MODELSLAB,
              reason: `Unexpected price type "${entry.model_price_type}" for audio model "${providerConfig.providerModel}"`,
            });
            continue;
          }
          // per_second audio: multiply by clip duration to get cost per clip
          const usdPerClip =
            entry.model_price_type === "per_second"
              ? priceValue * providerConfig.defaultDurationSeconds
              : priceValue;
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.MODELSLAB,
            field: "creditCostPerClip",
            value: this.usdToCredits(usdPerClip),
            source: PRICING_URL,
            providerModel: providerConfig.providerModel,
          });
        }
      }
    }

    return {
      provider: this.providerName,
      modelsFound: priceMap.size,
      modelsUpdated: updates.length,
      updates,
      failures,
    };
  }
}
