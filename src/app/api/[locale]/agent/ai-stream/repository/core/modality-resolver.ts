/**
 * Modality Resolver
 * Resolves bridge models via cascade: skill → favorite → userSettings → system default
 */
import "server-only";

import type { ChatFavorite } from "@/app/api/[locale]/agent/chat/favorites/db";
import type { ChatSettings } from "@/app/api/[locale]/agent/chat/settings/db";
import type { Skill } from "@/app/api/[locale]/agent/chat/skills/config";
import { SkillsRepositoryClient } from "@/app/api/[locale]/agent/chat/skills/repository-client";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";
import {
  DEFAULT_IMAGE_GEN_MODEL_ID,
  DEFAULT_TTS_VOICE_ID,
  getModelById,
  type ImageGenModelOption,
  type ModelId,
  type ModelOption,
  type MusicGenModelOption,
  type TtsModelId,
  type VideoGenModelId,
  type VideoGenModelOption,
} from "@/app/api/[locale]/agent/models/models";
import type { ModelSelectionSimple } from "@/app/api/[locale]/agent/models/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

// System defaults
const DEFAULT_STT_MODEL_ID = "openai-whisper" as ModelId;
const DEFAULT_VISION_BRIDGE_MODEL_ID = "claude-haiku-4.5" as ModelId;

/** Fields read from skill config for bridge model resolution (skill still uses scalar IDs) */
export type BridgeSkill = Pick<
  Skill,
  | "voiceId"
  | "sttModelId"
  | "visionBridgeModelId"
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
  | "visionBridgeModelSelection"
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
  | "visionBridgeModelSelection"
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
  modelId?: ModelId;
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

/** Resolve a ModelSelectionSimple to a model ID for a given role set */
function resolveSelection(
  selections: (ModelSelectionSimple | null | undefined)[],
  roles: ["image-gen"],
  user: JwtPayloadType,
): ImageGenModelOption | null;
function resolveSelection(
  selections: (ModelSelectionSimple | null | undefined)[],
  roles: ["audio-gen"],
  user: JwtPayloadType,
): MusicGenModelOption | null;
function resolveSelection(
  selections: (ModelSelectionSimple | null | undefined)[],
  roles: Parameters<typeof SkillsRepositoryClient.getBestModelByRole>[1],
  user: JwtPayloadType,
): ModelOption | null;
function resolveSelection(
  selections: (ModelSelectionSimple | null | undefined)[],
  roles: Parameters<typeof SkillsRepositoryClient.getBestModelByRole>[1],
  user: JwtPayloadType,
): ModelOption | null {
  for (const sel of selections) {
    if (sel) {
      return SkillsRepositoryClient.getBestModelByRole(sel, roles, user);
    }
  }
  return null;
}

