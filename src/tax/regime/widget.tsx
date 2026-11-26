"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function CompanyTaxRegimeWidget({
  field,
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("description")}
      />
      {result?.resultRegime ? (
        <Div className="space-y-2 rounded-lg border bg-card p-4">
          <P className="font-semibold">{t(result.resultRegime)}</P>
          <P>{`${t("from")} · ${formatDocDate(result.resultFrom, locale)}`}</P>
          {result.notice && <P>{result.notice}</P>}
        </Div>
      ) : (
        <Div className="flex max-w-2xl flex-col gap-4">
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={withValue(field.children.companyId, undefined, null)}
          />
          <SelectFieldWidget
            fieldName="election"
            field={withValue(field.children.election, undefined, null)}
          />
          <DateFieldWidget
            utcCalendarDay
            fieldName="effectiveFrom"
            field={withValue(field.children.effectiveFrom, undefined, null)}
          />
          <P className="text-sm text-muted-foreground">{t("foreign")}</P>
          <FormAlertWidget field={{}} />
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "save" }}
          />
        </Div>
      )}
    </WidgetShell>
  );
}

export function CompanyTaxRegimeReviewWidget({
  field,
}: {
  field: typeof definition.GET.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const result = useWidgetValue<typeof definition.GET>();
  const interactive = useWidgetIsInteractive();
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.GET>();
  const companyId = form.watch("companyId");
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("reviewDescription")}
      />
      {interactive && (
        <Div className="grid gap-3 @xl:grid-cols-2">
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={withValue(field.children.companyId, undefined, null)}
          />
          <DateFieldWidget
            utcCalendarDay
            fieldName="asOf"
            field={withValue(field.children.asOf, undefined, null)}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {result?.currentRegime && (
        <Div className="space-y-2 rounded-lg border bg-card p-4">
          <P className="font-semibold">{t(result.currentRegime)}</P>
          <P>{`${t("asOf")} · ${formatDocDate(result.effectiveOn, locale)}`}</P>
          {result.legalNotice && (
            <>
              <P>{result.legalNotice}</P>
              <P className="text-sm text-muted-foreground">{t("foreign")}</P>
            </>
          )}
        </Div>
      )}
      {interactive && (
        <Div className="flex flex-wrap gap-2">
          <SubmitButtonWidget<typeof definition.GET> field={{ text: "view" }} />
          {companyId &&
            result?.canEdit &&
            result.reviewedCompanyId === companyId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void import("./definition").then(({ default: endpoints }) =>
                    navigation.push(endpoints.POST, { data: { companyId } }),
                  );
                }}
              >
                {t("change")}
              </Button>
            )}
        </Div>
      )}
    </WidgetShell>
  );
}
