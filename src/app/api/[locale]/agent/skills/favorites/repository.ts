/**
 * Favorites Repository
 * Database operations for user favorites (skill + model settings combos)
 */

import "server-only";

import { and, asc, eq, inArray, or, sql } from "drizzle-orm";
import type { Platform } from "next-vibe/core/definition/platform";
import { isAgentPlatform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { RemoteEventHandlerProps } from "next-vibe/core/route/handler";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/emitter";

import { getInstanceAvailability } from "@/app/api/[locale]/agent/env-availability";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";

import { chatSettings } from "../../chat/settings/db";
import { scopedTranslation as settingsScopedTranslation } from "../../chat/settings/i18n";
import { ChatSettingsRepository } from "../../chat/settings/repository";
import {
  formatSkillId,
  isSkillVariantId,
  isUuid,
  parseSkillId,
  resolveIdAlias,
} from "../../chat/slugify";
import { DEFAULT_SKILLS } from "../config";
import { NO_SKILL_ID } from "../constants";
import { scopedTranslation as charactersScopedTranslation } from "../i18n";
import { SkillsRepository } from "../repository";
import {
  chatFavorites,
  FAVORITE_CONFIG_COLUMNS,
  type FavoriteConfig,
} from "./db";
import type { FavoritesListResponseOutput } from "./definition";
import type { FavoriteSummaryItem } from "./favorites-formatter";
import {
  formatEmptyFavoritesGuidance,
  formatFavoritesSummary,
} from "./favorites-formatter";
import type { FavoritesT } from "./i18n";
import reorderDefinitions from "./reorder/definition";
import { ChatFavoritesRepositoryClient } from "./repository-client";
import type { SyncedFavorite } from "./sync-provider";

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

      const availability = await getInstanceAvailability();

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
              // Resolve variant's model selections from the skill's variants list
              // If no variantId, use the default variant (mirrors headless.ts resolveFavorite logic)
              const variants = skillResult.data.variants;
              const variant = favorite.variantId
                ? variants.find((v) => v.id === favorite.variantId)
                : (variants.find((v) => v.isDefault) ?? variants[0] ?? null);
              characterModelSelection = variant?.modelSelection ?? null;
              // Derive voice from the resolved variant; fall back to skill-level top field
              characterVoice = variant?.voiceModelSelection ?? null;
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
            availability,
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
        const { customSkills: customSkillsTable } = await import("../db");
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
      const { customSkills: customSkillsTable } = await import("../db");
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

  /**
   * Apply a remote favorite create/update relayed from a peer instance. Receives
   * the FULL row(s) from the favorite-created-full / favorite-updated-full events
   * — losslessly upserted (dedup by skillId+variantId, last-writer-wins on
   * updatedAt). Called by route.ts onRemoteEvent.
   */
  static async applyRemoteFavoriteUpsert(
    favorites: SyncedFavorite[],
    userId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      for (const fav of favorites) {
        const remoteUpdatedAt = new Date(fav.updatedAt);
        await db
          .insert(chatFavorites)
          .values({
            id: fav.id,
            userId,
            slug: fav.slug,
            skillId: fav.skillId,
            variantId: fav.variantId,
            customVariantName: fav.customVariantName,
            customIcon: fav.customIcon,
            modelSelection: fav.modelSelection ?? null,
            voiceModelSelection: fav.voiceModelSelection ?? null,
            sttModelSelection: fav.sttModelSelection ?? null,
            imageVisionModelSelection: fav.imageVisionModelSelection ?? null,
            videoVisionModelSelection: fav.videoVisionModelSelection ?? null,
            audioVisionModelSelection: fav.audioVisionModelSelection ?? null,
            imageGenModelSelection: fav.imageGenModelSelection ?? null,
            musicGenModelSelection: fav.musicGenModelSelection ?? null,
            videoGenModelSelection: fav.videoGenModelSelection ?? null,
            position: fav.position,
            color: fav.color,
            compactTrigger: fav.compactTrigger,
            memoryLimit: fav.memoryLimit,
            availableTools: fav.availableTools ?? null,
            pinnedTools: fav.pinnedTools ?? null,
            deniedTools: fav.deniedTools ?? null,
            promptAppend: fav.promptAppend,
            subAgentFavoriteId: fav.subAgentFavoriteId,
            updatedAt: remoteUpdatedAt,
          })
          .onConflictDoUpdate({
            target: chatFavorites.id,
            set: {
              slug: fav.slug,
              skillId: fav.skillId,
              variantId: fav.variantId,
              customVariantName: fav.customVariantName,
              customIcon: fav.customIcon,
              modelSelection: fav.modelSelection ?? null,
              voiceModelSelection: fav.voiceModelSelection ?? null,
              sttModelSelection: fav.sttModelSelection ?? null,
              imageVisionModelSelection: fav.imageVisionModelSelection ?? null,
              videoVisionModelSelection: fav.videoVisionModelSelection ?? null,
              audioVisionModelSelection: fav.audioVisionModelSelection ?? null,
              imageGenModelSelection: fav.imageGenModelSelection ?? null,
              musicGenModelSelection: fav.musicGenModelSelection ?? null,
              videoGenModelSelection: fav.videoGenModelSelection ?? null,
              position: fav.position,
              color: fav.color,
              compactTrigger: fav.compactTrigger,
              memoryLimit: fav.memoryLimit,
              availableTools: fav.availableTools ?? null,
              pinnedTools: fav.pinnedTools ?? null,
              deniedTools: fav.deniedTools ?? null,
              promptAppend: fav.promptAppend,
              subAgentFavoriteId: fav.subAgentFavoriteId,
              updatedAt: remoteUpdatedAt,
            },
          });
      }
    } catch (error) {
      logger.error("Failed to apply remote favorite upsert", parseError(error));
    }
  }

  /**
   * Apply a remote favorites-reordered relayed from a peer instance. Updates
   * position by id, scoped to userId. Called by route.ts onRemoteEvent.
   */
  static async applyRemoteFavoriteReorder({
    requestData,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof reorderDefinitions.POST,
    "favorites-reordered"
  >): Promise<void> {
    const userId = user.id;
    try {
      for (const fav of requestData.positions) {
        await db
          .update(chatFavorites)
          .set({ position: fav.position, updatedAt: new Date() })
          .where(
            and(eq(chatFavorites.userId, userId), eq(chatFavorites.id, fav.id)),
          );
      }
      createEndpointEmitter(reorderDefinitions.POST, logger, user, {
        fanOut: false,
      })("favorites-reordered", {
        requestData: { positions: requestData.positions },
      });
    } catch (error) {
      logger.error(
        "Failed to apply remote favorite reorder",
        parseError(error),
      );
    }
  }

  /**
   * Apply a remote favorite-deleted relayed from a peer instance. The event's
   * `id` is the favorite's display id (slug, or UUID for slugless rows), which is
   * stable across instances (the full-row upsert preserves slug + id). Removes by
   * either, scoped to userId. Called by route.ts onRemoteEvent.
   */
  static async applyRemoteFavoriteDelete(
    favorites: { id: string }[],
    userId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      for (const fav of favorites) {
        await db
          .delete(chatFavorites)
          .where(
            and(
              eq(chatFavorites.userId, userId),
              or(eq(chatFavorites.id, fav.id), eq(chatFavorites.slug, fav.id)),
            ),
          );
      }
    } catch (error) {
      logger.error("Failed to apply remote favorite delete", parseError(error));
    }
  }
}
