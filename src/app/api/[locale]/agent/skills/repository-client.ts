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

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { IconKey } from "next-vibe/unified-ui/form-fields/icon-field/icons";

import { DEFAULT_CHAT_MODEL_SELECTION } from "@/app/api/[locale]/agent/ai-stream/constants";
import type { ChatModelSelection } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  type ChatModelOption,
  chatModelOptions,
  getBestChatModel,
  getChatModelById,
} from "@/app/api/[locale]/agent/ai-stream/models";
import type {
  AudioVisionModelSelection,
  ImageVisionModelSelection,
  VideoVisionModelSelection,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import {
  type AudioVisionModelOption,
  audioVisionModelOptions,
  type ImageVisionModelOption,
  imageVisionModelOptions,
  type VideoVisionModelOption,
  videoVisionModelOptions,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import type { AgentEnvAvailability } from "../env-availability";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import {
  type ImageGenModelOption,
  imageGenModelOptions,
} from "@/app/api/[locale]/agent/image-generation/models";
import { getModelDisplayName } from "@/app/api/[locale]/agent/models/all-models";
import type {
  ModelOptionBase,
  ModelOptionTokenBased,
} from "@/app/api/[locale]/agent/models/models";
import { getModelPrice } from "@/app/api/[locale]/agent/models/models";
import {
  isModelProviderAvailable,
  modelProviders,
} from "@/app/api/[locale]/agent/models/models";
import type { MusicGenModelSelection } from "@/app/api/[locale]/agent/music-generation/models";
import {
  type MusicGenModelOption,
  musicGenModelOptions,
} from "@/app/api/[locale]/agent/music-generation/models";
import type { FavoriteGetModelSelection } from "@/app/api/[locale]/agent/skills/favorites/[id]/definition";
import type { SttModelSelection } from "@/app/api/[locale]/agent/speech-to-text/models";
import {
  type SttModelOption,
  sttModelOptions,
} from "@/app/api/[locale]/agent/speech-to-text/models";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import {
  type TtsModelOption,
  ttsModelOptions,
} from "@/app/api/[locale]/agent/text-to-speech/models";
import type { VideoGenModelSelection } from "@/app/api/[locale]/agent/video-generation/models";
import {
  type VideoGenModelOption,
  videoGenModelOptions,
} from "@/app/api/[locale]/agent/video-generation/models";

import { formatSkillId } from "../chat/slugify";
import type { SkillListItem } from "./definition";
import {
  ContentLevelDB,
  IntelligenceLevelDB,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  PriceLevel,
  PriceLevelDB,
  type SkillCategoryValue,
  type SkillOwnershipTypeValue,
  type SkillTrustLevelValue,
} from "./enum";
import type { SkillsT } from "./i18n";

export class SkillsRepositoryClient {
  /**
   * Build a SkillListItem display card from a skill's raw fields. Single source of
   * truth used both server-side (repository.mapSkillToListItem delegates here) and
   * client-side (each skill CRUD op's onEvent rebuilds the card from its event's
   * request payload, matching the favorites computeFavoriteDisplayFields pattern).
   */
  static mapSkillToListItem(
    id: string,
    char: {
      icon: IconKey | null;
      name: string | null;
      tagline: string | null;
      description: string | null;
      category: typeof SkillCategoryValue;
      modelSelection: ChatModelSelection | null | undefined;
      ownershipType: typeof SkillOwnershipTypeValue;
      voteCount: number | null;
      trustLevel: typeof SkillTrustLevelValue | null;
    },
    t: SkillsT,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
    variantId?: string | null,
    variantName?: string | null,
    isVariant?: boolean,
    isDefault?: boolean,
  ): SkillListItem {
    const selection = char.modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION;
    const bestModel = getBestChatModel(selection, user, availability);
    const modelId = bestModel?.id ?? null;
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    const modelRow = bestModel
      ? {
          modelIcon: bestModel.icon,
          modelInfo: getModelDisplayName(bestModel, isAdmin, availability),
          modelProvider:
            modelProviders[bestModel.provider]?.name ?? bestModel.provider,
        }
      : {
          modelIcon: "sparkles" as const,
          modelInfo: t("fallbacks.unknownModel"),
          modelProvider: t("fallbacks.unknownProvider"),
        };

    return {
      skillId: formatSkillId(id, variantId),
      category: char.category,
      icon: char.icon ?? "sparkles",
      modelId,
      name: char.name ?? bestModel?.name ?? t("fallbacks.unknownModel"),
      description: char.description ?? t("fallbacks.noDescription"),
      tagline: char.tagline ?? t("fallbacks.noTagline"),
      ownershipType: char.ownershipType,
      voteCount: char.voteCount,
      trustLevel: char.trustLevel,
      variantName: variantName ?? null,
      isVariant: isVariant ?? false,
      isDefault: isDefault ?? false,
      ...modelRow,
    };
  }

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
    availability: AgentEnvAvailability,
  ): ChatModelOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    const filtered = chatModelOptions.filter((model) => {
      if (model.adminOnly && !isAdmin) {
        return false;
      }
      if (!isModelProviderAvailable(model, availability)) {
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
    availability: AgentEnvAvailability,
  ): ChatModelOption[] {
    if (modelSelection.selectionType === ModelSelectionType.MANUAL) {
      const model = getChatModelById(modelSelection.manualModelId);
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      // If provider unavailable, fall through to filter fallback
      if (model && isModelProviderAvailable(model, availability)) {
        return [model];
      }
      // Fall through to FILTERS using the selection's filter constraints
      return this.applyHardFilters(
        { ...modelSelection, selectionType: ModelSelectionType.FILTERS },
        user,
        availability,
      );
    }

    return this.applyHardFilters(modelSelection, user, availability);
  }

  static getFilteredModelsForFavorite(
    favoriteModelSelection: FavoriteGetModelSelection | null,
    skillModelSelection: ChatModelSelection | undefined,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): ChatModelOption[] {
    const selectionToUse = favoriteModelSelection ?? skillModelSelection;
    if (!selectionToUse) {
      return [];
    }
    return this.getFilteredModelsInternal(selectionToUse, user, availability);
  }

  static getBestModelForFavorite(
    favoriteModelSelection: FavoriteGetModelSelection | null,
    skillModelSelection: ChatModelSelection | undefined,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): ChatModelOption | null {
    const candidates = this.getFilteredModelsForFavorite(
      favoriteModelSelection,
      skillModelSelection,
      user,
      availability,
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
    availability: AgentEnvAvailability,
  ): ChatModelOption[] {
    return this.getFilteredModelsInternal(
      skillModelSelection,
      user,
      availability,
    );
  }

  static getBestModelForSkill(
    skillModelSelection: ChatModelSelection,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): ChatModelOption | null {
    const candidates = this.getFilteredModelsForSkill(
      skillModelSelection,
      user,
      availability,
    );
    return candidates.length > 0 ? candidates[0] : null;
  }

  // ---------------------------------------------------------------------------
  // Role-specific filtered model methods
  // ---------------------------------------------------------------------------

  static getFilteredTtsModels(
    selection: VoiceModelSelection | null | undefined,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): TtsModelOption[] {
    return this.filterRoleModels(
      ttsModelOptions,
      selection,
      user,
      availability,
    );
  }

  static getBestTtsModel(
    selection: VoiceModelSelection,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): TtsModelOption | null {
    return this.getFilteredTtsModels(selection, user, availability)[0] ?? null;
  }

  static getFilteredSttModels(
    selection: SttModelSelection | null | undefined,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): SttModelOption[] {
    return this.filterRoleModels(
      sttModelOptions,
      selection,
      user,
      availability,
    );
  }

  static getBestSttModel(
    selection: SttModelSelection,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): SttModelOption | null {
    return this.getFilteredSttModels(selection, user, availability)[0] ?? null;
  }

  static getFilteredImageGenModels(
    selection: ImageGenModelSelection | null | undefined,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): ImageGenModelOption[] {
    return this.filterRoleModels(
      imageGenModelOptions,
      selection,
      user,
      availability,
    );
  }

  static getBestImageGenModel(
    selection: ImageGenModelSelection,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): ImageGenModelOption | null {
    return (
      this.getFilteredImageGenModels(selection, user, availability)[0] ?? null
    );
  }

  static getFilteredMusicGenModels(
    selection: MusicGenModelSelection | null | undefined,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): MusicGenModelOption[] {
    return this.filterRoleModels(
      musicGenModelOptions,
      selection,
      user,
      availability,
    );
  }

  static getBestMusicGenModel(
    selection: MusicGenModelSelection,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): MusicGenModelOption | null {
    return (
      this.getFilteredMusicGenModels(selection, user, availability)[0] ?? null
    );
  }

  static getFilteredVideoGenModels(
    selection: VideoGenModelSelection | null | undefined,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): VideoGenModelOption[] {
    return this.filterRoleModels(
      videoGenModelOptions,
      selection,
      user,
      availability,
    );
  }

  static getBestVideoGenModel(
    selection: VideoGenModelSelection,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): VideoGenModelOption | null {
    return (
      this.getFilteredVideoGenModels(selection, user, availability)[0] ?? null
    );
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
    availability: AgentEnvAvailability,
  ): TOption[] {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    if (!selection) {
      return pool.filter(
        (m) =>
          (!m.adminOnly || isAdmin) &&
          isModelProviderAvailable(m, availability),
      );
    }
    if (selection.selectionType === ModelSelectionType.MANUAL) {
      const model = selection.manualModelId
        ? pool.find((m) => m.id === selection.manualModelId)
        : undefined;
      if (model?.adminOnly && !isAdmin) {
        return [];
      }
      if (model && isModelProviderAvailable(model, availability)) {
        return [model];
      }
      // Fall through to filter fallback
    }
    return pool.filter((m) => {
      if (m.adminOnly && !isAdmin) {
        return false;
      }
      if (!isModelProviderAvailable(m, availability)) {
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
    availability: AgentEnvAvailability,
  ): T[] {
    return this.filterRoleModels(pool, selection, user, availability);
  }

  static getFilteredImageVisionModels(
    selection: ImageVisionModelSelection | null | undefined,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): ImageVisionModelOption[] {
    return this.filterVisionPool(
      imageVisionModelOptions,
      selection,
      user,
      availability,
    );
  }

  static getBestImageVisionModel(
    selection: ImageVisionModelSelection,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): ImageVisionModelOption | null {
    return (
      this.getFilteredImageVisionModels(selection, user, availability)[0] ??
      null
    );
  }

  static getFilteredVideoVisionModels(
    selection: VideoVisionModelSelection | null | undefined,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): VideoVisionModelOption[] {
    return this.filterVisionPool(
      videoVisionModelOptions,
      selection,
      user,
      availability,
    );
  }

  static getBestVideoVisionModel(
    selection: VideoVisionModelSelection,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): VideoVisionModelOption | null {
    return (
      this.getFilteredVideoVisionModels(selection, user, availability)[0] ??
      null
    );
  }

  static getFilteredAudioVisionModels(
    selection: AudioVisionModelSelection | null | undefined,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): AudioVisionModelOption[] {
    return this.filterVisionPool(
      audioVisionModelOptions,
      selection,
      user,
      availability,
    );
  }

  static getBestAudioVisionModel(
    selection: AudioVisionModelSelection,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): AudioVisionModelOption | null {
    return (
      this.getFilteredAudioVisionModels(selection, user, availability)[0] ??
      null
    );
  }
}
