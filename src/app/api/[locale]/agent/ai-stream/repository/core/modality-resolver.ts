/**
 * Modality Resolver
 * Resolves bridge models via cascade: skill → favorite → userSettings → system default
 */
import "server-only";

import type { ChatFavorite } from "@/app/api/[locale]/agent/chat/favorites/db";
import type { ChatSettings } from "@/app/api/[locale]/agent/chat/settings/db";
import type { Skill } from "@/app/api/[locale]/agent/chat/skills/config";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import {
  getBestImageVisionModel,
  getBestVideoVisionModel,
  getBestAudioVisionModel,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { getBestImageGenModel } from "@/app/api/[locale]/agent/image-generation/models";
import { getBestMusicGenModel } from "@/app/api/[locale]/agent/music-generation/models";
import { getBestSttModel } from "@/app/api/[locale]/agent/speech-to-text/models";
import { getBestTtsModel } from "@/app/api/[locale]/agent/text-to-speech/models";
import { getBestVideoGenModel } from "@/app/api/[locale]/agent/video-generation/models";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";
import { agentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import {
  DEFAULT_AUDIO_VISION_MODEL_SELECTION,
  DEFAULT_IMAGE_VISION_MODEL_SELECTION,
  DEFAULT_VIDEO_VISION_MODEL_SELECTION,
} from "@/app/api/[locale]/agent/ai-stream/constants";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import { DEFAULT_MUSIC_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/music-generation/constants";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import { DEFAULT_VIDEO_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/video-generation/constants";
import {
  getChatModelById,
  type ChatModelId,
  type ChatModelOption,
} from "@/app/api/[locale]/agent/ai-stream/models";
import {
  type AudioVisionModelId,
  type AudioVisionModelOption,
  type ImageVisionModelId,
  type ImageVisionModelOption,
  type VideoVisionModelId,
  type VideoVisionModelOption,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { type ImageGenModelOption } from "@/app/api/[locale]/agent/image-generation/models";
import { type MusicGenModelOption } from "@/app/api/[locale]/agent/music-generation/models";
import {
  type SttModelId,
  type SttModelOption,
} from "@/app/api/[locale]/agent/speech-to-text/models";
import {
  type TtsModelId,
  type TtsModelOption,
} from "@/app/api/[locale]/agent/text-to-speech/models";
import { type VideoGenModelOption } from "@/app/api/[locale]/agent/video-generation/models";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

/** Fields read from skill config for bridge model resolution (skill still uses scalar IDs) */
export type BridgeSkill = Pick<
  Skill,
  | "voiceId"
  | "sttModelId"
  | "imageVisionModelId"
  | "videoVisionModelId"
  | "audioVisionModelId"
  | "translationModelId"
  | "defaultChatMode"
  | "imageGenModelId"
  | "musicGenModelId"
  | "videoGenModelId"
>;

/** Fields read from favorite DB row for bridge model resolution (DB uses ModelSelectionSimple JSONB) */
export type BridgeFavorite = Pick<
  ChatFavorite,
  | "voiceModelSelection"
  | "sttModelSelection"
  | "imageVisionModelSelection"
  | "videoVisionModelSelection"
  | "audioVisionModelSelection"
  | "translationModelId"
  | "defaultChatMode"
  | "imageGenModelSelection"
  | "musicGenModelSelection"
  | "videoGenModelSelection"
>;

/** Fields read from settings DB row for bridge model resolution (DB uses ModelSelectionSimple JSONB) */
export type BridgeSettings = Pick<
  ChatSettings,
  | "voiceModelSelection"
  | "sttModelSelection"
  | "imageVisionModelSelection"
  | "videoVisionModelSelection"
  | "audioVisionModelSelection"
  | "translationModelId"
  | "defaultChatMode"
  | "imageGenModelSelection"
  | "musicGenModelSelection"
  | "videoGenModelSelection"
>;

export interface BridgeContext {
  skill: BridgeSkill | null;
  favorite: BridgeFavorite | null;
  userSettings: BridgeSettings | null;
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

export class ModalityResolver {
  /**
   * Cascade: userSettings → favorite → skill (scalar id) → system default
   * Used by bridge models (STT, TTS, vision) — user preference overrides skill config.
   */
  private static cascadeBridgeModel<TSelection, TOption>(
    userSettingsSelection: TSelection | null | undefined,
    favoriteSelection: TSelection | null | undefined,
    skillModelId: string | null | undefined,
    defaultSelection: TSelection,
    getBest: (sel: TSelection, user: JwtPayloadType) => TOption | null,
    user: JwtPayloadType,
  ): TOption | null {
    const fromUserSettings = userSettingsSelection
      ? getBest(userSettingsSelection, user)
      : null;
    if (fromUserSettings) {
      return fromUserSettings;
    }

    const fromFavorite = favoriteSelection
      ? getBest(favoriteSelection, user)
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }

    if (skillModelId) {
      const fromSkill = getBest(
        {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: skillModelId,
        } as TSelection,
        user,
      );
      if (fromSkill) {
        return fromSkill;
      }
    }

    return getBest(defaultSelection, user);
  }

  /**
   * Cascade: skill (scalar id) → favorite → userSettings → system default
   * Used by media gen models (image/music/video) — skill config has highest priority.
   */
  private static cascadeMediaGenModel<TSelection, TOption>(
    skillModelId: string | null | undefined,
    favoriteSelection: TSelection | null | undefined,
    userSettingsSelection: TSelection | null | undefined,
    defaultSelection: TSelection,
    getBest: (sel: TSelection, user: JwtPayloadType) => TOption | null,
    user: JwtPayloadType,
  ): TOption | null {
    if (skillModelId) {
      const fromSkill = getBest(
        {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: skillModelId,
        } as TSelection,
        user,
      );
      if (fromSkill) {
        return fromSkill;
      }
    }

    const fromFavorite = favoriteSelection
      ? getBest(favoriteSelection, user)
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }

    const fromUserSettings = userSettingsSelection
      ? getBest(userSettingsSelection, user)
      : null;
    if (fromUserSettings) {
      return fromUserSettings;
    }

    return getBest(defaultSelection, user);
  }

  /** Resolve STT model: userSettings → favorite → skill → system default */
  static resolveSttModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): SttModelOption | null {
    const env = agentEnvAvailability;
    return this.cascadeBridgeModel(
      ctx.userSettings?.sttModelSelection,
      ctx.favorite?.sttModelSelection,
      ctx.skill?.sttModelId,
      DEFAULT_STT_MODEL_SELECTION,
      (sel, u) => getBestSttModel(sel, u, env),
      user,
    );
  }

  /** Resolve TTS voice model: userSettings → favorite → skill → system default */
  static resolveTtsModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): TtsModelOption | null {
    const env = agentEnvAvailability;
    return this.cascadeBridgeModel(
      ctx.userSettings?.voiceModelSelection,
      ctx.favorite?.voiceModelSelection,
      ctx.skill?.voiceId,
      DEFAULT_TTS_MODEL_SELECTION,
      (sel, u) => getBestTtsModel(sel, u, env),
      user,
    );
  }

  /** Resolve TTS voice ID: userSettings → favorite → skill → system default */
  static resolveTtsVoiceId(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): TtsModelId | null {
    return this.resolveTtsModel(ctx, user)?.id ?? null;
  }

  /** Resolve image vision model: userSettings → favorite → skill → system default */
  static resolveImageVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): ImageVisionModelOption | null {
    const env = agentEnvAvailability;
    return this.cascadeBridgeModel(
      ctx.userSettings?.imageVisionModelSelection,
      ctx.favorite?.imageVisionModelSelection,
      ctx.skill?.imageVisionModelId,
      DEFAULT_IMAGE_VISION_MODEL_SELECTION,
      (sel, u) => getBestImageVisionModel(sel, u, env),
      user,
    );
  }

  /** Resolve video vision model: userSettings → favorite → skill → system default */
  static resolveVideoVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): VideoVisionModelOption | null {
    const env = agentEnvAvailability;
    return this.cascadeBridgeModel(
      ctx.userSettings?.videoVisionModelSelection,
      ctx.favorite?.videoVisionModelSelection,
      ctx.skill?.videoVisionModelId,
      DEFAULT_VIDEO_VISION_MODEL_SELECTION,
      (sel, u) => getBestVideoVisionModel(sel, u, env),
      user,
    );
  }

  /** Resolve audio vision model: userSettings → favorite → skill → system default */
  static resolveAudioVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): AudioVisionModelOption | null {
    const env = agentEnvAvailability;
    return this.cascadeBridgeModel(
      ctx.userSettings?.audioVisionModelSelection,
      ctx.favorite?.audioVisionModelSelection,
      ctx.skill?.audioVisionModelId,
      DEFAULT_AUDIO_VISION_MODEL_SELECTION,
      (sel, u) => getBestAudioVisionModel(sel, u, env),
      user,
    );
  }

  /**
   * Resolve translation model via cascade: userSettings → favorite → skill → null
   */
  static resolveTranslationModel(ctx: BridgeContext): ChatModelOption | null {
    const modelId: ChatModelId | undefined =
      ctx.userSettings?.translationModelId ??
      ctx.favorite?.translationModelId ??
      ctx.skill?.translationModelId ??
      undefined;
    if (!modelId) {
      return null;
    }
    return getChatModelById(modelId);
  }

  /**
   * Resolve default chat mode via cascade: userSettings → favorite → skill → "text"
   */
  static resolveDefaultChatMode(ctx: BridgeContext): "text" | "voice" | "call" {
    return (
      ctx.userSettings?.defaultChatMode ??
      ctx.favorite?.defaultChatMode ??
      ctx.skill?.defaultChatMode ??
      "text"
    );
  }

  /** Resolve image gen model: skill → favorite → userSettings → system default */
  static resolveImageGenModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): ImageGenModelOption | null {
    const env = agentEnvAvailability;
    return this.cascadeMediaGenModel(
      ctx.skill?.imageGenModelId,
      ctx.favorite?.imageGenModelSelection,
      ctx.userSettings?.imageGenModelSelection,
      DEFAULT_IMAGE_GEN_MODEL_SELECTION,
      (sel, u) => getBestImageGenModel(sel, u, env),
      user,
    );
  }

  /** Resolve music gen model: skill → favorite → userSettings → system default */
  static resolveMusicGenModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): MusicGenModelOption | null {
    const env = agentEnvAvailability;
    return this.cascadeMediaGenModel(
      ctx.skill?.musicGenModelId,
      ctx.favorite?.musicGenModelSelection,
      ctx.userSettings?.musicGenModelSelection,
      DEFAULT_MUSIC_GEN_MODEL_SELECTION,
      (sel, u) => getBestMusicGenModel(sel, u, env),
      user,
    );
  }

  /** Resolve video gen model: skill → favorite → userSettings → system default */
  static resolveVideoGenModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): VideoGenModelOption | null {
    const env = agentEnvAvailability;
    return this.cascadeMediaGenModel(
      ctx.skill?.videoGenModelId,
      ctx.favorite?.videoGenModelSelection,
      ctx.userSettings?.videoGenModelSelection,
      DEFAULT_VIDEO_GEN_MODEL_SELECTION,
      (sel, u) => getBestVideoGenModel(sel, u, env),
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
   * Check if a media modality can be handled — either natively by the model
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
