/**
 * Error Logs API Definition
 * GET endpoint to browse backend error logs with filtering and pagination
 * PATCH endpoint to resolve/reopen an error log by fingerprint
 */

import { z } from "zod";

import { createEndpoint } from "../../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../../core/definition/enums";
import { WidgetDataSchema } from "../../../core/utils/json";
import { UserRole } from "../../../identity/roles/enum";
import { lazyWidget } from "../../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../../unified-ui/_shared/utils";
import {
  requestField,
  responseField,
  submitButton,
} from "../../../unified-ui/_shared/utils-i18n";
import { AnalyticsRange } from "../../../unified-ui/analytics/enum";
import { analyticsWindowFields } from "../../../unified-ui/analytics/fields";
import {
  analyticsWindowSchema,
  breakdownSchema,
  kpiSchema,
  timeSeriesSchema,
} from "../../../unified-ui/analytics/schema";
import { ERROR_LOGS_ALIAS } from "./constants";
import {
  ErrorLogLevelFilter,
  ErrorLogLevelFilterDB,
  ErrorLogLevelFilterOptions,
  ErrorLogSort,
  ErrorLogSortDB,
  ErrorLogSortOptions,
  ErrorLogSourceFilter,
  ErrorLogSourceFilterDB,
  ErrorLogSourceFilterOptions,
  ErrorLogStatusFilter,
  ErrorLogStatusFilterDB,
  ErrorLogStatusFilterOptions,
  ErrorLogTrendSplit,
  ErrorLogTrendSplitDB,
  ErrorLogTrendSplitOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const ErrorLogsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.ErrorLogsContainer,
  })),
);

const EXAMPLE_WINDOW = {
  from: "2026-11-19",
  to: "2026-11-19",
  previousFrom: "2026-11-18",
  previousTo: "2026-11-18",
  bucket: "day" as const,
};

const UpdateErrorLogContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UpdateErrorLogContainer })),
);

