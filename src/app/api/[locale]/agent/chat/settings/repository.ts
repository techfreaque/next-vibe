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

import { COMPACT_TRIGGER } from "../../ai-stream/repository/core/constants";
import { getDefaultToolIds } from "../constants";
import { chatSettings } from "./db";
import type {
  ChatSettingsGetResponseOutput,
  ChatSettingsUpdateRequestOutput,
  ChatSettingsUpdateResponseOutput,
  ToolConfigItem,
} from "./definition";
import type { scopedTranslation } from "./i18n";
import { ChatSettingsRepositoryClient } from "./repository-client";

type SettingsT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/**
 * Returns null if the tool list equals the given defaultIds set (i.e. it IS the default),
 * otherwise returns the normalized list (sorted, only toolId + requiresConfirmation).
 *
 * - For availableTools: defaultIds = full available set (null = all tools allowed)
 * - For pinnedTools: defaultIds = DEFAULT_TOOL_IDS (null = load the standard 9 tools)
 */
function normalizeToolsOrNull(
  tools: ToolConfigItem[] | null | undefined,
  defaultIds: readonly string[] | null,
): ToolConfigItem[] | null {
  if (tools === null || tools === undefined) {
    return null;
  }
  const normalized = tools
    .map(({ toolId, requiresConfirmation }) => ({
      toolId,
      requiresConfirmation: requiresConfirmation ?? false,
    }))
    .toSorted((a, b) => a.toolId.localeCompare(b.toolId));

  if (defaultIds !== null) {
    const submittedIds = new Set(normalized.map((t) => t.toolId));
    const defaultSet = new Set(defaultIds);
    const sameIds =
      submittedIds.size === defaultSet.size &&
      [...submittedIds].every((id) => defaultSet.has(id));
    const noConfirmations = normalized.every((t) => !t.requiresConfirmation);
    if (sameIds && noConfirmations) {
      return null;
    }
  }

  return normalized;
}

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
        return success(ChatSettingsRepositoryClient.getDefaults());
      }

      const setting = settings[0];
      const defaults = ChatSettingsRepositoryClient.getDefaults();
      const result: ChatSettingsGetResponseOutput = {
        selectedModel: setting.selectedModel ?? defaults.selectedModel,
        selectedSkill: setting.selectedSkill ?? defaults.selectedSkill,
        activeFavoriteId: setting.activeFavoriteId ?? defaults.activeFavoriteId,
        ttsAutoplay: setting.ttsAutoplay ?? defaults.ttsAutoplay,
        ttsVoice: setting.ttsVoice ?? defaults.ttsVoice,
        viewMode: setting.viewMode ?? defaults.viewMode,
        availableTools:
          (setting.availableTools ?? defaults.availableTools)?.map((tool) => ({
            toolId: tool.toolId,
            requiresConfirmation: tool.requiresConfirmation ?? false,
          })) ?? null,
        pinnedTools:
          (setting.pinnedTools ?? defaults.pinnedTools)?.map((tool) => ({
            toolId: tool.toolId,
            requiresConfirmation: tool.requiresConfirmation ?? false,
          })) ?? null,
        compactTrigger: setting.compactTrigger ?? defaults.compactTrigger,
        memoryLimit: setting.memoryLimit ?? defaults.memoryLimit,
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

      const defaults = ChatSettingsRepositoryClient.getDefaults();

      // Normalize tools — null passthrough means "all allowed"
      const availableToolsToStore =
        data.availableTools !== undefined
          ? normalizeToolsOrNull(data.availableTools, null)
          : undefined;
      // pinnedTools: null = load the DEFAULT_TOOL_IDS set → compare against those
      const pinnedToolsToStore =
        data.pinnedTools !== undefined
          ? normalizeToolsOrNull(data.pinnedTools, getDefaultToolIds())
          : undefined;

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
            availableTools: availableToolsToStore,
            pinnedTools: pinnedToolsToStore,
            compactTrigger:
              data.compactTrigger !== undefined &&
              data.compactTrigger !== null &&
              data.compactTrigger !== COMPACT_TRIGGER
                ? data.compactTrigger
                : data.compactTrigger === COMPACT_TRIGGER ||
                    data.compactTrigger === null
                  ? null
                  : undefined,
            memoryLimit:
              data.memoryLimit !== undefined ? data.memoryLimit : undefined,
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
            ttsVoice:
              data.ttsVoice && data.ttsVoice !== defaults.ttsVoice
                ? data.ttsVoice
                : null,
            viewMode:
              data.viewMode && data.viewMode !== defaults.viewMode
                ? data.viewMode
                : null,
            availableTools: availableToolsToStore ?? null,
            pinnedTools: pinnedToolsToStore ?? null,
            compactTrigger:
              data.compactTrigger !== undefined &&
              data.compactTrigger !== null &&
              data.compactTrigger !== COMPACT_TRIGGER
                ? data.compactTrigger
                : null,
            memoryLimit:
              data.memoryLimit !== undefined ? data.memoryLimit : null,
          })
          .returning();
      }

      if (!result || result.length === 0) {
        return fail({
          message: t("post.errors.server.title") ?? "post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
