"use client";

import { formatDate } from "next-vibe/core/i18n/core/localization-utils";
import { Badge } from "next-vibe/ui/components/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ExternalLink } from "next-vibe/ui/components/icons/ExternalLink";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import { DocumentLineItems } from "@/finance/document-line-items";
import { InvoiceStatus } from "@/payment/enum";
import invoiceRecordPaymentDefinitions from "@/payment/invoice/[invoiceId]/record-payment/definition";
import invoiceSendDefinitions from "@/payment/invoice/[invoiceId]/send/definition";
import invoiceSendReminderDefinitions from "@/payment/invoice/[invoiceId]/send-reminder/definition";
import invoiceVoidDefinitions from "@/payment/invoice/[invoiceId]/void/definition";
import invoiceLineAddDefinitions from "@/payment/invoice/line/add/definition";

import type definition from "./definition";

/** Wall-clock comparison kept outside render so components stay pure. */
function isInPast(date: Date | string | number): boolean {
  return new Date(date) < new Date();
}

function getStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case InvoiceStatus.PAID:
      return "default";
    case InvoiceStatus.OPEN:
      return "secondary";
    case InvoiceStatus.UNCOLLECTIBLE:
      return "destructive";
    case InvoiceStatus.DRAFT:
    case InvoiceStatus.VOID:
    default:
      return "outline";
  }
}

