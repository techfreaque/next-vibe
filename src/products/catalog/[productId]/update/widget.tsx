"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function CatalogUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const { pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();

  const result = data?.result;

  if (result?.id) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("patch.success.title")}
          </Span>
          <Span className="text-base font-semibold text-foreground mt-1">
            {result.name}
          </Span>
        </Div>
        {canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => pop()}
            className="self-start"
          >
            {t("patch.widget.backToList")}
          </Button>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("patch.widget.back")}
        </Button>
      )}

      <Div className="flex flex-col gap-3">
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="fields.name"
            field={withValue(
              field.children.fields.children.name,
              undefined,
              null,
            )}
          />
          <SelectFieldWidget
            fieldName="fields.type"
            field={withValue(
              field.children.fields.children.type,
              undefined,
              null,
            )}
          />
        </Div>
        <TextareaFieldWidget
          fieldName="fields.productDescription"
          field={withValue(
            field.children.fields.children.productDescription,
            undefined,
            null,
          )}
        />
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="fields.sku"
            field={withValue(
              field.children.fields.children.sku,
              undefined,
              null,
            )}
          />
          <TextFieldWidget
            fieldName="fields.unit"
            field={withValue(
              field.children.fields.children.unit,
              undefined,
              null,
            )}
          />
        </Div>
        <Div className="grid grid-cols-2 gap-3">
          <NumberFieldWidget
            fieldName="fields.basePrice"
            field={withValue(
              field.children.fields.children.basePrice,
              undefined,
              null,
            )}
          />
          <TextFieldWidget
            fieldName="fields.currency"
            field={withValue(
              field.children.fields.children.currency,
              undefined,
              null,
            )}
          />
        </Div>
        <NumberFieldWidget
          fieldName="fields.defaultTaxRate"
          field={withValue(
            field.children.fields.children.defaultTaxRate,
            undefined,
            null,
          )}
        />
        <BooleanFieldWidget
          fieldName="fields.isActive"
          field={withValue(
            field.children.fields.children.isActive,
            undefined,
            null,
          )}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.PATCH> field={{}} />
    </Div>
  );
}
