/**
 * Vibe Sense — Graph Chart View Widget
 *
 * Resolution selector + lightweight-charts line chart.
 * Panning left loads older history via cursor-based pagination.
 * Data pages are accumulated client-side across fetches.
 * Each series has its own Y-axis scale (auto-scaled per range).
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Archive } from "next-vibe-ui/ui/icons/Archive";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { BarChart2 } from "next-vibe-ui/ui/icons/BarChart2";
import { Edit } from "next-vibe-ui/ui/icons/Edit";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "next-vibe/shared/utils";

import {
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { UTCTimestamp } from "lightweight-charts";

import { GraphResolution } from "../../../enum";
import type { Resolution } from "../../../indicators/types";

import type definition from "./definition";

// ─── Types ───────────────────────────────────────────────────────────────────

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;

interface WidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LINE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#be185d",
  "#ca8a04",
  "#6366f1",
];

const RESOLUTION_OPTIONS = [
  { label: "1H", value: GraphResolution.ONE_HOUR },
  { label: "4H", value: GraphResolution.FOUR_HOURS },
  { label: "1D", value: GraphResolution.ONE_DAY },
  { label: "1W", value: GraphResolution.ONE_WEEK },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timestampToISO(utcSeconds: number): string {
  return new Date(utcSeconds * 1000).toISOString();
}

function toChartTime(isoTimestamp: string): UTCTimestamp {
  return Math.floor(new Date(isoTimestamp).getTime() / 1000) as UTCTimestamp;
}

function deduplicatePoints(
  points: Array<{ time: UTCTimestamp; value: number }>,
): Array<{ time: UTCTimestamp; value: number }> {
  const map = new Map<UTCTimestamp, number>();
  for (const p of points) {
    map.set(p.time, p.value);
  }
  return [...map.entries()]
    .map(([time, value]) => ({ time, value }))
    .toSorted((a, b) => a.time - b.time);
}

// ─── Merge accumulated series ─────────────────────────────────────────────────

type SeriesItem = NonNullable<GetResponseOutput>["series"][number];
type SignalItem = NonNullable<GetResponseOutput>["signals"][number];

function mergeSeries(prev: SeriesItem[], next: SeriesItem[]): SeriesItem[] {
  const map = new Map<string, SeriesItem>();
  for (const s of [...prev, ...next]) {
    const existing = map.get(s.nodeId);
    if (existing) {
      const merged = [...existing.points, ...s.points];
      const seen = new Map<string, (typeof merged)[number]>();
      for (const p of merged) {
        seen.set(p.timestamp, p);
      }
      map.set(s.nodeId, {
        nodeId: s.nodeId,
        points: [...seen.values()].toSorted(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        ),
      });
    } else {
      map.set(s.nodeId, s);
    }
  }
  return [...map.values()];
}

function mergeSignals(prev: SignalItem[], next: SignalItem[]): SignalItem[] {
  const map = new Map<string, SignalItem>();
  for (const s of [...prev, ...next]) {
    const existing = map.get(s.nodeId);
    if (existing) {
      const seen = new Map<string, (typeof s.events)[number]>();
      for (const e of [...existing.events, ...s.events]) {
        seen.set(e.timestamp, e);
      }
      map.set(s.nodeId, {
        nodeId: s.nodeId,
        events: [...seen.values()].toSorted(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        ),
      });
    } else {
      map.set(s.nodeId, s);
    }
  }
  return [...map.values()];
}

// ─── Scale Grouping ──────────────────────────────────────────────────────────

/**
 * Group series into two Y-axis scales: "right" (counts/large values) and
 * "left" (rates/fractions 0–1). lightweight-charts v5 only supports two
 * labeled axes ("left" and "right") — custom IDs become invisible overlays.
 *
 * Series with max value ≤ 1 go on the left axis (rates/fractions).
 * Everything else goes on the right axis (counts, totals, etc.).
 */
function computeScaleGroups(series: SeriesItem[]): Map<string, string> {
  const result = new Map<string, string>();

  for (const s of series) {
    if (s.points.length === 0) {
      result.set(s.nodeId, "right");
      continue;
    }
    let max = 0;
    for (const p of s.points) {
      const abs = Math.abs(p.value);
      if (abs > max) {
        max = abs;
      }
    }
    // Rates/fractions (0–1 range) → left axis; counts → right axis
    result.set(s.nodeId, max <= 1 ? "left" : "right");
  }
  return result;
}

// ─── Chart Renderer ───────────────────────────────────────────────────────────

