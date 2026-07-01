"use client";

import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

const MULTIPLY_SIGN = "\u00d7";

type StatusVariant = "default" | "secondary" | "destructive" | "outline";

const STATUS_VARIANT: Record<string, StatusVariant> = {
  DRAFT: "secondary",
  SENT: "outline",
  CONFIRMED: "default",
  PARTIALLY_RECEIVED: "default",
  RECEIVED: "default",
  BILLED: "default",
  CANCELLED: "destructive",
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "text-slate-500",
  SENT: "text-amber-600",
  CONFIRMED: "text-blue-600",
  PARTIALLY_RECEIVED: "text-amber-600",
  RECEIVED: "text-green-700",
  BILLED: "text-purple-600",
  CANCELLED: "text-red-500",
};

// Only DRAFT and SENT can be cancelled
const CANCELLABLE_STATUSES = new Set(["DRAFT", "SENT"]);
// Only DRAFT can be edited
const EDITABLE_STATUSES = new Set(["DRAFT"]);
// Only DRAFT can be sent to vendor (and have lines added)
const SENDABLE_STATUSES = new Set(["DRAFT"]);
// Only SENT can be confirmed
const CONFIRMABLE_STATUSES = new Set(["SENT"]);
// CONFIRMED and PARTIALLY_RECEIVED can record receipt
const RECEIVABLE_STATUSES = new Set(["CONFIRMED", "PARTIALLY_RECEIVED"]);
// Only DRAFT can have lines added
const LINE_EDITABLE_STATUSES = new Set(["DRAFT"]);

