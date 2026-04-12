/**
 * Vibe Sense - Graph Chart View Widget
 *
 * Multi-pane resolution selector + lightweight-charts line chart.
 * Panning left loads older history via cursor-based pagination.
 * Data pages are accumulated client-side across fetches.
 * Features:
 *   - Multi-pane layout (series grouped by node config `pane` field)
 *   - Color-based scale groups (same color = same price scale within a pane)
 *   - Crosshair tooltip overlay (all series values at cursor)
 *   - Floating series legend with last values
 *   - Time scale + crosshair sync across panes
 *   - Loading shimmer
 *   - Pan-back toast
 *   - Dark/light theme support
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Archive } from "next-vibe-ui/ui/icons/Archive";
import { ArrowDown } from "next-vibe-ui/ui/icons/ArrowDown";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowUp } from "next-vibe-ui/ui/icons/ArrowUp";
import { BarChart2 } from "next-vibe-ui/ui/icons/BarChart2";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { Edit } from "next-vibe-ui/ui/icons/Edit";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { EyeOff } from "next-vibe-ui/ui/icons/EyeOff";
import { Grip } from "next-vibe-ui/ui/icons/Grip";
import { History } from "next-vibe-ui/ui/icons/History";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Maximize } from "next-vibe-ui/ui/icons/Maximize";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { X } from "next-vibe-ui/ui/icons/X";
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

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import {
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type {
  IChartApi,
  ISeriesApi,
  SeriesDefinition,
  SeriesType,
  Time,
  UTCTimestamp,
} from "lightweight-charts";

import {
  RESOLUTION_MS,
  type Resolution,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { GraphOwnerType, GraphResolution } from "../../../enum";

import type { GraphNodeConfig } from "../../../graph/schema";
import type { GraphConfig } from "../../../graph/types";
import type definition from "./definition";
import definitions from "./definition";

import editDefinitions from "../edit/definition";
import versionsDefinitions from "../versions/definition";

// ─── Types ────────────────────────────────────────────────────────────────────

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;

interface WidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_LINE_COLORS = [
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

// ─── Resolution → time scale config ──────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function humanizeNodeId(nodeId: string): string {
  return nodeId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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

// ─── Node Display Config ────────────────────────────────────────────────────

interface NodeDisplayConfig {
  pane: number | null;
  color: string;
  visible: boolean;
  scale?: "left" | "right";
}

/** Extract display config from graph node configs for all series */
function getNodeDisplayConfigs(
  series: SeriesItem[],
  nodeConfigs: Record<string, GraphNodeConfig> | undefined,
): Map<string, NodeDisplayConfig> {
  const result = new Map<string, NodeDisplayConfig>();
  let colorIdx = 0;
  for (const s of series) {
    const nc = nodeConfigs?.[s.nodeId];
    // pane: null = "no chart", pane: undefined = default pane 0
    const pane =
      nc && "pane" in nc && nc.pane === null ? null : (nc?.pane ?? 0);
    result.set(s.nodeId, {
      pane,
      color:
        nc?.color ??
        DEFAULT_LINE_COLORS[colorIdx % DEFAULT_LINE_COLORS.length] ??
        "#888",
      visible: nc?.visible !== false,
      scale: nc?.scale,
    });
    colorIdx++;
  }
  return result;
}

/** Group series by pane number. Skips hidden series and series with pane:null. */
function groupByPane(
  series: SeriesItem[],
  displayConfigs: Map<string, NodeDisplayConfig>,
): Map<number, SeriesItem[]> {
  const panes = new Map<number, SeriesItem[]>();
  for (const s of series) {
    const cfg = displayConfigs.get(s.nodeId);
    if (cfg && !cfg.visible) {
      continue; // Skip legend-hidden series
    }
    if (cfg?.pane === null) {
      continue; // Skip "no chart" series (pane explicitly set to null)
    }
    const pane = cfg?.pane ?? 0;
    const arr = panes.get(pane) ?? [];
    arr.push(s);
    panes.set(pane, arr);
  }
  return panes;
}

/**
 * Compute scale groups within a pane: series sharing the same color share a price scale.
 * This lets users control scale grouping via the color picker in the editor.
 * Max 2 visible scales per pane (right + left). 3rd+ color groups go on "right".
 * Explicit `scale` config on a node overrides the color-based assignment.
 */
function computeScaleGroups(
  paneSeries: SeriesItem[],
  displayConfigs: Map<string, NodeDisplayConfig>,
): Map<string, string> {
  const result = new Map<string, string>();

  const colorToScale = new Map<string, string>();
  let scaleCounter = 0;

  for (const s of paneSeries) {
    const cfg = displayConfigs.get(s.nodeId);

    // Explicit scale from config takes priority
    if (cfg?.scale) {
      result.set(s.nodeId, cfg.scale);
      continue;
    }

    const color = cfg?.color ?? "#888";
    let scaleId = colorToScale.get(color);
    if (!scaleId) {
      if (scaleCounter === 0) {
        scaleId = "right";
      } else if (scaleCounter === 1) {
        scaleId = "left";
      } else {
        // 3rd+ color groups merge into "right" to avoid hidden uncontrollable scales
        scaleId = "right";
      }
      colorToScale.set(color, scaleId);
      scaleCounter++;
    }
    result.set(s.nodeId, scaleId);
  }
  return result;
}

// ─── Crosshair overlay types ──────────────────────────────────────────────────

interface CrosshairPoint {
  nodeId: string;
  value: number;
  color: string;
}

interface CrosshairState {
  x: number;
  y: number;
  time: string;
  points: CrosshairPoint[];
}

// ─── Theme Colors ────────────────────────────────────────────────────────────

/** Resolve CSS custom properties to computed color strings for canvas use */
function getChartColors(): {
  textColor: string;
  borderColor: string;
  bgColor: string;
} {
  const style = getComputedStyle(document.documentElement);
  const fg = style.getPropertyValue("--foreground").trim();
  const border = style.getPropertyValue("--border").trim();
  return {
    textColor: fg ? `hsl(${fg})` : "#888",
    borderColor: border ? `hsl(${border})` : "#333",
    bgColor: "transparent",
  };
}

// ─── Chart Renderer (Multi-Pane) ─────────────────────────────────────────────

type LwcSeries = ISeriesApi<SeriesType, Time>;

interface PaneState {
  chart: IChartApi;
  container: HTMLDivElement;
  seriesMap: Map<string, LwcSeries>;
}

/** Render series data into chart panes - used both by chart setup and data effect */
function renderSeriesData(
  series: SeriesItem[],
  signals: SignalItem[],
  panesRef: React.RefObject<Map<number, PaneState>>,
  LineSeriesCtorRef: React.RefObject<SeriesDefinition<"Line"> | null>,
  displayConfigsRef: React.RefObject<Map<string, NodeDisplayConfig>>,
  onLastValuesRef: React.RefObject<(values: Map<string, number>) => void>,
  oldestLoadedRef: React.MutableRefObject<number | null>,
  didFitContentRef: React.MutableRefObject<boolean>,
): void {
  if (!series.length || panesRef.current.size === 0) {
    return;
  }

  // Track oldest point
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

  // Emit last values
  const lastVals = new Map<string, number>();
  for (const s of series) {
    if (s.points.length > 0) {
      const last = s.points[s.points.length - 1];
      if (last) {
        lastVals.set(s.nodeId, last.value);
      }
    }
  }
  onLastValuesRef.current(lastVals);

  // Group series by pane and render
  const paneGroups = groupByPane(series, displayConfigsRef.current);

  for (const [paneNum, paneSeries] of paneGroups) {
    const paneState = panesRef.current.get(paneNum);
    if (!paneState || !LineSeriesCtorRef.current) {
      continue;
    }

    const scaleGroups = computeScaleGroups(
      paneSeries,
      displayConfigsRef.current,
    );

    for (const s of paneSeries) {
      if (s.points.length === 0) {
        continue;
      }
      const rawPoints = s.points.map((p) => ({
        time: toChartTime(p.timestamp),
        value: p.value,
      }));
      const existing = paneState.seriesMap.get(s.nodeId);
      if (existing) {
        existing.setData(deduplicatePoints(rawPoints));
      } else {
        const cfg = displayConfigsRef.current.get(s.nodeId);
        const color = cfg?.color ?? "#888";
        const priceScaleId = scaleGroups.get(s.nodeId) ?? "right";
        const lwcSeries = paneState.chart.addSeries(LineSeriesCtorRef.current, {
          color,
          lineWidth: 2,
          title: humanizeNodeId(s.nodeId),
          priceScaleId,
          lastValueVisible: true,
          priceLineVisible: false,
        });
        lwcSeries.setData(deduplicatePoints(rawPoints));
        paneState.seriesMap.set(s.nodeId, lwcSeries);

        const signalForNode = signals.find((sig) => sig.nodeId === s.nodeId);
        if (signalForNode && signalForNode.events.length > 0) {
          void import("lightweight-charts").then(({ createSeriesMarkers }) => {
            const markers = signalForNode.events
              .filter((e) => e.fired)
              .map((e) => ({
                time: toChartTime(e.timestamp),
                position: "aboveBar" as const,
                color,
                shape: "arrowDown" as const,
                text: "\u25CF",
              }));
            if (markers.length > 0) {
              createSeriesMarkers(
                lwcSeries,
                markers.toSorted(
                  (a, b) => (a.time as number) - (b.time as number),
                ),
              );
            }
            return undefined;
          });
        }
      }
    }

    // Show left scale only if a series in this pane uses it
    const usedScaleIds = new Set(scaleGroups.values());
    paneState.chart.priceScale("left").applyOptions({
      visible: usedScaleIds.has("left"),
    });
  }

  // Fit content on first load (all panes)
  if (!didFitContentRef.current) {
    didFitContentRef.current = true;
    for (const [, pane] of panesRef.current) {
      pane.chart.timeScale().fitContent();
    }
  }
}

