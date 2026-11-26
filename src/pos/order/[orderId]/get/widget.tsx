"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatQuantity } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import {
  PosOrderStatus,
  PosOrderStatusDB,
  PosPaymentMethodDB,
} from "../../../enum";
import { formatPosSettlement } from "../../format-settlement";
import { isPosMinorUnitAmount } from "../../settlement-amounts";
import type definition from "./definition";

function statusVariant(status: string): StatusPillVariant {
  if (status === PosOrderStatus.COMPLETED) {
    return "success";
  }
  if (status === PosOrderStatus.OPEN) {
    return "info";
  }
  return "muted";
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

  const back = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-1 gap-1.5"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("orderGet.get.widget.back")}
    </Button>
  ) : undefined;

  if (!order) {
    return (
      <WidgetShell layout="page" className="mx-auto max-w-3xl">
        <WidgetHeader title={t("orderGet.get.title")} backButton={back} />
        <EntityPickerFieldWidget
          fieldName="orderId"
          field={field.children.orderId}
        />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "orderGet.get.widget.select" as const }}
        />
      </WidgetShell>
    );
  }

  const money = (value: number): string =>
    formatPosSettlement(value, order.currency, locale);
  const isOpen = order.status === PosOrderStatus.OPEN;
  const isCompleted = order.status === PosOrderStatus.COMPLETED;
  const isVoided = order.status === PosOrderStatus.VOIDED;
  const paidUnits = order.payments.reduce(
    (sum, payment) =>
      sum +
      Math.round(payment.amount * 10_000) -
      Math.round(payment.change * 10_000),
    0,
  );
  const outstanding = (Math.round(order.total * 10_000) - paidUnits) / 10_000;
  const changeGiven =
    order.payments.reduce(
      (sum, payment) => sum + Math.round(payment.change * 10_000),
      0,
    ) / 10_000;
  const legacyTender =
    !isPosMinorUnitAmount(order.total) ||
    order.payments.some(
      ({ amount, change }) =>
        !isPosMinorUnitAmount(amount) || !isPosMinorUnitAmount(change),
    );
  const translatedStatus = PosOrderStatusDB.find((key) => key === order.status);
  const methodLabel = (method: string): string => {
    const key = PosPaymentMethodDB.find((entry) => entry === method);
    return key ? t(key) : method;
  };

  const openSessionOrders = (): void => {
    void import("../../list/definition").then((def) =>
      navigation.push(def.default.GET, {
        data: {
          input: { sessionId: order.sessionId, status: undefined },
          page: 1,
          pageSize: 50,
        },
      }),
    );
  };
  const openRegister = (): void => {
    void import("../../../session/[sessionId]/register/definition").then(
      (def) =>
        navigation.push(def.default.GET, {
          urlPathParams: { sessionId: order.sessionId },
        }),
    );
  };
  const openSession = (): void => {
    void import("../../../session/[sessionId]/get/definition").then((def) =>
      navigation.push(def.default.GET, {
        urlPathParams: { sessionId: order.sessionId },
      }),
    );
  };
  const openRefunds = (): void => {
    void import("../refund/definition").then((def) =>
      navigation.push(def.default.GET, {
        urlPathParams: { orderId: order.id },
      }),
    );
  };
  const openJournal = (entryId: string): void => {
    void import("@/chart-of-accounts/journal/[entryId]/get/definition").then(
      (def) => navigation.push(def.default.GET, { urlPathParams: { entryId } }),
    );
  };

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      {!navigation.canGoBack ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-1 gap-1.5 self-start"
          onClick={openSessionOrders}
        >
          <ChevronLeft className="h-4 w-4" />
          {t("workflow.backToSessionOrders")}
        </Button>
      ) : null}
      <WidgetHeader
        title={t(isCompleted ? "workflow.receiptTitle" : "orderGet.get.title")}
        size="page"
        backButton={back}
        titleAccessory={
          <StatusPill
            status={order.status}
            variant={statusVariant(order.status)}
            label={translatedStatus ? t(translatedStatus) : order.status}
            className={isVoided ? "line-through" : undefined}
          />
        }
        actions={
          isOpen ? (
            <Button type="button" onClick={openRegister}>
              {t("dashboard.get.widget.openRegister")}
            </Button>
          ) : undefined
        }
      />
      <Div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <Span className="min-w-0 text-sm font-semibold [overflow-wrap:anywhere]">
          #{order.orderNumber}
        </Span>
        <Span className="text-sm text-muted-foreground tabular-nums">
          {new Date(order.createdAt).toLocaleString(locale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Span>
      </Div>
      <FormAlertWidget field={{}} />

      {isCompleted ? (
        <Span className="text-sm text-muted-foreground">
          {t("orderGet.get.widget.completedReadOnly")}
        </Span>
      ) : null}

      <Div
        className={`flex flex-col overflow-hidden rounded-xl border bg-card ${isVoided ? "opacity-70" : ""}`}
      >
        {order.items.length === 0 ? (
          <Span className="px-4 py-6 text-center text-sm text-muted-foreground">
            {t("orderGet.get.widget.noItems")}
          </Span>
        ) : (
          <Div className="flex flex-col divide-y">
            {order.items.map((item) => (
              <Div
                key={item.itemId}
                className="flex items-start justify-between gap-3 px-4 py-3"
              >
                <Div className="min-w-0 flex-1">
                  <Span className="block text-sm font-medium [overflow-wrap:anywhere]">
                    {item.description}
                  </Span>
                  <Span className="text-xs text-muted-foreground tabular-nums">
                    {formatQuantity(item.quantity, locale)}{" "}
                    {t("orderGet.get.widget.qtyTimesPrice")}{" "}
                    {money(item.unitPrice)}
                  </Span>
                </Div>
                <Span className="shrink-0 text-sm font-semibold tabular-nums">
                  {money(item.lineTotal)}
                </Span>
              </Div>
            ))}
          </Div>
        )}
        <Div className="flex flex-col gap-1.5 border-t bg-muted/30 px-4 py-3">
          <TotalRow
            label={t("orderGet.get.response.subtotal")}
            value={money(order.subtotal)}
          />
          {order.taxExemptionNotice ? (
            <Span className="text-xs text-muted-foreground">
              {order.taxExemptionNotice}
            </Span>
          ) : (
            <TotalRow
              label={t("orderGet.get.response.taxAmount")}
              value={money(order.taxAmount)}
            />
          )}
          <Div className="flex items-baseline justify-between gap-3 border-t pt-2">
            <Span className="text-base font-semibold">
              {t("orderGet.get.response.total")}
            </Span>
            <Span className="text-2xl font-bold tabular-nums">
              {money(order.total)}
            </Span>
          </Div>
          {order.payments.map((payment) => (
            <TotalRow
              key={payment.paymentId}
              label={methodLabel(payment.method)}
              value={money(payment.amount)}
              muted
            />
          ))}
          {changeGiven > 0 ? (
            <TotalRow
              label={t("orderGet.get.response.change")}
              value={money(changeGiven)}
              muted
            />
          ) : null}
          {isOpen && order.items.length > 0 ? (
            <TotalRow
              label={
                outstanding > 0
                  ? t("orderGet.get.widget.outstanding")
                  : t("orderGet.get.widget.fullyPaid")
              }
              value={money(Math.max(outstanding, 0))}
              strong
            />
          ) : null}
        </Div>
      </Div>

      {legacyTender ? (
        <Span className="text-sm text-muted-foreground">
          {t("workflow.legacyTenderRecorded")}
        </Span>
      ) : null}

      {!isOpen ? (
        <Div className="flex flex-wrap gap-2">
          {isCompleted ? (
            <Button type="button" onClick={openRefunds}>
              {t("orderGet.get.widget.refund")}
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={openSession}>
            {t("dashboard.get.widget.viewSession")}
          </Button>
          {order.journalEntryId ? (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                order.journalEntryId && openJournal(order.journalEntryId)
              }
            >
              {t("orderGet.get.widget.viewJournalEntry")}
            </Button>
          ) : null}
        </Div>
      ) : null}
    </WidgetShell>
  );
}

function TotalRow({
  label,
  value,
  muted = false,
  strong = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}): JSX.Element {
  return (
    <Div
      className={`flex items-center justify-between gap-3 text-sm ${muted ? "text-muted-foreground" : ""} ${strong ? "font-semibold" : ""}`}
    >
      <Span>{label}</Span>
      <Span className="tabular-nums">{value}</Span>
    </Div>
  );
}
