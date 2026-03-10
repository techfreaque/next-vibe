/**
 * Vibe Sense — Graph Chart View
 *
 * Self-contained chart workspace for a single graph.
 * GET renders: toolbar (back, name, timeframe, actions) + chart + indicator toggles.
 * POST renders: form fields + chart from response data.
 *
 * The GET widget embeds the POST endpoint via EndpointsPage to load chart data.
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
import { Play } from "next-vibe-ui/ui/icons/Play";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
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

import type { UseEndpointOptions } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type { UTCTimestamp } from "lightweight-charts";

import definition from "./definition";

// ─── Types (derived from definition — no manual interfaces) ──────────────────

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;
type PostResponseOutput = typeof definition.POST.types.ResponseOutput;

/** Series shape as inferred from POST response */
type SeriesData = NonNullable<PostResponseOutput>["series"][number];

interface GetWidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

interface PostWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
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

const TIMEFRAME_PRESETS = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTimeframeRange(days: number): { from: string; to: string } {
  const now = new Date();
  const ago = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { from: ago.toISOString(), to: now.toISOString() };
}

function isEmptyData(series: SeriesData[] | undefined): boolean {
  if (!series) {
    return true;
  }
  return series.every((s) => s.points.length === 0);
}

/** Deduplicate by timestamp — sum values for the same time bucket */
function deduplicatePoints(
  points: Array<{ time: UTCTimestamp; value: number }>,
): Array<{ time: UTCTimestamp; value: number }> {
  const map = new Map<UTCTimestamp, number>();
  for (const p of points) {
    map.set(p.time, (map.get(p.time) ?? 0) + p.value);
  }
  return [...map.entries()]
    .map(([time, value]) => ({ time, value }))
    .toSorted((a, b) => a.time - b.time);
}

/** Convert ISO timestamp to seconds-from-epoch for lightweight-charts */
function toChartTime(isoTimestamp: string): UTCTimestamp {
  return Math.floor(new Date(isoTimestamp).getTime() / 1000) as UTCTimestamp;
}

// ─── Chart Renderer (shared between GET and POST paths) ──────────────────────

type ChartData = NonNullable<PostResponseOutput>;

function useChartRenderer(
  responseData: ChartData | null | undefined,
  hiddenSeries: Set<string>,
): {
  chartContainerRef: React.RefObject<HTMLDivElement | null>;
} {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<{ remove: () => void } | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return (): void => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (
      !responseData ||
      isEmptyData(responseData.series) ||
      !chartContainerRef.current
    ) {
      return;
    }

    // Cleanup previous chart + observer before creating new ones
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    let cancelled = false;

    void (async (): Promise<void> => {
      const { createChart, createSeriesMarkers, ColorType, LineSeries } =
        await import("lightweight-charts");

      if (cancelled) {
        return;
      }

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
        rightPriceScale: { borderColor: "hsl(var(--border))" },
      });

      chartRef.current = chart;

      for (let i = 0; i < (responseData.series?.length ?? 0); i++) {
        const series = responseData.series?.[i];
        if (!series || series.points.length === 0) {
          continue;
        }
        if (hiddenSeries.has(series.nodeId)) {
          continue;
        }

        const color = LINE_COLORS[i % LINE_COLORS.length];
        const lineSeries = chart.addSeries(LineSeries, {
          color,
          lineWidth: 2,
          title: series.nodeId,
        });

        const rawPoints = series.points.map((p) => ({
          time: toChartTime(p.timestamp),
          value: p.value,
        }));

        const chartData = deduplicatePoints(rawPoints);
        lineSeries.setData(chartData);

        const signalForNode = responseData.signals?.find(
          (s) => s.nodeId === series.nodeId,
        );
        if (signalForNode && signalForNode.events.length > 0) {
          const markers: Array<{
            time: UTCTimestamp;
            position: "aboveBar";
            color: string;
            shape: "arrowDown";
            text: string;
          }> = signalForNode.events
            .filter((e) => e.fired)
            .map((e) => ({
              time: toChartTime(e.timestamp),
              position: "aboveBar" satisfies "aboveBar",
              color,
              shape: "arrowDown" satisfies "arrowDown",
              text: "●",
            }));
          if (markers.length > 0) {
            createSeriesMarkers(
              lineSeries,
              markers.toSorted((a, b) => a.time - b.time),
            );
          }
        }
      }

      chart.timeScale().fitContent();

      const resizeObserver = new ResizeObserver(() => {
        chart.applyOptions({
          width: container.clientWidth,
          height: Math.max(container.clientHeight, 300),
        });
      });
      resizeObserver.observe(container);
      observerRef.current = resizeObserver;
    })();

    return (): void => {
      cancelled = true;
    };
  }, [responseData, hiddenSeries]);

  return { chartContainerRef };
}

