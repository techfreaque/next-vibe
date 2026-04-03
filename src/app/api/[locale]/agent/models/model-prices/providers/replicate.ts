/**
 * Replicate image generation price fetcher.
 * Primary: GET https://api.replicate.com/v1/models/{owner}/{name} (authenticated)
 * Fallback: HTML scrape from https://replicate.com/{owner}/{model}
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { imageGenModelDefinitions } from "../../../image-generation/models";
import { musicGenModelDefinitions } from "../../../music-generation/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

interface ReplicateModelResponse {
  billing?: {
    prices?: Array<{ metric: string; price: string }>;
    p50_price?: string;
  };
}

export class ReplicatePriceFetcher extends PriceFetcher {
  readonly providerName = "replicate";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];

    for (const def of [
      ...Object.values(imageGenModelDefinitions),
      ...Object.values(musicGenModelDefinitions),
    ]) {
      for (const providerConfig of def.providers) {
        if (providerConfig.apiProvider !== ApiProvider.REPLICATE) {
          continue;
        }

        const isImage = "creditCostPerImage" in providerConfig;
        const isAudio = "creditCostPerClip" in providerConfig;
        if (!isImage && !isAudio) {
          continue;
        }

        const parts = providerConfig.providerModel.split("/");
        if (parts.length !== 2) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.REPLICATE,
            reason: `Invalid providerModel format: ${providerConfig.providerModel}`,
          });
          continue;
        }

        const [owner, model] = parts;
        const result = await this.fetchOneModel(owner, model, logger);
        if (result) {
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.REPLICATE,
            field: isImage ? "creditCostPerImage" : "creditCostPerClip",
            value: this.usdToCredits(result.usd),
            source: result.source,
            providerModel: providerConfig.providerModel,
          });
        } else {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.REPLICATE,
            reason: `No pricing found for ${providerConfig.providerModel}`,
          });
        }
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

  private async fetchOneModel(
    owner: string,
    model: string,
    logger: EndpointLogger,
  ): Promise<{ usd: number; source: string } | null> {
    const apiToken = agentEnv.REPLICATE_API_TOKEN;

    if (apiToken) {
      try {
        const response = await fetch(
          `https://api.replicate.com/v1/models/${owner}/${model}`,
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (response.ok) {
          const data = (await response.json()) as ReplicateModelResponse;

          if (data.billing?.prices?.length) {
            for (const entry of data.billing.prices) {
              const m = entry.price.match(/\$(\d+\.?\d*)/);
              if (m) {
                const usd = parseFloat(m[1]);
                if (!isNaN(usd) && usd > 0) {
                  return { usd, source: "replicate-api" };
                }
              }
            }
          }
          if (data.billing?.p50_price) {
            const m = data.billing.p50_price.match(/\$(\d+\.?\d*)/);
            if (m) {
              const usd = parseFloat(m[1]);
              if (!isNaN(usd) && usd > 0) {
                return { usd, source: "replicate-api-p50" };
              }
            }
          }
        }
      } catch (err) {
        logger.debug("Replicate API fetch error", {
          owner,
          model,
          error: parseError(err).message,
        });
      }
    }

    // Fall back to HTML scraping
    try {
      const response = await fetch(`https://replicate.com/${owner}/${model}`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; unbottled-ai/1.0)" },
      });
      if (!response.ok) {
        return null;
      }
      const html = await response.text();

      const perImageMatch = html.match(/"prices":\s*\[([^\]]+)\]/);
      if (perImageMatch) {
        const m = perImageMatch[1].match(/"price":\s*"\\?\$(\d+\.?\d*)"/);
        if (m) {
          const usd = parseFloat(m[1]);
          if (!isNaN(usd) && usd > 0) {
            return { usd, source: "replicate-html-per-image" };
          }
        }
      }

      const p50Match = html.match(/"p50price":\s*"\\?\$(\d+\.?\d*)"/);
      if (p50Match) {
        const usd = parseFloat(p50Match[1]);
        if (!isNaN(usd) && usd > 0) {
          return { usd, source: "replicate-html-p50" };
        }
      }
    } catch (err) {
      logger.debug("Replicate HTML scrape error", {
        owner,
        model,
        error: parseError(err).message,
      });
    }

    return null;
  }
}
