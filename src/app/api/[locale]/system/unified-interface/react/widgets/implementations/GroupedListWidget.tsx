"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import {
  extractGroupedListData,
  getDisplayItems,
  getRemainingItemsCount,
} from "../../../shared/widgets/logic/grouped-list";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { isWidgetDataString } from "../../../shared/widgets/utils/field-type-guards";
import { formatDisplayValue } from "../../../shared/widgets/utils/formatting";
import {
  getIconSizeClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Grouped List Widget - Displays items in expandable groups with summaries
 *
 * Organizes array data into collapsible groups based on a field value. Each group
 * shows a header with item count, optional summary stats, and expandable item details.
 * Automatically translates group labels and field keys.
 *
 * Features:
 * - Collapsible group sections with smooth transitions
 * - Group-level summary statistics
 * - Item count badges on group headers
 * - Configurable max items per group with "show more" button
 * - Grid layout for item details (2-4 columns responsive)
 * - Hover effects on items
 * - Dark mode support
 * - Automatic group expansion on mount
 *
 * UI Config Options:
 * - groupBy: Field name to group items by
 * - sortBy: Optional field to sort groups
 *
 * Data Format:
 * - object: {
 *     groups: Array<{
 *       key: string - Unique group identifier
 *       label: string - Group header text (translated via context.t)
 *       items: Array<Record<string, any>> - Items in this group
 *       summary?: Record<string, any> - Optional aggregated stats for group
 *     }>
 *     maxItemsPerGroup?: number - Initial items shown before "show more"
 *     showGroupSummary?: boolean - Whether to display summary stats
 *   }
 * - null/undefined: Shows "—" placeholder
 *
 * @param value - Grouped list data or raw array (grouped via UI config)
 * @param field - Field definition with UI config (groupBy, sortBy)
 * @param className - Optional CSS classes
 */
export function GroupedListWidget<const TKey extends string>({
  value,
  field,
  context,
  className = "",
}: ReactWidgetProps<typeof WidgetType.GROUPED_LIST, TKey>): JSX.Element {
  const {
    groupBy,
    sortBy,
    gap,
    headerPadding,
    headerGap,
    badgePadding,
    summaryPadding,
    summaryGap,
    itemPadding,
    itemGapX,
    itemGapY,
    buttonPadding,
    groupLabelSize,
    badgeSize,
    iconSize,
    summarySize,
    itemSize,
    buttonSize,
  } = field.ui;

  // Get classes from config (no hardcoding!)
  const gapClass = getSpacingClassName("gap", gap);
  const headerPaddingClass = getSpacingClassName("padding", headerPadding);
  const headerGapClass = getSpacingClassName("gap", headerGap);
  const badgePaddingClass = getSpacingClassName("padding", badgePadding);
  const summaryPaddingClass = getSpacingClassName("padding", summaryPadding);
  const summaryGapClass = getSpacingClassName("gap", summaryGap);
  const itemPaddingClass = getSpacingClassName("padding", itemPadding);
  const itemGapXClass = getSpacingClassName("gap", itemGapX);
  const itemGapYClass = getSpacingClassName("gap", itemGapY);
  const buttonPaddingClass = getSpacingClassName("padding", buttonPadding);
  const groupLabelSizeClass = getTextSizeClassName(groupLabelSize);
  const badgeSizeClass = getTextSizeClassName(badgeSize);
  const iconSizeClass = getIconSizeClassName(iconSize);
  const summarySizeClass = getTextSizeClassName(summarySize);
  const itemSizeClass = getTextSizeClassName(itemSize);
  const buttonSizeClass = getTextSizeClassName(buttonSize);

  const { t } = simpleT(context.locale);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const config = field.type === "array" && groupBy ? { groupBy, sortBy } : undefined;

  const data = extractGroupedListData(value, config);
  const prevGroupCount = useRef<number | undefined>(undefined);

  useEffect(() => {
    const currentGroupCount = data?.groups.length ?? 0;
    // Only update expanded groups when the count actually changes
    if (prevGroupCount.current !== currentGroupCount && data && data.groups.length > 0) {
      prevGroupCount.current = currentGroupCount;
      const groupKeys = data.groups.map((g) => g.key).join(",");
      setExpandedGroups(new Set(groupKeys.split(",")));
    }
  }, [data]);

  if (!data) {
    return <Div className={className}>—</Div>;
  }

  const { groups, maxItemsPerGroup, showGroupSummary } = data;

  const toggleGroup = (groupKey: string): void => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  return (
    <Div className={cn("flex flex-col", gapClass || "gap-4", className)}>
      {groups.map((group) => {
        const groupKey = group.key;
        const groupLabel = isWidgetDataString(group.label, context);
        const groupItems = group.items;
        const groupSummary = group.summary;

        const isExpanded = expandedGroups.has(groupKey);
        const itemCount = groupItems.length;
        const displayItems = getDisplayItems(groupItems, maxItemsPerGroup, isExpanded);
        const remainingCount = getRemainingItemsCount(itemCount, maxItemsPerGroup);

        return (
          <Div
            key={groupKey}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <Button
              variant="ghost"
              onClick={() => toggleGroup(groupKey)}
              className={cn(
                "flex w-full items-center justify-between bg-gray-50 text-left hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600",
                headerPaddingClass || "px-4 py-3",
              )}
              type="button"
            >
              <Div className={cn("flex items-center", headerGapClass || "gap-3")}>
                <Span
                  className={cn(
                    "font-semibold text-gray-900 dark:text-gray-100",
                    groupLabelSizeClass || "text-lg",
                  )}
                >
                  {groupLabel}
                </Span>
                <Span
                  className={cn(
                    "rounded-full bg-blue-100 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                    badgePaddingClass || "px-2 py-1",
                    badgeSizeClass || "text-xs",
                  )}
                >
                  {itemCount}
                </Span>
              </Div>
              <ChevronDown
                className={cn(
                  iconSizeClass,
                  "text-gray-500 transition-transform",
                  isExpanded && "rotate-180",
                )}
              />
            </Button>

            {showGroupSummary && groupSummary && (
              <Div
                className={cn(
                  "border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-750",
                  summaryPaddingClass || "px-4 py-2",
                )}
              >
                <Div className={cn("flex flex-wrap", summaryGapClass || "gap-4")}>
                  {Object.entries(groupSummary).map(([key, value]) => {
                    const translatedKey = isWidgetDataString(key, context);
                    return (
                      <Div key={key} className={cn(summarySizeClass || "text-sm")}>
                        <Span className="font-medium text-gray-700 dark:text-gray-300">
                          {translatedKey}:
                        </Span>{" "}
                        <Span className="text-gray-600 dark:text-gray-400">
                          {formatDisplayValue(value)}
                        </Span>
                      </Div>
                    );
                  })}
                </Div>
              </Div>
            )}

            {isExpanded && (
              <Div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayItems.map((item, itemIndex: number) => {
                  return (
                    <Div
                      key={itemIndex}
                      className={cn(
                        "hover:bg-gray-50 dark:hover:bg-gray-750",
                        itemPaddingClass || "px-4 py-3",
                      )}
                    >
                      <Div
                        className={cn(
                          "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
                          itemGapXClass || "gap-x-4",
                          itemGapYClass || "gap-y-2",
                        )}
                      >
                        {Object.entries(item).map(([key, value]) => {
                          const translatedKey = isWidgetDataString(key, context);
                          return (
                            <Div key={key} className={cn(itemSizeClass || "text-sm")}>
                              <Div className="font-medium text-gray-700 dark:text-gray-300">
                                {translatedKey}
                              </Div>
                              <Div className="text-gray-600 dark:text-gray-400">
                                {formatDisplayValue(value)}
                              </Div>
                            </Div>
                          );
                        })}
                      </Div>
                    </Div>
                  );
                })}

                {!isExpanded && remainingCount > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      toggleGroup(groupKey);
                    }}
                    className={cn(
                      "w-full text-center font-medium text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-750",
                      buttonPaddingClass || "px-4 py-2",
                      buttonSizeClass || "text-sm",
                    )}
                  >
                    {t("app.api.system.unifiedInterface.react.widgets.groupedList.showMore", {
                      count: remainingCount,
                    })}
                  </Button>
                )}
              </Div>
            )}
          </Div>
        );
      })}
    </Div>
  );
}

GroupedListWidget.displayName = "GroupedListWidget";
