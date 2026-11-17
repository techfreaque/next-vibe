/**
 * Eden AI price fetcher (API v3).
 *
 * Reads the public catalog at GET /v3/info/audio/tts and
 * GET /v3/info/audio/speech_to_text_async (no auth). Each entry is
 * { model: "audio/tts/openai/tts-1", pricing: { price, price_unit_quantity,
 * price_unit_type: "character" | "second" | "minute" | ... } }.
 * (v2 /v2/info/provider_subfeatures shuts down on 2026-12-31.)
 *
 * Eden AI charges a 5.5% platform fee on top of provider prices.
 *
 * Keys match our route encoding (../../eden-ai.ts):
 *   TTS providerModel "openai/tts-1:nova" → key "openai/tts-1" ($15/1M chars)
 *   STT providerModel "openai"            → key "openai"       ($0.006/60 sec)
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { sttModelDefinitions } from "../../../speech-to-text/models";
import { ttsModelDefinitions } from "../../../text-to-speech/models";
import {
  EDEN_AI_STT_MODEL_PREFIX,
  EDEN_AI_TTS_MODEL_PREFIX,
  EDEN_AI_URLS,
  edenAiInfoModelSchema,
  edenAiInfoSchema,
  parseEdenAiTtsProviderModel,
} from "../../eden-ai";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

/** Eden AI platform fee (5.5%) applied on top of provider prices */
const PLATFORM_FEE_MULTIPLIER = 1.055;

/** Seconds per pricing unit for duration-priced STT entries. */
const STT_UNIT_SECONDS: Record<string, number> = {
  second: 1,
  seconde: 1,
  minute: 60,
};

/**
 * Fetch one subfeature's catalog: model key (model string minus prefix) →
 * USD per base unit. `unitMultipliers` maps an accepted price_unit_type to
 * base units (TTS: character → 1; STT: second → 1, minute → 60); entries in
 * any other unit (e.g. per-minute TTS) are skipped.
 */
async function fetchEdenAiCatalog(
  url: string,
  prefix: string,
  unitMultipliers: Record<string, number>,
  logger: EndpointLogger,
): Promise<{ prices: Map<string, number>; error?: string }> {
  const prices = new Map<string, number>();
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      logger.debug("Eden AI API returned non-OK", {
        url,
        status: response.status,
      });
      return {
        prices,
        error: `Eden AI API returned ${response.status.toString()} for ${url}`,
      };
    }

    const parsedList = edenAiInfoSchema.safeParse(await response.json());
    if (!parsedList.success) {
      return {
        prices,
        error: `Eden AI API returned an unexpected shape: ${parsedList.error.message}`,
      };
    }

    // Items are validated one by one so a single odd entry can't sink the run.
    for (const rawItem of parsedList.data.models) {
      const parsedItem = edenAiInfoModelSchema.safeParse(rawItem);
      if (!parsedItem.success || !parsedItem.data.model.startsWith(prefix)) {
        continue;
      }
      const { model, pricing } = parsedItem.data;
      const unitMultiplier = unitMultipliers[pricing.price_unit_type];
      const price =
        typeof pricing.price === "number"
          ? pricing.price
          : Number.parseFloat(pricing.price);
      const qty = pricing.price_unit_quantity * (unitMultiplier ?? 0);
      if (!Number.isFinite(price) || price <= 0 || qty <= 0) {
        continue;
      }
      const key = model.slice(prefix.length);
      // USD per character (TTS) or per second (STT), plus platform fee
      const usdPerUnit = (price / qty) * PLATFORM_FEE_MULTIPLIER;
      prices.set(key, usdPerUnit);
      logger.debug("Eden AI price", { model, usdPerUnit });
    }
  } catch (err) {
    const error = parseError(err).message;
    logger.debug("Eden AI pricing fetch failed", { url, error });
    return { prices, error };
  }
  return { prices };
}

/**
 * Fetch TTS/STT pricing from Eden AI's public v3 catalog.
 * Returns maps of model key → USD per unit (per char for TTS, per second for STT).
 */
async function fetchEdenAiPricing(logger: EndpointLogger): Promise<{
  tts: Map<string, number>;
  stt: Map<string, number>;
  error?: string;
}> {
  const [tts, stt] = await Promise.all([
    fetchEdenAiCatalog(
      EDEN_AI_URLS.ttsInfo,
      EDEN_AI_TTS_MODEL_PREFIX,
      { character: 1, char: 1 },
      logger,
    ),
    fetchEdenAiCatalog(
      EDEN_AI_URLS.sttInfo,
      EDEN_AI_STT_MODEL_PREFIX,
      STT_UNIT_SECONDS,
      logger,
    ),
  ]);
  const error = [tts.error, stt.error].filter(Boolean).join("; ");
  return {
    tts: tts.prices,
    stt: stt.prices,
    error: error || undefined,
  };
}

export class EdenAiPriceFetcher extends PriceFetcher {
  readonly providerName = "eden-ai";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const { tts, stt, error } = await fetchEdenAiPricing(logger);
    if (error) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        failures,
        error,
        // Could not check: keep prior verified state instead of disabling.
        failedApiProviders: [ApiProvider.EDEN_AI_TTS, ApiProvider.EDEN_AI_STT],
      };
    }

    for (const def of [
      ...Object.values(ttsModelDefinitions),
      ...Object.values(sttModelDefinitions),
    ]) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider === ApiProvider.EDEN_AI_TTS &&
          "creditCostPerCharacter" in providerConfig
        ) {
          const usd = tts.get(
            parseEdenAiTtsProviderModel(providerConfig.providerModel).modelKey,
          );
          if (usd === undefined) {
            failures.push({
              modelId: providerConfig.id,
              provider: ApiProvider.EDEN_AI_TTS,
              reason: `Provider "${providerConfig.providerModel}" not found in Eden AI TTS pricing API`,
            });
            continue;
          }
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.EDEN_AI_TTS,
            field: "creditCostPerCharacter",
            value: this.usdToCredits(usd),
            source: EDEN_AI_URLS.ttsInfo,
            providerModel: providerConfig.providerModel,
          });
        } else if (
          providerConfig.apiProvider === ApiProvider.EDEN_AI_STT &&
          "creditCostPerSecond" in providerConfig
        ) {
          const usd = stt.get(providerConfig.providerModel);
          if (usd === undefined) {
            failures.push({
              modelId: providerConfig.id,
              provider: ApiProvider.EDEN_AI_STT,
              reason: `Provider "${providerConfig.providerModel}" not found in Eden AI STT pricing API`,
            });
            continue;
          }
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.EDEN_AI_STT,
            field: "creditCostPerSecond",
            value: this.usdToCredits(usd),
            source: EDEN_AI_URLS.sttInfo,
            providerModel: providerConfig.providerModel,
          });
        }
      }
    }

    return {
      provider: this.providerName,
      modelsFound: updates.length + failures.length,
      modelsUpdated: updates.length,
      updates,
      failures,
    };
  }
}
