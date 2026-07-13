"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import { P } from "next-vibe/ui/ui/typography";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function InvoiceSendReminderWidget({
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
          {t("widget.reminderSent")}
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

      <Div className="flex flex-col gap-1">
        <Span className="text-base font-semibold">{t("post.title")}</Span>
        <P className="text-sm text-muted-foreground">{t("post.description")}</P>
      </Div>

      <TextFieldWidget
        fieldName="message"
        field={withValue(field.children.message, undefined, null)}
      />

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "widget.submit" as const }}
      />
    </Div>
  );
}
