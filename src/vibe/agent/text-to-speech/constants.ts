import {
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../skills/enum";
import type { VoiceModelSelection } from "./models";
import { TtsModelId } from "./models";

export const TEXT_TO_SPEECH_ALIAS = "text-to-speech" as const;

/** System default TTS voice ID */
export const DEFAULT_TTS_VOICE_ID: TtsModelId = TtsModelId.OPENAI_NOVA;

export const DEFAULT_TTS_MODEL_SELECTION: VoiceModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: TtsModelId.OPENAI_NOVA,
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};
