/**
 * Icon Widget Types
 * Displays an icon from the icon library
 */

import type { z } from "zod";

import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Icon widget schema - must be a valid icon key
 */
export type IconWidgetSchema = z.ZodType<IconKey>;

/**
 * Icon Widget Configuration
 * Displays an icon with customizable size, container, and style
 */
export interface IconWidgetConfig<
  TSchema extends IconWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.ICON;

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

  /** Schema constraint for the field value */
  schema: TSchema;
}
