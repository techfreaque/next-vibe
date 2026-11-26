"use client";

import { AnalyticsSegmented } from "next-vibe/ui/components/analytics";
import { DatePicker } from "next-vibe/ui/components/date-picker";
import { Div } from "next-vibe/ui/components/div";
import { Label } from "next-vibe/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { useWidgetLocale } from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  pickerDateFromUtcDay,
  utcDayFromPickerDate,
} from "next-vibe/unified-ui/widgets/form-fields/date-field/calendar-date";
import { type JSX, type ReactNode, useId, useState } from "react";

import {
  type ChartOfAccountsTranslationKey,
  scopedTranslation,
} from "@/chart-of-accounts/i18n";

import {
  type ReportDateRange,
  reportDay,
  reportMonth,
  type ReportPeriodChoice,
  type ReportPeriodPreset,
  reportPeriodPresets,
  reportPeriodRange,
} from "./report-period";

const labels: Record<ReportPeriodChoice, ChartOfAccountsTranslationKey> = {
  thisMonth: "reports.widget.thisMonth",
  lastMonth: "reports.widget.previousMonth",
  thisQuarter: "reports.widget.thisQuarter",
  yearToDate: "reports.widget.yearToDate",
  lastYear: "reports.widget.lastYear",
  custom: "reports.widget.customPeriod",
};

const allChoices: readonly ReportPeriodChoice[] = [
  ...reportPeriodPresets,
  "custom",
];
const monthPresets: readonly ReportPeriodPreset[] = ["thisMonth", "lastMonth"];
const monthChoices: readonly ReportPeriodChoice[] = [...monthPresets, "custom"];

