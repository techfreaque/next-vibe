"use client";

import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ExternalLink } from "next-vibe/ui/components/icons/ExternalLink";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
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
import { documentStatusVariant } from "@/finance/document-status";
import { InvoiceStatus } from "@/payment/enum";
import invoiceRecordPaymentDefinitions from "@/payment/invoice/[invoiceId]/record-payment/definition";
import invoiceReversePaymentDefinitions from "@/payment/invoice/[invoiceId]/reverse-payment/definition";
import invoiceSendDefinitions from "@/payment/invoice/[invoiceId]/send/definition";
import invoiceSendReminderDefinitions from "@/payment/invoice/[invoiceId]/send-reminder/definition";
import invoiceVoidDefinitions from "@/payment/invoice/[invoiceId]/void/definition";
import invoiceLineAddDefinitions from "@/payment/invoice/line/add/definition";

import type definition from "./definition";

/** Wall-clock comparison kept outside render so components stay pure. */
function isOverdueDate(date: Date | string | number): boolean {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return new Date(date) < today;
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
      <WidgetShell layout="page">
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
      </WidgetShell>
    );
  }

  const money = (amount: number): string =>
    formatMoney(amount, data.currency, locale);
  const totalAmount = Number(data.amount);
  const taxTotal =
    Math.round(
      data.lines.reduce(
        (sum, line) => sum + Math.round(line.taxAmount * 10_000),
        0,
      ) / 100,
    ) / 100;
  const subtotal = totalAmount - taxTotal;
  const isDraft = data.status === InvoiceStatus.DRAFT;
  const isOpen = data.status === InvoiceStatus.OPEN;
  const hasBalance = isOpen && data.amountDue > 0;
  const documentNumber =
    data.invoiceNumber ??
    (isDraft
      ? getStatusLabel(data.status)
      : data.invoiceSequenceNumber === null
        ? t("widget.invoiceNumber")
        : `INV-${data.invoiceSequenceNumber}`);
  const canRecord = Boolean(
    isInteractive &&
    hasBalance &&
    (data.companyId ? data.canCreateCreditNote : data.canManage),
  );
  const canIssue =
    isInteractive && data.canManage && isDraft && totalAmount > 0;
  const isOverdue =
    data.status === InvoiceStatus.OPEN &&
    data.dueDate !== null &&
    data.dueDate !== undefined &&
    data.amountDue > 0 &&
    isOverdueDate(data.dueDate);

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
      data: { amount: data.amountDue },
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

  const secondaryActions = isInteractive && (
    <Div className="flex min-w-0 flex-wrap gap-2">
      {isDraft && data.canManage && (
        <Button
          type="button"
          variant={canIssue ? "outline" : "default"}
          onClick={handleAddLine}
        >
          {t("widget.addLine")}
        </Button>
      )}
      {data.canManage && isOverdue && (
        <Button type="button" variant="outline" onClick={handleSendReminder}>
          {t("widget.sendReminder")}
        </Button>
      )}
      {data.canManage && hasBalance && data.amountDue === totalAmount && (
        <Button
          type="button"
          variant="ghost"
          onClick={handleVoid}
          className="text-destructive"
        >
          {t("widget.void")}
        </Button>
      )}
      {data.canCreateCreditNote &&
        data.companyId &&
        totalAmount > 0 &&
        (isOpen || data.status === InvoiceStatus.PAID) && (
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
    </Div>
  );

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={documentNumber}
        subtitle={data.customerName ?? data.companyName ?? undefined}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("widget.back")}
            </Button>
          ) : undefined
        }
        titleAccessory={
          <StatusPill
            status={
              isOverdue
                ? t("widget.overdue")
                : hasBalance && data.amountPaid > 0
                  ? t("widget.partlyPaid")
                  : getStatusLabel(data.status)
            }
            variant={documentStatusVariant(data.status, {
              overdue: isOverdue,
              partialPayment: hasBalance && data.amountPaid > 0,
            })}
          />
        }
        actions={
          <>
            {canIssue && (
              <Button
                type="button"
                className="w-full @sm:w-auto"
                onClick={handleSend}
              >
                {t("widget.issueInvoice")}
              </Button>
            )}
            {canRecord && (
              <Button
                type="button"
                className="w-full @sm:w-auto"
                onClick={handleRecordPayment}
              >
                {t("widget.recordPayment")}
              </Button>
            )}
            {secondaryActions}
          </>
        }
      />

      <Div className="grid min-w-0 grid-cols-1 items-start gap-4 @3xl:grid-cols-[minmax(0,1fr)_18rem]">
        <Div className="flex min-w-0 flex-col gap-4">
          <SectionGroup title={t("widget.details")}>
            <DetailGrid columns={2}>
              {data.companyName && (
                <DetailField
                  label={t("get.response.companyName")}
                  value={data.companyName}
                />
              )}
              {data.customerName && (
                <DetailField
                  label={t("widget.customer")}
                  value={data.customerName}
                />
              )}
              <DetailField
                label={t("get.response.createdAt")}
                value={formatDocDate(data.createdAt, locale)}
              />
              {data.dueDate && (
                <DetailField
                  label={t("widget.due")}
                  value={
                    <Span
                      className={
                        isOverdue ? "font-medium text-destructive" : undefined
                      }
                    >
                      {formatDocDate(data.dueDate, locale)}
                      {isOverdue && ` · ${t("widget.overdue")}`}
                    </Span>
                  }
                />
              )}
              {data.paidAt && (
                <DetailField
                  label={t("widget.paid")}
                  value={formatDocDate(data.paidAt, locale)}
                />
              )}
            </DetailGrid>
            {data.notes && (
              <P className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
                {data.notes}
              </P>
            )}
          </SectionGroup>

          {data.lines.length > 0 && (
            <DocumentLineItems
              title={t("widget.lineItems")}
              lines={data.lines}
              labels={{
                description: t("get.response.lineDescription"),
                quantity: t("widget.qty"),
                unitPrice: t("widget.unitPrice"),
                tax: t("widget.tax"),
                total: t("widget.total"),
              }}
              money={money}
            />
          )}

          {!!data.receipts?.length && (
            <SectionGroup title={t("widget.receipts")}>
              <Div className="flex flex-col divide-y">
                {data.receipts.map((receipt) => (
                  <Div
                    key={receipt.entryId}
                    className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <Div className="flex flex-wrap items-center justify-between gap-2">
                      <Div className="flex items-center gap-2">
                        <Span className="text-sm font-semibold">
                          {receipt.entryNumber}
                        </Span>
                        <StatusPill
                          status={t(
                            receipt.reversed
                              ? "widget.receiptReversed"
                              : "widget.receiptRecorded",
                          )}
                          variant={receipt.reversed ? "muted" : "success"}
                        />
                      </Div>
                      <Span className="text-sm font-semibold tabular-nums">
                        {money(receipt.amount)}
                      </Span>
                    </Div>
                    <DetailGrid columns={3}>
                      <DetailField
                        label={t("widget.receiptDate")}
                        value={formatDocDate(receipt.date, locale)}
                      />
                      {receipt.reference && (
                        <DetailField
                          label={t("widget.receiptReference")}
                          value={receipt.reference}
                        />
                      )}
                      {receipt.reversalEntryNumber && (
                        <DetailField
                          label={t("widget.journalEntry")}
                          value={receipt.reversalEntryNumber}
                        />
                      )}
                      {receipt.reversalDate && (
                        <DetailField
                          label={t("widget.reversalDate")}
                          value={formatDocDate(receipt.reversalDate, locale)}
                        />
                      )}
                      {receipt.reversalReason && (
                        <DetailField
                          label={t("widget.reversalReason")}
                          value={receipt.reversalReason}
                        />
                      )}
                    </DetailGrid>
                    {isInteractive &&
                      data.canCreateCreditNote &&
                      !receipt.reversed &&
                      (data.status === InvoiceStatus.OPEN ||
                        data.status === InvoiceStatus.PAID) && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="self-start"
                          onClick={() =>
                            navigate(invoiceReversePaymentDefinitions.POST, {
                              urlPathParams: { invoiceId: data.id },
                              data: { paymentEntryId: receipt.entryId },
                            })
                          }
                        >
                          {t("widget.reverseReceipt")}
                        </Button>
                      )}
                  </Div>
                ))}
              </Div>
            </SectionGroup>
          )}

          {!!data.recentReminders?.length && (
            <SectionGroup title={t("widget.recentReminderDrafts")}>
              <Div className="flex flex-col divide-y">
                {data.recentReminders.map((reminder) => (
                  <Div
                    key={reminder.id}
                    className="flex min-w-0 flex-col gap-1 py-3 first:pt-0 last:pb-0"
                  >
                    <Div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
                      <Span>{formatDocDate(reminder.preparedAt, locale)}</Span>
                      <Span className="tabular-nums">
                        {formatMoney(
                          reminder.amount,
                          reminder.currency,
                          locale,
                        )}
                      </Span>
                    </Div>
                    {reminder.note && (
                      <P className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                        {reminder.note}
                      </P>
                    )}
                  </Div>
                ))}
              </Div>
            </SectionGroup>
          )}

          {data.journalEntryId && isInteractive && (
            <SectionGroup title={t("widget.journalEntry")}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
                onClick={handleViewJournalEntry}
              >
                <ExternalLink className="h-4 w-4" />
                {t("widget.viewJournalEntry")}
              </Button>
            </SectionGroup>
          )}
        </Div>

        <SectionGroup
          className="order-first @3xl:order-last"
          title={t(
            isOpen && totalAmount > 0
              ? "get.response.amountDue"
              : "widget.total",
          )}
        >
          <Div className="flex min-w-0 flex-col gap-2">
            <Span
              className={
                isOverdue
                  ? "text-2xl font-semibold tracking-tight tabular-nums text-destructive"
                  : "text-2xl font-semibold tracking-tight tabular-nums"
              }
            >
              {money(isOpen && totalAmount > 0 ? data.amountDue : totalAmount)}
            </Span>
            {data.lines.length > 0 && (
              <Div className="flex flex-col gap-2 border-t pt-3 text-sm">
                <Div className="flex justify-between gap-2">
                  <Span className="text-muted-foreground">
                    {t("widget.subtotal")}
                  </Span>
                  <Span className="whitespace-nowrap tabular-nums">
                    {money(subtotal)}
                  </Span>
                </Div>
                <Div className="flex justify-between gap-2">
                  <Span className="text-muted-foreground">
                    {t("widget.tax")}
                  </Span>
                  <Span className="whitespace-nowrap tabular-nums">
                    {money(taxTotal)}
                  </Span>
                </Div>
                {isOpen && totalAmount > 0 && (
                  <Div className="flex justify-between gap-2">
                    <Span className="text-muted-foreground">
                      {t("widget.total")}
                    </Span>
                    <Span className="whitespace-nowrap tabular-nums">
                      {money(totalAmount)}
                    </Span>
                  </Div>
                )}
              </Div>
            )}
            {data.amountPaid > 0 && (
              <Div className="flex justify-between gap-2 text-sm">
                <Span className="text-muted-foreground">
                  {t("get.response.amountPaid")}
                </Span>
                <Span className="whitespace-nowrap tabular-nums text-success">
                  {money(-data.amountPaid)}
                </Span>
              </Div>
            )}
            {isOpen && data.amountPaid > 0 && (
              <Div className="flex justify-between gap-2 border-t pt-2 text-sm font-semibold">
                <Span>{t("get.response.amountDue")}</Span>
                <Span className="whitespace-nowrap tabular-nums">
                  {money(data.amountDue)}
                </Span>
              </Div>
            )}
          </Div>
        </SectionGroup>
      </Div>
    </WidgetShell>
  );
}