const logRowSchema = z.object({
  id: z.string(),
  message: z.string(),
  errorType: z.string().nullable(),
  stackTrace: z.string().nullable(),
  metadata: z.array(WidgetDataSchema).nullable(),
  fingerprint: z.string(),
  occurrences: z.number(),
  resolved: z.boolean(),
  level: z.string(),
  source: z.enum(["client", "server"]),
  endpoint: z.string().nullable(),
  firstSeen: z.string(),
  createdAt: z.string(),
  /** Occurrences inside the window (from the daily history) */
  windowOccurrences: z.number(),
  /** Per-bucket occurrences aligned with window buckets */
  spark: z.array(z.number()),
  /** Distinct users / leads hit inside the window */
  affectedUsers: z.number(),
  affectedLeads: z.number(),
  /** Other unresolved classes with the exact same message */
  similar: z.number(),
  /** Up to 10 of them, for drill-down */
  userIds: z.array(z.string()),
  leadIds: z.array(z.string()),
});

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "logger", "error-monitor", "logs"],
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
      ...analyticsWindowFields,
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
      level: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.level.label",
        description: "get.fields.level.description",
        options: ErrorLogLevelFilterOptions,
        schema: z.enum(ErrorLogLevelFilterDB).default(ErrorLogLevelFilter.ALL),
      }),
      source: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.source.label",
        description: "get.fields.source.description",
        options: ErrorLogSourceFilterOptions,
        schema: z
          .enum(ErrorLogSourceFilterDB)
          .default(ErrorLogSourceFilter.ALL),
      }),
      endpoint: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.endpoint.label",
        description: "get.fields.endpoint.description",
        placeholder: "get.fields.endpoint.placeholder",
        schema: z.string().optional(),
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
      fingerprint: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.fingerprint.label",
        description: "get.fields.fingerprint.description",
        placeholder: "get.fields.fingerprint.placeholder",
        schema: z.string().optional(),
      }),
      group: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.group.label",
        description: "get.fields.group.description",
        schema: z.boolean().optional().default(true),
      }),
      split: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.split.label",
        description: "get.fields.split.description",
        options: ErrorLogTrendSplitOptions,
        schema: z
          .enum(ErrorLogTrendSplitDB)
          .default(ErrorLogTrendSplit.NEW_VS_RECURRING),
      }),
      sort: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.sort.label",
        description: "get.fields.sort.description",
        options: ErrorLogSortOptions,
        schema: z.enum(ErrorLogSortDB).default(ErrorLogSort.WINDOW_OCCURRENCES),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.limit.label",
        description: "get.fields.limit.description",
        placeholder: "get.fields.limit.placeholder",
        schema: z.coerce.number().int().nonnegative().optional(),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.offset.label",
        description: "get.fields.offset.description",
        placeholder: "get.fields.offset.placeholder",
        schema: z.coerce.number().int().nonnegative().optional(),
      }),

      // === RESPONSE FIELDS ===
      window: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.window.title",
        schema: analyticsWindowSchema,
      }),
      kpis: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.kpis.title",
        schema: z.object({
          /** Unresolved error classes, all time, ignoring the filters */
          unresolved: z.number(),
          /** Their summed occurrences, all time */
          unresolvedOccurrences: z.number(),
          /** Unresolved classes not seen inside the period */
          unresolvedOutsideWindow: z.number(),
          /** Distinct messages among the unresolved classes */
          unresolvedMessages: z.number(),
          /** Unresolved classes matching the filters (any time) */
          unresolvedMatching: z.number(),
          /** Unresolved classes matching both filters and period */
          unresolvedInView: z.number().optional(),
          /** Filtered: occurrences in the window */
          occurrences: kpiSchema,
          /** Filtered: classes first seen in the window */
          newClasses: kpiSchema,
          /** Filtered: classes with at least one occurrence in the window */
          activeClasses: kpiSchema,
          affectedUsers: kpiSchema,
          affectedLeads: kpiSchema,
        }),
      }),
      trend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.trend.title",
        schema: timeSeriesSchema,
      }),
      byEndpoint: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.byEndpoint.title",
        schema: breakdownSchema,
      }),
      /** First day with recorded occurrence history (null = none yet) */
      historySince: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.historySince.title",
        schema: z.string().nullable(),
      }),
      logs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.logs.title",
        schema: z.array(logRowSchema),
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
      pageSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.fields.limit.label",
        schema: z.number(),
      }),
    },
  }),
  options: {
    formOptions: { autoSubmit: true, debounceMs: 0 },
  },

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
        range: AnalyticsRange.LAST_7_DAYS,
        search: "8b6fa4b2",
        status: ErrorLogStatusFilter.ALL,
        source: ErrorLogSourceFilter.SERVER,
        limit: 1,
        offset: 0,
      },
    },
    responses: {
      default: {
        window: EXAMPLE_WINDOW,
        kpis: {
          unresolved: 0,
          unresolvedOccurrences: 0,
          unresolvedOutsideWindow: 0,
          unresolvedMessages: 0,
          unresolvedMatching: 0,
          occurrences: { value: 0, previous: 0 },
          newClasses: { value: 0, previous: 0 },
          activeClasses: { value: 0, previous: 0 },
          affectedUsers: { value: 0, previous: 0 },
          affectedLeads: { value: 0, previous: 0 },
        },
        trend: {
          buckets: ["2026-11-19"],
          series: [{ key: "new", values: [0] }],
        },
        byEndpoint: [],
        historySince: null,
        logs: [],
        totalCount: 0,
        hasMore: false,
        unresolvedCount: 0,
        pageSize: 50,
      },
      filtered: {
        window: EXAMPLE_WINDOW,
        kpis: {
          unresolved: 4,
          unresolvedOccurrences: 37,
          unresolvedOutsideWindow: 1,
          unresolvedMessages: 3,
          unresolvedMatching: 1,
          occurrences: { value: 3, previous: 9 },
          newClasses: { value: 1, previous: 2 },
          activeClasses: { value: 1, previous: 3 },
          affectedUsers: { value: 1, previous: 2 },
          affectedLeads: { value: 2, previous: 2 },
        },
        trend: {
          buckets: ["2026-11-19"],
          series: [
            { key: "new", values: [3] },
            { key: "recurring", values: [0] },
          ],
        },
        byEndpoint: [
          {
            key: "vibe/tasks/cron/stats",
            metrics: { occurrences: 3, classes: 1, users: 1 },
          },
        ],
        historySince: "2026-11-01",
        logs: [
          {
            id: "8b6fa4b2-174a-438c-a664-478e9688c458",
            message: "Unable to read scheduled job settings",
            errorType: "INTERNAL_ERROR",
            stackTrace:
              "Error: Unable to read scheduled job settings\n    at loadJobSettings",
            metadata: [{ taskId: "audit-job-preview", environment: "test" }],
            fingerprint: "6f7c1b82d9e1",
            occurrences: 3,
            resolved: false,
            level: "error",
            source: "server",
            endpoint: "vibe/tasks/cron/stats",
            firstSeen: "2026-11-19T08:00:00.000Z",
            createdAt: "2026-11-19T08:12:00.000Z",
            windowOccurrences: 3,
            spark: [3],
            affectedUsers: 1,
            affectedLeads: 2,
            similar: 0,
            userIds: ["123e4567-e89b-12d3-a456-426614174000"],
            leadIds: [],
          },
        ],
        totalCount: 1,
        hasMore: false,
        unresolvedCount: 4,
        pageSize: 1,
      },
    },
  },
});

