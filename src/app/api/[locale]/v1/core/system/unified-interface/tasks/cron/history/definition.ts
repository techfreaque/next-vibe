/**
 * Cron Task History API Definition
 * Defines endpoints for task execution history following MIGRATION_GUIDE.md patterns
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { CronTaskPriorityDB, CronTaskStatusDB } from "../../enum";

/**
 * GET endpoint definition - Get task execution history
 * Retrieves task execution history with filtering and pagination
 */
export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "tasks", "cron", "history"],
  title:
    "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.title",
  description:
    "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.description",
  category: "app.api.v1.core.system.unifiedInterface.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  tags: ["app.api.v1.core.system.unifiedInterface.tasks.type.cron"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.request.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.request.description",
      layout: { type: LayoutType.GRID, columns: 6 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      taskId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskId.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskId.description",
          placeholder:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskId.placeholder",
        },
        z.string().optional(),
      ),
      taskName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskName.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskName.description",
          placeholder:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskName.placeholder",
        },
        z.string().optional(),
      ),
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.status.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.status.description",
          placeholder:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.status.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),
      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.priority.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.priority.description",
          placeholder:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.priority.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),
      startDate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.startDate.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.startDate.description",
        },
        z.string().optional(),
      ),
      endDate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.endDate.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.endDate.description",
        },
        z.string().optional(),
      ),
      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.limit.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.limit.description",
          placeholder:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.limit.placeholder",
        },
        z.string().optional(),
      ),
      offset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.offset.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.offset.description",
          placeholder:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.fields.offset.placeholder",
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      executions: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.response.executions.title",
        },
        z.array(
          z.object({
            id: z.string(),
            taskId: z.string(),
            taskName: z.string(),
            status: z.enum(CronTaskStatusDB),
            priority: z.enum(CronTaskPriorityDB),
            startedAt: z.string(),
            completedAt: z.string().nullable(),
            durationMs: z.number().nullable(),
            error: z
              .object({
                message: z.string(),
                messageParams: z.record(z.string(), z.unknown()).optional(),
                errorType: z.string(),
              })
              .nullable(),
            environment: z.string().nullable(),
            createdAt: z.string(),
          }),
        ),
      ),
      totalCount: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.response.totalCount.title",
        },
        z.number(),
      ),
      hasMore: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.response.hasMore.title",
        },
        z.boolean(),
      ),
      summary: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.response.summary.title",
        },
        z.object({
          totalExecutions: z.number(),
          successfulExecutions: z.number(),
          failedExecutions: z.number(),
          averageDuration: z.number().nullable(),
          successRate: z.number(),
        }),
      ),
    },
  ),
  successTypes: {
    title:
      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.success.title",
    description:
      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.server.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.unsavedChanges.titleChanges",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.unsavedChanges.titleChanges",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.conflict.description",
    },
  },
  examples: {
    requests: {
      default: {},
      filtered: {
        taskId: "123",
        startDate: "2021-01-01",
        endDate: "2021-01-31",
        limit: "10",
        offset: "0",
      },
    },
    responses: {
      default: {
        executions: [],
        totalCount: 0,
        hasMore: false,
        summary: {
          totalExecutions: 0,
          successfulExecutions: 0,
          failedExecutions: 0,
          averageDuration: null,
          successRate: 0,
        },
      },
      filtered: {
        executions: [],
        totalCount: 0,
        hasMore: false,
        summary: {
          totalExecutions: 0,
          successfulExecutions: 0,
          failedExecutions: 0,
          averageDuration: null,
          successRate: 0,
        },
      },
    },
  },
});

// Export types
export type CronHistoryRequestInput = typeof GET.types.RequestInput;
export type CronHistoryRequestOutput = typeof GET.types.RequestOutput;
export type CronHistoryResponseInput = typeof GET.types.ResponseInput;
export type CronHistoryResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
