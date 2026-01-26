/**
 * Stat Widget Type Definitions
 */

import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type { NumberWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";
import type { IconKey } from "../../form-fields/icon-field/icons";

/**
 * Stat Widget Configuration
 */
export interface StatWidgetConfig<
  TKey extends string,
  TSchema extends NumberWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BasePrimitiveWidgetConfig<TUsage, "primitive", TSchema> {
  type: WidgetType.STAT;
  label?: NoInfer<TKey>;
  format?: "number" | "percentage" | "currency" | "compact";
  icon?: IconKey;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  size?: "sm" | "md" | "lg";
  /** Card padding */
  padding?: SpacingSize;
  /** Value text size */
  valueSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  /** Label text size */
  labelSize?: "xs" | "sm" | "base" | "lg";
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing after icon */
  iconSpacing?: SpacingSize;
  /** Trend indicator size */
  trendSize?: "xs" | "sm" | "base";
  /** Trend icon size */
  trendIconSize?: "xs" | "sm" | "base";
  /** Gap in trend indicator */
  trendGap?: SpacingSize;
  /** Spacing after trend */
  trendSpacing?: SpacingSize;
  /** Spacing after value (before label) */
  labelSpacing?: SpacingSize;
  schema: TSchema;
}
