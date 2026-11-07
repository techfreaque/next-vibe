/**
 * NanoGPT token price fetcher.
 * Public, keyless model list with per-1M-token USD pricing:
 * GET https://nano-gpt.com/api/v1/models?detailed=true
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { Modality } from "../../enum";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";
import {
  collectTokenPriceUpdates,
  type TokenPriceEntry,
} from "./token-price-collector";

const MODELS_API_URL = "https://nano-gpt.com/api/v1/models?detailed=true";

interface NanoGptModel {
  id: string;
  context_length?: number | null;
  pricing?: {
    /** USD per 1M input tokens */
    prompt?: number;
    /** USD per 1M output tokens */
    completion?: number;
    /** USD per 1K cached input tokens */
    cacheReadInputPer1kTokens?: number;
    /** USD per 1K cache-write input tokens */
    cacheWriteInputPer1kTokens?: number;
    unit?: string;
  } | null;
  architecture?: {
    input_modalities?: string[];
  } | null;
}

function perThousandToPerMillion(
  value: number | undefined,
): number | undefined {
  return value === undefined ? undefined : value * 1000;
}

function toEntry(model: NanoGptModel): TokenPriceEntry | undefined {
  const pricing = model.pricing;
  if (
    !pricing ||
    pricing.unit !== "per_million_tokens" ||
    pricing.prompt === undefined ||
    pricing.completion === undefined
  ) {
    return undefined;
  }
  const inputs: Modality[] = model.architecture?.input_modalities?.includes(
    "image",
  )
    ? ["text", "image"]
    : ["text"];
  return {
    input: pricing.prompt,
    output: pricing.completion,
    cacheRead: perThousandToPerMillion(pricing.cacheReadInputPer1kTokens),
    cacheWrite: perThousandToPerMillion(pricing.cacheWriteInputPer1kTokens),
    contextWindow: model.context_length ?? undefined,
    inputs,
    outputs: ["text"],
  };
}

export class NanoGptPriceFetcher extends PriceFetcher {
  readonly providerName = "nano-gpt";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    let models: NanoGptModel[];
    try {
      // oxlint-disable-next-line restricted/no-raw-fetch -- external API
      const response = await fetch(MODELS_API_URL, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        return {
          provider: this.providerName,
          modelsFound: 0,
          modelsUpdated: 0,
          updates: [],
          failures: [],
          error: `API responded with ${response.status}`,
        };
      }
      const data = (await response.json()) as { data?: NanoGptModel[] };
      models = data.data ?? [];
      logger.debug("NanoGPT models API fetched", { count: models.length });
    } catch (err) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates: [],
        failures: [],
        error: parseError(err).message,
      };
    }

    const byId = new Map(models.map((m) => [m.id, m]));
    const { updates, modalityUpdates, failures } = collectTokenPriceUpdates({
      apiProvider: ApiProvider.NANO_GPT,
      source: "nano-gpt-api",
      label: "NanoGPT",
      lookup: (providerModel) => {
        const model = byId.get(providerModel);
        return model ? toEntry(model) : undefined;
      },
    });

    return {
      provider: this.providerName,
      modelsFound: models.length,
      modelsUpdated: updates.filter((u) => u.field === "inputTokenCost").length,
      updates,
      modalityUpdates,
      failures,
    };
  }
}
