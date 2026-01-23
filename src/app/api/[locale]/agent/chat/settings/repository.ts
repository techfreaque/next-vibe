/**
 * Chat Settings Repository
 * Database operations for user chat settings
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { chatSettings } from "./db";
import type {
  ChatSettingsGetResponseOutput,
  ChatSettingsUpdateRequestOutput,
  ChatSettingsUpdateResponseOutput,
} from "./definition";
import { ChatSettingsRepositoryClient } from "./repository-client";

/**
 * Chat Settings Repository
 */
export class ChatSettingsRepository {
  /**
   * Get user's chat settings
   */
  static async getSettings(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ChatSettingsGetResponseOutput>> {
    const userId = user.id;

    try {
      logger.debug("Fetching settings", { userId });

      const settings = await db
        .select()
        .from(chatSettings)
        .where(eq(chatSettings.userId, userId));

      if (settings.length === 0) {
        logger.debug("No settings found for user, returning defaults");
        return success(ChatSettingsRepositoryClient.getDefaults());
      }

      const setting = settings[0];
      const defaults = ChatSettingsRepositoryClient.getDefaults();
      const result: ChatSettingsGetResponseOutput = {
        selectedModel: setting.selectedModel ?? defaults.selectedModel,
        selectedCharacter:
          setting.selectedCharacter ?? defaults.selectedCharacter,
        activeFavoriteId: setting.activeFavoriteId ?? defaults.activeFavoriteId,
        ttsAutoplay: setting.ttsAutoplay ?? defaults.ttsAutoplay,
        ttsVoice: setting.ttsVoice ?? defaults.ttsVoice,
        viewMode: setting.viewMode ?? defaults.viewMode,
        enabledTools: setting.enabledTools ?? defaults.enabledTools,
      };

      return success(result);
    } catch (error) {
      logger.error("Failed to fetch settings", parseError(error));
      return fail({
        message: "app.api.agent.chat.settings.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create or update user's chat settings
   */
  static async upsertSettings(
    data: Partial<ChatSettingsUpdateRequestOutput>,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ChatSettingsUpdateResponseOutput>> {
    const userId = user.id;

    try {
      logger.debug("Upserting settings", { userId });

      // Get existing settings
      const existing = await db
        .select()
        .from(chatSettings)
        .where(eq(chatSettings.userId, userId));

      const defaults = ChatSettingsRepositoryClient.getDefaults();
      let result: typeof existing;

      if (existing.length > 0) {
        // Update existing - only store values that differ from defaults
        result = await db
          .update(chatSettings)
          .set({
            updatedAt: new Date(),
            selectedModel:
              data.selectedModel &&
              data.selectedModel !== defaults.selectedModel
                ? data.selectedModel
                : data.selectedModel === defaults.selectedModel
                  ? null
                  : undefined,
            selectedCharacter:
              data.selectedCharacter &&
              data.selectedCharacter !== defaults.selectedCharacter
                ? data.selectedCharacter
                : data.selectedCharacter === defaults.selectedCharacter
                  ? null
                  : undefined,
            activeFavoriteId:
              data.activeFavoriteId !== undefined &&
              data.activeFavoriteId !== defaults.activeFavoriteId
                ? data.activeFavoriteId
                : data.activeFavoriteId === defaults.activeFavoriteId
                  ? null
                  : undefined,
            ttsAutoplay:
              data.ttsAutoplay !== undefined &&
              data.ttsAutoplay !== defaults.ttsAutoplay
                ? data.ttsAutoplay
                : data.ttsAutoplay === defaults.ttsAutoplay
                  ? null
                  : undefined,
            ttsVoice:
              data.ttsVoice && data.ttsVoice !== defaults.ttsVoice
                ? data.ttsVoice
                : data.ttsVoice === defaults.ttsVoice
                  ? null
                  : undefined,
            viewMode:
              data.viewMode && data.viewMode !== defaults.viewMode
                ? data.viewMode
                : data.viewMode === defaults.viewMode
                  ? null
                  : undefined,
            enabledTools:
              data.enabledTools &&
              JSON.stringify(data.enabledTools) !==
                JSON.stringify(defaults.enabledTools)
                ? data.enabledTools
                : data.enabledTools &&
                    JSON.stringify(data.enabledTools) ===
                      JSON.stringify(defaults.enabledTools)
                  ? null
                  : undefined,
          })
          .where(eq(chatSettings.userId, userId))
          .returning();
      } else {
        // Create new - only store values that differ from defaults
        result = await db
          .insert(chatSettings)
          .values({
            userId,
            selectedModel:
              data.selectedModel &&
              data.selectedModel !== defaults.selectedModel
                ? data.selectedModel
                : null,
            selectedCharacter:
              data.selectedCharacter &&
              data.selectedCharacter !== defaults.selectedCharacter
                ? data.selectedCharacter
                : null,
            activeFavoriteId:
              data.activeFavoriteId !== undefined &&
              data.activeFavoriteId !== defaults.activeFavoriteId
                ? data.activeFavoriteId
                : null,
            ttsAutoplay:
              data.ttsAutoplay !== undefined &&
              data.ttsAutoplay !== defaults.ttsAutoplay
                ? data.ttsAutoplay
                : null,
            ttsVoice:
              data.ttsVoice && data.ttsVoice !== defaults.ttsVoice
                ? data.ttsVoice
                : null,
            viewMode:
              data.viewMode && data.viewMode !== defaults.viewMode
                ? data.viewMode
                : null,
            enabledTools:
              data.enabledTools &&
              JSON.stringify(data.enabledTools) !==
                JSON.stringify(defaults.enabledTools)
                ? data.enabledTools
                : null,
          })
          .returning();
      }

      if (!result || result.length === 0) {
        return fail({
          message: "app.api.agent.chat.settings.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success();
    } catch (error) {
      logger.error("Failed to upsert settings", parseError(error));
      return fail({
        message: "app.api.agent.chat.settings.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
