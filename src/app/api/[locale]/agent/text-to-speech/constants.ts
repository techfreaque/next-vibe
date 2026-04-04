import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../chat/skills/enum";
import type { VoiceModelSelection } from "../text-to-speech/models";
import { TtsModelId } from "./models";

/** System default TTS voice ID */
export const DEFAULT_TTS_VOICE_ID: TtsModelId = TtsModelId.OPENAI_NOVA;

export const DEFAULT_TTS_MODEL_SELECTION: VoiceModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: TtsModelId.OPENAI_NOVA,
  intelligenceRange: { min: IntelligenceLevel.SMART },
  contentRange: { min: ContentLevel.MAINSTREAM, max: ContentLevel.OPEN },
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};