export class ModalityResolver {
  /**
   * Resolve STT model via cascade: userSettings → favorite → skill → system default
   */
  static resolveSttModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): ModelOption {
    // Favorite/settings use ModelSelectionSimple; skill uses scalar sttModelId
    const fromSelection = resolveSelection(
      [ctx.userSettings?.sttModelSelection, ctx.favorite?.sttModelSelection],
      ["stt"],
      user,
    );
    if (fromSelection) {
      return fromSelection;
    }
    const skillModelId: ModelId = ctx.skill?.sttModelId ?? DEFAULT_STT_MODEL_ID;
    return getModelById(skillModelId);
  }

  /**
   * Resolve TTS voice model via cascade: userSettings → favorite → skill → system default
   */
  static resolveTtsModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): ModelOption {
    const fromSelection = resolveSelection(
      [
        ctx.userSettings?.voiceModelSelection,
        ctx.favorite?.voiceModelSelection,
      ],
      ["tts"],
      user,
    );
    if (fromSelection) {
      return fromSelection;
    }
    const voiceId: TtsModelId = ctx.skill?.voiceId ?? DEFAULT_TTS_VOICE_ID;
    return getModelById(voiceId);
  }

  /**
   * Resolve TTS voice ID via cascade: userSettings → favorite → skill → system default
   */
  static resolveTtsVoiceId(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): TtsModelId {
    return (
      (this.resolveTtsModel(ctx, user).id as TtsModelId) ?? DEFAULT_TTS_VOICE_ID
    );
  }

  /**
   * Resolve vision bridge model via cascade: userSettings → favorite → skill → null
   */
  static resolveVisionBridgeModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): ModelOption {
    const fromSelection = resolveSelection(
      [
        ctx.userSettings?.visionBridgeModelSelection,
        ctx.favorite?.visionBridgeModelSelection,
      ],
      ["llm"],
      user,
    );
    if (fromSelection) {
      return fromSelection;
    }
    const modelId: ModelId =
      ctx.skill?.visionBridgeModelId ?? DEFAULT_VISION_BRIDGE_MODEL_ID;
    return getModelById(modelId);
  }

  /**
   * Resolve translation model via cascade: userSettings → favorite → skill → null
   */
  static resolveTranslationModel(ctx: BridgeContext): ModelOption | null {
    // translationModelId is still a plain text ID (not ModelSelectionSimple)
    const modelId: ModelId | undefined =
      ctx.userSettings?.translationModelId ??
      ctx.favorite?.translationModelId ??
      ctx.skill?.translationModelId ??
      undefined;
    if (!modelId) {
      return null;
    }
    return getModelById(modelId);
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
  ): ImageGenModelOption {
    if (ctx.skill?.imageGenModelId) {
      return getModelById(ctx.skill.imageGenModelId);
    }
    const fromSelection = resolveSelection(
      [
        ctx.favorite?.imageGenModelSelection,
        ctx.userSettings?.imageGenModelSelection,
      ],
      ["image-gen"],
      user,
    );
    if (fromSelection) {
      return fromSelection;
    }
    return getModelById(DEFAULT_IMAGE_GEN_MODEL_ID);
  }

  /**
   * Resolve music/audio generation model via cascade: skill → favorite → userSettings → null
   */
  static resolveMusicGenModel(
    ctx: BridgeContext,
    user: JwtPayloadType,
  ): MusicGenModelOption | null {
    if (ctx.skill?.musicGenModelId) {
      return getModelById(ctx.skill.musicGenModelId);
    }
    const fromSelection = resolveSelection(
      [
        ctx.favorite?.musicGenModelSelection,
        ctx.userSettings?.musicGenModelSelection,
      ],
      ["audio-gen"],
      user,
    );
    return fromSelection ?? null;
  }

  /**
   * Resolve video generation model via cascade: skill → favorite → userSettings → null
   */
  static resolveVideoGenModel(ctx: BridgeContext): VideoGenModelOption | null {
    const modelId: VideoGenModelId | undefined =
      ctx.skill?.videoGenModelId ??
      ctx.favorite?.videoGenModelId ??
      ctx.userSettings?.videoGenModelId ??
      undefined;
    if (!modelId) {
      return null;
    }
    return getModelById(modelId);
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
      return "file";
    }
    return null;
  }

  /**
   * Check whether a bridge is needed for this attachment + model combo
   */
  static needsBridge(
    attachment: MessageAttachment,
    activeModel: ModelOption,
  ): boolean {
    const modality = ModalityResolver.getMimeTypeModality(attachment.mimeType);
    if (!modality) {
      return false;
    }
    // If model natively handles this modality, no bridge needed
    return !activeModel.inputs.includes(modality);
  }

  /**
   * Resolve how to pass an attachment to the active model.
   * Returns one of:
   *   { useFile: true }           - pass raw file, model handles natively
   *   { useVariant: v }           - use existing cached text variant
   *   { needsGeneration: true, type } - no variant yet, run bridge now
   */
  static resolveVariant(
    attachment: MessageAttachment,
    activeModel: ModelOption,
    variants: MessageVariant[],
  ): VariantResolution {
    const modality = ModalityResolver.getMimeTypeModality(attachment.mimeType);

    // If model natively handles this modality, pass file directly
    if (!modality || activeModel.inputs.includes(modality)) {
      return { useFile: true };
    }

    // Look for an existing text variant
    const textVariant = variants.find((v) => v.modality === "text");
    if (textVariant) {
      return { useVariant: textVariant };
    }

    // No variant - need to generate one
    const bridgeType: BridgeType =
      modality === "audio"
        ? "stt"
        : modality === "image" || modality === "video" || modality === "file"
          ? "vision"
          : "vision";

    return { needsGeneration: true, type: bridgeType };
  }
}
