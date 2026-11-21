"use client";

import { Button } from "next-vibe/ui/components/button";
import { DatePicker } from "next-vibe/ui/components/date-picker";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Activity } from "next-vibe/ui/components/icons/Activity";
import { BarChart3 } from "next-vibe/ui/components/icons/BarChart3";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
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
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { type JSX, useId, useState } from "react";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import { Platform } from "../../../platforms/platforms";
import { useRelatedEntityNavigation } from "../../../unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "../../../unified-ui/widgets/interactive/navigate-button/widget";
import { CronTaskPriorityOptions, CronTaskStatus } from "../../enum";
import { scopedTranslation as tasksScopedTranslation } from "../../i18n";
import { CRON_HISTORY_PAGE_SIZE } from "./constants";
import type endpoints from "./definition";
import type { CronHistoryExecution } from "./definition";

const STATUS_FILTERS = [
  { label: "widget.filter.all", count: "all", value: "" },
  {
    label: "widget.filter.running",
    count: "running",
    value: CronTaskStatus.RUNNING,
  },
  {
    label: "widget.filter.completed",
    count: "completed",
    value: CronTaskStatus.COMPLETED,
  },
  {
    label: "widget.filter.failed",
    count: "failed",
    value: [CronTaskStatus.FAILED, CronTaskStatus.ERROR].join(","),
  },
  {
    label: "widget.filter.timeout",
    count: "timeout",
    value: CronTaskStatus.TIMEOUT,
  },
  {
    label: "widget.filter.cancelled",
    count: "cancelled",
    value: CronTaskStatus.CANCELLED,
  },
] as const;

const STATUS_VARIANTS: Partial<
  Record<CronHistoryExecution["status"], StatusPillVariant>
> = {
  [CronTaskStatus.COMPLETED]: "success",
  [CronTaskStatus.ERROR]: "danger",
  [CronTaskStatus.FAILED]: "danger",
  [CronTaskStatus.PENDING]: "warning",
  [CronTaskStatus.RUNNING]: "info",
  [CronTaskStatus.TIMEOUT]: "warning",
};

function formatDuration(ms: number, locale: CountryLanguage): string {
  if (ms < 1000) {
    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "millisecond",
    }).format(ms);
  }
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "second",
    maximumFractionDigits: 2,
  }).format(ms / 1000);
}

