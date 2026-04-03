/**
 * Deepgram STT price fetcher.
 *
 * Scrapes pricing from https://deepgram.com/pricing
 * The page renders pricing tables in HTML with model names and $/min rates.
 *
 * Pricing unit: USD per minute → converted to USD per second.
 * We use pay-as-you-go (first price column) as the base rate.
 *
 * Known model name mappings (from Deepgram API model names → pricing page labels):
 *   nova-2  →  "Nova-1 & 2"  →  $0.0058/min
 *   nova-3  →  "Nova-3 (Monolingual)"  →  $0.0077/min
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { sttModelDefinitions } from "../../../speech-to-text/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const PRICING_URL = "https://deepgram.com/pricing";

/** Maps providerModel (Deepgram API name) → pricing page label pattern */
const MODEL_LABEL_MAP: Record<string, RegExp> = {
  "nova-2": /Nova-?1\s*[&amp;]+\s*2/i,
  "nova-3": /Nova-?3\s*\(Monolingual\)/i,
};

async function scrapePricing(
  logger: EndpointLogger,
): Promise<{ map: Map<string, number>; error?: string }> {
  const priceMap = new Map<string, number>();
  try {
    const response = await fetch(PRICING_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; unbottled-ai/1.0)" },
    });
    if (!response.ok) {
      return {
        map: priceMap,
        error: `Deepgram pricing page returned ${response.status.toString()}`,
      };
    }
    const html = await response.text();

    // Extract table rows: each row has a model label and one or more $/min prices
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch: RegExpExecArray | null;

    while ((rowMatch = rowRegex.exec(html)) !== null) {
      const rowHtml = rowMatch[1];
      const rowText = rowHtml
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // Extract first $/min price (pay-as-you-go rate)
      const priceMatch = rowText.match(/\$([\d.]+)\/min/);
      if (!priceMatch) {
        continue;
      }
      const usdPerMin = parseFloat(priceMatch[1]);
      if (isNaN(usdPerMin) || usdPerMin <= 0) {
        continue;
      }

      // Match against known model label patterns
      for (const [modelId, labelRegex] of Object.entries(MODEL_LABEL_MAP)) {
        if (labelRegex.test(rowText)) {
          priceMap.set(modelId, usdPerMin / 60); // convert to per-second
          break;
        }
      }
    }

    logger.debug("Deepgram pricing scraped", { models: [...priceMap.keys()] });
  } catch (err) {
    return { map: priceMap, error: parseError(err).message };
  }
  return { map: priceMap };
}

export class DeepgramPriceFetcher extends PriceFetcher {
  readonly providerName = "deepgram";

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

    for (const def of Object.values(sttModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.DEEPGRAM ||
          !("creditCostPerSecond" in providerConfig)
        ) {
          continue;
        }

        const usdPerSecond = priceMap.get(providerConfig.providerModel);
        if (usdPerSecond === undefined) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.DEEPGRAM,
            reason: `Model "${providerConfig.providerModel}" not found on Deepgram pricing page - update MODEL_LABEL_MAP in deepgram.ts if the label changed`,
          });
          continue;
        }

        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.DEEPGRAM,
          field: "creditCostPerSecond",
          value: this.usdToCredits(usdPerSecond),
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
