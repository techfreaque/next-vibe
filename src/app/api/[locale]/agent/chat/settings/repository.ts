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
import { definitionsRegistry } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definitions/registry";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { endpointToToolName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
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
 * Returns the canonical set of available tool IDs for a user.
 * Used to detect when a submitted activeTools list equals the full available set
 * so we can store null (= all tools allowed) instead of an explicit list.
 */
function getAvailableToolIds(user: JwtPrivatePayloadType): string[] {
  const endpoints = definitionsRegistry.getEndpointsForUser(Platform.AI, user);
  return endpoints.map((e) => endpointToToolName(e));
}

/**
 * Returns null if the tool list equals the given defaultIds set (i.e. it IS the default),
 * otherwise returns the normalized list (sorted, only toolId + requiresConfirmation).
 *
 * - For allowedTools: defaultIds = full available set (null = all tools allowed)
 * - For pinnedTools: defaultIds = DEFAULT_TOOL_IDS (null = load the standard 9 tools)
 */
function normalizeToolsOrNull(
  tools: ToolConfigItem[] | null | undefined,
  defaultIds: readonly string[] | string[],
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

  const submittedIds = new Set(normalized.map((t) => t.toolId));
  const defaultSet = new Set(defaultIds);

  // If the submitted set exactly matches the default set AND none require
  // confirmation, it's the default state — store null.
  const sameIds =
    submittedIds.size === defaultSet.size &&
    [...submittedIds].every((id) => defaultSet.has(id));
  const noConfirmations = normalized.every((t) => !t.requiresConfirmation);

  if (sameIds && noConfirmations) {
    return null;
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
        selectedCharacter:
          setting.selectedCharacter ?? defaults.selectedCharacter,
        activeFavoriteId: setting.activeFavoriteId ?? defaults.activeFavoriteId,
        ttsAutoplay: setting.ttsAutoplay ?? defaults.ttsAutoplay,
        ttsVoice: setting.ttsVoice ?? defaults.ttsVoice,
        viewMode: setting.viewMode ?? defaults.viewMode,
        allowedTools:
          (setting.activeTools ?? defaults.allowedTools)?.map((t) => ({
            toolId: t.toolId,
            requiresConfirmation: t.requiresConfirmation ?? false,
          })) ?? null,
        pinnedTools:
          (setting.visibleTools ?? defaults.pinnedTools)?.map((t) => ({
            toolId: t.toolId,
            requiresConfirmation: t.requiresConfirmation ?? false,
          })) ?? null,
        compactTrigger: setting.compactTrigger ?? defaults.compactTrigger,
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
      // allowedTools: null = all tools allowed → compare against full available set
      const availableIds = getAvailableToolIds(user);
      // pinnedTools: null = load the DEFAULT_TOOL_IDS set → compare against those 9 tools

      // Normalize tools — store null when submitted list equals the semantic default
      const allowedToolsToStore =
        data.allowedTools !== undefined
          ? normalizeToolsOrNull(data.allowedTools, availableIds)
          : undefined;
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
            activeTools: allowedToolsToStore,
            visibleTools: pinnedToolsToStore,
            compactTrigger:
              data.compactTrigger !== undefined &&
              data.compactTrigger !== null &&
              data.compactTrigger !== COMPACT_TRIGGER
                ? data.compactTrigger
                : data.compactTrigger === COMPACT_TRIGGER ||
                    data.compactTrigger === null
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
            activeTools: allowedToolsToStore ?? null,
            visibleTools: pinnedToolsToStore ?? null,
            compactTrigger:
              data.compactTrigger !== undefined &&
              data.compactTrigger !== null &&
              data.compactTrigger !== COMPACT_TRIGGER
                ? data.compactTrigger
                : null,
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
