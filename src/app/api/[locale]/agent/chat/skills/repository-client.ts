/**
 * Skills Repository Client
 * Shared logic for skill filtering and model scoring
 * This is a static class with pure functions - no React dependencies
 *
 * PUBLIC API:
 * - getBestModel(): Get single best model from model selection
 * - getFilteredModels(): Get all models matching model selection
 * - getBestTtsModel(), getBestSttModel(), etc.: Role-specific best model
 * - getFilteredTtsModels(), getFilteredSttModels(), etc.: Role-specific filtered models
 */

import {
  chatModelOptions,
  chatModelOptionsIndex,
  getChatModelById,
  type ChatModelOption,
} from "@/app/api/[locale]/agent/ai-stream/models";
import {
  audioVisionModelOptions,
  imageVisionModelOptions,
  videoVisionModelOptions,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import type { FavoriteGetModelSelection } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import {
  getImageGenModelById,
  imageGenModelOptions,
  type ImageGenModelOption,
} from "@/app/api/[locale]/agent/image-generation/models";
import { getModelPrice } from "@/app/api/[locale]/agent/models/all-models";
import {
  isModelProviderAvailable,
  type ModelProviderEnvAvailability,
} from "@/app/api/[locale]/agent/models/models";
import type {
  AudioVisionModelSelection,
  ChatModelSelection,
  FiltersModelSelection,
  ImageGenModelSelection,
  ImageVisionModelSelection,
  MusicGenModelSelection,
  SttModelSelection,
  VideoGenModelSelection,
  VideoVisionModelSelection,
  VoiceModelSelection,
} from "@/app/api/[locale]/agent/models/types";
import {
  getMusicGenModelById,
  musicGenModelOptions,
  type MusicGenModelOption,
} from "@/app/api/[locale]/agent/music-generation/models";
import {
  getSttModelById,
  sttModelOptions,
  type SttModelOption,
} from "@/app/api/[locale]/agent/speech-to-text/models";
import {
  getTtsModelById,
  ttsModelOptions,
  type TtsModelOption,
} from "@/app/api/[locale]/agent/text-to-speech/models";
import {
  getVideoGenModelById,
  videoGenModelOptions,
  type VideoGenModelOption,
} from "@/app/api/[locale]/agent/video-generation/models";
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
    model: ChatModelOption,
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
        return getModelPrice(model);
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
    env: ModelProviderEnvAvailability,
  ): ChatModelOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    const filtered = chatModelOptions.filter((model) => {
      if (model.adminOnly && !isAdmin) {
        return false;
      }
      if (!isModelProviderAvailable(model, env)) {
        return false;
      }

      const modelPrice = this.getModelPriceLevel(getModelPrice(model));

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
    modelSelection: ChatModelSelection,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption[] {
    if (modelSelection.selectionType === ModelSelectionType.MANUAL) {
      const model = getChatModelById(modelSelection.manualModelId);
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      // If provider unavailable, fall through to filter fallback
      if (model && isModelProviderAvailable(model, env)) {
        return [model];
      }
      // Fall through to FILTERS using the selection's filter constraints
      return this.applyHardFilters(
        { ...modelSelection, selectionType: ModelSelectionType.FILTERS },
        user,
        env,
      );
    }

    return this.applyHardFilters(modelSelection, user, env);
  }

  static getFilteredModelsForFavorite(
    favoriteModelSelection: FavoriteGetModelSelection | null,
    skillModelSelection: ChatModelSelection | undefined,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption[] {
    const selectionToUse = favoriteModelSelection ?? skillModelSelection;
    if (!selectionToUse) {
      return [];
    }
    return this.getFilteredModelsInternal(selectionToUse, user, env);
  }

  static getBestModelForFavorite(
    favoriteModelSelection: FavoriteGetModelSelection | null,
    skillModelSelection: ChatModelSelection | undefined,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption | null {
    const candidates = this.getFilteredModelsForFavorite(
      favoriteModelSelection,
      skillModelSelection,
      user,
      env,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }

  /**
   * PUBLIC API: Get all models for skills
   * Only handles MANUAL and FILTERS (skills never have CHARACTER_BASED)
   */
  static getFilteredModelsForSkill(
    skillModelSelection: ChatModelSelection,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption[] {
    return this.getFilteredModelsInternal(skillModelSelection, user, env);
  }

  static getBestModelForSkill(
    skillModelSelection: ChatModelSelection,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption | null {
    const candidates = this.getFilteredModelsForSkill(
      skillModelSelection,
      user,
      env,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }

  // ---------------------------------------------------------------------------
  // Role-specific filtered model methods
  // ---------------------------------------------------------------------------

  static getFilteredTtsModels(
    selection: VoiceModelSelection | null | undefined,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): TtsModelOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    if (!selection) {
      return ttsModelOptions.filter(
        (m) => (!m.adminOnly || isAdmin) && isModelProviderAvailable(m, env),
      );
    }
    if (selection.selectionType === ModelSelectionType.MANUAL) {
      const model = getTtsModelById(selection.manualModelId);
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      if (model && isModelProviderAvailable(model, env)) {
        return [model];
      }
      // Fall through to filter fallback
    }
    return ttsModelOptions.filter((m) => {
      if (m.adminOnly && !isAdmin) {
        return false;
      }
      if (!isModelProviderAvailable(m, env)) {
        return false;
      }
      const modelPrice = this.getModelPriceLevel(getModelPrice(m));
      return (
        this.meetsRangeConstraint(
          m.intelligence,
          selection.intelligenceRange,
          IntelligenceLevelDB,
        ) &&
        this.meetsRangeConstraint(
          m.content,
          selection.contentRange,
          ContentLevelDB,
        ) &&
        this.meetsRangeConstraint(
          modelPrice,
          selection.priceRange,
          PriceLevelDB,
        ) &&
        this.meetsRangeConstraint(m.speed, selection.speedRange, SpeedLevelDB)
      );
    });
  }

  static getBestTtsModel(
    selection: VoiceModelSelection,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): TtsModelOption | null {
    return this.getFilteredTtsModels(selection, user, env)[0] ?? null;
  }

  static getFilteredSttModels(
    selection: SttModelSelection | null | undefined,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): SttModelOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    if (!selection) {
      return sttModelOptions.filter(
        (m) => (!m.adminOnly || isAdmin) && isModelProviderAvailable(m, env),
      );
    }
    if (selection.selectionType === ModelSelectionType.MANUAL) {
      const model = getSttModelById(selection.manualModelId);
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      if (model && isModelProviderAvailable(model, env)) {
        return [model];
      }
      // Fall through to filter fallback
    }
    return sttModelOptions.filter((m) => {
      if (m.adminOnly && !isAdmin) {
        return false;
      }
      if (!isModelProviderAvailable(m, env)) {
        return false;
      }
      const modelPrice = this.getModelPriceLevel(getModelPrice(m));
      return (
        this.meetsRangeConstraint(
          m.intelligence,
          selection.intelligenceRange,
          IntelligenceLevelDB,
        ) &&
        this.meetsRangeConstraint(
          m.content,
          selection.contentRange,
          ContentLevelDB,
        ) &&
        this.meetsRangeConstraint(
          modelPrice,
          selection.priceRange,
          PriceLevelDB,
        ) &&
        this.meetsRangeConstraint(m.speed, selection.speedRange, SpeedLevelDB)
      );
    });
  }

  static getBestSttModel(
    selection: SttModelSelection,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): SttModelOption | null {
    return this.getFilteredSttModels(selection, user, env)[0] ?? null;
  }

  static getFilteredImageGenModels(
    selection: ImageGenModelSelection | null | undefined,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ImageGenModelOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    if (!selection) {
      return imageGenModelOptions.filter(
        (m) => (!m.adminOnly || isAdmin) && isModelProviderAvailable(m, env),
      );
    }
    if (selection.selectionType === ModelSelectionType.MANUAL) {
      const model = getImageGenModelById(selection.manualModelId);
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      if (model && isModelProviderAvailable(model, env)) {
        return [model];
      }
      // Fall through to filter fallback
    }
    return imageGenModelOptions.filter((m) => {
      if (m.adminOnly && !isAdmin) {
        return false;
      }
      if (!isModelProviderAvailable(m, env)) {
        return false;
      }
      const modelPrice = this.getModelPriceLevel(getModelPrice(m));
      return (
        this.meetsRangeConstraint(
          m.intelligence,
          selection.intelligenceRange,
          IntelligenceLevelDB,
        ) &&
        this.meetsRangeConstraint(
          m.content,
          selection.contentRange,
          ContentLevelDB,
        ) &&
        this.meetsRangeConstraint(
          modelPrice,
          selection.priceRange,
          PriceLevelDB,
        ) &&
        this.meetsRangeConstraint(m.speed, selection.speedRange, SpeedLevelDB)
      );
    });
  }

  static getBestImageGenModel(
    selection: ImageGenModelSelection,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ImageGenModelOption | null {
    return this.getFilteredImageGenModels(selection, user, env)[0] ?? null;
  }

  static getFilteredMusicGenModels(
    selection: MusicGenModelSelection | null | undefined,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): MusicGenModelOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    if (!selection) {
      return musicGenModelOptions.filter(
        (m) => (!m.adminOnly || isAdmin) && isModelProviderAvailable(m, env),
      );
    }
    if (selection.selectionType === ModelSelectionType.MANUAL) {
      const model = getMusicGenModelById(selection.manualModelId);
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      if (model && isModelProviderAvailable(model, env)) {
        return [model];
      }
      // Fall through to filter fallback
    }
    return musicGenModelOptions.filter((m) => {
      if (m.adminOnly && !isAdmin) {
        return false;
      }
      if (!isModelProviderAvailable(m, env)) {
        return false;
      }
      const modelPrice = this.getModelPriceLevel(getModelPrice(m));
      return (
        this.meetsRangeConstraint(
          m.intelligence,
          selection.intelligenceRange,
          IntelligenceLevelDB,
        ) &&
        this.meetsRangeConstraint(
          m.content,
          selection.contentRange,
          ContentLevelDB,
        ) &&
        this.meetsRangeConstraint(
          modelPrice,
          selection.priceRange,
          PriceLevelDB,
        ) &&
        this.meetsRangeConstraint(m.speed, selection.speedRange, SpeedLevelDB)
      );
    });
  }

  static getBestMusicGenModel(
    selection: MusicGenModelSelection,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): MusicGenModelOption | null {
    return this.getFilteredMusicGenModels(selection, user, env)[0] ?? null;
  }

  static getFilteredVideoGenModels(
    selection: VideoGenModelSelection | null | undefined,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): VideoGenModelOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    if (!selection) {
      return videoGenModelOptions.filter(
        (m) => (!m.adminOnly || isAdmin) && isModelProviderAvailable(m, env),
      );
    }
    if (selection.selectionType === ModelSelectionType.MANUAL) {
      const model = getVideoGenModelById(selection.manualModelId);
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      if (model && isModelProviderAvailable(model, env)) {
        return [model];
      }
      // Fall through to filter fallback
    }
    return videoGenModelOptions.filter((m) => {
      if (m.adminOnly && !isAdmin) {
        return false;
      }
      if (!isModelProviderAvailable(m, env)) {
        return false;
      }
      const modelPrice = this.getModelPriceLevel(getModelPrice(m));
      return (
        this.meetsRangeConstraint(
          m.intelligence,
          selection.intelligenceRange,
          IntelligenceLevelDB,
        ) &&
        this.meetsRangeConstraint(
          m.content,
          selection.contentRange,
          ContentLevelDB,
        ) &&
        this.meetsRangeConstraint(
          modelPrice,
          selection.priceRange,
          PriceLevelDB,
        ) &&
        this.meetsRangeConstraint(m.speed, selection.speedRange, SpeedLevelDB)
      );
    });
  }

  static getBestVideoGenModel(
    selection: VideoGenModelSelection,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): VideoGenModelOption | null {
    return this.getFilteredVideoGenModels(selection, user, env)[0] ?? null;
  }

  // ---------------------------------------------------------------------------
  // Vision model methods (per-modality: image, video, audio)
  // ---------------------------------------------------------------------------

  private static getFilteredVisionModelsForPool(
    pool: ChatModelOption[],
    selection:
      | ImageVisionModelSelection
      | VideoVisionModelSelection
      | AudioVisionModelSelection
      | null
      | undefined,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    if (!selection) {
      return pool.filter(
        (m) => (!m.adminOnly || isAdmin) && isModelProviderAvailable(m, env),
      );
    }
    if (selection.selectionType === ModelSelectionType.MANUAL) {
      // manualModelId is a vision enum member — string-index into chatModelOptionsIndex
      const model = chatModelOptionsIndex[selection.manualModelId];
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      if (model && isModelProviderAvailable(model, env)) {
        return [model];
      }
      // Fall through to filter fallback
    }
    return pool.filter((m) => {
      if (m.adminOnly && !isAdmin) {
        return false;
      }
      if (!isModelProviderAvailable(m, env)) {
        return false;
      }
      const modelPrice = this.getModelPriceLevel(getModelPrice(m));
      return (
        this.meetsRangeConstraint(
          m.intelligence,
          selection.intelligenceRange,
          IntelligenceLevelDB,
        ) &&
        this.meetsRangeConstraint(
          m.content,
          selection.contentRange,
          ContentLevelDB,
        ) &&
        this.meetsRangeConstraint(
          modelPrice,
          selection.priceRange,
          PriceLevelDB,
        ) &&
        this.meetsRangeConstraint(m.speed, selection.speedRange, SpeedLevelDB)
      );
    });
  }

  static getFilteredImageVisionModels(
    selection: ImageVisionModelSelection | null | undefined,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption[] {
    return this.getFilteredVisionModelsForPool(
      imageVisionModelOptions,
      selection,
      user,
      env,
    );
  }

  static getBestImageVisionModel(
    selection: ImageVisionModelSelection,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption | null {
    return this.getFilteredImageVisionModels(selection, user, env)[0] ?? null;
  }

  static getFilteredVideoVisionModels(
    selection: VideoVisionModelSelection | null | undefined,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption[] {
    return this.getFilteredVisionModelsForPool(
      videoVisionModelOptions,
      selection,
      user,
      env,
    );
  }

  static getBestVideoVisionModel(
    selection: VideoVisionModelSelection,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption | null {
    return this.getFilteredVideoVisionModels(selection, user, env)[0] ?? null;
  }

  static getFilteredAudioVisionModels(
    selection: AudioVisionModelSelection | null | undefined,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption[] {
    return this.getFilteredVisionModelsForPool(
      audioVisionModelOptions,
      selection,
      user,
      env,
    );
  }

  static getBestAudioVisionModel(
    selection: AudioVisionModelSelection,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatModelOption | null {
    return this.getFilteredAudioVisionModels(selection, user, env)[0] ?? null;
  }
}
