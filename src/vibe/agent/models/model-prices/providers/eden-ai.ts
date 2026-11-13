/**
 * Eden AI price fetcher.
 *
 * Uses the Eden AI public API at https://api.edenai.run/v2/info/provider_subfeatures
 * to fetch real pricing data for TTS and STT providers.
 *
 * Eden AI charges a 5.5% platform fee on top of provider prices.
 * The API returns exact per-unit pricing with unit type and quantity.
 *
 * Relevant entries:
 *   openai.audio.text_to_speech → $0.015/1K chars (default model)
 *   openai.audio.speech_to_text_async → $0.006/60 sec
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { sttModelDefinitions } from "../../../speech-to-text/models";
import { ttsModelDefinitions } from "../../../text-to-speech/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const API_URL = "https://api.edenai.run/v2/info/provider_subfeatures";

/** Eden AI platform fee (5.5%) applied on top of provider prices */
const PLATFORM_FEE_MULTIPLIER = 1.055;

const edenAiSubfeatureSchema = z.object({
  provider: z.object({ name: z.string() }),
  feature: z.object({ name: z.string() }),
  subfeature: z.object({ name: z.string() }),
  pricings: z.array(
    z.object({
      model_name: z.string().nullish(),
      price: z.string(),
      price_unit_quantity: z.number(),
      price_unit_type: z.string(),
    }),
  ),
});

/** Items are validated one by one so a single odd entry can't sink the run. */
const edenAiResponseSchema = z.array(z.looseObject({}));

/**
 * Fetch TTS/STT pricing from Eden AI's public provider_subfeatures API.
 * Returns maps of providerModel → USD per unit (per char for TTS, per second for STT).
 */
async function fetchEdenAiPricing(logger: EndpointLogger): Promise<{
  tts: Map<string, number>;
  stt: Map<string, number>;
  error?: string;
}> {
  const tts = new Map<string, number>();
  const stt = new Map<string, number>();

  try {
    // oxlint-disable-next-line restricted/no-raw-fetch
    const response = await fetch(API_URL, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      logger.debug("Eden AI API returned non-OK", {
        status: response.status,
      });
      return {
        tts,
        stt,
        error: `Eden AI API returned ${response.status.toString()}`,
      };
    }

    const parsedList = edenAiResponseSchema.safeParse(await response.json());
    if (!parsedList.success) {
      return {
        tts,
        stt,
        error: `Eden AI API returned an unexpected shape: ${parsedList.error.message}`,
      };
    }

    for (const rawItem of parsedList.data) {
      const parsedItem = edenAiSubfeatureSchema.safeParse(rawItem);
      if (!parsedItem.success) {
        continue;
      }
      const item = parsedItem.data;
      const provider = item.provider.name;
      const subfeature = item.subfeature.name;

      // TTS: look for audio.text_to_speech entries with char-based pricing
      if (
        item.feature.name === "audio" &&
        (subfeature === "text_to_speech" || subfeature === "tts")
      ) {
        for (const pricing of item.pricings) {
          if (pricing.price_unit_type === "char") {
            const price = parseFloat(pricing.price);
            const qty = pricing.price_unit_quantity;
            if (!isNaN(price) && price > 0 && qty > 0) {
              // Convert to USD per character, add platform fee
              const usdPerChar = (price / qty) * PLATFORM_FEE_MULTIPLIER;
              // Use "default" model pricing, keyed by provider name
              if (!tts.has(provider)) {
                tts.set(provider, usdPerChar);
                logger.debug("Eden AI TTS price", {
                  provider,
                  model: pricing.model_name ?? "default",
                  usdPerChar,
                });
              }
            }
          }
        }
      }

      // STT: look for audio.speech_to_text entries with second-based pricing
      if (
        item.feature.name === "audio" &&
        (subfeature === "speech_to_text_async" ||
          subfeature === "speech_to_text")
      ) {
        for (const pricing of item.pricings) {
          if (
            pricing.price_unit_type === "seconde" ||
            pricing.price_unit_type === "second"
          ) {
            const price = parseFloat(pricing.price);
            const qty = pricing.price_unit_quantity;
            if (!isNaN(price) && price > 0 && qty > 0) {
              // Convert to USD per second, add platform fee
              const usdPerSec = (price / qty) * PLATFORM_FEE_MULTIPLIER;
              if (!stt.has(provider)) {
                stt.set(provider, usdPerSec);
                logger.debug("Eden AI STT price", {
                  provider,
                  model: pricing.model_name ?? "default",
                  usdPerSec,
                });
              }
            }
          }
        }
      }
    }
  } catch (err) {
    const error = parseError(err).message;
    logger.debug("Eden AI pricing fetch failed", { error });
    return { tts, stt, error };
  }

  return { tts, stt };
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
          const usd = tts.get(providerConfig.providerModel);
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
            source: API_URL,
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
            source: API_URL,
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
