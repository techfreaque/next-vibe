/**
 * Fal.ai price fetcher - static prices only.
 *
 * TODO: Fal.ai has no machine-readable pricing API.
 * Update FAL_AI_STATIC_PRICES manually when Fal.ai changes pricing:
 * https://fal.ai/pricing
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { ApiProvider, modelDefinitions } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

// USD per clip (audio generation models)
const FAL_AI_CLIP_PRICES: Record<string, number> = {
  "fal-ai/udio": 0.05, // ~$0.05 per 30s clip
  "fal-ai/stable-audio": 0.01, // ~$0.01 per clip (GPU-A100 compute, ~20s generation time)
};

// USD per image (image generation models - $0.003/megapixel at 1MP default)
const FAL_AI_IMAGE_PRICES: Record<string, number> = {
  "fal-ai/flux/schnell": 0.003, // $0.003/megapixel at 1MP (1024×1024)
};

export class FalAiPriceFetcher extends PriceFetcher {
  readonly providerName = "fal-ai";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    for (const def of Object.values(modelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (providerConfig.apiProvider !== ApiProvider.FAL_AI) {
          continue;
        }

        const isClip = "creditCostPerClip" in providerConfig;
        const isImage = "creditCostPerImage" in providerConfig;
        if (!isClip && !isImage) {
          continue;
        }

        const prices = isImage ? FAL_AI_IMAGE_PRICES : FAL_AI_CLIP_PRICES;
        const usd = prices[providerConfig.providerModel];
        if (usd === undefined) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.FAL_AI,
            reason:
              "No static price defined - update FAL_AI_CLIP_PRICES or FAL_AI_IMAGE_PRICES in fal-ai.ts manually",
          });
          logger.debug("Fal.ai: no static price defined", {
            providerModel: providerConfig.providerModel,
          });
          continue;
        }

        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.FAL_AI,
          field: isImage ? "creditCostPerImage" : "creditCostPerClip",
          value: this.usdToCredits(usd),
          source: "fal-ai-static",
          providerModel: providerConfig.providerModel,
        });
      }
    }

    return {
      provider: this.providerName,
      modelsFound: updates.length + failures.length,
      modelsUpdated: updates.length,
      updates,
      failures,
    };
  }
}