export function InvoiceGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = useWidgetIsInteractive() && !responseOnly;

  if (!data?.id) {
    return (
      <Div className="flex flex-col gap-4">
        {canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => pop()}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("widget.back")}
          </Button>
        )}
        <EntityPickerFieldWidget
          fieldName="invoiceId"
          field={field.children.invoiceId}
        />
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "widget.submit" as const }}
        />
      </Div>
    );
  }

  const money = (amount: number): string =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: data.currency,
      currencyDisplay: "code",
    }).format(amount);

  const totalAmount = parseFloat(data.amount);
  const subtotal = data.lines.reduce(
    (acc, l) => acc + l.unitPrice * l.quantity,
    0,
  );
  const taxTotal = data.lines.reduce((acc, l) => acc + l.taxAmount, 0);
  const isOverdue =
    data.status === InvoiceStatus.OPEN &&
    data.dueDate !== null &&
    data.dueDate !== undefined &&
    isInPast(data.dueDate);

  const handleSend = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(invoiceSendDefinitions.POST, {
      urlPathParams: { invoiceId: data.id },
      renderInModal: true,
      popNavigationOnSuccess: 1,
    });
  };

  const handleAddLine = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(invoiceLineAddDefinitions.POST, {
      renderInModal: true,
      popNavigationOnSuccess: 1,
      data: { invoiceId: data.id },
    });
  };

  const handleRecordPayment = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(invoiceRecordPaymentDefinitions.POST, {
      urlPathParams: { invoiceId: data.id },
      renderInModal: true,
      popNavigationOnSuccess: 1,
    });
  };

  const handleSendReminder = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(invoiceSendReminderDefinitions.POST, {
      urlPathParams: { invoiceId: data.id },
      renderInModal: true,
      popNavigationOnSuccess: 1,
    });
  };

  const handleVoid = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(invoiceVoidDefinitions.POST, {
      urlPathParams: { invoiceId: data.id },
      renderInModal: true,
      popNavigationOnSuccess: 1,
    });
  };

  const handleViewJournalEntry = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    const entryId = data.journalEntryId;
    if (!entryId) {
      return;
    }
    void (async (): Promise<void> => {
      const def =
        await import("@/chart-of-accounts/journal/[entryId]/get/definition");
      navigate(def.default.GET, {
        urlPathParams: { entryId },
      });
    })();
  };

  function getStatusLabel(status: string): string {
    switch (status) {
      case InvoiceStatus.DRAFT:
        return t("widget.status.draft");
      case InvoiceStatus.OPEN:
        return t("widget.status.open");
      case InvoiceStatus.PAID:
        return t("widget.status.paid");
      case InvoiceStatus.VOID:
        return t("widget.status.void");
      case InvoiceStatus.UNCOLLECTIBLE:
        return t("widget.status.uncollectible");
      default:
        return status;
    }
  }

  return (
    <Div className="@container flex min-w-0 flex-col gap-6">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("widget.back")}
        </Button>
      )}
      {/* Invoice header */}
      <Div className="flex min-w-0 flex-wrap items-start justify-between gap-3 p-4 rounded-lg border bg-card">
        <Div className="flex min-w-0 flex-col gap-2">
          <Div className="flex flex-wrap items-center gap-3">
            <H3 className="text-lg font-semibold [overflow-wrap:anywhere]">
              {data.invoiceNumber ??
                (data.invoiceSequenceNumber === null
                  ? t("widget.invoiceNumber")
                  : `INV-${data.invoiceSequenceNumber}`)}
            </H3>
            <Badge
              variant={getStatusBadgeVariant(data.status)}
              className={
                data.status === InvoiceStatus.VOID
                  ? "line-through text-muted-foreground"
                  : ""
              }
            >
              {getStatusLabel(data.status)}
            </Badge>
            {isOverdue && (
              <Span className="text-xs font-medium text-destructive">
                {t("widget.overdue")}
              </Span>
            )}
          </Div>

          {/* Dates */}
          <Div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Div className="flex flex-col gap-0.5">
              <Span className="text-xs uppercase tracking-wide">
                {t("widget.issued")}
              </Span>
              <Span>{formatDate(data.createdAt, locale, "PP")}</Span>
            </Div>
            {data.dueDate && (
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs uppercase tracking-wide">
                  {t("widget.due")}
                </Span>
                <Span
                  className={isOverdue ? "text-destructive font-medium" : ""}
                >
                  {formatDate(data.dueDate, locale, "PP")}
                </Span>
              </Div>
            )}
            {data.paidAt && (
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs uppercase tracking-wide">
                  {t("widget.paid")}
                </Span>
                <Span>{formatDate(data.paidAt, locale, "PP")}</Span>
              </Div>
            )}
          </Div>

          {/* Customer */}
          {data.customerId && (
            <P className="text-sm">
              <Span className="text-muted-foreground">
                {t("widget.customer")}:
              </Span>{" "}
              <Span className="font-mono text-xs break-all">
                {data.customerId}
              </Span>
            </P>
          )}

          {/* Notes */}
          {data.notes && (
            <P className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
              {data.notes}
            </P>
          )}
        </Div>

        {/* Journal entry link */}
        {data.journalEntryId && (
          <Div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            <Span>{t("widget.journalEntry")}</Span>
          </Div>
        )}
      </Div>

      {data.companyName && (
        <P className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
          {data.companyName}
        </P>
      )}

      {/* Action buttons by status */}
      <Div className="flex flex-wrap gap-2 pt-2 border-t">
        {isInteractive &&
          data.canManage &&
          data.status === InvoiceStatus.DRAFT && (
            <>
              <Button type="button" onClick={handleSend}>
                {t("widget.sendInvoice")}
              </Button>
              <Button type="button" variant="outline" onClick={handleAddLine}>
                {t("widget.addLine")}
              </Button>
            </>
          )}

        {isInteractive &&
          data.canManage &&
          data.status === InvoiceStatus.OPEN && (
            <>
              <Button type="button" onClick={handleRecordPayment}>
                {t("widget.recordPayment")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSendReminder}
              >
                {t("widget.sendReminder")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleVoid}
                className="text-destructive hover:text-destructive"
              >
                {t("widget.void")}
              </Button>
            </>
          )}

        {isInteractive &&
          data.canCreateCreditNote &&
          data.companyId &&
          (data.status === InvoiceStatus.OPEN ||
            data.status === InvoiceStatus.PAID) && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const companyId = data.companyId;
                if (companyId) {
                  void import("@/payment/credit-note/create/definition").then(
                    (module) => {
                      navigate(module.default.POST, {
                        data: { companyId, invoiceId: data.id },
                        renderInModal: true,
                      });
                      return undefined;
                    },
                  );
                }
              }}
            >
              {t("widget.createCreditNote")}
            </Button>
          )}
        {isInteractive && data.journalEntryId && (
          <Button
            type="button"
            variant="outline"
            onClick={handleViewJournalEntry}
          >
            <ExternalLink className="h-4 w-4 mr-1.5" />
            {t("widget.viewJournalEntry")}
          </Button>
        )}
      </Div>

      {/* Line items */}
      {data.lines.length > 0 && (
        <DocumentLineItems
          title={t("widget.lineItems")}
          lines={data.lines}
          labels={{
            quantity: t("widget.qty"),
            unitPrice: t("widget.unitPrice"),
            tax: t("widget.tax"),
            total: t("widget.total"),
          }}
          money={money}
        />
      )}

      {/* Summary */}
      <Div className="flex justify-end">
        <Div className="flex flex-col gap-1.5 w-full max-w-xs text-sm">
          {data.lines.length > 0 && (
            <>
              <Div className="flex flex-wrap justify-between gap-2">
                <Span className="text-muted-foreground">
                  {t("widget.subtotal")}
                </Span>
                <Span className="font-mono">{money(subtotal)}</Span>
              </Div>
              {taxTotal > 0 && (
                <Div className="flex flex-wrap justify-between gap-2">
                  <Span className="text-muted-foreground">
                    {t("widget.tax")}
                  </Span>
                  <Span className="font-mono">{money(taxTotal)}</Span>
                </Div>
              )}
            </>
          )}
          <Div className="flex flex-wrap justify-between gap-2 border-t pt-1.5 font-semibold">
            <Span>{t("widget.total")}</Span>
            <Span className="font-mono">
              {money(isNaN(totalAmount) ? 0 : totalAmount)}
            </Span>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
