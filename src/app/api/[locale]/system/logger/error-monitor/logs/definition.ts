/**
 * Error Logs API Definition
 * GET endpoint to browse backend error logs with filtering and pagination
 * PATCH endpoint to resolve/reopen an error log by fingerprint
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { WidgetDataSchema } from "next-vibe/core/utils/json";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/logger/error-monitor/logs/i18n";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { ERROR_LOGS_ALIAS } from "./constants";
import {
  ErrorLogStatusFilter,
  ErrorLogStatusFilterDB,
  ErrorLogStatusFilterOptions,
} from "./enum";

const ErrorLogsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.ErrorLogsContainer,
  })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "logger", "error-monitor", "logs"],
  aliases: [ERROR_LOGS_ALIAS],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "devTools",
  subCategory: "tasksMonitoring",
  icon: "alert-triangle",
  tags: ["get.tags.monitoring" as const],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],

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
        label: "get.response.logs.title",
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
        label: "get.response.totalCount.title",
        schema: z.coerce.number(),
      }),
      hasMore: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.hasMore.title",
        schema: z.boolean(),
      }),
      unresolvedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.unresolvedCount.title",
        schema: z.coerce.number(),
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
        unresolvedCount: 0,
      },
    },
  },
});

export const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["system", "logger", "error-monitor", "logs"],
  aliases: ["update-error-log"],
  title: "patch.title",
  titleShort: "patch.titleShort",
  description: "patch.description",
  category: "devTools",
  subCategory: "tasksMonitoring",
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
        label: "patch.response.fingerprint.title",
        schema: z.string(),
      }),
      responseResolved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "patch.response.resolved.title",
        schema: z.boolean(),
      }),
      affectedRows: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "patch.response.affectedRows.title",
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

export type ErrorLogsRequestOutput = typeof GET.types.RequestOutput;
export type ErrorLogsResponseOutput = typeof GET.types.ResponseOutput;

export type ErrorLogsPatchRequestOutput = typeof PATCH.types.RequestOutput;
export type ErrorLogsPatchResponseOutput = typeof PATCH.types.ResponseOutput;

const endpoints = { GET, PATCH };
export default endpoints;
