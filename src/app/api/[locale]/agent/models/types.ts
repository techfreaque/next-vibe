/**
 * Model Selection Types
 * Schemas and types for model selection
 */

import { z } from "zod";

import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  PriceLevel,
  SpeedLevel,
} from "@/app/api/[locale]/agent/chat/characters/enum";
import { ModelId } from "@/app/api/[locale]/agent/models/models";

/**
 * Shared filter properties schema
 * These are preserved across all selection types so users don't lose their settings
 */
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
});

/**
 * Manual Model Selection Schema
 * User manually selects a specific model
 * Preserves filter/sort props for when user switches back to filter mode
 */
export const manualModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.MANUAL),
    manualModelId: z.enum(ModelId),
  })
  .merge(sharedFilterPropsSchema);

/**
 * Filter-based Model Selection Schema
 * System selects model based on filters (intelligence, price, content, speed)
 */
export const filtersModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.FILTERS),
  })
  .merge(sharedFilterPropsSchema);

/**
 * Model Selection Schema without CHARACTER_BASED support
 * For characters - only includes FILTERS and MANUAL modes
 */
export const modelSelectionSchemaSimple = z.discriminatedUnion(
  "selectionType",
  [manualModelSelectionSchema, filtersModelSelectionSchema],
);

/**
 * Type exports for convenience
 */
export type ManualModelSelection = z.infer<typeof manualModelSelectionSchema>;
export type FiltersModelSelection = z.infer<typeof filtersModelSelectionSchema>;

export type ModelSelectionSimple = z.infer<typeof modelSelectionSchemaSimple>;
