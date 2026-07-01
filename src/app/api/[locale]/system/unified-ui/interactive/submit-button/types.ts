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

/**
 * Type-safe submit button field for direct use in custom widgets.
 * Usage: `<SubmitButtonWidget field={{ text: "key" } satisfies SubmitButtonField<typeof definition.POST>} />`
 */
export type SubmitButtonField<
  TEndpoint extends { scopedTranslation: { ScopedTranslationKey: string } },
> = Pick<
  SubmitButtonWidgetConfig<
    TEndpoint["scopedTranslation"]["ScopedTranslationKey"],
    FieldUsageConfig,
    "widget"
  >,
  | "text"
  | "loadingText"
  | "icon"
  | "variant"
  | "size"
  | "iconSize"
  | "iconSpacing"
>;
