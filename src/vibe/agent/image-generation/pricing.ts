import { STANDARD_MARKUP_PERCENTAGE } from "@/products/constants";

import { type ModelOptionImageBased, roundMediaCost } from "../models/models";

/**
 * Calculate image generation credit cost with option-aware pricing.
 * Uses pricingBySize/pricingByQuality overrides when available,
 * falls back to base creditCostPerImage.
 */
export function calculateImageCreditCost(
  model: ModelOptionImageBased,
  size: string,
  quality: string,
): number {
  // Check for size-specific pricing override
  const baseCost =
    model.pricingBySize?.[size] ??
    model.pricingByQuality?.[quality] ??
    model.creditCostPerImage;

  // If both size and quality have overrides, use the size price as base
  // and apply quality as a multiplier or override
  let finalCost = baseCost;
  if (
    model.pricingBySize?.[size] !== undefined &&
    model.pricingByQuality?.[quality] !== undefined
  ) {
    finalCost = model.pricingByQuality[quality] ?? baseCost;
  }

  // Rounded UP to 0.1 credit (never under-bills).
  return roundMediaCost(finalCost * (1 + STANDARD_MARKUP_PERCENTAGE));
}
