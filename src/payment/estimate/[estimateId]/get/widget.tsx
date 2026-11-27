"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import {
  type AdminRecordAction,
  AdminRecordDetail,
} from "next-vibe/unified-ui/_shared/admin-record-detail";
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

import { documentLineContext } from "@/finance/document-action-confirm";
import { DocumentLineItems } from "@/finance/document-line-items";
import { documentStatusVariant } from "@/finance/document-status";
import { scopedTranslation as deliveryScopedTranslation } from "@/payment/document-delivery/i18n";
import { EstimateStatus } from "@/payment/enum";

import type definition from "./definition";

function action(
  key: string,
  label: string,
  onClick: () => void,
): AdminRecordAction {
  return { key, label, onClick };
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

  const handleConvertToInvoice = (): void => {
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

  const openStatusAction = (kind: "send" | "accept" | "decline"): void => {
    void (async (): Promise<void> => {
      const actionDefinition =
        kind === "send"
          ? await import("../send/definition")
          : kind === "accept"
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

  const openDuplicate = (): void => {
    void Promise.all([
      import("../duplicate/definition"),
      import("./definition"),
    ]).then(([duplicateDef, getDef]) =>
      navigate(duplicateDef.default.POST, {
        urlPathParams: { estimateId: data.id },
        renderInModal: true,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            estimateId: responseData.newEstimateId,
          }),
        },
      }),
    );
  };

  const removeLine = (line: {
    id: string;
    description: string;
    lineTotal: number;
  }): void => {
    documentLineContext.set(line.id, {
      number: data.estimateNumber,
      party: data.customerName ?? data.customerEmail,
      detail: line.description,
      amount: money(line.lineTotal),
    });
    void import("../../line/[lineId]/remove/definition").then((module) =>
      navigate(module.default.POST, {
        urlPathParams: { lineId: line.id },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      }),
    );
  };

  const { t: deliveryT } = deliveryScopedTranslation.scopedT(locale);
  const openEstimatePdf = (): void => {
    void import("../pdf/definition").then((pdfDef) =>
      navigate(pdfDef.default.GET, {
        urlPathParams: { estimateId: data.id },
        renderInModal: true,
      }),
    );
  };
  const canManage = isInteractive && data.canManage;
  const isDraft = data.status === EstimateStatus.DRAFT;
  const isSent = data.status === EstimateStatus.SENT;
  const isAccepted = data.status === EstimateStatus.ACCEPTED;
  const duplicateAction = action(
    "duplicate",
    t("widget.duplicate"),
    openDuplicate,
  );
  const primaryAction: AdminRecordAction | undefined = !canManage
    ? undefined
    : isDraft
      ? action("send", t("widget.send"), () => openStatusAction("send"))
      : isSent
        ? action("accept", t("widget.accept"), () => openStatusAction("accept"))
        : isAccepted
          ? action("convert", t("widget.convertToInvoice"), () =>
              handleConvertToInvoice(),
            )
          : invoiceId
            ? undefined
            : duplicateAction;
  const secondaryActions: AdminRecordAction[] = [
    ...(canManage && isDraft
      ? [action("addLine", t("widget.addLine"), addLine)]
      : []),
    ...(canManage && isSent
      ? [
          action("convert", t("widget.convertToInvoice"), () =>
            handleConvertToInvoice(),
          ),
        ]
      : []),
    ...(isInteractive && invoiceId
      ? [action("openInvoice", t("widget.openInvoice"), openInvoice)]
      : []),
    ...(isInteractive
      ? [
          action(
            "downloadPdf",
            deliveryT("pdf.downloadAction"),
            openEstimatePdf,
          ),
        ]
      : []),
  ];
  const moreActions: AdminRecordAction[] = [
    ...(canManage && primaryAction?.key !== "duplicate"
      ? [duplicateAction]
      : []),
    ...(canManage && isSent
      ? [
          action("decline", t("widget.decline"), () =>
            openStatusAction("decline"),
          ),
        ]
      : []),
  ];

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
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
      moreActions={moreActions}
    >
      {/* Line items */}
      {data.lines.length > 0 ? (
        <DocumentLineItems
          title={t("widget.lineItems")}
          lines={data.lines}
          labels={{
            description: t("widget.itemColumn"),
            quantity: t("widget.qty"),
            unitPrice: t("widget.unitPrice"),
            tax: t("widget.tax"),
            total: t("widget.total"),
          }}
          money={money}
          action={
            isInteractive &&
            data.canManage &&
            data.status === EstimateStatus.DRAFT
              ? {
                  label: t("widget.lineActions"),
                  render: (line): JSX.Element => (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="min-h-10 self-start text-destructive"
                      aria-label={t("widget.removeLineNamed", {
                        description: line.description,
                      })}
                      onClick={() => removeLine(line)}
                    >
                      {t("widget.removeLine")}
                    </Button>
                  ),
                }
              : undefined
          }
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
                <Span className="tabular-nums">{money(data.subtotal)}</Span>
              </Div>
              {data.taxAmount > 0 && (
                <Div className="flex flex-wrap justify-between gap-2">
                  <Span className="text-muted-foreground">
                    {t("widget.tax")}
                  </Span>
                  <Span className="tabular-nums">{money(data.taxAmount)}</Span>
                </Div>
              )}
            </>
          )}
          <Div className="flex flex-wrap justify-between gap-2 border-t pt-1.5 font-semibold">
            <Span>{t("widget.total")}</Span>
            <Span className="tabular-nums">{money(data.total)}</Span>
          </Div>
        </Div>
      </Div>
    </AdminRecordDetail>
  );
}
