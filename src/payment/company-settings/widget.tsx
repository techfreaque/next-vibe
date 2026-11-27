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
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function CompanyPaymentSettingsWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <AdminForm
      title={t("settings.title")}
      description={t("settings.description")}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "settings.saveAction" }}
        />
      }
    >
      {data?.saved && (
        <ResultBanner variant="success" title={t("settings.saveSuccess")} />
      )}
      <AdminFormSection title={t("settings.bankSection")}>
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={field.children.companyId}
        />
        <TextFieldWidget
          fieldName="bankAccountHolder"
          field={field.children.bankAccountHolder}
        />
        <TextFieldWidget fieldName="bankIban" field={field.children.bankIban} />
        <TextFieldWidget fieldName="bankBic" field={field.children.bankBic} />
      </AdminFormSection>
      <AdminFormSection title={t("settings.stripeSection")}>
        <BooleanFieldWidget
          fieldName="stripeEnabled"
          field={field.children.stripeEnabled}
        />
        <TextFieldWidget
          fieldName="stripeAccountLabel"
          field={field.children.stripeAccountLabel}
        />
        <EntityPickerFieldWidget
          fieldName="stripeClearingAccountId"
          field={field.children.stripeClearingAccountId}
        />
        <BooleanFieldWidget
          fieldName="autoBookStripePayments"
          field={field.children.autoBookStripePayments}
        />
      </AdminFormSection>
      <AdminFormSection title={t("settings.recurringSection")}>
        <BooleanFieldWidget
          fieldName="recurringInvoicesEnabled"
          field={field.children.recurringInvoicesEnabled}
        />
      </AdminFormSection>
    </AdminForm>
  );
}
