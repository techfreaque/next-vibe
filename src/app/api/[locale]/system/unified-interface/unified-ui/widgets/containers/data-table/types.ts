/**
 * DataTable Widget Type Definitions
 */

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { WidgetType } from "../../../../shared/types/enums";
import type {
  ArrayChildConstraint,
  BaseArrayWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Data Table Widget Configuration
 * Array-only widget that displays data in a table format
 */
export interface DataTableWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
> extends BaseArrayWidgetConfig<TKey, TUsage, TSchemaType, TChild> {
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
