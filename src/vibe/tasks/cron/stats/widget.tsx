/**
 * Task Health widget (cron-stats). One widget for web, CLI and MCP.
 * Answers: what is failing, stuck, overdue, disabled or never ran right now,
 * how runs, success rate and duration moved in the period, and which task to
 * open in run history.
 */

"use client";

import {
  AnalyticsToolbar,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
} from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div, type DivRefObject } from "next-vibe/ui/components/div";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { List } from "next-vibe/ui/components/icons/List";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import type { JSX } from "react";
import { useRef, useState } from "react";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import { isAgentPlatform, isCliPlatform } from "../../../platforms/platforms";
import { cn } from "../../../unified-ui/_shared/cn";
import { useRelatedEntityNavigation } from "../../../unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import {
  formatDuration,
  sparkline,
} from "../../../unified-ui/analytics/format";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "../../../unified-ui/widgets/interactive/navigate-button/widget";
import { CronTaskStatus, type CronTaskStatusValue } from "../../enum";
import { scopedTranslation as tasksScopedTranslation } from "../../i18n";
import { TaskHistoryScope } from "../history/enum";
import type statsEndpoints from "./definition";
import type {
  CronHealthAttentionTask,
  CronHealthTaskRow,
  CronStatsGetResponseOutput,
} from "./definition";
import {
  RECOVERY_RUNS,
  TaskHealth,
  TaskHealthFilter,
  TaskHealthFilterOptions,
  type TaskHealthFilterValue,
  type TaskHealthValue,
} from "./enum";
import type { CronStatsT } from "./i18n";

interface WidgetProps {
  field: (typeof statsEndpoints.GET)["fields"];
}

type Report = CronStatsGetResponseOutput;

const FAILED_STATUSES = [
  CronTaskStatus.FAILED,
  CronTaskStatus.ERROR,
  CronTaskStatus.TIMEOUT,
] as const;

const FAILED_STATUS_FILTER = [
  CronTaskStatus.FAILED,
  CronTaskStatus.ERROR,
  CronTaskStatus.TIMEOUT,
].join(",");

const HEALTH_VARIANT: Record<typeof TaskHealthValue, StatusPillVariant> = {
  [TaskHealth.STUCK]: "danger",
  [TaskHealth.FAILING]: "danger",
  [TaskHealth.OVERDUE]: "warning",
  [TaskHealth.FLAKY]: "warning",
  [TaskHealth.RECOVERING]: "info",
  [TaskHealth.RUNNING]: "info",
  [TaskHealth.LOW_DATA]: "default",
  [TaskHealth.NEVER_RAN]: "default",
  [TaskHealth.HEALTHY]: "success",
  [TaskHealth.DISABLED]: "muted",
};

const DAY_MS = 86_400_000;
/** Failure palette: no green (green means success on this page). */
const FAILURE_SLOTS = ["negative", 4, 5, 1, 3] as const;
/** Days shown in the per-row success strip. */
const STRIP_DAYS = 14;
/** Below this many runs in the previous period, deltas are noise: hide them. */
const MIN_DELTA_BASE = 10;

function seriesColor(key: string): 1 | 3 | "negative" | "muted" | "positive" {
  if (key === "failed") {
    return "negative";
  }
  if (key === "other") {
    return "muted";
  }
  if (key === "completed" || key === "successRate") {
    return "positive";
  }
  return key === "p95" ? 3 : 1;
}

/** Per-bucket sum of every series (total runs sparkline). */
function sumSeries(
  buckets: readonly string[],
  series: ReadonlyArray<{ values: readonly number[] }>,
): number[] {
  const totals: number[] = [];
  for (let i = 0; i < buckets.length; i += 1) {
    let sum = 0;
    for (const item of series) {
      sum += item.values[i] ?? 0;
    }
    totals.push(sum);
  }
  return totals;
}

function healthPill(state: typeof TaskHealthValue, label: string): JSX.Element {
  return (
    <StatusPill status={state} variant={HEALTH_VARIANT[state]} label={label} />
  );
}

// ─── Formatting ──────────────────────────────────────────────────────────────

/** Age of an ISO time, same formatter as every duration on web and CLI. */
function ageSince(
  iso: string | null,
  now: number,
  locale: CountryLanguage,
): string {
  return iso
    ? formatDuration(Math.max(0, now - new Date(iso).getTime()), locale)
    : "";
}

function ageUntil(
  iso: string | null,
  now: number,
  locale: CountryLanguage,
): string {
  return iso
    ? formatDuration(Math.max(0, new Date(iso).getTime() - now), locale)
    : "";
}

function formatMs(ms: number | null, locale: CountryLanguage): string {
  return ms === null ? "–" : formatDuration(ms, locale);
}

function formatPct(value: number | null, locale: CountryLanguage): string {
  return value === null
    ? "–"
    : new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 0,
      }).format(value);
}

function statusLabel(
  status: typeof CronTaskStatusValue | null,
  locale: CountryLanguage,
): string {
  if (!status) {
    return "";
  }
  return tasksScopedTranslation.scopedT(locale).t(status).toLowerCase();
}

/** One-line explanation of why a task needs attention. */
function attentionDetail(
  task: CronHealthAttentionTask,
  now: number,
  t: CronStatsT,
  locale: CountryLanguage,
): string {
  if (task.state === TaskHealth.STUCK) {
    const running = t("widget.attention.runningFor", {
      age: ageSince(task.runStartedAt, now, locale),
      timeout: formatMs(task.timeoutMs, locale),
      limit: formatMs(task.stuckAfterMs, locale),
    });
    return task.lastRunAt
      ? running
      : `${running} · ${t("widget.attention.neverCompleted")}`;
  }
  if (task.state === TaskHealth.RECOVERING) {
    return t("widget.attention.recoveringDetail", {
      count: RECOVERY_RUNS,
      rate: formatPct(task.successRate, locale),
      runs: task.finishedInWindow,
    });
  }
  if (task.state === TaskHealth.FLAKY) {
    const parts = [
      t("widget.attention.flakyDetail", {
        rate: formatPct(task.successRate, locale),
        runs: task.finishedInWindow,
      }),
    ];
    if (task.lastRunAt) {
      parts.push(
        t("widget.attention.failedAgo", {
          status: statusLabel(task.lastStatus, locale),
          age: ageSince(task.lastRunAt, now, locale),
        }),
      );
    }
    return parts.join(" · ");
  }
  if (task.state === TaskHealth.OVERDUE) {
    return t("widget.attention.missed", {
      due: ageSince(task.dueAt, now, locale),
      last: task.lastRunAt
        ? t("widget.attention.lastAgo", {
            age: ageSince(task.lastRunAt, now, locale),
          })
        : t("widget.attention.lastNever"),
    });
  }
  const parts = [
    t("widget.attention.failedAgo", {
      status: statusLabel(task.lastStatus, locale),
      age: ageSince(task.lastRunAt, now, locale),
    }),
  ];
  if (task.consecutiveFailures > 1) {
    parts.push(
      t("widget.attention.streak", { count: task.consecutiveFailures }),
    );
  }
  if (task.failuresInWindow > 0) {
    parts.push(
      t("widget.attention.failuresInPeriod", {
        count: task.failuresInWindow,
      }),
    );
  }
  return parts.join(" · ");
}

