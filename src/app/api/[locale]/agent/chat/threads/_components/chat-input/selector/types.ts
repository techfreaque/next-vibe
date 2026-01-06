/**
 * Types for the unified character-model selector (v16)
 */

import type { ModelFilters } from "@/app/api/[locale]/agent/chat/characters/[id]/definition";
import type { Character } from "@/app/api/[locale]/agent/chat/characters/config";
import {
  ContentLevel,
  ContentLevelFilter,
  IntelligenceLevel,
  IntelligenceLevelFilter,
  PriceLevel,
  PriceLevelFilter,
  SpeedLevel,
  SpeedLevelFilter,
} from "@/app/api/[locale]/agent/chat/favorites/enum";
import type { ModelId, ModelOption } from "@/app/api/[locale]/agent/models/models";
import type { ModelFeatures } from "@/app/api/[locale]/agent/models/models";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";

/**
 * Storage keys for persistence
 */
export const STORAGE_KEYS = {
  FAVORITE_CHARACTERS: "chat-favorites-v2",
  FAVORITE_MODELS: "chat-favorite-models",
  RECENT_SELECTIONS: "chat-recent-selections",
  DEFAULT_BUDGET: "chat-default-budget",
  ONBOARDING_COMPLETED: "chat-onboarding-completed",
  SELECTOR_ONBOARDING_COMPLETED: "chat-selector-onboarding-v2",
  COMPANION_CHOICE: "chat-companion-choice",
} as const;

/**
 * Default favorite characters
 */
export const DEFAULT_FAVORITE_CHARACTERS = ["default", "technical", "creative"];

/**
 * Default favorite models
 */
export const DEFAULT_FAVORITE_MODELS: ModelId[] = [];

/**
 * Check if a model meets character requirements (hard filters)
 */
