/**
 * Search Bar Widget Types
 * Compound widget: large text input + submit button in one row.
 */

import type { WidgetType } from "next-vibe/core/definition/enums";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "next-vibe/unified-ui/_shared/types";
import type { IconKey } from "next-vibe/unified-ui/form-fields/icon-field/icons";
import type { z } from "zod";

/**
 * Search Bar Widget Configuration
 * Renders a prominent input + submit button row.
 * On web: large rounded input with button flush right.
 * On CLI: standard text input with [Search] prompt.
 */
export interface SearchBarWidgetConfig<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget" = "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.SEARCH_BAR;
  /** Form field name for the query input */
  fieldName: string;
  /** Placeholder translation key */
  placeholder?: NoInfer<TKey>;
  /** Submit button label translation key */
  submitText?: NoInfer<TKey>;
  /** Submit button loading text translation key */
  submitLoadingText?: NoInfer<TKey>;
  /** Submit button icon */
  submitIcon?: IconKey;
  /**
   * Visual size variant.
   * - sm: compact, for sidebars and inline use
   * - default: standard form row
   * - xl: hero/landing search bar
   */
  size?: "sm" | "default" | "xl";
}
