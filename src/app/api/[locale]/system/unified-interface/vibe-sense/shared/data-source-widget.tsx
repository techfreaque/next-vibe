/**
 * Vibe Sense – Data Source Chart Widget (Shared)
 *
 * Renders a single-pane lightweight-charts line chart for any data-source endpoint.
 * Resolution + range changes update the form and auto-submit triggers a refetch.
 * "Add to graph" and "Create new graph" navigate via the widget navigation stack.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart2 } from "next-vibe-ui/ui/icons/BarChart2";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "next-vibe/shared/utils";

import {
  useWidgetContext,
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { GraphResolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/enum";
import { scopedTranslation as vibeSenseT } from "@/app/api/[locale]/system/unified-interface/vibe-sense/i18n";
import {
  RESOLUTION_MS,
  type Resolution,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import graphsDefinitions from "@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/definition";

import type {
  IChartApi,
  ISeriesApi,
  SeriesDefinition,
  SeriesType,
  Time,
  UTCTimestamp,
} from "lightweight-charts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataSourceChartWidgetProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  definition: { POST: any };
  label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

function makeTickFormatter(
  resolution: Resolution,
): (utcSeconds: number) => string {
  const ms = RESOLUTION_MS[resolution];
  return (utcSeconds: number): string => {
    const d = new Date(utcSeconds * 1000);
    if (ms >= 30 * 24 * 3600_000) {
      return d.toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      });
    }
    if (ms >= 7 * 24 * 3600_000) {
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    }
    if (ms >= 24 * 3600_000) {
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    }
    if (ms >= 3600_000) {
      return d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };
}

function getChartColors(): { textColor: string; borderColor: string } {
  const style = getComputedStyle(document.documentElement);
  const fg = style.getPropertyValue("--foreground").trim();
  const border = style.getPropertyValue("--border").trim();
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
  onLastValue: (v: number | null) => void,
): void {
  const chartRef = useRef<ChartState | null>(null);
  const LineSeriesCtorRef = useRef<SeriesDefinition<"Line"> | null>(null);
  // Keep latest points in a ref so the async chart init can apply them immediately
  const pointsRef = useRef(points);
  pointsRef.current = points;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }
    let cancelled = false;

    void (async (): Promise<void> => {
      const { createChart, ColorType, LineSeries } =
        await import("lightweight-charts");
      if (cancelled) {
        return;
      }

      chartRef.current?.chart.remove();
      LineSeriesCtorRef.current = LineSeries;

      const resMs = RESOLUTION_MS[resolution];
      const showTime = resMs < 24 * 3600_000;
      const colors = getChartColors();

      // If container has no dimensions yet, wait one animation frame for layout
      const w =
        container.clientWidth || container.getBoundingClientRect().width;
      const h =
        container.clientHeight || container.getBoundingClientRect().height;

      const chart = createChart(container, {
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
          tickMarkFormatter: makeTickFormatter(resolution),
          shiftVisibleRangeOnNewBar: false,
        },
        rightPriceScale: {
          visible: true,
          borderColor: colors.borderColor,
          scaleMargins: { top: 0.08, bottom: 0.08 },
          minimumWidth: 60,
        },
      });

      const series = chart.addSeries(LineSeries, {
        color: CHART_COLOR,
        lineWidth: 2,
        priceScaleId: "right",
        lastValueVisible: true,
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
        onLastValue(deduped[deduped.length - 1]?.value ?? null);
      }

      const ro = new ResizeObserver(() => {
        if (!cancelled) {
          chart.applyOptions({
            width: container.clientWidth,
            height: container.clientHeight,
          });
        }
      });
      ro.observe(container);

      const mo = new MutationObserver(() => {
        if (!cancelled) {
          const c = getChartColors();
          chart.applyOptions({
            layout: { textColor: c.textColor },
            grid: {
              vertLines: { color: c.borderColor },
              horzLines: { color: c.borderColor },
            },
          });
        }
      });
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
      });
    })();

    return (): void => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebuild on resolution change only
  }, [resolution]);

  useEffect(() => {
    const s = chartRef.current?.series;
    if (!s) {
      return;
    }
    if (points.length === 0) {
      s.setData([]);
      onLastValue(null);
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
    onLastValue(last?.value ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable ref
  }, [points]);
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export function DataSourceChartWidget({
  definition,
  label,
}: DataSourceChartWidgetProps): React.JSX.Element {
  const { locale } = useWidgetContext();
  const t = vibeSenseT.scopedT(locale).t;
  const navigation = useWidgetNavigation();
  const mutations = useWidgetEndpointMutations();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useWidgetForm<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseData = useWidgetValue<any>();

  const [resolution, setResolution] = useState<Resolution>(
    GraphResolution.ONE_DAY,
  );
  const [rangeDays, setRangeDays] = useState<number>(30);
  const [lastValue, setLastValue] = useState<number | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  const submit = useWidgetOnSubmit();
  const isLoading = mutations?.create?.isSubmitting ?? false;

  const points = useMemo((): Array<{ time: UTCTimestamp; value: number }> => {
    const series = (
      responseData as
        | { result?: Array<{ timestamp: Date | string; value: number }> }
        | null
        | undefined
    )?.result;
    if (!series) {
      return [];
    }
    return series.map((p) => ({
      time: toChartTime(p.timestamp),
      value: p.value,
    }));
  }, [responseData]);

  useSimpleChart(chartContainerRef, points, resolution, setLastValue);

  // Auto-submit on mount to load initial data
  useEffect((): void => {
    if (!form || !submit) {
      return;
    }
    const range = buildRange(30);
    const opts = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    } as const;
    form.setValue("resolution", GraphResolution.ONE_DAY, opts);
    form.setValue("range", range, opts);
    void submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

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
      setRangeDays(days);
      patchForm({ range: buildRange(days) });
    },
    [patchForm],
  );

  const handleAddToGraph = useCallback((): void => {
    navigation.push(graphsDefinitions.GET);
  }, [navigation]);

  const handleCreateGraph = useCallback((): void => {
    const nodeId = (definition.POST.path as string[])
      .join("_")
      .replace(/-/g, "_");
    navigation.push(graphsDefinitions.POST, {
      data: {
        name: label,
        slug: (definition.POST.path as string[])
          .join("-")
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
          .replace(/-+/g, "-"),
        config: {
          nodes: {
            [nodeId]: {
              endpointPath: (definition.POST.path as string[]).join("/"),
              method: "POST",
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
  }, [navigation, definition, label]);

  const hasData = points.length > 0;
  const isEmpty = !isLoading && !hasData;

  return (
    <Div className="flex flex-col h-[calc(100vh-64px)] min-h-[400px] border rounded-xl overflow-hidden bg-background shadow-sm">
      {/* Toolbar row 1: label + graph actions */}
      <Div className="flex items-center gap-2 px-3 h-10 border-b bg-background/95 shrink-0">
        <BarChart2 className="h-4 w-4 text-muted-foreground shrink-0" />
        <Span className="text-sm font-medium truncate flex-1 min-w-0">
          {label}
        </Span>
        {lastValue !== null && (
          <Badge variant="secondary" className="text-xs tabular-nums shrink-0">
            {formatValue(lastValue)}
          </Badge>
        )}
        {isLoading && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground shrink-0" />
        )}
        <Div className="w-px h-5 bg-border/60 shrink-0" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs gap-1 shrink-0"
          onClick={handleAddToGraph}
        >
          <Plus className="h-3 w-3" />
          {t("dataSourceWidget.addToGraph")}
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
      {/* Toolbar row 2: range + resolution */}
      <Div className="flex items-center gap-2 px-3 py-1.5 border-b bg-muted/20 shrink-0 flex-wrap">
        <RangePresetPicker activeDays={rangeDays} onChange={handleRange} />
        <Div className="w-px h-5 bg-border/60 shrink-0 hidden sm:block" />
        <ResolutionPicker value={resolution} onChange={handleResolution} />
      </Div>

      {/* Chart area */}
      <Div className="flex-1 min-h-0 relative overflow-hidden">
        {isLoading && !hasData && (
          <Div className="absolute inset-0 z-10 flex items-center justify-center">
            <Div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <Span className="text-xs">{t("dataSourceWidget.loading")}</Span>
            </Div>
          </Div>
        )}
        {isEmpty && (
          <Div className="absolute inset-0 flex items-center justify-center">
            <Div className="flex flex-col items-center gap-2 text-muted-foreground">
              <BarChart2 className="h-8 w-8 opacity-30" />
              <P className="text-sm opacity-60">
                {t("dataSourceWidget.noData")}
              </P>
            </Div>
          </Div>
        )}
        <Div
          ref={chartContainerRef}
          className={cn("w-full h-full", hasData ? "visible" : "invisible")}
        />
      </Div>
    </Div>
  );
}
