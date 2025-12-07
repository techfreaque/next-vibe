/**
 * Grouped List Widget
 * Displays grouped lists of items
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { type WidgetComponentProps } from "../../../shared/widgets/types";
import {
  extractGroupedListData,
  getDisplayItems,
  getRemainingItemsCount,
} from "../../../shared/widgets/logic/grouped-list";
import { formatDisplayValue } from "../../../shared/widgets/utils/formatting";

/**
 * Grouped List Widget Component
 */
export function GroupedListWidget({
  value,
  field: _field,
  context: _context,
  className = "",
}: WidgetComponentProps): JSX.Element {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Extract data using shared logic
  const data = extractGroupedListData(value);

  useEffect(() => {
    if (data && data.groups.length > 0) {
      const groupKeys = data.groups.map((g) => g.key).join(",");
      setExpandedGroups(new Set(groupKeys.split(",")));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.groups.length]);

  // Handle null case
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
    <Div className={`flex flex-col gap-4 ${className}`}>
      {groups.map((group) => {
        const groupKey = group.key;
        const groupLabel = group.label;
        const groupItems = group.items;
        const groupSummary = group.summary;

        const isExpanded = expandedGroups.has(groupKey);
        const itemCount = groupItems.length;
        const displayItems = getDisplayItems(
          groupItems,
          maxItemsPerGroup,
          isExpanded,
        );
        const remainingCount = getRemainingItemsCount(
          itemCount,
          maxItemsPerGroup,
        );

        return (
          <Div
            key={groupKey}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Group Header */}
            <Button
              variant="ghost"
              onClick={() => toggleGroup(groupKey)}
              className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
              type="button"
            >
              <Div className="flex items-center gap-3">
                <Span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {groupLabel}
                </Span>
                <Span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {itemCount}
                </Span>
              </Div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </Button>

            {/* Group Summary */}
            {showGroupSummary && groupSummary && (
              <Div className="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-750">
                <Div className="flex flex-wrap gap-4">
                  {Object.entries(groupSummary).map(([key, value]) => (
                    <Div key={key} className="text-sm">
                      <Span className="font-medium text-gray-700 dark:text-gray-300">
                        {key}:
                      </Span>{" "}
                      <Span className="text-gray-600 dark:text-gray-400">
                        {formatDisplayValue(value)}
                      </Span>
                    </Div>
                  ))}
                </Div>
              </Div>
            )}

            {/* Group Items */}
            {isExpanded && (
              <Div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayItems.map((item, itemIndex: number) => {
                  return (
                    <Div
                      key={itemIndex}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750"
                    >
                      <Div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3 lg:grid-cols-4">
                        {Object.entries(item).map(([key, value]) => (
                          <Div key={key} className="text-sm">
                            <Div className="font-medium text-gray-700 dark:text-gray-300">
                              {key}
                            </Div>
                            <Div className="text-gray-600 dark:text-gray-400">
                              {formatDisplayValue(value)}
                            </Div>
                          </Div>
                        ))}
                      </Div>
                    </Div>
                  );
                })}

                {/* Show More Button */}
                {!isExpanded && remainingCount > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      toggleGroup(groupKey);
                    }}
                    className="w-full px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-750"
                  >
                    {/* eslint-disable-next-line i18next/no-literal-string */}
                    {`Show ${remainingCount} more`}
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
