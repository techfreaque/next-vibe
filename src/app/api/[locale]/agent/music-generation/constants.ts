/**
 * Music Generation Constants
 */

import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../chat/skills/enum";
import type { MusicGenModelSelection } from "../models/types";
import { MusicGenModelId } from "./models";

/** Primary alias used to register the generate_music AI tool */
export const MUSIC_GEN_ALIAS = "generate_music" as const;

/** Tool name used in synthetic tool-call/result messages for natively-generated audio */
export const AUDIO_GEN_TOOL_NAME = "audio_gen" as const;

export const DEFAULT_MUSIC_GEN_MODEL_SELECTION: MusicGenModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: MusicGenModelId.UDIO_V2,
  intelligenceRange: { min: IntelligenceLevel.SMART },
  contentRange: { min: ContentLevel.MAINSTREAM, max: ContentLevel.OPEN },
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};
