/**
 * Chart Widget Type Definitions
 */

import { z } from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Chart data point schema - single data point with x/y coordinates
 */
export const ChartDataPointSchema = z.object({
  x: z.string(),
  y: z.number(),
  label: z.string().optional() as z.ZodType<TranslationKey | undefined>,
  color: z.string().optional(),
});

/**
 * Chart series schema - named series with array of data points
 */
export const ChartSeriesSchema = z.object({
  name: z.string(),
  data: z.array(ChartDataPointSchema),
  color: z.string().optional(),
});

/**
 * Chart widget schema - supports three formats:
 * 1. Array of data points: [{x: "Jan", y: 100}, {x: "Feb", y: 200}]
 * 2. Array of series: [{name: "Series 1", data: [...]}, {name: "Series 2", data: [...]}]
 * 3. Record of named series: {series1: [{x, y}], series2: [{x, y}]}
 */
export type ChartWidgetSchema =
  | z.ZodArray<typeof ChartDataPointSchema>
  | z.ZodArray<typeof ChartSeriesSchema>
  | z.ZodRecord<z.ZodString, z.ZodArray<typeof ChartDataPointSchema>>;

/**
 * Chart Widget Configuration
 */
export interface ChartWidgetConfig<
  TKey extends string,
  TSchema extends ChartWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.CHART;
  title?: NoInfer<TKey>;
  label?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  chartType?: "line" | "bar" | "pie" | "area" | "donut" | "scatter" | "radar";
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  colors?: string[]; // Custom color palette for chart
  stacked?: boolean; // Stack bar/area charts
  curved?: boolean; // Use curved lines for line/area charts
  showDataLabels?: boolean; // Show values on data points
  legendPosition?: "top" | "bottom" | "left" | "right";
  responsive?: boolean; // Enable responsive sizing
  /** Title text size */
  titleTextSize?: "xs" | "sm" | "base" | "lg";
  /** Description text size */
  descriptionTextSize?: "xs" | "sm" | "base";
  /** Empty state text size */
  emptyTextSize?: "xs" | "sm" | "base";
  /** Legend container gap */
  legendGap?: SpacingSize;
  /** Gap between legend items */
  legendItemGap?: SpacingSize;
  /** Legend text size */
  legendTextSize?: "xs" | "sm" | "base";
  /** Legend margin top */
  legendMarginTop?: SpacingSize;
  schema: TSchema;
}
