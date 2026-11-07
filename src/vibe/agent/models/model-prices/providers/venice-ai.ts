/**
 * Venice.ai token price fetcher.
 * Public, keyless model lists:
 * GET https://api.venice.ai/api/v1/models?type=text  (per-1M-token USD)
 * GET https://api.venice.ai/api/v1/models?type=image (USD per generation)
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { imageGenModelDefinitions } from "../../../image-generation/models";
import type { Modality } from "../../enum";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";
import {
  collectTokenPriceUpdates,
  type TokenPriceEntry,
} from "./token-price-collector";

const MODELS_API_URL = "https://api.venice.ai/api/v1/models?type=text";
const IMAGE_MODELS_API_URL = "https://api.venice.ai/api/v1/models?type=image";

interface VeniceUsdPrice {
  usd?: number;
}

interface VeniceModel {
  id: string;
  model_spec?: {
    availableContextTokens?: number;
    pricing?: {
      input?: VeniceUsdPrice;
      output?: VeniceUsdPrice;
      cache_input?: VeniceUsdPrice;
      cache_write?: VeniceUsdPrice;
      /** Higher tier billed past context_token_threshold */
      extended?: { context_token_threshold?: number };
      /** Image models: flat USD per generation */
      generation?: VeniceUsdPrice;
    };
    capabilities?: { supportsVision?: boolean };
  };
}

function toEntry(model: VeniceModel): TokenPriceEntry | undefined {
  const pricing = model.model_spec?.pricing;
  const input = pricing?.input?.usd;
  const output = pricing?.output?.usd;
  if (input === undefined || output === undefined) {
    return undefined;
  }
  const available = model.model_spec?.availableContextTokens;
  const threshold = pricing?.extended?.context_token_threshold;
  // We bill one flat rate — cap the window where Venice's surcharge starts.
  const contextWindow =
    available !== undefined && threshold !== undefined
      ? Math.min(available, threshold)
      : (available ?? threshold);
  const inputs: Modality[] = model.model_spec?.capabilities?.supportsVision
    ? ["text", "image"]
    : ["text"];
  return {
    input,
    output,
    cacheRead: pricing?.cache_input?.usd,
    cacheWrite: pricing?.cache_write?.usd,
    contextWindow,
    inputs,
    outputs: ["text"],
  };
}

export class VenicePriceFetcher extends PriceFetcher {
  readonly providerName = "venice-ai";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    let models: VeniceModel[];
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
      const data = (await response.json()) as { data?: VeniceModel[] };
      models = data.data ?? [];
      logger.debug("Venice.ai models API fetched", { count: models.length });
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
      apiProvider: ApiProvider.VENICE_AI,
      source: "venice-api",
      label: "Venice.ai",
      lookup: (providerModel) => {
        const model = byId.get(providerModel);
        return model ? toEntry(model) : undefined;
      },
    });

    const imageModels = await this.fetchImageModels(logger);
    const imageById = new Map(imageModels.map((m) => [m.id, m]));
    for (const def of Object.values(imageGenModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.VENICE_AI ||
          !("creditCostPerImage" in providerConfig)
        ) {
          continue;
        }
        const usd = imageById.get(providerConfig.providerModel)?.model_spec
          ?.pricing?.generation?.usd;
        if (usd === undefined) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.VENICE_AI,
            reason: `No flat generation price in Venice.ai API (${providerConfig.providerModel})`,
          });
          continue;
        }
        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.VENICE_AI,
          field: "creditCostPerImage",
          value: this.usdToCredits(usd),
          source: "venice-api",
          providerModel: providerConfig.providerModel,
        });
      }
    }

    return {
      provider: this.providerName,
      modelsFound: models.length + imageModels.length,
      modelsUpdated: updates.filter((u) => u.field === "inputTokenCost").length,
      updates,
      modalityUpdates,
      failures,
    };
  }

  /** Image list failures only cost the image prices — never the text ones. */
  private async fetchImageModels(
    logger: EndpointLogger,
  ): Promise<VeniceModel[]> {
    try {
      // oxlint-disable-next-line restricted/no-raw-fetch -- external API
      const response = await fetch(IMAGE_MODELS_API_URL, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        logger.warn("Venice.ai image models API failed", {
          status: response.status,
        });
        return [];
      }
      const data = (await response.json()) as { data?: VeniceModel[] };
      return data.data ?? [];
    } catch (err) {
      logger.warn("Venice.ai image models API failed", {
        error: parseError(err).message,
      });
      return [];
    }
  }
}
