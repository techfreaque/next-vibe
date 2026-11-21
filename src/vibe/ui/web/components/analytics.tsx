"use client";

/**
 * Analytics components (web).
 *
 * KpiTile / KpiGrid, TimeSeriesChart, FunnelChart, BreakdownTable and
 * AnalyticsToolbar. Hand-built SVG + HTML: no chart runtime, identical SSR
 * markup, colors from the app's --chart-* tokens (light + dark), responsive via
 * percentage geometry and container queries (no measuring).
 *
 * CLI and native renderers live in ../../cli|native/components/analytics.tsx
 * with the same props.
 */

import type * as React from "react";
import { useState } from "react";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import { cn } from "../../../unified-ui/_shared/cn";
import {
  ANALYTICS_BUCKET_KEY,
  ANALYTICS_RANGE_SHORT_KEY,
  type AnalyticsBucket,
  AnalyticsGranularity,
  type AnalyticsGranularityValue,
  AnalyticsRange,
  type AnalyticsRangeValue,
} from "../../../unified-ui/analytics/enum";
import {
  type AnalyticsValueFormat,
  formatAnalyticsValue,
  formatAxisValue,
  formatBucketLabel,
  formatDelta,
  formatPeriod,
  formatPointsDelta,
  kpiChange,
  niceTicks,
  seriesTotal,
} from "../../../unified-ui/analytics/format";
import { scopedTranslation } from "../../../unified-ui/analytics/i18n";
import type { AnalyticsWindowEcho } from "../../../unified-ui/analytics/schema";
import type { StyleType } from "../utils/style-type";

const ARROW_DOWN = "\u2193";
const REFRESH_GLYPH = "\u21BB";
const REMOVE_GLYPH = "\u00D7";
const CHEVRON_GLYPH = "\u203A";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type AnalyticsTone =
  | "default"
  | "positive"
  | "negative"
  | "warning"
  | "muted";

/** Series color slot: 1-5 = --chart-N, or a semantic tone. */
export type AnalyticsColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | AnalyticsTone;

export const ANALYTICS_COLORS: Record<string, string> = {
  "1": "hsl(var(--chart-1))",
  "2": "hsl(var(--chart-2))",
  "3": "hsl(var(--chart-3))",
  "4": "hsl(var(--chart-4))",
  "5": "hsl(var(--chart-5))",
  "6": "hsl(var(--primary))",
  "7": "hsl(var(--muted-foreground) / 0.7)",
  "8": "hsl(var(--destructive))",
  default: "hsl(var(--chart-1))",
  positive: "hsl(var(--chart-2))",
  negative: "hsl(var(--destructive))",
  warning: "hsl(var(--chart-4))",
  muted: "hsl(var(--muted-foreground) / 0.55)",
};

export function analyticsColor(
  color: AnalyticsColor | undefined,
  index: number,
): string {
  if (color === undefined) {
    return ANALYTICS_COLORS[String((index % 8) + 1)];
  }
  return ANALYTICS_COLORS[String(color)];
}

// ---------------------------------------------------------------------------
// KPI
// ---------------------------------------------------------------------------

export type KpiTileProps = {
  label: string;
  value: number | null;
  /** Same metric in the previous window. Omit to hide the delta. */
  previous?: number | null;
  format?: AnalyticsValueFormat;
  currency?: string;
  locale: CountryLanguage;
  /** true when a decrease is good (costs, errors, churn). */
  invertDelta?: boolean;
  /** "neutral": show the change without good/bad colors (shares, mixes). */
  deltaTone?: "auto" | "neutral";
  /** Small muted line under the value (e.g. "12% of visits"). */
  hint?: string;
  /** Mini trend line (values per bucket). */
  sparkline?: readonly number[];
  tone?: AnalyticsTone;
  onClick?: () => void;
  /** CLI/MCP: tool alias behind the number (printed as "-> alias"). */
  drillHint?: string;
} & StyleType;

const toneText: Record<AnalyticsTone, string> = {
  default: "text-foreground",
  positive: "text-success",
  negative: "text-destructive",
  warning: "text-warning",
  muted: "text-muted-foreground",
};

