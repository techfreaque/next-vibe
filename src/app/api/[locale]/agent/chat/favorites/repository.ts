/**
 * Favorites Repository
 * Database operations for user favorites (persona + model settings combos)
 */

import "server-only";

import { and, asc, eq } from "drizzle-orm";
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

import { getPersonaById, PersonaCategory } from "../personas/config";
import { chatFavorites } from "./db";
import type {
  FavoriteCreateRequestOutput,
  FavoriteCreateResponseOutput,
  FavoritesListRequestOutput,
  FavoritesListResponseOutput,
} from "./definition";
import type {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionMode,
  PriceLevel,
} from "./enum";

/**
 * Chat Favorites Repository Interface
 */
export interface ChatFavoritesRepositoryInterface {
  getFavorites(
    data: FavoritesListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoritesListResponseOutput>>;

  createFavorite(
    data: FavoriteCreateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteCreateResponseOutput>>;
}

/**
 * Chat Favorites Repository Implementation
 */
export class ChatFavoritesRepositoryImpl
  implements ChatFavoritesRepositoryInterface
{
  /**
   * Get all favorites for the authenticated user
   */
  async getFavorites(
    _data: FavoritesListRequestOutput,
    user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoritesListResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      logger.error("Missing user identifier", { user });
      return fail({
        message: "app.api.agent.chat.favorites.get.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
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
        if (favorite.personaId) {
          const persona = getPersonaById(favorite.personaId);
          if (persona?.category === PersonaCategory.COMPANION) {
            hasCompanion = true;
            break;
          }
        }
      }

      // Map favorites to response format
      const mappedFavorites = favorites.map((f) => {
        const modelSettings = f.modelSettings as {
          mode: string;
          filters: {
            intelligence: string;
            maxPrice: string;
            content: string;
          };
          manualModelId?: string;
        };
        const uiSettings = f.uiSettings as {
          position: number;
          color?: string;
        };

        return {
          id: f.id,
          personaId: f.personaId,
          customName: f.customName,
          mode: modelSettings.mode as typeof ModelSelectionMode.AUTO,
          intelligence:
            modelSettings.filters.intelligence as typeof IntelligenceLevel.ANY,
          maxPrice: modelSettings.filters.maxPrice as typeof PriceLevel.ANY,
          content: modelSettings.filters.content as typeof ContentLevel.ANY,
          manualModelId: modelSettings.manualModelId ?? null,
          position: uiSettings.position,
          color: uiSettings.color ?? null,
          isActive: f.isActive,
          useCount: f.useCount,
        };
      });

      return success({
        favorites: mappedFavorites,
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
  async createFavorite(
    data: FavoriteCreateRequestOutput,
    user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FavoriteCreateResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      logger.error("Missing user identifier", { user });
      return fail({
        message: "app.api.agent.chat.favorites.post.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Creating favorite", { userId, personaId: data.personaId });

      // Verify persona exists
      const persona = getPersonaById(data.personaId);
      if (!persona) {
        logger.error("Persona not found", { personaId: data.personaId });
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

      // Build model settings
      const modelSettings = {
        mode: data.mode,
        filters: {
          intelligence: data.intelligence,
          maxPrice: data.maxPrice,
          content: data.content,
        },
        manualModelId: data.manualModelId,
      };

      // Build UI settings
      const uiSettings = {
        position: maxPosition + 1,
      };

      const [favorite] = await db
        .insert(chatFavorites)
        .values({
          userId,
          personaId: data.personaId,
          customName: data.customName ?? null,
          modelSettings,
          uiSettings,
          isActive: false,
        })
        .returning();

      if (!favorite) {
        logger.error("Failed to insert favorite into database");
        return fail({
          message: "app.api.agent.chat.favorites.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        id: favorite.id,
      });
    } catch (error) {
      logger.error("Failed to create favorite", parseError(error));
      return fail({
        message: "app.api.agent.chat.favorites.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const chatFavoritesRepository = new ChatFavoritesRepositoryImpl();
