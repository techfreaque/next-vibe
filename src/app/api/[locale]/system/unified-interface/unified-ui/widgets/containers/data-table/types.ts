/**
 * DataTable Widget Type Definitions
 */

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { WidgetType } from "../../../../shared/types/enums";
import type {
  ArrayChildConstraint,
  BaseArrayWidgetConfig,
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";

/**
 * Common properties shared between array and object data table configurations
 */
interface BaseDataTableConfig<TKey extends string> {
  type: WidgetType.DATA_TABLE;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  pagination?: {
    enabled?: boolean;
    pageSize?: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    position?: "top" | "bottom" | "both";
  };
  sorting?: {
    enabled?: boolean;
    defaultSort?: Array<{
      key: string;
      direction: "asc" | "desc";
    }>;
    multiSort?: boolean;
  };
  filtering?: {
    enabled?: boolean;
    global?: boolean;
    columns?: string[]; // Specific columns to enable filtering on
  };
  rowActions?: Array<{
    label: NoInfer<TKey>;
    icon?: IconKey;
    onClick?: string; // Action ID
  }>;
  selectable?: boolean; // Enable row selection
  hoverable?: boolean; // Highlight row on hover
  striped?: boolean; // Alternate row colors
  compact?: boolean; // Reduce row padding
}

/**
 * Data Table Widget Configuration - Array variant
 * Displays an array of row objects in table format.
 * Each array item is a row; the child's children define the columns.
 */
export interface DataTableArrayWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>
  extends
    BaseArrayWidgetConfig<TKey, TUsage, TSchemaType, TChild>,
    BaseDataTableConfig<TKey> {
  type: WidgetType.DATA_TABLE;
}

/**
 * Data Table Widget Configuration - Object variant
 * Displays a single object as a one-row table.
 * Each child field is a column; the value record holds column values.
 */
export interface DataTableObjectWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>
  extends
    BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren>,
    BaseDataTableConfig<TKey> {
  type: WidgetType.DATA_TABLE;
}

/**
 * Data Table Widget Configuration - Union of array and object variants
 *
 * - Array variant: array of row objects → multi-row table
 * - Object variant: single object → single-row table with children as columns
 */
export type DataTableWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends
    | "array"
    | "array-optional"
    | "object"
    | "object-optional"
    | "widget-object",
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
> =
  // Each union member only resolves when TSchemaType/TChildOrChildren match the variant constraint.
  // Inference at definition sites requires the full union — narrowing happens via hasChild/hasChildren guards at render time.
  | DataTableArrayWidgetConfig<
      TKey,
      TUsage,
      // @ts-expect-error -- TSchemaType is the full union; array variant resolves only when "array"|"array-optional" is passed
      TSchemaType,
      TChildOrChildren
    >
  | DataTableObjectWidgetConfig<
      TKey,
      TUsage,
      // @ts-expect-error -- TSchemaType is the full union; object variant resolves only when "object"|"object-optional" is passed
      TSchemaType,
      TChildOrChildren
    >;
