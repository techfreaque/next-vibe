/**
 * Favorites Repository
 * Database operations for user favorites (skill + model settings combos)
 */

import "server-only";

import { and, asc, eq, inArray, or, sql } from "drizzle-orm";
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

import { DEFAULT_SKILLS } from "../skills/config";
import { NO_SKILL_ID } from "../skills/constants";
import { scopedTranslation as charactersScopedTranslation } from "../skills/i18n";
import { SkillsRepository } from "../skills/repository";
import { chatSettings } from "../settings/db";
import { scopedTranslation as settingsScopedTranslation } from "../settings/i18n";
import { ChatSettingsRepository } from "../settings/repository";
import {
  formatSkillId,
  isSkillVariantId,
  isUuid,
  parseSkillId,
  resolveIdAlias,
} from "../slugify";
import {
  chatFavorites,
  FAVORITE_CONFIG_COLUMNS,
  type FavoriteConfig,
} from "./db";
import type { FavoritesListResponseOutput } from "./definition";
import {
  formatEmptyFavoritesGuidance,
  formatFavoritesSummary,
} from "./favorites-formatter";
import type { FavoriteSummaryItem } from "./system-prompt/prompt";
import type { FavoritesT } from "./i18n";
import { ChatFavoritesRepositoryClient } from "./repository-client";

export function buildFavoriteConfig(
  overrides: Partial<FavoriteConfig> & Pick<FavoriteConfig, "id" | "skillId">,
): FavoriteConfig {
  return {
    modelSelection: null,
    voiceModelSelection: null,
    sttModelSelection: null,
    imageVisionModelSelection: null,
    videoVisionModelSelection: null,
    audioVisionModelSelection: null,
    imageGenModelSelection: null,
    musicGenModelSelection: null,
    videoGenModelSelection: null,
    availableTools: null,
    pinnedTools: null,
    deniedTools: null,
    compactTrigger: null,
    memoryLimit: null,
    promptAppend: null,
    ...overrides,
  };
}

