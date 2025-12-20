/**
 * Types for the unified persona-model selector (v16)
 */

import type {
  ModelId,
  ModelOption,
} from "@/app/api/[locale]/agent/chat/model-access/models";
import type { Persona } from "@/app/api/[locale]/agent/chat/personas/config";
import type {
  ContentLevel,
  IntelligenceLevel,
  ModelFeatures,
  PriceLevel,
  SpeedLevel,
} from "@/app/api/[locale]/agent/chat/types";

/**
 * Selector view modes
 */
export type SelectorMode = "quick" | "personas" | "build";

/**
 * Model selection strategy
 */
export interface ModelSelectionAuto {
  type: "auto";
  intelligence: IntelligenceLevel | "any";
  maxPrice: PriceLevel | "any";
  minContent: ContentLevel | "any";
}

export interface ModelSelectionSpecific {
  type: "specific";
  modelId: ModelId;
}

export type ModelSelection = ModelSelectionAuto | ModelSelectionSpecific;

/**
 * Selector state
 */
export interface SelectorState {
  personaId: string;
  modelSelection: ModelSelection;
  mode: SelectorMode;
}

/**
 * Storage keys for persistence
 */
export const STORAGE_KEYS = {
  FAVORITE_PERSONAS: "chat-favorites-v2",
  FAVORITE_MODELS: "chat-favorite-models",
  RECENT_SELECTIONS: "chat-recent-selections",
  DEFAULT_BUDGET: "chat-default-budget",
  ONBOARDING_COMPLETED: "chat-onboarding-completed",
  SELECTOR_ONBOARDING_COMPLETED: "chat-selector-onboarding-v2",
  COMPANION_CHOICE: "chat-companion-choice",
} as const;

/**
 * Default favorite personas
 */
export const DEFAULT_FAVORITE_PERSONAS = [
  "default",
  "technical",
  "creative",
];

/**
 * Default favorite models
 */
export const DEFAULT_FAVORITE_MODELS: ModelId[] = [];

/**
 * Check if a model meets persona requirements (hard filters)
 */
export function modelMeetsRequirements(
  model: ModelOption,
  persona: Persona,
): boolean {
  const { requirements } = persona;
  if (!requirements) {
    return true;
  }

  // Content level check
  if (requirements.minContent) {
    const contentOrder: ContentLevel[] = ["mainstream", "open", "uncensored"];
    const modelIndex = contentOrder.indexOf(model.content);
    const requiredIndex = contentOrder.indexOf(requirements.minContent);
    if (modelIndex < requiredIndex) {
      return false;
    }
  }

  if (requirements.maxContent) {
    const contentOrder: ContentLevel[] = ["mainstream", "open", "uncensored"];
    const modelIndex = contentOrder.indexOf(model.content);
    const maxIndex = contentOrder.indexOf(requirements.maxContent);
    if (modelIndex > maxIndex) {
      return false;
    }
  }

  // Intelligence level check
  if (requirements.minIntelligence) {
    const intelligenceOrder: IntelligenceLevel[] = [
      "quick",
      "smart",
      "brilliant",
    ];
    const modelIndex = intelligenceOrder.indexOf(model.intelligence);
    const requiredIndex = intelligenceOrder.indexOf(
      requirements.minIntelligence,
    );
    if (modelIndex < requiredIndex) {
      return false;
    }
  }

  if (requirements.maxIntelligence) {
    const intelligenceOrder: IntelligenceLevel[] = [
      "quick",
      "smart",
      "brilliant",
    ];
    const modelIndex = intelligenceOrder.indexOf(model.intelligence);
    const maxIndex = intelligenceOrder.indexOf(requirements.maxIntelligence);
    if (modelIndex > maxIndex) {
      return false;
    }
  }

  // Speed level check
  if (requirements.minSpeed) {
    const speedOrder: SpeedLevel[] = ["fast", "balanced", "thorough"];
    const modelIndex = speedOrder.indexOf(model.speed);
    const requiredIndex = speedOrder.indexOf(requirements.minSpeed);
    if (modelIndex < requiredIndex) {
      return false;
    }
  }

  if (requirements.maxSpeed) {
    const speedOrder: SpeedLevel[] = ["fast", "balanced", "thorough"];
    const modelIndex = speedOrder.indexOf(model.speed);
    const maxIndex = speedOrder.indexOf(requirements.maxSpeed);
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
 * Score a model for a persona (soft preferences)
 * Higher score = better match
 */
export function scoreModelForPersona(
  model: ModelOption,
  persona: Persona,
): number {
  let score = 0;
  const { preferences } = persona;

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
 * Get compatible models for a persona
 */
export function getCompatibleModels(
  models: ModelOption[],
  persona: Persona,
): ModelOption[] {
  return models.filter((model) => modelMeetsRequirements(model, persona));
}

/**
 * Get recommended models for a persona, sorted by score
 */
export function getRecommendedModels(
  models: ModelOption[],
  persona: Persona,
  limit = 5,
): ModelOption[] {
  return models
    .filter((model) => modelMeetsRequirements(model, persona))
    .map((model) => ({
      model,
      score: scoreModelForPersona(model, persona),
    }))
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ model }) => model);
}

/**
 * Find the best model for a persona given constraints
 */
export function findBestModel(
  models: ModelOption[],
  persona: Persona,
  constraints: {
    intelligence?: IntelligenceLevel | "any";
    maxPrice?: PriceLevel | "any";
    minContent?: ContentLevel | "any";
  } = {},
): ModelOption | null {
  const priceOrder: PriceLevel[] = ["cheap", "standard", "premium"];
  const contentOrder: ContentLevel[] = ["mainstream", "open", "uncensored"];
  const intelligenceOrder: IntelligenceLevel[] = [
    "quick",
    "smart",
    "brilliant",
  ];

  // Filter by persona requirements first
  let candidates = models.filter((model) =>
    modelMeetsRequirements(model, persona),
  );

  // Apply intelligence constraint
  if (constraints.intelligence && constraints.intelligence !== "any") {
    const targetIndex = intelligenceOrder.indexOf(constraints.intelligence);
    candidates = candidates.filter((model) => {
      const modelIndex = intelligenceOrder.indexOf(model.intelligence);
      return modelIndex >= targetIndex;
    });
  }

  // Apply price constraint
  if (constraints.maxPrice && constraints.maxPrice !== "any") {
    const maxIndex = priceOrder.indexOf(constraints.maxPrice);
    candidates = candidates.filter((model) => {
      const modelIndex = priceOrder.indexOf(
        model.creditCost <= 3
          ? "cheap"
          : model.creditCost <= 9
            ? "standard"
            : "premium",
      );
      return modelIndex <= maxIndex;
    });
  }

  // Apply content constraint
  if (constraints.minContent && constraints.minContent !== "any") {
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
      score: scoreModelForPersona(model, persona),
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
 * Resolve model selection to an actual model
 */
export function resolveModelSelection(
  selection: ModelSelection,
  persona: Persona,
  allModels: ModelOption[],
): ModelOption | null {
  if (selection.type === "specific") {
    const model = allModels.find((m) => m.id === selection.modelId);
    if (model && modelMeetsRequirements(model, persona)) {
      return model;
    }
    // Fallback to auto if specific model doesn't meet requirements
  }

  // Auto selection
  return findBestModel(allModels, persona, {
    intelligence: selection.type === "auto" ? selection.intelligence : "any",
    maxPrice: selection.type === "auto" ? selection.maxPrice : "any",
    minContent: selection.type === "auto" ? selection.minContent : "any",
  });
}
