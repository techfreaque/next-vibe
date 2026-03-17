/**
 * Error Logs API Definition
 * GET endpoint to browse backend error logs with filtering and pagination
 * PATCH endpoint to resolve/reopen an error log by fingerprint
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
import { ERROR_LOGS_ALIAS } from "./constants";
import {
  ErrorLogStatusFilter,
  ErrorLogStatusFilterDB,
  ErrorLogStatusFilterOptions,
} from "./enum";
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
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.status.label",
        description: "get.fields.status.description",
        options: ErrorLogStatusFilterOptions,
        schema: z
          .enum(ErrorLogStatusFilterDB)
          .default(ErrorLogStatusFilter.ACTIVE),
      }),
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.search.label",
        description: "get.fields.search.description",
        placeholder: "get.fields.search.placeholder",
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
            message: z.string(),
            errorType: z.string().nullable(),
            stackTrace: z.string().nullable(),
            metadata: z.array(z.any()).nullable(),
            fingerprint: z.string(),
            occurrences: z.number(),
            resolved: z.boolean(),
            level: z.string(),
            firstSeen: z.string(),
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
        status: ErrorLogStatusFilter.ACTIVE,
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

export const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["system", "unified-interface", "tasks", "error-monitor", "logs"],
  aliases: ["update-error-log"],
  title: "patch.title",
  description: "patch.description",
  category: "app.endpointCategories.systemTasks",
  icon: "alert-triangle",
  tags: ["patch.tags.monitoring" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ErrorLogsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      fingerprint: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.fingerprint.label",
        description: "patch.fields.fingerprint.description",
        placeholder: "patch.fields.fingerprint.placeholder",
        schema: z.string(),
      }),
      resolved: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.fields.resolved.label",
        description: "patch.fields.resolved.description",
        schema: z.boolean(),
      }),

      // === RESPONSE FIELDS ===
      responseFingerprint: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.fingerprint.title",
        schema: z.string(),
      }),
      responseResolved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.resolved.title",
        schema: z.boolean(),
      }),
      affectedRows: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.affectedRows.title",
        schema: z.number(),
      }),
    },
  }),

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.titleChanges",
      description: "patch.errors.unsavedChanges.titleChanges",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
  },

  examples: {
    requests: {
      resolve: {
        fingerprint: "abc123",
        resolved: true,
      },
    },
    responses: {
      default: {
        responseFingerprint: "abc123",
        responseResolved: true,
        affectedRows: 5,
      },
    },
  },
});

export type ErrorLogsRequestInput = typeof GET.types.RequestInput;
export type ErrorLogsRequestOutput = typeof GET.types.RequestOutput;
export type ErrorLogsResponseInput = typeof GET.types.ResponseInput;
export type ErrorLogsResponseOutput = typeof GET.types.ResponseOutput;

export type ErrorLogsPatchRequestInput = typeof PATCH.types.RequestInput;
export type ErrorLogsPatchRequestOutput = typeof PATCH.types.RequestOutput;
export type ErrorLogsPatchResponseInput = typeof PATCH.types.ResponseInput;
export type ErrorLogsPatchResponseOutput = typeof PATCH.types.ResponseOutput;

const endpoints = { GET, PATCH };
export default endpoints;
