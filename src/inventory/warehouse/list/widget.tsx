"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Archive } from "next-vibe/ui/components/icons/Archive";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";
import type { InventoryWarehouseListGetResponseOutput } from "./definition";

type WarehouseRow = NonNullable<
  InventoryWarehouseListGetResponseOutput["warehouses"]
>[number];

export function InventoryWarehouseListWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  const t = useWidgetTranslation<typeof definition.GET>();
  const onPick = usePickerCallback<WarehouseRow>();

  const open = (warehouse: WarehouseRow): void => {
    if (onPick) {
      onPick(warehouse);
      return;
    }
    void import("../[warehouseId]/get/definition").then(({ default: get }) =>
      navigation.push(get.GET, {
        urlPathParams: { warehouseId: warehouse.id },
      }),
    );
  };
  const viewStock = (warehouse: WarehouseRow): void => {
    void import("../../stock/list/definition").then(({ default: list }) =>
      navigation.push(list.GET, {
        data: { warehouseId: warehouse.id },
      }),
    );
  };
  const create = (): void => {
    void Promise.all([
      import("../create/definition"),
      import("../[warehouseId]/get/definition"),
    ]).then(([{ default: write }, { default: get }]) =>
      navigation.push(write.POST, {
        replaceOnSuccess: {
          endpoint: get.GET,
          getUrlPathParams: (responseData: { result: { id: string } }) => ({
            warehouseId: responseData.result.id,
          }),
        },
      }),
    );
  };

  const warehouses = data?.warehouses ?? [];
  const title = t("warehouseList.get.title");
  const status = (row: WarehouseRow): JSX.Element => (
    <Div className="flex flex-wrap items-center gap-1.5">
      <StatusPill
        status={t(
          row.isActive
            ? "warehouseList.get.widget.active"
            : "warehouseList.get.widget.inactive",
        )}
        variant={row.isActive ? "success" : "muted"}
      />
      {row.isDefault && (
        <StatusPill
          status={t("warehouseList.get.widget.default")}
          variant="info"
        />
      )}
    </Div>
  );
  const name = (row: WarehouseRow): JSX.Element => (
    <Div className="flex min-w-0 flex-col items-start gap-0.5">
      <Button
        type="button"
        variant="link"
        className="h-auto min-h-10 justify-start whitespace-normal p-0 text-left font-semibold"
        onClick={() => open(row)}
      >
        {row.name}
      </Button>
      {row.address && (
        <Span className="text-sm text-muted-foreground">{row.address}</Span>
      )}
    </Div>
  );
  const code = (row: WarehouseRow): JSX.Element => (
    <Span className="font-mono text-sm">{row.code}</Span>
  );
  const stockAction = (row: WarehouseRow): JSX.Element | null =>
    interactive && !onPick ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-h-10"
        onClick={() => viewStock(row)}
      >
        {t("warehouseList.get.widget.viewStock")}
      </Button>
    ) : null;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={title}
        subtitle={t("warehouseList.get.widget.subtitle")}
        backButton={
          interactive &&
          navigation.canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-2 min-h-10 gap-1.5 self-start"
              onClick={() => navigation.pop()}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              {t("warehouseList.get.widget.back")}
            </Button>
          )
        }
        actions={
          interactive &&
          !onPick &&
          warehouses.length > 0 && (
            <Button type="button" className="min-h-10" onClick={create}>
              {t("warehouseList.get.widget.createWarehouse")}
            </Button>
          )
        }
      />
      {response?.success === false ? (
        <EmptyBlock
          title={response.message}
          action={
            read && interactive
              ? {
                  label: t("transferGet.get.widget.retry"),
                  onClick: () => void read.refetch(),
                }
              : undefined
          }
        />
      ) : !data ? (
        <Skeleton className="h-32 w-full" />
      ) : !warehouses.length ? (
        <EmptyBlock
          size="page"
          icon={<Archive className="size-6" aria-hidden="true" />}
          title={t("warehouseList.get.widget.empty")}
          message={t("warehouseList.get.widget.emptyHint")}
          action={
            interactive && !onPick
              ? {
                  label: t("warehouseList.get.widget.createWarehouse"),
                  onClick: create,
                }
              : undefined
          }
        />
      ) : (
        <RecordTable
          label={title}
          columns={[
            { id: "name", label: t("warehouseList.get.response.name") },
            { id: "code", label: t("warehouseList.get.response.code") },
            { id: "status", label: t("warehouseList.get.widget.status") },
            { id: "action", label: t("stockList.get.widget.actions") },
          ]}
          rows={warehouses.map((row) => ({
            id: row.id,
            cells: {
              name: name(row),
              code: code(row),
              status: status(row),
              action: stockAction(row),
            },
          }))}
          compact={
            <Div className="divide-y rounded-xl border bg-card">
              {warehouses.map((row) => (
                <Div key={row.id} className="flex min-w-0 flex-col gap-2 p-3">
                  <Div className="flex min-w-0 items-start justify-between gap-2">
                    {name(row)}
                    <Span className="shrink-0 pt-2.5 font-mono text-sm text-muted-foreground">
                      {row.code}
                    </Span>
                  </Div>
                  <Div className="flex flex-wrap items-center justify-between gap-2">
                    {status(row)}
                    {stockAction(row)}
                  </Div>
                </Div>
              ))}
            </Div>
          }
        />
      )}
    </WidgetShell>
  );
}
