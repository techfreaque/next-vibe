/**
 * Task Health (cron-stats) API Definition
 * Cron health report: task states now, run metrics and trends in a window,
 * per-task breakdown with drill-down into run history.
 */

import { z } from "zod";

import { createEndpoint } from "../../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../../core/definition/enums";
import { UserRole } from "../../../identity/roles/enum";
import { lazyWidget } from "../../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../../unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  responseField,
} from "../../../unified-ui/_shared/utils-i18n";
import {
  AnalyticsGranularity,
  AnalyticsRange,
} from "../../../unified-ui/analytics/enum";
import { analyticsWindowFields } from "../../../unified-ui/analytics/fields";
import {
  analyticsWindowSchema,
  kpiSchema,
  timeSeriesSchema,
} from "../../../unified-ui/analytics/schema";
import { CronTaskStatus, CronTaskStatusDB } from "../../enum";
import { CRON_STATS_ALIAS } from "./constants";
import {
  TaskHealth,
  TaskHealthDB,
  TaskHealthFilter,
  TaskHealthFilterOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const CronStatsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.CronStatsContainer,
  })),
);

const attentionTaskSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  state: z.enum(TaskHealthDB),
  enabled: z.boolean(),
  lastStatus: z.enum(CronTaskStatusDB).nullable(),
  lastRunAt: z.string().nullable(),
  runStartedAt: z.string().nullable(),
  dueAt: z.string().nullable(),
  timeoutMs: z.number(),
  /** Deciding stuck limit (watchdog: max(15 min, timeout + grace)). */
  stuckAfterMs: z.number(),
  consecutiveFailures: z.number(),
  failuresInWindow: z.number(),
  finishedInWindow: z.number(),
  successRate: z.number().nullable(),
  lastError: z.string().nullable(),
});
export type CronHealthAttentionTask = z.output<typeof attentionTaskSchema>;

const taskRowSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  state: z.enum(TaskHealthDB),
  enabled: z.boolean(),
  oneOff: z.boolean(),
  blockedByRun: z.boolean(),
  orphanedRunSince: z.string().nullable(),
  schedule: z.string(),
  scheduleLabel: z.string(),
  lastStatus: z.enum(CronTaskStatusDB).nullable(),
  lastRunAt: z.string().nullable(),
  nextRunAt: z.string().nullable(),
  runs: z.number(),
  failures: z.number(),
  successRate: z.number().nullable(),
  p50DurationMs: z.number().nullable(),
  p95DurationMs: z.number().nullable(),
  /** Start of the current run while it is running (drill to it). */
  runStartedAt: z.string().nullable(),
  /** Success rate per bucket (carry-forward), for row sparklines. */
  successTrend: z.array(z.number()),
  /** p95 (completed runs) per day with runs, for row sparklines. */
  durationTrend: z.array(z.number()),
});
export type CronHealthTaskRow = z.output<typeof taskRowSchema>;

