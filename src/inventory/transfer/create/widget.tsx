"use client";

import { Div } from "next-vibe/ui/components/div";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import {
  InventoryFormPage,
  InventoryWriteResult,
} from "../../_shared/inventory-form-page";
import type definition from "./definition";
import { TransferItemsEditor } from "./items-editor";

export function InventoryTransferCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>()?.result;
  const openTransfer = (): void => {
    if (!result) {
      return;
    }
    void import("../[transferId]/get/definition").then(({ default: get }) =>
      navigation.push(get.GET, { urlPathParams: { transferId: result.id } }),
    );
  };
  const openList = (): void => {
    void import("../list/definition").then(({ default: list }) =>
      navigation.push(list.GET),
    );
  };

  return (
    <InventoryFormPage
      title={t("transferCreate.post.titleShort")}
      subtitle={t("transferCreate.post.description")}
      backLabel={t("transferCreate.post.widget.backToList")}
      onBackFallback={openList}
      result={
        result ? (
          <InventoryWriteResult
            title={t("transferCreate.post.success.title")}
            message={result.reference ?? undefined}
            primary={{
              label: t("transferCreate.post.widget.viewTransfer"),
              onClick: openTransfer,
            }}
            secondary={{
              label: t("transferCreate.post.widget.backToList"),
              onClick: openList,
            }}
          />
        ) : undefined
      }
      footer={<TransferItemsEditor />}
      submit={
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "transferCreate.post.title" as const,
            className: "min-h-10 px-6",
          }}
        />
      }
    >
      <EntityPickerFieldWidget
        fieldName="companyId"
        field={withValue(field.children.companyId, undefined, null)}
      />
      <Div className="grid gap-4 @lg:grid-cols-2">
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
    </InventoryFormPage>
  );
}
