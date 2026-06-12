"use client";

import { Badge } from "next-vibe-ui/ui/badge";
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
import { BooleanFieldWidget } from "next-vibe-ui/unified/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe-ui/unified/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function TaxRateUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();

  const handleBack = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../../list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  if (data?.updated !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex items-center gap-3">
          <Span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {t("rate.update.success.title")}
          </Span>
          <Badge
            variant={data.updated ? "default" : "destructive"}
            className="text-xs"
          >
            {data.updated
              ? t("rate.update.response.updated")
              : t("rate.update.widget.failed")}
          </Badge>
        </Div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="self-start"
        >
          {t("rate.update.widget.backToList")}
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
          {t("rate.update.widget.backToList")}
        </Button>
      )}

      <Div className="flex flex-col gap-1">
        <Span className="text-base font-semibold">
          {t("rate.update.title")}
        </Span>
        <Span className="text-sm text-muted-foreground">
          {t("rate.update.description")}
        </Span>
      </Div>

      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="name"
          field={withValue(field.children.name, undefined, null)}
        />
        <NumberFieldWidget
          fieldName="rate"
          field={withValue(field.children.rate, undefined, null)}
        />
        <BooleanFieldWidget
          fieldName="isDefault"
          field={withValue(field.children.isDefault, undefined, null)}
        />
        <BooleanFieldWidget
          fieldName="isActive"
          field={withValue(field.children.isActive, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.PATCH> field={{}} />
    </Div>
  );
}
