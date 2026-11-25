"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { DocumentScopePicker } from "@/finance/document-list-ui";

import { JournalEntryStatus } from "../enum";
import type definition from "./definition";

interface AccountingDashboardWidgetProps {
  field: (typeof definition.GET)["fields"];
}

const NAV_ICONS = {
  accounts: "book-open",
  journal: "pencil",
  periods: "calendar",
  balanceSheet: "scale",
  profitLoss: "trending-up",
  trialBalance: "bar-chart",
  taxReport: "banknote",
  companies: "building",
  invoices: "receipt",
  bills: "file-text",
} as const;

function KpiCard({
  label,
  value,
  empty,
}: {
  label: string;
  value: string;
  empty: boolean;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-2 rounded-md border bg-card p-3 @md:p-4">
      <Span className="text-sm text-muted-foreground">{label}</Span>
      <Span
        className={`break-words text-lg leading-tight tabular-nums @md:text-2xl ${empty ? "text-muted-foreground" : "font-semibold"}`}
      >
        {value}
      </Span>
    </Div>
  );
}

function NavCard({
  label,
  iconKey,
  onClick,
}: {
  label: string;
  iconKey: keyof typeof NAV_ICONS;
  onClick: () => void;
}): JSX.Element {
  const icon = NAV_ICONS[iconKey];
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="h-auto py-3 px-4 flex flex-col items-start gap-1 text-left"
    >
      <Icon icon={icon} className="h-5 w-5 text-muted-foreground" />
      <Span className="text-sm font-medium">{label}</Span>
    </Button>
  );
}

