/**
 * Favorites Repository Client
 * Shared logic for favorites management, localStorage operations, and display fields
 * This is a static class with pure functions - no React dependencies
 * Can be used on both client and server since it has no React/DOM dependencies
 */

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import type { LocalStorageCallbacks } from "../../../system/unified-interface/react/hooks/endpoint-types";
import type { IconKey } from "../../../system/unified-interface/react/icons";
import type { TtsVoiceValue } from "../../text-to-speech/enum";
import { DEFAULT_CHARACTERS } from "../characters/config";
import { CharactersRepositoryClient } from "../characters/repository-client";
import { STORAGE_KEYS } from "../constants";
import type {
  FavoriteGetResponseOutput,
  FavoriteUpdateResponseOutput,
} from "./[id]/definition";
import type byIdDefinitions from "./[id]/definition";
import type favoritesCreateDefinition from "./create/definition";
import type {
  FavoriteCreateRequestOutput,
  FavoriteModelSelection,
} from "./create/definition";
import type { FavoriteCard } from "./definition";
import type favoritesDefinition from "./definition";

/**
 * Minimal favorite data stored in localStorage
 * Character data is filled in from DEFAULT_CHARACTERS on read
 */
interface StoredLocalFavorite {
  id: string;
  characterId: string;
  customName: string | null;
  customIcon: IconKey | null;
  voice: typeof TtsVoiceValue | null;
  modelSelection: FavoriteModelSelection;
  color: string | null;
  position: number;
  useCount: number;
}

/**
 * Fields that can be updated in localStorage favorites
 */
type StoredLocalFavoriteUpdate = Omit<StoredLocalFavorite, "id" | "useCount">;

/**
 * Favorites Repository Client - Static class pattern
 * All methods are pure functions for client-side favorites management
 *
 * Internal Storage Format:
 * - Stores minimal StoredLocalFavorite in localStorage
 * - Enriches with DEFAULT_CHARACTERS data on read
 * - Computes modelId from modelSelection
 */
export class FavoritesRepositoryClient {
  /**
   * Static localStorage callbacks for useEndpoint hook (list operations)
   * Handles read (GET) and create (POST) operations for non-authenticated users
   * Enriches minimal stored data with DEFAULT_CHARACTERS
   */
  static readonly localStorageListCallbacks: LocalStorageCallbacks<
    typeof favoritesDefinition
  > = {
    read: async (): Promise<
      ResponseType<{ favoritesList: FavoriteCard[] }>
    > => {
      // Load stored minimal configs
      const storedConfigs =
        FavoritesRepositoryClient.loadAllLocalFavoriteConfigs();

      // Enrich with DEFAULT_CHARACTERS data and compute modelId
      const cards = storedConfigs.map((config): FavoriteCard => {
        // Find character from DEFAULT_CHARACTERS
        const character = DEFAULT_CHARACTERS.find(
          (c) => c.id === config.characterId,
        );

        if (!character) {
          // Fallback for unknown character
          return {
            id: config.id,
            characterId: config.characterId,
            modelId: null,
            icon: config.customIcon ?? ("user" as const),
            content: {
              titleRow: {
                name:
                  config.customName ??
                  ("app.api.agent.chat.favorites.fallbacks.unknownCharacter" as const),
                tagline:
                  "app.api.agent.chat.favorites.fallbacks.noTagline" as const,
              },
              description:
                "app.api.agent.chat.favorites.fallbacks.noDescription" as const,
              modelRow: {
                modelIcon: "sparkles" as const,
                modelInfo:
                  "app.api.agent.chat.favorites.fallbacks.unknown" as const,
                modelProvider:
                  "app.api.agent.chat.favorites.fallbacks.unknownProvider" as const,
                creditCost:
                  "app.api.agent.chat.favorites.fallbacks.zeroCredits" as const,
              },
            },
          };
        }

        // Compute best model from favorite's modelSelection + character's modelSelection
        const bestModel = CharactersRepositoryClient.getBestModelForFavorite(
          config.modelSelection,
          character.modelSelection,
        );

        return {
          id: config.id,
          characterId: config.characterId,
          modelId: bestModel?.id ?? null,
          icon: config.customIcon ?? character.icon ?? bestModel?.icon ?? "bot",
          content: {
            titleRow: {
              name:
                config.customName ??
                character.name ??
                bestModel?.name ??
                ("app.api.agent.chat.favorites.fallbacks.unknownModel" as const),
              tagline:
                character.tagline ??
                ("app.api.agent.chat.favorites.fallbacks.noTagline" as const),
            },
            description:
              character.description ??
              ("app.api.agent.chat.favorites.fallbacks.noDescription" as const),
            modelRow: bestModel
              ? {
                  modelIcon: bestModel.icon,
                  modelInfo: bestModel.name,
                  modelProvider:
                    bestModel.provider ??
                    ("app.api.agent.chat.favorites.fallbacks.unknownProvider" as const),
                  creditCost: `${bestModel.creditCost} credits`,
                }
              : {
                  modelIcon: "sparkles" as const,
                  modelInfo: "No model found",
                  modelProvider:
                    "app.api.agent.chat.favorites.fallbacks.unknownProvider" as const,
                  creditCost:
                    "app.api.agent.chat.favorites.fallbacks.zeroCredits" as const,
                },
          },
        };
      });

      return success({ favoritesList: cards });
    },
  };
  static readonly localStorageCreateCallbacks: LocalStorageCallbacks<
    typeof favoritesCreateDefinition
  > = {
    create: async (params: {
      requestData: FavoriteCreateRequestOutput;
    }): Promise<ResponseType<{ id: string }>> => {
      // Creates and stores as FavoriteGetResponseOutput internally
      const newConfig = FavoritesRepositoryClient.createLocalFavorite(
        params.requestData,
      );
      return success({ id: newConfig.id });
    },
  };

