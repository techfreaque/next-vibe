"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import { Title } from "next-vibe-ui/ui/title";
import type { JSX } from "react";
import { useState } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { UnifiedField } from "../../../shared/types/endpoint";
import type { WidgetType } from "../../../shared/types/enums";
import {
  extractDataListData,
  getListDisplayItems,
  getRemainingListItemsCount,
  type ListItem,
} from "../../../shared/widgets/logic/data-list";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { getTranslator } from "../../../shared/widgets/utils/field-helpers";
import { WidgetRenderer } from "../renderers/WidgetRenderer";

/**
 * Displays data in either list view (table) or grid view with toggle.
 */
export function DataListWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
  endpoint,
}: ReactWidgetProps<typeof WidgetType.DATA_LIST, TKey>): JSX.Element {
  const { t } = getTranslator(context);
  const { t: globalT } = simpleT(context.locale);
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const data = extractDataListData(value);

  if (!data) {
    return (
      <Div className={cn("text-muted-foreground italic", className)}>
        {globalT(
          "app.api.system.unifiedInterface.react.widgets.dataList.noData",
        )}
      </Div>
    );
  }

  const { items, title, maxItems } = data;

  let fieldDefinitions: Record<string, UnifiedField<string>> = {};
  if (
    "type" in field &&
    (field.type === "array" || field.type === "array-optional")
  ) {
    if ("child" in field && field.child) {
      const childField = field.child as UnifiedField<string>;
      if (
        "type" in childField &&
        (childField.type === "object" || childField.type === "object-optional")
      ) {
        if ("children" in childField && childField.children) {
          fieldDefinitions = childField.children as Record<
            string,
            UnifiedField<string>
          >;
        }
      }
    }
  }

  const displayItems = showAll ? items : getListDisplayItems(items, maxItems);
  const remainingCount = getRemainingListItemsCount(items.length, maxItems);
  const hasMore = !showAll && remainingCount > 0;

  return (
    <Div className={cn("flex flex-col gap-3", className)}>
      <Div className="flex items-center justify-between">
        {title && (
          <Title level={3} className="mb-0">
            {title}
          </Title>
        )}
        <Div className="flex gap-1 rounded-md border border-gray-200 p-1 dark:border-gray-700">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8 px-3"
          >
            {globalT(
              "app.api.system.unifiedInterface.react.widgets.dataList.viewList",
            )}
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8 px-3"
          >
            {globalT(
              "app.api.system.unifiedInterface.react.widgets.dataList.viewGrid",
            )}
          </Button>
        </Div>
      </Div>

      {viewMode === "list" && (
        <Div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                {Object.entries(fieldDefinitions).map(([key, fieldDef]) => {
                  const fieldUi = fieldDef?.ui;
                  // Check for label first, then fallback to content/text/href, then key
                  let label = key;
                  if (fieldUi) {
                    if (
                      "label" in fieldUi &&
                      typeof fieldUi.label === "string"
                    ) {
                      label = t(fieldUi.label);
                    } else if (
                      "content" in fieldUi &&
                      typeof fieldUi.content === "string"
                    ) {
                      label = t(fieldUi.content);
                    } else if (
                      "text" in fieldUi &&
                      typeof fieldUi.text === "string"
                    ) {
                      label = t(fieldUi.text);
                    } else if (
                      "href" in fieldUi &&
                      typeof fieldUi.href === "string"
                    ) {
                      // For LINK widgets that use href as the label key
                      label = fieldUi.href;
                    }
                  }

                  return (
                    <TableHead
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      {label}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {displayItems.map((item: ListItem, index: number) => {
                if (!item || typeof item !== "object") {
                  return null;
                }

                return (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {Object.entries(fieldDefinitions).map(([key, fieldDef]) => {
                      const cellValue = key in item ? item[key] : null;

                      return (
                        <TableCell
                          key={key}
                          className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                        >
                          {fieldDef ? (
                            <WidgetRenderer
                              widgetType={fieldDef.ui.type}
                              data={cellValue}
                              field={fieldDef}
                              context={context}
                              endpoint={endpoint}
                            />
                          ) : (
                            <Span className="text-gray-600 dark:text-gray-400">
                              {String(cellValue ?? "—")}
                            </Span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Div>
      )}

      {viewMode === "grid" && (
        <Div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((card, index: number) => (
            <Div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <Div className="p-4">
                <Div className="flex flex-col gap-2">
                  {card &&
                    typeof card === "object" &&
                    Object.entries(card).map(([key, cardValue]) => {
                      const fieldDef = fieldDefinitions[key];
                      const fieldUi = fieldDef?.ui;
                      // Check for label first, then fallback to content/text/href, then key
                      let label = key;
                      if (fieldUi) {
                        if (
                          "label" in fieldUi &&
                          typeof fieldUi.label === "string"
                        ) {
                          label = t(fieldUi.label);
                        } else if (
                          "content" in fieldUi &&
                          typeof fieldUi.content === "string"
                        ) {
                          label = t(fieldUi.content);
                        } else if (
                          "text" in fieldUi &&
                          typeof fieldUi.text === "string"
                        ) {
                          label = t(fieldUi.text);
                        } else if (
                          "href" in fieldUi &&
                          typeof fieldUi.href === "string"
                        ) {
                          label = fieldUi.href;
                        }
                      }

                      return (
                        <Div
                          key={key}
                          className="flex justify-between gap-4 text-sm"
                        >
                          <Span className="font-medium text-gray-700 dark:text-gray-300">
                            {label}:
                          </Span>
                          <Div className="text-right">
                            {fieldDef ? (
                              <WidgetRenderer
                                widgetType={fieldDef.ui.type}
                                data={cardValue}
                                field={fieldDef}
                                context={context}
                                endpoint={endpoint}
                              />
                            ) : (
                              <Span className="text-gray-600 dark:text-gray-400">
                                {String(cardValue ?? "—")}
                              </Span>
                            )}
                          </Div>
                        </Div>
                      );
                    })}
                </Div>
              </Div>
            </Div>
          ))}
        </Div>
      )}

      {hasMore && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(true)}
          className="mt-2 text-sm font-medium text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800"
        >
          {globalT(
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
          {globalT(
            "app.api.system.unifiedInterface.react.widgets.dataList.showLess",
          )}
        </Button>
      )}
    </Div>
  );
}

DataListWidget.displayName = "DataListWidget";
