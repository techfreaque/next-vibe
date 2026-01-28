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
import type { z } from "zod";

import { simpleT } from "@/i18n/core/shared";

import type { UnifiedField } from "../../../../shared/types/endpoint";
import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import {
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../../shared/widgets/utils/widget-helpers";
import { WidgetRenderer } from "../../../renderers/react/WidgetRenderer";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import {
  extractDataListData,
  getListDisplayItems,
  getRemainingListItemsCount,
  type ListItem,
} from "./shared";
import type { DataListWidgetConfig } from "./types";

/**
 * Data List Widget - Displays array data in switchable list (table) or grid views
 *
 * Renders arrays of objects as either a table with sortable columns or a responsive
 * grid of cards. Supports pagination with "show more/less" controls. Automatically
 * translates field labels and UI text.
 *
 * Features:
 * - Dual view modes: list (table) and grid (cards)
 * - Automatic field detection from array item schema
 * - Pagination with configurable max items
 * - Column headers from field labels
 * - Responsive grid layout (1/2/3 columns)
 * - Dark mode support
 * - Hover effects on rows and cards
 * - Simple value array support (inline badges)
 * - Row click navigation support
 *
 * View Modes:
 * - List: Table with headers and rows, optimal for many fields
 * - Grid: Card layout with key-value pairs, optimal for visual browsing
 *
 * Data Format:
 * - Array of objects: Each object rendered as row/card with field-driven cells
 * - Array of primitives: Rendered as inline badge list
 * - object: {
 *     items: Array<Record<string, any>> - Data array
 *     title?: string - Optional section title
 *     maxItems?: number - Items to show before "show more" (default: all)
 *   }
 * - null/undefined: Shows translated "no data" message
 *
 * Field Detection:
 * Extracts field definitions from array child schema to determine:
 * - Column headers (from field.label or key name)
 * - Cell rendering (delegates to WidgetRenderer with field.type)
 * - Field order (object key order)
 *
 * @param value - Array data or data list object
 * @param field - Field definition with array schema
 * @param context - Rendering context with locale and translator
 * @param className - Optional CSS classes
 * @param endpoint - Endpoint context for nested widget rendering
 */
export function DataListWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends
    | "array"
    | "object"
    | "object-optional"
    | "widget-object"
    | "array-optional",
  TChildOrChildren,
>({
  field,
  context,
}: ReactWidgetProps<
  TEndpoint,
  DataListWidgetConfig<
    TKey,
    TUsage,
    TSchemaType,
    TChildOrChildren,
    TTargetEndpoint
  >
>): JSX.Element {
  const {
    gap,
    simpleArrayGap,
    viewSwitcherGap,
    viewSwitcherPadding,
    buttonPadding,
    tableHeadPadding,
    tableCellPadding,
    gridGap,
    cardPadding,
    cardInnerGap,
    rowGap,
    buttonSpacing,
    tableHeadSize,
    tableCellSize,
    cardRowSize,
    buttonSize,
  } = field;

  // Get classes from config (no hardcoding!)
  const gapClass = getSpacingClassName("gap", gap);
  const simpleArrayGapClass = getSpacingClassName("gap", simpleArrayGap);
  const viewSwitcherGapClass = getSpacingClassName("gap", viewSwitcherGap);
  const viewSwitcherPaddingClass = getSpacingClassName(
    "padding",
    viewSwitcherPadding,
  );
  const buttonPaddingClass = getSpacingClassName("padding", buttonPadding);
  const tableHeadPaddingClass = getSpacingClassName(
    "padding",
    tableHeadPadding,
  );
  const tableCellPaddingClass = getSpacingClassName(
    "padding",
    tableCellPadding,
  );
  const gridGapClass = getSpacingClassName("gap", gridGap);
  const cardPaddingClass = getSpacingClassName("padding", cardPadding);
  const cardInnerGapClass = getSpacingClassName("gap", cardInnerGap);
  const rowGapClass = getSpacingClassName("gap", rowGap);
  const buttonSpacingClass = getSpacingClassName("margin", buttonSpacing);
  const tableHeadSizeClass = getTextSizeClassName(tableHeadSize);
  const tableCellSizeClass = getTextSizeClassName(tableCellSize);
  const cardRowSizeClass = getTextSizeClassName(cardRowSize);
  const buttonSizeClass = getTextSizeClassName(buttonSize);

  const { t: globalT } = simpleT(context.locale);
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const data = extractDataListData(field.value);

  // Get row click handler from metadata
  const onRowClick = field.metadata?.extractParams
    ? {
        extractParams: field.metadata.extractParams,
        targetEndpoint: field.metadata.targetEndpoint,
      }
    : undefined;

  if (!data) {
    return (
      <Div className={cn("text-muted-foreground italic", field.className)}>
        {globalT(
          "app.api.system.unifiedInterface.react.widgets.dataList.noData",
        )}
      </Div>
    );
  }

  const { items, title, maxItems } = data;

  let fieldDefinitions: Record<
    string,
    UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any> // oxlint-disable-line typescript/no-explicit-any
  > = {};

  const childField = field.child;
  const isSimpleValueArray = childField && !("children" in childField);

  if (childField) {
    fieldDefinitions = childField.children;
  }

  const displayItems = showAll ? items : getListDisplayItems(items, maxItems);
  const remainingCount = getRemainingListItemsCount(items.length, maxItems);
  const hasMore = !showAll && remainingCount > 0;

  // For simple value arrays, render as inline list
  if (isSimpleValueArray && childField) {
    return (
      <Div
        className={cn(
          "flex flex-wrap",
          simpleArrayGapClass || "gap-2",
          field.className,
        )}
      >
        {displayItems.map((item, index: number) => (
          <WidgetRenderer
            key={index}
            data={item}
            field={childField}
            context={context}
            endpoint={endpoint}
          />
        ))}
      </Div>
    );
  }

  return (
    <Div className={cn("flex flex-col", gapClass || "gap-3", field.className)}>
      <Div className="flex items-center justify-between">
        {title && (
          <Title level={3} className="mb-0">
            {title}
          </Title>
        )}
        <Div
          className={cn(
            "flex rounded-md border border-gray-200 dark:border-gray-700",
            viewSwitcherGapClass || "gap-1",
            viewSwitcherPaddingClass || "p-1",
          )}
        >
          <Button
            type="button"
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={cn("h-8", buttonPaddingClass || "px-3")}
          >
            {globalT(
              "app.api.system.unifiedInterface.react.widgets.dataList.viewList",
            )}
          </Button>
          <Button
            type="button"
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={cn("h-8", buttonPaddingClass || "px-3")}
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
                  // Check for label first, then fallback to content/text/href, then key
                  let label = key;
                  if (fieldDef) {
                    if (
                      "label" in fieldDef &&
                      typeof fieldDef.label === "string"
                    ) {
                      label = context.t(fieldDef.label);
                    } else if (
                      "content" in fieldDef &&
                      typeof fieldDef.content === "string"
                    ) {
                      label = context.t(fieldDef.content);
                    } else if (
                      "text" in fieldDef &&
                      typeof fieldDef.text === "string"
                    ) {
                      label = context.t(fieldDef.text);
                    } else if (
                      "href" in fieldDef &&
                      typeof fieldDef.href === "string"
                    ) {
                      // For LINK widgets that use href as the label key
                      label = fieldDef.href;
                    }
                  }

                  return (
                    <TableHead
                      key={key}
                      className={cn(
                        "text-left font-medium tracking-wider text-gray-500 dark:text-gray-400",
                        tableHeadPaddingClass || "px-6 py-3",
                        tableHeadSizeClass || "text-xs",
                      )}
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

                const handleRowClick = onRowClick
                  ? (): void => {
                      if (!context.navigation || !onRowClick.targetEndpoint) {
                        return;
                      }
                      const params = onRowClick.extractParams(item);
                      context.logger.debug("DataListWidget: extracted params", {
                        params,
                      });
                      context.navigation.push(
                        onRowClick.targetEndpoint,
                        params,
                        false,
                        undefined,
                      );
                    }
                  : undefined;

                return (
                  <TableRow
                    key={index}
                    className={cn(
                      "hover:bg-gray-50 dark:hover:bg-gray-800",
                      onRowClick && "cursor-pointer",
                    )}
                    onClick={handleRowClick}
                  >
                    {Object.entries(fieldDefinitions).map(([key, fieldDef]) => {
                      const cellValue = key in item ? item[key] : null;

                      return (
                        <TableCell
                          key={key}
                          className={cn(
                            "whitespace-nowrap text-gray-900 dark:text-gray-100",
                            tableCellPaddingClass || "px-6 py-4",
                            tableCellSizeClass || "text-sm",
                          )}
                        >
                          {fieldDef ? (
                            <WidgetRenderer
                              data={cellValue}
                              field={fieldDef}
                              context={context}
                              endpoint={endpoint}
                            />
                          ) : (
                            <Span className="text-gray-600 dark:text-gray-400">
                              {`${cellValue ?? "—"}`}
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
        <Div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            gridGapClass || "gap-4",
          )}
        >
          {displayItems.map((card, index: number) => {
            const handleCardClick = onRowClick
              ? (): void => {
                  if (!context.navigation || !onRowClick.targetEndpoint) {
                    return;
                  }
                  const params = onRowClick.extractParams(card);
                  context.logger.debug("DataListWidget: extracted params", {
                    params,
                  });
                  context.navigation.push(
                    onRowClick.targetEndpoint,
                    params,
                    false,
                    undefined,
                  );
                }
              : undefined;

            return (
              <Div
                key={index}
                className={cn(
                  "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800",
                  onRowClick && "cursor-pointer",
                )}
                onClick={handleCardClick}
              >
                <Div className={cn(cardPaddingClass || "p-4")}>
                  <Div
                    className={cn(
                      "flex flex-col",
                      cardInnerGapClass || "gap-2",
                    )}
                  >
                    {card &&
                      typeof card === "object" &&
                      Object.entries(card).map(([key, cardValue]) => {
                        const fieldDef = fieldDefinitions[key];
                        // Check for label first, then fallback to content/text/href, then key
                        let label = key;
                        if (fieldDef) {
                          if (
                            "label" in fieldDef &&
                            typeof fieldDef.label === "string"
                          ) {
                            label = context.t(fieldDef.label);
                          } else if (
                            "content" in fieldDef &&
                            typeof fieldDef.content === "string"
                          ) {
                            label = context.t(fieldDef.content);
                          } else if (
                            "text" in fieldDef &&
                            typeof fieldDef.text === "string"
                          ) {
                            label = context.t(fieldDef.text);
                          } else if (
                            "href" in fieldDef &&
                            typeof fieldDef.href === "string"
                          ) {
                            label = fieldDef.href;
                          }
                        }

                        return (
                          <Div
                            key={key}
                            className={cn(
                              "flex justify-between",
                              rowGapClass || "gap-4",
                              cardRowSizeClass || "text-sm",
                            )}
                          >
                            <Span className="font-medium text-gray-700 dark:text-gray-300">
                              {label}:
                            </Span>
                            <Div className="text-right">
                              {fieldDef ? (
                                <WidgetRenderer
                                  field={{ ...fieldDef, value: cardValue }}
                                  context={context}
                                />
                              ) : (
                                <Span className="text-gray-600 dark:text-gray-400">
                                  {`${cardValue ?? "—"}`}
                                </Span>
                              )}
                            </Div>
                          </Div>
                        );
                      })}
                  </Div>
                </Div>
              </Div>
            );
          })}
        </Div>
      )}

      {hasMore && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(true)}
          className={cn(
            "font-medium text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800",
            buttonSpacingClass || "mt-2",
            buttonSizeClass || "text-sm",
          )}
        >
          {globalT(
            "app.api.system.unifiedInterface.react.widgets.dataList.showMore",
            {
              count: remainingCount,
            },
          )}
        </Button>
      )}

      {showAll && maxItems && items.length > maxItems && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(false)}
          className={cn(
            "font-medium text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800",
            buttonSpacingClass || "mt-2",
            buttonSizeClass || "text-sm",
          )}
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

export default DataListWidget;