// Minimal lightweight-charts series interface for in-place updates
interface LwcSeries {
  setData: (data: Array<{ time: UTCTimestamp; value: number }>) => void;
}

function useChartRenderer(
  series: SeriesItem[],
  signals: SignalItem[],
  hiddenSeries: Set<string>,
  onPanBack: (oldestVisibleISO: string) => void,
): { chartContainerRef: React.RefObject<HTMLDivElement | null> } {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<{
    remove: () => void;
    timeScale: () => {
      subscribeVisibleTimeRangeChange: (
        cb: (r: { from: number; to: number } | null) => void,
      ) => void;
      getVisibleRange: () => { from: number; to: number } | null;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- lightweight-charts api
    addSeries: (...args: any[]) => LwcSeries;
    applyOptions: (opts: { width: number }) => void;
  } | null>(null);
  // Map nodeId → lightweight-charts series instance for in-place updates
  const seriesMapRef = useRef<Map<string, LwcSeries>>(new Map());
  // Cached LineSeries constructor (set after first dynamic import)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- lightweight-charts api
  const LineSeriesCtorRef = useRef<any>(null);
  const observerRef = useRef<{
    disconnect: () => void;
    observe: (el: Element) => void;
  } | null>(null);
  const onPanBackRef = useRef(onPanBack);
  onPanBackRef.current = onPanBack;

  // Pan debounce timer
  const panTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Timer to delay enabling pan-back after chart renders
  const enableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track oldest loaded data timestamp (ms) to avoid redundant fetches
  const oldestLoadedRef = useRef<number | null>(null);
  // Whether the chart has finished initial render and pan-back is enabled
  const panEnabledRef = useRef(false);

  useEffect(() => {
    const sm = seriesMapRef.current;
    return (): void => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      chartRef.current?.remove();
      chartRef.current = null;
      sm.clear();
      if (panTimerRef.current) {
        clearTimeout(panTimerRef.current);
        panTimerRef.current = null;
      }
      if (enableTimerRef.current) {
        clearTimeout(enableTimerRef.current);
        enableTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!series.length || !chartContainerRef.current) {
      return;
    }

    // Track oldest point across all series
    let oldest: number | null = null;
    for (const s of series) {
      for (const p of s.points) {
        const t = new Date(p.timestamp).getTime();
        if (oldest === null || t < oldest) {
          oldest = t;
        }
      }
    }
    oldestLoadedRef.current = oldest;

    // If chart already exists, update series data in place without rebuilding
    if (chartRef.current) {
      const scaleGroups = computeScaleGroups(series);
      for (let i = 0; i < series.length; i++) {
        const s = series[i];
        if (!s || s.points.length === 0 || hiddenSeries.has(s.nodeId)) {
          continue;
        }
        const rawPoints = s.points.map((p) => ({
          time: toChartTime(p.timestamp),
          value: p.value,
        }));
        const existing = seriesMapRef.current.get(s.nodeId);
        if (existing) {
          // In-place update — no flicker, preserves scroll position
          existing.setData(deduplicatePoints(rawPoints));
        } else if (LineSeriesCtorRef.current) {
          // New node appeared after initial build — add to existing chart
          const color = LINE_COLORS[i % LINE_COLORS.length];
          const priceScaleId = scaleGroups.get(s.nodeId) ?? "right";
          const lwcSeries = chartRef.current.addSeries(
            LineSeriesCtorRef.current,
            {
              color,
              lineWidth: 2,
              title: s.nodeId,
              priceScaleId,
              lastValueVisible: true,
              priceLineVisible: false,
            },
          );
          lwcSeries.setData(deduplicatePoints(rawPoints));
          seriesMapRef.current.set(s.nodeId, lwcSeries);
        }
      }
      return;
    }

    observerRef.current?.disconnect();
    observerRef.current = null;
    seriesMapRef.current.clear();

    // Disable pan-back during rebuild
    panEnabledRef.current = false;

    let cancelled = false;

    const asyncSetup = async (): Promise<void> => {
      const { createChart, createSeriesMarkers, ColorType, LineSeries } =
        await import("lightweight-charts");

      if (cancelled) {
        return;
      }
      // Cache constructor for in-place updates after chart is built
      LineSeriesCtorRef.current = LineSeries;
      const container = chartContainerRef.current;
      if (!container) {
        return;
      }

      const chart = createChart(container, {
        width: container.clientWidth,
        height: Math.max(container.clientHeight, 300),
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "hsl(var(--foreground))",
        },
        grid: {
          vertLines: { color: "hsl(var(--border))" },
          horzLines: { color: "hsl(var(--border))" },
        },
        timeScale: { borderColor: "hsl(var(--border))" },
        // Right = counts/totals, Left = rates/fractions (0–1)
        rightPriceScale: {
          visible: true,
          borderColor: "hsl(var(--border))",
          scaleMargins: { top: 0.08, bottom: 0.08 },
        },
        leftPriceScale: {
          visible: true,
          borderColor: "hsl(var(--border))",
          scaleMargins: { top: 0.08, bottom: 0.08 },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- lightweight-charts types vary by version
      chartRef.current = chart as any;

      // Compute scale groups: "right" for counts, "left" for rates 0–1
      const scaleGroups = computeScaleGroups(series);

      for (let i = 0; i < series.length; i++) {
        const s = series[i];
        if (!s || s.points.length === 0 || hiddenSeries.has(s.nodeId)) {
          continue;
        }

        const color = LINE_COLORS[i % LINE_COLORS.length];
        const priceScaleId = scaleGroups.get(s.nodeId) ?? "right";
        const lineSeries = chart.addSeries(LineSeries, {
          color,
          lineWidth: 2,
          title: s.nodeId,
          priceScaleId,
          lastValueVisible: true,
          priceLineVisible: false,
        });

        const rawPoints = s.points.map((p) => ({
          time: toChartTime(p.timestamp),
          value: p.value,
        }));
        lineSeries.setData(deduplicatePoints(rawPoints));
        seriesMapRef.current.set(s.nodeId, lineSeries);

        const signalForNode = signals.find((sig) => sig.nodeId === s.nodeId);
        if (signalForNode && signalForNode.events.length > 0) {
          const markers = signalForNode.events
            .filter((e) => e.fired)
            .map((e) => ({
              time: toChartTime(e.timestamp),
              position: "aboveBar" as const,
              color,
              shape: "arrowDown" as const,
              text: "●",
            }));
          if (markers.length > 0) {
            createSeriesMarkers(
              lineSeries,
              markers.toSorted(
                (a, b) => (a.time as number) - (b.time as number),
              ),
            );
          }
        }
      }

      // Enable pan-back after a short delay to avoid triggering on initial render
      if (enableTimerRef.current) {
        clearTimeout(enableTimerRef.current);
      }
      enableTimerRef.current = setTimeout(() => {
        if (!cancelled) {
          panEnabledRef.current = true;
        }
      }, 800);

      // Subscribe to visible range changes — trigger load when user pans to older data
      chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (!range || !panEnabledRef.current) {
          return;
        }
        if (panTimerRef.current) {
          clearTimeout(panTimerRef.current);
        }
        panTimerRef.current = setTimeout(() => {
          const visibleFrom = range.from as number;
          const oldestLoaded = oldestLoadedRef.current;
          if (oldestLoaded === null) {
            return;
          }
          const oldestLoadedSec = oldestLoaded / 1000;
          // If the user has panned to within 20% of the oldest loaded point, load more
          const visibleSpan = (range.to as number) - visibleFrom;
          const threshold = oldestLoadedSec + visibleSpan * 0.2;
          if (visibleFrom < threshold) {
            onPanBackRef.current(timestampToISO(oldestLoadedSec));
          }
        }, 300);
      });

      const observer = new ResizeObserver(() => {
        if (container) {
          chart.applyOptions({ width: container.clientWidth });
        }
      });
      observer.observe(container);
      observerRef.current = observer;
    };

    void asyncSetup();

    return (): void => {
      cancelled = true;
    };
  }, [series, signals, hiddenSeries]);

  return { chartContainerRef };
}

// ─── Indicator Toggles ───────────────────────────────────────────────────────

function IndicatorToggles({
  series,
  hiddenSeries,
  onToggle,
}: {
  series: SeriesItem[];
  hiddenSeries: Set<string>;
  onToggle: (nodeId: string) => void;
}): React.JSX.Element {
  return (
    <Div className="flex flex-wrap gap-1.5">
      {series.map((s, i) => {
        const isHidden = hiddenSeries.has(s.nodeId);
        const lineColor = LINE_COLORS[i % LINE_COLORS.length];
        return (
          <Button
            key={s.nodeId}
            variant="ghost"
            size="sm"
            onClick={() => onToggle(s.nodeId)}
            className={cn(
              "h-6 px-2 text-[11px] gap-1.5 rounded-full border",
              isHidden ? "opacity-40" : "",
            )}
          >
            <Div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                flexShrink: 0,
                backgroundColor: lineColor,
                opacity: isHidden ? 0.3 : 1,
              }}
            />
            {s.nodeId}
            {s.points.length > 0 && (
              <Span className="text-[10px] text-muted-foreground">
                ({s.points.length})
              </Span>
            )}
          </Button>
        );
      })}
    </Div>
  );
}

