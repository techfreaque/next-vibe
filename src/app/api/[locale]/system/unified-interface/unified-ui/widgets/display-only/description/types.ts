/**
 * Description Widget Types
 * Displays descriptive/explanatory text with optional styling
 */

import type {
  SpacingSize,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Description widget schema - accepts string for description text
 */
export type DescriptionWidgetSchema = StringWidgetSchema;

/**
 * Description Widget Configuration
 * Displays explanatory or help text with styling options
 */
export interface DescriptionWidgetConfig<
  TSchema extends DescriptionWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.DESCRIPTION;

  /** Text size */
  textSize?: "xs" | "sm" | "base" | "lg" | "xl";

  /** Margin spacing */
  spacing?: SpacingSize;

  /** Line clamp for text truncation */
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6 | "none";

  /** Schema constraint for the field value */
  schema: TSchema;
}
