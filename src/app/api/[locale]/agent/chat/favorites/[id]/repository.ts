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
import type { CountryLanguage } from "@/i18n/core/config";

import { DEFAULT_TTS_VOICE } from "../../../text-to-speech/enum";
import { scopedTranslation as charactersScopedTranslation } from "../../characters/i18n";
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
import type { scopedTranslation } from "./i18n";

type SingleFavoriteT = ReturnType<typeof scopedTranslation.scopedT>["t"];

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
    t: SingleFavoriteT,
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoriteGetResponseOutput>> {
    const { t: charactersT } = charactersScopedTranslation.scopedT(locale);
    const userId = user.id;

    if (!userId) {
      return fail({
        message: t("get.errors.unauthorized.title"),
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
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const characterResult = await CharactersRepository.getCharacterById(
        { id: favorite.characterId },
        user,
        logger,
        locale,
      );

      if (!characterResult.success) {
        logger.error("Character not found for favorite", {
          characterId: favorite.characterId,
          favoriteId: urlPathParams.id,
          userId,
        });
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const character = characterResult.data;
      const voice = favorite.voice || character?.voice || DEFAULT_TTS_VOICE;

      // Validate character has modelSelection
      if (!character?.modelSelection) {
        logger.error("No character modelSelection found", {
          favoriteId: urlPathParams.id,
          characterId: favorite.characterId,
          hasFavoriteModelSelection: !!favorite.modelSelection,
          hasCharacterModelSelection: !!character?.modelSelection,
        });
        return fail({
          message: t("get.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Build modelSelection response
      // If favorite has custom selection, return it; otherwise return null (use character defaults)
      const modelSelection: FavoriteGetResponseOutput["modelSelection"] =
        favorite.modelSelection ?? null;

      const characterModelSelection: FavoriteGetResponseOutput["characterModelSelection"] =
        character.modelSelection;

      // Merge customIcon with character icon (customIcon takes precedence)
      const displayIcon = favorite.customIcon ?? character?.icon ?? "bot";

      // Flattened response
      return success<FavoriteGetResponseOutput>({
        characterId: favorite.characterId,
        icon: displayIcon,
        name: character?.name ?? charactersT("characters.default.name"),
        tagline:
          character?.tagline ?? charactersT("characters.default.tagline"),
        description:
          character?.description ??
          charactersT("characters.default.description"),
        voice,
        modelSelection,
        characterModelSelection,
        compactTrigger: favorite.compactTrigger ?? null,
      });
    } catch (error) {
      logger.error("Failed to fetch favorite", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
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
    t: SingleFavoriteT,
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoriteUpdateResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      return fail({
        message: t("patch.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const favoriteId = urlPathParams.id;
      logger.debug("Updating favorite", { userId, favoriteId });

      // Validate characterId if provided
      if (data.characterId && data.characterId.trim() === "") {
        return fail({
          message: t("patch.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

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
          message: t("patch.errors.notFound.title"),
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
          locale,
        );
        if (characterResult.success) {
          character = characterResult.data;
        }
      }

      // Only store voice if different from character default
      const voiceToStore =
        character && data.voice === character.voice ? null : data.voice;

      // Only store customIcon if different from character default
      const customIconToStore =
        character && data.icon === character.icon ? null : data.icon;

      // Store modelSelection directly (null = use character defaults)
      const modelSelectionToStore = data.modelSelection;

      const [updated] = await db
        .update(chatFavorites)
        .set({
          characterId: data.characterId,
          customIcon: customIconToStore,
          voice: voiceToStore,
          modelSelection: modelSelectionToStore,
          compactTrigger: data.compactTrigger ?? null,
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
          message: t("patch.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Fetch character data for response
      const updatedCharacterResult =
        await CharactersRepository.getCharacterById(
          { id: updated.characterId },
          user,
          logger,
          locale,
        );

      const updatedCharacter = updatedCharacterResult.success
        ? updatedCharacterResult.data
        : null;

      if (!updatedCharacter) {
        logger.error("Character not found after update", {
          characterId: updated.characterId,
          favoriteId,
          userId,
        });
      }

      // Flattened response
      return success({
        success: t("patch.response.success.content"),
      });
    } catch (error) {
      logger.error("Failed to update favorite", parseError(error));
      return fail({
        message: t("patch.errors.server.title"),
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
    t: SingleFavoriteT,
  ): Promise<ResponseType<FavoriteDeleteResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      return fail({
        message: t("delete.errors.unauthorized.title"),
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
          message: t("delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success();
    } catch (error) {
      logger.error("Failed to delete favorite", parseError(error));
      return fail({
        message: t("delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