// ─── Indicator Toggle List ───────────────────────────────────────────────────

function IndicatorToggles({
  series,
  hiddenSeries,
  onToggle,
}: {
  series: SeriesData[];
  hiddenSeries: Set<string>;
  onToggle: (nodeId: string) => void;
}): React.JSX.Element {
  return (
    <Div className="flex flex-wrap gap-2">
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
              "h-7 px-2 gap-1.5 text-xs font-mono",
              isHidden && "opacity-40 line-through",
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

// ─── POST Widget (Data Form + Chart) ─────────────────────────────────────────

function DataFormWidget({ field }: PostWidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const responseData = field.value ?? null;
  const { chartContainerRef } = useChartRenderer(responseData, hiddenSeries);

  // Auto-submit on mount so timeframe buttons immediately load data when key changes
  useEffect(() => {
    onSubmit?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only on mount
  }, []);

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

  return (
    <Div className="flex flex-col h-full">
      <FormAlertWidget field={{}} />

      {/* Compact submit row */}
      <Div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/20">
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "post.widget.loadButton",
            loadingText: "post.widget.loadingButton",
            icon: "refresh-cw",
            variant: "outline",
          }}
        />
      </Div>

      {/* Chart or empty state */}
      {(!responseData ||
        (isEmptyData(responseData.series) &&
          (responseData.signals?.length ?? 0) === 0)) && (
        <Div className="flex-1 min-h-[400px] flex flex-col items-center justify-center gap-3">
          <BarChart2 className="h-10 w-10 text-muted-foreground/40" />
          <P className="text-sm text-muted-foreground">
            {t("post.widget.noData")}
          </P>
        </Div>
      )}

      {responseData &&
        !(
          isEmptyData(responseData.series) &&
          (responseData.signals?.length ?? 0) === 0
        ) && (
          <>
            <Div ref={chartContainerRef} className="flex-1 min-h-[400px]" />
            <Div className="px-3 py-2 border-t bg-muted/20">
              <IndicatorToggles
                series={responseData.series ?? []}
                hiddenSeries={hiddenSeries}
                onToggle={handleToggle}
              />
            </Div>
          </>
        )}
    </Div>
  );
}

// ─── GET Widget (Full Chart View) ────────────────────────────────────────────