/**
 * GET endpoint definition - Task health report
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "tasks", "cron", "stats"],
  aliases: [CRON_STATS_ALIAS, "cron:stats", "tasks:cron:stats"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "activity",
  category: "devTools",
  subCategory: "tasksCron",
  allowedRoles: [
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  defaultWebPinned: [
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  fields: customWidgetObject({
    render: CronStatsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),

      // === REQUEST FIELDS ===
      ...analyticsWindowFields,

      taskId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.taskId.title",
        description: "get.fields.taskId.description",
        columns: 4,
        schema: z.string().optional(),
      }),

      health: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.health.title",
        description: "get.fields.health.description",
        options: TaskHealthFilterOptions,
        columns: 4,
        schema: z.enum(TaskHealthFilter).default(TaskHealthFilter.ALL),
      }),

      includeDisabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.includeDisabled.title",
        description: "get.fields.includeDisabled.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      days: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.days.title",
        description: "get.fields.days.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      includeParked: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.includeParked.title",
        description: "get.fields.includeParked.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      generatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.generatedAt.title",
        schema: z.string(),
      }),

      window: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.window.title",
        schema: analyticsWindowSchema,
      }),

      summary: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.summary.title",
        schema: z.object({
          total: z.number(),
          enabled: z.number(),
          failing: z.number(),
          stuck: z.number(),
          overdue: z.number(),
          flaky: z.number(),
          recovering: z.number(),
          lowData: z.number(),
          running: z.number(),
          neverRan: z.number(),
          disabled: z.number(),
          healthy: z.number(),
          orphanedRuns: z.number(),
          parked: z.number(),
          parkedShown: z.boolean(),
        }),
      }),

      kpis: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.kpis.title",
        schema: z.object({
          runs: kpiSchema,
          failedRuns: kpiSchema,
          successRate: kpiSchema,
          p50DurationMs: kpiSchema,
          p95DurationMs: kpiSchema,
          timedOutRuns: kpiSchema,
        }),
      }),

      runsTrend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.runsTrend.title",
        schema: timeSeriesSchema,
      }),

      successTrend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.successTrend.title",
        schema: timeSeriesSchema,
      }),

      durationTrend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.durationTrend.title",
        schema: timeSeriesSchema,
      }),

      attention: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.attention.title",
        schema: z.array(attentionTaskSchema),
      }),

      tasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.tasks.title",
        schema: z.array(taskRowSchema),
      }),

      tasksWithFailures: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.tasksWithFailures.title",
        schema: z.object({ value: z.number(), total: z.number() }),
      }),

      failuresByTask: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.failuresByTask.title",
        schema: timeSeriesSchema,
      }),

      dayTables: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.fields.days.title",
        schema: z.boolean(),
      }),

      disabledIncluded: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.disabledIncluded.title",
        schema: z.boolean(),
      }),

      watchdog: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.watchdog.title",
        schema: z
          .object({ id: z.string(), state: z.enum(TaskHealthDB) })
          .nullable(),
      }),

      inFlight: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.inFlight.title",
        schema: z
          .object({
            startedAt: z.string(),
            limitMs: z.number(),
            timeoutMs: z.number(),
            stuck: z.boolean(),
            executionId: z.string().nullable(),
          })
          .nullable(),
      }),

      recentRuns: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.recentRuns.title",
        schema: z.array(
          z.object({
            executionId: z.string(),
            startedAt: z.string(),
            status: z.enum(CronTaskStatusDB),
            durationMs: z.number().nullable(),
            error: z.string().nullable(),
          }),
        ),
      }),

      taskOptions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.taskOptions.title",
        schema: z.array(z.object({ id: z.string(), name: z.string() })),
      }),
    },
  }),

  tags: ["get.tag"],

  errorTypes: {
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    requests: {
      default: {
        range: AnalyticsRange.LAST_30_DAYS,
        granularity: AnalyticsGranularity.AUTO,
        health: TaskHealthFilter.ALL,
      },
      attention: {
        range: AnalyticsRange.LAST_7_DAYS,
        granularity: AnalyticsGranularity.DAY,
        health: TaskHealthFilter.ATTENTION,
      },
    },
    responses: {
      default: {
        generatedAt: "2026-11-21T12:00:00.000Z",
        window: {
          from: "2026-11-15",
          to: "2026-11-21",
          previousFrom: "2026-11-08",
          previousTo: "2026-11-14",
          bucket: "day",
        },
        summary: {
          total: 3,
          enabled: 2,
          failing: 1,
          stuck: 0,
          overdue: 0,
          flaky: 0,
          recovering: 0,
          lowData: 0,
          running: 0,
          neverRan: 0,
          disabled: 1,
          healthy: 1,
          orphanedRuns: 0,
          parked: 2,
          parkedShown: false,
        },
        kpis: {
          runs: { value: 120, previous: 110 },
          failedRuns: { value: 7, previous: 2 },
          successRate: { value: 0.94, previous: 0.98 },
          p50DurationMs: { value: 35, previous: 30 },
          p95DurationMs: { value: 1200, previous: 900 },
          timedOutRuns: { value: 1, previous: 0 },
        },
        runsTrend: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "completed", values: [55, 58] },
            { key: "failed", values: [3, 4] },
            { key: "other", values: [0, 0] },
          ],
        },
        successTrend: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [{ key: "successRate", values: [0.95, 0.94] }],
        },
        durationTrend: {
          buckets: ["2026-11-20", "2026-11-21"],
          series: [
            { key: "p50", values: [34, 36] },
            { key: "p95", values: [900, 950] },
          ],
        },
        attention: [
          {
            id: "session-cleanup",
            displayName: "Session cleanup",
            state: TaskHealth.FAILING,
            enabled: true,
            lastStatus: CronTaskStatus.FAILED,
            lastRunAt: "2026-11-21T06:00:01.000Z",
            runStartedAt: null,
            dueAt: null,
            timeoutMs: 300000,
            stuckAfterMs: 900000,
            consecutiveFailures: 4,
            failuresInWindow: 4,
            finishedInWindow: 7,
            successRate: 0.43,
            lastError: "Validation failed (1 error)",
          },
        ],
        tasks: [
          {
            id: "session-cleanup",
            displayName: "Session cleanup",
            state: TaskHealth.FAILING,
            enabled: true,
            oneOff: false,
            blockedByRun: false,
            orphanedRunSince: null,
            schedule: "0 6 * * *",
            scheduleLabel: "Daily at 06:00",
            lastStatus: CronTaskStatus.FAILED,
            lastRunAt: "2026-11-21T06:00:01.000Z",
            nextRunAt: "2026-11-22T06:00:00.000Z",
            runs: 7,
            failures: 4,
            successRate: 0.43,
            p50DurationMs: 10,
            p95DurationMs: 40,
            runStartedAt: null,
            successTrend: [0.5, 0.43],
            durationTrend: [40, 38],
          },
        ],
        recentRuns: [],
        inFlight: null,
        watchdog: null,
        failuresByTask: { buckets: [], series: [] },
        tasksWithFailures: { value: 0, total: 0 },
        disabledIncluded: false,
        dayTables: false,
        taskOptions: [{ id: "session-cleanup", name: "Session cleanup" }],
      },
      attention: {
        generatedAt: "2026-11-21T12:00:00.000Z",
        window: {
          from: "2026-11-15",
          to: "2026-11-21",
          previousFrom: "2026-11-08",
          previousTo: "2026-11-14",
          bucket: "day",
        },
        summary: {
          total: 1,
          enabled: 1,
          failing: 0,
          stuck: 1,
          overdue: 0,
          flaky: 0,
          recovering: 0,
          lowData: 0,
          running: 0,
          neverRan: 0,
          disabled: 0,
          healthy: 0,
          orphanedRuns: 0,
          parked: 0,
          parkedShown: false,
        },
        kpis: {
          runs: { value: 10, previous: 12 },
          failedRuns: { value: 0, previous: 0 },
          successRate: { value: 1, previous: 1 },
          p50DurationMs: { value: 850, previous: 790 },
          p95DurationMs: { value: 1500, previous: 1400 },
          timedOutRuns: { value: 0, previous: 0 },
        },
        runsTrend: { buckets: [], series: [] },
        successTrend: { buckets: [], series: [] },
        durationTrend: { buckets: [], series: [] },
        attention: [],
        tasks: [],
        recentRuns: [],
        inFlight: null,
        watchdog: null,
        failuresByTask: { buckets: [], series: [] },
        tasksWithFailures: { value: 0, total: 0 },
        disabledIncluded: false,
        dayTables: false,
        taskOptions: [],
      },
    },
  },
});

// Type exports following the new pattern
export type CronStatsGetRequestInput = typeof GET.types.RequestInput;
export type CronStatsGetRequestOutput = typeof GET.types.RequestOutput;
export type CronStatsGetResponseInput = typeof GET.types.ResponseInput;
export type CronStatsGetResponseOutput = typeof GET.types.ResponseOutput;

const statsEndpoints = { GET };
export default statsEndpoints;
