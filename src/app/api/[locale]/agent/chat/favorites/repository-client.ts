/**
 * Favorites Client Repository
 * Client-side operations for favorites using localStorage
 * Mirrors server repository structure but runs in browser
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { parseError } from "../../../shared/utils";
import type { IconKey } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "../../models/components/types";
import { modelProviders } from "../../models/models";
import {
  DEFAULT_TTS_VOICE,
  type TtsVoiceValue,
} from "../../text-to-speech/enum";
import { DEFAULT_CHARACTERS } from "../characters/config";
import { ModelSelectionType } from "../characters/enum";
import { scopedTranslation as charactersScopedTranslation } from "../characters/i18n";
import { CharactersRepositoryClient } from "../characters/repository-client";
import { STORAGE_KEYS } from "../constants";
import { ChatSettingsRepositoryClient } from "../settings/repository-client";
import type {
  FavoriteGetModelSelection,
  FavoriteGetResponseOutput,
  FavoriteUpdateRequestOutput,
  FavoriteUpdateResponseOutput,
} from "./[id]/definition";
import type {
  FavoriteCreateRequestOutput,
  FavoriteCreateResponseOutput,
} from "./create/definition";
import type { FavoriteCard, FavoritesListResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";
import type { FavoritesReorderRequestOutput } from "./reorder/definition";

/**
 * Minimal favorite data stored in localStorage
 * Character data is filled in from DEFAULT_CHARACTERS on read
 */
interface StoredLocalFavorite {
  id: string;
  characterId: string;
  customIcon: IconKey | null;
  voice: typeof TtsVoiceValue | null;
  modelSelection: FavoriteGetModelSelection | null;
  position: number;
}

/**
 * Chat Favorites Client Repository
 * Mirrors ChatFavoritesRepository but uses localStorage
 */
