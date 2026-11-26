"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { DocumentTextExportButton } from "@/finance/document-text-export";

import { useInvoiceActionContext } from "../get/hooks";
import type definition from "./definition";

export function InvoiceSendReminderWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const draft = useWidgetValue<typeof definition.POST>()?.draft;
  const invoiceId = form.watch("invoiceId");
  const { invoice } = useInvoiceActionContext(invoiceId, interactive && !draft);
  const draftText = draft
    ? [
        t("widget.subject", { number: draft.invoiceNumber }),
        t("widget.body", {
          amount: formatMoney(draft.amount, draft.currency, locale),
          date: formatDocDate(draft.dueDate, locale),
        }),
        draft.note,
        draft.issuerName,
      ]
        .filter(Boolean)
        .join("\n\n")
    : "";
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t(draft ? "post.success.title" : "post.title")}
        subtitle={t(draft ? "widget.reminderSent" : "post.description")}
        backButton={
          navigation.canGoBack && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => navigation.pop()}
            >
              {t("widget.back")}
            </Button>
          )
        }
      />
      <FormAlertWidget field={{}} />
      {draft ? (
        <SectionGroup title={draft.invoiceNumber}>
          <P className="whitespace-pre-wrap text-sm">{draftText}</P>
          {interactive && (
            <Div className="mt-3 flex flex-wrap gap-2">
              <DocumentTextExportButton
                filename={`reminder-${draft.invoiceNumber.replace(/[^a-zA-Z0-9._-]/gu, "_").slice(0, 100)}.txt`}
                content={draftText}
                mimeType="text/plain;charset=utf-8"
                downloadLabel={t("widget.download")}
                copyLabel={t("widget.copy")}
                copiedLabel={t("widget.copied")}
                copyErrorLabel={t("widget.copyFailed")}
              />
              {invoiceId && (
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() =>
                    void import("../get/definition").then((m) =>
                      navigation.push(m.default.GET, {
                        urlPathParams: { invoiceId },
                      }),
                    )
                  }
                >
                  {t("widget.viewInvoice")}
                </Button>
              )}
            </Div>
          )}
        </SectionGroup>
      ) : (
        <>
          {invoice ? (
            <Div className="flex min-w-0 items-start justify-between gap-4 rounded-lg border bg-card px-4 py-3">
              <Div className="flex min-w-0 flex-col gap-0.5">
                <Span className="whitespace-nowrap text-sm font-semibold">
                  {invoice.invoiceNumber ?? t("post.title")}
                </Span>
                {invoice.customerName && (
                  <Span className="truncate text-sm text-muted-foreground">
                    {invoice.customerName}
                  </Span>
                )}
                {invoice.dueDate && (
                  <Span className="text-sm text-destructive">
                    {formatDocDate(invoice.dueDate, locale)}
                  </Span>
                )}
              </Div>
              <Span className="whitespace-nowrap text-base font-semibold tabular-nums">
                {formatMoney(invoice.amountDue, invoice.currency, locale)}
              </Span>
            </Div>
          ) : (
            <EntityPickerFieldWidget
              fieldName="invoiceId"
              field={field.children.invoiceId}
            />
          )}
          <TextareaFieldWidget
            fieldName="message"
            field={field.children.message}
          />
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "widget.submit", className: "self-start" }}
          />
        </>
      )}
    </WidgetShell>
  );
}
