"use client";

import { Button } from "next-vibe/ui/components/button";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { scopedTranslation as displayTranslation } from "../get/i18n";
import { OwnerPlanSummary } from "../plan-summary";
import type definition from "./definition";

export function CompanySubscriptionWidget({
  field,
}: {
  field: typeof definition.GET.fields;
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const local = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t } = displayTranslation.scopedT(locale);
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const navigation = useWidgetNavigation();
  const interactive = isInteractive && !responseOnly;
  const openRelated = (): void => {
    if (!data?.selectedCompanyId) {
      return;
    }
    const companyId = data.selectedCompanyId;
    void import("../get/definition").then(({ default: endpoint }) =>
      navigation.push(endpoint.GET, { urlPathParams: { companyId } }),
    );
  };
  const plan = data?.subscriptions?.[0];
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={local("get.title")}
        subtitle={data?.companyName ?? local("get.description")}
      />
      {interactive && !data?.selectedCompanyId && (
        <>
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={{ ...field.children.companyId, hidden: false }}
          />
          <SubmitButtonWidget<typeof definition.GET>
            field={{ text: "get.title" }}
          />
        </>
      )}
      <FormAlertWidget field={{}} />
      {plan && <OwnerPlanSummary planData={plan} />}
      {data?.selectedCompanyId && !plan && (
        <EmptyBlock title={t("view.empty")} message={t("view.emptyHelp")} />
      )}
      {interactive && plan && (
        <Button
          type="button"
          variant="outline"
          onClick={openRelated}
          className="self-start"
        >
          {t("view.open")}
        </Button>
      )}
    </WidgetShell>
  );
}
