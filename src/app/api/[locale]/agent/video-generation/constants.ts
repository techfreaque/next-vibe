/**
 * Video Generation Constants
 */

import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../chat/skills/enum";
import type { VideoGenModelSelection } from "../models/types";
import { VideoGenModelId } from "./models";

/** Primary alias used to register the generate_video AI tool */
export const VIDEO_GEN_ALIAS = "generate_video" as const;

/** Tool name used in synthetic tool-call/result messages for natively-generated video */
export const VIDEO_GEN_TOOL_NAME = "video_gen" as const;

export const DEFAULT_VIDEO_GEN_MODEL_SELECTION: VideoGenModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: VideoGenModelId.MODELSLAB_WAN_2_6_T2V,
  intelligenceRange: { min: IntelligenceLevel.SMART },
  contentRange: { min: ContentLevel.MAINSTREAM, max: ContentLevel.OPEN },
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};
