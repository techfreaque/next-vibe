"use client";

import { Button } from "next-vibe/ui/components/button";
import { DatePicker } from "next-vibe/ui/components/date-picker";
import { Div } from "next-vibe/ui/components/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "next-vibe/ui/components/dropdown-menu";
import { Label } from "next-vibe/ui/components/label";
import {
  useWidgetLocale,
  useWidgetNavigation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  pickerDateFromUtcDay,
  utcDayFromPickerDate,
} from "next-vibe/unified-ui/widgets/form-fields/date-field/calendar-date";
import type { JSX } from "react";

import { useWorkspaceCompany } from "@/companies/_shared/workspace-company-context";
import { DocumentScopePicker } from "@/finance/document-list-ui";

import {
  type ChartOfAccountsTranslationKey,
  scopedTranslation,
} from "../../i18n";

type ReportId =
  | "balanceSheet"
  | "profitLoss"
  | "trialBalance"
  | "taxReport"
  | "taxRates"
  | "receivables"
  | "payables";

const reports: readonly {
  id: ReportId;
  label: ChartOfAccountsTranslationKey;
  load: () => Promise<{
    default: {
      GET: Parameters<ReturnType<typeof useWidgetNavigation>["push"]>[0];
    };
  }>;
}[] = [
  {
    id: "balanceSheet",
    label: "reports.nav.balanceSheet",
    load: () => import("./definition"),
  },
  {
    id: "profitLoss",
    label: "reports.nav.profitLoss",
    load: () => import("../profit-loss/definition"),
  },
  {
    id: "trialBalance",
    label: "reports.nav.trialBalance",
    load: () => import("../trial-balance/definition"),
  },
  {
    id: "taxReport",
    label: "reports.nav.ledgerTax",
    load: () => import("../tax-report/definition"),
  },
  {
    id: "taxRates",
    label: "reports.nav.taxReport",
    load: () => import("@/tax/report/definition"),
  },
  {
    id: "receivables",
    label: "reports.nav.receivablesAging",
    load: () => import("../receivables-aging/definition"),
  },
  {
    id: "payables",
    label: "reports.nav.payables",
    load: () => import("../payables-aging/definition"),
  },
];

export function ReportMenu({
  current,
  companyId,
}: {
  current: ReportId;
  companyId?: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(useWidgetLocale());
  const navigation = useWidgetNavigation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          {t("reports.switchReport")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {reports
          .filter(({ id }) => id !== current)
          .map(({ id, label, load }) => (
            <DropdownMenuItem
              key={id}
              onSelect={() => {
                void load().then((mod) =>
                  navigation.push(mod.default.GET, {
                    data: { companyId },
                  }),
                );
              }}
            >
              {t(label)}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ReportCompanyPicker({
  selectedId,
  reportId,
  reportName,
  onChange,
}: {
  selectedId?: string;
  reportId?: string;
  reportName?: string;
  onChange: (id: string) => void;
}): JSX.Element | null {
  const workspace = useWorkspaceCompany();
  const value = selectedId || reportId;
  if (value && workspace?.active?.id === value) {
    return null;
  }
  return (
    <DocumentScopePicker
      kind="company"
      required
      value={value}
      appliedLabel={value === reportId ? reportName : undefined}
      onSelect={onChange}
    />
  );
}

export function ReportDateFilter({
  id,
  label,
  day,
  onChange,
}: {
  id: string;
  label: string;
  day?: string;
  onChange: (value: Date | undefined) => void;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-1.5 @sm:w-44">
      <Label htmlFor={id}>{label}</Label>
      <DatePicker
        name={id}
        value={pickerDateFromUtcDay(day)}
        onChange={(date) => onChange(utcDayFromPickerDate(date))}
      />
    </Div>
  );
}

export function ReportPeriodMenu({
  onChange,
}: {
  onChange: (range: { from: Date; to: Date }) => void;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(useWidgetLocale());
  function pickMonth(previous: boolean): void {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    onChange({
      from: new Date(Date.UTC(year, month - Number(previous), 1)),
      to: previous
        ? new Date(Date.UTC(year, month, 0))
        : new Date(Date.UTC(year, month, today.getUTCDate())),
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          {t("reports.widget.quickDates")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={() => pickMonth(false)}>
          {t("reports.widget.thisMonth")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => pickMonth(true)}>
          {t("reports.widget.previousMonth")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function reportAmountClass(value: number): string {
  return Math.abs(value) < 0.005
    ? "tabular-nums text-muted-foreground"
    : "tabular-nums text-foreground";
}
