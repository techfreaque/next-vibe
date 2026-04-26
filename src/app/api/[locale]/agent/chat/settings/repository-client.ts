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

import { DEFAULT_CHAT_MODEL_SELECTION } from "../../ai-stream/constants";
import { ViewMode } from "../enum";
import type {
  ChatSettingsGetResponseOutput,
  ChatSettingsUpdateRequestOutput,
} from "./definition";
import {
  AUTOPILOT_DEFAULT_SCHEDULE,
  DREAM_DEFAULT_SCHEDULE,
} from "./pulse/constants";

/**
 * Storage key for chat settings
 */
const STORAGE_KEY = "chat-settings-v5";

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
  ): Promise<ResponseType<ChatSettingsGetResponseOutput>> {
    try {
      const settings = this.loadLocalSettings(user);
      logger.debug("Loaded settings from localStorage");
      return success(settings);
    } catch (error) {
      logger.error(
        "Failed to load settings",
        error instanceof Error ? error : new Error(String(error)),
      );
      return success(this.getDefaults(user));
    }
  }

  /**
   * Update settings (mirrors server updateSettings)
   */
  static async updateSettings(
    data: ChatSettingsUpdateRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
  ): Promise<ResponseType<never>> {
    try {
      this.updateLocalSettings(data, user);
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
  static getDefaults(user: JwtPayloadType): ChatSettingsGetResponseOutput {
    const bestModel = getBestChatModel(DEFAULT_CHAT_MODEL_SELECTION, user);
    return {
      selectedModel: bestModel?.id ?? null,
      selectedSkill: "thea",
      activeFavoriteId: null,
      ttsAutoplay: false,
      viewMode: ViewMode.LINEAR,
      searchProvider: null,
      codingAgent: null,
      dreamerEnabled: false,
      dreamerFavoriteId: null,
      dreamerSchedule: DREAM_DEFAULT_SCHEDULE,
      dreamerPrompt: null,
      autopilotEnabled: false,
      autopilotFavoriteId: null,
      autopilotSchedule: AUTOPILOT_DEFAULT_SCHEDULE,
      autopilotPrompt: null,
    };
  }

  /**
   * Load settings from localStorage - merges stored overrides with defaults
   */
  static loadLocalSettings(
    user: JwtPayloadType,
  ): ChatSettingsGetResponseOutput {
    if (typeof window === "undefined") {
      return this.getDefaults(user);
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return this.getDefaults(user);
    }

    try {
      const overrides = JSON.parse(stored) as ChatSettingsGetResponseOutput;
      const defaults = this.getDefaults(user);

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
        viewMode: overrides.viewMode ?? defaults.viewMode,
        searchProvider:
          "searchProvider" in overrides
            ? overrides.searchProvider
            : defaults.searchProvider,
        codingAgent:
          "codingAgent" in overrides
            ? overrides.codingAgent
            : defaults.codingAgent,
        dreamerEnabled: overrides.dreamerEnabled ?? defaults.dreamerEnabled,
        dreamerFavoriteId:
          "dreamerFavoriteId" in overrides
            ? overrides.dreamerFavoriteId
            : defaults.dreamerFavoriteId,
        dreamerSchedule: overrides.dreamerSchedule ?? defaults.dreamerSchedule,
        dreamerPrompt:
          "dreamerPrompt" in overrides
            ? overrides.dreamerPrompt
            : defaults.dreamerPrompt,
        autopilotEnabled:
          overrides.autopilotEnabled ?? defaults.autopilotEnabled,
        autopilotFavoriteId:
          "autopilotFavoriteId" in overrides
            ? overrides.autopilotFavoriteId
            : defaults.autopilotFavoriteId,
        autopilotSchedule:
          overrides.autopilotSchedule ?? defaults.autopilotSchedule,
        autopilotPrompt:
          "autopilotPrompt" in overrides
            ? overrides.autopilotPrompt
            : defaults.autopilotPrompt,
      };
    } catch {
      return this.getDefaults(user);
    }
  }

  /**
   * Save settings to localStorage - only stores values different from defaults
   */
  static saveLocalSettings(
    settings: ChatSettingsGetResponseOutput,
    user: JwtPayloadType,
  ): void {
    if (typeof window === "undefined") {
      return;
    }

    const defaults = this.getDefaults(user);
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
    if (settings.viewMode !== defaults.viewMode) {
      overrides.viewMode = settings.viewMode;
    }
    if (settings.searchProvider !== defaults.searchProvider) {
      overrides.searchProvider = settings.searchProvider;
    }
    if (settings.codingAgent !== defaults.codingAgent) {
      overrides.codingAgent = settings.codingAgent;
    }
    if (settings.dreamerEnabled !== defaults.dreamerEnabled) {
      overrides.dreamerEnabled = settings.dreamerEnabled;
    }
    if (settings.dreamerFavoriteId !== defaults.dreamerFavoriteId) {
      overrides.dreamerFavoriteId = settings.dreamerFavoriteId;
    }
    if (settings.dreamerSchedule !== defaults.dreamerSchedule) {
      overrides.dreamerSchedule = settings.dreamerSchedule;
    }
    if (settings.dreamerPrompt !== defaults.dreamerPrompt) {
      overrides.dreamerPrompt = settings.dreamerPrompt;
    }
    if (settings.autopilotEnabled !== defaults.autopilotEnabled) {
      overrides.autopilotEnabled = settings.autopilotEnabled;
    }
    if (settings.autopilotFavoriteId !== defaults.autopilotFavoriteId) {
      overrides.autopilotFavoriteId = settings.autopilotFavoriteId;
    }
    if (settings.autopilotSchedule !== defaults.autopilotSchedule) {
      overrides.autopilotSchedule = settings.autopilotSchedule;
    }
    if (settings.autopilotPrompt !== defaults.autopilotPrompt) {
      overrides.autopilotPrompt = settings.autopilotPrompt;
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
  ): ChatSettingsGetResponseOutput {
    const current = this.loadLocalSettings(user);
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
      viewMode: updates.viewMode ?? current.viewMode,
      searchProvider:
        updates.searchProvider !== undefined
          ? updates.searchProvider
          : current.searchProvider,
      codingAgent:
        updates.codingAgent !== undefined
          ? updates.codingAgent
          : current.codingAgent,
      dreamerEnabled:
        updates.dreamerEnabled !== undefined
          ? updates.dreamerEnabled
          : current.dreamerEnabled,
      dreamerFavoriteId:
        updates.dreamerFavoriteId !== undefined
          ? updates.dreamerFavoriteId
          : current.dreamerFavoriteId,
      dreamerSchedule:
        updates.dreamerSchedule !== undefined
          ? updates.dreamerSchedule
          : current.dreamerSchedule,
      dreamerPrompt:
        updates.dreamerPrompt !== undefined
          ? updates.dreamerPrompt
          : current.dreamerPrompt,
      autopilotEnabled:
        updates.autopilotEnabled !== undefined
          ? updates.autopilotEnabled
          : current.autopilotEnabled,
      autopilotFavoriteId:
        updates.autopilotFavoriteId !== undefined
          ? updates.autopilotFavoriteId
          : current.autopilotFavoriteId,
      autopilotSchedule:
        updates.autopilotSchedule !== undefined
          ? updates.autopilotSchedule
          : current.autopilotSchedule,
      autopilotPrompt:
        updates.autopilotPrompt !== undefined
          ? updates.autopilotPrompt
          : current.autopilotPrompt,
    };

    this.saveLocalSettings(updated, user);
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
    logger: EndpointLogger;
    locale: CountryLanguage;
    user: JwtPayloadType;
  }): Promise<void> {
    const { favoriteId, modelId, skillId, logger, locale, user } = params;

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

        return {
          success: true,
          data: {
            ...oldData.data,
            activeFavoriteId: favoriteId,
            ...(modelId && { selectedModel: modelId }),
            ...(skillId && { selectedSkill: skillId }),
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
