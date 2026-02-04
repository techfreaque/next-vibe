/**
 * Avatar Widget Type Definitions
 */

import type { WidgetType } from "../../../../shared/types/enums";
import type { StringWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Avatar Widget Configuration
 */
export interface AvatarWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget" | "primitive",
  TSchema extends StringWidgetSchema,
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.AVATAR;
  src?: string;
  alt?: NoInfer<TKey>;
  fallback?: string;
  /** Avatar size */
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  /** Fallback text size */
  fallbackSize?: "xs" | "sm" | "base" | "lg";
}
