"use client";

import { UserRole } from "next-vibe/identity/roles/enum";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Archive } from "next-vibe/ui/components/icons/Archive";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { RefreshCcw } from "next-vibe/ui/components/icons/RefreshCcw";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX, ReactNode } from "react";

import { scopedTranslation as liabilityTranslation } from "@/finance/credit-liabilities/i18n";

import type definition from "./definition";

export function InventoryDashboardWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t: finances } = liabilityTranslation.scopedT(locale);
  const viewer = useWidgetUser();

  const number = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 4,
  });
  const interactive = useWidgetIsInteractive();
  const selectedCompanyId =
    useWidgetForm<typeof definition.GET>().watch("companyId");
  const hasFinancialTools = viewer.roles.some(
    (role) => role === UserRole.ADMIN,
  );
  const openSupplierBalances = (): void => {
    void import("@/finance/supplier-evidence/definition").then(
      ({ default: endpoint }) =>
        navigation.push(endpoint.GET, {
          data: { companyId: selectedCompanyId },
        }),
    );
  };
  const openCreditLiabilities = (): void => {
    void import("@/finance/credit-liabilities/definition").then(
      ({ default: endpoint }) =>
        navigation.push(endpoint.GET, {
          data: { companyId: selectedCompanyId },
        }),
    );
  };
  const handleStockLevels = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../stock/list/definition");
      navigation.push(def.default.GET, {
        data: { companyId: selectedCompanyId },
      });
    })();
  };

  const handleTransfers = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../transfer/list/definition");
      navigation.push(def.default.GET, {
        data: { companyId: selectedCompanyId },
      });
    })();
  };

  const handleWarehouses = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../warehouse/list/definition");
      navigation.push(def.default.GET, {
        data: { companyId: selectedCompanyId },
      });
    })();
  };

  if (!data) {
    return <LoadingBlock message={t("dashboard.get.widget.loading")} />;
  }

  const outCount = data.outOfStockCount;
  const queue = data.attention ?? [];
  const receive = (): void => {
    void import("../stock/receive/definition").then((mod) =>
      navigation.push(mod.default.POST, {}),
    );
  };
  const newTransfer = (): void => {
    void Promise.all([
      import("../transfer/create/definition"),
      import("../transfer/[transferId]/get/definition"),
    ]).then(([{ default: write }, { default: readEndpoint }]) =>
      navigation.push(write.POST, {
        data: selectedCompanyId ? { companyId: selectedCompanyId } : undefined,
        replaceOnSuccess: {
          endpoint: readEndpoint.GET,
          getUrlPathParams: (responseData: { result: { id: string } }) => ({
            transferId: responseData.result.id,
          }),
        },
      }),
    );
  };
  const createWarehouse = (): void => {
    void Promise.all([
      import("../warehouse/create/definition"),
      import("../warehouse/[warehouseId]/get/definition"),
    ]).then(([{ default: write }, { default: readEndpoint }]) =>
      navigation.push(write.POST, {
        data: selectedCompanyId ? { companyId: selectedCompanyId } : undefined,
        replaceOnSuccess: {
          endpoint: readEndpoint.GET,
          getUrlPathParams: (responseData: { result: { id: string } }) => ({
            warehouseId: responseData.result.id,
          }),
        },
      }),
    );
  };
  const noWarehouses = data.warehouseCount === 0;
  const sections: {
    key: string;
    icon: ReactNode;
    title: string;
    hint: string;
    onClick: () => void;
  }[] = [
    {
      key: "stock",
      icon: <Layers className="size-5" aria-hidden="true" />,
      title: t("dashboard.get.widget.navStockLevels"),
      hint: t("dashboard.get.widget.navStockLevelsHint"),
      onClick: handleStockLevels,
    },
    {
      key: "transfers",
      icon: <RefreshCcw className="size-5" aria-hidden="true" />,
      title: t("dashboard.get.widget.navTransfers"),
      hint: t("dashboard.get.widget.navTransfersHint", {
        count: data.pendingTransferCount,
      }),
      onClick: handleTransfers,
    },
    {
      key: "warehouses",
      icon: <Archive className="size-5" aria-hidden="true" />,
      title: t("dashboard.get.widget.navWarehouses"),
      hint: t("dashboard.get.widget.navWarehousesHint", {
        count: data.warehouseCount,
      }),
      onClick: handleWarehouses,
    },
  ];
  const newOrder = (companyId: string, warehouseId: string): void => {
    void import("@/purchasing/order/create/definition").then((mod) =>
      navigation.push(mod.default.POST, {
        data: { companyId, deliveryWarehouseId: warehouseId },
      }),
    );
  };
  const orderAction = (row: (typeof queue)[number]): JSX.Element | null =>
    interactive ? (
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => newOrder(row.companyId, row.warehouseId)}
      >
        {t("dashboard.get.widget.newPurchaseOrder")}
      </Button>
    ) : null;
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("dashboard.get.title")}
        subtitle={t("dashboard.get.description")}
        actions={
          interactive &&
          !noWarehouses && (
            <>
              {data.warehouseCount > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-10"
                  onClick={newTransfer}
                >
                  {t("transferCreate.post.titleShort")}
                </Button>
              )}
              <Button type="button" className="min-h-10" onClick={receive}>
                {t("stockReceive.post.title")}
              </Button>
            </>
          )
        }
      />
      {noWarehouses ? (
        <EmptyBlock
          size="page"
          icon={<Archive className="size-6" aria-hidden="true" />}
          title={t("dashboard.get.widget.noWarehouses")}
          message={t("dashboard.get.widget.noWarehousesHint")}
          action={
            interactive
              ? {
                  label: t("warehouseCreate.post.title"),
                  onClick: createWarehouse,
                }
              : undefined
          }
        />
      ) : (
        <>
          <MetricGrid columns={4}>
            <MetricCard
              label={t("dashboard.get.widget.kpiInStock")}
              value={data.inStockCount}
            />
            <MetricCard
              label={t("dashboard.get.widget.kpiOutOfStock")}
              value={outCount}
              variant={outCount > 0 ? "danger" : "default"}
            />
            <MetricCard
              label={t("dashboard.get.widget.kpiLowStock")}
              value={data.lowStockCount}
              variant={data.lowStockCount > 0 ? "warning" : "default"}
            />
            <MetricCard
              label={t("dashboard.get.widget.kpiTransfersInTransit")}
              value={data.pendingTransferCount}
            />
          </MetricGrid>

          <Div className="flex flex-col gap-3">
            <Span className="text-[15px] font-semibold">
              {t("dashboard.get.widget.attention")}
            </Span>
            {queue.length ? (
              <RecordTable
                label={t("dashboard.get.widget.attention")}
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
                    id: "available",
                    label: t("stockList.get.widget.available"),
                    numeric: true,
                  },
                  { id: "action", label: t("stockList.get.widget.actions") },
                ]}
                rows={queue.map((row) => ({
                  id: row.id,
                  cells: {
                    product:
                      row.productName ??
                      t("stockList.get.widget.unnamedProduct"),
                    warehouse: row.warehouseName,
                    available: number.format(row.available),
                    action: orderAction(row),
                  },
                }))}
                compact={
                  <Div className="flex flex-col divide-y rounded-lg border bg-card">
                    {queue.map((row) => (
                      <Div
                        key={row.id}
                        className="flex flex-wrap items-center justify-between gap-2 p-3"
                      >
                        <Div className="flex min-w-0 flex-col gap-1">
                          <Span className="font-medium">
                            {row.productName ??
                              t("stockList.get.widget.unnamedProduct")}
                          </Span>
                          <Span className="text-sm text-muted-foreground">
                            {row.warehouseName}
                          </Span>
                          <Span className="text-sm tabular-nums">
                            {t("stockList.get.widget.available")}{" "}
                            {number.format(row.available)}
                          </Span>
                        </Div>
                        {orderAction(row)}
                      </Div>
                    ))}
                  </Div>
                }
              />
            ) : (
              <EmptyBlock title={t("dashboard.get.widget.noAttention")} />
            )}
          </Div>
        </>
      )}
      {interactive && (
        <Div className="grid grid-cols-1 gap-3 @2xl:grid-cols-3">
          {sections.map((section) => (
            <Button
              key={section.key}
              type="button"
              variant="outline"
              aria-label={section.title}
              className="h-auto min-h-16 justify-start gap-3 whitespace-normal rounded-xl bg-card p-4 text-left"
              onClick={section.onClick}
            >
              <Div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                {section.icon}
              </Div>
              <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Span className="font-semibold">{section.title}</Span>
                <Span className="text-sm font-normal text-muted-foreground">
                  {section.hint}
                </Span>
              </Div>
              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </Button>
          ))}
        </Div>
      )}
      {interactive && hasFinancialTools && selectedCompanyId && (
        <Div className="flex flex-wrap items-center gap-2 border-t pt-4">
          <Span className="mr-1 text-sm text-muted-foreground">
            {t("dashboard.get.widget.related")}
          </Span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openSupplierBalances}
          >
            {finances("supplierLink")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openCreditLiabilities}
          >
            {finances("title")}
          </Button>
        </Div>
      )}
    </WidgetShell>
  );
}
