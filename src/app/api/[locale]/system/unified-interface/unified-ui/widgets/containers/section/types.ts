/**
 * Section Widget Type Definitions
 */

import type { z } from "zod";

import type {
  LayoutType,
  SpacingSize,
  WidgetType,
} from "../../../../shared/types/enums";
import type { LayoutConfig } from "../../../../shared/widgets/layout-config";
import type {
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";

/**
 * Section widget requires an object schema
 */
export type SectionWidgetSchema = z.ZodObject<z.ZodRawShape>;

/**
 * Section Widget Configuration
 */
export interface SectionWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
> extends BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren> {
  type: WidgetType.SECTION;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  layoutType?: LayoutType;
  layout?: LayoutConfig; // Layout configuration for section content
  columns?: number; // Number of columns for section layout
  spacing?: "compact" | "normal" | "relaxed"; // Spacing within section
  collapsible?: boolean; // Allow section to be collapsed
  defaultCollapsed?: boolean; // Start collapsed (requires collapsible: true)
  /** Empty state text size */
  emptyTextSize?: "xs" | "sm" | "base";
  /** Header padding for collapsible sections */
  headerPadding?: SpacingSize;
  /** Chevron icon size */
  chevronIconSize?: "xs" | "sm" | "base" | "lg";
  /** Chevron button size */
  chevronButtonSize?: "xs" | "sm" | "base" | "lg";
}
