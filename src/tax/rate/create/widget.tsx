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
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function TaxRateCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleBack = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  if (data?.id) {
    return (
      <Div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
        <ResultBanner
          variant="success"
          title={t("rate.create.success.title")}
          message={`${data.resultName} · ${data.resultCode}`}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="self-start"
        >
          {t("rate.create.widget.backToList")}
        </Button>
      </Div>
    );
  }

  return (
    <AdminForm
      className="mx-auto max-w-3xl"
      title={t("rate.create.title")}
      description={t("rate.create.description")}
      backButton={
        navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("rate.create.widget.backToList")}
          </Button>
        )
      }
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "rate.create.widget.save" }}
        />
      }
    >
      <AdminFormSection title={t("rate.details")}>
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={{
            ...withValue(field.children.companyId, undefined, null),
            description: undefined,
          }}
        />
        <Div className="grid gap-3 @md:grid-cols-2">
          <TextFieldWidget
            fieldName="taxName"
            field={{
              ...withValue(field.children.taxName, undefined, null),
              description: undefined,
            }}
          />
          <TextFieldWidget
            fieldName="taxCode"
            field={{
              ...withValue(field.children.taxCode, undefined, null),
              description: undefined,
            }}
          />
        </Div>
        <Div className="grid gap-3 @md:grid-cols-2">
          <SelectFieldWidget
            fieldName="type"
            field={{
              ...withValue(field.children.type, undefined, null),
              description: undefined,
            }}
          />
          <NumberFieldWidget
            presentation="percent"
            fieldName="rate"
            field={{
              ...withValue(field.children.rate, undefined, null),
              description: undefined,
              className: "[&_input]:h-10",
              placeholder: undefined,
            }}
          />
        </Div>
        <Div className="grid gap-3 @md:grid-cols-2">
          <TextFieldWidget
            fieldName="country"
            field={{
              ...withValue(field.children.country, undefined, null),
              description: undefined,
            }}
          />
          <TextFieldWidget
            fieldName="region"
            field={{
              ...withValue(field.children.region, undefined, null),
              description: undefined,
            }}
          />
        </Div>
        <BooleanFieldWidget
          fieldName="isDefault"
          field={{
            ...withValue(field.children.isDefault, undefined, null),
            description: undefined,
          }}
        />
      </AdminFormSection>
    </AdminForm>
  );
}
