/**
 * Abstract base class for all price fetchers.
 * Each provider extends this and implements fetch().
 */

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { CREDIT_VALUE_USD } from "@/app/api/[locale]/products/constants";
import type { ApiProvider, ModelId } from "../../models";

export interface PriceUpdate {
  modelId: ModelId;
  name: string;
  provider: ApiProvider;
  field:
    | "creditCostPerImage"
    | "creditCostPerClip"
    | "inputTokenCost"
    | "outputTokenCost"
    | "cacheReadTokenCost"
    | "cacheWriteTokenCost"
    | "contextWindow";
  value: number;
  source: string;
  /** providerModel string for locating the block in models.ts (undefined for contextWindow) */
  providerModel?: string;
  /** enum key for contextWindow updates (e.g. "GPT_5_2_PRO") */
  enumKey?: string;
}

export interface PriceFailure {
  modelId: ModelId;
  provider: ApiProvider;
  reason: string;
}

export interface ProviderPriceResult {
  provider: string;
  modelsFound: number;
  modelsUpdated: number;
  updates: PriceUpdate[];
  failures: PriceFailure[];
  error?: string;
}

export abstract class PriceFetcher {
  abstract readonly providerName: string;

  abstract fetch(logger: EndpointLogger): Promise<ProviderPriceResult>;

  protected usdToCredits(usd: number): number {
    const raw = usd / CREDIT_VALUE_USD;
    const rounded = Math.round(raw * 10000) / 10000;
    return rounded % 1 === 0 ? Math.round(rounded) : rounded;
  }
}
