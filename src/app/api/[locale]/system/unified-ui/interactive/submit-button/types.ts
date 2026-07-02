/**
 * Submit Button Widget Type Definitions
 */

import type { SpacingSize, WidgetType } from "next-vibe/core/definition/enums";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "next-vibe/unified-ui/_shared/types";
import type { IconKey } from "next-vibe/unified-ui/form-fields/icon-field/icons";

/**
 * Submit Button Widget Configuration
 */
export interface SubmitButtonWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
  type: WidgetType.SUBMIT_BUTTON;
  text?: NoInfer<TKey>;
  loadingText?: NoInfer<TKey>;
  icon?: IconKey;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost"
    | "outline"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing to the right of icon */
  iconSpacing?: SpacingSize;
}
