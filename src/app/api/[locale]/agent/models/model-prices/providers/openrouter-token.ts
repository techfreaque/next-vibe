/**
 * OpenRouter token-based LLM price fetcher.
 * Fetches per-million-token pricing and context windows from:
 * GET https://openrouter.ai/api/v1/models
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { ApiProvider, ModelId, modelDefinitions } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

interface OpenRouterModel {
  id: string;
  name: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
    input_cache_read?: string;
    input_cache_write?: string;
  };
}

export class OpenRouterTokenPriceFetcher extends PriceFetcher {
  readonly providerName = "openrouter-token";
  private static readonly API_URL = "https://openrouter.ai/api/v1/models";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    let rawModels: OpenRouterModel[] = [];
    try {
      const response = await fetch(OpenRouterTokenPriceFetcher.API_URL, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        return {
          provider: this.providerName,
          modelsFound: 0,
          modelsUpdated: 0,
          updates,
          failures,
          error: `API responded with ${response.status}`,
        };
      }
      const data = (await response.json()) as { data: OpenRouterModel[] };
      rawModels = data.data;
      logger.debug("OpenRouter token API fetched", { count: rawModels.length });
    } catch (err) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        failures,
        error: parseError(err).message,
      };
    }

    const modelMap = new Map(rawModels.map((m) => [m.id, m]));

    for (const def of Object.values(modelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (providerConfig.apiProvider !== ApiProvider.OPENROUTER) {
          continue;
        }
        if (!("inputTokenCost" in providerConfig)) {
          continue;
        } // image models handled separately

        const raw = modelMap.get(providerConfig.providerModel);
        if (!raw) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.OPENROUTER,
            reason: `Not found in OpenRouter API (${providerConfig.providerModel})`,
          });
          continue;
        }

        const inputTokenCost =
          Math.round(parseFloat(raw.pricing.prompt) * 1_000_000 * 100) / 100;
        const outputTokenCost =
          Math.round(parseFloat(raw.pricing.completion) * 1_000_000 * 100) /
          100;
        const cacheReadTokenCost = raw.pricing.input_cache_read
          ? Math.round(
              parseFloat(raw.pricing.input_cache_read) * 1_000_000 * 100,
            ) / 100
          : undefined;
        const cacheWriteTokenCost = raw.pricing.input_cache_write
          ? Math.round(
              parseFloat(raw.pricing.input_cache_write) * 1_000_000 * 100,
            ) / 100
          : undefined;

        // Find enum key for contextWindow update
        const enumEntry = Object.entries(ModelId).find(
          // oxlint-disable-next-line no-unused-vars
          ([_, value]) => value === providerConfig.id,
        );
        const enumKey = enumEntry?.[0];

        if (enumKey) {
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.OPENROUTER,
            field: "contextWindow",
            value: raw.context_length,
            source: "openrouter-api",
            enumKey,
          });
        }

        updates.push(
          {
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.OPENROUTER,
            field: "inputTokenCost",
            value: inputTokenCost,
            source: "openrouter-api",
            providerModel: providerConfig.providerModel,
          },
          {
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.OPENROUTER,
            field: "outputTokenCost",
            value: outputTokenCost,
            source: "openrouter-api",
            providerModel: providerConfig.providerModel,
          },
        );

        if (cacheReadTokenCost !== undefined) {
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.OPENROUTER,
            field: "cacheReadTokenCost",
            value: cacheReadTokenCost,
            source: "openrouter-api",
            providerModel: providerConfig.providerModel,
          });
        }
        if (cacheWriteTokenCost !== undefined) {
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.OPENROUTER,
            field: "cacheWriteTokenCost",
            value: cacheWriteTokenCost,
            source: "openrouter-api",
            providerModel: providerConfig.providerModel,
          });
        }
      }
    }

    return {
      provider: this.providerName,
      modelsFound: rawModels.length,
      modelsUpdated: updates.filter((u) => u.field === "inputTokenCost").length,
      updates,
      failures,
    };
  }
}
