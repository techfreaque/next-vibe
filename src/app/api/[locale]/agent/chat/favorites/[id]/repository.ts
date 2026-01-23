/**
 * Single Favorite Repository
 * Database operations for individual favorite management
 */

import "server-only";

import { and, eq } from "drizzle-orm";
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
  FavoriteDeleteResponseOutput,
  FavoriteDeleteUrlVariablesOutput,
  FavoriteGetResponseOutput,
  FavoriteGetUrlVariablesOutput,
  FavoriteUpdateRequestOutput,
  FavoriteUpdateResponseOutput,
  FavoriteUpdateUrlVariablesOutput,
} from "./definition";

/**
 * Single Favorite Repository
 */
export class SingleFavoriteRepository {
  /**
   * Get a single favorite by ID
   */
  static async getFavorite(
    urlPathParams: FavoriteGetUrlVariablesOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteGetResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      return fail({
        message:
          "app.api.agent.chat.favorites.id.get.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Fetching favorite", {
        userId,
        favoriteId: urlPathParams.id,
      });

      const [favorite] = await db
        .select()
        .from(chatFavorites)
        .where(
          and(
            eq(chatFavorites.id, urlPathParams.id),
            eq(chatFavorites.userId, userId),
          ),
        )
        .limit(1);

      if (!favorite) {
        return fail({
          message: "app.api.agent.chat.favorites.id.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const characterResult = await CharactersRepository.getCharacterById(
        { id: favorite.characterId },
        user,
        logger,
      );

      const character = characterResult.success ? characterResult.data : null;

      if (!character) {
        logger.error("Character not found", {
          characterId: favorite.characterId,
          favoriteId: urlPathParams.id,
          userId,
        });
      }
      // Use favorite values, fallback to character values when null/undefined
      const voice = favorite.voice ?? character?.voice ?? null;
      const modelSelection =
        favorite.modelSelection ?? character?.modelSelection;

      if (!modelSelection) {
        logger.error("No modelSelection found", {
          favoriteId: urlPathParams.id,
          characterId: favorite.characterId,
          hasFavoriteModelSelection: !!favorite.modelSelection,
          hasCharacterModelSelection: !!character?.modelSelection,
        });
        return fail({
          message: "app.api.agent.chat.favorites.id.get.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success<FavoriteGetResponseOutput>({
        id: favorite.id,
        characterId: favorite.characterId,
        character: {
          info: {
            icon: character?.icon ?? "bot",
            info: {
              titleRow: {
                name:
                  character?.name ??
                  ("app.api.agent.chat.characters.characters.default.name" as const),
                tagline:
                  character?.tagline ??
                  ("app.api.agent.chat.characters.characters.default.tagline" as const),
              },
              description:
                character?.description ??
                ("app.api.agent.chat.characters.characters.default.description" as const),
            },
          },
        },
        customName: favorite.customName,
        customIcon: favorite.customIcon ?? character?.icon ?? null,
        voice,
        modelSelection,
        position: favorite.position,
        color: favorite.color,
        useCount: favorite.useCount,
      });
    } catch (error) {
      logger.error("Failed to fetch favorite", parseError(error));
      return fail({
        message: "app.api.agent.chat.favorites.id.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update a favorite
   */
  static async updateFavorite(
    data: FavoriteUpdateRequestOutput,
    urlPathParams: FavoriteUpdateUrlVariablesOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteUpdateResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      return fail({
        message:
          "app.api.agent.chat.favorites.id.patch.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const favoriteId = urlPathParams.id;
      logger.debug("Updating favorite", { userId, favoriteId });

      // First, get the existing favorite
      const [existing] = await db
        .select()
        .from(chatFavorites)
        .where(
          and(
            eq(chatFavorites.id, favoriteId),
            eq(chatFavorites.userId, userId),
          ),
        )
        .limit(1);

      if (!existing) {
        return fail({
          message:
            "app.api.agent.chat.favorites.id.patch.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Get character to compare defaults
      let character = null;
      if (data.characterId ?? existing.characterId) {
        const characterResult = await CharactersRepository.getCharacterById(
          { id: data.characterId ?? existing.characterId },
          user,
          logger,
        );
        if (characterResult.success) {
          character = characterResult.data;
        }
      }

      // Only store voice if different from character default
      const voiceToStore =
        character && data.voice === character.voice ? null : data.voice;

      const [updated] = await db
        .update(chatFavorites)
        .set({
          characterId: data.characterId,
          customName: data.customName,
          customIcon: data.customIcon,
          voice: voiceToStore,
          modelSelection: data.modelSelection,
          color: data.color,
          position: data.position,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(chatFavorites.id, favoriteId),
            eq(chatFavorites.userId, userId),
          ),
        )
        .returning();

      if (!updated) {
        return fail({
          message: "app.api.agent.chat.favorites.id.patch.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({ success: true });
    } catch (error) {
      logger.error("Failed to update favorite", parseError(error));
      return fail({
        message: "app.api.agent.chat.favorites.id.patch.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete a favorite
   */
  static async deleteFavorite(
    urlPathParams: FavoriteDeleteUrlVariablesOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteDeleteResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      return fail({
        message:
          "app.api.agent.chat.favorites.id.delete.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Deleting favorite", {
        userId,
        favoriteId: urlPathParams.id,
      });

      const result = await db
        .delete(chatFavorites)
        .where(
          and(
            eq(chatFavorites.id, urlPathParams.id),
            eq(chatFavorites.userId, userId),
          ),
        )
        .returning();

      if (result.length === 0) {
        return fail({
          message:
            "app.api.agent.chat.favorites.id.delete.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success();
    } catch (error) {
      logger.error("Failed to delete favorite", parseError(error));
      return fail({
        message: "app.api.agent.chat.favorites.id.delete.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
