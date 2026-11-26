"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Receipt } from "next-vibe/ui/components/icons/Receipt";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { PosOrderStatus, PosOrderStatusDB } from "../../enum";
import { orderTotalsByCurrency } from "../display-totals";
import type definition from "./definition";
import type {
  PosOrderListRequestOutput,
  PosOrderListResponseOutput,
} from "./definition";

type Order = NonNullable<PosOrderListResponseOutput["orders"]>[number];
type OrderStatusFilter =
  | NonNullable<PosOrderListRequestOutput["input"]["status"]>
  | undefined;

function statusVariant(status: string): StatusPillVariant {
  if (status === PosOrderStatus.COMPLETED) {
    return "success";
  }
  if (status === PosOrderStatus.OPEN) {
    return "info";
  }
  return "muted";
}

const FILTERS: readonly OrderStatusFilter[] = [
  undefined,
  PosOrderStatus.COMPLETED,
  PosOrderStatus.OPEN,
  PosOrderStatus.VOIDED,
];

export function PosOrderListWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: { field: (typeof definition.GET)["fields"] },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const pickerCallback = usePickerCallback<Order>();

  const sessionId = form?.watch("input.sessionId");
  const status = form?.watch("input.status");
  const page = form?.watch("page") ?? 1;
  const pageSize = form?.watch("pageSize") ?? 20;

  const openOrder = (order: Order): void => {
    if (pickerCallback) {
      pickerCallback(order);
      navigation.pop();
      return;
    }
    void import("@/pos/order/[orderId]/get/definition").then((def) =>
      navigation.push(def.default.GET, {
        urlPathParams: { orderId: order.id },
      }),
    );
  };

  const openRegister = (): void => {
    if (!sessionId) {
      return;
    }
    void import("../../session/[sessionId]/register/definition").then((def) =>
      navigation.push(def.default.GET, { urlPathParams: { sessionId } }),
    );
  };

  const statusLabel = (value: string): string => {
    const key = PosOrderStatusDB.find((entry) => entry === value);
    return key ? t(key) : value;
  };

  const formatDate = (value: Date): string =>
    new Date(value).toLocaleString(locale, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const back = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-1 gap-1.5"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("orderList.get.widget.back")}
    </Button>
  ) : undefined;

  const orders = data?.orders ?? [];
  const totals = orderTotalsByCurrency(orders);
  const total = data?.count ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        title={t("orderList.get.widget.title")}
        subtitle={t(
          sessionId
            ? "orderList.get.widget.subtitleSession"
            : "orderList.get.widget.subtitleAll",
        )}
        size="page"
        backButton={back}
        actions={
          sessionId ? (
            <Button type="button" onClick={openRegister}>
              {t("orderList.get.widget.openRegister")}
            </Button>
          ) : undefined
        }
      />
      <FormAlertWidget field={{}} />

      <Div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Button
            key={filter ?? "all"}
            type="button"
            size="sm"
            variant={status === filter ? "default" : "outline"}
            onClick={() => {
              form?.setValue("input.status", filter, { shouldDirty: true });
              form?.setValue("page", 1, { shouldDirty: true });
            }}
          >
            {filter ? statusLabel(filter) : t("orderList.get.widget.filterAll")}
          </Button>
        ))}
      </Div>

      {!data ? (
        <LoadingBlock />
      ) : orders.length === 0 ? (
        <EmptyBlock
          size="page"
          icon={<Receipt className="h-6 w-6" />}
          title={t("orderList.get.widget.empty")}
          message={t("orderList.get.widget.emptyHint")}
        />
      ) : (
        <Div className="overflow-hidden rounded-xl border bg-card">
          <Div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,0.8fr)] gap-4 border-b px-4 py-2.5 text-xs font-medium text-muted-foreground @2xl:grid">
            <Span>{t("orderList.get.widget.colSale")}</Span>
            <Span>{t("orderList.get.response.terminalName")}</Span>
            <Span>{t("orderList.get.widget.colTime")}</Span>
            <Span>{t("orderList.get.widget.colStatus")}</Span>
            <Span className="text-right">
              {t("orderList.get.widget.colTotal")}
            </Span>
          </Div>
          <Div className="flex flex-col divide-y">
            {orders.map((order) => (
              <Div
                key={order.id}
                tabIndex={0}
                onClick={() => openOrder(order)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    openOrder(order);
                  }
                }}
                className={`flex cursor-pointer flex-col gap-1 px-4 py-3 transition-colors hover:bg-muted/40 @2xl:grid @2xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,0.8fr)] @2xl:items-center @2xl:gap-4 ${order.status === PosOrderStatus.VOIDED ? "opacity-70" : ""}`}
              >
                <Div className="flex items-center justify-between gap-3 @2xl:contents">
                  <Span className="min-w-0 truncate text-sm font-semibold">
                    {order.orderNumber}
                  </Span>
                  <Span className="text-sm font-semibold tabular-nums @2xl:hidden">
                    {formatMoney(Number(order.total), order.currency, locale)}
                  </Span>
                </Div>
                <Span className="hidden truncate text-sm text-muted-foreground @2xl:block">
                  {order.terminalName ?? ""}
                </Span>
                <Div className="flex items-center justify-between gap-3 @2xl:contents">
                  <Span className="text-xs text-muted-foreground tabular-nums @2xl:text-sm">
                    <Span className="@2xl:hidden">
                      {order.terminalName ? `${order.terminalName} · ` : ""}
                    </Span>
                    {formatDate(order.createdAt)}
                  </Span>
                  <StatusPill
                    status={order.status}
                    variant={statusVariant(order.status)}
                    label={statusLabel(order.status)}
                  />
                </Div>
                <Span className="hidden text-right text-sm font-semibold tabular-nums @2xl:block">
                  {formatMoney(Number(order.total), order.currency, locale)}
                </Span>
              </Div>
            ))}
          </Div>
          <Div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/30 px-4 py-3 text-sm">
            <Span className="text-muted-foreground">
              {t("orderList.get.widget.count", { count: String(total) })}
            </Span>
            <Span className="font-semibold tabular-nums">
              {totals
                .map((row) => formatMoney(row.amount, row.currency, locale))
                .join(" · ")}
            </Span>
          </Div>
        </Div>
      )}

      {lastPage > 1 ? (
        <Div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() =>
              form?.setValue("page", page - 1, { shouldDirty: true })
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Span className="text-sm text-muted-foreground tabular-nums">
            {page} / {lastPage}
          </Span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= lastPage}
            onClick={() =>
              form?.setValue("page", page + 1, { shouldDirty: true })
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Div>
      ) : null}
    </WidgetShell>
  );
}