function GraphChartViewInner({ field }: GetWidgetProps): React.JSX.Element {
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const endpointMutations = useWidgetEndpointMutations();
  const locale = useWidgetLocale();
  const user = useWidgetUser();

  const [timeframeDays, setTimeframeDays] = useState(30);

  const graph = field.value?.graph;
  const config = graph?.config;

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

  const handleTrigger = useCallback((): void => {
    if (!graph) {
      return;
    }
    void (async (): Promise<void> => {
      const triggerDef = await import("../trigger/definition");
      navigation.push(triggerDef.default.POST, {
        urlPathParams: { id: graph.id },
        renderInModal: true,
        onSuccessCallback: () => endpointMutations?.read?.refetch?.(),
      });
    })();
  }, [navigation, graph, endpointMutations]);

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
        onSuccessCallback: () => endpointMutations?.read?.refetch?.(),
      });
    })();
  }, [navigation, graph, endpointMutations]);

  const handlePromote = useCallback((): void => {
    if (!graph) {
      return;
    }
    void (async (): Promise<void> => {
      const promoteDef = await import("../promote/definition");
      navigation.push(promoteDef.default.POST, {
        urlPathParams: { id: graph.id },
        renderInModal: true,
        onSuccessCallback: () => endpointMutations?.read?.refetch?.(),
      });
    })();
  }, [navigation, graph, endpointMutations]);

  // ── EndpointsPage options for embedded POST ──────────────────────────────

  const endpointOptions = useMemo((): UseEndpointOptions<typeof definition> => {
    const range = getTimeframeRange(timeframeDays);
    return {
      read: { urlPathParams: { id: graph?.id ?? "" } },
      create: {
        urlPathParams: { id: graph?.id ?? "" },
        autoPrefillData: {
          rangeFrom: range.from,
          rangeTo: range.to,
        },
      },
    };
  }, [graph?.id, timeframeDays]);

  // ── Loading state ──────────────────────────────────────────────────────────

  if (!field.value) {
    return (
      <Div className="flex flex-col items-center justify-center h-[600px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <P className="text-sm text-muted-foreground">
          {t("get.widget.loading")}
        </P>
      </Div>
    );
  }

  if (!graph) {
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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Div className="flex flex-col h-[calc(100vh-120px)] min-h-[500px] border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <Div className="flex flex-wrap items-center gap-2 px-3 min-h-[40px] py-1 border-b bg-background shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-7 gap-1 px-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("get.widget.back")}
        </Button>
        <Span className="font-semibold text-sm truncate max-w-[300px]">
          {graph.name}
        </Span>
        <Badge
          variant="outline"
          className="text-[10px] font-mono px-1.5 py-0 h-5"
        >
          {graph.slug}
        </Badge>
        <Badge
          variant={graph.isActive ? "default" : "secondary"}
          className="text-[10px] px-1.5 py-0 h-5"
        >
          {graph.isActive ? t("get.widget.active") : t("get.widget.inactive")}
        </Badge>

        {config && (
          <Span className="text-[10px] text-muted-foreground">
            {Object.keys(config.nodes).length} {t("get.widget.nodes")}
          </Span>
        )}

        <Div className="flex-1" />

        {/* Timeframe buttons */}
        <Div className="flex items-center gap-0.5 border rounded-md px-0.5 py-0.5 bg-muted/30">
          {TIMEFRAME_PRESETS.map((tf) => (
            <Button
              key={tf.days}
              variant="ghost"
              size="sm"
              onClick={() => setTimeframeDays(tf.days)}
              className={cn(
                "h-6 px-2 text-[11px] font-medium rounded-sm",
                timeframeDays === tf.days
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tf.label}
            </Button>
          ))}
        </Div>

        {/* Action buttons */}
        <Div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTrigger}
            className="h-7 gap-1 text-xs px-2"
          >
            <Play className="h-3 w-3" />
            {t("get.widget.trigger")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBacktest}
            className="h-7 gap-1 text-xs px-2"
          >
            <RotateCcw className="h-3 w-3" />
            {t("get.widget.backtest")}
          </Button>
          <Div className="w-px h-5 bg-border mx-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-7 gap-1 text-xs px-2"
          >
            <Edit className="h-3 w-3" />
            {t("get.widget.edit")}
          </Button>
          {graph.ownerType !== "system" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePromote}
                className="h-7 gap-1 text-xs px-2"
              >
                <Shield className="h-3 w-3" />
                {t("get.widget.promote")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleArchive}
                className="h-7 gap-1 text-xs px-2 text-muted-foreground hover:text-destructive"
              >
                <Archive className="h-3 w-3" />
                {t("get.widget.archive")}
              </Button>
            </>
          )}
        </Div>
      </Div>

      {/* Chart area — embedded POST endpoint; key causes remount on timeframe change → auto-submit */}
      <Div className="flex-1 min-h-0 overflow-auto">
        <EndpointsPage
          key={timeframeDays}
          endpoint={definition}
          locale={locale}
          user={user}
          forceMethod="POST"
          endpointOptions={endpointOptions}
          _disableNavigationStack
        />
      </Div>
    </Div>
  );
}

// ─── Type guard ──────────────────────────────────────────────────────────────

function isPostWidget(
  props: GetWidgetProps | PostWidgetProps,
): props is PostWidgetProps {
  return "children" in props.field && "rangeFrom" in props.field.children;
}

// ─── Export — single component handles both GET and POST ─────────────────────

export function GraphChartView(
  props: GetWidgetProps | PostWidgetProps,
): React.JSX.Element {
  // The framework calls this for both GET and POST.
  // Type guard narrows the union so we can pass field/fieldName with correct types.
  if (isPostWidget(props)) {
    return <DataFormWidget field={props.field} fieldName={props.fieldName} />;
  }

  return (
    <GraphChartViewInner field={props.field} fieldName={props.fieldName} />
  );
}
