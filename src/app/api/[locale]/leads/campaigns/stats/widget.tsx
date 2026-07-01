/**
 * Campaign Stats Widget
 * Dashboard widget for email campaign performance metrics
 */

"use client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getDefaultTimezone } from "next-vibe/core/i18n/core/localization-utils";
import { cn } from "next-vibe/core/utils/utils";
import { scopedTranslation as leadsI18n } from "next-vibe/identity/lead/i18n";
import type { EndpointLogger } from "next-vibe/logger/types";
import { formatCronScheduleShort } from "next-vibe/tasks/cron-formatter";
import { CronTaskStatus } from "next-vibe/tasks/enum";
import { Button } from "next-vibe/ui/web/ui/button";
import { DetailField } from "next-vibe/ui/web/ui/detail-grid";
import { Div } from "next-vibe/ui/web/ui/div";
import { Activity } from "next-vibe/ui/web/ui/icons/Activity";
import { AlertTriangle } from "next-vibe/ui/web/ui/icons/AlertTriangle";
import { CheckCircle2 } from "next-vibe/ui/web/ui/icons/CheckCircle2";
import { Play } from "next-vibe/ui/web/ui/icons/Play";
import { RefreshCw } from "next-vibe/ui/web/ui/icons/RefreshCw";
import { XCircle } from "next-vibe/ui/web/ui/icons/XCircle";
import { Zap } from "next-vibe/ui/web/ui/icons/Zap";
import { MetricCard } from "next-vibe/ui/web/ui/metric-card";
import { MetricGrid } from "next-vibe/ui/web/ui/metric-grid";
import { ProgressBlock } from "next-vibe/ui/web/ui/progress-block";
import { ResultBanner } from "next-vibe/ui/web/ui/result-banner";
import { SectionGroup } from "next-vibe/ui/web/ui/section-group";
import { Span } from "next-vibe/ui/web/ui/span";
import { WidgetHeader } from "next-vibe/ui/web/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/web/ui/widget-shell";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import React from "react";

import type definition from "./definition";

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;

// ── Bar row ──────────────────────────────────────────────────────────────────

function BarRow({
  label,
  value,
  max,
  color,
  suffix,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
}): React.JSX.Element {
  const widthPct = max > 0 ? `${(value / max) * 100}%` : "0%";
  return (
    <Div className="flex items-center gap-2">
      <Span className="text-xs text-muted-foreground w-28 truncate flex-shrink-0">
        {label}
      </Span>
      <Div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <Div
          style={{
            width: widthPct,
            height: "100%",
            borderRadius: "9999px",
            backgroundColor: color,
          }}
        />
      </Div>
      <Span className="text-xs tabular-nums w-14 text-right">
        {value.toLocaleString()}
        {suffix}
      </Span>
    </Div>
  );
}

// ── Stage funnel ─────────────────────────────────────────────────────────────

const STAGE_COLORS: Record<string, string> = {
  "enums.emailCampaignStage.initial": "#3b82f6",
  "enums.emailCampaignStage.followup1": "#6366f1",
  "enums.emailCampaignStage.followup2": "#8b5cf6",
  "enums.emailCampaignStage.followup3": "#a855f7",
  "enums.emailCampaignStage.nurture": "#14b8a6",
  "enums.emailCampaignStage.reactivation": "#22c55e",
};

const VARIANT_COLORS: string[] = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
];

// ── Cron health helpers ───────────────────────────────────────────────────────

function formatDate(s: string | null | undefined): string {
  if (!s) {
    return "—";
  }
  return s.slice(0, 16).replace("T", " ");
}

