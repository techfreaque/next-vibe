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

import type { ModelRole } from "@/app/api/[locale]/agent/models/enum";
import type { ModelSelectionSimple } from "@/app/api/[locale]/agent/models/types";
import { getDefaultModelForRole } from "@/app/api/[locale]/agent/models/models";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import { SkillsRepository } from "../../skills/repository";
import { chatFavorites } from "../db";
import type {
  FavoriteCreateRequestOutput,
  FavoriteCreateResponseOutput,
} from "./definition";
import type { FavoriteCreateT } from "./i18n";

/**
 * Normalize a model selection: if it equals the platform default for the given roles,
 * return null so we don't store redundant data.
 */
function normalizeModelSelection<T extends ModelSelectionSimple>(
  sel: T | null | undefined,
  roles: ModelRole[],
): T | null {
  if (!sel) {
    return null;
  }
  if (sel.selectionType !== ModelSelectionType.MANUAL) {
    return sel;
  }
  const def = getDefaultModelForRole(roles);
  if (def && "manualModelId" in sel && sel.manualModelId === def.id) {
    return null;
  }
  return sel;
}

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

      // Store model selections normalized: null = not set / cascade to skill or platform default
      const voiceToStore = normalizeModelSelection(
        data.voiceModelSelection ?? null,
        ["tts"],
      );
      const sttModelSelectionToStore = normalizeModelSelection(
        data.sttModelSelection ?? null,
        ["stt"],
      );
      const visionBridgeModelSelectionToStore =
        data.visionBridgeModelSelection ?? null;
      const translationModelIdToStore =
        character && data.translationModelId === character.translationModelId
          ? null
          : (data.translationModelId ?? null);
      const imageGenModelSelectionToStore = normalizeModelSelection(
        data.imageGenModelSelection ?? null,
        ["image-gen"],
      );
      const musicGenModelSelectionToStore = data.musicGenModelSelection ?? null;
      const videoGenModelIdToStore =
        data.videoGenModelSelection?.selectionType ===
          ModelSelectionType.MANUAL && data.videoGenModelSelection.manualModelId
          ? data.videoGenModelSelection.manualModelId
          : null;
      const defaultChatModeToStore =
        character && data.defaultChatMode === character.defaultChatMode
          ? null
          : (data.defaultChatMode ?? null);

      // If a variantId is provided and no explicit model selection was provided,
      // resolve the variant's default modelSelection from the skill's variants.
      let modelSelectionToStore = data.modelSelection;
      if (!modelSelectionToStore && data.variantId && data.skillId) {
        const skillResult = await SkillsRepository.getSkillById(
          { id: data.skillId },
          user,
          logger,
          locale,
        );
        if (skillResult.success) {
          const variant = skillResult.data.variants.find(
            (v) => v.id === data.variantId,
          );
          if (variant) {
            modelSelectionToStore = variant.modelSelection ?? null;
          }
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
          voiceModelSelection: voiceToStore,
          sttModelSelection: sttModelSelectionToStore,
          visionBridgeModelSelection: visionBridgeModelSelectionToStore,
          translationModelId: translationModelIdToStore,
          imageGenModelSelection: imageGenModelSelectionToStore,
          musicGenModelSelection: musicGenModelSelectionToStore,
          videoGenModelId: videoGenModelIdToStore,
          defaultChatMode: defaultChatModeToStore,
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
