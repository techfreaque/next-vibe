/**
 * Venice.ai token price fetcher.
 * Public, keyless model lists:
 * GET https://api.venice.ai/api/v1/models?type=text  (per-1M-token USD)
 * GET https://api.venice.ai/api/v1/models?type=all (USD per generation or edit)
 * POST https://api.venice.ai/api/v1/video/quote (USD per clip; the video
 *   list carries no prices, so each Venice video route is quoted per
 *   resolution at its longest clip and divided back to $/s)
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { imageGenModelDefinitions } from "../../../image-generation/models";
import { videoGenModelDefinitions } from "../../../video-generation/models";
import type { Modality } from "../../enum";
import {
  ApiProvider,
  type ModelProviderConfig,
  type ModelProviderConfigVideoBased,
} from "../../models";
import type { ProviderPriceResult, SettingsUpdate } from "./base";
import { PriceFetcher } from "./base";
import {
  collectTokenPriceUpdates,
  type TokenPriceEntry,
} from "./token-price-collector";

const MODELS_API_URL = "https://api.venice.ai/api/v1/models?type=text";
const ALL_MODELS_API_URL = "https://api.venice.ai/api/v1/models?type=all";
const VIDEO_QUOTE_API_URL = "https://api.venice.ai/api/v1/video/quote";

interface VeniceUsdPrice {
  usd?: number;
}

interface VeniceModel {
  id: string;
  type?: string;
  model_spec?: {
    availableContextTokens?: number;
    constraints?: { defaultResolution?: string };
    pricing?: {
      input?: VeniceUsdPrice;
      output?: VeniceUsdPrice;
      cache_input?: VeniceUsdPrice;
      cache_write?: VeniceUsdPrice;
      /** Higher tier billed past context_token_threshold */
      extended?: { context_token_threshold?: number };
      /** Image models: flat USD per generation */
      generation?: VeniceUsdPrice;
      inpaint?: VeniceUsdPrice;
      resolutions?: Record<string, VeniceUsdPrice>;
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

/** Per-second priced (video) route: only video configs carry this field. */
function isVideoRoute(
  config: ModelProviderConfig,
): config is ModelProviderConfigVideoBased {
  return config.creditCostPerSecond !== undefined;
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
        const spec = imageById.get(providerConfig.providerModel)?.model_spec;
        const resolution = spec?.constraints?.defaultResolution;
        const usd =
          spec?.pricing?.generation?.usd ??
          spec?.pricing?.inpaint?.usd ??
          (resolution
            ? spec?.pricing?.resolutions?.[resolution]?.usd
            : undefined);
        if (usd === undefined) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.VENICE_AI,
            reason: `No flat generation or edit price in Venice.ai API (${providerConfig.providerModel})`,
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

    const settingsUpdates: SettingsUpdate[] = [];
    await this.collectVideoPrices(updates, settingsUpdates, failures);

    return {
      provider: this.providerName,
      modelsFound: models.length + imageModels.length,
      modelsUpdated: updates.filter((u) => u.field === "inputTokenCost").length,
      updates,
      modalityUpdates,
      settingsUpdates,
      failures,
    };
  }

  /**
   * Venice video routes: quote the longest clip per resolution (quotes are
   * rounded to the cent, a long clip keeps $/s exact) plus one quote without
   * a resolution, which is what Venice bills when none is sent (the base
   * creditCostPerSecond).
   */
  private async collectVideoPrices(
    updates: ProviderPriceResult["updates"],
    settingsUpdates: SettingsUpdate[],
    failures: ProviderPriceResult["failures"],
  ): Promise<void> {
    for (const def of Object.values(videoGenModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.VENICE_AI ||
          !isVideoRoute(providerConfig)
        ) {
          continue;
        }
        const seconds = Math.max(
          ...(providerConfig.supportedDurations?.map(Number) ?? []),
          providerConfig.maxDurationSeconds ?? 0,
          providerConfig.defaultDurationSeconds,
        );
        const base = await this.quoteVideo(
          providerConfig.providerModel,
          seconds,
          undefined,
        );
        if (base === undefined) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.VENICE_AI,
            reason: `No Venice.ai video quote (${providerConfig.providerModel})`,
          });
          continue;
        }
        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.VENICE_AI,
          field: "creditCostPerSecond",
          value: this.usdToCredits(base / seconds),
          source: "venice-api",
          providerModel: providerConfig.providerModel,
        });
        const resolutions = providerConfig.supportedResolutions ?? [];
        if (resolutions.length < 2) {
          continue;
        }
        const creditsByRes: Record<string, number> = {};
        for (const resolution of resolutions) {
          const usd = await this.quoteVideo(
            providerConfig.providerModel,
            seconds,
            resolution,
          );
          if (usd === undefined) {
            break;
          }
          creditsByRes[resolution] = this.usdToCredits(usd / seconds);
        }
        // All or nothing: a partial map would bill missing tiers the base rate.
        if (Object.keys(creditsByRes).length === resolutions.length) {
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "pricingByResolution",
            tsLiteral: JSON.stringify(creditsByRes),
            source: "venice-api",
          });
        }
      }
    }
  }

  /** USD for one clip, or undefined when Venice gives no usable quote. */
  private async quoteVideo(
    model: string,
    seconds: number,
    resolution: string | undefined,
  ): Promise<number | undefined> {
    try {
      // oxlint-disable-next-line restricted/no-raw-fetch -- external API
      const response = await fetch(VIDEO_QUOTE_API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          duration: `${String(seconds)}s`,
          ...(resolution ? { resolution } : {}),
        }),
      });
      if (!response.ok) {
        return undefined;
      }
      const data = (await response.json()) as { quote?: number };
      return typeof data.quote === "number" && data.quote > 0
        ? data.quote
        : undefined;
    } catch {
      return undefined;
    }
  }

  /** Image list failures only cost the image prices — never the text ones. */
  private async fetchImageModels(
    logger: EndpointLogger,
  ): Promise<VeniceModel[]> {
    try {
      // oxlint-disable-next-line restricted/no-raw-fetch -- external API
      const response = await fetch(ALL_MODELS_API_URL, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        logger.warn("Venice.ai image models API failed", {
          status: response.status,
        });
        return [];
      }
      const data = (await response.json()) as { data?: VeniceModel[] };
      return (data.data ?? []).filter(
        (model) => model.type === "image" || model.type === "inpaint",
      );
    } catch (err) {
      logger.warn("Venice.ai image models API failed", {
        error: parseError(err).message,
      });
      return [];
    }
  }
}
