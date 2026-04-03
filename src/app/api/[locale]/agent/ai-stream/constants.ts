import { ChatModelId } from "./models";
import {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "./vision-models";
import type {
  AudioVisionModelSelection,
  ChatModelSelection,
  ImageVisionModelSelection,
  VideoVisionModelSelection,
} from "../models/types";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../chat/skills/enum";

/**
 * Default chat model selection — MANUAL preferred model with 2-level sort fallback.
 * Use resolveModelSelectionForEnv(selection, env) before getBestModel() to env-filter.
 */
export const DEFAULT_CHAT_MODEL_SELECTION: ChatModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: ChatModelId.KIMI_K2,
  intelligenceRange: { min: IntelligenceLevel.SMART },
  contentRange: { min: ContentLevel.MAINSTREAM, max: ContentLevel.OPEN },
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};

/**
 * Default image vision model selection — for bridging image attachments to text.
 */
export const DEFAULT_IMAGE_VISION_MODEL_SELECTION: ImageVisionModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: ImageVisionModelId.GEMINI_2_5_FLASH,
  intelligenceRange: { min: IntelligenceLevel.SMART },
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};

/**
 * Default video vision model selection — for bridging video attachments to text.
 */
export const DEFAULT_VIDEO_VISION_MODEL_SELECTION: VideoVisionModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: VideoVisionModelId.GEMINI_2_5_FLASH,
  intelligenceRange: { min: IntelligenceLevel.SMART },
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};

/**
 * Default audio vision model selection — for bridging audio/music attachments to text.
 */
export const DEFAULT_AUDIO_VISION_MODEL_SELECTION: AudioVisionModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: AudioVisionModelId.GEMINI_2_5_FLASH,
  intelligenceRange: { min: IntelligenceLevel.SMART },
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};
