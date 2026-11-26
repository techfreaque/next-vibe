"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Building } from "next-vibe/ui/components/icons/Building";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Info } from "next-vibe/ui/components/icons/Info";
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
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { scopedTranslation as regimeTranslation } from "../regime/i18n";
import type definition from "./definition";
import {
  ComplianceIssue,
  type ComplianceIssueValue,
  ComplianceSeverity,
  type ComplianceSeverityValue,
} from "./enum";

type Fix = "company" | "regime" | "rates" | "chart" | "fiscal";

const FIXES: Partial<Record<typeof ComplianceIssueValue, Fix>> = {
  [ComplianceIssue.ISSUER_ADDRESS_MISSING]: "company",
  [ComplianceIssue.ISSUER_REGISTRATION_MISSING]: "company",
  [ComplianceIssue.ISSUER_REGISTRATION_INVALID]: "company",
  [ComplianceIssue.ISSUER_TAX_ID_MISSING]: "company",
  [ComplianceIssue.ISSUER_TAX_ID_INVALID]: "company",
  [ComplianceIssue.ISSUER_VAT_ID_MISSING]: "company",
  [ComplianceIssue.ISSUER_VAT_ID_INVALID]: "company",
  [ComplianceIssue.REGIME_NOT_ELECTED]: "regime",
  [ComplianceIssue.VAT_THRESHOLD_EXCEEDED]: "regime",
  [ComplianceIssue.TAX_RATES_MISSING]: "rates",
  [ComplianceIssue.TAX_RATES_OUTDATED]: "rates",
  [ComplianceIssue.CHART_TEMPLATE_MISMATCH]: "chart",
  [ComplianceIssue.FISCAL_PROVIDER_MISSING]: "fiscal",
};

const SEVERITY_STYLE: Record<
  typeof ComplianceSeverityValue,
  { className: string; icon: JSX.Element }
> = {
  [ComplianceSeverity.ERROR]: {
    className: "border-destructive/40 bg-destructive/5",
    icon: (
      <AlertCircle className="size-4 shrink-0 text-destructive" aria-hidden />
    ),
  },
  [ComplianceSeverity.WARNING]: {
    className: "border-amber-500/40 bg-amber-500/5",
    icon: (
      <AlertTriangle
        className="size-4 shrink-0 text-amber-600 dark:text-amber-400"
        aria-hidden
      />
    ),
  },
  [ComplianceSeverity.INFO]: {
    className: "bg-card",
    icon: (
      <Info className="size-4 shrink-0 text-muted-foreground" aria-hidden />
    ),
  },
};

