"use client";

import { Div } from "next-vibe/ui/components/div";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import {
  InventoryFormPage,
  InventoryWriteResult,
} from "../../_shared/inventory-form-page";
import type definition from "./definition";

export function InventoryWarehouseCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>()?.result;
  const openWarehouse = (): void => {
    if (!result) {
      return;
    }
    void import("../[warehouseId]/get/definition").then(({ default: get }) =>
      navigation.push(get.GET, { urlPathParams: { warehouseId: result.id } }),
    );
  };
  const createAnother = (): void => {
    void import("./definition").then(({ default: write }) =>
      navigation.push(write.POST, {
        data: result ? { companyId: result.companyId } : undefined,
      }),
    );
  };
  const openList = (): void => {
    void import("../list/definition").then(({ default: list }) =>
      navigation.push(list.GET),
    );
  };

  return (
    <InventoryFormPage
      title={t("warehouseCreate.post.titleShort")}
      subtitle={t("warehouseCreate.post.description")}
      backLabel={t("warehouseCreate.post.widget.backToList")}
      onBackFallback={openList}
      result={
        result ? (
          <InventoryWriteResult
            title={t("warehouseCreate.post.success.title")}
            message={`${result.name} (${result.code})`}
            primary={{
              label: t("warehouseCreate.post.widget.openWarehouse"),
              onClick: openWarehouse,
            }}
            secondary={{
              label: t("warehouseCreate.post.widget.createAnother"),
              onClick: createAnother,
            }}
          />
        ) : undefined
      }
      submit={
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "warehouseCreate.post.title" as const,
            className: "min-h-10 px-6",
          }}
        />
      }
    >
      <EntityPickerFieldWidget
        fieldName="companyId"
        field={field.children.companyId}
      />
      <Div className="grid gap-4 @lg:grid-cols-[2fr_1fr] @lg:items-end">
        <TextFieldWidget
          fieldName="name"
          field={withValue(field.children.name, undefined, null)}
        />
        <TextFieldWidget
          fieldName="code"
          field={withValue(field.children.code, undefined, null)}
        />
      </Div>
      <TextFieldWidget
        fieldName="address"
        field={withValue(field.children.address, undefined, null)}
      />
      <Div className="grid gap-3 border-t pt-4 @lg:grid-cols-2">
        <BooleanFieldWidget
          fieldName="isDefault"
          field={withValue(field.children.isDefault, undefined, null)}
        />
        <BooleanFieldWidget
          fieldName="isActive"
          field={withValue(field.children.isActive, undefined, null)}
        />
      </Div>
    </InventoryFormPage>
  );
}
