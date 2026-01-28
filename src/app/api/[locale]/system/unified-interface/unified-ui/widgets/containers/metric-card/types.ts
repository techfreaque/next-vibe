/**
 * Metric Card Widget Type Definitions
 */

import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type {
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import type { IconKey } from "../../form-fields/icon-field/icons";

/**
 * Metric Card Widget Configuration
 */
export interface MetricCardWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
> extends BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren> {
  type: WidgetType.METRIC_CARD;
  title: NoInfer<TKey>;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  format?: "number" | "currency" | "percentage" | "bytes";
  icon?: IconKey;
  unit?: string;
  precision?: number;
  threshold?: {
    warning?: number;
    error?: number;
  };
  // Spacing config
  headerGap?: SpacingSize; // Gap in card header
  headerPadding?: SpacingSize; // Padding bottom for header
  valueGap?: SpacingSize; // Gap between value and trend
  unitSpacing?: SpacingSize; // Margin for unit
  trendGap?: SpacingSize; // Gap in trend indicator
  // Text size config
  titleSize?: "xs" | "sm" | "base" | "lg"; // Title text size
  iconSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"; // Icon size
  valueSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"; // Value text size
  unitSize?: "xs" | "sm" | "base" | "lg"; // Unit text size
  trendSize?: "xs" | "sm" | "base" | "lg"; // Trend text size
  trendIconSize?: "xs" | "sm" | "base" | "lg"; // Trend icon size
}
