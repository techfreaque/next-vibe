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
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

// Stats period enum
const statsPeriodSchema = z.enum(["hour", "day", "week", "month"]);

// Stats type enum
const statsTypeSchema = z.enum(["overview", "performance", "errors", "trends"]);

/**
 * GET endpoint definition - Get cron statistics
 * Retrieves cron task statistics and metrics
 */
const cronStatsGetEndpoint = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "tasks", "cron", "stats"],
  title: "app.api.v1.core.system.tasks.cron.stats.get.title",
  description: "app.api.v1.core.system.tasks.cron.stats.get.description",
  category: "app.api.v1.core.system.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  aliases: ["cron:stats", "tasks:cron:stats"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.tasks.cron.stats.get.form.title",
      description:
        "app.api.v1.core.system.tasks.cron.stats.get.form.description",
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
            "app.api.v1.core.system.tasks.cron.stats.get.fields.period.title",
          description:
            "app.api.v1.core.system.tasks.cron.stats.get.fields.period.description",
          options: [
            {
              value: "hour",
              label: "app.api.v1.core.system.tasks.cron.stats.get.period.hour",
            },
            {
              value: "day",
              label: "app.api.v1.core.system.tasks.cron.stats.get.period.day",
            },
            {
              value: "week",
              label: "app.api.v1.core.system.tasks.cron.stats.get.period.week",
            },
            {
              value: "month",
              label: "app.api.v1.core.system.tasks.cron.stats.get.period.month",
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
            "app.api.v1.core.system.tasks.cron.stats.get.fields.type.title",
          description:
            "app.api.v1.core.system.tasks.cron.stats.get.fields.type.description",
          options: [
            {
              value: "overview",
              label:
                "app.api.v1.core.system.tasks.cron.stats.get.type.overview",
            },
            {
              value: "performance",
              label:
                "app.api.v1.core.system.tasks.cron.stats.get.type.performance",
            },
            {
              value: "errors",
              label: "app.api.v1.core.system.tasks.cron.stats.get.type.errors",
            },
            {
              value: "trends",
              label: "app.api.v1.core.system.tasks.cron.stats.get.type.trends",
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
            "app.api.v1.core.system.tasks.cron.stats.get.fields.taskId.title",
          description:
            "app.api.v1.core.system.tasks.cron.stats.get.fields.taskId.description",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cron.stats.get.fields.limit.title",
          description:
            "app.api.v1.core.system.tasks.cron.stats.get.fields.limit.description",
          layout: { columns: 3 },
        },
        z.number().optional().default(100),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.stats.get.response.success.title",
        },
        z.boolean(),
      ),

      data: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.stats.get.response.data.title",
        },
        z.object({
          totalTasks: z.number(),
          executedTasks: z.number(),
          successfulTasks: z.number(),
          failedTasks: z.number(),
          averageExecutionTime: z.number(),
        }),
      ),
    },
  ),

  tags: ["app.api.v1.core.system.tasks.cron.stats.get.tag"],

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
    title: "app.api.v1.core.system.tasks.cron.stats.get.success.title",
    description:
      "app.api.v1.core.system.tasks.cron.stats.get.success.description",
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

export { cronStatsGetEndpoint as GET };

const statsEndpoints = { GET: cronStatsGetEndpoint };
export default statsEndpoints;

// Type exports for repository usage
export interface CronStatsGetRequestInput {
  period?: "hour" | "day" | "week" | "month";
  type?: string;
  taskId?: string;
  limit?: string;
  startDate?: string;
  endDate?: string;
}
export type CronStatsGetRequestOutput = CronStatsGetRequestInput;

export interface CronStatsGetResponseInput {
  success: boolean;
  data: {
    period: string;
    stats: Array<{
      timestamp: string;
      executions: number;
      successes: number;
      failures: number;
      averageDuration: number;
    }>;
    summary: {
      totalExecutions: number;
      successRate: number;
      averageDuration: number;
    };
  };
}
export type CronStatsGetResponseOutput = CronStatsGetResponseInput;
