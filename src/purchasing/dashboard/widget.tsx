"use client";

import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";

export function PurchasingDashboardWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const companyId = useWidgetForm<typeof definition.GET>().watch("companyId");
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const handleNewPo = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("../order/create/definition"),
        import("../order/[poId]/get/definition"),
      ]);
      navigation.push(createDef.default.POST, {
        data: { companyId },
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            poId: responseData.result.id,
          }),
        },
      });
    })();
  };

  const handleAllPos = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../order/list/definition");
      navigation.push(def.default.GET, { data: { companyId } });
    })();
  };

  const handleVendors = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../vendor/list/definition");
      navigation.push(def.default.GET, { data: { companyId } });
    })();
  };

  const handleNewVendor = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("../vendor/create/definition"),
        import("../vendor/[vendorId]/get/definition"),
      ]);
      navigation.push(createDef.default.POST, {
        data: { companyId },
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            vendorId: responseData.id,
          }),
        },
      });
    })();
  };

  if (!data) {
    return <LoadingBlock message={t("dashboard.get.widget.loading")} />;
  }
  const expectedDate = (
    date: string | null,
    overdue?: boolean,
  ): JSX.Element | null =>
    date ? (
      <Span className={overdue ? "font-medium text-destructive" : undefined}>
        {formatDocDate(date, locale)}
      </Span>
    ) : null;
  const dueCount = data.dueThisWeekCount;
  const openOrder = (poId: string): void => {
    void import("../order/[poId]/get/definition").then((mod) =>
      navigation.push(mod.default.GET, { urlPathParams: { poId } }),
    );
  };
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("dashboard.get.title")}
        subtitle={t("dashboard.get.description")}
        actions={
          <Button type="button" size="sm" onClick={handleNewPo}>
            {t("dashboard.get.widget.navNewPo")}
          </Button>
        }
      />
      <MetricGrid columns={4}>
        <MetricCard
          label={t("dashboard.get.widget.kpiDraft")}
          value={data.draftCount}
        />
        <MetricCard
          label={t("dashboard.get.widget.kpiConfirmed")}
          value={data.confirmedCount}
        />
        <MetricCard
          label={t("dashboard.get.widget.kpiAwaitingReceipt")}
          value={data.awaitingReceiptCount}
          variant={data.overdueDeliveryCount ? "warning" : "default"}
        />
        <MetricCard
          label={t("dashboard.get.widget.kpiActiveVendors")}
          value={data.activeVendorCount}
        />
      </MetricGrid>
      {data.moneyByCurrency?.map((row) => (
        <Div
          key={row.currency}
          className="grid gap-3 rounded-lg border bg-card p-4 @md:grid-cols-2"
        >
          <MetricCard
            label={`${t("dashboard.get.widget.openValue")} · ${row.currency}`}
            value={formatMoney(row.openValue, row.currency, locale)}
          />
          <MetricCard
            label={`${t("dashboard.get.widget.settledBills")} · ${row.currency}`}
            value={formatMoney(row.settledBills, row.currency, locale)}
          />
        </Div>
      ))}
      {data.deliveries && (
        <Div className="flex flex-col gap-2">
          <Div className="flex flex-wrap items-center justify-between gap-2">
            <Span className="text-lg font-semibold">
              {t("dashboard.get.widget.deliveries")}
            </Span>
            {Boolean(data.overdueDeliveryCount) && (
              <Span className="text-sm font-medium text-destructive">{`${t("dashboard.get.widget.overdue")} · ${data.overdueDeliveryCount}`}</Span>
            )}
            {dueCount > 0 && (
              <Span className="text-sm font-medium text-warning">
                {`${t("dashboard.get.widget.dueSeven")} · ${dueCount}`}
              </Span>
            )}
          </Div>
          {data.deliveries.length === 0 ? (
            <Span className="text-sm text-muted-foreground">
              {t("dashboard.get.widget.noDeliveries")}
            </Span>
          ) : (
            <RecordTable
              label={t("dashboard.get.widget.deliveries")}
              columns={[
                { id: "order", label: t("dashboard.get.widget.order") },
                { id: "supplier", label: t("dashboard.get.widget.supplier") },
                { id: "date", label: t("dashboard.get.widget.expected") },
                {
                  id: "total",
                  label: t("dashboard.get.widget.orderTotal"),
                  numeric: true,
                },
              ]}
              rows={data.deliveries.map((row) => ({
                id: row.id,
                cells: {
                  order: interactive ? (
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() => openOrder(row.id)}
                    >
                      {row.number}
                    </Button>
                  ) : (
                    row.number
                  ),
                  supplier: row.supplier,
                  date: expectedDate(row.expected, row.overdue),
                  total: formatMoney(row.total, row.currency, locale),
                },
              }))}
              compact={
                <Div className="divide-y rounded-lg border bg-card">
                  {data.deliveries.map((row) => (
                    <ListItem
                      key={row.id}
                      title={row.number}
                      subtitle={[
                        row.supplier,
                        row.expected && formatDocDate(row.expected, locale),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                      meta={
                        <Span className="tabular-nums">
                          {formatMoney(row.total, row.currency, locale)}
                        </Span>
                      }
                      onClick={
                        interactive ? () => openOrder(row.id) : undefined
                      }
                    />
                  ))}
                </Div>
              }
            />
          )}
        </Div>
      )}
      {/* Quick nav */}
      <Div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAllPos}
        >
          {t("dashboard.get.widget.navAllPos")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleVendors}
        >
          {t("dashboard.get.widget.navVendors")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleNewVendor}
        >
          {t("dashboard.get.widget.navNewVendor")}
        </Button>
      </Div>
    </WidgetShell>
  );
}
