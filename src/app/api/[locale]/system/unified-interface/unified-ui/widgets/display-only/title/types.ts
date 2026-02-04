/**
 * Title Widget Types
 * Displays semantic HTML headings (H1-H6) with optional subtitle
 */

import type { z } from "zod";

import type {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Spacing sizes for gaps and margins
 */
export type SpacingSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";

/**
 * Title object schema - for titles with subtitle
 */
export type TitleObjectSchema =
  | z.ZodObject<{
      text: z.ZodString;
      subtitle: z.ZodOptional<z.ZodString>;
    }>
  | z.ZodOptional<
      z.ZodObject<{
        text: z.ZodString;
        subtitle: z.ZodOptional<z.ZodString>;
      }>
    >
  | z.ZodNullable<
      z.ZodObject<{
        text: z.ZodString;
        subtitle: z.ZodOptional<z.ZodString>;
      }>
    >;

/**
 * Title schema constraint - accepts:
 * - string (simple title text)
 * - object with { text, subtitle? } (title with optional subtitle)
 */
export type TitleWidgetSchema = StringWidgetSchema | TitleObjectSchema;

/**
 * Title Widget Configuration
 *
 * Display modes (priority order):
 * 1. Static content from `content` property (fixed title)
 * 2. Date formatting if fieldType is DATE/DATETIME
 * 3. Dynamic value from data (string or {text, subtitle})
 */
export interface TitleWidgetConfig<
  out TKey extends string,
  TSchema extends TitleWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget" | "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.TITLE;

  /** Static content translation key - use for fixed titles */
  content?: TKey;

  /** Heading level (1-6) - overrides data level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  /** Field type for special formatting (DATE, DATETIME) */
  fieldType?: FieldDataType;

  /** Text alignment */
  textAlign?: "left" | "center" | "right";

  /** Text size */
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";

  /** Gap between title and subtitle */
  gap?: SpacingSize;

  /** Subtitle margin top */
  subtitleGap?: SpacingSize;

  /**
   * Function to extract a count from data to append to title
   * Example: "List Leads (42)"
   * Receives data from parent context (e.g., form values)
   */
  // oxlint-disable-next-line typescript/no-explicit-any
  getCount?: (data: any) => number | undefined;

  /** Schema constraint for the field value */
  schema: TSchema;
}
