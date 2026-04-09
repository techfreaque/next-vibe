/**
 * OpenRouter image generation price fetcher.
 * Fetches per-image USD from the frontend models API:
 * GET https://openrouter.ai/api/frontend/models
 *
 * Supported pricing_json keys (flat per-image models only):
 *   bfl:informational_output_megapixels   - USD per MP (1 MP ≈ 1024×1024)
 *   sourceful:cents_per_image_output      - cents per image (÷ 100)
 *   sourceful:cents_per_2k_image_output   - cents per 2K image (÷ 100)
 *   sourceful:cents_per_4k_image_output   - cents per 4K image (÷ 100)
 *   seedream:cents_per_image_output       - cents per image (÷ 100)
 *
 * Resolution tiers come from display_pricing[0].tiers - used to populate
 * supportedResolutions and pricingByResolution on Riverflow models.
 *
 * Token-based image models (gemini image-preview, gpt-5-image, etc.) use
 * inputTokenCost/outputTokenCost and are priced by openrouter-token instead.
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { imageGenModelDefinitions } from "../../../image-generation/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult, SettingsUpdate } from "./base";
import { PriceFetcher } from "./base";

interface DisplayPricingTier {
  sku_label: string;
  price: string;
}

interface DisplayPricingEntry {
  sku_label?: string;
  price?: string;
  tiers?: DisplayPricingTier[];
}

interface OpenRouterEndpoint {
  pricing_json?: Record<string, number | string>;
  pricing?: {
    display_pricing?: DisplayPricingEntry[];
  };
  supported_parameters?: string[];
}

interface OpenRouterFrontendModel {
  slug: string;
  endpoint?: OpenRouterEndpoint;
}

interface ParsedImageModel {
  usdPerImage: number;
  /** resolution label → USD price (e.g. { "1024px": 0.15, "2048px": 0.15, "4096px": 0.33 }) */
  resolutionTiers?: Record<string, number>;
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

/**
 * Extract resolution-tiered pricing from display_pricing tiers.
 * Returns null if there are no tiers or only one tier (flat pricing).
 * Tier labels like "1024px", "2048px", "4096px" map to USD prices.
 */
function extractResolutionTiers(
  endpoint: OpenRouterEndpoint,
): Record<string, number> | null {
  const displayPricing = endpoint.pricing?.display_pricing;
  if (!displayPricing?.length) {
    return null;
  }

  // Look for the primary image output entry with tiers
  const imageEntry = displayPricing.find(
    (e) =>
      (e.sku_label?.toLowerCase().includes("image") ||
        e.sku_label?.toLowerCase().includes("output")) &&
      e.tiers &&
      e.tiers.length > 1,
  );
  if (!imageEntry?.tiers) {
    return null;
  }

  const result: Record<string, number> = {};
  for (const tier of imageEntry.tiers) {
    const label = tier.sku_label?.trim();
    const price = parseFloat(tier.price ?? "");
    if (label && !isNaN(price) && price > 0) {
      result[label] = price;
    }
  }
  return Object.keys(result).length > 1 ? result : null;
}

export class OpenRouterImagePriceFetcher extends PriceFetcher {
  readonly providerName = "openrouter-image";
  private static readonly API_URL = "https://openrouter.ai/api/frontend/models";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const settingsUpdates: SettingsUpdate[] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const priceMap = new Map<string, ParsedImageModel>();
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
        const ep = model.endpoint;
        if (!ep) {
          continue;
        }
        const pj = ep.pricing_json;
        if (!pj) {
          continue;
        }
        const usd = derivePerImageUsd(pj);
        if (usd !== null && usd > 0) {
          const resolutionTiers = extractResolutionTiers(ep) ?? undefined;
          priceMap.set(model.slug, { usdPerImage: usd, resolutionTiers });
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

    const source = "openrouter-api";

    for (const def of Object.values(imageGenModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.OPENROUTER ||
          !("creditCostPerImage" in providerConfig)
        ) {
          continue;
        }

        const parsed = priceMap.get(providerConfig.providerModel);
        if (!parsed) {
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
          value: this.usdToCredits(parsed.usdPerImage),
          source,
          providerModel: providerConfig.providerModel,
        });

        // Emit resolution tier pricing and supportedResolutions when available
        if (parsed.resolutionTiers) {
          const resLabels = Object.keys(parsed.resolutionTiers);

          // supportedResolutions: ["1024px", "2048px", "4096px"]
          const resStrings = resLabels.map((r) => `"${r}"`);
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "supportedResolutions",
            tsLiteral: `[${resStrings.join(", ")}]`,
            source,
          });

          // pricingByResolution: { "1024px": credits, "2048px": credits, ... }
          const creditsMap: Record<string, number> = {};
          for (const [label, usd] of Object.entries(parsed.resolutionTiers)) {
            creditsMap[label] = this.usdToCredits(usd);
          }
          const pricingLiteral = JSON.stringify(creditsMap).replace(/,/g, ", ");
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "pricingByResolution",
            tsLiteral: pricingLiteral,
            source,
          });
        }
      }
    }

    return {
      provider: this.providerName,
      modelsFound: priceMap.size,
      modelsUpdated: updates.length,
      updates,
      settingsUpdates,
      failures,
    };
  }
}
