/**
 * Skills Repository Client
 * Shared logic for skill filtering and model scoring
 * This is a static class with pure functions - no React dependencies
 *
 * PUBLIC API (ONLY 2 METHODS):
 * - getBestModel(): Get single best model from model selection
 * - getFilteredModels(): Get all models matching model selection
 */

import type { FavoriteGetModelSelection } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import {
  DEFAULT_INPUT_TOKENS,
  DEFAULT_OUTPUT_TOKENS,
} from "@/app/api/[locale]/agent/models/constants";
import type { ModelRole } from "@/app/api/[locale]/agent/models/enum";
import type {
  ModelOption,
  ModelProviderEnvAvailability,
} from "@/app/api/[locale]/agent/models/models";
import {
  getAllModelOptions,
  getCreditCostFromModel,
  getModelById,
  isModelProviderAvailable,
} from "@/app/api/[locale]/agent/models/models";
import type {
  FiltersModelSelection,
  ManualModelSelection,
  ModelSelectionSimple,
} from "@/app/api/[locale]/agent/models/types";
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
import type { SkillsT } from "./i18n";

export class SkillsRepositoryClient {
  /**
   * Format credit cost for display (server-side version, no i18n)
   */
  static formatCreditCost(
    cost: number,
    t: SkillsT,
    isTokenBased = false,
  ): string {
    const prefix = isTokenBased ? "~" : "";
    if (cost === 0) {
      return t("selector.free");
    }
    if (cost === 1) {
      return `${prefix}${t("credits.credit", { count: cost })}`;
    }
    return `${prefix}${t("credits.credits", { count: cost })}`;
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
      // Exclude non-chat model roles from the chat model selector
      if (
        model.modelRole === "image-gen" ||
        model.modelRole === "video-gen" ||
        model.modelRole === "audio-gen" ||
        model.modelRole === "tts" ||
        model.modelRole === "stt" ||
        model.modelRole === "embedding"
      ) {
        return false;
      }

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
        const dir1 = filters.sortDirection ?? ModelSortDirection.DESC;
        const v1a = this.getSortValue(a, filters.sortBy);
        const v1b = this.getSortValue(b, filters.sortBy);
        const primary = dir1 === ModelSortDirection.ASC ? v1a - v1b : v1b - v1a;
        if (primary !== 0) {
          return primary;
        }
        if (filters.sortBy2) {
          const dir2 = filters.sortDirection2 ?? ModelSortDirection.DESC;
          const v2a = this.getSortValue(a, filters.sortBy2);
          const v2b = this.getSortValue(b, filters.sortBy2);
          return dir2 === ModelSortDirection.ASC ? v2a - v2b : v2b - v2a;
        }
        return 0;
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
    skillModelSelection:
      | FiltersModelSelection
      | ManualModelSelection
      | undefined,
    user: JwtPayloadType,
  ): ModelOption[] {
    // Use favorite's custom selection if present, otherwise fall back to skill's selection
    const selectionToUse = favoriteModelSelection ?? skillModelSelection;

    if (!selectionToUse) {
      return [];
    }

    return this.getFilteredModelsInternal(selectionToUse, user);
  }

