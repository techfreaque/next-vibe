"use client";

import { Div } from "next-vibe/ui/components/div";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { formatQuantity } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import {
  InventoryFormPage,
  InventoryWriteResult,
} from "../../_shared/inventory-form-page";
import { StockTarget } from "../../_shared/stock-target";
import type definition from "./definition";
import { AdjustPreview } from "./preview";

export function InventoryStockAdjustWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>()?.result;
  const warehouseId = result?.warehouseId ?? form.watch("warehouseId");
  const viewStock = (): void => {
    void import("../list/definition").then(({ default: list }) =>
      navigation.push(list.GET, {
        data: warehouseId ? { warehouseId } : undefined,
      }),
    );
  };
  const again = (): void => {
    void import("./definition").then(({ default: write }) =>
      navigation.push(write.POST, {
        data: warehouseId ? { warehouseId } : undefined,
      }),
    );
  };

  return (
    <InventoryFormPage
      title={t("stockAdjust.post.titleShort")}
      subtitle={t("stockAdjust.post.description")}
      backLabel={t("stockAdjust.post.widget.backToStock")}
      onBackFallback={viewStock}
      result={
        result ? (
          <InventoryWriteResult
            title={t("stockAdjust.post.success.title")}
            message={`${t("stockWrite.onHandNow")} ${formatQuantity(result.quantityOnHand, locale)}`}
            primary={{ label: t("stockWrite.viewStock"), onClick: viewStock }}
            secondary={{ label: t("stockWrite.again"), onClick: again }}
          />
        ) : undefined
      }
      footer={<AdjustPreview />}
      submit={
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "stockAdjust.post.title" as const,
            className: "min-h-10 px-6",
          }}
        />
      }
    >
      <StockTarget
        warehouseId={form.watch("warehouseId")}
        productId={form.watch("productId")}
        warehouseLabel={t("stockAdjust.post.warehouseId.label")}
        productLabel={t("stockAdjust.post.productId.label")}
        onHandLabel={t("stockList.get.response.quantityOnHand")}
      />
      <Div className="grid gap-4 @lg:grid-cols-2">
        <EntityPickerFieldWidget
          fieldName="warehouseId"
          field={withValue(field.children.warehouseId, undefined, null)}
        />
        <EntityPickerFieldWidget
          fieldName="productId"
          field={withValue(field.children.productId, undefined, null)}
        />
      </Div>
      <Div className="grid gap-4 @lg:grid-cols-2 @lg:items-end">
        <NumberFieldWidget
          fieldName="quantity"
          field={withValue(field.children.quantity, undefined, null)}
        />
        <NumberFieldWidget
          fieldName="unitCost"
          field={withValue(field.children.unitCost, undefined, null)}
        />
      </Div>
      <TextFieldWidget
        fieldName="reason"
        field={withValue(field.children.reason, undefined, null)}
      />
    </InventoryFormPage>
  );
}
