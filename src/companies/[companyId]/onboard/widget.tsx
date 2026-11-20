"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function CompanyOnboardWidget({
  field: { children },
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const companyId = useWidgetForm<typeof definition.POST>()?.watch("companyId");
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  return (
    <WidgetShell>
      <WidgetHeader title={t("post.title")} />
      {interactive && !responseOnly && (
        <>
          <Span className="text-sm text-muted-foreground">
            {t("post.description")}
          </Span>
          {companyId && (
            <DetailField
              label={t("post.companyId.label")}
              value={companyId}
              mono
            />
          )}
          <EntityPickerFieldWidget
            field={children.companyId}
            fieldName="companyId"
          />
          <SelectFieldWidget field={children.country} fieldName="country" />
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "post.title" }}
          />
        </>
      )}
      <FormAlertWidget field={{}} />
      {data && (
        <DetailGrid>
          <DetailField
            label={t("post.response.accountsCreated")}
            value={data.accountsCreated}
          />
          <DetailField
            label={t("post.response.accountsSkipped")}
            value={data.accountsSkipped}
          />
          <DetailField
            label={t("post.response.taxRatesCreated")}
            value={data.taxRatesCreated}
          />
          {data.cashAccountId && (
            <DetailField
              label={t("post.response.cashAccountId")}
              value={data.cashAccountId}
              mono
            />
          )}
          {data.bankAccountId && (
            <DetailField
              label={t("post.response.bankAccountId")}
              value={data.bankAccountId}
              mono
            />
          )}
        </DetailGrid>
      )}
    </WidgetShell>
  );
}
