/**
 * Cron Task History API Definition
 * Defines endpoints for task execution history following MIGRATION_GUIDE.md patterns
 */

import { z } from "zod";

import {
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

import { EndpointErrorTypes } from "../../../../../../../../../../to_migrate/to_delete/endpoint-types-old";
import { CronTaskPriority, CronTaskStatus } from "../../enum";

/**
 * GET endpoint definition - Get task execution history
 * Retrieves task execution history with filtering and pagination
 */
export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "tasks", "cron", "history"],
  title: "tasks.runner.title",
  description: "tasks.runner.description",
  category: "tasks.category.system",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  tags: ["tasks.type.cron"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.tasks.cron.history.get.request.title",
      description:
        "app.api.v1.core.system.tasks.cron.history.get.request.description",
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
            "app.api.v1.core.system.tasks.cron.history.get.fields.taskId.label",
          description:
            "app.api.v1.core.system.tasks.cron.history.get.fields.taskId.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.history.get.fields.taskId.placeholder",
        },
        z.string().optional(),
      ),
      taskName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cron.history.get.fields.taskName.label",
          description:
            "app.api.v1.core.system.tasks.cron.history.get.fields.taskName.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.history.get.fields.taskName.placeholder",
        },
        z.string().optional(),
      ),
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cron.history.get.fields.status.label",
          description:
            "app.api.v1.core.system.tasks.cron.history.get.fields.status.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.history.get.fields.status.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),
      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cron.history.get.fields.priority.label",
          description:
            "app.api.v1.core.system.tasks.cron.history.get.fields.priority.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.history.get.fields.priority.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),
      startDate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label:
            "app.api.v1.core.system.tasks.cron.history.get.fields.startDate.label",
          description:
            "app.api.v1.core.system.tasks.cron.history.get.fields.startDate.description",
        },
        z.string().optional(),
      ),
      endDate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label:
            "app.api.v1.core.system.tasks.cron.history.get.fields.endDate.label",
          description:
            "app.api.v1.core.system.tasks.cron.history.get.fields.endDate.description",
        },
        z.string().optional(),
      ),
      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cron.history.get.fields.limit.label",
          description:
            "app.api.v1.core.system.tasks.cron.history.get.fields.limit.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.history.get.fields.limit.placeholder",
        },
        z.string().optional(),
      ),
      offset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cron.history.get.fields.offset.label",
          description:
            "app.api.v1.core.system.tasks.cron.history.get.fields.offset.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.history.get.fields.offset.placeholder",
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      executions: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.history.get.response.executions.title",
        },
        z.array(
          z.object({
            id: z.string(),
            taskId: z.string(),
            taskName: z.string(),
            status: z.nativeEnum(CronTaskStatus),
            priority: z.nativeEnum(CronTaskPriority),
            startedAt: z.string(),
            completedAt: z.string().nullable(),
            durationMs: z.number().nullable(),
            error: z
              .object({
                message: z.string(),
                messageParams: z.record(z.unknown()).optional(),
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
            "app.api.v1.core.system.tasks.cron.history.get.response.totalCount.title",
        },
        z.number(),
      ),
      hasMore: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.history.get.response.hasMore.title",
        },
        z.boolean(),
      ),
      summary: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.history.get.response.summary.title",
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
    title: "app.api.v1.core.system.tasks.cron.history.get.success.title",
    description:
      "app.api.v1.core.system.tasks.cron.history.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "common.cronHistoryGetValidationFailed",
      description: "common.cronHistoryGetValidationFailed",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "common.cronHistoryGetNetworkError",
      description: "common.cronHistoryGetNetworkError",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "common.cronHistoryGetUnauthorized",
      description: "common.cronHistoryGetUnauthorized",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "common.cronHistoryGetForbidden",
      description: "common.cronHistoryGetForbidden",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "common.cronHistoryGetNotFound",
      description: "common.cronHistoryGetNotFound",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "common.cronHistoryGetServerError",
      description: "common.cronHistoryGetServerError",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "common.cronHistoryGetUnknownError",
      description: "common.cronHistoryGetUnknownError",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "common.cronHistoryGetUnsavedChanges",
      description: "common.cronHistoryGetUnsavedChanges",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "common.cronHistoryGetConflict",
      description: "common.cronHistoryGetConflict",
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
