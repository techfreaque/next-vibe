"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import { InvoiceStatus } from "../../../enum";
import invoiceDetails from "../get/definition";
import type definition from "./definition";

export function InvoiceVoidWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const responseOnly = useWidgetResponseOnly();
  const navigation = useWidgetNavigation();
  const openRelated = useRelatedEntityNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const invoiceId = form?.watch("invoiceId") ?? "";
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { invoiceId },
        queryOptions: {
          enabled: !responseOnly && !!invoiceId,
          refetchOnWindowFocus: false,
        },
      },
    }),
    [invoiceId, responseOnly],
  );
  const { read } = useEndpoint(invoiceDetails, options, logger, user);
  const invoice =
    read.response?.success && read.data?.id === invoiceId
      ? read.data
      : undefined;
  const amount = Number(invoice?.amount);
  const needsReversal =
    invoice?.status === InvoiceStatus.OPEN && !!invoice.companyId;
  const alreadyVoided = invoice?.status === InvoiceStatus.VOID;
  const confirmed = data?.success === true || alreadyVoided;
  const canVoid =
    invoice?.canManage &&
    amount >= 0 &&
    Number.isFinite(amount) &&
    (invoice.status === InvoiceStatus.DRAFT ||
      (invoice.status === InvoiceStatus.OPEN &&
        invoice.amountPaid === 0 &&
        invoice.amountDue === amount &&
        (!needsReversal || !!invoice.journalEntryId)));

  const back = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="size-4" aria-hidden="true" />
      {t("widget.back")}
    </Button>
  ) : undefined;

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      <WidgetHeader
        size="page"
        title={t(confirmed ? "widget.voided" : "post.title")}
        backButton={back}
      />

      {invoice && (
        <DetailGrid columns={2}>
          <DetailField
            label={t("widget.invoice")}
            value={
              invoice.invoiceNumber ??
              (invoice.invoiceSequenceNumber === null
                ? undefined
                : String(invoice.invoiceSequenceNumber))
            }
          />
          <DetailField
            label={t("widget.total")}
            value={
              Number.isFinite(amount)
                ? formatMoney(amount, invoice.currency, locale)
                : undefined
            }
          />
          {invoice.customerName && (
            <DetailField
              label={t("widget.customer")}
              value={invoice.customerName}
            />
          )}
        </DetailGrid>
      )}

      {confirmed ? (
        !responseOnly &&
        invoiceId && (
          <Button
            type="button"
            variant="outline"
            className="self-start"
            onClick={() =>
              openRelated(() => Promise.resolve(invoiceDetails.GET), {
                urlPathParams: { invoiceId },
              })
            }
          >
            {t("widget.openInvoice")}
          </Button>
        )
      ) : !invoiceId ? (
        <EntityPickerFieldWidget
          fieldName="invoiceId"
          field={field.children.invoiceId}
        />
      ) : read.response?.success === false ? (
        <EmptyBlock
          title={t("widget.unavailable")}
          message={read.response.message}
          action={{
            label: t("widget.retry"),
            onClick: () => void read.refetch(),
          }}
        />
      ) : !invoice ? (
        <LoadingBlock message={t("widget.loading")} />
      ) : canVoid ? (
        <>
          <Div className="space-y-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <P className="text-sm font-medium">
              {t(needsReversal ? "widget.reversal" : "widget.cancelOnly")}
            </P>
            <P className="text-sm text-muted-foreground">
              {t("widget.warning")}
            </P>
          </Div>
          <FormAlertWidget field={{}} />
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "widget.submit",
              variant: "destructive",
              className: "self-start min-h-11",
            }}
          />
        </>
      ) : (
        <EmptyBlock
          title={t("post.errors.conflict.title")}
          message={t(
            needsReversal && !invoice.journalEntryId
              ? "post.errors.reversalPosting"
              : invoice.amountPaid > 0 ||
                  (invoice.status === InvoiceStatus.OPEN &&
                    invoice.amountDue < amount)
                ? "post.errors.appliedPayments"
                : "widget.ineligible",
          )}
        />
      )}
    </WidgetShell>
  );
}
