"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft, ChevronRight } from "next-vibe-ui/ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

/**
 * Pagination widget with page navigation and items per page selector
 * Flexible and generic for reuse across the application
 */
export function PaginationWidget<const TKey extends string>({
  value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  field: _field,
  context,
  className,
  form,
}: ReactWidgetProps<typeof WidgetType.PAGINATION, TKey>): JSX.Element {
  const { t } = simpleT(context.locale);

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return <Div className={className}>—</Div>;
  }

  const pagination = value as {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  const page = pagination.page ?? 1;
  const limit = pagination.limit ?? 50;
  const total = pagination.total ?? 0;
  const totalPages = pagination.totalPages ?? 1;

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const handlePageChange = (newPage: number): void => {
    // Pagination is auto-refreshed via onChange action in field definition
    if (form) {
      form.setValue("paginationInfo.page", newPage);
    }
  };

  const handleLimitChange = (newLimit: string): void => {
    const limitValue = Number.parseInt(newLimit, 10);
    // Pagination is auto-refreshed via onChange action in field definition
    if (form) {
      form.setValue("paginationInfo.limit", limitValue);
      form.setValue("paginationInfo.page", 1); // Reset to page 1
    }
  };

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <Div
      className={cn(
        "flex items-center justify-between border-t pt-4 mt-4",
        className,
      )}
    >
      <Div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Span>
          {t(
            "app.api.system.unifiedInterface.react.widgets.pagination.showing",
            {
              start: startItem,
              end: endItem,
              total,
            },
          )}
        </Span>
      </Div>

      <Div className="flex items-center gap-4">
        <Div className="flex items-center gap-2">
          <Span className="text-sm text-muted-foreground">
            {t(
              "app.api.system.unifiedInterface.react.widgets.pagination.itemsPerPage",
            )}
          </Span>
          <Select value={String(limit)} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </Div>

        <Div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Span className="text-sm font-medium">
            {t(
              "app.api.system.unifiedInterface.react.widgets.pagination.page",
              {
                current: page,
                total: totalPages,
              },
            )}
          </Span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={!canGoNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Div>
      </Div>
    </Div>
  );
}

PaginationWidget.displayName = "PaginationWidget";