function formatDuration(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) {
    return "—";
  }
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${Math.round(ms / 1000)}s`;
  }
  const m = Math.floor(ms / 60000);
  const sec = Math.round((ms % 60000) / 1000);
  return `${m}m ${sec}s`;
}

function getStatusDotColor(status: string | null): string {
  switch (status) {
    case CronTaskStatus.COMPLETED:
      return "bg-success";
    case CronTaskStatus.FAILED:
    case CronTaskStatus.ERROR:
      return "bg-destructive";
    case CronTaskStatus.RUNNING:
      return "bg-primary animate-pulse";
    default:
      return "bg-gray-400";
  }
}

type CampaignTask = NonNullable<GetResponseOutput["campaignTasks"]>[number];
type TaskAlert = NonNullable<GetResponseOutput["alerts"]>[number];

function CronHealthSection({
  data,
  t,
  onRun,
  locale,
  logger,
}: {
  data: GetResponseOutput;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  onRun: (taskId: string) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): React.JSX.Element {
  const tasks: CampaignTask[] = data.campaignTasks ?? [];
  const alerts: TaskAlert[] = data.alerts ?? [];
  const stats = data.taskStats;
  const health = stats?.systemHealth ?? "healthy";

  return (
    <Div className="flex flex-col gap-3">
      {/* Health bar */}
      {stats && (
        <ResultBanner
          variant={
            health === "healthy"
              ? "success"
              : health === "warning"
                ? "warning"
                : "danger"
          }
          icon={
            health === "healthy" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )
          }
          title={t(`widget.cronHealth.${health}` as Parameters<typeof t>[0])}
          message={`${stats.enabledTasks}/${stats.totalTasks} ${t("widget.cronHealth.enabled")}${stats.successRate24h !== null ? ` · ${stats.successRate24h}%` : ""}${stats.failedTasks24h > 0 ? ` · ${stats.failedTasks24h} ${t("widget.cronHealth.failed24h")}` : ""}`}
        />
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <Div className="flex flex-col gap-2">
          <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {t("widget.cronHealth.alerts")}
          </Span>
          {alerts.map((alert) => (
            <ResultBanner
              key={alert.taskId}
              variant="danger"
              icon={<AlertTriangle className="h-3.5 w-3.5" />}
              title={alert.taskName}
              message={`${alert.consecutiveFailures} ${t("widget.cronHealth.alertFailures")}${alert.lastError ? ` · ${alert.lastError}` : ""}`}
            />
          ))}
        </Div>
      )}

      {/* Task cards */}
      {tasks.length === 0 ? (
        <Span className="text-sm text-muted-foreground text-center py-4">
          {t("widget.cronHealth.empty")}
        </Span>
      ) : (
        <Div className="grid grid-cols-1 @sm:grid-cols-3 gap-3">
          {tasks.map((task) => {
            const successRate =
              task.executionCount > 0
                ? Math.round((task.successCount / task.executionCount) * 100)
                : null;
            return (
              <Div
                key={task.id}
                className={cn(
                  "rounded-lg border p-4 flex flex-col gap-3",
                  !task.enabled && "opacity-60",
                )}
              >
                <Div className="flex items-start justify-between gap-2">
                  <Div className="flex flex-col gap-0.5 min-w-0">
                    <Div className="flex items-center gap-2">
                      <Div
                        className={cn(
                          "w-2 h-2 rounded-full flex-shrink-0",
                          task.enabled ? "bg-success" : "bg-gray-400",
                        )}
                      />
                      <Span className="font-semibold text-sm truncate">
                        {task.displayName}
                      </Span>
                    </Div>
                  </Div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 flex-shrink-0"
                    onClick={() => {
                      onRun(task.id);
                    }}
                    title={t("widget.cronHealth.runNow")}
                  >
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                </Div>
                <Div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <Span>
                    {formatCronScheduleShort(
                      task.schedule,
                      getDefaultTimezone(locale),
                      locale,
                      logger,
                    )}
                  </Span>
                  {successRate !== null && (
                    <Span
                      className={cn(
                        "font-medium",
                        successRate >= 95
                          ? "text-success"
                          : successRate >= 80
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-destructive",
                      )}
                    >
                      {successRate}%
                    </Span>
                  )}
                  {task.averageExecutionTime !== null &&
                    task.averageExecutionTime > 0 && (
                      <Span>{formatDuration(task.averageExecutionTime)}</Span>
                    )}
                </Div>
                {/* Execution dots */}
                <Div className="flex gap-1 items-center">
                  {task.recentExecutions.length === 0 ? (
                    <Span className="text-xs text-muted-foreground">—</Span>
                  ) : (
                    task.recentExecutions.map((exec, i) => (
                      <Div
                        key={i}
                        title={`${exec.status}${exec.durationMs !== null ? ` · ${exec.durationMs}ms` : ""}${exec.resultSnippet ? ` · ${exec.resultSnippet}` : ""}`}
                        className={cn(
                          "w-3 h-3 rounded-full flex-shrink-0",
                          getStatusDotColor(exec.status),
                        )}
                      />
                    ))
                  )}
                </Div>
                {task.lastResultSummary && (
                  <Span className="text-xs text-muted-foreground font-mono truncate">
                    {task.lastResultSummary}
                  </Span>
                )}
                <Div className="grid grid-cols-2 gap-2 text-xs">
                  <DetailField
                    label={t("widget.cronHealth.lastRun")}
                    value={
                      formatDate(task.lastExecutedAt) ||
                      t("widget.cronHealth.never")
                    }
                  />
                  <DetailField
                    label={t("widget.cronHealth.nextRun")}
                    value={formatDate(task.nextExecutionAt) || "—"}
                  />
                </Div>
              </Div>
            );
          })}
        </Div>
      )}
    </Div>
  );
}

// ── Rate card with ratio subtitle ───────────────────────────────────────────

function RateCard({
  label,
  rate,
  numerator,
  denominator,
  variant = "info",
}: {
  label: string;
  rate: number;
  numerator: number;
  denominator: number;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}): React.JSX.Element {
  const formatted = `${(rate * 100).toFixed(1)}%`;
  const subtitle = `${numerator.toLocaleString()} / ${denominator.toLocaleString()}`;
  return (
    <Div className="flex flex-col gap-1">
      <MetricCard label={label} value={formatted} variant={variant} />
      <Span className="text-xs text-muted-foreground pl-1">{subtitle}</Span>
    </Div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function CampaignStatsWidget(): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.GET>();
  const { push: navigate } = useWidgetNavigation();
  const data = useWidgetValue<typeof definition.GET>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const leadsT = leadsI18n.scopedT(locale).t;

  const handleRun = React.useCallback(
    (taskId: string): void => {
      void (async (): Promise<void> => {
        const m = await import("next-vibe/tasks/cron/[id]/definition");
        navigate(m.default.PUT, {
          urlPathParams: { id: taskId },
          renderInModal: true,
        });
      })();
    },
    [navigate],
  );

  const byStage = data?.byStage ?? [];
  const byVariant = data?.byJourneyVariant ?? [];

  const stageMax = Math.max(...byStage.map((s) => s.total), 1);
  const variantMax = Math.max(...byVariant.map((v) => v.total), 1);

  const hasData = data !== null && data !== undefined;

  return (
    <WidgetShell>
      {/* Header */}
      <WidgetHeader
        title={t("widget.title")}
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => endpointMutations?.read?.refetch?.()}
            title={t("widget.refresh")}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        }
      />

      {/* ── Hero row: 2 large highlight cards ───────────────────────── */}
      <Div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
        {/* Active campaigns card */}
        <Div className="rounded-xl border bg-gradient-to-br from-info/10 to-primary/10 p-5 flex flex-col gap-3">
          <Div className="flex items-center gap-2">
            <Div className="rounded-lg bg-info/10 p-2">
              <Activity className="h-4 w-4 text-info" />
            </Div>
            <Span className="text-sm font-medium text-foreground">
              {t("widget.activeCampaigns")}
            </Span>
          </Div>
          <MetricGrid columns={2}>
            <MetricCard
              label={t("get.response.pendingLeadsCount")}
              value={data?.pendingLeadsCount ?? 0}
              variant="info"
            />
            <MetricCard
              label={t("get.response.emailsScheduledToday")}
              value={data?.emailsScheduledToday ?? 0}
              variant="info"
            />
          </MetricGrid>
        </Div>

        {/* Today's activity card */}
        <Div className="rounded-xl border bg-gradient-to-br from-success/10 to-success/5 p-5 flex flex-col gap-3">
          <Div className="flex items-center gap-2">
            <Div className="rounded-lg bg-success/10 p-2">
              <Zap className="h-4 w-4 text-success" />
            </Div>
            <Span className="text-sm font-medium text-foreground">
              {t("widget.sendPerformance")}
            </Span>
          </Div>
          <MetricGrid columns={2}>
            <MetricCard
              label={t("get.response.sent")}
              value={data?.sent ?? 0}
              variant="success"
            />
            <MetricCard
              label={t("get.response.delivered")}
              value={data?.delivered ?? 0}
              variant="success"
            />
          </MetricGrid>
        </Div>
      </Div>

      {/* ── KPI row: 4 compact rate cards ───────────────────────────── */}
      <MetricGrid columns={4}>
        {hasData ? (
          <>
            <RateCard
              label={t("get.response.openRate")}
              rate={data.openRate}
              numerator={data.opened}
              denominator={data.sent}
            />
            <RateCard
              label={t("get.response.clickRate")}
              rate={data.clickRate}
              numerator={data.clicked}
              denominator={data.sent}
            />
            <RateCard
              label={t("get.response.deliveryRate")}
              rate={data.deliveryRate}
              numerator={data.delivered}
              denominator={data.total}
              variant="success"
            />
            <RateCard
              label={t("get.response.failureRate")}
              rate={data.failureRate}
              numerator={data.failed}
              denominator={data.total}
              variant={data.failureRate > 0.05 ? "danger" : "default"}
            />
          </>
        ) : (
          <>
            <MetricCard label={t("get.response.openRate")} value="—" />
            <MetricCard label={t("get.response.clickRate")} value="—" />
            <MetricCard label={t("get.response.deliveryRate")} value="—" />
            <MetricCard label={t("get.response.failureRate")} value="—" />
          </>
        )}
      </MetricGrid>

      {/* ── Lead overview (compact) ─────────────────────────────────── */}
      {hasData && data.totalLeads > 0 && (
        <SectionGroup title={t("widget.leadOverview")}>
          <MetricGrid columns={3}>
            <MetricCard
              label={t("widget.totalLeads")}
              value={data.totalLeads}
              format="compact"
            />
            <MetricCard
              label={t("widget.linkedLeadsCount")}
              value={data.linkedLeadsCount}
              format="compact"
              variant="info"
            />
            <MetricCard
              label={t("widget.uniquePersonsEstimate")}
              value={data.uniquePersonsEstimate}
              format="compact"
              variant="success"
            />
          </MetricGrid>
        </SectionGroup>
      )}

      {/* ── Stage funnel + variant breakdown side by side ────────────── */}
      <Div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
        {byStage.length > 0 && (
          <SectionGroup title={t("widget.stageLabel")}>
            <Div className="flex flex-col gap-1.5">
              {byStage.map((s) => (
                <BarRow
                  key={s.stage}
                  label={
                    leadsT(s.stage as Parameters<typeof leadsT>[0]) ?? s.stage
                  }
                  value={s.total}
                  max={stageMax}
                  color={STAGE_COLORS[s.stage] ?? "hsl(var(--primary))"}
                />
              ))}
            </Div>
          </SectionGroup>
        )}

        {byVariant.length > 0 && (
          <SectionGroup title={t("widget.variantLabel")}>
            <Div className="flex flex-col gap-1.5">
              {byVariant.map((v, i) => (
                <BarRow
                  key={v.variant}
                  label={
                    leadsT(v.variant as Parameters<typeof leadsT>[0]) ??
                    v.variant
                  }
                  value={v.total}
                  max={variantMax}
                  color={VARIANT_COLORS[i % VARIANT_COLORS.length]}
                  suffix={` · ${(v.openRate * 100).toFixed(0)}%`}
                />
              ))}
            </Div>
          </SectionGroup>
        )}
      </Div>

      {/* ── Weekly quota progress ───────────────────────────────────── */}
      {hasData && (data.quotaProgress ?? []).length > 0 && (
        <SectionGroup title={t("get.response.quotaProgress")}>
          <Div className="flex flex-col gap-3">
            {(data.quotaProgress ?? []).map((q) => {
              const pct =
                q.weeklyQuota > 0
                  ? Math.round(
                      Math.min(1, q.startedThisWeek / q.weeklyQuota) * 100,
                    )
                  : 0;
              const isAlmostFull = pct >= 90;
              const isZeroBudget = q.perRunBudget <= 0 && q.weeklyQuota > 0;
              const accPct = Math.round(Math.min(1, q.accumulator ?? 0) * 100);
              return (
                <Div key={q.locale} className="flex flex-col gap-1.5">
                  <Div className="flex items-center justify-between">
                    <Span className="text-xs font-medium">{q.locale}</Span>
                    <Div className="flex items-center gap-2">
                      {isZeroBudget ? (
                        <Span className="text-xs text-warning font-medium">
                          {t("widget.perRunBudgetZero")}
                        </Span>
                      ) : q.perRunBudget > 0 ? (
                        <Span className="text-xs text-muted-foreground tabular-nums">
                          {t("widget.perRunBudget", {
                            perRunBudget: q.perRunBudget,
                            totalRunsPerWeek: q.totalRunsPerWeek,
                          })}
                        </Span>
                      ) : null}
                      <Span className="text-xs text-muted-foreground tabular-nums">
                        {q.startedThisWeek.toLocaleString()} /{" "}
                        {q.weeklyQuota.toLocaleString()}
                      </Span>
                    </Div>
                  </Div>
                  <ProgressBlock
                    value={pct}
                    variant={isAlmostFull ? "success" : "default"}
                  />
                  {q.weeklyQuota > 0 && (
                    <Div className="flex items-center gap-1.5">
                      <Div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <Div
                          style={{
                            width: `${accPct}%`,
                            height: "100%",
                            borderRadius: "9999px",
                            backgroundColor: "#a855f7",
                          }}
                        />
                      </Div>
                      <Span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                        {t("widget.accumulator", {
                          pct: accPct,
                        })}
                      </Span>
                    </Div>
                  )}
                </Div>
              );
            })}
          </Div>
        </SectionGroup>
      )}

      {/* ── Cron health ─────────────────────────────────────────────── */}
      {hasData && (
        <SectionGroup title={t("widget.cronHealth.title")}>
          <CronHealthSection
            data={data}
            t={t}
            onRun={handleRun}
            locale={locale}
            logger={logger}
          />
        </SectionGroup>
      )}

      {/* ── Volume summary row ──────────────────────────────────────── */}
      <MetricGrid columns={4}>
        <MetricCard label={t("get.response.total")} value={data?.total ?? 0} />
        <MetricCard
          label={t("get.response.pending")}
          value={data?.pending ?? 0}
          variant="warning"
        />
        <MetricCard
          label={t("get.response.opened")}
          value={data?.opened ?? 0}
          variant="success"
        />
        <MetricCard
          label={t("get.response.clicked")}
          value={data?.clicked ?? 0}
          variant="success"
        />
      </MetricGrid>
    </WidgetShell>
  );
}
