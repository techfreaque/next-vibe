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
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function RecurringToggleWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <AdminForm
      title={t("recurring.toggleTitle")}
      description={t("recurring.toggleDescription")}
      primaryAction={
        data ? null : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "settings.saveAction" }}
          />
        )
      }
    >
      {data?.updated ? (
        <ResultBanner variant="success" title={t("recurring.toggleSuccess")} />
      ) : (
        <AdminFormSection title={t("recurring.toggleTitle")}>
          <BooleanFieldWidget
            fieldName="isEnabled"
            field={field.children.isEnabled}
          />
          <TextFieldWidget fieldName="endDate" field={field.children.endDate} />
        </AdminFormSection>
      )}
    </AdminForm>
  );
}
