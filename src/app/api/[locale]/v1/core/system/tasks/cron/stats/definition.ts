/**
 * Cron Stats API Definition
 * Statistics and metrics for cron task system
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import {
  CronTaskPriority,
  CronTaskStatus,
} from "@/app/api/[locale]/v1/core/system/tasks/enum";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

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
  path: ["v1", "core", "system", "tasks", "cron", "stats"],
  title: "app.api.v1.core.system.tasks.cronSystem.stats.get.title",
  description: "app.api.v1.core.system.tasks.cronSystem.stats.get.description",
  category: "app.api.v1.core.system.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  aliases: ["cron:stats", "tasks:cron:stats"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.tasks.cronSystem.stats.get.form.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.stats.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      period: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.period.title",
          description:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.period.description",
          options: [
            {
              value: "hour",
              label:
                "app.api.v1.core.system.tasks.cronSystem.stats.get.period.hour",
            },
            {
              value: "day",
              label:
                "app.api.v1.core.system.tasks.cronSystem.stats.get.period.day",
            },
            {
              value: "week",
              label:
                "app.api.v1.core.system.tasks.cronSystem.stats.get.period.week",
            },
            {
              value: "month",
              label:
                "app.api.v1.core.system.tasks.cronSystem.stats.get.period.month",
            },
          ],
          layout: { columns: 3 },
        },
        statsPeriodSchema.default("day"),
      ),

      type: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.type.title",
          description:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.type.description",
          options: [
            {
              value: "overview",
              label:
                "app.api.v1.core.system.tasks.cronSystem.stats.get.type.overview",
            },
            {
              value: "performance",
              label:
                "app.api.v1.core.system.tasks.cronSystem.stats.get.type.performance",
            },
            {
              value: "errors",
              label:
                "app.api.v1.core.system.tasks.cronSystem.stats.get.type.errors",
            },
            {
              value: "trends",
              label:
                "app.api.v1.core.system.tasks.cronSystem.stats.get.type.trends",
            },
          ],
          layout: { columns: 3 },
        },
        statsTypeSchema.default("overview"),
      ),

      taskId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.taskId.title",
          description:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.taskId.description",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.limit.title",
          description:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.limit.description",
          layout: { columns: 3 },
        },
        z.number().optional().default(100),
      ),

      // Additional filter fields
      timePeriod: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.timePeriod.title",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      dateRangePreset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.dateRangePreset.title",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      taskName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.taskName.title",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      taskStatus: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.taskStatus.title",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      taskPriority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.taskPriority.title",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      healthStatus: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.healthStatus.title",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      minDuration: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.minDuration.title",
          layout: { columns: 3 },
        },
        z.number().optional(),
      ),

      maxDuration: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.maxDuration.title",
          layout: { columns: 3 },
        },
        z.number().optional(),
      ),

      includeDisabled: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.includeDisabled.title",
          layout: { columns: 3 },
        },
        z.boolean().optional(),
      ),

      includeSystemTasks: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.includeSystemTasks.title",
          layout: { columns: 3 },
        },
        z.boolean().optional(),
      ),

      hasRecentFailures: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.hasRecentFailures.title",
          layout: { columns: 3 },
        },
        z.boolean().optional(),
      ),

      hasTimeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.hasTimeout.title",
          layout: { columns: 3 },
        },
        z.boolean().optional(),
      ),

      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.fields.search.title",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.response.success.title",
        },
        z.boolean(),
      ),

      data: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cronSystem.stats.get.response.data.title",
        },
        z.object({
          // Basic stats fields
          totalTasks: z.number(),
          executedTasks: z.number(),
          successfulTasks: z.number(),
          failedTasks: z.number(),
          averageExecutionTime: z.number(),

          // Extended stats fields for comprehensive dashboard
          totalExecutions: z.number().optional(),
          executionsLast24h: z.number().optional(),
          successRate: z.number().optional(),
          successfulExecutions: z.number().optional(),
          activeTasks: z.number().optional(),
          systemLoad: z.number().optional(),
          queueSize: z.number().optional(),
          failedExecutions: z.number().optional(),
          failureRate: z.number().optional(),
          avgExecutionTime: z.number().optional(),
          medianExecutionTime: z.number().optional(),
          minExecutionTime: z.number().optional(),
          maxExecutionTime: z.number().optional(),
          healthyTasks: z.number().optional(),
          degradedTasks: z.number().optional(),
          pendingExecutions: z.number().optional(),
          runningExecutions: z.number().optional(),

          // Distribution fields
          tasksByPriority: z
            .record(z.nativeEnum(CronTaskPriority), z.number())
            .optional(),
          tasksByStatus: z
            .record(z.nativeEnum(CronTaskStatus), z.number())
            .optional(),
          executionsByHour: z.record(z.string(), z.number()).optional(),
          executionsByDay: z.record(z.number(), z.number()).optional(),

          // Top tasks and problem tasks
          topPerformingTasks: z
            .array(
              z.object({
                taskName: z.string(),
                executions: z.number(),
                successRate: z.number(),
                avgDuration: z.number(),
              }),
            )
            .optional(),

          problemTasks: z
            .array(
              z.object({
                taskName: z.string(),
                failures: z.number(),
                executions: z.number(),
                lastError: z.string().optional(),
                failureRate: z.number(),
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
                    executions: z.number(),
                    successes: z.number(),
                    failures: z.number(),
                    successRate: z.number(),
                    avgDuration: z.number(),
                  }),
                )
                .optional(),
              byPriority: z
                .array(
                  z.object({
                    priority: z.string(),
                    taskCount: z.number(),
                    executions: z.number(),
                    successRate: z.number(),
                    avgDuration: z.number(),
                  }),
                )
                .optional(),
              byHealthStatus: z
                .array(
                  z.object({
                    healthStatus: z.string(),
                    taskCount: z.number(),
                    percentage: z.number(),
                  }),
                )
                .optional(),
              byExecutionTime: z
                .array(
                  z.object({
                    timeRange: z.string(),
                    count: z.number(),
                    percentage: z.number(),
                    avgDuration: z.number(),
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
                duration: z.number().optional(),
              }),
            )
            .optional(),

          dailyStats: z
            .array(
              z.object({
                date: z.string(),
                executions: z.number(),
                successes: z.number(),
                failures: z.number(),
                avgDuration: z.number(),
                uniqueTasks: z.number(),
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
                successfulExecutions: z.number(),
                totalExecutions: z.number(),
                successRate: z.number(),
                avgDuration: z.number(),
                isEnabled: z.boolean(),
              }),
            )
            .optional(),

          // Historical data for charts
          historicalData: z
            .record(
              z.string(),
              z.array(z.object({ date: z.string(), value: z.number() })),
            )
            .optional(),
        }),
      ),
    },
  ),

  tags: ["app.api.v1.core.system.tasks.cronSystem.stats.get.tag"],

  errorTypes: {
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "common.cronStatsGetServerError",
      description: "common.cronStatsGetServerError",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "common.cronStatsGetValidationFailed",
      description: "common.cronStatsGetValidationFailed",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "common.cronStatsGetUnauthorized",
      description: "common.cronStatsGetUnauthorized",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "common.cronStatsGetForbidden",
      description: "common.cronStatsGetForbidden",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "common.cronStatsGetNotFound",
      description: "common.cronStatsGetNotFound",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "common.cronStatsGetConflict",
      description: "common.cronStatsGetConflict",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "common.cronStatsGetNetworkError",
      description: "common.cronStatsGetNetworkError",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "common.cronStatsGetUnknownError",
      description: "common.cronStatsGetUnknownError",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "common.cronStatsGetUnsavedChanges",
      description: "common.cronStatsGetUnsavedChanges",
    },
  },

  successTypes: {
    title: "app.api.v1.core.system.tasks.cronSystem.stats.get.success.title",
    description:
      "app.api.v1.core.system.tasks.cronSystem.stats.get.success.description",
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
