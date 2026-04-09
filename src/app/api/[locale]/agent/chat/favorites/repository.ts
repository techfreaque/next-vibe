/**
 * Favorites Repository
 * Database operations for user favorites (skill + model settings combos)
 */

import "server-only";

import { asc, eq, inArray } from "drizzle-orm";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { isAgentPlatform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { agentEnvAvailability } from "../../env-availability";
import { DEFAULT_SKILLS } from "../skills/config";
import { NO_SKILL_ID } from "../skills/constants";
import { scopedTranslation as charactersScopedTranslation } from "../skills/i18n";
import { SkillsRepository } from "../skills/repository";
import { chatSettings } from "../settings/db";
import { scopedTranslation as settingsScopedTranslation } from "../settings/i18n";
import { ChatSettingsRepository } from "../settings/repository";
import { chatFavorites } from "./db";
import type { FavoritesListResponseOutput } from "./definition";
import {
  formatEmptyFavoritesGuidance,
  formatFavoritesSummary,
} from "./favorites-formatter";
import type { FavoriteSummaryItem } from "./system-prompt/prompt";
import type { FavoritesT } from "./i18n";
import { ChatFavoritesRepositoryClient } from "./repository-client";

/** Chat Favorites Repository */
export class ChatFavoritesRepository {
  /**
   * Get all favorites for the authenticated user
   */
  static async getFavorites(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: FavoritesT,
    locale: CountryLanguage,
    targetUserId?: string,
    query?: string,
    page?: number,
    pageSize?: number,
    platform?: Platform,
  ): Promise<ResponseType<FavoritesListResponseOutput>> {
    const isAdmin = user.roles.includes(UserPermissionRole.ADMIN);
    const userId = targetUserId && isAdmin ? targetUserId : user.id;
    const { t: settingsT } = settingsScopedTranslation.scopedT(locale);
    const isCompact = platform ? isAgentPlatform(platform) : false;
    const COMPACT_PAGE_SIZE = 25;
    const effectivePageSize =
      pageSize ?? (isCompact ? COMPACT_PAGE_SIZE : undefined);
    const currentPage = page ?? 1;
    const normalizedQuery = query?.trim().toLowerCase();

    try {
      logger.debug("Fetching favorites", { userId });

      // Get active favorite ID from settings
      const settingsResult = await ChatSettingsRepository.getSettings(
        user,
        logger,
        settingsT,
      );
      const activeFavoriteId = settingsResult.success
        ? settingsResult.data.activeFavoriteId
        : null;

      const favorites = await db
        .select()
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, userId))
        .orderBy(asc(chatFavorites.position));

      // Compute display fields for all favorites
      const favoritesCards = await Promise.all(
        favorites.map(async (favorite) => {
          // Fetch skill data if needed
          let characterModelSelection = null;
          let characterIcon = null;
          let characterName = null;
          let characterTagline = null;
          let characterDescription = null;
          let characterVoice: VoiceModelSelection | null = null;

          if (favorite.skillId && favorite.skillId.trim() !== "") {
            const skillResult = await SkillsRepository.getSkillById(
              { id: favorite.skillId },
              user,
              logger,
              locale,
            );
            if (skillResult.success) {
              characterIcon = skillResult.data.icon;
              characterName = skillResult.data.name;
              characterTagline = skillResult.data.tagline;
              characterDescription = skillResult.data.description;
              characterVoice = skillResult.data.voiceModelSelection ?? null;
              // Resolve variant's modelSelection from the skill's variants list
              const variants = skillResult.data.variants;
              const variant = favorite.variantId
                ? variants.find((v) => v.id === favorite.variantId)
                : null;
              characterModelSelection = variant?.modelSelection ?? null;
            }
          }

          // Use client repository's compute method for DRY
          // Map ChatFavorite to StoredLocalFavorite structure
          return ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
            {
              id: favorite.id,
              skillId: favorite.skillId,
              variantId: favorite.variantId ?? null,
              customVariantName: favorite.customVariantName ?? null,
              customIcon: favorite.customIcon,
              voiceModelSelection: favorite.voiceModelSelection ?? null,
              modelSelection: favorite.modelSelection,
              position: favorite.position,
            },
            characterModelSelection,
            characterIcon,
            characterName,
            characterTagline,
            characterDescription,
            activeFavoriteId,
            characterVoice,
            locale,
            user,
            agentEnvAvailability,
          );
        }),
      );

      // Apply search filter if query provided
      let filtered = favoritesCards;
      if (normalizedQuery) {
        filtered = favoritesCards.filter(
          (fav) =>
            fav.name.toLowerCase().includes(normalizedQuery) ||
            (fav.tagline ?? "").toLowerCase().includes(normalizedQuery) ||
            (fav.description ?? "").toLowerCase().includes(normalizedQuery) ||
            fav.skillId.toLowerCase().includes(normalizedQuery),
        );
      }

      const totalCount = filtered.length;

      // Apply pagination for compact (AI/MCP) callers
      if (isCompact && effectivePageSize) {
        const totalPages = Math.max(
          1,
          Math.ceil(totalCount / effectivePageSize),
        );
        const safePage = Math.min(currentPage, totalPages);
        const offset = (safePage - 1) * effectivePageSize;
        const pageFavorites = filtered.slice(
          offset,
          offset + effectivePageSize,
        );
        const hint =
          totalPages > 1
            ? `Page ${safePage}/${totalPages} (${totalCount} favorites). Use page param to navigate.`
            : `${totalCount} favorite${totalCount === 1 ? "" : "s"} found.`;

        return success({
          favorites: pageFavorites,
          totalCount,
          matchedCount: totalCount,
          currentPage: safePage,
          totalPages,
          hint,
        });
      }

      return success({
        favorites: filtered,
        totalCount: null,
        matchedCount: null,
        currentPage: null,
        totalPages: null,
        hint: null,
      });
    } catch (error) {
      logger.error("Failed to fetch favorites", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Generate favorites summary for system prompt (server-side)
   * Fetches favorites from database and formats them using shared formatter
   */
  static async generateFavoritesSummary(params: {
    userId: string;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<string> {
    const { userId, locale, logger } = params;

    try {
      const [settingsRow] = await db
        .select({ activeFavoriteId: chatSettings.activeFavoriteId })
        .from(chatSettings)
        .where(eq(chatSettings.userId, userId))
        .limit(1);

      const activeFavoriteId = settingsRow?.activeFavoriteId ?? null;

      const rows = await db
        .select()
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, userId))
        .orderBy(asc(chatFavorites.position));

      if (rows.length === 0) {
        return formatEmptyFavoritesGuidance();
      }

      // Resolve localized skill names
      const { t: charT } = charactersScopedTranslation.scopedT(locale);
      const skillNameMap = new Map<string, string>();
      for (const char of DEFAULT_SKILLS) {
        skillNameMap.set(char.id, charT(char.name));
      }

      // Look up custom skill names for any non-default skillIds
      const customSkillIds = rows
        .map((r) => r.skillId)
        .filter((id) => id !== NO_SKILL_ID && !skillNameMap.has(id));
      if (customSkillIds.length > 0) {
        const { customSkills: customSkillsTable } =
          await import("../skills/db");
        const customSkillsList = await db
          .select({ id: customSkillsTable.id, name: customSkillsTable.name })
          .from(customSkillsTable)
          .where(inArray(customSkillsTable.id, customSkillIds));
        for (const s of customSkillsList) {
          skillNameMap.set(s.id, s.name);
        }
      }

      const items = rows.map((row) => {
        const baseName = skillNameMap.get(row.skillId) ?? row.skillId;
        let variantLabel: string | null = null;
        if (row.variantId) {
          const defaultSkill = DEFAULT_SKILLS.find((s) => s.id === row.skillId);
          const variant = defaultSkill?.variants?.find(
            (v) => v.id === row.variantId,
          );
          if (variant?.variantName) {
            variantLabel = charT(variant.variantName);
          }
        }
        const characterName = variantLabel
          ? `${baseName} - ${variantLabel}`
          : baseName;
        return {
          id: row.id,
          name: row.customVariantName ?? characterName,
          skillId: row.skillId,
          characterName,
          modelId: null as string | null, // model resolved client-side; not stored server-side
          modelInfo: "",
          isActive: row.id === activeFavoriteId,
          position: row.position,
          useCount: row.useCount,
          lastUsedAt: row.lastUsedAt,
        };
      });

      logger.debug("Generated favorites summary", {
        userId,
        count: items.length,
        activeFavoriteId,
      });

      return formatFavoritesSummary(items);
    } catch (error) {
      logger.error("Failed to generate favorites summary", parseError(error));
      return "";
    }
  }

  /**
   * Load raw favorites items for system prompt (server-side).
   * Returns empty array when user has no favorites.
   */
  static async loadFavoritesItems(params: {
    userId: string;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<FavoriteSummaryItem[]> {
    const { userId, locale, logger } = params;

    const [settingsRow] = await db
      .select({ activeFavoriteId: chatSettings.activeFavoriteId })
      .from(chatSettings)
      .where(eq(chatSettings.userId, userId))
      .limit(1);

    const activeFavoriteId = settingsRow?.activeFavoriteId ?? null;

    const rows = await db
      .select()
      .from(chatFavorites)
      .where(eq(chatFavorites.userId, userId))
      .orderBy(asc(chatFavorites.position));

    if (rows.length === 0) {
      return [];
    }

    // Resolve localized skill names
    const { t: charT } = charactersScopedTranslation.scopedT(locale);
    const skillNameMap = new Map<string, string>();
    for (const char of DEFAULT_SKILLS) {
      skillNameMap.set(char.id, charT(char.name));
    }

    // Look up custom skill names for any non-default skillIds
    const customSkillIds = rows
      .map((r) => r.skillId)
      .filter((id) => id !== NO_SKILL_ID && !skillNameMap.has(id));
    if (customSkillIds.length > 0) {
      const { customSkills: customSkillsTable } = await import("../skills/db");
      const customSkillsList = await db
        .select({ id: customSkillsTable.id, name: customSkillsTable.name })
        .from(customSkillsTable)
        .where(inArray(customSkillsTable.id, customSkillIds));
      for (const s of customSkillsList) {
        skillNameMap.set(s.id, s.name);
      }
    }

    const items: FavoriteSummaryItem[] = rows.map((row) => {
      const baseName = skillNameMap.get(row.skillId) ?? row.skillId;
      let variantLabel: string | null = null;
      if (row.variantId) {
        const defaultSkill = DEFAULT_SKILLS.find((s) => s.id === row.skillId);
        const variant = defaultSkill?.variants?.find(
          (v) => v.id === row.variantId,
        );
        if (variant?.variantName) {
          variantLabel = charT(variant.variantName);
        }
      }
      const characterName = variantLabel
        ? `${baseName} - ${variantLabel}`
        : baseName;
      return {
        id: row.id,
        name: row.customVariantName ?? characterName,
        skillId: row.skillId,
        characterName,
        modelId: null,
        modelInfo: "",
        isActive: row.id === activeFavoriteId,
        position: row.position,
        useCount: row.useCount,
        lastUsedAt: row.lastUsedAt,
      };
    });

    logger.debug("Loaded favorites items", {
      userId,
      count: items.length,
      activeFavoriteId,
    });

    return items;
  }
}
