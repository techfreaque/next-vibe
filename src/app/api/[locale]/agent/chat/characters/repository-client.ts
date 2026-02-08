/**
 * Characters Repository Client
 * Shared logic for character filtering and model scoring
 * This is a static class with pure functions - no React dependencies
 *
 * PUBLIC API (ONLY 2 METHODS):
 * - getBestModel(): Get single best model from model selection
 * - getFilteredModels(): Get all models matching model selection
 */

import type { FavoriteGetModelSelection } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import type { ModelOption } from "@/app/api/[locale]/agent/models/models";
import {
  getCreditCostFromModel,
  modelOptions,
} from "@/app/api/[locale]/agent/models/models";
import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/model-selection-field/types";
import {
  ModelSortDirection,
  ModelSortField,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/model-selection-field/types";
import type { TFunction } from "@/i18n/core/static-types";

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
    if (creditCost <= 3) {
      return PriceLevel.CHEAP;
    }
    if (creditCost <= 9) {
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
   * Get sort value for a model based on sort field
   */
  private static getSortValue(
    model: ModelOption,
    sortBy: string | undefined,
  ): number {
    if (!sortBy) {
      return 0;
    }

    switch (sortBy) {
      case ModelSortField.INTELLIGENCE: {
        const idx = IntelligenceLevelDB.indexOf(model.intelligence);
        return idx === -1 ? 0 : idx;
      }
      case ModelSortField.SPEED: {
        const idx = SpeedLevelDB.indexOf(model.speed);
        return idx === -1 ? 0 : idx;
      }
      case ModelSortField.PRICE:
        return getCreditCostFromModel(model);
      case ModelSortField.CONTENT: {
        const idx = ContentLevelDB.indexOf(model.content);
        return idx === -1 ? 0 : idx;
      }
      default:
        return 0;
    }
  }

  /**
   * Apply hard filter constraints to models (range checks only) and sort
   */
  private static applyHardFilters(
    filters: FiltersModelSelection,
  ): ModelOption[] {
    const filtered = Object.values(modelOptions).filter((model) => {
      const modelPrice = this.getModelPriceLevel(getCreditCostFromModel(model));

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

    // Apply sorting if specified
    if (filters.sortBy) {
      return filtered.toSorted((a, b) => {
        const aVal = this.getSortValue(a, filters.sortBy);
        const bVal = this.getSortValue(b, filters.sortBy);

        // Default to DESC if no direction specified
        const direction = filters.sortDirection ?? ModelSortDirection.DESC;

        return direction === ModelSortDirection.ASC ? aVal - bVal : bVal - aVal;
      });
    }

    return filtered;
  }

  private static getFilteredModelsInternal(
    modelSelection: FiltersModelSelection | ManualModelSelection,
  ): ModelOption[] {
    if (modelSelection.selectionType === ModelSelectionType.MANUAL) {
      const model = modelOptions[modelSelection.manualModelId];
      return model ? [model] : [];
    }

    return this.applyHardFilters(modelSelection);
  }

  static getFilteredModelsForFavorite(
    favoriteModelSelection: FavoriteGetModelSelection,
  ): ModelOption[] {
    if (
      !favoriteModelSelection.currentSelection ||
      favoriteModelSelection.currentSelection.selectionType ===
        ModelSelectionType.CHARACTER_BASED
    ) {
      // characterModelSelection should always be present when CHARACTER_BASED, but handle fallback
      if (!favoriteModelSelection.characterModelSelection) {
        return [];
      }
      return this.getFilteredModelsInternal(
        favoriteModelSelection.characterModelSelection,
      );
    }

    return this.getFilteredModelsInternal(
      favoriteModelSelection.currentSelection,
    );
  }

  static getBestModelForFavorite(
    favoriteModelSelection: FavoriteGetModelSelection,
  ): ModelOption | null {
    const candidates = this.getFilteredModelsForFavorite(
      favoriteModelSelection,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }

  /**
   * PUBLIC API: Get all models for characters
   * Only handles MANUAL and FILTERS (characters never have CHARACTER_BASED)
   */
  static getFilteredModelsForCharacter(
    characterModelSelection: FiltersModelSelection | ManualModelSelection,
  ): ModelOption[] {
    return this.getFilteredModelsInternal(characterModelSelection);
  }

  static getBestModelForCharacter(
    characterModelSelection: FiltersModelSelection | ManualModelSelection,
  ): ModelOption | null {
    const candidates = this.getFilteredModelsForCharacter(
      characterModelSelection,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }
}
