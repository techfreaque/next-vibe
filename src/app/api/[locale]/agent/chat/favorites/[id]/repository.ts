/**
 * Single Favorite Repository
 * Database operations for individual favorite management
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatFavorites } from "../db";
import type {
  FavoriteDeleteRequestOutput,
  FavoriteDeleteResponseOutput,
  FavoriteGetRequestOutput,
  FavoriteGetResponseOutput,
  FavoriteUpdateRequestOutput,
  FavoriteUpdateResponseOutput,
} from "./definition";

/**
 * Single Favorite Repository Interface
 */
export interface SingleFavoriteRepositoryInterface {
  getFavorite(
    data: FavoriteGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteGetResponseOutput>>;

  updateFavorite(
    data: FavoriteUpdateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteUpdateResponseOutput>>;

  deleteFavorite(
    data: FavoriteDeleteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteDeleteResponseOutput>>;
}

/**
 * Single Favorite Repository Implementation
 */
export class SingleFavoriteRepositoryImpl
  implements SingleFavoriteRepositoryInterface
{
  /**
   * Get a single favorite by ID
   */
  async getFavorite(
    data: FavoriteGetRequestOutput,
    user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteGetResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      logger.error("Missing user identifier", { user });
      return fail({
        message:
          "app.api.agent.chat.favorites.id.get.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const favoriteId = data.id;
      logger.debug("Fetching favorite", { userId, favoriteId });

      const [favorite] = await db
        .select()
        .from(chatFavorites)
        .where(
          and(
            eq(chatFavorites.id, favoriteId),
            eq(chatFavorites.userId, userId),
          ),
        )
        .limit(1);

      if (!favorite) {
        logger.error("Favorite not found", { favoriteId, userId });
        return fail({
          message:
            "app.api.agent.chat.favorites.id.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const modelSettings = favorite.modelSettings as {
        mode: string;
        filters: {
          intelligence: string;
          maxPrice: string;
          content: string;
        };
        manualModelId?: string;
      };
      const uiSettings = favorite.uiSettings as {
        position: number;
        color?: string;
      };

      return success({
        personaId: favorite.personaId,
        customName: favorite.customName,
        mode: modelSettings.mode as "AUTO" | "MANUAL",
        intelligence: modelSettings.filters.intelligence as
          | "ANY"
          | "QUICK"
          | "SMART"
          | "BRILLIANT",
        maxPrice: modelSettings.filters.maxPrice as
          | "ANY"
          | "CHEAP"
          | "STANDARD"
          | "PREMIUM",
        content: modelSettings.filters.content as
          | "ANY"
          | "MAINSTREAM"
          | "OPEN"
          | "UNCENSORED",
        manualModelId: modelSettings.manualModelId ?? null,
        position: uiSettings.position,
        color: uiSettings.color ?? null,
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
  async updateFavorite(
    data: FavoriteUpdateRequestOutput,
    user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteUpdateResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      logger.error("Missing user identifier", { user });
      return fail({
        message:
          "app.api.agent.chat.favorites.id.patch.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const favoriteId = data.id;
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
        logger.error("Favorite not found", { favoriteId, userId });
        return fail({
          message:
            "app.api.agent.chat.favorites.id.patch.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Build update values
      const currentModelSettings = existing.modelSettings as {
        mode: string;
        filters: {
          intelligence: string;
          maxPrice: string;
          content: string;
        };
        manualModelId?: string;
      };
      const currentUiSettings = existing.uiSettings as {
        position: number;
        color?: string;
      };

      // Update model settings if any filter fields are provided
      const newModelSettings = {
        mode: data.mode ?? currentModelSettings.mode,
        filters: {
          intelligence:
            data.intelligence ?? currentModelSettings.filters.intelligence,
          maxPrice: data.maxPrice ?? currentModelSettings.filters.maxPrice,
          content: data.content ?? currentModelSettings.filters.content,
        },
        manualModelId:
          data.manualModelId !== undefined
            ? data.manualModelId
            : currentModelSettings.manualModelId,
      };

      // Update UI settings if position is provided
      const newUiSettings = {
        position: data.position ?? currentUiSettings.position,
        color: currentUiSettings.color,
      };

      // Handle isActive - if setting to true, deactivate others first
      if (data.isActive === true) {
        await db
          .update(chatFavorites)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(chatFavorites.userId, userId));
      }

      // Perform the update
      const [updated] = await db
        .update(chatFavorites)
        .set({
          personaId: data.personaId ?? existing.personaId,
          customName:
            data.customName !== undefined
              ? data.customName
              : existing.customName,
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
        logger.error("Failed to update favorite", { favoriteId, userId });
        return fail({
          message:
            "app.api.agent.chat.favorites.id.patch.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        success: true,
      });
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
  async deleteFavorite(
    data: FavoriteDeleteRequestOutput,
    user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteDeleteResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      logger.error("Missing user identifier", { user });
      return fail({
        message:
          "app.api.agent.chat.favorites.id.delete.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const favoriteId = data.id;
      logger.debug("Deleting favorite", { userId, favoriteId });

      const result = await db
        .delete(chatFavorites)
        .where(
          and(
            eq(chatFavorites.id, favoriteId),
            eq(chatFavorites.userId, userId),
          ),
        )
        .returning();

      if (result.length === 0) {
        logger.error("Favorite not found", { favoriteId, userId });
        return fail({
          message:
            "app.api.agent.chat.favorites.id.delete.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        success: true,
      });
    } catch (error) {
      logger.error("Failed to delete favorite", parseError(error));
      return fail({
        message: "app.api.agent.chat.favorites.id.delete.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const singleFavoriteRepository = new SingleFavoriteRepositoryImpl();
