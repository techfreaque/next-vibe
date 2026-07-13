/**
 * Modality Resolver
 * Resolves bridge models via cascade: favorite → skill → system default
 */
import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  DEFAULT_AUDIO_VISION_MODEL_SELECTION,
  DEFAULT_IMAGE_VISION_MODEL_SELECTION,
  DEFAULT_VIDEO_VISION_MODEL_SELECTION,
} from "@/app/api/[locale]/agent/ai-stream/constants";
import {
  type ChatModelId,
  getBestChatModel,
} from "@/app/api/[locale]/agent/ai-stream/models";
import type { AiStreamT } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import {
  type AudioVisionModelId,
  type AudioVisionModelOption,
  getBestAudioVisionModel,
  getBestImageVisionModel,
  getBestVideoVisionModel,
  type ImageVisionModelId,
  type ImageVisionModelOption,
  type VideoVisionModelId,
  type VideoVisionModelOption,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { parseSkillId } from "@/app/api/[locale]/agent/chat/slugify";
import {
  type AgentEnvAvailability,
  getInstanceAvailability,
} from "@/app/api/[locale]/agent/env-availability";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";
import { DEFAULT_MUSIC_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/music-generation/constants";
import type { MusicGenModelSelection } from "@/app/api/[locale]/agent/music-generation/models";
import type { SkillVariant } from "@/app/api/[locale]/agent/skills/config";
import { NO_SKILL_ID } from "@/app/api/[locale]/agent/skills/constants";
import type {
  ChatFavorite,
  FavoriteConfig,
} from "@/app/api/[locale]/agent/skills/favorites/db";
import { buildFavoriteConfig } from "@/app/api/[locale]/agent/skills/favorites/repository";
import {
  resolveFavorite,
  resolveSkillVariant,
} from "@/app/api/[locale]/agent/skills/resolver";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import {
  getBestSttModel,
  type SttModelId,
  type SttModelOption,
} from "@/app/api/[locale]/agent/speech-to-text/models";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import {
  type TtsModelId,
  type VoiceModelSelection,
} from "@/app/api/[locale]/agent/text-to-speech/models";
import { DEFAULT_VIDEO_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/video-generation/constants";
import type { VideoGenModelSelection } from "@/app/api/[locale]/agent/video-generation/models";

/**
 * Fields read from an active skill variant for bridge model resolution.
 * All modality fields use ModelSelection types (same as favorites).
 * Resolved from the active SkillVariant at runtime by stream-setup.
 * modelSelection is optional: custom skills without a matched variant have no model selection.
 */
export type BridgeSkill = Partial<Pick<SkillVariant, "modelSelection">> &
  Pick<
    SkillVariant,
    | "voiceModelSelection"
    | "sttModelSelection"
    | "imageVisionModelSelection"
    | "videoVisionModelSelection"
    | "audioVisionModelSelection"
    | "imageGenModelSelection"
    | "musicGenModelSelection"
    | "videoGenModelSelection"
  >;

/** Fields read from favorite DB row for bridge model resolution (DB uses ModelSelectionSimple JSONB) */
export type BridgeFavorite = Pick<
  ChatFavorite,
  | "skillId"
  | "voiceModelSelection"
  | "sttModelSelection"
  | "imageVisionModelSelection"
  | "videoVisionModelSelection"
  | "audioVisionModelSelection"
  | "imageGenModelSelection"
  | "musicGenModelSelection"
  | "videoGenModelSelection"
>;

export interface BridgeContext {
  skill: BridgeSkill | null;
  favorite: BridgeFavorite | null;
}

export interface MessageVariant {
  modality: Modality;
  content: string; // text content or storage URL
  modelId:
    | ChatModelId
    | SttModelId
    | TtsModelId
    | ImageVisionModelId
    | VideoVisionModelId
    | AudioVisionModelId;
  creditCost?: number;
  createdAt: string; // ISO timestamp
  bridgeType?: BridgeType; // set for gap-fill variants so the UI can pick the right label/icon
}

export type BridgeType = "stt" | "vision" | "translation" | "tts";

/**
 * Resolve the chat model ID from already-loaded favorite + skill data.
 * Priority: favorite.modelSelection → skill variant.modelSelection → null.
 * without it being pre-computed on streamContext.
 */
/**
 * Resolve chat model ID from already-loaded favorite config and skill variant.
 * No DB access - callers must resolve favorite/skill data before calling.
 * Cascade: favorite.modelSelection → skillVariant.modelSelection → null.
 */
export function resolveChatModelId(
  favoriteModelSelection: ChatFavorite["modelSelection"] | undefined,
  skillVariantModelSelection: SkillVariant["modelSelection"] | undefined,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelId | null {
  // Try favorite's modelSelection first
  if (favoriteModelSelection) {
    const best = getBestChatModel(favoriteModelSelection, user, availability);
    if (best) {
      return best.id;
    }
  }

  // Fall back to skill variant's modelSelection
  if (skillVariantModelSelection) {
    const best = getBestChatModel(
      skillVariantModelSelection,
      user,
      availability,
    );
    if (best) {
      return best.id;
    }
  }

  return null;
}

/**
 * THE canonical model+skill resolver for every AI-stream entry (interactive,
 * ai-run, revival, task-completion). Callers must supply EXACTLY ONE source:
 *
 *   1. Explicit `model` (+ `skill`, defaulting to NO_SKILL_ID) — the frontend
 *      path: the client already resolved its model, so pass it through.
 *   2. A favorite (`favoriteId` or a pre-loaded `favoriteConfig`) — resolves the
 *      model from the favorite's modelSelection, falling back to its skill
 *      variant's model; the skill is the favorite's skillId.
 *   3. A skill variant id alone (`skill`) — resolves the model from that
 *      variant's modelSelection.
 *
 * Passing an explicit `model` together with a favorite/skill-variant source is
 * ambiguous (two model sources) → error. Passing none → error. Exactly one wins.
 */
export async function resolveModelSkill(params: {
  model: ChatModelId | undefined;
  /** Source 1: skill ID (no variant) accompanying an explicit model.
   *  Source 3: a skill-VARIANT id used ALONE to resolve the model. */
  skill: string | undefined;
  favoriteId: string | undefined;
  favoriteConfig: FavoriteConfig | null;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  t: AiStreamT;
}): Promise<
  ResponseType<{
    model: ChatModelId;
    skill: string;
    favoriteConfig: FavoriteConfig | null;
  }>
> {
  const { model, skill, favoriteId, favoriteConfig, user, locale, logger, t } =
    params;

  // ── Exclusivity guard: EXACTLY ONE *model source*. The three sources are
  //   1. explicit `model` (+ its own `skill` id),
  //   2. `favoriteId` (resolve the model from that favorite),
  //   3. a `skill` variant id ALONE.
  // These three are mutually exclusive: model+favoriteId, favoriteId+skill, and
  // model+skill(as a variant) are all ambiguous. NOTE: `favoriteConfig` is NOT a
  // model source here — it is downstream context (tools/prompt) that a caller may
  // pass alongside an explicit `model`; only `favoriteId` triggers favorite-based
  // resolution. (A pre-loaded favoriteConfig with NO favoriteId/model/skill is the
  // sub-agent override path — handled as a resolution fallback below.)
  const modelSources = [
    Boolean(model),
    Boolean(favoriteId),
    Boolean(skill) && !model,
  ].filter(Boolean).length;
  if (modelSources > 1) {
    logger.error(
      "[resolveModelSkill] Ambiguous — more than one model source provided",
      { model, skill, favoriteId },
    );
    return fail({
      message: t("headless.errors.ambiguousModel"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
  }

  // ── 1. Explicit model + its skill id (frontend already resolved both).
  // favoriteConfig rides through untouched as downstream context.
  if (model) {
    return success({
      model,
      skill: skill ?? NO_SKILL_ID,
      favoriteConfig,
    });
  }

  const availability = await getInstanceAvailability();

  // ── 2. Favorite → model (favorite modelSelection, skill-variant fallback) ─
  {
    if (favoriteId && !user.isPublic && user.id) {
      const resolved = await resolveFavorite(
        favoriteId,
        user.id,
        user,
        logger,
        locale,
      );
      if (!resolved) {
        return fail({
          message: t("headless.errors.favoriteNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      return success({
        model: resolved.model,
        skill: resolved.skill,
        favoriteConfig: resolved.favoriteConfig,
      });
    }
    if (favoriteConfig) {
      const skillVariant = await resolveSkillVariant(
        undefined,
        // Prefer the favorite's own variantId column; fall back to a variant
        // merged into its skillId. A bare (config-loaded) skillId carries no
        // variant, so parsing alone picked the skill's DEFAULT variant.
        favoriteConfig.variantId ??
          parseSkillId(favoriteConfig.skillId).variantId,
      );
      const resolvedModel = resolveChatModelId(
        favoriteConfig.modelSelection ?? undefined,
        skillVariant?.modelSelection ?? undefined,
        user,
        availability,
      );
      if (resolvedModel) {
        return success({
          model: resolvedModel,
          skill: favoriteConfig.skillId,
          favoriteConfig,
        });
      }
    }
  }

  // ── 3. Skill variant id alone → its model + a skill-derived favoriteConfig.
  // The favoriteConfig is resolved FROM the skill (not passed) so downstream
  // setup gets the skill's identity for its tool/model cascades.
  if (skill) {
    const skillVariant = await resolveSkillVariant(skill, null);
    const resolvedModel = resolveChatModelId(
      undefined,
      skillVariant?.modelSelection ?? undefined,
      user,
      availability,
    );
    if (resolvedModel) {
      return success({
        model: resolvedModel,
        skill,
        favoriteConfig: buildFavoriteConfig({ id: skill, skillId: skill }),
      });
    }
  }

  // ── None resolvable ────────────────────────────────────────────────────
  logger.error(
    "[resolveModelSkill] No model could be resolved — need model, favorite, or skill",
    { hasModel: Boolean(model), favoriteId, skill },
  );
  return fail({
    message: t("headless.errors.missingModelOrSkill"),
    errorType: ErrorResponseTypes.VALIDATION_ERROR,
  });
}

export class ModalityResolver {
  /**
   * Cascade: favorite → skill (selection) → system default
   * Used by bridge models (STT, TTS, vision).
   */
  private static cascadeBridgeModel<TSelection, TOption>(
    favoriteSelection: TSelection | null | undefined,
    skillSelection: TSelection | null | undefined,
    defaultSelection: TSelection,
    getBest: (
      sel: TSelection,
      user: JwtPayloadType,
      availability: AgentEnvAvailability,
    ) => TOption | null,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): TOption | null {
    const fromFavorite = favoriteSelection
      ? getBest(favoriteSelection, user, availability)
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }

    const fromSkill = skillSelection
      ? getBest(skillSelection, user, availability)
      : null;
    if (fromSkill) {
      return fromSkill;
    }

    return getBest(defaultSelection, user, availability);
  }

  /** Resolve STT model: favorite → skill variant → system default */
  static resolveSttModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): SttModelOption | null {
    return this.cascadeBridgeModel(
      ctx.favorite?.sttModelSelection,
      ctx.skill?.sttModelSelection,
      DEFAULT_STT_MODEL_SELECTION,
      (sel, u, avail) => getBestSttModel(sel, u, avail),
      user,
      availability,
    );
  }

  /** Resolve image vision model: favorite → skill variant → system default */
  static resolveImageVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): ImageVisionModelOption | null {
    return this.cascadeBridgeModel(
      ctx.favorite?.imageVisionModelSelection,
      ctx.skill?.imageVisionModelSelection,
      DEFAULT_IMAGE_VISION_MODEL_SELECTION,
      (sel, u, avail) => getBestImageVisionModel(sel, u, avail),
      user,
      availability,
    );
  }

  /** Resolve video vision model: favorite → skill variant → system default */
  static resolveVideoVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): VideoVisionModelOption | null {
    return this.cascadeBridgeModel(
      ctx.favorite?.videoVisionModelSelection,
      ctx.skill?.videoVisionModelSelection,
      DEFAULT_VIDEO_VISION_MODEL_SELECTION,
      (sel, u, avail) => getBestVideoVisionModel(sel, u, avail),
      user,
      availability,
    );
  }

  /** Resolve audio vision model: favorite → skill variant → system default */
  static resolveAudioVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): AudioVisionModelOption | null {
    return this.cascadeBridgeModel(
      ctx.favorite?.audioVisionModelSelection,
      ctx.skill?.audioVisionModelSelection,
      DEFAULT_AUDIO_VISION_MODEL_SELECTION,
      (sel, u, avail) => getBestAudioVisionModel(sel, u, avail),
      user,
      availability,
    );
  }

  /**
   * Resolve TTS model selection via cascade without resolving to a model.
   * Priority (bridge): favorite → skill → clientVoiceModelId → default.
   * Pass `clientVoiceModelId` when the request carries an explicit voice preference.
   */
  /** Resolve the TTS voice selection: favorite → skill → system default. */
  static resolveTtsSelection(ctx: BridgeContext): VoiceModelSelection {
    return (
      ctx.favorite?.voiceModelSelection ??
      ctx.skill?.voiceModelSelection ??
      DEFAULT_TTS_MODEL_SELECTION
    );
  }

  /** Resolve image gen selection via cascade without resolving to a model (favorite → skill → default). */
  static resolveImageGenSelection(ctx: BridgeContext): ImageGenModelSelection {
    return (
      ctx.favorite?.imageGenModelSelection ??
      ctx.skill?.imageGenModelSelection ??
      DEFAULT_IMAGE_GEN_MODEL_SELECTION
    );
  }

  /** Resolve music gen selection via cascade without resolving to a model (favorite → skill → default). */
  static resolveMusicGenSelection(ctx: BridgeContext): MusicGenModelSelection {
    return (
      ctx.favorite?.musicGenModelSelection ??
      ctx.skill?.musicGenModelSelection ??
      DEFAULT_MUSIC_GEN_MODEL_SELECTION
    );
  }

  /** Resolve video gen selection via cascade without resolving to a model (favorite → skill → default). */
  static resolveVideoGenSelection(ctx: BridgeContext): VideoGenModelSelection {
    return (
      ctx.favorite?.videoGenModelSelection ??
      ctx.skill?.videoGenModelSelection ??
      DEFAULT_VIDEO_GEN_MODEL_SELECTION
    );
  }
}
