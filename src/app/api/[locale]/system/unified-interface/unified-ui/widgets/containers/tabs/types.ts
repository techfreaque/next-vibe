/**
 * Tabs Widget Type Definitions
 */

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type {
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";

/**
 * Tabs Widget Configuration
 */
export interface TabsWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
> extends BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren> {
  type: WidgetType.TABS;
  title?: NoInfer<TKey>;
  tabs?: Array<{
    id: string;
    label: NoInfer<TKey>;
    icon?: IconKey;
    disabled?: boolean;
    badge?: string | number;
  }>;
  defaultTab?: string;
  /** Empty state padding */
  emptyPadding?: SpacingSize;
  /** Gap between icon and label in trigger */
  triggerGap?: SpacingSize;
  /** Icon size in trigger */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Top margin for content */
  contentMargin?: SpacingSize;
  /** Content text size */
  contentTextSize?: "xs" | "sm" | "base" | "lg";
  /** Pre padding for JSON content */
  prePadding?: SpacingSize;
  /** Pre border radius */
  preBorderRadius?: "none" | "sm" | "base" | "lg" | "xl";
  variant?: "default" | "outline" | "pills";
  orientation?: "horizontal" | "vertical";
  keepMounted?: boolean;
}
