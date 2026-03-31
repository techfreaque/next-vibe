/**
 * Modality Resolver
 * Resolves bridge models via cascade: skill → favorite → userSettings → system default
 */
import "server-only";

import {
  DEFAULT_TTS_VOICE_ID,
  getModelById,
  type ModelId,
  type ModelOption,
  type TtsModelId,
} from "@/app/api/[locale]/agent/models/models";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";
import type { ChatFavorite } from "@/app/api/[locale]/agent/chat/favorites/db";
import type { ChatSettings } from "@/app/api/[locale]/agent/chat/settings/db";
import type { Skill } from "@/app/api/[locale]/agent/chat/skills/config";

// System defaults
const DEFAULT_STT_MODEL_ID = "openai-whisper" as ModelId;

/** Fields read from skill/favorite/settings for bridge model resolution */
export type BridgeSkill = Pick<
  Skill,
  | "voiceId"
  | "sttModelId"
  | "visionBridgeModelId"
  | "translationModelId"
  | "defaultChatMode"
>;
export type BridgeFavorite = Pick<
  ChatFavorite,
  | "voiceId"
  | "sttModelId"
  | "visionBridgeModelId"
  | "translationModelId"
  | "defaultChatMode"
>;
export type BridgeSettings = Pick<
  ChatSettings,
  | "voiceId"
  | "sttModelId"
  | "visionBridgeModelId"
  | "translationModelId"
  | "defaultChatMode"
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

export type BridgeType = "stt" | "vision-bridge" | "tts";

export type VariantResolution =
  | { useFile: true }
  | { useVariant: MessageVariant }
  | { needsGeneration: true; type: BridgeType };

export class ModalityResolver {
  /**
   * Resolve STT model via cascade: skill → favorite → userSettings → system default
   */
  /**
   * Resolve STT model via cascade: userSettings → favorite → skill → system default
   * Settings override first (explicit user preference), skill is the base fallback.
   */
  static resolveSttModel(ctx: BridgeContext): ModelOption {
    const modelId: ModelId =
      ctx.userSettings?.sttModelId ??
      ctx.favorite?.sttModelId ??
      ctx.skill?.sttModelId ??
      DEFAULT_STT_MODEL_ID;
    return getModelById(modelId);
  }

  /**
   * Resolve TTS voice model via cascade: userSettings → favorite → skill → system default
   */
  static resolveTtsModel(ctx: BridgeContext): ModelOption {
    const voiceId: TtsModelId =
      ctx.userSettings?.voiceId ??
      ctx.favorite?.voiceId ??
      ctx.skill?.voiceId ??
      DEFAULT_TTS_VOICE_ID;
    return getModelById(voiceId);
  }

  /**
   * Resolve TTS voice ID via cascade: userSettings → favorite → skill → system default
   */
  static resolveTtsVoiceId(ctx: BridgeContext): TtsModelId {
    return (
      ctx.userSettings?.voiceId ??
      ctx.favorite?.voiceId ??
      ctx.skill?.voiceId ??
      DEFAULT_TTS_VOICE_ID
    );
  }

  /**
   * Resolve vision bridge model via cascade: userSettings → favorite → skill → null
   */
  static resolveVisionBridgeModel(ctx: BridgeContext): ModelOption | null {
    const modelId: ModelId | undefined =
      ctx.userSettings?.visionBridgeModelId ??
      ctx.favorite?.visionBridgeModelId ??
      ctx.skill?.visionBridgeModelId ??
      undefined;
    if (!modelId) {
      return null;
    }
    return getModelById(modelId);
  }

  /**
   * Resolve translation model via cascade: userSettings → favorite → skill → null
   */
  static resolveTranslationModel(ctx: BridgeContext): ModelOption | null {
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
   *   { useFile: true }           — pass raw file, model handles natively
   *   { useVariant: v }           — use existing cached text variant
   *   { needsGeneration: true, type } — no variant yet, run bridge now
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

    // No variant — need to generate one
    const bridgeType: BridgeType =
      modality === "audio"
        ? "stt"
        : modality === "image" || modality === "video" || modality === "file"
          ? "vision-bridge"
          : "vision-bridge";

    return { needsGeneration: true, type: bridgeType };
  }
}