export function AccountingDashboardWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: AccountingDashboardWidgetProps,
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const form = useWidgetForm<typeof definition.GET>();
  const response = useWidgetResponse();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive();
  const embedded = interactive && responseOnly;
  const isInteractive = interactive && !responseOnly;
  const companyId = form.watch("companyId");
  const selectedCompanyId = data?.selectedCompanyId ?? undefined;
  const hasCompany =
    selectedCompanyId !== undefined &&
    (!isInteractive || !companyId || selectedCompanyId === companyId);
  const canConfigure = interactive && data?.canConfigure;

  const handleNavGet = (
    importFn: () => Promise<{
      default: { GET: Parameters<typeof navigation.push>[0] };
    }>,
    useCompany = true,
  ): (() => void) => {
    return (): void => {
      void (async (): Promise<void> => {
        const mod = await importFn();
        navigation.push(mod.default.GET, {
          data:
            useCompany && selectedCompanyId
              ? { companyId: selectedCompanyId }
              : undefined,
        });
      })();
    };
  };

  const handleNavPost = (
    importFn: () => Promise<{
      default: { POST: Parameters<typeof navigation.push>[0] };
    }>,
  ): (() => void) => {
    return (): void => {
      void (async (): Promise<void> => {
        const mod = await importFn();
        navigation.push(mod.default.POST, {
          data: selectedCompanyId
            ? { companyId: selectedCompanyId }
            : undefined,
        });
      })();
    };
  };

  const handleNavAccountList = handleNavGet(
    () => import("../account/list/definition"),
  );
  const handleNavJournalList = handleNavGet(
    () => import("../journal/list/definition"),
  );
  const handleNavPeriodList = handleNavGet(
    () => import("../period/list/definition"),
  );
  const handleNavBalanceSheet = handleNavGet(
    () => import("../reports/balance-sheet/definition"),
  );
  const handleNavProfitLoss = handleNavGet(
    () => import("../reports/profit-loss/definition"),
  );
  const handleNavTrialBalance = handleNavGet(
    () => import("../reports/trial-balance/definition"),
  );
  const handleNavTaxReport = handleNavGet(
    () => import("@/tax/report/definition"),
  );
  const handleNavSetup = handleNavPost(() => import("../setup/definition"));
  const handleNavCreatePeriod = handleNavPost(
    () => import("../period/create/definition"),
  );
  const handleNavCompanies = handleNavGet(
    () => import("@/companies/list/definition"),
    false,
  );
  const handleNavInvoices = handleNavGet(
    () => import("@/payment/invoice/list/definition"),
  );
  const handleNavBills = handleNavGet(
    () => import("@/payment/bill/list/definition"),
  );

  const handleDrafts = (): void => {
    void (async (): Promise<void> => {
      const { default: journals } = await import("../journal/list/definition");
      navigation.push(journals.GET, {
        data: {
          companyId: selectedCompanyId,
          status: JournalEntryStatus.DRAFT,
        },
      });
    })();
  };

  return (
    <WidgetShell
      layout={embedded ? "compact" : "page"}
      padding={embedded ? "none" : "md"}
      className="min-w-0"
    >
      {!embedded && <WidgetHeader size="page" title={t("dashboard.title")} />}
      {isInteractive && (
        <Div className="flex min-w-0 flex-wrap items-center gap-2">
          <DocumentScopePicker
            kind="company"
            required
            value={companyId ?? selectedCompanyId}
            appliedLabel={hasCompany ? data?.selectedCompanyName : undefined}
            onSelect={(id) =>
              form.setValue("companyId", id, { shouldDirty: true })
            }
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {response?.success !== false && companyId && !hasCompany && (
        <LoadingBlock message={t("dashboard.widget.loading")} />
      )}
      {response?.success !== false && !companyId && !hasCompany && (
        <EmptyBlock title={t("dashboard.widget.selectCompany")} />
      )}
      {hasCompany && data && (
        <Div className="flex min-w-0 flex-col gap-6">
          {data.openReceivables !== undefined &&
            data.approvedPayables !== undefined &&
            data.cashBalance !== undefined &&
            data.monthToDateProfit !== undefined && (
              <Div className="flex flex-col gap-2">
                <Span className="text-sm font-semibold">{`${t("dashboard.widget.financialOverview")} · ${data.currency}`}</Span>
                <Div className="grid min-w-0 grid-cols-2 gap-2 @xl:grid-cols-4">
                  <KpiCard
                    label={t("dashboard.widget.openReceivables")}
                    empty={Math.abs(data.openReceivables) < 0.005}
                    value={formatMoney(
                      data.openReceivables,
                      data.currency,
                      locale,
                    )}
                  />
                  <KpiCard
                    label={t("dashboard.widget.approvedPayables")}
                    empty={Math.abs(data.approvedPayables) < 0.005}
                    value={formatMoney(
                      data.approvedPayables,
                      data.currency,
                      locale,
                    )}
                  />
                  <KpiCard
                    label={t("dashboard.widget.cashBalance")}
                    empty={Math.abs(data.cashBalance) < 0.005}
                    value={formatMoney(data.cashBalance, data.currency, locale)}
                  />
                  <KpiCard
                    label={t("dashboard.widget.monthToDateProfit")}
                    empty={Math.abs(data.monthToDateProfit) < 0.005}
                    value={formatMoney(
                      data.monthToDateProfit,
                      data.currency,
                      locale,
                    )}
                  />
                </Div>
                {data.openReceivables === 0 &&
                  data.approvedPayables === 0 &&
                  data.cashBalance === 0 &&
                  data.monthToDateProfit === 0 && (
                    <Span className="text-sm text-muted-foreground">
                      {t("dashboard.widget.zeroMetricsHint")}
                    </Span>
                  )}
              </Div>
            )}

          {data.currentPeriodName && (
            <Div className="flex flex-wrap items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
              <Span className="text-muted-foreground">
                {t("dashboard.widget.currentPeriod")}
              </Span>
              <Span className="font-medium">{data.currentPeriodName}</Span>
              {data.currentPeriodStartDate && data.currentPeriodEndDate && (
                <Span className="text-xs text-muted-foreground">
                  {`${formatDocDate(data.currentPeriodStartDate, locale)} – ${formatDocDate(data.currentPeriodEndDate, locale)}`}
                </Span>
              )}
            </Div>
          )}

          {(!data.currentPeriodName ||
            !data.hasSetup ||
            data.draftEntryCount > 0) && (
            <SectionGroup title={t("dashboard.widget.needsAttention")}>
              <Div className="divide-y rounded-md border bg-card">
                {!data.currentPeriodName && (
                  <Div className="flex flex-wrap items-center justify-between gap-2 p-3">
                    <Div className="flex flex-col gap-1">
                      <Span className="text-sm font-medium">
                        {t("dashboard.widget.noPeriod")}
                      </Span>
                      <Span className="text-sm text-muted-foreground">
                        {t("dashboard.widget.noPeriodHint")}
                      </Span>
                    </Div>
                    {canConfigure && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleNavCreatePeriod}
                      >
                        {t("dashboard.widget.createPeriod")}
                      </Button>
                    )}
                  </Div>
                )}
                {!data.hasSetup && (
                  <Div className="flex flex-wrap items-center justify-between gap-2 p-3">
                    <StatusPill
                      status={t("dashboard.widget.notSetUp")}
                      variant="warning"
                    />
                    {canConfigure && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleNavSetup}
                      >
                        {t("dashboard.widget.runSetup")}
                      </Button>
                    )}
                  </Div>
                )}
                {data.draftEntryCount > 0 && (
                  <Div className="flex flex-wrap items-center justify-between gap-2 p-3">
                    <Span className="text-sm">
                      {`${t("dashboard.widget.draftEntries")} ${data.draftEntryCount}`}
                    </Span>
                    {interactive && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleDrafts}
                      >
                        {t("dashboard.widget.viewDrafts")}
                      </Button>
                    )}
                  </Div>
                )}
              </Div>
            </SectionGroup>
          )}

          {/* Quick navigation */}
          {isInteractive && (
            <Div className="flex flex-col gap-3">
              <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("dashboard.widget.navTitle")}
              </Span>
              <Div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                <NavCard
                  label={t("dashboard.widget.chartOfAccounts")}
                  iconKey="accounts"
                  onClick={handleNavAccountList}
                />
                <NavCard
                  label={t("dashboard.widget.journalEntries")}
                  iconKey="journal"
                  onClick={handleNavJournalList}
                />
                <NavCard
                  label={t("dashboard.widget.periods")}
                  iconKey="periods"
                  onClick={handleNavPeriodList}
                />
                <NavCard
                  label={t("dashboard.widget.balanceSheet")}
                  iconKey="balanceSheet"
                  onClick={handleNavBalanceSheet}
                />
                <NavCard
                  label={t("dashboard.widget.profitLoss")}
                  iconKey="profitLoss"
                  onClick={handleNavProfitLoss}
                />
                <NavCard
                  label={t("dashboard.widget.trialBalance")}
                  iconKey="trialBalance"
                  onClick={handleNavTrialBalance}
                />
                <NavCard
                  label={t("dashboard.widget.taxReport")}
                  iconKey="taxReport"
                  onClick={handleNavTaxReport}
                />
                <NavCard
                  label={t("dashboard.widget.companies")}
                  iconKey="companies"
                  onClick={handleNavCompanies}
                />
                <NavCard
                  label={t("dashboard.widget.invoices")}
                  iconKey="invoices"
                  onClick={handleNavInvoices}
                />
                <NavCard
                  label={t("dashboard.widget.bills")}
                  iconKey="bills"
                  onClick={handleNavBills}
                />
              </Div>
            </Div>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}
