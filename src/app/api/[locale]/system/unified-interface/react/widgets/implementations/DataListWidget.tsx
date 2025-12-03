"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { Title } from "next-vibe-ui/ui/title";
import type { JSX } from "react";
import { useState } from "react";

import { simpleT } from "@/i18n/core/shared";

import {
  extractDataListData,
  getListDisplayItems,
  getRemainingListItemsCount,
  type ListItem,
} from "../../../shared/widgets/logic/data-list";
import { type WidgetComponentProps } from "../../../shared/widgets/types";

/**
 * Data List Widget Component
 * Displays a vertical list with optional bullets and title
 */
export function DataListWidget({
  value,
  field: _field,
  context,
  className,
}: WidgetComponentProps): JSX.Element {
  const { t } = simpleT(context.locale);
  const [showAll, setShowAll] = useState(false);

  // Extract data using shared logic
  const data = extractDataListData(value);

  // Handle null case
  if (!data) {
    return (
      <Div className={cn("text-muted-foreground italic", className)}>
        {t("app.api.system.unifiedInterface.react.widgets.dataList.noData")}
      </Div>
    );
  }

  const { items, title, showBullets, maxItems } = data;

  // Get display items based on showAll state and maxItems limit
  const displayItems = showAll ? items : getListDisplayItems(items, maxItems);
  const remainingCount = getRemainingListItemsCount(items.length, maxItems);
  const hasMore = !showAll && remainingCount > 0;

  return (
    <Div className={cn("flex flex-col gap-3", className)}>
      {title && (
        <Title level={3} className="mb-2">
          {title}
        </Title>
      )}

      <Div
        className={cn(
          "flex flex-col gap-2",
          showBullets && "list-none space-y-2",
        )}
      >
        {displayItems.map((item: ListItem, index: number) => (
          <Div
            key={index}
            className={cn(
              "flex gap-3 rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800",
              showBullets && "relative pl-6",
            )}
          >
            {showBullets && (
              <Span className="absolute left-2 top-4 h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
            )}

            <Div className="flex-1">
              <Div className="grid gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(item).map(([key, itemValue]) => (
                  <Div key={key} className="text-sm">
                    <Span className="font-medium text-gray-700 dark:text-gray-300">
                      {key}:{" "}
                    </Span>
                    <Span className="text-gray-600 dark:text-gray-400">
                      {typeof itemValue === "object" && itemValue !== null
                        ? JSON.stringify(itemValue)
                        : String(itemValue ?? "")}
                    </Span>
                  </Div>
                ))}
              </Div>
            </Div>
          </Div>
        ))}
      </Div>

      {hasMore && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(true)}
          className="mt-2 text-sm font-medium text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800"
        >
          {t(
            "app.api.system.unifiedInterface.react.widgets.dataList.showMore",
            { count: remainingCount },
          )}
        </Button>
      )}

      {showAll && maxItems && items.length > maxItems && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(false)}
          className="mt-2 text-sm font-medium text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800"
        >
          {t("app.api.system.unifiedInterface.react.widgets.dataList.showLess")}
        </Button>
      )}
    </Div>
  );
}

DataListWidget.displayName = "DataListWidget";
