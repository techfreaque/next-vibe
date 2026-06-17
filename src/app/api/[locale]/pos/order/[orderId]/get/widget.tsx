"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe-ui/unified/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import { type JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import type definition from "./definition";
import type { PosOrderGetResponseOutput } from "./definition";

type OrderItem = NonNullable<
  PosOrderGetResponseOutput["result"]
>["items"][number];
type OrderPayment = NonNullable<
  PosOrderGetResponseOutput["result"]
>["payments"][number];

function orderStatusBadgeClass(status: string): string {
  if (status.includes("open")) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
  }
  if (status.includes("completed")) {
    return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
  }
  return "bg-muted text-muted-foreground";
}

function paymentMethodBadgeVariant(
  method: string,
): "default" | "secondary" | "outline" {
  if (method.includes("cash")) {
    return "default";
  }
  if (method.includes("card")) {
    return "secondary";
  }
  return "outline";
}

export function PosOrderGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const order = data?.result;

  const handleAddItem = (orderId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../add-item/definition");
      navigation.push(def.default.POST, {
        data: {
          orderId,
          item: {
            productId: undefined,
            description: "",
            quantity: 1,
            unitPrice: 0,
            taxRate: undefined,
          },
        },
      });
    })();
  };

  const handleAddPayment = (orderId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../add-payment/definition");
      const { PosPaymentMethod } = await import("@/app/api/[locale]/pos/enum");
      navigation.push(def.default.POST, {
        data: {
          details: {
            orderId,
            method: PosPaymentMethod.CASH,
            amount: 0,
            change: undefined,
            reference: undefined,
            accountNodeId: undefined,
          },
        },
      });
    })();
  };

  const handleComplete = (orderId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../complete/definition");
      navigation.push(def.default.POST, {
        data: { orderId },
      });
    })();
  };

  const handleVoid = (orderId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../void/definition");
      navigation.push(def.default.POST, {
        data: { orderId },
      });
    })();
  };

  const handleViewJournalEntry = (journalEntryId: string): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/chart-of-accounts/journal/[entryId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { entryId: journalEntryId },
      });
    })();
  };

  const fmt = (n: number, currency: string): string =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(n);

  if (!order) {
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
            {t("orderGet.get.widget.back")}
          </Button>
        )}
        <EntityPickerFieldWidget
          fieldName="orderId"
          field={field.children.orderId}
        />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "orderGet.get.widget.select" as const }}
        />
      </Div>
    );
  }

  const isOpen = order.status.includes("open");
  const isVoided = order.status.includes("void");
  const isCompleted = order.status.includes("completed");
  const totalPaid = order.payments.reduce(
    (sum: number, p: OrderPayment) => sum + Number(p.amount) - Number(p.change),
    0,
  );
  const outstanding = Number(order.total) - totalPaid;

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
          {t("orderGet.get.widget.back")}
        </Button>
      )}

      <FormAlertWidget field={{}} />

      {/* Header: order number + status */}
      <Div className="flex items-center justify-between gap-2">
        <Div className="flex items-center gap-2">
          <Span className="text-lg font-mono font-bold">
            #{order.orderNumber}
          </Span>
          <Span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${orderStatusBadgeClass(order.status)}`}
          >
            {t(order.status as Parameters<typeof t>[0])}
          </Span>
        </Div>
        <Span className="text-xs text-muted-foreground tabular-nums">
          {new Date(order.createdAt).toLocaleString(locale)}
        </Span>
      </Div>

      {/* Total summary */}
      <Div className="rounded-lg border overflow-hidden divide-y">
        <Div className="flex items-center justify-between px-4 py-3">
          <Span className="text-sm text-muted-foreground">
            {t("orderGet.get.response.subtotal")}
          </Span>
          <Span className="text-sm font-mono tabular-nums">
            {fmt(Number(order.subtotal), order.currency)}
          </Span>
        </Div>
        {Number(order.taxAmount) > 0 ? (
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("orderGet.get.response.taxAmount")}
            </Span>
            <Span className="text-sm font-mono tabular-nums">
              {fmt(Number(order.taxAmount), order.currency)}
            </Span>
          </Div>
        ) : null}
        <Div className="flex items-center justify-between px-4 py-3 bg-muted/10">
          <Span className="text-sm font-semibold">
            {t("orderGet.get.response.total")}
          </Span>
          <Span className="text-lg font-mono font-bold tabular-nums">
            {fmt(Number(order.total), order.currency)}
          </Span>
        </Div>
      </Div>

      {/* Outstanding balance / fully paid indicator */}
      {isOpen && order.items.length > 0 ? (
        <OutstandingBalance
          outstanding={outstanding}
          currency={order.currency}
          locale={locale}
          t={t}
        />
      ) : null}

      {/* Items list */}
      {order.items.length > 0 ? (
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
            {t("orderGet.get.response.items")}
          </Span>
          <Div className="rounded-lg border overflow-hidden divide-y">
            {order.items.map((item: OrderItem) => (
              <Div
                key={item.itemId}
                className="flex items-center gap-3 px-4 py-3"
              >
                <Div className="flex-1 min-w-0">
                  <Span className="text-sm font-medium truncate block">
                    {item.description}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {item.quantity} {t("orderGet.get.widget.qtyTimesPrice")}{" "}
                    {fmt(Number(item.unitPrice), order.currency)}
                  </Span>
                </Div>
                <Span className="text-sm font-mono font-semibold tabular-nums shrink-0">
                  {fmt(Number(item.lineTotal), order.currency)}
                </Span>
              </Div>
            ))}
          </Div>
        </Div>
      ) : isOpen ? (
        <Div className="flex flex-col items-center gap-2 py-6 text-center rounded-lg border border-dashed">
          <Span className="text-sm text-muted-foreground">
            {t("orderGet.get.widget.noItems")}
          </Span>
        </Div>
      ) : null}

      {/* Payments list */}
      {order.payments.length > 0 ? (
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
            {t("orderGet.get.response.payments")}
          </Span>
          <Div className="rounded-lg border overflow-hidden divide-y">
            {order.payments.map((payment: OrderPayment) => (
              <Div
                key={payment.paymentId}
                className="flex items-center gap-3 px-4 py-3"
              >
                <Badge
                  variant={paymentMethodBadgeVariant(payment.method)}
                  className="text-xs shrink-0"
                >
                  {t(payment.method as Parameters<typeof t>[0])}
                </Badge>
                <Span className="flex-1 text-sm font-mono tabular-nums">
                  {fmt(Number(payment.amount), order.currency)}
                </Span>
                {Number(payment.change) > 0 ? (
                  <Span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {t("orderGet.get.response.change")}:{" "}
                    {fmt(Number(payment.change), order.currency)}
                  </Span>
                ) : null}
              </Div>
            ))}
          </Div>
        </Div>
      ) : null}

      {/* VOIDED stamp */}
      {isVoided ? (
        <Div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/40 py-4 opacity-60">
          <Span className="text-2xl font-black tracking-widest text-muted-foreground select-none rotate-[-6deg] inline-block">
            {t("orderGet.get.widget.voidedStamp")}
          </Span>
        </Div>
      ) : null}

      {/* COMPLETED read-only notice + journal entry */}
      {isCompleted ? (
        <Div className="flex flex-col gap-2">
          <Div className="rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-3">
            <Span className="text-sm text-green-700 dark:text-green-400">
              {t("orderGet.get.widget.completedReadOnly")}
            </Span>
          </Div>
          {order.journalEntryId ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                handleViewJournalEntry(order.journalEntryId as string)
              }
            >
              {t("orderGet.get.widget.viewJournalEntry")}
            </Button>
          ) : null}
        </Div>
      ) : null}

      {/* Action buttons */}
      {isOpen ? (
        <Div className="flex flex-col gap-2">
          <Div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddItem(order.id)}
            >
              + {t("orderGet.get.widget.addItem")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddPayment(order.id)}
            >
              {t("orderGet.get.widget.addPayment")}
            </Button>
          </Div>
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => handleComplete(order.id)}
            disabled={outstanding > 0.005}
          >
            {t("orderGet.get.widget.complete")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => handleVoid(order.id)}
          >
            {t("orderGet.get.widget.void")}
          </Button>
        </Div>
      ) : null}
    </Div>
  );
}

function OutstandingBalance({
  outstanding,
  currency,
  locale,
  t,
}: {
  outstanding: number;
  currency: string;
  locale: CountryLanguage;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
}): JSX.Element {
  const fmt = (n: number): string =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(n);

  if (outstanding <= 0.005) {
    return (
      <Div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
        <Span className="text-sm font-semibold text-green-700 dark:text-green-400">
          {t("orderGet.get.widget.fullyPaid")}
        </Span>
        <Badge
          variant="default"
          className="text-xs bg-green-600 hover:bg-green-600"
        >
          ✓
        </Badge>
      </Div>
    );
  }

  return (
    <Div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
      <Span className="text-sm font-semibold">
        {t("orderGet.get.widget.outstanding")}
      </Span>
      <Span className="text-lg font-mono font-bold text-destructive tabular-nums">
        {fmt(outstanding)}
      </Span>
    </Div>
  );
}