/** Sync price scale widths across panes so chart areas align vertically.
 *  When ANY pane has a visible left scale, ALL panes show it for alignment.
 *  Returns the max left/right widths for legend positioning. */
function syncScaleWidths(
  panesRef: React.RefObject<Map<number, PaneState>>,
  onWidths?: (widths: { left: number; right: number }) => void,
): void {
  let maxRight = 0;
  let maxLeft = 0;
  let anyLeftVisible = false;

  for (const [, pane] of panesRef.current) {
    if (pane.seriesMap.size === 0) {
      continue;
    }
    const rw = pane.chart.priceScale("right").width();
    const lw = pane.chart.priceScale("left").width();
    if (rw > 0) {
      maxRight = Math.max(maxRight, rw);
    }
    if (lw > 0) {
      maxLeft = Math.max(maxLeft, lw);
      anyLeftVisible = true;
    }
  }

  if (panesRef.current.size > 1) {
    for (const [, pane] of panesRef.current) {
      if (maxRight > 0) {
        pane.chart.priceScale("right").applyOptions({ minimumWidth: maxRight });
      }
      if (anyLeftVisible) {
        // If any pane has a visible left scale, force all panes to show it
        // so chart areas align vertically across panes
        pane.chart.priceScale("left").applyOptions({
          visible: true,
          minimumWidth: Math.max(maxLeft, 60),
        });
      } else {
        // No pane uses left scale - ensure all panes hide it consistently
        pane.chart.priceScale("left").applyOptions({
          visible: false,
          minimumWidth: 0,
        });
      }
    }
  }
  // Report widths for legend positioning
  onWidths?.({
    left: anyLeftVisible ? Math.max(maxLeft, 60) : 0,
    right: maxRight || 60,
  });
}

