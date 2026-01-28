/**
 * Text Widget Types
 * Displays text data with comprehensive formatting options
 */

import type { z } from "zod";

import type {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type {
  BooleanWidgetSchema,
  NumberWidgetSchema,
  StringWidgetSchema,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";
import type { SpacingSize } from "../title/types";

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

  /** Number of columns in grid layout */
  columns?: number;

  /** Field type for special formatting (DATE, DATETIME) */
  fieldType?: FieldDataType;

  /** Label translation key displayed above text */
  label?: TKey;

  /** Color styling variant */
  variant?: TextVariant;

  /** Enable multi-line text display (preserves newlines) */
  multiline?: boolean;

  /** Text emphasis styling */
  emphasis?: TextEmphasis;

  /** Maximum text length before truncation */
  maxLength?: number;

  /** Display format (link requires href) */
  format?: "link" | "plain";

  /** Link destination when format="link" */
  href?: string;

  /** Text alignment */
  textAlign?: "left" | "center" | "right";

  /** Text size */
  size?: "xs" | "sm" | "base" | "lg" | "xl";

  /** Gap between label and text */
  gap?: SpacingSize;

  /** Padding around text */
  padding?: SpacingSize;

  /** Schema constraint for the field value */
  schema: TSchema;
}