// ─── Main Widget ─────────────────────────────────────────────────────────────

export function GraphChartView({ field }: WidgetProps): React.JSX.Element {
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const outerMutations = useWidgetEndpointMutations();
  const locale = useWidgetLocale();

  const [resolution, setResolution] = useState<Resolution>(
    GraphResolution.ONE_DAY,
  );
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const [isFetching, setIsFetching] = useState(false);

  // Accumulate data pages — reset when resolution changes
  const [accSeries, setAccSeries] = useState<SeriesItem[]>([]);
  const [accSignals, setAccSignals] = useState<SignalItem[]>([]);
  // Track what cursor we last requested to avoid duplicate fetches
  const lastCursorRef = useRef<string | undefined>(undefined);
  // Track resolution that was last submitted to avoid setting same value
  const lastResolutionRef = useRef<Resolution>(GraphResolution.ONE_DAY);

  const graph = field.value?.graph;
  const isLoading = (outerMutations?.read?.isLoading ?? false) || isFetching;

  // Fetch data page directly — bypasses framework form which ignores stored
  // params when urlPathParams are present (see use-api-query.ts:hasUrlPathParams)
  const fetchPage = useCallback(
    (graphId: string, res: Resolution, cursor?: string): void => {
      setIsFetching(true);
      const params = new URLSearchParams({ id: graphId, resolution: res });
      if (cursor) {
        params.set("cursor", cursor);
      }
      const url = `/api/${locale}/system/unified-interface/vibe-sense/graphs/${graphId}/data?${params.toString()}`;
      void fetch(url, { credentials: "include" })
        .then(
          (r) =>
            r.json() as Promise<{ success: boolean; data: GetResponseOutput }>,
        )
        .then((json) => {
          if (json.success && json.data) {
            setAccSeries((prev) => mergeSeries(prev, json.data.series ?? []));
            setAccSignals((prev) =>
              mergeSignals(prev, json.data.signals ?? []),
            );
          }
          setIsFetching(false);
          return json;
        })
        .catch(() => {
          setIsFetching(false);
        });
    },
    [locale],
  );

  // When field.value changes (initial framework load), merge into accumulated data
  useEffect(() => {
    if (!field.value) {
      return;
    }
    setAccSeries((prev) => mergeSeries(prev, field.value?.series ?? []));
    setAccSignals((prev) => mergeSignals(prev, field.value?.signals ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run when field.value reference changes
  }, [field.value]);

  // When resolution changes, clear accumulated data and fetch first page
  const handleResolutionChange = useCallback(
    (res: Resolution): void => {
      if (res === lastResolutionRef.current || !graph) {
        return;
      }
      lastResolutionRef.current = res;
      setResolution(res);
      setAccSeries([]);
      setAccSignals([]);
      lastCursorRef.current = undefined;
      fetchPage(graph.id, res, undefined);
    },
    [graph, fetchPage],
  );

  // When user pans back, fetch older page at current resolution
  const handlePanBack = useCallback(
    (oldestVisibleISO: string): void => {
      if (lastCursorRef.current === oldestVisibleISO || !graph) {
        return;
      }
      lastCursorRef.current = oldestVisibleISO;
      fetchPage(graph.id, lastResolutionRef.current, oldestVisibleISO);
    },
    [graph, fetchPage],
  );

  const { chartContainerRef } = useChartRenderer(
    accSeries,
    accSignals,
    hiddenSeries,
    handlePanBack,
  );

  // ── Navigation handlers ──────────────────────────────────────────────────

  const handleBack = useCallback((): void => {
    if (navigation.canGoBack) {
      navigation.pop();
    } else {
      void (async (): Promise<void> => {
        const listDef = await import("../../definition");
        navigation.push(listDef.default.GET);
      })();
    }
  }, [navigation]);

  const handleBacktest = useCallback((): void => {
    if (!graph) {
      return;
    }
    void (async (): Promise<void> => {
      const backtestDef = await import("../backtest/definition");
      navigation.push(backtestDef.default.POST, {
        urlPathParams: { id: graph.id },
        renderInModal: true,
      });
    })();
  }, [navigation, graph]);

  const handleEdit = useCallback((): void => {
    if (!graph) {
      return;
    }
    void (async (): Promise<void> => {
      const editDef = await import("../edit/definition");
      navigation.push(editDef.default.PUT, {
        urlPathParams: { id: graph.id },
      });
    })();
  }, [navigation, graph]);

  const handleArchive = useCallback((): void => {
    if (!graph) {
      return;
    }
    void (async (): Promise<void> => {
      const archiveDef = await import("../archive/definition");
      navigation.push(archiveDef.default.POST, {
        urlPathParams: { id: graph.id },
        renderInModal: true,
        onSuccessCallback: () => outerMutations?.read?.refetch?.(),
      });
    })();
  }, [navigation, graph, outerMutations]);

  const handlePromote = useCallback((): void => {
    if (!graph) {
      return;
    }
    void (async (): Promise<void> => {
      const promoteDef = await import("../promote/definition");
      navigation.push(promoteDef.default.POST, {
        urlPathParams: { id: graph.id },
        renderInModal: true,
        onSuccessCallback: () => outerMutations?.read?.refetch?.(),
      });
    })();
  }, [navigation, graph, outerMutations]);

  const handleToggle = useCallback((nodeId: string): void => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // ── Loading / not found states ───────────────────────────────────────────

  if (!field.value && accSeries.length === 0) {
    return (
      <Div className="flex flex-col items-center justify-center h-[600px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <P className="text-sm text-muted-foreground">
          {t("get.widget.loading")}
        </P>
      </Div>
    );
  }

  if (!graph && accSeries.length === 0) {
    return (
      <Div className="flex flex-col items-center justify-center h-[600px] gap-4">
        <P className="text-sm text-muted-foreground">
          {t("get.errors.notFound.title")}
        </P>
        <Button variant="outline" size="sm" onClick={handleBack}>
          {t("get.widget.back")}
        </Button>
      </Div>
    );
  }

  const hasData = accSeries.some((s) => s.points.length > 0);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Div className="flex flex-col h-[calc(100vh-120px)] min-h-[500px] border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <Div className="flex items-center gap-2 px-3 h-10 border-b bg-background shrink-0 overflow-hidden">
        {/* Left: back + name */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-7 gap-1 px-2 shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("get.widget.back")}
        </Button>
        {graph && (
          <>
            <Span className="font-semibold text-sm truncate min-w-0 shrink">
              {graph.name}
            </Span>
            <Badge
              variant={graph.isActive ? "default" : "secondary"}
              className="text-[10px] px-1.5 py-0 h-5 shrink-0"
            >
              {graph.isActive
                ? t("get.widget.active")
                : t("get.widget.inactive")}
            </Badge>
          </>
        )}

        <Div className="flex-1" />

        {/* Resolution selector */}
        <Div className="flex items-center gap-0.5 border rounded-md px-0.5 py-0.5 bg-muted/30 shrink-0">
          {RESOLUTION_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant="ghost"
              size="sm"
              onClick={() => handleResolutionChange(opt.value as Resolution)}
              className={cn(
                "h-6 px-2 text-[11px] font-medium rounded-sm",
                resolution === opt.value
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </Button>
          ))}
        </Div>

        {/* Action buttons — icon only to save space */}
        <Div className="flex items-center gap-0.5 shrink-0">
          {isLoading && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground mr-1" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBacktest}
            className="h-7 w-7 p-0"
            title={t("get.widget.backtest")}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-7 w-7 p-0"
            title={t("get.widget.edit")}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          {graph?.ownerType !== "system" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePromote}
                className="h-7 w-7 p-0"
                title={t("get.widget.promote")}
              >
                <Shield className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleArchive}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                title={t("get.widget.archive")}
              >
                <Archive className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </Div>
      </Div>

      {/* Chart area */}
      <Div className="flex-1 min-h-0 flex flex-col">
        {!hasData && isLoading ? (
          <Div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : !hasData ? (
          <Div className="flex-1 flex flex-col items-center justify-center gap-3">
            <BarChart2 className="h-10 w-10 text-muted-foreground/40" />
            <P className="text-sm text-muted-foreground">
              {t("get.widget.noData")}
            </P>
          </Div>
        ) : (
          <>
            <Div ref={chartContainerRef} className="flex-1 min-h-[400px]" />
            <Div className="px-3 py-2 border-t bg-muted/20">
              <IndicatorToggles
                series={accSeries}
                hiddenSeries={hiddenSeries}
                onToggle={handleToggle}
              />
            </Div>
          </>
        )}
      </Div>
    </Div>
  );
}
