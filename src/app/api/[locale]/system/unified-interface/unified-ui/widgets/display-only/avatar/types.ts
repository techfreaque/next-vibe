/**
 * Avatar Widget Type Definitions
 */

import type { WidgetType } from "../../../../shared/types/enums";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Avatar Widget Configuration
 */
export interface AvatarWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, "widget"> {
  type: WidgetType.AVATAR;
  src?: string;
  alt?: NoInfer<TKey>;
  fallback?: string;
  /** Avatar size */
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  /** Fallback text size */
  fallbackSize?: "xs" | "sm" | "base" | "lg";
}
