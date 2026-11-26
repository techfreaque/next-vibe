"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ShoppingBag } from "next-vibe/ui/components/icons/ShoppingBag";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { RecordTable } from "next-vibe/ui/components/record-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { canRetryRecordRead } from "next-vibe/unified-ui/_shared/admin-record-context";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { PurchaseOrderStatusDB } from "../../enum";
import { isPurchaseDeliveryOverdue, purchaseOrderStatus } from "../status";
import type definition from "./definition";
import type { OrderListResponseOutput } from "./definition";

type Order = NonNullable<OrderListResponseOutput["result"]>[number];

export function OrderListWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const onPick = usePickerCallback<{ id: string; poNumber: string }>();
  const companyId = form.watch("companyId");
  const vendorId = form.watch("vendorId");
  const filter = form.watch("status");

  const open = (order: Order): void => {
    if (onPick) {
      onPick({ id: order.id, poNumber: order.poNumber });
      navigation.pop();
      return;
    }
    void import("../[poId]/get/definition").then(({ default: endpoint }) =>
      navigation.push(endpoint.GET, { urlPathParams: { poId: order.id } }),
    );
  };
  const create = (): void => {
    void import("../create/definition").then(({ default: endpoint }) =>
      navigation.push(endpoint.POST, { data: { companyId, vendorId } }),
    );
  };
  const selectStatus = (status: typeof filter): void => {
    form.setValue("status", status, { shouldDirty: true });
  };
  const orders = data?.result ?? [];
  const rows = orders.map((order) => {
    const state = purchaseOrderStatus(order.status, t);
    const badge = (
      <StatusPill
        status={order.status}
        label={state.label}
        variant={state.variant}
      />
    );
    const amount = formatMoney(order.total, order.currency, locale);
    const reference = interactive ? (
      <Button
        type="button"
        variant="link"
        className="h-auto justify-start whitespace-normal p-0 text-left font-semibold dark:text-blue-300"
        onClick={() => open(order)}
      >
        {order.poNumber}
      </Button>
    ) : (
      <Span className="font-semibold">{order.poNumber}</Span>
    );
    const date = order.createdAt ? formatDocDate(order.createdAt, locale) : "";
    const overdue = isPurchaseDeliveryOverdue(
      order.expectedDeliveryDate,
      order.status,
    );
    const expected = order.expectedDeliveryDate && (
      <Span
        className={
          overdue
            ? "text-xs font-medium text-destructive"
            : "text-xs text-muted-foreground"
        }
      >
        {t("orderList.get.widget.deliveryArrow")}{" "}
        {formatDocDate(order.expectedDeliveryDate, locale)}
        {overdue && <> {t("orderList.get.widget.overdue")}</>}
      </Span>
    );
    const identity = (
      <Div className="flex min-w-0 flex-col items-start gap-0.5">
        {reference}
        <Span className="break-words text-sm text-muted-foreground">
          {order.vendorName}
        </Span>
      </Div>
    );
    const dates = (
      <Div className="flex flex-col gap-0.5">
        {date}
        {expected}
      </Div>
    );
    return {
      id: order.id,
      cells: { order: identity, date: dates, amount, status: badge },
    };
  });
  const title = t("orderList.get.title");
  const filterLabel = t("orderList.get.widget.statusAll");
  const ready = data !== undefined && !read?.isLoadingFresh;
  const readyToBill = orders.filter(({ status }) => status === "RECEIVED");
  const overdueOrders = orders.filter(
    (order) =>
      (order.status === "CONFIRMED" || order.status === "PARTIALLY_RECEIVED") &&
      isPurchaseDeliveryOverdue(order.expectedDeliveryDate, order.status),
  );
  const attention = readyToBill.length + overdueOrders.length;
  const attentionOrder =
    attention === 1 ? (readyToBill[0] ?? overdueOrders[0]) : undefined;
  const counts = new Intl.NumberFormat(locale);
  return (
    <WidgetShell layout={onPick ? "compact" : "page"}>
      {!onPick && (
        <WidgetHeader
          size="page"
          title={title}
          subtitle={
            ready
              ? `${orders.length} ${t(orders.length === 1 ? "orderList.get.widget.order" : "orderList.get.widget.orders")}`
              : undefined
          }
          backButton={
            interactive &&
            navigation.canGoBack && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => navigation.pop()}
              >
                <ChevronLeft className="size-4" />
                {t("orderList.get.widget.back")}
              </Button>
            )
          }
          actions={
            interactive && (
              <Button type="button" size="sm" onClick={create}>
                {t("orderList.get.widget.newOrder")}
              </Button>
            )
          }
        />
      )}
      {!onPick && interactive && (orders.length > 0 || filter) && (
        <>
          <Div className="flex min-w-0 items-center gap-2 sm:hidden">
            <Span className="shrink-0 text-sm text-muted-foreground">
              {t("orderList.get.status.label")}
            </Span>
            <Select
              value={filter ?? "all"}
              onValueChange={(value) =>
                selectStatus(
                  PurchaseOrderStatusDB.find((status) => status === value),
                )
              }
            >
              <SelectTrigger
                className="min-w-0"
                aria-label={t("orderList.get.status.label")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{filterLabel}</SelectItem>
                {PurchaseOrderStatusDB.map((value) => (
                  <SelectItem key={value} value={value}>
                    {purchaseOrderStatus(value, t).label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>
          <Div className="hidden flex-wrap items-center gap-1 sm:flex">
            {[undefined, ...PurchaseOrderStatusDB].map((value) => (
              <Button
                type="button"
                key={value ?? "all"}
                aria-pressed={value === filter}
                variant={value === filter ? "secondary" : "ghost"}
                size="sm"
                onClick={() => selectStatus(value)}
              >
                {value ? purchaseOrderStatus(value, t).label : filterLabel}
              </Button>
            ))}
          </Div>
        </>
      )}
      {response?.success === false ? (
        <EmptyBlock
          title={response.message}
          action={
            interactive &&
            read &&
            canRetryRecordRead(response.errorType.errorCode)
              ? {
                  label: t("orderReceive.post.widget.retry"),
                  onClick: () => void read.refetch(),
                }
              : undefined
          }
        />
      ) : !ready ? (
        <LoadingBlock message={t("orderList.get.widget.loading")} />
      ) : rows.length === 0 ? (
        <EmptyBlock
          title={t("orderList.get.widget.empty")}
          icon={<ShoppingBag />}
          action={
            interactive && filter
              ? { label: filterLabel, onClick: () => selectStatus(undefined) }
              : undefined
          }
        />
      ) : (
        <>
          {!onPick && attention > 0 && (
            <Div className="flex flex-col gap-1 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm">
              <Span className="font-semibold">
                {t("orderList.get.widget.attentionCount", { count: attention })}
              </Span>
              {readyToBill.length > 0 && (
                <Div className="flex items-start gap-2">
                  <Span className="tabular-nums">
                    {counts.format(readyToBill.length)}
                  </Span>
                  <Span>{t("orderList.get.widget.readyToBill")}</Span>
                </Div>
              )}
              {overdueOrders.length > 0 && (
                <Div className="flex items-start gap-2">
                  <Span className="tabular-nums">
                    {counts.format(overdueOrders.length)}
                  </Span>
                  <Span>{t("dashboard.get.widget.overdue")}</Span>
                </Div>
              )}
              {interactive && attentionOrder && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1 h-auto min-h-9 self-start whitespace-normal text-start dark:text-blue-300"
                  onClick={() => open(attentionOrder)}
                >
                  {t("orderList.get.widget.openAttentionOrder", {
                    reference: attentionOrder.poNumber,
                  })}
                </Button>
              )}
            </Div>
          )}
          <RecordTable
            label={title}
            columns={[
              { id: "order", label: t("orderList.get.widget.colPoVendor") },
              { id: "date", label: t("orderList.get.widget.colDate") },
              {
                id: "amount",
                label: t("orderList.get.widget.colAmount"),
                numeric: true,
              },
              { id: "status", label: t("orderList.get.widget.colStatus") },
            ]}
            rows={rows}
            compact={
              <Div className="divide-y rounded-lg border bg-card">
                {rows.map(({ id, cells }) => (
                  <Div
                    key={id}
                    className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-2 p-3"
                  >
                    {cells.order}
                    <Span className="text-right font-semibold tabular-nums">
                      {cells.amount}
                    </Span>
                    <Div className="text-xs text-muted-foreground">
                      {cells.date}
                    </Div>
                    <Div className="text-right">{cells.status}</Div>
                  </Div>
                ))}
              </Div>
            }
          />
        </>
      )}
    </WidgetShell>
  );
}
