/**
 * Chat Settings Repository Client
 * Handles localStorage operations for chat settings
 * Used for non-authenticated users
 */

import { success } from "next-vibe/shared/types/response.schema";

import type { LocalStorageCallbacks } from "../../../system/unified-interface/react/hooks/endpoint-types";
import { defaultModel } from "../../models/models";
import { DEFAULT_TTS_VOICE } from "../../text-to-speech/enum";
import { DEFAULT_TOOL_CONFIRMATION_IDS, DEFAULT_TOOL_IDS } from "../constants";
import { ViewMode } from "../enum";
import type {
  ChatSettingsGetResponseOutput,
  ChatSettingsUpdateRequestOutput,
} from "./definition";
import type settingsDefinition from "./definition";

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
   * Static localStorage callbacks for useEndpoint hook
   * Handles read (GET) and create (POST) operations for non-authenticated users
   */
  static readonly localStorageCallbacks: LocalStorageCallbacks<
    typeof settingsDefinition
  > = {
    read: async () => {
      const settings = ChatSettingsRepositoryClient.loadLocalSettings();
      return success(settings);
    },

    create: async (params) => {
      ChatSettingsRepositoryClient.updateLocalSettings(params.requestData);
      return success();
    },
  };

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
}
