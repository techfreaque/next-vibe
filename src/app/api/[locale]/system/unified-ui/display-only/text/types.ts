/**
 * Text Widget Types
 * Displays text data with comprehensive formatting options
 */

import type {
  FieldDataType,
  WidgetType,
} from "next-vibe/core/definition/enums";
import type { TParams } from "next-vibe/core/i18n/core/static-types";
import type { WidgetData } from "next-vibe/core/utils/json";
import type {
  BooleanWidgetSchema,
  NumberWidgetSchema,
  StringWidgetSchema,
} from "next-vibe/unified-ui/_shared/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "next-vibe/unified-ui/_shared/types";
import type { SpacingSize } from "next-vibe/unified-ui/display-only/title/types";
import type { z } from "zod";

/**
 * Text format types
 */
export type TextFormat = "plain" | "code" | "pre" | "link";

/**
 * Text emphasis types for styling
 */
export type TextEmphasis = "bold" | "italic" | "underline";

/**
 * Text variant types for color styling
 */
export type TextVariant =
  | "default"
  | "error"
  | "info"
  | "success"
  | "warning"
  | "muted";

/**
 * Text object schema - for text with truncation/format options
 */
type TextObjectSchema =
  | z.ZodObject<{
      text: z.ZodString;
      truncate: z.ZodOptional<z.ZodNumber>;
      format: z.ZodOptional<z.ZodString>;
    }>
  | z.ZodOptional<
      z.ZodObject<{
        text: z.ZodString;
        truncate: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodString>;
      }>
    >
  | z.ZodNullable<
      z.ZodObject<{
        text: z.ZodString;
        truncate: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodString>;
      }>
    >;

/**
 * Text schema constraint - accepts:
 * - string (simple text)
 * - number (converted to string)
 * - boolean (converted to string)
 * - object with { text, truncate?, format? } (rich text data)
 */
export type TextWidgetSchema =
  | StringWidgetSchema
  | NumberWidgetSchema
  | BooleanWidgetSchema
  | TextObjectSchema;

/**
 * Text Widget Configuration
 *
 * Display modes (priority order):
 * 1. Static content from `content` property (fixed text)
 * 2. Date formatting if fieldType is DATE/DATETIME
 * 3. Link formatting if format="link" with href
 * 4. Dynamic value from data (string, number, boolean, or object)
 */
export interface TextWidgetConfig<
  out TKey extends string,
  TSchema extends TextWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget" | "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.TEXT;

  /** Static content translation key - use for fixed text */
  content?: NoInfer<TKey>;
  contentParams?: TParams;

  /** Number of columns in grid layout */
  columns?: number;

  /** Field type for special formatting (DATE, DATETIME) */
  fieldType?: FieldDataType;

  /** Label translation key displayed above text */
  label?: NoInfer<TKey>;

  /** Color styling variant */
  variant?: TextVariant;

  /** Enable multi-line text display (preserves newlines) */
  multiline?: boolean;

  /** Text emphasis styling */
  emphasis?: TextEmphasis;

  /** Maximum text length before truncation */
  maxLength?: number;

  /** Text alignment */
  textAlign?: "left" | "center" | "right";

  /** Text size */
  size?: "xs" | "sm" | "base" | "lg" | "xl";

  /** Gap between label and text */
  gap?: SpacingSize;

  /**
   * Dynamic className callback - receives field value and parent value
   * Returns additional className to merge with static className
   */
  getClassName?: <TSchema extends TextWidgetSchema>(
    value: TSchema extends TextWidgetSchema ? z.output<TSchema> : undefined,
    parentValue?: WidgetData,
  ) => string;

  /** Schema constraint for the field value */
  schema: TSchema;
}