export class ChatFavoritesRepositoryClient {
  /**
   * Get all favorites (mirrors server getFavorites)
   */
  static async getFavorites(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoritesListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const settings = ChatSettingsRepositoryClient.loadLocalSettings();
      const activeFavoriteId = settings.activeFavoriteId;

      // Load stored minimal configs
      const storedConfigs = this.loadAllLocalFavorites();

      // For PUBLIC users (localStorage), get character data from DEFAULT_CHARACTERS
      const { t: tChar } = charactersScopedTranslation.scopedT(locale);
      const cards = storedConfigs.map((config): FavoriteCard => {
        const character = DEFAULT_CHARACTERS.find(
          (c) => c.id === config.characterId,
        );
        return this.computeFavoriteDisplayFields(
          config,
          character?.modelSelection,
          character?.icon ?? null,
          character?.name ? tChar(character.name) : null,
          character?.tagline ? tChar(character.tagline) : null,
          character?.description ? tChar(character.description) : null,
          activeFavoriteId,
          character?.voice ?? null,
          locale,
        );
      });

      // Sort by position (ascending)
      const favorites = cards.toSorted((a, b) => a.position - b.position);

      return success({ favorites });
    } catch (error) {
      logger.error("Failed to load favorites", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create a new favorite (mirrors server createFavorite)
   */
  static async createFavorite(
    data: FavoriteCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoriteCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const id = `local-${Date.now()}`;
      const currentConfigs = this.loadAllLocalFavorites();

      const newConfig: StoredLocalFavorite = {
        id,
        characterId: data.characterId ?? "default",
        voice: data.voice ?? null,
        modelSelection: data.modelSelection,
        customIcon: null,
        position: currentConfigs.length,
      };

      this.saveAllLocalFavorites([...currentConfigs, newConfig]);
      logger.debug("Created favorite", { id });

      return success({
        success: t("post.success.title"),
        id,
      });
    } catch (error) {
      logger.error("Failed to create favorite", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get single favorite by ID (mirrors server getFavoriteById)
   */
  static async getFavoriteById(
    id: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoriteGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const config = this.loadLocalFavorite(id);
      if (!config) {
        return fail({
          message: t("id.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const enriched = this.enrichLocalFavorite(config, locale);
      return success(enriched);
    } catch (error) {
      logger.error("Failed to get favorite", { ...parseError(error), id });
      return fail({
        message: t("id.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update favorite (mirrors server updateFavorite)
   */
  static async updateFavorite(
    id: string,
    data: FavoriteUpdateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoriteUpdateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const existing = this.loadLocalFavorite(id);
      if (!existing) {
        return fail({
          message: t("id.patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const characterId = data.characterId ?? existing.characterId;
      const character = DEFAULT_CHARACTERS.find((c) => c.id === characterId);

      // Extract icon from character.info.icon in request data
      const iconFromRequest = data.icon;

      // Only store customIcon if different from character default
      const customIconToStore =
        character && iconFromRequest === character.icon
          ? null
          : (iconFromRequest ?? null);

      const updated: StoredLocalFavorite = {
        ...existing,
        characterId,
        customIcon: customIconToStore,
        voice: data.voice ?? null,
        modelSelection: data.modelSelection,
      };

      this.updateLocalFavorite(id, updated);
      logger.debug("Updated favorite", { id });

      return success({
        success: t("id.patch.success.title"),
      });
    } catch (error) {
      logger.error("Failed to update favorite", { ...parseError(error), id });
      return fail({
        message: t("id.patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete favorite (mirrors server deleteFavorite)
   */
  static async deleteFavorite(
    id: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<never>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      this.deleteLocalFavorite(id);
      logger.debug("Deleted favorite", { id });
      return success();
    } catch (error) {
      logger.error("Failed to delete favorite", { ...parseError(error), id });
      return fail({
        message: t("id.delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Reorder favorites (mirrors server reorderFavorites)
   */
  static async reorderFavorites(
    data: FavoritesReorderRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: boolean }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const allFavorites = this.loadAllLocalFavorites();

      // Update positions
      data.positions.forEach(({ id, position }) => {
        const favorite = allFavorites.find((f) => f.id === id);
        if (favorite) {
          favorite.position = position;
        }
      });

      this.saveAllLocalFavorites(allFavorites);
      logger.debug("Reordered favorites");

      return success({ success: true });
    } catch (error) {
      logger.error("Failed to reorder favorites", parseError(error));
      return fail({
        message: t("reorder.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  /**
   * Compute display fields for a favorite
   */
  static computeFavoriteDisplayFields(
    stored: StoredLocalFavorite,
    characterModelSelection:
      | FiltersModelSelection
      | ManualModelSelection
      | undefined
      | null,
    characterIcon: IconKey | null,
    characterName: string | null,
    characterTagline: string | null,
    characterDescription: string | null,
    activeFavoriteId: string | null,
    characterVoice: typeof TtsVoiceValue | null,
    locale: CountryLanguage,
  ): FavoriteCard {
    const { t } = scopedTranslation.scopedT(locale);
    const bestModel = CharactersRepositoryClient.getBestModelForFavorite(
      stored.modelSelection,
      characterModelSelection ?? undefined,
    );
    const hasCharacter = stored.characterId !== "default";

    // Flattened structure - no nested content/titleRow/modelRow
    return {
      id: stored.id,
      characterId: stored.characterId,
      modelId: bestModel?.id ?? null,
      voice: stored.voice ?? characterVoice ?? DEFAULT_TTS_VOICE,
      position: stored.position,
      icon: stored.customIcon ?? characterIcon ?? bestModel?.icon ?? "bot",
      name: characterName ?? bestModel?.name ?? t("fallbacks.unknown"),
      tagline: characterTagline ?? null,
      activeBadge: stored.id === activeFavoriteId ? ("active" as const) : null,
      description: characterDescription ?? null,
      ...(bestModel
        ? {
            modelIcon: hasCharacter ? bestModel.icon : ("sparkles" as const),
            modelInfo: bestModel.name,
            modelProvider:
              modelProviders[bestModel.provider]?.name ??
              t("fallbacks.unknownProvider"),
          }
        : {
            modelIcon: "sparkles" as const,
            modelInfo: t("fallbacks.noModel"),
            modelProvider: t("fallbacks.unknownProvider"),
          }),
    };
  }

  /**
   * Enrich minimal stored favorite with DEFAULT_CHARACTERS data
   * Returns flattened structure matching FavoriteGetResponseOutput
   */
  static enrichLocalFavorite(
    stored: StoredLocalFavorite,
    locale: CountryLanguage,
  ): FavoriteGetResponseOutput {
    const { t } = scopedTranslation.scopedT(locale);
    const { t: tChar } = charactersScopedTranslation.scopedT(locale);
    const character = DEFAULT_CHARACTERS.find(
      (c) => c.id === stored.characterId,
    );

    if (!character) {
      // Flattened structure - no character found
      return {
        characterId: stored.characterId,
        icon: "user" as const,
        name: t("fallbacks.unknownCharacter"),
        tagline: t("fallbacks.noTagline"),
        description: t("fallbacks.noDescription"),
        voice: stored.voice,
        modelSelection: stored.modelSelection, // null or actual selection
        characterModelSelection: {
          selectionType: ModelSelectionType.FILTERS,
        },
        compactTrigger: null,
        allowedTools: null,
        pinnedTools: null,
      };
    }

    // Flattened structure — translate default character keys using characters scope
    return {
      characterId: stored.characterId,
      icon: stored.customIcon ?? character.icon,
      name: character.name ? tChar(character.name) : t("fallbacks.unknown"),
      tagline: character.tagline ? tChar(character.tagline) : "",
      description: character.description ? tChar(character.description) : "",
      voice: stored.voice ?? character.voice,
      modelSelection: stored.modelSelection, // null = use character defaults
      characterModelSelection: character.modelSelection ?? {
        selectionType: ModelSelectionType.FILTERS,
      },
      compactTrigger: null,
      allowedTools: null,
      pinnedTools: null,
    };
  }

  /**
   * Load all favorites from localStorage
   */
  private static loadAllLocalFavorites(): StoredLocalFavorite[] {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITE_CHARACTERS);
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as StoredLocalFavorite[];
    } catch {
      return [];
    }
  }

  /**
   * Save all favorites to localStorage
   */
  private static saveAllLocalFavorites(configs: StoredLocalFavorite[]): void {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(
      STORAGE_KEYS.FAVORITE_CHARACTERS,
      JSON.stringify(configs),
    );
  }

  /**
   * Load single favorite by ID
   */
  static loadLocalFavorite(id: string): StoredLocalFavorite | null {
    const configs = this.loadAllLocalFavorites();
    return configs.find((config) => config.id === id) ?? null;
  }

  /**
   * Update a favorite in localStorage
   */
  private static updateLocalFavorite(
    id: string,
    updated: StoredLocalFavorite,
  ): void {
    const currentConfigs = this.loadAllLocalFavorites();
    const updatedConfigs = currentConfigs.map((config) =>
      config.id === id ? updated : config,
    );
    this.saveAllLocalFavorites(updatedConfigs);
  }

  /**
   * Delete a favorite from localStorage
   */
  private static deleteLocalFavorite(id: string): void {
    const currentConfigs = this.loadAllLocalFavorites();
    const newConfigs = currentConfigs.filter((config) => config.id !== id);
    this.saveAllLocalFavorites(newConfigs);
  }
}
