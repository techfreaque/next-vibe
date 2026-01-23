/**
 * Cron Stats API Definition
 * Statistics and metrics for cron task system
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  CronTaskPriority,
  CronTaskStatus,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

// Stats period enum
const statsPeriodSchema = z.enum(["hour", "day", "week", "month"]);

// Stats type enum
const statsTypeSchema = z.enum(["overview", "performance", "errors", "trends"]);

/**
 * GET endpoint definition - Get cron statistics
 * Retrieves cron task statistics and metrics
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["system", "tasks", "cron", "stats"],
  title: "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.title",
  description:
    "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.description",
  icon: "clock",
  category: "app.api.system.unifiedInterface.tasks.category",
  allowedRoles: [UserRole.ADMIN],
  aliases: ["cron:stats", "tasks:cron:stats"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.form.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      period: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.period.title",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.period.description",
        options: [
          {
            value: "hour",
            label:
              "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.period.hour",
          },
          {
            value: "day",
            label:
              "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.period.day",
          },
          {
            value: "week",
            label:
              "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.period.week",
          },
          {
            value: "month",
            label:
              "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.period.month",
          },
        ],
        columns: 3,
        schema: statsPeriodSchema.default("day"),
      }),

      type: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.type.title",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.type.description",
        options: [
          {
            value: "overview",
            label:
              "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.type.overview",
          },
          {
            value: "performance",
            label:
              "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.type.performance",
          },
          {
            value: "errors",
            label:
              "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.type.errors",
          },
          {
            value: "trends",
            label:
              "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.type.trends",
          },
        ],
        columns: 3,
        schema: statsTypeSchema.default("overview"),
      }),

      taskId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.taskId.title",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.taskId.description",
        columns: 3,
        schema: z.string().optional(),
      }),

      limit: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.limit.title",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.limit.description",
        columns: 3,
        schema: z.coerce.number().optional().default(100),
      }),

      // Additional filter fields
      timePeriod: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.timePeriod.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      dateRangePreset: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.dateRangePreset.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      taskName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.taskName.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      taskStatus: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.taskStatus.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      taskPriority: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.taskPriority.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      healthStatus: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.healthStatus.title",
        columns: 3,
        schema: z.string().optional(),
      }),

      minDuration: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.minDuration.title",
        columns: 3,
        schema: z.coerce.number().optional(),
      }),

      maxDuration: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.maxDuration.title",
        columns: 3,
        schema: z.coerce.number().optional(),
      }),

      includeDisabled: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.includeDisabled.title",
        columns: 3,
        schema: z.boolean().optional(),
      }),

      includeSystemTasks: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.includeSystemTasks.title",
        columns: 3,
        schema: z.boolean().optional(),
      }),

      hasRecentFailures: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.hasRecentFailures.title",
        columns: 3,
        schema: z.boolean().optional(),
      }),

      hasTimeout: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.hasTimeout.title",
        columns: 3,
        schema: z.boolean().optional(),
      }),

      search: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.fields.search.title",
        columns: 12,
        schema: z.string().optional(),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.response.success.title",
        schema: z.boolean(),
      }),

      data: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.response.data.title",
        schema: z.object({
          // Basic stats fields
          totalTasks: z.coerce.number(),
          executedTasks: z.coerce.number(),
          successfulTasks: z.coerce.number(),
          failedTasks: z.coerce.number(),
          averageExecutionTime: z.coerce.number(),

          // Extended stats fields for comprehensive dashboard
          totalExecutions: z.coerce.number().optional(),
          executionsLast24h: z.coerce.number().optional(),
          successRate: z.coerce.number().optional(),
          successfulExecutions: z.coerce.number().optional(),
          activeTasks: z.coerce.number().optional(),
          systemLoad: z.coerce.number().optional(),
          queueSize: z.coerce.number().optional(),
          failedExecutions: z.coerce.number().optional(),
          failureRate: z.coerce.number().optional(),
          avgExecutionTime: z.coerce.number().optional(),
          medianExecutionTime: z.coerce.number().optional(),
          minExecutionTime: z.coerce.number().optional(),
          maxExecutionTime: z.coerce.number().optional(),
          healthyTasks: z.coerce.number().optional(),
          degradedTasks: z.coerce.number().optional(),
          pendingExecutions: z.coerce.number().optional(),
          runningExecutions: z.coerce.number().optional(),

          // Distribution fields
          tasksByPriority: z
            .record(z.enum(CronTaskPriority), z.coerce.number())
            .optional(),
          tasksByStatus: z
            .record(z.enum(CronTaskStatus), z.coerce.number())
            .optional(),
          executionsByHour: z.record(z.string(), z.coerce.number()).optional(),
          executionsByDay: z.record(z.string(), z.coerce.number()).optional(),

          // Top tasks and problem tasks
          topPerformingTasks: z
            .array(
              z.object({
                taskName: z.string(),
                executions: z.coerce.number(),
                successRate: z.coerce.number(),
                avgDuration: z.coerce.number(),
              }),
            )
            .optional(),

          problemTasks: z
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

          // Grouped statistics
          groupedStats: z
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

          // Recent activity and daily stats
          recentActivity: z
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

          dailyStats: z
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

          // Task-specific statistics
          taskStats: z
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

          // Historical data for charts
          historicalData: z
            .record(
              z.string(),
              z.array(z.object({ date: z.string(), value: z.coerce.number() })),
            )
            .optional(),
        }),
      }),
    },
  ),

  tags: ["app.api.system.unifiedInterface.tasks.cronSystem.stats.get.tag"],

  errorTypes: {
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.server.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.server.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.unsavedChanges.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.success.title",
    description:
      "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.success.description",
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
        success: true,
        data: {
          totalTasks: 25,
          executedTasks: 23,
          successfulTasks: 21,
          failedTasks: 2,
          averageExecutionTime: 1250,
        },
      },
      performance: {
        success: true,
        data: {
          totalTasks: 50,
          executedTasks: 48,
          successfulTasks: 45,
          failedTasks: 3,
          averageExecutionTime: 950,
        },
      },
    },
  },
});

// Type exports following the new pattern
export type CronStatsGetRequestInput = typeof GET.types.RequestInput;
export type CronStatsGetRequestOutput = typeof GET.types.RequestOutput;
export type CronStatsGetResponseInput = typeof GET.types.ResponseInput;
export type CronStatsGetResponseOutput = typeof GET.types.ResponseOutput;

// Aliases for backward compatibility with components
export type CronStatsRequestType = CronStatsGetRequestOutput;
export type CronStatsResponseType = CronStatsGetResponseOutput;

const statsEndpoints = { GET };
export default statsEndpoints;
