import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../chat/skills/enum";
import type { SttModelSelection } from "../speech-to-text/models";
import { SttModelId } from "./models";

/** Alias used when this endpoint is called as an AI tool */
export const TRANSCRIBE_AUDIO_ALIAS = "transcribe_audio" as const;

/** Default speech-to-text model */
export const DEFAULT_STT_MODEL_ID: SttModelId = SttModelId.OPENAI_WHISPER;

export const DEFAULT_STT_MODEL_SELECTION: SttModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: SttModelId.OPENAI_WHISPER,
  intelligenceRange: { min: IntelligenceLevel.SMART },
  contentRange: { min: ContentLevel.MAINSTREAM, max: ContentLevel.OPEN },
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};
