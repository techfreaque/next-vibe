/**
 * Unbottled AI price fetcher
 *
 * For each model, reads the primary (cheapest non-UNBOTTLED) provider entry,
 * applies 30% markup to all cost fields, and emits a typed ProviderEntryOperation.
 * All non-cost fields (supportedResolutions, minDurationSeconds, etc.) are copied verbatim.
 *
 * "add"    → model has no UNBOTTLED entry yet, insert a new entry
 * "update" → model already has an UNBOTTLED entry, rewrite it from primary
 *
 * NOTE: When unbottled.ai cloud is deployed, fetch live prices from:
 * GET /api/<locale>/agent/ai-stream/ws-provider/models on the cloud instance
 * (URL from UNBOTTLED_CLOUD_CREDENTIALS env, falls back to local).
 * Use the returned creditCost values instead of the computed markup.
 */

import "server-only";

import { STANDARD_MARKUP_PERCENTAGE } from "@/app/api/[locale]/products/constants";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { ChatModelId, chatModelDefinitions } from "../../../ai-stream/models";
import {
  ImageGenModelId,
  imageGenModelDefinitions,
} from "../../../image-generation/models";
import {
  MusicGenModelId,
  musicGenModelDefinitions,
} from "../../../music-generation/models";
import {
  SttModelId,
  sttModelDefinitions,
} from "../../../speech-to-text/models";
import {
  TtsModelId,
  ttsModelDefinitions,
} from "../../../text-to-speech/models";
import {
  VideoGenModelId,
  videoGenModelDefinitions,
} from "../../../video-generation/models";
import type { ModelDefinition, ModelProviderConfig } from "../../models";
import { ApiProvider } from "../../models";
import type { ProviderEntryOperation, ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const MODEL_ID_ENUMS: Record<string, Record<string, string>> = {
  chat: ChatModelId,
  "image-gen": ImageGenModelId,
  "music-gen": MusicGenModelId,
  "video-gen": VideoGenModelId,
  tts: TtsModelId,
  stt: SttModelId,
};

function getAllDefsByRole(): Record<string, Record<string, ModelDefinition>> {
  return {
    chat: { ...chatModelDefinitions },
    "image-gen": { ...imageGenModelDefinitions },
    "music-gen": { ...musicGenModelDefinitions },
    "video-gen": { ...videoGenModelDefinitions },
    tts: { ...ttsModelDefinitions },
    stt: { ...sttModelDefinitions },
  };
}

function findEnumKey(
  modelIdValue: string,
  enumObj: Record<string, string>,
): string | null {
  for (const [key, value] of Object.entries(enumObj)) {
    if (value === modelIdValue) {
      return key;
    }
  }
  return null;
}

function markup(value: number): number {
  const raw = value * (1 + STANDARD_MARKUP_PERCENTAGE);
  return Math.round(raw * 10000) / 10000;
}

function markupRecord(
  record: Partial<Record<string, number>>,
): Partial<Record<string, number>> {
  const result: Partial<Record<string, number>> = {};
  for (const [key, val] of Object.entries(record)) {
    result[key] = val !== undefined ? markup(val) : undefined;
  }
  return result;
}

function buildOp(
  action: "add" | "update",
  role: string,
  enumKey: string,
  modelId: string,
  providerModel: string,
  primary: ModelProviderConfig,
): ProviderEntryOperation {
  const op: ProviderEntryOperation = {
    action,
    role,
    enumKey,
    modelId,
    provider: ApiProvider.UNBOTTLED,
    providerModel,
    source: "unbottled.ai",
  };

  // Cost fields - apply 30% markup
  if ("inputTokenCost" in primary && primary.inputTokenCost !== undefined) {
    op.inputTokenCost = markup(primary.inputTokenCost);
  }
  if ("outputTokenCost" in primary && primary.outputTokenCost !== undefined) {
    op.outputTokenCost = markup(primary.outputTokenCost);
  }
  if (
    "cacheReadTokenCost" in primary &&
    primary.cacheReadTokenCost !== undefined
  ) {
    op.cacheReadTokenCost = markup(primary.cacheReadTokenCost);
  }
  if (
    "cacheWriteTokenCost" in primary &&
    primary.cacheWriteTokenCost !== undefined
  ) {
    op.cacheWriteTokenCost = markup(primary.cacheWriteTokenCost);
  }
  if (typeof primary.creditCost === "number") {
    op.creditCost = markup(primary.creditCost);
  }
  if (
    "creditCostPerImage" in primary &&
    primary.creditCostPerImage !== undefined
  ) {
    op.creditCostPerImage = markup(primary.creditCostPerImage);
  }
  if (
    "creditCostPerSecond" in primary &&
    primary.creditCostPerSecond !== undefined
  ) {
    op.creditCostPerSecond = markup(primary.creditCostPerSecond);
  }
  if (
    "creditCostPerClip" in primary &&
    primary.creditCostPerClip !== undefined
  ) {
    op.creditCostPerClip = markup(primary.creditCostPerClip);
  }
  if (
    "creditCostPerCharacter" in primary &&
    primary.creditCostPerCharacter !== undefined
  ) {
    op.creditCostPerCharacter = markup(primary.creditCostPerCharacter);
  }

  // Non-cost fields - copied verbatim
  if (
    "defaultDurationSeconds" in primary &&
    primary.defaultDurationSeconds !== undefined
  ) {
    op.defaultDurationSeconds = primary.defaultDurationSeconds;
  }
  if (
    "minDurationSeconds" in primary &&
    primary.minDurationSeconds !== undefined
  ) {
    op.minDurationSeconds = primary.minDurationSeconds;
  }
  if (
    "maxDurationSeconds" in primary &&
    primary.maxDurationSeconds !== undefined
  ) {
    op.maxDurationSeconds = primary.maxDurationSeconds;
  }
  if (
    "supportedDurations" in primary &&
    primary.supportedDurations !== undefined
  ) {
    op.supportedDurations = primary.supportedDurations;
  }
  if (
    "supportedResolutions" in primary &&
    primary.supportedResolutions !== undefined
  ) {
    op.supportedResolutions = primary.supportedResolutions;
  }
  if (
    "supportedAspectRatios" in primary &&
    primary.supportedAspectRatios !== undefined
  ) {
    op.supportedAspectRatios = primary.supportedAspectRatios;
  }
  if ("supportedSizes" in primary && primary.supportedSizes !== undefined) {
    op.supportedSizes = primary.supportedSizes;
  }
  if (
    "supportedQualities" in primary &&
    primary.supportedQualities !== undefined
  ) {
    op.supportedQualities = primary.supportedQualities;
  }

  // Pricing maps - apply markup to all values
  if (
    "pricingByResolution" in primary &&
    primary.pricingByResolution !== undefined
  ) {
    op.pricingByResolution = markupRecord(primary.pricingByResolution);
  }
  if ("pricingBySize" in primary && primary.pricingBySize !== undefined) {
    op.pricingBySize = markupRecord(primary.pricingBySize);
  }
  if ("pricingByQuality" in primary && primary.pricingByQuality !== undefined) {
    op.pricingByQuality = markupRecord(primary.pricingByQuality);
  }

  return op;
}

export class UnbottledPriceFetcher extends PriceFetcher {
  // eslint-disable-next-line i18next/no-literal-string
  readonly providerName = "unbottled";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const providerEntryOps: ProviderEntryOperation[] = [];

    const allDefsByRole = getAllDefsByRole();
    let totalModels = 0;

    for (const [role, defs] of Object.entries(allDefsByRole)) {
      for (const [modelId, def] of Object.entries(defs)) {
        totalModels++;

        const primaryProvider = def.providers.find(
          (p) => p.apiProvider !== ApiProvider.UNBOTTLED,
        );
        if (!primaryProvider) {
          continue;
        }

        const enumObj = MODEL_ID_ENUMS[role];
        const enumKey = enumObj ? findEnumKey(modelId, enumObj) : null;
        if (!enumKey) {
          continue;
        }

        const unbottledProvider = def.providers.find(
          (p) => p.apiProvider === ApiProvider.UNBOTTLED,
        );

        const providerModel = unbottledProvider?.providerModel ?? modelId;
        const action = unbottledProvider ? "update" : "add";

        providerEntryOps.push(
          buildOp(
            action,
            role,
            enumKey,
            modelId,
            providerModel,
            primaryProvider,
          ),
        );
      }
    }

    logger.info(`[Unbottled] Computed ops from primary providers`, {
      adds: providerEntryOps.filter((op) => op.action === "add").length,
      updates: providerEntryOps.filter((op) => op.action === "update").length,
    });

    return {
      provider: this.providerName,
      modelsFound: totalModels,
      modelsUpdated: providerEntryOps.length,
      updates: [],
      providerEntryOps,
      failures: [],
    };
  }
}
