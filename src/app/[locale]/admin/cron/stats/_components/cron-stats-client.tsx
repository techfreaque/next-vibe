/**
 * Cron Stats Client Component
 * Comprehensive client-side cron statistics dashboard with modular UI design
 */

"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Cpu,
  Server,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import {
  objectEntries,
  objectEntriesNumericEnum,
} from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useCronStats } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/stats/hooks";
import {
  CronTaskPriority,
  CronTaskStatus,
} from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import { CronStatsChart, CronStatsDistributionChart } from "./cron-stats-chart";
import {
  CronStatsFilters,
  CronStatsFiltersContainer,
} from "./cron-stats-filters";

// Weekday enum for stats display
enum JSWeekday {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 0,
}

interface CronStatsClientProps {
  locale: CountryLanguage;
}

/**
 * Get priority translation key
 */
function getPriorityTranslation(
  priority: (typeof CronTaskPriority)[keyof typeof CronTaskPriority],
): TranslationKey {
  switch (priority) {
    case CronTaskPriority.BACKGROUND:
      return "app.admin.cron.stats.priority.low";
    case CronTaskPriority.LOW:
      return "app.admin.cron.stats.priority.low";
    case CronTaskPriority.MEDIUM:
      return "app.admin.cron.stats.priority.high";
    case CronTaskPriority.HIGH:
      return "app.admin.cron.stats.priority.high";
    case CronTaskPriority.CRITICAL:
      return "app.admin.cron.stats.priority.critical";
    default:
      return "app.admin.cron.stats.unknown";
  }
}

/**
 * Get status translation key
 */
function getStatusTranslation(
  status: (typeof CronTaskStatus)[keyof typeof CronTaskStatus],
): TranslationKey {
  switch (status) {
    case "PENDING":
      return "app.admin.cron.stats.status.pending";
    case "RUNNING":
      return "app.admin.cron.stats.status.running";
    case CronTaskStatus.COMPLETED:
      return "app.admin.cron.stats.status.completed";
    case CronTaskStatus.FAILED:
      return "app.admin.cron.stats.status.failed";
    case CronTaskStatus.TIMEOUT:
      return "app.admin.cron.stats.status.timeout";
    case CronTaskStatus.CANCELLED:
      return "app.admin.cron.stats.status.cancelled";
    case CronTaskStatus.SKIPPED:
      return "app.admin.cron.stats.status.skipped";
    default:
      return "app.admin.cron.stats.unknown";
  }
}

/**
 * Get weekday translation key
 */
function getWeekdayTranslation(day: JSWeekday): TranslationKey {
  switch (day) {
    case JSWeekday.MONDAY:
      return "app.admin.common.weekday.monday";
    case JSWeekday.TUESDAY:
      return "app.admin.common.weekday.tuesday";
    case JSWeekday.WEDNESDAY:
      return "app.admin.common.weekday.wednesday";
    case JSWeekday.THURSDAY:
      return "app.admin.common.weekday.thursday";
    case JSWeekday.FRIDAY:
      return "app.admin.common.weekday.friday";
    case JSWeekday.SATURDAY:
      return "app.admin.common.weekday.saturday";
    case JSWeekday.SUNDAY:
      return "app.admin.common.weekday.sunday";
    default:
      return "app.admin.common.weekday.monday";
  }
}

// Helper functions
const formatNumber = (num: number): string => num.toLocaleString();
const formatPercentage = (num: number): string => `${num.toFixed(1)}%`;

