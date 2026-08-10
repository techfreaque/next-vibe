"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX } from "react";

import type definition from "./definition";
import type {
  PosOrderListRequestOutput,
  PosOrderListResponseOutput,
} from "./definition";

type Order = NonNullable<PosOrderListResponseOutput["orders"]>[number];
type OrderStatusFilter =
  | NonNullable<PosOrderListRequestOutput["input"]["status"]>
  | undefined;

function orderStatusBadgeClass(status: string): string {
  if (status.includes("open")) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
  }
  if (status.includes("completed")) {
    return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
  }
  return "bg-muted text-muted-foreground";
}

function OrderRow({
  order,
  currency,
  locale,
  onView,
  statusLabel,
  itemsLabel,
}: {
  order: Order;
  currency: string;
  locale: CountryLanguage;
  onView: (id: string) => void;
  statusLabel: string;
  itemsLabel: string;
}): JSX.Element {
  return (
    <Div
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer transition-colors border-b last:border-b-0"
      onClick={() => onView(order.id)}
    >
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="text-sm font-mono font-bold">
            #{order.orderNumber}
          </Span>
          <Span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${orderStatusBadgeClass(order.status)}`}
          >
            {statusLabel}
          </Span>
        </Div>
        <Div className="flex items-center gap-2 mt-0.5">
          <Span className="text-xs text-muted-foreground tabular-nums">
            {new Date(order.createdAt).toLocaleString(locale)}
          </Span>
        </Div>
      </Div>
      <Div className="flex flex-col items-end gap-0.5 shrink-0">
        <Span className="text-sm font-mono font-semibold tabular-nums">
          {new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
          }).format(Number(order.total))}
        </Span>
        <Span className="text-xs text-muted-foreground">{itemsLabel}</Span>
      </Div>
    </Div>
  );
}

const STATUS_FILTERS: Array<{
  value: OrderStatusFilter;
  labelKey:
    | "orderList.get.widget.filterAll"
    | "enums.orderStatus.open"
    | "enums.orderStatus.completed"
    | "enums.orderStatus.voided";
}> = [
  { value: undefined, labelKey: "orderList.get.widget.filterAll" },
  { value: "enums.orderStatus.open", labelKey: "enums.orderStatus.open" },
  {
    value: "enums.orderStatus.completed",
    labelKey: "enums.orderStatus.completed",
  },
  { value: "enums.orderStatus.voided", labelKey: "enums.orderStatus.voided" },
];

export function PosOrderListWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const activeStatus = form?.watch("input.status");
  const onPick =
    usePickerCallback<
      NonNullable<
        (typeof definition.GET.types.ResponseOutput)["orders"]
      >[number]
    >();
  const isPickerMode = !!onPick;

  const handleViewOrder = (orderId: string): void => {
    if (isPickerMode) {
      const order = (data?.orders ?? []).find((o) => o.id === orderId);
      if (order && onPick) {
        onPick(order);
        navigation.pop();
      }
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("@/pos/order/[orderId]/get/definition");
      navigation.push(def.default.GET, { urlPathParams: { orderId } });
    })();
  };

  const handleNewOrder = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/pos/order/create/definition");
      const sessionId = form?.getValues("input.sessionId") ?? "";
      navigation.push(def.default.POST, {
        data: {
          details: { sessionId, customerId: undefined, currency: undefined },
        },
      });
    })();
  };

  const getStatusLabel = (status: string): string => {
    // status value IS the translation key (e.g., "enums.orderStatus.open")
    return t(status as Parameters<typeof t>[0]);
  };

  const handleFilterChange = (value: OrderStatusFilter): void => {
    form?.setValue("input.status", value, { shouldDirty: true });
  };

  // Loading state
  if (!data) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
        <FormAlertWidget field={{}} />
        <Div className="flex flex-col items-center gap-3 py-12 text-center">
          <Div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
          <Span className="text-sm text-muted-foreground">
            {t("orderList.get.widget.loading")}
          </Span>
        </Div>
      </Div>
    );
  }

  const orders = data.orders ?? [];
  const firstOrder = orders[0];
  const currency = firstOrder?.currency ?? "EUR";

  const sessionTotal = orders
    .filter((o: Order) => o.status !== "VOIDED")
    .reduce((sum: number, o: Order) => sum + Number(o.total), 0);

  // Group: OPEN first, COMPLETED, then VOIDED
  const openOrders = orders.filter((o: Order) => o.status.includes("open"));
  const completedOrders = orders.filter((o: Order) =>
    o.status.includes("completed"),
  );
  const voidedOrders = orders.filter((o: Order) => o.status.includes("void"));
  const sortedOrders = [...openOrders, ...completedOrders, ...voidedOrders];

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {/* Back button */}
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("orderList.get.widget.back")}
        </Button>
      )}

      {/* Header */}
      <Div className="flex items-center justify-between gap-3">
        <Div className="flex flex-col gap-0.5">
          <Span className="text-base font-semibold">
            {new Intl.NumberFormat(locale, {
              style: "currency",
              currency,
            }).format(sessionTotal)}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {data.count} {t("orderList.get.widget.ordersTotal")}
          </Span>
        </Div>
        {!isPickerMode && (
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={handleNewOrder}
          >
            + {t("orderList.get.widget.newOrder")}
          </Button>
        )}
      </Div>

      {/* Status filter tabs — full mode only */}
      {!isPickerMode && (
        <Div className="flex gap-1 border-b pb-2">
          {STATUS_FILTERS.map((filter) => {
            const isActive = activeStatus === filter.value;
            return (
              <Button
                key={filter.value ?? "all"}
                type="button"
                size="sm"
                variant={isActive ? "default" : "ghost"}
                className="h-7 px-3 text-xs"
                onClick={() => handleFilterChange(filter.value)}
              >
                {t(filter.labelKey)}
              </Button>
            );
          })}
        </Div>
      )}

      {/* Order list or empty */}
      {orders.length === 0 ? (
        <Div className="flex flex-col items-center gap-4 py-12 text-center rounded-lg border border-dashed">
          <Div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-muted-foreground/20" />
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-medium">
              {t("orderList.get.widget.empty")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("orderList.get.widget.emptyHint")}
            </Span>
          </Div>
          {!isPickerMode && (
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={handleNewOrder}
            >
              + {t("orderList.get.widget.newOrder")}
            </Button>
          )}
        </Div>
      ) : (
        <Div className="rounded-lg border overflow-hidden">
          {sortedOrders.map((order: Order) => (
            <OrderRow
              key={order.id}
              order={order}
              currency={currency}
              locale={locale}
              onView={handleViewOrder}
              statusLabel={getStatusLabel(order.status)}
              itemsLabel={t("orderList.get.widget.tapToView")}
            />
          ))}
        </Div>
      )}
    </Div>
  );
}
