/**
 * Locale-aware number / date formatting for analytics components
 * (shared by the web, CLI and native renderers).
 */

import type { CountryLanguage } from "../../core/i18n/core/config";
import type { AnalyticsBucket } from "./enum";

export type AnalyticsValueFormat =
  | "number"
  | "compact"
  | "percent"
  | "currency"
  | "credits"
  | "decimal"
  /** Milliseconds, rendered as ms / s / min / h. */
  | "duration"
  /** Signed relative change (ratio): 0.86 -> "+86%". */
  | "delta";

export interface AnalyticsFormatOptions {
  format?: AnalyticsValueFormat;
  /** ISO currency code for `currency` (default USD). */
  currency?: string;
  locale: CountryLanguage;
}

function intlLocale(locale: CountryLanguage): string {
  return locale;
}

/** Format a metric value. `percent` expects a ratio (0.25 = 25%). */
export function formatAnalyticsValue(
  value: number | null | undefined,
  { format = "number", currency = "USD", locale }: AnalyticsFormatOptions,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "–";
  }
  const loc = intlLocale(locale);
  switch (format) {
    case "percent":
      return new Intl.NumberFormat(loc, {
        style: "percent",
        maximumFractionDigits: Math.abs(value) < 0.1 ? 1 : 0,
        minimumFractionDigits: 0,
      }).format(value);
    case "currency":
      return new Intl.NumberFormat(loc, {
        style: "currency",
        currency,
        maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
      }).format(value);
    case "compact":
      return new Intl.NumberFormat(loc, {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value);
    case "credits":
      return new Intl.NumberFormat(loc, {
        maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 2,
      }).format(value);
    case "decimal":
      return new Intl.NumberFormat(loc, { maximumFractionDigits: 2 }).format(
        value,
      );
    case "duration":
      return formatDuration(value, locale);
    case "delta":
      return formatDelta(value, locale);
    default:
      return new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(
        value,
      );
  }
}

/** Milliseconds as a compact unit string ("850 ms", "3.7 s", "4.2 min", "1.5 h"). */
export function formatDuration(ms: number, locale: CountryLanguage): string {
  const abs = Math.abs(ms);
  const unit = (
    value: number,
    name: "millisecond" | "second" | "minute" | "hour" | "day",
  ): string =>
    new Intl.NumberFormat(intlLocale(locale), {
      style: "unit",
      unit: name,
      unitDisplay: "short",
      maximumFractionDigits: value >= 10 ? 0 : 1,
    }).format(value);
  if (abs < 1000) {
    return unit(ms, "millisecond");
  }
  if (abs < 60_000) {
    return unit(ms / 1000, "second");
  }
  if (abs < 3_600_000) {
    return unit(ms / 60_000, "minute");
  }
  if (abs < 86_400_000) {
    return unit(ms / 3_600_000, "hour");
  }
  return unit(ms / 86_400_000, "day");
}