export function CronStatsClient({ locale }: CronStatsClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const statsEndpoint = useCronStats(logger);

  const apiResponse = statsEndpoint.read.response;
  const stats = apiResponse?.success ? apiResponse.data.data : null;
  const isLoading = statsEndpoint.read.isLoading;

  // Stub implementations for missing functionality
  const refreshStats = (): void => {
    void statsEndpoint.read.refetch();
  };

  const form = statsEndpoint.read.form;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <div className="flex space-x-2 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <CronStatsFiltersContainer
        locale={locale}
        onRefresh={refreshStats}
        form={form}
      >
        <CronStatsFilters control={form.control} />
      </CronStatsFiltersContainer>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Executions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.cron.stats.totalExecutions")}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.totalExecutions ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("app.admin.cron.stats.countWithLabel", {
                count: formatNumber(stats?.executionsLast24h ?? 0),
                label: t("app.admin.cron.stats.last24h"),
              })}
            </p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.cron.stats.successRate")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(stats?.successRate ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("app.admin.cron.stats.countWithLabel", {
                count: formatNumber(stats?.successfulExecutions ?? 0),
                label: t("app.admin.cron.stats.successful"),
              })}
            </p>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.cron.stats.activeTasks")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.activeTasks ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("app.admin.cron.stats.countWithLabel", {
                count: formatPercentage(
                  (stats?.activeTasks ?? 0) / (stats?.totalTasks ?? 1),
                ),
                label: t("app.admin.cron.stats.ofTotal"),
              })}
            </p>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.cron.stats.systemLoad")}
            </CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(stats?.systemLoad ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("app.admin.cron.stats.countWithLabel", {
                count: formatNumber(stats?.queueSize ?? 0),
                label: t("app.admin.cron.stats.queued"),
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Failed Executions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.cron.stats.failedExecutions")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatNumber(stats?.failedExecutions ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(stats?.failureRate ?? 0)}{" "}
              {t("app.admin.cron.stats.failureRate")}
            </p>
          </CardContent>
        </Card>

        {/* Average Execution Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.cron.stats.avgExecutionTime")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.avgExecutionTime ?? 0)}
              ms
            </div>
            <p className="text-xs text-muted-foreground">
              {t("app.admin.cron.stats.durationWithLabel", {
                duration: formatNumber(stats?.medianExecutionTime ?? 0),
                label: t("app.admin.cron.stats.median"),
              })}
            </p>
          </CardContent>
        </Card>

        {/* Healthy Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.cron.stats.healthyTasks")}
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(stats?.healthyTasks ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.degradedTasks ?? 0)}{" "}
              {t("app.admin.cron.stats.degraded")}
            </p>
          </CardContent>
        </Card>

        {/* Queue Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("app.admin.cron.stats.queueStatus")}
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats?.pendingExecutions ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.runningExecutions ?? 0)}{" "}
              {t("app.admin.cron.stats.running")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            {t("app.admin.cron.stats.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="performance">
            {t("app.admin.cron.stats.tabs.performance")}
          </TabsTrigger>
          <TabsTrigger value="distribution">
            {t("app.admin.cron.stats.tabs.distribution")}
          </TabsTrigger>
          <TabsTrigger value="tasks">
            {t("app.admin.cron.stats.tabs.tasks")}
          </TabsTrigger>
          <TabsTrigger value="detailed">
            {t("app.admin.cron.stats.tabs.detailed")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Execution Trends */}
            {stats?.historicalData && (
              <CronStatsChart
                locale={locale}
                data={{
                  totalExecutions: stats.historicalData.totalExecutions,
                  successfulExecutions:
                    stats.historicalData.successfulExecutions,
                  failedExecutions: stats.historicalData.failedExecutions,
                }}
                title={t("app.admin.cron.stats.executionTrends")}
                type="area"
                height={300}
              />
            )}

            {/* Success Rate Trends */}
            {stats?.historicalData && (
              <CronStatsChart
                locale={locale}
                data={{
                  successRate: stats.historicalData.successRate,
                  failureRate: stats.historicalData.failureRate,
                }}
                title={t("app.admin.cron.stats.successRateTrends")}
                type="line"
                height={300}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {t("app.admin.cron.stats.performanceMetrics")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("app.admin.cron.stats.avgExecutionTime")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.avgExecutionTime ?? 0)}
                      ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("app.admin.cron.stats.medianExecutionTime")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.medianExecutionTime ?? 0)}
                      ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("app.admin.cron.stats.minExecutionTime")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.minExecutionTime ?? 0)}
                      ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t("app.admin.cron.stats.maxExecutionTime")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(stats?.maxExecutionTime ?? 0)}
                      ms
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Execution Time Trends */}
            {stats?.historicalData && (
              <CronStatsChart
                locale={locale}
                data={{
                  avgExecutionTime: stats.historicalData.avgExecutionTime,
                  medianExecutionTime: stats.historicalData.medianExecutionTime,
                }}
                title={t("app.admin.cron.stats.executionTimeTrends")}
                type="line"
                height={300}
              />
            )}
          </div>

          {/* System Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Load Chart */}
            {stats?.historicalData && (
              <CronStatsChart
                locale={locale}
                data={{
                  systemLoad: stats.historicalData.systemLoad,
                  queueSize: stats.historicalData.queueSize,
                }}
                title={t("app.admin.cron.stats.systemPerformance")}
                type="area"
                height={300}
              />
            )}

            {/* Task Health Chart */}
            {stats?.historicalData && (
              <CronStatsChart
                locale={locale}
                data={{
                  healthyTasks: stats.historicalData.healthyTasks,
                  activeTasks: stats.historicalData.activeTasks,
                  enabledTasks: stats.historicalData.enabledTasks,
                }}
                title={t("app.admin.cron.stats.taskHealthTrends")}
                type="line"
                height={300}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Priority Distribution */}
            {stats?.tasksByPriority && (
              <CronStatsDistributionChart
                data={objectEntries(stats.tasksByPriority).map(
                  ([priority, count]) => ({
                    name: t(getPriorityTranslation(priority)),
                    value: count,
                  }),
                )}
                title={t("app.admin.cron.stats.tasksByPriority")}
                type="pie"
                height={300}
              />
            )}

            {/* Task Status Distribution */}
            {stats?.tasksByStatus && (
              <CronStatsDistributionChart
                data={objectEntries(stats.tasksByStatus).map(
                  ([status, count]) => ({
                    name: t(getStatusTranslation(status)),
                    value: count,
                  }),
                )}
                title={t("app.admin.cron.stats.tasksByStatus")}
                type="pie"
                height={300}
              />
            )}
          </div>

          {/* Execution Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Executions by Hour */}
            {stats?.executionsByHour && (
              <CronStatsDistributionChart
                data={objectEntries(stats.executionsByHour).map(
                  ([hour, count]: [string, number]) => ({
                    name: hour,
                    value: count,
                  }),
                )}
                title={t("app.admin.cron.stats.executionsByHour")}
                type="bar"
                height={300}
              />
            )}

            {/* Executions by Day */}
            {stats?.executionsByDay && (
              <CronStatsDistributionChart
                data={objectEntriesNumericEnum(stats.executionsByDay).map(
                  ([day, count]: [JSWeekday, number]) => ({
                    name: t(getWeekdayTranslation(day)),
                    value: count,
                  }),
                )}
                title={t("app.admin.cron.stats.executionsByDay")}
                type="bar"
                height={300}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {/* Top Performing Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t("app.admin.cron.stats.topPerformingTasks")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {}
                {stats?.topPerformingTasks?.map(
                  (
                    task: {
                      taskName: string;
                      executions: number;
                      successRate: number;
                      avgDuration: number;
                    },
                    index: number,
                  ) => (
                    <div
                      key={task.taskName}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{task.taskName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(task.executions)}{" "}
                            {t("app.admin.cron.stats.executions")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {formatPercentage(task.successRate)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(task.avgDuration)}ms
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Problem Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {t("app.admin.cron.stats.problemTasks")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {}
                {stats?.problemTasks?.map((task, index: number) => (
                  <div
                    key={task.taskName}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{task.taskName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(task.failures)}{" "}
                          {t("app.admin.cron.stats.failures")} /{" "}
                          {formatNumber(task.executions)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">
                        {formatPercentage(task.failureRate)}
                      </p>
                      {task.lastFailure && (
                        <p className="text-sm text-muted-foreground">
                          {t("app.admin.cron.stats.lastFailure")}:{" "}
                          {new Date(task.lastFailure).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Task Statistics by Name */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t("app.admin.cron.stats.taskStatistics")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {}
                {stats?.groupedStats?.byTaskName?.map(
                  (taskStat: {
                    taskName: string;
                    executions: number;
                    successes: number;
                    failures: number;
                    successRate: number;
                    avgDuration: number;
                  }) => (
                    <div
                      key={taskStat.taskName}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{taskStat.taskName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(taskStat.executions)}{" "}
                            {t("app.admin.cron.stats.executions")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600">
                            {formatNumber(taskStat.successes)}{" "}
                            {t("app.admin.cron.stats.success")}
                          </span>
                          <span className="text-sm text-red-600">
                            {formatNumber(taskStat.failures)}{" "}
                            {t("app.admin.cron.stats.failed")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {formatPercentage(taskStat.successRate)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(taskStat.avgDuration)}ms{" "}
                            {t("app.admin.cron.stats.avg")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}

          {stats?.recentActivity && stats.recentActivity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  {t("app.admin.cron.stats.recentActivity")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {}
                  {stats.recentActivity.map(
                    (activity: {
                      id: string;
                      timestamp: string;
                      taskName: string;
                      type: string;
                    }) => (
                      <div
                        key={`${activity.id}-${activity.timestamp}`}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <div>
                            <p className="font-medium">{activity.taskName}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.type}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString(
                              locale,
                            )}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Detailed Statistics Tab */}
        <TabsContent value="detailed" className="space-y-6">
          {/* Daily Stats */}

          {stats?.dailyStats && stats.dailyStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t("app.admin.cron.stats.dailyStatsDetailed")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {}
                  {stats.dailyStats
                    .slice(0, 10)
                    .map(
                      (day: {
                        date: string;
                        executions: number;
                        successes: number;
                        failures: number;
                        avgDuration: number;
                        uniqueTasks: number;
                      }) => (
                        <div
                          key={day.date}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">
                                {new Date(day.date).toLocaleDateString(locale)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatNumber(day.executions)}{" "}
                                {t("app.admin.cron.stats.executions")}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-green-600">
                                {formatNumber(day.successes)}{" "}
                                {t("app.admin.cron.stats.successes")}
                              </span>
                              <span className="text-sm text-red-600">
                                {formatNumber(day.failures)}{" "}
                                {t("app.admin.cron.stats.failures")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {formatNumber(day.avgDuration)}ms{" "}
                                {t("app.admin.cron.stats.avgDuration")}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formatNumber(day.uniqueTasks)}{" "}
                                {t("app.admin.cron.stats.uniqueTasks")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Task Stats Details */}
          {}
          {stats?.taskStats && Object.keys(stats.taskStats).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t("app.admin.cron.stats.taskStatsDetailed")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {}
                  {objectEntries(stats.taskStats)
                    .slice(0, 10)
                    .map(
                      ([taskName, taskStat]: [
                        string,
                        {
                          priority: string;
                          healthStatus: string;
                          successfulExecutions: number;
                          totalExecutions: number;
                          successRate: number;
                          avgDuration: number;
                          isEnabled: boolean;
                        },
                      ]) => (
                        <div
                          key={taskName}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">{taskName}</p>
                              <p className="text-sm text-muted-foreground">
                                {t("app.admin.cron.stats.priorityAndHealth", {
                                  priorityLabel: t(
                                    "app.admin.cron.stats.priorityLabel",
                                  ),
                                  priority: taskStat.priority,
                                  healthLabel: t("app.admin.cron.stats.health"),
                                  health: taskStat.healthStatus,
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-green-600">
                                {formatNumber(taskStat.successfulExecutions)} /{" "}
                                {formatNumber(taskStat.totalExecutions)}
                              </span>
                              <span className="text-sm font-medium">
                                {formatPercentage(taskStat.successRate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {formatNumber(taskStat.avgDuration)}ms{" "}
                                {t("app.admin.cron.stats.avg")}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {taskStat.isEnabled
                                  ? t("app.admin.cron.stats.enabled")
                                  : t("app.admin.cron.stats.disabled")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grouped Stats by Priority */}

          {stats?.groupedStats?.byPriority &&
            stats.groupedStats.byPriority.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t("app.admin.cron.stats.groupedByPriority")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {}
                    {stats.groupedStats.byPriority.map(
                      (priorityStat: {
                        priority: string;
                        taskCount: number;
                        executions: number;
                        successRate: number;
                        avgDuration: number;
                      }) => (
                        <div
                          key={priorityStat.priority}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">
                                {priorityStat.priority}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatNumber(priorityStat.taskCount)}{" "}
                                {t("app.admin.cron.stats.tasks")}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {formatNumber(priorityStat.executions)}{" "}
                                {t("app.admin.cron.stats.executions")}
                              </span>
                              <span className="text-sm text-green-600">
                                {formatPercentage(priorityStat.successRate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {formatNumber(priorityStat.avgDuration)}ms{" "}
                                {t("app.admin.cron.stats.avg")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Grouped Stats by Health Status */}

          {stats?.groupedStats?.byHealthStatus &&
            stats.groupedStats.byHealthStatus.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {t("app.admin.cron.stats.groupedByHealth")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {}
                    {stats.groupedStats.byHealthStatus.map(
                      (healthStat: {
                        healthStatus: string;
                        taskCount: number;
                        percentage: number;
                      }) => (
                        <div
                          key={healthStat.healthStatus}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">
                                {healthStat.healthStatus}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t(
                                  "app.admin.cron.stats.countWithLabelAndPercentage",
                                  {
                                    count: formatNumber(healthStat.taskCount),
                                    label: t("app.admin.cron.stats.tasks"),
                                    percentage: formatPercentage(
                                      healthStat.percentage,
                                    ),
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Grouped Stats by Execution Time */}

          {stats?.groupedStats?.byExecutionTime &&
            stats.groupedStats.byExecutionTime.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t("app.admin.cron.stats.groupedByExecutionTime")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {}
                    {stats.groupedStats.byExecutionTime.map(
                      (timeStat: {
                        timeRange: string;
                        count: number;
                        percentage: number;
                        avgDuration: number;
                      }) => (
                        <div
                          key={timeStat.timeRange}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">
                                {timeStat.timeRange}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t(
                                  "app.admin.cron.stats.countWithLabelAndPercentage",
                                  {
                                    count: formatNumber(timeStat.count),
                                    label: t("app.admin.cron.stats.executions"),
                                    percentage: formatPercentage(
                                      timeStat.percentage,
                                    ),
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-muted-foreground">
                              {formatNumber(timeStat.avgDuration)}ms{" "}
                              {t("app.admin.cron.stats.avg")}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
