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
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Label } from "next-vibe/ui/components/label";
import { canRetryRecordRead } from "next-vibe/unified-ui/_shared/admin-record-context";
import {
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  pickerDateFromUtcDay,
  utcDayFromPickerDate,
} from "next-vibe/unified-ui/widgets/form-fields/date-field/calendar-date";
import { type JSX, useId } from "react";

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

export function ReportReadState({
  hasCompany,
  companyPrompt,
  companyHint,
}: {
  hasCompany: boolean;
  companyPrompt: string;
  companyHint?: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(useWidgetLocale());
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  if (!hasCompany) {
    return (
      <EmptyBlock
        className="rounded-md border border-dashed"
        size={companyHint ? "page" : "compact"}
        title={companyPrompt}
        message={companyHint}
      />
    );
  }
  if (response?.success === false && !read?.isFetching && !read?.isLoading) {
    const transient = canRetryRecordRead(response.errorType.errorCode);
    return (
      <EmptyBlock
        size="page"
        className="rounded-md border bg-card"
        title={t("reports.widget.loadError")}
        message={transient ? undefined : response.message}
        action={
          transient && read
            ? {
                label: t("reports.widget.retry"),
                onClick: () => void read.refetch(),
              }
            : undefined
        }
      />
    );
  }
  return (
    <Div
      aria-live="polite"
      className="rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground"
    >
      {t("reports.widget.running")}
    </Div>
  );
}

export function ReportCompanyPicker({
  label,
  selectedId,
  reportId,
  reportName,
  onChange,
}: {
  label?: string;
  selectedId?: string;
  reportId?: string;
  reportName?: string;
  onChange: (id: string) => void;
}): JSX.Element | null {
  const workspace = useWorkspaceCompany();
  const id = useId();
  const value = selectedId || reportId;
  if (value && workspace?.active?.id === value) {
    return null;
  }
  const picker = (
    <DocumentScopePicker
      id={id}
      kind="company"
      required
      value={value}
      appliedLabel={value === reportId ? reportName : undefined}
      onSelect={onChange}
    />
  );
  return label ? (
    <Div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {picker}
    </Div>
  ) : (
    picker
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
