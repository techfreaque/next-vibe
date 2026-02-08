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

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import {
  getIconSizeClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../../shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import {
  useWidgetForm,
  useWidgetLocale,
} from "../../_shared/use-widget-context";
import type { PaginationWidgetConfig } from "./types";

/**
 * Pagination widget with page navigation and items per page selector
 * Flexible and generic for reuse across the application
 */
export function PaginationWidget<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactWidgetProps<TEndpoint, TUsage, PaginationWidgetConfig>): JSX.Element {
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const { t } = simpleT(locale);
  const {
    showBorder = true,
    padding,
    margin,
    controlsGap,
    elementGap,
    textSize,
    selectWidth,
    iconSize,
  } = field;

  // Get classes from config (no hardcoding!)
  const paddingClass = getSpacingClassName("padding", padding);
  const marginClass = getSpacingClassName("margin", margin);
  const controlsGapClass = getSpacingClassName("gap", controlsGap);
  const elementGapClass = getSpacingClassName("gap", elementGap);
  const textSizeClass = getTextSizeClassName(textSize);
  const iconSizeClass = getIconSizeClassName(iconSize);

  // Select width mapping
  const selectWidthClass =
    selectWidth === "sm"
      ? "w-[60px]"
      : selectWidth === "lg"
        ? "w-[80px]"
        : "w-[70px]";

  if (!field.value) {
    return <Div className={field.className}>—</Div>;
  }

  const pagination = field.value;

  const page = form?.watch(`${fieldName}.page`) || 1;
  const limit = form?.watch(`${fieldName}.limit`) || 50;
  const total =
    typeof pagination.totalCount === "number" ? pagination.totalCount : 0;
  const totalPages =
    typeof pagination.pageCount === "number" ? pagination.pageCount : 1;

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const handlePageChange = (newPage: number): void => {
    // Pagination is auto-refreshed via onChange action in field definition
    if (form) {
      form.setValue(`${fieldName}.page` as string, newPage);
    }
  };

  const handleLimitChange = (newLimit: string): void => {
    const limitValue = Number.parseInt(newLimit, 10);
    // Pagination is auto-refreshed via onChange action in field definition
    if (form) {
      form.setValue(`${fieldName}.limit` as string, limitValue);
      form.setValue(`${fieldName}.page` as string, 1); // Reset to page 1
    }
  };

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <Div
      className={cn(
        "flex items-center justify-between",
        showBorder && "border-t",
        paddingClass || "pt-4",
        marginClass || "mt-4",
        field.className,
      )}
    >
      <Div
        className={cn(
          "flex items-center text-muted-foreground",
          elementGapClass || "gap-2",
          textSizeClass || "text-sm",
        )}
      >
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

      <Div className={cn("flex items-center", controlsGapClass || "gap-4")}>
        <Div className={cn("flex items-center", elementGapClass || "gap-2")}>
          <Span
            className={cn("text-muted-foreground", textSizeClass || "text-sm")}
          >
            {t(
              "app.api.system.unifiedInterface.react.widgets.pagination.itemsPerPage",
            )}
          </Span>
          <Select value={`${limit}`} onValueChange={handleLimitChange}>
            <SelectTrigger className={selectWidthClass}>
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

        <Div className={cn("flex items-center", elementGapClass || "gap-2")}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className={iconSizeClass || "h-4 w-4"} />
          </Button>

          <Span className={cn("font-medium", textSizeClass || "text-sm")}>
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
            <ChevronRight className={iconSizeClass || "h-4 w-4"} />
          </Button>
        </Div>
      </Div>
    </Div>
  );
}

PaginationWidget.displayName = "PaginationWidget";

export default PaginationWidget;
