/**
 * Analytics components (native).
 *
 * Same props as the web renderer. Charts are drawn with Views (bars) so they
 * need no SVG runtime; lines/areas render as columns per bucket.
 */

import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import {
  ANALYTICS_RANGE_SHORT_KEY,
  AnalyticsGranularity,
  AnalyticsRange,
} from "../../../unified-ui/analytics/enum";
import {
  formatAnalyticsValue,
  formatBucketLabel,
  formatDelta,
  formatPeriod,
  formatPointsDelta,
  kpiChange,
} from "../../../unified-ui/analytics/format";
import { scopedTranslation } from "../../../unified-ui/analytics/i18n";
import type {
  AnalyticsSegmentedProps,
  AnalyticsToolbarProps,
  BreakdownTableProps,
  FunnelChartProps,
  KpiGridProps,
  KpiTileProps,
  TimeSeriesChartProps,
} from "../../web/components/analytics";
import { styledNative } from "../utils/style-converter";
import { Text } from "./text";

export type {
  AnalyticsColor,
  AnalyticsFilterChip,
  AnalyticsSegmentedProps,
  AnalyticsTone,
  AnalyticsToolbarProps,
  AnalyticsWindowValue,
  BreakdownColumn,
  BreakdownTableProps,
  BreakdownTableRow,
  FunnelChartProps,
  FunnelChartStep,
  KpiGridProps,
  KpiTileProps,
  TimeSeriesChartProps,
  TimeSeriesChartSeries,
  TimeSeriesVariant,
} from "../../web/components/analytics";

const StyledView = styledNative(View);
const StyledPressable = styledNative(Pressable);
const StyledScrollView = styledNative(ScrollView);

/** Native has no CSS variables: fixed palette matching the chart tokens. */
const NATIVE_PALETTE = [
  "#2f5bd9",
  "#1fa356",
  "#078aa8",
  "#f29d12",
  "#e8467c",
  "#6366f1",
  "#8b8f98",
  "#dc2626",
];

function colorAt(index: number): string {
  return NATIVE_PALETTE[index % NATIVE_PALETTE.length];
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
  onClick,
  className,
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
  return (
    <StyledPressable
      onPress={onClick}
      disabled={!onClick}
      className={cn(
        "flex-1 flex-col gap-1 rounded-lg border border-border bg-card px-4 py-3",
        className,
      )}
    >
      <Text className="text-xs text-muted-foreground">{label}</Text>
      <Text className="text-2xl font-semibold">
        {formatAnalyticsValue(value, { format, currency, locale })}
      </Text>
      {change !== undefined ? (
        <Text
          className={cn(
            "text-xs",
            good === null
              ? "text-muted-foreground"
              : good
                ? "text-success"
                : "text-destructive",
          )}
        >
          {change === null
            ? t("analytics.chart.noPrevious")
            : `${deltaLabel} ${vsText}`}
        </Text>
      ) : null}
      {hint ? (
        <Text className="text-xs text-muted-foreground">{hint}</Text>
      ) : null}
    </StyledPressable>
  );
}

export function KpiGrid({
  children,
  className,
}: KpiGridProps): React.JSX.Element {
  return (
    <StyledView className={cn("flex-row flex-wrap gap-3", className)}>
      {children}
    </StyledView>
  );
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
  height = 180,
  onBucketClick,
  emptyLabel,
  className,
}: TimeSeriesChartProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [selected, setSelected] = useState<number | null>(null);
  const stacked = variant === "stacked-bar" || variant === "stacked-area";
  const totals = [...buckets.keys()].map((i) =>
    series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0),
  );
  const max = stacked
    ? Math.max(1, ...totals)
    : Math.max(1, ...series.flatMap((s) => s.values));
  const empty = totals.every((v) => v === 0);
  const fmt = { format, currency, locale };
  const active = selected ?? buckets.length - 1;

  return (
    <StyledView
      className={cn(
        "flex-col gap-2 rounded-lg border border-border bg-card p-3",
        className,
      )}
    >
      {title ? <Text className="text-sm font-semibold">{title}</Text> : null}
      {subtitle ? (
        <Text className="text-xs text-muted-foreground">{subtitle}</Text>
      ) : null}
      {empty ? (
        <Text className="py-6 text-center text-sm text-muted-foreground">
          {emptyLabel ?? t("analytics.chart.empty")}
        </Text>
      ) : (
        <>
          <StyledView className="flex-row items-end gap-px" style={{ height }}>
            {buckets.map((key, i) => (
              <StyledPressable
                key={key}
                className="h-full flex-1 flex-col justify-end"
                onPress={() => {
                  setSelected(i);
                  onBucketClick?.(key);
                }}
              >
                {stacked ? (
                  series.map((s, sIndex) => (
                    <StyledView
                      key={s.key}
                      style={{
                        height: `${((s.values[i] ?? 0) / max) * 100}%`,
                        backgroundColor: colorAt(sIndex),
                        opacity: i === active ? 1 : 0.7,
                      }}
                    />
                  ))
                ) : (
                  <StyledView
                    style={{
                      height: `${((series[0]?.values[i] ?? 0) / max) * 100}%`,
                      backgroundColor: colorAt(0),
                      opacity: i === active ? 1 : 0.7,
                    }}
                  />
                )}
              </StyledPressable>
            ))}
          </StyledView>
          {buckets[active] ? (
            <StyledView className="flex-col gap-0.5">
              <Text className="text-xs font-medium">
                {formatBucketLabel(buckets[active], bucket, locale, "long")}
              </Text>
              {series.map((s, sIndex) => (
                <StyledView key={s.key} className="flex-row justify-between">
                  <Text className="text-xs" style={{ color: colorAt(sIndex) }}>
                    {s.label}
                  </Text>
                  <Text className="text-xs font-medium">
                    {formatAnalyticsValue(s.values[active] ?? 0, fmt)}
                  </Text>
                </StyledView>
              ))}
            </StyledView>
          ) : null}
        </>
      )}
    </StyledView>
  );
}

