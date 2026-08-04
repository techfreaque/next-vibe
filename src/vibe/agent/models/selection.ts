import { z } from "zod";

import type { chatModelSelectionSchema } from "../ai-stream/models";
import type {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
} from "../ai-stream/vision-models";
import type { imageGenModelSelectionSchema } from "../image-generation/models";
import type { musicGenModelSelectionSchema } from "../music-generation/models";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  PriceLevel,
} from "../skills/enum";
import type { sttModelSelectionSchema } from "../speech-to-text/models";
import type { voiceModelSelectionSchema } from "../text-to-speech/models";
import type { videoGenModelSelectionSchema } from "../video-generation/models";

export const sharedFilterPropsSchema = z.object({
  intelligenceRange: z
    .object({
      min: z.enum(IntelligenceLevel).optional(),
      max: z.enum(IntelligenceLevel).optional(),
    })
    .optional(),
  priceRange: z
    .object({
      min: z.enum(PriceLevel).optional(),
      max: z.enum(PriceLevel).optional(),
    })
    .optional(),
  contentRange: z
    .object({
      min: z.enum(ContentLevel).optional(),
      max: z.enum(ContentLevel).optional(),
    })
    .optional(),
  sortBy: z.enum(ModelSortField).optional(),
  sortDirection: z.enum(ModelSortDirection).optional(),
  sortBy2: z.enum(ModelSortField).optional(),
  sortDirection2: z.enum(ModelSortDirection).optional(),
});

export const filtersSelectionSchema = z
  .object({ selectionType: z.literal(ModelSelectionType.FILTERS) })
  .merge(sharedFilterPropsSchema);

export type FiltersModelSelection = z.infer<typeof filtersSelectionSchema>;

export type AnyRoleModelSelection =
  | z.infer<typeof chatModelSelectionSchema>
  | z.infer<typeof voiceModelSelectionSchema>
  | z.infer<typeof sttModelSelectionSchema>
  | z.infer<typeof imageGenModelSelectionSchema>
  | z.infer<typeof musicGenModelSelectionSchema>
  | z.infer<typeof videoGenModelSelectionSchema>
  | z.infer<typeof imageVisionModelSelectionSchema>
  | z.infer<typeof videoVisionModelSelectionSchema>
  | z.infer<typeof audioVisionModelSelectionSchema>;
