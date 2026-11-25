"use client";

import { ActionCard } from "next-vibe/ui/components/action-card";
import { Button } from "next-vibe/ui/components/button";
import { Checkbox } from "next-vibe/ui/components/checkbox";
import { DatePicker } from "next-vibe/ui/components/date-picker";
import { Div } from "next-vibe/ui/components/div";
import { Calendar } from "next-vibe/ui/components/icons/Calendar";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { FileText } from "next-vibe/ui/components/icons/FileText";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { parseFormDate } from "next-vibe/unified-ui/widgets/form-fields/_shared/date-value";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo, useState } from "react";

import periodsDefinition from "@/chart-of-accounts/period/list/definition";

import companyDefinition from "../get/definition";
import type definition from "./definition";
import { proposeOpeningMonth } from "./first-period";

function inputDate(date: Date | undefined): string | undefined {
  if (!date) {
    return undefined;
  }
  return [
    String(date.getFullYear()).padStart(4, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function FirstPeriodFields({ existing }: { existing: boolean }): JSX.Element {
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.POST>();
  const disabled = useWidgetDisabled();
  const submitting = useWidgetIsSubmitting();
  const [proposal] = useState(() => proposeOpeningMonth(locale));
  const opening = form.watch("openFirstPeriod") === true;
  const name = form.watch("periodName") ?? proposal.periodName;
  const start = form.watch("periodStart") ?? proposal.periodStart;
  const end = form.watch("periodEnd") ?? proposal.periodEnd;
  const setOpening = (checked: boolean): void => {
    form.setValue("openFirstPeriod", checked, { shouldDirty: true });
    if (checked) {
      form.setValue("periodName", name, { shouldDirty: true });
      form.setValue("periodStart", start, { shouldDirty: true });
      form.setValue("periodEnd", end, { shouldDirty: true });
    }
  };

  return (
    <SectionGroup title={t("post.period.title")}>
      {existing ? (
        <P className="text-sm text-muted-foreground">{t("post.period.kept")}</P>
      ) : (
        <Div className="flex min-w-0 flex-col gap-3">
          <Div className="flex items-center gap-2">
            <Checkbox
              id="onboard-open-first-period"
              checked={opening}
              disabled={disabled || submitting}
              onCheckedChange={setOpening}
            />
            <Label htmlFor="onboard-open-first-period">
              {t("post.period.open")}
            </Label>
          </Div>
          <P className="text-sm text-muted-foreground">
            {t("post.period.description")}
          </P>
          {opening ? (
            <Div className="flex min-w-0 flex-col gap-3">
              <Div className="flex min-w-0 flex-col gap-1.5">
                <Label htmlFor="onboard-period-name">
                  {t("post.period.name")}
                </Label>
                <Input
                  id="onboard-period-name"
                  disabled={disabled || submitting}
                  value={form.watch("periodName") ?? ""}
                  onChangeText={(value) =>
                    form.setValue("periodName", value || undefined, {
                      shouldDirty: true,
                    })
                  }
                />
              </Div>
              <Div className="grid min-w-0 gap-3 @sm:grid-cols-2">
                <Div className="flex min-w-0 flex-col gap-1.5">
                  <Label htmlFor="onboard-period-start">
                    {t("post.period.start")}
                  </Label>
                  <DatePicker
                    name="onboard-period-start"
                    disabled={disabled || submitting}
                    value={parseFormDate(form.watch("periodStart"))}
                    onChange={(date) =>
                      form.setValue("periodStart", inputDate(date), {
                        shouldDirty: true,
                      })
                    }
                  />
                </Div>
                <Div className="flex min-w-0 flex-col gap-1.5">
                  <Label htmlFor="onboard-period-end">
                    {t("post.period.end")}
                  </Label>
                  <DatePicker
                    name="onboard-period-end"
                    disabled={disabled || submitting}
                    value={parseFormDate(form.watch("periodEnd"))}
                    onChange={(date) =>
                      form.setValue("periodEnd", inputDate(date), {
                        shouldDirty: true,
                      })
                    }
                  />
                </Div>
              </Div>
            </Div>
          ) : (
            <P className="text-sm text-muted-foreground">
              {t("post.period.proposal", {
                name,
                start: formatDocDate(start, locale),
                end: formatDocDate(end, locale),
              })}
            </P>
          )}
        </Div>
      )}
    </SectionGroup>
  );
}

export function CompanyOnboardWidget({
  field: { children },
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const { push, pop, canGoBack } = useWidgetNavigation();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const ready = data?.success;
  const showInputs = interactive && !responseOnly && !ready;
  const companyId = form?.watch("companyId");
  const country = form?.watch("country");
  const enabled = showInputs && !!companyId;
  const companyOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { companyId: companyId ?? "" },
        queryOptions: { enabled },
      },
    }),
    [companyId, enabled],
  );
  const periodsOptions = useMemo(
    () => ({
      read: {
        initialState: { companyId },
        queryOptions: { enabled },
        formOptions: {
          autoSubmit: true,
          debounceMs: 0,
          persistForm: false,
        },
      },
    }),
    [companyId, enabled],
  );
  const { read: companyRead } = useEndpoint(
    companyDefinition,
    companyOptions,
    logger,
    user,
  );
  const { read: periodsRead } = useEndpoint(
    periodsDefinition,
    periodsOptions,
    logger,
    user,
  );
  const knownName =
    companyRead?.data?.id === companyId ? companyRead?.data?.name : undefined;
  const hasExistingPeriods =
    periodsRead?.data?.periods.some(
      (period) => period.companyId === companyId,
    ) ?? false;
  const completedCompanyId = data?.companyIdOut ?? companyId;

  const openInvoice = (): void => {
    if (!completedCompanyId) {
      return;
    }
    void import("@/payment/invoice/create/definition").then(
      ({ default: invoice }) =>
        push(invoice.POST, { data: { companyId: completedCompanyId } }),
    );
  };
  const openPeriods = (): void => {
    if (!completedCompanyId) {
      return;
    }
    if (data?.hasPeriods) {
      push(periodsDefinition.GET, { data: { companyId: completedCompanyId } });
      return;
    }
    void import("@/chart-of-accounts/period/create/definition").then(
      ({ default: period }) =>
        push(period.POST, { data: { companyId: completedCompanyId } }),
    );
  };

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
          subtitle={data?.companyName ?? knownName}
          border={false}
        />
        {showInputs && (
          <>
            <SectionGroup title={t("post.widget.books")}>
              <Div className="flex flex-col gap-3">
                <P className="text-sm text-muted-foreground">
                  {t("post.description")}
                </P>
                <EntityPickerFieldWidget
                  field={children.companyId}
                  fieldName="companyId"
                />
                <SelectFieldWidget
                  field={children.country}
                  fieldName="country"
                />
                {country && (
                  <P className="text-sm text-muted-foreground">
                    {t(
                      country === "XX"
                        ? "post.country.genericPreview"
                        : "post.country.regionalPreview",
                    )}
                  </P>
                )}
              </Div>
            </SectionGroup>
            {companyId && <FirstPeriodFields existing={hasExistingPeriods} />}
            <SubmitButtonWidget<typeof definition.POST>
              field={{
                text: "post.widget.submit",
                className: "min-h-11 self-end",
              }}
            />
          </>
        )}
        <FormAlertWidget field={{}} />
        {ready && (
          <>
            <ResultBanner
              variant="success"
              icon={<CheckCircle className="size-4" />}
              title={t("post.success.title")}
              message={t("post.widget.setupCounts", {
                accounts: data.accountsCreated + data.accountsSkipped,
                rates: data.taxRatesCreated,
              })}
              className="break-words"
            />
            {data.periodCreated && data.periodNameOut ? (
              <P className="text-sm text-muted-foreground">
                {t("post.period.opened", { name: data.periodNameOut })}
              </P>
            ) : (
              <P className="text-sm text-muted-foreground">
                {t(
                  data.hasPeriods ? "post.period.kept" : "post.widget.nextHint",
                )}
              </P>
            )}
            {interactive && !responseOnly && completedCompanyId && (
              <Div className="grid min-w-0 gap-2 @md:grid-cols-2">
                <ActionCard
                  icon={<FileText className="size-4" />}
                  title={t("post.widget.invoice")}
                  description={t("post.widget.invoiceHint")}
                  onClick={openInvoice}
                  variant="primary"
                />
                <ActionCard
                  icon={<Calendar className="size-4" />}
                  title={t(
                    data.hasPeriods ? "post.period.view" : "post.widget.period",
                  )}
                  description={t(
                    data.hasPeriods
                      ? "post.period.viewHint"
                      : "post.period.createHint",
                  )}
                  onClick={openPeriods}
                />
              </Div>
            )}
          </>
        )}
      </Div>
    </WidgetShell>
  );
}
