/**
 * Error Logs API Definition
 * GET endpoint to browse backend error logs with filtering and pagination
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { ErrorLogLevelDB, ErrorLogSourceDB } from "../db";
import { ERROR_LOGS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";
import { ErrorLogsContainer } from "./widget";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "error-monitor", "logs"],
  aliases: [ERROR_LOGS_ALIAS],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.systemTasks",
  icon: "alert-triangle",
  tags: ["get.tags.monitoring" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ErrorLogsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      source: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.source.label",
        description: "get.fields.source.description",
        placeholder: "get.fields.source.placeholder",
        schema: z.enum(ErrorLogSourceDB).optional(),
      }),
      level: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.level.label",
        description: "get.fields.level.description",
        placeholder: "get.fields.level.placeholder",
        schema: z.enum(ErrorLogLevelDB).optional(),
      }),
      endpoint: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.endpoint.label",
        description: "get.fields.endpoint.description",
        placeholder: "get.fields.endpoint.placeholder",
        schema: z.string().optional(),
      }),
      errorType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.errorType.label",
        description: "get.fields.errorType.description",
        placeholder: "get.fields.errorType.placeholder",
        schema: z.string().optional(),
      }),
      startDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.fields.startDate.label",
        description: "get.fields.startDate.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),
      endDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.fields.endDate.label",
        description: "get.fields.endDate.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.limit.label",
        description: "get.fields.limit.description",
        placeholder: "get.fields.limit.placeholder",
        schema: z.coerce.number().optional(),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.offset.label",
        description: "get.fields.offset.description",
        placeholder: "get.fields.offset.placeholder",
        schema: z.coerce.number().optional(),
      }),

      // === RESPONSE FIELDS ===
      logs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.logs.title",
        schema: z.array(
          z.object({
            id: z.string(),
            source: z.enum(ErrorLogSourceDB),
            level: z.enum(ErrorLogLevelDB),
            message: z.string(),
            endpoint: z.string().nullable(),
            errorType: z.string().nullable(),
            errorCode: z.string().nullable(),
            stackTrace: z.string().nullable(),
            metadata: z.record(z.string(), z.any()).nullable(),
            createdAt: z.string(),
          }),
        ),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalCount.title",
        schema: z.coerce.number(),
      }),
      hasMore: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.hasMore.title",
        schema: z.boolean(),
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
        source: "backend",
        level: "error",
        limit: 50,
        offset: 0,
      },
    },
    responses: {
      default: {
        logs: [],
        totalCount: 0,
        hasMore: false,
      },
    },
  },
});

export type ErrorLogsRequestInput = typeof GET.types.RequestInput;
export type ErrorLogsRequestOutput = typeof GET.types.RequestOutput;
export type ErrorLogsResponseInput = typeof GET.types.ResponseInput;
export type ErrorLogsResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
