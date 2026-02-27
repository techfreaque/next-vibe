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
import type { ChatT } from "@/app/api/[locale]/agent/chat/i18n";
import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "@/app/api/[locale]/agent/models/components/types";
import {
  DEFAULT_INPUT_TOKENS,
  DEFAULT_OUTPUT_TOKENS,
} from "@/app/api/[locale]/agent/models/constants";
import type { ModelOption } from "@/app/api/[locale]/agent/models/models";
import {
  getAllModelOptions,
  getCreditCostFromModel,
  getModelById,
} from "@/app/api/[locale]/agent/models/models";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  ContentLevelDB,
  IntelligenceLevelDB,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  PriceLevel,
  PriceLevelDB,
  SpeedLevelDB,
} from "./enum";

export class CharactersRepositoryClient {
  /**
   * Format credit cost for display (server-side version, no i18n)
   */
  static formatCreditCost(
    cost: number,
    t: ChatT,
    isTokenBased = false,
  ): string {
    const prefix = isTokenBased ? "~" : "";
    if (cost === 0) {
      return t("selector.free");
    }
    if (cost === 1) {
      return `${prefix}${t("components.credits.credit", { count: cost })}`;
    }
    return `${prefix}${t("components.credits.credits", { count: cost })}`;
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
        return getCreditCostFromModel(
          model,
          DEFAULT_INPUT_TOKENS,
          DEFAULT_OUTPUT_TOKENS,
        );
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
    user: JwtPayloadType,
  ): ModelOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    const filtered = getAllModelOptions().filter((model) => {
      // Admin-only models (e.g. Agent SDK) are only visible to admins
      if (model.adminOnly && !isAdmin) {
        return false;
      }

      const modelPrice = this.getModelPriceLevel(
        getCreditCostFromModel(
          model,
          DEFAULT_INPUT_TOKENS,
          DEFAULT_OUTPUT_TOKENS,
        ),
      );

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
    user: JwtPayloadType,
  ): ModelOption[] {
    if (modelSelection.selectionType === ModelSelectionType.MANUAL) {
      const model = getModelById(modelSelection.manualModelId);
      // Admin-only models can only be manually selected by admins
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      return model ? [model] : [];
    }

    return this.applyHardFilters(modelSelection, user);
  }

  static getFilteredModelsForFavorite(
    favoriteModelSelection: FavoriteGetModelSelection | null,
    characterModelSelection:
      | FiltersModelSelection
      | ManualModelSelection
      | undefined,
    user: JwtPayloadType,
  ): ModelOption[] {
    // Use favorite's custom selection if present, otherwise fall back to character's selection
    const selectionToUse = favoriteModelSelection ?? characterModelSelection;

    if (!selectionToUse) {
      return [];
    }

    return this.getFilteredModelsInternal(selectionToUse, user);
  }

  static getBestModelForFavorite(
    favoriteModelSelection: FavoriteGetModelSelection | null,
    characterModelSelection:
      | FiltersModelSelection
      | ManualModelSelection
      | undefined,
    user: JwtPayloadType,
  ): ModelOption | null {
    const candidates = this.getFilteredModelsForFavorite(
      favoriteModelSelection,
      characterModelSelection,
      user,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }

  /**
   * PUBLIC API: Get all models for characters
   * Only handles MANUAL and FILTERS (characters never have CHARACTER_BASED)
   */
  static getFilteredModelsForCharacter(
    characterModelSelection: FiltersModelSelection | ManualModelSelection,
    user: JwtPayloadType,
  ): ModelOption[] {
    return this.getFilteredModelsInternal(characterModelSelection, user);
  }

  static getBestModelForCharacter(
    characterModelSelection: FiltersModelSelection | ManualModelSelection,
    user: JwtPayloadType,
  ): ModelOption | null {
    const candidates = this.getFilteredModelsForCharacter(
      characterModelSelection,
      user,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }
}
