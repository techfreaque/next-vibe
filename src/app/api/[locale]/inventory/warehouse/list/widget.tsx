"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Span } from "next-vibe-ui/ui/span";
import { usePickerCallback } from "next-vibe-ui/unified/_shared/picker-context";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";
import type { InventoryWarehouseListGetResponseOutput } from "./definition";

type WarehouseRow = NonNullable<
  InventoryWarehouseListGetResponseOutput["warehouses"]
>[number];

function WarehouseItem({
  warehouse,
  onView,
  onViewStock,
  activeLabel,
  inactiveLabel,
  defaultLabel,
  viewStockLabel,
  isPickerMode,
}: {
  warehouse: WarehouseRow;
  onView: (id: string) => void;
  onViewStock: (id: string) => void;
  activeLabel: string;
  inactiveLabel: string;
  defaultLabel: string;
  viewStockLabel: string;
  isPickerMode: boolean;
}): JSX.Element {
  return (
    <Div className="flex items-center gap-3 py-3 px-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors">
      {/* Code badge */}
      <Span className="font-mono text-xs w-20 shrink-0 text-muted-foreground bg-muted px-2 py-1 rounded text-center">
        {warehouse.code}
      </Span>

      {/* Name + address */}
      <Div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => {
          onView(warehouse.id);
        }}
      >
        <Span
          className={`block text-sm font-semibold truncate${!warehouse.isActive ? " line-through text-muted-foreground" : ""}`}
        >
          {warehouse.name}
        </Span>
        {warehouse.address ? (
          <Span className="text-xs text-muted-foreground truncate block mt-0.5">
            {warehouse.address}
          </Span>
        ) : null}
      </Div>

      {/* Status badges */}
      <Div className="flex items-center gap-1.5 shrink-0">
        {warehouse.isDefault ? (
          <Badge
            variant="default"
            className="text-xs h-5 px-2 bg-emerald-600 hover:bg-emerald-600"
          >
            {defaultLabel}
          </Badge>
        ) : null}
        {warehouse.isActive ? (
          <Badge variant="secondary" className="text-xs h-5 px-2">
            {activeLabel}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs h-5 px-2 opacity-60">
            {inactiveLabel}
          </Badge>
        )}
      </Div>

      {/* View Stock button — hidden in picker mode */}
      {!isPickerMode && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-3 text-xs shrink-0"
          onClick={() => {
            onViewStock(warehouse.id);
          }}
        >
          {viewStockLabel}
        </Button>
      )}
    </Div>
  );
}

export function InventoryWarehouseListWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const onPick =
    usePickerCallback<
      NonNullable<
        (typeof definition.GET.types.ResponseOutput)["warehouses"]
      >[number]
    >();
  const isPickerMode = !!onPick;

  const handleView = (warehouseId: string): void => {
    if (isPickerMode) {
      const warehouse = (data?.warehouses ?? []).find(
        (w) => w.id === warehouseId,
      );
      if (warehouse && onPick) {
        onPick(warehouse);
        navigation.pop();
      }
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[warehouseId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { warehouseId },
      });
    })();
  };

  const handleViewStock = (warehouseId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../../stock/list/definition");
      navigation.push(def.default.GET, {
        data: { warehouseId },
      });
    })();
  };

  const handleCreate = (): void => {
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("../create/definition"),
        import("../[warehouseId]/get/definition"),
      ]);
      navigation.push(createDef.default.POST, {
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData: { result: { id: string } }) => ({
            warehouseId: responseData.result.id,
          }),
        },
      });
    })();
  };

  // Loading state
  if (!data) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <Span className="text-sm">{t("warehouseList.get.widget.loading")}</Span>
      </Div>
    );
  }

  const rows = data.warehouses ?? [];
  const activeCount = rows.filter((w) => w.isActive).length;

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
          {t("warehouseList.get.widget.back")}
        </Button>
      )}

      {/* Header with count + create */}
      <Div className="flex items-center justify-between">
        <Div className="flex items-center gap-2">
          <Span className="text-sm font-medium">
            {rows.length} {t("warehouseList.get.widget.total")}
          </Span>
          {rows.length > 0 && activeCount < rows.length ? (
            <Badge variant="secondary" className="text-xs h-5 px-1.5">
              {activeCount} {t("warehouseList.get.widget.active")}
            </Badge>
          ) : null}
        </Div>
        {!isPickerMode && (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleCreate}
          >
            {t("warehouseList.get.widget.createWarehouse")}
          </Button>
        )}
      </Div>

      {/* Warehouse table */}
      {rows.length > 0 ? (
        <Div className="rounded-lg border overflow-hidden">
          <Div className="flex items-center gap-3 px-4 py-2 bg-muted/40 border-b text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Span className="w-20 shrink-0">
              {t("warehouseList.get.response.code")}
            </Span>
            <Span className="flex-1">
              {t("warehouseList.get.response.name")}
            </Span>
            <Span className="shrink-0 pr-20">
              {t("warehouseList.get.response.isActive")}
            </Span>
          </Div>
          {rows.map((warehouse) => (
            <WarehouseItem
              key={warehouse.id}
              warehouse={warehouse}
              onView={handleView}
              onViewStock={handleViewStock}
              activeLabel={t("warehouseList.get.widget.active")}
              inactiveLabel={t("warehouseList.get.widget.inactive")}
              defaultLabel={t("warehouseList.get.widget.default")}
              viewStockLabel={t("warehouseList.get.widget.viewStock")}
              isPickerMode={isPickerMode}
            />
          ))}
        </Div>
      ) : null}

      {/* Empty state */}
      {rows.length === 0 ? (
        <Div className="flex flex-col items-center gap-3 py-16 text-center border rounded-lg border-dashed">
          <Div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Span className="text-xl">
              {t("warehouseList.get.widget.emptyIcon")}
            </Span>
          </Div>
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-semibold">
              {t("warehouseList.get.widget.empty")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("warehouseList.get.widget.emptyHint")}
            </Span>
          </Div>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleCreate}
          >
            {t("warehouseList.get.widget.createWarehouse")}
          </Button>
        </Div>
      ) : null}
    </Div>
  );
}
