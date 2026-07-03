"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function InventoryWarehouseUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();

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
          {t("warehouseUpdate.patch.widget.backToWarehouse")}
        </Button>
      )}

      <Div className="flex flex-col gap-3">
        <EntityPickerFieldWidget
          fieldName="warehouseId"
          field={field.children.warehouseId}
        />
        <TextFieldWidget
          fieldName="name"
          field={withValue(field.children.name, undefined, null)}
        />
        <TextFieldWidget
          fieldName="code"
          field={withValue(field.children.code, undefined, null)}
        />
        <TextFieldWidget
          fieldName="address"
          field={withValue(field.children.address, undefined, null)}
        />
        <Div className="grid grid-cols-2 gap-3">
          <BooleanFieldWidget
            fieldName="isActive"
            field={withValue(field.children.isActive, undefined, null)}
          />
          <BooleanFieldWidget
            fieldName="isDefault"
            field={withValue(field.children.isDefault, undefined, null)}
          />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.PATCH>
        field={{ text: "warehouseUpdate.patch.title" as const }}
      />
    </Div>
  );
}