export function FunnelChart({
  title,
  steps,
  locale,
  className,
}: FunnelChartProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const first = steps[0]?.value ?? 0;
  return (
    <StyledView
      className={cn(
        "flex-col gap-2 rounded-lg border border-border bg-card p-3",
        className,
      )}
    >
      {title ? <Text className="text-sm font-semibold">{title}</Text> : null}
      {steps.map((step, index) => {
        const prev = index > 0 ? steps[index - 1].value : null;
        const ofFirst = first > 0 ? step.value / first : 0;
        const ofPrev = prev !== null && prev > 0 ? step.value / prev : null;
        return (
          <StyledPressable
            key={step.key}
            onPress={step.onClick}
            disabled={!step.onClick}
            className="flex-col gap-1"
          >
            {ofPrev !== null ? (
              <Text className="text-xs text-muted-foreground">
                {`↓ ${formatAnalyticsValue(ofPrev, { format: "percent", locale })} ${t("analytics.chart.ofPrevious")}`}
              </Text>
            ) : null}
            <StyledView className="flex-row justify-between">
              <Text className="text-sm">{step.label}</Text>
              <Text className="text-sm font-semibold">
                {formatAnalyticsValue(step.value, { locale })}
              </Text>
            </StyledView>
            <StyledView className="h-2 overflow-hidden rounded-full bg-muted">
              <StyledView
                className="h-full rounded-full"
                style={{
                  width: `${ofFirst * 100}%`,
                  backgroundColor: colorAt(0),
                }}
              />
            </StyledView>
          </StyledPressable>
        );
      })}
    </StyledView>
  );
}

export function BreakdownTable({
  title,
  dimensionLabel,
  columns,
  rows,
  shareKey,
  limit = 10,
  locale,
  emptyLabel,
  className,
}: BreakdownTableProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [expanded, setExpanded] = useState(false);
  const share = shareKey ?? columns[0]?.key ?? "";
  const total = rows.reduce((sum, r) => sum + (r.values[share] ?? 0), 0);
  const shown = expanded ? rows : rows.slice(0, limit);
  return (
    <StyledView
      className={cn(
        "flex-col rounded-lg border border-border bg-card",
        className,
      )}
    >
      {title ? (
        <Text className="border-b border-border px-3 py-2 text-sm font-semibold">
          {title}
        </Text>
      ) : null}
      {rows.length === 0 ? (
        <Text className="px-3 py-6 text-center text-sm text-muted-foreground">
          {emptyLabel ?? t("analytics.chart.empty")}
        </Text>
      ) : (
        <StyledScrollView horizontal>
          <StyledView className="flex-col">
            <StyledView className="flex-row border-b border-border px-3 py-2">
              <Text className="w-40 text-xs text-muted-foreground">
                {dimensionLabel}
              </Text>
              {columns.map((col) => (
                <Text
                  key={col.key}
                  className="w-24 text-right text-xs text-muted-foreground"
                >
                  {col.label}
                </Text>
              ))}
            </StyledView>
            {shown.map((row) => {
              const ratio = total > 0 ? (row.values[share] ?? 0) / total : 0;
              return (
                <StyledPressable
                  key={row.id}
                  onPress={row.onClick}
                  disabled={!row.onClick}
                  className="flex-row border-b border-border px-3 py-2"
                >
                  <StyledView className="w-40 flex-col gap-1">
                    <Text className="text-sm" numberOfLines={1}>
                      {row.label}
                    </Text>
                    <StyledView
                      className="h-1 rounded-full"
                      style={{
                        width: `${ratio * 100}%`,
                        backgroundColor: colorAt(0),
                      }}
                    />
                  </StyledView>
                  {columns.map((col) => (
                    <Text key={col.key} className="w-24 text-right text-sm">
                      {formatAnalyticsValue(row.values[col.key], {
                        format: col.format,
                        currency: col.currency,
                        locale,
                      })}
                    </Text>
                  ))}
                </StyledPressable>
              );
            })}
          </StyledView>
        </StyledScrollView>
      )}
      {rows.length > limit ? (
        <StyledPressable
          onPress={() => setExpanded((v) => !v)}
          className="px-3 py-2"
        >
          <Text className="text-xs text-muted-foreground">
            {expanded
              ? t("analytics.chart.showLess")
              : `${t("analytics.chart.showAll")} (${rows.length})`}
          </Text>
        </StyledPressable>
      ) : null}
    </StyledView>
  );
}

