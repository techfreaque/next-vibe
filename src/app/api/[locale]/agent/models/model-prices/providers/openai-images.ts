/**
 * OpenAI Images price fetcher - static prices only.
 *
 * TODO: OpenAI has no machine-readable pricing API.
 * Update OPENAI_IMAGE_STATIC_PRICES manually when OpenAI changes pricing:
 * https://openai.com/api/pricing
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { ApiProvider, modelDefinitions } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

// USD per image - standard quality 1024×1024
const OPENAI_IMAGE_STATIC_PRICES: Record<string, number> = {
  "dall-e-3": 0.04,
  "gpt-image-1": 0.02,
};

export class OpenAiImagePriceFetcher extends PriceFetcher {
  readonly providerName = "openai-images";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    for (const def of Object.values(modelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.OPENAI_IMAGES ||
          !("creditCostPerImage" in providerConfig)
        ) {
          continue;
        }

        const usd = OPENAI_IMAGE_STATIC_PRICES[providerConfig.providerModel];
        if (usd === undefined) {
          // TODO: No live pricing API for OpenAI Images.
          // Add static price here when OpenAI releases a new image model.
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.OPENAI_IMAGES,
            reason:
              "No static price defined - update OPENAI_IMAGE_STATIC_PRICES in openai-images.ts manually",
          });
          logger.debug("OpenAI Images: no static price defined", {
            providerModel: providerConfig.providerModel,
          });
          continue;
        }

        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.OPENAI_IMAGES,
          field: "creditCostPerImage",
          value: this.usdToCredits(usd),
          source: "openai-static",
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
