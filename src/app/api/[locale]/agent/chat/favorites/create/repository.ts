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
import type { CountryLanguage } from "@/i18n/core/config";

import { DEFAULT_SKILLS } from "../../skills/config";
import { SkillsRepository } from "../../skills/repository";
import { chatFavorites } from "../db";
import type {
  FavoriteCreateRequestOutput,
  FavoriteCreateResponseOutput,
} from "./definition";
import type { FavoriteCreateT } from "./i18n";

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
    t: FavoriteCreateT,
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoriteCreateResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      return fail({
        message: t("post.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Creating favorite", {
        userId,
        skillId: data.skillId,
      });

      // Validate skillId is not empty
      if (!data.skillId || data.skillId.trim() === "") {
        return fail({
          message: t("post.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Get character to compare defaults
      let character = null;
      if (data.skillId) {
        const characterResult = await SkillsRepository.getSkillById(
          { id: data.skillId },
          user,
          logger,
          locale,
        );
        if (!characterResult.success) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        character = characterResult.data;
      }

      // Only store voice if different from character default
      const voiceToStore =
        character && data.voice === character.voice ? null : data.voice;

      // If a variantId is provided, resolve its modelSelection from DEFAULT_SKILLS
      // so the favorite stores the correct model config for that variant.
      let modelSelectionToStore = data.modelSelection;
      if (data.variantId && data.skillId) {
        const defaultSkill = DEFAULT_SKILLS.find((s) => s.id === data.skillId);
        const variant = defaultSkill?.variants?.find(
          (v) => v.id === data.variantId,
        );
        if (variant) {
          modelSelectionToStore = variant.modelSelection;
        }
      }

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
          skillId: data.skillId,
          variantId: data.variantId ?? null,
          customName: null,
          customIcon: null,
          voice: voiceToStore,
          modelSelection: modelSelectionToStore,
          compactTrigger: data.compactTrigger ?? null,
          availableTools: data.availableTools ?? null,
          pinnedTools: data.pinnedTools ?? null,
          position: nextPosition,
          color: null,
          useCount: 0,
        })
        .returning();

      if (!favorite) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        success: t("post.success.title"),
        id: favorite.id,
      });
    } catch (error) {
      logger.error("Failed to create favorite", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
