"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { documentStatusVariant } from "@/finance/document-status";

import { scopedTranslation as paymentTranslation } from "../i18n";
import type definition from "./definition";

export function PaymentInvoiceWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const invoice = data?.invoice;
  const locale = useWidgetLocale();
  const { t: paymentT } = paymentTranslation.scopedT(locale);

  if (invoice) {
    return (
      <Div className="flex flex-col gap-4">
        <Div className="flex flex-col gap-2 p-4 rounded-lg border bg-success/10 border-success/30">
          <Span className="text-xs font-semibold text-success">
            {t("post.success.title")}
          </Span>
          <Div className="flex items-center justify-between mt-1">
            <Span className="whitespace-nowrap text-sm font-semibold">
              {invoice.invoiceNumber}
            </Span>
            <StatusPill
              status={invoice.status}
              variant={documentStatusVariant(invoice.status)}
              label={paymentT(invoice.status)}
            />
          </Div>
          <Span className="text-2xl font-semibold tabular-nums">
            {formatMoney(invoice.amount, invoice.currency, locale)}
          </Span>
          {invoice.invoiceUrl && (
            <Span className="text-xs text-muted-foreground truncate">
              {invoice.invoiceUrl}
            </Span>
          )}
        </Div>
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
          >
            {t("post.widget.back")}
          </Button>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("post.widget.back")}
        </Button>
      )}

      <Span className="text-base font-semibold">{t("post.title")}</Span>

      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="customerId"
          field={withValue(field.children.customerId, undefined, null)}
        />
        <Div className="grid grid-cols-2 gap-3">
          <NumberFieldWidget
            fieldName="amount"
            field={withValue(field.children.amount, undefined, null)}
          />
          <SelectFieldWidget
            fieldName="currency"
            field={withValue(field.children.currency, undefined, null)}
          />
        </Div>
        <TextareaFieldWidget
          fieldName="description"
          field={withValue(field.children.description, undefined, null)}
        />
        <TextFieldWidget
          fieldName="dueDate"
          field={withValue(field.children.dueDate, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
