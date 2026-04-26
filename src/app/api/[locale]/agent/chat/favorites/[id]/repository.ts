/**
 * Single Favorite Repository
 * Database operations for individual favorite management
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/endpoint-emitter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import type { SttModelSelection } from "@/app/api/[locale]/agent/speech-to-text/models";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import favoritesDefinitions from "../definition";
import { ensureUniqueSlug, generateFavoriteSlug, isUuid } from "../../slugify";
import { scopedTranslation as charactersScopedTranslation } from "../../skills/i18n";
import { FavoritesCreateRepository } from "../create/repository";
import { SkillsRepository } from "../../skills/repository";
import { chatFavorites } from "../db";
import { ChatFavoritesRepositoryClient } from "../repository-client";
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
   * Resolve a favorite by slug or UUID within a user's favorites.
   */
  private static resolveFavoriteCondition(
    favoriteId: string,
    userId: string,
  ): ReturnType<typeof and> {
    if (isUuid(favoriteId)) {
      return and(
        eq(chatFavorites.id, favoriteId),
        eq(chatFavorites.userId, userId),
      );
    }
    return and(
      eq(chatFavorites.slug, favoriteId),
      eq(chatFavorites.userId, userId),
    );
  }

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
          SingleFavoriteRepository.resolveFavoriteCondition(
            urlPathParams.id,
            userId,
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
        imageGenModelSelection:
          favorite.imageGenModelSelection ??
          character?.imageGenModelSelection ??
          undefined,
        musicGenModelSelection:
          favorite.musicGenModelSelection ??
          character?.musicGenModelSelection ??
          undefined,
        videoGenModelSelection: favorite.videoGenModelSelection ?? undefined,
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

      // First, get the existing favorite (resolve by slug or UUID)
      const [existing] = await db
        .select()
        .from(chatFavorites)
        .where(
          SingleFavoriteRepository.resolveFavoriteCondition(favoriteId, userId),
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
      const imageGenModelSelectionToStore = normalizeImageGenSelection(
        data.imageGenModelSelection !== undefined
          ? data.imageGenModelSelection
          : null,
      );
      const musicGenModelSelectionToStore =
        data.musicGenModelSelection !== undefined
          ? data.musicGenModelSelection
          : null;
      const videoGenModelSelectionToStore = data.videoGenModelSelection ?? null;
      const defaultChatModeToStore =
        character && data.defaultChatMode === character.defaultChatMode
          ? null
          : (data.defaultChatMode ?? null);

      // Store modelSelection directly (null = use character defaults)
      const modelSelectionToStore = data.modelSelection;

      // Regenerate slug if skill, variant, or customVariantName changed
      const newSkillId = data.skillId ?? existing.skillId;
      const newVariantId =
        data.variantId !== undefined
          ? data.variantId || null
          : existing.variantId;
      const newCustomVariantName =
        data.customVariantName !== undefined
          ? data.customVariantName || null
          : existing.customVariantName;

      let slugUpdate: string | undefined;
      if (
        newSkillId !== existing.skillId ||
        newVariantId !== existing.variantId ||
        newCustomVariantName !== existing.customVariantName
      ) {
        const skillSlug = FavoritesCreateRepository.resolveSkillSlug(
          newSkillId,
          character?.name ?? null,
        );
        const baseSlug = generateFavoriteSlug({
          customVariantName: newCustomVariantName,
          skillSlug,
          variantId: newVariantId,
        });
        const existingSlugs = await db
          .select({ slug: chatFavorites.slug })
          .from(chatFavorites)
          .where(
            and(
              eq(chatFavorites.userId, userId),
              sql`${chatFavorites.slug} LIKE ${`${baseSlug}%`}`,
              // Exclude the current favorite from collision check
              sql`${chatFavorites.id} != ${existing.id}`,
            ),
          );
        slugUpdate = ensureUniqueSlug(
          baseSlug || "favorite",
          existingSlugs.map((r) => r.slug),
        );
      }

      const [updated] = await db
        .update(chatFavorites)
        .set({
          ...(slugUpdate !== undefined ? { slug: slugUpdate } : {}),
          skillId: data.skillId,
          variantId:
            data.variantId !== undefined ? data.variantId || null : undefined,
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
          imageGenModelSelection: imageGenModelSelectionToStore,
          musicGenModelSelection: musicGenModelSelectionToStore,
          videoGenModelSelection: videoGenModelSelectionToStore,
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
            eq(chatFavorites.id, existing.id),
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

      // Emit WS event — push full computed FavoriteCard so all tabs update immediately
      const emitFavorites = createEndpointEmitter(
        favoritesDefinitions.GET,
        logger,
        user,
      );
      const variantForDisplay = updated.variantId
        ? updatedSkill?.variants?.find((v) => v.id === updated.variantId)
        : (updatedSkill?.variants?.find((v) => v.isDefault) ??
          updatedSkill?.variants?.[0] ??
          null);
      const updatedFavoriteCard =
        ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
          {
            id: updated.slug || updated.id,
            skillId: updated.skillId,
            variantId: updated.variantId ?? null,
            customVariantName: updated.customVariantName ?? null,
            customIcon: updated.customIcon,
            voiceModelSelection: updated.voiceModelSelection ?? null,
            modelSelection: updated.modelSelection,
            position: updated.position,
          },
          variantForDisplay?.modelSelection ??
            updatedSkill?.variants?.[0]?.modelSelection ??
            null,
          updatedSkill?.icon ?? null,
          updatedSkill?.name ?? null,
          updatedSkill?.tagline ?? null,
          updatedSkill?.description ?? null,
          null,
          updatedSkill?.voiceModelSelection ?? null,
          locale,
          user,
        );
      emitFavorites("favorite-updated", { favorites: [updatedFavoriteCard] });

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
          SingleFavoriteRepository.resolveFavoriteCondition(
            urlPathParams.id,
            userId,
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

      // Emit WS event — remove from favorites list in all open tabs immediately
      const emitFavorites = createEndpointEmitter(
        favoritesDefinitions.GET,
        logger,
        user,
      );
      emitFavorites("favorite-deleted", {
        favorites: [{ id: deleted.slug || deleted.id }],
      });

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