  /**
   * Static localStorage callbacks for individual favorite by ID operations
   * Used for GET/PATCH/DELETE /favorites/[id] endpoints
   * Internally stores and retrieves data as FavoriteGetResponseOutput
   */
  static readonly byIdCallbacks: LocalStorageCallbacks<typeof byIdDefinitions> =
    {
      // Get single favorite by ID - returns FavoriteGetResponseOutput directly
      read: async (params: {
        urlPathParams?: { id: string };
      }): Promise<ResponseType<FavoriteGetResponseOutput>> => {
        if (!params.urlPathParams?.id) {
          return fail({
            message:
              "app.api.agent.chat.favorites.get.errors.validation.description",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        // Fetch from storage as FavoriteGetResponseOutput
        const config = FavoritesRepositoryClient.fetchLocalFavoriteConfig(
          params.urlPathParams.id,
        );
        if (!config) {
          return fail({
            message:
              "app.api.agent.chat.favorites.get.errors.notFound.description",
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        // Return FavoriteGetResponseOutput directly - no conversion needed
        return success(config);
      },

      // Update single favorite by ID - works with FavoriteGetResponseOutput
      update: async (
        params,
      ): Promise<ResponseType<FavoriteUpdateResponseOutput>> => {
        if (!params.urlPathParams?.id) {
          return fail({
            message:
              "app.api.agent.chat.favorites.id.patch.errors.validation.description",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const existing = FavoritesRepositoryClient.loadLocalFavoriteConfig(
          params.urlPathParams.id,
        );
        if (!existing) {
          return fail({
            message:
              "app.api.agent.chat.favorites.id.patch.errors.notFound.description",
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        // Update stored minimal subset - build full update object
        const updates: StoredLocalFavoriteUpdate = {
          characterId: params.requestData.characterId ?? existing.characterId,
          customName: params.requestData.customName ?? null,
          customIcon: params.requestData.customIcon ?? null,
          voice: params.requestData.voice ?? null,
          modelSelection: params.requestData.modelSelection,
          color: params.requestData.color ?? null,
          position: params.requestData.position ?? existing.position,
        };

        FavoritesRepositoryClient.updateLocalFavorite(
          params.urlPathParams.id,
          updates,
        );
        const updated = FavoritesRepositoryClient.fetchLocalFavoriteConfig(
          params.urlPathParams.id,
        );

        if (!updated) {
          return fail({
            message:
              "app.api.agent.chat.favorites.id.patch.errors.notFound.description",
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        return success({ success: true });
      },

      // Delete single favorite by ID
      delete: async (params) => {
        if (!params.urlPathParams?.id) {
          return fail({
            message:
              "app.api.agent.chat.favorites.id.delete.errors.validation.description",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        FavoritesRepositoryClient.deleteLocalFavorite(params.urlPathParams.id);
        return success();
      },
    };

  /**
   * Load all favorite configs from localStorage (minimal subset)
   */
  private static loadAllLocalFavoriteConfigs(): StoredLocalFavorite[] {
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
   * Save all favorite configs to localStorage (minimal subset)
   */
  private static saveAllLocalFavoriteConfigs(
    configs: StoredLocalFavorite[],
  ): void {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(
      STORAGE_KEYS.FAVORITE_CHARACTERS,
      JSON.stringify(configs),
    );
  }

  /**
   * Load single favorite config by ID from localStorage
   */
  private static loadLocalFavoriteConfig(
    id: string,
  ): StoredLocalFavorite | null {
    const configs = this.loadAllLocalFavoriteConfigs();
    return configs.find((config) => config.id === id) ?? null;
  }

  /**
   * Create a localStorage favorite (stores minimal subset)
   * Returns enriched FavoriteGetResponseOutput for response
   */
  private static createLocalFavorite(
    request: FavoriteCreateRequestOutput,
  ): FavoriteGetResponseOutput {
    const id = `local-${Date.now()}`;
    const currentConfigs = this.loadAllLocalFavoriteConfigs();

    // Store minimal subset
    const newConfig: StoredLocalFavorite = {
      id,
      characterId: request.characterId ?? "default",
      customName: request.customName ?? null,
      voice: request.voice ?? null,
      modelSelection: request.modelSelection,
      color: null,
      customIcon: request.customIcon ?? null,
      position: currentConfigs.length,
      useCount: 0,
    };

    this.saveAllLocalFavoriteConfigs([...currentConfigs, newConfig]);

    // Return enriched version with character data from DEFAULT_CHARACTERS
    return this.enrichLocalFavorite(newConfig);
  }

  /**
   * Enrich minimal stored favorite with DEFAULT_CHARACTERS data
   */
  private static enrichLocalFavorite(
    stored: StoredLocalFavorite,
  ): FavoriteGetResponseOutput {
    const character = DEFAULT_CHARACTERS.find(
      (c) => c.id === stored.characterId,
    );

    if (!character) {
      // Fallback for unknown character
      return {
        id: stored.id,
        characterId: stored.characterId,
        character: {
          info: {
            icon: "user" as const,
            info: {
              titleRow: {
                name: "app.api.agent.chat.favorites.fallbacks.unknownCharacter" as const,
                tagline:
                  "app.api.agent.chat.favorites.fallbacks.noTagline" as const,
              },
              description:
                "app.api.agent.chat.favorites.fallbacks.noDescription" as const,
            },
          },
        },
        customName: stored.customName,
        customIcon: stored.customIcon,
        voice: stored.voice,
        modelSelection: stored.modelSelection,
        color: stored.color,
        position: stored.position,
        useCount: stored.useCount,
      };
    }

    return {
      id: stored.id,
      characterId: stored.characterId,
      character: {
        info: {
          icon: stored.customIcon ?? character.icon,
          info: {
            titleRow: {
              name:
                character.name ??
                ("app.api.agent.chat.favorites.fallbacks.unknownCharacter" as const),
              tagline:
                character.tagline ??
                ("app.api.agent.chat.favorites.fallbacks.noTagline" as const),
            },
            description:
              character.description ??
              ("app.api.agent.chat.favorites.fallbacks.noDescription" as const),
          },
        },
      },
      customName: stored.customName,
      customIcon: stored.customIcon,
      voice: stored.voice,
      modelSelection: stored.modelSelection,
      color: stored.color,
      position: stored.position,
      useCount: stored.useCount,
    };
  }

  /**
   * Update a localStorage favorite (minimal subset)
   */
  private static updateLocalFavorite(
    id: string,
    updates: StoredLocalFavoriteUpdate,
  ): void {
    const currentConfigs = this.loadAllLocalFavoriteConfigs();
    const updatedConfigs = currentConfigs.map((config) =>
      config.id === id ? { ...config, ...updates } : config,
    );
    this.saveAllLocalFavoriteConfigs(updatedConfigs);
  }

  /**
   * Delete a localStorage favorite
   */
  private static deleteLocalFavorite(id: string): void {
    const currentConfigs = this.loadAllLocalFavoriteConfigs();
    const newConfigs = currentConfigs.filter((config) => config.id !== id);
    this.saveAllLocalFavoriteConfigs(newConfigs);
  }

  /**
   * Fetch full favorite config from localStorage (enriched with DEFAULT_CHARACTERS)
   */
  private static fetchLocalFavoriteConfig(
    id: string,
  ): FavoriteGetResponseOutput | null {
    const config = this.loadLocalFavoriteConfig(id);
    if (!config) {
      return null;
    }
    return this.enrichLocalFavorite(config);
  }
}
