/**
 * Empty State Widget Type Definitions
 */

import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";
import type { IconKey } from "../../form-fields/icon-field/icons";

/**
 * Empty State Widget Configuration
 */
export interface EmptyStateWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
  type: WidgetType.EMPTY_STATE;
  title: NoInfer<TKey>;
  message?: NoInfer<TKey>;
  icon?: IconKey;
  action?: {
    text: NoInfer<TKey>;
    onClick?: string;
  };
  /** Container padding */
  padding?: SpacingSize;
  /** Icon container size */
  iconContainerSize?: "sm" | "md" | "lg";
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing after icon */
  iconSpacing?: SpacingSize;
  /** Title text size */
  titleSize?: "xs" | "sm" | "base" | "lg" | "xl";
  /** Spacing after title */
  titleSpacing?: SpacingSize;
  /** Description text size */
  descriptionSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing after description */
  descriptionSpacing?: SpacingSize;
}
