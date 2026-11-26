"use client";

import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { Input } from "next-vibe/ui/components/input";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo, useState } from "react";

import { useToolCompanyId } from "@/companies/_shared/workspace-company-context";
import companyDefinition from "@/companies/[companyId]/get/definition";
import { DocumentScopePicker } from "@/finance/document-list-ui";
import { DocumentTextExportButton } from "@/finance/document-text-export";
import { ReportRangeControl } from "@/finance/report-period-control";

import { formatAccountingDateInput } from "../../shared/calendar-date";
import type definition from "./definition";

export function JournalExportWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const response = useWidgetResponse();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const showInputs = interactive && !responseOnly;
  const toolCompanyId = useToolCompanyId();
  const companyId = form.watch("companyId");
  const currency = form.watch("currency")?.trim().toUpperCase();
  const [otherCurrency, setOtherCurrency] = useState(false);
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { companyId },
        queryOptions: { enabled: showInputs && !!companyId },
      },
    }),
    [companyId, showInputs],
  );
  const company = useEndpoint(companyDefinition, options, logger, user).read
    ?.data;
  const companyCurrency =
    company?.id === companyId ? company?.currency?.trim().toUpperCase() : null;
  const currencies = new Set<string>(CurrenciesArr);
  if (companyCurrency && /^[A-Z]{3}$/.test(companyCurrency)) {
    currencies.add(companyCurrency);
  }
  const currencyValue =
    otherCurrency || (currency && !currencies.has(currency))
      ? "other"
      : (currency ?? "");

  useEffect(() => {
    if (!currency && !otherCurrency && companyCurrency) {
      form.setValue("currency", companyCurrency, { shouldValidate: true });
    }
  }, [companyCurrency, currency, form, otherCurrency]);

  const from = formatAccountingDateInput(form.watch("dateFrom"));
  const to = formatAccountingDateInput(form.watch("dateTo"));
  const ready =
    response?.success !== false &&
    !!data?.filename &&
    (!showInputs ||
      (data.companyIdOut === companyId &&
        data.currencyOut === currency &&
        data.fromOut === from &&
        data.toOut === to));
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("description")}
        actions={
          ready && interactive && data ? (
            <DocumentTextExportButton
              filename={data.filename}
              content={data.csv}
              mimeType="text/csv;charset=utf-8"
              downloadLabel={t("download")}
              copyLabel={t("copy")}
              copiedLabel={t("copied")}
              copyErrorLabel={t("copyFailed")}
            />
          ) : (
            showInputs && (
              <SubmitButtonWidget<typeof definition.GET>
                field={{
                  text: "prepare",
                  loadingText: "preparing",
                  size: "sm",
                }}
              />
            )
          )
        }
      />
      {showInputs && (
        <Div className="grid min-w-0 items-start gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
          {!toolCompanyId && (
            <Div className="flex min-w-0 flex-col gap-1.5">
              <Span className="text-sm font-medium">{t("company")}</Span>
              <DocumentScopePicker
                kind="company"
                required
                value={companyId}
                appliedLabel={
                  company?.id === companyId
                    ? company?.name
                    : data?.companyIdOut === companyId
                      ? data?.companyName
                      : undefined
                }
                onSelect={(id) => {
                  if (id === companyId) {
                    return;
                  }
                  setOtherCurrency(false);
                  form.setValue("companyId", id, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  form.setValue("currency", "", { shouldDirty: true });
                }}
              />
            </Div>
          )}
          <Div className="flex min-w-0 flex-col gap-1.5">
            <Span className="text-sm font-medium">{t("currency")}</Span>
            <Select
              value={currencyValue}
              onValueChange={(value) => {
                setOtherCurrency(value === "other");
                form.setValue("currency", value === "other" ? "" : value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger aria-label={t("currency")}>
                <SelectValue placeholder={t("currency")} />
              </SelectTrigger>
              <SelectContent>
                {[...currencies].map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
                <SelectItem value="other">{t("otherCurrency")}</SelectItem>
              </SelectContent>
            </Select>
            {currencyValue === "other" && (
              <Input
                aria-label={t("currencyHint")}
                aria-invalid={Boolean(form.formState.errors.currency)}
                autoCapitalize="characters"
                maxLength={3}
                placeholder="EUR"
                value={currency ?? ""}
                onChangeText={(value) =>
                  form.setValue("currency", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            )}
          </Div>
          <ReportRangeControl
            from={from}
            to={to}
            fromLabel={t("from")}
            toLabel={t("to")}
            defaultPreset="lastMonth"
            onChange={({ from: start, to: end }) => {
              form.setValue("dateFrom", start, { shouldDirty: true });
              form.setValue("dateTo", end, { shouldDirty: true });
              onSubmit?.();
            }}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {ready && data && (
        <SectionGroup title={t("ready")}>
          <DetailGrid columns={3}>
            <DetailField label={t("company")} value={data.companyName} />
            <DetailField label={t("currency")} value={data.currencyOut} />
            <DetailField label={t("rowCount")} value={data.rowCount ?? 0} />
            <DetailField label={t("debitCount")} value={data.debitCount} />
            <DetailField label={t("creditCount")} value={data.creditCount} />
            {data.fromOut && (
              <DetailField
                label={t("from")}
                value={formatDocDate(data.fromOut, locale)}
              />
            )}
            {data.toOut && (
              <DetailField
                label={t("to")}
                value={formatDocDate(data.toOut, locale)}
              />
            )}
            <DetailField
              className="@sm:col-span-2 @lg:col-span-3"
              label={t("filename")}
              value={data.filename}
            />
          </DetailGrid>
        </SectionGroup>
      )}
    </WidgetShell>
  );
}
