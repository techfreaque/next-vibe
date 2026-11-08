/**
 * Finance Threshold Editor Widget
 * Create or override one alert threshold.
 */

"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { P } from "next-vibe/ui/components/typography";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function FinanceThresholdSetWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const { pop, canGoBack } = useWidgetNavigation();

  return (
    <Div className="max-w-lg mx-auto w-full px-4 pt-6 pb-6 flex flex-col gap-4">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("thresholds.widget.back")}
        </Button>
      )}
      <P className="text-sm text-muted-foreground">
        {t("thresholds.widget.hint")}
      </P>
      <Div className="flex flex-col gap-3">
        <SelectFieldWidget
          fieldName="key"
          field={withValue(field.children.key, undefined, null)}
        />
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <NumberFieldWidget
            fieldName="value"
            field={withValue(field.children.value, undefined, null)}
          />
          <BooleanFieldWidget
            fieldName="enabled"
            field={withValue(field.children.enabled, undefined, null)}
          />
        </Div>
        <TextFieldWidget
          fieldName="note"
          field={withValue(field.children.note, undefined, null)}
        />
      </Div>
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "thresholds.title" as const }}
      />
    </Div>
  );
}
