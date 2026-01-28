/**
 * Data Grid Widget Type Definitions
 */

import type { z } from "zod";

import type {
  LayoutType,
  SpacingSize,
  WidgetType,
} from "../../../../shared/types/enums";
import type {
  ArrayChildConstraint,
  BaseArrayWidgetConfig,
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";

/**
 * Data Grid widget requires an array or object schema
 */
// oxlint-disable-next-line typescript/no-explicit-any
export type DataGridWidgetSchema =
  | z.ZodArray<z.ZodTypeAny>
  | z.ZodObject<z.ZodRawShape>;

/**
 * Data Grid Widget Configuration
 *
 * Uses distribution to properly narrow union types:
 * - When TSchemaType is "array" | "array-optional", only ArrayConfig is valid
 * - When TSchemaType is "object" | "object-optional" | "widget-object", only ObjectConfig is valid
 * - TChildOrChildren must match the respective constraint
 */
// oxlint-disable-next-line typescript/no-explicit-any
export type DataGridWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends
    | "array"
    | "object"
    | "object-optional"
    | "array-optional"
    | "widget-object",
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
> = TSchemaType extends "array" | "array-optional"
  ? TChildOrChildren extends ArrayChildConstraint<
      TKey,
      ConstrainedChildUsage<TUsage>
    >
    ? DataGridArrayWidgetConfig<
        TKey,
        TUsage,
        TSchemaType & ("array" | "array-optional"),
        TChildOrChildren
      >
    : never
  : TSchemaType extends "object" | "object-optional" | "widget-object"
    ? TChildOrChildren extends ObjectChildrenConstraint<
        TKey,
        ConstrainedChildUsage<TUsage>
      >
      ? DataGridObjectWidgetConfig<
          TKey,
          TUsage,
          TSchemaType & ("object" | "object-optional" | "widget-object"),
          TChildOrChildren
        >
      : never
    : never;

interface BaseDataGridWidgetConfig<TKey extends string> {
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  layoutType?: LayoutType; // Layout type for grid
  gap?: SpacingSize; // Gap between grid items
  padding?: SpacingSize; // Padding inside grid
  responsive?: boolean; // Enable responsive column adjustment
  minColumnWidth?: number | string; // Minimum column width (e.g., 200, "200px", "15rem")
}

// oxlint-disable-next-line typescript/no-explicit-any
export interface DataGridObjectWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>
  extends
    BaseDataGridWidgetConfig<TKey>,
    BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren> {
  type: WidgetType.DATA_GRID;
}

// oxlint-disable-next-line typescript/no-explicit-any
export interface DataGridArrayWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>
  extends
    BaseDataGridWidgetConfig<TKey>,
    BaseArrayWidgetConfig<TKey, TUsage, TSchemaType, TChild> {
  type: WidgetType.DATA_GRID;
}
