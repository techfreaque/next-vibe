"use client";

import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { ExternalLink } from "next-vibe/ui/web/ui/icons/ExternalLink";
import { Span } from "next-vibe/ui/web/ui/span";
import { H3, H4, P } from "next-vibe/ui/web/ui/typography";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import { type JSX } from "react";

import { InvoiceStatus } from "@/app/api/[locale]/payment/enum";
import invoiceRecordPaymentDefinitions from "@/app/api/[locale]/payment/invoice/[invoiceId]/record-payment/definition";
import invoiceSendDefinitions from "@/app/api/[locale]/payment/invoice/[invoiceId]/send/definition";
import invoiceSendReminderDefinitions from "@/app/api/[locale]/payment/invoice/[invoiceId]/send-reminder/definition";
import invoiceVoidDefinitions from "@/app/api/[locale]/payment/invoice/[invoiceId]/void/definition";
import invoiceLineAddDefinitions from "@/app/api/[locale]/payment/invoice/line/add/definition";

import type definition from "./definition";

function fmt(n: number): string {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
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
    new Date(data.dueDate) < new Date();

  const handleSend = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(invoiceSendDefinitions.POST, {
      urlPathParams: { invoiceId: data.id },
      renderInModal: true,
    });
  };

  const handleAddLine = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(invoiceLineAddDefinitions.POST, {
      renderInModal: true,
      data: { invoiceId: data.id },
    });
  };

  const handleRecordPayment = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(invoiceRecordPaymentDefinitions.POST, {
      urlPathParams: { invoiceId: data.id },
      renderInModal: true,
    });
  };

  const handleSendReminder = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(invoiceSendReminderDefinitions.POST, {
      urlPathParams: { invoiceId: data.id },
      renderInModal: true,
    });
  };

  const handleVoid = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(invoiceVoidDefinitions.POST, {
      urlPathParams: { invoiceId: data.id },
      renderInModal: true,
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
        await import("@/app/api/[locale]/chart-of-accounts/journal/[entryId]/get/definition");
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
    <Div className="flex flex-col gap-6">
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
      <Div className="flex items-start justify-between p-5 rounded-lg border bg-card">
        <Div className="flex flex-col gap-2">
          <Div className="flex items-center gap-3">
            <H3 className="text-lg font-semibold">
              {t("widget.invoiceNumber")} #{data.invoiceSequenceNumber ?? "—"}
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
          <Div className="flex gap-6 text-sm text-muted-foreground">
            <Div className="flex flex-col gap-0.5">
              <Span className="text-xs uppercase tracking-wide">
                {t("widget.issued")}
              </Span>
              <Span>{new Date(data.createdAt).toLocaleDateString()}</Span>
            </Div>
            {data.dueDate && (
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs uppercase tracking-wide">
                  {t("widget.due")}
                </Span>
                <Span
                  className={isOverdue ? "text-destructive font-medium" : ""}
                >
                  {new Date(data.dueDate).toLocaleDateString()}
                </Span>
              </Div>
            )}
            {data.paidAt && (
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs uppercase tracking-wide">
                  {t("widget.paid")}
                </Span>
                <Span>{new Date(data.paidAt).toLocaleDateString()}</Span>
              </Div>
            )}
          </Div>

          {/* Customer */}
          {data.customerId && (
            <P className="text-sm">
              <Span className="text-muted-foreground">
                {t("widget.customer")}:
              </Span>{" "}
              <Span className="font-mono text-xs">{data.customerId}</Span>
            </P>
          )}

          {/* Notes */}
          {data.notes && (
            <P className="text-sm text-muted-foreground">{data.notes}</P>
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

      {/* Line items table */}
      {data.lines.length > 0 && (
        <Div className="flex flex-col gap-1">
          <H4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            {t("widget.lineItems")}
          </H4>

          {/* Table header */}
          <Div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b">
            <Span>{t("widget.description")}</Span>
            <Span className="text-right">{t("widget.qty")}</Span>
            <Span className="text-right">{t("widget.unitPrice")}</Span>
            <Span className="text-right">{t("widget.tax")}</Span>
            <Span className="text-right">{t("widget.total")}</Span>
          </Div>

          {data.lines.map((line) => (
            <Div
              key={line.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2.5 text-sm border-b last:border-0"
            >
              <Span>{line.description}</Span>
              <Span className="text-right font-mono">{line.quantity}</Span>
              <Span className="text-right font-mono">
                {data.currency} {fmt(line.unitPrice)}
              </Span>
              <Span className="text-right font-mono text-muted-foreground">
                {data.currency} {fmt(line.taxAmount)}
              </Span>
              <Span className="text-right font-mono font-medium">
                {data.currency} {fmt(line.lineTotal)}
              </Span>
            </Div>
          ))}
        </Div>
      )}

      {/* Summary */}
      <Div className="flex justify-end">
        <Div className="flex flex-col gap-1.5 min-w-[200px] text-sm">
          {data.lines.length > 0 && (
            <>
              <Div className="flex justify-between">
                <Span className="text-muted-foreground">
                  {t("widget.subtotal")}
                </Span>
                <Span className="font-mono">
                  {data.currency} {fmt(subtotal)}
                </Span>
              </Div>
              {taxTotal > 0 && (
                <Div className="flex justify-between">
                  <Span className="text-muted-foreground">
                    {t("widget.tax")}
                  </Span>
                  <Span className="font-mono">
                    {data.currency} {fmt(taxTotal)}
                  </Span>
                </Div>
              )}
            </>
          )}
          <Div className="flex justify-between border-t pt-1.5 font-semibold">
            <Span>{t("widget.total")}</Span>
            <Span className="font-mono">
              {data.currency} {fmt(isNaN(totalAmount) ? 0 : totalAmount)}
            </Span>
          </Div>
        </Div>
      </Div>

      {/* Action buttons by status */}
      <Div className="flex flex-wrap gap-2 pt-2 border-t">
        {data.status === InvoiceStatus.DRAFT && (
          <>
            <Button type="button" onClick={handleSend}>
              {t("widget.sendInvoice")}
            </Button>
            <Button type="button" variant="outline" onClick={handleAddLine}>
              {t("widget.addLine")}
            </Button>
          </>
        )}

        {data.status === InvoiceStatus.OPEN && (
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

        {data.status === InvoiceStatus.PAID && data.journalEntryId && (
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
    </Div>
  );
}