/** Short axis label (always compact for big numbers). */
export function formatAxisValue(
  value: number,
  options: AnalyticsFormatOptions,
): string {
  if (options.format === "percent" || options.format === "duration") {
    return formatAnalyticsValue(value, options);
  }
  if (options.format === "currency") {
    return new Intl.NumberFormat(intlLocale(options.locale), {
      style: "currency",
      currency: options.currency ?? "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat(intlLocale(options.locale), {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Signed percent change label, e.g. "+12%" / "-3.4%". */
export function formatDelta(ratio: number, locale: CountryLanguage): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "percent",
    signDisplay: "exceptZero",
    maximumFractionDigits: Math.abs(ratio) < 0.1 ? 1 : 0,
  }).format(ratio);
}

function parseKey(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

/** Label for a bucket start key, e.g. "Nov 3", "Wk of Nov 3", "Nov 2026". */
export function formatBucketLabel(
  key: string,
  bucket: AnalyticsBucket,
  locale: CountryLanguage,
  style: "short" | "long" = "short",
): string {
  const date = parseKey(key);
  if (Number.isNaN(date.getTime())) {
    return key;
  }
  const loc = intlLocale(locale);
  if (bucket === "month") {
    return new Intl.DateTimeFormat(loc, {
      month: style === "long" ? "long" : "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }
  const dayLabel = new Intl.DateTimeFormat(loc, {
    month: "short",
    day: "numeric",
    year: style === "long" ? "numeric" : undefined,
    timeZone: "UTC",
  }).format(date);
  if (bucket === "week" && style === "long") {
    const end = new Date(date.getTime() + 6 * 86_400_000);
    const endLabel = new Intl.DateTimeFormat(loc, {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(end);
    return `${dayLabel.replace(/,? \d{4}$/, "")} – ${endLabel}`;
  }
  return dayLabel;
}

/** "Oct 23 – Nov 21, 2026" */
export function formatPeriod(
  from: string,
  to: string,
  locale: CountryLanguage,
): string {
  const loc = intlLocale(locale);
  const fmt = new Intl.DateTimeFormat(loc, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${fmt.format(parseKey(from))} – ${fmt.format(parseKey(to))}`;
}

/** Nice axis maximum and tick values (4 ticks incl. 0). */
export function niceTicks(max: number, count = 4, integer = false): number[] {
  if (max <= 0) {
    return [0, 1];
  }
  const raw = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const residual = raw / magnitude;
  let step: number;
  if (residual > 5) {
    step = 10 * magnitude;
  } else if (residual > 2) {
    step = 5 * magnitude;
  } else if (residual > 1) {
    step = 2 * magnitude;
  } else {
    step = magnitude;
  }
  if (integer && step < 1) {
    step = 1;
  }
  const ticks: number[] = [];
  for (let v = 0; v <= max + step * 0.0001; v += step) {
    ticks.push(Number(v.toPrecision(12)));
  }
  if ((ticks.at(-1) ?? 0) < max) {
    ticks.push(Number(((ticks.at(-1) ?? 0) + step).toPrecision(12)));
  }
  return ticks;
}

const SPARK_CHARS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

/** Unicode sparkline (CLI). Long series are averaged into `width` cells. */
export function sparkline(values: readonly number[], width = 48): string {
  if (values.length === 0) {
    return "";
  }
  const cells: number[] = [];
  if (values.length <= width) {
    cells.push(...values);
  } else {
    const per = values.length / width;
    for (let i = 0; i < width; i++) {
      const start = Math.floor(i * per);
      const end = Math.max(start + 1, Math.floor((i + 1) * per));
      let sum = 0;
      for (let j = start; j < end; j++) {
        sum += values[j] ?? 0;
      }
      cells.push(sum / (end - start));
    }
  }
  const max = Math.max(...cells);
  if (max <= 0) {
    return SPARK_CHARS[0].repeat(cells.length);
  }
  return cells
    .map((v) => SPARK_CHARS[Math.min(7, Math.round((v / max) * 7))])
    .join("");
}

/** Horizontal text bar (CLI share bars). */
export function textBar(ratio: number, width = 12): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  const full = Math.round(clamped * width);
  return "█".repeat(full) + "·".repeat(width - full);
}

/** Signed percentage-point number for ratio KPIs (0.31 vs 0.28 -> "+3"). */
export function formatPointsDelta(
  ratioDiff: number,
  locale: CountryLanguage,
): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    signDisplay: "exceptZero",
    maximumFractionDigits: Math.abs(ratioDiff) < 0.1 ? 1 : 0,
  }).format(ratioDiff * 100);
}

/**
 * Period-over-period change of a KPI: relative for counts and amounts,
 * percentage points for ratios (format "percent"). null = not comparable.
 */
export function kpiChange(
  value: number | null,
  previous: number | null | undefined,
  format: AnalyticsValueFormat | undefined,
): { kind: "relative" | "points"; amount: number } | null | undefined {
  if (previous === undefined || value === null) {
    return undefined;
  }
  if (previous === null) {
    return null;
  }
  if (format === "percent") {
    return { kind: "points", amount: value - previous };
  }
  if (previous === 0) {
    return value === 0 ? { kind: "relative", amount: 0 } : null;
  }
  return { kind: "relative", amount: (value - previous) / Math.abs(previous) };
}

/** Legend/period total of a series: explicit total, else aggregate (null = hidden). */
export function seriesTotal(series: {
  values: readonly number[];
  total?: number | null;
  /** sum (flows, default), last (stocks: MRR, active subs), avg (levels). */
  aggregate?: "sum" | "last" | "avg";
}): number | null {
  if (series.total !== undefined) {
    return series.total;
  }
  if (series.values.length === 0) {
    return 0;
  }
  if (series.aggregate === "last") {
    return series.values.at(-1) ?? 0;
  }
  const sum = series.values.reduce((a, b) => a + b, 0);
  return series.aggregate === "avg" ? sum / series.values.length : sum;
}
