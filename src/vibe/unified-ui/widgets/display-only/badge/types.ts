/**
 * Badge Widget Types
 * Displays a colored badge with text/status information
 */

import type { BadgeVariant } from "next-vibe/ui/ui/badge";
import type { z } from "zod";

import type { WidgetType } from "../../../../core/definition/enums";
import type { WidgetData } from "../../../../core/utils/json";
import type {
  EnumWidgetSchema,
  NumberWidgetSchema,
  StringWidgetSchema,
} from "../../../_shared/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../../_shared/types";

/**
 * Badge size variants
 */
export type BadgeSize = "xs" | "sm" | "base" | "lg";

/**
 * Badge schema constraint - accepts:
 * - string (simple text badges)
 * - number (numeric badges)
 * - enum (status badges with predefined values)
 * - object with { text, variant?, icon? } (rich badge data)
 */
export type BadgeWidgetSchema =
  | StringWidgetSchema
  | NumberWidgetSchema
  | EnumWidgetSchema;

/**
 * Badge Widget Configuration
 *
 * Display modes (priority order):
 * 1. Static text from `text` property (fixed label)
 * 2. Enum label from `enumOptions` matched by value
 * 3. Dynamic value from data (string, number, or object with {text, variant, icon})
 */
export interface BadgeWidgetConfig<
  TKey extends string,
  TSchema extends BadgeWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.BADGE;

  /** Static text translation key - use for fixed labels */
  text?: NoInfer<TKey>;

  /** Enum options for dynamic value mapping - use for enum fields */
  enumOptions?: Array<BadgeEnumOption<TKey>>;

  /** Semantic variant for badge color */
  variant?: BadgeVariant;

  /** Badge size */
  size?: BadgeSize;

  /**
   * Dynamic className callback - receives field value and parent value
   * Returns additional className to merge with static className
   */
  getClassName?: (value: z.output<TSchema>, parentValue?: WidgetData) => string;

  /** Schema constraint for the field value */
  schema: TSchema;
}

/**
 * Badge enum option structure from UI config
 */
export interface BadgeEnumOption<TKey extends string> {
  label: NoInfer<TKey>;
  value: string | number;
}
