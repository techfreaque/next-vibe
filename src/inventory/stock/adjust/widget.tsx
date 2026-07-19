"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function InventoryStockAdjustWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();

  const quantityDelta = form?.watch("quantity");
  const showPreview =
    quantityDelta !== undefined &&
    quantityDelta !== null &&
    quantityDelta !== 0;

  return (
    <Div className="max-w-lg mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            navigation.pop();
          }}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("stockAdjust.post.widget.backToStock")}
        </Button>
      )}

      <Div className="flex flex-col gap-3">
        <EntityPickerFieldWidget
          fieldName="warehouseId"
          field={withValue(field.children.warehouseId, undefined, null)}
        />
        <EntityPickerFieldWidget
          fieldName="productId"
          field={withValue(field.children.productId, undefined, null)}
        />
        <NumberFieldWidget
          fieldName="quantity"
          field={withValue(field.children.quantity, undefined, null)}
        />
        <TextFieldWidget
          fieldName="reason"
          field={withValue(field.children.reason, undefined, null)}
        />
        <NumberFieldWidget
          fieldName="unitCost"
          field={withValue(field.children.unitCost, undefined, null)}
        />
      </Div>

      {showPreview ? (
        <Div className="rounded-lg border bg-muted/10 p-4 flex flex-col gap-3">
          <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {t("stockAdjust.post.widget.preview")}
          </Span>
          <Div className="flex items-center gap-3">
            <Span className="text-sm text-muted-foreground">
              {t("stockAdjust.post.widget.quantityChange")}:
            </Span>
            <Span
              className={`font-bold text-lg tabular-nums ${
                quantityDelta > 0
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {quantityDelta > 0 ? "+" : ""}
              {quantityDelta}
            </Span>
          </Div>
          <Span className="text-xs text-muted-foreground">
            {quantityDelta > 0
              ? t("stockAdjust.post.widget.positiveHint")
              : t("stockAdjust.post.widget.negativeHint")}
          </Span>
        </Div>
      ) : null}

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "stockAdjust.post.title" as const }}
      />
    </Div>
  );
}