function Sparkline({
  values,
  color,
}: {
  values: readonly number[];
  color: string;
}): React.JSX.Element | null {
  if (values.length < 2) {
    return null;
  }
  const max = Math.max(...values, 0);
  const n = values.length;
  const points = values
    .map((v, i) => {
      const x = (i / (n - 1)) * 100;
      const y = max > 0 ? 28 - (v / max) * 26 : 28;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className="h-8 w-full"
      aria-hidden="true"
    >
      <polygon points={`0,30 ${points} 100,30`} fill={color} opacity={0.12} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiTile({
  label,
  value,
  previous,
  format = "number",
  currency,
  locale,
  invertDelta = false,
  deltaTone = "auto",
  hint,
  sparkline,
  tone = "default",
  onClick,
  className,
  style,
}: KpiTileProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const delta = kpiChange(value, previous, format);
  const change =
    delta === undefined ? undefined : delta === null ? null : delta.amount;
  const deltaLabel =
    delta === undefined || delta === null
      ? ""
      : delta.kind === "points"
        ? t("analytics.chart.points", {
            value: formatPointsDelta(delta.amount, locale),
          })
        : formatDelta(delta.amount, locale);
  const vsText =
    previous === null || previous === undefined
      ? t("analytics.chart.vsPrevious")
      : t("analytics.chart.vsValue", {
          value: formatAnalyticsValue(previous, { format, currency, locale }),
        });
  const good =
    deltaTone === "neutral" ||
    change === undefined ||
    change === null ||
    change === 0
      ? null
      : invertDelta
        ? change < 0
        : change > 0;
  const content = (
    <>
      <span className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-muted-foreground">
          {label}
        </span>
        {onClick ? (
          <span
            className="text-xs text-muted-foreground/60 transition-colors group-hover:text-foreground"
            aria-hidden="true"
          >
            {CHEVRON_GLYPH}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          "text-2xl font-semibold tabular-nums tracking-tight leading-none",
          toneText[tone],
        )}
      >
        {formatAnalyticsValue(value, { format, currency, locale })}
      </span>
      {change !== undefined ? (
        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
          {change === null ? (
            <span className="text-muted-foreground">
              {t("analytics.chart.noPrevious")}
            </span>
          ) : (
            <>
              <span
                className={cn(
                  "inline-flex items-center rounded px-1.5 py-0.5 font-medium tabular-nums",
                  good === null
                    ? "bg-muted text-muted-foreground"
                    : good
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive",
                )}
              >
                {change > 0 ? "↑ " : change < 0 ? "↓ " : ""}
                {deltaLabel}
              </span>
              <span
                className="text-muted-foreground"
                title={t("analytics.chart.vsPrevious")}
              >
                {vsText}
              </span>
            </>
          )}
        </span>
      ) : null}
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
      {sparkline && sparkline.length > 1 ? (
        <span className="mt-auto block pt-1">
          <Sparkline
            values={sparkline}
            color={
              tone === "negative"
                ? ANALYTICS_COLORS.negative
                : ANALYTICS_COLORS["1"]
            }
          />
        </span>
      ) : null}
    </>
  );
  const base = cn(
    "flex min-w-0 flex-col gap-2 rounded-lg border bg-card px-4 py-3 text-start",
    className,
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={style}
        className={cn(
          base,
          "group transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {content}
      </button>
    );
  }
  return (
    <div className={base} style={style}>
      {content}
    </div>
  );
}
KpiTile.displayName = "KpiTile";

export type KpiGridProps = {
  children?: React.ReactNode;
  /** Max columns at full width. */
  columns?: 2 | 3 | 4 | 5 | 6;
} & StyleType;

const kpiGridCols: Record<NonNullable<KpiGridProps["columns"]>, string> = {
  2: "@md:grid-cols-2",
  3: "@md:grid-cols-3",
  4: "@md:grid-cols-2 @3xl:grid-cols-4",
  5: "@md:grid-cols-3 @4xl:grid-cols-5",
  6: "@md:grid-cols-3 @4xl:grid-cols-6",
};

export function KpiGrid({
  children,
  columns = 4,
  className,
  style,
}: KpiGridProps): React.JSX.Element {
  return (
    <div className="@container w-full" style={style}>
      <div
        className={cn(
          "grid grid-cols-2 gap-3",
          kpiGridCols[columns],
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
KpiGrid.displayName = "KpiGrid";

// ---------------------------------------------------------------------------
// Time series
// ---------------------------------------------------------------------------

export interface TimeSeriesChartSeries {
  key: string;
  label: string;
  values: readonly number[];
  color?: AnalyticsColor;
  /**
   * Period total shown in the legend. Default: sum of the buckets. Pass the
   * true value for distinct counts (active users) or null to hide it.
   */
  total?: number | null;
  /** How the legend total aggregates buckets: sum (default), last, avg. */
  aggregate?: "sum" | "last" | "avg";
}

export type TimeSeriesVariant =
  | "line"
  | "area"
  | "bar"
  | "stacked-bar"
  | "stacked-area";

export type TimeSeriesChartProps = {
  title?: string;
  subtitle?: string;
  buckets: readonly string[];
  bucket: AnalyticsBucket;
  series: readonly TimeSeriesChartSeries[];
  variant?: TimeSeriesVariant;
  format?: AnalyticsValueFormat;
  currency?: string;
  locale: CountryLanguage;
  height?: number;
  /** Click a bucket (drill-down). Receives the bucket start key. */
  onBucketClick?: (bucketKey: string) => void;
  /** Header actions (e.g. "Open list"). */
  actions?: React.ReactNode;
  emptyLabel?: string;
  /** CLI: print the recent-buckets table under the sparklines (default true). */
  cliTable?: boolean;
  /** CLI/MCP: tool alias behind the chart (printed as "-> alias"). */
  drillHint?: string;
} & StyleType;

function isStacked(variant: TimeSeriesVariant): boolean {
  return variant === "stacked-bar" || variant === "stacked-area";
}

export function TimeSeriesChart({
  title,
  subtitle,
  buckets,
  bucket,
  series,
  variant = "area",
  format = "number",
  currency,
  locale,
  height = 220,
  onBucketClick,
  actions,
  emptyLabel,
  className,
  style,
}: TimeSeriesChartProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [hidden, setHidden] = useState<readonly string[]>([]);
  const [hover, setHover] = useState<number | null>(null);

  const visible = series.filter((s) => !hidden.includes(s.key));
  const n = buckets.length;
  const stacked = isStacked(variant);
  const indices = [...buckets.keys()];
  const totals = indices.map((i) =>
    visible.reduce((sum, s) => sum + (s.values[i] ?? 0), 0),
  );
  const rawMax = stacked
    ? Math.max(0, ...totals)
    : Math.max(0, ...visible.flatMap((s) => s.values.slice(0, n)));
  const ticks = niceTicks(
    rawMax,
    4,
    format === "number" || format === "compact",
  );
  const max = ticks.at(-1) ?? 1;
  const allZero = series.every((s) => s.values.every((v) => v === 0));
  const fmt = { format, currency, locale };
  const y = (v: number): number => 100 - (v / max) * 100;

  // X labels: at most ~7 evenly spaced, alternate ones hidden on narrow panes.
  const labelEvery = Math.max(1, Math.ceil(n / 7));
  const xLabels = buckets
    .map((key, i) => ({ key, i }))
    .filter(({ i }) => i % labelEvery === 0);

  const cumulative: number[] = indices.map(() => 0);
  const shapes: React.JSX.Element[] = [];
  visible.forEach((s, sIndex) => {
    const color = analyticsColor(
      s.color,
      series.findIndex((x) => x.key === s.key),
    );
    if (variant === "bar" || variant === "stacked-bar") {
      const groupWidth = 0.72;
      const barWidth =
        variant === "bar"
          ? groupWidth / Math.max(1, visible.length)
          : groupWidth;
      indices.forEach((i) => {
        const v = s.values[i] ?? 0;
        if (v <= 0) {
          return;
        }
        const base = variant === "stacked-bar" ? cumulative[i] : 0;
        const x =
          i +
          (1 - groupWidth) / 2 +
          (variant === "bar" ? sIndex * barWidth : 0);
        shapes.push(
          <rect
            key={`${s.key}-${i}`}
            x={x}
            width={barWidth}
            y={y(base + v)}
            height={Math.max(0, y(base) - y(base + v))}
            fill={color}
            opacity={hover === null || hover === i ? 1 : 0.55}
          />,
        );
        if (variant === "stacked-bar") {
          cumulative[i] += v;
        }
      });
      return;
    }
    const tops = indices.map((i) => {
      const v = s.values[i] ?? 0;
      return stacked ? cumulative[i] + v : v;
    });
    const bases = indices.map((i) => (stacked ? cumulative[i] : 0));
    const line = tops
      .map((v, i) => `${(i + 0.5).toFixed(3)},${y(v).toFixed(3)}`)
      .join(" ");
    if (variant === "area" || variant === "stacked-area") {
      const back = bases
        .map((v, i) => `${(i + 0.5).toFixed(3)},${y(v).toFixed(3)}`)
        .toReversed()
        .join(" ");
      shapes.push(
        <polygon
          key={`${s.key}-area`}
          points={`${line} ${back}`}
          fill={color}
          opacity={stacked ? 0.35 : 0.12}
        />,
      );
    }
    shapes.push(
      <polyline
        key={`${s.key}-line`}
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />,
    );
    if (stacked) {
      tops.forEach((v, i) => {
        cumulative[i] = v;
      });
    }
  });

  const hoverIndex = hover !== null && hover < n ? hover : null;

  return (
    <div
      className={cn(
        "@container flex min-w-0 flex-col rounded-lg border bg-card",
        className,
      )}
      style={style}
    >
      {title || actions ? (
        <div className="flex flex-wrap items-start justify-between gap-2 px-4 pt-3">
          <div className="flex min-w-0 flex-col">
            {title ? (
              <span className="text-sm font-semibold">{title}</span>
            ) : null}
            {subtitle ? (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            ) : null}
          </div>
          {actions ? (
            <div className="flex items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}

      {/* Legend with period totals; click toggles a series */}
      {series.length > 1 || title ? (
        <div className="flex flex-wrap gap-x-3 gap-y-1 px-4 pt-2">
          {series.map((s, index) => {
            const off = hidden.includes(s.key);
            const total = seriesTotal(s);
            return (
              <button
                key={s.key}
                type="button"
                aria-pressed={!off}
                onClick={() =>
                  setHidden((prev) =>
                    prev.includes(s.key)
                      ? prev.filter((k) => k !== s.key)
                      : [...prev, s.key],
                  )
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-xs transition-opacity hover:bg-accent/50",
                  off && "opacity-40",
                )}
              >
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: analyticsColor(s.color, index) }}
                />
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-medium tabular-nums">
                  {total === null ||
                  ((format === "percent" || format === "duration") &&
                    s.total === undefined &&
                    (s.aggregate ?? "sum") === "sum")
                    ? null
                    : formatAnalyticsValue(total, fmt)}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {n === 0 || allZero ? (
        <div
          className="flex items-center justify-center px-4 text-sm text-muted-foreground"
          style={{ height }}
        >
          {emptyLabel ?? t("analytics.chart.empty")}
        </div>
      ) : (
        <div className="flex gap-2 px-2 pb-2 pt-3 @md:px-4">
          {/* Y axis */}
          <div
            className="relative w-9 shrink-0 text-[10px] tabular-nums text-muted-foreground @md:w-11"
            style={{ height }}
          >
            {ticks.map((tick) => (
              <span
                key={tick}
                className="absolute end-0 -translate-y-1/2 whitespace-nowrap"
                style={{ top: `${y(tick)}%` }}
              >
                {formatAxisValue(tick, fmt)}
              </span>
            ))}
          </div>
          <div className="relative min-w-0 flex-1">
            <div className="relative" style={{ height }}>
              {/* grid */}
              {ticks.map((tick) => (
                <div
                  key={tick}
                  className={cn(
                    "absolute inset-x-0 border-t",
                    tick === 0
                      ? "border-border"
                      : "border-border/40 border-dashed",
                  )}
                  style={{ top: `${y(tick)}%` }}
                />
              ))}
              <svg
                viewBox={`0 0 ${n} 100`}
                preserveAspectRatio="none"
                className="absolute inset-0 size-full overflow-visible"
                role="img"
                aria-label={title}
              >
                {shapes}
                {hoverIndex !== null ? (
                  <line
                    x1={hoverIndex + 0.5}
                    x2={hoverIndex + 0.5}
                    y1={0}
                    y2={100}
                    stroke="hsl(var(--foreground) / 0.25)"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
              </svg>
              {/* hover columns */}
              <div className="absolute inset-0 flex">
                {buckets.map((key, i) => (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      "h-full flex-1 focus-visible:bg-foreground/5 focus-visible:outline-none",
                      onBucketClick ? "cursor-pointer" : "cursor-default",
                    )}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    onClick={
                      onBucketClick ? () => onBucketClick(key) : undefined
                    }
                    tabIndex={onBucketClick ? 0 : -1}
                    aria-hidden={onBucketClick ? undefined : true}
                    aria-label={formatBucketLabel(key, bucket, locale, "long")}
                  />
                ))}
              </div>
              {hoverIndex !== null ? (
                <div
                  className="pointer-events-none absolute top-1 z-10 min-w-36 max-w-60 rounded-md border bg-popover px-2.5 py-2 text-xs text-popover-foreground shadow-md"
                  style={
                    hoverIndex < n / 2
                      ? { left: `calc(${((hoverIndex + 1) / n) * 100}% + 6px)` }
                      : {
                          right: `calc(${((n - hoverIndex) / n) * 100}% + 6px)`,
                        }
                  }
                >
                  <div className="mb-1 font-medium">
                    {formatBucketLabel(
                      buckets[hoverIndex],
                      bucket,
                      locale,
                      "long",
                    )}
                  </div>
                  {visible.map((s) => (
                    <div
                      key={s.key}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span
                          className="size-2 shrink-0 rounded-sm"
                          style={{
                            backgroundColor: analyticsColor(
                              s.color,
                              series.findIndex((x) => x.key === s.key),
                            ),
                          }}
                        />
                        <span className="truncate text-muted-foreground">
                          {s.label}
                        </span>
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatAnalyticsValue(s.values[hoverIndex] ?? 0, fmt)}
                      </span>
                    </div>
                  ))}
                  {stacked && visible.length > 1 ? (
                    <div className="mt-1 flex justify-between gap-3 border-t pt-1">
                      <span className="text-muted-foreground">
                        {t("analytics.chart.total")}
                      </span>
                      <span className="font-semibold tabular-nums">
                        {formatAnalyticsValue(totals[hoverIndex] ?? 0, fmt)}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
            {/* X axis */}
            <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
              {xLabels.map(({ key, i }, labelIndex) => (
                <span
                  key={key}
                  className={cn(
                    "absolute -translate-x-1/2 whitespace-nowrap",
                    labelIndex % 2 === 1 && "hidden @lg:inline",
                  )}
                  style={{ left: `${((i + 0.5) / n) * 100}%` }}
                >
                  {formatBucketLabel(key, bucket, locale)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
TimeSeriesChart.displayName = "TimeSeriesChart";

// ---------------------------------------------------------------------------
// Funnel
// ---------------------------------------------------------------------------

export interface FunnelChartStep {
  key: string;
  label: string;
  value: number;
  /** Optional muted note under the label. */
  hint?: string;
  onClick?: () => void;
}

export type FunnelChartProps = {
  title?: string;
  subtitle?: string;
  steps: readonly FunnelChartStep[];
  locale: CountryLanguage;
  actions?: React.ReactNode;
} & StyleType;

export function FunnelChart({
  title,
  subtitle,
  steps,
  locale,
  actions,
  className,
  style,
}: FunnelChartProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const first = steps[0]?.value ?? 0;
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col rounded-lg border bg-card",
        className,
      )}
      style={style}
    >
      {title || actions ? (
        <div className="flex flex-wrap items-start justify-between gap-2 border-b px-4 py-3">
          <div className="flex min-w-0 flex-col">
            {title ? (
              <span className="text-sm font-semibold">{title}</span>
            ) : null}
            {subtitle ? (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            ) : null}
          </div>
          {actions}
        </div>
      ) : null}
      <ol className="flex flex-col gap-0 px-4 py-3">
        {steps.map((step, index) => {
          const prev = index > 0 ? steps[index - 1].value : null;
          const ofFirst = first > 0 ? step.value / first : 0;
          const ofPrev = prev !== null && prev > 0 ? step.value / prev : null;
          const row = (
            <>
              <span className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-sm">
                  {step.label}
                  {step.hint ? (
                    <span className="ms-2 text-xs text-muted-foreground">
                      {step.hint}
                    </span>
                  ) : null}
                </span>
                <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
                  <span className="text-sm font-semibold">
                    {formatAnalyticsValue(step.value, { locale })}
                  </span>
                  <span className="w-12 text-end text-xs text-muted-foreground">
                    {index < 2
                      ? ""
                      : formatAnalyticsValue(ofFirst, {
                          format: "percent",
                          locale,
                        })}
                  </span>
                </span>
              </span>
              <span className="mt-1 block h-2.5 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${Math.max(step.value > 0 ? 1 : 0, ofFirst * 100)}%`,
                    backgroundColor: analyticsColor(undefined, 0),
                    opacity: 1 - index * 0.1,
                  }}
                />
              </span>
            </>
          );
          return (
            <li key={step.key} className="flex flex-col">
              {ofPrev !== null ? (
                <span className="flex items-center gap-1.5 py-1 ps-2 text-xs text-muted-foreground">
                  <span aria-hidden="true">{ARROW_DOWN}</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatAnalyticsValue(ofPrev, {
                      format: "percent",
                      locale,
                    })}
                  </span>
                  <span>{t("analytics.chart.ofPrevious")}</span>
                </span>
              ) : null}
              {step.onClick ? (
                <button
                  type="button"
                  onClick={step.onClick}
                  className="-mx-2 flex flex-col rounded-md px-2 py-1 text-start transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {row}
                </button>
              ) : (
                <span className="flex flex-col py-1">{row}</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
FunnelChart.displayName = "FunnelChart";

// ---------------------------------------------------------------------------
// Breakdown table
// ---------------------------------------------------------------------------

export interface BreakdownColumn {
  key: string;
  label: string;
  format?: AnalyticsValueFormat;
  currency?: string;
  /** Hide below the medium container width (secondary metric). */
  secondary?: boolean;
  /** Hide only on narrow panes (phone, sidebars); kept at medium width. */
  hideOnNarrow?: boolean;
  /** Render negative values in the destructive color (e.g. over-committed). */
  negativeTone?: boolean;
}

export interface BreakdownTableRow {
  id: string;
  label: string;
  sublabel?: string;
  values: Readonly<Record<string, number | null>>;
  /** Badge or icon before the label. */
  marker?: React.ReactNode;
  onClick?: () => void;
}

export type BreakdownTableProps = {
  title?: string;
  subtitle?: string;
  /** Header label of the dimension column. */
  dimensionLabel: string;
  columns: readonly BreakdownColumn[];
  rows: readonly BreakdownTableRow[];
  /** Column whose share drives the inline bar (default: first column). */
  shareKey?: string;
  /** Rows shown before "Show all" (default 10). */
  limit?: number;
  /** Share column + inline bar (default true; off for plain record lists). */
  showShare?: boolean;
  /** Header of the share column (default "Share"), e.g. "Revenue share". */
  shareLabel?: string;
  /** Muted line under the rows (e.g. how the rows reconcile with a total). */
  footer?: string;
  /** CLI/MCP: tool alias behind the table (printed as "-> alias"). */
  drillHint?: string;
  locale: CountryLanguage;
  actions?: React.ReactNode;
  emptyLabel?: string;
} & StyleType;

function cellTone(
  col: BreakdownColumn,
  value: number | null | undefined,
): string | undefined {
  if (value === null || value === undefined || value === 0) {
    return undefined;
  }
  if (col.format === "delta") {
    return value > 0 ? "text-success" : "text-destructive";
  }
  if (col.negativeTone && value < 0) {
    return "text-destructive";
  }
  return undefined;
}

export function BreakdownTable({
  title,
  subtitle,
  dimensionLabel,
  columns,
  rows,
  shareKey,
  limit = 10,
  showShare = true,
  shareLabel,
  footer,
  locale,
  actions,
  emptyLabel,
  className,
  style,
}: BreakdownTableProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [expanded, setExpanded] = useState(false);
  const share = shareKey ?? columns[0]?.key ?? "";
  const shareTotal = rows.reduce((sum, r) => sum + (r.values[share] ?? 0), 0);
  const shown = expanded ? rows : rows.slice(0, limit);

  return (
    <div
      className={cn(
        "@container flex min-w-0 flex-col rounded-lg border bg-card",
        className,
      )}
      style={style}
    >
      {title || actions ? (
        <div className="flex flex-wrap items-start justify-between gap-2 border-b px-4 py-3">
          <div className="flex min-w-0 flex-col">
            {title ? (
              <span className="text-sm font-semibold">{title}</span>
            ) : null}
            {subtitle ? (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            ) : null}
          </div>
          {actions}
        </div>
      ) : null}
      {rows.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          {emptyLabel ?? t("analytics.chart.empty")}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="px-4 py-2 text-start font-medium">
                  {dimensionLabel}
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "whitespace-nowrap px-3 py-2 text-end font-medium",
                      col.secondary && "hidden @xl:table-cell",
                      col.hideOnNarrow && "hidden @md:table-cell",
                    )}
                  >
                    {col.label}
                  </th>
                ))}
                {showShare ? (
                  <th className="hidden px-3 py-2 text-end font-medium @sm:table-cell">
                    {shareLabel ?? t("analytics.chart.share")}
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => {
                const ratio =
                  shareTotal > 0 ? (row.values[share] ?? 0) / shareTotal : 0;
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b last:border-b-0",
                      row.onClick &&
                        "cursor-pointer transition-colors hover:bg-accent/40 focus-within:bg-accent/40",
                    )}
                    onClick={row.onClick}
                  >
                    <td className="relative min-w-32 max-w-48 px-4 py-2 @md:max-w-none">
                      <span className="relative flex min-w-0 items-center gap-2">
                        {row.marker}
                        <span className="flex min-w-0 flex-col">
                          {row.onClick ? (
                            <button
                              type="button"
                              className="min-w-0 truncate text-start hover:underline focus-visible:outline-none focus-visible:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                row.onClick?.();
                              }}
                            >
                              {row.label}
                            </button>
                          ) : (
                            <span className="min-w-0 truncate">
                              {row.label}
                            </span>
                          )}
                          {row.sublabel ? (
                            <span className="min-w-0 truncate text-xs text-muted-foreground">
                              {row.sublabel}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "whitespace-nowrap px-3 py-2 text-end tabular-nums",
                          col.key === share && "font-medium",
                          col.secondary && "hidden @xl:table-cell",
                          col.hideOnNarrow && "hidden @md:table-cell",
                          cellTone(col, row.values[col.key]),
                        )}
                      >
                        {formatAnalyticsValue(row.values[col.key], {
                          format: col.format,
                          currency: col.currency,
                          locale,
                        })}
                      </td>
                    ))}
                    {showShare ? (
                      <td className="hidden whitespace-nowrap px-3 py-2 text-end text-xs tabular-nums text-muted-foreground @sm:table-cell">
                        <span className="inline-flex items-center justify-end gap-2">
                          <span
                            className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-muted @2xl:inline-block"
                            aria-hidden="true"
                          >
                            <span
                              className="block h-full rounded-full bg-chart-1"
                              style={{ width: `${(ratio * 100).toFixed(1)}%` }}
                            />
                          </span>
                          {formatAnalyticsValue(ratio, {
                            format: "percent",
                            locale,
                          })}
                        </span>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {footer ? (
        <div className="border-t px-4 py-2 text-xs text-muted-foreground">
          {footer}
        </div>
      ) : null}
      {rows.length > limit ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="border-t px-4 py-2 text-start text-xs text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
        >
          {expanded
            ? t("analytics.chart.showLess")
            : `${t("analytics.chart.showAll")} (${rows.length})`}
        </button>
      ) : null}
    </div>
  );
}
BreakdownTable.displayName = "BreakdownTable";

// ---------------------------------------------------------------------------
// Toolbar: period presets, custom dates, granularity, active filters
// ---------------------------------------------------------------------------

export interface AnalyticsWindowValue {
  range?: AnalyticsRangeValue;
  granularity?: AnalyticsGranularityValue;
  from?: string;
  to?: string;
}

export interface AnalyticsFilterChip {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export type AnalyticsToolbarProps = {
  locale: CountryLanguage;
  value: AnalyticsWindowValue;
  onChange: (patch: AnalyticsWindowValue) => void;
  /** Resolved window from the last response (labels the period). */
  period?: AnalyticsWindowEcho | null;
  onRefresh?: () => void;
  isLoading?: boolean;
  filters?: readonly AnalyticsFilterChip[];
  onClearFilters?: () => void;
  /** Extra controls (domain filters) rendered after the presets. */
  children?: React.ReactNode;
  /** Hide the granularity switch (reports without charts). */
  hideGranularity?: boolean;
} & StyleType;

const RANGE_PRESETS = [
  AnalyticsRange.LAST_7_DAYS,
  AnalyticsRange.LAST_30_DAYS,
  AnalyticsRange.LAST_90_DAYS,
  AnalyticsRange.LAST_6_MONTHS,
  AnalyticsRange.LAST_12_MONTHS,
  AnalyticsRange.ALL_TIME,
  AnalyticsRange.CUSTOM,
] as const;

const GRANULARITIES = [
  AnalyticsGranularity.AUTO,
  AnalyticsGranularity.DAY,
  AnalyticsGranularity.WEEK,
  AnalyticsGranularity.MONTH,
] as const;

export interface AnalyticsSegmentedProps<TValue extends string> {
  options: ReadonlyArray<{ value: TValue; label: string; title?: string }>;
  value: TValue;
  onSelect: (value: TValue) => void;
  /** Accessible group label (CLI prints it before the active option). */
  label: string;
}

/** Segmented control matching the toolbar presets (for domain filters). */
export function AnalyticsSegmented<TValue extends string>({
  options,
  value,
  onSelect,
  label,
}: AnalyticsSegmentedProps<TValue>): React.JSX.Element {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex max-w-full overflow-x-auto rounded-md border bg-muted/40 p-0.5"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          title={option.title}
          onClick={() => onSelect(option.value)}
          className={cn(
            "whitespace-nowrap rounded px-2.5 py-1 text-xs font-medium transition-colors",
            option.value === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function AnalyticsToolbar({
  locale,
  value,
  onChange,
  period,
  onRefresh,
  isLoading = false,
  filters,
  onClearFilters,
  children,
  hideGranularity = false,
  className,
  style,
}: AnalyticsToolbarProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const range = value.range ?? AnalyticsRange.LAST_30_DAYS;
  const granularity = value.granularity ?? AnalyticsGranularity.AUTO;

  return (
    <div className={cn("flex flex-col gap-2", className)} style={style}>
      <div className="flex flex-wrap items-center gap-2">
        <AnalyticsSegmented
          label={t("analytics.range.label")}
          value={range}
          onSelect={(next) => onChange({ range: next })}
          options={RANGE_PRESETS.map((preset) => ({
            value: preset,
            label: t(ANALYTICS_RANGE_SHORT_KEY[preset]),
            title: t(preset),
          }))}
        />
        {!hideGranularity ? (
          <AnalyticsSegmented
            label={t("analytics.granularity.label")}
            value={granularity}
            onSelect={(next) => onChange({ granularity: next })}
            options={GRANULARITIES.map((g) => ({ value: g, label: t(g) }))}
          />
        ) : null}
        {children}
        <div className="ms-auto flex items-center gap-2">
          {period ? (
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatPeriod(period.from, period.to, locale)}
              {period.previousFrom && period.previousTo
                ? ` (${t("analytics.chart.comparedTo", {
                    period: formatPeriod(
                      period.previousFrom,
                      period.previousTo,
                      locale,
                    ),
                  })})`
                : ""}
              {hideGranularity
                ? ""
                : ` · ${t("analytics.chart.byGranularity", {
                    granularity: t(
                      ANALYTICS_BUCKET_KEY[period.bucket],
                    ).toLowerCase(),
                  })}`}
            </span>
          ) : null}
          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              aria-label={t("analytics.chart.refresh")}
              title={t("analytics.chart.refresh")}
              className="inline-flex size-7 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
            >
              <span
                className={cn(
                  "text-sm leading-none",
                  isLoading && "animate-spin",
                )}
                aria-hidden="true"
              >
                {REFRESH_GLYPH}
              </span>
            </button>
          ) : null}
        </div>
      </div>
      {range === AnalyticsRange.CUSTOM ? (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <label className="flex items-center gap-1.5">
            <span className="text-muted-foreground">
              {t("analytics.from.label")}
            </span>
            <input
              type="date"
              value={value.from ?? ""}
              max={value.to}
              onChange={(e) => onChange({ from: e.target.value || undefined })}
              className="h-7 rounded-md border bg-background px-2 text-xs"
            />
          </label>
          <label className="flex items-center gap-1.5">
            <span className="text-muted-foreground">
              {t("analytics.to.label")}
            </span>
            <input
              type="date"
              value={value.to ?? ""}
              min={value.from}
              onChange={(e) => onChange({ to: e.target.value || undefined })}
              className="h-7 rounded-md border bg-background px-2 text-xs"
            />
          </label>
        </div>
      ) : null}
      {filters && filters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">
            {t("analytics.chart.filters")}
          </span>
          {filters.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex max-w-full items-center gap-1 rounded-full border bg-muted/50 py-0.5 ps-2.5 pe-1 text-xs"
            >
              <span className="text-muted-foreground">{chip.label}</span>
              <span className="truncate font-medium">{chip.value}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`${chip.label} ${chip.value}`}
                className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {REMOVE_GLYPH}
              </button>
            </span>
          ))}
          {onClearFilters && filters.length > 1 ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              {t("analytics.chart.clearFilters")}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
AnalyticsToolbar.displayName = "AnalyticsToolbar";
