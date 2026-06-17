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
import type { JSX } from "react";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function EstimateCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleView = (estimateId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[estimateId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { estimateId },
      });
    })();
  };

  if (data?.estimate?.id) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("post.success.title")}
          </Span>
          <Div className="flex items-center gap-2 mt-1">
            <Span className="font-mono text-sm font-bold text-muted-foreground">
              {data.estimate.estimateNumber}
            </Span>
            <Span className="text-base font-semibold text-foreground">
              {data.estimate.currency}
            </Span>
          </Div>
          <Span className="text-xs text-muted-foreground">
            {data.estimate.status}
          </Span>
        </Div>
        <Div className="flex gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => {
              handleView(data.estimate.id);
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
        <Div className="grid grid-cols-2 gap-3">
          <EntityPickerFieldWidget
            fieldName="customerId"
            field={withValue(field.children.customerId, undefined, null)}
          />
          <TextFieldWidget
            fieldName="customerEmail"
            field={withValue(field.children.customerEmail, undefined, null)}
          />
        </Div>
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="customerName"
            field={withValue(field.children.customerName, undefined, null)}
          />
          <TextFieldWidget
            fieldName="currency"
            field={withValue(field.children.currency, undefined, null)}
          />
        </Div>
        <Div className="grid grid-cols-2 gap-3">
          <DateFieldWidget
            fieldName="validUntil"
            field={withValue(field.children.validUntil, undefined, null)}
          />
          <TextFieldWidget
            fieldName="title"
            field={withValue(field.children.title, undefined, null)}
          />
        </Div>
        <TextFieldWidget
          fieldName="notes"
          field={withValue(field.children.notes, undefined, null)}
        />
        <TextFieldWidget
          fieldName="terms"
          field={withValue(field.children.terms, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.widget.submit" as const }}
      />
    </Div>
  );
}
