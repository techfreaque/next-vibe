/**
 * Characters Repository Client
 * Shared logic for character filtering and model scoring
 * This is a static class with pure functions - no React dependencies
 *
 * PUBLIC API (ONLY 2 METHODS):
 * - getBestModel(): Get single best model from model selection
 * - getFilteredModels(): Get all models matching model selection
 */

import type { ModelOption } from "@/app/api/[locale]/agent/models/models";
import { modelOptions } from "@/app/api/[locale]/agent/models/models";
import type { TFunction } from "@/i18n/core/static-types";

import type {
  FavoriteCharacterBasedModelSelection,
  FavoriteFiltersModelSelection,
  FavoriteManualModelSelection,
  FavoriteModelSelection,
} from "../favorites/create/definition";
import {
  ContentLevelDB,
  IntelligenceLevelDB,
  ModelSelectionType,
  PriceLevel,
  PriceLevelDB,
  SpeedLevelDB,
} from "./enum";

export class CharactersRepositoryClient {
  /**
   * Format credit cost for display (server-side version, no i18n)
   */
  static formatCreditCost(cost: number, t: TFunction): string {
    if (cost === 0) {
      return t("app.api.agent.chat.selector.free");
    }
    if (cost === 1) {
      return t("app.api.agent.chat.selector.creditsSingle");
    }
    return t("app.api.agent.chat.selector.creditsExact", { cost });
  }
  /**
   * Convert model credit cost to price level
   */
  private static getModelPriceLevel(creditCost: number): string {
    if (creditCost <= 4) {
      return PriceLevel.CHEAP;
    }
    if (creditCost <= 7) {
      return PriceLevel.STANDARD;
    }
    return PriceLevel.PREMIUM;
  }

  /**
   * Check if a value meets a range constraint
   */
  private static meetsRangeConstraint<T>(
    modelValue: T,
    range: { min?: T; max?: T } | undefined,
    order: readonly T[],
  ): boolean {
    if (!range) {
      return true;
    }

    const modelIndex = order.indexOf(modelValue);
    if (range.min !== undefined && modelIndex < order.indexOf(range.min)) {
      return false;
    }
    if (range.max !== undefined && modelIndex > order.indexOf(range.max)) {
      return false;
    }

    return true;
  }

  /**
   * Apply hard filter constraints to models (range checks only)
   */
  private static applyHardFilters(
    filters: FavoriteFiltersModelSelection,
  ): ModelOption[] {
    return Object.values(modelOptions).filter((model) => {
      const modelPrice = this.getModelPriceLevel(model.creditCost);

      return (
        this.meetsRangeConstraint(
          model.intelligence,
          filters.intelligenceRange,
          IntelligenceLevelDB,
        ) &&
        this.meetsRangeConstraint(
          model.content,
          filters.contentRange,
          ContentLevelDB,
        ) &&
        this.meetsRangeConstraint(
          modelPrice,
          filters.priceRange,
          PriceLevelDB,
        ) &&
        this.meetsRangeConstraint(model.speed, filters.speedRange, SpeedLevelDB)
      );
    });
  }

  /**
   * Score a model based on soft preferences
   */
  private static scoreModelBySoftPreferences(
    model: ModelOption,
    filters: FavoriteFiltersModelSelection,
  ): number {
    let score = 0;

    // Score based on preferred strengths
    if (filters.preferredStrengths) {
      for (const utility of filters.preferredStrengths) {
        if (model.utilities.includes(utility)) {
          score += 10;
        }
      }
    }

    // Penalize weaknesses (unless ignored)
    if (model.weaknesses && filters.preferredStrengths) {
      for (const weakness of model.weaknesses) {
        if (
          !filters.ignoredWeaknesses?.includes(weakness) &&
          filters.preferredStrengths.includes(weakness)
        ) {
          score -= 5;
        }
      }
    }

    return score;
  }

  /**
   * Internal shared logic for MANUAL and FILTERS model selection
   * Does not handle CHARACTER_BASED
   */
  private static getFilteredModelsInternal(
    modelSelection:
      | FavoriteFiltersModelSelection
      | FavoriteManualModelSelection,
  ): ModelOption[] {
    // Handle MANUAL selection
    if (modelSelection.selectionType === ModelSelectionType.MANUAL) {
      const model = modelOptions[modelSelection.manualModelId];
      return model ? [model] : [];
    }

    // Handle FILTERS - apply hard filters
    const candidates = this.applyHardFilters(modelSelection);
    if (
      !modelSelection.preferredStrengths &&
      !modelSelection.ignoredWeaknesses
    ) {
      return candidates;
    }

    return candidates
      .map((model) => ({
        model,
        score: this.scoreModelBySoftPreferences(model, modelSelection),
      }))
      .toSorted((a, b) => b.score - a.score)
      .map(({ model }) => model);
  }

  /**
   * PUBLIC API: Get all models for favorites
   * Handles CHARACTER_BASED, MANUAL, and FILTERS
   * Requires character's modelSelection when favorite uses CHARACTER_BASED
   */
  static getFilteredModelsForFavorite(
    favoriteModelSelection: FavoriteModelSelection,
    characterModelSelection: Exclude<
      FavoriteModelSelection,
      FavoriteCharacterBasedModelSelection
    >,
  ): ModelOption[] {
    // Handle CHARACTER_BASED - use character's modelSelection
    if (
      favoriteModelSelection.selectionType ===
      ModelSelectionType.CHARACTER_BASED
    ) {
      return this.getFilteredModelsInternal(characterModelSelection);
    }

    return this.getFilteredModelsInternal(favoriteModelSelection);
  }

  /**
   * PUBLIC API: Get best model for favorites
   * Handles CHARACTER_BASED, MANUAL, and FILTERS
   * Requires character's modelSelection when favorite uses CHARACTER_BASED
   */
  static getBestModelForFavorite(
    favoriteModelSelection: FavoriteModelSelection,
    characterModelSelection: Exclude<
      FavoriteModelSelection,
      FavoriteCharacterBasedModelSelection
    >,
  ): ModelOption | null {
    const candidates = this.getFilteredModelsForFavorite(
      favoriteModelSelection,
      characterModelSelection,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }

  /**
   * PUBLIC API: Get all models for characters
   * Only handles MANUAL and FILTERS (characters never have CHARACTER_BASED)
   */
  static getFilteredModelsForCharacter(
    characterModelSelection: Exclude<
      FavoriteModelSelection,
      FavoriteCharacterBasedModelSelection
    >,
  ): ModelOption[] {
    return this.getFilteredModelsInternal(characterModelSelection);
  }

  /**
   * PUBLIC API: Get best model for characters
   * Only handles MANUAL and FILTERS (characters never have CHARACTER_BASED)
   */
  static getBestModelForCharacter(
    characterModelSelection: Exclude<
      FavoriteModelSelection,
      FavoriteCharacterBasedModelSelection
    >,
  ): ModelOption | null {
    const candidates = this.getFilteredModelsForCharacter(
      characterModelSelection,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }
}
