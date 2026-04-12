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
  getChatModelById,
  type ChatModelOption,
} from "@/app/api/[locale]/agent/ai-stream/models";
import {
  audioVisionModelOptions,
  imageVisionModelOptions,
  videoVisionModelOptions,
  type AudioVisionModelOption,
  type ImageVisionModelOption,
  type VideoVisionModelOption,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import type {
  ModelOptionBase,
  ModelOptionTokenBased,
} from "@/app/api/[locale]/agent/models/models";
import type { FavoriteGetModelSelection } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import {
  imageGenModelOptions,
  type ImageGenModelOption,
} from "@/app/api/[locale]/agent/image-generation/models";
import { getModelPrice } from "@/app/api/[locale]/agent/models/all-models";
import { isModelProviderAvailable } from "@/app/api/[locale]/agent/models/models";
import type { ChatModelSelection } from "@/app/api/[locale]/agent/ai-stream/models";
import type {
  AudioVisionModelSelection,
  ImageVisionModelSelection,
  VideoVisionModelSelection,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import type { MusicGenModelSelection } from "@/app/api/[locale]/agent/music-generation/models";
import type { SttModelSelection } from "@/app/api/[locale]/agent/speech-to-text/models";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import type { VideoGenModelSelection } from "@/app/api/[locale]/agent/video-generation/models";
import {
  musicGenModelOptions,
  type MusicGenModelOption,
} from "@/app/api/[locale]/agent/music-generation/models";
import {
  sttModelOptions,
  type SttModelOption,
} from "@/app/api/[locale]/agent/speech-to-text/models";
import {
  ttsModelOptions,
  type TtsModelOption,
} from "@/app/api/[locale]/agent/text-to-speech/models";
import {
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
    filters: ChatModelSelection,
    user: JwtPayloadType,
  ): ChatModelOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    const filtered = chatModelOptions.filter((model) => {
      if (model.adminOnly && !isAdmin) {
        return false;
      }
      if (!isModelProviderAvailable(model)) {
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
        this.meetsRangeConstraint(modelPrice, filters.priceRange, PriceLevelDB)
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
  ): ChatModelOption[] {
    if (modelSelection.selectionType === ModelSelectionType.MANUAL) {
      const model = getChatModelById(modelSelection.manualModelId);
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      // If provider unavailable, fall through to filter fallback
      if (model && isModelProviderAvailable(model)) {
        return [model];
      }
      // Fall through to FILTERS using the selection's filter constraints
      return this.applyHardFilters(
        { ...modelSelection, selectionType: ModelSelectionType.FILTERS },
        user,
      );
    }

    return this.applyHardFilters(modelSelection, user);
  }

  static getFilteredModelsForFavorite(
    favoriteModelSelection: FavoriteGetModelSelection | null,
    skillModelSelection: ChatModelSelection | undefined,
    user: JwtPayloadType,
  ): ChatModelOption[] {
    const selectionToUse = favoriteModelSelection ?? skillModelSelection;
    if (!selectionToUse) {
      return [];
    }
    return this.getFilteredModelsInternal(selectionToUse, user);
  }

  static getBestModelForFavorite(
    favoriteModelSelection: FavoriteGetModelSelection | null,
    skillModelSelection: ChatModelSelection | undefined,
    user: JwtPayloadType,
  ): ChatModelOption | null {
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
    skillModelSelection: ChatModelSelection,
    user: JwtPayloadType,
  ): ChatModelOption[] {
    return this.getFilteredModelsInternal(skillModelSelection, user);
  }

  static getBestModelForSkill(
    skillModelSelection: ChatModelSelection,
    user: JwtPayloadType,
  ): ChatModelOption | null {
    const candidates = this.getFilteredModelsForSkill(
      skillModelSelection,
      user,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }

  // ---------------------------------------------------------------------------
  // Role-specific filtered model methods
  // ---------------------------------------------------------------------------

  static getFilteredTtsModels(
    selection: VoiceModelSelection | null | undefined,
    user: JwtPayloadType,
  ): TtsModelOption[] {
    return this.filterRoleModels(ttsModelOptions, selection, user);
  }

  static getBestTtsModel(
    selection: VoiceModelSelection,
    user: JwtPayloadType,
  ): TtsModelOption | null {
    return this.getFilteredTtsModels(selection, user)[0] ?? null;
  }

  static getFilteredSttModels(
    selection: SttModelSelection | null | undefined,
    user: JwtPayloadType,
  ): SttModelOption[] {
    return this.filterRoleModels(sttModelOptions, selection, user);
  }

  static getBestSttModel(
    selection: SttModelSelection,
    user: JwtPayloadType,
  ): SttModelOption | null {
    return this.getFilteredSttModels(selection, user)[0] ?? null;
  }

  static getFilteredImageGenModels(
    selection: ImageGenModelSelection | null | undefined,
    user: JwtPayloadType,
  ): ImageGenModelOption[] {
    return this.filterRoleModels(imageGenModelOptions, selection, user);
  }

  static getBestImageGenModel(
    selection: ImageGenModelSelection,
    user: JwtPayloadType,
  ): ImageGenModelOption | null {
    return this.getFilteredImageGenModels(selection, user)[0] ?? null;
  }

  static getFilteredMusicGenModels(
    selection: MusicGenModelSelection | null | undefined,
    user: JwtPayloadType,
  ): MusicGenModelOption[] {
    return this.filterRoleModels(musicGenModelOptions, selection, user);
  }

  static getBestMusicGenModel(
    selection: MusicGenModelSelection,
    user: JwtPayloadType,
  ): MusicGenModelOption | null {
    return this.getFilteredMusicGenModels(selection, user)[0] ?? null;
  }

  static getFilteredVideoGenModels(
    selection: VideoGenModelSelection | null | undefined,
    user: JwtPayloadType,
  ): VideoGenModelOption[] {
    return this.filterRoleModels(videoGenModelOptions, selection, user);
  }

  static getBestVideoGenModel(
    selection: VideoGenModelSelection,
    user: JwtPayloadType,
  ): VideoGenModelOption | null {
    return this.getFilteredVideoGenModels(selection, user)[0] ?? null;
  }

  // ---------------------------------------------------------------------------
  // Vision model methods (per-modality: image, video, audio)
  // ---------------------------------------------------------------------------

  /**
   * Shared filter logic for any role with its own strictly-typed model pool.
   * Handles: null → all available, MANUAL → lookup by id, fall-through to FILTERS on unavailable,
   * FILTERS → range constraints.
   * Each role's public method is a one-liner wrapper that provides the pool and getById.
   */
  private static filterRoleModels<
    TOption extends ModelOptionBase,
    TSelection extends {
      selectionType: string;
      manualModelId?: string;
      intelligenceRange?: { min?: string; max?: string };
      contentRange?: { min?: string; max?: string };
      priceRange?: { min?: string; max?: string };
    },
  >(
    pool: TOption[],
    selection: TSelection | null | undefined,
    user: JwtPayloadType,
  ): TOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    if (!selection) {
      return pool.filter(
        (m) => (!m.adminOnly || isAdmin) && isModelProviderAvailable(m),
      );
    }
    if (selection.selectionType === ModelSelectionType.MANUAL) {
      const model = selection.manualModelId
        ? pool.find((m) => m.id === selection.manualModelId)
        : undefined;
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      if (model && isModelProviderAvailable(model)) {
        return [model];
      }
      // Fall through to filter fallback
    }
    return pool.filter((m) => {
      if (m.adminOnly && !isAdmin) {
        return false;
      }
      if (!isModelProviderAvailable(m)) {
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
        )
      );
    });
  }

  private static filterVisionPool<T extends ModelOptionTokenBased>(
    pool: T[],
    selection:
      | ImageVisionModelSelection
      | VideoVisionModelSelection
      | AudioVisionModelSelection
      | null
      | undefined,
    user: JwtPayloadType,
  ): T[] {
    return this.filterRoleModels(pool, selection, user);
  }

  static getFilteredImageVisionModels(
    selection: ImageVisionModelSelection | null | undefined,
    user: JwtPayloadType,
  ): ImageVisionModelOption[] {
    return this.filterVisionPool(imageVisionModelOptions, selection, user);
  }

  static getBestImageVisionModel(
    selection: ImageVisionModelSelection,
    user: JwtPayloadType,
  ): ImageVisionModelOption | null {
    return this.getFilteredImageVisionModels(selection, user)[0] ?? null;
  }

  static getFilteredVideoVisionModels(
    selection: VideoVisionModelSelection | null | undefined,
    user: JwtPayloadType,
  ): VideoVisionModelOption[] {
    return this.filterVisionPool(videoVisionModelOptions, selection, user);
  }

  static getBestVideoVisionModel(
    selection: VideoVisionModelSelection,
    user: JwtPayloadType,
  ): VideoVisionModelOption | null {
    return this.getFilteredVideoVisionModels(selection, user)[0] ?? null;
  }

  static getFilteredAudioVisionModels(
    selection: AudioVisionModelSelection | null | undefined,
    user: JwtPayloadType,
  ): AudioVisionModelOption[] {
    return this.filterVisionPool(audioVisionModelOptions, selection, user);
  }

  static getBestAudioVisionModel(
    selection: AudioVisionModelSelection,
    user: JwtPayloadType,
  ): AudioVisionModelOption | null {
    return this.getFilteredAudioVisionModels(selection, user)[0] ?? null;
  }
}
