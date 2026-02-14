/**
 * Chat Settings Repository Client
 * Handles localStorage operations for chat settings
 * Used for non-authenticated users
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../../system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "../../../user/auth/types";
import { defaultModel, type ModelId } from "../../models/models";
import type { TtsVoiceValue } from "../../text-to-speech/enum";
import { DEFAULT_TTS_VOICE } from "../../text-to-speech/enum";
import { DEFAULT_TOOL_CONFIRMATION_IDS, DEFAULT_TOOL_IDS } from "../constants";
import { ViewMode } from "../enum";
import type {
  ChatSettingsGetResponseOutput,
  ChatSettingsUpdateRequestOutput,
} from "./definition";

/**
 * Storage key for chat settings
 */
const STORAGE_KEY = "chat-settings-v3";

/**
 * Chat Settings Repository Client
 * Static class for client-side settings management
 */
export class ChatSettingsRepositoryClient {
  /**
   * Get settings (mirrors server getSettings)
   */
  static async getSettings(
    logger: EndpointLogger,
  ): Promise<ResponseType<ChatSettingsGetResponseOutput>> {
    try {
      const settings = this.loadLocalSettings();
      logger.debug("Loaded settings from localStorage");
      return success(settings);
    } catch (error) {
      logger.error(
        "Failed to load settings",
        error instanceof Error ? error : new Error(String(error)),
      );
      return success(this.getDefaults());
    }
  }