function useMultiPaneRenderer(
  series: SeriesItem[],
  signals: SignalItem[],
  hiddenSeries: Set<string>,
  resolution: Resolution,
  displayConfigs: Map<string, NodeDisplayConfig>,
  onPanBack: (oldestVisibleISO: string) => void,
  onCrosshairMove: (state: CrosshairState | null) => void,
  onLastValues: (values: Map<string, number>) => void,
): {
  paneContainerRef: React.RefObject<HTMLDivElement | null>;
  panesRef: React.RefObject<Map<number, PaneState>>;
  paneNumbers: number[];
  scaleWidths: { left: number; right: number };
} {
  const paneContainerRef = useRef<HTMLDivElement>(null);
  const [chartKey, setChartKey] = useState(0);
  // Counter instead of boolean to ensure the data effect re-runs after each chart setup
  const [chartReadyGen, setChartReadyGen] = useState(0);
  const [scaleWidths, setScaleWidths] = useState({ left: 60, right: 60 });

  const panesRef = useRef<Map<number, PaneState>>(new Map());
  const LineSeriesCtorRef = useRef<SeriesDefinition<"Line"> | null>(null);
  const themeObserverRef = useRef<MutationObserver | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const onPanBackRef = useRef(onPanBack);
  onPanBackRef.current = onPanBack;
  const onCrosshairMoveRef = useRef(onCrosshairMove);
  onCrosshairMoveRef.current = onCrosshairMove;
  const onLastValuesRef = useRef(onLastValues);
  onLastValuesRef.current = onLastValues;
  const displayConfigsRef = useRef(displayConfigs);
  displayConfigsRef.current = displayConfigs;

  const panTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const oldestLoadedRef = useRef<number | null>(null);
  const panEnabledRef = useRef(false);
  const didFitContentRef = useRef(false);
  const resolutionRef = useRef<Resolution>(resolution);
  resolutionRef.current = resolution;
  // Guard to prevent recursive syncing
  const syncingRef = useRef(false);

  // Derive pane numbers from display configs (not from effect state)
  // Stabilized as a string key to avoid recreating charts on color-only config changes
  const paneKey = useMemo((): string => {
    const paneSet = new Set<number>();
    for (const [, cfg] of displayConfigs) {
      // Include pane even if series is hidden - pane should persist
      if (cfg.pane !== null) {
        paneSet.add(cfg.pane);
      }
    }
    if (paneSet.size === 0) {
      paneSet.add(0);
    }
    return [...paneSet].toSorted((a, b) => a - b).join(",");
  }, [displayConfigs]);

  const paneNumbers = useMemo(
    (): number[] => paneKey.split(",").map(Number),
    [paneKey],
  );

  // ── Resolution change → bump chartKey to recreate charts ──────────────

  useEffect(() => {
    onCrosshairMoveRef.current(null);
    panEnabledRef.current = false;
    didFitContentRef.current = false;
    setChartReadyGen(0);
    setChartKey((k) => k + 1);
  }, [resolution]);

  // ── Chart setup - runs on mount and chartKey changes ─────────────────────

  useEffect(() => {
    const outerContainer = paneContainerRef.current;
    if (!outerContainer) {
      return;
    }

    let cancelled = false;

    const asyncSetup = async (): Promise<void> => {
      const { createChart, ColorType, LineSeries } =
        await import("lightweight-charts");

      if (cancelled) {
        return;
      }
      LineSeriesCtorRef.current = LineSeries;

      const sortedPanes = paneNumbers;

      const res = resolutionRef.current;
      const resMs = RESOLUTION_MS[res];
      const showTime = resMs < 24 * 3600_000;
      const barSpacing =
        RESOLUTION_BAR_SPACING[res] ??
        RESOLUTION_BAR_SPACING[GraphResolution.ONE_HOUR];
      const tickFmt = makeTickFormatter(res);
      const colors = getChartColors();

      // Create a chart per pane
      const paneCount = sortedPanes.length;
      const allCharts: IChartApi[] = [];

      for (let pi = 0; pi < paneCount; pi++) {
        const paneNum = sortedPanes[pi];
        if (paneNum === undefined) {
          continue;
        }
        const containerEl = outerContainer.querySelector<HTMLDivElement>(
          `#vs-pane-${String(paneNum)}`,
        );
        if (!containerEl || cancelled) {
          continue;
        }

        // Pane 0 (main) gets more height, others share the rest
        const isMainPane = pi === 0;
        const chart = createChart(containerEl, {
          width: containerEl.clientWidth,
          height: Math.max(containerEl.clientHeight, isMainPane ? 200 : 150),
          layout: {
            background: { type: ColorType.Solid, color: colors.bgColor },
            textColor: colors.textColor,
          },
          grid: {
            vertLines: { color: colors.borderColor },
            horzLines: { color: colors.borderColor },
          },
          crosshair: {
            mode: 1,
          },
          timeScale: {
            borderColor: colors.borderColor,
            timeVisible: showTime,
            secondsVisible: false,
            barSpacing,
            tickMarkFormatter: tickFmt,
            shiftVisibleRangeOnNewBar: false,
            // Hide time axis on all panes except the last
            visible: pi === paneCount - 1,
          },
          rightPriceScale: {
            visible: true,
            borderColor: colors.borderColor,
            scaleMargins: { top: 0.08, bottom: 0.08 },
            minimumWidth: 60,
          },
          leftPriceScale: {
            visible: false,
            borderColor: colors.borderColor,
            scaleMargins: { top: 0.08, bottom: 0.08 },
            minimumWidth: 60,
          },
        });

        allCharts.push(chart);
        panesRef.current.set(paneNum, {
          chart,
          container: containerEl,
          seriesMap: new Map(),
        });

        // Crosshair move → tooltip
        chart.subscribeCrosshairMove((param) => {
          if (
            !param ||
            !param.point ||
            param.point.x < 0 ||
            param.point.y < 0
          ) {
            onCrosshairMoveRef.current(null);
            // Clear crosshair on all panes when mouse leaves
            if (!syncingRef.current) {
              syncingRef.current = true;
              for (const [, otherPane] of panesRef.current) {
                otherPane.chart.clearCrosshairPosition();
              }
              syncingRef.current = false;
            }
            return;
          }
          // Collect values from ALL panes, not just the hovered one
          const crosshairPoints: CrosshairPoint[] = [];
          for (const [, paneState] of panesRef.current) {
            for (const [nodeId, lwcS] of paneState.seriesMap) {
              const d = param.seriesData?.get(lwcS);
              const val =
                d !== undefined && "value" in d && typeof d.value === "number"
                  ? d.value
                  : undefined;
              if (val !== undefined) {
                const cfg = displayConfigsRef.current.get(nodeId);
                crosshairPoints.push({
                  nodeId,
                  value: val,
                  color: cfg?.color ?? "#888",
                });
              }
            }
          }
          const timeVal =
            typeof param.time === "number" ? param.time : undefined;
          const timeStr =
            timeVal !== undefined
              ? makeTickFormatter(resolutionRef.current)(timeVal)
              : "";
          onCrosshairMoveRef.current({
            x: param.point.x,
            y: param.point.y,
            time: timeStr,
            points: crosshairPoints,
          });

          // Sync crosshair vertical line to other panes via setCrosshairPosition.
          // Using NaN for price shows only the time line (no horizontal price line).
          if (!syncingRef.current && param.time !== undefined) {
            syncingRef.current = true;
            for (const [otherPaneNum, otherPane] of panesRef.current) {
              if (otherPaneNum !== paneNum) {
                const firstSeries = otherPane.seriesMap.values().next().value;
                if (firstSeries) {
                  otherPane.chart.setCrosshairPosition(
                    NaN,
                    param.time,
                    firstSeries,
                  );
                }
              }
            }
            syncingRef.current = false;
          }
        });
      }

      // Sync time scales across panes
      for (let pi = 0; pi < allCharts.length; pi++) {
        const chart = allCharts[pi];
        if (!chart) {
          continue;
        }
        chart.timeScale().subscribeVisibleLogicalRangeChange((logicalRange) => {
          if (syncingRef.current || !logicalRange) {
            return;
          }
          syncingRef.current = true;
          for (let oi = 0; oi < allCharts.length; oi++) {
            if (oi === pi) {
              continue;
            }
            const other = allCharts[oi];
            if (other) {
              other.timeScale().setVisibleLogicalRange(logicalRange);
            }
          }
          syncingRef.current = false;
        });
      }

      // Pan-back detection on the first chart's time scale
      const firstChart = allCharts[0];
      if (firstChart) {
        firstChart.timeScale().subscribeVisibleTimeRangeChange((range) => {
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
            const visibleSpan = (range.to as number) - visibleFrom;
            const threshold = oldestLoadedSec + visibleSpan * 0.2;
            if (visibleFrom < threshold) {
              onPanBackRef.current(timestampToISO(oldestLoadedSec));
            }
          }, 300);
        });
      }

      // Theme observer (shared for all panes)
      const themeObserver = new MutationObserver(() => {
        const updated = getChartColors();
        for (const [, pane] of panesRef.current) {
          pane.chart.applyOptions({
            layout: {
              background: { type: ColorType.Solid, color: updated.bgColor },
              textColor: updated.textColor,
            },
            grid: {
              vertLines: { color: updated.borderColor },
              horzLines: { color: updated.borderColor },
            },
            timeScale: { borderColor: updated.borderColor },
            rightPriceScale: { borderColor: updated.borderColor },
            leftPriceScale: { borderColor: updated.borderColor },
          });
        }
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "style", "data-theme"],
      });
      themeObserverRef.current = themeObserver;

      // Resize observer
      const resizeObserver = new ResizeObserver(() => {
        for (const [, pane] of panesRef.current) {
          pane.chart.applyOptions({
            width: pane.container.clientWidth,
            height: pane.container.clientHeight,
          });
        }
      });
      resizeObserver.observe(outerContainer);
      for (const [, pane] of panesRef.current) {
        resizeObserver.observe(pane.container);
      }
      resizeObserverRef.current = resizeObserver;

      if (enableTimerRef.current) {
        clearTimeout(enableTimerRef.current);
      }
      enableTimerRef.current = setTimeout(() => {
        if (!cancelled) {
          panEnabledRef.current = true;
        }
      }, 800);

      // Render any already-available data immediately (avoids race with data effect)
      renderSeriesData(
        series,
        signals,
        panesRef,
        LineSeriesCtorRef,
        displayConfigsRef,
        onLastValuesRef,
        oldestLoadedRef,
        didFitContentRef,
      );

      setChartReadyGen((g) => g + 1);
    };

    void asyncSetup();

    // Snapshot refs so cleanup doesn't access stale .current
    const themeObs = themeObserverRef;
    const resizeObs = resizeObserverRef;
    const panes = panesRef;
    const panTimer = panTimerRef;
    const enableTimer = enableTimerRef;

    return (): void => {
      cancelled = true;
      themeObs.current?.disconnect();
      themeObs.current = null;
      resizeObs.current?.disconnect();
      resizeObs.current = null;
      for (const [, pane] of panes.current) {
        pane.chart.remove();
        pane.seriesMap.clear();
      }
      panes.current.clear();
      setChartReadyGen(0);
      panEnabledRef.current = false;
      didFitContentRef.current = false;
      if (panTimer.current) {
        clearTimeout(panTimer.current);
        panTimer.current = null;
      }
      if (enableTimer.current) {
        clearTimeout(enableTimer.current);
        enableTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chartKey + paneKey are the intentional triggers
  }, [chartKey, paneKey]);

  // ── Data rendering ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!chartReadyGen || !series.length || panesRef.current.size === 0) {
      return;
    }
    renderSeriesData(
      series,
      signals,
      panesRef,
      LineSeriesCtorRef,
      displayConfigsRef,
      onLastValuesRef,
      oldestLoadedRef,
      didFitContentRef,
    );
    // Defer scale sync until after the browser has laid out the new series
    const rafId = requestAnimationFrame(() => {
      syncScaleWidths(panesRef, setScaleWidths);
    });
    return (): void => cancelAnimationFrame(rafId);
  }, [chartReadyGen, series, signals]);

  // ── Visibility toggling ─────────────────────────────────────────────────

  useEffect(() => {
    for (const [, pane] of panesRef.current) {
      for (const [nodeId, lwcSeries] of pane.seriesMap) {
        lwcSeries.applyOptions({ visible: !hiddenSeries.has(nodeId) });
      }
    }
  }, [hiddenSeries]);

  return { paneContainerRef, panesRef, paneNumbers, scaleWidths };
}

// ─── Loading Shimmer ──────────────────────────────────────────────────────────

const SHIMMER_HEIGHTS = [
  "h-[40%]",
  "h-[60%]",
  "h-[35%]",
  "h-[80%]",
  "h-[55%]",
  "h-[70%]",
  "h-[45%]",
  "h-[90%]",
  "h-[65%]",
  "h-[50%]",
  "h-[75%]",
  "h-[85%]",
  "h-[60%]",
  "h-[70%]",
  "h-[55%]",
] as const;

function ChartShimmer(): React.JSX.Element {
  return (
    <Div className="flex-1 flex flex-col gap-2 p-4 animate-pulse">
      <Div className="flex items-end gap-1 h-full">
        {SHIMMER_HEIGHTS.map((h, i) => (
          <Div key={i} className={cn("flex-1 bg-muted rounded-sm", h)} />
        ))}
      </Div>
    </Div>
  );
}

// ─── Series Legend ────────────────────────────────────────────────────────────