function lastRunText(
  task: CronHealthTaskRow,
  now: number,
  t: CronStatsT,
  locale: CountryLanguage,
): string {
  if (task.orphanedRunSince) {
    return t("widget.table.orphaned", {
      age: ageSince(task.orphanedRunSince, now, locale),
    });
  }
  if (task.lastStatus === CronTaskStatus.RUNNING) {
    const running =
      `${t("enums.taskHealth.running")} ${ageSince(task.runStartedAt, now, locale)}`.trim();
    return task.lastRunAt
      ? running
      : `${running}, ${t("widget.attention.neverCompleted")}`;
  }
  if (!task.lastRunAt) {
    return task.lastStatus
      ? statusLabel(task.lastStatus, locale)
      : t("widget.table.lastNever");
  }
  return t("widget.table.last", {
    status: statusLabel(task.lastStatus, locale),
    age: ageSince(task.lastRunAt, now, locale),
  });
}

/** "failed 2.7 hr ago" (no repeated "Last"), for the narrow-screen line. */
function compactLastRun(
  task: CronHealthTaskRow,
  now: number,
  t: CronStatsT,
  locale: CountryLanguage,
): string {
  if (
    task.orphanedRunSince ||
    task.lastStatus === CronTaskStatus.RUNNING ||
    !task.lastRunAt ||
    !task.lastStatus
  ) {
    return lastRunText(task, now, t, locale);
  }
  return `${statusLabel(task.lastStatus, locale)} ${t(
    "widget.attention.lastAgo",
    {
      age: ageSince(task.lastRunAt, now, locale),
    },
  )}`;
}

function nextRunText(
  task: CronHealthTaskRow,
  now: number,
  t: CronStatsT,
  locale: CountryLanguage,
): string {
  if (task.blockedByRun) {
    return t("widget.table.blocked");
  }
  if (!task.nextRunAt) {
    return t("widget.table.nextNone");
  }
  return t("widget.table.next", { age: ageUntil(task.nextRunAt, now, locale) });
}

function taskSublabel(
  task: CronHealthTaskRow,
  now: number,
  t: CronStatsT,
  locale: CountryLanguage,
): string {
  const parts: string[] = [];
  if (
    task.displayName !== task.id &&
    !task.displayName.includes(`(${task.id})`)
  ) {
    parts.push(task.id);
  }
  parts.push(task.scheduleLabel);
  if (task.lastStatus === CronTaskStatus.SKIPPED) {
    parts.push(t("widget.table.skippedHint"));
  }
  if (task.orphanedRunSince) {
    parts.push(lastRunText(task, now, t, locale));
  }
  if (task.oneOff) {
    parts.push(t("widget.table.oneOff"));
  }
  return parts.join(" · ");
}

/** Success-rate sparkline, only when there is something to see (failures). */
function successSpark(task: CronHealthTaskRow): string {
  return task.failures > 0 && task.successTrend.length > 1
    ? sparkline(task.successTrend, 14)
    : "";
}

/** Hide a delta whose base is too small to compare against. */
function comparable(
  previous: number | null,
  base: number | null,
): number | null | undefined {
  return base === null || base < MIN_DELTA_BASE ? undefined : previous;
}

// ─── Drill-down ──────────────────────────────────────────────────────────────

interface HistoryDrill {
  taskId?: string;
  status?: string;
  from?: string;
  to?: string;
  useReportWindow?: boolean;
}

function useHistoryDrill(
  period: Report["window"] | undefined,
  includeDisabled: boolean | undefined,
): (drill: HistoryDrill) => void {
  const navigate = useRelatedEntityNavigation();
  return (drill) => {
    const historyPeriod = drill.useReportWindow === false ? undefined : period;
    const from = drill.from ?? historyPeriod?.from;
    const to = drill.to ?? historyPeriod?.to;
    navigate(async () => (await import("../history/definition")).default.GET, {
      data: {
        taskId: drill.taskId,
        status: drill.status,
        taskScope: drill.taskId
          ? undefined
          : includeDisabled
            ? TaskHistoryScope.ALL
            : TaskHistoryScope.ENABLED,
        startDate: from ? new Date(`${from}T00:00:00.000Z`) : undefined,
        endDate: to ? new Date(`${to}T23:59:59.999Z`) : undefined,
      },
    });
  };
}

function bucketEnd(key: string, bucket: Report["window"]["bucket"]): string {
  const start = new Date(`${key}T00:00:00.000Z`);
  const next =
    bucket === "day"
      ? new Date(start.getTime() + DAY_MS)
      : bucket === "week"
        ? new Date(start.getTime() + 7 * DAY_MS)
        : new Date(
            Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1),
          );
  return new Date(next.getTime() - DAY_MS).toISOString().slice(0, 10);
}

// ─── Text surfaces (CLI + MCP) ───────────────────────────────────────────────

