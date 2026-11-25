"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { useMemo } from "react";

import {
  DEFAULT_AUDIO_VISION_MODEL_SELECTION,
  DEFAULT_CHAT_MODEL_SELECTION,
  DEFAULT_IMAGE_VISION_MODEL_SELECTION,
  DEFAULT_VIDEO_VISION_MODEL_SELECTION,
} from "../../ai-stream/constants";
import {
  type ChatModelSelection,
  chatModelSelectionSchema,
  getBestChatModel,
} from "../../ai-stream/models";
import {
  type AudioVisionModelSelection,
  audioVisionModelSelectionSchema,
  getBestAudioVisionModel,
  getBestImageVisionModel,
  getBestVideoVisionModel,
  type ImageVisionModelSelection,
  imageVisionModelSelectionSchema,
  type VideoVisionModelSelection,
  videoVisionModelSelectionSchema,
} from "../../ai-stream/vision-models";
import type { AgentEnvAvailability } from "../../env-availability";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "../../image-generation/constants";
import {
  getBestImageGenModel,
  type ImageGenModelSelection,
  imageGenModelSelectionSchema,
} from "../../image-generation/models";
import { DEFAULT_MUSIC_GEN_MODEL_SELECTION } from "../../music-generation/constants";
import {
  getBestMusicGenModel,
  type MusicGenModelSelection,
  musicGenModelSelectionSchema,
} from "../../music-generation/models";
import { DEFAULT_STT_MODEL_SELECTION } from "../../speech-to-text/constants";
import {
  getBestSttModel,
  type SttModelSelection,
  sttModelSelectionSchema,
} from "../../speech-to-text/models";
import { DEFAULT_TTS_MODEL_SELECTION } from "../../text-to-speech/constants";
import {
  getBestTtsModel,
  type VoiceModelSelection,
  voiceModelSelectionSchema,
} from "../../text-to-speech/models";
import { DEFAULT_VIDEO_GEN_MODEL_SELECTION } from "../../video-generation/constants";
import {
  getBestVideoGenModel,
  type VideoGenModelSelection,
  videoGenModelSelectionSchema,
} from "../../video-generation/models";
import { ModelSelectionType } from "../enum";

/**
 * Platform defaults for all 9 model modalities.
 * Computed once and passed down to avoid re-computing in each VariantEditorPanel.
 */
export interface VariantPlatformDefaults {
  chat: ChatModelSelection | undefined;
  tts: VoiceModelSelection | undefined;
  imageGen: ImageGenModelSelection | undefined;
  musicGen: MusicGenModelSelection | undefined;
  videoGen: VideoGenModelSelection | undefined;
  stt: SttModelSelection | undefined;
  imageVision: ImageVisionModelSelection | undefined;
  videoVision: VideoVisionModelSelection | undefined;
  audioVision: AudioVisionModelSelection | undefined;
}

/**
 * Hook to compute platform-level defaults for all model modalities.
 */
export function useVariantPlatformDefaults(
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): VariantPlatformDefaults {
  return useMemo(() => {
    const mkChat = (): ChatModelSelection | undefined => {
      const m = getBestChatModel(
        DEFAULT_CHAT_MODEL_SELECTION,
        user,
        availability,
      );
      if (!m) {
        return undefined;
      }
      const p = chatModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkTts = (): VoiceModelSelection | undefined => {
      const m = getBestTtsModel(
        DEFAULT_TTS_MODEL_SELECTION,
        user,
        availability,
      );
      if (!m) {
        return undefined;
      }
      const p = voiceModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkImageGen = (): ImageGenModelSelection | undefined => {
      const m = getBestImageGenModel(
        DEFAULT_IMAGE_GEN_MODEL_SELECTION,
        user,
        availability,
      );
      if (!m) {
        return undefined;
      }
      const p = imageGenModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkMusicGen = (): MusicGenModelSelection | undefined => {
      const m = getBestMusicGenModel(
        DEFAULT_MUSIC_GEN_MODEL_SELECTION,
        user,
        availability,
      );
      if (!m) {
        return undefined;
      }
      const p = musicGenModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkVideoGen = (): VideoGenModelSelection | undefined => {
      const m = getBestVideoGenModel(
        DEFAULT_VIDEO_GEN_MODEL_SELECTION,
        user,
        availability,
      );
      if (!m) {
        return undefined;
      }
      const p = videoGenModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkStt = (): SttModelSelection | undefined => {
      const m = getBestSttModel(
        DEFAULT_STT_MODEL_SELECTION,
        user,
        availability,
      );
      if (!m) {
        return undefined;
      }
      const p = sttModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkImageVision = (): ImageVisionModelSelection | undefined => {
      const m = getBestImageVisionModel(
        DEFAULT_IMAGE_VISION_MODEL_SELECTION,
        user,
        availability,
      );
      if (!m) {
        return undefined;
      }
      const p = imageVisionModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkVideoVision = (): VideoVisionModelSelection | undefined => {
      const m = getBestVideoVisionModel(
        DEFAULT_VIDEO_VISION_MODEL_SELECTION,
        user,
        availability,
      );
      if (!m) {
        return undefined;
      }
      const p = videoVisionModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkAudioVision = (): AudioVisionModelSelection | undefined => {
      const m = getBestAudioVisionModel(
        DEFAULT_AUDIO_VISION_MODEL_SELECTION,
        user,
        availability,
      );
      if (!m) {
        return undefined;
      }
      const p = audioVisionModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    return {
      chat: mkChat(),
      tts: mkTts(),
      imageGen: mkImageGen(),
      musicGen: mkMusicGen(),
      videoGen: mkVideoGen(),
      stt: mkStt(),
      imageVision: mkImageVision(),
      videoVision: mkVideoVision(),
      audioVision: mkAudioVision(),
    };
  }, [user, availability]);
}
