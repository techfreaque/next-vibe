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
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
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

import { documentLineContext } from "@/finance/document-action-confirm";
import { DocumentLineItems } from "@/finance/document-line-items";
import { documentStatusVariant } from "@/finance/document-status";
import { InvoiceStatus } from "@/payment/enum";
import invoiceCheckoutDefinitions from "@/payment/invoice/[invoiceId]/checkout/definition";
import invoiceDeliverDefinitions from "@/payment/invoice/[invoiceId]/deliver/definition";
import invoiceDuplicateDefinitions from "@/payment/invoice/[invoiceId]/duplicate/definition";
import invoiceEInvoiceDefinitions from "@/payment/invoice/[invoiceId]/e-invoice/definition";
import invoicePdfDefinitions from "@/payment/invoice/[invoiceId]/pdf/definition";
import invoiceRecordPaymentDefinitions from "@/payment/invoice/[invoiceId]/record-payment/definition";
import invoiceReversePaymentDefinitions from "@/payment/invoice/[invoiceId]/reverse-payment/definition";
import invoiceSendDefinitions from "@/payment/invoice/[invoiceId]/send/definition";
import invoiceSendReminderDefinitions from "@/payment/invoice/[invoiceId]/send-reminder/definition";
import invoiceVoidDefinitions from "@/payment/invoice/[invoiceId]/void/definition";
import invoiceLineRemoveDefinitions from "@/payment/invoice/line/[lineId]/remove/definition";
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
  const openRelated = useRelatedEntityNavigation();
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
  const isVoid = data.status === InvoiceStatus.VOID;
  const isOpen = data.status === InvoiceStatus.OPEN;
  const hasBalance = isOpen && data.amountDue > 0;
  const documentNumber =
    data.invoiceNumber ??
    (isDraft
      ? data.invoiceSequenceNumber
        ? t("widget.draftReference", { number: data.invoiceSequenceNumber })
        : getStatusLabel(data.status)
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

  const openJournal = (entryId: string): void => {
    openRelated(
      () =>
        import("@/chart-of-accounts/journal/[entryId]/get/definition").then(
          (module) => module.default.GET,
        ),
      { urlPathParams: { entryId } },
    );
  };

  const openSourceQuote = (estimateId: string): void => {
    void (async (): Promise<void> => {
      const { default: estimate } =
        await import("@/payment/estimate/[estimateId]/get/definition");
      navigate(estimate.GET, { urlPathParams: { estimateId } });
    })();
  };

  const sourceEstimate = data.sourceEstimate;
  const sourceQuoteLink =
    sourceEstimate &&
    (isInteractive ? (
      <Button
        type="button"
        variant="link"
        className="h-auto min-h-11 max-w-full justify-start p-0 text-left whitespace-normal"
        aria-label={`${t("widget.openSourceQuote")} ${sourceEstimate.number}`}
        onClick={() => openSourceQuote(sourceEstimate.id)}
      >
        {sourceEstimate.number}
        <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
      </Button>
    ) : (
      <Span>{sourceEstimate.number}</Span>
    ));

  const openInvoiceList = (): void => {
    openRelated(
      () =>
        import("../../list/definition").then((module) => module.default.GET),
      {
        data: { companyId: data.companyId ?? undefined },
      },
    );
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

  const eInvoiceT =
    invoiceEInvoiceDefinitions.GET.scopedTranslation.scopedT(locale).t;
  const { t: shareT } =
    invoiceSendDefinitions.GET.scopedTranslation.scopedT(locale);
  const { t: duplicateT } =
    invoiceDuplicateDefinitions.POST.scopedTranslation.scopedT(locale);
  const { t: removeLineT } =
    invoiceLineRemoveDefinitions.POST.scopedTranslation.scopedT(locale);
  const { t: deliveryT } =
    invoicePdfDefinitions.GET.scopedTranslation.scopedT(locale);
  const { t: checkoutT } =
    invoiceCheckoutDefinitions.POST.scopedTranslation.scopedT(locale);
  const openPdf = (): void => {
    navigate(invoicePdfDefinitions.GET, {
      urlPathParams: { invoiceId: data.id },
      renderInModal: true,
    });
  };
  const openCheckoutLink = (): void => {
    navigate(invoiceCheckoutDefinitions.POST, {
      urlPathParams: { invoiceId: data.id },
      renderInModal: true,
    });
  };
  const openEmailDeliver = (): void => {
    navigate(invoiceDeliverDefinitions.POST, {
      urlPathParams: { invoiceId: data.id },
      renderInModal: true,
      data: {
        recipientName: data.customerName ?? undefined,
        isResend: false,
      },
    });
  };
  const openDeliveryLog = (): void => {
    navigate(invoiceDeliverDefinitions.GET, {
      urlPathParams: { invoiceId: data.id },
    });
  };
  const canDuplicate = data.canManage && totalAmount > 0 && !isDraft;
  const handleDuplicate = (): void => {
    void import("./definition").then((getDef) =>
      navigate(invoiceDuplicateDefinitions.POST, {
        urlPathParams: { invoiceId: data.id },
        renderInModal: true,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            invoiceId: responseData.invoice.id,
          }),
        },
      }),
    );
  };
  const handleRemoveLine = (line: {
    id: string;
    description: string;
    lineTotal: number;
  }): void => {
    documentLineContext.set(line.id, {
      number: documentNumber,
      party: data.customerName,
      detail: line.description,
      amount: money(line.lineTotal),
    });
    navigate(invoiceLineRemoveDefinitions.POST, {
      urlPathParams: { lineId: line.id },
      renderInModal: true,
      popNavigationOnSuccess: 1,
    });
  };
  const canShare =
    data.canManage &&
    (data.status === InvoiceStatus.OPEN || data.status === InvoiceStatus.PAID);
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
      {canDuplicate && (
        <Button type="button" variant="outline" onClick={handleDuplicate}>
          {duplicateT("widget.duplicate")}
        </Button>
      )}
      {!isVoid && (
        <Button type="button" variant="outline" onClick={openPdf}>
          {deliveryT("pdf.downloadAction")}
        </Button>
      )}
      {canShare && (
        <Button type="button" variant="outline" onClick={openEmailDeliver}>
          {deliveryT("deliver.sendAction")}
        </Button>
      )}
      {canShare && (
        <Button type="button" variant="outline" onClick={openDeliveryLog}>
          {deliveryT("deliver.logTitle")}
        </Button>
      )}
      {data.canManage && hasBalance && (
        <Button type="button" variant="outline" onClick={openCheckoutLink}>
          {checkoutT("checkout.action")}
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
          canGoBack || (isVoid && isInteractive) ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={canGoBack ? () => pop() : openInvoiceList}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              {t(canGoBack ? "widget.back" : "widget.backToInvoiceList")}
            </Button>
          ) : undefined
        }
        titleAccessory={
          !isDraft || data.invoiceNumber ? (
            <StatusPill
              status={
                isOverdue
                  ? t("widget.overdue")
                  : hasBalance && data.amountPaid > 0
                    ? t("widget.partlyPaid")
                    : getStatusLabel(data.status)
              }
              className={
                isVoid ? "border border-border text-foreground" : undefined
              }
              variant={documentStatusVariant(data.status, {
                overdue: isOverdue,
                partialPayment: hasBalance && data.amountPaid > 0,
              })}
            />
          ) : undefined
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
            {isInteractive && canShare && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(invoiceSendDefinitions.GET, {
                    urlPathParams: { invoiceId: data.id },
                    renderInModal: true,
                  })
                }
              >
                {shareT("delivery.share")}
              </Button>
            )}
            {isInteractive && !isDraft && !isVoid && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(invoiceEInvoiceDefinitions.GET, {
                    urlPathParams: { invoiceId: data.id },
                    renderInModal: true,
                  })
                }
              >
                {eInvoiceT("titleShort")}
              </Button>
            )}
            {secondaryActions}
          </>
        }
      />

      <Div
        className={
          isVoid
            ? "grid min-w-0 grid-cols-1 items-start gap-4 @3xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.58fr)]"
            : "grid min-w-0 grid-cols-1 items-start gap-4 @3xl:grid-cols-[minmax(0,1fr)_18rem]"
        }
      >
        <Div className="flex min-w-0 flex-col gap-4">
          <SectionGroup title={t("widget.details")}>
            <DetailGrid columns={2}>
              {sourceEstimate && (
                <DetailField
                  label={t("widget.sourceQuote")}
                  value={sourceQuoteLink}
                />
              )}
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
              action={
                isInteractive && isDraft && data.canManage
                  ? {
                      label: removeLineT("widget.lineActions"),
                      render: (line): JSX.Element => (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="min-h-10 self-start text-destructive"
                          aria-label={removeLineT("widget.removeNamed", {
                            description: line.description,
                          })}
                          onClick={() => handleRemoveLine(line)}
                        >
                          {removeLineT("widget.remove")}
                        </Button>
                      ),
                    }
                  : undefined
              }
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

          {!isVoid && data.journalEntryId && isInteractive && (
            <SectionGroup title={t("widget.journalEntry")}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() =>
                  data.journalEntryId && openJournal(data.journalEntryId)
                }
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
            isVoid
              ? "widget.remainingBalance"
              : isOpen && totalAmount > 0
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
              {money(
                isVoid || (isOpen && totalAmount > 0)
                  ? data.amountDue
                  : totalAmount,
              )}
            </Span>
            {isVoid && (
              <Div className="flex flex-col gap-3 border-t pt-3">
                <DetailGrid columns={2}>
                  <DetailField
                    label={t("widget.originalTotal")}
                    value={money(totalAmount)}
                  />
                  {data.voidReversal && (
                    <DetailField
                      label={t("widget.voidReversalDate")}
                      value={formatDocDate(
                        data.voidReversal.effectiveDate,
                        locale,
                      )}
                    />
                  )}
                </DetailGrid>
                {isInteractive &&
                  (data.journalEntryId || data.voidReversal) && (
                    <Div className="grid min-w-0 gap-2">
                      {data.journalEntryId && (
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          className="h-auto min-h-10 w-full flex-wrap justify-between gap-x-2 gap-y-0.5 whitespace-normal text-start"
                          onClick={() =>
                            data.journalEntryId &&
                            openJournal(data.journalEntryId)
                          }
                        >
                          <Span>{t("widget.viewOriginalJournal")}</Span>
                          {data.voidReversal?.originalEntryNumber && (
                            <Span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                              {data.voidReversal.originalEntryNumber}
                            </Span>
                          )}
                        </Button>
                      )}
                      {data.voidReversal && (
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          className="h-auto min-h-10 w-full flex-wrap justify-between gap-x-2 gap-y-0.5 whitespace-normal text-start"
                          onClick={() =>
                            data.voidReversal &&
                            openJournal(data.voidReversal.entryId)
                          }
                        >
                          <Span>{t("widget.viewVoidReversal")}</Span>
                          <Span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                            {data.voidReversal.entryNumber}
                          </Span>
                        </Button>
                      )}
                    </Div>
                  )}
              </Div>
            )}
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
