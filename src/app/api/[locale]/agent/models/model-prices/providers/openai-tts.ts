/**
 * OpenAI TTS price fetcher.
 *
 * Scrapes pricing from https://platform.openai.com/docs/pricing
 * Falls back to https://openai.com/api/pricing/ if needed.
 *
 * OpenAI pricing page is JS-heavy - we look for pricing data in embedded
 * script tags and known JSON structures in the page HTML.
 *
 * Current pricing (as of 2025):
 *   tts-1:           $0.015 per 1,000 characters
 *   tts-1-hd:        $0.030 per 1,000 characters
 *   gpt-4o-mini-tts: $0.015 per 1,000 characters (same tier as tts-1)
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { ApiProvider, modelDefinitions } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const PRICING_URL = "https://platform.openai.com/docs/pricing";

/**
 * Maps providerModel → USD per character (derived from per-1K-char rate).
 * Extracted via HTML scraping; falls back to known values if page structure changes.
 *
 * tts-1:    $0.015/1K chars → $0.000015/char
 * tts-1-hd: $0.030/1K chars → $0.000030/char
 */
const KNOWN_FALLBACK_USD_PER_CHAR: Record<string, number> = {
  "tts-1": 0.015 / 1000,
  "tts-1-hd": 0.03 / 1000,
  "gpt-4o-mini-tts": 0.015 / 1000,
};

/** Model label patterns as they appear on the pricing page */
const MODEL_LABEL_PATTERNS: Record<string, RegExp> = {
  "tts-1": /tts-1(?![-\s]*hd)/i,
  "tts-1-hd": /tts-1[-\s]*hd/i,
  "gpt-4o-mini-tts": /gpt-4o-mini-tts/i,
};

async function scrapePricing(
  logger: EndpointLogger,
): Promise<Map<string, number>> {
  const priceMap = new Map<string, number>();

  try {
    const response = await fetch(PRICING_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (response.ok) {
      const html = await response.text();

      // Try to find per-character or per-1K-char prices near known model names
      for (const [modelId, labelRegex] of Object.entries(
        MODEL_LABEL_PATTERNS,
      )) {
        const match = html.match(
          new RegExp(
            `${labelRegex.source}[\\s\\S]{0,500}?\\$(\\d+\\.\\d+)\\s*(?:\\/|per)\\s*(?:1[,\\s]?[Kk]|1[,\\s]?000)\\s*char`,
            "i",
          ),
        );
        if (match) {
          const usdPer1K = parseFloat(match[1]);
          if (!isNaN(usdPer1K) && usdPer1K > 0) {
            priceMap.set(modelId, usdPer1K / 1000);
            logger.debug("OpenAI TTS: scraped price", { modelId, usdPer1K });
            continue;
          }
        }
        // Reverse order - price before model name
        const matchReverse = html.match(
          new RegExp(
            `\\$(\\d+\\.\\d+)\\s*(?:\\/|per)\\s*(?:1[,\\s]?[Kk]|1[,\\s]?000)\\s*char[\\s\\S]{0,500}?${labelRegex.source}`,
            "i",
          ),
        );
        if (matchReverse) {
          const usdPer1K = parseFloat(matchReverse[1]);
          if (!isNaN(usdPer1K) && usdPer1K > 0) {
            priceMap.set(modelId, usdPer1K / 1000);
            logger.debug("OpenAI TTS: scraped price (reverse)", {
              modelId,
              usdPer1K,
            });
          }
        }
      }
    } else {
      logger.debug("OpenAI pricing page returned non-OK", {
        status: response.status,
      });
    }
  } catch (err) {
    logger.debug("OpenAI TTS pricing scrape failed", {
      error: parseError(err).message,
    });
  }

  // Fill in fallbacks for any model not found via scraping
  for (const [modelId, usdPerChar] of Object.entries(
    KNOWN_FALLBACK_USD_PER_CHAR,
  )) {
    if (!priceMap.has(modelId)) {
      priceMap.set(modelId, usdPerChar);
      logger.debug("OpenAI TTS: using known fallback price", {
        modelId,
        usdPerChar,
      });
    }
  }

  return priceMap;
}

export class OpenAiTtsPriceFetcher extends PriceFetcher {
  readonly providerName = "openai-tts";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const priceMap = await scrapePricing(logger);

    for (const def of Object.values(modelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.OPENAI_TTS ||
          !("creditCostPerCharacter" in providerConfig)
        ) {
          continue;
        }

        const usdPerChar = priceMap.get(providerConfig.providerModel);
        if (usdPerChar === undefined) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.OPENAI_TTS,
            reason: `Model "${providerConfig.providerModel}" not found - add to MODEL_LABEL_PATTERNS in openai-tts.ts`,
          });
          continue;
        }

        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.OPENAI_TTS,
          field: "creditCostPerCharacter",
          value: this.usdToCredits(usdPerChar),
          source: PRICING_URL,
          providerModel: providerConfig.providerModel,
        });
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
