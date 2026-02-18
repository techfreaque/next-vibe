/**
 * Cron Task History API Definition
 * Defines endpoints for task execution history following MIGRATION_GUIDE.md patterns
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CronTaskPriorityDB, CronTaskStatusDB } from "../../enum";
import { CronHistoryContainer } from "./widget";

/**
 * GET endpoint definition - Get task execution history
 * Retrieves task execution history with filtering and pagination
 */
export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "cron", "history"],
  title: "app.api.system.unifiedInterface.tasks.cronSystem.history.get.title",
  description:
    "app.api.system.unifiedInterface.tasks.cronSystem.history.get.description",
  icon: "clock",
  category: "app.api.system.unifiedInterface.tasks.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.system.unifiedInterface.tasks.type.cron"],

  fields: customWidgetObject({
    render: CronHistoryContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),

      // === REQUEST FIELDS ===
      taskId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskId.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskId.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskId.placeholder",
        schema: z.string().optional(),
      }),
      taskName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskName.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskName.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.taskName.placeholder",
        schema: z.string().optional(),
      }),
      status: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.status.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.status.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.status.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),
      priority: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.priority.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.priority.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.priority.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),
      startDate: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.startDate.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.startDate.description",
        schema: z.string().optional(),
      }),
      endDate: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.endDate.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.endDate.description",
        schema: z.string().optional(),
      }),
      limit: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.limit.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.limit.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.limit.placeholder",
        schema: z.coerce.number().optional(),
      }),
      offset: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.offset.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.offset.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.fields.offset.placeholder",
        schema: z.coerce.number().optional(),
      }),

      // === RESPONSE FIELDS ===
      executions: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.response.executions.title",
        schema: z.array(
          z.object({
            id: z.string(),
            taskId: z.string(),
            taskName: z.string(),
            status: z.enum(CronTaskStatusDB),
            priority: z.enum(CronTaskPriorityDB),
            startedAt: z.string(),
            completedAt: z.string().nullable(),
            durationMs: z.coerce.number().nullable(),
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
      }),
      totalCount: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.response.totalCount.title",
        schema: z.coerce.number(),
      }),
      hasMore: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.response.hasMore.title",
        schema: z.boolean(),
      }),
      summary: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.history.get.response.summary.title",
        schema: z.object({
          totalExecutions: z.coerce.number(),
          successfulExecutions: z.coerce.number(),
          failedExecutions: z.coerce.number(),
          averageDuration: z.coerce.number().nullable(),
          successRate: z.coerce.number(),
        }),
      }),
    },
  }),
  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.cronSystem.history.get.success.title",
    description:
      "app.api.system.unifiedInterface.tasks.cronSystem.history.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.server.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.unsavedChanges.titleChanges",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.unsavedChanges.titleChanges",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.history.get.errors.conflict.description",
    },
  },
  examples: {
    requests: {
      default: {},
      filtered: {
        taskId: "123",
        startDate: "2021-01-01",
        endDate: "2021-01-31",
        limit: 10,
        offset: 0,
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
