"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useState } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import {
  type CodeQualityItem,
  countCodeQualityBySeverity,
  extractCodeQualityListData,
  groupCodeQualityItems,
} from "../../../shared/widgets/logic/code-quality-list";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { getSeverityVariant } from "../../../shared/widgets/utils/widget-helpers";

/**
 * Displays code quality issues with grouping by file/severity/rule.
 */
export function CodeQualityListWidget<TKey extends string>({
  value,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.CODE_QUALITY_LIST, TKey>): JSX.Element {
  const { t } = simpleT(context.locale);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Extract data using shared logic
  const data = extractCodeQualityListData(value);

  // Handle null case
  if (!data) {
    return (
      <Div className={cn("text-muted-foreground italic", className)}>
        {t(
          "app.api.system.unifiedInterface.react.widgets.codeQualityList.noData",
        )}
      </Div>
    );
  }

  const { items, groupBy, showSummary } = data;

  // Calculate severity counts for summary
  const severityCounts = countCodeQualityBySeverity(items);

  // Toggle group expansion
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

  // Render ungrouped list
  if (!groupBy) {
    return (
      <Div className={cn("flex flex-col gap-3", className)}>
        {showSummary && (
          <Div className="mb-2 flex gap-3">
            {severityCounts.error > 0 && (
              <Badge variant="destructive">{severityCounts.error} errors</Badge>
            )}
            {severityCounts.warning > 0 && (
              <Badge variant="default">{severityCounts.warning} warnings</Badge>
            )}
            {severityCounts.info > 0 && (
              <Badge variant="secondary">{severityCounts.info} info</Badge>
            )}
          </Div>
        )}

        {items.map((item: CodeQualityItem, index: number) => (
          <Div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <Div className="mb-2 flex items-start justify-between gap-3">
              <Div className="flex-1">
                <Div className="font-mono text-sm text-gray-900 dark:text-gray-100">
                  {item.file}
                  {item.line && (
                    <Span className="text-gray-500 dark:text-gray-400">
                      :{item.line}
                      {item.column && `:${item.column}`}
                    </Span>
                  )}
                </Div>
              </Div>
              <Badge variant={getSeverityVariant(item.severity)}>
                {item.severity}
              </Badge>
            </Div>

            <Div className="text-sm text-gray-700 dark:text-gray-300">
              {item.message}
            </Div>

            {item.rule && (
              <Div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {t(
                  "app.api.system.unifiedInterface.react.widgets.codeQualityList.rule",
                  { rule: item.rule },
                )}
              </Div>
            )}
          </Div>
        ))}
      </Div>
    );
  }

  // Render grouped list
  const groups = groupCodeQualityItems(items, groupBy);

  return (
    <Div className={cn("flex flex-col gap-3", className)}>
      {showSummary && (
        <Div className="mb-2 flex gap-3">
          {severityCounts.error > 0 && (
            <Badge variant="destructive">{severityCounts.error} errors</Badge>
          )}
          {severityCounts.warning > 0 && (
            <Badge variant="default">{severityCounts.warning} warnings</Badge>
          )}
          {severityCounts.info > 0 && (
            <Badge variant="secondary">{severityCounts.info} info</Badge>
          )}
        </Div>
      )}

      {[...groups.entries()].map(([groupKey, groupItems]) => {
        const isExpanded = expandedGroups.has(groupKey);
        const groupSeverityCounts = countCodeQualityBySeverity(groupItems);

        return (
          <Collapsible
            key={groupKey}
            open={isExpanded}
            onOpenChange={() => toggleGroup(groupKey)}
          >
            <Div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <Div className="flex items-center gap-3">
                    <Span className="font-semibold text-gray-900 dark:text-gray-100">
                      {groupKey}
                    </Span>
                    <Div className="flex gap-2">
                      {groupSeverityCounts.error > 0 && (
                        <Badge variant="destructive">
                          {groupSeverityCounts.error}
                        </Badge>
                      )}
                      {groupSeverityCounts.warning > 0 && (
                        <Badge variant="default">
                          {groupSeverityCounts.warning}
                        </Badge>
                      )}
                      {groupSeverityCounts.info > 0 && (
                        <Badge variant="secondary">
                          {groupSeverityCounts.info}
                        </Badge>
                      )}
                    </Div>
                  </Div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-gray-500 transition-transform",
                      isExpanded && "rotate-180",
                    )}
                  />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <Div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {groupItems.map((item: CodeQualityItem, index: number) => (
                    <Div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750"
                    >
                      <Div className="mb-2 flex items-start justify-between gap-3">
                        <Div className="flex-1">
                          <Div className="font-mono text-sm text-gray-900 dark:text-gray-100">
                            {groupBy !== "file" && item.file}
                            {item.line && (
                              <Span className="text-gray-500 dark:text-gray-400">
                                :{item.line}
                                {item.column && `:${item.column}`}
                              </Span>
                            )}
                          </Div>
                        </Div>
                        <Badge variant={getSeverityVariant(item.severity)}>
                          {item.severity}
                        </Badge>
                      </Div>

                      <Div className="text-sm text-gray-700 dark:text-gray-300">
                        {item.message}
                      </Div>

                      {item.rule && groupBy !== "rule" && (
                        <Div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {t(
                            "app.api.system.unifiedInterface.react.widgets.codeQualityList.rule",
                            { rule: item.rule },
                          )}
                        </Div>
                      )}
                    </Div>
                  ))}
                </Div>
              </CollapsibleContent>
            </Div>
          </Collapsible>
        );
      })}
    </Div>
  );
}

CodeQualityListWidget.displayName = "CodeQualityListWidget";
