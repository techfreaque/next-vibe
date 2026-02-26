/**
 * Favorites Repository
 * Database operations for user favorites (character + model settings combos)
 */

import "server-only";

import { asc, eq, inArray } from "drizzle-orm";
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
import type { CountryLanguage } from "@/i18n/core/config";

import { DEFAULT_CHARACTERS } from "../characters/config";
import { NO_CHARACTER_ID } from "../characters/constants";
import { scopedTranslation as charactersScopedTranslation } from "../characters/i18n";
import { CharactersRepository } from "../characters/repository";
import { chatSettings } from "../settings/db";
import { scopedTranslation as settingsScopedTranslation } from "../settings/i18n";
import { ChatSettingsRepository } from "../settings/repository";
import { chatFavorites } from "./db";
import type { FavoritesListResponseOutput } from "./definition";
import {
  formatEmptyFavoritesGuidance,
  formatFavoritesSummary,
} from "./favorites-formatter";
import type { scopedTranslation } from "./i18n";
import { ChatFavoritesRepositoryClient } from "./repository-client";

type FavoritesT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/**
 * Chat Favorites Repository
 */
export class ChatFavoritesRepository {
  /**
   * Get all favorites for the authenticated user
   */
  static async getFavorites(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: FavoritesT,
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoritesListResponseOutput>> {
    const userId = user.id;
    const { t: settingsT } = settingsScopedTranslation.scopedT(locale);

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
          // Fetch character data if needed
          let characterModelSelection = null;
          let characterIcon = null;
          let characterName = null;
          let characterTagline = null;
          let characterDescription = null;
          let characterVoice = null;

          if (favorite.characterId && favorite.characterId.trim() !== "") {
            const characterResult = await CharactersRepository.getCharacterById(
              { id: favorite.characterId },
              user,
              logger,
              locale,
            );
            if (characterResult.success) {
              characterModelSelection = characterResult.data.modelSelection;
              characterIcon = characterResult.data.icon;
              characterName = characterResult.data.name;
              characterTagline = characterResult.data.tagline;
              characterDescription = characterResult.data.description;
              characterVoice = characterResult.data.voice;
            }
          }

          // Use client repository's compute method for DRY
          // Map ChatFavorite to StoredLocalFavorite structure
          return ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
            {
              id: favorite.id,
              characterId: favorite.characterId,
              customIcon: favorite.customIcon,
              voice: favorite.voice,
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
          );
        }),
      );

      return success({ favorites: favoritesCards });
    } catch (error) {
      logger.error("Failed to fetch favorites", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

/**
 * Generate favorites summary for system prompt (server-side)
 * Fetches favorites from database and formats them using shared formatter
 */
export async function generateFavoritesSummary(params: {
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

    // Resolve localized character names
    const { t: charT } = charactersScopedTranslation.scopedT(locale);
    const characterNameMap = new Map<string, string>();
    for (const char of DEFAULT_CHARACTERS) {
      characterNameMap.set(char.id, charT(char.name));
    }

    // Look up custom character names for any non-default characterIds
    const customCharIds = rows
      .map((r) => r.characterId)
      .filter((id) => id !== NO_CHARACTER_ID && !characterNameMap.has(id));
    if (customCharIds.length > 0) {
      const { customCharacters: customCharsTable } =
        await import("../characters/db");
      const customChars = await db
        .select({ id: customCharsTable.id, name: customCharsTable.name })
        .from(customCharsTable)
        .where(inArray(customCharsTable.id, customCharIds));
      for (const cc of customChars) {
        characterNameMap.set(cc.id, cc.name);
      }
    }

    const items = rows.map((row) => ({
      id: row.id,
      name: row.customName ?? row.characterId,
      characterId: row.characterId,
      characterName: characterNameMap.get(row.characterId) ?? null,
      modelId: null as string | null, // model resolved client-side; not stored server-side
      modelInfo: "",
      isActive: row.id === activeFavoriteId,
      position: row.position,
      useCount: row.useCount,
      lastUsedAt: row.lastUsedAt,
    }));

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
