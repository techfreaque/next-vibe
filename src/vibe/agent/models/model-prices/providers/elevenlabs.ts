/**
 * ElevenLabs TTS price fetcher.
 *
 * ElevenLabs API usage is billed in USD per 1K characters, one rate per model
 * (2026-11), published on the keyless, server-rendered page
 * https://elevenlabs.io/pricing/api as model cards:
 *   "v4 Text to Speech New $0.08 Price per 1K characters"
 *   "v4 Turbo Text to Speech New $0.04 Price per 1K characters"
 *
 * Each ElevenLabs route's providerModel is "<model_id>:<voice_id>"
 * (text-to-speech/elevenlabs.ts), so every route gets its own model's rate.
 *
 * Voice IDs can't be checked keylessly (the voices API needs xi-api-key), so
 * this fetcher only verifies the price.
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  ElevenLabsTtsModel,
  parseElevenLabsProviderModel,
} from "../../../text-to-speech/elevenlabs";
import { ttsModelDefinitions } from "../../../text-to-speech/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const PRICING_URL = "https://elevenlabs.io/pricing/api";

/** Model card label on the pricing page for each model we route to. */
const MODEL_CARD_LABELS: Record<ElevenLabsTtsModel, string> = {
  [ElevenLabsTtsModel.V4]: "v4",
  [ElevenLabsTtsModel.V4_TURBO]: "v4 Turbo",
};

function isKnownModel(modelId: string): modelId is ElevenLabsTtsModel {
  return modelId in MODEL_CARD_LABELS;
}

/** "v4 Text to Speech New $0.08 Price per 1K characters" ("New" is optional). */
function modelRateRegex(label: string): RegExp {
  const escaped = label.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `(?:^|\\s)${escaped} Text to Speech (?:New )?\\$(\\d+(?:\\.\\d+)?) Price per 1K characters`,
    "i",
  );
}

function htmlToText(html: string): string {
  return html
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replaceAll(/\s+/g, " ");
}

async function fetchUsdPerCharByModel(
  logger: EndpointLogger,
): Promise<
  { rates: Partial<Record<ElevenLabsTtsModel, number>> } | { error: string }
> {
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
    const rates: Partial<Record<ElevenLabsTtsModel, number>> = {};
    for (const model of Object.values(ElevenLabsTtsModel)) {
      const match = modelRateRegex(MODEL_CARD_LABELS[model]).exec(text);
      const usdPer1k = match ? parseFloat(match[1]) : NaN;
      if (!isNaN(usdPer1k) && usdPer1k > 0) {
        rates[model] = usdPer1k / 1000;
      }
    }
    if (Object.keys(rates).length === 0) {
      return {
        error: `No Text to Speech model rate found on ${PRICING_URL} - page layout changed? Update modelRateRegex in elevenlabs.ts`,
      };
    }
    logger.debug("ElevenLabs API rates parsed", rates);
    return { rates };
  } catch (err) {
    return { error: parseError(err).message };
  }
}

export class ElevenLabsPriceFetcher extends PriceFetcher {
  readonly providerName = "elevenlabs";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const parsed = await fetchUsdPerCharByModel(logger);
    if ("error" in parsed) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        failures,
        error: parsed.error,
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
        const { modelId } = parseElevenLabsProviderModel(
          providerConfig.providerModel,
        );
        const usdPerChar = isKnownModel(modelId)
          ? parsed.rates[modelId]
          : undefined;
        if (usdPerChar === undefined) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.ELEVENLABS,
            reason: `No ${PRICING_URL} rate for ElevenLabs model "${modelId}"`,
          });
          continue;
        }
        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.ELEVENLABS,
          field: "creditCostPerCharacter",
          value: this.usdToCreditsPrecise(usdPerChar),
          source: PRICING_URL,
          providerModel: providerConfig.providerModel,
        });
      }
    }

    logger.debug("ElevenLabs TTS prices set", {
      count: updates.length,
      failures: failures.length,
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
