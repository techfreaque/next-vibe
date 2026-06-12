"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe-ui/unified/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe-ui/unified/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function InvoiceCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleView = (invoiceId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[invoiceId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { invoiceId },
      });
    })();
  };

  if (data?.invoice?.id) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("post.success.title")}
          </Span>
          <Div className="flex items-center gap-2 mt-1">
            {data.invoice.invoiceSequenceNumber !== null && (
              <Span className="font-mono text-sm font-bold text-muted-foreground">
                #{data.invoice.invoiceSequenceNumber}
              </Span>
            )}
            <Span className="text-base font-semibold text-foreground">
              {data.invoice.currency}
            </Span>
          </Div>
          <Span className="text-xs text-muted-foreground">
            {data.invoice.status}
          </Span>
        </Div>
        <Div className="flex gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => {
              handleView(data.invoice.id);
            }}
          >
            {t("post.widget.viewButton")}
          </Button>
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
          {t("post.widget.back")}
        </Button>
      )}

      <Span className="text-base font-semibold">{t("post.title")}</Span>

      <Div className="flex flex-col gap-3">
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={withValue(field.children.companyId, undefined, null)}
        />
        <EntityPickerFieldWidget
          fieldName="customerId"
          field={withValue(field.children.customerId, undefined, null)}
        />
        <Div className="grid grid-cols-2 gap-3">
          <DateFieldWidget
            fieldName="dueDate"
            field={withValue(field.children.dueDate, undefined, null)}
          />
          <TextFieldWidget
            fieldName="currency"
            field={withValue(field.children.currency, undefined, null)}
          />
        </Div>
        <TextFieldWidget
          fieldName="notes"
          field={withValue(field.children.notes, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.widget.submit" as const }}
      />
    </Div>
  );
}