function ExecutionCard({
  execution,
  showTaskHistory,
}: {
  execution: CronHistoryExecution;
  showTaskHistory?: () => void;
}): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const { t: tTasks } = tasksScopedTranslation.scopedT(locale);
  const widgetIsInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = widgetIsInteractive && !responseOnly;
  const platform = useWidgetPlatform();
  const [expanded, setExpanded] = useState(false);
  const showDetails =
    expanded || platform === Platform.CLI || platform === Platform.MCP;
  const date = (value: string): string =>
    new Date(value).toLocaleString(locale, { timeZoneName: "short" });
  const result =
    execution.result && Object.keys(execution.result).length > 0
      ? execution.result
      : null;

  return (
    <Div className="flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-3">
      <Div className="flex flex-wrap items-center gap-2">
        <StatusPill
          status={tTasks(execution.status)}
          variant={STATUS_VARIANTS[execution.status] ?? "muted"}
        />
        <StatusPill status={tTasks(execution.priority)} variant="muted" />
        {execution.environment && (
          <Span className="text-xs text-muted-foreground [overflow-wrap:anywhere]">
            {execution.environment}
          </Span>
        )}
      </Div>
      <Div className="flex min-w-0 flex-col gap-1">
        <Span className="text-sm font-medium [overflow-wrap:anywhere]">
          {execution.taskDisplayName || execution.taskName}
        </Span>
        {execution.taskDisplayName &&
          execution.taskDisplayName !== execution.taskId && (
            <Span className="font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">
              {execution.taskId}
            </Span>
          )}
      </Div>
      <DetailGrid columns={3}>
        <DetailField
          label={t("widget.col.started")}
          value={date(execution.startedAt)}
        />
        {execution.completedAt && (
          <DetailField
            label={t("widget.col.completed")}
            value={date(execution.completedAt)}
          />
        )}
        {execution.durationMs !== null && (
          <DetailField
            label={t("widget.col.duration")}
            value={formatDuration(execution.durationMs, locale)}
          />
        )}
      </DetailGrid>
      {execution.error && (
        <Span className="text-sm text-destructive [overflow-wrap:anywhere]">
          {execution.error.message}
        </Span>
      )}
      {isInteractive && (
        <Div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={showDetails}
            onClick={() => setExpanded(!expanded)}
          >
            {t("widget.runDetails")}
          </Button>
          {showTaskHistory && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={showTaskHistory}
            >
              {t("widget.filter.taskHistory")}
            </Button>
          )}
        </Div>
      )}
      {showDetails && (
        <Div className="flex min-w-0 flex-col gap-2 border-t pt-3">
          <DetailGrid columns={2}>
            <DetailField
              label={t("widget.runId")}
              value={execution.id}
              mono
              copyable
            />
            <DetailField
              label={t("get.fields.taskId.label")}
              value={execution.taskId}
              mono
              copyable
            />
            {execution.error && (
              <DetailField
                label={t("widget.error.label")}
                value={execution.error.errorType.errorKey}
              />
            )}
          </DetailGrid>
          {result && (
            <Div className="flex min-w-0 flex-col gap-1">
              <Span className="text-xs font-medium">{t("widget.result")}</Span>
              <Pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs [overflow-wrap:anywhere]">
                {JSON.stringify(result, null, 2)}
              </Pre>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

export function CronHistoryContainer({
  field,
}: {
  field: (typeof endpoints.GET)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const priorityControlId = useId();
  const { t: tTasks } = tasksScopedTranslation.scopedT(locale);
  const read = useWidgetEndpointMutations()?.read;
  const widgetIsInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = widgetIsInteractive && !responseOnly;
  const response = useWidgetResponse();
  const navigate = useRelatedEntityNavigation();
  const form = useWidgetForm<typeof endpoints.GET>();
  const data = useWidgetValue<typeof endpoints.GET>();
  const [datePickerVersion, setDatePickerVersion] = useState(0);

  const taskId = form.watch("taskId") ?? "";
  const taskName = form.watch("taskName") ?? "";
  const status = form.watch("status") ?? "";
  const priority = form.watch("priority") ?? "";
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const offset = form.watch("offset") ?? 0;
  const pageSize = form.watch("limit") || CRON_HISTORY_PAGE_SIZE;
  const setOffset = (value: number): void =>
    form.setValue("offset", value, { shouldDirty: true });
  const hasError = response?.success === false;
  const isLoading = !hasError && (!data || read?.isLoading);
  const hasFilters = !!(
    taskId ||
    taskName ||
    status ||
    priority ||
    startDate ||
    endDate
  );

  const changeFilter = (
    key: "taskId" | "taskName" | "priority" | "status",
    value: string,
  ): void => {
    setOffset(0);
    form.setValue(key, value, { shouldDirty: true });
  };

  const changeDate = (
    dateField: "startDate" | "endDate",
    date: Date | undefined,
  ): void => {
    setOffset(0);
    if (date && dateField === "endDate") {
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      form.setValue(dateField, end, { shouldDirty: true });
      return;
    }
    form.setValue(dateField, date, { shouldDirty: true });
  };

  const clearFilters = (): void => {
    setOffset(0);
    form.setValue("taskName", "", { shouldDirty: true });
    form.setValue("priority", "", { shouldDirty: true });
    form.setValue("status", "", { shouldDirty: true });
    form.setValue("startDate", undefined, { shouldDirty: true });
    form.setValue("endDate", undefined, { shouldDirty: true });
    setDatePickerVersion(datePickerVersion + 1);
  };

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t("widget.title")}
        backButton={<NavigateButtonWidget field={field.children.backButton} />}
        actions={
          isInteractive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={t("widget.header.refresh")}
              onClick={() => void read?.refetch()}
            >
              <RefreshCw className="size-4" />
            </Button>
          )
        }
      />

      {isInteractive && (
        <Div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate(
                async () => (await import("../tasks/definition")).default.GET,
              )
            }
          >
            <Clock className="size-4" />
            {t("widget.header.tasks")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate(
                async () => (await import("../stats/definition")).default.GET,
              )
            }
          >
            <BarChart3 className="size-4" />
            {t("widget.header.stats")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate(
                async () =>
                  (await import("../../pulse/history/definition")).default.GET,
              )
            }
          >
            <Activity className="size-4" />
            {t("widget.header.pulse")}
          </Button>
        </Div>
      )}

      {taskId && (
        <Div className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
          <DetailGrid columns={2}>
            {data?.selectedTask && (
              <DetailField
                label={t("get.fields.taskName.label")}
                value={data.selectedTask.name}
              />
            )}
            <DetailField
              label={t("get.fields.taskId.label")}
              value={taskId}
              mono
            />
          </DetailGrid>
          {isInteractive && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => changeFilter("taskId", "")}
            >
              {t("widget.filter.allTasks")}
            </Button>
          )}
        </Div>
      )}

      {isInteractive && (
        <Div className="flex min-w-0 flex-col gap-3">
          <Div className="grid min-w-0 grid-cols-1 gap-3 @sm:grid-cols-2">
            <Div className="flex min-w-0 flex-col gap-1">
              <Span className="text-xs font-medium">
                {t("get.fields.taskName.label")}
              </Span>
              <Input
                type="text"
                name="taskName"
                aria-label={t("get.fields.taskName.label")}
                placeholder={t("widget.search.placeholder")}
                value={taskName}
                onChangeText={(value) => changeFilter("taskName", value)}
              />
            </Div>
            <Div className="flex min-w-0 flex-col gap-1">
              <Label
                htmlFor={priorityControlId}
                className="text-xs font-medium"
              >
                {t("get.fields.priority.label")}
              </Label>
              <Select
                value={priority || "all"}
                onValueChange={(value) =>
                  changeFilter("priority", value === "all" ? "" : value)
                }
              >
                <SelectTrigger id={priorityControlId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("widget.filter.allPriorities")}
                  </SelectItem>
                  {CronTaskPriorityOptions.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {tTasks(label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Div>
            {(["startDate", "endDate"] as const).map((key) => (
              <Div key={key} className="flex min-w-0 flex-col gap-1">
                <Span className="text-xs font-medium">
                  {t(`get.fields.${key}.label`)}
                </Span>
                <DatePicker
                  key={datePickerVersion}
                  name={key}
                  placeholder={t(`get.fields.${key}.label`)}
                  value={key === "startDate" ? startDate : endDate}
                  onChange={(date) => changeDate(key, date)}
                />
              </Div>
            ))}
          </Div>
          <Div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <Button
                key={filter.count}
                type="button"
                variant={status === filter.value ? "secondary" : "outline"}
                size="sm"
                aria-pressed={status === filter.value}
                onClick={() => changeFilter("status", filter.value)}
              >
                {t(filter.label)}
                {data && !isLoading && !hasError && (
                  <Span className="text-xs tabular-nums">
                    {data.statusCounts[filter.count].toLocaleString(locale)}
                  </Span>
                )}
              </Button>
            ))}
            {(taskName || status || priority || startDate || endDate) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                {t("widget.filter.clear")}
              </Button>
            )}
          </Div>
        </Div>
      )}

      <FormAlertWidget field={{}} />
      {isLoading && (
        <Div aria-live="polite">
          <LoadingBlock message={t("widget.loading")} />
        </Div>
      )}
      {data && !hasError && !isLoading && (
        <>
          <Div aria-live="polite">
            <MetricGrid columns={4}>
              <MetricCard
                label={t("widget.summary.total")}
                value={data.totalCount.toLocaleString(locale)}
              />
              <MetricCard
                label={t("widget.summary.successful")}
                value={data.summary.successfulExecutions.toLocaleString(locale)}
                variant="success"
              />
              <MetricCard
                label={t("widget.summary.failed")}
                value={data.summary.failedExecutions.toLocaleString(locale)}
                variant="danger"
              />
              {data.summary.averageDuration !== null && (
                <MetricCard
                  label={t("widget.summary.avgDuration")}
                  value={formatDuration(data.summary.averageDuration, locale)}
                />
              )}
            </MetricGrid>
          </Div>
          {data.executions.length === 0 ? (
            <EmptyBlock
              icon={<Clock className="size-8" />}
              title={t("widget.empty")}
              message={
                hasFilters
                  ? t("widget.emptyFiltered")
                  : t("widget.emptyUnfiltered")
              }
            />
          ) : (
            data.executions.map((execution) => (
              <ExecutionCard
                key={execution.id}
                execution={execution}
                showTaskHistory={
                  taskId
                    ? undefined
                    : () => {
                        clearFilters();
                        changeFilter("taskId", execution.taskId);
                      }
                }
              />
            ))
          )}
          {isInteractive && (offset > 0 || data.hasMore) && (
            <Div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
              <Span className="text-sm text-muted-foreground">
                {t("widget.pagination.info", {
                  page: Math.floor(offset / pageSize) + 1,
                  totalPages: Math.max(
                    1,
                    Math.ceil(data.totalCount / pageSize),
                  ),
                  total: data.totalCount,
                })}
              </Span>
              <Div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={offset <= 0}
                  onClick={() => setOffset(Math.max(0, offset - pageSize))}
                >
                  {t("widget.pagination.prev")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!data.hasMore}
                  onClick={() => setOffset(offset + pageSize)}
                >
                  {t("widget.pagination.next")}
                </Button>
              </Div>
            </Div>
          )}
        </>
      )}
    </WidgetShell>
  );
}
