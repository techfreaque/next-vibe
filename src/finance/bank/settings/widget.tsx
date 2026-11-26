"use client";

import { Div } from "next-vibe/ui/components/div";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetIsInteractive,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { BankPageHeader } from "../page-header";
import type definition from "./definition";

export function BankSettingsWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const interactive = useWidgetIsInteractive();
  return (
    <WidgetShell layout="page">
      <BankPageHeader
        title={t("adjustment.settings")}
        subtitle={t("adjustment.settingsHint")}
      />
      {data?.saved && (
        <ResultBanner title={t("adjustment.settingsSaved")} variant="success" />
      )}
      {interactive && (
        <Div className="grid gap-3 sm:grid-cols-2">
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={field.children.companyId}
          />
          <EntityPickerFieldWidget
            fieldName="accountId"
            field={field.children.accountId}
          />
          <TextFieldWidget
            fieldName="bookedCurrency"
            field={field.children.bookedCurrency}
          />
          <TextFieldWidget
            fieldName="foreignCurrency"
            field={field.children.foreignCurrency}
          />
          <TextFieldWidget
            fieldName="maxFxDifference"
            field={field.children.maxFxDifference}
          />
          <NumberFieldWidget
            fieldName="maxFxBps"
            field={field.children.maxFxBps}
          />
          <NumberFieldWidget
            fieldName="maxDateDistanceDays"
            field={field.children.maxDateDistanceDays}
          />
          <EntityPickerFieldWidget
            fieldName="gainAccountId"
            field={field.children.gainAccountId}
          />
          <EntityPickerFieldWidget
            fieldName="lossAccountId"
            field={field.children.lossAccountId}
          />
          <EntityPickerFieldWidget
            fieldName="feeAccountId"
            field={field.children.feeAccountId}
          />
          <FormAlertWidget field={{}} />
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "adjustment.save" }}
          />
        </Div>
      )}
    </WidgetShell>
  );
}
