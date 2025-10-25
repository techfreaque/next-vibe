/**
 * Grouped List Widget
 * Renders data grouped by a specific field with collapsible sections
 */

"use client";

import type { FC } from "react";
import { useState } from "react";

import type { GroupedListWidgetData, WidgetComponentProps } from "../types";

/**
 * Grouped List Widget Component
 */
export const GroupedListWidget: FC<
  WidgetComponentProps<GroupedListWidgetData>
> = ({ data, className = "" }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(data.groups.map((g) => g.key)),
  );

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
    <div className={`space-y-4 ${className}`}>
      {data.groups.map((group) => {
        const isExpanded = expandedGroups.has(group.key);
        const itemCount = group.items.length;
        const displayItems =
          data.maxItemsPerGroup && !isExpanded
            ? group.items.slice(0, data.maxItemsPerGroup)
            : group.items;

        return (
          <div
            key={group.key}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.key)}
              className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {group.label}
                </span>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {itemCount}
                </span>
              </div>
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
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-750">
                <div className="flex flex-wrap gap-4">
                  {Object.entries(group.summary).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {key}:
                      </span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        {typeof value === "object" && value !== null
                          ? JSON.stringify(value)
                          : String(value ?? "")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Group Items */}
            {isExpanded && (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayItems.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3 lg:grid-cols-4">
                      {Object.entries(item).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <div className="font-medium text-gray-700 dark:text-gray-300">
                            {key}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {typeof value === "object" && value !== null
                              ? JSON.stringify(value)
                              : String(value ?? "")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Show More Button */}
                {data.maxItemsPerGroup &&
                  !isExpanded &&
                  itemCount > data.maxItemsPerGroup && (
                    <button
                      onClick={() => {
                        toggleGroup(group.key);
                      }}
                      className="w-full px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-750"
                    >
                      {/* eslint-disable-next-line i18next/no-literal-string */}
                      {`Show ${itemCount - data.maxItemsPerGroup} more`}
                    </button>
                  )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
