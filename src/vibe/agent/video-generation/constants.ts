/**
 * Video Generation Constants
 */

import {
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../skills/enum";
import type { VideoGenModelSelection } from "./models";
import { VideoGenModelId } from "./models";

/** Primary alias used to register the generate_video AI tool */
export const VIDEO_GEN_ALIAS = "generate_video" as const;

/** Tool name used in synthetic tool-call/result messages for natively-generated video */
export const VIDEO_GEN_TOOL_NAME = "video_gen" as const;

/**
 * Requested clip length when the caller sets none. The AI never sets one (the
 * field is hidden from AI/MCP), so every chat clip asks for this many seconds
 * and the route then clamps/snaps it (resolveVideoClipSeconds).
 */
export const DEFAULT_VIDEO_DURATION_SECONDS = 5;

export const DEFAULT_VIDEO_GEN_MODEL_SELECTION: VideoGenModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: VideoGenModelId.VEO_3_1,
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};
