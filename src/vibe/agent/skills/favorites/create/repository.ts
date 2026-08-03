/**
 * Favorites Create Repository
 * Database operations for creating new favorites
 */

import "server-only";

import { and, eq, max, sql } from "drizzle-orm";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "../../../image-generation/constants";
import type { ImageGenModelSelection } from "../../../image-generation/models";
import { DEFAULT_STT_MODEL_SELECTION } from "../../../speech-to-text/constants";
import type { SttModelSelection } from "../../../speech-to-text/models";
import { DEFAULT_TTS_MODEL_SELECTION } from "../../../text-to-speech/constants";
import type { VoiceModelSelection } from "../../../text-to-speech/models";
import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import type { RemoteEventHandlerProps } from "next-vibe/core/route/handler-realtime";
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
import { createEndpointEmitter } from "next-vibe/realtime/core/emitter";

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
    forcedSlug?: string,
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

      // Generate slug for this favorite — use the remote slug when relaying so
      // slugs stay identical across instances (required for cross-instance delete).
      let slug: string;
      if (forcedSlug) {
        slug = forcedSlug;
      } else {
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
        slug = ensureUniqueSlug(
          baseSlug || "favorite",
          existingSlugs.map((r) => r.slug),
        );
      }

      // Normalize skillId to its canonical slug form (never store UUIDs)
      const canonicalSkillId =
        await SkillsRepository.resolveCanonicalSkillId(resolvedSkillId);

      const insertValues = {
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
      } satisfies typeof chatFavorites.$inferInsert;

      // When relaying a remote create, the slug is forced to match the origin instance.
      // Use upsert so a pre-existing stale row with the same slug gets refreshed rather
      // than throwing a unique-constraint violation.
      const [favorite] = forcedSlug
        ? await db
            .insert(chatFavorites)
            .values(insertValues)
            .onConflictDoUpdate({
              target: [chatFavorites.userId, chatFavorites.slug],
              set: {
                skillId: insertValues.skillId,
                variantId: insertValues.variantId,
                customVariantName: insertValues.customVariantName,
                voiceModelSelection: insertValues.voiceModelSelection,
                sttModelSelection: insertValues.sttModelSelection,
                imageVisionModelSelection:
                  insertValues.imageVisionModelSelection,
                videoVisionModelSelection:
                  insertValues.videoVisionModelSelection,
                audioVisionModelSelection:
                  insertValues.audioVisionModelSelection,
                imageGenModelSelection: insertValues.imageGenModelSelection,
                musicGenModelSelection: insertValues.musicGenModelSelection,
                videoGenModelSelection: insertValues.videoGenModelSelection,
                modelSelection: insertValues.modelSelection,
                compactTrigger: insertValues.compactTrigger,
                availableTools: insertValues.availableTools,
                pinnedTools: insertValues.pinnedTools,
              },
            })
            .returning()
        : await db.insert(chatFavorites).values(insertValues).returning();

      if (!favorite) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Emit `favorite-created` on both endpoints:
      //  1. POST — triggers cross-instance relay (remoteEvent:true); the peer's
      //     onRemoteEvent applies the DB insert and emits on GET for its browser.
      //  2. GET  — updates the local browser's favorites list (GET is what the
      //     favorites page subscribes to via EndpointsPage).
      // Suppressed when applying a relayed create (avoids re-relay ping-pong).
      if (!relayed) {
        const mergedSkillId = formatSkillId(
          favorite.skillId,
          favorite.variantId ?? null,
        );
        const relayPayload = {
          responseData: { id: favorite.slug },
          requestData: {
            skillId: mergedSkillId,
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
        };
        // 1. Relay cross-instance via POST event
        createEndpointEmitter(
          createDefinitions.POST,
          logger,
          user,
        )("favorite-created", relayPayload);
        // 2. Local browser update via GET event
        const { default: favoritesListDef } = await import("../definition");
        createEndpointEmitter(favoritesListDef.GET, logger, user, {
          fanOut: false,
        })("favorite-created", {
          responseData: { id: favorite.slug },
          payload: {
            id: favorite.slug,
            skillId: mergedSkillId,
            customVariantName: favorite.customVariantName ?? null,
            icon: data.icon,
            voiceModelSelection: voiceToStore,
            modelSelection: modelSelectionToStore ?? null,
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
    responseData,
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
    // Use the remote slug so slugs stay identical across instances — cross-instance
    // deletes key on slug, so mismatched slugs would silently fail to remove the card.
    const remoteSlug = responseData?.id;
    const result = await this.createFavorite(
      requestData,
      user,
      logger,
      t,
      locale,
      true,
      remoteSlug,
    );
    if (!result.success) {
      logger.error("Failed to apply remote favorite create", {
        message: result.message,
      });
      return;
    }
    // Emit on the GET (list) endpoint — that's what the favorites page subscribes
    // to. The GET's `favorite-created` onEvent updates the browser list cache.
    // fanOut:false prevents re-relay (the POST already handled cross-instance relay).
    const { default: favoritesListDef } = await import("../definition");
    createEndpointEmitter(favoritesListDef.GET, logger, user, {
      fanOut: false,
    })("favorite-created", {
      payload: {
        skillId: requestData.skillId,
        customVariantName: requestData.customVariantName ?? null,
        icon: requestData.icon ?? undefined,
        voiceModelSelection: requestData.voiceModelSelection ?? null,
        modelSelection: requestData.modelSelection ?? null,
      },
      responseData: { id: result.data.id },
    });
  }
}
