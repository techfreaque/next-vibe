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
import { getBestChatModel, type ChatModelId } from "../../ai-stream/models";
import { COMPACT_TRIGGER } from "../../ai-stream/repository/core/constants";
import type { ModelProviderEnvAvailability } from "../../models/models";

import { DEFAULT_CHAT_MODEL_SELECTION } from "../../ai-stream/constants";
import type {
  TtsModelId,
  VoiceModelSelection,
} from "../../text-to-speech/models";
import { ViewMode } from "../enum";
import type {
  ChatSettingsGetResponseOutput,
  ChatSettingsUpdateRequestOutput,
} from "./definition";

/**
 * Storage key for chat settings
 */
const STORAGE_KEY = "chat-settings-v4";

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
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): Promise<ResponseType<ChatSettingsGetResponseOutput>> {
    try {
      const settings = this.loadLocalSettings(user, env);
      logger.debug("Loaded settings from localStorage");
      return success(settings);
    } catch (error) {
      logger.error(
        "Failed to load settings",
        error instanceof Error ? error : new Error(String(error)),
      );
      return success(this.getDefaults(user, env));
    }
  }

  /**
   * Update settings (mirrors server updateSettings)
   */
  static async updateSettings(
    data: ChatSettingsUpdateRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): Promise<ResponseType<never>> {
    try {
      this.updateLocalSettings(data, user, env);
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
   * Resolves selectedModel through DEFAULT_CHAT_MODEL_SELECTION with env filtering
   */
  static getDefaults(
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatSettingsGetResponseOutput {
    const bestModel = getBestChatModel(DEFAULT_CHAT_MODEL_SELECTION, user, env);
    return {
      selectedModel: bestModel?.id ?? null,
      selectedSkill: "thea",
      activeFavoriteId: null,
      ttsAutoplay: false,
      voiceModelSelection: null,
      sttModelSelection: undefined,
      imageVisionModelSelection: undefined,
      videoVisionModelSelection: undefined,
      audioVisionModelSelection: undefined,
      imageGenModelSelection: undefined,
      musicGenModelSelection: undefined,
      defaultChatMode: undefined,
      viewMode: ViewMode.LINEAR,
      availableTools: null,
      pinnedTools: null,
      compactTrigger: COMPACT_TRIGGER,
      memoryLimit: null,
      codingAgent: null,
    };
  }

  /**
   * Load settings from localStorage - merges stored overrides with defaults
   */
  static loadLocalSettings(
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatSettingsGetResponseOutput {
    if (typeof window === "undefined") {
      return this.getDefaults(user, env);
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return this.getDefaults(user, env);
    }

    try {
      const overrides = JSON.parse(stored);
      const defaults = this.getDefaults(user, env);

      // Merge overrides with defaults
      // Use 'in' check for nullable fields to distinguish "explicitly set to null" from "not set"
      return {
        selectedModel: overrides.selectedModel ?? defaults.selectedModel,
        selectedSkill: overrides.selectedSkill ?? defaults.selectedSkill,
        activeFavoriteId:
          "activeFavoriteId" in overrides
            ? overrides.activeFavoriteId
            : defaults.activeFavoriteId,
        ttsAutoplay: overrides.ttsAutoplay ?? defaults.ttsAutoplay,
        voiceModelSelection:
          overrides.voiceModelSelection ?? defaults.voiceModelSelection,
        sttModelSelection:
          overrides.sttModelSelection ?? defaults.sttModelSelection,
        imageVisionModelSelection:
          overrides.imageVisionModelSelection ??
          defaults.imageVisionModelSelection,
        videoVisionModelSelection:
          overrides.videoVisionModelSelection ??
          defaults.videoVisionModelSelection,
        audioVisionModelSelection:
          overrides.audioVisionModelSelection ??
          defaults.audioVisionModelSelection,
        defaultChatMode: overrides.defaultChatMode ?? defaults.defaultChatMode,
        viewMode: overrides.viewMode ?? defaults.viewMode,
        availableTools:
          "availableTools" in overrides
            ? overrides.availableTools
            : defaults.availableTools,
        pinnedTools:
          "pinnedTools" in overrides
            ? overrides.pinnedTools
            : defaults.pinnedTools,
        compactTrigger: overrides.compactTrigger ?? defaults.compactTrigger,
        memoryLimit:
          "memoryLimit" in overrides
            ? overrides.memoryLimit
            : defaults.memoryLimit,
        codingAgent:
          "codingAgent" in overrides
            ? overrides.codingAgent
            : defaults.codingAgent,
      };
    } catch {
      return this.getDefaults(user, env);
    }
  }

  /**
   * Save settings to localStorage - only stores values different from defaults
   */
  static saveLocalSettings(
    settings: ChatSettingsGetResponseOutput,
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): void {
    if (typeof window === "undefined") {
      return;
    }

    const defaults = this.getDefaults(user, env);
    const overrides: Partial<ChatSettingsGetResponseOutput> = {};

    // Only store values that differ from defaults
    if (settings.selectedModel !== defaults.selectedModel) {
      overrides.selectedModel = settings.selectedModel;
    }
    if (settings.selectedSkill !== defaults.selectedSkill) {
      overrides.selectedSkill = settings.selectedSkill;
    }
    if (settings.activeFavoriteId !== defaults.activeFavoriteId) {
      overrides.activeFavoriteId = settings.activeFavoriteId;
    }
    if (settings.ttsAutoplay !== defaults.ttsAutoplay) {
      overrides.ttsAutoplay = settings.ttsAutoplay;
    }
    if (
      JSON.stringify(settings.voiceModelSelection) !==
      JSON.stringify(defaults.voiceModelSelection)
    ) {
      overrides.voiceModelSelection = settings.voiceModelSelection;
    }
    if (
      JSON.stringify(settings.sttModelSelection) !==
      JSON.stringify(defaults.sttModelSelection)
    ) {
      overrides.sttModelSelection = settings.sttModelSelection;
    }
    if (
      JSON.stringify(settings.imageVisionModelSelection) !==
      JSON.stringify(defaults.imageVisionModelSelection)
    ) {
      overrides.imageVisionModelSelection = settings.imageVisionModelSelection;
    }
    if (
      JSON.stringify(settings.videoVisionModelSelection) !==
      JSON.stringify(defaults.videoVisionModelSelection)
    ) {
      overrides.videoVisionModelSelection = settings.videoVisionModelSelection;
    }
    if (
      JSON.stringify(settings.audioVisionModelSelection) !==
      JSON.stringify(defaults.audioVisionModelSelection)
    ) {
      overrides.audioVisionModelSelection = settings.audioVisionModelSelection;
    }
    if (settings.defaultChatMode !== defaults.defaultChatMode) {
      overrides.defaultChatMode = settings.defaultChatMode;
    }
    if (settings.viewMode !== defaults.viewMode) {
      overrides.viewMode = settings.viewMode;
    }
    if (
      JSON.stringify(settings.availableTools) !==
      JSON.stringify(defaults.availableTools)
    ) {
      overrides.availableTools = settings.availableTools;
    }
    if (
      JSON.stringify(settings.pinnedTools) !==
      JSON.stringify(defaults.pinnedTools)
    ) {
      overrides.pinnedTools = settings.pinnedTools;
    }
    if (settings.compactTrigger !== defaults.compactTrigger) {
      overrides.compactTrigger = settings.compactTrigger;
    }
    if (settings.memoryLimit !== defaults.memoryLimit) {
      overrides.memoryLimit = settings.memoryLimit;
    }
    if (settings.codingAgent !== defaults.codingAgent) {
      overrides.codingAgent = settings.codingAgent;
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
    user: JwtPayloadType,
    env: ModelProviderEnvAvailability,
  ): ChatSettingsGetResponseOutput {
    const current = this.loadLocalSettings(user, env);
    const updated: ChatSettingsGetResponseOutput = {
      selectedModel: updates.selectedModel ?? current.selectedModel,
      selectedSkill: updates.selectedSkill ?? current.selectedSkill,
      activeFavoriteId:
        updates.activeFavoriteId !== undefined
          ? updates.activeFavoriteId
          : current.activeFavoriteId,
      ttsAutoplay:
        updates.ttsAutoplay !== undefined
          ? updates.ttsAutoplay
          : current.ttsAutoplay,
      voiceModelSelection:
        updates.voiceModelSelection ?? current.voiceModelSelection,
      sttModelSelection: updates.sttModelSelection ?? current.sttModelSelection,
      imageVisionModelSelection:
        updates.imageVisionModelSelection ?? current.imageVisionModelSelection,
      videoVisionModelSelection:
        updates.videoVisionModelSelection ?? current.videoVisionModelSelection,
      audioVisionModelSelection:
        updates.audioVisionModelSelection ?? current.audioVisionModelSelection,
      defaultChatMode: updates.defaultChatMode ?? current.defaultChatMode,
      viewMode: updates.viewMode ?? current.viewMode,
      availableTools:
        updates.availableTools !== undefined
          ? updates.availableTools
          : current.availableTools,
      pinnedTools:
        updates.pinnedTools !== undefined
          ? updates.pinnedTools
          : current.pinnedTools,
      compactTrigger:
        updates.compactTrigger !== undefined
          ? updates.compactTrigger
          : current.compactTrigger,
      memoryLimit:
        updates.memoryLimit !== undefined
          ? updates.memoryLimit
          : current.memoryLimit,
      codingAgent:
        updates.codingAgent !== undefined
          ? updates.codingAgent
          : current.codingAgent,
    };

    this.saveLocalSettings(updated, user, env);
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
    modelId: ChatModelId | null;
    skillId: string | null;
    voiceId: TtsModelId | null;
    logger: EndpointLogger;
    locale: CountryLanguage;
    user: JwtPayloadType;
  }): Promise<void> {
    const { favoriteId, modelId, skillId, voiceId, logger, locale, user } =
      params;

    const { apiClient } =
      await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
    const settingsDefinition = await import("./definition");
    const favoritesDefinition = await import("../favorites/definition");

    // Build voiceModelSelection from the favorite's resolved voiceId
    const voiceModelSelection: VoiceModelSelection | null = voiceId
      ? {
          selectionType: "enums.selectionType.manual" as const,
          manualModelId: voiceId,
        }
      : null;

    // Optimistic update 1: Update settings
    apiClient.updateEndpointData(
      settingsDefinition.default.GET,
      logger,
      (oldData) => {
        if (!oldData?.success) {
          return oldData;
        }

        return {
          success: true,
          data: {
            ...oldData.data,
            activeFavoriteId: favoriteId,
            ...(modelId && { selectedModel: modelId }),
            ...(skillId && { selectedSkill: skillId }),
            ...(voiceModelSelection && { voiceModelSelection }),
          },
        };
      },
    );

    // Optimistic update 2: Update favorites list to show new active badge
    apiClient.updateEndpointData(
      favoritesDefinition.default.GET,
      logger,
      (oldData) => {
        if (!oldData?.success || !oldData.data?.favorites) {
          return undefined;
        }

        // Update all favorites: remove active badge from others, add to selected one
        const updatedList = oldData.data.favorites.map((fav) => ({
          ...fav,
          activeBadge: fav.id === favoriteId ? ("active" as const) : null,
        }));

        return success({ ...oldData.data, favorites: updatedList });
      },
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
          ...(skillId && { selectedSkill: skillId }),
          ...(voiceModelSelection && { voiceModelSelection }),
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
