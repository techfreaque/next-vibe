"use client";

import { formatDate } from "next-vibe/core/i18n/core/localization-utils";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ExternalLink } from "next-vibe/ui/components/icons/ExternalLink";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { AdminRecordDetail } from "next-vibe/unified-ui/_shared/admin-record-detail";
import {
  formatMoney,
  formatPercent,
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
import type { JSX } from "react";

import { DocumentLineItems } from "@/finance/document-line-items";
import { evidenceCurrencies } from "@/finance/supplier-evidence/rules";
import { BillStatus } from "@/payment/enum";

import type definition from "./definition";

/** Wall-clock comparison kept outside render so components stay pure. */
function isInPast(date: Date | string | number): boolean {
  return new Date(date) < new Date();
}

function getStatusVariant(
  status: string,
): "success" | "info" | "danger" | "muted" {
  switch (status) {
    case BillStatus.PAID:
      return "success";
    case BillStatus.APPROVED:
      return "info";
    case BillStatus.DISPUTED:
      return "danger";
    case BillStatus.DRAFT:
    case BillStatus.RECEIVED:
    default:
      return "muted";
  }
}

export function BillGetWidget({
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
          fieldName="billId"
          field={field.children.billId}
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

  const isOverdue =
    (data.status === BillStatus.RECEIVED ||
      data.status === BillStatus.APPROVED) &&
    data.dueDate !== null &&
    data.dueDate !== undefined &&
    isInPast(data.dueDate);

  const handleLinkSupplierDocument = (): void => {
    void (async (): Promise<void> => {
      const route = await import("@/finance/supplier-evidence/definition");
      const currency = evidenceCurrencies.safeParse(data.currency);
      navigate(route.default.POST, {
        data: {
          operation: "bill",
          companyId: data.companyId,
          vendorId: data.bankVendorId,
          debitAccountId: data.bankExpenseAccountId,
          bankDraftBillId: data.id,
          currency: currency.success ? currency.data : undefined,
          grossAmount: String(data.total),
          dryRun: true,
        },
      });
    })();
  };

  const handleApproveBill = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("@/payment/bill/[billId]/approve/definition");
      navigate(def.default.POST, {
        urlPathParams: { billId: data.id },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handlePayBill = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("@/payment/bill/[billId]/pay/definition");
      navigate(def.default.POST, {
        urlPathParams: { billId: data.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleAddLine = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("@/payment/bill/line/add/definition");
      navigate(def.default.POST, {
        renderInModal: true,
        data: { billId: data.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleRemoveLine = (lineId: string): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/payment/bill/line/[billId]/[lineId]/remove/definition");
      navigate(def.default.POST, {
        urlPathParams: { billId: data.id, lineId },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleViewJournalEntry = (entryId: string): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/chart-of-accounts/journal/[entryId]/get/definition");
      navigate(def.default.GET, { urlPathParams: { entryId } });
    })();
  };

  function getStatusLabel(status: string): string {
    switch (status) {
      case BillStatus.DRAFT:
        return t("widget.status.draft");
      case BillStatus.RECEIVED:
        return t("widget.status.received");
      case BillStatus.APPROVED:
        return t("widget.status.approved");
      case BillStatus.PAID:
        return t("widget.status.paid");
      case BillStatus.DISPUTED:
        return t("widget.status.disputed");
      default:
        return status;
    }
  }

  const title = data.billNumber
    ? `${t("widget.billNumber")} ${data.billNumber}`
    : t("widget.billNumber");
  const subtitle = new Intl.ListFormat(locale, {
    style: "short",
    type: "unit",
  }).format(
    data.companyName
      ? [data.supplierName, data.companyName]
      : [data.supplierName],
  );

  const gross = (
    <Span className="text-xl font-semibold tabular-nums">
      {money(data.total)}
    </Span>
  );

  return (
    <AdminRecordDetail
      title={title}
      subtitle={subtitle}
      status={{
        status: getStatusLabel(data.status),
        variant: getStatusVariant(data.status),
      }}
      titleAccessory={
        isOverdue && (
          <Span className="text-sm font-medium text-destructive">
            {t("widget.overdue")}
          </Span>
        )
      }
      backButton={
        canGoBack && (
          <Button type="button" variant="ghost" size="sm" onClick={() => pop()}>
            <ChevronLeft className="h-4 w-4" />
            {t("widget.back")}
          </Button>
        )
      }
      facts={[
        {
          key: "gross",
          label: t("widget.grossTotal"),
          value: gross,
        },
        {
          key: "date",
          label: t("widget.billDate"),
          value: formatDate(data.billDate, locale, "PP"),
        },
        ...(data.dueDate
          ? [
              {
                key: "due",
                label: t("widget.dueDate"),
                value: formatDate(data.dueDate, locale, "PP"),
              },
            ]
          : []),
        ...(data.paidAt
          ? [
              {
                key: "paid",
                label: t("widget.paidAt"),
                value: formatDate(data.paidAt, locale, "PP"),
              },
            ]
          : []),
        ...(data.supplierVatNumber
          ? [
              {
                key: "supplierVat",
                label: t("get.response.supplierVatNumber"),
                value: data.supplierVatNumber,
              },
            ]
          : []),
      ]}
    >
      {(data.approvalJournal || data.settlementJournal) && (
        <Div className="flex min-w-0 flex-col gap-2 rounded-lg border px-3 py-2.5">
          <P className="text-sm font-semibold">
            {t("widget.accountingEvidence")}
          </P>
          <Div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {[
              {
                label: t("widget.approvalJournal"),
                entry: data.approvalJournal,
              },
              {
                label: t("widget.settlementJournal"),
                entry: data.settlementJournal,
              },
            ].map(
              ({ label, entry }) =>
                entry && (
                  <Div
                    key={entry.id}
                    className="flex min-w-0 flex-col items-start gap-0.5"
                  >
                    <Span className="text-sm text-muted-foreground">
                      {label}
                    </Span>
                    {isInteractive ? (
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto min-h-11 max-w-full gap-1.5 whitespace-normal p-0 text-left tabular-nums"
                        aria-label={`${label} ${entry.number}`}
                        onClick={() => handleViewJournalEntry(entry.id)}
                      >
                        {entry.number}
                        <ExternalLink
                          className="size-3.5 shrink-0"
                          aria-hidden="true"
                        />
                      </Button>
                    ) : (
                      <Span className="text-sm tabular-nums">
                        {entry.number}
                      </Span>
                    )}
                  </Div>
                ),
            )}
          </Div>
        </Div>
      )}
      {data.notes && (
        <P className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
          {data.notes}
        </P>
      )}
      {data.bankSupplierDocument && (
        <P className="text-sm text-muted-foreground">
          {t(
            data.bankSupplierDocument === "missing"
              ? "widget.bankDocumentMissing"
              : "widget.bankDocumentTaxReview",
          )}
        </P>
      )}
      {data.taxPending && (
        <Div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
          <P className="text-sm">{t("widget.taxPending")}</P>
          {isInteractive && data.taxReviewId && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void import("@/messenger/system-mailbox/bills/definition").then(
                  ({ default: mailbox }) =>
                    navigate(mailbox.POST, {
                      data: {
                        reviewId: data.taxReviewId,
                        confirmTax: true,
                        reference: data.billNumber ?? undefined,
                        date: new Date(data.billDate)
                          .toISOString()
                          .slice(0, 10),
                        currency: evidenceCurrencies.safeParse(data.currency)
                          .data,
                        grossAmount: String(data.total),
                      },
                    }),
                );
              }}
            >
              {t("widget.confirmSupplierTax")}
            </Button>
          )}
        </Div>
      )}
      {isInteractive &&
        data.canManage &&
        ((!data.taxPending &&
          (data.status === BillStatus.DRAFT ||
            data.status === BillStatus.RECEIVED)) ||
          data.status === BillStatus.APPROVED ||
          data.bankSupplierDocument === "missing") && (
          <Div className="flex flex-wrap gap-2">
            {!data.taxPending &&
              (data.status === BillStatus.DRAFT ||
                data.status === BillStatus.RECEIVED) && (
                <>
                  <Button type="button" onClick={handleApproveBill}>
                    {t(
                      data.status === BillStatus.DRAFT
                        ? "widget.markReceived"
                        : "widget.approveBill",
                    )}
                  </Button>
                  {data.canEditLines && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddLine}
                    >
                      {t("widget.addLine")}
                    </Button>
                  )}
                </>
              )}

            {data.status === BillStatus.APPROVED && (
              <Button type="button" onClick={handlePayBill}>
                {t("widget.payBill")}
              </Button>
            )}

            {data.bankSupplierDocument === "missing" && (
              <Button
                type="button"
                variant="outline"
                onClick={handleLinkSupplierDocument}
              >
                {t("widget.linkBankDocument")}
              </Button>
            )}
          </Div>
        )}

      {data.lineReviewRequired && (
        <Div
          aria-live="polite"
          className="rounded-md border border-warning/30 bg-warning/10 p-3 text-sm"
        >
          {t("widget.lineReviewRequired")}
        </Div>
      )}

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
          action={
            isInteractive && data.canEditLines
              ? {
                  label: t("widget.removeAction"),
                  render: (line): JSX.Element => (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      aria-label={t("widget.removeLine", {
                        description: line.description,
                      })}
                      className="self-start"
                      onClick={() => handleRemoveLine(line.id)}
                    >
                      {t("widget.removeAction")}
                    </Button>
                  ),
                }
              : undefined
          }
        />
      )}

      {(data.lines.length > 0 || data.reverseCharge) && (
        <Div className="flex justify-end">
          <Div className="flex flex-col gap-1.5 w-full max-w-xs text-sm">
            {data.lines.length > 0 && data.subtotal !== null && (
              <>
                <Div className="flex flex-wrap justify-between gap-2">
                  <Span className="text-muted-foreground">
                    {t("widget.subtotal")}
                  </Span>
                  <Span className="tabular-nums">{money(data.subtotal)}</Span>
                </Div>
                {data.taxAmount !== null && data.taxAmount > 0 && (
                  <Div className="flex flex-wrap justify-between gap-2">
                    <Span className="text-muted-foreground">
                      {t(
                        data.inputVatDeductible === false
                          ? "widget.taxIncludedCost"
                          : "widget.tax",
                      )}
                    </Span>
                    <Span className="tabular-nums">
                      {money(data.taxAmount)}
                    </Span>
                  </Div>
                )}
              </>
            )}
            {data.reverseCharge && (
              <Div className="mt-2 flex flex-wrap justify-between gap-2 border-t pt-2">
                <Div>
                  <P className="font-medium">{t("widget.reverseCharge")}</P>
                  <P className="text-xs text-muted-foreground">
                    {`${money(data.reverseCharge.base)} × ${formatPercent(data.reverseCharge.ratePercent / 100, locale)}`}
                  </P>
                </Div>
                <Span className="tabular-nums">
                  {money(data.reverseCharge.amount)}
                </Span>
              </Div>
            )}
          </Div>
        </Div>
      )}
    </AdminRecordDetail>
  );
}
