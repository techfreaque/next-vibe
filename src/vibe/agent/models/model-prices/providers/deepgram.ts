/**
 * Deepgram STT price fetcher.
 *
 * Scrapes pricing from https://deepgram.com/pricing (server-rendered HTML).
 *
 * Pricing unit: USD per minute (or per hour) → converted to USD per second.
 * We use pay-as-you-go (first price column) as the base rate.
 *
 * Page formats (2026-11):
 *   Table row:  "Nova-3 Monolingual $0.0048 was $0.0077 / min $0.0042 was $0.0065 / min -"
 *               (first "$X" is the current pay-as-you-go price, "was $Y" the old one)
 *   Nova-2 is no longer a table row; its rate lives in the FAQ (JSON-LD):
 *               "Nova-2 streaming $0.35 an hour, Enhanced $0.99, Base $0.87."
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { sttModelDefinitions } from "../../../speech-to-text/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const PRICING_URL = "https://deepgram.com/pricing";

/** providerModel (Deepgram API name) → pricing table row label */
const TABLE_LABEL_MAP: Record<string, RegExp> = {
  "nova-3": /^Nova-?3\s*\(?Monolingual\)?/i,
};

/** providerModel → per-hour rate stated in page copy (models dropped from the table) */
const HOURLY_TEXT_MAP: Record<string, RegExp> = {
  "nova-2": /Nova-?2 streaming \$(\d+(?:\.\d+)?) an hour/i,
};

/** First "$X / min" in a row, skipping a struck-through "was $Y". */
const ROW_PRICE_REGEX =
  /\$(\d+(?:\.\d+)?)(?:\s+was\s+\$\d+(?:\.\d+)?)?\s*\/\s*min\b/;

function decodeEntities(text: string): string {
  return text
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"');
}

function parsePricing(
  html: string,
  logger: EndpointLogger,
): Map<string, number> {
  const priceMap = new Map<string, number>();

  // Table rows: model label + one or more "$X / min" prices
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowText = decodeEntities(rowMatch[1].replaceAll(/<[^>]+>/g, " "))
      .replaceAll(/\s+/g, " ")
      .trim();
    const priceMatch = ROW_PRICE_REGEX.exec(rowText);
    if (!priceMatch) {
      continue;
    }
    const usdPerMin = parseFloat(priceMatch[1]);
    if (isNaN(usdPerMin) || usdPerMin <= 0) {
      continue;
    }
    for (const [modelId, labelRegex] of Object.entries(TABLE_LABEL_MAP)) {
      if (!priceMap.has(modelId) && labelRegex.test(rowText)) {
        priceMap.set(modelId, usdPerMin / 60);
        break;
      }
    }
  }

  // Per-hour rates stated in page copy
  const plainText = decodeEntities(html);
  for (const [modelId, textRegex] of Object.entries(HOURLY_TEXT_MAP)) {
    const match = textRegex.exec(plainText);
    const usdPerHour = match ? parseFloat(match[1]) : NaN;
    if (!priceMap.has(modelId) && !isNaN(usdPerHour) && usdPerHour > 0) {
      priceMap.set(modelId, usdPerHour / 3600);
    }
  }

  logger.debug("Deepgram pricing scraped", {
    models: [...priceMap.keys()].join(","),
  });
  return priceMap;
}

async function scrapePricing(
  logger: EndpointLogger,
): Promise<{ map: Map<string, number>; error?: string }> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API
    const response = await fetch(PRICING_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; unbottled-ai/1.0)" },
    });
    if (!response.ok) {
      return {
        map: new Map(),
        error: `Deepgram pricing page returned ${response.status.toString()}`,
      };
    }
    const map = parsePricing(await response.text(), logger);
    if (map.size === 0) {
      return {
        map,
        error: `No prices parsed from ${PRICING_URL} - page layout changed? Update TABLE_LABEL_MAP / HOURLY_TEXT_MAP in deepgram.ts`,
      };
    }
    return { map };
  } catch (err) {
    return { map: new Map(), error: parseError(err).message };
  }
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
        // Could not check: keep prior verified state instead of disabling.
        failedApiProviders: [ApiProvider.DEEPGRAM],
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
            reason: `Model "${providerConfig.providerModel}" not found on Deepgram pricing page - update TABLE_LABEL_MAP / HOURLY_TEXT_MAP in deepgram.ts if the label changed`,
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
