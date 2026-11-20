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
import type { JSX } from "react";

import { DocumentLineItems } from "@/finance/document-line-items";
import { BillStatus } from "@/payment/enum";

import type definition from "./definition";

/** Wall-clock comparison kept outside render so components stay pure. */
function isInPast(date: Date | string | number): boolean {
  return new Date(date) < new Date();
}

function getStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case BillStatus.PAID:
      return "default";
    case BillStatus.APPROVED:
      return "secondary";
    case BillStatus.DISPUTED:
      return "destructive";
    case BillStatus.DRAFT:
    case BillStatus.RECEIVED:
    default:
      return "outline";
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
          fieldName="billId"
          field={field.children.billId}
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

  const isOverdue =
    (data.status === BillStatus.RECEIVED ||
      data.status === BillStatus.APPROVED) &&
    data.dueDate !== null &&
    data.dueDate !== undefined &&
    isInPast(data.dueDate);

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

  const handleViewJournalEntry = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    const entryId = data.journalEntryId;
    if (!entryId) {
      return;
    }
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

      {/* Bill header */}
      <Div className="flex min-w-0 flex-wrap items-start justify-between gap-3 p-4 rounded-lg border bg-card">
        <Div className="flex min-w-0 flex-col gap-2">
          <Div className="flex flex-wrap items-center gap-3">
            <H3 className="text-lg font-semibold [overflow-wrap:anywhere]">
              {t("widget.billNumber")} {data.billNumber ?? "—"}
            </H3>
            <Badge variant={getStatusBadgeVariant(data.status)}>
              {getStatusLabel(data.status)}
            </Badge>
            {isOverdue && (
              <Span className="text-xs font-medium text-destructive">
                {t("widget.overdue")}
              </Span>
            )}
          </Div>

          {/* Supplier */}
          {data.supplierName && (
            <P className="text-sm">
              <Span className="text-muted-foreground">
                {t("widget.supplier")}:
              </Span>{" "}
              <Span className="font-medium">{data.supplierName}</Span>
              {data.supplierVatNumber && (
                <Span className="ml-2 text-xs text-muted-foreground font-mono">
                  {data.supplierVatNumber}
                </Span>
              )}
            </P>
          )}

          {/* Dates */}
          <Div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Div className="flex flex-col gap-0.5">
              <Span className="text-xs uppercase tracking-wide">
                {t("widget.billDate")}
              </Span>
              <Span>{formatDate(data.billDate, locale, "PP")}</Span>
            </Div>
            {data.dueDate ? (
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs uppercase tracking-wide">
                  {t("widget.dueDate")}
                </Span>
                <Span
                  className={isOverdue ? "text-destructive font-medium" : ""}
                >
                  {formatDate(data.dueDate, locale, "PP")}
                </Span>
              </Div>
            ) : null}
            {data.paidAt ? (
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs uppercase tracking-wide">
                  {t("widget.paidAt")}
                </Span>
                <Span>{formatDate(data.paidAt, locale, "PP")}</Span>
              </Div>
            ) : null}
          </Div>

          {/* Notes */}
          {data.notes ? (
            <P className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
              {data.notes}
            </P>
          ) : null}
        </Div>

        {/* Journal entry indicator */}
        {data.journalEntryId ? (
          <Div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            <Span>{t("widget.journalEntry")}</Span>
          </Div>
        ) : null}
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
              {data.status === BillStatus.DRAFT && (
                <Button type="button" variant="outline" onClick={handleAddLine}>
                  {t("widget.addLine")}
                </Button>
              )}
            </>
          )}

        {isInteractive &&
          data.canManage &&
          data.status === BillStatus.APPROVED && (
            <>
              <Button type="button" onClick={handlePayBill}>
                {t("widget.payBill")}
              </Button>
            </>
          )}

        {isInteractive && data.journalEntryId ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleViewJournalEntry}
          >
            <ExternalLink className="h-4 w-4 mr-1.5" />
            {t("widget.viewJournalEntry")}
          </Button>
        ) : null}
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
                <Span className="font-mono">{money(data.subtotal)}</Span>
              </Div>
              {data.taxAmount > 0 && (
                <Div className="flex flex-wrap justify-between gap-2">
                  <Span className="text-muted-foreground">
                    {t("widget.tax")}
                  </Span>
                  <Span className="font-mono">{money(data.taxAmount)}</Span>
                </Div>
              )}
            </>
          )}
          <Div className="flex flex-wrap justify-between gap-2 border-t pt-1.5 font-semibold">
            <Span>{t("widget.total")}</Span>
            <Span className="font-mono">{money(data.total)}</Span>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
