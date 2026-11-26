"use client";

import { Div } from "next-vibe/ui/components/div";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect } from "react";
import { z } from "zod";

import {
  InventoryFormPage,
  InventoryWriteResult,
} from "../../../_shared/inventory-form-page";
import getDefinition from "../get/definition";
import type definition from "./definition";

export function InventoryWarehouseUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const form = useWidgetForm<typeof definition.PATCH>();
  const saved = useWidgetValue<typeof definition.PATCH>()?.result;
  const warehouseId = form.watch("warehouseId");
  const interactive = useWidgetIsInteractive();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const validId = z.uuid().safeParse(warehouseId).success;
  // Opened without the current values (picker, direct link): load them so
  // the form edits the warehouse instead of starting blank.
  const needsValues = validId && form.getValues("name") === undefined;
  const current = useApiQuery({
    endpoint: getDefinition.GET,
    urlPathParams: { warehouseId: validId ? warehouseId : "" },
    options: { enabled: interactive && needsValues },
    logger,
    user,
  });
  const loaded =
    current.data?.result?.id === warehouseId ? current.data.result : undefined;
  useEffect(() => {
    if (!loaded || form.formState.isDirty) {
      return;
    }
    form.setValue("name", loaded.name);
    form.setValue("code", loaded.code);
    form.setValue("address", loaded.address ?? "");
    form.setValue("isActive", loaded.isActive);
    form.setValue("isDefault", loaded.isDefault);
  }, [loaded, form]);
  const openWarehouse = (): void => {
    void Promise.all([
      import("../get/definition"),
      import("../../list/definition"),
    ]).then(([{ default: get }, { default: list }]) =>
      warehouseId
        ? navigation.push(get.GET, { urlPathParams: { warehouseId } })
        : navigation.push(list.GET),
    );
  };

  return (
    <InventoryFormPage
      title={t("warehouseUpdate.patch.titleShort")}
      subtitle={t("warehouseUpdate.patch.description")}
      backLabel={t("warehouseUpdate.patch.widget.backToWarehouse")}
      onBackFallback={openWarehouse}
      result={
        saved ? (
          <InventoryWriteResult
            title={t("warehouseUpdate.patch.success.title")}
            message={`${saved.name} (${saved.code})`}
            primary={{
              label: t("warehouseCreate.post.widget.openWarehouse"),
              onClick: openWarehouse,
            }}
          />
        ) : undefined
      }
      submit={
        <SubmitButtonWidget<typeof definition.PATCH>
          field={{ className: "min-h-10 px-6" }}
        />
      }
    >
      <EntityPickerFieldWidget
        fieldName="warehouseId"
        field={field.children.warehouseId}
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
