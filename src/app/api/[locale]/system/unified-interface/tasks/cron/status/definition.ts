/**
 * Cron Status API Definition
 * Status monitoring for cron task system
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CronStatusContainer } from "./widget";

/**
 * GET endpoint definition - Get cron status
 * Retrieves current status of cron system and tasks
 */
const { GET: cronStatusGetEndpoint } = createEndpoint({
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "cron", "status"],
  title: "app.api.system.unifiedInterface.tasks.cronSystem.status.title",
  description:
    "app.api.system.unifiedInterface.tasks.cronSystem.status.description",
  icon: "clock",
  category: "app.api.system.unifiedInterface.tasks.taskCategory.system",
  allowedRoles: [UserRole.ADMIN],
  aliases: ["cron:status", "tasks:cron:status"],
  tags: ["app.api.system.unifiedInterface.tasks.type.cron"],
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.server.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.unsavedChanges.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.cronSystem.status.success.title",
    description:
      "app.api.system.unifiedInterface.tasks.cronSystem.status.description",
  },

  fields: customWidgetObject({
    render: CronStatusContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),

      // === REQUEST FIELDS ===
      taskId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.status.common.taskName",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.status.common.taskNamesDescription",
        columns: 6,
        schema: z.string().optional(),
      }),

      detailed: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.status.common.detailed",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.status.common.detailedDescription",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.status.success.content",
        schema: z.boolean(),
      }),

      systemStatus: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.unifiedInterface.tasks.pulse.health.healthy",
        schema: z.enum(["healthy", "warning", "critical", "unknown"]),
      }),

      activeTasks: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.status.common.active",
        schema: z.coerce.number(),
      }),

      totalTasks: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.status.common.total",
        schema: z.coerce.number(),
      }),

      uptime: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.status.common.uptime",
        schema: z.string(),
      }),

      tasks: responseArrayField(
        {
          type: WidgetType.CONTAINER,
        },
        responseField({
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.tasks.cronSystem.status.common.taskName",
          schema: z.object({
            id: z.string(),
            name: z.string(),
            status: z.string(),
            lastRun: z.string().nullable(),
            nextRun: z.string().nullable(),
            schedule: z.string(),
          }),
        }),
      ),
    },
  }),

  examples: {
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

export const GET = cronStatusGetEndpoint;

const endpoints = { GET };
export default endpoints;

// Export types for repository using proper Output types from endpoint
export type CronStatusRequestInput = typeof GET.types.RequestInput;
export type CronStatusRequestOutput = typeof GET.types.RequestOutput;
export type CronStatusResponseInput = typeof GET.types.ResponseInput;
export type CronStatusResponseOutput = typeof GET.types.ResponseOutput;
