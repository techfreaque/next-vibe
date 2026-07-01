"use client";

import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { Loader2 } from "next-vibe/ui/web/ui/icons/Loader2";
import { Span } from "next-vibe/ui/web/ui/span";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";
import type { InventoryStockListGetResponseOutput } from "./definition";

type StockRow = NonNullable<
  InventoryStockListGetResponseOutput["stockLevels"]
>[number];

function stockStatusBadge(
  row: StockRow,
  lowStockLabel: string,
  outOfStockLabel: string,
  statusOkLabel: string,
): JSX.Element | null {
  if (row.quantityAvailable <= 0) {
    return (
      <Badge variant="destructive" className="text-xs h-5 px-2 shrink-0">
        {outOfStockLabel}
      </Badge>
    );
  }
  if (row.isLowStock) {
    return (
      <Badge
        variant="outline"
        className="text-xs h-5 px-2 shrink-0 border-amber-500 text-amber-600 dark:text-amber-400"
      >
        {lowStockLabel}
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="text-xs h-5 px-2 shrink-0 border-emerald-500 text-emerald-700 dark:text-emerald-400"
    >
      {statusOkLabel}
    </Badge>
  );
}

function quantityColorClass(row: StockRow): string {
  if (row.quantityAvailable <= 0) {
    return "text-red-600 dark:text-red-400 font-bold text-xl";
  }
  if (row.isLowStock) {
    return "text-amber-600 dark:text-amber-400 font-bold text-xl";
  }
  return "text-emerald-700 dark:text-emerald-400 font-bold text-xl";
}

function StockItem({
  row,
  lowStockLabel,
  outOfStockLabel,
  statusOkLabel,
  onHandLabel,
  reservedLabel,
  availableLabel,
  reorderLabel,
  bulletLabel,
  onTransfer,
  transferLabel,
  onAdjust,
  adjustLabel,
  isPickerMode,
  onPick,
}: {
  row: StockRow;
  lowStockLabel: string;
  outOfStockLabel: string;
  statusOkLabel: string;
  onHandLabel: string;
  reservedLabel: string;
  availableLabel: string;
  reorderLabel: string;
  bulletLabel: string;
  onTransfer: (warehouseId: string, productId: string) => void;
  transferLabel: string;
  onAdjust: (warehouseId: string, productId: string) => void;
  adjustLabel: string;
  isPickerMode: boolean;
  onPick: ((row: StockRow) => void) | undefined;
}): JSX.Element {
  return (
    <Div
      className={`flex items-center gap-4 py-3 px-4 border-b last:border-b-0 hover:bg-muted/20 transition-all${
        row.quantityAvailable <= 0
          ? " border-l-2 border-l-red-500"
          : row.isLowStock
            ? " border-l-2 border-l-amber-500"
            : ""
      }${isPickerMode ? " cursor-pointer" : ""}`}
      onClick={isPickerMode && onPick ? () => onPick(row) : undefined}
    >
      {/* Product + warehouse info */}
      <Div className="flex-1 min-w-0">
        <Span className="block text-sm font-semibold truncate">
          {row.productName ?? row.productId}
        </Span>
        <Div className="flex items-center gap-1.5 mt-0.5">
          <Span className="text-xs text-muted-foreground">
            {row.warehouseName ?? row.warehouseId}
          </Span>
          {row.reorderPoint !== null ? (
            <>
              <Span className="text-xs text-muted-foreground">
                {bulletLabel}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {reorderLabel}: {row.reorderPoint}
              </Span>
            </>
          ) : null}
        </Div>
      </Div>

      {/* Quantities */}
      <Div className="flex items-center gap-5 shrink-0 text-sm">
        <Div className="flex flex-col items-end gap-0.5">
          <Span className="text-xs text-muted-foreground">{onHandLabel}</Span>
          <Span className="font-medium tabular-nums">{row.quantityOnHand}</Span>
        </Div>
        <Div className="flex flex-col items-end gap-0.5">
          <Span className="text-xs text-muted-foreground">{reservedLabel}</Span>
          <Span className="font-medium tabular-nums text-muted-foreground">
            {row.quantityReserved}
          </Span>
        </Div>
        <Div className="flex flex-col items-end gap-0.5">
          <Span className="text-xs text-muted-foreground">
            {availableLabel}
          </Span>
          <Span className={`tabular-nums ${quantityColorClass(row)}`}>
            {row.quantityAvailable}
          </Span>
        </Div>
        <Div className="w-24 flex justify-center">
          {stockStatusBadge(row, lowStockLabel, outOfStockLabel, statusOkLabel)}
        </Div>
        {!isPickerMode && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs shrink-0"
              onClick={() => {
                onAdjust(row.warehouseId, row.productId);
              }}
            >
              {adjustLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs shrink-0"
              onClick={() => {
                onTransfer(row.warehouseId, row.productId);
              }}
            >
              {transferLabel}
            </Button>
          </>
        )}
      </Div>
    </Div>
  );
}

export function InventoryStockListWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const onPick = usePickerCallback<StockRow>();
  const isPickerMode = !!onPick;

  const handleAdjust = (warehouseId: string, productId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../adjust/definition");
      navigation.push(def.default.POST, {
        data: {
          warehouseId,
          productId,
          quantity: undefined,
          reason: undefined,
        },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleTransfer = (warehouseId: string, productId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../../transfer/create/definition");
      navigation.push(def.default.POST, {
        data: {
          fromWarehouseId: warehouseId,
          items: [{ productId, quantityRequested: 1 }],
        },
      });
    })();
  };

  const rows = data?.stockLevels ?? [];
  const lowStockCount = rows.filter((r) => r.isLowStock).length;
  const outOfStockCount = rows.filter((r) => r.quantityAvailable <= 0).length;

  // Loading state
  if (!data) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <Span className="text-sm">{t("stockList.get.widget.loading")}</Span>
      </Div>
    );
  }

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            navigation.pop();
          }}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("stockList.get.widget.back")}
        </Button>
      )}

      {/* Alert banner for low/out-of-stock */}
      {outOfStockCount > 0 || lowStockCount > 0 ? (
        <Div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <Span className="text-amber-700 dark:text-amber-400 text-sm font-medium">
            {outOfStockCount > 0 ? (
              <>
                {outOfStockCount} {t("stockList.get.widget.outOfStock")}
                {lowStockCount > 0
                  ? t("stockList.get.widget.bulletSeparator")
                  : null}{" "}
              </>
            ) : null}
            {lowStockCount > 0 ? (
              <>
                {lowStockCount} {t("stockList.get.widget.belowReorderPoint")}
              </>
            ) : null}
          </Span>
        </Div>
      ) : null}

      {/* Header */}
      <Div className="flex items-center justify-between">
        <Span className="text-sm font-medium">
          {rows.length} {t("stockList.get.widget.total")}
        </Span>
      </Div>

      {/* Stock table */}
      {rows.length > 0 ? (
        <Div className="rounded-lg border overflow-hidden">
          <Div className="flex items-center gap-4 px-4 py-2 bg-muted/40 border-b text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Span className="flex-1">
              {t("stockList.get.response.productName")}
            </Span>
            <Div className="flex items-center gap-5 shrink-0">
              <Span className="w-14 text-right">
                {t("stockList.get.widget.onHand")}
              </Span>
              <Span className="w-16 text-right">
                {t("stockList.get.widget.reserved")}
              </Span>
              <Span className="w-16 text-right">
                {t("stockList.get.widget.available")}
              </Span>
              <Span className="w-24 text-center">
                {t("stockList.get.response.isLowStock")}
              </Span>
              <Span className="w-16" />
            </Div>
          </Div>
          {rows.map((row) => (
            <StockItem
              key={row.id}
              row={row}
              lowStockLabel={t("stockList.get.widget.lowStock")}
              outOfStockLabel={t("stockList.get.widget.outOfStock")}
              statusOkLabel={t("stockList.get.widget.statusOk")}
              onHandLabel={t("stockList.get.widget.onHand")}
              reservedLabel={t("stockList.get.widget.reserved")}
              availableLabel={t("stockList.get.widget.available")}
              reorderLabel={t("stockList.get.response.reorderPoint")}
              bulletLabel={t("stockList.get.widget.bulletSeparator")}
              onAdjust={handleAdjust}
              adjustLabel={t("stockList.get.widget.adjust")}
              onTransfer={handleTransfer}
              transferLabel={t("stockList.get.widget.transfer")}
              isPickerMode={isPickerMode}
              onPick={onPick}
            />
          ))}
        </Div>
      ) : null}

      {/* Empty state */}
      {rows.length === 0 ? (
        <Div className="flex flex-col items-center gap-3 py-16 text-center border rounded-lg border-dashed">
          <Div
            className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl select-none"
            aria-hidden="true"
          >
            {t("stockList.get.widget.emptyIcon")}
          </Div>
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-semibold">
              {t("stockList.get.widget.empty")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("stockList.get.widget.emptyHint")}
            </Span>
          </Div>
        </Div>
      ) : null}
    </Div>
  );
}
