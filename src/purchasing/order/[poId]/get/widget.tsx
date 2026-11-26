"use client";

import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
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
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { isPurchaseDeliveryOverdue, purchaseOrderStatus } from "../../status";
import type definition from "./definition";

const MULTIPLY_SIGN = "\u00D7";

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
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();

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
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleAddLine = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../../line/add/definition");
      navigation.push(def.default.POST, {
        data: { poId: result.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleRemoveLine = (lineId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../../line/remove/definition");
      navigation.push(def.default.POST, {
        data: { poId: result.id, lineId },
        renderInModal: true,
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
      const def = await import("@/payment/bill/[billId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { billId },
      });
    })();
  };

  const status = purchaseOrderStatus(result.status, t);
  const overdue = isPurchaseDeliveryOverdue(
    result.expectedDeliveryDate,
    result.status,
  );
  const preciseCost = result.lines.some(
    (line) => Math.round(line.unitPrice * 10_000) % 100 !== 0,
  );

  return (
    <WidgetShell layout="page" className="mx-auto w-full max-w-4xl">
      <WidgetHeader
        size="page"
        title={result.poNumber}
        titleAccessory={
          <StatusPill status={status.label} variant={status.variant} />
        }
        subtitle={[result.vendorName, result.currency]
          .filter(Boolean)
          .join(" · ")}
        backButton={
          navigation.canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigation.pop()}
              className="-ml-1 gap-1.5 self-start"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("orderGet.get.widget.back")}
            </Button>
          ) : undefined
        }
        actions={
          interactive && !responseOnly ? (
            <Div className="flex flex-wrap items-center gap-2 @md:justify-end">
              {CANCELLABLE_STATUSES.has(result.status) && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-destructive"
                  onClick={handleCancel}
                >
                  {t("orderGet.get.widget.cancel")}
                </Button>
              )}
              {EDITABLE_STATUSES.has(result.status) && (
                <Button type="button" variant="outline" onClick={handleEdit}>
                  {t("orderGet.get.widget.edit")}
                </Button>
              )}
              {LINE_EDITABLE_STATUSES.has(result.status) && (
                <Button
                  type="button"
                  variant={result.lines.length === 0 ? "default" : "outline"}
                  onClick={handleAddLine}
                >
                  {t("orderGet.get.widget.addLine")}
                </Button>
              )}
              {SENDABLE_STATUSES.has(result.status) &&
                result.lines.length > 0 && (
                  <Button type="button" onClick={handleSend}>
                    {t("orderGet.get.widget.send")}
                  </Button>
                )}
              {CONFIRMABLE_STATUSES.has(result.status) && (
                <Button type="button" onClick={handleConfirm}>
                  {t("orderGet.get.widget.confirm")}
                </Button>
              )}
              {RECEIVABLE_STATUSES.has(result.status) && (
                <Button type="button" onClick={handleReceive}>
                  {t("orderGet.get.widget.receive")}
                </Button>
              )}
              {result.status === "RECEIVED" && !result.billId && (
                <Button type="button" onClick={handleConvertToBill}>
                  {t("orderGet.get.widget.convertToBill")}
                </Button>
              )}
              {result.status === "BILLED" && result.billId ? (
                <Button type="button" onClick={handleViewBill}>
                  {t("orderGet.get.widget.viewBill")}
                </Button>
              ) : null}
            </Div>
          ) : undefined
        }
      />

      {/* Delivery info */}
      {result.expectedDeliveryDate ? (
        <Div className="flex items-center gap-2 text-sm">
          <Span className="text-muted-foreground">
            {t("orderGet.get.widget.delivery")}
          </Span>
          <Span className={overdue ? "text-destructive font-medium" : ""}>
            {formatDocDate(result.expectedDeliveryDate, locale)}
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
            {formatMoney(result.subtotal, result.currency, locale)}
          </Span>
        </Div>
        <Div className="p-3 rounded-lg border">
          <Span className="text-muted-foreground block text-xs">
            {t("orderGet.get.response.taxAmount")}
          </Span>
          <Span className="font-medium">
            {formatMoney(result.taxAmount, result.currency, locale)}
          </Span>
        </Div>
        <Div className="p-3 rounded-lg border bg-muted/30">
          <Span className="text-muted-foreground block text-xs">
            {t("orderGet.get.response.total")}
          </Span>
          <Span className="font-semibold">
            {formatMoney(result.total, result.currency, locale)}
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
                  {interactive &&
                    !responseOnly &&
                    LINE_EDITABLE_STATUSES.has(result.status) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto min-h-11 justify-start whitespace-normal p-0 text-left text-destructive"
                        aria-label={`${t("orderLineRemove.post.titleShort")} ${line.description}`}
                        onClick={() => handleRemoveLine(line.id)}
                      >
                        {t("orderLineRemove.post.titleShort")}
                      </Button>
                    )}
                  {line.quantityReceived > 0 && (
                    <Span className="text-xs text-success block">
                      {line.quantityReceived}/{line.quantity}{" "}
                      {t("orderGet.get.widget.received")}
                    </Span>
                  )}
                </Div>
                <Span className="shrink-0 w-28 text-right text-muted-foreground">
                  {line.quantity} {MULTIPLY_SIGN}{" "}
                  {formatMoney(line.unitPrice, result.currency, locale)}
                </Span>
                <Span className="shrink-0 w-20 text-right font-medium">
                  {formatMoney(line.lineTotal, result.currency, locale)}
                </Span>
              </Div>
            ))}
          </Div>
        )}
      </Div>

      {preciseCost && (
        <Span className="text-xs text-muted-foreground">
          {t("orderGet.get.widget.precision")}
        </Span>
      )}
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
                className="flex flex-col gap-1 rounded border p-2 text-sm"
              >
                <Span>
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(receipt.receivedAt))}
                </Span>
                {receipt.lines.map((line) => (
                  <Div
                    key={line.poLineId}
                    className="flex justify-between gap-2 text-muted-foreground"
                  >
                    <Span>
                      {
                        result.lines.find(({ id }) => id === line.poLineId)
                          ?.description
                      }
                    </Span>
                    <Span className="tabular-nums">
                      {new Intl.NumberFormat(locale, {
                        maximumFractionDigits: 4,
                      }).format(line.quantityReceived)}
                    </Span>
                  </Div>
                ))}
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
    </WidgetShell>
  );
}
