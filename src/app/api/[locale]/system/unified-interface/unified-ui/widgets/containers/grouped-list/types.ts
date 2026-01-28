/**
 * GroupedList Widget Type Definitions
 */

import type {
  LayoutType,
  SpacingSize,
  WidgetType,
} from "../../../../shared/types/enums";
import type {
  ArrayChildConstraint,
  BaseArrayWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Grouped List Widget Configuration
 */
export interface GroupedListWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
> extends BaseArrayWidgetConfig<TKey, TUsage, TSchemaType, TChild> {
  type: WidgetType.GROUPED_LIST;
  title?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  groupBy?: string; // Field name from data object to group by (e.g., "file", "status", "category")
  sortBy?: string; // Field name from data object to sort by (e.g., "severity", "createdAt", "name")
  columns?: number;
  hierarchical?: boolean;
  renderMode?: "default" | "compact" | "detailed" | string;
  maxItemsPerGroup?: number; // Maximum items to show per group before truncating
  showSummary?: boolean; // Show summary for each group
  // Spacing config
  gap?: SpacingSize; // Gap between groups
  headerPadding?: SpacingSize; // Padding for group header button
  headerGap?: SpacingSize; // Gap between group title and badge
  badgePadding?: SpacingSize; // Padding for item count badge
  summaryPadding?: SpacingSize; // Padding for summary section
  summaryGap?: SpacingSize; // Gap between summary items
  itemPadding?: SpacingSize; // Padding for each item
  itemGapX?: SpacingSize; // Horizontal gap in item grid
  itemGapY?: SpacingSize; // Vertical gap in item grid
  buttonPadding?: SpacingSize; // Padding for show more button
  // Text size config
  groupLabelSize?: "xs" | "sm" | "base" | "lg" | "xl"; // Group label text size
  badgeSize?: "xs" | "sm" | "base" | "lg"; // Badge text size
  iconSize?: "xs" | "sm" | "base" | "lg"; // Chevron icon size
  summarySize?: "xs" | "sm" | "base" | "lg"; // Summary text size
  itemSize?: "xs" | "sm" | "base" | "lg"; // Item text size
  buttonSize?: "xs" | "sm" | "base" | "lg"; // Show more button text size
  summaryTemplate?: string; // Template for group summary rendering
  layoutType?: LayoutType; // Layout type for group display
}
