/**
 * Favorites Repository
 * Database operations for user favorites (character + model settings combos)
 */

import "server-only";

import { asc, eq } from "drizzle-orm";
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

import { CharactersRepository } from "../characters/repository";
import { ChatSettingsRepository } from "../settings/repository";
import { chatFavorites } from "./db";
import type { FavoritesListResponseOutput } from "./definition";
import { ChatFavoritesRepositoryClient } from "./repository-client";

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
  ): Promise<ResponseType<FavoritesListResponseOutput>> {
    const userId = user.id;

    try {
      logger.debug("Fetching favorites", { userId });

      // Get active favorite ID from settings
      const settingsResult = await ChatSettingsRepository.getSettings(
        user,
        logger,
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

          if (favorite.characterId && favorite.characterId.trim() !== "") {
            const characterResult = await CharactersRepository.getCharacterById(
              { id: favorite.characterId },
              user,
              logger,
            );
            if (characterResult.success) {
              characterModelSelection = characterResult.data.modelSelection;
              characterIcon = characterResult.data.icon;
              characterName = characterResult.data.name;
              characterTagline = characterResult.data.tagline;
              characterDescription = characterResult.data.description;
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
          );
        }),
      );

      return success({ favorites: favoritesCards });
    } catch (error) {
      logger.error("Failed to fetch favorites", parseError(error));
      return fail({
        message: "app.api.agent.chat.favorites.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
