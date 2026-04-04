import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../chat/skills/enum";
import { ImageGenModelId } from "./models";
import type { ImageGenModelSelection } from "../image-generation/models";

/**
 * Default image generation model selection — MANUAL preferred model with 2-level sort fallback.
 * Use resolveModelSelectionForEnv(selection, env) before getBestImageGenModel() to env-filter.
 */
export const DEFAULT_IMAGE_GEN_MODEL_SELECTION: ImageGenModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: ImageGenModelId.GEMINI_3_PRO_IMAGE_PREVIEW,
  intelligenceRange: { min: IntelligenceLevel.SMART },
  contentRange: { min: ContentLevel.MAINSTREAM, max: ContentLevel.OPEN },
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};

/** Primary alias used to register the generate_image AI tool */
export const IMAGE_GEN_ALIAS = "generate_image" as const;
