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

import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import type { SttModelSelection } from "@/app/api/[locale]/agent/speech-to-text/models";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import { SkillsRepository } from "../../skills/repository";
import { chatFavorites } from "../db";
import type {
  FavoriteCreateRequestOutput,
  FavoriteCreateResponseOutput,
} from "./definition";
import type { FavoriteCreateT } from "./i18n";

function isSelectionEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function normalizeTtsSelection(
  sel: VoiceModelSelection | null,
): VoiceModelSelection | null {
  if (!sel) {
    return null;
  }
  if (isSelectionEqual(sel, DEFAULT_TTS_MODEL_SELECTION)) {
    return null;
  }
  return sel;
}

function normalizeSttSelection(
  sel: SttModelSelection | null,
): SttModelSelection | null {
  if (!sel) {
    return null;
  }
  if (isSelectionEqual(sel, DEFAULT_STT_MODEL_SELECTION)) {
    return null;
  }
  return sel;
}

function normalizeImageGenSelection(
  sel: ImageGenModelSelection | null,
): ImageGenModelSelection | null {
  if (!sel) {
    return null;
  }
  if (isSelectionEqual(sel, DEFAULT_IMAGE_GEN_MODEL_SELECTION)) {
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

      // Store model selections normalized: null = not set / cascade to skill variant or platform default
      let voiceToStore = normalizeTtsSelection(
        data.voiceModelSelection ?? null,
      );
      let sttModelSelectionToStore = normalizeSttSelection(
        data.sttModelSelection ?? null,
      );
      let imageVisionModelSelectionToStore =
        data.imageVisionModelSelection ?? null;
      let videoVisionModelSelectionToStore =
        data.videoVisionModelSelection ?? null;
      let audioVisionModelSelectionToStore =
        data.audioVisionModelSelection ?? null;

      let imageGenModelSelectionToStore = normalizeImageGenSelection(
        data.imageGenModelSelection ?? null,
      );
      let musicGenModelSelectionToStore = data.musicGenModelSelection ?? null;
      let videoGenModelSelectionToStore = data.videoGenModelSelection ?? null;
      let defaultChatModeToStore =
        character && data.defaultChatMode === character.defaultChatMode
          ? null
          : (data.defaultChatMode ?? null);

      // If a variantId is provided, resolve model selections from the variant.
      // Explicit fields from the request override variant defaults.
      let modelSelectionToStore = data.modelSelection;
      if (data.variantId && data.skillId) {
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
            if (!modelSelectionToStore) {
              modelSelectionToStore = variant.modelSelection ?? null;
            }
            // Seed per-modality selections from variant if not explicitly provided
            if (!voiceToStore && variant.voiceModelSelection) {
              voiceToStore = normalizeTtsSelection(variant.voiceModelSelection);
            }
            if (!sttModelSelectionToStore && variant.sttModelSelection) {
              sttModelSelectionToStore = normalizeSttSelection(
                variant.sttModelSelection,
              );
            }
            if (
              !imageVisionModelSelectionToStore &&
              variant.imageVisionModelSelection
            ) {
              imageVisionModelSelectionToStore =
                variant.imageVisionModelSelection;
            }
            if (
              !videoVisionModelSelectionToStore &&
              variant.videoVisionModelSelection
            ) {
              videoVisionModelSelectionToStore =
                variant.videoVisionModelSelection;
            }
            if (
              !audioVisionModelSelectionToStore &&
              variant.audioVisionModelSelection
            ) {
              audioVisionModelSelectionToStore =
                variant.audioVisionModelSelection;
            }
            if (
              !imageGenModelSelectionToStore &&
              variant.imageGenModelSelection
            ) {
              imageGenModelSelectionToStore = normalizeImageGenSelection(
                variant.imageGenModelSelection,
              );
            }
            if (
              !musicGenModelSelectionToStore &&
              variant.musicGenModelSelection
            ) {
              musicGenModelSelectionToStore = variant.musicGenModelSelection;
            }
            if (
              !videoGenModelSelectionToStore &&
              variant.videoGenModelSelection
            ) {
              videoGenModelSelectionToStore = variant.videoGenModelSelection;
            }
            if (!defaultChatModeToStore && variant.defaultChatMode) {
              defaultChatModeToStore = variant.defaultChatMode;
            }
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
          customVariantName: data.customVariantName || null,
          customIcon: null,
          voiceModelSelection: voiceToStore,
          sttModelSelection: sttModelSelectionToStore,
          imageVisionModelSelection: imageVisionModelSelectionToStore,
          videoVisionModelSelection: videoVisionModelSelectionToStore,
          audioVisionModelSelection: audioVisionModelSelectionToStore,
          imageGenModelSelection: imageGenModelSelectionToStore,
          musicGenModelSelection: musicGenModelSelectionToStore,
          videoGenModelSelection: videoGenModelSelectionToStore,
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
