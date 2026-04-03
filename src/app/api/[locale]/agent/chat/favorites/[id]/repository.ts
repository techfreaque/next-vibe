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

import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import type {
  ImageGenModelSelection,
  SttModelSelection,
  VoiceModelSelection,
} from "@/app/api/[locale]/agent/models/types";
import { scopedTranslation as charactersScopedTranslation } from "../../skills/i18n";
import { SkillsRepository } from "../../skills/repository";
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
import type { FavoriteByIdT } from "./i18n";

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
    t: FavoriteByIdT,
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

      const characterResult = await SkillsRepository.getSkillById(
        { id: favorite.skillId },
        user,
        logger,
        locale,
      );

      if (!characterResult.success) {
        logger.error("Skill not found for favorite", {
          skillId: favorite.skillId,
          favoriteId: urlPathParams.id,
          userId,
        });
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const character = characterResult.data;

      // Build modelSelection response
      // If favorite has custom selection, return it; otherwise return null (use character defaults)
      // Normalize empty objects (legacy data) to null - they fail discriminated union validation
      const rawModelSelection = favorite.modelSelection;
      const modelSelection: FavoriteGetResponseOutput["modelSelection"] =
        rawModelSelection !== null &&
        rawModelSelection !== undefined &&
        "selectionType" in rawModelSelection
          ? rawModelSelection
          : null;

      // Resolve characterModelSelection from the specific variant via skill's variants list
      const variant = favorite.variantId
        ? character.variants?.find((v) => v.id === favorite.variantId)
        : character.variants?.[0];
      const characterModelSelection: FavoriteGetResponseOutput["characterModelSelection"] =
        variant?.modelSelection ?? null;

      // Merge customIcon with character icon (customIcon takes precedence)
      const displayIcon = favorite.customIcon ?? character?.icon ?? "bot";

      // Flattened response
      return success<FavoriteGetResponseOutput>({
        skillId: favorite.skillId,
        variantId: favorite.variantId ?? null,
        customVariantName: favorite.customVariantName ?? null,
        icon: displayIcon,
        name: character?.name ?? charactersT("skills.default.name"),
        tagline: character?.tagline ?? charactersT("skills.default.tagline"),
        description:
          character?.description ?? charactersT("skills.default.description"),
        voiceModelSelection: favorite.voiceModelSelection ?? null,
        sttModelSelection: favorite.sttModelSelection ?? undefined,
        imageVisionModelSelection:
          favorite.imageVisionModelSelection ?? undefined,
        videoVisionModelSelection:
          favorite.videoVisionModelSelection ?? undefined,
        audioVisionModelSelection:
          favorite.audioVisionModelSelection ?? undefined,
        translationModelId: favorite.translationModelId ?? undefined,
        imageGenModelSelection:
          favorite.imageGenModelSelection ??
          character?.imageGenModelSelection ??
          undefined,
        musicGenModelSelection:
          favorite.musicGenModelSelection ??
          character?.musicGenModelSelection ??
          undefined,
        videoGenModelSelection: favorite.videoGenModelId
          ? {
              selectionType: ModelSelectionType.MANUAL,
              manualModelId: favorite.videoGenModelId,
            }
          : undefined,
        defaultChatMode: favorite.defaultChatMode ?? undefined,
        modelSelection,
        characterModelSelection,
        compactTrigger: favorite.compactTrigger ?? null,
        availableTools: favorite.availableTools ?? null,
        pinnedTools: favorite.pinnedTools ?? null,
        deniedTools: favorite.deniedTools ?? null,
        promptAppend: favorite.promptAppend ?? null,
        memoryLimit: favorite.memoryLimit ?? null,
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
    t: FavoriteByIdT,
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

      // Validate skillId if provided
      if (data.skillId && data.skillId.trim() === "") {
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
      if (data.skillId ?? existing.skillId) {
        const characterResult = await SkillsRepository.getSkillById(
          { id: data.skillId ?? existing.skillId },
          user,
          logger,
          locale,
        );
        if (characterResult.success) {
          character = characterResult.data;
        }
      }

      // Only store customIcon if different from character default
      const customIconToStore =
        character && data.icon === character.icon ? null : data.icon;

      // Only store bridge models if different from character defaults (null = cascade to skill)
      // Also normalize against platform defaults: store null if value equals platform default
      const voiceModelSelectionToStore = normalizeTtsSelection(
        data.voiceModelSelection !== undefined
          ? data.voiceModelSelection
          : null,
      );
      const sttModelSelectionToStore = normalizeSttSelection(
        data.sttModelSelection !== undefined ? data.sttModelSelection : null,
      );
      const imageVisionModelSelectionToStore =
        data.imageVisionModelSelection !== undefined
          ? data.imageVisionModelSelection
          : null;
      const videoVisionModelSelectionToStore =
        data.videoVisionModelSelection !== undefined
          ? data.videoVisionModelSelection
          : null;
      const audioVisionModelSelectionToStore =
        data.audioVisionModelSelection !== undefined
          ? data.audioVisionModelSelection
          : null;
      const translationModelIdToStore =
        character && data.translationModelId === character.translationModelId
          ? null
          : (data.translationModelId ?? null);
      const imageGenModelSelectionToStore = normalizeImageGenSelection(
        data.imageGenModelSelection !== undefined
          ? data.imageGenModelSelection
          : null,
      );
      const musicGenModelSelectionToStore =
        data.musicGenModelSelection !== undefined
          ? data.musicGenModelSelection
          : null;
      const videoGenSel = data.videoGenModelSelection;
      const videoGenModelIdToStore =
        videoGenSel?.selectionType === ModelSelectionType.MANUAL
          ? (videoGenSel.manualModelId ?? null)
          : null;
      const defaultChatModeToStore =
        character && data.defaultChatMode === character.defaultChatMode
          ? null
          : (data.defaultChatMode ?? null);

      // Store modelSelection directly (null = use character defaults)
      const modelSelectionToStore = data.modelSelection;

      const [updated] = await db
        .update(chatFavorites)
        .set({
          skillId: data.skillId,
          customVariantName:
            data.customVariantName !== undefined
              ? data.customVariantName || null
              : undefined,
          customIcon: customIconToStore,
          voiceModelSelection: voiceModelSelectionToStore,
          sttModelSelection: sttModelSelectionToStore,
          imageVisionModelSelection: imageVisionModelSelectionToStore,
          videoVisionModelSelection: videoVisionModelSelectionToStore,
          audioVisionModelSelection: audioVisionModelSelectionToStore,
          translationModelId: translationModelIdToStore,
          imageGenModelSelection: imageGenModelSelectionToStore,
          musicGenModelSelection: musicGenModelSelectionToStore,
          videoGenModelId: videoGenModelIdToStore,
          defaultChatMode: defaultChatModeToStore,
          modelSelection: modelSelectionToStore,
          compactTrigger: data.compactTrigger ?? null,
          availableTools: data.availableTools ?? null,
          pinnedTools: data.pinnedTools ?? null,
          deniedTools: data.deniedTools ?? null,
          promptAppend: data.promptAppend ?? null,
          memoryLimit: data.memoryLimit !== undefined ? data.memoryLimit : null,
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
      const updatedSkillResult = await SkillsRepository.getSkillById(
        { id: updated.skillId },
        user,
        logger,
        locale,
      );

      const updatedSkill = updatedSkillResult.success
        ? updatedSkillResult.data
        : null;

      if (!updatedSkill) {
        logger.error("Skill not found after update", {
          skillId: updated.skillId,
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
    t: FavoriteByIdT,
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

      const deleted = result[0];
      return success({
        skillId: deleted.skillId,
        modelSelection: deleted.modelSelection,
        createdAt: deleted.createdAt,
        updatedAt: deleted.updatedAt,
      });
    } catch (error) {
      logger.error("Failed to delete favorite", parseError(error));
      return fail({
        message: t("delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
