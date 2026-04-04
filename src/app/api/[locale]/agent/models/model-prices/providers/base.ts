/**
 * Abstract base class for all price fetchers.
 * Each provider extends this and implements fetch().
 */

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { CREDIT_VALUE_USD } from "@/app/api/[locale]/products/constants";
import type { Modality } from "../../enum";
import type { ApiProvider } from "../../models";

export interface ModalityUpdate {
  modelId: string;
  name: string;
  provider: ApiProvider;
  /** enum key for locating the model block (e.g. "GPT_5_2_PRO") */
  enumKey: string;
  inputs: Modality[];
  outputs: Modality[];
  source: string;
}

export interface PriceUpdate {
  modelId: string;
  name: string;
  provider: ApiProvider;
  field:
    | "creditCost"
    | "creditCostPerImage"
    | "creditCostPerClip"
    | "creditCostPerSecond"
    | "creditCostPerCharacter"
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
  modelId: string;
  provider: ApiProvider;
  reason: string;
}

/** Update for array/object settings fields on provider configs (e.g. supportedDurations, pricingByResolution) */
export interface SettingsUpdate {
  /** The providerModel string to locate the block in models.ts */
  providerModel: string;
  /** Field name to insert/update (e.g. "supportedDurations", "pricingByResolution") */
  field: string;
  /** TypeScript literal value to write (e.g. '["5", "10"]' or '{ "720p": 10, "1080p": 15 }') */
  tsLiteral: string;
  source: string;
}

/**
 * Add or remove a provider entry in a model's `providers[]` array.
 * Used by the Unbottled fetcher to dynamically manage UNBOTTLED entries.
 */
export interface ProviderEntryOperation {
  /** "add" inserts a new entry; "remove" deletes an existing entry */
  action: "add" | "remove";
  /** The role/category this model belongs to (chat, image-gen, etc.) */
  role: string;
  /** Enum key of the model definition (e.g. "GPT_5_4") */
  enumKey: string;
  /** The model ID value (e.g. "gpt-54") */
  modelId: string;
  /** API provider for the entry */
  provider: ApiProvider;
  /** Provider model string for the entry (used as providerModel in source) */
  providerModel: string;
  /** Credit cost for the entry (for add operations) */
  creditCost?: number;
  /** Source for the update comment */
  source: string;
}

export interface ProviderPriceResult {
  provider: string;
  modelsFound: number;
  modelsUpdated: number;
  updates: PriceUpdate[];
  modalityUpdates?: ModalityUpdate[];
  settingsUpdates?: SettingsUpdate[];
  /** Operations to add/remove provider entries in model definitions */
  providerEntryOps?: ProviderEntryOperation[];
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
