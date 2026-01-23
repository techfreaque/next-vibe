/**
 * Widget Schema Constraints
 *
 * Type utilities for constraining schemas based on widget type.
 */

import type { z } from "zod";

import type { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";

// ============================================================================
// SCHEMA TYPE CONSTRAINTS
// ============================================================================

/**
 * Number widgets: Stat, MetricCard, Progress, Slider
 */
export type NumberWidgetSchema =
  | z.ZodNumber
  | z.ZodOptional<z.ZodNumber>
  | z.ZodNullable<z.ZodNumber>
  | z.ZodDefault<z.ZodNumber>
  | z.ZodDefault<z.ZodOptional<z.ZodNumber>>
  | z.ZodDefault<z.ZodNullable<z.ZodNumber>>
  | z.ZodOptional<z.ZodNullable<z.ZodNumber>>
  | z.ZodNullable<z.ZodOptional<z.ZodNumber>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | z.ZodCoercedNumber<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | z.ZodOptional<z.ZodCoercedNumber<any>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | z.ZodNullable<z.ZodCoercedNumber<any>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<any>>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | z.ZodDefault<z.ZodNullable<z.ZodCoercedNumber<any>>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | z.ZodDefault<z.ZodCoercedNumber<any>>;

/**
 * String widgets: Text, Title, Markdown, Link, etc.
 */
export type StringWidgetSchema =
  | z.ZodString
  | z.ZodOptional<z.ZodString>
  | z.ZodNullable<z.ZodString>
  | z.ZodDefault<z.ZodString>
  | z.ZodOptional<z.ZodNullable<z.ZodString>> // .optional().nullable()
  | z.ZodNullable<z.ZodOptional<z.ZodString>> // .nullable().optional()
  | z.ZodDefault<z.ZodOptional<z.ZodString>>
  | z.ZodDefault<z.ZodNullable<z.ZodString>>
  | z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>
  | z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodString>>>;

/**
 * Boolean widgets: Checkbox, StatusIndicator
 */
export type BooleanWidgetSchema =
  | z.ZodBoolean
  | z.ZodOptional<z.ZodBoolean>
  | z.ZodNullable<z.ZodBoolean>
  | z.ZodDefault<z.ZodBoolean>
  | z.ZodDefault<z.ZodOptional<z.ZodBoolean>>
  | z.ZodDefault<z.ZodNullable<z.ZodBoolean>>
  | z.ZodOptional<z.ZodNullable<z.ZodBoolean>>
  | z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;

/**
 * Date widgets: Date, DateTime, Time
 */
export type DateWidgetSchema = typeof dateSchema;

/**
 * Array widgets: DataList, DataCards, GroupedList, DataTable
 */
export type ArrayWidgetSchema<TItem extends z.ZodTypeAny = z.ZodTypeAny> =
  | z.ZodArray<TItem>
  | z.ZodOptional<z.ZodArray<TItem>>
  | z.ZodNullable<z.ZodArray<TItem>>
  | z.ZodDefault<z.ZodArray<TItem>>
  | z.ZodDefault<z.ZodOptional<z.ZodArray<TItem>>>
  | z.ZodDefault<z.ZodNullable<z.ZodArray<TItem>>>
  | z.ZodOptional<z.ZodNullable<z.ZodArray<TItem>>>
  | z.ZodNullable<z.ZodOptional<z.ZodArray<TItem>>>;

/**
 * Enum widgets: Select, Badge, FilterPills
 */
export type EnumWidgetSchema =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | z.ZodEnum<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | z.ZodOptional<z.ZodEnum<any>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | z.ZodNullable<z.ZodEnum<any>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | z.ZodDefault<z.ZodEnum<any>>;
