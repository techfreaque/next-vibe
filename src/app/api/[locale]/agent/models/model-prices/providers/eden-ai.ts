/**
 * Eden AI price fetcher.
 *
 * Eden AI wraps other providers (OpenAI, Deepgram, etc.) and returns actual
 * cost in USD in each API response. The per-model prices in models.ts are used
 * for upfront balance checks only - actual deduction uses the response cost.
 *
 * We derive the "pre-flight estimate" price by:
 *   1. Fetching the Eden AI pricing page (https://www.edenai.co/pricing) via HTML scrape
 *   2. Falling back to a small premium above the underlying provider's cost
 *
 * Eden AI typically charges ~15% above the underlying provider price.
 *
 * Provider cost sources:
 *   EDEN_AI_TTS (openai voices):  ~$0.018/1K chars  (OpenAI $0.015 + ~20% margin)
 *   EDEN_AI_STT (openai whisper): ~$0.0069/min       (OpenAI $0.006 + ~15% margin)
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { ApiProvider, modelDefinitions } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const PRICING_URL = "https://www.edenai.co/pricing";

/** Eden AI margin above underlying provider cost */
const EDEN_AI_MARGIN = 0.2; // ~20% above underlying provider

/**
 * Fallback USD per character for Eden AI TTS (by underlying provider model)
 * Underlying OpenAI tts-1 = $0.015/1K chars. Eden AI adds ~20%.
 */
const TTS_FALLBACK_USD_PER_CHAR: Record<string, number> = {
  openai: (0.015 * (1 + EDEN_AI_MARGIN)) / 1000, // $0.018/1K chars
};

/**
 * Fallback USD per second for Eden AI STT (by underlying provider model)
 * Underlying OpenAI whisper = $0.006/min. Eden AI adds ~20%.
 */
const STT_FALLBACK_USD_PER_SECOND: Record<string, number> = {
  openai: (0.006 * (1 + EDEN_AI_MARGIN)) / 60, // $0.0072/min → /60
};

async function scrapeEdenAiPricing(logger: EndpointLogger): Promise<{
  tts: Map<string, number>;
  stt: Map<string, number>;
}> {
  const tts = new Map<string, number>();
  const stt = new Map<string, number>();

  try {
    const response = await fetch(PRICING_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; unbottled-ai/1.0)" },
    });
    if (!response.ok) {
      // Non-OK response - fall through to fallbacks
      logger.debug("Eden AI pricing page returned non-OK", {
        status: response.status,
      });
    } else {
      const html = await response.text();

      // TTS: look for patterns like "$0.018/1K chars" or "$18/1M chars" near "openai" or "tts"
      const ttsSection = html.match(
        /tts[\s\S]{0,2000}?\$([\d.]+)\s*\/\s*(?:1[,\s]?[kK]|1[,\s]?000)\s*char/i,
      );
      if (ttsSection) {
        const usdPer1K = parseFloat(ttsSection[1]);
        if (!isNaN(usdPer1K) && usdPer1K > 0) {
          tts.set("openai", usdPer1K / 1000);
          logger.debug("Eden AI TTS: scraped price", { usdPer1K });
        }
      }

      // STT: look for patterns like "$0.0069/min" near "speech_to_text" or "openai"
      const sttSection = html.match(
        /speech.to.text[\s\S]{0,2000}?\$([\d.]+)\s*\/\s*min/i,
      );
      if (sttSection) {
        const usdPerMin = parseFloat(sttSection[1]);
        if (!isNaN(usdPerMin) && usdPerMin > 0) {
          stt.set("openai", usdPerMin / 60);
          logger.debug("Eden AI STT: scraped price", { usdPerMin });
        }
      }
    }
  } catch (err) {
    logger.debug("Eden AI pricing scrape failed", {
      error: parseError(err).message,
    });
  }

  // Fill in fallbacks for anything not scraped
  for (const [model, price] of Object.entries(TTS_FALLBACK_USD_PER_CHAR)) {
    if (!tts.has(model)) {
      tts.set(model, price);
    }
  }
  for (const [model, price] of Object.entries(STT_FALLBACK_USD_PER_SECOND)) {
    if (!stt.has(model)) {
      stt.set(model, price);
    }
  }

  return { tts, stt };
}

export class EdenAiPriceFetcher extends PriceFetcher {
  readonly providerName = "eden-ai";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const { tts, stt } = await scrapeEdenAiPricing(logger);

    for (const def of Object.values(modelDefinitions)) {
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
              reason: `Model "${providerConfig.providerModel}" not in Eden AI TTS price map - add to TTS_FALLBACK_USD_PER_CHAR in eden-ai.ts`,
            });
            continue;
          }
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.EDEN_AI_TTS,
            field: "creditCostPerCharacter",
            value: this.usdToCredits(usd),
            source: PRICING_URL,
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
              reason: `Model "${providerConfig.providerModel}" not in Eden AI STT price map - add to STT_FALLBACK_USD_PER_SECOND in eden-ai.ts`,
            });
            continue;
          }
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.EDEN_AI_STT,
            field: "creditCostPerSecond",
            value: this.usdToCredits(usd),
            source: PRICING_URL,
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
