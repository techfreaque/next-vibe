/**
 * Task Health - Data Source Definition
 * One endpoint, many series: pick the metric per graph node (tasks started /
 * completed / failed / watchdog-cancelled, duration, credit spend, incidents).
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { GraphResolution } from "next-vibe/dataflow/enum";
import {
  lookbackRequestField,
  nodeMetaResponseField,
  rangeRequestField,
  resolutionRequestField,
  timeSeriesResponseField,
} from "next-vibe/dataflow/shared/fields";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { requestField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { TASK_HEALTH_DATA_SOURCE_ALIAS } from "../../constants";
import {
  TaskHealthMetric,
  TaskHealthMetricOptions,
  TaskIncidentTypeFilter,
  TaskIncidentTypeFilterOptions,
} from "../../enum";
import { scopedTranslation } from "../../i18n";

const TaskHealthSeriesWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TaskHealthSeriesWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "tasks", "watchdog", "data-sources", "task-health"],
  title: "dataSources.taskHealth.post.title",
  titleShort: "dataSources.taskHealth.post.titleShort",
  description: "dataSources.taskHealth.post.description",
  icon: "activity",
  category: "analytics",
  subCategory: "systemData",
  tags: ["tags.vibeSense" as const],
  aliases: [TASK_HEALTH_DATA_SOURCE_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: TaskHealthSeriesWidget,
    noFormElement: true,
    usage: { request: "data", response: true } as const,
    children: {
      resolution: resolutionRequestField(scopedTranslation, {
        label: "dataSources.fields.resolution.label",
        description: "dataSources.fields.resolution.description",
      }),
      range: rangeRequestField(scopedTranslation, {
        label: "dataSources.fields.range.label",
        description: "dataSources.fields.range.description",
      }),
      lookback: lookbackRequestField(scopedTranslation, {
        label: "dataSources.fields.lookback.label",
        description: "dataSources.fields.lookback.description",
      }),
      metric: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "dataSources.fields.metric.label",
        description: "dataSources.fields.metric.description",
        options: TaskHealthMetricOptions,
        schema: z.enum(TaskHealthMetric).default(TaskHealthMetric.STARTED),
        columns: 6,
      }),
      incidentType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "dataSources.fields.incidentType.label",
        description: "dataSources.fields.incidentType.description",
        options: TaskIncidentTypeFilterOptions,
        schema: z
          .enum(TaskIncidentTypeFilter)
          .default(TaskIncidentTypeFilter.ALL),
        columns: 6,
      }),
      result: timeSeriesResponseField(scopedTranslation, {
        label: "dataSources.taskHealth.post.fields.result.label",
        description: "dataSources.taskHealth.post.fields.result.description",
      }),
      meta: nodeMetaResponseField(scopedTranslation, {
        label: "dataSources.fields.meta.label",
        description: "dataSources.fields.meta.description",
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    requests: {
      default: {
        range: { from: new Date("2026-10-01"), to: new Date("2026-10-31") },
        metric: TaskHealthMetric.STARTED,
      },
      budgetIncidents: {
        range: { from: new Date("2026-10-01"), to: new Date("2026-10-31") },
        metric: TaskHealthMetric.INCIDENTS,
        incidentType: TaskIncidentTypeFilter.BUDGET,
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

export type TaskHealthSeriesRequestOutput = typeof POST.types.RequestOutput;

const definitions = { POST };
export default definitions;
