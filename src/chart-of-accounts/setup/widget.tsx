"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import accountList from "../account/list/definition";
import periodList from "../period/list/definition";
import type definition from "./definition";

function ExistingAccounts({ companyId }: { companyId: string }): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const options = useMemo(
    () => ({
      read: {
        initialState: { companyId, pageSize: 1 },
        formOptions: { autoSubmit: true, debounceMs: 0, persistForm: false },
      },
    }),
    [companyId],
  );
  const { read } = useEndpoint(accountList, options, logger, user);
  const total = read?.data?.total;
  return (
    <P className="text-sm text-muted-foreground">
      {total === undefined
        ? t(
            read?.response?.success === false
              ? "post.widget.previewFailed"
              : "post.widget.previewLoading",
          )
        : total > 0
          ? t("post.widget.existing", { count: total })
          : t("post.widget.empty")}
    </P>
  );
}

export function CoaSetupWidget({
  field: { children },
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const { push, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const companyId = form?.watch("companyId");
  const showActions = interactive && !responseOnly;
  const complete = typeof data?.created === "number";

  return (
    <WidgetShell layout="page">
      <Div className="mx-auto flex min-w-0 w-full max-w-2xl flex-col gap-4">
        {canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2 self-start"
            onClick={() => pop()}
          >
            <ChevronLeft className="size-4" />
            {t("post.widget.back")}
          </Button>
        )}
        <WidgetHeader
          size="page"
          title={t("post.title")}
          subtitle={t("post.description")}
          border={false}
        />
        {showActions && !complete && (
          <>
            <SectionGroup title={t("post.widget.review")}>
              <Div className="flex min-w-0 flex-col gap-3">
                <EntityPickerFieldWidget
                  field={children.companyId}
                  fieldName="companyId"
                />
                <SelectFieldWidget
                  field={children.country}
                  fieldName="country"
                />
                {companyId && (
                  <ExistingAccounts key={companyId} companyId={companyId} />
                )}
                <P className="text-sm text-muted-foreground">
                  {t("post.widget.consequences")}
                </P>
              </Div>
            </SectionGroup>
            <SubmitButtonWidget<typeof definition.POST>
              field={{
                text: "post.widget.submit",
                className: "min-h-11 self-end",
              }}
            />
          </>
        )}
        <FormAlertWidget field={{}} />
        {complete && (
          <>
            <ResultBanner
              variant="success"
              icon={<CheckCircle className="size-4" />}
              title={t("post.success.title")}
              message={t("post.success.description")}
            />
            <MetricGrid columns={2}>
              <MetricCard
                label={t("post.response.created")}
                value={data.created}
              />
              <MetricCard
                label={t("post.response.skipped")}
                value={data.skipped}
              />
            </MetricGrid>
            {showActions && companyId && (
              <Div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="min-h-11"
                  onClick={() => push(accountList.GET, { data: { companyId } })}
                >
                  {t("post.widget.viewAccounts")}
                </Button>
                <Button
                  type="button"
                  className="min-h-11"
                  variant="outline"
                  onClick={() => push(periodList.GET, { data: { companyId } })}
                >
                  {t("post.widget.viewPeriods")}
                </Button>
              </Div>
            )}
          </>
        )}
      </Div>
    </WidgetShell>
  );
}
