/**
 * Error Logs Series - Endpoint Definition
 * One endpoint, several series: pick the metric and level per graph node
 * (occurrences, distinct error classes, new classes, open backlog).
 * Client+server safe. No server imports.
 */

import { z } from "zod";

import { createEndpoint } from "../../../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../../../core/definition/enums";
import { GraphResolution } from "../../../../dataflow/enum";
import {
  lookbackRequestField,
  nodeMetaResponseField,
  rangeRequestField,
  resolutionRequestField,
  timeSeriesResponseField,
} from "../../../../dataflow/shared/fields";
import { UserRole } from "../../../../identity/roles/enum";
import { lazyWidget } from "../../../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../../../unified-ui/_shared/utils";
import { requestField } from "../../../../unified-ui/_shared/utils-i18n";
import { ERROR_LOGS_SERIES_ALIAS } from "./constants";
import {
  ErrorLogsLevelFilter,
  ErrorLogsLevelFilterOptions,
  ErrorLogsMetric,
  ErrorLogsMetricOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const ErrorLogsSeriesWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ErrorLogsSeriesWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [ERROR_LOGS_SERIES_ALIAS],
  method: Methods.POST,
  path: [
    "vibe",
    "logger",
    "error-monitor",
    "data-sources",
    "error-logs-series",
  ],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "activity",
  category: "analytics",
  subCategory: "systemData",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ErrorLogsSeriesWidget,
    noFormElement: true,
    usage: { request: "data", response: true } as const,
    children: {
      resolution: resolutionRequestField(scopedTranslation, {
        label: "post.fields.resolution.label",
        description: "post.fields.resolution.description",
      }),
      range: rangeRequestField(scopedTranslation, {
        label: "post.fields.range.label",
        description: "post.fields.range.description",
      }),
      lookback: lookbackRequestField(scopedTranslation, {
        label: "post.fields.lookback.label",
        description: "post.fields.lookback.description",
      }),
      metric: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.metric.label",
        description: "post.fields.metric.description",
        options: ErrorLogsMetricOptions,
        schema: z.enum(ErrorLogsMetric).default(ErrorLogsMetric.OCCURRENCES),
        columns: 6,
      }),
      level: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.level.label",
        description: "post.fields.level.description",
        options: ErrorLogsLevelFilterOptions,
        schema: z.enum(ErrorLogsLevelFilter).default(ErrorLogsLevelFilter.ALL),
        columns: 6,
      }),
      result: timeSeriesResponseField(scopedTranslation, {
        label: "post.fields.result.label",
        description: "post.fields.result.description",
      }),
      meta: nodeMetaResponseField(scopedTranslation, {
        label: "post.fields.meta.label",
        description: "post.fields.meta.description",
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  examples: {
    requests: {
      default: {
        range: { from: new Date("2026-11-22"), to: new Date("2026-11-30") },
        metric: ErrorLogsMetric.OCCURRENCES,
        level: ErrorLogsLevelFilter.ERROR,
      },
      openWarnings: {
        range: { from: new Date("2026-11-22"), to: new Date("2026-11-30") },
        metric: ErrorLogsMetric.OPEN_BACKLOG,
        level: ErrorLogsLevelFilter.WARN,
      },
    },
    responses: {
      default: {
        result: [],
        meta: { actualResolution: GraphResolution.ONE_DAY, lookbackUsed: 0 },
      },
    },
  },
});

const definitions = { POST };
export default definitions;