export function AnalyticsSegmented<TValue extends string>({
  options,
  value,
  onSelect,
}: AnalyticsSegmentedProps<TValue>): React.JSX.Element {
  return (
    <StyledScrollView horizontal>
      <StyledView className="flex-row gap-1">
        {options.map((option) => (
          <StyledPressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            className={cn(
              "rounded-md border border-border px-2.5 py-1",
              option.value === value && "bg-muted",
            )}
          >
            <Text className="text-xs">{option.label}</Text>
          </StyledPressable>
        ))}
      </StyledView>
    </StyledScrollView>
  );
}

const RANGE_PRESETS = [
  AnalyticsRange.LAST_7_DAYS,
  AnalyticsRange.LAST_30_DAYS,
  AnalyticsRange.LAST_90_DAYS,
  AnalyticsRange.LAST_12_MONTHS,
  AnalyticsRange.ALL_TIME,
] as const;

const GRANULARITIES = [
  AnalyticsGranularity.AUTO,
  AnalyticsGranularity.DAY,
  AnalyticsGranularity.WEEK,
  AnalyticsGranularity.MONTH,
] as const;

export function AnalyticsToolbar({
  locale,
  value,
  onChange,
  period,
  filters,
  hideGranularity = false,
  className,
}: AnalyticsToolbarProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const range = value.range ?? AnalyticsRange.LAST_30_DAYS;
  const granularity = value.granularity ?? AnalyticsGranularity.AUTO;
  return (
    <StyledView className={cn("flex-col gap-2", className)}>
      <StyledScrollView horizontal>
        <StyledView className="flex-row gap-1">
          {RANGE_PRESETS.map((preset) => (
            <StyledPressable
              key={preset}
              onPress={() => onChange({ range: preset })}
              className={cn(
                "rounded-md border border-border px-2.5 py-1",
                preset === range && "bg-primary",
              )}
            >
              <Text
                className={cn(
                  "text-xs",
                  preset === range
                    ? "text-primary-foreground"
                    : "text-foreground",
                )}
              >
                {t(ANALYTICS_RANGE_SHORT_KEY[preset])}
              </Text>
            </StyledPressable>
          ))}
          {!hideGranularity
            ? GRANULARITIES.map((g) => (
                <StyledPressable
                  key={g}
                  onPress={() => onChange({ granularity: g })}
                  className={cn(
                    "rounded-md border border-border px-2.5 py-1",
                    g === granularity && "bg-muted",
                  )}
                >
                  <Text className="text-xs">{t(g)}</Text>
                </StyledPressable>
              ))
            : null}
        </StyledView>
      </StyledScrollView>
      {period ? (
        <Text className="text-xs text-muted-foreground">
          {formatPeriod(period.from, period.to, locale)}
        </Text>
      ) : null}
      {filters && filters.length > 0 ? (
        <StyledView className="flex-row flex-wrap gap-1">
          {filters.map((chip) => (
            <StyledPressable
              key={chip.key}
              onPress={chip.onRemove}
              className="rounded-full border border-border px-2 py-0.5"
            >
              <Text className="text-xs">{`${chip.label}: ${chip.value} ×`}</Text>
            </StyledPressable>
          ))}
        </StyledView>
      ) : null}
    </StyledView>
  );
}
