/**
 * Single Favorite Repository
 * Database operations for individual favorite management
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import type { RemoteEventHandlerProps } from "next-vibe/core/route/handler";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/emitter";

import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import type { SttModelSelection } from "@/app/api/[locale]/agent/speech-to-text/models";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";

import {
  ensureUniqueSlug,
  formatSkillId,
  generateFavoriteSlug,
  isSkillVariantId,
  isUuid,
  parseSkillId,
} from "../../../chat/slugify";
import { scopedTranslation as charactersScopedTranslation } from "../../i18n";
import { SkillsRepository } from "../../repository";
import { FavoritesCreateRepository } from "../create/repository";
import { chatFavorites } from "../db";
import { ChatFavoritesRepository } from "../repository";
import favoriteByIdDefinitions, {
  type FavoriteDeleteResponseOutput,
  type FavoriteDeleteUrlVariablesOutput,
  type FavoriteGetResponseOutput,
  type FavoriteGetUrlVariablesOutput,
  type FavoriteUpdateRequestOutput,
  type FavoriteUpdateResponseOutput,
  type FavoriteUpdateUrlVariablesOutput,
} from "./definition";
import { type FavoriteByIdT, scopedTranslation } from "./i18n";

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
   * Resolve a favorite by slug, UUID, or merged skillSlug__variantId within a user's favorites.
   *
   * Supported formats:
   *   - UUID: direct DB id lookup
   *   - "thea-brilliant": favorite's own slug lookup
   *   - "thea__brilliant": look up by skillId+variantId (merged skill format)
   *   - "thea": look up by skillId with null variantId
   */
  static resolveFavoriteCondition(
    favoriteId: string,
    userId: string,
  ): ReturnType<typeof and> {
    if (isUuid(favoriteId)) {
      return and(
        eq(chatFavorites.id, favoriteId),
        eq(chatFavorites.userId, userId),
      );
    }
    // Merged "skillSlug__variantId" format - look up by the skill identity
    if (isSkillVariantId(favoriteId)) {
      const { skillId, variantId } = parseSkillId(favoriteId);
      return and(
        eq(chatFavorites.skillId, skillId),
        variantId !== null
          ? eq(chatFavorites.variantId, variantId)
          : sql`${chatFavorites.variantId} IS NULL`,
        eq(chatFavorites.userId, userId),
      );
    }
    // Plain slug - favorite's own slug
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
        : (character.variants?.find((v) => v.isDefault) ??
          character.variants?.[0] ??
          null);
      const characterModelSelection: FavoriteGetResponseOutput["characterModelSelection"] =
        variant?.modelSelection ?? null;

      // Merge customIcon with character icon (customIcon takes precedence)
      const displayIcon = favorite.customIcon ?? character?.icon ?? "bot";

      // Normalize skillId to canonical slug (legacy rows may store UUIDs)
      const canonicalSkillId = await SkillsRepository.resolveCanonicalSkillId(
        favorite.skillId,
      );

      // Flattened response
      return success<FavoriteGetResponseOutput>({
        skillId: formatSkillId(canonicalSkillId, favorite.variantId ?? null),
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
          variant?.imageGenModelSelection ??
          undefined,
        musicGenModelSelection:
          favorite.musicGenModelSelection ??
          variant?.musicGenModelSelection ??
          undefined,
        videoGenModelSelection: favorite.videoGenModelSelection ?? undefined,
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
    relayed = false,
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
      // undefined means "not provided" → omit from UPDATE (keep existing value in DB).
      const voiceModelSelectionToStore =
        data.voiceModelSelection !== undefined
          ? normalizeTtsSelection(data.voiceModelSelection)
          : undefined;
      const sttModelSelectionToStore =
        data.sttModelSelection !== undefined
          ? normalizeSttSelection(data.sttModelSelection)
          : undefined;
      const imageVisionModelSelectionToStore =
        data.imageVisionModelSelection !== undefined
          ? data.imageVisionModelSelection
          : undefined;
      const videoVisionModelSelectionToStore =
        data.videoVisionModelSelection !== undefined
          ? data.videoVisionModelSelection
          : undefined;
      const audioVisionModelSelectionToStore =
        data.audioVisionModelSelection !== undefined
          ? data.audioVisionModelSelection
          : undefined;
      const imageGenModelSelectionToStore =
        data.imageGenModelSelection !== undefined
          ? normalizeImageGenSelection(data.imageGenModelSelection)
          : undefined;
      const musicGenModelSelectionToStore =
        data.musicGenModelSelection !== undefined
          ? data.musicGenModelSelection
          : undefined;
      const videoGenModelSelectionToStore =
        data.videoGenModelSelection !== undefined
          ? data.videoGenModelSelection
          : undefined;
      // Store modelSelection directly (null = use character defaults)
      const modelSelectionToStore = data.modelSelection;

      // Regenerate slug if skill, variant, or customVariantName changed
      // Parse merged "skillSlug__variantId" format if provided
      const { skillId: parsedSkillId, variantId: parsedVariantId } =
        data.skillId
          ? parseSkillId(data.skillId)
          : { skillId: undefined, variantId: null };
      const newSkillId = parsedSkillId ?? existing.skillId;
      const newVariantId =
        parsedVariantId !== null
          ? parsedVariantId
          : data.skillId !== undefined
            ? existing.variantId // skillId was provided but no variant part - keep existing variantId
            : existing.variantId;
      const newCustomVariantName =
        data.customVariantName !== undefined
          ? data.customVariantName || null
          : existing.customVariantName;

      // Normalize skillId to its canonical slug form (never store UUIDs)
      const canonicalNewSkillId =
        await SkillsRepository.resolveCanonicalSkillId(newSkillId);

      let slugUpdate: string | undefined;
      if (
        canonicalNewSkillId !== existing.skillId ||
        newVariantId !== existing.variantId ||
        newCustomVariantName !== existing.customVariantName
      ) {
        const skillSlug =
          FavoritesCreateRepository.resolveSkillSlug(canonicalNewSkillId);
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
          skillId: parsedSkillId ? canonicalNewSkillId : undefined,
          variantId: data.skillId !== undefined ? newVariantId : undefined,
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
          modelSelection: modelSelectionToStore,
          compactTrigger: data.compactTrigger ?? null,
          ...(data.availableTools !== undefined
            ? { availableTools: data.availableTools }
            : {}),
          ...(data.pinnedTools !== undefined
            ? { pinnedTools: data.pinnedTools }
            : {}),
          ...(data.deniedTools !== undefined
            ? { deniedTools: data.deniedTools }
            : {}),
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

      // This op owns its `favorite-updated` event: the edit config the user
      // submitted plus the favorite id (requestFields). Locally its client onEvent
      // rebuilds the card and patches the list cache; cross-instance (remoteEvent)
      // the peer re-applies the edit. Suppressed when applying a relayed edit.
      if (!relayed) {
        createEndpointEmitter(
          favoriteByIdDefinitions.PATCH,
          logger,
          user,
        )("favorite-updated", {
          urlPathParams: { id: updated.slug || updated.id },
          requestData: {
            skillId: formatSkillId(
              await SkillsRepository.resolveCanonicalSkillId(updated.skillId),
              updated.variantId ?? null,
            ),
            customVariantName: updated.customVariantName ?? null,
            icon: data.icon,
            voiceModelSelection: updated.voiceModelSelection ?? null,
            sttModelSelection: updated.sttModelSelection ?? null,
            imageVisionModelSelection:
              updated.imageVisionModelSelection ?? null,
            videoVisionModelSelection:
              updated.videoVisionModelSelection ?? null,
            audioVisionModelSelection:
              updated.audioVisionModelSelection ?? null,
            imageGenModelSelection: updated.imageGenModelSelection ?? null,
            musicGenModelSelection: updated.musicGenModelSelection ?? null,
            videoGenModelSelection: updated.videoGenModelSelection ?? null,
            modelSelection: updated.modelSelection ?? null,
            compactTrigger: updated.compactTrigger ?? null,
            availableTools: updated.availableTools ?? null,
            pinnedTools: updated.pinnedTools ?? null,
            deniedTools: updated.deniedTools ?? null,
            promptAppend: updated.promptAppend ?? null,
            memoryLimit: updated.memoryLimit ?? null,
          },
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
      const deletedId = deleted.slug || deleted.id;

      // This op owns its `favorite-deleted` event, carrying the deleted id.
      // Locally its client onEvent removes the row from the list cache;
      // cross-instance (remoteEvent) the peer's onRemoteEvent removes it by id.
      createEndpointEmitter(
        favoriteByIdDefinitions.DELETE,
        logger,
        user,
      )("favorite-deleted", { urlPathParams: { id: deletedId } });

      return success({
        skillId: await SkillsRepository.resolveCanonicalSkillId(
          deleted.skillId,
        ),
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

  /**
   * Cross-instance applier for the `favorite-updated` remote event. A peer relayed
   * the edit the user submitted (gated by syncScope["favorites"]); re-run the same
   * update here so the favorite matches everywhere. Reuses updateFavorite so there
   * is one update code path. Server-to-server apply has no request locale; error
   * strings are only logged, so the platform default locale is fine.
   */
  static async applyRemoteFavoriteUpdate({
    requestData,
    urlPathParams,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof favoriteByIdDefinitions.PATCH,
    "favorite-updated"
  >): Promise<void> {
    const locale = defaultLocale;
    const { t } = scopedTranslation.scopedT(locale);
    const result = await this.updateFavorite(
      requestData,
      { id: urlPathParams.id },
      user,
      logger,
      t,
      locale,
      true,
    );
    if (!result.success) {
      logger.error("Failed to apply remote favorite update", {
        message: result.message,
      });
      return;
    }
    createEndpointEmitter(favoriteByIdDefinitions.PATCH, logger, user, {
      fanOut: false,
    })("favorite-updated", {
      urlPathParams: { id: urlPathParams.id },
      requestData,
    });
  }

  /**
   * Cross-instance applier for the `favorite-deleted` remote event. A peer relayed
   * a delete (gated by syncScope["favorites"]); remove the favorite here, keyed by
   * the slug on the event's urlPathParams, scoped to the user. The event is a
   * side-effect event (a delete has no request body), so `payload` is empty.
   */
  static async applyRemoteFavoriteDelete({
    urlPathParams,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof favoriteByIdDefinitions.DELETE,
    "favorite-deleted"
  >): Promise<void> {
    await ChatFavoritesRepository.applyRemoteFavoriteDelete(
      [{ id: urlPathParams.id }],
      user.id,
      logger,
    );
    createEndpointEmitter(favoriteByIdDefinitions.DELETE, logger, user, {
      fanOut: false,
    })("favorite-deleted", {
      urlPathParams: { id: urlPathParams.id },
    });
  }
}
