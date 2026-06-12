"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "next-vibe-ui/ui/alert-dialog";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { Span } from "next-vibe-ui/ui/span";
import { H3, H4, P } from "next-vibe-ui/ui/typography";
import { useState, type JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe-ui/unified/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import { BillStatus } from "@/app/api/[locale]/payment/enum";
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
  const [pendingApprove, setPendingApprove] = useState(false);

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
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "widget.submit" as const }}
        />
      </Div>
    );
  }

  const isOverdue =
    (data.status === BillStatus.DRAFT ||
      data.status === BillStatus.RECEIVED ||
      data.status === BillStatus.APPROVED) &&
    data.dueDate !== null &&
    data.dueDate !== undefined &&
    new Date(data.dueDate) < new Date();

  const handleApproveBill = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    setPendingApprove(true);
  };

  const handleConfirmApprove = (): void => {
    setPendingApprove(false);
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/payment/bill/[billId]/approve/definition");
      navigate(def.default.POST, {
        urlPathParams: { billId: data.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handlePayBill = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/payment/bill/[billId]/pay/definition");
      navigate(def.default.POST, {
        urlPathParams: { billId: data.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleAddLine = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/payment/bill/line/add/definition");
      navigate(def.default.POST, {
        renderInModal: true,
        data: { billId: data.id },
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
        await import("@/app/api/[locale]/chart-of-accounts/journal/[entryId]/get/definition");
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

      {/* Bill header */}
      <Div className="flex items-start justify-between p-5 rounded-lg border bg-card">
        <Div className="flex flex-col gap-2">
          <Div className="flex items-center gap-3">
            <H3 className="text-lg font-semibold">
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
          <Div className="flex gap-6 text-sm text-muted-foreground">
            <Div className="flex flex-col gap-0.5">
              <Span className="text-xs uppercase tracking-wide">
                {t("widget.billDate")}
              </Span>
              <Span>{new Date(data.billDate).toLocaleDateString()}</Span>
            </Div>
            {data.dueDate ? (
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs uppercase tracking-wide">
                  {t("widget.dueDate")}
                </Span>
                <Span
                  className={isOverdue ? "text-destructive font-medium" : ""}
                >
                  {new Date(data.dueDate).toLocaleDateString()}
                </Span>
              </Div>
            ) : null}
            {data.paidAt ? (
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs uppercase tracking-wide">
                  {t("widget.paidAt")}
                </Span>
                <Span>{new Date(data.paidAt).toLocaleDateString()}</Span>
              </Div>
            ) : null}
          </Div>

          {/* Notes */}
          {data.notes ? (
            <P className="text-sm text-muted-foreground">{data.notes}</P>
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
                  {data.currency} {fmt(data.subtotal)}
                </Span>
              </Div>
              {data.taxAmount > 0 && (
                <Div className="flex justify-between">
                  <Span className="text-muted-foreground">
                    {t("widget.tax")}
                  </Span>
                  <Span className="font-mono">
                    {data.currency} {fmt(data.taxAmount)}
                  </Span>
                </Div>
              )}
            </>
          )}
          <Div className="flex justify-between border-t pt-1.5 font-semibold">
            <Span>{t("widget.total")}</Span>
            <Span className="font-mono">
              {data.currency} {fmt(data.total)}
            </Span>
          </Div>
        </Div>
      </Div>

      {/* Action buttons by status */}
      <Div className="flex flex-wrap gap-2 pt-2 border-t">
        {(data.status === BillStatus.DRAFT ||
          data.status === BillStatus.RECEIVED) && (
          <>
            <Button type="button" onClick={handleApproveBill}>
              {t("widget.approveBill")}
            </Button>
            <Button type="button" variant="outline" onClick={handleAddLine}>
              {t("widget.addLine")}
            </Button>
          </>
        )}

        {data.status === BillStatus.APPROVED && (
          <>
            <Button type="button" onClick={handlePayBill}>
              {t("widget.payBill")}
            </Button>
            <Button type="button" variant="outline" onClick={handleAddLine}>
              {t("widget.addLine")}
            </Button>
          </>
        )}

        {data.status === BillStatus.PAID && data.journalEntryId ? (
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

      <AlertDialog open={pendingApprove} onOpenChange={setPendingApprove}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("widget.approveConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("widget.approveConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("widget.approveConfirmCancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmApprove}>
              {t("widget.approveConfirmProceed")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Div>
  );
}