function PeriodButtons({
  choices = allChoices,
  value,
  onSelect,
}: {
  choices?: readonly ReportPeriodChoice[];
  value: ReportPeriodChoice;
  onSelect: (value: ReportPeriodChoice) => void;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(useWidgetLocale());
  return (
    <AnalyticsSegmented
      label={t("reports.widget.quickDates")}
      value={value}
      onSelect={onSelect}
      options={choices.map((choice) => ({
        value: choice,
        label: t(labels[choice]),
      }))}
    />
  );
}

function usePeriodChoice(
  fallback: ReportPeriodPreset,
  matches: (range: ReportDateRange, now: Date) => boolean,
  presets: readonly ReportPeriodPreset[] = reportPeriodPresets,
): {
  now: Date;
  selection: ReportPeriodChoice;
  select: (value: ReportPeriodChoice) => void;
} {
  const [now] = useState(() => new Date());
  const [explicit, select] = useState<ReportPeriodChoice>();
  const selection =
    explicit === "custom" ||
    (explicit && matches(reportPeriodRange(explicit, now), now))
      ? explicit
      : ([fallback, ...presets].find((preset) =>
          matches(reportPeriodRange(preset, now), now),
        ) ?? "custom");
  return { now, selection, select };
}

function ReportDateFilter({
  label,
  day,
  min,
  max,
  onChange,
}: {
  label: string;
  day?: string;
  min?: string;
  max?: string;
  onChange: (value: Date | undefined) => void;
}): JSX.Element {
  const id = useId();
  const locale = useWidgetLocale();
  return (
    <Div className="flex min-w-0 flex-col gap-1.5 @sm:w-44">
      <Label htmlFor={id}>{label}</Label>
      <DatePicker
        id={id}
        locale={locale}
        value={pickerDateFromUtcDay(day)}
        minDate={pickerDateFromUtcDay(min)}
        maxDate={pickerDateFromUtcDay(max)}
        onChange={(date) => onChange(utcDayFromPickerDate(date))}
      />
    </Div>
  );
}

export function ReportRangeControl({
  from,
  to,
  fromLabel,
  toLabel,
  defaultPreset = "thisMonth",
  customControl,
  onChange,
}: {
  from?: string;
  to?: string;
  fromLabel: string;
  toLabel: string;
  defaultPreset?: ReportPeriodPreset;
  customControl?: ReactNode;
  onChange: (range: ReportDateRange) => void;
}): JSX.Element {
  const { now, selection, select } = usePeriodChoice(
    defaultPreset,
    (range, today) => {
      const defaults = reportPeriodRange(defaultPreset, today);
      return (
        (from ?? reportDay(defaults.from)) === reportDay(range.from) &&
        (to ?? reportDay(defaults.to)) === reportDay(range.to)
      );
    },
  );
  const fallback = reportPeriodRange(defaultPreset, now);
  const start =
    utcDayFromPickerDate(pickerDateFromUtcDay(from)) ?? fallback.from;
  const end = utcDayFromPickerDate(pickerDateFromUtcDay(to)) ?? fallback.to;
  return (
    <Div className="flex min-w-0 flex-col gap-2">
      <PeriodButtons
        value={selection}
        onSelect={(choice) => {
          select(choice);
          if (choice !== "custom") {
            onChange(reportPeriodRange(choice, now));
          }
        }}
      />
      {selection === "custom" && (
        <Div className="flex flex-wrap gap-2">
          <ReportDateFilter
            label={fromLabel}
            day={reportDay(start)}
            max={reportDay(end)}
            onChange={(date) =>
              date && date <= end && onChange({ from: date, to: end })
            }
          />
          <ReportDateFilter
            label={toLabel}
            day={reportDay(end)}
            min={reportDay(start)}
            onChange={(date) =>
              date && date >= start && onChange({ from: start, to: date })
            }
          />
          {customControl}
        </Div>
      )}
    </Div>
  );
}

export function ReportAsOfControl({
  day,
  label,
  onChange,
}: {
  day?: string;
  label: string;
  onChange: (date: Date) => void;
}): JSX.Element {
  const { now, selection, select } = usePeriodChoice(
    "thisMonth",
    (range, today) => (day ?? reportDay(today)) === reportDay(range.to),
  );
  return (
    <Div className="flex min-w-0 flex-col gap-2">
      <PeriodButtons
        value={selection}
        onSelect={(choice) => {
          select(choice);
          if (choice !== "custom") {
            onChange(reportPeriodRange(choice, now).to);
          }
        }}
      />
      {selection === "custom" && (
        <ReportDateFilter
          label={label}
          day={day ?? reportDay(now)}
          onChange={(date) => date && onChange(date)}
        />
      )}
    </Div>
  );
}

export function ReportMonthControl({
  month,
  label,
  onChange,
}: {
  month?: string;
  label: string;
  onChange: (month: string) => void;
}): JSX.Element {
  const { now, selection, select } = usePeriodChoice(
    "thisMonth",
    (range, today) => (month ?? reportMonth(today)) === reportMonth(range.from),
    monthPresets,
  );
  return (
    <Div className="flex min-w-0 flex-col gap-2">
      <PeriodButtons
        choices={monthChoices}
        value={selection}
        onSelect={(choice) => {
          select(choice);
          if (choice !== "custom") {
            onChange(reportMonth(reportPeriodRange(choice, now).from));
          }
        }}
      />
      {selection === "custom" && (
        <MonthPicker month={month} label={label} onChange={onChange} />
      )}
    </Div>
  );
}

export function MonthPicker({
  month,
  label,
  onChange,
}: {
  month?: string;
  label: string;
  onChange: (month: string) => void;
}): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const monthId = useId();
  const yearId = useId();
  const [now] = useState(() => new Date());
  const currentMonth = month ?? reportMonth(now);
  const [year, number] = currentMonth.split("-");
  const currentYear = now.getUTCFullYear();
  const years = Array.from(Array.from({ length: 21 }).keys(), (index) =>
    String(currentYear + 2 - index),
  );
  const months = new Intl.DateTimeFormat(locale.replace(/-GLOBAL$/u, ""), {
    month: "long",
    timeZone: "UTC",
  });
  return (
    <Div className="flex flex-wrap gap-2">
      <Div className="flex min-w-36 flex-col gap-1.5">
        <Label htmlFor={monthId}>{label}</Label>
        <Select
          value={number}
          onValueChange={(value) => onChange(`${year}-${value}`)}
        >
          <SelectTrigger id={monthId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from(Array.from({ length: 12 }).keys(), (index) => (
              <SelectItem
                key={index}
                value={String(index + 1).padStart(2, "0")}
              >
                {months.format(new Date(Date.UTC(currentYear, index, 1)))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Div>
      <Div className="flex flex-col gap-1.5">
        <Label htmlFor={yearId}>{t("reports.widget.year")}</Label>
        <Select
          value={year}
          onValueChange={(value) => onChange(`${value}-${number}`)}
        >
          <SelectTrigger id={yearId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[...new Set([...years, year])]
              .toSorted()
              .toReversed()
              .map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </Div>
    </Div>
  );
}
