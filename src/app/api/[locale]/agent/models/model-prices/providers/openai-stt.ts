/**
 * OpenAI STT price fetcher.
 *
 * Uses Playwright headless browser to scrape pricing from
 * https://developers.openai.com/api/docs/pricing
 * (the page is JS-rendered by Astro and plain fetch returns no pricing data).
 *
 * After clicking "All models" buttons to expand all sections, extracts:
 *   Whisper (whisper-1):              $0.006 / minute
 *   gpt-4o-transcribe:               $0.006 / minute
 *   gpt-4o-mini-transcribe:          $0.003 / minute
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { sttModelDefinitions } from "../../../speech-to-text/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";
import { scrapeWithBrowser } from "./browser-scraper";

const PRICING_URL = "https://developers.openai.com/api/docs/pricing";

/** Map page label → providerModel id */
const LABEL_TO_MODEL: Record<string, string> = {
  whisper: "whisper-1",
  "gpt-4o-transcribe": "gpt-4o-transcribe",
  "gpt-4o-mini-transcribe": "gpt-4o-mini-transcribe",
  "gpt-4o-transcribe-diarize": "gpt-4o-transcribe",
};

/**
 * Parse STT pricing from the full page text (line-by-line).
 *
 * The expanded pricing page renders lines like:
 *   "Whisper\tTranscription\t-\t-\t$0.006 / minute"
 *   "gpt-4o-transcribe\tTranscription\t$2.50\t$10.00\t$0.006 / minute"
 */
function parseSttPricing(
  pageText: string,
  logger: EndpointLogger,
): Map<string, number> {
  const priceMap = new Map<string, number>();

  for (const line of pageText.split("\n")) {
    // Match: line starting with a model label (up to first tab), containing $X.XXX / minute
    const match = line.match(/^([^\t]+)\t.*\$(\d+(?:\.\d+)?)\s*\/\s*minute/i);
    if (match) {
      const label = match[1].toLowerCase().trim();
      const modelId = LABEL_TO_MODEL[label];
      if (modelId && !priceMap.has(modelId)) {
        const usdPerMin = parseFloat(match[2]);
        if (!isNaN(usdPerMin) && usdPerMin > 0) {
          const usdPerSec = usdPerMin / 60;
          priceMap.set(modelId, usdPerSec);
          logger.debug("OpenAI STT: parsed price", {
            label,
            modelId,
            usdPerMin,
          });
        }
      }
    }
  }

  return priceMap;
}

export class OpenAiSttPriceFetcher extends PriceFetcher {
  readonly providerName = "openai-stt";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const pageText = await scrapeWithBrowser(logger, {
      url: PRICING_URL,
      clickButtonTexts: ["All models"],
      waitForText: "whisper",
    });

    const priceMap = pageText ? parseSttPricing(pageText, logger) : new Map();

    for (const def of Object.values(sttModelDefinitions)) {
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
            reason: `Model "${providerConfig.providerModel}" not found on pricing page - check ${PRICING_URL}`,
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
