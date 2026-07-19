/**
 * Icon Widget Types
 * Displays an icon from the icon library
 */

import type {
  IconSchemaGenericType,
  IconSchemaNullishType,
  IconSchemaOptionalType,
  IconSchemaType,
} from "next-vibe/core/definition/common.schema";
import type { WidgetType } from "next-vibe/core/definition/enums";
import type { WidgetData } from "next-vibe/core/utils/json";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "next-vibe/unified-ui/_shared/types";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import type { z } from "zod";

/**
 * Icon Widget Configuration
 * Displays an icon with customizable size, container, and style
 */
export interface IconWidgetConfig<
  TSchema extends
    | IconSchemaType
    | IconSchemaOptionalType
    | IconSchemaNullishType
    | IconSchemaGenericType,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.ICON;

  /** Static icon key - use for fixed icons */
  icon?: IconKey;

  /** Container size */
  containerSize?: "xs" | "sm" | "base" | "lg" | "xl";

  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg" | "xl";

  /** Border radius */
  borderRadius?: "none" | "sm" | "base" | "lg" | "xl" | "2xl" | "full";

  /** Disable hover effect */
  noHover?: boolean;

  /** Icon horizontal alignment within container (start = left, center = centered, end = right) */
  justifyContent?: "start" | "center" | "end";

  /**
   * Dynamic className callback - receives field value and parent value
   * Returns additional className to merge with static className
   */
  getClassName?: <
    TSchema extends
      | IconSchemaType
      | IconSchemaOptionalType
      | IconSchemaNullishType,
  >(
    value: TSchema extends
      | IconSchemaType
      | IconSchemaOptionalType
      | IconSchemaNullishType
      ? z.output<TSchema>
      : undefined,
    parentValue?: WidgetData,
  ) => string;

  /** Schema constraint for the field value */
  schema: TSchema;
}
