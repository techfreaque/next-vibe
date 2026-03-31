/**
 * Fal.ai price fetcher — static prices only.
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

// USD per clip
const FAL_AI_STATIC_PRICES: Record<string, number> = {
  "fal-ai/udio": 0.05, // ~$0.05 per 30s clip
};

export class FalAiPriceFetcher extends PriceFetcher {
  readonly providerName = "fal-ai";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    for (const def of Object.values(modelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.FAL_AI ||
          !("creditCostPerClip" in providerConfig)
        ) {
          continue;
        }

        const usd = FAL_AI_STATIC_PRICES[providerConfig.providerModel];
        if (usd === undefined) {
          // TODO: No live pricing API for Fal.ai.
          // Add static price here when Fal.ai releases a new model or changes pricing.
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.FAL_AI,
            reason:
              "No static price defined — update FAL_AI_STATIC_PRICES in fal-ai.ts manually",
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
          field: "creditCostPerClip",
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
