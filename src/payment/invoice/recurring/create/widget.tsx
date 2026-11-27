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
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function RecurringCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <AdminForm
      title={t("recurring.createTitle")}
      description={t("recurring.createDescription")}
      primaryAction={
        data ? null : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "recurring.newSchedule" }}
          />
        )
      }
    >
      {data ? (
        <ResultBanner variant="success" title={t("recurring.createSuccess")} />
      ) : (
        <>
          <AdminFormSection title={t("recurring.createTitle")}>
            <EntityPickerFieldWidget
              fieldName="companyId"
              field={field.children.companyId}
            />
            <TextFieldWidget fieldName="title" field={field.children.title} />
            <TextFieldWidget
              fieldName="customerName"
              field={field.children.customerName}
            />
            <EmailFieldWidget
              fieldName="customerEmail"
              field={field.children.customerEmail}
            />
            <SelectFieldWidget
              fieldName="frequency"
              field={field.children.frequency}
            />
            <TextFieldWidget
              fieldName="nextRunDate"
              field={field.children.nextRunDate}
            />
            <TextFieldWidget
              fieldName="endDate"
              field={field.children.endDate}
            />
            <NumberFieldWidget
              fieldName="dueDays"
              field={field.children.dueDays}
            />
            <TextFieldWidget
              fieldName="currency"
              field={field.children.currency}
            />
          </AdminFormSection>
          <AdminFormSection title={t("fields.lineDescription")}>
            <TextFieldWidget
              fieldName="lineDescription"
              field={field.children.lineDescription}
            />
            <NumberFieldWidget
              fieldName="lineQuantity"
              field={field.children.lineQuantity}
            />
            <NumberFieldWidget
              fieldName="lineUnitPrice"
              field={field.children.lineUnitPrice}
            />
            <NumberFieldWidget
              fieldName="lineTaxRate"
              field={field.children.lineTaxRate}
            />
            <TextareaFieldWidget
              fieldName="notes"
              field={field.children.notes}
            />
            <BooleanFieldWidget
              fieldName="isEnabled"
              field={field.children.isEnabled}
            />
            <BooleanFieldWidget
              fieldName="autoIssue"
              field={field.children.autoIssue}
            />
            <BooleanFieldWidget
              fieldName="autoSendEmail"
              field={field.children.autoSendEmail}
            />
          </AdminFormSection>
        </>
      )}
    </AdminForm>
  );
}
