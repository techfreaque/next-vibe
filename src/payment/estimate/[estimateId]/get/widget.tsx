"use client";

import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { AdminRecordDetail } from "next-vibe/unified-ui/_shared/admin-record-detail";
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
import { EstimateStatus } from "@/payment/enum";

import type definition from "./definition";

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
    formatMoney(amount, data.currency, locale);

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

  const title = `${t("widget.estimateNumber")} ${data.estimateNumber}`;
  const facts = [
    { key: "total", label: t("widget.total"), value: money(data.total) },
    ...(data.customerName || data.customerEmail
      ? [
          {
            key: "customer",
            label: t("widget.customer"),
            value: data.customerName ?? data.customerEmail,
          },
        ]
      : []),
    ...(data.validUntil
      ? [
          {
            key: "valid",
            label: t("widget.valid"),
            value: formatDocDate(data.validUntil, locale),
          },
        ]
      : []),
  ];
  return (
    <AdminRecordDetail
      title={title}
      subtitle={[data.companyName, data.title].filter(Boolean).join(" · ")}
      status={{
        status: getStatusLabel(data.status),
        variant: documentStatusVariant(data.status),
      }}
      facts={facts}
      backButton={
        canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => pop()}
            className="self-start gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("widget.back")}
          </Button>
        )
      }
      actions={
        <>
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
                <Button
                  type="button"
                  onClick={() => openStatusAction("accept")}
                >
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
                variant={
                  data.status === EstimateStatus.ACCEPTED
                    ? "default"
                    : "outline"
                }
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
        </>
      }
    >
      {/* Line items */}
      {data.lines.length > 0 ? (
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
      ) : (
        <P className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          {t("widget.noItems")}
        </P>
      )}

      {data.notes && (
        <P className="whitespace-pre-line text-sm [overflow-wrap:anywhere]">
          {data.notes}
        </P>
      )}
      {data.terms && (
        <Div className="flex flex-col gap-1">
          <Span className="text-sm font-medium">{t("widget.terms")}</Span>
          <P className="whitespace-pre-line text-sm text-muted-foreground [overflow-wrap:anywhere]">
            {data.terms}
          </P>
        </Div>
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
    </AdminRecordDetail>
  );
}