function PaneLegend({
  paneNum,
  series,
  hiddenSeries,
  lastValues,
  crosshair,
  displayConfigs,
  leftOffset = 60,
  onToggleSeries,
  collapsed,
  onToggleCollapse,
}: {
  paneNum: number;
  series: SeriesItem[];
  hiddenSeries: Set<string>;
  lastValues: Map<string, number>;
  crosshair: CrosshairState | null;
  displayConfigs: Map<string, NodeDisplayConfig>;
  leftOffset?: number;
  onToggleSeries: (nodeId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}): React.JSX.Element {
  const paneSeries = series.filter((s) => {
    const cfg = displayConfigs.get(s.nodeId);
    // Show all pane-assigned series in legend (hidden ones appear dimmed, not removed)
    return cfg?.pane !== null && (cfg?.pane ?? 0) === paneNum;
  });

  const legendId = `vs-legend-${String(paneNum)}`;
  useEffect(() => {
    const el = document.getElementById(legendId);
    if (!el) {
      return;
    }
    el.style.left = `${String(leftOffset + 4)}px`;
  }, [legendId, leftOffset]);

  return (
    <Div id={legendId} className="absolute top-1 z-20 pointer-events-none">
      <Div className="inline-flex flex-col gap-0.5">
        {/* Legend collapse toggle */}
        <Div
          className="flex items-center gap-1 pointer-events-auto cursor-pointer"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand legend" : "Collapse legend"}
        >
          <Div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded border border-border/30 text-muted-foreground/60 hover:text-muted-foreground hover:bg-background/95 hover:border-border/70 transition-all">
            {collapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            {!collapsed && <BarChart2 className="h-3 w-3" />}
          </Div>
        </Div>
        {/* Series items */}
        {!collapsed &&
          paneSeries.map((s) => {
            const isHidden = hiddenSeries.has(s.nodeId);
            const cfg = displayConfigs.get(s.nodeId);
            const color = cfg?.color ?? "#888";
            const displayValue =
              crosshair?.points.find((p) => p.nodeId === s.nodeId)?.value ??
              lastValues.get(s.nodeId);

            return (
              <Div
                key={s.nodeId}
                className={cn(
                  "group/legend flex items-center gap-2 bg-background/85 backdrop-blur-sm px-2 py-1 rounded border border-border/40 cursor-pointer pointer-events-auto whitespace-nowrap transition-all",
                  isHidden
                    ? "opacity-40 border-border/20"
                    : "hover:border-border/70 hover:bg-background/95",
                )}
                onClick={() => onToggleSeries(s.nodeId)}
                title={isHidden ? "Show series" : "Hide series"}
              >
                {/* Series color indicator: line + center dot */}
                <Div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "20px",
                    flexShrink: 0,
                  }}
                >
                  <Div
                    style={{
                      width: "20px",
                      height: "2px",
                      backgroundColor: isHidden ? "#555" : color,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: isHidden ? "#555" : color,
                        border: "1.5px solid hsl(var(--background))",
                        flexShrink: 0,
                      }}
                    />
                  </Div>
                </Div>
                <Span
                  className={cn(
                    "text-[11px] font-mono",
                    isHidden
                      ? "line-through text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  {humanizeNodeId(s.nodeId)}
                </Span>
                {displayValue !== undefined && !isHidden && (
                  <Span className="text-[11px] font-semibold tabular-nums text-foreground shrink-0 ml-1">
                    {formatValue(displayValue)}
                  </Span>
                )}
                {/* Eye toggle - shown on hover */}
                <Div className="ml-auto opacity-0 group-hover/legend:opacity-100 transition-opacity shrink-0">
                  {isHidden ? (
                    <Eye className="h-2.5 w-2.5 text-muted-foreground/60" />
                  ) : (
                    <EyeOff className="h-2.5 w-2.5 text-muted-foreground/60" />
                  )}
                </Div>
              </Div>
            );
          })}
      </Div>
    </Div>
  );
}

/**
 * Hover-only pill cluster of pane actions: collapse/expand, move up/down, maximize/restore.
 * Shown on the right side of the pane. Hidden on non-touch devices until hover.
 */
function PaneActions({
  paneNum,
  rightOffset,
  isCollapsed,
  isFirst,
  isLast,
  isSinglePane,
  isMaximized,
  isSaving,
  onCollapse,
  onMoveUp,
  onMoveDown,
  onMaximize,
}: {
  paneNum: number;
  rightOffset: number;
  isCollapsed: boolean;
  isFirst: boolean;
  isLast: boolean;
  isSinglePane: boolean;
  isMaximized: boolean;
  isSaving: boolean;
  onCollapse: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMaximize: () => void;
}): React.JSX.Element {
  const actionsId = `vs-pane-actions-${String(paneNum)}`;
  useEffect(() => {
    const el = document.getElementById(actionsId);
    if (!el) {
      return;
    }
    el.style.right = `${String(rightOffset + 4)}px`;
  }, [actionsId, rightOffset]);

  return (
    <Div
      id={actionsId}
      className={cn(
        "absolute top-1 z-20 pointer-events-auto",
        // Hide on hover-capable devices until hovered; always visible on touch
        "opacity-0 [@media(hover:none)]:opacity-100",
        // Parent pane wrapper must have class `group/pane` for this to work
        "group-hover/pane:opacity-100",
        "transition-opacity duration-150",
      )}
    >
      <Div className="flex items-center gap-0 bg-background/85 backdrop-blur-sm rounded border border-border/30 overflow-hidden shadow-sm">
        {isSaving && (
          <Div className="px-2 py-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground/60" />
          </Div>
        )}
        {!isSinglePane && !isFirst && (
          <Div
            className="px-2 py-1 text-muted-foreground/60 hover:text-muted-foreground hover:bg-accent/60 cursor-pointer transition-colors"
            onClick={onMoveUp}
            title={`Move pane ${String(paneNum)} up`}
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Div>
        )}
        {!isSinglePane && !isLast && (
          <Div
            className="px-2 py-1 text-muted-foreground/60 hover:text-muted-foreground hover:bg-accent/60 cursor-pointer transition-colors"
            onClick={onMoveDown}
            title={`Move pane ${String(paneNum)} down`}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Div>
        )}
        {!isSinglePane && (
          <Div
            className="px-2 py-1 text-muted-foreground/60 hover:text-muted-foreground hover:bg-accent/60 cursor-pointer transition-colors"
            onClick={onMaximize}
            title={isMaximized ? "Restore pane" : "Maximize pane"}
          >
            <Maximize className="h-3.5 w-3.5" />
          </Div>
        )}
        <Div
          className="px-2 py-1 text-muted-foreground/60 hover:text-muted-foreground hover:bg-accent/60 cursor-pointer transition-colors"
          onClick={onCollapse}
          title={isCollapsed ? "Expand pane" : "Collapse pane"}
        >
          {isCollapsed ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" />
          )}
        </Div>
      </Div>
    </Div>
  );
}

/** Collapsed pane header bar - shows first series + count on left, hover actions on right */
function CollapsedPaneBar({
  paneNum,
  seriesCount,
  firstSeriesName,
  firstSeriesColor,
  isFirst,
  isLast,
  isSinglePane,
  isSaving,
  onExpand,
  onMoveUp,
  onMoveDown,
}: {
  paneNum: number;
  seriesCount: number;
  firstSeriesName: string;
  firstSeriesColor: string;
  isFirst: boolean;
  isLast: boolean;
  isSinglePane: boolean;
  isSaving: boolean;
  onExpand: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}): React.JSX.Element {
  return (
    <Div className="h-8 shrink-0 flex items-center px-3 gap-2 border-b border-border/30 group/collapsed hover:bg-accent/10 transition-colors">
      {/* Left: expand + series info */}
      <Div
        className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
        onClick={onExpand}
      >
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
        <Div
          style={{
            width: "10px",
            height: "3px",
            borderRadius: "1.5px",
            backgroundColor: firstSeriesColor,
            flexShrink: 0,
          }}
        />
        <Span className="text-[11px] font-mono text-muted-foreground/80 truncate">
          {firstSeriesName}
        </Span>
        {seriesCount > 1 && (
          <Span className="text-[11px] text-muted-foreground/50 shrink-0">
            {/* eslint-disable-next-line i18n/no-literal-string -- UI label */}
            {`+${String(seriesCount - 1)}`}
          </Span>
        )}
      </Div>
      {/* Right: hover-only move actions */}
      <Div className="flex items-center gap-0.5 opacity-0 [@media(hover:none)]:opacity-100 group-hover/collapsed:opacity-100 transition-opacity shrink-0">
        {isSaving && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground/50 mr-0.5" />
        )}
        {!isSinglePane && !isFirst && (
          <Div
            className="px-1.5 py-1 text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent/60 rounded cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            title={`Move pane ${String(paneNum)} up`}
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Div>
        )}
        {!isSinglePane && !isLast && (
          <Div
            className="px-1.5 py-1 text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent/60 rounded cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            title={`Move pane ${String(paneNum)} down`}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Div>
        )}
      </Div>
    </Div>
  );
}

// ─── Crosshair Tooltip ────────────────────────────────────────────────────────

