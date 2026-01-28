/**
 * Badge Widget Types
 * Displays a colored badge with text/status information
 */

import type { z } from "zod";

import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type {
  EnumWidgetSchema,
  NumberWidgetSchema,
  StringWidgetSchema,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Semantic variants for badge styling
 */
export type BadgeSemanticVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info";

/**
 * Badge rich object schema - for badges with custom variant/icon
 */
export type BadgeObjectSchema =
  | z.ZodObject<{
      text: z.ZodString;
      variant: z.ZodOptional<z.ZodString>;
      icon: z.ZodOptional<z.ZodString>;
    }>
  | z.ZodOptional<
      z.ZodObject<{
        text: z.ZodString;
        variant: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
      }>
    >
  | z.ZodNullable<
      z.ZodObject<{
        text: z.ZodString;
        variant: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
      }>
    >;

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
  | EnumWidgetSchema
  | BadgeObjectSchema;

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
  text?: TKey;

  /** Enum options for dynamic value mapping - use for enum fields */
  enumOptions?: Array<BadgeEnumOption<TKey>>;

  /** Semantic variant for badge color */
  variant?: BadgeSemanticVariant;

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
