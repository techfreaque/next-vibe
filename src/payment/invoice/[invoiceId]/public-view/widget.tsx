"use client";

import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  formatDocDate,
  formatMoney,
  formatQuantity,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { documentStatusVariant } from "@/finance/document-status";

import { scopedTranslation as paymentScopedTranslation } from "../../../i18n";
import type definition from "./definition";

export function InvoicePublicViewWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const paymentT = paymentScopedTranslation.scopedT(locale).t;

  if (data?.id) {
    const money = (amount: number | string): string =>
      formatMoney(amount, data.currency, locale);
    const lines = data.lines ?? [];
    return (
      <Div className="flex min-w-0 flex-col gap-4">
        <Div className="flex flex-col gap-4 rounded-xl border bg-card p-5">
          <Div className="flex flex-wrap items-start justify-between gap-3">
            <Div className="flex min-w-0 flex-col gap-0.5">
              {data.companyName && (
                <Span className="text-sm text-muted-foreground">
                  {data.companyName}
                </Span>
              )}
              <Span className="whitespace-nowrap text-xl font-semibold">
                {data.invoiceNumber ?? t("get.title")}
              </Span>
            </Div>
            <StatusPill
              status={data.status}
              variant={documentStatusVariant(data.status)}
              label={paymentT(data.status)}
            />
          </Div>
          <Div className="flex flex-wrap items-end justify-between gap-3 border-t pt-4">
            <Div className="flex flex-col gap-0.5">
              <Span className="text-sm text-muted-foreground">
                {t("get.response.createdAt")}
              </Span>
              <Span className="text-sm">
                {formatDocDate(data.createdAt, locale)}
              </Span>
              {data.dueDate && (
                <Span className="text-sm text-muted-foreground">
                  {`${t("get.response.dueDate")}: ${formatDocDate(data.dueDate, locale)}`}
                </Span>
              )}
            </Div>
            <Div className="ml-auto flex flex-col items-end gap-0.5">
              <Span className="text-sm text-muted-foreground">
                {t("get.response.amount")}
              </Span>
              <Span className="whitespace-nowrap text-3xl font-semibold tabular-nums">
                {money(data.amount)}
              </Span>
            </Div>
          </Div>
        </Div>

        {lines.length > 0 && (
          <Div className="overflow-hidden rounded-xl border bg-card">
            <Div className="hidden grid-cols-[minmax(0,1fr)_5rem_8rem_8rem] gap-3 bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground @md:grid">
              <Span>{t("get.response.lineDescription")}</Span>
              <Span className="text-right">{t("get.response.quantity")}</Span>
              <Span className="text-right">{t("get.response.unitPrice")}</Span>
              <Span className="text-right">{t("get.response.lineTotal")}</Span>
            </Div>
            {lines.map((line) => (
              <Div
                key={line.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 border-t px-4 py-3 text-sm first:border-t-0 @md:grid-cols-[minmax(0,1fr)_5rem_8rem_8rem] @md:first:border-t"
              >
                <Span className="font-medium [overflow-wrap:anywhere]">
                  {line.description}
                </Span>
                <Span className="hidden text-right tabular-nums text-muted-foreground @md:block">
                  {formatQuantity(line.quantity, locale)}
                </Span>
                <Span className="hidden text-right tabular-nums text-muted-foreground @md:block">
                  {money(line.unitPrice)}
                </Span>
                <Span className="text-right font-semibold tabular-nums">
                  {money(line.lineTotal)}
                </Span>
                <Span className="col-span-2 text-xs text-muted-foreground @md:hidden">
                  {`${formatQuantity(line.quantity, locale)} × ${money(line.unitPrice)}`}
                </Span>
              </Div>
            ))}
          </Div>
        )}

        {data.notes && (
          <Div className="rounded-xl border bg-card p-4">
            <Span className="whitespace-pre-line text-sm text-muted-foreground">
              {data.notes}
            </Span>
          </Div>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      <Span className="text-base font-semibold">{t("get.title")}</Span>
      <Span className="text-sm text-muted-foreground">
        {t("get.description")}
      </Span>

      <TextFieldWidget
        fieldName="token"
        field={withValue(field.children.token, undefined, null)}
      />

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.GET>
        field={{ text: "widget.submit" as const }}
      />
    </Div>
  );
}
