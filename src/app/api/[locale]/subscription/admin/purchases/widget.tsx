/**
 * Subscription Admin Purchases Widget
 * Credit pack purchase history with filtering and pagination
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/widget";
import type { CountryLanguage } from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import type definition from "./definition";
import type { PurchasesGetResponseOutput } from "./definition";

type Purchase = NonNullable<
  PurchasesGetResponseOutput["response"]
>["purchases"][number];

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

const PACK_TYPE_COLORS: Record<string, string> = {
  subscription: "bg-info/10 text-info",
  permanent:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  bonus:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  earned: "bg-warning/10 text-warning",
};

function getPackTypeColor(packType: string): string {
  const lower = packType.toLowerCase();
  for (const [key, value] of Object.entries(PACK_TYPE_COLORS)) {
    if (lower.includes(key)) {
      return value;
    }
  }
  return "bg-muted text-muted-foreground";
}

function PurchaseRow({
  purchase,
  locale,
  t,
}: {
  purchase: Purchase;
  locale: CountryLanguage;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
}): React.JSX.Element {
  const isExpired =
    purchase.expiresAt && new Date(purchase.expiresAt) < new Date();
  const usageRatio =
    purchase.originalAmount > 0
      ? ((purchase.remaining / purchase.originalAmount) * 100).toFixed(0)
      : "0";

  return (
    <Div className="flex items-start justify-between gap-3 py-4">
      <Div className="flex-1 min-w-0 space-y-1">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-medium text-sm">
            {purchase.userEmail || "---"}
          </Span>
          <Badge className={getPackTypeColor(purchase.packType)}>
            {purchase.packType}
          </Badge>
          {purchase.source ? (
            <Badge className="bg-muted text-muted-foreground">
              {purchase.source}
            </Badge>
          ) : null}
        </Div>

        <Div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Span className="tabular-nums">
            {purchase.remaining.toLocaleString()} /{" "}
            {purchase.originalAmount.toLocaleString()}
          </Span>
          <Span className="text-xs">({usageRatio}%)</Span>
        </Div>

        <Div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Span>{formatSimpleDate(purchase.createdAt, locale)}</Span>
          {purchase.expiresAt ? (
            <Span className={isExpired ? "text-destructive" : ""}>
              {isExpired
                ? t("widget.expired")
                : formatSimpleDate(purchase.expiresAt, locale)}
            </Span>
          ) : (
            <Span>{t("widget.neverExpires")}</Span>
          )}
        </Div>
      </Div>
    </Div>
  );
}

export function PurchasesContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.GET>();

  const purchases = data?.response?.purchases ?? [];
  const isLoading = data === null || data === undefined;
  const currentPage = data?.paginationInfo?.page ?? 1;
  const totalPages = data?.paginationInfo?.pageCount ?? 1;
  const totalCount = data?.paginationInfo?.totalCount ?? 0;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handlePageChange = useCallback(
    (page: number): void => {
      form.setValue("paginationInfo.page", page);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b">
        <Span className="font-semibold text-base mr-auto">
          {t("get.title")}
          {totalCount > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({totalCount})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* Search */}
      <Div className="px-4 pt-3 pb-1">
        <TextFieldWidget
          fieldName={"searchFilters.search"}
          field={children.searchFilters.children.search}
        />
      </Div>

      {/* Filters */}
      <Div className="px-4 pb-2 grid grid-cols-2 gap-2">
        <SelectFieldWidget
          fieldName="searchFilters.source"
          field={children.searchFilters.children.source}
        />
        <SelectFieldWidget
          fieldName="sortingOptions.sortBy"
          field={children.sortingOptions.children.sortBy}
        />
      </Div>

      {/* Purchase list */}
      <Div className="px-4 pb-2 overflow-y-auto max-h-[min(700px,calc(100dvh-340px))]">
        {isLoading ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : purchases.length > 0 ? (
          <Div className="divide-y">
            {purchases.map((purchase) => (
              <PurchaseRow
                key={purchase.id}
                purchase={purchase}
                locale={locale}
                t={t}
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            {t("widget.noPurchases")}
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <Span>
            {currentPage} / {totalPages}
          </Span>
          <Div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}
