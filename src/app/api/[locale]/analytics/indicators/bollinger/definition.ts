/**
 * Vibe Sense - Bollinger Bands Endpoint Definition
 *
 * Client+server safe. No server imports.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  lookbackRequestField,
  nodeMetaResponseField,
  rangeRequestField,
  resolutionRequestField,
  timeSeriesRequestField,
  timeSeriesResponseField,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { BOLLINGER_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [BOLLINGER_ALIAS],
  method: Methods.POST,
  path: [
    "system",
    "unified-interface",
    "vibe-sense",
    "indicators",
    "bollinger",
  ],
  title: "post.title",
  description: "post.description",
  icon: "activity",
  category: "app.endpointCategories.analyticsIndicators",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      source: timeSeriesRequestField(scopedTranslation, {
        label: "post.fields.source.label",
        description: "post.fields.source.description",
      }),
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
      period: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.period.label",
        description: "post.fields.period.description",
        schema: z.number().int().min(2).max(200),
        columns: 6,
      }),
      stdDev: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.stdDev.label",
        description: "post.fields.stdDev.description",
        schema: z.number().min(0.1).max(5),
        columns: 6,
      }),
      upper: timeSeriesResponseField(scopedTranslation, {
        label: "post.fields.upper.label",
        description: "post.fields.upper.description",
      }),
      middle: timeSeriesResponseField(scopedTranslation, {
        label: "post.fields.middle.label",
        description: "post.fields.middle.description",
      }),
      lower: timeSeriesResponseField(scopedTranslation, {
        label: "post.fields.lower.label",
        description: "post.fields.lower.description",
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
        source: [
          { timestamp: new Date("2024-01-01"), value: 100 },
          { timestamp: new Date("2024-01-02"), value: 102 },
          { timestamp: new Date("2024-01-03"), value: 101 },
          { timestamp: new Date("2024-01-04"), value: 103 },
          { timestamp: new Date("2024-01-05"), value: 105 },
        ],
        range: {
          from: new Date("2024-01-01"),
          to: new Date("2024-01-05"),
        },
        period: 3,
        stdDev: 2,
      },
    },
    responses: {
      default: {
        upper: [
          { timestamp: new Date("2024-01-03"), value: 103.63 },
          { timestamp: new Date("2024-01-04"), value: 104.97 },
          { timestamp: new Date("2024-01-05"), value: 106.63 },
        ],
        middle: [
          { timestamp: new Date("2024-01-03"), value: 101 },
          { timestamp: new Date("2024-01-04"), value: 102 },
          { timestamp: new Date("2024-01-05"), value: 103 },
        ],
        lower: [
          { timestamp: new Date("2024-01-03"), value: 98.37 },
          { timestamp: new Date("2024-01-04"), value: 99.03 },
          { timestamp: new Date("2024-01-05"), value: 99.37 },
        ],
        meta: { actualResolution: "enums.resolution.1d", lookbackUsed: 0 },
      },
    },
  },
});

const definitions = { POST };
export default definitions;
