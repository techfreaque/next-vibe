"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, useId, useState } from "react";

import type definition from "./definition";
import type { InventoryStockListGetResponseOutput } from "./definition";
import { DEFAULT_LOW_STOCK_THRESHOLD } from "./threshold";

type StockRow = InventoryStockListGetResponseOutput["stockLevels"][number];

export function InventoryStockListWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale(),
    t = useWidgetTranslation<typeof definition.GET>(),
    navigation = useWidgetNavigation();
  const response = useWidgetResponse();
  const onPick = usePickerCallback<StockRow>(),
    interactive = useWidgetIsInteractive();
  const [search, setSearch] = useState(""),
    [visibleCount, setVisibleCount] = useState(25);
  const inputId = useId();
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 4 });
  const receive = (): void => {
    void import("../receive/definition").then((mod) =>
      navigation.push(mod.default.POST, {
        data: {
          warehouseId: form.getValues("warehouseId"),
          productId: form.getValues("productId"),
        },
      }),
    );
  };
  const adjust = (row: StockRow): void => {
    void import("../adjust/definition").then((mod) =>
      navigation.push(mod.default.POST, {
        data: { warehouseId: row.warehouseId, productId: row.productId },
        popNavigationOnSuccess: 1,
      }),
    );
  };
  const transfer = (row: StockRow): void => {
    void import("../../transfer/create/definition").then((mod) =>
      navigation.push(mod.default.POST, {
        data: {
          companyId: row.companyId,
          fromWarehouseId: row.warehouseId,
          items: [{ productId: row.productId, quantityRequested: 1 }],
        },
      }),
    );
  };
  const actions = (row: StockRow): JSX.Element | null =>
    interactive && !onPick ? (
      <Div className="flex flex-wrap gap-1">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => adjust(row)}
        >
          {t("stockList.get.widget.adjust")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => transfer(row)}
        >
          {t("stockList.get.widget.transfer")}
        </Button>
      </Div>
    ) : null;
  const stockStatus = (row: StockRow): JSX.Element => (
    <Div className="flex min-w-0 flex-col items-start gap-1">
      <Badge
        variant={
          row.quantityAvailable <= 0
            ? "destructive"
            : row.isLowStock
              ? "warning"
              : "success"
        }
      >
        {row.quantityAvailable <= 0
          ? t("stockList.get.widget.outOfStock")
          : row.isLowStock
            ? t("stockList.get.widget.lowStock")
            : t("stockList.get.widget.statusOk")}
      </Badge>
      <Span className="text-xs text-muted-foreground">
        {t(
          row.reorderPoint === null || row.reorderPoint === undefined
            ? "stockList.get.widget.defaultLowStockRule"
            : "stockList.get.widget.reorderPointRule",
          {
            threshold: number.format(
              row.reorderPoint ?? DEFAULT_LOW_STOCK_THRESHOLD,
            ),
          },
        )}
      </Span>
    </Div>
  );
  const rows = data?.stockLevels ?? [],
    query = search.trim().toLocaleLowerCase(locale);
  const matching = query
    ? rows.filter((row) =>
        [row.productName, row.warehouseName].some((name) =>
          name?.toLocaleLowerCase(locale).includes(query),
        ),
      )
    : rows;
  const visible = interactive ? matching.slice(0, visibleCount) : matching;
  const showsRoundedCost = visible.some(
    ({ unitCost, currency, stockValue }) =>
      unitCost !== null &&
      Boolean(currency) &&
      typeof stockValue === "number" &&
      Math.abs(unitCost * 100 - Math.round(unitCost * 100)) > 0.000_001,
  );
  const receiveButton =
    interactive && !onPick ? (
      <Button type="button" size="sm" onClick={receive}>
        {t("stockReceive.post.title")}
      </Button>
    ) : undefined;
  const cost = (row: StockRow): string =>
    row.currency && row.unitCost !== null
      ? formatMoney(row.unitCost, row.currency, locale)
      : "";
  const title = (row: StockRow): string =>
    row.productName ?? t("stockList.get.widget.unnamedProduct");
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("stockList.get.title")}
        subtitle={t("stockList.get.description")}
        actions={receiveButton}
      />
      <FormAlertWidget field={{}} />
      {!data && response?.success !== false && (
        <LoadingBlock message={t("stockList.get.widget.loading")} />
      )}
      {data && (
        <>
          {interactive && rows.length > 0 && (
            <Div className="flex max-w-sm flex-col gap-1">
              <Label htmlFor={inputId}>
                {t("stockList.get.widget.search")}
              </Label>
              <Input
                id={inputId}
                value={search}
                onChangeText={(value) => {
                  setSearch(value);
                  setVisibleCount(25);
                }}
              />
            </Div>
          )}
          {showsRoundedCost && (
            <Span className="text-sm text-muted-foreground">
              {t("stockList.get.widget.stockValuePrecision")}
            </Span>
          )}
          {visible.length > 0 ? (
            <RecordTable
              label={t("stockList.get.title")}
              columns={[
                {
                  id: "product",
                  label: t("stockList.get.response.productName"),
                },
                {
                  id: "warehouse",
                  label: t("stockList.get.response.warehouseName"),
                },
                {
                  id: "onHand",
                  label: t("stockList.get.widget.onHand"),
                  numeric: true,
                },
                {
                  id: "reserved",
                  label: t("stockList.get.widget.reserved"),
                  numeric: true,
                },
                {
                  id: "available",
                  label: t("stockList.get.widget.available"),
                  numeric: true,
                },
                {
                  id: "cost",
                  label: t("stockList.get.response.unitCost"),
                  numeric: true,
                },
                {
                  id: "value",
                  label: t("stockList.get.widget.stockValue"),
                  numeric: true,
                },
                { id: "status", label: t("stockList.get.widget.stockStatus") },
                { id: "actions", label: t("stockList.get.widget.actions") },
              ]}
              rows={visible.map((row) => {
                const product = onPick ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onPick(row)}
                  >
                    {title(row)}
                  </Button>
                ) : (
                  title(row)
                );
                return {
                  id: row.id,
                  cells: {
                    product,
                    warehouse: row.warehouseName,
                    onHand: number.format(row.quantityOnHand),
                    reserved: number.format(row.quantityReserved),
                    available: number.format(row.quantityAvailable),
                    cost: cost(row),
                    value:
                      row.currency && typeof row.stockValue === "number"
                        ? formatMoney(row.stockValue, row.currency, locale)
                        : "",
                    status: stockStatus(row),
                    actions: actions(row),
                  },
                };
              })}
              compact={
                <Div className="flex flex-col gap-2">
                  {visible.map((row) => (
                    <Div
                      key={row.id}
                      className="flex flex-col gap-2 rounded-lg border bg-card p-3"
                    >
                      <Div className="flex flex-wrap items-center justify-between gap-2">
                        {onPick ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onPick(row)}
                          >
                            {title(row)}
                          </Button>
                        ) : (
                          <Span className="font-semibold">{title(row)}</Span>
                        )}
                        {stockStatus(row)}
                      </Div>
                      <Span className="text-sm text-muted-foreground">
                        {row.warehouseName}
                      </Span>
                      <Div className="grid grid-cols-2 gap-1 text-sm">
                        <Span>{t("stockList.get.widget.onHand")}</Span>
                        <Span className="text-right tabular-nums">
                          {number.format(row.quantityOnHand)}
                        </Span>
                        <Span>{t("stockList.get.widget.available")}</Span>
                        <Span className="text-right font-semibold tabular-nums">
                          {number.format(row.quantityAvailable)}
                        </Span>
                        <Span>{t("stockList.get.widget.reserved")}</Span>
                        <Span className="text-right tabular-nums">
                          {number.format(row.quantityReserved)}
                        </Span>
                        {typeof row.stockValue === "number" && row.currency && (
                          <>
                            <Span>{t("stockList.get.widget.stockValue")}</Span>
                            <Span className="text-right tabular-nums">
                              {formatMoney(
                                row.stockValue,
                                row.currency,
                                locale,
                              )}
                            </Span>
                          </>
                        )}
                        {row.unitCost !== null && row.currency && (
                          <>
                            <Span>{t("stockList.get.response.unitCost")}</Span>
                            <Span className="text-right tabular-nums">
                              {cost(row)}
                            </Span>
                          </>
                        )}
                      </Div>
                      {actions(row)}
                    </Div>
                  ))}
                </Div>
              }
            />
          ) : (
            <EmptyBlock
              title={
                query
                  ? t("stockList.get.widget.noMatches")
                  : t("stockList.get.widget.empty")
              }
              message={query ? undefined : t("stockList.get.widget.emptyHint")}
            />
          )}
          {visible.length < matching.length && (
            <Button
              type="button"
              variant="outline"
              className="self-start"
              onClick={() => setVisibleCount((count) => count + 25)}
            >
              {t("stockList.get.widget.loadMore")}
            </Button>
          )}
        </>
      )}
    </WidgetShell>
  );
}
