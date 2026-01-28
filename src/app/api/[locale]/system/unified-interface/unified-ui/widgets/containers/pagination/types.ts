/**
 * Pagination Widget Type Definitions
 */

import type { z } from "zod";

import type { UnifiedField } from "../../../../shared/types/endpoint";
import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type {
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
    page: UnifiedField<TKey, z.ZodTypeAny, ConstrainedChildUsage<TUsage>, any>; // oxlint-disable-line typescript/no-explicit-any;
    limit: UnifiedField<TKey, z.ZodTypeAny, ConstrainedChildUsage<TUsage>, any>; // oxlint-disable-line typescript/no-explicit-any;
    totalCount: UnifiedField<
      TKey,
      z.ZodTypeAny,
      ConstrainedChildUsage<TUsage>,
      // oxlint-disable-next-line typescript/no-explicit-any
      any
    >;
    pageCount?: UnifiedField<
      TKey,
      z.ZodTypeAny,
      ConstrainedChildUsage<TUsage>,
      // oxlint-disable-next-line typescript/no-explicit-any
      any
    >;
    offset?: UnifiedField<
      TKey,
      z.ZodTypeAny,
      ConstrainedChildUsage<TUsage>,
      // oxlint-disable-next-line typescript/no-explicit-any
      any
    >;
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