function formatDate(date: Date | null, locale: string): string {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(date: Date | null, status: string): boolean {
  if (!date) {
    return false;
  }
  if (status === "RECEIVED" || status === "CANCELLED") {
    return false;
  }
  return new Date(date) < new Date();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OrderGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();

  if (!data?.result) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
        <EntityPickerFieldWidget fieldName="poId" field={field.children.poId} />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "orderGet.get.widget.select" as const }}
        />
      </Div>
    );
  }

  const { result } = data;

  const handleSend = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../send/definition");
      navigation.push(def.default.POST, {
        urlPathParams: { poId: result.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleConfirm = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../confirm/definition");
      navigation.push(def.default.POST, {
        urlPathParams: { poId: result.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleReceive = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../receive/definition");
      navigation.push(def.default.POST, {
        urlPathParams: { poId: result.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleConvertToBill = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../convert-to-bill/definition");
      navigation.push(def.default.POST, {
        urlPathParams: { poId: result.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleCancel = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../cancel/definition");
      navigation.push(def.default.POST, {
        urlPathParams: { poId: result.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleEdit = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../update/definition");
      navigation.push(def.default.PATCH, {
        urlPathParams: { poId: result.id },
      });
    })();
  };

  const handleAddLine = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../../line/add/definition");
      navigation.push(def.default.POST, {
        urlPathParams: { poId: result.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleViewBill = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    const billId = result.billId;
    if (!billId) {
      return;
    }
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/payment/bill/[billId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { billId },
      });
    })();
  };

  const statusVariant = STATUS_VARIANT[result.status] ?? "secondary";
  const statusColor = STATUS_COLOR[result.status] ?? "text-muted-foreground";
  const overdue = isOverdue(result.expectedDeliveryDate, result.status);

  const statusLabels: Record<string, string> = {
    DRAFT: t("enums.poStatus.draft"),
    SENT: t("enums.poStatus.sent"),
    CONFIRMED: t("enums.poStatus.confirmed"),
    PARTIALLY_RECEIVED: t("enums.poStatus.partiallyReceived"),
    RECEIVED: t("enums.poStatus.received"),
    BILLED: t("enums.poStatus.billed"),
    CANCELLED: t("enums.poStatus.cancelled"),
  };
  const statusLabel = statusLabels[result.status] ?? result.status;

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

      {/* Header: PO number, vendor, status, actions */}
      <Div className="flex items-start justify-between gap-3 flex-wrap">
        <Div>
          <Span className="text-xl font-semibold font-mono block">
            {result.poNumber}
          </Span>
          <Div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <Badge
              variant={statusVariant}
              className={["text-xs", statusColor].join(" ")}
            >
              {statusLabel}
            </Badge>
            <Span className="text-sm text-muted-foreground">
              {result.currency}
            </Span>
          </Div>
          <Div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Span>{t("orderGet.get.widget.vendorLabel")}</Span>
            <Span className="font-mono">{result.vendorId}</Span>
          </Div>
        </Div>
        <Div className="flex items-center gap-2 flex-wrap justify-end">
          {EDITABLE_STATUSES.has(result.status) && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleEdit}
            >
              {t("orderGet.get.widget.edit")}
            </Button>
          )}
          {LINE_EDITABLE_STATUSES.has(result.status) && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddLine}
            >
              {t("orderGet.get.widget.addLine")}
            </Button>
          )}
          {SENDABLE_STATUSES.has(result.status) && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleSend}
            >
              {t("orderGet.get.widget.send")}
            </Button>
          )}
          {CONFIRMABLE_STATUSES.has(result.status) && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleConfirm}
            >
              {t("orderGet.get.widget.confirm")}
            </Button>
          )}
          {RECEIVABLE_STATUSES.has(result.status) && (
            <Button type="button" size="sm" onClick={handleReceive}>
              {t("orderGet.get.widget.receive")}
            </Button>
          )}
          {result.status === "RECEIVED" && !result.billId && (
            <Button type="button" size="sm" onClick={handleConvertToBill}>
              {t("orderGet.get.widget.convertToBill")}
            </Button>
          )}
          {result.status === "BILLED" && result.billId ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleViewBill}
            >
              {t("orderGet.get.widget.viewBill")}
            </Button>
          ) : null}
          {CANCELLABLE_STATUSES.has(result.status) && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleCancel}
            >
              {t("orderGet.get.widget.cancel")}
            </Button>
          )}
        </Div>
      </Div>

      {/* Delivery info */}
      {result.expectedDeliveryDate ? (
        <Div className="flex items-center gap-2 text-sm">
          <Span className="text-muted-foreground">
            {t("orderGet.get.widget.delivery")}
          </Span>
          <Span className={overdue ? "text-red-600 font-medium" : ""}>
            {formatDate(result.expectedDeliveryDate, locale)}
            {overdue ? ` ${t("orderGet.get.widget.overdue")}` : ""}
          </Span>
        </Div>
      ) : null}

      {/* Totals */}
      <Div className="grid grid-cols-3 gap-2 text-sm">
        <Div className="p-3 rounded-lg border">
          <Span className="text-muted-foreground block text-xs">
            {t("orderGet.get.response.subtotal")}
          </Span>
          <Span className="font-medium">
            {result.currency} {result.subtotal.toFixed(2)}
          </Span>
        </Div>
        <Div className="p-3 rounded-lg border">
          <Span className="text-muted-foreground block text-xs">
            {t("orderGet.get.response.taxAmount")}
          </Span>
          <Span className="font-medium">
            {result.currency} {result.taxAmount.toFixed(2)}
          </Span>
        </Div>
        <Div className="p-3 rounded-lg border bg-muted/30">
          <Span className="text-muted-foreground block text-xs">
            {t("orderGet.get.response.total")}
          </Span>
          <Span className="font-semibold">
            {result.currency} {result.total.toFixed(2)}
          </Span>
        </Div>
      </Div>

      {/* Line items */}
      <Div>
        <Span className="text-sm font-medium block mb-2">
          {t("orderGet.get.widget.linesHeader")}
        </Span>
        {result.lines.length === 0 ? (
          <Span className="text-sm text-muted-foreground">
            {t("orderGet.get.widget.noLines")}
          </Span>
        ) : (
          <Div className="rounded-lg border overflow-hidden">
            {/* Header row */}
            <Div className="flex items-center gap-2 px-3 py-2 bg-muted/40 border-b text-xs font-medium text-muted-foreground">
              <Span className="flex-1">
                {t("orderGet.get.widget.colDescription")}
              </Span>
              <Span className="shrink-0 w-28 text-right">
                {t("orderGet.get.widget.colQtyPrice")}
              </Span>
              <Span className="shrink-0 w-20 text-right">
                {t("orderGet.get.widget.colLineTotal")}
              </Span>
            </Div>
            {result.lines.map((line) => (
              <Div
                key={line.id}
                className="flex items-center gap-2 px-3 py-2 border-b last:border-b-0 text-sm"
              >
                <Div className="flex-1 min-w-0">
                  <Span className="block">{line.description}</Span>
                  {line.quantityReceived > 0 && (
                    <Span className="text-xs text-green-600 block">
                      {line.quantityReceived}/{line.quantity}{" "}
                      {t("orderGet.get.widget.received")}
                    </Span>
                  )}
                </Div>
                <Span className="shrink-0 w-28 text-right text-muted-foreground">
                  {line.quantity} {MULTIPLY_SIGN} {line.unitPrice.toFixed(2)}
                </Span>
                <Span className="shrink-0 w-20 text-right font-medium">
                  {result.currency} {line.lineTotal.toFixed(2)}
                </Span>
              </Div>
            ))}
          </Div>
        )}
      </Div>

      {/* Receipt history */}
      {result.receipts.length > 0 && (
        <Div>
          <Span className="text-sm font-medium block mb-2">
            {t("orderGet.get.widget.receiptsHeader")}
          </Span>
          <Div className="flex flex-col gap-1">
            {result.receipts.map((receipt) => (
              <Div
                key={receipt.id}
                className="flex items-center justify-between p-2 rounded border text-sm"
              >
                <Span>{formatDate(receipt.receivedAt, locale)}</Span>
                <Span className="text-muted-foreground">
                  {receipt.lines.length} {t("orderGet.get.response.lines")}
                </Span>
                {receipt.notes ? (
                  <Span className="text-muted-foreground">{receipt.notes}</Span>
                ) : null}
              </Div>
            ))}
          </Div>
        </Div>
      )}

      {/* Notes */}
      {result.notes ? (
        <Div className="text-sm text-muted-foreground border-t pt-2">
          {result.notes}
        </Div>
      ) : null}

      {/* Converted bill indicator */}
      {result.billId ? (
        <Div className="text-sm text-muted-foreground border-t pt-2">
          {t("orderGet.get.widget.billCreated")}
        </Div>
      ) : null}
    </Div>
  );
}
