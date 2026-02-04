/**
 * Icon Widget Types
 * Displays an icon from the icon library
 */

import type { z } from "zod";

import type { IconSchemaType } from "@/app/api/[locale]/shared/types/common.schema";
import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Icon Widget Configuration
 * Displays an icon with customizable size, container, and style
 */
export interface IconWidgetConfig<
  TSchema extends IconSchemaType,
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
  getClassName?: (value: z.output<TSchema>, parentValue?: WidgetData) => string;

  /** Schema constraint for the field value */
  schema: TSchema;
}
