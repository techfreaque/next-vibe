/**
 * ElevenLabs TTS price fetcher.
 *
 * ElevenLabs API usage is billed in USD per 1K characters at one flat rate
 * across plans (2026-11), published on the keyless, server-rendered page
 * https://elevenlabs.io/pricing/api. Its FAQ (also in JSON-LD) states:
 *   "Text to Speech $0.08 per 1,000 characters (multilingual models) or $0.04 (Flash/Turbo)."
 *
 * Our runtime synthesizes every ElevenLabs voice with a standard (non-Flash)
 * model (`model_id` in text-to-speech/repository.ts and
 * ai-stream/.../streaming-tts.ts), so the multilingual rate applies.
 *
 * Voice IDs can't be checked keylessly (the voices API needs xi-api-key), so
 * this fetcher only verifies the price.
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { ttsModelDefinitions } from "../../../text-to-speech/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const PRICING_URL = "https://elevenlabs.io/pricing/api";

/** Standard-model rate, FAQ wording first, model card as fallback. */
const STANDARD_RATE_REGEXES = [
  /Text to Speech \$(\d+(?:\.\d+)?) per 1,000 characters \(multilingual models\)/i,
  /v2 Multilingual Text to Speech \$(\d+(?:\.\d+)?) Price per 1K characters/i,
];

function htmlToText(html: string): string {
  return html
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replaceAll(/\s+/g, " ");
}

async function fetchUsdPerChar(
  logger: EndpointLogger,
): Promise<{ usdPerChar: number } | { error: string }> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API
    const response = await fetch(PRICING_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; unbottled-ai/1.0)" },
    });
    if (!response.ok) {
      return {
        error: `ElevenLabs pricing page returned ${response.status.toString()}`,
      };
    }
    const text = htmlToText(await response.text());
    for (const regex of STANDARD_RATE_REGEXES) {
      const match = regex.exec(text);
      const usdPer1k = match ? parseFloat(match[1]) : NaN;
      if (!isNaN(usdPer1k) && usdPer1k > 0) {
        logger.debug("ElevenLabs API rate parsed", { usdPer1k });
        return { usdPerChar: usdPer1k / 1000 };
      }
    }
    return {
      error: `No Text to Speech rate found on ${PRICING_URL} - page layout changed? Update STANDARD_RATE_REGEXES in elevenlabs.ts`,
    };
  } catch (err) {
    return { error: parseError(err).message };
  }
}

export class ElevenLabsPriceFetcher extends PriceFetcher {
  readonly providerName = "elevenlabs";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const rate = await fetchUsdPerChar(logger);
    if ("error" in rate) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        failures,
        error: rate.error,
        // Could not check: keep prior verified state instead of disabling.
        failedApiProviders: [ApiProvider.ELEVENLABS],
      };
    }

    for (const def of Object.values(ttsModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.ELEVENLABS ||
          !("creditCostPerCharacter" in providerConfig)
        ) {
          continue;
        }
        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.ELEVENLABS,
          field: "creditCostPerCharacter",
          value: this.usdToCreditsPrecise(rate.usdPerChar),
          source: PRICING_URL,
          providerModel: providerConfig.providerModel,
        });
      }
    }

    logger.debug("ElevenLabs TTS prices set", {
      count: updates.length,
      usdPerChar: rate.usdPerChar,
    });

    return {
      provider: this.providerName,
      modelsFound: updates.length,
      modelsUpdated: updates.length,
      updates,
      failures,
    };
  }
}
