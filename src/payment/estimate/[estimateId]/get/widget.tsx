"use client";

import { formatDate } from "next-vibe/core/i18n/core/localization-utils";
import { Badge } from "next-vibe/ui/components/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
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
import { EstimateStatus } from "@/payment/enum";

import type definition from "./definition";

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

export function EstimateGetWidget({
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
          fieldName="estimateId"
          field={field.children.estimateId}
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
        import("@/payment/estimate/[estimateId]/convert-to-invoice/definition"),
        import("@/payment/invoice/[invoiceId]/get/definition"),
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

  const openStatusAction = (action: "send" | "accept" | "decline"): void => {
    void (async (): Promise<void> => {
      const actionDefinition =
        action === "send"
          ? await import("../send/definition")
          : action === "accept"
            ? await import("../accept/definition")
            : await import("../decline/definition");
      navigate(actionDefinition.default.POST, {
        urlPathParams: { estimateId: data.id },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const addLine = (): void => {
    void import("../../line/add/definition").then((module) => {
      navigate(module.default.POST, {
        data: { estimateId: data.id },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
      return undefined;
    });
  };

  const invoiceId = data.invoiceId;
  const openInvoice = (): void => {
    if (invoiceId) {
      void import("@/payment/invoice/[invoiceId]/get/definition").then(
        (module) => {
          navigate(module.default.GET, { urlPathParams: { invoiceId } });
          return undefined;
        },
      );
    }
  };

  return (
    <Div className="@container flex min-w-0 flex-col gap-6">
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
      <Div className="flex min-w-0 flex-wrap items-start justify-between gap-3 p-4 rounded-lg border bg-card">
        <Div className="flex min-w-0 flex-col gap-2">
          <Div className="flex flex-wrap items-center gap-3">
            <H3 className="text-lg font-semibold [overflow-wrap:anywhere]">
              {t("widget.estimateNumber")} {data.estimateNumber}
            </H3>
            <Badge variant={getStatusBadgeVariant(data.status)}>
              {getStatusLabel(data.status)}
            </Badge>
          </Div>

          {/* Meta */}
          <Div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {data.validUntil && (
              <Div className="flex flex-col gap-0.5">
                <Span className="text-xs uppercase tracking-wide">
                  {t("widget.valid")}
                </Span>
                <Span>{formatDate(data.validUntil, locale, "PP")}</Span>
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
            <P className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
              {data.notes}
            </P>
          )}
        </Div>
      </Div>

      {data.companyName && (
        <P className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
          {data.companyName}
        </P>
      )}

      {/* Actions */}
      <Div className="flex flex-wrap gap-2 pt-2 border-t">
        {isInteractive &&
          data.canManage &&
          data.status === EstimateStatus.DRAFT && (
            <>
              <Button type="button" onClick={() => openStatusAction("send")}>
                {t("widget.send")}
              </Button>
              <Button type="button" variant="outline" onClick={addLine}>
                {t("widget.addLine")}
              </Button>
            </>
          )}
        {isInteractive &&
          data.canManage &&
          data.status === EstimateStatus.SENT && (
            <>
              <Button type="button" onClick={() => openStatusAction("accept")}>
                {t("widget.accept")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => openStatusAction("decline")}
              >
                {t("widget.decline")}
              </Button>
            </>
          )}
        {isInteractive &&
          data.canManage &&
          (data.status === EstimateStatus.SENT ||
            data.status === EstimateStatus.ACCEPTED) && (
            <Button
              type="button"
              variant="outline"
              onClick={handleConvertToInvoice}
            >
              {t("widget.convertToInvoice")}
            </Button>
          )}
        {isInteractive && invoiceId && (
          <Button type="button" variant="outline" onClick={openInvoice}>
            {t("widget.openInvoice")}
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
