/**
 * Cron Stats API Definition
 * Statistics and metrics for cron task system
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/tasks/cron/stats/i18n";
import { CronTaskPriority, CronTaskStatus } from "next-vibe/tasks/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { CRON_STATS_ALIAS } from "./constants";

const CronStatsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.CronStatsContainer,
  })),
);

// Stats period enum
const statsPeriodSchema = z.enum(["hour", "day", "week", "month"]);

// Stats type enum
const statsTypeSchema = z.enum(["overview", "performance", "errors", "trends"]);

/**
 * GET endpoint definition - Get cron statistics
 * Retrieves cron task statistics and metrics
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "tasks", "cron", "stats"],
  aliases: [CRON_STATS_ALIAS, "cron:stats", "tasks:cron:stats"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "clock",
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

  fields: customWidgetObject({
    render: CronStatsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      // === REQUEST FIELDS ===
      period: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.period.title",
        description: "get.fields.period.description",
        options: [
          {
            value: "hour",
            label: "get.period.hour",
          },
          {
            value: "day",
            label: "get.period.day",
          },
          {
            value: "week",
            label: "get.period.week",
          },
          {
            value: "month",
            label: "get.period.month",
          },
        ],
        columns: 3,
        schema: statsPeriodSchema.default("day"),
      }),

      type: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.type.title",
        description: "get.fields.type.description",
        options: [
          {
            value: "overview",
            label: "get.type.overview",
          },
          {
            value: "performance",
            label: "get.type.performance",
          },
          {
            value: "errors",
            label: "get.type.errors",
          },
          {
            value: "trends",
            label: "get.type.trends",
          },
        ],
        columns: 3,
        schema: statsTypeSchema.default("overview"),
      }),

      taskId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.taskId.title",
        description: "get.fields.taskId.description",
        columns: 3,
        schema: z.string().optional(),
      }),

      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.limit.title",
        description: "get.fields.limit.description",
        columns: 3,
        schema: z.coerce.number().optional().default(100),
      }),

      // Additional filter fields
      timePeriod: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.timePeriod.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      dateRangePreset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.dateRangePreset.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      taskName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.taskName.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      taskStatus: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.taskStatus.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      taskPriority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.taskPriority.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      healthStatus: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.healthStatus.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      minDuration: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.minDuration.title",
        columns: 3,
        schema: z.coerce.number().optional(),
      }),

      maxDuration: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.maxDuration.title",
        columns: 3,
        schema: z.coerce.number().optional(),
      }),

      includeDisabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.includeDisabled.title",
        columns: 3,
        schema: z.boolean().optional(),
      }),

      includeSystemTasks: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.includeSystemTasks.title",
        columns: 3,
        schema: z.boolean().optional(),
      }),

      hasRecentFailures: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.hasRecentFailures.title",
        columns: 3,
        schema: z.boolean().optional(),
      }),

      hasTimeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.hasTimeout.title",
        columns: 3,
        schema: z.boolean().optional(),
      }),

      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.search.title",
        columns: 12,
        schema: z.string().optional(),
      }),

      // === RESPONSE FIELDS ===
      totalTasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.totalTasks.title",
        schema: z.coerce.number(),
      }),

      executedTasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.executedTasks.title",
        schema: z.coerce.number(),
      }),

      successfulTasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.successfulTasks.title",
        schema: z.coerce.number(),
      }),

      failedTasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.failedTasks.title",
        schema: z.coerce.number(),
      }),

      averageExecutionTime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.averageExecutionTime.title",
        schema: z.coerce.number(),
      }),

      totalExecutions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.totalExecutions.title",
        schema: z.coerce.number().optional(),
      }),

      executionsLast24h: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.executionsLast24h.title",
        schema: z.coerce.number().optional(),
      }),

      successRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.successRate.title",
        schema: z.coerce.number().optional(),
      }),

      successfulExecutions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.successfulExecutions.title",
        schema: z.coerce.number().optional(),
      }),

      failedExecutions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.failedExecutions.title",
        schema: z.coerce.number().optional(),
      }),

      failureRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.failureRate.title",
        schema: z.coerce.number().optional(),
      }),

      avgExecutionTime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.avgExecutionTime.title",
        schema: z.coerce.number().optional(),
      }),

      minExecutionTime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.minExecutionTime.title",
        schema: z.coerce.number().optional(),
      }),

      maxExecutionTime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.maxExecutionTime.title",
        schema: z.coerce.number().optional(),
      }),

      pendingExecutions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.pendingExecutions.title",
        schema: z.coerce.number().optional(),
      }),

      runningExecutions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.runningExecutions.title",
        schema: z.coerce.number().optional(),
      }),

      activeTasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.activeTasks.title",
        schema: z.coerce.number().optional(),
      }),

      systemStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.systemStatus.title",
        schema: z
          .enum(["healthy", "warning", "critical", "unknown"])
          .optional(),
      }),

      uptime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.uptime.title",
        schema: z.string().optional(),
      }),

      healthyTasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.healthyTasks.title",
        schema: z.coerce.number().optional(),
      }),

      degradedTasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.degradedTasks.title",
        schema: z.coerce.number().optional(),
      }),

      systemLoad: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.systemLoad.title",
        schema: z.coerce.number().optional(),
      }),

      queueSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.queueSize.title",
        schema: z.coerce.number().optional(),
      }),

      medianExecutionTime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.medianExecutionTime.title",
        schema: z.coerce.number().optional(),
      }),

      tasksByPriority: responseField(scopedTranslation, {
        type: WidgetType.KEY_VALUE,
        schema: z
          .record(z.enum(CronTaskPriority), z.coerce.number())
          .optional(),
      }),

      tasksByStatus: responseField(scopedTranslation, {
        type: WidgetType.KEY_VALUE,
        schema: z.record(z.enum(CronTaskStatus), z.coerce.number()).optional(),
      }),

      executionsByHour: responseField(scopedTranslation, {
        type: WidgetType.KEY_VALUE,
        schema: z.record(z.string(), z.coerce.number()).optional(),
      }),

      executionsByDay: responseField(scopedTranslation, {
        type: WidgetType.KEY_VALUE,
        schema: z.record(z.string(), z.coerce.number()).optional(),
      }),

      topPerformingTasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .array(
            z.object({
              taskName: z.string(),
              executions: z.coerce.number(),
              successRate: z.coerce.number(),
              avgDuration: z.coerce.number(),
            }),
          )
          .optional(),
      }),

      problemTasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .array(
            z.object({
              taskName: z.string(),
              failures: z.coerce.number(),
              executions: z.coerce.number(),
              lastError: z.string().optional(),
              failureRate: z.coerce.number(),
              lastFailure: z.string().optional(),
            }),
          )
          .optional(),
      }),

      groupedStats: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .object({
            byTaskName: z
              .array(
                z.object({
                  taskName: z.string(),
                  executions: z.coerce.number(),
                  successes: z.coerce.number(),
                  failures: z.coerce.number(),
                  successRate: z.coerce.number(),
                  avgDuration: z.coerce.number(),
                }),
              )
              .optional(),
            byPriority: z
              .array(
                z.object({
                  priority: z.string(),
                  taskCount: z.coerce.number(),
                  executions: z.coerce.number(),
                  successRate: z.coerce.number(),
                  avgDuration: z.coerce.number(),
                }),
              )
              .optional(),
            byHealthStatus: z
              .array(
                z.object({
                  healthStatus: z.string(),
                  taskCount: z.coerce.number(),
                  percentage: z.coerce.number(),
                }),
              )
              .optional(),
            byExecutionTime: z
              .array(
                z.object({
                  timeRange: z.string(),
                  count: z.coerce.number(),
                  percentage: z.coerce.number(),
                  avgDuration: z.coerce.number(),
                }),
              )
              .optional(),
          })
          .optional(),
      }),

      recentActivity: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .array(
            z.object({
              id: z.string(),
              taskName: z.string(),
              status: z.string(),
              timestamp: z.string(),
              type: z.string(),
              duration: z.coerce.number().optional(),
            }),
          )
          .optional(),
      }),

      dailyStats: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .array(
            z.object({
              date: z.string(),
              executions: z.coerce.number(),
              successes: z.coerce.number(),
              failures: z.coerce.number(),
              avgDuration: z.coerce.number(),
              uniqueTasks: z.coerce.number(),
            }),
          )
          .optional(),
      }),

      taskStats: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .record(
            z.string(),
            z.object({
              priority: z.string(),
              healthStatus: z.string(),
              successfulExecutions: z.coerce.number(),
              totalExecutions: z.coerce.number(),
              successRate: z.coerce.number(),
              avgDuration: z.coerce.number(),
              isEnabled: z.boolean(),
            }),
          )
          .optional(),
      }),

      historicalData: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .record(
            z.string(),
            z.array(z.object({ date: z.string(), value: z.coerce.number() })),
          )
          .optional(),
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
        period: "day",
        type: "overview",
      },
      performance: {
        period: "week",
        type: "performance",
        limit: 50,
      },
    },
    responses: {
      default: {
        totalTasks: 25,
        executedTasks: 23,
        successfulTasks: 21,
        failedTasks: 2,
        averageExecutionTime: 1250,
      },
      performance: {
        totalTasks: 50,
        executedTasks: 48,
        successfulTasks: 45,
        failedTasks: 3,
        averageExecutionTime: 950,
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
