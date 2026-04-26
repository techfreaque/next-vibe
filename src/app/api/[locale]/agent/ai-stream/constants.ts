import {
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../chat/skills/enum";
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
export const DEFAULT_CHAT_MODEL_ID = ChatModelId.KIMI_K2_6;

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
 */
export const DEFAULT_IMAGE_VISION_MODEL_SELECTION: ImageVisionModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: ImageVisionModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
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
  manualModelId: VideoVisionModelId.GEMINI_3_1_FLASH_LITE_PREVIEW,
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
  manualModelId: AudioVisionModelId.GEMINI_3_1_FLASH_LITE_PREVIEW,
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};
