/**
 * Avatar Widget Type Definitions
 */

import type { WidgetType } from "next-vibe/core/definition/enums";
import type { StringWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "next-vibe/unified-ui/_shared/types";

/**
 * Avatar Widget Configuration
 */
export interface AvatarWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget" | "primitive",
  TSchema extends TSchemaType extends "widget" ? never : StringWidgetSchema,
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
