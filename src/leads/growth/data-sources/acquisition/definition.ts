/**
 * Lead Acquisition - Data Source Definition
 * Acquisition activity per time bucket, filterable by observed source.
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
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

import { AcquisitionMetric, AcquisitionMetricOptions } from "../../acquisition";
import {
  acquisitionCurrencyField,
  acquisitionFilterFields,
} from "../../acquisition-fields";
import { scopedTranslation } from "../../i18n";
import { GROWTH_ACQUISITION_ALIAS } from "./constants";

const AcquisitionSeriesWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AcquisitionSeriesWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "growth", "data-sources", "acquisition"],
  title: "acquisition.title",
  titleShort: "acquisition.title",
  description: "acquisition.description",
  icon: "activity",
  category: "analytics",
  subCategory: "leadsData",
  tags: ["tags.vibeSense" as const],
  aliases: [GROWTH_ACQUISITION_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: AcquisitionSeriesWidget,
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
        label: "acquisition.fields.metric",
        options: AcquisitionMetricOptions,
        schema: z.enum(AcquisitionMetric).default(AcquisitionMetric.VISITS),
      }),
      ...acquisitionFilterFields,
      excludeBots: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "acquisition.fields.excludeBots",
        description: "acquisition.fields.excludeBotsDescription",
        schema: z.boolean().default(false),
      }),
      currency: acquisitionCurrencyField,
      result: timeSeriesResponseField(scopedTranslation, {
        label: "acquisition.series",
        description: "acquisition.description",
      }),
      meta: nodeMetaResponseField(scopedTranslation, {
        label: "dataSources.fields.meta.label",
        description: "dataSources.fields.meta.description",
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
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
        metric: AcquisitionMetric.SIGNUPS,
      },
      byChannel: {
        range: { from: new Date("2026-10-01"), to: new Date("2026-10-31") },
        metric: AcquisitionMetric.PAYERS,
        source: "reddit",
      },
    },
    responses: {
      default: {
        result: [],
        meta: { actualResolution: "enums.resolution.1d", lookbackUsed: 0 },
      },
      byChannel: {
        result: [],
        meta: { actualResolution: "enums.resolution.1d", lookbackUsed: 0 },
      },
    },
  },
});

export type AcquisitionSeriesRequestOutput = typeof POST.types.RequestOutput;

const definitions = { POST };
export default definitions;
