/**
 * Grouped List Widget
 * Renders data grouped by a specific field with collapsible sections
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import type {
  GroupedListWidgetData,
  RenderableValue,
  WidgetComponentProps,
} from "../types";

/**
 * Type guard for GroupedListWidgetData
 */
function isGroupedListWidgetData(
  data: RenderableValue,
): data is GroupedListWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "groups" in data &&
    Array.isArray(data.groups) &&
    "groupBy" in data &&
    typeof data.groupBy === "string"
  );
}

/**
 * Grouped List Widget Component
 */
export const GroupedListWidget = ({
  data,
  metadata: _metadata,
  context: _context,
  className = "",
  style,
}: WidgetComponentProps<RenderableValue>): JSX.Element => {
  // Initialize hooks before any early returns
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const isValidData = isGroupedListWidgetData(data);
  const typedData = isValidData ? data : null;

  // Set initial expanded groups on mount
  useEffect(() => {
    if (typedData && typedData.groups.length > 0) {
      setExpandedGroups(new Set(typedData.groups.map((g) => g.key)));
    }
  }, [typedData]);

  if (!isValidData || !typedData) {
    return (
      <Div className={className} style={style}>
        —
      </Div>
    );
  }

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
    <Div className={`flex flex-col gap-4 ${className}`} style={style}>
      {typedData.groups.map((group) => {
        const isExpanded = expandedGroups.has(group.key);
        const itemCount = group.items.length;
        const displayItems =
          typedData.maxItemsPerGroup && !isExpanded
            ? group.items.slice(0, typedData.maxItemsPerGroup)
            : group.items;

        return (
          <Div
            key={String(group.key)}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(String(group.key))}
              className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
              type="button"
            >
              <Div className="flex items-center gap-3">
                <Span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {String(group.label)}
                </Span>
                <Span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {itemCount}
                </Span>
              </Div>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Group Summary */}
            {data.showGroupSummary && group.summary && (
              <Div className="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-750">
                <Div className="flex flex-wrap gap-4">
                  {Object.entries(group.summary).map(([key, value]) => (
                    <Div key={key} className="text-sm">
                      <Span className="font-medium text-gray-700 dark:text-gray-300">
                        {key}:
                      </Span>{" "}
                      <Span className="text-gray-600 dark:text-gray-400">
                        {typeof value === "object" && value !== null
                          ? JSON.stringify(value)
                          : String(value ?? "")}
                      </Span>
                    </Div>
                  ))}
                </Div>
              </Div>
            )}

            {/* Group Items */}
            {isExpanded && (
              <Div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayItems.map((item, itemIndex) => (
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
                            {typeof value === "object" && value !== null
                              ? JSON.stringify(value)
                              : String(value ?? "")}
                          </Div>
                        </Div>
                      ))}
                    </Div>
                  </Div>
                ))}

                {/* Show More Button */}
                {typedData.maxItemsPerGroup &&
                  !isExpanded &&
                  itemCount > typedData.maxItemsPerGroup && (
                    <button
                      onClick={() => {
                        toggleGroup(group.key);
                      }}
                      className="w-full px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-750"
                    >
                      {/* eslint-disable-next-line i18next/no-literal-string */}
                      {`Show ${itemCount - (typedData.maxItemsPerGroup ?? 0)} more`}
                    </button>
                  )}
              </Div>
            )}
          </Div>
        );
      })}
    </Div>
  );
};
