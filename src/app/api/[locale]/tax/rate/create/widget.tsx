"use client";

import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/web/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function TaxRateCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleBack = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  if (data?.id) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("rate.create.success.title")}
          </Span>
          <Div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="font-mono text-xs">
              {data.resultCode}
            </Badge>
            <Span className="text-sm font-medium">{data.resultName}</Span>
          </Div>
        </Div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="self-start"
        >
          {t("rate.create.widget.backToList")}
        </Button>
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
          {t("rate.create.widget.backToList")}
        </Button>
      )}

      <Div className="flex flex-col gap-1">
        <Span className="text-base font-semibold">
          {t("rate.create.title")}
        </Span>
        <Span className="text-sm text-muted-foreground">
          {t("rate.create.description")}
        </Span>
      </Div>

      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="companyId"
          field={withValue(field.children.companyId, undefined, null)}
        />
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="taxName"
            field={withValue(field.children.taxName, undefined, null)}
          />
          <TextFieldWidget
            fieldName="taxCode"
            field={withValue(field.children.taxCode, undefined, null)}
          />
        </Div>
        <Div className="grid grid-cols-2 gap-3">
          <SelectFieldWidget
            fieldName="type"
            field={withValue(field.children.type, undefined, null)}
          />
          <NumberFieldWidget
            fieldName="rate"
            field={withValue(field.children.rate, undefined, null)}
          />
        </Div>
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="country"
            field={withValue(field.children.country, undefined, null)}
          />
          <TextFieldWidget
            fieldName="region"
            field={withValue(field.children.region, undefined, null)}
          />
        </Div>
        <BooleanFieldWidget
          fieldName="isDefault"
          field={withValue(field.children.isDefault, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
