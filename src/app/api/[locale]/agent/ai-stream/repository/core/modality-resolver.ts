/**
 * Modality Resolver
 * Resolves bridge models via cascade: favorite → skill → system default
 */
import "server-only";

import {
  DEFAULT_AUDIO_VISION_MODEL_SELECTION,
  DEFAULT_IMAGE_VISION_MODEL_SELECTION,
  DEFAULT_VIDEO_VISION_MODEL_SELECTION,
} from "@/app/api/[locale]/agent/ai-stream/constants";
import {
  type ChatModelId,
  type ChatModelOption,
  getBestChatModel,
} from "@/app/api/[locale]/agent/ai-stream/models";
import {
  getBestAudioVisionModel,
  getBestImageVisionModel,
  getBestVideoVisionModel,
  type AudioVisionModelId,
  type AudioVisionModelOption,
  type ImageVisionModelId,
  type ImageVisionModelOption,
  type VideoVisionModelId,
  type VideoVisionModelOption,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import type { ChatFavorite } from "@/app/api/[locale]/agent/chat/favorites/db";
import type { SkillVariant } from "@/app/api/[locale]/agent/chat/skills/config";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import {
  getBestImageGenModel,
  type ImageGenModelOption,
  type ImageGenModelSelection,
} from "@/app/api/[locale]/agent/image-generation/models";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";
import { type ApiProvider } from "@/app/api/[locale]/agent/models/models";
import { DEFAULT_MUSIC_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/music-generation/constants";
import {
  getBestMusicGenModel,
  type MusicGenModelOption,
  type MusicGenModelSelection,
} from "@/app/api/[locale]/agent/music-generation/models";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import {
  getBestSttModel,
  type SttModelId,
  type SttModelOption,
} from "@/app/api/[locale]/agent/speech-to-text/models";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import {
  getBestTtsModel,
  type TtsModelId,
  type TtsModelOption,
  type VoiceModelSelection,
} from "@/app/api/[locale]/agent/text-to-speech/models";
import { DEFAULT_VIDEO_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/video-generation/constants";
import {
  getBestVideoGenModel,
  type VideoGenModelOption,
  type VideoGenModelSelection,
} from "@/app/api/[locale]/agent/video-generation/models";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
}

export interface MessageAttachment {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  data?: string;
}

export type BridgeType = "stt" | "vision" | "translation" | "tts";

export type VariantResolution =
  | { useFile: true }
  | { useVariant: MessageVariant }
  | { needsGeneration: true; type: BridgeType };

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
  providerOverride?: ApiProvider,
): ChatModelId | null {
  // Try favorite's modelSelection first
  if (favoriteModelSelection) {
    const best = getBestChatModel(
      favoriteModelSelection,
      user,
      providerOverride,
    );
    if (best) {
      return best.id;
    }
  }

  // Fall back to skill variant's modelSelection
  if (skillVariantModelSelection) {
    const best = getBestChatModel(
      skillVariantModelSelection,
      user,
      providerOverride,
    );
    if (best) {
      return best.id;
    }
  }

  return null;
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
    getBest: (sel: TSelection, user: JwtPayloadType) => TOption | null,
    user: JwtPayloadType,
  ): TOption | null {
    const fromFavorite = favoriteSelection
      ? getBest(favoriteSelection, user)
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }

    const fromSkill = skillSelection ? getBest(skillSelection, user) : null;
    if (fromSkill) {
      return fromSkill;
    }

    return getBest(defaultSelection, user);
  }

  /**
   * Cascade: skill (selection) → favorite → system default
   * Used by media gen models (image/music/video) - skill config has highest priority.
   */
  private static cascadeMediaGenModel<TSelection, TOption>(
    skillSelection: TSelection | null | undefined,
    favoriteSelection: TSelection | null | undefined,
    defaultSelection: TSelection,
    getBest: (sel: TSelection, user: JwtPayloadType) => TOption | null,
    user: JwtPayloadType,
  ): TOption | null {
    const fromSkill = skillSelection ? getBest(skillSelection, user) : null;
    if (fromSkill) {
      return fromSkill;
    }

    const fromFavorite = favoriteSelection
      ? getBest(favoriteSelection, user)
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }

    return getBest(defaultSelection, user);
  }

  /** Resolve STT model: favorite → skill variant → system default */
  static resolveSttModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): SttModelOption | null {
    return this.cascadeBridgeModel(
      ctx.favorite?.sttModelSelection,
      ctx.skill?.sttModelSelection,
      DEFAULT_STT_MODEL_SELECTION,
      (sel, u) => getBestSttModel(sel, u),
      user,
    );
  }

  /** Resolve TTS voice model: favorite → skill variant → system default */
  static resolveTtsModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): TtsModelOption | null {
    return this.cascadeBridgeModel(
      ctx.favorite?.voiceModelSelection,
      ctx.skill?.voiceModelSelection,
      DEFAULT_TTS_MODEL_SELECTION,
      (sel, u) => getBestTtsModel(sel, u),
      user,
    );
  }

  /** Resolve TTS voice ID: favorite → skill variant → system default */
  static resolveTtsVoiceId(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): TtsModelId | null {
    return this.resolveTtsModel(ctx, user)?.id ?? null;
  }

  /** Resolve image vision model: favorite → skill variant → system default */
  static resolveImageVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): ImageVisionModelOption | null {
    return this.cascadeBridgeModel(
      ctx.favorite?.imageVisionModelSelection,
      ctx.skill?.imageVisionModelSelection,
      DEFAULT_IMAGE_VISION_MODEL_SELECTION,
      (sel, u) => getBestImageVisionModel(sel, u),
      user,
    );
  }

  /** Resolve video vision model: favorite → skill variant → system default */
  static resolveVideoVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): VideoVisionModelOption | null {
    return this.cascadeBridgeModel(
      ctx.favorite?.videoVisionModelSelection,
      ctx.skill?.videoVisionModelSelection,
      DEFAULT_VIDEO_VISION_MODEL_SELECTION,
      (sel, u) => getBestVideoVisionModel(sel, u),
      user,
    );
  }

  /** Resolve audio vision model: favorite → skill variant → system default */
  static resolveAudioVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): AudioVisionModelOption | null {
    return this.cascadeBridgeModel(
      ctx.favorite?.audioVisionModelSelection,
      ctx.skill?.audioVisionModelSelection,
      DEFAULT_AUDIO_VISION_MODEL_SELECTION,
      (sel, u) => getBestAudioVisionModel(sel, u),
      user,
    );
  }

  /**
   * Resolve TTS model selection via cascade without resolving to a model.
   * Priority (bridge): favorite → skill → clientVoiceModelId → default.
   * Pass `clientVoiceModelId` when the request carries an explicit voice preference.
   */
  static resolveTtsSelection(
    ctx: BridgeContext,
    clientVoiceModelId?: TtsModelId,
  ): VoiceModelSelection {
    return (
      ctx.favorite?.voiceModelSelection ??
      ctx.skill?.voiceModelSelection ??
      (clientVoiceModelId
        ? ({
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: clientVoiceModelId,
          } satisfies Extract<
            VoiceModelSelection,
            { selectionType: typeof ModelSelectionType.MANUAL }
          >)
        : DEFAULT_TTS_MODEL_SELECTION)
    );
  }

  /** Resolve image gen selection via cascade without resolving to a model (skill → favorite → default). */
  static resolveImageGenSelection(ctx: BridgeContext): ImageGenModelSelection {
    return (
      ctx.skill?.imageGenModelSelection ??
      ctx.favorite?.imageGenModelSelection ??
      DEFAULT_IMAGE_GEN_MODEL_SELECTION
    );
  }

  /** Resolve music gen selection via cascade without resolving to a model (skill → favorite → default). */
  static resolveMusicGenSelection(ctx: BridgeContext): MusicGenModelSelection {
    return (
      ctx.skill?.musicGenModelSelection ??
      ctx.favorite?.musicGenModelSelection ??
      DEFAULT_MUSIC_GEN_MODEL_SELECTION
    );
  }

  /** Resolve video gen selection via cascade without resolving to a model (skill → favorite → default). */
  static resolveVideoGenSelection(ctx: BridgeContext): VideoGenModelSelection {
    return (
      ctx.skill?.videoGenModelSelection ??
      ctx.favorite?.videoGenModelSelection ??
      DEFAULT_VIDEO_GEN_MODEL_SELECTION
    );
  }

  /** Resolve image gen model: skill variant → favorite → system default */
  static resolveImageGenModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): ImageGenModelOption | null {
    return this.cascadeMediaGenModel(
      ctx.skill?.imageGenModelSelection,
      ctx.favorite?.imageGenModelSelection,
      DEFAULT_IMAGE_GEN_MODEL_SELECTION,
      (sel, u) => getBestImageGenModel(sel, u),
      user,
    );
  }

  /** Resolve music gen model: skill variant → favorite → system default */
  static resolveMusicGenModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): MusicGenModelOption | null {
    return this.cascadeMediaGenModel(
      ctx.skill?.musicGenModelSelection,
      ctx.favorite?.musicGenModelSelection,
      DEFAULT_MUSIC_GEN_MODEL_SELECTION,
      (sel, u) => getBestMusicGenModel(sel, u),
      user,
    );
  }

  /** Resolve video gen model: skill variant → favorite → system default */
  static resolveVideoGenModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): VideoGenModelOption | null {
    return this.cascadeMediaGenModel(
      ctx.skill?.videoGenModelSelection,
      ctx.favorite?.videoGenModelSelection,
      DEFAULT_VIDEO_GEN_MODEL_SELECTION,
      (sel, u) => getBestVideoGenModel(sel, u),
      user,
    );
  }

  /**
   * Determine what a MIME type maps to as a Modality
   */
  static getMimeTypeModality(mimeType: string): Modality | null {
    const lower = mimeType.toLowerCase();
    if (lower.startsWith("image/")) {
      return "image";
    }
    if (lower.startsWith("video/")) {
      return "video";
    }
    if (lower.startsWith("audio/")) {
      return "audio";
    }
    if (lower.startsWith("application/pdf") || lower.startsWith("text/")) {
      return "text";
    }
    return null;
  }

  /**
   * Check whether a bridge is needed for this attachment + model combo
   */
  static needsBridge(
    attachment: MessageAttachment,
    activeModel: ChatModelOption,
  ): boolean {
    const modality = ModalityResolver.getMimeTypeModality(attachment.mimeType);
    if (!modality) {
      return false;
    }
    return !activeModel.inputs.includes(modality);
  }

  /**
   * Check if a media modality can be handled - either natively by the model
   * or via a bridge model (vision/STT). Returns the unsupported modalities.
   */
  static getUnsupportedMediaModalities(
    attachmentMimeTypes: string[],
    activeModel: ChatModelOption,
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): { modality: Modality; reason: string }[] {
    const unsupported: { modality: Modality; reason: string }[] = [];
    const checked = new Set<Modality>();

    for (const mimeType of attachmentMimeTypes) {
      const modality = ModalityResolver.getMimeTypeModality(mimeType);
      if (!modality || modality === "text" || checked.has(modality)) {
        continue;
      }
      checked.add(modality);

      if (activeModel.inputs.includes(modality)) {
        continue; // model supports natively
      }

      // Check if bridge is available
      if (modality === "image") {
        const visionModel = ModalityResolver.resolveImageVisionModel(ctx, user);
        if (!visionModel) {
          unsupported.push({
            modality,
            reason:
              "No image vision model is configured. Enable an OpenRouter API key or select a model that supports image input.",
          });
        }
      } else if (modality === "video") {
        const visionModel = ModalityResolver.resolveVideoVisionModel(ctx, user);
        if (!visionModel) {
          unsupported.push({
            modality,
            reason:
              "No video vision model is configured. Enable an OpenRouter API key or select a model that supports video input.",
          });
        }
      } else if (modality === "audio") {
        const sttModel = ModalityResolver.resolveSttModel(ctx, user);
        if (!sttModel) {
          unsupported.push({
            modality,
            reason:
              "No speech-to-text model is configured. Enable voice providers or select a model that supports audio input.",
          });
        }
      }
    }

    return unsupported;
  }

  /**
   * Resolve how to pass an attachment to the active model.
   */
  static resolveVariant(
    attachment: MessageAttachment,
    activeModel: ChatModelOption,
    variants: MessageVariant[],
  ): VariantResolution {
    const modality = ModalityResolver.getMimeTypeModality(attachment.mimeType);

    if (!modality || activeModel.inputs.includes(modality)) {
      return { useFile: true };
    }

    const textVariant = variants.find((v) => v.modality === "text");
    if (textVariant) {
      return { useVariant: textVariant };
    }

    const bridgeType: BridgeType = modality === "audio" ? "stt" : "vision";

    return { needsGeneration: true, type: bridgeType };
  }
}
