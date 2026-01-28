/**
 * Loading Widget Type Definitions
 */

import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Loading Widget Configuration
 */
export interface LoadingWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
  type: WidgetType.LOADING;
  message?: NoInfer<TKey>;
  /** Container padding */
  padding?: SpacingSize;
  /** Gap between spinner and message */
  gap?: SpacingSize;
  /** Message text size */
  messageSize?: "xs" | "sm" | "base" | "lg";
  /** Spinner icon size */
  spinnerSize?: "xs" | "sm" | "base" | "lg";
  /** Progress bar height */
  progressHeight?: "xs" | "sm" | "base";
  /** Spacing within progress container */
  progressSpacing?: SpacingSize;
  /** Percentage text size */
  percentageSize?: "xs" | "sm" | "base";
}
