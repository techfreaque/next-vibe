/**
 * Modality Resolver
 * Resolves bridge models via cascade: skill → favorite → userSettings → system default
 */
import "server-only";

import type { ChatFavorite } from "@/app/api/[locale]/agent/chat/favorites/db";
import type { ChatSettings } from "@/app/api/[locale]/agent/chat/settings/db";
import type { Skill } from "@/app/api/[locale]/agent/chat/skills/config";
import { SkillsRepositoryClient } from "@/app/api/[locale]/agent/chat/skills/repository-client";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
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
import { type ImageGenModelOption } from "@/app/api/[locale]/agent/image-generation/models";
import { type MusicGenModelOption } from "@/app/api/[locale]/agent/music-generation/models";
import { type SttModelOption } from "@/app/api/[locale]/agent/speech-to-text/models";
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
  | "videoGenModelId"
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
  | "videoGenModelId"
>;

export interface BridgeContext {
  skill: BridgeSkill | null;
  favorite: BridgeFavorite | null;
  userSettings: BridgeSettings | null;
}

export interface MessageVariant {
  modality: Modality;
  content: string; // text content or storage URL
  modelId?: ChatModelId;
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
   * Resolve STT model via cascade: userSettings → favorite → skill → system default
   */
  static resolveSttModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): SttModelOption {
    const env = agentEnvAvailability;
    const fromUserSettings = ctx.userSettings?.sttModelSelection
      ? SkillsRepositoryClient.getBestSttModel(
          ctx.userSettings.sttModelSelection,
          user,
          env,
        )
      : null;
    if (fromUserSettings) {
      return fromUserSettings;
    }
    const fromFavorite = ctx.favorite?.sttModelSelection
      ? SkillsRepositoryClient.getBestSttModel(
          ctx.favorite.sttModelSelection,
          user,
          env,
        )
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }
    if (ctx.skill?.sttModelId) {
      const fromSkill = SkillsRepositoryClient.getBestSttModel(
        {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ctx.skill.sttModelId,
        },
        user,
        env,
      );
      if (fromSkill) {
        return fromSkill;
      }
    }
    return SkillsRepositoryClient.getBestSttModel(
      DEFAULT_STT_MODEL_SELECTION,
      user,
      env,
    )!;
  }

  /**
   * Resolve TTS voice model via cascade: userSettings → favorite → skill → system default
   */
  static resolveTtsModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): TtsModelOption {
    const env = agentEnvAvailability;
    const fromUserSettings = ctx.userSettings?.voiceModelSelection
      ? SkillsRepositoryClient.getBestTtsModel(
          ctx.userSettings.voiceModelSelection,
          user,
          env,
        )
      : null;
    if (fromUserSettings) {
      return fromUserSettings;
    }
    const fromFavorite = ctx.favorite?.voiceModelSelection
      ? SkillsRepositoryClient.getBestTtsModel(
          ctx.favorite.voiceModelSelection,
          user,
          env,
        )
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }
    if (ctx.skill?.voiceId) {
      const fromSkill = SkillsRepositoryClient.getBestTtsModel(
        {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ctx.skill.voiceId,
        },
        user,
        env,
      );
      if (fromSkill) {
        return fromSkill;
      }
    }
    return SkillsRepositoryClient.getBestTtsModel(
      DEFAULT_TTS_MODEL_SELECTION,
      user,
      env,
    )!;
  }

  /**
   * Resolve TTS voice ID via cascade: userSettings → favorite → skill → system default
   */
  static resolveTtsVoiceId(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): TtsModelId {
    return this.resolveTtsModel(ctx, user).id;
  }

  /**
   * Resolve image vision model via cascade: userSettings → favorite → skill → system default.
   */
  static resolveImageVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): ChatModelOption {
    const env = agentEnvAvailability;
    const fromUserSettings = ctx.userSettings?.imageVisionModelSelection
      ? SkillsRepositoryClient.getBestImageVisionModel(
          ctx.userSettings.imageVisionModelSelection,
          user,
          env,
        )
      : null;
    if (fromUserSettings) {
      return fromUserSettings;
    }
    const fromFavorite = ctx.favorite?.imageVisionModelSelection
      ? SkillsRepositoryClient.getBestImageVisionModel(
          ctx.favorite.imageVisionModelSelection,
          user,
          env,
        )
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }
    if (ctx.skill?.imageVisionModelId) {
      const fromSkill = SkillsRepositoryClient.getBestImageVisionModel(
        {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ctx.skill.imageVisionModelId,
        },
        user,
        env,
      );
      if (fromSkill) {
        return fromSkill;
      }
    }
    return SkillsRepositoryClient.getBestImageVisionModel(
      DEFAULT_IMAGE_VISION_MODEL_SELECTION,
      user,
      env,
    )!;
  }

  /**
   * Resolve video vision model via cascade: userSettings → favorite → skill → system default.
   */
  static resolveVideoVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): ChatModelOption {
    const env = agentEnvAvailability;
    const fromUserSettings = ctx.userSettings?.videoVisionModelSelection
      ? SkillsRepositoryClient.getBestVideoVisionModel(
          ctx.userSettings.videoVisionModelSelection,
          user,
          env,
        )
      : null;
    if (fromUserSettings) {
      return fromUserSettings;
    }
    const fromFavorite = ctx.favorite?.videoVisionModelSelection
      ? SkillsRepositoryClient.getBestVideoVisionModel(
          ctx.favorite.videoVisionModelSelection,
          user,
          env,
        )
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }
    if (ctx.skill?.videoVisionModelId) {
      const fromSkill = SkillsRepositoryClient.getBestVideoVisionModel(
        {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ctx.skill.videoVisionModelId,
        },
        user,
        env,
      );
      if (fromSkill) {
        return fromSkill;
      }
    }
    return SkillsRepositoryClient.getBestVideoVisionModel(
      DEFAULT_VIDEO_VISION_MODEL_SELECTION,
      user,
      env,
    )!;
  }

  /**
   * Resolve audio vision model via cascade: userSettings → favorite → skill → system default.
   */
  static resolveAudioVisionModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): ChatModelOption {
    const env = agentEnvAvailability;
    const fromUserSettings = ctx.userSettings?.audioVisionModelSelection
      ? SkillsRepositoryClient.getBestAudioVisionModel(
          ctx.userSettings.audioVisionModelSelection,
          user,
          env,
        )
      : null;
    if (fromUserSettings) {
      return fromUserSettings;
    }
    const fromFavorite = ctx.favorite?.audioVisionModelSelection
      ? SkillsRepositoryClient.getBestAudioVisionModel(
          ctx.favorite.audioVisionModelSelection,
          user,
          env,
        )
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }
    if (ctx.skill?.audioVisionModelId) {
      const fromSkill = SkillsRepositoryClient.getBestAudioVisionModel(
        {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ctx.skill.audioVisionModelId,
        },
        user,
        env,
      );
      if (fromSkill) {
        return fromSkill;
      }
    }
    return SkillsRepositoryClient.getBestAudioVisionModel(
      DEFAULT_AUDIO_VISION_MODEL_SELECTION,
      user,
      env,
    )!;
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

  /**
   * Resolve image generation model via cascade: skill → favorite → userSettings → system default
   */
  static resolveImageGenModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): ImageGenModelOption | null {
    const env = agentEnvAvailability;
    if (ctx.skill?.imageGenModelId) {
      const fromSkill = SkillsRepositoryClient.getBestImageGenModel(
        {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ctx.skill.imageGenModelId,
        },
        user,
        env,
      );
      if (fromSkill) {
        return fromSkill;
      }
    }
    const fromFavorite = ctx.favorite?.imageGenModelSelection
      ? SkillsRepositoryClient.getBestImageGenModel(
          ctx.favorite.imageGenModelSelection,
          user,
          env,
        )
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }
    const fromUserSettings = ctx.userSettings?.imageGenModelSelection
      ? SkillsRepositoryClient.getBestImageGenModel(
          ctx.userSettings.imageGenModelSelection,
          user,
          env,
        )
      : null;
    if (fromUserSettings) {
      return fromUserSettings;
    }
    return SkillsRepositoryClient.getBestImageGenModel(
      DEFAULT_IMAGE_GEN_MODEL_SELECTION,
      user,
      env,
    );
  }

  /**
   * Resolve music generation model via cascade: skill → favorite → userSettings → system default
   */
  static resolveMusicGenModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): MusicGenModelOption | null {
    const env = agentEnvAvailability;
    if (ctx.skill?.musicGenModelId) {
      const fromSkill = SkillsRepositoryClient.getBestMusicGenModel(
        {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ctx.skill.musicGenModelId,
        },
        user,
        env,
      );
      if (fromSkill) {
        return fromSkill;
      }
    }
    const fromFavorite = ctx.favorite?.musicGenModelSelection
      ? SkillsRepositoryClient.getBestMusicGenModel(
          ctx.favorite.musicGenModelSelection,
          user,
          env,
        )
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }
    const fromUserSettings = ctx.userSettings?.musicGenModelSelection
      ? SkillsRepositoryClient.getBestMusicGenModel(
          ctx.userSettings.musicGenModelSelection,
          user,
          env,
        )
      : null;
    if (fromUserSettings) {
      return fromUserSettings;
    }
    return SkillsRepositoryClient.getBestMusicGenModel(
      DEFAULT_MUSIC_GEN_MODEL_SELECTION,
      user,
      env,
    );
  }

  /**
   * Resolve video generation model via cascade: skill → favorite → userSettings → system default
   */
  static resolveVideoGenModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): VideoGenModelOption | null {
    const env = agentEnvAvailability;
    if (ctx.skill?.videoGenModelId) {
      const fromSkill = SkillsRepositoryClient.getBestVideoGenModel(
        {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ctx.skill.videoGenModelId,
        },
        user,
        env,
      );
      if (fromSkill) {
        return fromSkill;
      }
    }
    const fromFavorite = ctx.favorite?.videoGenModelId
      ? SkillsRepositoryClient.getBestVideoGenModel(
          {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: ctx.favorite.videoGenModelId,
          },
          user,
          env,
        )
      : null;
    if (fromFavorite) {
      return fromFavorite;
    }
    const fromUserSettings = ctx.userSettings?.videoGenModelId
      ? SkillsRepositoryClient.getBestVideoGenModel(
          {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: ctx.userSettings.videoGenModelId,
          },
          user,
          env,
        )
      : null;
    if (fromUserSettings) {
      return fromUserSettings;
    }
    return SkillsRepositoryClient.getBestVideoGenModel(
      DEFAULT_VIDEO_GEN_MODEL_SELECTION,
      user,
      env,
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
