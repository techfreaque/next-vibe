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
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import { defaultModel } from "../../models/models";
import type { CharacterGetResponseOutput } from "../characters/[id]/definition";
import { NO_CHARACTER_ID } from "../characters/config";
import { ModelSelectionType } from "../characters/enum";
import { CharactersRepository } from "../characters/repository";
import { CharactersRepositoryClient } from "../characters/repository-client";
import { type ChatFavorite, chatFavorites } from "./db";
import type { FavoriteCard, FavoritesListResponseOutput } from "./definition";

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
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoritesListResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      logger.debug("No user ID, returning empty favorites");
      return success({ favoritesList: [] });
    }

    try {
      logger.debug("Fetching favorites", { userId });

      const favorites = await db
        .select()
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, userId))
        .orderBy(asc(chatFavorites.createdAt));

      // Compute display fields for all favorites
      const favoritesCards = await Promise.all(
        favorites.map(async (favorite) => {
          return await ChatFavoritesRepository.computeFavoriteDisplayFields(
            favorite,
            user,
            logger,
            locale,
          );
        }),
      );

      return success({ favoritesList: favoritesCards });
    } catch (error) {
      logger.error("Failed to fetch favorites", parseError(error));
      return fail({
        message: "app.api.agent.chat.favorites.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Compute display fields for a favorite card
   */
  static async computeFavoriteDisplayFields(
    favorite: ChatFavorite,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<FavoriteCard> {
    const { t } = simpleT(locale);

    // Get character if favorite has one
    let character: CharacterGetResponseOutput | null = null;
    if (favorite.characterId) {
      const characterResult = await CharactersRepository.getCharacterById(
        { id: favorite.characterId },
        user,
        logger,
      );
      if (characterResult.success) {
        character = characterResult.data;
      }
    }

    // Use favorite's modelSelection, fallback to character's if null
    const favoriteModelSelection =
      favorite.modelSelection ?? character?.modelSelection;

    if (!favoriteModelSelection) {
      // Should never happen in production - all characters have modelSelection
      // Return a basic card with error indicator as fallback
      return {
        id: favorite.id,
        characterId: favorite.characterId,
        modelId: defaultModel,
        icon: "alert-circle",
        content: {
          titleRow: {
            name: "app.api.agent.chat.favorites.fallbacks.noModelConfiguration" as const,
            tagline:
              "app.api.agent.chat.favorites.fallbacks.configurationMissing" as const,
          },
          description:
            "app.api.agent.chat.favorites.fallbacks.noDescription" as const,
          modelRow: {
            modelIcon: "alert-circle",
            modelInfo:
              "app.api.agent.chat.favorites.fallbacks.noModel" as const,
            modelProvider:
              "app.api.agent.chat.favorites.fallbacks.unknown" as const,
            creditCost: "app.api.agent.chat.favorites.fallbacks.dash" as const,
          },
        },
      };
    }

    // Resolve model for this favorite
    const resolvedModel =
      favoriteModelSelection.selectionType ===
        ModelSelectionType.CHARACTER_BASED && character?.modelSelection
        ? CharactersRepositoryClient.getBestModelForFavorite(
            favoriteModelSelection,
            character.modelSelection,
          )
        : favoriteModelSelection.selectionType !==
            ModelSelectionType.CHARACTER_BASED
          ? CharactersRepositoryClient.getBestModelForCharacter(
              favoriteModelSelection,
            )
          : null;

    // Check if this is a model-only favorite (NO_CHARACTER_ID)
    const isModelOnly = favorite.characterId === NO_CHARACTER_ID;

    // Compute icon
    const icon =
      favorite.customIcon ?? character?.icon ?? resolvedModel?.icon ?? "bot";

    // Compute display name
    const name =
      favorite.customName ??
      character?.name ??
      resolvedModel?.name ??
      ("app.api.agent.chat.favorites.fallbacks.unknownModel" as const);

    // Compute tagline (return raw value) - empty for model-only
    const tagline = isModelOnly
      ? null
      : (character?.tagline ??
        ("app.api.agent.chat.favorites.fallbacks.noTagline" as const));

    // Compute description (return raw value)
    const description: TranslationKey | null = character
      ? character.description
      : null;

    // Compute model row fields
    // For model-only: don't show model name (it's in title), only provider + credits
    const modelRow: FavoriteCard["content"]["modelRow"] = resolvedModel
      ? {
          modelIcon: resolvedModel.icon,
          modelInfo: isModelOnly
            ? ("app.api.agent.chat.favorites.fallbacks.noDescription" as const)
            : resolvedModel.name,
          modelProvider: resolvedModel.provider,
          creditCost: CharactersRepositoryClient.formatCreditCost(
            resolvedModel.creditCost,
            t,
          ),
        }
      : {
          modelIcon: "alert-circle",
          modelInfo:
            "app.api.agent.chat.favorites.fallbacks.noDescription" as const,
          modelProvider:
            "app.api.agent.chat.favorites.fallbacks.unknown" as const,
          creditCost: "app.api.agent.chat.favorites.fallbacks.dash" as const,
        };

    return {
      id: favorite.id,
      characterId: favorite.characterId,
      modelId: resolvedModel?.id ?? null,
      icon,
      content: {
        titleRow: {
          name,
          tagline,
        },
        description,
        modelRow,
      },
    };
  }
}
