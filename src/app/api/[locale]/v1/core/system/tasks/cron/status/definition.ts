/**
 * Cron Status API Definition
 * Status monitoring for cron task system
 */

import { z } from "zod";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import { UserRoleValue } from "../../../../user/user-roles/enum";

/**
 * GET endpoint definition - Get cron status
 * Retrieves current status of cron system and tasks
 */
const cronStatusGetEndpoint = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "tasks", "cron", "status"],
  title: "tasks.runner.title",
  description: "tasks.runner.description",
  category: "tasks.category.system",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  aliases: ["cron:status", "tasks:cron:status"],
  tags: ["tasks.type.cron"],
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "common.cronStatusGetValidationFailed",
      description: "common.cronStatusGetValidationFailed",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "common.cronStatusGetNetworkError",
      description: "common.cronStatusGetNetworkError",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "common.cronStatusGetUnauthorized",
      description: "common.cronStatusGetUnauthorized",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "common.cronStatusGetForbidden",
      description: "common.cronStatusGetForbidden",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "common.cronStatusGetNotFound",
      description: "common.cronStatusGetNotFound",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "common.cronStatusGetServerError",
      description: "common.cronStatusGetServerError",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "common.cronStatusGetUnknownError",
      description: "common.cronStatusGetUnknownError",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "common.cronStatusGetUnsavedChanges",
      description: "common.cronStatusGetUnsavedChanges",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "common.cronStatusGetConflict",
      description: "common.cronStatusGetConflict",
    },
  },
  successTypes: {
    title: "common.success",
    description: "tasks.runner.description",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "tasks.runner.title",
      description: "tasks.runner.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      taskId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "common.taskName",
          description: "common.taskNamesDescription",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      detailed: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "common.detailed",
          description: "common.detailedDescription",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "common.success",
        },
        z.boolean(),
      ),

      systemStatus: responseField(
        {
          type: WidgetType.TEXT,
          content: "tasks.pulse.health.healthy",
        },
        z.enum(["healthy", "warning", "critical", "unknown"]),
      ),

      activeTasks: responseField(
        {
          type: WidgetType.TEXT,
          content: "common.active",
        },
        z.number(),
      ),

      totalTasks: responseField(
        {
          type: WidgetType.TEXT,
          content: "common.total",
        },
        z.number(),
      ),

      uptime: responseField(
        {
          type: WidgetType.TEXT,
          content: "common.uptime",
        },
        z.string(),
      ),

      tasks: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            { key: "id", label: "common.id", type: FieldDataType.TEXT },
            { key: "name", label: "common.taskName", type: FieldDataType.TEXT },
            { key: "status", label: "common.status", type: FieldDataType.TEXT },
            {
              key: "lastRun",
              label: "common.lastRun",
              type: FieldDataType.TEXT,
            },
            {
              key: "nextRun",
              label: "common.nextRun",
              type: FieldDataType.TEXT,
            },
            {
              key: "schedule",
              label: "common.schedule",
              type: FieldDataType.TEXT,
            },
          ],
        },
        responseField(
          { type: WidgetType.TEXT, content: "common.taskName" },
          z.object({
            id: z.string(),
            name: z.string(),
            status: z.string(),
            lastRun: z.string().nullable(),
            nextRun: z.string().nullable(),
            schedule: z.string(),
          }),
        ),
      ),
    },
  ),

  examples: {
    urlPathVariables: undefined,
    requests: {
      basic: {
        detailed: false,
      },
      detailed: {
        detailed: true,
      },
      specific: {
        taskId: "task-12345",
        detailed: true,
      },
      success: {
        detailed: false,
      },
    },
    responses: {
      basic: {
        success: true,
        systemStatus: "healthy" as const,
        activeTasks: 3,
        totalTasks: 15,
        uptime: "2d 14h 30m",
        tasks: [
          {
            id: "task-1",
            name: "email-campaign",
            status: "RUNNING",
            lastRun: "2023-07-21T11:30:00Z",
            nextRun: "2023-07-21T12:30:00Z",
            schedule: "0 */30 * * *",
          },
        ],
      },
      detailed: {
        success: true,
        systemStatus: "healthy" as const,
        activeTasks: 3,
        totalTasks: 15,
        uptime: "2d 14h 30m",
        tasks: [
          {
            id: "task-1",
            name: "email-campaign",
            status: "RUNNING",
            lastRun: "2023-07-21T11:30:00Z",
            nextRun: "2023-07-21T12:30:00Z",
            schedule: "0 */30 * * *",
          },
        ],
      },
      specific: {
        success: true,
        systemStatus: "healthy" as const,
        activeTasks: 1,
        totalTasks: 1,
        uptime: "2d 14h 30m",
        tasks: [
          {
            id: "task-12345",
            name: "specific-task",
            status: "RUNNING",
            lastRun: "2023-07-21T11:30:00Z",
            nextRun: "2023-07-21T12:30:00Z",
            schedule: "0 */30 * * *",
          },
        ],
      },
      success: {
        success: true,
        systemStatus: "healthy" as const,
        activeTasks: 3,
        totalTasks: 15,
        uptime: "2d 14h 30m",
        tasks: [
          {
            id: "task-1",
            name: "email-campaign",
            status: "RUNNING",
            lastRun: "2023-07-21T11:30:00Z",
            nextRun: "2023-07-21T12:30:00Z",
            schedule: "0 */30 * * *",
          },
        ],
      },
    },
  },
});

export { cronStatusGetEndpoint as GET };
export { cronStatusGetEndpoint };

const endpoints = { GET: cronStatusGetEndpoint };
export default endpoints;

// Export types for repository
export interface CronStatusRequestInput {
  taskId?: string;
  detailed?: boolean;
}
export type CronStatusRequestOutput = CronStatusRequestInput;
export interface CronStatusResponseInput {
  success: boolean;
  systemStatus: "healthy" | "warning" | "critical" | "unknown";
  activeTasks: number;
  totalTasks: number;
  uptime: string;
  tasks?: Array<{
    id: string;
    name: string;
    status: string;
    lastRun: string | null;
    nextRun: string | null;
    schedule: string;
  }>;
}
export type CronStatusResponseOutput = CronStatusResponseInput;
