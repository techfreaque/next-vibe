/**
 * Analytics components (CLI + MCP).
 *
 * Same props as the web renderer. CLI gets sparklines, text bars and aligned
 * tables; MCP gets compact plain text an agent can quote and compute with.
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import {
  formatAnalyticsValue,
  formatBucketLabel,
  formatDelta,
  formatPeriod,
  formatPointsDelta,
  kpiChange,
  seriesTotal,
  sparkline,
  textBar,
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

function pad(value: string, width: number, end = false): string {
  if (value.length >= width) {
    return value;
  }
  return end ? value.padStart(width) : value.padEnd(width);
}

// ---------------------------------------------------------------------------

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
  sparkline: spark,
  drillHint,
}: KpiTileProps): JSX.Element {
  const isMcp = useIsMcp();
  const { t } = scopedTranslation.scopedT(locale);
  const formatted = formatAnalyticsValue(value, { format, currency, locale });
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
  const deltaText =
    change === undefined
      ? ""
      : change === null
        ? t("analytics.chart.noPrevious")
        : `${deltaLabel} ${vsText}`;

  if (isMcp) {
    return (
      <Text>
        {label}: {formatted}
        {deltaText ? ` (${deltaText})` : ""}
        {hint ? ` - ${hint}` : ""}
        {drillHint ? ` (-> ${drillHint})` : ""}
      </Text>
    );
  }
  const good =
    deltaTone === "neutral" ||
    change === undefined ||
    change === null ||
    change === 0
      ? null
      : invertDelta
        ? change < 0
        : change > 0;
  const deltaColor = good === null ? undefined : good ? "green" : "red";
  return (
    <Text>
      <Text dimColor>{pad(label, 24)}</Text>
      <Text bold>{pad(formatted, 12, true)}</Text>
      {deltaText ? <Text color={deltaColor}>{`  ${deltaText}`}</Text> : null}
      {spark && spark.length > 1 ? (
        <Text color="cyan">{`  ${sparkline(spark, 20)}`}</Text>
      ) : null}
      {hint ? <Text dimColor>{`  \u00B7 ${hint}`}</Text> : null}
      {drillHint ? <Text color="cyan">{`  -> ${drillHint}`}</Text> : null}
    </Text>
  );
}

export function KpiGrid({ children }: KpiGridProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}

// ---------------------------------------------------------------------------

export function TimeSeriesChart({
  title,
  buckets,
  bucket,
  series,
  format = "number",
  currency,
  locale,
  emptyLabel,
  cliTable = true,
  drillHint,
}: TimeSeriesChartProps): JSX.Element {
  const isMcp = useIsMcp();
  const { t } = scopedTranslation.scopedT(locale);
  const fmt = { format, currency, locale };
  const empty =
    buckets.length === 0 || series.every((s) => s.values.every((v) => v === 0));

  if (isMcp) {
    const header = [t("analytics.chart.period"), ...series.map((s) => s.label)];
    const rows = buckets.slice(-120).map((key, offset) => {
      const i = buckets.length - Math.min(120, buckets.length) + offset;
      return [key, ...series.map((s) => String(s.values[i] ?? 0))].join(",");
    });
    return (
      <Box flexDirection="column">
        {title ? (
          <Text bold>
            {title}
            {drillHint ? ` (-> ${drillHint})` : ""}
          </Text>
        ) : null}
        {empty ? (
          <Text>{emptyLabel ?? t("analytics.chart.empty")}</Text>
        ) : (
          <>
            <Text>
              {series
                .map(
                  (s) =>
                    `${s.label} ${t("analytics.chart.total").toLowerCase()}: ${formatAnalyticsValue(
                      seriesTotal(s),
                      fmt,
                    )}`,
                )
                .join("; ")}
            </Text>
            {cliTable ? (
              <>
                <Text>{header.join(",")}</Text>
                {rows.map((row) => (
                  <Text key={row}>{row}</Text>
                ))}
              </>
            ) : null}
          </>
        )}
      </Box>
    );
  }

  const labelWidth = Math.max(8, ...series.map((s) => s.label.length));
  const recent = buckets.slice(-10);
  const offset = buckets.length - recent.length;
  const colWidths = series.map(
    (s) =>
      Math.max(
        s.label.length,
        ...[...recent.keys()].map(
          (i) => formatAnalyticsValue(s.values[offset + i] ?? 0, fmt).length,
        ),
      ) + 2,
  );
  return (
    <Box flexDirection="column" marginBottom={1}>
      {title ? (
        <Text bold>
          {title}
          <Text dimColor>
            {"  "}
            {t(`analytics.chart.groupedBy.${bucket}`)}
          </Text>
          {drillHint ? <Text color="cyan">{`  -> ${drillHint}`}</Text> : null}
        </Text>
      ) : null}
      {empty ? (
        <Text dimColor>{emptyLabel ?? t("analytics.chart.empty")}</Text>
      ) : (
        <>
          {series.map((s) => (
            <Text key={s.key}>
              <Text dimColor>{`${pad(s.label, labelWidth)}  `}</Text>
              <Text color="cyan">{`${sparkline(s.values, 40)}  `}</Text>
              <Text bold>
                {seriesTotal(s) === null ||
                ((format === "percent" || format === "duration") &&
                  s.total === undefined &&
                  (s.aggregate ?? "sum") === "sum")
                  ? ""
                  : formatAnalyticsValue(seriesTotal(s), fmt)}
              </Text>
            </Text>
          ))}
          {cliTable ? (
            <Box flexDirection="column" marginTop={1}>
              <Text dimColor>
                {pad(t("analytics.chart.period"), 14)}
                {series
                  .map((s, si) => pad(s.label, colWidths[si], true))
                  .join("")}
              </Text>
              {buckets.length > recent.length ? (
                <Text dimColor>
                  {t("analytics.chart.showing", {
                    count: recent.length,
                    total: buckets.length,
                  })}
                </Text>
              ) : null}
              {recent.map((key, i) => (
                <Text key={key}>
                  {pad(formatBucketLabel(key, bucket, locale), 14)}
                  {series
                    .map((s, si) =>
                      pad(
                        formatAnalyticsValue(s.values[offset + i] ?? 0, fmt),
                        colWidths[si],
                        true,
                      ),
                    )
                    .join("")}
                </Text>
              ))}
            </Box>
          ) : null}
        </>
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------

export function FunnelChart({
  title,
  steps,
  locale,
}: FunnelChartProps): JSX.Element {
  const isMcp = useIsMcp();
  const { t } = scopedTranslation.scopedT(locale);
  const first = steps[0]?.value ?? 0;
  const labelWidth = Math.max(10, ...steps.map((s) => s.label.length));
  return (
    <Box flexDirection="column" marginBottom={isMcp ? 0 : 1}>
      {title ? <Text bold>{title}</Text> : null}
      {steps.map((step, index) => {
        const prev = index > 0 ? steps[index - 1].value : null;
        const ofFirst = first > 0 ? step.value / first : 0;
        const ofPrev = prev !== null && prev > 0 ? step.value / prev : null;
        const count = formatAnalyticsValue(step.value, { locale });
        const pctFirst = formatAnalyticsValue(ofFirst, {
          format: "percent",
          locale,
        });
        const pctPrev =
          ofPrev === null
            ? ""
            : `${formatAnalyticsValue(ofPrev, { format: "percent", locale })} ${t("analytics.chart.ofPrevious")}`;
        if (isMcp) {
          return (
            <Text key={step.key}>
              {index + 1}. {step.label}: {count}
              {index === 1
                ? ` (${pctPrev})`
                : index > 1
                  ? ` (${pctFirst} ${t("analytics.chart.ofFirst")}, ${pctPrev})`
                  : ""}
            </Text>
          );
        }
        return (
          <Text key={step.key}>
            <Text>{`${pad(step.label, labelWidth)} `}</Text>
            <Text bold>{`${pad(count, 9, true)}  `}</Text>
            <Text color="cyan">{textBar(ofFirst, 20)}</Text>
            <Text
              dimColor
            >{` ${pad(index < 2 ? "" : pctFirst, 6, true)}  `}</Text>
            <Text dimColor>{pctPrev}</Text>
          </Text>
        );
      })}
    </Box>
  );
}

// ---------------------------------------------------------------------------

export function BreakdownTable({
  title,
  dimensionLabel,
  columns,
  rows,
  shareKey,
  limit = 10,
  showShare = true,
  shareLabel,
  footer,
  drillHint,
  locale,
  emptyLabel,
}: BreakdownTableProps): JSX.Element {
  const isMcp = useIsMcp();
  const { t } = scopedTranslation.scopedT(locale);
  const share = shareKey ?? columns[0]?.key ?? "";
  const total = rows.reduce((sum, r) => sum + (r.values[share] ?? 0), 0);
  const shown = rows.slice(0, isMcp ? Math.max(limit, 25) : limit);
  const cell = (row: (typeof rows)[number], key: string): string => {
    const col = columns.find((c) => c.key === key);
    return formatAnalyticsValue(row.values[key], {
      format: col?.format,
      currency: col?.currency,
      locale,
    });
  };
  const shareOf = (row: (typeof rows)[number]): number =>
    total > 0 ? (row.values[share] ?? 0) / total : 0;
  const more =
    rows.length > shown.length
      ? t("analytics.chart.showing", {
          count: shown.length,
          total: rows.length,
        })
      : null;

  if (rows.length === 0) {
    return (
      <Box flexDirection="column" marginBottom={isMcp ? 0 : 1}>
        {title ? (
          <Text bold>
            {title}
            {drillHint ? ` (-> ${drillHint})` : ""}
          </Text>
        ) : null}
        <Text dimColor>{emptyLabel ?? t("analytics.chart.empty")}</Text>
      </Box>
    );
  }

  if (isMcp) {
    return (
      <Box flexDirection="column">
        {title ? (
          <Text bold>
            {title}
            {drillHint ? ` (-> ${drillHint})` : ""}
          </Text>
        ) : null}
        <Text>
          {[
            dimensionLabel,
            ...columns.map((c) => c.label),
            ...(showShare ? [shareLabel ?? t("analytics.chart.share")] : []),
          ].join(" | ")}
        </Text>
        {shown.map((row) => (
          <Text key={row.id}>
            {[
              row.sublabel ? `${row.label} (${row.sublabel})` : row.label,
              ...columns.map((c) => cell(row, c.key)),
              ...(showShare
                ? [
                    formatAnalyticsValue(shareOf(row), {
                      format: "percent",
                      locale,
                    }),
                  ]
                : []),
            ].join(" | ")}
          </Text>
        ))}
        {more ? <Text>{more}</Text> : null}
        {footer ? <Text>{footer}</Text> : null}
      </Box>
    );
  }

  const labelWidth = Math.min(
    32,
    Math.max(dimensionLabel.length, ...shown.map((r) => r.label.length)),
  );
  const widths = columns.map(
    (c) =>
      Math.max(c.label.length, ...shown.map((r) => cell(r, c.key).length)) + 2,
  );
  return (
    <Box flexDirection="column" marginBottom={1}>
      {title ? (
        <Text bold>
          {title}
          {drillHint ? ` (-> ${drillHint})` : ""}
        </Text>
      ) : null}
      <Text dimColor>
        {pad(dimensionLabel, labelWidth)}
        {columns.map((c, i) => pad(c.label, widths[i], true)).join("")}
        {showShare ? `  ${shareLabel ?? t("analytics.chart.share")}` : ""}
      </Text>
      {shown.map((row) => {
        const ratio = shareOf(row);
        const label =
          row.label.length > labelWidth
            ? `${row.label.slice(0, labelWidth - 1)}\u2026`
            : row.label;
        return (
          <Box key={row.id} flexDirection="column">
            <Text>
              {pad(label, labelWidth)}
              {columns
                .map((c, i) => pad(cell(row, c.key), widths[i], true))
                .join("")}
              {showShare ? (
                <>
                  <Text color="cyan">{`  ${textBar(ratio, 10)}`}</Text>
                  <Text dimColor>
                    {` ${formatAnalyticsValue(ratio, { format: "percent", locale })}`}
                  </Text>
                </>
              ) : null}
            </Text>
            {row.sublabel ? <Text dimColor>{`  ${row.sublabel}`}</Text> : null}
          </Box>
        );
      })}
      {more ? <Text dimColor>{more}</Text> : null}
      {footer ? <Text dimColor>{footer}</Text> : null}
    </Box>
  );
}

// ---------------------------------------------------------------------------

export function AnalyticsSegmented<TValue extends string>({
  options,
  value,
  label,
}: AnalyticsSegmentedProps<TValue>): JSX.Element {
  const active = options.find((o) => o.value === value);
  return <Text dimColor>{`${label}: ${active?.label ?? value}`}</Text>;
}

export function AnalyticsToolbar({
  locale,
  period,
  filters,
  hideGranularity = false,
}: AnalyticsToolbarProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const { t } = scopedTranslation.scopedT(locale);
  if (!period) {
    return null;
  }
  const compared =
    period.previousFrom && period.previousTo
      ? ` ${t("analytics.chart.comparedTo", {
          period: isMcp
            ? `${period.previousFrom}..${period.previousTo}`
            : formatPeriod(period.previousFrom, period.previousTo, locale),
        })}`
      : "";
  const label = formatPeriod(period.from, period.to, locale);
  const by = hideGranularity
    ? ""
    : ` (${t(`analytics.chart.groupedBy.${period.bucket}`)})`;
  const filterText =
    filters && filters.length > 0
      ? ` ${t("analytics.chart.filters")}: ${filters
          .map((f) => `${f.label}=${f.value}`)
          .join(", ")}`
      : "";
  if (isMcp) {
    return (
      <Text>
        {t("analytics.chart.period")}: {period.from}..{period.to}
        {compared}
        {by}
        {filterText}
      </Text>
    );
  }
  return (
    <Box marginBottom={1}>
      <Text dimColor>
        {t("analytics.chart.period")}: {label}
        {compared}
        {by}
        {filterText}
      </Text>
    </Box>
  );
}
