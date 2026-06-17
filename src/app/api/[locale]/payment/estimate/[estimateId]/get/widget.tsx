"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import { H3, H4, P } from "next-vibe-ui/ui/typography";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import { type JSX } from "react";

import { EstimateStatus } from "@/app/api/[locale]/payment/enum";

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
    case EstimateStatus.ACCEPTED:
      return "default";
    case EstimateStatus.SENT:
      return "secondary";
    case EstimateStatus.DECLINED:
    case EstimateStatus.EXPIRED:
      return "destructive";
    case EstimateStatus.DRAFT:
    case EstimateStatus.CONVERTED:
    default:
      return "outline";
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EstimateGetWidget(_props: {
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
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "widget.submit" as const }}
        />
      </Div>
    );
  }

  function getStatusLabel(status: string): string {
    switch (status) {
      case EstimateStatus.DRAFT:
        return t("widget.status.draft");
      case EstimateStatus.SENT:
        return t("widget.status.sent");
      case EstimateStatus.ACCEPTED:
        return t("widget.status.accepted");
      case EstimateStatus.DECLINED:
        return t("widget.status.declined");
      case EstimateStatus.EXPIRED:
        return t("widget.status.expired");
      case EstimateStatus.CONVERTED:
        return t("widget.status.converted");
      default:
        return status;
    }
  }

  const handleConvertToInvoice = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const [convertDef, invoiceGetDef] = await Promise.all([
        import("@/app/api/[locale]/payment/estimate/[estimateId]/convert-to-invoice/definition"),
        import("@/app/api/[locale]/payment/invoice/[invoiceId]/get/definition"),
      ]);
      navigate(convertDef.default.POST, {
        urlPathParams: { estimateId: data.id },
        renderInModal: true,
        replaceOnSuccess: {
          endpoint: invoiceGetDef.default.GET,
          getUrlPathParams: (responseData) => ({
            invoiceId: responseData.invoiceId,
          }),
        },
      });
    })();
  };

  return (
    <Div className="flex flex-col gap-6">
      {/* Back button */}
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

      {/* Estimate header */}
      <Div className="flex items-start justify-between p-5 rounded-lg border bg-card">
        <Div className="flex flex-col gap-2">
          <Div className="flex items-center gap-3">
            <H3 className="text-lg font-semibold">
              {t("widget.estimateNumber")} {data.estimateNumber}
            </H3>
            <Badge variant={getStatusBadgeVariant(data.status)}>
              {getStatusLabel(data.status)}
            </Badge>
          </Div>

          {/* Meta */}
          <Div className="flex gap-6 text-sm text-muted-foreground">
            {data.validUntil && (
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs uppercase tracking-wide">
                  {t("widget.valid")}
                </Span>
                <Span>{new Date(data.validUntil).toLocaleDateString()}</Span>
              </Div>
            )}
          </Div>

          {/* Customer */}
          {data.customerName && (
            <P className="text-sm">
              <Span className="text-muted-foreground">
                {t("widget.customer")}:
              </Span>{" "}
              <Span>{data.customerName}</Span>
            </P>
          )}

          {/* Notes */}
          {data.notes && (
            <P className="text-sm text-muted-foreground">{data.notes}</P>
          )}
        </Div>
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
        {data.status === EstimateStatus.ACCEPTED && (
          <Button type="button" onClick={handleConvertToInvoice}>
            {t("widget.convertToInvoice")}
          </Button>
        )}
      </Div>
    </Div>
  );
}
