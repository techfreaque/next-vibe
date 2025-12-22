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

import { chatFavorites, type FavoriteModelSettings } from "../db";
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

      return success({
        characterId: favorite.characterId,
        customName: favorite.customName,
        voice: favorite.voice,
        mode: favorite.modelSettings.mode,
        intelligence: favorite.modelSettings.filters.intelligence,
        maxPrice: favorite.modelSettings.filters.maxPrice,
        content: favorite.modelSettings.filters.content,
        manualModelId: favorite.modelSettings.manualModelId ?? null,
        position: favorite.uiSettings.position,
        color: favorite.uiSettings.color ?? null,
        isActive: favorite.isActive,
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

      // Build update values - merge with existing
      const newModelSettings: FavoriteModelSettings = {
        mode: data.mode ?? existing.modelSettings.mode,
        filters: {
          intelligence:
            data.intelligence ?? existing.modelSettings.filters.intelligence,
          maxPrice: data.maxPrice ?? existing.modelSettings.filters.maxPrice,
          content: data.content ?? existing.modelSettings.filters.content,
        },
        manualModelId:
          data.manualModelId !== undefined
            ? (data.manualModelId ?? undefined)
            : existing.modelSettings.manualModelId,
      };

      const newUiSettings = {
        position: data.position ?? existing.uiSettings.position,
        color: existing.uiSettings.color,
      };

      // Handle isActive - if setting to true, deactivate others first
      if (data.isActive === true) {
        await db
          .update(chatFavorites)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(chatFavorites.userId, userId));
      }

      const [updated] = await db
        .update(chatFavorites)
        .set({
          characterId: data.characterId ?? existing.characterId,
          customName:
            data.customName !== undefined
              ? data.customName
              : existing.customName,
          voice: data.voice !== undefined ? data.voice : existing.voice,
          modelSettings: newModelSettings,
          uiSettings: newUiSettings,
          isActive: data.isActive ?? existing.isActive,
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

      return success({ success: true });
    } catch (error) {
      logger.error("Failed to delete favorite", parseError(error));
      return fail({
        message: "app.api.agent.chat.favorites.id.delete.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
