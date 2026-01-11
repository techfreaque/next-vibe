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
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ModelOption } from "../../models/models";
import { modelOptions, modelProviders } from "../../models/models";
import type { CharacterGetResponseOutput } from "../characters/[id]/definition";
import { CharactersRepository } from "../characters/repository";
import { CharactersRepositoryClient } from "../characters/repository-client";
import { type ChatFavorite, chatFavorites } from "./db";
import type {
  FavoriteCard,
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
            userId,
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

  /**
   * Compute display fields for a favorite card
   */
  static async computeFavoriteDisplayFields(
    favorite: ChatFavorite,
    userId: string | null,
    locale: CountryLanguage,
  ): Promise<FavoriteCard> {
    const { t } = simpleT(locale);
    const allModels = Object.values(modelOptions);

    // Get character if favorite has one
    const character: CharacterGetResponseOutput | null = favorite.characterId
      ? await CharactersRepository.getCharacterByIdSimple(favorite.characterId, userId ?? undefined)
      : null;

    // Resolve model for this favorite
    const resolvedModel: ModelOption | null = CharactersRepositoryClient.resolveModelForSelection(
      favorite.modelSelection,
      allModels,
    );

    // Compute display icon
    let icon: IconKey;
    if (favorite.customIcon) {
      icon = favorite.customIcon as IconKey;
    } else if (character) {
      icon = character.icon;
    } else if (resolvedModel) {
      icon = resolvedModel.icon;
    } else {
      icon = "sparkles";
    }

    // Compute display name (without translation)
    let name: string;
    if (favorite.customName) {
      name = favorite.customName;
    } else if (character) {
      name = character.name;
    } else if (resolvedModel) {
      name = resolvedModel.name;
    } else {
      name = "Model Only";
    }

    // Compute tagline
    const tagline = character?.tagline ?? "";

    // Compute description
    let description: string;
    if (character) {
      description = character.description;
    } else if (resolvedModel) {
      description = `AI model for chat and content generation`;
    } else {
      description = "Custom chat configuration";
    }

    const modelIcon = resolvedModel?.icon ?? ("sparkles" as IconKey);
    const modelInfo = resolvedModel?.name ?? "Default Model";
    const modelProvider = resolvedModel?.provider
      ? (modelProviders[resolvedModel.provider]?.name ?? "Unknown")
      : "Unknown";
    const creditCost = resolvedModel
      ? CharactersRepositoryClient.formatCreditCost(resolvedModel.creditCost, t)
      : "—";

    return {
      id: favorite.id,
      characterId: favorite.characterId,
      icon,
      content: {
        titleRow: {
          name,
          tagline,
        },
        description,
        modelRow: {
          modelIcon,
          modelInfo,
          modelProvider,
          creditCost,
        },
      },
    };
  }
}