  static getBestModelForFavorite(
    favoriteModelSelection: FavoriteGetModelSelection | null,
    skillModelSelection:
      | FiltersModelSelection
      | ManualModelSelection
      | undefined,
    user: JwtPayloadType,
  ): ModelOption | null {
    const candidates = this.getFilteredModelsForFavorite(
      favoriteModelSelection,
      skillModelSelection,
      user,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }

  /**
   * PUBLIC API: Get all models for skills
   * Only handles MANUAL and FILTERS (skills never have CHARACTER_BASED)
   */
  static getFilteredModelsForSkill(
    skillModelSelection: FiltersModelSelection | ManualModelSelection,
    user: JwtPayloadType,
  ): ModelOption[] {
    return this.getFilteredModelsInternal(skillModelSelection, user);
  }

  static getBestModelForSkill(
    skillModelSelection: FiltersModelSelection | ManualModelSelection,
    user: JwtPayloadType,
  ): ModelOption | null {
    const candidates = this.getFilteredModelsForSkill(
      skillModelSelection,
      user,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }

  /**
   * Get all models matching a role list (for media model selectors: tts, stt, image-gen, etc.)
   * If modelSelection is null/undefined, returns all models for the given roles.
   * If modelSelection is MANUAL, returns [model] filtered to the requested roles.
   * If modelSelection is FILTERS, applies range filters and returns models matching the roles.
   */
  static getFilteredModelsByRole(
    modelSelection: ModelSelectionSimple | null | undefined,
    allowedRoles: ModelRole[],
    user: JwtPayloadType,
  ): ModelOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

    if (!modelSelection) {
      return getAllModelOptions().filter(
        (m) =>
          allowedRoles.includes(m.modelRole as ModelRole) &&
          (!m.adminOnly || isAdmin),
      );
    }

    // MANUAL and FILTERS: apply range constraints, restricted to the allowed roles
    // (MANUAL just highlights the selected model in the UI; the full list is always shown)
    const filtersModelSelection: FiltersModelSelection = {
      selectionType: ModelSelectionType.FILTERS,
      intelligenceRange: modelSelection.intelligenceRange,
      priceRange: modelSelection.priceRange,
      contentRange: modelSelection.contentRange,
      speedRange: modelSelection.speedRange,
      sortBy: modelSelection.sortBy,
      sortDirection: modelSelection.sortDirection,
      sortBy2: modelSelection.sortBy2,
      sortDirection2: modelSelection.sortDirection2,
    };

    const allByRole = getAllModelOptions().filter(
      (m) =>
        allowedRoles.includes(m.modelRole as ModelRole) &&
        (!m.adminOnly || isAdmin),
    );

    // Apply range constraints from FILTERS to the role-filtered set
    const filtered = allByRole.filter((model) => {
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
          filtersModelSelection.intelligenceRange,
          IntelligenceLevelDB,
        ) &&
        this.meetsRangeConstraint(
          model.content,
          filtersModelSelection.contentRange,
          ContentLevelDB,
        ) &&
        this.meetsRangeConstraint(
          modelPrice,
          filtersModelSelection.priceRange,
          PriceLevelDB,
        ) &&
        this.meetsRangeConstraint(
          model.speed,
          filtersModelSelection.speedRange,
          SpeedLevelDB,
        )
      );
    });

    if (filtersModelSelection.sortBy) {
      return filtered.toSorted((a, b) => {
        const dir1 =
          filtersModelSelection.sortDirection ?? ModelSortDirection.DESC;
        const v1a = this.getSortValue(a, filtersModelSelection.sortBy);
        const v1b = this.getSortValue(b, filtersModelSelection.sortBy);
        const primary = dir1 === ModelSortDirection.ASC ? v1a - v1b : v1b - v1a;
        if (primary !== 0) {
          return primary;
        }
        if (filtersModelSelection.sortBy2) {
          const dir2 =
            filtersModelSelection.sortDirection2 ?? ModelSortDirection.DESC;
          const v2a = this.getSortValue(a, filtersModelSelection.sortBy2);
          const v2b = this.getSortValue(b, filtersModelSelection.sortBy2);
          return dir2 === ModelSortDirection.ASC ? v2a - v2b : v2b - v2a;
        }
        return 0;
      });
    }

    return filtered;
  }

  /**
   * Resolves a MANUAL model selection against env availability.
   * If the manual model's provider is unavailable, downgrades to FILTERS mode
   * by dropping the manualModelId - all other filter constraints stay intact
   * so the user gets the best available model matching the same characteristics.
   */
  static resolveModelSelectionForEnv(
    modelSelection: ModelSelectionSimple,
    env: ModelProviderEnvAvailability,
  ): ModelSelectionSimple {
    if (modelSelection.selectionType !== ModelSelectionType.MANUAL) {
      return modelSelection;
    }
    const model = getModelById(modelSelection.manualModelId);
    if (model && isModelProviderAvailable(model, env)) {
      return modelSelection;
    }
    // Provider unavailable - keep all filter props, just switch to FILTERS
    return {
      selectionType: ModelSelectionType.FILTERS,
      intelligenceRange: modelSelection.intelligenceRange,
      priceRange: modelSelection.priceRange,
      contentRange: modelSelection.contentRange,
      speedRange: modelSelection.speedRange,
      sortBy: modelSelection.sortBy,
      sortDirection: modelSelection.sortDirection,
      sortBy2: modelSelection.sortBy2,
      sortDirection2: modelSelection.sortDirection2,
    };
  }

  /**
   * Get best model for a given role (e.g. "tts", "image-gen").
   * Returns null if no models match.
   */
  static getBestModelByRole(
    modelSelection: ModelSelectionSimple | null | undefined,
    allowedRoles: ModelRole[],
    user: JwtPayloadType,
  ): ModelOption | null {
    if (modelSelection?.selectionType === ModelSelectionType.MANUAL) {
      const model = getModelById(modelSelection.manualModelId);
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      if (
        model &&
        allowedRoles.includes(model.modelRole as ModelRole) &&
        (!model.adminOnly || isAdmin)
      ) {
        return model;
      }
      return null;
    }
    const candidates = this.getFilteredModelsByRole(
      modelSelection,
      allowedRoles,
      user,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }
}
