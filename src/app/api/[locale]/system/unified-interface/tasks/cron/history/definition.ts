/**
 * Cron Task History API Definition
 * Defines endpoints for task execution history following MIGRATION_GUIDE.md patterns
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { errorResponseSchema } from "@/app/api/[locale]/shared/types/response.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CronTaskPriorityDB, CronTaskStatusDB } from "../../enum";
import { scopedTranslation } from "./i18n";
import { CronHistoryContainer } from "./widget";

export const CRON_HISTORY_ALIAS = "cron-history" as const;

/**
 * GET endpoint definition - Get task execution history
 * Retrieves task execution history with filtering and pagination
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "cron", "history"],
  aliases: [CRON_HISTORY_ALIAS],
  title: "get.title",
  description: "get.description",
  icon: "clock",
  category: "app.endpointCategories.system",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["get.tags.tasks" as const],

  fields: customWidgetObject({
    render: CronHistoryContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),

      // === REQUEST FIELDS ===
      taskId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.taskId.label",
        description: "get.fields.taskId.description",
        placeholder: "get.fields.taskId.placeholder",
        schema: z.string().optional(),
      }),
      taskName: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.taskName.label",
        description: "get.fields.taskName.description",
        placeholder: "get.fields.taskName.placeholder",
        schema: z.string().optional(),
      }),
      status: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.status.label",
        description: "get.fields.status.description",
        placeholder: "get.fields.status.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),
      priority: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.priority.label",
        description: "get.fields.priority.description",
        placeholder: "get.fields.priority.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),
      startDate: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.fields.startDate.label",
        description: "get.fields.startDate.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),
      endDate: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.fields.endDate.label",
        description: "get.fields.endDate.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),
      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.limit.label",
        description: "get.fields.limit.description",
        placeholder: "get.fields.limit.placeholder",
        schema: z.coerce.number().optional(),
      }),
      offset: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.offset.label",
        description: "get.fields.offset.description",
        placeholder: "get.fields.offset.placeholder",
        schema: z.coerce.number().optional(),
      }),

      // === RESPONSE FIELDS ===
      executions: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.executions.title",
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
            error: errorResponseSchema.nullable(),
            result: z.record(z.string(), z.unknown()).nullable(),
            environment: z.string().nullable(),
            createdAt: z.string(),
          }),
        ),
      }),
      totalCount: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalCount.title",
        schema: z.coerce.number(),
      }),
      hasMore: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.hasMore.title",
        schema: z.boolean(),
      }),
      summary: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.summary.title",
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
    title: "get.success.title",
    description: "get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.titleChanges",
      description: "get.errors.unsavedChanges.titleChanges",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
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
