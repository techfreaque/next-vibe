"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe/unified-ui/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function InvoiceRecordPaymentWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();

  const handleViewInvoice = (): void => {
    const invoiceId = form?.getValues("invoiceId") ?? "";
    if (!invoiceId) {
      navigation.pop();
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("@/payment/invoice/[invoiceId]/get/definition");
      navigation.push(def.default.GET, { urlPathParams: { invoiceId } });
    })();
  };

  if (data?.success === true) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
          {t("post.success.title")}
        </Span>
        <Span className="text-sm text-foreground">
          {t("widget.paymentRecorded")}
        </Span>
        <Div className="flex gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleViewInvoice}
          >
            {t("widget.viewInvoice")}
          </Button>
          {navigation.canGoBack && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigation.pop()}
            >
              {t("widget.back")}
            </Button>
          )}
        </Div>
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
          {t("widget.back")}
        </Button>
      )}

      <Span className="text-base font-semibold">{t("post.title")}</Span>

      <Div className="flex flex-col gap-3">
        <Div className="grid grid-cols-2 gap-3">
          <NumberFieldWidget
            fieldName="amount"
            field={withValue(field.children.amount, undefined, null)}
          />
          <SelectFieldWidget
            fieldName="method"
            field={withValue(field.children.method, undefined, null)}
          />
        </Div>
        <Div className="grid grid-cols-2 gap-3">
          <DateFieldWidget
            fieldName="paidAt"
            field={withValue(field.children.paidAt, undefined, null)}
          />
          <EntityPickerFieldWidget
            fieldName="accountNodeId"
            field={withValue(field.children.accountNodeId, undefined, null)}
          />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "widget.submit" as const }}
      />
    </Div>
  );
}