function CrosshairTooltip({
  crosshair,
  containerRef,
}: {
  crosshair: CrosshairState;
  containerRef: React.RefObject<HTMLDivElement | null>;
}): React.JSX.Element | null {
  if (!crosshair.points.length || !containerRef.current) {
    return null;
  }
  const containerWidth = containerRef.current.clientWidth;
  const tooltipWidth = 180;
  // Position tooltip offset from cursor - 40px right, flip left if overflows
  const left =
    crosshair.x + tooltipWidth + 40 > containerWidth
      ? crosshair.x - tooltipWidth - 16
      : crosshair.x + 40;
  // Follow cursor Y with clamping so tooltip stays within chart bounds
  const containerHeight = containerRef.current.clientHeight;
  const tooltipEstHeight = 60 + crosshair.points.length * 18;
  const top = Math.min(
    Math.max(crosshair.y - tooltipEstHeight / 2, 8),
    containerHeight - tooltipEstHeight - 8,
  );

  return (
    <Div
      style={{
        position: "absolute",
        zIndex: 30,
        left,
        top,
        minWidth: tooltipWidth,
        pointerEvents: "none",
      }}
    >
      <Div className="bg-popover/95 backdrop-blur-sm border border-border shadow-lg rounded-lg px-2.5 py-2">
        <P className="text-[10px] text-muted-foreground mb-1 font-medium tabular-nums">
          {crosshair.time}
        </P>
        <Div className="h-px bg-border/50 mb-1.5" />
        <Div className="flex flex-col gap-0.5">
          {crosshair.points.map((p) => (
            <Div
              key={p.nodeId}
              className="flex items-center justify-between gap-3"
            >
              <Div className="flex items-center gap-1 min-w-0">
                <Div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: p.color,
                    flexShrink: 0,
                  }}
                />
                <Span className="text-[10px] font-mono truncate text-muted-foreground">
                  {humanizeNodeId(p.nodeId)}
                </Span>
              </Div>
              <Span className="text-[10px] font-semibold tabular-nums shrink-0">
                {formatValue(p.value)}
              </Span>
            </Div>
          ))}
        </Div>
      </Div>
    </Div>
  );
}

// ─── Pane Drag Handle ────────────────────────────────────────────────────────

function PaneDragHandle({
  paneAbove,
  paneBelow,
  containerRef,
  panesRef,
}: {
  paneAbove: number;
  paneBelow: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  panesRef: React.RefObject<Map<number, PaneState>>;
}): React.JSX.Element {
  const handleElRef = useRef<HTMLDivElement>(null);

  // Attach mousedown via ref to avoid DivProps type constraint
  useEffect(() => {
    const el = handleElRef.current;
    if (!el) {
      return;
    }
    const handler = (e: MouseEvent): void => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) {
        return;
      }
      // Find the pane wrapper divs (parent of the vs-pane-N divs)
      const aboveChart = container.querySelector<HTMLDivElement>(
        `#vs-pane-${String(paneAbove)}`,
      );
      const belowChart = container.querySelector<HTMLDivElement>(
        `#vs-pane-${String(paneBelow)}`,
      );
      const aboveEl = aboveChart?.parentElement as HTMLDivElement | null;
      const belowEl = belowChart?.parentElement as HTMLDivElement | null;
      if (!aboveEl || !belowEl) {
        return;
      }

      const startY = e.clientY;
      const startAboveH = aboveEl.clientHeight;
      const startBelowH = belowEl.clientHeight;
      const minH = 120;

      const onMouseMove = (ev: MouseEvent): void => {
        const dy = ev.clientY - startY;
        const newAbove = Math.max(minH, startAboveH + dy);
        const newBelow = Math.max(minH, startBelowH - dy);
        if (newAbove >= minH && newBelow >= minH) {
          aboveEl.style.flex = "none";
          belowEl.style.flex = "none";
          aboveEl.style.height = `${String(newAbove)}px`;
          belowEl.style.height = `${String(newBelow)}px`;
          const abovePane = panesRef.current.get(paneAbove);
          const belowPane = panesRef.current.get(paneBelow);
          abovePane?.chart.applyOptions({
            width: aboveChart?.clientWidth ?? aboveEl.clientWidth,
            height: newAbove,
          });
          belowPane?.chart.applyOptions({
            width: belowChart?.clientWidth ?? belowEl.clientWidth,
            height: newBelow,
          });
        }
      };

      const onMouseUp = (): void => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        // Force time scale visible on the last pane (it may have been hidden by lwc during resize)
        // Find the highest pane number (last in the layout) and force its time scale visible
        let lastPaneNum = -1;
        for (const [pNum] of panesRef.current) {
          if (pNum > lastPaneNum) {
            lastPaneNum = pNum;
          }
        }
        for (const [pNum, pane] of panesRef.current) {
          pane.chart
            .timeScale()
            .applyOptions({ visible: pNum === lastPaneNum });
        }
        // Re-sync scale widths after drag
        syncScaleWidths(panesRef);
      };

      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };
    el.addEventListener("mousedown", handler);
    return (): void => el.removeEventListener("mousedown", handler);
  }, [containerRef, panesRef, paneAbove, paneBelow]);

  return (
    <Div
      ref={handleElRef}
      role="separator"
      className="h-[4px] shrink-0 cursor-row-resize relative overflow-visible bg-border/50 hover:bg-border transition-colors group"
    >
      <Grip className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground/80 transition-colors absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
    </Div>
  );
}

// ─── Responsive Resolution Picker ────────────────────────────────────────────

// Priority order for hiding: least important removed first.
// 1m and 1M are trimmed before 3m and 1W, etc.
const RESOLUTION_DROP_ORDER: Resolution[] = [
  GraphResolution.ONE_MINUTE, // drop 1st - too granular for most use
  GraphResolution.ONE_MONTH, // drop 2nd - too coarse for most use
  GraphResolution.THREE_MINUTES,
  GraphResolution.ONE_WEEK,
  GraphResolution.FIVE_MINUTES,
  GraphResolution.FOUR_HOURS,
  GraphResolution.THIRTY_MINUTES,
  GraphResolution.FIFTEEN_MINUTES,
  // Last kept: 1H, 1D (most used)
];

// ~32px per pill; reserve ~28px for the overflow "chevron" button when needed.
const PILL_WIDTH = 32;
const OVERFLOW_BTN_WIDTH = 28;

type ResolutionOption = (typeof RESOLUTION_OPTIONS)[number];

function getVisibleOptions(
  allOptions: readonly ResolutionOption[],
  selectedValue: Resolution,
  containerWidth: number,
): {
  visible: readonly ResolutionOption[];
  hidden: readonly ResolutionOption[];
} {
  if (containerWidth >= allOptions.length * PILL_WIDTH) {
    return { visible: allOptions, hidden: [] };
  }

  // Reserve space for overflow button
  const maxFit = Math.max(
    0,
    Math.floor((containerWidth - OVERFLOW_BTN_WIDTH) / PILL_WIDTH),
  );

  if (maxFit === 0) {
    return { visible: [], hidden: [...allOptions] };
  }

  const hiddenSet = new Set<Resolution>();
  for (const res of RESOLUTION_DROP_ORDER) {
    if (allOptions.length - hiddenSet.size <= maxFit) {
      break;
    }
    if (res !== selectedValue) {
      hiddenSet.add(res);
    }
  }

  return {
    visible: allOptions.filter((o) => !hiddenSet.has(o.value)),
    hidden: allOptions.filter((o) => hiddenSet.has(o.value)),
  };
}

