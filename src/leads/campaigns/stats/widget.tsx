/**
 * Campaign performance widget (campaign-stats).
 * Web: engine status first (is mail leaving at all), queue health, then
 * sent/opened/clicked over time, problems and breakdowns per journey
 * variant, stage and locale. Tiles, bars and rows drill into campaign-queue.
 * CLI/MCP: the analytics components render tables and compact text.
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
  LeadStatus,
} from "next-vibe/identity/lead/enum";
import { scopedTranslation as leadsI18n } from "next-vibe/identity/lead/i18n";
import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "next-vibe/ui/components/alert";
import {
  type AnalyticsFilterChip,
  AnalyticsToolbar,
  BreakdownTable,
  type BreakdownTableRow,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
  type TimeSeriesChartSeries,
} from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { Filter } from "next-vibe/ui/components/icons/Filter";
import { List } from "next-vibe/ui/components/icons/List";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Pre } from "next-vibe/ui/components/pre";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { isValidEnumValue } from "next-vibe/unified-ui/_shared/enum";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { AnalyticsBucket } from "next-vibe/unified-ui/analytics/enum";
import { nextBucket } from "next-vibe/unified-ui/analytics/window";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import type React from "react";
import { useState } from "react";

import type { CampaignQueueGetRequestOutput } from "../queue/definition";
import { QueueDelivery } from "../queue/enum";
import type definition from "./definition";
import type { CampaignAutomation } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type QueueDrill = Partial<CampaignQueueGetRequestOutput>;
type StatsT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;

const DAY_MS = 86_400_000;

function dayDate(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

function bucketLastDay(
  key: string,
  bucket: AnalyticsBucket,
  max: string,
): Date {
  const end = new Date(nextBucket(dayDate(key), bucket).getTime() - DAY_MS);
  const cap = dayDate(max);
  return end.getTime() > cap.getTime() ? cap : end;
}

function formatWhen(value: string | null, locale: CountryLanguage): string {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString(
    locale.endsWith("-GLOBAL") ? locale.split("-")[0] : locale,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    },
  );
}

function leadLabel(key: string | null, locale: CountryLanguage): string {
  if (!key) {
    return "-";
  }
  const { t } = leadsI18n.scopedT(locale);
  if (isValidEnumValue(EmailJourneyVariant, key)) {
    return t(key);
  }
  if (isValidEnumValue(EmailCampaignStage, key)) {
    return t(key);
  }
  return key;
}

function taskStateVariant(
  state: CampaignAutomation["state"],
): "success" | "warning" | "danger" | "muted" {
  switch (state) {
    case "running":
      return "success";
    case "failing":
      return "danger";
    case "disabled":
      return "warning";
    case "missing":
      return "muted";
  }
}

function EngineStatus({
  dispatcher,
  tasks,
  dueNow,
  dueLeads,
  lastSentAt,
  sent24h,
  t,
  locale,
  onOpenQueue,
  onOpenDispatcher,
}: {
  dispatcher: CampaignAutomation;
  tasks: readonly CampaignAutomation[];
  dueNow: number;
  dueLeads: number;
  lastSentAt: string | null;
  sent24h: number;
  t: StatsT;
  locale: CountryLanguage;
  onOpenQueue: () => void;
  onOpenDispatcher: () => void;
}): React.JSX.Element {
  const off = dispatcher.state === "missing" || dispatcher.state === "disabled";
  const failing = dispatcher.state === "failing";
  return (
    <Alert
      variant={off ? "warning" : failing ? "destructive" : "success"}
      icon={off ? AlertTriangle : failing ? XCircle : CheckCircle2}
    >
      <AlertTitle>
        {off
          ? t("widget.engine.offTitle")
          : failing
            ? t("widget.engine.failingTitle", {
                count: dispatcher.consecutiveFailures,
              })
            : t("widget.engine.onTitle")}
      </AlertTitle>
      <AlertDescription>
        <Div className="flex flex-col gap-2">
          <Span>
            {dispatcher.state === "missing"
              ? t("widget.engine.missing", { count: dueNow })
              : dispatcher.state === "disabled"
                ? t("widget.engine.disabled", { count: dueNow })
                : failing
                  ? (dispatcher.lastError ?? t("widget.engine.noError"))
                  : t("widget.engine.on", {
                      last: formatWhen(dispatcher.lastRunAt, locale),
                      next: formatWhen(dispatcher.nextRunAt, locale),
                    })}
          </Span>
          <Span className="text-xs">
            {lastSentAt
              ? t("widget.engine.lastSend", {
                  when: formatWhen(lastSentAt, locale),
                  count: sent24h,
                })
              : t("widget.engine.neverSent")}
            {off && sent24h > 0 ? ` ${t("widget.engine.otherPath")}` : ""}
            {tasks.some(
              (task) =>
                task.id === "campaign-starter" &&
                (task.state === "missing" || task.state === "disabled"),
            )
              ? ` ${t("widget.engine.starterOff")}`
              : ""}
          </Span>
          <Div className="flex flex-wrap items-center gap-1.5">
            {tasks.map((task) => (
              <StatusPill
                key={task.id}
                status={task.state}
                label={`${task.id}: ${t(`widget.engine.state.${task.state}`)}`}
                variant={taskStateVariant(task.state)}
              />
            ))}
            {dueNow > 0 && (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-6 px-1 text-xs"
                onClick={onOpenQueue}
              >
                {t("widget.engine.openDue", { count: dueLeads })}
              </Button>
            )}
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-6 px-1 text-xs"
              onClick={onOpenDispatcher}
            >
              {t("widget.engine.openDispatcher")}
            </Button>
          </Div>
        </Div>
      </AlertDescription>
    </Alert>
  );
}

export function CampaignStatsWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const value = useWidgetValue<typeof definition.GET>();
  const { endpointMutations } = useWidgetContext();
  const navigate = useRelatedEntityNavigation();
  const [showFilters, setShowFilters] = useState(false);

  const submit = (): void => {
    onSubmit?.();
  };

  const journeyVariant = form.watch("journeyVariant");
  const stage = form.watch("stage");
  const localeFilter = form.watch("locale");
  const base: QueueDrill = {
    journeyVariant,
    stage,
    locale: localeFilter || undefined,
  };

  const openQueue = (extra: QueueDrill): void => {
    navigate(() => import("../queue/definition").then((m) => m.default.GET), {
      data: { ...base, ...extra },
    });
  };

  const chips: AnalyticsFilterChip[] = [];
  if (
    journeyVariant &&
    journeyVariant !== "enums.emailJourneyVariantFilter.all"
  ) {
    chips.push({
      key: "journeyVariant",
      label: t("get.fields.journeyVariant.label"),
      value: t(journeyVariant),
      onRemove: () => {
        form.setValue("journeyVariant", undefined, { shouldDirty: true });
        submit();
      },
    });
  }
  if (stage && stage !== "enums.emailCampaignStageFilter.all") {
    chips.push({
      key: "stage",
      label: t("get.fields.stage.label"),
      value: t(stage),
      onRemove: () => {
        form.setValue("stage", undefined, { shouldDirty: true });
        submit();
      },
    });
  }
  if (localeFilter) {
    chips.push({
      key: "locale",
      label: t("get.fields.locale.label"),
      value: localeFilter,
      onRemove: () => {
        form.setValue("locale", "", { shouldDirty: true });
        submit();
      },
    });
  }

  const toolbar = (
    <AnalyticsToolbar
      locale={locale}
      period={value?.window}
      value={{
        range: form.watch("range"),
        granularity: form.watch("granularity"),
        from: form.watch("from"),
        to: form.watch("to"),
      }}
      onChange={(patch) => {
        if (patch.range !== undefined) {
          form.setValue("range", patch.range, { shouldDirty: true });
        }
        if (patch.granularity !== undefined) {
          form.setValue("granularity", patch.granularity, {
            shouldDirty: true,
          });
        }
        if ("from" in patch) {
          form.setValue("from", patch.from, { shouldDirty: true });
        }
        if ("to" in patch) {
          form.setValue("to", patch.to, { shouldDirty: true });
        }
        submit();
      }}
      onRefresh={() => endpointMutations?.read?.refetch?.()}
      isLoading={endpointMutations?.read?.isLoading === true}
      filters={chips}
      onClearFilters={() => {
        form.setValue("journeyVariant", undefined, { shouldDirty: true });
        form.setValue("stage", undefined, { shouldDirty: true });
        form.setValue("locale", "", { shouldDirty: true });
        submit();
      }}
    >
      <Button
        type="button"
        variant={showFilters ? "secondary" : "outline"}
        size="sm"
        className="h-7 gap-1 text-xs"
        onClick={() => setShowFilters((v) => !v)}
        aria-expanded={showFilters}
      >
        <Filter className="h-3.5 w-3.5" />
        {t("widget.filters")}
      </Button>
    </AnalyticsToolbar>
  );

  if (!value) {
    return (
      <WidgetShell className="min-w-0">
        <WidgetHeader
          title={t("widget.title")}
          backButton={<NavigateButtonWidget field={children.backButton} />}
        />
        {toolbar}
        <FormAlertWidget field={children.formAlert} />
        {endpointMutations?.read?.isLoading !== false && (
          <LoadingBlock message={t("widget.loading")} />
        )}
      </WidgetShell>
    );
  }

  const { engine, queue, kpis, totals, trend, problems } = value;
  const bucket = value.window.bucket;
  const sendingOff =
    engine.dispatcher.state === "missing" ||
    engine.dispatcher.state === "disabled";
  const sentWindow: QueueDrill = {
    eventFrom: dayDate(value.window.from),
    eventTo: dayDate(value.window.to),
  };

  const seriesLabel: Record<string, string> = {
    sent: t("widget.series.sent"),
    opened: t("widget.series.opened"),
    clicked: t("widget.series.clicked"),
    failed: t("widget.series.failed"),
    bounced: t("widget.series.bounced"),
    unsubscribed: t("widget.series.unsubscribed"),
  };

  const oldestDueDays = queue.oldestDueDays;
  // Journey with the largest backlog (reduce over the server rows, no filtering).
  const biggest = value.byVariant.reduce<
    (typeof value.byVariant)[number] | null
  >(
    (best, row) =>
      (row.metrics.due ?? 0) > (best?.metrics.due ?? 0) ? row : best,
    null,
  );
  const queueTiles = (
    <KpiGrid columns={4}>
      <KpiTile
        label={t("widget.queue.dueNow")}
        value={queue.dueNow}
        locale={locale}
        tone={queue.dueNow > 0 && sendingOff ? "warning" : "default"}
        hint={
          queue.dueNow > 0
            ? biggest
              ? t("widget.queue.oldestBiggest", {
                  emails: queue.dueLeads,
                  journey: leadLabel(biggest.key, locale),
                  count: biggest.metrics.due ?? 0,
                })
              : t("widget.queue.oldest", { emails: queue.dueLeads })
            : t("widget.queue.nothingDue")
        }
        onClick={() => openQueue({ delivery: QueueDelivery.DUE_NOW })}
      />
      <KpiTile
        label={t("widget.queue.stuckDays")}
        value={oldestDueDays}
        locale={locale}
        tone={oldestDueDays > 1 ? "negative" : "muted"}
        hint={
          queue.oldestDueAt
            ? t("widget.queue.stuckDaysHint", {
                when: formatWhen(queue.oldestDueAt, locale),
              })
            : t("widget.queue.nothingDue")
        }
        onClick={() => openQueue({ delivery: QueueDelivery.OVERDUE })}
      />
      <KpiTile
        label={t("widget.queue.scheduled")}
        value={queue.scheduled}
        locale={locale}
        hint={
          queue.nextScheduledAt
            ? t("widget.queue.scheduledHint", {
                count: queue.scheduledNext24h,
                when: formatWhen(queue.nextScheduledAt, locale),
              })
            : t("widget.queue.nothingScheduled")
        }
        onClick={() => openQueue({ delivery: QueueDelivery.SCHEDULED })}
      />
      <KpiTile
        label={t("widget.queue.stuckClaims")}
        value={queue.stuckClaims}
        locale={locale}
        tone={queue.stuckClaims > 0 ? "negative" : "muted"}
        hint={t("widget.queue.stuckClaimsHint")}
        onClick={() => openQueue({ delivery: QueueDelivery.FAILED })}
      />
    </KpiGrid>
  );

  const performanceTiles = (
    <KpiGrid columns={6}>
      <KpiTile
        label={t("widget.kpi.sent")}
        value={kpis.sent.value}
        previous={kpis.sent.previous}
        locale={locale}
        sparkline={trend.series.find((s) => s.key === "sent")?.values}
        onClick={() =>
          openQueue({ ...sentWindow, delivery: QueueDelivery.SENT })
        }
      />
      <KpiTile
        label={t("widget.kpi.openRate")}
        value={kpis.openRate.value}
        previous={kpis.openRate.previous}
        format="percent"
        locale={locale}
        hint={t("widget.kpi.ofSent", { count: totals.opened })}
        onClick={() =>
          openQueue({ ...sentWindow, delivery: QueueDelivery.OPENED })
        }
      />
      <KpiTile
        label={t("widget.kpi.clickRate")}
        value={kpis.clickRate.value}
        previous={kpis.clickRate.previous}
        format="percent"
        locale={locale}
        hint={t("widget.kpi.ofSent", { count: totals.clicked })}
        onClick={() =>
          openQueue({ ...sentWindow, delivery: QueueDelivery.CLICKED })
        }
      />
      <KpiTile
        label={t("widget.kpi.unsubscribed")}
        value={kpis.unsubscribed.value}
        previous={kpis.unsubscribed.previous}
        locale={locale}
        invertDelta
        hint={t("widget.kpi.ofSentRate", {
          rate: formatRate(kpis.unsubscribed.value, kpis.sent.value, locale),
        })}
        onClick={() =>
          openQueue({ ...sentWindow, delivery: QueueDelivery.UNSUBSCRIBED })
        }
      />
      <KpiTile
        label={t("widget.kpi.bounced")}
        value={kpis.bounced.value}
        previous={kpis.bounced.previous}
        locale={locale}
        invertDelta
        hint={
          engine.tasks.some(
            (task) =>
              task.id === "bounce-processor" &&
              (task.state === "missing" || task.state === "disabled"),
          )
            ? t("widget.kpi.bouncedOff", {
                rate: formatRate(kpis.bounced.value, kpis.sent.value, locale),
              })
            : t("widget.kpi.ofSentRate", {
                rate: formatRate(kpis.bounced.value, kpis.sent.value, locale),
              })
        }
        onClick={() =>
          openQueue({ ...sentWindow, delivery: QueueDelivery.BOUNCED })
        }
      />
      <KpiTile
        label={t("widget.kpi.failed")}
        value={kpis.failed.value}
        previous={kpis.failed.previous}
        locale={locale}
        invertDelta
        tone={kpis.failed.value > 0 ? "negative" : "default"}
        hint={t("widget.kpi.skippedHint", { count: totals.skipped })}
        onClick={() =>
          openQueue({ ...sentWindow, delivery: QueueDelivery.FAILED })
        }
      />
    </KpiGrid>
  );

  const emptyLabel = sendingOff
    ? t("widget.emptySendingOff")
    : t("widget.empty");

  const trendChart = (
    <TimeSeriesChart
      title={t("widget.charts.trend")}
      subtitle={t("widget.charts.trendHint")}
      buckets={trend.buckets}
      bucket={bucket}
      variant="line"
      series={trend.series.map((s, i): TimeSeriesChartSeries => ({
        key: s.key,
        label: seriesLabel[s.key] ?? s.key,
        values: s.values,
        color: i === 0 ? 1 : i === 1 ? 2 : 3,
      }))}
      locale={locale}
      onBucketClick={(key) =>
        openQueue({
          delivery: QueueDelivery.SENT,
          eventFrom: dayDate(key),
          eventTo: bucketLastDay(key, bucket, value.window.to),
        })
      }
      emptyLabel={emptyLabel}
    />
  );

  const problemChart = (
    <TimeSeriesChart
      title={t("widget.charts.problems")}
      subtitle={t("widget.charts.problemsHint")}
      buckets={problems.buckets}
      bucket={bucket}
      variant="stacked-bar"
      series={problems.series.map((s, i): TimeSeriesChartSeries => ({
        key: s.key,
        label: seriesLabel[s.key] ?? s.key,
        values: s.values,
        color: i === 0 ? "negative" : i === 1 ? "warning" : "muted",
      }))}
      locale={locale}
      emptyLabel={t("widget.noProblems")}
    />
  );

  const variantTrendChart = (
    <TimeSeriesChart
      title={t("widget.charts.variantTrend")}
      subtitle={t("widget.charts.variantTrendHint")}
      buckets={value.variantTrend.buckets}
      bucket={bucket}
      variant="stacked-bar"
      series={value.variantTrend.series.map((s): TimeSeriesChartSeries => ({
        key: s.key,
        label: leadLabel(s.key, locale),
        values: s.values,
      }))}
      locale={locale}
      onBucketClick={(key) =>
        openQueue({
          delivery: QueueDelivery.SENT,
          eventFrom: dayDate(key),
          eventTo: bucketLastDay(key, bucket, value.window.to),
        })
      }
      emptyLabel={emptyLabel}
    />
  );

  const perfColumns = [
    { key: "sent", label: t("widget.columns.sent") },
    {
      key: "openRate",
      label: t("widget.columns.openRate"),
      format: "percent" as const,
    },
    {
      key: "clickRate",
      label: t("widget.columns.clickRate"),
      format: "percent" as const,
    },
    {
      key: "unsubscribed",
      label: t("widget.columns.unsubscribed"),
      secondary: true,
    },
    {
      key: "failed",
      label: t("widget.columns.failed"),
      secondary: true,
    },
    { key: "bounced", label: t("widget.columns.bounced"), secondary: true },
    { key: "due", label: t("widget.columns.due") },
  ];

  const variantTable = (
    <BreakdownTable
      title={t("widget.charts.byVariant")}
      subtitle={t("widget.charts.byVariantHint")}
      dimensionLabel={t("widget.columns.variant")}
      columns={perfColumns}
      showShare={false}
      rows={value.byVariant.map((row): BreakdownTableRow => ({
        id: row.key ?? "none",
        label: leadLabel(row.key, locale),
        values: perfValues(row.metrics),
        marker:
          (row.metrics.due ?? 0) > 0 && (row.metrics.sent ?? 0) === 0 ? (
            <StatusPill
              status="stuck"
              label={t("widget.stuck")}
              variant="warning"
            />
          ) : undefined,
        onClick: () =>
          openQueue({
            ...sentWindow,
            journeyVariant: variantFilterOf(row.key),
          }),
      }))}
      locale={locale}
      emptyLabel={emptyLabel}
    />
  );

  const stageTable = (
    <BreakdownTable
      title={t("widget.charts.byStage")}
      dimensionLabel={t("widget.columns.stage")}
      columns={perfColumns}
      showShare={false}
      rows={value.byStage.map((row): BreakdownTableRow => ({
        id: row.key ?? "none",
        label: leadLabel(row.key, locale),
        values: perfValues(row.metrics),
        marker:
          (row.metrics.due ?? 0) > 0 && (row.metrics.sent ?? 0) === 0 ? (
            <StatusPill
              status="stuck"
              label={t("widget.stuck")}
              variant="warning"
            />
          ) : undefined,
        onClick: () =>
          openQueue({ ...sentWindow, stage: stageFilterOf(row.key) }),
      }))}
      locale={locale}
      emptyLabel={emptyLabel}
    />
  );

  const localeTable = (
    <BreakdownTable
      title={t("widget.charts.byLocale")}
      dimensionLabel={t("widget.columns.locale")}
      columns={perfColumns}
      showShare={false}

      rows={value.byLocale.map((row): BreakdownTableRow => ({
        id: row.key ?? "none",
        label: row.key ?? "-",
        values: perfValues(row.metrics),
        onClick: () =>
          openQueue({ ...sentWindow, locale: row.key ?? undefined }),
      }))}
      locale={locale}
      emptyLabel={emptyLabel}
    />
  );

  const errorTable = (
    <BreakdownTable
      title={t("widget.charts.errors")}
      subtitle={t("widget.charts.errorsHint", { count: totals.skipped })}
      dimensionLabel={t("widget.columns.error")}
      columns={[{ key: "count", label: t("widget.columns.count") }]}
      shareKey="count"
      rows={value.topErrors.map((row): BreakdownTableRow => ({
        id: row.key ?? "none",
        label: errorLabel(row.key, t, locale),
        values: row.metrics,
        onClick: () =>
          openQueue({ ...sentWindow, delivery: QueueDelivery.FAILED }),
      }))}
      locale={locale}
      emptyLabel={t("widget.noErrors")}
    />
  );

  if (isCliPlatform(platform) || platform === Platform.MCP) {
    const engineLine =
      engine.dispatcher.state === "missing"
        ? t("widget.engine.missing", { count: queue.dueNow })
        : engine.dispatcher.state === "disabled"
          ? t("widget.engine.disabled", { count: queue.dueNow })
          : engine.dispatcher.state === "failing"
            ? `${t("widget.engine.failingTitle", { count: engine.dispatcher.consecutiveFailures })} ${engine.dispatcher.lastError ?? ""}`
            : t("widget.engine.on", {
                last: formatWhen(engine.dispatcher.lastRunAt, locale),
                next: formatWhen(engine.dispatcher.nextRunAt, locale),
              });
    return (
      <Div className="flex flex-col gap-4">
        <Pre>
          {engine.tasks
            .map(
              (task) => `${task.id}: ${t(`widget.engine.state.${task.state}`)}`,
            )
            .join(" | ")}
        </Pre>
        <Pre>
          {sendingOff
            ? `${t("widget.engine.offTitle")}. `
            : engine.dispatcher.state === "failing"
              ? `${t("widget.engine.failingTitle", { count: engine.dispatcher.consecutiveFailures })}. `
              : `${t("widget.engine.onTitle")}. `}
          {engineLine}{" "}
          {queue.lastSentAt
            ? t("widget.engine.lastSend", {
                when: formatWhen(queue.lastSentAt, locale),
                count: queue.sent24h,
              })
            : t("widget.engine.neverSent")}
          {sendingOff && queue.sent24h > 0
            ? ` ${t("widget.engine.otherPath")}`
            : ""}
        </Pre>
        {toolbar}
        {queueTiles}
        {performanceTiles}
        {trendChart}
        {variantTable}
        {stageTable}
        {localeTable}
        {errorTable}
      </Div>
    );
  }

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t("widget.title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => openQueue({})}
          >
            <List className="h-4 w-4" />
            <Span className="text-xs">{t("widget.openQueue")}</Span>
          </Button>
        }
      />
      <EngineStatus
        dispatcher={engine.dispatcher}
        tasks={engine.tasks}
        dueNow={queue.dueNow}
        dueLeads={queue.dueLeads}
        lastSentAt={queue.lastSentAt}
        sent24h={queue.sent24h}
        t={t}
        locale={locale}
        onOpenQueue={() => openQueue({ delivery: QueueDelivery.DUE_NOW })}
        onOpenDispatcher={() =>
          navigate(
            () =>
              import("../email-campaigns/definition").then(
                (m) => m.default.GET,
              ),
            {},
          )
        }
      />
      <Span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t("widget.groups.now")}
      </Span>
      {queueTiles}
      {toolbar}
      {showFilters && (
        <Div className="grid grid-cols-1 gap-3 rounded-lg border p-3 @sm:grid-cols-3">
          <SelectFieldWidget
            fieldName="journeyVariant"
            field={children.journeyVariant}
          />
          <SelectFieldWidget fieldName="stage" field={children.stage} />
          <TextFieldWidget fieldName="locale" field={children.locale} />
        </Div>
      )}
      <FormAlertWidget field={children.formAlert} />
      {sendingOff && kpis.sent.value === 0 && (
        <Span className="text-xs text-muted-foreground">
          {t("widget.sentNoteOff")}
        </Span>
      )}
      <Span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t("widget.groups.period")}
      </Span>
      {performanceTiles}
      {trendChart}
      {problemChart}
      {variantTrendChart}
      {variantTable}
      {stageTable}
      {localeTable}
      {errorTable}
      <Span className="text-xs text-muted-foreground">
        {t("widget.definitions")}
      </Span>
    </WidgetShell>
  );
}

/** Readable send error: skips and status changes get a translated label. */
function errorLabel(
  key: string | null,
  t: StatsT,
  locale: CountryLanguage,
): string {
  if (!key) {
    return "-";
  }
  if (key.startsWith("duplicate:")) {
    return t("widget.errors.duplicate");
  }
  if (key.startsWith("status_change:")) {
    const status = key.slice("status_change:".length);
    const { t: leadT } = leadsI18n.scopedT(locale);
    return t("widget.errors.statusChange", {
      status: isValidEnumValue(LeadStatus, status) ? leadT(status) : status,
    });
  }
  return key;
}