function TextReport({
  data,
  t,
  locale,
  now,
}: {
  data: Report;
  t: CronStatsT;
  locale: CountryLanguage;
  now: number;
}): JSX.Element {
  const s = data.summary;
  const states = [
    `${t("widget.tile.failing")} ${s.failing}`,
    `${t("widget.tile.stuck")} ${s.stuck}`,
    `${t("widget.tile.overdue")} ${s.overdue}`,
    `${t("widget.tile.flaky")} ${s.flaky}`,
    `${t("enums.taskHealth.recovering")} ${s.recovering}`,
    `${t("widget.tile.lowData")} ${s.lowData}`,
    `${t("widget.cli.runningOnTime")} ${s.running}`,
    `${t("widget.tile.neverRan")} ${s.neverRan}`,
    `${t("widget.tile.disabled")} ${s.disabled}`,
    `${t("widget.tile.healthy")} ${s.healthy}/${s.enabled}`,
  ].join(" · ");

  return (
    <Div className="flex flex-col">
      {data.watchdog ? (
        <Span>
          {`!! ${data.watchdog.id}: ${t("widget.watchdogBanner", {
            state: t(data.watchdog.state).toLowerCase(),
          })}`}
        </Span>
      ) : null}
      {data.tasks.length === 1 && data.summary.total === 1 && data.tasks[0] ? (
        <Span>
          {`${t("widget.cli.state")}: ${t(data.tasks[0].state).toUpperCase()}${
            data.tasks[0].enabled
              ? ""
              : ` (${t("widget.tile.disabled").toLowerCase()})`
          }`}
        </Span>
      ) : (
        <Span>
          {t("widget.cli.states")}: {states}
        </Span>
      )}
      {data.disabledIncluded ? null : <Span>{t("widget.cli.scope")}</Span>}
      {s.parked > 0 && !s.parkedShown ? (
        <Span>{t("widget.cli.parkedHidden", { count: s.parked })}</Span>
      ) : null}
      {data.attention.length === 0 ? (
        <Span>{t("widget.cli.noAttention")}</Span>
      ) : (
        <Div className="flex flex-col">
          <Span>
            {t("widget.cli.attention")} ({data.attention.length})
          </Span>
          {data.attention.map((task) => (
            <Span key={task.id}>
              {`- ${t(task.state).toUpperCase()} | ${task.id}${task.enabled ? "" : ` (${t("widget.attention.orphaned")})`} | ${attentionDetail(task, now, t, locale)}${
                task.lastError
                  ? ` | ${t("widget.attention.lastError")}: ${task.lastError.replaceAll(/\s+/g, " ").slice(0, 160)}`
                  : ""
              }`}
            </Span>
          ))}
        </Div>
      )}
      <Span>{""}</Span>
      <Span>
        {t("widget.cli.tasks")} ({data.tasks.length})
      </Span>
      <Span>{t("widget.cli.header")}</Span>
      {data.tasks.map((task) => (
        <Span key={task.id}>
          {[
            t(task.state).toUpperCase(),
            task.oneOff ? `${task.id} (${t("widget.table.oneOff")})` : task.id,
            String(task.runs),
            String(task.failures),
            [formatPct(task.successRate, locale), successSpark(task)]
              .filter(Boolean)
              .join(" "),
            formatMs(task.p50DurationMs, locale),
            formatMs(task.p95DurationMs, locale),
            lastRunText(task, now, t, locale),
            nextRunText(task, now, t, locale),
          ].join(" | ")}
        </Span>
      ))}
      {data.summary.total === 1 ? (
        <RecentRunsText data={data} t={t} locale={locale} now={now} />
      ) : null}
      <Span>
        {data.tasks.length === 1 && data.tasks[0]
          ? data.tasks[0].state === TaskHealth.STUCK
            ? t("widget.cli.drillRunning", { id: data.tasks[0].id })
            : t("widget.cli.drill").replace("<id>", data.tasks[0].id)
          : t("widget.cli.drill")}
      </Span>
    </Div>
  );
}

function recentRunLine(
  run: Report["recentRuns"][number],
  now: number,
  t: CronStatsT,
  locale: CountryLanguage,
): string {
  const head = [
    tasksScopedTranslation.scopedT(locale).t(run.status),
    t("widget.attention.lastAgo", {
      age: ageSince(run.startedAt, now, locale),
    }),
    formatMs(run.durationMs, locale),
    `${t("widget.cli.runId")} ${run.executionId}`,
  ].join(" | ");
  return run.error
    ? `${head}\n    ${t("widget.attention.lastError")}: ${run.error.slice(0, 140)}`
    : head;
}

/** Per-bucket runs, success and durations; "–" where a bucket had no runs. */
function TrendText({
  data,
  t,
  locale,
}: {
  data: Report;
  t: CronStatsT;
  locale: CountryLanguage;
}): JSX.Element {
  const buckets = data.runsTrend.buckets;
  const value = (
    series: Report["successTrend"]["series"],
    key: string,
    i: number,
  ): number => series.find((x) => x.key === key)?.values[i] ?? 0;
  const finished = (i: number): number =>
    value(data.runsTrend.series, "completed", i) +
    value(data.runsTrend.series, "failed", i);
  const recent = buckets.slice(-14);
  const offset = buckets.length - recent.length;
  return (
    <Div className="flex flex-col">
      <Span>{t("widget.cli.trendHeader")}</Span>
      {recent.map((key, j) => {
        const i = offset + j;
        const has = finished(i) > 0;
        return (
          <Span key={key}>
            {[
              key,
              String(finished(i)),
              has
                ? formatPct(
                    value(data.successTrend.series, "successRate", i),
                    locale,
                  )
                : "–",
              has
                ? formatMs(value(data.durationTrend.series, "p50", i), locale)
                : "–",
              has
                ? formatMs(value(data.durationTrend.series, "p95", i), locale)
                : "–",
            ].join(" | ")}
          </Span>
        );
      })}
    </Div>
  );
}

function inFlightLine(
  run: NonNullable<Report["inFlight"]>,
  now: number,
  t: CronStatsT,
  locale: CountryLanguage,
): string {
  const parts: string[] = [
    t("widget.inFlight.line", {
      age: ageSince(run.startedAt, now, locale),
      limit: formatMs(run.limitMs, locale),
      timeout: formatMs(run.timeoutMs, locale),
    }),
  ];
  if (run.stuck) {
    parts.push(t("widget.inFlight.stuck"));
  }
  parts.push(
    run.executionId
      ? `${t("widget.inFlight.run")} ${run.executionId}`
      : t("widget.inFlight.noRun"),
  );
  return parts.join(" · ");
}

/** Compact CLI trend: one sparkline per series, no per-day tables. */
function SparkSummary({
  data,
  t,
  locale,
}: {
  data: Report;
  t: CronStatsT;
  locale: CountryLanguage;
}): JSX.Element {
  const total = (values: readonly number[]): string =>
    new Intl.NumberFormat(locale).format(values.reduce((a, b) => a + b, 0));
  const label: Record<string, string> = {
    completed: t("widget.chart.completed"),
    failed: t("widget.chart.failed"),
    other: t("widget.chart.other"),
  };
  return (
    <Div className="flex flex-col">
      <Span>{`${t("widget.chart.runs")} (${t("widget.cli.byDay")})`}</Span>
      {data.runsTrend.series.map((x) => (
        <Span key={x.key}>
          {`  ${(label[x.key] ?? x.key).padEnd(24)} ${sparkline(x.values, 30)}  ${total(x.values)}`}
        </Span>
      ))}
      {data.failuresByTask.series.length > 0 ? (
        <>
          <Span>{`${t("widget.chart.byTask")} (${t("widget.cli.byDay")})`}</Span>
          {data.failuresByTask.series.map((x) => (
            <Span key={x.key}>
              {`  ${(data.taskOptions.some((o) => o.id === x.key) ? x.key : t("widget.chart.otherTasks")).padEnd(24)} ${sparkline(x.values, 30)}  ${total(x.values)}`}
            </Span>
          ))}
        </>
      ) : null}
      <Span>{t("widget.cli.daysHint")}</Span>
    </Div>
  );
}

