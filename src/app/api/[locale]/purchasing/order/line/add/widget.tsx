"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import { type JSX } from "react";

import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { NumberFieldWidget } from "next-vibe-ui/unified/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { type JSX } from "react";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function OrderLineAddWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const result = data?.result;

  if (result !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("orderLineAdd.post.widget.lineAdded")}
          </Span>
        </Div>
        <Div className="grid grid-cols-3 gap-2 text-xs">
          <Div>
            <Span className="block text-muted-foreground">
              {t("orderLineAdd.post.response.subtotal")}
            </Span>
            <Span className="font-medium">{result.subtotal.toFixed(2)}</Span>
          </Div>
          <Div>
            <Span className="block text-muted-foreground">
              {t("orderLineAdd.post.response.taxAmount")}
            </Span>
            <Span className="font-medium">{result.taxAmount.toFixed(2)}</Span>
          </Div>
          <Div>
            <Span className="block text-muted-foreground">
              {t("orderLineAdd.post.response.total")}
            </Span>
            <Span className="font-semibold">{result.total.toFixed(2)}</Span>
          </Div>
        </Div>
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start"
          >
            {t("orderLineAdd.post.widget.backToOrder")}
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
          {t("orderLineAdd.post.widget.backToOrder")}
        </Button>
      )}

      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="productId"
          field={withValue(field.children.productId, undefined, null)}
        />
        <TextFieldWidget
          fieldName="itemDescription"
          field={withValue(field.children.itemDescription, undefined, null)}
        />
        <Div className="grid grid-cols-2 gap-3">
          <NumberFieldWidget
            fieldName="quantity"
            field={withValue(field.children.quantity, undefined, null)}
          />
          <NumberFieldWidget
            fieldName="unitPrice"
            field={withValue(field.children.unitPrice, undefined, null)}
          />
        </Div>
        <NumberFieldWidget
          fieldName="taxRate"
          field={withValue(field.children.taxRate, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "orderLineAdd.post.title" }}
      />
    </Div>
  );
}
