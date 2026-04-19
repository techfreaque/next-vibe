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
import type { SettingsT } from "./i18n";
import { ChatSettingsRepositoryClient } from "./repository-client";
import {
  AUTOPILOT_DEFAULT_SCHEDULE,
  DREAM_DEFAULT_SCHEDULE,
  ensureAutopilotTask,
  ensureDreamTask,
} from "./pulse/repository";

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
    t: SettingsT,
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
        return success(ChatSettingsRepositoryClient.getDefaults(user));
      }

      const setting = settings[0];
      const defaults = ChatSettingsRepositoryClient.getDefaults(user);
      const result: ChatSettingsGetResponseOutput = {
        selectedModel: setting.selectedModel ?? defaults.selectedModel,
        selectedSkill: setting.selectedSkill ?? defaults.selectedSkill,
        activeFavoriteId: setting.activeFavoriteId ?? defaults.activeFavoriteId,
        ttsAutoplay: setting.ttsAutoplay ?? defaults.ttsAutoplay,
        viewMode: setting.viewMode ?? defaults.viewMode,
        searchProvider: setting.searchProvider ?? defaults.searchProvider,
        codingAgent: setting.codingAgent ?? defaults.codingAgent,
        dreamerEnabled: setting.dreamerEnabled ?? false,
        dreamerFavoriteId: setting.dreamerFavoriteId ?? null,
        dreamerSchedule: setting.dreamerSchedule ?? DREAM_DEFAULT_SCHEDULE,
        dreamerPrompt: setting.dreamerPrompt ?? null,
        autopilotEnabled: setting.autopilotEnabled ?? false,
        autopilotFavoriteId: setting.autopilotFavoriteId ?? null,
        autopilotSchedule:
          setting.autopilotSchedule ?? AUTOPILOT_DEFAULT_SCHEDULE,
        autopilotPrompt: setting.autopilotPrompt ?? null,
      };

      return success(result);
    } catch (error) {
      logger.error("Failed to fetch settings", parseError(error));
      return fail({
        message: t("get.errors.server.title") ?? "get.errors.server.title",
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
    t: SettingsT,
  ): Promise<ResponseType<ChatSettingsUpdateResponseOutput>> {
    const userId = user.id;

    try {
      logger.debug("Upserting settings", { userId });

      // Get existing settings
      const existing = await db
        .select()
        .from(chatSettings)
        .where(eq(chatSettings.userId, userId));

      const defaults = ChatSettingsRepositoryClient.getDefaults(user);

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
            selectedSkill:
              data.selectedSkill &&
              data.selectedSkill !== defaults.selectedSkill
                ? data.selectedSkill
                : data.selectedSkill === defaults.selectedSkill
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
            viewMode:
              data.viewMode && data.viewMode !== defaults.viewMode
                ? data.viewMode
                : data.viewMode === defaults.viewMode
                  ? null
                  : undefined,
            searchProvider:
              data.searchProvider !== undefined
                ? data.searchProvider
                : undefined,
            codingAgent:
              data.codingAgent !== undefined ? data.codingAgent : undefined,
            dreamerEnabled:
              data.dreamerEnabled !== undefined
                ? data.dreamerEnabled
                : undefined,
            dreamerFavoriteId:
              data.dreamerFavoriteId !== undefined
                ? data.dreamerFavoriteId
                : undefined,
            dreamerSchedule:
              data.dreamerSchedule !== undefined
                ? data.dreamerSchedule
                : undefined,
            dreamerPrompt:
              data.dreamerPrompt !== undefined ? data.dreamerPrompt : undefined,
            autopilotEnabled:
              data.autopilotEnabled !== undefined
                ? data.autopilotEnabled
                : undefined,
            autopilotFavoriteId:
              data.autopilotFavoriteId !== undefined
                ? data.autopilotFavoriteId
                : undefined,
            autopilotSchedule:
              data.autopilotSchedule !== undefined
                ? data.autopilotSchedule
                : undefined,
            autopilotPrompt:
              data.autopilotPrompt !== undefined
                ? data.autopilotPrompt
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
            selectedSkill:
              data.selectedSkill &&
              data.selectedSkill !== defaults.selectedSkill
                ? data.selectedSkill
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
            viewMode:
              data.viewMode && data.viewMode !== defaults.viewMode
                ? data.viewMode
                : null,
            searchProvider:
              data.searchProvider !== undefined ? data.searchProvider : null,
            codingAgent:
              data.codingAgent !== undefined ? data.codingAgent : null,
            dreamerEnabled:
              data.dreamerEnabled !== undefined ? data.dreamerEnabled : null,
            dreamerFavoriteId:
              data.dreamerFavoriteId !== undefined
                ? data.dreamerFavoriteId
                : null,
            dreamerSchedule:
              data.dreamerSchedule !== undefined ? data.dreamerSchedule : null,
            dreamerPrompt:
              data.dreamerPrompt !== undefined ? data.dreamerPrompt : null,
            autopilotEnabled:
              data.autopilotEnabled !== undefined
                ? data.autopilotEnabled
                : null,
            autopilotFavoriteId:
              data.autopilotFavoriteId !== undefined
                ? data.autopilotFavoriteId
                : null,
            autopilotSchedule:
              data.autopilotSchedule !== undefined
                ? data.autopilotSchedule
                : null,
            autopilotPrompt:
              data.autopilotPrompt !== undefined ? data.autopilotPrompt : null,
          })
          .returning();
      }

      if (!result || result.length === 0) {
        return fail({
          message: t("post.errors.server.title") ?? "post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Side-effects: sync pulse tasks when dreamer/autopilot settings change
      const savedRow = result[0];
      if (
        savedRow &&
        (data.dreamerEnabled !== undefined ||
          data.dreamerFavoriteId !== undefined ||
          data.dreamerSchedule !== undefined ||
          data.dreamerPrompt !== undefined)
      ) {
        void ensureDreamTask(userId, {
          dreamerEnabled: savedRow.dreamerEnabled ?? false,
          dreamerFavoriteId: savedRow.dreamerFavoriteId ?? null,
          dreamerSchedule: savedRow.dreamerSchedule ?? undefined,
          dreamerPrompt: savedRow.dreamerPrompt ?? null,
        }).catch(() => {
          // Best-effort — don't fail settings save if task sync fails
        });
      }
      if (
        savedRow &&
        (data.autopilotEnabled !== undefined ||
          data.autopilotFavoriteId !== undefined ||
          data.autopilotSchedule !== undefined ||
          data.autopilotPrompt !== undefined)
      ) {
        void ensureAutopilotTask(userId, {
          autopilotEnabled: savedRow.autopilotEnabled ?? false,
          autopilotFavoriteId: savedRow.autopilotFavoriteId ?? null,
          autopilotSchedule: savedRow.autopilotSchedule ?? undefined,
          autopilotPrompt: savedRow.autopilotPrompt ?? null,
        }).catch(() => {
          // Best-effort — don't fail settings save if task sync fails
        });
      }

      return success();
    } catch (error) {
      logger.error("Failed to upsert settings", parseError(error));
      return fail({
        message: t("post.errors.server.title") ?? "post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