function RecentRunsText({
  data,
  t,
  locale,
  now,
}: {
  data: Report;
  t: CronStatsT;
  locale: CountryLanguage;
  now: number;
}): JSX.Element {
  return (
    <Div className="flex flex-col">
      <Span>{""}</Span>
      {data.inFlight ? (
        <Span>{`${t("widget.inFlight.title").toUpperCase()} | ${inFlightLine(data.inFlight, now, t, locale)}`}</Span>
      ) : null}
      <Span>
        {t("widget.cli.recentRuns", { count: data.recentRuns.length })}
      </Span>
      {data.recentRuns.length === 0 ? (
        <Span>{t("widget.cli.noRuns")}</Span>
      ) : (
        data.recentRuns.map((run) => (
          <Span
            key={run.startedAt}
          >{`- ${recentRunLine(run, now, t, locale)}`}</Span>
        ))
      )}
    </Div>
  );
}

function RecentRunsPanel({
  data,
  t,
  locale,
  now,
}: {
  data: Report;
  t: CronStatsT;
  locale: CountryLanguage;
  now: number;
}): JSX.Element {
  const tStatus = tasksScopedTranslation.scopedT(locale).t;
  return (
    <Div className="flex min-w-0 flex-col overflow-hidden rounded-lg border">
      {data.inFlight ? (
        <Div
          className={cn(
            "flex min-w-0 flex-col gap-1 border-b px-3 py-2",
            data.inFlight.stuck ? "bg-destructive/5" : "bg-info/5",
          )}
        >
          <Div className="flex flex-wrap items-center gap-2">
            <StatusPill
              status={CronTaskStatus.RUNNING}
              variant={data.inFlight.stuck ? "danger" : "info"}
              label={t("widget.inFlight.title")}
            />
            <Span className="text-xs tabular-nums">
              {inFlightLine(data.inFlight, now, t, locale)}
            </Span>
          </Div>
        </Div>
      ) : null}
      <Span className="border-b px-3 py-2 text-sm font-semibold">
        {t("widget.cli.recentRuns", { count: data.recentRuns.length })}
      </Span>
      {data.recentRuns.length === 0 ? (
        <Span className="px-3 py-2.5 text-sm text-muted-foreground">
          {t("widget.cli.noRuns")}
        </Span>
      ) : (
        <Div className="flex flex-col divide-y">
          {data.recentRuns.map((run) => (
            <Div
              key={run.startedAt}
              className="flex min-w-0 flex-col gap-1 px-3 py-2"
            >
              <Div className="flex flex-wrap items-center gap-2 text-xs tabular-nums">
                <StatusPill
                  status={run.status}
                  variant={
                    run.status === CronTaskStatus.COMPLETED
                      ? "success"
                      : FAILED_STATUSES.some((st) => st === run.status)
                        ? "danger"
                        : "muted"
                  }
                  label={tStatus(run.status)}
                />
                <Span className="text-muted-foreground">
                  {t("widget.attention.lastAgo", {
                    age: ageSince(run.startedAt, now, locale),
                  })}
                </Span>
                <Span>{formatMs(run.durationMs, locale)}</Span>
              </Div>
              {run.error ? (
                <Span className="line-clamp-2 break-words font-mono text-xs text-destructive">
                  {run.error}
                </Span>
              ) : null}
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
}

// ─── Web sections ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }): JSX.Element {
  return (
    <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </Span>
  );
}

function AttentionPanel({
  data,
  t,
  locale,
  now,
  onOpen,
}: {
  data: Report;
  t: CronStatsT;
  locale: CountryLanguage;
  now: number;
  onOpen: (drill: HistoryDrill) => void;
}): JSX.Element {
  if (data.attention.length === 0) {
    return (
      <Div className="rounded-lg border px-3 py-2.5">
        <Span className="text-sm text-muted-foreground">
          {t(
            data.summary.total === 0
              ? "widget.table.empty"
              : "widget.attention.empty",
          )}
        </Span>
      </Div>
    );
  }
  return (
    <Div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-destructive/30">
      <Div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-destructive/20 bg-destructive/5 px-3 py-2">
        <Span className="text-sm font-medium">
          {t("widget.attention.subtitle")}
        </Span>
      </Div>
      <Div className="flex flex-col divide-y">
        {data.attention.map((task) => (
          <Div
            key={task.id}
            className="flex min-w-0 flex-col gap-2 px-3 py-2.5 @md:flex-row @md:items-start @md:justify-between"
          >
            <Div className="flex min-w-0 flex-col gap-1">
              <Div className="flex min-w-0 flex-wrap items-center gap-2">
                <StatusPill
                  status={task.state}
                  variant={HEALTH_VARIANT[task.state]}
                  label={t(task.state)}
                />
                <Span className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">
                  {task.displayName}
                </Span>
                {task.displayName !== task.id &&
                !task.displayName.includes(`(${task.id})`) ? (
                  <Span className="min-w-0 font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">
                    {task.id}
                  </Span>
                ) : null}
                {task.enabled ? null : (
                  <StatusPill
                    status={TaskHealth.DISABLED}
                    variant="muted"
                    label={t("widget.attention.orphaned")}
                  />
                )}
              </Div>
              <Span className="text-xs text-muted-foreground tabular-nums">
                {attentionDetail(task, now, t, locale)}
              </Span>
              {task.state === TaskHealth.FAILING ||
              ((task.state === TaskHealth.FLAKY ||
                task.state === TaskHealth.RECOVERING) &&
                task.lastError) ? (
                <Span className="line-clamp-2 break-words font-mono text-xs text-destructive">
                  {task.lastError ?? t("widget.attention.noError")}
                </Span>
              ) : null}
            </Div>
            <Div className="flex flex-wrap gap-1.5">
              {task.state === TaskHealth.FAILING ||
              task.state === TaskHealth.FLAKY ||
              task.state === TaskHealth.RECOVERING ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(): void =>
                    onOpen({
                      taskId: task.id,
                      status: FAILED_STATUS_FILTER,
                      useReportWindow: false,
                    })
                  }
                >
                  {t("widget.attention.openFailures")}
                </Button>
              ) : null}
              {task.state === TaskHealth.STUCK ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(): void =>
                    onOpen({
                      taskId: task.id,
                      status: CronTaskStatus.RUNNING,
                      from: task.runStartedAt?.slice(0, 10),
                      useReportWindow: false,
                    })
                  }
                >
                  {t("widget.attention.openRunning")}
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={(): void =>
                  onOpen({ taskId: task.id, useReportWindow: false })
                }
              >
                {t("widget.attention.openRuns")}
              </Button>
            </Div>
          </Div>
        ))}
      </Div>
    </Div>
  );
}

/** Colour of one bucket in the success strip. */
function stripTone(rate: number, disabled: boolean): string {
  if (disabled) {
    return "bg-muted-foreground/40";
  }
  if (rate >= 1) {
    return "bg-success";
  }
  return rate >= 0.5 ? "bg-warning" : "bg-destructive";
}

/**
 * Success strip: one full-height block per day that had runs, green when all
 * passed, amber for some failures, red for mostly or all failed. A 0% day is
 * a solid red block, never a thin line.
 */
function SuccessTrendCell({
  task,
  t,
  locale,
}: {
  task: CronHealthTaskRow;
  t: CronStatsT;
  locale: CountryLanguage;
}): JSX.Element {
  const disabled = task.state === TaskHealth.DISABLED;
  const stuck = task.state === TaskHealth.STUCK;
  const strip = task.successTrend.slice(
    stuck ? -(STRIP_DAYS - 1) : -STRIP_DAYS,
  );
  return (
    <Div className="flex items-center justify-end gap-2">
      {strip.length > 0 || stuck ? (
        <Div aria-hidden className="flex h-4 items-stretch gap-px">
          {strip.map((rate, index) => (
            <Span
              key={`${task.id}-${String(index)}`}
              className={cn("w-1.5 rounded-[1px]", stripTone(rate, disabled))}
            />
          ))}
          {stuck ? (
            // The current run: hung past its limit, whatever the history says.
            <Span className="ms-0.5 w-1.5 animate-pulse rounded-[1px] bg-destructive" />
          ) : null}
        </Div>
      ) : null}
      {stuck ? (
        <Span className="whitespace-nowrap text-right text-xs font-medium text-destructive">
          {t("widget.table.runningTooLong")}
        </Span>
      ) : (
        <Span className="w-10 whitespace-nowrap text-right tabular-nums">
          {formatPct(task.successRate, locale)}
        </Span>
      )}
    </Div>
  );
}

function LastRunCell({
  task,
  now,
  t,
  locale,
}: {
  task: CronHealthTaskRow;
  now: number;
  t: CronStatsT;
  locale: CountryLanguage;
}): JSX.Element {
  const tStatus = tasksScopedTranslation.scopedT(locale).t;
  if (!task.lastStatus) {
    return (
      <Span className="text-xs text-muted-foreground">
        {t("widget.table.lastNever")}
      </Span>
    );
  }
  const variant: StatusPillVariant =
    task.state === TaskHealth.DISABLED
      ? "muted"
      : task.lastStatus === CronTaskStatus.COMPLETED
        ? "success"
        : FAILED_STATUSES.some((st) => st === task.lastStatus)
          ? "danger"
          : task.lastStatus === CronTaskStatus.RUNNING
            ? "info"
            : "muted";
  const age =
    task.lastStatus === CronTaskStatus.RUNNING
      ? ageSince(task.runStartedAt, now, locale)
      : ageSince(task.lastRunAt, now, locale);
  return (
    <Div className="flex flex-wrap items-center justify-end gap-1.5">
      <StatusPill
        status={task.lastStatus}
        variant={variant}
        label={tStatus(task.lastStatus)}
      />
      {age ? (
        <Span className="text-xs tabular-nums text-muted-foreground">
          {age}
        </Span>
      ) : null}
    </Div>
  );
}

function TaskCards({
  tasks,
  t,
  locale,
  now,
  onOpen,
}: {
  tasks: readonly CronHealthTaskRow[];
  t: CronStatsT;
  locale: CountryLanguage;
  now: number;
  onOpen?: (taskId: string) => void;
}): JSX.Element {
  const count = new Intl.NumberFormat(locale);
  return (
    <Div className="flex flex-col divide-y @lg:hidden">
      {tasks.map((task) => {
        const schedule = taskSublabel(task, now, t, locale);
        return (
          <Div key={task.id} className="flex min-w-0 flex-col gap-2 px-3 py-3">
            <Div className="flex flex-wrap items-center gap-2">
              <Span className="min-w-0 text-sm font-semibold [overflow-wrap:anywhere]">
                {task.displayName}
              </Span>
              {healthPill(task.state, t(task.state))}
            </Div>
            {schedule && (
              <Span className="text-xs text-muted-foreground [overflow-wrap:anywhere]">
                {schedule}
              </Span>
            )}
            <Div className="grid grid-cols-3 gap-2 text-xs tabular-nums">
              <Span className="flex flex-col gap-0.5">
                <Span className="text-muted-foreground">
                  {t("widget.table.runs")}
                </Span>
                {count.format(task.runs)}
              </Span>
              <Span className="flex flex-col gap-0.5">
                <Span className="text-muted-foreground">
                  {t("widget.table.failures")}
                </Span>
                {count.format(task.failures)}
              </Span>
              <Span className="flex flex-col gap-0.5">
                <Span className="text-muted-foreground">
                  {t("widget.table.successRate")}
                </Span>
                {formatPct(task.successRate, locale)}
              </Span>
            </Div>
            <Span className="text-xs text-muted-foreground">
              {t("widget.table.lastLine", {
                last: compactLastRun(task, now, t, locale),
                next: nextRunText(task, now, t, locale),
              })}
            </Span>
            {onOpen && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="self-start"
                onClick={(): void => onOpen(task.id)}
              >
                {t("widget.viewHistory")}
              </Button>
            )}
          </Div>
        );
      })}
    </Div>
  );
}

function TaskTable({
  tasks,
  t,
  locale,
  now,
  onOpen,
}: {
  tasks: readonly CronHealthTaskRow[];
  t: CronStatsT;
  locale: CountryLanguage;
  now: number;
  onOpen?: (taskId: string) => void;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col overflow-hidden rounded-lg border">
      <Div className="flex flex-col gap-0.5 border-b px-3 py-2">
        <Span className="text-sm font-semibold" aria-live="polite">
          {t("widget.table.title")} (
          {new Intl.NumberFormat(locale).format(tasks.length)})
        </Span>
        <Span className="text-xs text-muted-foreground">
          {t("widget.table.subtitle")}
        </Span>
      </Div>
      {tasks.length === 0 ? (
        <Span className="px-3 py-4 text-sm text-muted-foreground">
          {t("widget.table.empty")}
        </Span>
      ) : (
        <>
          <TaskCards
            tasks={tasks}
            t={t}
            locale={locale}
            now={now}
            onOpen={onOpen}
          />
          <Div className="hidden @lg:block">
            <Table scrollLabel={t("widget.table.title")}>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("widget.table.dimension")}</TableHead>
                  <TableHead className="hidden text-right @2xl:table-cell">
                    {t("widget.table.runs")}
                  </TableHead>
                  <TableHead className="hidden text-right @2xl:table-cell">
                    {t("widget.table.failures")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("widget.table.trendCol")}
                  </TableHead>
                  <TableHead className="hidden text-right @4xl:table-cell">
                    {t("widget.table.p50")}
                  </TableHead>
                  <TableHead className="hidden text-right @4xl:table-cell">
                    {t("widget.table.p95")}
                  </TableHead>
                  <TableHead className="hidden text-right @xl:table-cell">
                    {t("widget.table.lastRun")}
                  </TableHead>
                  <TableHead className="hidden text-right @3xl:table-cell">
                    {t("widget.table.nextRun")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const sub = taskSublabel(task, now, t, locale);
                  return (
                    <TableRow
                      key={task.id}
                      className={cn(
                        task.state === TaskHealth.DISABLED &&
                          "text-muted-foreground",
                      )}
                    >
                      <TableCell className="min-w-0">
                        <Div className="flex min-w-0 items-start gap-2">
                          {healthPill(task.state, t(task.state))}
                          <Div className="flex min-w-0 flex-col">
                            {onOpen ? (
                              <Button
                                type="button"
                                variant="link"
                                className="h-auto min-w-0 justify-start p-0 text-start whitespace-normal [overflow-wrap:anywhere]"
                                onClick={(): void => onOpen(task.id)}
                              >
                                {task.displayName}
                              </Button>
                            ) : (
                              <Span className="break-words text-sm font-medium">
                                {task.displayName}
                              </Span>
                            )}
                            {sub ? (
                              <Span className="break-words text-xs text-muted-foreground">
                                {sub}
                              </Span>
                            ) : null}
                            {task.orphanedRunSince ? null : (
                              <Span className="text-xs text-muted-foreground @xl:hidden">
                                {t("widget.table.lastLine", {
                                  last: compactLastRun(task, now, t, locale),
                                  next: nextRunText(task, now, t, locale),
                                })}
                                {task.failures > 0
                                  ? ` · ${t("widget.table.failedCount", { count: task.failures })}`
                                  : ""}
                              </Span>
                            )}
                          </Div>
                        </Div>
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums @2xl:table-cell">
                        {new Intl.NumberFormat(locale).format(task.runs)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "hidden text-right tabular-nums @2xl:table-cell",
                          task.failures > 0 &&
                            task.state !== TaskHealth.DISABLED &&
                            "text-destructive",
                        )}
                      >
                        {new Intl.NumberFormat(locale).format(task.failures)}
                      </TableCell>
                      <TableCell>
                        <SuccessTrendCell task={task} t={t} locale={locale} />
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-right tabular-nums @4xl:table-cell">
                        {formatMs(task.p50DurationMs, locale)}
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-right tabular-nums @4xl:table-cell">
                        <Span className="inline-flex items-center justify-end gap-1.5">
                          {task.durationTrend.length > 1 ? (
                            <Span
                              aria-hidden
                              className="font-mono text-[10px] leading-none tracking-tighter text-muted-foreground"
                            >
                              {sparkline(task.durationTrend, 10)}
                            </Span>
                          ) : null}
                          {formatMs(task.p95DurationMs, locale)}
                        </Span>
                      </TableCell>
                      <TableCell className="hidden @xl:table-cell">
                        <LastRunCell
                          task={task}
                          now={now}
                          t={t}
                          locale={locale}
                        />
                      </TableCell>
                      <TableCell className="hidden text-right text-xs tabular-nums @3xl:table-cell">
                        {task.blockedByRun
                          ? t("widget.table.blocked")
                          : task.nextRunAt
                            ? ageUntil(task.nextRunAt, now, locale)
                            : t("widget.table.nextNone")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Div>
        </>
      )}
    </Div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function CronStatsContainer({ field }: WidgetProps): JSX.Element {
  const data = useWidgetValue<typeof statsEndpoints.GET>();
  const form = useWidgetForm<typeof statsEndpoints.GET>();
  const t = useWidgetTranslation<typeof statsEndpoints.GET>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const isSubmitting = useWidgetIsSubmitting() ?? false;
  const read = useWidgetEndpointMutations()?.read;
  const response = useWidgetResponse();
  const navigate = useRelatedEntityNavigation();
  const taskTable = useRef<DivRefObject>(null);
  const [showTrends, setShowTrends] = useState(false);
  const openHistory = useHistoryDrill(data?.window, data?.disabledIncluded);
  const textMode = isCliPlatform(platform) || isAgentPlatform(platform);

  const taskId = form?.watch("taskId") ?? "";
  const health = form?.watch("health") ?? TaskHealthFilter.ALL;
  const includeParked = form?.watch("includeParked") ?? false;
  const includeDisabled = form?.watch("includeDisabled") ?? false;

  const setTask = (value: string): void => {
    form?.setValue("taskId", value, { shouldDirty: true });
  };
  const setHealth = (value: typeof TaskHealthFilterValue): void => {
    form?.setValue("health", value, { shouldDirty: true });
  };
  const setIncludeDisabled = (value: boolean): void => {
    form?.setValue("includeDisabled", value, { shouldDirty: true });
  };
  const setIncludeParked = (value: boolean): void => {
    form?.setValue("includeParked", value, { shouldDirty: true });
  };

  if (!data) {
    // A failed load shows the error (with retry via refresh), never an endless spinner.
    return (
      <WidgetShell>
        <FormAlertWidget field={{}} />
        {response?.success === false ? (
          interactive ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={(): void => void read?.refetch()}
            >
              {t("widget.refresh")}
            </Button>
          ) : null
        ) : (
          <LoadingBlock message={t("widget.title")} />
        )}
      </WidgetShell>
    );
  }

  const now = Date.parse(data.generatedAt);
  const showDays = data.dayTables;
  const k = data.kpis;
  const runsSeries = data.runsTrend.series;
  const sparkFor = (key: string): readonly number[] | undefined =>
    runsSeries.find((s) => s.key === key)?.values;
  const totalRunsSpark = sumSeries(data.runsTrend.buckets, runsSeries);
  const hasCompleted = (
    runsSeries.find((x) => x.key === "completed")?.values ?? []
  ).some((v) => v > 0);
  const seriesLabel: Record<string, string> = {
    completed: t("widget.chart.completed"),
    failed: t("widget.chart.failed"),
    other: t("widget.chart.other"),
    successRate: t("widget.chart.successRate"),
    p50: t("widget.chart.p50"),
    p95: t("widget.chart.p95"),
  };

  const selectedTaskName = data.taskOptions.find((o) => o.id === taskId)?.name;
  const filters = taskId
    ? [
        {
          key: "taskId",
          label: t("widget.filter.task"),
          value: selectedTaskName ?? taskId,
          onRemove: (): void => setTask(""),
        },
      ]
    : [];

  const toolbar = (
    <AnalyticsToolbar
      locale={locale}
      period={data.window}
      value={{
        range: form?.watch("range"),
        granularity: form?.watch("granularity"),
        from: form?.watch("from"),
        to: form?.watch("to"),
      }}
      onChange={(patch): void => {
        if (patch.range !== undefined) {
          form?.setValue("range", patch.range, { shouldDirty: true });
        }
        if (patch.granularity !== undefined) {
          form?.setValue("granularity", patch.granularity, {
            shouldDirty: true,
          });
        }
        if ("from" in patch) {
          form?.setValue("from", patch.from, { shouldDirty: true });
        }
        if ("to" in patch) {
          form?.setValue("to", patch.to, { shouldDirty: true });
        }
      }}
      onRefresh={interactive ? (): void => void read?.refetch() : undefined}
      isLoading={isSubmitting}
      filters={filters}
      onClearFilters={(): void => {
        setTask("");
        setIncludeDisabled(false);
      }}
    >
      {interactive ? (
        <>
          <Select
            value={taskId || "all"}
            onValueChange={(value): void =>
              setTask(value === "all" ? "" : value)
            }
          >
            <SelectTrigger
              className="h-7 w-auto min-w-0 max-w-48 text-xs"
              aria-label={t("widget.filter.task")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("widget.filter.allTasks")}</SelectItem>
              {data.taskOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      ) : null}
    </AnalyticsToolbar>
  );

  const periodTiles = (
    <KpiGrid
      columns={6}
      className="[&_.truncate]:whitespace-normal [&_.truncate]:break-words"
    >
      <KpiTile
        label={t("widget.tile.runs")}
        value={k.runs.value}
        previous={comparable(k.runs.previous, k.runs.previous)}
        locale={locale}
        sparkline={totalRunsSpark}
        onClick={interactive ? (): void => openHistory({ taskId }) : undefined}
      />
      <KpiTile
        label={t("widget.tile.failedRuns")}
        value={k.failedRuns.value}
        previous={comparable(k.failedRuns.previous, k.failedRuns.previous)}
        invertDelta
        tone={k.failedRuns.value > 0 ? "negative" : "default"}
        locale={locale}
        sparkline={sparkFor("failed")}
        onClick={
          interactive
            ? (): void => openHistory({ taskId, status: FAILED_STATUS_FILTER })
            : undefined
        }
      />
      <KpiTile
        label={t("widget.tile.successRate")}
        value={k.successRate.value}
        previous={comparable(k.successRate.previous, k.runs.previous)}
        format="percent"
        hint={t("widget.tile.successRateHint")}
        locale={locale}
      />
      <KpiTile
        label={t("widget.tile.tasksWithFailures")}
        value={data.tasksWithFailures.value}
        hint={t("widget.tile.tasksWithFailuresHint", {
          total: data.tasksWithFailures.total,
        })}
        tone={data.tasksWithFailures.value > 0 ? "negative" : "default"}
        locale={locale}
        onClick={
          interactive
            ? (): void => {
                setHealth(TaskHealthFilter.WITH_FAILURES);
                taskTable.current?.scrollIntoView({ block: "start" });
                taskTable.current?.focus?.();
              }
            : undefined
        }
      />
      <KpiTile
        label={t("widget.tile.p50Duration")}
        value={hasCompleted ? k.p50DurationMs.value : null}
        previous={comparable(k.p50DurationMs.previous, k.runs.previous)}
        format="duration"
        hint={
          hasCompleted
            ? t("widget.tile.completedOnly")
            : t("widget.tile.noCompleted")
        }
        invertDelta
        locale={locale}
      />
      <KpiTile
        label={t("widget.tile.p95Duration")}
        value={hasCompleted ? k.p95DurationMs.value : null}
        previous={comparable(k.p95DurationMs.previous, k.runs.previous)}
        format="duration"
        invertDelta
        locale={locale}
      />
    </KpiGrid>
  );

  const runsChart = (
    <TimeSeriesChart
      title={t("widget.chart.runs")}
      subtitle={interactive ? t("widget.chart.runsSubtitle") : undefined}
      buckets={data.runsTrend.buckets}
      bucket={data.window.bucket}
      series={runsSeries.map((s) => ({
        key: s.key,
        label: seriesLabel[s.key] ?? s.key,
        values: s.values,
        color: seriesColor(s.key),
      }))}
      variant="stacked-bar"
      locale={locale}
      height={200}
      onBucketClick={
        interactive
          ? (key): void =>
              openHistory({
                taskId,
                from: key,
                to: bucketEnd(key, data.window.bucket),
              })
          : undefined
      }
    />
  );

  const successChart = (
    <TimeSeriesChart
      title={t("widget.chart.successRate")}
      subtitle={t("widget.chart.successRateSubtitle")}
      buckets={data.successTrend.buckets}
      bucket={data.window.bucket}
      series={data.successTrend.series.map((s) => ({
        key: s.key,
        label: seriesLabel[s.key] ?? s.key,
        values: s.values,
        color: seriesColor(s.key),
        total: k.successRate.value,
      }))}
      variant="bar"
      format="percent"
      locale={locale}
      height={160}
    />
  );

  const durationSeries = (key: "p50" | "p95"): readonly number[] =>
    data.durationTrend.series.find((x) => x.key === key)?.values ?? [];
  const durationChart = (key: "p50" | "p95"): JSX.Element => (
    <TimeSeriesChart
      title={
        key === "p50"
          ? t("widget.tile.p50Duration")
          : t("widget.tile.p95Duration")
      }
      subtitle={t("widget.chart.durationSplitSubtitle")}
      buckets={data.durationTrend.buckets}
      bucket={data.window.bucket}
      series={[
        {
          key,
          label: seriesLabel[key] ?? key,
          values: durationSeries(key),
          color: key === "p50" ? 1 : 4,
          total: key === "p95" ? k.p95DurationMs.value : k.p50DurationMs.value,
        },
      ]}
      variant="bar"
      format="duration"
      locale={locale}
      height={150}
    />
  );

  const nameById = new Map(data.taskOptions.map((o) => [o.id, o.name]));
  const byTaskChart =
    data.failuresByTask.series.length > 0 ? (
      <TimeSeriesChart
        title={t("widget.chart.byTask")}
        subtitle={t("widget.chart.byTaskSubtitle")}
        buckets={data.failuresByTask.buckets}
        bucket={data.window.bucket}
        series={data.failuresByTask.series.map((s, index) => ({
          key: s.key,
          label: nameById.has(s.key) ? s.key : t("widget.chart.otherTasks"),
          values: s.values,
          color: FAILURE_SLOTS[index] ?? "muted",
        }))}
        variant="stacked-bar"
        locale={locale}
        height={180}
      />
    ) : null;

  if (textMode) {
    return (
      <Div className="flex flex-col">
        {toolbar}
        <TextReport data={data} t={t} locale={locale} now={now} />
        <Span>{""}</Span>
        <Span>{t("widget.inPeriod")}</Span>
        {periodTiles}
        <Span>{""}</Span>
        {showDays ? (
          <>
            {runsChart}
            {byTaskChart}
            {data.summary.total === 1 ? (
              <TrendText data={data} t={t} locale={locale} />
            ) : null}
          </>
        ) : (
          <SparkSummary data={data} t={t} locale={locale} />
        )}
      </Div>
    );
  }

  const s = data.summary;
  return (
    <WidgetShell className="min-w-0 gap-4">
      <WidgetHeader
        className="flex-wrap"
        title={t("widget.title")}
        backButton={<NavigateButtonWidget field={field.children.backButton} />}
        actions={
          interactive ? (
            <Div className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(): void =>
                  navigate(
                    async () =>
                      (await import("../tasks/definition")).default.GET,
                  )
                }
              >
                <List className="size-4" />
                {t("widget.viewTasks")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(): void => openHistory({})}
              >
                <Clock className="size-4" />
                {t("widget.viewHistory")}
              </Button>
            </Div>
          ) : undefined
        }
      />

      <FormAlertWidget field={{}} />
      {data.watchdog ? (
        <Div
          role="alert"
          className="flex flex-wrap items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm"
        >
          {healthPill(data.watchdog.state, t(data.watchdog.state))}
          <Span className="font-mono text-xs">{data.watchdog.id}</Span>
          <Span>
            {t("widget.watchdogBanner", {
              state: t(data.watchdog.state).toLowerCase(),
            })}
          </Span>
        </Div>
      ) : null}

      <Div className="flex min-w-0 flex-col gap-2">
        <Div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <SectionLabel>{t("widget.now")}</SectionLabel>
          <Span className="text-xs text-muted-foreground">
            {t("widget.stabilityPeriod")}
          </Span>
        </Div>
        <KpiGrid columns={2}>
          <KpiTile
            label={t("widget.attention.title")}
            value={data.attention.length}
            tone={
              s.stuck + s.failing > 0
                ? "negative"
                : data.attention.length > 0
                  ? "warning"
                  : "default"
            }
            locale={locale}
          />
          <KpiTile
            label={t("widget.tile.healthy")}
            value={s.healthy}
            hint={t("widget.tile.healthyHint", { total: s.enabled })}
            tone="positive"
            locale={locale}
          />
        </KpiGrid>
        <Div className="flex flex-wrap gap-x-3 gap-y-1">
          {(
            [
              [TaskHealth.RUNNING, s.running],
              [TaskHealth.LOW_DATA, s.lowData],
              [TaskHealth.NEVER_RAN, s.neverRan],
              [TaskHealth.DISABLED, s.disabled],
            ] as const
          )
            .filter(([, count]) => count > 0)
            .map(([state, count]) => (
              <Span key={state} className="text-xs text-muted-foreground">
                {t(state)} {new Intl.NumberFormat(locale).format(count)}
              </Span>
            ))}
        </Div>
        <AttentionPanel
          data={data}
          t={t}
          locale={locale}
          now={now}
          onOpen={openHistory}
        />
      </Div>

      <Div className="flex min-w-0 flex-col gap-3">
        <Div className="flex flex-wrap items-center justify-between gap-2">
          <SectionLabel>
            {`${t("widget.inPeriod")} · ${t(data.disabledIncluded ? "widget.filter.scopeAll" : "widget.filter.scopeEnabled")}`}
          </SectionLabel>
          {interactive && !taskId ? (
            <Button
              type="button"
              size="sm"
              variant={includeDisabled ? "secondary" : "ghost"}
              aria-pressed={includeDisabled}
              onClick={(): void => setIncludeDisabled(!includeDisabled)}
            >
              {t("widget.filter.includeDisabled")}
            </Button>
          ) : null}
        </Div>
        {toolbar}
        {periodTiles}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="self-start"
          aria-expanded={showTrends}
          onClick={(): void => setShowTrends(!showTrends)}
        >
          {t(
            showTrends ? "widget.chart.hideTrends" : "widget.chart.showTrends",
          )}
        </Button>
        {showTrends && (
          <>
            {runsChart}
            {byTaskChart}
            <Div className="grid min-w-0 grid-cols-1 gap-3 @3xl:grid-cols-3">
              {successChart}
              {durationChart("p50")}
              {durationChart("p95")}
            </Div>
          </>
        )}
        {taskId && (
          <RecentRunsPanel data={data} t={t} locale={locale} now={now} />
        )}
      </Div>

      <Div
        ref={taskTable}
        tabIndex={-1}
        aria-label={t("widget.table.title")}
        className="flex min-w-0 scroll-mt-4 flex-col gap-2"
      >
        {interactive && (
          <Div className="flex flex-wrap items-center gap-2">
            <Select
              value={health}
              onValueChange={(value): void => {
                const next = TaskHealthFilterOptions.find(
                  (o) => o.value === value,
                );
                if (next) {
                  setHealth(next.value);
                }
              }}
            >
              <SelectTrigger
                className="h-auto min-h-8 w-auto min-w-0 max-w-full text-xs [&>span]:line-clamp-none [&>span]:whitespace-normal"
                aria-label={t("widget.filter.state")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TaskHealthFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {interactive && s.parked > 0 && (
              <Button
                type="button"
                size="sm"
                variant={includeParked ? "secondary" : "outline"}
                className="self-start whitespace-normal text-start"
                aria-pressed={includeParked}
                onClick={(): void => setIncludeParked(!includeParked)}
              >
                {t(
                  includeParked
                    ? "widget.filter.hideParked"
                    : "widget.filter.showParked",
                )}{" "}
                ({new Intl.NumberFormat(locale).format(s.parked)})
              </Button>
            )}
          </Div>
        )}
        <TaskTable
          tasks={data.tasks}
          t={t}
          locale={locale}
          now={now}
          onOpen={
            interactive ? (id): void => openHistory({ taskId: id }) : undefined
          }
        />
      </Div>
    </WidgetShell>
  );
}