export async function resolveFavoriteConfig(
  favoriteId: string | undefined,
  userId: string | undefined,
): Promise<FavoriteConfig | null> {
  if (!favoriteId || !userId) {
    return null;
  }

  let condition: ReturnType<typeof and>;
  if (isUuid(favoriteId)) {
    condition = and(
      eq(chatFavorites.id, favoriteId),
      eq(chatFavorites.userId, userId),
    );
  } else if (isSkillVariantId(favoriteId)) {
    // Merged "skillSlug__variantId" format - look up by skill identity
    const { skillId, variantId } = parseSkillId(favoriteId);
    condition = and(
      eq(chatFavorites.skillId, skillId),
      variantId !== null
        ? eq(chatFavorites.variantId, variantId)
        : sql`${chatFavorites.variantId} IS NULL`,
      eq(chatFavorites.userId, userId),
    );
  } else {
    condition = and(
      eq(chatFavorites.slug, favoriteId),
      eq(chatFavorites.userId, userId),
    );
  }

  const [row] = await db
    .select(FAVORITE_CONFIG_COLUMNS)
    .from(chatFavorites)
    .where(condition)
    .limit(1);
  return row ?? null;
}

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
              // If no variantId, use the default variant (mirrors headless.ts resolveFavorite logic)
              const variants = skillResult.data.variants;
              const variant = favorite.variantId
                ? variants.find((v) => v.id === favorite.variantId)
                : (variants.find((v) => v.isDefault) ?? variants[0] ?? null);
              characterModelSelection = variant?.modelSelection ?? null;
            }
          }

          // Normalize skillId to canonical slug (legacy rows may store UUIDs)
          const canonicalSkillId =
            await SkillsRepository.resolveCanonicalSkillId(favorite.skillId);

          // Use client repository's compute method for DRY
          // Map ChatFavorite to StoredLocalFavorite structure
          // Use slug as the external ID (fall back to UUID for backcompat)
          return ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
            {
              id: favorite.slug || favorite.id,
              skillId: formatSkillId(
                canonicalSkillId,
                favorite.variantId ?? null,
              ),
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
            // Match activeFavoriteId against both slug and UUID
            favorite.slug === activeFavoriteId ||
              favorite.id === activeFavoriteId
              ? favorite.slug || favorite.id
              : null,
            characterVoice,
            locale,
            user,
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

      // Resolve localized skill names + build UUID→slug map for canonical IDs
      const { t: charT } = charactersScopedTranslation.scopedT(locale);
      const skillNameMap = new Map<string, string>();
      const skillSlugMap = new Map<string, string>();
      for (const char of DEFAULT_SKILLS) {
        skillNameMap.set(char.id, charT(char.name));
        // Default skill IDs are already friendly - identity mapping
        skillSlugMap.set(char.id, char.id);
      }

      // Look up custom skill names for any non-default skillIds
      const customSkillIds = rows
        .map((r) => r.skillId)
        .filter((id) => id !== NO_SKILL_ID && !skillNameMap.has(id));
      if (customSkillIds.length > 0) {
        const { customSkills: customSkillsTable } =
          await import("../skills/db");
        // Postgres UUID column rejects non-UUID strings - separate UUIDs from slugs
        const UUID_RE =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const uuidIds = customSkillIds.filter((id) => UUID_RE.test(id));
        const slugIds = customSkillIds.filter((id) => !UUID_RE.test(id));
        const condition =
          uuidIds.length > 0 && slugIds.length > 0
            ? or(
                inArray(customSkillsTable.id, uuidIds),
                inArray(customSkillsTable.slug, slugIds),
              )
            : uuidIds.length > 0
              ? inArray(customSkillsTable.id, uuidIds)
              : inArray(customSkillsTable.slug, slugIds);
        const customSkillsList = await db
          .select({
            id: customSkillsTable.id,
            slug: customSkillsTable.slug,
            name: customSkillsTable.name,
          })
          .from(customSkillsTable)
          .where(condition);
        for (const s of customSkillsList) {
          skillNameMap.set(s.id, s.name);
          // Map UUID → slug for canonical ID resolution
          if (s.slug) {
            skillNameMap.set(s.slug, s.name);
            skillSlugMap.set(s.id, s.slug);
            skillSlugMap.set(s.slug, s.slug);
          }
        }
      }

      const items = rows.map((row) => {
        const baseName = skillNameMap.get(row.skillId) ?? row.skillId;
        let variantLabel: string | null = null;
        if (row.variantId) {
          const defaultSkill = DEFAULT_SKILLS.find(
            (s) => s.id === resolveIdAlias(row.skillId),
          );
          const variant = defaultSkill?.variants?.find(
            (v) => v.id === resolveIdAlias(row.variantId ?? ""),
          );
          if (variant?.variantName) {
            variantLabel = charT(variant.variantName);
          }
        }
        const characterName = variantLabel
          ? `${baseName} - ${variantLabel}`
          : baseName;
        // Resolve skillId to canonical slug (never expose UUIDs in system prompt)
        const canonicalSkillId = skillSlugMap.get(row.skillId) ?? row.skillId;
        // Use slug as external ID; if slug is a UUID (legacy: same as skillId), prefer canonicalSkillId
        const UUID_RE_ITEM =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const rawSlug = row.slug || row.id;
        const externalId =
          rawSlug && !UUID_RE_ITEM.test(rawSlug) ? rawSlug : canonicalSkillId;
        // Extract model from model_selection jsonb
        const sel = row.modelSelection as { manualModelId?: string } | null;
        const resolvedModelId = sel?.manualModelId ?? null;
        return {
          id: externalId,
          name: row.customVariantName ?? characterName,
          skillId: canonicalSkillId,
          characterName,
          modelId: resolvedModelId,
          modelInfo: "",
          isActive:
            row.slug === activeFavoriteId || row.id === activeFavoriteId,
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

    // Resolve localized skill names + build UUID→slug map for canonical IDs
    const { t: charT } = charactersScopedTranslation.scopedT(locale);
    const skillNameMap = new Map<string, string>();
    const skillSlugMap = new Map<string, string>();
    for (const char of DEFAULT_SKILLS) {
      skillNameMap.set(char.id, charT(char.name));
      skillSlugMap.set(char.id, char.id);
    }

    // Look up custom skill names for any non-default skillIds
    const customSkillIds = rows
      .map((r) => r.skillId)
      .filter((id) => id !== NO_SKILL_ID && !skillNameMap.has(id));
    if (customSkillIds.length > 0) {
      const { customSkills: customSkillsTable } = await import("../skills/db");
      // Postgres UUID column rejects non-UUID strings - separate UUIDs from slugs
      const UUID_RE =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const uuidIds = customSkillIds.filter((id) => UUID_RE.test(id));
      const slugIds = customSkillIds.filter((id) => !UUID_RE.test(id));
      const condition =
        uuidIds.length > 0 && slugIds.length > 0
          ? or(
              inArray(customSkillsTable.id, uuidIds),
              inArray(customSkillsTable.slug, slugIds),
            )
          : uuidIds.length > 0
            ? inArray(customSkillsTable.id, uuidIds)
            : inArray(customSkillsTable.slug, slugIds);
      const customSkillsList = await db
        .select({
          id: customSkillsTable.id,
          slug: customSkillsTable.slug,
          name: customSkillsTable.name,
        })
        .from(customSkillsTable)
        .where(condition);
      for (const s of customSkillsList) {
        skillNameMap.set(s.id, s.name);
        if (s.slug) {
          skillNameMap.set(s.slug, s.name);
          skillSlugMap.set(s.id, s.slug);
          skillSlugMap.set(s.slug, s.slug);
        }
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
      // Resolve skillId to canonical slug (never expose UUIDs)
      const canonicalSkillId = skillSlugMap.get(row.skillId) ?? row.skillId;
      // Use slug as external ID; if slug is a UUID (legacy: same as skillId), prefer canonicalSkillId
      const UUID_RE_ITEM =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const rawSlug = row.slug || row.id;
      const externalId =
        rawSlug && !UUID_RE_ITEM.test(rawSlug) ? rawSlug : canonicalSkillId;
      // Extract model from model_selection jsonb
      const sel = row.modelSelection as { manualModelId?: string } | null;
      const resolvedModelId = sel?.manualModelId ?? null;
      return {
        id: externalId,
        name: row.customVariantName ?? characterName,
        skillId: canonicalSkillId,
        characterName,
        modelId: resolvedModelId,
        modelInfo: "",
        isActive: row.slug === activeFavoriteId || row.id === activeFavoriteId,
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
