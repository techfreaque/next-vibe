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
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { CharacterCategory, getCharacterById } from "../characters/config";
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
          const character = getCharacterById(favorite.characterId);
          if (character?.category === CharacterCategory.COMPANION) {
            hasCompanion = true;
            break;
          }
        }
      }

      return success({
        favorites: favorites.map((f) => ({
          id: f.id,
          characterId: f.characterId,
          customName: f.customName,
          customIcon: f.customIcon,
          voice: f.voice,
          mode: f.modelSettings.mode,
          intelligence: f.modelSettings.filters.intelligence,
          maxPrice: f.modelSettings.filters.maxPrice,
          content: f.modelSettings.filters.content,
          manualModelId: f.modelSettings.manualModelId ?? null,
          position: f.uiSettings.position,
          color: f.uiSettings.color ?? null,
          isActive: f.isActive,
          useCount: f.useCount,
        })),
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
      const character = getCharacterById(data.characterId);
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
        const uiSettings = f.uiSettings as { position: number };
        if (uiSettings.position > maxPosition) {
          maxPosition = uiSettings.position;
        }
      }

      const [favorite] = await db
        .insert(chatFavorites)
        .values({
          userId,
          characterId: data.characterId,
          customName: data.customName ?? null,
          voice: data.voice ?? null,
          modelSettings: {
            mode: data.mode,
            filters: {
              intelligence: data.intelligence,
              maxPrice: data.maxPrice,
              content: data.content,
            },
            manualModelId: data.manualModelId,
          },
          uiSettings: {
            position: maxPosition + 1,
          },
          isActive: false,
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
