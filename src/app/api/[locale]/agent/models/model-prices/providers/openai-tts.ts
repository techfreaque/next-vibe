/**
 * OpenAI TTS price fetcher.
 *
 * Uses Playwright headless browser to scrape pricing from
 * https://developers.openai.com/api/docs/pricing
 * (the page is JS-rendered by Astro and plain fetch returns no pricing data).
 *
 * After clicking "All models" buttons to expand all sections, extracts:
 *   tts-1:           $15.00 / 1M characters
 *   tts-1-hd:        $30.00 / 1M characters
 *   gpt-4o-mini-tts: token-based (Audio output $12.00/1M tokens)
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { ttsModelDefinitions } from "../../../text-to-speech/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";
import { scrapeWithBrowser } from "./browser-scraper";

const PRICING_URL = "https://developers.openai.com/api/docs/pricing";

/**
 * Parse TTS pricing from the full page text (line-by-line).
 *
 * The expanded pricing page renders tab-delimited lines like:
 *   "tts-1\tText\t$15.00 / 1M characters\t-\t-"
 *   "tts-1-hd\tText\t$30.00 / 1M characters\t-\t-"
 *
 * We split by line and match each line individually to avoid cross-line
 * regex greediness issues.
 */
function parseTtsPricing(
  pageText: string,
  logger: EndpointLogger,
): Map<string, number> {
  const priceMap = new Map<string, number>();

  for (const line of pageText.split("\n")) {
    // Match: line starting with a known TTS model, containing $X.XX / 1M characters
    const match = line.match(
      /^(tts-1-hd|tts-1|gpt-4o-mini-tts)\b.*\$(\d+(?:\.\d+)?)\s*\/\s*1M\s*characters/i,
    );
    if (match) {
      const modelId = match[1].toLowerCase();
      const usdPer1M = parseFloat(match[2]);
      if (!isNaN(usdPer1M) && usdPer1M > 0) {
        const usdPerChar = usdPer1M / 1_000_000;
        priceMap.set(modelId, usdPerChar);
        logger.debug("OpenAI TTS: parsed price", { modelId, usdPer1M });
      }
    }
  }

  return priceMap;
}

export class OpenAiTtsPriceFetcher extends PriceFetcher {
  readonly providerName = "openai-tts";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const pageText = await scrapeWithBrowser(logger, {
      url: PRICING_URL,
      clickButtonTexts: ["All models"],
      waitForText: "tts-1",
    });

    const priceMap = pageText ? parseTtsPricing(pageText, logger) : new Map();

    for (const def of Object.values(ttsModelDefinitions)) {
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
            reason: `Model "${providerConfig.providerModel}" not found on pricing page - check ${PRICING_URL}`,
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
