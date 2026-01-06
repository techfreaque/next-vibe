/**
 * Favorites Repository
 * Database operations for user favorites (character + model settings combos)
 */

import "server-only";

import { asc, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { CharacterCategory } from "../characters/enum";
import { getCharacterById } from "../characters/repository";
import { chatFavorites } from "./db";
import type {
  FavoriteCreateRequestOutput,
  FavoriteCreateResponseOutput,
  FavoritesListResponseOutput,
} from "./definition";

/**
 * Chat Favorites Repository
 */
export class ChatFavoritesRepository {
  /**
   * Get all favorites for the authenticated user
   */
  static async getFavorites(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoritesListResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      logger.debug("No user ID, returning empty favorites");
      return success({ favorites: [], hasCompanion: false });
    }

    try {
      logger.debug("Fetching favorites", { userId });

      const favorites = await db
        .select()
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, userId))
        .orderBy(asc(chatFavorites.createdAt));

      // Check if user has at least one companion favorite
      let hasCompanion = false;
      for (const favorite of favorites) {
        if (favorite.characterId) {
          const character = await getCharacterById(favorite.characterId, userId);
          if (character?.category === CharacterCategory.COMPANION) {
            hasCompanion = true;
            break;
          }
        }
      }

      return success({
        favorites,
        hasCompanion,
      });
    } catch (error) {
      logger.error("Failed to fetch favorites", parseError(error));
      return fail({
        message: "app.api.agent.chat.favorites.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create a new favorite
   */
  static async createFavorite(
    data: FavoriteCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteCreateResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      return fail({
        message: "app.api.agent.chat.favorites.post.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Creating favorite", {
        userId,
        characterId: data.characterId,
      });

      // Verify character exists
      const character = await getCharacterById(data.characterId, userId);
      if (!character) {
        return fail({
          message: "app.api.agent.chat.favorites.post.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Get current max position
      const existing = await db
        .select()
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, userId));

      let maxPosition = -1;
      for (const f of existing) {
        if (f.position > maxPosition) {
          maxPosition = f.position;
        }
      }

      const [favorite] = await db
        .insert(chatFavorites)
        .values({
          userId,
          characterId: data.characterId,
          customName: data.customName,
          voice: data.voice,
          modelSelection: data.modelSelection,
          position: maxPosition + 1,
        })
        .returning();

      if (!favorite) {
        return fail({
          message: "app.api.agent.chat.favorites.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({ id: favorite.id });
    } catch (error) {
      logger.error("Failed to create favorite", parseError(error));
      return fail({
        message: "app.api.agent.chat.favorites.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