export function modelMeetsRequirements(model: ModelOption, character: Character): boolean {
  const { requirements } = character;
  if (!requirements) {
    return true;
  }

  // Content level check
  if (requirements.minContent) {
    const contentOrder = [ContentLevel.MAINSTREAM, ContentLevel.OPEN, ContentLevel.UNCENSORED];
    const modelIndex = contentOrder.indexOf(model.content);
    const requiredIndex = contentOrder.indexOf(requirements.minContent);
    if (modelIndex < requiredIndex) {
      return false;
    }
  }

  if (requirements.maxContent) {
    const contentOrder = [ContentLevel.MAINSTREAM, ContentLevel.OPEN, ContentLevel.UNCENSORED];
    const modelIndex = contentOrder.indexOf(model.content);
    const maxIndex = contentOrder.indexOf(requirements.maxContent);
    if (modelIndex > maxIndex) {
      return false;
    }
  }

  // Intelligence level check
  if (requirements.minIntelligence) {
    const intelligenceOrder = [
      IntelligenceLevel.QUICK,
      IntelligenceLevel.SMART,
      IntelligenceLevel.BRILLIANT,
    ];
    const modelIndex = intelligenceOrder.indexOf(model.intelligence);
    const requiredIndex = intelligenceOrder.indexOf(requirements.minIntelligence);
    if (modelIndex < requiredIndex) {
      return false;
    }
  }

  if (requirements.maxIntelligence) {
    const intelligenceOrder = [
      IntelligenceLevel.QUICK,
      IntelligenceLevel.SMART,
      IntelligenceLevel.BRILLIANT,
    ];
    const modelIndex = intelligenceOrder.indexOf(model.intelligence);
    const maxIndex = intelligenceOrder.indexOf(requirements.maxIntelligence);
    if (modelIndex > maxIndex) {
      return false;
    }
  }

  // Speed level check
  if (requirements.minSpeed) {
    const speedOrder = [SpeedLevel.FAST, SpeedLevel.BALANCED, SpeedLevel.THOROUGH];
    const modelIndex = speedOrder.indexOf(model.speed);
    const requiredIndex = speedOrder.indexOf(requirements.minSpeed);
    if (modelIndex < requiredIndex) {
      return false;
    }
  }

  if (requirements.maxSpeed) {
    const speedOrder = [SpeedLevel.FAST, SpeedLevel.BALANCED, SpeedLevel.THOROUGH];
    const modelIndex = speedOrder.indexOf(model.speed);
    const maxIndex = speedOrder.indexOf(requirements.maxSpeed);
    if (modelIndex > maxIndex) {
      return false;
    }
  }

  // Price level check
  if (requirements.minPrice) {
    const priceOrder = [PriceLevel.CHEAP, PriceLevel.STANDARD, PriceLevel.PREMIUM];
    const modelPrice =
      model.creditCost <= 3
        ? PriceLevel.CHEAP
        : model.creditCost <= 9
          ? PriceLevel.STANDARD
          : PriceLevel.PREMIUM;
    const modelIndex = priceOrder.indexOf(modelPrice);
    const requiredIndex = priceOrder.indexOf(requirements.minPrice);
    if (modelIndex < requiredIndex) {
      return false;
    }
  }

  if (requirements.maxPrice) {
    const priceOrder = [PriceLevel.CHEAP, PriceLevel.STANDARD, PriceLevel.PREMIUM];
    const modelPrice =
      model.creditCost <= 3
        ? PriceLevel.CHEAP
        : model.creditCost <= 9
          ? PriceLevel.STANDARD
          : PriceLevel.PREMIUM;
    const modelIndex = priceOrder.indexOf(modelPrice);
    const maxIndex = priceOrder.indexOf(requirements.maxPrice);
    if (modelIndex > maxIndex) {
      return false;
    }
  }

  // Required features check
  if (requirements.requiredFeatures) {
    for (const feature of requirements.requiredFeatures) {
      if (!model.features[feature as keyof ModelFeatures]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Score a model for a character (soft preferences)
 * Higher score = better match
 */
export function scoreModelForCharacter(model: ModelOption, character: Character): number {
  let score = 0;
  const { preferences } = character;

  if (!preferences) {
    return 0;
  }

  // Score based on preferred strengths
  if (preferences.preferredStrengths) {
    for (const utility of preferences.preferredStrengths) {
      if (model.utilities.includes(utility)) {
        score += 10;
      }
    }
  }

  // Penalize weaknesses (unless ignored)
  if (model.weaknesses) {
    for (const weakness of model.weaknesses) {
      if (preferences.ignoredWeaknesses?.includes(weakness)) {
        continue;
      }
      if (preferences.preferredStrengths?.includes(weakness)) {
        score -= 5;
      }
    }
  }

  return score;
}

/**
 * Get compatible models for a character
 */
export function getCompatibleModels(models: ModelOption[], character: Character): ModelOption[] {
  return models.filter((model) => modelMeetsRequirements(model, character));
}

/**
 * Get recommended models for a character, sorted by score
 */
export function getRecommendedModels(
  models: ModelOption[],
  character: Character,
  limit = 5,
): ModelOption[] {
  return models
    .filter((model) => modelMeetsRequirements(model, character))
    .map((model) => ({
      model,
      score: scoreModelForCharacter(model, character),
    }))
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ model }) => model);
}

/**
 * Find the best model for a character given constraints
 */
export function findBestModel(
  models: ModelOption[],
  character: Character,
  constraints: {
    intelligence?: typeof IntelligenceLevelFilterValue;
    maxPrice?: typeof PriceLevelFilterValue;
    minContent?: typeof ContentLevelFilterValue;
  } = {},
): ModelOption | null {
  const priceOrder = [PriceLevelFilter.CHEAP, PriceLevelFilter.STANDARD, PriceLevelFilter.PREMIUM];
  const contentOrder = [ContentLevel.MAINSTREAM, ContentLevel.OPEN, ContentLevel.UNCENSORED];
  const intelligenceOrder = [
    IntelligenceLevel.QUICK,
    IntelligenceLevel.SMART,
    IntelligenceLevel.BRILLIANT,
  ];

  // Filter by character requirements first
  let candidates = models.filter((model) => modelMeetsRequirements(model, character));

  // Apply intelligence constraint
  if (constraints.intelligence && constraints.intelligence !== IntelligenceLevelFilter.ANY) {
    const targetIndex = intelligenceOrder.indexOf(constraints.intelligence);
    candidates = candidates.filter((model) => {
      const modelIndex = intelligenceOrder.indexOf(model.intelligence);
      return modelIndex >= targetIndex;
    });
  }

  // Apply price constraint
  if (constraints.maxPrice && constraints.maxPrice !== PriceLevelFilter.ANY) {
    const maxIndex = priceOrder.indexOf(constraints.maxPrice);
    candidates = candidates.filter((model) => {
      const modelIndex = priceOrder.indexOf(
        model.creditCost <= 3
          ? PriceLevelFilter.CHEAP
          : model.creditCost <= 9
            ? PriceLevelFilter.STANDARD
            : PriceLevelFilter.PREMIUM,
      );
      return modelIndex <= maxIndex;
    });
  }

  // Apply content constraint
  if (constraints.minContent && constraints.minContent !== ContentLevelFilter.ANY) {
    const minIndex = contentOrder.indexOf(constraints.minContent);
    candidates = candidates.filter((model) => {
      const modelIndex = contentOrder.indexOf(model.content);
      return modelIndex >= minIndex;
    });
  }

  if (candidates.length === 0) {
    return null;
  }

  // Score and sort
  const scored = candidates
    .map((model) => ({
      model,
      score: scoreModelForCharacter(model, character),
    }))
    .toSorted((a, b) => b.score - a.score);

  return scored[0]?.model ?? null;
}

/**
 * Category display configuration
 */
export interface CategoryConfig {
  label: string;
  icon: string;
}

/**
 * Select model for a character with priority:
 * 1. Manual override from favorite settings (highest priority)
 * 2. Character's preferredModel (medium priority)
 * 3. Auto-selection with filters (fallback)
 */
export function selectModelForCharacter(
  allModels: ModelOption[],
  character: Character | null,
  settings: {
    mode: "auto" | "manual";
    manualModelId?: ModelId;
    filters: {
      intelligence: typeof IntelligenceLevelFilterValue;
      maxPrice: typeof PriceLevelFilterValue;
      content: typeof ContentLevelFilterValue;
    };
  },
): ModelId | null {
  // Priority 1: Manual override from favorite config
  if (settings.mode === "manual" && settings.manualModelId) {
    return settings.manualModelId;
  }

  // Priority 2: Character's preferredModel
  if (character?.preferredModel) {
    return character.preferredModel;
  }

  // Priority 3: Auto-selection with filters
  if (character) {
    const bestModel = findBestModel(allModels, character, {
      intelligence: settings.filters.intelligence,
      maxPrice: settings.filters.maxPrice,
      minContent: settings.filters.content,
    });
    return bestModel?.id ?? null;
  }

  return null;
}
