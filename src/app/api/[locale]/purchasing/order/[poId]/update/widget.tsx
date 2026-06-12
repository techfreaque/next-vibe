"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  withValue,
  withValueNonStrict,
} from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe-ui/unified/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function OrderUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();

  const result = data?.result;

  if (result !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("orderUpdate.patch.success.title")}
          </Span>
          <Span className="text-sm text-muted-foreground mt-0.5">
            {t("orderUpdate.patch.success.description")}
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
            {t("orderUpdate.patch.widget.backToPO")}
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
          {t("orderUpdate.patch.widget.backToPO")}
        </Button>
      )}

      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="vendorId"
          field={withValue(field.children.vendorId, undefined, null)}
        />
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="currency"
            field={withValue(field.children.currency, undefined, null)}
          />
          <TextFieldWidget
            fieldName="expectedDeliveryDate"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            field={
              withValueNonStrict(
                field.children.expectedDeliveryDate,
                undefined,
                null,
              ) as never
            }
          />
        </Div>
        <TextFieldWidget
          fieldName="deliveryWarehouseId"
          field={withValue(field.children.deliveryWarehouseId, undefined, null)}
        />
        <TextareaFieldWidget
          fieldName="notes"
          field={withValue(field.children.notes, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.PATCH>
        field={{ text: "orderUpdate.patch.title" }}
      />
    </Div>
  );
}