/** Rates are meaningless without sends: show a dash instead of 0%. */
function formatRate(
  part: number,
  whole: number,
  locale: CountryLanguage,
): string {
  if (whole <= 0) {
    return "-";
  }
  return new Intl.NumberFormat(
    locale.endsWith("-GLOBAL") ? locale.split("-")[0] : locale,
    { style: "percent", maximumFractionDigits: 1 },
  ).format(part / whole);
}

function perfValues(
  metrics: Readonly<Record<string, number>>,
): Record<string, number | null> {
  return {
    ...metrics,
    openRate: (metrics.sent ?? 0) > 0 ? (metrics.openRate ?? 0) : null,
    clickRate: (metrics.sent ?? 0) > 0 ? (metrics.clickRate ?? 0) : null,
  };
}

function variantFilterOf(key: string | null): QueueDrill["journeyVariant"] {
  switch (key) {
    case "enums.emailJourneyVariant.uncensoredConvert":
      return "enums.emailJourneyVariantFilter.uncensoredConvert";
    case "enums.emailJourneyVariant.sideHustle":
      return "enums.emailJourneyVariantFilter.sideHustle";
    case "enums.emailJourneyVariant.quietRecommendation":
      return "enums.emailJourneyVariantFilter.quietRecommendation";
    case "enums.emailJourneyVariant.signupNurture":
      return "enums.emailJourneyVariantFilter.signupNurture";
    case "enums.emailJourneyVariant.retention":
      return "enums.emailJourneyVariantFilter.retention";
    case "enums.emailJourneyVariant.winback":
      return "enums.emailJourneyVariantFilter.winback";
    case "enums.emailJourneyVariant.newsletterMay2026":
      return "enums.emailJourneyVariantFilter.newsletterMay2026";
    case "enums.emailJourneyVariant.newsletterNov2026":
      return "enums.emailJourneyVariantFilter.newsletterNov2026";
    default:
      return undefined;
  }
}

function stageFilterOf(key: string | null): QueueDrill["stage"] {
  switch (key) {
    case "enums.emailCampaignStage.notStarted":
    case "enums.emailCampaignStage.initial":
    case "enums.emailCampaignStage.followup1":
    case "enums.emailCampaignStage.followup2":
    case "enums.emailCampaignStage.followup3":
    case "enums.emailCampaignStage.nurture":
    case "enums.emailCampaignStage.reactivation":
      return key;
    default:
      return undefined;
  }
}
