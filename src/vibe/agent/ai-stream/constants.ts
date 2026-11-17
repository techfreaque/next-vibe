import {
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../skills/enum";
import type { ChatModelSelection } from "./models";
import { ChatModelId } from "./models";
import type {
  AudioVisionModelSelection,
  ImageVisionModelSelection,
  VideoVisionModelSelection,
} from "./vision-models";
import {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "./vision-models";

/**
 * The default chat model used across skills, fallbacks, and test fixtures.
 * Change this one constant to switch the platform default everywhere.
 */
export const DEFAULT_CHAT_MODEL_ID = ChatModelId.KIMI_K3;

/**
 * Default chat model selection - MANUAL preferred model with 2-level sort fallback.
 * Use resolveModelSelectionForEnv(selection, env) before getBestModel() to env-filter.
 */
export const DEFAULT_CHAT_MODEL_SELECTION: ChatModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: DEFAULT_CHAT_MODEL_ID,
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};

/**
 * Default image vision model selection - for bridging image attachments to text.
 * Uncensored on purpose: a mainstream vision model refuses (or silently
 * sanitizes) images the user's chosen model would happily discuss. DeepSeek
 * V4.1 Flash Uncensored: native image input, 4 provider routes (NanoGPT +
 * Venice), ~$0.001-0.002 per description (smoke-tested 2026-11-17).
 */
export const DEFAULT_IMAGE_VISION_MODEL_SELECTION: ImageVisionModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: ImageVisionModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};

/**
 * Default video vision model selection - for bridging video attachments to text.
 */
export const DEFAULT_VIDEO_VISION_MODEL_SELECTION: VideoVisionModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: VideoVisionModelId.GEMINI_3_5_FLASH_LITE,
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};

/**
 * Default audio vision model selection - for bridging audio/music attachments to text.
 */
export const DEFAULT_AUDIO_VISION_MODEL_SELECTION: AudioVisionModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: AudioVisionModelId.GEMINI_3_5_FLASH_LITE,
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};

/**
 * Second-chance vision models, in priority order. When the resolved vision
 * model refuses (provider moderation, content filter, a refusal reply) or
 * fails, the bridge retries ONCE with the first entry that is available and
 * differs from the model that just failed. Image prefers uncensored models
 * (a different base model than the default, so a refusal is not repeated),
 * then a mainstream one as the last resort. Video/audio have no uncensored
 * model our transports can send those modalities to, so they fall back to
 * other mainstream multimodal models.
 */
export const IMAGE_VISION_FALLBACK_MODEL_IDS: readonly ImageVisionModelId[] = [
  ImageVisionModelId.GLM_5_3_FLASH_UNCENSORED,
  ImageVisionModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
  ImageVisionModelId.GEMMA_4_UNCENSORED,
  ImageVisionModelId.GEMINI_3_5_FLASH_LITE,
];

export const VIDEO_VISION_FALLBACK_MODEL_IDS: readonly VideoVisionModelId[] = [
  VideoVisionModelId.QWEN_3_8_FLASH,
  VideoVisionModelId.GEMINI_3_5_FLASH_LITE,
  VideoVisionModelId.GEMINI_3_8_FLASH,
];

export const AUDIO_VISION_FALLBACK_MODEL_IDS: readonly AudioVisionModelId[] = [
  AudioVisionModelId.MIMO_V2_6_FLASH,
  AudioVisionModelId.GEMINI_3_5_FLASH_LITE,
  AudioVisionModelId.GEMINI_3_8_FLASH,
];
