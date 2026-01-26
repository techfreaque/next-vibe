/**
 * Favorites Create Repository
 * Database operations for creating new favorites
 */

import "server-only";

import { eq, max } from "drizzle-orm";
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

import { CharactersRepository } from "../../characters/repository";
import { chatFavorites } from "../db";
import type {
  FavoriteCreateRequestOutput,
  FavoriteCreateResponseOutput,
} from "./definition";

/**
 * Favorites Create Repository
 */
export class FavoritesCreateRepository {
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

      // Get character to compare defaults
      let character = null;
      if (data.characterId) {
        const characterResult = await CharactersRepository.getCharacterById(
          { id: data.characterId },
          user,
          logger,
        );
        if (!characterResult.success) {
          return fail({
            message: "app.api.agent.chat.favorites.post.errors.notFound.title",
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        character = characterResult.data;
      }

      // Only store voice if different from character default
      const voiceToStore =
        character && data.voice === character.voice ? null : data.voice;

      // Get current max position using database aggregation
      const [maxPositionResult] = await db
        .select({ maxPosition: max(chatFavorites.position) })
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, userId));

      const nextPosition = (maxPositionResult?.maxPosition ?? -1) + 1;

      const [favorite] = await db
        .insert(chatFavorites)
        .values({
          userId,
          characterId: data.characterId,
          customName: data.customName,
          voice: voiceToStore,
          modelSelection: data.modelSelection,
          position: nextPosition,
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