export function TaxComplianceWidget({
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
  const regimeT = regimeTranslation.scopedT(locale).t;
  const checked =
    result?.checkedCompanyId &&
    (!companyId || result.checkedCompanyId === companyId)
      ? result
      : undefined;

  const openFix = (fix: Fix): void => {
    const id = checked?.checkedCompanyId;
    if (!id) {
      return;
    }
    if (fix === "company") {
      void import("@/companies/[companyId]/get/definition").then(
        ({ default: endpoints }) =>
          navigation.push(endpoints.GET, { urlPathParams: { companyId: id } }),
      );
    } else if (fix === "regime") {
      void import("../regime/definition").then(({ default: endpoints }) =>
        navigation.push(endpoints.POST, { data: { companyId: id } }),
      );
    } else if (fix === "rates") {
      void import("../rate/list/definition").then(({ default: endpoints }) =>
        navigation.push(endpoints.GET, { data: { companyId: id } }),
      );
    } else if (fix === "fiscal") {
      void import("@/pos/fiscal/settings/definition").then(
        ({ default: endpoints }) =>
          navigation.push(endpoints.GET, { data: { companyId: id } }),
      );
    } else {
      void import("@/chart-of-accounts/setup/definition").then(
        ({ default: endpoints }) =>
          navigation.push(endpoints.POST, { data: { companyId: id } }),
      );
    }
  };
  const fixLabel: Record<Fix, string> = {
    company: t("review.actions.company"),
    regime: t("review.actions.regime"),
    rates: t("review.actions.rates"),
    chart: t("review.actions.chart"),
    fiscal: t("review.actions.fiscal"),
  };

  const facts = checked
    ? [
        {
          label: t("review.facts.vatReturn"),
          value: checked.vatReturnAvailable
            ? t("review.facts.yes")
            : t("review.facts.no"),
        },
        {
          label: t("review.facts.statements"),
          value: checked.statementsAvailable
            ? t("review.facts.yes")
            : t("review.facts.no"),
        },
        {
          label: t("review.facts.fiscal"),
          value: checked.fiscalReceiptsRequired
            ? t("review.facts.required")
            : t("review.facts.notRequired"),
        },
        {
          label: t("review.facts.eInvoicing"),
          value: checked.eInvoicingFrom
            ? formatDocDate(checked.eInvoicingFrom, locale)
            : t("review.facts.notRequired"),
        },
      ]
    : [];

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("review.title")}
        subtitle={t("review.description")}
      />
      {interactive && !companyId && (
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={withValue(field.children.companyId, undefined, null)}
        />
      )}
      <FormAlertWidget field={{}} />
      {!checked && interactive && !companyId ? (
        <Div className="rounded-lg border border-dashed bg-card">
          <EmptyBlock
            size="page"
            icon={<Building className="h-6 w-6" />}
            title={t("review.pickCompany")}
          />
        </Div>
      ) : checked ? (
        <Div
          className={
            read?.isFetching
              ? "flex flex-col gap-4 opacity-60"
              : "flex flex-col gap-4"
          }
        >
          <Div className="flex flex-wrap items-center gap-2">
            <Span className="text-sm font-medium">{checked.companyName}</Span>
            <Badge variant="secondary">
              {t(`review.countries.${checked.country}`)}
            </Badge>
            <Badge variant="outline">{regimeT(checked.regime)}</Badge>
          </Div>

          {checked.findings.length === 0 ? (
            <Div className="flex items-center gap-2 rounded-lg border bg-card p-4">
              <CheckCircle className="size-4 text-primary" aria-hidden />
              <P className="text-sm">{t("review.allClear")}</P>
            </Div>
          ) : (
            <Div className="flex flex-col gap-2">
              <Span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("review.findings")}
              </Span>
              {checked.findings.map((finding) => {
                const style = SEVERITY_STYLE[finding.severity];
                const fix = FIXES[finding.code];
                return (
                  <Div
                    key={finding.code}
                    className={`flex flex-col gap-2 rounded-lg border p-3 @md:flex-row @md:items-center ${style.className}`}
                  >
                    <Div className="flex min-w-0 flex-1 items-start gap-2">
                      {style.icon}
                      <Div className="flex min-w-0 flex-col gap-0.5">
                        <Span className="text-xs text-muted-foreground">
                          {t(finding.severity)}
                        </Span>
                        <P className="text-sm">
                          {t(
                            finding.code,
                            finding.params?.date
                              ? {
                                  ...finding.params,
                                  date: formatDocDate(
                                    finding.params.date,
                                    locale,
                                  ),
                                }
                              : finding.params,
                          )}
                        </P>
                      </Div>
                    </Div>
                    {interactive && fix && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="self-start @md:self-center"
                        onClick={() => openFix(fix)}
                      >
                        {fixLabel[fix]}
                      </Button>
                    )}
                  </Div>
                );
              })}
            </Div>
          )}

          <Div className="rounded-lg border bg-card p-4">
            <Span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("review.facts.title")}
            </Span>
            <Div className="mt-2 grid gap-2 @md:grid-cols-2">
              {facts.map((fact) => (
                <Div key={fact.label} className="flex flex-col">
                  <Span className="text-xs text-muted-foreground">
                    {fact.label}
                  </Span>
                  <Span className="text-sm">{fact.value}</Span>
                </Div>
              ))}
            </Div>
          </Div>
          <P className="text-xs text-muted-foreground">
            {t("review.disclaimer")}
          </P>
        </Div>
      ) : response?.success === false ? null : (
        <Skeleton className="h-48 w-full rounded-lg" />
      )}
    </WidgetShell>
  );
}
