/**
 * Cross-domain model aggregates.
 *
 * This file exists to break a circular dependency:
 *   domain models.ts  →  models/models.ts  →  domain models.ts  (cycle!)
 *
 * models/models.ts exports base types & utilities (ApiProvider, calculateCreditCost, …).
 * Each domain's models.ts (ai-stream, image-generation, …) imports those base types.
 * This file imports the built option lists from every domain and re-exports
 * aggregate helpers (getModelCost, getAvailableModelCount, …).
 */

import {
  type ChatModelOption,
  chatModelDefinitions,
  chatModelOptions,
} from "../ai-stream/models";
import {
  type AudioVisionModelOption,
  type ImageVisionModelOption,
  type VideoVisionModelOption,
} from "../ai-stream/vision-models";
import { ContentLevel } from "../chat/skills/enum";
import {
  type ImageGenModelOption,
  imageGenModelDefinitions,
  imageGenModelOptions,
} from "../image-generation/models";
import {
  type MusicGenModelOption,
  musicGenModelDefinitions,
  musicGenModelOptions,
} from "../music-generation/models";
import {
  type SttModelOption,
  sttModelDefinitions,
  sttModelOptions,
} from "../speech-to-text/models";
import {
  type TtsModelOption,
  ttsModelDefinitions,
  ttsModelOptions,
} from "../text-to-speech/models";
import {
  type VideoGenModelOption,
  videoGenModelDefinitions,
  videoGenModelOptions,
} from "../video-generation/models";
import type { Modality } from "./enum";
import {
  type AnyModelId,
  type AnyModelOption,
  type ModelDefinition,
  type ModelOptionBase,
  apiProviderDisplayNames,
  calculateCreditCost,
  getModelPrice,
  isApiProviderAvailable,
  isModelProviderAvailable,
  modelProviders,
} from "./models";

export { getModelPrice };

/**
 * Full union of all model option types, including vision bridge models.
 * Vision types live in ai-stream/vision-models.ts which imports from models/models.ts,
 * so they cannot be included in AnyModelOption there without a circular dependency.
 * Use this type when vision models may appear alongside generation/TTS/STT models.
 */
export type AnyModelOptionWithVision =
  | AnyModelOption
  | ImageVisionModelOption
  | VideoVisionModelOption
  | AudioVisionModelOption;

// Re-export aggregate option types for consumers that need them
export type {
  AnyModelId,
  AnyModelOption,
  AudioVisionModelOption,
  ChatModelOption,
  ImageGenModelOption,
  ImageVisionModelOption,
  MusicGenModelOption,
  SttModelOption,
  TtsModelOption,
  VideoGenModelOption,
  VideoVisionModelOption,
};

// ============================================
// CROSS-DOMAIN AGGREGATES
// ============================================

const allModelOptions: AnyModelOption[] = [
  ...chatModelOptions,
  ...imageGenModelOptions,
  ...musicGenModelOptions,
  ...videoGenModelOptions,
  ...ttsModelOptions,
  ...sttModelOptions,
];

export const allModelDefinitions: ModelDefinition[] = [
  ...Object.values(chatModelDefinitions),
  ...Object.values(imageGenModelDefinitions),
  ...Object.values(musicGenModelDefinitions),
  ...Object.values(videoGenModelDefinitions),
  ...Object.values(ttsModelDefinitions),
  ...Object.values(sttModelDefinitions),
];

export function getModelDisplayName(
  model: AnyModelOption,
  isAdmin: boolean,
): string {
  const def = allModelDefinitions.find((d) => d.name === model.name);
  if (!def) {
    return model.name;
  }
  const availableProviders = (
    isAdmin ? def.providers : def.providers.filter((p) => !p.adminOnly)
  ).filter((p) => isApiProviderAvailable(p.apiProvider));
  if (availableProviders.length <= 1) {
    return model.name;
  }
  return `${model.name} (${apiProviderDisplayNames[model.apiProvider]})`;
}

// ============================================
// CREDIT COST UTILITIES
// ============================================

export function getCreditCostFromModel(
  model: ModelOptionBase,
  actualInputTokens: number,
  actualOutputTokens: number,
  cachedInputTokens = 0,
  cacheWriteTokens = 0,
): number {
  return calculateCreditCost(
    model,
    actualInputTokens,
    actualOutputTokens,
    cachedInputTokens,
    cacheWriteTokens,
  );
}

export function getModelCost(
  modelId: AnyModelId,
  actualInputTokens: number,
  actualOutputTokens: number,
  cachedInputTokens = 0,
  cacheWriteTokens = 0,
): number {
  const model =
    allModelOptions.find((m) => m.id === modelId) ?? allModelOptions[0]!;
  return getCreditCostFromModel(
    model,
    actualInputTokens,
    actualOutputTokens,
    cachedInputTokens,
    cacheWriteTokens,
  );
}

export function getAvailableModelCount(isAdmin: boolean): number {
  return allModelDefinitions.filter((def) => {
    const visibleProviders = isAdmin
      ? def.providers
      : def.providers.filter((p) => !p.adminOnly);
    if (visibleProviders.length === 0) {
      return false;
    }
    if (isAdmin) {
      return true;
    }
    return visibleProviders.some((p) => {
      const option = allModelOptions.find((m) => m.id === p.id);
      return option ? isModelProviderAvailable(option) : false;
    });
  }).length;
}

export function getAvailableProviderCount(isAdmin: boolean): number {
  if (isAdmin) {
    return Object.keys(modelProviders).length;
  }
  const availableProviderIds = new Set<string>();
  for (const def of allModelDefinitions) {
    const publicProviders = def.providers.filter((p) => !p.adminOnly);
    for (const p of publicProviders) {
      const option = allModelOptions.find((m) => m.id === p.id);
      if (option && isModelProviderAvailable(option)) {
        availableProviderIds.add(def.by);
        break;
      }
    }
  }
  return availableProviderIds.size;
}

export interface ModelCountsByContentLevel {
  mainstream: number;
  open: number;
  uncensored: number;
}

export function getAvailableModelCountsByContentLevel(
  isAdmin: boolean,
): ModelCountsByContentLevel {
  const counts: ModelCountsByContentLevel = {
    mainstream: 0,
    open: 0,
    uncensored: 0,
  };

  for (const def of allModelDefinitions) {
    const visibleProviders = isAdmin
      ? def.providers
      : def.providers.filter((p) => !p.adminOnly);
    if (visibleProviders.length === 0) {
      continue;
    }
    if (
      !isAdmin &&
      !visibleProviders.some((p) => {
        const option = allModelOptions.find((m) => m.id === p.id);
        return option ? isModelProviderAvailable(option) : false;
      })
    ) {
      continue;
    }

    if (def.content === ContentLevel.MAINSTREAM) {
      counts.mainstream++;
    } else if (def.content === ContentLevel.OPEN) {
      counts.open++;
    } else if (def.content === ContentLevel.UNCENSORED) {
      counts.uncensored++;
    }
  }

  return counts;
}

export const TOTAL_CHARACTER_COUNT = 52;

export function hasNativeInput(
  model: AnyModelOption,
  modality: Modality,
): boolean {
  return model.inputs.includes(modality);
}

export function hasNativeOutput(
  model: AnyModelOption,
  modality: Modality,
): boolean {
  return model.outputs.includes(modality);
}
