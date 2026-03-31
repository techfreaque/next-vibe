/**
 * OpenAI STT price fetcher.
 *
 * Scrapes pricing from https://platform.openai.com/docs/pricing
 *
 * Current pricing (as of 2025):
 *   whisper-1:             $0.006 per minute → $0.0001/sec
 *   gpt-4o-transcribe:     $0.006 per minute
 *   gpt-4o-mini-transcribe: $0.003 per minute
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { ApiProvider, modelDefinitions } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const PRICING_URL = "https://platform.openai.com/docs/pricing";

/** USD per second = USD per minute / 60 */
const KNOWN_FALLBACK_USD_PER_SECOND: Record<string, number> = {
  "whisper-1": 0.006 / 60,
  "gpt-4o-transcribe": 0.006 / 60,
  "gpt-4o-mini-transcribe": 0.003 / 60,
};

const MODEL_LABEL_PATTERNS: Record<string, RegExp> = {
  "whisper-1": /whisper/i,
  "gpt-4o-transcribe": /gpt-4o-transcribe(?!.*mini)/i,
  "gpt-4o-mini-transcribe": /gpt-4o-mini-transcribe/i,
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

      for (const [modelId, labelRegex] of Object.entries(
        MODEL_LABEL_PATTERNS,
      )) {
        // Match: model name ... $X.XXX/min or per minute
        const match = html.match(
          new RegExp(
            `${labelRegex.source}[\\s\\S]{0,500}?\\$(\\d+\\.\\d+)\\s*(?:\\/|per)\\s*(?:min(?:ute)?)`,
            "i",
          ),
        );
        if (match) {
          const usdPerMin = parseFloat(match[1]);
          if (!isNaN(usdPerMin) && usdPerMin > 0) {
            priceMap.set(modelId, usdPerMin / 60);
            logger.debug("OpenAI STT: scraped price", { modelId, usdPerMin });
            continue;
          }
        }
        // Reverse: price before model name
        const matchReverse = html.match(
          new RegExp(
            `\\$(\\d+\\.\\d+)\\s*(?:\\/|per)\\s*(?:min(?:ute)?)[\\s\\S]{0,500}?${labelRegex.source}`,
            "i",
          ),
        );
        if (matchReverse) {
          const usdPerMin = parseFloat(matchReverse[1]);
          if (!isNaN(usdPerMin) && usdPerMin > 0) {
            priceMap.set(modelId, usdPerMin / 60);
            logger.debug("OpenAI STT: scraped price (reverse)", {
              modelId,
              usdPerMin,
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
    logger.debug("OpenAI STT pricing scrape failed", {
      error: parseError(err).message,
    });
  }

  // Fill fallbacks for any model not scraped
  for (const [modelId, usdPerSec] of Object.entries(
    KNOWN_FALLBACK_USD_PER_SECOND,
  )) {
    if (!priceMap.has(modelId)) {
      priceMap.set(modelId, usdPerSec);
      logger.debug("OpenAI STT: using known fallback price", {
        modelId,
        usdPerSec,
      });
    }
  }

  return priceMap;
}

export class OpenAiSttPriceFetcher extends PriceFetcher {
  readonly providerName = "openai-stt";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const priceMap = await scrapePricing(logger);

    for (const def of Object.values(modelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.OPENAI_STT ||
          !("creditCostPerSecond" in providerConfig)
        ) {
          continue;
        }

        const usdPerSec = priceMap.get(providerConfig.providerModel);
        if (usdPerSec === undefined) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.OPENAI_STT,
            reason: `Model "${providerConfig.providerModel}" not found - add to MODEL_LABEL_PATTERNS in openai-stt.ts`,
          });
          continue;
        }

        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.OPENAI_STT,
          field: "creditCostPerSecond",
          value: this.usdToCredits(usdPerSec),
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
