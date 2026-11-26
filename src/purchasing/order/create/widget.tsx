"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { CurrencySelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/currency-select-field/widget";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function OrderCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const openOrder = (): void => {
    const id = data?.result?.id;
    if (!id) {
      return;
    }
    void import("../[poId]/get/definition").then((def) =>
      navigation.push(def.default.GET, { urlPathParams: { poId: id } }),
    );
  };

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
      className="-ml-1 gap-1.5 self-start"
    >
      <ChevronLeft className="h-4 w-4" />
      {t("orderCreate.post.widget.backToList")}
    </Button>
  ) : undefined;

  const result = data?.result;
  if (result !== undefined) {
    return (
      <AdminForm
        title={result.poNumber}
        backButton={backButton}
        primaryAction={
          <Button type="button" onClick={openOrder}>
            {t("orderCreate.post.widget.viewOrder")}
          </Button>
        }
      >
        <ResultBanner
          variant="success"
          title={t("orderCreate.post.success.title")}
          message={t("orderCreate.post.widget.nextStep")}
        />
      </AdminForm>
    );
  }

  return (
    <AdminForm
      title={t("orderCreate.post.title")}
      description={t("orderCreate.post.widget.subtitle")}
      backButton={backButton}
      secondaryActions={
        navigation.canGoBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => navigation.pop()}
          >
            {t("orderCreate.post.widget.cancel")}
          </Button>
        ) : undefined
      }
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "orderCreate.post.title" }}
        />
      }
    >
      <AdminFormSection
        title={t("orderCreate.post.widget.sectionSupplier")}
        columns={2}
      >
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={field.children.companyId}
        />
        <EntityPickerFieldWidget
          fieldName="vendorId"
          field={field.children.vendorId}
        />
        <CurrencySelectFieldWidget
          fieldName="currency"
          field={withValue(field.children.currency, undefined, null)}
        />
      </AdminFormSection>
      <AdminFormSection
        title={t("orderCreate.post.widget.sectionDelivery")}
        columns={2}
      >
        <DateFieldWidget
          fieldName="expectedDeliveryDate"
          utcCalendarDay
          field={withValue(
            field.children.expectedDeliveryDate,
            undefined,
            null,
          )}
        />
        <EntityPickerFieldWidget
          fieldName="deliveryWarehouseId"
          field={field.children.deliveryWarehouseId}
        />
        <Div className="@lg:col-span-2">
          <TextareaFieldWidget
            fieldName="notes"
            field={withValue(field.children.notes, undefined, null)}
          />
        </Div>
      </AdminFormSection>
    </AdminForm>
  );
}
