/**
 * Vibe Sense – Data Source Chart Widget (Shared)
 *
 * Renders a single-pane lightweight-charts line chart for any data-source endpoint.
 * Resolution + range changes update the form and auto-submit triggers a refetch.
 * "Add to graph" and "Create new graph" navigate via the widget navigation stack.
 */

"use client";

import type {
  IChartApi,
  ISeriesApi,
  SeriesType,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { BarChart2 } from "next-vibe/ui/components/icons/BarChart2";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { getRootCssVar } from "next-vibe/ui/lib/css-vars";
import { observeRootMutations } from "next-vibe/ui/lib/dom";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../core/i18n/core/config";
import { AdminRecordContext } from "../../unified-ui/_shared/admin-record-context";
import { cn } from "../../unified-ui/_shared/cn";
import { moneyNumberFormat } from "../../unified-ui/_shared/format-money";
import type {
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../unified-ui/_shared/types";
import {
  useWidgetContext,
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetValue,
} from "../../unified-ui/_shared/use-widget-context";
import { MultiWidgetRenderer } from "../../unified-ui/renderers/web/MultiWidgetRenderer";
import { GraphResolution } from "../enum";
import graphsDefinitions from "../graphs/definition";
import { scopedTranslation as vibeSenseT } from "../i18n";
import { type Resolution, RESOLUTION_MS, type TimeSeries } from "./fields";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DataSourceChartWidgetProps {
  definition: { POST: CreateApiEndpointAny };
  label: string;
  currency?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const standardChartFields = new Set(["range", "resolution", "lookback"]);

function getSourceFilters(
  fields: CreateApiEndpointAny["fields"],
): ObjectChildrenConstraint<string, FieldUsageConfig> {
  if (!("children" in fields) || !fields.children) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(fields.children).filter(
      ([key, field]) =>
        !standardChartFields.has(key) &&
        field.usage.request === "data" &&
        field.hidden !== true,
    ),
  );
}

const CHART_COLOR = "#2563eb";

const RESOLUTION_OPTIONS = [
  { label: "1m", value: GraphResolution.ONE_MINUTE },
  { label: "3m", value: GraphResolution.THREE_MINUTES },
  { label: "5m", value: GraphResolution.FIVE_MINUTES },
  { label: "15m", value: GraphResolution.FIFTEEN_MINUTES },
  { label: "30m", value: GraphResolution.THIRTY_MINUTES },
  { label: "1H", value: GraphResolution.ONE_HOUR },
  { label: "4H", value: GraphResolution.FOUR_HOURS },
  { label: "1D", value: GraphResolution.ONE_DAY },
  { label: "1W", value: GraphResolution.ONE_WEEK },
  { label: "1M", value: GraphResolution.ONE_MONTH },
] as const;

const RESOLUTION_BAR_SPACING: Record<Resolution, number> = {
  [GraphResolution.ONE_MINUTE]: 4,
  [GraphResolution.THREE_MINUTES]: 5,
  [GraphResolution.FIVE_MINUTES]: 6,
  [GraphResolution.FIFTEEN_MINUTES]: 7,
  [GraphResolution.THIRTY_MINUTES]: 8,
  [GraphResolution.ONE_HOUR]: 10,
  [GraphResolution.FOUR_HOURS]: 14,
  [GraphResolution.ONE_DAY]: 20,
  [GraphResolution.ONE_WEEK]: 30,
  [GraphResolution.ONE_MONTH]: 40,
};

const RANGE_PRESETS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toChartTime(ts: Date | string): UTCTimestamp {
  const d = typeof ts === "string" ? new Date(ts) : ts;
  return Math.floor(d.getTime() / 1000) as UTCTimestamp;
}

function formatValue(v: number): string {
  if (Math.abs(v) < 1 && v !== 0) {
    return v.toFixed(4);
  }
  if (Math.abs(v) >= 1_000_000) {
    return `${(v / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(v) >= 1_000) {
    return `${(v / 1_000).toFixed(1)}k`;
  }
  return v.toFixed(2);
}

function buildRange(days: number): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date(to.getTime() - days * 86_400_000);
  return { from, to };
}

function chartDate(time: Time): Date {
  if (typeof time === "number") {
    return new Date(time * 1000);
  }
  if (typeof time === "string") {
    return new Date(time);
  }
  return new Date(Date.UTC(time.year, time.month - 1, time.day));
}

function chartTickOptions(resolution: Resolution): Intl.DateTimeFormatOptions {
  const ms = RESOLUTION_MS[resolution];
  if (ms >= 30 * 86_400_000) {
    return { month: "short", year: "numeric" };
  }
  if (ms >= 86_400_000) {
    return { month: "short", day: "numeric" };
  }
  return {
    hour: "2-digit",
    minute: "2-digit",
    ...(ms < 3_600_000 ? { second: "2-digit" } : {}),
  };
}

function getChartColors(): { textColor: string; borderColor: string } {
  const fg = getRootCssVar("--foreground").trim();
  const border = getRootCssVar("--border").trim();
  return {
    textColor: fg ? `hsl(${fg})` : "#888",
    borderColor: border ? `hsl(${border})` : "#333",
  };
}

// ─── Resolution Pill Picker ───────────────────────────────────────────────────

function ResolutionPicker({
  value,
  onChange,
}: {
  value: Resolution;
  onChange: (r: Resolution) => void;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-0 border rounded-lg overflow-hidden bg-muted/30 flex-wrap">
      {RESOLUTION_OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-7 px-2.5 text-[11px] font-medium rounded-none border-0 border-r last:border-0",
            value === opt.value
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground hover:text-foreground hover:bg-accent",
          )}
        >
          {opt.label}
        </Button>
      ))}
    </Div>
  );
}

// ─── Range Preset Picker ──────────────────────────────────────────────────────

function RangePresetPicker({
  activeDays,
  onChange,
}: {
  activeDays: number;
  onChange: (days: number) => void;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-0 border rounded-lg overflow-hidden bg-muted/30">
      {RANGE_PRESETS.map((p) => (
        <Button
          key={p.days}
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(p.days)}
          className={cn(
            "h-7 px-2.5 text-[11px] font-medium rounded-none border-0 border-r last:border-0",
            activeDays === p.days
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground hover:text-foreground hover:bg-accent",
          )}
        >
          {p.label}
        </Button>
      ))}
    </Div>
  );
}

// ─── Single-Pane Chart ────────────────────────────────────────────────────────

type LwcSeries = ISeriesApi<SeriesType, Time>;

interface ChartState {
  chart: IChartApi;
  series: LwcSeries | null;
}

function useSimpleChart(
  containerRef: React.RefObject<HTMLDivElement | null>,
  points: Array<{ time: UTCTimestamp; value: number }>,
  resolution: Resolution,
  locale: CountryLanguage,
  numberFormat: Intl.NumberFormat,
  admin: boolean,
  onLastValue: (v: number | null) => void,
): void {
  const chartRef = useRef<ChartState | null>(null);
  // Keep latest points in a ref so the async chart init can apply them immediately
  const pointsRef = useRef(points);
  // Keep latest onLastValue in a ref so effects don't need it in deps
  const onLastValueRef = useRef(onLastValue);

  // Sync latest-value refs after each commit (declared first so it runs
  // before the chart effects below)
  useEffect(() => {
    pointsRef.current = points;
    onLastValueRef.current = onLastValue;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }
    const run: { cancelled: boolean; dispose: (() => void) | null } = {
      cancelled: false,
      dispose: null,
    };

    void (async (): Promise<void> => {
      const { createChart, ColorType, LineSeries } =
        await import("lightweight-charts");
      if (run.cancelled) {
        return;
      }

      const resMs = RESOLUTION_MS[resolution];
      const showTime = resMs < 24 * 3600_000;
      const colors = getChartColors();

      // If container has no dimensions yet, wait one animation frame for layout
      const w =
        container.clientWidth || container.getBoundingClientRect().width;
      const h =
        container.clientHeight || container.getBoundingClientRect().height;

      const tickFormat = new Intl.DateTimeFormat(locale, {
        ...chartTickOptions(resolution),
        timeZone: "UTC",
      });
      const crosshairFormat = new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        ...(showTime ? { timeStyle: "short" } : {}),
        timeZone: "UTC",
      });
      const chart = createChart(container, {
        localization: {
          locale,
          priceFormatter: (value: number): string => numberFormat.format(value),
          timeFormatter: (time: Time): string =>
            crosshairFormat.format(chartDate(time)),
        },
        width: w || 600,
        height: h || 400,
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: colors.textColor,
        },
        grid: {
          vertLines: { color: colors.borderColor },
          horzLines: { color: colors.borderColor },
        },
        crosshair: { mode: 1 },
        timeScale: {
          borderColor: colors.borderColor,
          timeVisible: showTime,
          secondsVisible: false,
          barSpacing: RESOLUTION_BAR_SPACING[resolution] ?? 20,
          tickMarkFormatter: (time: Time): string =>
            tickFormat.format(chartDate(time)),
          shiftVisibleRangeOnNewBar: false,
          lockVisibleTimeRangeOnResize: true,
          fixLeftEdge: admin,
        },
        rightPriceScale: {
          visible: true,
          borderColor: colors.borderColor,
          scaleMargins: { top: 0.08, bottom: admin ? 0.18 : 0.08 },
          minimumWidth: 60,
        },
      });

      const series = chart.addSeries(LineSeries, {
        color: CHART_COLOR,
        lineWidth: 2,
        priceScaleId: "right",
        lastValueVisible: !admin,
        priceLineVisible: false,
      });
      chartRef.current = { chart, series };

      // Apply any data that arrived before the chart was ready
      const pending = pointsRef.current;
      if (pending.length > 0) {
        const map = new Map<UTCTimestamp, number>();
        for (const p of pending) {
          map.set(p.time, p.value);
        }
        const deduped = [...map.entries()]
          .map(([time, value]) => ({ time, value }))
          .toSorted((a, b) => (a.time as number) - (b.time as number));
        series.setData(deduped);
        chart.timeScale().fitContent();
        onLastValueRef.current(deduped[deduped.length - 1]?.value ?? null);
      }

      const ro = new ResizeObserver(() => {
        if (!run.cancelled) {
          chart.applyOptions({
            width: container.clientWidth,
            height: container.clientHeight,
          });
        }
      });
      ro.observe(container);

      const stopObservingTheme = observeRootMutations(
        () => {
          if (!run.cancelled) {
            const c = getChartColors();
            chart.applyOptions({
              layout: { textColor: c.textColor },
              grid: {
                vertLines: { color: c.borderColor },
                horzLines: { color: c.borderColor },
              },
            });
          }
        },
        { attributes: true, attributeFilter: ["class", "data-theme"] },
      );
      run.dispose = (): void => {
        ro.disconnect();
        stopObservingTheme();
        chart.remove();
        chartRef.current = null;
      };
    })();

    return (): void => {
      run.cancelled = true;
      run.dispose?.();
    };
  }, [resolution, containerRef, locale, numberFormat, admin]);

  useEffect(() => {
    const s = chartRef.current?.series;
    if (!s) {
      return;
    }
    if (points.length === 0) {
      s.setData([]);
      onLastValueRef.current(null);
      return;
    }
    const map = new Map<UTCTimestamp, number>();
    for (const p of points) {
      map.set(p.time, p.value);
    }
    const deduped = [...map.entries()]
      .map(([time, value]) => ({ time, value }))
      .toSorted((a, b) => (a.time as number) - (b.time as number));
    s.setData(deduped);
    chartRef.current?.chart.timeScale().fitContent();
    const last = deduped[deduped.length - 1];
    onLastValueRef.current(last?.value ?? null);
  }, [points, chartRef]);
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export function DataSourceChartWidget({
  definition,
  label,
  currency,
}: DataSourceChartWidgetProps): React.JSX.Element {
  const { locale } = useWidgetContext();
  const t = vibeSenseT.scopedT(locale).t;
  const navigation = useWidgetNavigation();
  const admin = useContext(AdminRecordContext);
  const response = useWidgetResponse();
  const mutations = useWidgetEndpointMutations();
  const form = useWidgetForm<CreateApiEndpointAny>();
  const responseData: { result?: TimeSeries } | undefined =
    useWidgetValue<CreateApiEndpointAny>();

  const [resolution, setResolution] = useState<Resolution>(
    GraphResolution.ONE_DAY,
  );
  const [range, setRange] = useState(() => buildRange(30));
  const rangeDays = (range.to.getTime() - range.from.getTime()) / 86_400_000;
  const filters = useMemo(
    () => getSourceFilters(definition.POST.fields),
    [definition],
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [lastValue, setLastValue] = useState<number | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const didMountSubmitRef = useRef(false);

  const submit = useWidgetOnSubmit();
  const isLoading = mutations?.create?.isSubmitting ?? false;

  const points = useMemo((): Array<{ time: UTCTimestamp; value: number }> => {
    const series = responseData?.result;
    if (!series) {
      return [];
    }
    return series.map((p) => ({
      time: toChartTime(p.timestamp),
      value: p.value,
    }));
  }, [responseData]);

  const adminCurrency = admin ? currency : undefined;
  const numberFormat = useMemo(
    () =>
      adminCurrency
        ? moneyNumberFormat(adminCurrency, locale)
        : new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }),
    [adminCurrency, locale],
  );
  useSimpleChart(
    chartContainerRef,
    points,
    resolution,
    locale,
    numberFormat,
    Boolean(admin),
    setLastValue,
  );

  // Auto-submit on mount to load initial data
  useEffect((): void => {
    if (didMountSubmitRef.current || !form || !submit) {
      return;
    }
    didMountSubmitRef.current = true;
    const opts = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    } as const;
    form.setValue("resolution", GraphResolution.ONE_DAY, opts);
    form.setValue("range", range, opts);
    void submit();
  }, [form, range, submit]);

  const patchForm = useCallback(
    (patch: {
      resolution?: string;
      range?: { from: Date; to: Date };
    }): void => {
      if (!form) {
        return;
      }
      const opts = {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      } as const;
      if (patch.resolution !== undefined) {
        form.setValue("resolution", patch.resolution, opts);
      }
      if (patch.range !== undefined) {
        form.setValue("range", patch.range, opts);
      }
      void submit?.();
    },
    [form, submit],
  );

  const handleResolution = useCallback(
    (res: Resolution): void => {
      setResolution(res);
      patchForm({ resolution: res });
    },
    [patchForm],
  );

  const handleRange = useCallback(
    (days: number): void => {
      const selected = buildRange(days);
      setRange(selected);
      patchForm({ range: selected });
    },
    [patchForm],
  );

  const handleAddToGraph = useCallback((): void => {
    navigation.push(graphsDefinitions.GET);
  }, [navigation]);

  const handleCreateGraph = useCallback((): void => {
    const nodeId = definition.POST.path.join("_").replaceAll("-", "_");
    const params: Record<string, string | number | boolean | null> = {};
    for (const name of Object.keys(filters)) {
      const value = form?.getValues(name);
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        params[name] = value;
      }
    }
    navigation.push(graphsDefinitions.POST, {
      data: {
        name: label,
        slug: definition.POST.path
          .join("-")
          .toLowerCase()
          .replaceAll(/[^a-z0-9-]/g, "-")
          .replaceAll(/-+/g, "-"),
        config: {
          nodes: {
            [nodeId]: {
              endpointPath: definition.POST.path.join("/"),
              method: "POST",
              ...(admin ? { resolution, params } : {}),
              pane: 0,
              color: CHART_COLOR,
              visible: true,
            },
          },
          edges: [],
          trigger: { type: "manual" },
        },
      },
    });
  }, [navigation, definition, label, admin, filters, form, resolution]);

  const hasData = points.length > 0;
  const failed = Boolean(admin && response?.success === false && !isLoading);
  const isEmpty = !isLoading && !hasData && !failed;
  const nextPeriod = RANGE_PRESETS.find((preset) => preset.days > rangeDays);
  const dayFormat = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "day",
    unitDisplay: "long",
  });

  return (
    <Div
      className={cn(
        "flex min-w-0 flex-col rounded-xl border bg-background",
        admin
          ? "mx-4 my-4 min-h-[24rem] sm:mx-8"
          : "h-[calc(100vh-64px)] min-h-[400px] overflow-hidden shadow-sm",
      )}
    >
      {/* Toolbar row 1: label + graph actions */}
      <Div
        className={cn(
          "flex items-center gap-2 border-b bg-background/95 shrink-0",
          admin ? "flex-wrap px-4 py-3" : "h-10 px-3",
        )}
      >
        <BarChart2
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0",
            admin && "hidden sm:block",
          )}
        />
        <Span
          className={
            admin
              ? "min-w-0 flex-1 text-lg font-semibold"
              : "text-sm font-medium truncate flex-1 min-w-0"
          }
        >
          {label}
        </Span>
        {lastValue !== null &&
          (!admin || (hasData && !isLoading && !failed)) && (
            <Badge
              variant="secondary"
              className="text-xs tabular-nums shrink-0"
            >
              {admin && (
                <Span className="mr-1 text-muted-foreground">
                  {t("dataSourceWidget.latestValue")}
                </Span>
              )}
              <Span>
                {admin
                  ? numberFormat.format(lastValue)
                  : formatValue(lastValue)}
              </Span>
            </Badge>
          )}
        {isLoading && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground shrink-0" />
        )}
        <Div
          className={admin ? "flex basis-full gap-2 sm:basis-auto" : "contents"}
        >
          {!admin && <Div className="w-px h-5 bg-border/60 shrink-0" />}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1 shrink-0"
            onClick={handleAddToGraph}
          >
            {!admin && <Plus className="h-3 w-3" />}
            {admin
              ? t("dataSourceWidget.browseGraphs")
              : t("dataSourceWidget.addToGraph")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs gap-1 shrink-0"
            onClick={handleCreateGraph}
          >
            <Plus className="h-3 w-3" />
            {t("dataSourceWidget.newGraph")}
          </Button>
        </Div>
      </Div>
      {/* Toolbar row 2: range + resolution */}
      {admin ? (
        <Div className="grid grid-cols-2 items-end gap-3 border-b p-4 sm:flex sm:flex-wrap">
          <Div className="flex min-w-0 flex-col gap-1 sm:w-44">
            <Span className="text-xs font-medium text-muted-foreground">
              {t("dataSourceWidget.period")}
            </Span>
            <Select
              disabled={isLoading}
              value={String(rangeDays)}
              onValueChange={(value) => {
                const preset = RANGE_PRESETS.find(
                  (item) => String(item.days) === value,
                );
                if (preset) {
                  handleRange(preset.days);
                }
              }}
            >
              <SelectTrigger aria-label={t("dataSourceWidget.period")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RANGE_PRESETS.map((preset) => (
                  <SelectItem key={preset.days} value={String(preset.days)}>
                    {dayFormat.format(preset.days)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>
          <Div className="flex min-w-0 flex-col gap-1 sm:w-44">
            <Span className="text-xs font-medium text-muted-foreground">
              {t("dataSourceWidget.interval")}
            </Span>
            <Select
              disabled={isLoading}
              value={resolution}
              onValueChange={(value) => {
                const option = RESOLUTION_OPTIONS.find(
                  (item) => item.value === value,
                );
                if (option) {
                  handleResolution(option.value);
                }
              }}
            >
              <SelectTrigger aria-label={t("dataSourceWidget.interval")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESOLUTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>
          {Object.keys(filters).length > 0 && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="col-span-2 justify-self-start self-end"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              {t("dataSourceWidget.filters")}
            </Button>
          )}
          <Span className="col-span-2 text-xs tabular-nums text-muted-foreground sm:ms-auto sm:pb-3">
            {new Intl.DateTimeFormat(locale, {
              dateStyle: "medium",
              timeZone: "UTC",
            }).formatRange(range.from, range.to)}
          </Span>
        </Div>
      ) : (
        <Div className="flex items-center gap-2 px-3 py-1.5 border-b bg-muted/20 shrink-0 flex-wrap">
          <RangePresetPicker activeDays={rangeDays} onChange={handleRange} />
          <Div className="w-px h-5 bg-border/60 shrink-0 hidden sm:block" />
          <ResolutionPicker value={resolution} onChange={handleResolution} />
        </Div>
      )}
      {admin && filtersOpen && (
        <Div className="space-y-3 border-b px-4 py-3">
          <MultiWidgetRenderer
            childrenSchema={filters}
            fieldName={undefined}
            value={undefined}
            defaultColumns={6}
          />
          <Button
            type="button"
            size="sm"
            disabled={isLoading}
            onClick={() => void submit?.()}
          >
            {t("dataSourceWidget.applyFilters")}
          </Button>
        </Div>
      )}
      {/* Chart area */}
      <Div
        className={cn(
          "flex-1 relative overflow-hidden",
          admin ? "min-h-64 sm:min-h-80" : "min-h-0",
        )}
      >
        {isLoading && (!hasData || admin) && (
          <Div
            aria-live="polite"
            className="absolute inset-0 z-10 flex items-center justify-center bg-background"
          >
            <Div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <Span className="text-xs">{t("dataSourceWidget.loading")}</Span>
            </Div>
          </Div>
        )}
        {failed && admin && (
          <EmptyBlock
            size="page"
            title={t("dataSourceWidget.loadError")}
            action={{ label: admin.retryLabel, onClick: () => void submit?.() }}
          />
        )}
        {isEmpty && (
          <Div className="absolute inset-0 flex items-center justify-center">
            <Div className="flex flex-col items-center gap-2 text-muted-foreground">
              <BarChart2 className="h-8 w-8 opacity-30" />
              <P className={admin ? "text-sm" : "text-sm opacity-60"}>
                {t("dataSourceWidget.noData")}
              </P>
              {admin && nextPeriod && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRange(nextPeriod.days)}
                >
                  {t("dataSourceWidget.expandPeriod", {
                    period: dayFormat.format(nextPeriod.days),
                  })}
                </Button>
              )}
            </Div>
          </Div>
        )}
        <Div
          ref={chartContainerRef}
          className={cn(
            admin ? "absolute inset-0" : "w-full h-full",
            hasData && !failed ? "visible" : "invisible",
          )}
        />
      </Div>
    </Div>
  );
}
