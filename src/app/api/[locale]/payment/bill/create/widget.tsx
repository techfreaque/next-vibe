"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import { type JSX } from "react";

import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe-ui/unified/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe-ui/unified/form-fields/entity-picker-field/widget";
import { TextareaFieldWidget } from "next-vibe-ui/unified/form-fields/textarea-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function BillCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const companyId = form?.watch("companyId") as string | undefined;
  const hasPrefilledCompany = !!companyId;

  if (data?.id) {
    return (
      <Div className="flex flex-col gap-6 py-8 items-center text-center">
        <CheckCircle className="h-12 w-12 text-emerald-500" />
        <Div className="flex flex-col gap-1">
          <H3 className="text-base font-semibold">{t("post.success.title")}</H3>
          <P className="text-sm text-muted-foreground">
            {data.billNumberResponse && (
              <Span className="font-mono font-bold mr-2">
                {data.billNumberResponse}
              </Span>
            )}
            {data.supplierNameResponse}
          </P>
        </Div>
        <Div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              void (async (): Promise<void> => {
                const def = await import("../[billId]/get/definition");
                navigation.push(def.default.GET, {
                  urlPathParams: { billId: data.id },
                });
              })();
            }}
          >
            {t("post.widget.viewButton")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void (async (): Promise<void> => {
                const def = await import("./definition");
                navigation.push(def.default.POST, {});
              })();
            }}
          >
            {t("post.widget.addAnotherButton")}
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

      <H3 className="text-base font-semibold">{t("post.title")}</H3>

      <Div className="flex flex-col gap-3">
        {!hasPrefilledCompany && (
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={withValue(field.children.companyId, undefined, null)}
          />
        )}

        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="supplierName"
            field={withValue(field.children.supplierName, undefined, null)}
          />
          <TextFieldWidget
            fieldName="supplierVatNumber"
            field={withValue(field.children.supplierVatNumber, undefined, null)}
          />
        </Div>

        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="billNumber"
            field={withValue(field.children.billNumber, undefined, null)}
          />
          <TextFieldWidget
            fieldName="currency"
            field={withValue(field.children.currency, undefined, null)}
          />
        </Div>

        <Div className="grid grid-cols-2 gap-3">
          <DateFieldWidget
            fieldName="billDate"
            field={withValue(field.children.billDate, undefined, null)}
          />
          <DateFieldWidget
            fieldName="dueDate"
            field={withValue(field.children.dueDate, undefined, null)}
          />
        </Div>

        <TextareaFieldWidget
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
