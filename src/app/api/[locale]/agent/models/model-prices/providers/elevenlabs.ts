/**
 * ElevenLabs TTS price fetcher.
 *
 * Uses the ElevenLabs authenticated API to fetch our actual subscription tier,
 * then computes the real per-character cost in USD based on plan overage rates.
 *
 * ElevenLabs pricing model:
 *   - Plans include a monthly character allowance
 *   - Overages (and API usage beyond the plan) are billed per character
 *   - Cost per character depends on subscription tier:
 *       Creator: $0.30/1K chars  → $0.0003/char
 *       Pro:     $0.24/1K chars  → $0.00024/char
 *       Scale:   $0.18/1K chars  → $0.00018/char
 *       Business:$0.12/1K chars  → $0.00012/char
 *
 * If no API key is available, we fall back to the Creator (lowest) plan rate.
 *
 * API: GET https://api.elevenlabs.io/v1/user/subscription
 * Docs: https://elevenlabs.io/docs/api-reference/user/get-user-subscription
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { ttsModelDefinitions } from "../../../text-to-speech/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const SUBSCRIPTION_URL = "https://api.elevenlabs.io/v1/user/subscription";

interface ElevenLabsSubscription {
  tier?: string;
  character_count?: number;
  character_limit?: number;
  next_character_count_reset_unix?: number;
}

/** USD per character by ElevenLabs plan tier */
const TIER_USD_PER_CHAR: Record<string, number> = {
  creator: 0.3 / 1000,
  pro: 0.24 / 1000,
  scale: 0.18 / 1000,
  business: 0.12 / 1000,
  enterprise: 0.12 / 1000, // enterprise ≤ business tier rate
  // Free / Starter tiers don't support significant API usage
  starter: 0.3 / 1000,
  free: 0.3 / 1000,
};

/** Default fallback: Creator plan rate (most common entry tier) */
const DEFAULT_USD_PER_CHAR = TIER_USD_PER_CHAR["creator"];

async function fetchUsdPerChar(
  logger: EndpointLogger,
): Promise<number | undefined> {
  const apiKey = agentEnv.ELEVENLABS_API_KEY;
  if (!apiKey) {
    logger.debug("ElevenLabs: no API key - cannot fetch subscription tier");
    return undefined;
  }

  try {
    const response = await fetch(SUBSCRIPTION_URL, {
      headers: { "xi-api-key": apiKey },
    });
    if (!response.ok) {
      logger.debug("ElevenLabs subscription API error", {
        status: response.status,
      });
      return undefined;
    }

    const data = (await response.json()) as ElevenLabsSubscription;
    const tier = (data.tier ?? "creator").toLowerCase();
    const rate = TIER_USD_PER_CHAR[tier] ?? DEFAULT_USD_PER_CHAR;

    logger.debug("ElevenLabs subscription tier fetched", {
      tier,
      usdPerChar: rate,
    });
    return rate;
  } catch (err) {
    logger.debug("ElevenLabs subscription fetch failed", {
      error: parseError(err).message,
    });
    return undefined;
  }
}

export class ElevenLabsPriceFetcher extends PriceFetcher {
  readonly providerName = "elevenlabs";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const usdPerChar = await fetchUsdPerChar(logger);

    for (const def of Object.values(ttsModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.ELEVENLABS ||
          !("creditCostPerCharacter" in providerConfig)
        ) {
          continue;
        }

        if (usdPerChar === undefined) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.ELEVENLABS,
            reason:
              "ElevenLabs API key missing or subscription fetch failed - cannot verify price",
          });
          continue;
        }

        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.ELEVENLABS,
          field: "creditCostPerCharacter",
          value: this.usdToCredits(usdPerChar),
          source: SUBSCRIPTION_URL,
          providerModel: providerConfig.providerModel,
        });
      }
    }

    logger.debug("ElevenLabs TTS prices set", {
      count: updates.length,
      usdPerChar,
    });

    return {
      provider: this.providerName,
      modelsFound: updates.length + failures.length,
      modelsUpdated: updates.length,
      updates,
      failures,
    };
  }
}
