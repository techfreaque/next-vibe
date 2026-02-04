/**
 * Pagination Widget Type Definitions
 */

import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type {
  AnyChildrenConstrain,
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Pagination Widget Config
 *
 * Enforces that pagination must have specific fields with correct types.
 * This enables full type safety from config -> children -> field.value.
 *
 * Required children:
 * - page: Current page number
 * - limit: Items per page
 * - totalCount: Total number of items
 *
 * Optional children:
 * - pageCount: Total number of pages
 * - offset: Current offset
 */
export interface PaginationWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends {
    page: AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>;
    limit: AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>;
    totalCount: AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>;
    pageCount?: AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>;
    offset?: AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>;
  },
> extends BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren> {
  type: WidgetType.PAGINATION;
  /** Top border */
  showBorder?: boolean;
  /** Container padding */
  padding?: SpacingSize;
  /** Container margin */
  margin?: SpacingSize;
  /** Gap between info and controls */
  controlsGap?: SpacingSize;
  /** Gap between elements */
  elementGap?: SpacingSize;
  /** Text size */
  textSize?: "xs" | "sm" | "base";
  /** Select width */
  selectWidth?: "sm" | "base" | "lg";
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
}
