"use client";

import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function InventoryTransferCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

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
          {t("transferCreate.post.widget.backToList")}
        </Button>
      )}

      <Div className="flex flex-col gap-3">
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={withValue(field.children.companyId, undefined, null)}
        />
        <Div className="grid grid-cols-2 gap-3">
          <EntityPickerFieldWidget
            fieldName="fromWarehouseId"
            field={withValue(field.children.fromWarehouseId, undefined, null)}
          />
          <EntityPickerFieldWidget
            fieldName="toWarehouseId"
            field={withValue(field.children.toWarehouseId, undefined, null)}
          />
        </Div>
        <TextFieldWidget
          fieldName="reference"
          field={withValue(field.children.reference, undefined, null)}
        />
        <TextareaFieldWidget
          fieldName="notes"
          field={withValue(field.children.notes, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "transferCreate.post.title" as const }}
      />
    </Div>
  );
}
