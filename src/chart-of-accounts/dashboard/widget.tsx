"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";

interface AccountingDashboardWidgetProps {
  field: (typeof definition.GET)["fields"];
}

// Nav card icon names — plain strings used as data, not as i18n text
const NAV_ICONS = {
  accounts: "📒",
  journal: "✏️",
  periods: "📅",
  balanceSheet: "⚖️",
  profitLoss: "📈",
  trialBalance: "🧾",
  taxReport: "🏛️",
  companies: "🏢",
  invoices: "🧾",
  bills: "📄",
} as const;

// Separator used in period date range display — purely visual punctuation
const DATE_SEPARATOR = " \u2013 ";

function KpiCard({
  label,
  value,
  badge,
  badgeVariant,
  actionLabel,
  onAction,
}: {
  label: string;
  value: string | number;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  actionLabel?: string;
  onAction?: () => void;
}): JSX.Element {
  return (
    <Div className="rounded-md border p-4 flex flex-col gap-2 bg-card overflow-hidden">
      <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Span>
      <Div className="flex items-end justify-between gap-2 min-w-0">
        <Span
          className={`font-bold leading-tight break-words min-w-0 ${typeof value === "number" ? "text-2xl tabular-nums" : "text-base"}`}
        >
          {value}
        </Span>
        {badge !== undefined && (
          <Badge
            variant={badgeVariant ?? "secondary"}
            className="text-xs shrink-0"
          >
            {badge}
          </Badge>
        )}
      </Div>
      {actionLabel !== undefined && onAction !== undefined && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onAction}
          className="self-start -ml-2 h-auto py-1 text-xs"
        >
          {actionLabel}
        </Button>
      )}
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
      <Span className="text-lg" aria-hidden="true">
        {icon}
      </Span>
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
  const navigation = useWidgetNavigation();

  const handleNavGet = (
    importFn: () => Promise<{
      default: { GET: Parameters<typeof navigation.push>[0] };
    }>,
  ): (() => void) => {
    return (): void => {
      void (async (): Promise<void> => {
        const mod = await importFn();
        navigation.push(mod.default.GET, {});
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
        navigation.push(mod.default.POST, {});
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
    () => import("../reports/tax-report/definition"),
  );
  const handleNavSetup = handleNavPost(() => import("../setup/definition"));
  const handleNavCreatePeriod = handleNavPost(
    () => import("../period/create/definition"),
  );
  const handleNavCompanies = handleNavGet(
    () => import("@/companies/list/definition"),
  );
  const handleNavInvoices = handleNavGet(
    () => import("@/payment/invoice/list/definition"),
  );
  const handleNavBills = handleNavGet(
    () => import("@/payment/bill/list/definition"),
  );

  if (!data) {
    return (
      <Div className="py-10 text-center text-sm text-muted-foreground">
        {t("dashboard.widget.loading")}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-6">
      {data.accountCount !== undefined ? (
        <Div className="flex flex-col gap-6">
          {/* Period status bar */}
          <Div className="rounded-md border px-4 py-3 flex items-center justify-between gap-3 flex-wrap bg-card">
            <Div className="flex items-center gap-3">
              <Span className="text-sm font-semibold text-muted-foreground">
                {t("dashboard.widget.currentPeriod")}
              </Span>
              {data.currentPeriodName !== null &&
              data.currentPeriodName !== undefined ? (
                <Div className="flex items-center gap-2">
                  <Span className="text-sm font-medium">
                    {data.currentPeriodName}
                  </Span>
                  {data.currentPeriodStartDate !== null &&
                    data.currentPeriodStartDate !== undefined &&
                    data.currentPeriodEndDate !== null &&
                    data.currentPeriodEndDate !== undefined && (
                      <Span className="text-xs text-muted-foreground">
                        {`${data.currentPeriodStartDate}${DATE_SEPARATOR}${data.currentPeriodEndDate}`}
                      </Span>
                    )}
                  <Badge variant="default" className="text-xs">
                    {data.currentPeriodStatus ?? ""}
                  </Badge>
                </Div>
              ) : (
                <Span className="text-sm text-amber-600 font-medium">
                  {t("dashboard.widget.noPeriod")}
                </Span>
              )}
            </Div>
            {(data.currentPeriodName === null ||
              data.currentPeriodName === undefined) && (
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

          {/* KPI cards */}
          <Div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              label={t("dashboard.widget.totalAccounts")}
              value={data.accountCount}
              actionLabel={t("dashboard.widget.viewAccounts")}
              onAction={handleNavAccountList}
            />
            <KpiCard
              label={t("dashboard.widget.draftEntries")}
              value={data.draftEntryCount}
              badge={
                data.draftEntryCount > 0
                  ? String(data.draftEntryCount)
                  : undefined
              }
              badgeVariant={
                data.draftEntryCount > 0 ? "destructive" : undefined
              }
              actionLabel={t("dashboard.widget.viewDrafts")}
              onAction={handleNavJournalList}
            />
            <KpiCard
              label={t("dashboard.widget.postedThisMonth")}
              value={data.postedThisMonthCount}
            />
            <KpiCard
              label={t("dashboard.widget.setupStatus")}
              value={
                data.hasSetup
                  ? t("dashboard.widget.configured")
                  : t("dashboard.widget.notSetUp")
              }
              badgeVariant={data.hasSetup ? "default" : "secondary"}
              actionLabel={
                data.hasSetup ? undefined : t("dashboard.widget.runSetup")
              }
              onAction={data.hasSetup ? undefined : handleNavSetup}
            />
          </Div>

          {/* Quick navigation */}
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
        </Div>
      ) : (
        <Div className="text-center py-10 text-sm text-muted-foreground border border-dashed rounded-md">
          {t("dashboard.widget.noData")}
        </Div>
      )}
    </Div>
  );
}
