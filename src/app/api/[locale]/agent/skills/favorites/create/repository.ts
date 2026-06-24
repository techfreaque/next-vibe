/**
 * Favorites Create Repository
 * Database operations for creating new favorites
 */

import "server-only";

import { and, eq, max, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import type { SttModelSelection } from "@/app/api/[locale]/agent/speech-to-text/models";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { RemoteEventHandlerProps } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

import {
  ensureUniqueSlug,
  formatSkillId,
  generateFavoriteSlug,
  parseSkillId,
} from "../../../chat/slugify";
import { DEFAULT_SKILLS } from "../../config";
import { SkillsRepository } from "../../repository";
import { chatFavorites } from "../db";
import createDefinitions, {
  type FavoriteCreateRequestOutput,
  type FavoriteCreateResponseOutput,
} from "./definition";
import { type FavoriteCreateT, scopedTranslation } from "./i18n";

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
   * Resolve the slug base to use for a skill in a favorite slug.
   * For default skills, use their config ID (e.g. "thea", "hermes").
   * For custom skills, the skillId is already the canonical slug - use it directly.
   */
  static resolveSkillSlug(skillId: string): string {
    // Default skills already have short IDs (e.g. "thea", "hermes", "default")
    const defaultSkill = DEFAULT_SKILLS.find((s) => s.id === skillId);
    if (defaultSkill) {
      return defaultSkill.id;
    }
    // Custom skill: skillId is already the canonical slug after resolveCanonicalSkillId
    if (skillId && skillId !== "favorite") {
      return skillId;
    }
    return "favorite";
  }
  /**
   * Create a new favorite
   */
  static async createFavorite(
    data: FavoriteCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: FavoriteCreateT,
    locale: CountryLanguage,
    relayed = false,
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

      // Parse merged "skillSlug__variantId" format into separate parts
      const { skillId: resolvedSkillId, variantId: parsedVariantId } =
        parseSkillId(data.skillId);
      const effectiveVariantId = parsedVariantId;

      // Get character to compare defaults
      let character = null;
      if (resolvedSkillId) {
        const characterResult = await SkillsRepository.getSkillById(
          { id: resolvedSkillId },
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
      // A favorite of a skill is a thin pointer: its PRIMARY chat model resolves
      // through the skill→variant cascade at read time (resolveFavorite). So a
      // chat selection that merely echoes the skill's (resolved) variant is
      // nulled here — the favorite stays a pointer and never freezes a stale
      // model. A genuinely-overriding selection is kept as provided.
      let modelSelectionToStore = data.modelSelection ?? null;
      if (modelSelectionToStore && character) {
        const skillVariant =
          (effectiveVariantId
            ? character.variants.find((v) => v.id === effectiveVariantId)
            : undefined) ??
          character.variants.find((v) => v.isDefault) ??
          character.variants[0];
        if (
          skillVariant?.modelSelection &&
          JSON.stringify(modelSelectionToStore) ===
            JSON.stringify(skillVariant.modelSelection)
        ) {
          modelSelectionToStore = null;
        }
      }
      if (effectiveVariantId && resolvedSkillId) {
        const skillResult = await SkillsRepository.getSkillById(
          { id: resolvedSkillId },
          user,
          logger,
          locale,
        );
        if (skillResult.success) {
          const variant = skillResult.data.variants.find(
            (v) => v.id === effectiveVariantId,
          );
          if (variant) {
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
          }
        }
      }

      // Get current max position using database aggregation
      const [maxPositionResult] = await db
        .select({ maxPosition: max(chatFavorites.position) })
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, userId));

      const nextPosition = (maxPositionResult?.maxPosition ?? -1) + 1;

      // Generate slug for this favorite
      const skillSlug =
        FavoritesCreateRepository.resolveSkillSlug(resolvedSkillId);
      const baseSlug = generateFavoriteSlug({
        customVariantName: data.customVariantName,
        skillSlug,
        variantId: effectiveVariantId,
      });
      // Ensure uniqueness within this user's favorites
      const existingSlugs = await db
        .select({ slug: chatFavorites.slug })
        .from(chatFavorites)
        .where(
          and(
            eq(chatFavorites.userId, userId),
            sql`${chatFavorites.slug} LIKE ${`${baseSlug}%`}`,
          ),
        );
      const slug = ensureUniqueSlug(
        baseSlug || "favorite",
        existingSlugs.map((r) => r.slug),
      );

      // Normalize skillId to its canonical slug form (never store UUIDs)
      const canonicalSkillId =
        await SkillsRepository.resolveCanonicalSkillId(resolvedSkillId);

      const [favorite] = await db
        .insert(chatFavorites)
        .values({
          userId,
          slug,
          skillId: canonicalSkillId,
          variantId: effectiveVariantId ?? null,
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

      // This op owns its `favorite-created` event. The payload is the request the
      // user submitted (requestFields) plus the new `id` (response field). Locally
      // its client onEvent rebuilds the card and patches the favorites list cache;
      // cross-instance (remoteEvent) the peer's route onRemoteEvent re-runs create.
      // Suppressed when applying a relayed create (avoids re-relay ping-pong).
      if (!relayed) {
        createEndpointEmitter(
          createDefinitions.POST,
          logger,
          user,
        )("favorite-created", {
          responseData: { id: favorite.slug },
          requestData: {
            skillId: formatSkillId(
              favorite.skillId,
              favorite.variantId ?? null,
            ),
            customVariantName: favorite.customVariantName ?? null,
            icon: data.icon,
            voiceModelSelection: voiceToStore,
            sttModelSelection: sttModelSelectionToStore,
            imageVisionModelSelection: imageVisionModelSelectionToStore,
            videoVisionModelSelection: videoVisionModelSelectionToStore,
            audioVisionModelSelection: audioVisionModelSelectionToStore,
            imageGenModelSelection: imageGenModelSelectionToStore,
            musicGenModelSelection: musicGenModelSelectionToStore,
            videoGenModelSelection: videoGenModelSelectionToStore,
            modelSelection: modelSelectionToStore ?? null,
            compactTrigger: data.compactTrigger ?? null,
            availableTools: data.availableTools ?? null,
            pinnedTools: data.pinnedTools ?? null,
          },
        });
      }

      return success({
        success: t("post.success.title"),
        id: favorite.slug,
      });
    } catch (error) {
      logger.error("Failed to create favorite", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Cross-instance applier for the `favorite-created` remote event. A peer relayed
   * the create request the user submitted (gated by syncScope["favorites"]); we
   * re-run the same create on this instance so the favorite exists everywhere. The
   * relayed `id` is informational — the slug is regenerated locally; each instance
   * owns its own ids. Reuses createFavorite so there is one create code path.
   */
  static async applyRemoteFavoriteCreate({
    requestData,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof createDefinitions.POST,
    "favorite-created"
  >): Promise<void> {
    // Server-to-server apply has no request locale; error strings here are only
    // logged, so the platform default locale is fine.
    const locale = defaultLocale;
    const { t } = scopedTranslation.scopedT(locale);
    // The relayed `id` is informational — lives on responseData (responseFields).
    // requestData IS the create request without the id.
    const result = await this.createFavorite(
      requestData,
      user,
      logger,
      t,
      locale,
      true,
    );
    if (!result.success) {
      logger.error("Failed to apply remote favorite create", {
        message: result.message,
      });
      return;
    }
    createEndpointEmitter(createDefinitions.POST, logger, user, {
      fanOut: false,
    })("favorite-created", {
      requestData,
      responseData: { id: result.data.id },
    });
  }
}
