import { z } from "zod";

import type { chatModelSelectionSchema } from "@/app/api/[locale]/agent/ai-stream/models";
import type {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  PriceLevel,
  SpeedLevel,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import type { imageGenModelSelectionSchema } from "@/app/api/[locale]/agent/image-generation/models";
import type { musicGenModelSelectionSchema } from "@/app/api/[locale]/agent/music-generation/models";
import type { sttModelSelectionSchema } from "@/app/api/[locale]/agent/speech-to-text/models";
import type { voiceModelSelectionSchema } from "@/app/api/[locale]/agent/text-to-speech/models";
import type { videoGenModelSelectionSchema } from "@/app/api/[locale]/agent/video-generation/models";

const sharedFilterPropsSchema = z.object({
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
  speedRange: z
    .object({
      min: z.enum(SpeedLevel).optional(),
      max: z.enum(SpeedLevel).optional(),
    })
    .optional(),
  sortBy: z.enum(ModelSortField).optional(),
  sortDirection: z.enum(ModelSortDirection).optional(),
  sortBy2: z.enum(ModelSortField).optional(),
  sortDirection2: z.enum(ModelSortDirection).optional(),
});

const filtersModelSelectionSchema = z
  .object({ selectionType: z.literal(ModelSelectionType.FILTERS) })
  .merge(sharedFilterPropsSchema);

export type FiltersModelSelection = z.infer<typeof filtersModelSelectionSchema>;

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
