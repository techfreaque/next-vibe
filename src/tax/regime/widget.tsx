"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Building } from "next-vibe/ui/components/icons/Building";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useState } from "react";

import { formatAccountingDateInput } from "@/chart-of-accounts/shared/calendar-date";
import { ReportAsOfControl } from "@/finance/report-period-control";

import definition from "./definition";
import { CompanyTaxRegime, type CompanyTaxRegimeValue } from "./enum";
import type { TaxRegimeTranslationKey } from "./i18n";

const REGIME_HINTS: Record<
  typeof CompanyTaxRegimeValue,
  TaxRegimeTranslationKey
> = {
  [CompanyTaxRegime.STANDARD]: "hints.standard",
  [CompanyTaxRegime.DE_SMALL_BUSINESS]: "hints.german",
  [CompanyTaxRegime.AT_SMALL_BUSINESS]: "hints.austrian",
  [CompanyTaxRegime.SK_NON_PAYER]: "hints.slovak",
};

function todayUtc(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

export function CompanyTaxRegimeWidget({
  field,
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.POST>();
  const interactive = useWidgetIsInteractive();
  const navigation = useWidgetNavigation();
  const effectiveFrom = form.watch("effectiveFrom");
  const companyId = form.watch("companyId");
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const [today] = useState(todayUtc);
  const { data: review } = useApiQuery({
    endpoint: definition.GET,
    requestData: { companyId, asOf: today },
    options: {
      enabled: interactive && Boolean(companyId) && !result?.resultRegime,
    },
    logger,
    user,
  });
  useEffect(() => {
    if (
      review &&
      review.reviewedCompanyId === companyId &&
      !form.getFieldState("election").isDirty
    ) {
      form.setValue("election", review.currentRegime);
    }
  }, [companyId, form, review]);
  useEffect(() => {
    if (interactive && !effectiveFrom) {
      form.setValue("effectiveFrom", todayUtc());
    }
  }, [effectiveFrom, form, interactive]);

  if (result?.resultRegime) {
    return (
      <WidgetShell layout="page" className="mx-auto max-w-3xl">
        <WidgetHeader size="page" title={t("title")} />
        <ResultBanner
          variant="success"
          title={t("savedTitle", {
            regime: t(result.resultRegime),
            date: formatDocDate(result.resultFrom, locale),
          })}
          message={t(REGIME_HINTS[result.resultRegime])}
        >
          {result.notice && (
            <P className="mt-2 text-sm">{`${t("invoiceText")}: ${result.notice}`}</P>
          )}
        </ResultBanner>
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => navigation.pop()}
          >
            {t("back")}
          </Button>
        )}
      </WidgetShell>
    );
  }

  return (
    <AdminForm
      className="mx-auto max-w-3xl"
      title={t("title")}
      description={t("description")}
      backButton={
        navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start -ml-1"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            {t("back")}
          </Button>
        )
      }
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST> field={{ text: "save" }} />
      }
    >
      <AdminFormSection title={t("regime")} columns={2}>
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
      </AdminFormSection>
      <P className="text-xs leading-relaxed text-muted-foreground">
        {t("foreign")}
      </P>
    </AdminForm>
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
  const read = useWidgetEndpointMutations()?.read;
  const response = useWidgetResponse();
  const companyId = form.watch("companyId");
  const reviewed =
    result?.currentRegime &&
    (!companyId || result.reviewedCompanyId === companyId)
      ? result
      : undefined;
  const canChange = interactive && !!companyId && !!reviewed?.canEdit;
  const openChange = (): void => {
    void import("./definition").then(({ default: endpoints }) =>
      navigation.push(endpoints.POST, { data: { companyId } }),
    );
  };

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("reviewDescription")}
        actions={
          canChange && (
            <Button type="button" onClick={openChange}>
              {t("change")}
            </Button>
          )
        }
      />
      {interactive && (
        <Div className="grid gap-3 @xl:grid-cols-2">
          {!companyId && (
            <EntityPickerFieldWidget
              fieldName="companyId"
              field={withValue(field.children.companyId, undefined, null)}
            />
          )}
          <ReportAsOfControl
            label={t("asOf")}
            day={formatAccountingDateInput(form.watch("asOf"))}
            onChange={(date) =>
              form.setValue("asOf", date, { shouldDirty: true })
            }
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {interactive && !companyId ? (
        <Div className="rounded-lg border border-dashed bg-card">
          <EmptyBlock
            size="page"
            icon={<Building className="h-6 w-6" />}
            title={t("pickCompany.title")}
            message={t("pickCompany.message")}
          />
        </Div>
      ) : reviewed ? (
        <Div
          className={
            read?.isFetching
              ? "flex flex-col gap-3 rounded-lg border bg-card p-5 opacity-60"
              : "flex flex-col gap-3 rounded-lg border bg-card p-5"
          }
        >
          <Span className="text-xs font-medium text-muted-foreground">
            {t("appliesOn", {
              date: formatDocDate(reviewed.effectiveOn, locale),
            })}
          </Span>
          <P className="text-lg font-semibold">{t(reviewed.currentRegime)}</P>
          <P className="text-sm text-muted-foreground">
            {t(REGIME_HINTS[reviewed.currentRegime])}
          </P>
          {reviewed.legalNotice && (
            <Div className="rounded-md border bg-muted/40 p-3">
              <Span className="text-xs font-medium text-muted-foreground">
                {t("invoiceText")}
              </Span>
              <P className="mt-1 text-sm">{reviewed.legalNotice}</P>
            </Div>
          )}
          {reviewed.legalNotice && (
            <P className="text-xs leading-relaxed text-muted-foreground">
              {t("foreign")}
            </P>
          )}
        </Div>
      ) : response?.success === false ? null : (
        <Skeleton className="h-36 w-full rounded-lg" />
      )}
    </WidgetShell>
  );
}
