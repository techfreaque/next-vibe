"use client";

import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { TransferAction } from "../../action";
import type definition from "./definition";

export function InventoryTransferCancelWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const form = useWidgetForm<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>()?.result;
  return (
    <TransferAction
      action="cancel"
      transferId={form.watch("transferId")}
      completed={Boolean(result)}
      picker={
        <EntityPickerFieldWidget
          fieldName="transferId"
          field={withValue(field.children.transferId, undefined, null)}
        />
      }
      submit={
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "transferCancel.post.titleShort",
            variant: "destructive",
          }}
        />
      }
    />
  );
}
