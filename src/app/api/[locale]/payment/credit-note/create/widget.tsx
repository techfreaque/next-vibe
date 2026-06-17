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
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe-ui/unified/form-fields/textarea-field/widget";
import type { JSX } from "react";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function CreditNoteCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  if (data?.creditNote?.id) {
    return (
      <Div className="flex flex-col gap-4">
        <Div className="flex flex-col gap-2 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("post.success.title")}
          </Span>
          <Span className="text-sm font-mono font-semibold text-muted-foreground mt-1">
            {data.creditNote.amount} {data.creditNote.currency}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {data.creditNote.reason}
          </Span>
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
      <Span className="text-sm text-muted-foreground">
        {t("post.description")}
      </Span>

      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="invoiceId"
          field={withValue(field.children.invoiceId, undefined, null)}
        />
        <TextFieldWidget
          fieldName="companyId"
          field={withValue(field.children.companyId, undefined, null)}
        />
        <TextareaFieldWidget
          fieldName="reason"
          field={withValue(field.children.reason, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.widget.submit" as const }}
      />
    </Div>
  );
}