function ResolutionPicker({
  value,
  onChange,
  availableWidth,
}: {
  value: Resolution;
  onChange: (r: Resolution) => void;
  availableWidth: number;
}): React.JSX.Element {
  const overflowRef = useRef<HTMLDivElement>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);

  useEffect((): (() => void) => {
    if (!overflowOpen) {
      return (): void => undefined;
    }
    const handler = (e: MouseEvent): void => {
      if (!overflowRef.current?.contains(e.target as Node)) {
        setOverflowOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return (): void => document.removeEventListener("mousedown", handler);
  }, [overflowOpen]);

  const { visible, hidden } = getVisibleOptions(
    RESOLUTION_OPTIONS,
    value,
    availableWidth,
  );
  const selected = RESOLUTION_OPTIONS.find((o) => o.value === value);
  const popoverOptions = hidden.length > 0 ? hidden : RESOLUTION_OPTIONS;

  return (
    <Div className="flex items-center shrink-0">
      {/* Full dropdown when nothing fits */}
      {visible.length === 0 && (
        <Div ref={overflowRef} className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOverflowOpen((p) => !p)}
            className="h-7 px-2 text-[11px] font-medium gap-1"
          >
            {selected?.label ?? value}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
          {overflowOpen && (
            <Div className="absolute right-0 top-8 z-50 bg-popover border border-border rounded-lg shadow-lg overflow-hidden flex flex-col min-w-[80px]">
              {popoverOptions.map((opt) => (
                <Button
                  key={opt.value}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onChange(opt.value);
                    setOverflowOpen(false);
                  }}
                  className={cn(
                    "rounded-none h-8 px-3 text-[11px] justify-start font-medium",
                    value === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {opt.label}
                </Button>
              ))}
            </Div>
          )}
        </Div>
      )}

      {/* Pill mode when there's enough space */}
      {visible.length > 0 && (
        <>
          {/* Visible pills */}
          <Div className="flex items-center gap-0 border rounded-lg overflow-hidden bg-muted/30">
            {visible.map((opt) => (
              <Button
                key={opt.value}
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

          {/* Overflow button - shows hidden resolutions in a popover */}
          {hidden.length > 0 && (
            <Div ref={overflowRef} className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOverflowOpen((p) => !p)}
                className="h-7 w-7 p-0 ml-0.5 text-muted-foreground hover:text-foreground"
                title="More resolutions"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
              {overflowOpen && (
                <Div className="absolute right-0 top-8 z-50 bg-popover border border-border rounded-lg shadow-lg overflow-hidden flex flex-col min-w-[80px]">
                  {hidden.map((opt) => (
                    <Button
                      key={opt.value}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onChange(opt.value);
                        setOverflowOpen(false);
                      }}
                      className={cn(
                        "rounded-none h-8 px-3 text-[11px] justify-start font-medium",
                        value === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </Div>
              )}
            </Div>
          )}
        </>
      )}
    </Div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export function GraphChartView({ field }: WidgetProps): React.JSX.Element {
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const outerMutations = useWidgetEndpointMutations();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const locale = useWidgetLocale();

  const [resolution, setResolution] = useState<Resolution>(
    GraphResolution.ONE_DAY,
  );
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const [showLegend, setShowLegend] = useState(true);
  const [collapsedLegends, setCollapsedLegends] = useState<Set<number>>(
    new Set(),
  );
  const [collapsedPanes, setCollapsedPanes] = useState<Set<number>>(new Set());
  const [maximizedPane, setMaximizedPane] = useState<number | null>(null);
  // Optimistic pane config override (applied immediately before server confirms)
  const [optimisticConfig, setOptimisticConfig] = useState<GraphConfig | null>(
    null,
  );
  const [isSavingLayout, setIsSavingLayout] = useState(false);
  const [saveLayoutError, setSaveLayoutError] = useState<string | null>(null);
  const [panBackVisible, setPanBackVisible] = useState(false);
  const [crosshair, setCrosshair] = useState<CrosshairState | null>(null);
  const [lastValues, setLastValues] = useState<Map<string, number>>(new Map());

  const [accSeries, setAccSeries] = useState<SeriesItem[]>([]);
  const [accSignals, setAccSignals] = useState<SignalItem[]>([]);
  const lastCursorRef = useRef<string | undefined>(undefined);
  const lastResolutionRef = useRef<Resolution>(GraphResolution.ONE_DAY);
  const panBackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [pickerAvailableWidth, setPickerAvailableWidth] = useState(9999);

  useEffect((): (() => void) => {
    const el = toolbarRef.current;
    if (!el) {
      return (): void => undefined;
    }
    const obs = new ResizeObserver((entries) => {
      // Subtract fixed toolbar items: back+sep+name+badge (~240px) + actions (~130px) + gaps
      const total = entries[0]?.contentRect.width ?? 9999;
      setPickerAvailableWidth(Math.max(0, total - 370));
    });
    obs.observe(el);
    return (): void => obs.disconnect();
  }, []);

  const graph = field.value?.graph;

  // Effective node config: optimistic override when a pane move is in flight
  const effectiveNodeConfig = optimisticConfig?.nodes ?? graph?.config?.nodes;

  // Sync hiddenSeries when graph ID changes:
  // 1. Start from server-saved visible:false nodes in graph config
  // 2. Overlay with localStorage per-graph toggle state (no server round-trip needed)
  useEffect(() => {
    if (!graph?.id) {
      return;
    }
    const hidden = new Set<string>();
    const serverConfig = graph.config.nodes;
    for (const [nodeId, nc] of Object.entries(serverConfig)) {
      if (nc.visible === false) {
        hidden.add(nodeId);
      }
    }
    // Overlay localStorage toggles (user clicked eye without saving)
    try {
      const stored = localStorage.getItem(`vs-hidden-${graph.id}`);
      if (stored !== null) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed)) {
          for (const id of parsed) {
            if (typeof id === "string") {
              hidden.add(id);
            }
          }
        }
      }
    } catch {
      // ignore malformed localStorage
    }
    setHiddenSeries(hidden);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync on graph ID change
  }, [graph?.id]);

  // ── Versions endpoint: DB ancestor chain for prev/next version nav ─────────
  const versionsOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { id: graph?.id ?? "" },
        queryOptions: {
          enabled: !!graph?.id,
          refetchOnWindowFocus: false,
          staleTime: 60_000,
        },
      },
    }),
    [graph?.id],
  );
  const versionsEndpoint = useEndpoint(
    versionsDefinitions,
    versionsOptions,
    logger,
    user,
  );
  const versionChain = versionsEndpoint.read?.data?.versions ?? [];
  const currentVersionIndex = versionChain.findIndex((v) => v.id === graph?.id);
  const prevVersionId =
    currentVersionIndex > 0
      ? versionChain[currentVersionIndex - 1]?.id
      : undefined;
  const nextVersionId =
    currentVersionIndex >= 0 && currentVersionIndex < versionChain.length - 1
      ? versionChain[currentVersionIndex + 1]?.id
      : undefined;

  /**
   * Save an updated graph config optimistically - update local state immediately,
   * fire `apiClient.mutate` in background, navigate to the new version ID on success.
   */
  const saveLayoutConfig = useCallback(
    (newConfig: GraphConfig): void => {
      if (!graph) {
        return;
      }
      setOptimisticConfig(newConfig);
      setIsSavingLayout(true);
      void (async (): Promise<void> => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const result = await apiClient.mutate(
          editDefinitions.PUT,
          logger,
          user,
          { config: newConfig },
          { id: graph.id },
          locale,
        );
        setIsSavingLayout(false);
        if (result.success) {
          setOptimisticConfig(null);
          setSaveLayoutError(null);
          const dataDef = await import("./definition");
          navigation.push(dataDef.default.GET, {
            urlPathParams: { id: result.data.newId },
          });
        } else {
          // Revert optimistic config on failure and surface the error
          setOptimisticConfig(null);
          setSaveLayoutError(
            typeof result.message === "string"
              ? result.message
              : t("get.errors.server.title"),
          );
          // Auto-dismiss after 4s
          setTimeout(() => setSaveLayoutError(null), 4000);
        }
      })();
    },
    [graph, logger, user, locale, navigation, t],
  );

  // Node display configs from graph config (uses optimistic config when in-flight)
  const displayConfigs = useMemo(
    () => getNodeDisplayConfigs(accSeries, effectiveNodeConfig),
    [accSeries, effectiveNodeConfig],
  );

  // ── Pagination query state ────────────────────────────────────────────────
  const [pageQuery, setPageQuery] = useState<{
    id: string;
    resolution: Resolution;
    cursor?: string;
  } | null>(null);

  const pageOptions = useMemo(
    () =>
      pageQuery
        ? {
            read: {
              urlPathParams: { id: pageQuery.id },
              initialState: {
                resolution: pageQuery.resolution,
                cursor: pageQuery.cursor,
              },
              queryOptions: {
                enabled: true,
                refetchOnWindowFocus: false,
                staleTime: 0,
              },
            },
          }
        : {
            read: {
              urlPathParams: { id: "" },
              initialState: {
                resolution: GraphResolution.ONE_DAY,
                cursor: undefined,
              },
              queryOptions: { enabled: false, refetchOnWindowFocus: false },
            },
          },
    [pageQuery],
  );

  const pageEndpoint = useEndpoint(definitions, pageOptions, logger, user);

  const isLoading =
    (outerMutations?.read?.isLoading ?? false) ||
    (pageEndpoint.read?.isFetching ?? false);

  // Merge newly-fetched page into accumulated series/signals
  useEffect(() => {
    const data = pageEndpoint.read?.data;
    if (!data) {
      return;
    }
    setAccSeries((prev) => mergeSeries(prev, data.series ?? []));
    setAccSignals((prev) => mergeSignals(prev, data.signals ?? []));
  }, [pageEndpoint.read?.data]);

  const fetchPage = useCallback(
    (graphId: string, res: Resolution, cursor?: string): void => {
      setPageQuery({ id: graphId, resolution: res, cursor });
    },
    [],
  );

  useEffect(() => {
    if (!field.value) {
      return;
    }
    setAccSeries((prev) => mergeSeries(prev, field.value?.series ?? []));
    setAccSignals((prev) => mergeSignals(prev, field.value?.signals ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run when field.value reference changes
  }, [field.value]);

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

  const handlePanBack = useCallback(
    (oldestVisibleISO: string): void => {
      if (lastCursorRef.current === oldestVisibleISO || !graph) {
        return;
      }
      lastCursorRef.current = oldestVisibleISO;

      setPanBackVisible(true);
      if (panBackTimerRef.current) {
        clearTimeout(panBackTimerRef.current);
      }
      panBackTimerRef.current = setTimeout(() => {
        setPanBackVisible(false);
      }, 2500);

      fetchPage(graph.id, lastResolutionRef.current, oldestVisibleISO);
    },
    [graph, fetchPage],
  );

  const { paneContainerRef, panesRef, paneNumbers, scaleWidths } =
    useMultiPaneRenderer(
      accSeries,
      accSignals,
      hiddenSeries,
      resolution,
      displayConfigs,
      handlePanBack,
      setCrosshair,
      setLastValues,
    );

  // ── Toggle lwc built-in labels when legend visibility changes ───────────
  useEffect(() => {
    for (const [, pane] of panesRef.current) {
      for (const [nodeId, lwcSeries] of pane.seriesMap) {
        lwcSeries.applyOptions({
          lastValueVisible: showLegend,
          title: showLegend ? humanizeNodeId(nodeId) : "",
        });
      }
    }
  }, [showLegend, panesRef]);

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

  const handleToggle = useCallback(
    (nodeId: string): void => {
      if (!graph) {
        return;
      }
      // Optimistic local toggle - instant, no server round-trip
      setHiddenSeries((prev) => {
        const next = new Set(prev);
        if (prev.has(nodeId)) {
          next.delete(nodeId);
        } else {
          next.add(nodeId);
        }
        // Persist to localStorage keyed to graph ID so it survives reload
        try {
          localStorage.setItem(
            `vs-hidden-${graph.id}`,
            JSON.stringify([...next]),
          );
        } catch {
          // ignore quota errors
        }
        return next;
      });
    },
    [graph],
  );

  const handlePaneCollapse = useCallback((paneNum: number): void => {
    setCollapsedPanes((prev) => {
      const next = new Set(prev);
      if (next.has(paneNum)) {
        next.delete(paneNum);
      } else {
        next.add(paneNum);
      }
      return next;
    });
  }, []);

  /** Swap the pane numbers of two adjacent panes (persists to new version) */
  const handlePaneMoveUp = useCallback(
    (paneNum: number): void => {
      if (!graph?.config) {
        return;
      }
      const prevPane = paneNum - 1;
      const updatedNodes: GraphConfig["nodes"] = {};
      for (const [nodeId, nodeConfig] of Object.entries(graph.config.nodes)) {
        const p = nodeConfig.pane ?? 0;
        updatedNodes[nodeId] = {
          ...nodeConfig,
          pane: p === paneNum ? prevPane : p === prevPane ? paneNum : p,
        };
      }
      saveLayoutConfig({ ...graph.config, nodes: updatedNodes });
    },
    [graph, saveLayoutConfig],
  );

  const handlePaneMoveDown = useCallback(
    (paneNum: number): void => {
      if (!graph?.config) {
        return;
      }
      const nextPane = paneNum + 1;
      const updatedNodes: GraphConfig["nodes"] = {};
      for (const [nodeId, nodeConfig] of Object.entries(graph.config.nodes)) {
        const p = nodeConfig.pane ?? 0;
        updatedNodes[nodeId] = {
          ...nodeConfig,
          pane: p === paneNum ? nextPane : p === nextPane ? paneNum : p,
        };
      }
      saveLayoutConfig({ ...graph.config, nodes: updatedNodes });
    },
    [graph, saveLayoutConfig],
  );

  /** Toggle maximize for a pane (client-side visual only) */
  const handlePaneMaximize = useCallback((paneNum: number): void => {
    setMaximizedPane((prev) => (prev === paneNum ? null : paneNum));
  }, []);

  /** Version chain navigation (prev = older ancestor, next = newer descendant) */
  const handleVersionPrev = useCallback((): void => {
    if (!prevVersionId) {
      return;
    }
    void (async (): Promise<void> => {
      const dataDef = await import("./definition");
      navigation.push(dataDef.default.GET, {
        urlPathParams: { id: prevVersionId },
      });
    })();
  }, [prevVersionId, navigation]);

  const handleVersionNext = useCallback((): void => {
    if (!nextVersionId) {
      return;
    }
    void (async (): Promise<void> => {
      const dataDef = await import("./definition");
      navigation.push(dataDef.default.GET, {
        urlPathParams: { id: nextVersionId },
      });
    })();
  }, [nextVersionId, navigation]);

  // When panes collapse/expand, resize visible charts to fill space
  useEffect(() => {
    // Give DOM time to apply hidden/visible classes
    const rafId = requestAnimationFrame(() => {
      // Reset inline flex/height styles on visible pane wrappers so flex layout works
      for (const [paneNum, pane] of panesRef.current) {
        const wrapper = pane.container.parentElement;
        if (!wrapper) {
          continue;
        }
        if (collapsedPanes.has(paneNum)) {
          continue;
        }
        // Clear any inline styles set by drag handle so flex layout takes over
        wrapper.style.flex = "";
        wrapper.style.height = "";
      }

      // Use a second rAF to let the browser recalculate layout after style reset
      requestAnimationFrame(() => {
        for (const [paneNum, pane] of panesRef.current) {
          if (collapsedPanes.has(paneNum)) {
            continue;
          }
          const el = pane.container;
          if (el.clientHeight > 0) {
            pane.chart.applyOptions({
              width: el.clientWidth,
              height: el.clientHeight,
            });
            // Fit content so chart lines reappear after expand
            pane.chart.timeScale().fitContent();
          }
        }
        // Ensure time scale is visible on the last non-collapsed pane
        const visiblePanes = paneNumbers.filter((p) => !collapsedPanes.has(p));
        const lastVisible = visiblePanes[visiblePanes.length - 1];
        for (const paneNum of paneNumbers) {
          const pane = panesRef.current.get(paneNum);
          if (pane) {
            pane.chart.timeScale().applyOptions({
              visible: paneNum === lastVisible,
            });
          }
        }
        syncScaleWidths(panesRef);
      });
    });
    return (): void => cancelAnimationFrame(rafId);
  }, [collapsedPanes, paneNumbers, panesRef]);

  const isInitialLoading = !field.value && accSeries.length === 0;
  const isNotFound = !isInitialLoading && !graph && accSeries.length === 0;
  const hasData = accSeries.some((s) => s.points.length > 0);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Div className="flex flex-col h-[calc(100vh-64px)] min-h-[500px] border rounded-xl overflow-hidden bg-background shadow-sm">
      {/* Layout save error banner */}
      {saveLayoutError !== null && (
        <Div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 border-b border-destructive/20 text-destructive text-xs shrink-0">
          <X className="h-3 w-3 shrink-0" />
          <Span className="flex-1">{saveLayoutError}</Span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 text-destructive/60 hover:text-destructive"
            onClick={() => setSaveLayoutError(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Div>
      )}
      {/* Toolbar */}
      <Div
        ref={toolbarRef}
        className="flex items-center gap-2 px-3 h-11 border-b bg-background/95 shrink-0 relative"
      >
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-7 gap-1.5 px-2 shrink-0 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("get.widget.back")}
        </Button>

        {/* Graph name + status */}
        {graph && (
          <>
            <Div className="h-4 w-px bg-border shrink-0" />
            <Span className="font-semibold text-sm truncate min-w-0 shrink">
              {graph.name}
            </Span>
            <Badge
              variant={graph.isActive ? "default" : "secondary"}
              className={cn(
                "text-[10px] px-1.5 py-0 h-5 shrink-0",
                graph.isActive &&
                  "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400",
              )}
            >
              {graph.isActive
                ? t("get.widget.active")
                : t("get.widget.inactive")}
            </Badge>
          </>
        )}

        {/* Version prev/next navigation */}
        {versionChain.length > 1 && (
          <>
            <Div className="h-4 w-px bg-border shrink-0" />
            <Div className="flex items-center gap-0" title="Version history">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVersionPrev}
                disabled={!prevVersionId}
                className="h-7 w-7 p-0"
                title="Older version (back in time)"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Div className="flex items-center gap-0.5 px-1">
                <History className="h-3 w-3 text-muted-foreground/50" />
                <Span className="text-[10px] text-muted-foreground/70 tabular-nums">
                  {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
                  {`${String(currentVersionIndex >= 0 ? currentVersionIndex + 1 : versionChain.length)}/${String(versionChain.length)}`}
                </Span>
              </Div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVersionNext}
                disabled={!nextVersionId}
                className="h-7 w-7 p-0"
                title="Newer version (forward in time)"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Div>
          </>
        )}

        <Div className="flex-1" />

        {/* Resolution picker */}
        <ResolutionPicker
          value={resolution}
          onChange={handleResolutionChange}
          availableWidth={pickerAvailableWidth}
        />

        {/* Action buttons */}
        <Div className="flex items-center gap-0.5 shrink-0">
          {isLoading && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground mr-1" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLegend((v) => !v)}
            className={cn(
              "h-7 px-2 text-xs",
              !showLegend && "text-muted-foreground",
            )}
            title="Toggle legend"
          >
            {showLegend ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBacktest}
            className="h-7 gap-1.5 px-2 text-xs"
            title={t("get.widget.backtest")}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <Span className="hidden sm:inline">{t("get.widget.backtest")}</Span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-7 gap-1.5 px-2 text-xs"
            title={t("get.widget.edit")}
          >
            <Edit className="h-3.5 w-3.5" />
            <Span className="hidden sm:inline">{t("get.widget.edit")}</Span>
          </Button>
          {graph?.ownerType !== GraphOwnerType.SYSTEM && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePromote}
                className="h-7 gap-1.5 px-2 text-xs"
                title={t("get.widget.promote")}
              >
                <Shield className="h-3.5 w-3.5" />
                <Span className="hidden md:inline">
                  {t("get.widget.promote")}
                </Span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleArchive}
                className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive"
                title={t("get.widget.archive")}
              >
                <Archive className="h-3.5 w-3.5" />
                <Span className="hidden md:inline">
                  {t("get.widget.archive")}
                </Span>
              </Button>
            </>
          )}
        </Div>
      </Div>

      {/* Chart area */}
      <Div className="flex-1 min-h-0 flex flex-col relative">
        {/* Multi-pane chart container */}
        <Div ref={paneContainerRef} className="flex-1 min-h-0 flex flex-col">
          {paneNumbers.map((paneNum, idx) => {
            const isCollapsed = collapsedPanes.has(paneNum);
            const seriesInPane = accSeries.filter((s) => {
              const cfg = displayConfigs.get(s.nodeId);
              return cfg?.visible !== false && (cfg?.pane ?? 0) === paneNum;
            }).length;

            return (
              <React.Fragment key={paneNum}>
                {/* Drag handle between panes (not before first pane) */}
                {idx > 0 && (
                  <PaneDragHandle
                    paneAbove={paneNumbers[idx - 1] ?? 0}
                    paneBelow={paneNum}
                    containerRef={paneContainerRef}
                    panesRef={panesRef}
                  />
                )}
                {/* Collapsed pane bar - shown when pane is collapsed */}
                {isCollapsed &&
                  (() => {
                    const paneSeries = accSeries.filter((s) => {
                      const cfg = displayConfigs.get(s.nodeId);
                      return (
                        cfg?.visible !== false && (cfg?.pane ?? 0) === paneNum
                      );
                    });
                    const firstSeries = paneSeries[0];
                    const firstSeriesName = firstSeries
                      ? humanizeNodeId(firstSeries.nodeId)
                      : `Pane ${String(paneNum)}`;
                    const firstSeriesColor = firstSeries
                      ? (displayConfigs.get(firstSeries.nodeId)?.color ??
                        "#888")
                      : "#888";
                    return (
                      <CollapsedPaneBar
                        paneNum={paneNum}
                        seriesCount={seriesInPane}
                        firstSeriesName={firstSeriesName}
                        firstSeriesColor={firstSeriesColor}
                        isFirst={idx === 0}
                        isLast={idx === paneNumbers.length - 1}
                        isSinglePane={paneNumbers.length === 1}
                        isSaving={isSavingLayout}
                        onExpand={() => handlePaneCollapse(paneNum)}
                        onMoveUp={() => handlePaneMoveUp(paneNum)}
                        onMoveDown={() => handlePaneMoveDown(paneNum)}
                      />
                    );
                  })()}
                {/* Pane wrapper - always in DOM so lwc chart stays attached.
                    Hidden via h-0 overflow-hidden when collapsed.
                    group/pane enables hover-only pane action visibility. */}
                <Div
                  className={cn(
                    "relative group/pane",
                    isCollapsed
                      ? "h-0 min-h-0 overflow-hidden"
                      : maximizedPane !== null
                        ? maximizedPane === paneNum
                          ? "flex-1 min-h-[200px]"
                          : "hidden"
                        : idx === 0
                          ? "flex-[3] min-h-[200px]"
                          : "flex-[2] min-h-[150px]",
                  )}
                >
                  {/* Chart canvas target */}
                  <Div
                    id={`vs-pane-${String(paneNum)}`}
                    className="absolute inset-0"
                  />
                  {/* Per-pane legend */}
                  {!isCollapsed && hasData && showLegend && (
                    <PaneLegend
                      paneNum={paneNum}
                      series={accSeries}
                      hiddenSeries={hiddenSeries}
                      lastValues={lastValues}
                      crosshair={crosshair}
                      displayConfigs={displayConfigs}
                      leftOffset={scaleWidths.left}
                      onToggleSeries={handleToggle}
                      collapsed={collapsedLegends.has(paneNum)}
                      onToggleCollapse={() => {
                        setCollapsedLegends((prev) => {
                          const next = new Set(prev);
                          if (next.has(paneNum)) {
                            next.delete(paneNum);
                          } else {
                            next.add(paneNum);
                          }
                          return next;
                        });
                      }}
                    />
                  )}
                  {/* Pane action buttons - hover-only on pointer devices */}
                  <PaneActions
                    paneNum={paneNum}
                    rightOffset={scaleWidths.right}
                    isCollapsed={isCollapsed}
                    isFirst={idx === 0}
                    isLast={idx === paneNumbers.length - 1}
                    isSinglePane={paneNumbers.length === 1}
                    isMaximized={maximizedPane === paneNum}
                    isSaving={isSavingLayout}
                    onCollapse={() => handlePaneCollapse(paneNum)}
                    onMoveUp={() => handlePaneMoveUp(paneNum)}
                    onMoveDown={() => handlePaneMoveDown(paneNum)}
                    onMaximize={() => handlePaneMaximize(paneNum)}
                  />
                </Div>
              </React.Fragment>
            );
          })}
        </Div>

        {/* Initial loading */}
        {isInitialLoading && (
          <Div className="absolute inset-0 z-10">
            <ChartShimmer />
          </Div>
        )}

        {/* Not found */}
        {isNotFound && (
          <Div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
            <P className="text-sm text-muted-foreground">
              {t("get.errors.notFound.title")}
            </P>
            <Button variant="outline" size="sm" onClick={handleBack}>
              {t("get.widget.back")}
            </Button>
          </Div>
        )}

        {/* Shimmer */}
        {!isInitialLoading && !hasData && isLoading && (
          <Div className="absolute inset-0 z-10">
            <ChartShimmer />
          </Div>
        )}

        {/* Empty state */}
        {!isInitialLoading && !hasData && !isLoading && (
          <Div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
            <Div className="relative">
              <BarChart2 className="h-12 w-12 text-muted-foreground/20" />
              <Div
                style={{
                  position: "absolute",
                  bottom: "-4px",
                  right: "-4px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "hsl(var(--muted))",
                  border: "2px solid hsl(var(--background))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RotateCcw className="h-2.5 w-2.5 text-muted-foreground opacity-50" />
              </Div>
            </Div>
            <P className="text-sm text-muted-foreground/70">
              {t("get.widget.noData")}
            </P>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 gap-1.5"
              onClick={handleBacktest}
            >
              <RotateCcw className="h-3 w-3" />
              {t("get.widget.backtest")}
            </Button>
          </Div>
        )}

        {/* Crosshair tooltip */}
        {crosshair && crosshair.points.length > 0 && (
          <CrosshairTooltip
            crosshair={crosshair}
            containerRef={paneContainerRef}
          />
        )}

        {/* Pan-back toast */}
        {panBackVisible && (
          <Div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
              pointerEvents: "none",
              animation: "fadeIn 0.15s ease",
            }}
          >
            <Div className="bg-popover/95 backdrop-blur-sm border border-border shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-primary/70" />
              <Span className="text-xs font-medium text-foreground/80">
                {t("get.widget.loadingEarlierData")}
              </Span>
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
