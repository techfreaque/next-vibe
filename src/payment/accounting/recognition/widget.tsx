"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function RevenueRecognitionWidget({
  field: { children },
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const result = data?.result;
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("recognitionTitle")}
        subtitle={t("recognitionDescription")}
      />
      <Div className="grid grid-cols-1 gap-3 @lg:grid-cols-2">
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={children.companyId}
        />
        <TextFieldWidget fieldName="evidenceId" field={children.evidenceId} />
        <TextFieldWidget
          fieldName="effectiveFrom"
          field={children.effectiveFrom}
        />
        <EntityPickerFieldWidget
          fieldName="revenueAccountId"
          field={children.revenueAccountId}
        />
      </Div>
      <BooleanFieldWidget
        fieldName="recognizeExpiry"
        field={children.recognizeExpiry}
      />
      <BooleanFieldWidget
        fieldName="recognizeServicePeriods"
        field={children.recognizeServicePeriods}
      />
      <BooleanFieldWidget fieldName="dryRun" field={children.dryRun} />
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget field={{ text: "submit", className: "self-end" }} />
      {result && (
        <Div className="flex flex-col gap-2 rounded-lg border p-3">
          <Span className="font-medium">{t(result.status)}</Span>
          {result.pendingStatus && (
            <Span className="text-muted-foreground">
              {t(result.pendingStatus)}
            </Span>
          )}
          {result.entries !== undefined &&
            result.netMinor !== undefined &&
            result.currency && (
              <DetailGrid columns={2}>
                <DetailField
                  label={t("recognitionEntries")}
                  value={String(result.entries)}
                />
                <DetailField
                  label={t("recognitionTitle")}
                  value={formatMoney(
                    result.netMinor / 100,
                    result.currency,
                    locale,
                  )}
                />
              </DetailGrid>
            )}
        </Div>
      )}
    </WidgetShell>
  );
}
