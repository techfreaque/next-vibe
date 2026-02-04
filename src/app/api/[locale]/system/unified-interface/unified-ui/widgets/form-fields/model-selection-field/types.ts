/**
 * Model Selection Field Widget Types and Schemas
 * Comprehensive model selection with three modes: CHARACTER_BASED, FILTERS, MANUAL
 */

import { z } from "zod";

import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  PriceLevel,
  SpeedLevel,
} from "@/app/api/[locale]/agent/chat/characters/enum";
import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

/**
 * Model Sort Field Enum (localized)
 */
export const {
  enum: ModelSortField,
  options: ModelSortFieldOptions,
  Value: ModelSortFieldValue,
} = createEnumOptions({
  INTELLIGENCE: "app.api.agent.chat.favorites.enums.sortField.intelligence",
  SPEED: "app.api.agent.chat.favorites.enums.sortField.speed",
  PRICE: "app.api.agent.chat.favorites.enums.sortField.price",
  CONTENT: "app.api.agent.chat.favorites.enums.sortField.content",
});

/**
 * Model Sort Direction Enum (localized)
 */
export const {
  enum: ModelSortDirection,
  options: ModelSortDirectionOptions,
  Value: ModelSortDirectionValue,
} = createEnumOptions({
  ASC: "app.api.agent.chat.favorites.enums.sortDirection.asc",
  DESC: "app.api.agent.chat.favorites.enums.sortDirection.desc",
});

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
  sortBy: z
    .enum([
      ModelSortField.INTELLIGENCE,
      ModelSortField.SPEED,
      ModelSortField.PRICE,
      ModelSortField.CONTENT,
    ])
    .optional(),
  sortDirection: z
    .enum([ModelSortDirection.ASC, ModelSortDirection.DESC])
    .optional(),
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
 * Character-based Model Selection Schema
 * Uses character's default model selection settings
 * Preserves filter/sort props for when user switches back to filter/manual mode
 */
export const characterBasedModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.CHARACTER_BASED),
  })
  .merge(sharedFilterPropsSchema);

/**
 * Base Model Selection Schema (discriminated union)
 * For the current selection mode: CHARACTER_BASED, FILTERS, or MANUAL
 */
export const baseModelSelectionSchema = z.discriminatedUnion("selectionType", [
  characterBasedModelSelectionSchema,
  manualModelSelectionSchema,
  filtersModelSelectionSchema,
]);

/**
 * Model Selection Schema with CHARACTER_BASED support
 * For favorites - includes character's model selection OUTSIDE the union
 * This allows switching back to character-based while preserving the character's settings
 * characterModelSelection is optional - server will populate it from the character if missing
 */
export const modelSelectionSchemaWithCharacter = z.object({
  currentSelection: baseModelSelectionSchema,
  characterModelSelection: z
    .discriminatedUnion("selectionType", [
      manualModelSelectionSchema,
      filtersModelSelectionSchema,
    ])
    .optional(),
});

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
export type CharacterBasedModelSelection = z.infer<
  typeof characterBasedModelSelectionSchema
>;
export type BaseModelSelection = z.infer<typeof baseModelSelectionSchema>;
export type ModelSelectionWithCharacter = z.infer<
  typeof modelSelectionSchemaWithCharacter
>;
export type ModelSelectionSimple = z.infer<typeof modelSelectionSchemaSimple>;

/**
 * Model Selection Field Widget Config - Full version with CHARACTER_BASED support
 * Used for favorites where character-based model selection is available
 */
export interface ModelSelectionFieldWidgetConfig<
  out TKey extends string,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<
  TKey,
  TUsage,
  "primitive",
  typeof modelSelectionSchemaWithCharacter
> {
  fieldType: FieldDataType.MODEL_SELECTION;

  /**
   * Whether to include CHARACTER_BASED mode (tab)
   * When true, shows all three modes: CHARACTER_BASED, FILTERS, MANUAL
   * When false, only shows FILTERS and MANUAL modes
   */
  includeCharacterBased: true;

  /**
   * Character ID for CHARACTER_BASED mode
   * Required when includeCharacterBased is true
   */
  characterId?: string;
}

/**
 * Model Selection Field Widget Config - Filters-only version
 * Used for characters where only FILTERS and MANUAL modes are available
 */
export interface ModelSelectionFieldWidgetConfigSimple<
  out TKey extends string,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<
  TKey,
  TUsage,
  "primitive",
  typeof modelSelectionSchemaSimple
> {
  fieldType: FieldDataType.MODEL_SELECTION;

  /**
   * Whether to include CHARACTER_BASED mode
   * false = only FILTERS and MANUAL modes
   */
  includeCharacterBased: false;
}

/**
 * Union type for both widget config variants
 */
export type ModelSelectionFieldWidgetConfigAny<
  TKey extends string = string,
  TUsage extends FieldUsageConfig = FieldUsageConfig,
> =
  | ModelSelectionFieldWidgetConfig<TKey, TUsage>
  | ModelSelectionFieldWidgetConfigSimple<TKey, TUsage>;
