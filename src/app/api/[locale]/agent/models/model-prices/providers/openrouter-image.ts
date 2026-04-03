/**
 * OpenRouter image generation price fetcher.
 * Fetches per-image USD from the frontend models API:
 * GET https://openrouter.ai/api/frontend/models
 *
 * Supported pricing_json keys (flat per-image models only):
 *   bfl:informational_output_megapixels   - USD per MP (1 MP ≈ 1024×1024)
 *   sourceful:cents_per_image_output      - cents per image (÷ 100)
 *   seedream:cents_per_image_output       - cents per image (÷ 100)
 *
 * Token-based image models (gemini image-preview, gpt-5-image, etc.) use
 * inputTokenCost/outputTokenCost and are priced by openrouter-token instead.
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { imageGenModelDefinitions } from "../../../image-generation/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

interface OpenRouterFrontendModel {
  slug: string;
  endpoint?: {
    pricing_json?: Record<string, number | string>;
  };
}

function derivePerImageUsd(
  pricingJson: Record<string, number | string>,
): number | null {
  const n = (k: string): number | null => {
    const v = pricingJson[k];
    if (v === undefined) {
      return null;
    }
    const f = typeof v === "string" ? parseFloat(v) : v;
    return isNaN(f) ? null : f;
  };

  const bflMp = n("bfl:informational_output_megapixels");
  if (bflMp !== null && bflMp > 0) {
    return bflMp;
  }

  const sourcefulCents = n("sourceful:cents_per_image_output");
  if (sourcefulCents !== null && sourcefulCents > 0) {
    return sourcefulCents / 100;
  }

  const seedreamCents = n("seedream:cents_per_image_output");
  if (seedreamCents !== null && seedreamCents > 0) {
    return seedreamCents / 100;
  }

  return null;
}

export class OpenRouterImagePriceFetcher extends PriceFetcher {
  readonly providerName = "openrouter-image";
  private static readonly API_URL = "https://openrouter.ai/api/frontend/models";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const priceMap = new Map<string, number>();
    try {
      const response = await fetch(OpenRouterImagePriceFetcher.API_URL, {
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
      const data = (await response.json()) as {
        data: OpenRouterFrontendModel[];
      };
      for (const model of data.data) {
        const pj = model.endpoint?.pricing_json;
        if (!pj) {
          continue;
        }
        const usd = derivePerImageUsd(pj);
        if (usd !== null && usd > 0) {
          priceMap.set(model.slug, usd);
        }
      }
      logger.debug("OpenRouter image prices fetched", { count: priceMap.size });
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

    for (const def of Object.values(imageGenModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.OPENROUTER ||
          !("creditCostPerImage" in providerConfig)
        ) {
          continue;
        }

        const usd = priceMap.get(providerConfig.providerModel);
        if (usd === undefined) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.OPENROUTER,
            reason: `Not found in OpenRouter frontend API (${providerConfig.providerModel})`,
          });
          continue;
        }

        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.OPENROUTER,
          field: "creditCostPerImage",
          value: this.usdToCredits(usd),
          source: "openrouter-api",
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