export const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["vibe", "logger", "error-monitor", "logs"],
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
    render: UpdateErrorLogContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      fingerprint: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.fingerprint.label",
        description: "patch.fields.fingerprint.description",
        placeholder: "patch.fields.fingerprint.placeholder",
        // Optional: callers (CLI, agents) often only hold the row id from the
        // list; one of fingerprint / id is required (checked in repository).
        schema: z.string().min(1).optional(),
      }),
      id: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.id.label",
        description: "patch.fields.id.description",
        placeholder: "patch.fields.id.placeholder",
        schema: z
          .string()
          .regex(/^[0-9a-f-]{8,36}$/i)
          .optional(),
      }),
      similarTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.similarTo.label",
        description: "patch.fields.similarTo.description",
        schema: z.string().min(1).optional(),
      }),
      fingerprints: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "patch.fields.fingerprints.label",
        description: "patch.fields.fingerprints.description",
        // CLI passes "a,b" as one string; split it into the array.
        schema: z
          .union([z.array(z.string()), z.string()])
          .transform((v) =>
            (typeof v === "string" ? v.split(",") : v)
              .map((f) => f.trim())
              .filter((f) => f.length > 0),
          )
          .pipe(z.array(z.string()).max(200))
          .optional(),
      }),
      resolved: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.fields.resolved.label",
        description: "patch.fields.resolved.description",
        schema: z.boolean(),
      }),
      submit: submitButton(scopedTranslation, {
        usage: { request: "data", response: true },
        inline: true,
        label: "widget.action.confirm",
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
      affectedFingerprints: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "patch.response.fingerprint.title",
        schema: z.array(z.string()).optional(),
      }),
    },
  }),
  options: {
    mutationOptions: {
      onSuccess: async ({ logger }) => {
        const { apiClient } = await import("../../../unified-ui/hooks/store");
        await apiClient.refetchEndpoint(GET, logger);
      },
    },
  },

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
      bulk: {
        fingerprints: ["abc123", "def456"],
        resolved: true,
      },
    },
    responses: {
      default: {
        responseFingerprint: "abc123",
        responseResolved: true,
        affectedRows: 5,
      },
      bulk: {
        responseFingerprint: "abc123,def456",
        responseResolved: true,
        affectedRows: 2,
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
