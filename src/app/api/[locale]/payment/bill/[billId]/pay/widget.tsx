"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe-ui/unified/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe-ui/unified/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";

export function BillPayWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const navigation = useWidgetNavigation();

  if (data?.status !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("post.widget.paymentRecorded")}
          </Span>
          <Span className="text-sm text-muted-foreground">
            {t("post.success.description")}
          </Span>
        </Div>
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start"
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
        <Div className="grid grid-cols-2 gap-3">
          <EntityPickerFieldWidget
            fieldName="accountNodeId"
            field={withValue(field.children.accountNodeId, undefined, null)}
          />
          <DateFieldWidget
            fieldName="paidAt"
            field={withValue(field.children.paidAt, undefined, null)}
          />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.widget.submit" as const }}
      />
    </Div>
  );
}
