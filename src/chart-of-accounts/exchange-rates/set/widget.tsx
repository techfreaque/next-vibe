"use client";

import { ResultBanner } from "next-vibe/ui/components/result-banner";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function ExchangeRateSetWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <AdminForm
      title={t("set.title")}
      description={t("set.description")}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "set.action" }}
        />
      }
    >
      {data?.saved && (
        <ResultBanner variant="success" title={t("set.success")} />
      )}
      <AdminFormSection title={t("set.title")} columns={2}>
        <TextFieldWidget
          fieldName="baseCurrency"
          field={field.children.baseCurrency}
        />
        <TextFieldWidget
          fieldName="quoteCurrency"
          field={field.children.quoteCurrency}
        />
        <NumberFieldWidget fieldName="rate" field={field.children.rate} />
        <DateFieldWidget fieldName="rateDate" field={field.children.rateDate} />
      </AdminFormSection>
    </AdminForm>
  );
}