  /**
   * Update settings (mirrors server updateSettings)
   */
  static async updateSettings(
    data: ChatSettingsUpdateRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<never>> {
    try {
      this.updateLocalSettings(data);
      return success();
    } catch (error) {
      logger.error(
        "Failed to update settings",
        error instanceof Error ? error : new Error(String(error)),
      );
      return success();
    }
  }

  /**
   * Get default values - shared between client and server
   */
  static getDefaults(): ChatSettingsGetResponseOutput {
    return {
      selectedModel: defaultModel,
      selectedCharacter: "default",
      activeFavoriteId: null,
      ttsAutoplay: false,
      ttsVoice: DEFAULT_TTS_VOICE,
      viewMode: ViewMode.LINEAR,
      enabledTools: DEFAULT_TOOL_IDS.map((id) => ({
        id,
        requiresConfirmation: DEFAULT_TOOL_CONFIRMATION_IDS.some(
          (confirmId) => confirmId === id,
        ),
      })),
    };
  }

  /**
   * Load settings from localStorage - merges stored overrides with defaults
   */
  static loadLocalSettings(): ChatSettingsGetResponseOutput {
    if (typeof window === "undefined") {
      return this.getDefaults();
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return this.getDefaults();
    }

    try {
      const overrides = JSON.parse(stored);
      const defaults = this.getDefaults();

      // Merge overrides with defaults
      return {
        selectedModel: overrides.selectedModel ?? defaults.selectedModel,
        selectedCharacter:
          overrides.selectedCharacter ?? defaults.selectedCharacter,
        activeFavoriteId:
          overrides.activeFavoriteId ?? defaults.activeFavoriteId,
        ttsAutoplay: overrides.ttsAutoplay ?? defaults.ttsAutoplay,
        ttsVoice: overrides.ttsVoice ?? defaults.ttsVoice,
        viewMode: overrides.viewMode ?? defaults.viewMode,
        enabledTools: overrides.enabledTools ?? defaults.enabledTools,
      };
    } catch {
      return this.getDefaults();
    }
  }

  /**
   * Save settings to localStorage - only stores values different from defaults
   */
  static saveLocalSettings(settings: ChatSettingsGetResponseOutput): void {
    if (typeof window === "undefined") {
      return;
    }

    const defaults = this.getDefaults();
    const overrides: Partial<ChatSettingsGetResponseOutput> = {};

    // Only store values that differ from defaults
    if (settings.selectedModel !== defaults.selectedModel) {
      overrides.selectedModel = settings.selectedModel;
    }
    if (settings.selectedCharacter !== defaults.selectedCharacter) {
      overrides.selectedCharacter = settings.selectedCharacter;
    }
    if (settings.activeFavoriteId !== defaults.activeFavoriteId) {
      overrides.activeFavoriteId = settings.activeFavoriteId;
    }
    if (settings.ttsAutoplay !== defaults.ttsAutoplay) {
      overrides.ttsAutoplay = settings.ttsAutoplay;
    }
    if (settings.ttsVoice !== defaults.ttsVoice) {
      overrides.ttsVoice = settings.ttsVoice;
    }
    if (settings.viewMode !== defaults.viewMode) {
      overrides.viewMode = settings.viewMode;
    }
    if (
      JSON.stringify(settings.enabledTools) !==
      JSON.stringify(defaults.enabledTools)
    ) {
      overrides.enabledTools = settings.enabledTools;
    }

    if (Object.keys(overrides).length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    }
  }

  /**
   * Update settings in localStorage - merges updates with current and saves only non-defaults
   */
  static updateLocalSettings(
    updates: Partial<ChatSettingsUpdateRequestOutput>,
  ): ChatSettingsGetResponseOutput {
    const current = this.loadLocalSettings();
    const updated: ChatSettingsGetResponseOutput = {
      selectedModel: updates.selectedModel ?? current.selectedModel,
      selectedCharacter: updates.selectedCharacter ?? current.selectedCharacter,
      activeFavoriteId:
        updates.activeFavoriteId !== undefined
          ? updates.activeFavoriteId
          : current.activeFavoriteId,
      ttsAutoplay:
        updates.ttsAutoplay !== undefined
          ? updates.ttsAutoplay
          : current.ttsAutoplay,
      ttsVoice: updates.ttsVoice ?? current.ttsVoice,
      viewMode: updates.viewMode ?? current.viewMode,
      enabledTools: updates.enabledTools ?? current.enabledTools,
    };

    this.saveLocalSettings(updated);
    return updated;
  }

  /**
   * Clear settings from localStorage
   */
  static clearLocalSettings(): void {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Select a favorite and update settings
   * Handles optimistic updates for both settings and favorites list
   */
  static async selectFavorite(params: {
    favoriteId: string;
    modelId: ModelId | null;
    characterId: string | null;
    voice: typeof TtsVoiceValue | null;
    logger: EndpointLogger;
    locale: CountryLanguage;
    user: JwtPayloadType;
  }): Promise<void> {
    const { favoriteId, modelId, characterId, voice, logger, locale, user } =
      params;

    const { apiClient } =
      await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
    const settingsDefinition = await import("./definition");
    const favoritesDefinition = await import("../favorites/definition");

    // Optimistic update 1: Update settings
    apiClient.updateEndpointData(
      settingsDefinition.default.GET,
      logger,
      (oldData) => {
        if (!oldData?.success) {
          return oldData;
        }

        const updatedData = {
          ...oldData.data,
          activeFavoriteId: favoriteId,
        };

        if (modelId) {
          updatedData.selectedModel = modelId;
        }
        if (characterId) {
          updatedData.selectedCharacter = characterId;
        }
        if (voice) {
          updatedData.ttsVoice = voice;
        }

        return {
          success: true,
          data: updatedData,
        };
      },
      undefined,
    );

    // Optimistic update 2: Update favorites list to show new active badge
    apiClient.updateEndpointData(
      favoritesDefinition.default.GET,
      logger,
      (oldData) => {
        if (!oldData?.success || !oldData.data?.favorites) {
          return oldData;
        }

        // Update all favorites: remove active badge from others, add to selected one
        const updatedList = oldData.data.favorites.map((fav) => ({
          ...fav,
          activeBadge:
            fav.id === favoriteId
              ? ("app.chat.selector.active" as const)
              : null,
        }));

        return {
          success: true,
          data: {
            favorites: updatedList,
          },
        };
      },
      undefined,
    );

    // Call the mutation to persist on server (or localStorage)
    try {
      await apiClient.mutate(
        settingsDefinition.default.POST,
        logger,
        user,
        {
          activeFavoriteId: favoriteId,
          ...(modelId && { selectedModel: modelId }),
          ...(characterId && { selectedCharacter: characterId }),
          ...(voice && { ttsVoice: voice }),
        },
        undefined,
        locale,
      );
    } catch (error) {
      logger.error("Failed to update active favorite", {
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      // Revert optimistic updates on error
      await apiClient.refetchEndpoint(settingsDefinition.default.GET, logger);
      await apiClient.refetchEndpoint(favoritesDefinition.default.GET, logger);
    }
  }
}
